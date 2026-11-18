/* Byjus.AI beta — the pared-back rail.
   The beta ships without Goal and Home, so the shared rail's nav buttons are
   gone and only the mark stays, pointing at Chapter Journey, the beta's
   landing screen. The student avatar lives in the header instead, beside the
   light/dark switch.
   Geometry matches nav-rail.js: rail 72px, logo 40px at top 24px, 52px avatar.

   Note: the avatar opens the main Profile page, which is not part of the beta
   set — it carries the full nav rail and links back to Home and the non-beta
   Chapter Journey, and exists in light only. Stepping into it leaves the beta
   flow, and the theme, by design. */
(function () {
  if (customElements.get('byjus-rail-beta')) return;

  class ByjusRailBeta extends HTMLElement {
    static get observedAttributes() { return ['theme']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }

    render() {
      var dark = (window.byjusTheme === 'dark') ||
                 (document.documentElement.getAttribute('data-theme') === 'dark');
      var T = dark ? { def: '#261f37', line: 'rgba(205,199,222,.16)' }
                   : { def: '#e9e2fe', line: 'rgba(112,72,232,.18)' };
      var home = dark ? 'Chapter Journey - Beta Dark.dc.html' : 'Chapter Journey - Beta.dc.html';

      this.style.cssText = 'position:fixed;left:0;top:0;width:72px;z-index:60;display:block;pointer-events:none;';
      this.innerHTML = [
'<nav aria-label="Main" style="display:flex;flex-direction:column;align-items:center;">',
  '<a href="' + home + '" title="Byjus.AI" style="pointer-events:auto;margin-top:24px;width:40px;height:40px;flex:none;border-radius:8px;overflow:hidden;display:grid;place-items:center;">',
    '<img src="logo.png" alt="Byjus.AI" style="width:100%;height:100%;object-fit:contain;">',
  '</a>',
'</nav>'].join('');
    }
  }

  customElements.define('byjus-rail-beta', ByjusRailBeta);
})();
