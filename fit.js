/* fit.js — include in <head> BEFORE support.js on fixed-layout screens:
     <script src="fit.js" data-w="1280" data-h="720"></script>
   When the page is opened on its own (top-level) it redirects to stage.html, which shows the page
   inside an iframe of exactly W×H scaled to fit the window. Embedded use (viewer, Product Flow)
   and ?nofit=1 are left alone. */
(function () {
  if (window.top !== window) return;
  if (/[?&]nofit=1/.test(location.search)) return;
  var s = document.currentScript;
  var w = (s && s.dataset.w) || 1280, h = (s && s.dataset.h) || 720;
  var page = decodeURIComponent(location.pathname.split('/').pop()) + location.search + location.hash;
  location.replace('stage.html?w=' + w + '&h=' + h + '&p=' + encodeURIComponent(page));
})();
