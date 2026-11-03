/* Byjus.AI wallet: free-help allowances, Orbs, XP.
   Plain script, no framework. Load once per page: <script src="wallet.js"></script>
   Hooks (event delegation, any page):
     [data-wallet]          click → XP / Orbs dropdown anchored to the element
     [data-quota]           click → "Your free help" panel
     [data-buy="doubt"]     click → buy-more sheet for that allowance (doubt | goal | paper | chat)
   API: window.ByjusWallet.{status(kind), openWallet(el), openQuota(), openBuy(kind), get(), on(fn)}
   Fires window 'wallet-change' whenever balances move. */
(function(){
  if (window.ByjusWallet) return;
  var KEY = 'byjus.wallet.v2';
  var DEF = { orbs: 32, xp: 4820, level: 12, studyMin: 9, used: { doubt: 1, goal: 1, paper: 0, chat: 18 }, extra: { doubt: 0, goal: 0, paper: 0, chat: 0 } };
  var S; try { S = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { S = null; }
  if (!S || !S.used) S = JSON.parse(JSON.stringify(DEF));
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} try { window.dispatchEvent(new CustomEvent('wallet-change', { detail: S })); } catch (e) {} }

  /* Allowance rules (from the Free allowance sheet) */
  var A = {
    doubt: { name: 'Doubts', one: 'doubt', icon: 'ti-help-circle', per: 'today', cost: 3, unit: 1 },
    goal:  { name: 'Goals with a Vyom-planned path', one: 'goal', icon: 'ti-target', per: 'this month', free: 3, cost: 8, unit: 1 },
    paper: { name: 'Photo-marked written papers', one: 'paper', icon: 'ti-camera', per: 'this week', free: 1, cost: 3, unit: 1 },
    chat:  { name: 'Chat messages with Vyom', one: 'message', icon: 'ti-message-circle', per: 'today', free: 100, cost: 1, unit: 20 }
  };
  function doubtFree(){ return S.studyMin >= 15 ? 2 : 1; }
  function status(kind){
    if (kind === 'homework') kind = 'doubt';
    if (kind === 'practice' || kind === 'learn') return { kind: kind, unlimited: true, label: 'Free', tone: 'free' };
    var a = A[kind]; if (!a) return null;
    var free = kind === 'doubt' ? doubtFree() : a.free;
    var used = S.used[kind] || 0, extra = S.extra[kind] || 0;
    var freeLeft = Math.max(0, free - used), left = freeLeft + extra;
    var r = { kind: kind, free: free, total: kind === 'doubt' ? 2 : free, used: Math.min(used, kind === 'doubt' ? 2 : free), left: left, extra: extra, cost: a.cost, unit: a.unit, per: a.per };
    if (left > 0) { r.tone = 'ok'; r.label = String(left); }
    else if (kind === 'doubt' && S.studyMin < 15 && used < 2) { r.tone = 'locked'; r.locked = true; r.mins = 15 - S.studyMin; r.label = r.mins + ' min'; }
    else { r.tone = 'out'; r.exhausted = true; r.label = a.cost + ' orbs'; }
    return r;
  }

  /* ---------- styles + shared DOM ---------- */
  var css = [
    '[data-wallet],[data-quota],[data-buy]{cursor:pointer;}',
    '.bw-scrim{position:fixed;inset:0;z-index:9990;background:rgba(33,26,74,.32);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:grid;place-items:center;animation:bwFade .2s ease both;}',
    '.bw-card{width:min(440px,calc(100vw - 32px));max-height:calc(100vh - 48px);overflow:auto;box-sizing:border-box;background:#fff;border-radius:20px;box-shadow:0 1px 3px rgba(0,0,0,.06),0 28px 60px -20px rgba(33,26,74,.45);padding:28px;animation:bwPop .28s cubic-bezier(.2,.8,.3,1) both;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#212529;}',
    '.bw-drop{position:fixed;z-index:9991;width:300px;box-sizing:border-box;background:#fff;border:1px solid #e5dbff;border-radius:16px;box-shadow:0 14px 30px -14px rgba(70,46,146,.45),0 1px 2px rgba(33,26,74,.06);padding:14px;animation:bwDrop .2s cubic-bezier(.2,.8,.3,1) both;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#212529;}',
    '.bw-drop::before{content:"";position:absolute;top:-6px;left:var(--bw-caret,24px);width:11px;height:11px;margin-left:-5px;background:#fff;border-left:1px solid #e5dbff;border-top:1px solid #e5dbff;transform:rotate(45deg);}',
    '.bw-chip-open{background:rgba(112,72,232,.10) !important;box-shadow:inset 0 0 0 1px rgba(112,72,232,.22);transition:background .15s ease;}',
    '.bw-eyebrow{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7048e8;}',
    '.bw-h{margin:6px 0 0;font-size:22px;font-weight:700;line-height:1.25;color:#211a4a;}',
    '.bw-sub{margin:6px 0 0;font-size:14px;font-weight:500;line-height:1.5;color:#6b6786;}',
    '.bw-row{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;}',
    '.bw-drop .bw-row+.bw-row{margin-top:4px;}',
    '.bw-ic{width:36px;height:36px;flex:none;border-radius:10px;display:grid;place-items:center;font-size:19px;}',
    '.bw-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 20px;border-radius:999px;border:none;font:700 15px/1 inherit;font-family:inherit;cursor:pointer;white-space:nowrap;transition:background .15s ease;}',
    '.bw-btn-main{background:#7048e8;color:#fff;box-shadow:0 10px 20px -12px rgba(112,72,232,.8);} .bw-btn-main:hover{background:#6741d9;}',
    '.bw-btn-soft{background:#f3f0ff;color:#5f3dc4;} .bw-btn-soft:hover{background:#e5dbff;}',
    '.bw-btn-text{background:transparent;color:#6b6786;padding:0 12px;} .bw-btn-text:hover{color:#211a4a;}',
    '.bw-btn[disabled]{background:#e9ecef;color:#adb5bd;box-shadow:none;cursor:not-allowed;}',
    '.bw-x{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;border:none;background:transparent;color:#868e96;font-size:20px;display:grid;place-items:center;cursor:pointer;} .bw-x:hover{background:#f1f3f5;}',
    '.bw-orb{display:inline-block;width:16px;height:16px;flex:none;border-radius:50%;background:radial-gradient(circle at 34% 28%,#fff,#ffe066 42%,#ff922b 78%,#e8590c);box-shadow:0 0 8px rgba(255,193,7,.7);vertical-align:-3px;}',
    '.bw-bar{height:8px;border-radius:999px;background:#f1f3f5;overflow:hidden;} .bw-bar>i{display:block;height:100%;border-radius:999px;}',
    '.bw-opt{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:14px;border-radius:14px;border:2px solid #e9ecef;background:#fff;font-family:inherit;text-align:left;cursor:pointer;transition:border-color .15s ease,background .15s ease;} .bw-opt:hover{border-color:#d0bfff;} .bw-opt.on{border-color:#7048e8;background:#f3f0ff;}',
    '.bw-opt+.bw-opt{margin-top:8px;}',
    '.bw-link{font-size:14px;font-weight:700;color:#7048e8;cursor:pointer;background:none;border:none;font-family:inherit;padding:0;} .bw-link:hover{color:#5f3dc4;}',
    '@keyframes bwFade{from{opacity:0}to{opacity:1}} @keyframes bwPop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}} @keyframes bwDrop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.bw-scrim,.bw-card,.bw-drop{animation:none;}}'
  ].join('\n');
  function ensureStyle(){ if (document.getElementById('bw-style')) return; var st = document.createElement('style'); st.id = 'bw-style'; st.textContent = css; document.head.appendChild(st);
    if (!document.querySelector('link[href*="tabler-icons"]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css'; document.head.appendChild(l); } }
  function el(html){ var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function fmt(n){ return Number(n).toLocaleString('en-IN'); }
  function syncFromPage(){
    var o = document.querySelector('[title="Energy orbs"]'); if (o) { var n = parseInt((o.textContent || '').replace(/[^0-9]/g, ''), 10); if (!isNaN(n) && n !== S.orbs && !S._bought) S.orbs = n; }
    var x = document.querySelector('[title="Experience points"]'); if (x) { var m = parseInt((x.textContent || '').replace(/[^0-9]/g, ''), 10); if (!isNaN(m)) S.xp = m; }
  }

  var layer = null, drop = null;
  var chip = null;
  function closeAll(){ if (layer) { layer.remove(); layer = null; } if (drop) { drop.remove(); drop = null; } if (chip) { chip.classList.remove('bw-chip-open'); chip = null; } }
  function modal(inner){ ensureStyle(); closeAll(); layer = el('<div class="bw-scrim" role="dialog" aria-modal="true"><div class="bw-card" style="position:relative;"><button class="bw-x" aria-label="Close"><i class="ti ti-x"></i></button>' + inner + '</div></div>');
    layer.addEventListener('click', function(e){ if (e.target === layer || e.target.closest('.bw-x')) closeAll(); }); document.body.appendChild(layer); return layer.querySelector('.bw-card'); }

  /* ---------- buy sheet ---------- */
  var PACKS = [ { orbs: 20, price: 49 }, { orbs: 60, price: 129, tag: 'Best value' }, { orbs: 150, price: 299 } ];
  function openBuy(kind){
    if (kind === 'homework') kind = 'doubt';
    var a = A[kind]; if (!a) return;
    var st = status(kind), can = S.orbs >= a.cost;
    var what = a.unit > 1 ? (a.unit + ' more ' + a.one + 's') : ('1 more ' + a.one);
    var head = st.locked
      ? '<div class="bw-eyebrow">Free help</div><h2 class="bw-h">Learn for ' + st.mins + ' more minutes to get a free doubt</h2><p class="bw-sub">Do a lesson or some practice today and your next doubt is free. Or use Orbs now.</p>'
      : st.left > 0
        ? '<div class="bw-eyebrow">Free help</div><h2 class="bw-h">You have ' + st.left + ' ' + (st.left === 1 ? a.one : a.one + 's') + ' left ' + a.per + '</h2><p class="bw-sub">You can still add more with Orbs.</p>'
        : '<div class="bw-eyebrow">Free help used up</div><h2 class="bw-h">Get ' + what + '</h2><p class="bw-sub">Your free ' + a.one + 's for ' + a.per + ' are used. Add more with Orbs.</p>';
    var card = modal(head +
      '<div style="margin-top:22px;display:flex;align-items:center;gap:14px;padding:16px;border-radius:16px;background:#f8f9fa;">' +
        '<span class="bw-ic" style="background:#f3f0ff;color:#7048e8;"><i class="ti ' + a.icon + '"></i></span>' +
        '<div style="flex:1;min-width:0;"><div style="font-size:16px;font-weight:700;color:#211a4a;">' + what + '</div><div style="font-size:14px;font-weight:600;color:#6b6786;margin-top:2px;">You have <span class="bw-orb"></span> ' + S.orbs + ' orbs</div></div>' +
        '<div style="display:flex;align-items:center;gap:6px;font-size:18px;font-weight:800;color:#7a4700;"><span class="bw-orb"></span>' + a.cost + '</div>' +
      '</div>' +
      (can ? '' : '<p class="bw-sub" style="margin-top:12px;color:#c92a2a;">You need ' + (a.cost - S.orbs) + ' more orbs for this.</p>') +
      '<div style="margin-top:22px;display:flex;justify-content:flex-end;gap:8px;">' +
        '<button class="bw-btn bw-btn-text" data-bw="cancel">Not now</button>' +
        (can ? '<button class="bw-btn bw-btn-main" data-bw="spend">Use ' + a.cost + ' orbs</button>' : '<button class="bw-btn bw-btn-main" data-bw="getorbs">Get more orbs</button>') +
      '</div>');
    card.addEventListener('click', function(e){ var b = e.target.closest('[data-bw]'); if (!b) return; var k = b.getAttribute('data-bw');
      if (k === 'cancel') closeAll();
      if (k === 'getorbs') openPay(function(){ openBuy(kind); });
      if (k === 'spend') { S.orbs -= a.cost; S.extra[kind] = (S.extra[kind] || 0) + a.unit; S._bought = true; save(); done('Added ' + what, 'You have ' + S.orbs + ' orbs left.'); } });
  }
  function done(title, sub){ var c = modal('<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:12px 0 4px;"><span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#ebfbee;color:#2f9e44;font-size:34px;"><i class="ti ti-check"></i></span><h2 class="bw-h">' + title + '</h2><p class="bw-sub" style="margin:0;">' + sub + '</p><button class="bw-btn bw-btn-main" data-bw="ok" style="margin-top:12px;">Done</button></div>');
    c.addEventListener('click', function(e){ if (e.target.closest('[data-bw="ok"]')) closeAll(); }); }

  /* ---------- payment (orb packs) ---------- */
  function openPay(after){
    var pick = 1, method = 'parent';
    function render(){
      var card = modal('<div class="bw-eyebrow">Get orbs</div><h2 class="bw-h">Pick an orb pack</h2>' +
        '<div style="margin-top:18px;">' + PACKS.map(function(p, i){ return '<button class="bw-opt' + (i === pick ? ' on' : '') + '" data-pack="' + i + '"><span class="bw-orb" style="width:22px;height:22px;"></span><span style="flex:1;font-size:16px;font-weight:700;color:#211a4a;">' + p.orbs + ' orbs' + (p.tag ? ' <span style="margin-left:6px;padding:2px 8px;border-radius:999px;background:#ebfbee;color:#2b8a3e;font-size:12px;font-weight:700;">' + p.tag + '</span>' : '') + '</span><span style="font-size:16px;font-weight:800;color:#211a4a;">₹' + p.price + '</span></button>'; }).join('') + '</div>' +
        '<div style="margin-top:22px;font-size:14px;font-weight:700;color:#495057;">How to pay</div>' +
        '<div style="margin-top:10px;">' +
          [['parent', 'ti-user-heart', 'Ask a parent', 'We send them a request to approve'], ['upi', 'ti-qrcode', 'UPI', 'GPay, PhonePe, Paytm'], ['card', 'ti-credit-card', 'Card', 'Debit or credit card']].map(function(m){ return '<button class="bw-opt' + (m[0] === method ? ' on' : '') + '" data-m="' + m[0] + '"><span class="bw-ic" style="background:#f1f3f5;color:#495057;"><i class="ti ' + m[1] + '"></i></span><span style="flex:1;"><span style="display:block;font-size:15px;font-weight:700;color:#211a4a;">' + m[2] + '</span><span style="display:block;font-size:13px;font-weight:500;color:#868e96;margin-top:2px;">' + m[3] + '</span></span></button>'; }).join('') +
        '</div>' +
        '<div style="margin-top:22px;display:flex;justify-content:flex-end;gap:8px;"><button class="bw-btn bw-btn-text" data-bw="back">Back</button><button class="bw-btn bw-btn-main" data-bw="pay">' + (method === 'parent' ? 'Send request' : 'Pay ₹' + PACKS[pick].price) + '</button></div>');
      card.addEventListener('click', function(e){
        var p = e.target.closest('[data-pack]'); if (p) { pick = +p.getAttribute('data-pack'); render(); return; }
        var m = e.target.closest('[data-m]'); if (m) { method = m.getAttribute('data-m'); render(); return; }
        var b = e.target.closest('[data-bw]'); if (!b) return; var k = b.getAttribute('data-bw');
        if (k === 'back') { if (after) after(); else closeAll(); }
        if (k === 'pay') {
          if (method === 'parent') { var c = modal('<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:12px 0 4px;"><span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#f3f0ff;color:#7048e8;font-size:32px;"><i class="ti ti-send"></i></span><h2 class="bw-h">Request sent</h2><p class="bw-sub" style="margin:0;">We asked your parent to approve ' + PACKS[pick].orbs + ' orbs for ₹' + PACKS[pick].price + '. Your orbs arrive once they say yes.</p><button class="bw-btn bw-btn-main" data-bw="ok" style="margin-top:12px;">Okay</button></div>'); c.addEventListener('click', function(ev){ if (ev.target.closest('[data-bw="ok"]')) closeAll(); }); return; }
          S.orbs += PACKS[pick].orbs; S._bought = true; save();
          var c2 = modal('<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:12px 0 4px;"><span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#ebfbee;color:#2f9e44;font-size:34px;"><i class="ti ti-check"></i></span><h2 class="bw-h">' + PACKS[pick].orbs + ' orbs added</h2><p class="bw-sub" style="margin:0;">You now have ' + S.orbs + ' orbs.</p><button class="bw-btn bw-btn-main" data-bw="ok" style="margin-top:12px;">' + (after ? 'Continue' : 'Done') + '</button></div>');
          c2.addEventListener('click', function(ev){ if (ev.target.closest('[data-bw="ok"]')) { if (after) after(); else closeAll(); } });
        } });
    }
    render();
  }

  /* ---------- free-help panel ---------- */
  function quotaRows(compact){
    var TITLE = { doubt: 'Doubts & homework', chat: 'Chat with Vyom', goal: 'Goals', paper: 'Photo-marked papers' };
    var PER = { doubt: 'today', chat: 'today', goal: 'this month', paper: 'this week' };
    return ['doubt', 'chat', 'goal', 'paper'].map(function(k){
      var a = A[k], s = status(k);
      var line, ink;
      if (s.tone === 'ok') { ink = '#2b8a3e'; line = s.left + ' left ' + PER[k]; }
      else if (s.tone === 'locked') { ink = '#6741d9'; line = 'Learn ' + s.mins + ' min for 1 free'; }
      else { ink = '#e8590c'; line = 'All used ' + PER[k]; }
      var pips = s.total <= 3 ? '<div style="display:flex;gap:6px;margin-top:8px;">' + Array.apply(null, Array(s.total)).map(function(_, i){
          var on = i < s.left, lock = s.locked && i === s.total - 1; return lock ? '<span style="width:22px;height:8px;border-radius:999px;background:#e5dbff;"></span>' : '<span style="width:22px;height:8px;border-radius:999px;background:' + (on ? '#51cf66' : '#e9ecef') + ';"></span>'; }).join('') + '</div>' : '';
      var study = '';
      return '<div class="bw-row" style="background:#f8f9fa;padding:16px;gap:14px;">' +
        '<span class="bw-ic" style="width:44px;height:44px;font-size:22px;background:#fff;color:#7048e8;"><i class="ti ' + a.icon + '"></i></span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:16px;font-weight:700;color:#211a4a;">' + TITLE[k] + '</div>' +
          '<div style="margin-top:3px;font-size:15px;font-weight:700;color:' + ink + ';text-wrap:balance;">' + line + '</div>' + pips + study +
        '</div>' +
        (compact ? '' : '<button class="bw-btn bw-btn-soft" data-buy="' + k + '" style="height:40px;padding:0 16px;font-size:14px;flex:none;">Get more</button>') +
      '</div>';
    }).join('');
  }
  function openQuota(){
    syncFromPage();
    var card = modal('<div class="bw-eyebrow">Free allowance</div><h2 class="bw-h">Your free help</h2><p class="bw-sub">Lessons, practice, videos and applets are always free.</p>' +
      '<div style="margin-top:18px;display:flex;flex-direction:column;gap:8px;">' + quotaRows(false) + '</div>' +
      '<div style="margin-top:18px;display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:14px;background:#fff9db;"><span class="bw-orb" style="width:20px;height:20px;"></span><span style="flex:1;font-size:15px;font-weight:700;color:#7a4700;">' + S.orbs + ' orbs</span><button class="bw-link" data-bw="getorbs">Get more orbs</button></div>');
    card.addEventListener('click', function(e){ if (e.target.closest('[data-bw="getorbs"]')) openPay(openQuota); });
  }

  /* ---------- XP / Orbs dropdown ---------- */
  function openWallet(anchor){
    ensureStyle(); syncFromPage(); closeAll();
    /* The panel is an extension of the chip that was tapped: it hangs from that chip with a caret,
       the chip stays lit while it is open, and it never repeats the number already shown in the header. */
    var isXp = /experience/i.test(anchor.getAttribute('title') || '');
    var PER_LEVEL = 400, into = S.xp % PER_LEVEL, toGo = PER_LEVEL - into;
    var body;
    if (isXp) {
      body =
        '<div style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800;color:#211a4a;"><i class="ti ti-star-filled" style="color:#fab005;font-size:18px;"></i>Level ' + S.level + '</div>' +
        '<div style="margin-top:10px;height:8px;border-radius:999px;background:#f1f3f5;overflow:hidden;"><div style="width:' + Math.max(4, Math.round(into / PER_LEVEL * 100)) + '%;height:100%;border-radius:999px;background:linear-gradient(90deg,#fcc419,#f08c00);"></div></div>' +
        '<div style="margin-top:8px;font-size:14px;font-weight:600;color:#6b6786;">' + toGo + ' XP to Level ' + (S.level + 1) + '</div>' +
        '<div style="margin:12px 0 0;padding-top:12px;border-top:1px solid #f1f3f5;font-size:13px;font-weight:500;line-height:1.5;color:#6b6786;">XP levels you up and moves you up your study group board. It can’t be spent.</div>';
    } else {
      var spend = [['doubt', 'Extra doubt'], ['chat', '20 more Vyom messages'], ['goal', 'Extra goal'], ['paper', 'Photo-marked paper']];
      body =
        '<div style="margin:0 4px 6px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#868e96;">Spend orbs on</div>' +
        spend.map(function(s){ var a = A[s[0]], ok = S.orbs >= a.cost; return '<div class="bw-row" data-buy="' + s[0] + '" style="padding:8px 8px;transition:background .15s ease;" onmouseover="this.style.background=\'#f8f9fa\'" onmouseout="this.style.background=\'transparent\'"><span class="bw-ic" style="width:32px;height:32px;font-size:17px;background:#f3f0ff;color:#7048e8;"><i class="ti ' + a.icon + '"></i></span><span style="flex:1;font-size:15px;font-weight:600;color:#211a4a;">' + s[1] + '</span><span style="display:inline-flex;align-items:center;gap:5px;font-size:15px;font-weight:800;color:' + (ok ? '#7a4700' : '#adb5bd') + ';"><span class="bw-orb" style="width:14px;height:14px;' + (ok ? '' : 'filter:grayscale(1);opacity:.5;') + '"></span>' + a.cost + '</span></div>'; }).join('') +
        '<div class="bw-row" data-bw="rewards" style="padding:8px 8px;cursor:pointer;" onmouseover="this.style.background=\'#f8f9fa\'" onmouseout="this.style.background=\'transparent\'"><span class="bw-ic" style="width:32px;height:32px;font-size:17px;background:#fff4e6;color:#e8590c;"><i class="ti ti-gift"></i></span><span style="flex:1;font-size:15px;font-weight:600;color:#211a4a;">Rewards shop</span><i class="ti ti-chevron-right" style="color:#adb5bd;"></i></div>' +
        '<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:12px 4px 0;border-top:1px solid #f1f3f5;"><button class="bw-link" data-bw="quota">See my free help</button><button class="bw-link" data-bw="getorbs">Get more orbs</button></div>';
    }
    drop = el('<div class="bw-drop" role="menu">' + body + '</div>');
    document.body.appendChild(drop);
    chip = anchor; anchor.classList.add('bw-chip-open');
    var r = anchor.getBoundingClientRect(), w = 300;
    var left = Math.round(Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - 28)));
    drop.style.top = Math.round(r.bottom + 8) + 'px';
    drop.style.left = left + 'px';
    drop.style.setProperty('--bw-caret', Math.round(r.left + r.width / 2 - left) + 'px');
    drop.addEventListener('click', function(e){ var b = e.target.closest('[data-bw]'); if (!b) return; var k = b.getAttribute('data-bw');
      if (k === 'quota') openQuota(); if (k === 'getorbs') openPay(); if (k === 'rewards') { try { window.location.href = encodeURI('Profile.dc.html?tab=rewards'); } catch (err) {} } });
  }

  document.addEventListener('click', function(e){
    var t = e.target;
    if (drop && !drop.contains(t) && !t.closest('[data-wallet]')) { closeAll(); }
    var buy = t.closest('[data-buy]'); if (buy) { e.preventDefault(); e.stopPropagation(); openBuy(buy.getAttribute('data-buy')); return; }
    var q = t.closest('[data-quota]'); if (q) { e.preventDefault(); e.stopPropagation(); openQuota(); return; }
    var w = t.closest('[data-wallet]'); if (w) { e.preventDefault(); e.stopPropagation(); if (drop && chip === w) { closeAll(); return; } openWallet(w); }
  }, true);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(); });

  window.ByjusWallet = { status: status, openWallet: openWallet, openQuota: openQuota, openBuy: openBuy, openPay: openPay, get: function(){ return S; },
    on: function(fn){ window.addEventListener('wallet-change', fn); return function(){ window.removeEventListener('wallet-change', fn); }; },
    reset: function(){ S = JSON.parse(JSON.stringify(DEF)); save(); } };
})();
