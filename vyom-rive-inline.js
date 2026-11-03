/* <vyom-rive> — Vyom mascot as a live Rive animation.
   Drop-in replacement for <img src="vyom-mascot.png">: fills its own box,
   honours width/height/filter set via style, falls back to the PNG offline. */
(function () {
  if (customElements.get('vyom-rive')) return;

  var RIVE_URL = (window.__resources && window.__resources.riveRuntime) || 'https://unpkg.com/@rive-app/canvas@2.26.4';
  var SRC = (window.__resources && window.__resources.vyomRiv) || 'vyom.riv';
  var FALLBACK = (window.__resources && window.__resources.vyomPng) || 'vyom-mascot.png';
  /* The .riv artboard is 1000x1000 with ~30% transparent padding baked in on
     every side, so Fit.contain fits the padding, not the mascot. Inflating the
     canvas past the host by this factor makes the painted art fill roughly the
     same box the PNG silhouette used to. Override per-slot with art-scale="". */
  var ART_SCALE = 2.5;
  var runtime = null;

  function loadRuntime() {
    if (runtime) return runtime;
    runtime = new Promise(function (res, rej) {
      if (window.rive && window.rive.Rive) return res(window.rive);
      var applyWasm = function (r) {
        try {
          var w = window.__resources && window.__resources.riveWasm;
          if (w && r.RuntimeLoader && r.RuntimeLoader.setWasmUrl) r.RuntimeLoader.setWasmUrl(w);
        } catch (e) {}
        return r;
      };
      var s = document.createElement('script');
      s.src = RIVE_URL;
      s.onload = function () { window.rive ? res(applyWasm(window.rive)) : rej(new Error('rive missing')); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return runtime;
  }

  var io = null, watched = new Map();
  function observe(el) {
    if (!('IntersectionObserver' in window)) { el._vyomEnter(); return; }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var t = watched.get(e.target);
          if (t) e.isIntersecting ? t._vyomEnter() : t._vyomExit();
        });
      }, { rootMargin: '200px' });
    }
    watched.set(el, el);
    io.observe(el);
  }
  function unobserve(el) { if (io) { io.unobserve(el); watched.delete(el); } }

  class VyomRive extends HTMLElement {
    connectedCallback() {
      if (this._built) { observe(this); return; }
      this._built = true;
      while (this.firstChild) this.removeChild(this.firstChild);
      var cs = getComputedStyle(this);
      if (cs.display === 'inline') this.style.display = 'inline-block';
      if (cs.position === 'static') this.style.position = 'relative';

      this._img = document.createElement('img');
      this._img.src = FALLBACK;
      this._img.alt = 'Vyom';
      this._img.decoding = 'async';
      this._img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;transition:opacity .25s ease;';
      this.appendChild(this._img);

      this._canvas = document.createElement('canvas');
      this._canvas.setAttribute('aria-label', 'Vyom');
      var k = parseFloat(this.getAttribute('art-scale')) || ART_SCALE;
      var pct = (k * 100).toFixed(2), off = ((1 - k) / 2 * 100).toFixed(2);
      this._canvas.style.cssText = 'position:absolute;left:' + off + '%;top:' + off + '%;width:' + pct + '%;height:' + pct + '%;display:block;opacity:0;pointer-events:none;transition:opacity .25s ease;';
      this.appendChild(this._canvas);

      this._ro = new ResizeObserver(function () {
        if (this._rive) try { this._rive.resizeDrawingSurfaceToCanvas(); } catch (e) {}
      }.bind(this));
      this._ro.observe(this);

      observe(this);
    }

    disconnectedCallback() {
      unobserve(this);
      if (this._pollT) { clearInterval(this._pollT); this._pollT = null; }
      if (this._ro) this._ro.disconnect();
      this._vyomExit();
      if (this._rive) { try { this._rive.cleanup(); } catch (e) {} this._rive = null; }
    }

    _vyomEnter() {
      if (this._rive) { try { this._rive.play(); } catch (e) {} return; }
      if (this._loading) return;
      this._loading = true;
      var self = this;
      loadRuntime().then(function (rive) {
        if (!self.isConnected) { self._loading = false; return; }
        self._rive = new rive.Rive({
          src: SRC,
          canvas: self._canvas,
          autoplay: true,
          stateMachines: self.getAttribute('state-machine') || 'State Machine 1',
          layout: new rive.Layout({ fit: rive.Fit.contain, alignment: rive.Alignment.center }),
          onLoad: function () { self._reveal(); }
        });
        self._startRevealPoll();
      }).catch(function () { self._loading = false; });
    }

    _reveal() {
      if (this._revealed || !this._rive) return;
      try { this._rive.resizeDrawingSurfaceToCanvas(); } catch (e) {}
      this._revealed = true;
      this._canvas.style.opacity = '1';
      this._img.style.opacity = '0';
      if (this._pollT) { clearInterval(this._pollT); this._pollT = null; }
    }

    _startRevealPoll() {
      if (this._pollT || this._revealed) return;
      var self = this, tries = 0;
      this._pollT = setInterval(function () {
        tries++;
        var r = self._rive;
        var ready = false;
        try { ready = !!(r && (r.isPlaying || (r.stateMachineNames && r.stateMachineNames.length))); } catch (e) {}
        if (ready) self._reveal();
        else if (tries > 40) { clearInterval(self._pollT); self._pollT = null; }
      }, 120);
    }

    _vyomExit() { if (this._rive) { try { this._rive.pause(); } catch (e) {} } }
  }

  customElements.define('vyom-rive', VyomRive);
})();
