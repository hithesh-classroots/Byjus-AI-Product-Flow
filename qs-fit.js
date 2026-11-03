/* qs-fit.js — stops the question stage from jumping when the chat opens or closes.
   Before: the wrapper's width animated (100% <-> calc(100% - 372px)) and the 16:9 stage frame + its
   container-query scale were recomputed on every frame of that animation. In some browsers the stage
   overshot its final size mid-slide, pushing Submit/Skip below the fold, then snapped back.
   Now: the layout switches to its final state in one step, and the stage frame animates from where it
   was to where it is with a single transform (FLIP). It only ever sits between two valid, on-screen
   states, so nothing overshoots, drifts or disappears. */
(function () {
  var DUR = 420, EASE = 'cubic-bezier(.4,0,.2,1)';
  var last = null, lastW = null, anim = null;

  var css = document.createElement('style');
  css.textContent = '[data-teach-wrap]{transition:none !important}';
  document.head.appendChild(css);

  function wrapper() { return document.querySelector('[data-teach-wrap]'); }
  function frame() { var d = document.getElementById('qsDesign'); return d && d.parentElement && d.parentElement.parentElement; }

  /* Remember where the frame is, every frame, so we know where it was just before a layout change. */
  function snap() {
    if (!anim) { var f = frame(); last = f ? f.getBoundingClientRect() : null; }
    requestAnimationFrame(snap);
  }

  /* The wrapper's inline width changed (chat opened/closed): the layout is already final here. */
  function onWidthChange() {
    var f = frame(); if (!f || !last || !f.animate) return;
    var r = f.getBoundingClientRect();
    if (!r.width || !last.width) return;
    var dx = last.left - r.left, dy = last.top - r.top, k = last.width / r.width;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(k - 1) < 0.005) return;
    if (anim) anim.cancel();
    f.style.transformOrigin = '0 0';
    anim = f.animate(
      [{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')' }, { transform: 'none' }],
      { duration: DUR, easing: EASE }
    );
    var done = function () { anim = null; };
    anim.onfinish = done; anim.oncancel = done;
  }

  function watch() {
    var w = wrapper();
    if (w && w.style.width !== lastW) { var first = lastW === null; lastW = w.style.width; if (!first) onWidthChange(); }
  }

  function start() {
    new MutationObserver(watch).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] });
    watch(); requestAnimationFrame(snap);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
