(() => {
  const topbar = document.querySelector('.topbar');
  const row = topbar?.querySelector(':scope > div');
  if (!topbar || !row) return;

  topbar.querySelectorAll('.mobile-global-links').forEach((node) => node.remove());

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isMcp4shPage = [
    'mcp4sh.html',
    'mcp4sh-research.html',
    'mcp4sh-architecture.html'
  ].includes(currentFile);

  // Shared navigation styles are injected here so every existing page gains the
  // MCP4SH submenu without needing per-page markup or another stylesheet edit.
  if (!document.getElementById('tyto-site-nav-submenu-styles')) {
    const style = document.createElement('style');
    style.id = 'tyto-site-nav-submenu-styles';
    style.textContent = `
      .site-global-nav { overflow: visible; }

      .site-nav-group {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: .08rem;
      }

      .site-nav-group > .site-nav-parent {
        display: inline-flex;
        align-items: center;
      }

      .site-nav-group.is-active > .site-nav-parent,
      .site-nav-group.is-active > .site-nav-toggle {
        color: #f0e3bc;
      }

      .site-nav-toggle {
        display: inline-grid;
        place-items: center;
        width: 22px;
        height: 28px;
        margin: 0 0 0 -.1rem;
        padding: 0;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #777b80;
        cursor: pointer;
        transition: color 160ms ease, background 160ms ease;
      }

      .site-nav-toggle:hover,
      .site-nav-toggle:focus-visible {
        color: #fff;
        background: rgba(255,255,255,.035);
        outline: none;
      }

      .site-nav-toggle svg {
        width: 12px;
        height: 12px;
        transition: transform 180ms ease;
      }

      .site-nav-group.is-open > .site-nav-toggle svg,
      .site-nav-group:hover > .site-nav-toggle svg,
      .site-nav-group:focus-within > .site-nav-toggle svg {
        transform: rotate(180deg);
      }

      .site-nav-submenu {
        position: absolute;
        z-index: 100;
        top: calc(100% + 12px);
        left: 50%;
        width: max-content;
        min-width: 212px;
        padding: .45rem;
        border: 1px solid rgba(225,230,236,.15);
        border-radius: 15px;
        background: rgba(0,0,0,.88);
        backdrop-filter: blur(9px) saturate(50%);
        -webkit-backdrop-filter: blur(9px) saturate(50%);
        box-shadow:
          0 22px 58px rgba(0,0,0,.58),
          inset 0 1px 0 rgba(255,255,255,.018);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translate(-50%, -5px);
        transition:
          opacity 150ms ease,
          transform 150ms ease,
          visibility 150ms ease;
      }

      /* Invisible bridge prevents the menu closing while the pointer crosses
         the small visual gap between the top-level nav and dropdown. */
      .site-nav-submenu::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: -13px;
        height: 13px;
      }

      .site-nav-group:hover > .site-nav-submenu,
      .site-nav-group:focus-within > .site-nav-submenu,
      .site-nav-group.is-open > .site-nav-submenu {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translate(-50%, 0);
      }

      .site-nav-submenu a {
        display: flex;
        align-items: center;
        min-height: 40px;
        padding: .58rem .72rem;
        border-radius: 10px;
        color: #bfc4ca !important;
        font-size: .82rem;
        font-weight: 650;
        text-decoration: none;
      }

      .site-nav-submenu a:hover,
      .site-nav-submenu a:focus-visible {
        color: #fff !important;
        background: rgba(255,255,255,.045);
        outline: none;
      }

      .site-nav-submenu a[aria-current="page"] {
        color: #f0e3bc !important;
        background: rgba(122,105,64,.12);
      }

      .site-nav-submenu-kicker {
        display: block;
        padding: .34rem .72rem .28rem;
        color: #6f7377;
        font-size: .64rem;
        font-weight: 700;
        letter-spacing: .13em;
        text-transform: uppercase;
      }

      /* Mobile: keep the MCP4SH children visible inside the existing hamburger
         instead of hiding them behind a second tiny accordion. */
      .mobile-site-menu-panel {
        width: min(260px, calc(100vw - 1.25rem));
        max-height: calc(100dvh - 76px);
        overflow-y: auto;
        overscroll-behavior: contain;
      }

      .mobile-menu-group {
        margin: .18rem 0;
        padding: .12rem 0 .2rem;
        border-radius: 12px;
      }

      .mobile-menu-group.is-active {
        background: rgba(122,105,64,.065);
      }

      .mobile-menu-group > .mobile-menu-parent {
        position: relative;
        color: #bfc4ca;
      }

      .mobile-menu-group.is-active > .mobile-menu-parent {
        color: #f0e3bc;
      }

      .mobile-menu-sub {
        display: grid;
        gap: .08rem;
        margin: 0 .45rem .25rem .72rem;
        padding-left: .55rem;
        border-left: 1px solid rgba(212,194,143,.20);
      }

      .mobile-site-menu-panel .mobile-menu-sub a {
        min-height: 38px;
        padding: .5rem .65rem;
        color: #92979c;
        font-size: .78rem;
        font-weight: 600;
      }

      .mobile-site-menu-panel .mobile-menu-sub a[aria-current="page"] {
        color: #f0e3bc;
        background: rgba(122,105,64,.11);
      }

      @media (max-width: 767px) {
        .site-nav-group { display: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .site-nav-submenu,
        .site-nav-toggle svg { transition: none; }
      }
    `;
    document.head.appendChild(style);
  }

  const plainLinks = [
    ['Home', 'index.html', currentFile === '' || currentFile === 'index.html'],
    ['MCP4H', 'mcp4h.html', currentFile === 'mcp4h.html'],
    ['OCPF', 'ocpf.html', currentFile === 'ocpf.html'],
    ['Reviews', 'reviews.html', currentFile === 'reviews.html'],
    ['Lab Notes', 'labnotes.html', currentFile === 'labnotes.html']
  ];

  const mcpSubLinks = [
    ['Architecture', 'mcp4sh-architecture.html', currentFile === 'mcp4sh-architecture.html'],
    ['Research & engineering', 'mcp4sh-research.html', currentFile === 'mcp4sh-research.html']
  ];

  const desktop = row.querySelector('.site-global-nav');
  if (desktop) {
    const desktopItems = [
      `<a href="index.html"${currentFile === '' || currentFile === 'index.html' ? ' aria-current="page"' : ''}>Home</a>`,
      `<a href="mcp4h.html"${currentFile === 'mcp4h.html' ? ' aria-current="page"' : ''}>MCP4H</a>`,
      `
        <div class="site-nav-group${isMcp4shPage ? ' is-active' : ''}">
          <a class="site-nav-parent" href="mcp4sh.html"${currentFile === 'mcp4sh.html' ? ' aria-current="page"' : ''}>MCP4SH</a>
          <button class="site-nav-toggle" type="button" aria-label="Open MCP4SH submenu" aria-expanded="false">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="site-nav-submenu" aria-label="MCP4SH pages">
            <span class="site-nav-submenu-kicker">MCP4SH</span>
            ${mcpSubLinks.map(([label, href, active]) =>
              `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`
            ).join('')}
          </div>
        </div>
      `,
      `<a href="ocpf.html"${currentFile === 'ocpf.html' ? ' aria-current="page"' : ''}>OCPF</a>`,
      `<a href="reviews.html"${currentFile === 'reviews.html' ? ' aria-current="page"' : ''}>Reviews</a>`,
      `<a href="labnotes.html"${currentFile === 'labnotes.html' ? ' aria-current="page"' : ''}>Lab Notes</a>`
    ];

    desktop.innerHTML = desktopItems.join('');

    const group = desktop.querySelector('.site-nav-group');
    const toggle = group?.querySelector('.site-nav-toggle');

    const setOpen = (open) => {
      if (!group || !toggle) return;
      group.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!group.classList.contains('is-open'));
    });

    group?.addEventListener('mouseleave', () => {
      if (!group.matches(':focus-within')) setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (group && !group.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle?.focus();
      }
    });
  }

  if (row.querySelector('.mobile-site-menu')) return;

  const menu = document.createElement('details');
  menu.className = 'mobile-site-menu';

  const mobileLink = ([label, href, active]) =>
    `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;

  menu.innerHTML = `
    <summary aria-label="Open site navigation" title="Menu">
      <span class="mobile-site-menu-icon" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="sr-only">Menu</span>
    </summary>
    <nav class="mobile-site-menu-panel" aria-label="Site navigation">
      ${mobileLink(plainLinks[0])}
      ${mobileLink(plainLinks[1])}
      <div class="mobile-menu-group${isMcp4shPage ? ' is-active' : ''}">
        <a class="mobile-menu-parent" href="mcp4sh.html"${currentFile === 'mcp4sh.html' ? ' aria-current="page"' : ''}>MCP4SH</a>
        <div class="mobile-menu-sub" aria-label="MCP4SH pages">
          ${mcpSubLinks.map(mobileLink).join('')}
        </div>
      </div>
      ${mobileLink(plainLinks[2])}
      ${mobileLink(plainLinks[3])}
      ${mobileLink(plainLinks[4])}
    </nav>`;

  const cta = Array.from(row.children).find(
    (child) => child.tagName === 'A' && child.classList.contains('btn')
  );

  if (cta) row.insertBefore(menu, cta);
  else row.appendChild(menu);

  menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => menu.removeAttribute('open'))
  );

  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.removeAttribute('open');
  });
})();
