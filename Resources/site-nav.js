(() => {
  const topbar = document.querySelector('.topbar');
  const row = topbar?.querySelector(':scope > div');
  if (!topbar || !row || row.querySelector('.mobile-site-menu')) return;

  // Replace the old two-link mobile strip with one compact site-wide menu.
  topbar.querySelectorAll('.mobile-global-links').forEach((node) => node.remove());

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = currentFile === '' || currentFile === 'index.html';
  const isMcp4sh = currentFile === 'mcp4sh.html';
  const isOcpf = currentFile === 'ocpf.html';
  const isReviews = currentFile === 'reviews.html';
  const isLabNotes = currentFile === 'labnotes.html';

  const links = [
    ['Home', 'index.html', isHome],
    ['MCP4H', 'index.html#mcp4h', false],
    ['MCP4SH', 'mcp4sh.html', isMcp4sh],
    ['OCPF', 'ocpf.html', isOcpf],
    ['Reviews', 'reviews.html', isReviews],
    ['Lab Notes', 'labnotes.html', isLabNotes]
  ];

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

  const cta = Array.from(row.children).find((child) =>
    child.tagName === 'A' && child.classList.contains('btn')
  );
  if (cta) row.insertBefore(menu, cta);
  else row.appendChild(menu);

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.removeAttribute('open')));
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.removeAttribute('open');
  });
})();
