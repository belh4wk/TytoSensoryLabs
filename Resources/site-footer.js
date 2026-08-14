(() => {
  const SUPPORT_URL = 'https://github.com/belh4wk/TytoSensoryLabs/issues/new/choose';
  const REPO_URL = 'https://github.com/belh4wk/TytoSensoryLabs';

  // Retire the older page-specific footers so there is one shared footer everywhere.
  document.querySelectorAll('footer.footer-nav, body > footer').forEach((footer) => footer.remove());

  const style = document.createElement('style');
  style.textContent = `
    .tyto-site-footer {
      position: relative;
      z-index: 8;
      margin-top: 4rem;
      border-top: 1px solid rgba(255,255,255,0.07);
      background: rgba(2,2,2,0.96);
      color: #9a9a9a;
    }
    .tyto-footer-inner {
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 2.3rem 0 1.5rem;
    }
    .tyto-footer-grid {
      display: grid;
      grid-template-columns: minmax(250px, 1.4fr) repeat(3, minmax(150px, .7fr));
      gap: 2rem;
    }
    .tyto-footer-brand {
      color: #f3f3f3;
      font-size: .86rem;
      font-weight: 700;
      letter-spacing: .18em;
      text-transform: uppercase;
      text-decoration: none;
    }
    .tyto-footer-copy { margin-top: .8rem; max-width: 31rem; line-height: 1.75; font-size: .88rem; }
    .tyto-footer-heading {
      margin: 0 0 .75rem;
      color: #d7c69f;
      font-size: .72rem;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    .tyto-footer-links { display: grid; gap: .52rem; }
    .tyto-footer-links a { color: #929292; text-decoration: none; font-size: .86rem; transition: color 160ms ease; }
    .tyto-footer-links a:hover { color: #f1f1f1; }
    .tyto-footer-bottom {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.15rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: .74rem;
      line-height: 1.6;
    }
    .tyto-footer-bottom a { color: #aaa; text-decoration: none; }
    .tyto-footer-bottom a:hover { color: #fff; }
    @media (max-width: 820px) {
      .tyto-footer-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .tyto-footer-grid > :first-child { grid-column: 1 / -1; }
    }
    @media (max-width: 540px) {
      .tyto-footer-grid { grid-template-columns: 1fr; }
      .tyto-footer-grid > :first-child { grid-column: auto; }
      .tyto-footer-bottom { flex-direction: column; }
    }
  `;
  document.head.appendChild(style);

  const footer = document.createElement('footer');
  footer.className = 'tyto-site-footer';
  footer.innerHTML = `
    <div class="tyto-footer-inner">
      <div class="tyto-footer-grid">
        <div>
          <a class="tyto-footer-brand" href="index.html">Tyto Sensory Labs</a>
          <p class="tyto-footer-copy">Engineering intuition: turning dense technical output into communication that is clearer to feel, read and act on.</p>
        </div>
        <div>
          <p class="tyto-footer-heading">Explore</p>
          <div class="tyto-footer-links">
            <a href="index.html#tyto">About Tyto</a>
            <a href="index.html#mcp4h">MCP4H</a>
            <a href="mcp4sh.html">MCP4SH</a>
            <a href="ocpf.html">OCPF</a>
          </div>
        </div>
        <div>
          <p class="tyto-footer-heading">Updates</p>
          <div class="tyto-footer-links">
            <a href="labnotes.html">Lab Notes</a>
            <a href="reviews.html">Reviews</a>
            <a href="https://github.com/belh4wk/MCP4SH/releases" target="_blank" rel="noopener noreferrer">MCP4SH releases</a>
          </div>
        </div>
        <div>
          <p class="tyto-footer-heading">Contact</p>
          <div class="tyto-footer-links">
            <a href="${SUPPORT_URL}" target="_blank" rel="noopener noreferrer">Support / contact</a>
            <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="reviews.html#leave-review">Leave a review</a>
          </div>
        </div>
      </div>
      <div class="tyto-footer-bottom">
        <span>© ${new Date().getFullYear()} Tyto Sensory Labs. Product names and trademarks remain the property of their respective owners.</span>
        <span><a href="${SUPPORT_URL}" target="_blank" rel="noopener noreferrer">Independent project · public support via GitHub</a></span>
      </div>
    </div>`;
  document.body.appendChild(footer);
})();
