/* Byjus.AI beta — one theme across the three beta screens.
   Light and dark are separate page builds (that is how this prototype ships
   dark: Teaching Room - Dark is hand-authored). This keeps the choice stuck:
   it remembers it, sends you to the matching build of whatever page you open,
   and flips you to the counterpart when the switch is used.
   Loaded in <head> so the redirect happens before anything paints. */
(function () {
  var PAIRS = {
    'Chapter Journey - Beta.dc.html':            'Chapter Journey - Beta Dark.dc.html',
    'Teaching Room - Beta.dc.html':              'Teaching Room - Beta Dark.dc.html',
    'Practice Room - Guided Retry Beta.dc.html': 'Practice Room - Guided Retry Beta Dark.dc.html'
  };
  var BACK = {}; for (var k in PAIRS) BACK[PAIRS[k]] = k;

  var file = '';
  try { file = decodeURIComponent((location.pathname.split('/').pop() || '')); } catch (e) {}
  var isDark = Object.prototype.hasOwnProperty.call(BACK, file);
  var twin = isDark ? BACK[file] : PAIRS[file];

  function stored() {
    try { return localStorage.getItem('byjusTheme') === 'dark' ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }

  // land on the build that matches the remembered choice
  var want = stored();
  if (twin && (want === 'dark') !== isDark) {
    try { location.replace(encodeURI(twin) + location.search + location.hash); return; } catch (e) {}
  }

  try { document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light'); } catch (e) {}

  window.byjusTheme = isDark ? 'dark' : 'light';
  window.byjusToggleTheme = function () {
    var next = isDark ? 'light' : 'dark';
    try { localStorage.setItem('byjusTheme', next); } catch (e) {}
    if (twin) { try { location.href = encodeURI(twin) + location.search + location.hash; } catch (e) {} }
  };
})();
