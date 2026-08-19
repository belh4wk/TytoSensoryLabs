(() => {
  'use strict';

  const IMAGE_EXTENSIONS = /\.(?:png|jpe?g|webp|avif)$/i;
  const CACHE_PREFIX = 'tyto-showcase-v3:';
  const CACHE_MS = 5 * 60 * 1000;

  // A normal <script> file works from file:// as well as GitHub Pages.
  // JSON fetch does not reliably work from file://, which is why local previews
  // could fall back to stale built-in filenames and show a blank canvas.
  const loaderScript = document.currentScript;
  const manifestScriptUrl = loaderScript?.src
    ? new URL('showcase-manifest.js', loaderScript.src).href
    : 'Resources/showcase-manifest.js';
  let manifestScriptPromise = null;

  function ensureManifestRegistry() {
    if (window.TYTO_SHOWCASE_MANIFESTS) return Promise.resolve(window.TYTO_SHOWCASE_MANIFESTS);
    if (manifestScriptPromise) return manifestScriptPromise;
    manifestScriptPromise = new Promise(resolve => {
      const script = document.createElement('script');
      script.src = manifestScriptUrl;
      script.async = true;
      script.onload = () => resolve(window.TYTO_SHOWCASE_MANIFESTS || null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
    return manifestScriptPromise;
  }

  // Zero-network/local-preview fallback for the screenshots that ship with the site.
  // Live pages still query the GitHub folder first, so newly committed images appear automatically.
  const BUILT_IN_FALLBACKS = Object.freeze({
    OCPF: {
      files: [
        'OCPF-Showcase-Dark.png',
        'OCPF-Showcase-Light.png',
        'OCPF-Showcase-Radial.png',
        'OCPF-Showcase-WatermarkCards.png',
        'OCPF-Showcase-WatermarkMenu.png'
      ],
      items: {
        'OCPF-Showcase-Dark.png': { order: 10, label: 'Dark mode', tag: 'Dark mode', caption: 'The desktop workflow in dark mode. Local path information in this site image is redacted.', note: 'Dark-mode desktop workflow overview.' },
        'OCPF-Showcase-Light.png': { order: 20, label: 'Light mode', tag: 'Light mode', caption: 'The same desktop workflow in light mode. Local path information in this site image is redacted.', note: 'Light-mode desktop workflow overview.' },
        'OCPF-Showcase-Radial.png': { order: 30, label: 'Edit wheel', tag: 'Edit wheel', caption: 'The main editing radial over the preview image.', note: 'Main editing wheel.' },
        'OCPF-Showcase-WatermarkCards.png': { order: 40, label: 'Assets', tag: 'Watermark assets', caption: 'The paired dark and light watermark asset cards in the Imagine frame.', note: 'Dark and light watermark assets.' },
        'OCPF-Showcase-WatermarkMenu.png': { order: 50, label: 'WM wheel', tag: 'Watermark wheel', caption: 'The watermark submenu, with direct controls over placement and presentation.', note: 'Watermark submenu.' }
      }
    },
    MCP4SH: {
      files: [
        'Screenshot01.png', 'Screenshot02.png', 'Screenshot03.png', 'Screenshot04.png',
        'Screenshot05.png', 'Screenshot06.png', 'Screenshot07.png'
      ],
      items: {
        'Screenshot01.png': { order: 10, label: 'Setup Assistant', tag: 'Setup Assistant', caption: 'A look at the Setup Assistant and its rig-oriented onboarding flow.' },
        'Screenshot02.png': { order: 20, label: 'Rig mapping', tag: 'Rig mapping', caption: 'Mapped hardware and controls presented against the rig overview.' },
        'Screenshot03.png': { order: 30, label: 'Tyre detail', tag: 'Tyre detail', caption: 'A closer view of per-position setup and effect controls.' },
        'Screenshot04.png': { order: 40, label: 'FOV Advisor', tag: 'FOV Advisor', caption: 'The integrated FOV Advisor alongside the side-view rig visual.' },
        'Screenshot05.png': { order: 50, label: 'SimHub setup', tag: 'SimHub setup', caption: 'Supporting SimHub configuration used around the MCP4SH workflow.' },
        'Screenshot06.png': { order: 60, label: 'Shaker mapping', tag: 'Shaker mapping', caption: 'Shaker placement and selection in the Setup Assistant.' },
        'Screenshot07.png': { order: 70, label: 'Device mapping', tag: 'Device mapping', caption: 'Device and channel mapping with contextual guidance.' }
      }
    }
  });

  function titleCase(value) {
    return value.replace(/\b\w/g, c => c.toUpperCase());
  }

  function prettifyFilename(filename) {
    let value = filename.replace(/\.[^.]+$/, '');
    value = value
      .replace(/^\d+[\s._-]*/, '')
      .replace(/^OCPF[\s._-]*Showcase[\s._-]*/i, '')
      .replace(/^Screenshot[\s._-]*/i, 'Screenshot ')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return titleCase(value || 'Showcase');
  }

  function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'showcase';
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async function load(folder) {
    const basePath = `Resources/Showcases/${folder}`;
    const builtIn = BUILT_IN_FALLBACKS[folder] || { files: [], items: {} };
    let config = {
      files: Array.isArray(builtIn.files) ? builtIn.files.slice() : [],
      items: builtIn.items && typeof builtIn.items === 'object' ? { ...builtIn.items } : {}
    };

    // First use the generated JS registry. Unlike fetch(showcase.json), this works
    // when the user opens the page directly from disk with file://.
    const registry = await ensureManifestRegistry();
    const registered = registry && registry[folder];
    if (registered && typeof registered === 'object') {
      config = {
        files: Array.isArray(registered.files) && registered.files.length ? registered.files.slice() : config.files,
        items: { ...config.items, ...(registered.items && typeof registered.items === 'object' ? registered.items : {}) }
      };
    }

    // When served over HTTP(S), the per-folder JSON can still override the JS
    // registry immediately. This is mostly useful during deployment/cache churn.
    try {
      const bust = `${basePath}/showcase.json?v=${Date.now()}`;
      const fetched = await fetchJson(bust);
      if (fetched && typeof fetched === 'object') {
        config = {
          files: Array.isArray(fetched.files) && fetched.files.length ? fetched.files.slice() : config.files,
          items: { ...config.items, ...(fetched.items && typeof fetched.items === 'object' ? fetched.items : {}) }
        };
      }
    } catch {
      // Expected for file:// and harmless offline; the JS registry already covers it.
    }

    const files = Array.isArray(config.files) ? config.files : [];
    const meta = config && typeof config.items === 'object' && config.items ? config.items : {};
    const normalized = files
      .map(entry => typeof entry === 'string' ? { name: entry, sha: '' } : entry)
      .filter(entry => entry && typeof entry.name === 'string' && IMAGE_EXTENSIONS.test(entry.name));
    const seen = new Set();
    const unique = normalized.filter(entry => {
      if (seen.has(entry.name)) return false;
      seen.add(entry.name);
      return true;
    });

    return unique
      .map((entry, index) => {
        const filename = entry.name;
        const item = meta[filename] || {};
        const label = item.label || prettifyFilename(filename);
        const version = entry.sha ? `?v=${encodeURIComponent(String(entry.sha).slice(0, 12))}` : '';
        return {
          id: item.id || slugify(filename.replace(/\.[^.]+$/, '')),
          filename,
          media: `${basePath}/${encodeURIComponent(filename).replace(/%2F/g, '/')}${version}`,
          label,
          tag: item.tag || label,
          caption: item.caption || `${label} showcase image.`,
          note: item.note || item.caption || label,
          order: Number.isFinite(item.order) ? item.order : 1000 + index
        };
      })
      .sort((a, b) => a.order - b.order || a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }));
  }

  function polar(cx, cy, radius, degrees) {
    const angle = (degrees - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  function sectorPath(cx, cy, inner, outer, start, end) {
    const p1 = polar(cx, cy, outer, start);
    const p2 = polar(cx, cy, outer, end);
    const p3 = polar(cx, cy, inner, end);
    const p4 = polar(cx, cy, inner, start);
    const large = end - start > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${outer} ${outer} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${inner} ${inner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
  }

  function splitLabel(label) {
    const words = String(label || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= 1) return words.length ? words : ['View'];
    if (words.length === 2) return words;
    const cut = Math.ceil(words.length / 2);
    return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
  }

  async function mountRadialViewer(root, options = {}) {
    if (!root) return null;
    const folder = options.folder || root.dataset.showcaseFolder;
    if (!folder) throw new Error('Showcase folder is required.');

    const image = root.querySelector('[data-showcase-image]');
    const canvas = root.querySelector('[data-showcase-canvas]');
    const radial = root.querySelector('[data-showcase-radial]');
    const tag = root.querySelector('[data-showcase-tag]');
    const caption = root.querySelector('[data-showcase-caption]');
    const menuButton = root.querySelector('[data-showcase-menu]');
    const fitButton = root.querySelector('[data-showcase-fit]');
    const zoomInButton = root.querySelector('[data-showcase-zoom-in]');
    const zoomOutButton = root.querySelector('[data-showcase-zoom-out]');
    if (!image || !canvas || !radial) throw new Error('Showcase viewer is missing required elements.');

    const items = await load(folder);
    let active = Math.min(Math.max(options.initialIndex || 0, 0), Math.max(0, items.length - 1));
    let menuOpen = false;
    let holdTimer = null;
    const transform = { scale: 1, x: 0, y: 0 };
    const fitBox = { width: 0, height: 0 };
    const drag = { active: false, startX: 0, startY: 0, originX: 0, originY: 0 };
    let maxScale = 1;

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

    function computeFit() {
      if (!image.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      const usableW = Math.max(1, rect.width - 30);
      const usableH = Math.max(1, rect.height - 30);
      const fit = Math.min(1, usableW / image.naturalWidth, usableH / image.naturalHeight);
      fitBox.width = image.naturalWidth * fit;
      fitBox.height = image.naturalHeight * fit;
      maxScale = Math.max(1, 1 / fit);
      image.style.width = `${fitBox.width}px`;
      image.style.height = `${fitBox.height}px`;
      clampPan();
      applyTransform();
    }

    function clampPan() {
      const rect = canvas.getBoundingClientRect();
      const maxX = Math.max(0, (fitBox.width * transform.scale - rect.width) / 2);
      const maxY = Math.max(0, (fitBox.height * transform.scale - rect.height) / 2);
      transform.x = clamp(transform.x, -maxX, maxX);
      transform.y = clamp(transform.y, -maxY, maxY);
    }

    function applyTransform() {
      image.style.transform = `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale})`;
      canvas.classList.toggle('is-draggable', transform.scale > 1.02 && !drag.active);
      canvas.classList.toggle('is-dragging', drag.active);
      if (zoomOutButton) zoomOutButton.disabled = transform.scale <= 1.01;
      if (zoomInButton) zoomInButton.disabled = transform.scale >= maxScale - .01;
      if (fitButton) fitButton.disabled = transform.scale <= 1.01 && Math.abs(transform.x) < .5 && Math.abs(transform.y) < .5;
    }

    function resetView() {
      transform.scale = 1;
      transform.x = 0;
      transform.y = 0;
      applyTransform();
    }

    function zoom(multiplier, clientX, clientY) {
      const previous = transform.scale;
      const next = clamp(previous * multiplier, 1, maxScale);
      if (next === previous) return;
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        const rect = canvas.getBoundingClientRect();
        const offsetX = clientX - rect.left - rect.width / 2 - transform.x;
        const offsetY = clientY - rect.top - rect.height / 2 - transform.y;
        const ratio = next / previous;
        transform.x -= offsetX * (ratio - 1);
        transform.y -= offsetY * (ratio - 1);
      }
      transform.scale = next;
      clampPan();
      applyTransform();
    }

    function setItem(index) {
      if (!items.length) return;
      active = clamp(index, 0, items.length - 1);
      const item = items[active];
      if (tag) tag.textContent = item.tag || item.label;
      if (caption) caption.textContent = item.caption || item.label;
      radial.querySelectorAll('.tyto-showcase-sector').forEach((node, i) => node.classList.toggle('is-active', i === active));
      image.classList.remove('is-loaded');
      image.onload = () => {
        image.classList.add('is-loaded');
        computeFit();
        resetView();
      };
      image.src = item.media;
      image.alt = `${item.label} screenshot`;
    }

    function buildRadial() {
      radial.innerHTML = '';
      const size = 270;
      const cx = size / 2;
      const cy = size / 2;
      const outer = 124;
      const inner = 50;
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

      items.forEach((item, index) => {
        const sweep = 360 / items.length;
        const gap = Math.min(1.6, sweep * .04);
        const start = index * sweep + gap;
        const end = (index + 1) * sweep - gap;
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', sectorPath(cx, cy, inner, outer, start, end));
        path.setAttribute('class', 'tyto-showcase-sector');
        path.addEventListener('click', event => {
          event.stopPropagation();
          setItem(index);
          closeMenu();
        });
        svg.appendChild(path);

        const mid = (start + end) / 2;
        const pos = polar(cx, cy, 86, mid);
        const text = document.createElementNS(ns, 'text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y);
        text.setAttribute('class', 'tyto-showcase-label');
        if (items.length >= 8) text.style.fontSize = '7.5px';
        const lines = splitLabel(item.label);
        lines.forEach((line, lineIndex) => {
          const span = document.createElementNS(ns, 'tspan');
          span.setAttribute('x', pos.x);
          span.setAttribute('dy', lineIndex === 0 ? (lines.length > 1 ? '-0.45em' : '0') : '1.05em');
          span.textContent = line;
          text.appendChild(span);
        });
        svg.appendChild(text);
      });

      const centre = document.createElementNS(ns, 'circle');
      centre.setAttribute('cx', cx);
      centre.setAttribute('cy', cy);
      centre.setAttribute('r', '43');
      centre.setAttribute('class', 'tyto-showcase-centre');
      centre.addEventListener('click', event => { event.stopPropagation(); closeMenu(); });
      svg.appendChild(centre);
      const centreText = document.createElementNS(ns, 'text');
      centreText.setAttribute('x', cx);
      centreText.setAttribute('y', cy);
      centreText.setAttribute('class', 'tyto-showcase-centre-text');
      centreText.textContent = 'CLOSE';
      svg.appendChild(centreText);
      radial.appendChild(svg);
    }

    function openMenu(clientX, clientY) {
      if (!items.length) return;
      const rect = canvas.getBoundingClientRect();
      const radius = (radial.offsetWidth || 270) / 2;
      const x = clamp(clientX - rect.left, radius + 6, rect.width - radius - 6);
      const y = clamp(clientY - rect.top, radius + 6, rect.height - radius - 6);
      radial.style.left = `${x}px`;
      radial.style.top = `${y}px`;
      radial.classList.add('is-open');
      radial.setAttribute('aria-hidden', 'false');
      menuOpen = true;
    }

    function openDefault() {
      const rect = canvas.getBoundingClientRect();
      openMenu(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    function closeMenu() {
      radial.classList.remove('is-open');
      radial.setAttribute('aria-hidden', 'true');
      menuOpen = false;
    }

    canvas.addEventListener('contextmenu', event => {
      event.preventDefault();
      openMenu(event.clientX, event.clientY);
    });
    canvas.addEventListener('pointerdown', event => {
      clearTimeout(holdTimer);

      // Radial interaction must win over the zoom/pan canvas. Without this guard,
      // a click on CLOSE while zoomed could also begin a canvas drag and swallow
      // the radial click.
      const targetElement = event.target instanceof Element ? event.target : null;
      if (targetElement?.closest('.tyto-showcase-radial')) return;

      // A press outside an open radial closes it cleanly. Do not also begin a pan
      // on the same pointer press; the next press can manipulate the image.
      if (menuOpen) {
        closeMenu();
        return;
      }

      const isTouchLike = event.pointerType === 'touch' || event.pointerType === 'pen';
      if (isTouchLike) {
        const x = event.clientX;
        const y = event.clientY;
        const pointerId = event.pointerId;
        holdTimer = setTimeout(() => {
          if (drag.active) {
            drag.active = false;
            canvas.releasePointerCapture?.(pointerId);
            applyTransform();
          }
          openMenu(x, y);
        }, 420);

        // At fit scale there is nothing to pan, so wait for the hold/menu gesture.
        if (transform.scale <= 1.01) return;
      }

      if (event.button !== 0 || transform.scale <= 1.01) return;
      drag.active = true;
      drag.startX = event.clientX;
      drag.startY = event.clientY;
      drag.originX = transform.x;
      drag.originY = transform.y;
      canvas.setPointerCapture?.(event.pointerId);
      applyTransform();
    });
    canvas.addEventListener('pointermove', event => {
      clearTimeout(holdTimer);
      if (!drag.active) return;
      transform.x = drag.originX + (event.clientX - drag.startX);
      transform.y = drag.originY + (event.clientY - drag.startY);
      clampPan();
      applyTransform();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(name => canvas.addEventListener(name, event => {
      clearTimeout(holdTimer);
      if (!drag.active) return;
      drag.active = false;
      canvas.releasePointerCapture?.(event.pointerId);
      applyTransform();
    }));
    canvas.addEventListener('wheel', event => {
      event.preventDefault();
      zoom(event.deltaY < 0 ? 1.12 : .89, event.clientX, event.clientY);
    }, { passive: false });
    canvas.addEventListener('dblclick', resetView);
    menuButton?.addEventListener('click', openDefault);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuOpen) closeMenu();
    });
    fitButton?.addEventListener('click', resetView);
    zoomInButton?.addEventListener('click', () => zoom(1.18));
    zoomOutButton?.addEventListener('click', () => zoom(.85));
    window.addEventListener('resize', computeFit, { passive: true });

    buildRadial();
    if (items.length) setItem(active);
    else {
      if (tag) tag.textContent = 'No screenshots';
      if (caption) caption.textContent = 'Add images to this showcase folder and commit them to publish them here.';
    }

    return { items, setItem, openMenu: openDefault, closeMenu };
  }

  window.TytoShowcase = Object.freeze({ load, prettifyFilename, mountRadialViewer });
})();
