/* Byjus.AI beta — logo-only rail.
   The beta build ships without Goal, Home and Profile, so the shared rail's
   nav buttons and the student avatar are gone. Only the mark stays, and it
   points at Chapter Journey, which is the beta's landing screen.
   Geometry matches nav-rail.js: rail 72px wide, logo 40px at top 24px. */
(function () {
  if (customElements.get('byjus-rail-beta')) return;
  class ByjusRailBeta extends HTMLElement {
    static get observedAttributes() { return ['theme']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      this.style.cssText = 'position:fixed;left:0;top:0;width:72px;z-index:60;display:block;pointer-events:none;';
      this.innerHTML = `
<nav aria-label="Main" style="display:flex;flex-direction:column;align-items:center;">
  <a href="Chapter Journey - Beta.dc.html" title="Byjus.AI" style="pointer-events:auto;margin-top:24px;width:40px;height:40px;flex:none;border-radius:8px;overflow:hidden;display:grid;place-items:center;"><img src="logo.png" alt="Byjus.AI" style="width:100%;height:100%;object-fit:contain;"></a>
</nav>`;
    }
  }
  customElements.define('byjus-rail-beta', ByjusRailBeta);
})();
