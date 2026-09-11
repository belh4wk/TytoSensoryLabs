(() => {
  const topbar = document.querySelector('.topbar');
  const row = topbar?.querySelector(':scope > div');
  if (!topbar || !row) return;

  topbar.querySelectorAll('.mobile-global-links').forEach((node) => node.remove());

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const links = [
    ['Home', 'index.html', currentFile === '' || currentFile === 'index.html'],
    ['MCP4H', 'mcp4h.html', currentFile === 'mcp4h.html'],
    ['MCP4SH', 'mcp4sh.html', currentFile === 'mcp4sh.html'],
    ['OCPF', 'ocpf.html', currentFile === 'ocpf.html'],
    ['Reviews', 'reviews.html', currentFile === 'reviews.html'],
    ['Lab Notes', 'labnotes.html', currentFile === 'labnotes.html']
  ];

  const desktop = row.querySelector('.site-global-nav');
  if (desktop) {
    desktop.innerHTML = links.map(([label, href, active]) => `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  }

  if (row.querySelector('.mobile-site-menu')) return;
  const menu = document.createElement('details');
  menu.className = 'mobile-site-menu';
  menu.innerHTML = `
    <summary aria-label="Open site navigation" title="Menu">
      <span class="mobile-site-menu-icon" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="sr-only">Menu</span>
    </summary>
    <nav class="mobile-site-menu-panel" aria-label="Site navigation">
      ${links.map(([label, href, active]) => `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>`;
  const cta = Array.from(row.children).find((child) => child.tagName === 'A' && child.classList.contains('btn'));
  if (cta) row.insertBefore(menu, cta); else row.appendChild(menu);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.removeAttribute('open')));
  document.addEventListener('click', (event) => { if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open'); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') menu.removeAttribute('open'); });
})();
