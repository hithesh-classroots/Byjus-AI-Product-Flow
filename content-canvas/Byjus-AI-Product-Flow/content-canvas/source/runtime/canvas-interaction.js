/* Content Canvas 2.4.0-draft · interaction runtime.
   Behaviour tokens (atomic motions), lines of working (derive) and multi-step problems (statement, knowns rail).
   Every duration, easing and distance is read from the --cc-* tokens in assets/canvas.css, exactly as canvas.js
   reads its moves. Motion is translate, rotate or opacity only. Under reduced motion every call lands on its end
   state at once. Every call resolves a Promise when it rests. Presentation only: the application owns judgement. */
(function(global){'use strict';
 const VERSION='2.4.0-draft',NS='http://www.w3.org/2000/svg';
 const reduced=()=>!!global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const raw=(el,n)=>getComputedStyle(el).getPropertyValue(n).trim();
 const ms=(el,n)=>{const v=raw(el,n);return v.endsWith('ms')?parseFloat(v):v.endsWith('s')?parseFloat(v)*1000:parseFloat(v)||0};
 const num=(el,n)=>parseFloat(raw(el,n))||0;
 const lerp=(a,b,k)=>a+(b-a)*k;
 /* cubic-bezier(x1,y1,x2,y2) → easing function (Newton + bisection), so --cc-ease-* drive JS tweens too */
 function bezier(str){const m=String(str).match(/cubic-bezier\(([^)]+)\)/);if(!m)return str==='linear'?(p=>p):(p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2);
  const [x1,y1,x2,y2]=m[1].split(',').map(Number),cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
  const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
  return p=>{if(p<=0)return 0;if(p>=1)return 1;let t=p;for(let i=0;i<6;i++){const d=dX(t);if(Math.abs(d)<1e-6)break;t-=(X(t)-p)/d;}
   if(t<0||t>1){let lo=0,hi=1;t=p;for(let i=0;i<20;i++){X(t)<p?lo=t:hi=t;t=(lo+hi)/2;}}return Y(t);};}
 let speed=1;
 function tween(D,fn,ez){D*=speed;return new Promise(res=>{if(reduced()||D<=0){fn(1,1);res();return;}const t0=performance.now();
  (function st(now){const p=Math.min(1,(now-t0)/D);fn(ez?ez(p):p,p);if(p<1)requestAnimationFrame(st);else res();})(t0);});}
 const wait=t=>new Promise(r=>setTimeout(r,reduced()?0:t*speed));
 function svg(tag,a,p){const e=document.createElementNS(NS,tag);for(const k in a||{})e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
 function setXY(e,x,y){e.style.translate=x.toFixed(1)+'px '+y.toFixed(1)+'px';e._x=x;e._y=y;}
 const qpt=(p0,p1,h,k)=>{const cx=(p0[0]+p1[0])/2,cy=Math.min(p0[1],p1[1])-h,u=1-k;return[u*u*p0[0]+2*u*k*cx+k*k*p1[0],u*u*p0[1]+2*u*k*cy+k*k*p1[1]];};

 /* ---------- sound tokens: synthesised, peak --cc-sfx-peak, host mute honoured on every call ---------- */
 const sfx=(()=>{let on=true,ctx=null,m=null,buf=null;
  function ac(){if(!on||global.__MAX_MUTED__)return null;if(!ctx){const C=global.AudioContext||global.webkitAudioContext;if(!C)return null;ctx=new C();const comp=ctx.createDynamicsCompressor();m=ctx.createGain();m.gain.value=.7;m.connect(comp);comp.connect(ctx.destination);
   const len=ctx.sampleRate*2;buf=ctx.createBuffer(1,len,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}if(ctx.state==='suspended')ctx.resume();return ctx;}
  function env(g,t,pk,at,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,pk),t+Math.max(.002,at));g.gain.exponentialRampToValueAtTime(.0001,t+d);}
  function nz(o){const a=ac();if(!a)return;const t=a.currentTime+(o.at||0),d=Math.max(.012,o.dur);const s=a.createBufferSource();s.buffer=buf;const f=a.createBiquadFilter();f.type=o.type||'bandpass';f.Q.value=o.q||1;
   f.frequency.setValueAtTime(o.f0,t);f.frequency.exponentialRampToValueAtTime(o.f1||o.f0,t+d);const g=a.createGain();env(g,t,o.g,Math.min(o.atk||.008,d*.9),d);s.connect(f);f.connect(g);g.connect(m);s.start(t,Math.random()*Math.max(0,1.9-d),d+.05);}
  function tn(o){const a=ac();if(!a)return;const t=a.currentTime+(o.at||0),d=o.dur;const os=a.createOscillator();os.type=o.wave||'sine';os.frequency.setValueAtTime(o.f0,t);os.frequency.exponentialRampToValueAtTime(o.f1||o.f0,t+d);
   const g=a.createGain();env(g,t,o.g,Math.min(.006,d*.5),d);os.connect(g);g.connect(m);os.start(t);os.stop(t+d+.05);}
  const P={tick(){nz({type:'highpass',f0:3200,q:.8,g:.09,dur:.012});},pop(){tn({f0:660,dur:.03,g:.07});},
   drop(){tn({f0:300,f1:220,dur:.07,g:.12});nz({type:'lowpass',f0:600,g:.07,dur:.03});},
   whoosh(d){nz({type:'bandpass',f0:500,f1:1800,q:1.1,g:.1,dur:d||.5,atk:(d||.5)*.4});},click(){nz({type:'highpass',f0:3000,g:.1,dur:.015});},
   scratch(d){nz({type:'bandpass',f0:2800,q:.9,g:.07,dur:d||.3,atk:.03});},flip(){nz({type:'bandpass',f0:1200,f1:3000,q:1.5,g:.12,dur:.12,atk:.03});},
   right(){tn({f0:523,dur:.12,g:.12});tn({f0:784,dur:.18,g:.12,at:.1});},wrong(){tn({f0:392,dur:.12,g:.12});tn({f0:262,dur:.2,g:.12,at:.1});}};
  return Object.assign(P,{set(v){on=!!v;},get on(){return on;}});})();

 /* ---------- behaviour tokens: one function per token, all values from --cc-* ---------- */
 function clock(root){const E=n=>bezier(raw(root,n));return{fast:ms(root,'--cc-fast'),enter:ms(root,'--cc-enter'),morph:ms(root,'--cc-morph'),draw:ms(root,'--cc-draw'),beat:ms(root,'--cc-beat'),hold:ms(root,'--cc-hold'),
  stagger:ms(root,'--cc-stagger'),typeGap:ms(root,'--cc-type-gap'),mergeAt:num(root,'--cc-merge-at')||.55,fadeAt:num(root,'--cc-fade-at')||.6,
  move:E('--cc-ease-move'),in:E('--cc-ease-in'),out:E('--cc-ease-out'),lin:p=>p,
  rise:num(root,'--cc-rise'),arcLift:num(root,'--cc-arc-lift'),hopLift:num(root,'--cc-hop-lift'),shake:num(root,'--cc-shake'),teeter:num(root,'--cc-teeter')};}
 const behaviours={
  appear(el,c,{x=el._x,y=el._y}={}){setXY(el,x,y+c.rise);return tween(c.enter,k=>{setXY(el,x,y+c.rise*(1-k));el.style.opacity=k;},c.out);},
  fadeIn(el,c,D){const o0=+(el.style.opacity||0);return tween(D??c.enter,k=>{el.style.opacity=lerp(o0,1,k);},c.out);},
  leave(el,c,D){const o0=el.style.opacity===''?1:+el.style.opacity;return tween(D??c.enter,k=>{el.style.opacity=lerp(o0,0,k);},c.in);},
  glide(el,c,x,y,D){const x0=el._x,y0=el._y;return tween(D??c.morph,k=>setXY(el,lerp(x0,x,k),lerp(y0,y,k)),c.move);},
  arc(el,c,x,y,{lift,D}={}){const x0=el._x,y0=el._y,h=lift??c.arcLift;return tween(D??c.morph,k=>{const q=qpt([x0,y0],[x,y],h,k);setXY(el,q[0],q[1]);},c.move);},
  converge(el,c,x,y){const x0=el._x,y0=el._y;return tween(c.morph,(k,p)=>{setXY(el,lerp(x0,x,k),lerp(y0,y,k));el.style.opacity=p<c.fadeAt?1:1-(p-c.fadeAt)/(1-c.fadeAt);},c.move);},
  swapGlyph(el,c,text){return tween(c.fast/2,k=>el.style.opacity=1-k).then(()=>{el.textContent=text;return tween(c.fast/2,k=>el.style.opacity=k);});},
  turnGlyph(el,c,text){sfx.flip();return tween(c.morph,k=>{el.style.rotate=(180*k).toFixed(1)+'deg';},c.move).then(()=>{el.textContent=text;el.style.rotate='';});},
  tint(el,c,hue){if(hue)el.dataset.hue=hue;else delete el.dataset.hue;return wait(c.enter);},
  mute(el){el.dataset.state='muted';},unmute(el){delete el.dataset.state;},
  teeter(el,c){return tween(c.morph,(k,p)=>{el.style.rotate=(Math.sin(p*Math.PI*2)*c.teeter).toFixed(2)+'deg';}).then(()=>el.style.rotate='');}
 };

 /* ---------- working board: lines of working, each born from the line above ---------- */
 const KIND=/^([+\-−×÷=<>≤≥:()%√]|of|in)$/;
 function createWorking(board,opts={}){
  const layoutName=opts.layout||'working';let area,ov,Bx,lines,cur,uid,frame,frameOn,frameR,arcs,c,L,mode,ledgerEls;
  const say=opts.onSay||(()=>{});
  function readLayout(){const p=layoutName==='problem';const g=n=>num(board,n);
   return{x:p?g('--cc-problem-x'):g('--cc-work-x'),y:g('--cc-work-y'),pitch:p?g('--cc-work-pitch-compact'):g('--cc-work-pitch'),pitchF:p?g('--cc-work-pitch-compact-frac'):g('--cc-work-pitch-frac'),
    gap:g('--cc-work-gap'),tight:g('--cc-work-tight'),hang:g('--cc-work-hang'),bottom:p?g('--cc-problem-bottom'):g('--cc-work-bottom'),top:24};}
  function reset(m){board.innerHTML='';area=document.createElement('div');area.className='cc-work';if(layoutName==='problem')area.dataset.density='compact';board.appendChild(area);
   ov=svg('svg',{viewBox:'0 0 924 520',width:924,height:520,class:'cc-work-ov'},area);Bx={};lines=[];cur=null;uid=0;frameOn=false;arcs=[];ledgerEls={};mode=m||'eq';
   frame=document.createElement('div');frame.className='cc-work-frame';frame.style.opacity=0;area.appendChild(frame);c=clock(board);L=readLayout();
   const pr=mk('0','num');L.fs=parseFloat(getComputedStyle(pr).fontSize);pr.remove();L.frac=L.fs*.68;L.sup=L.fs*.42;}
  function mk(txt,kind){const e=document.createElement('span');e.className='cc-work-token';e.dataset.kind=kind;e.textContent=txt;e.style.opacity=0;area.appendChild(e);return e;}
  function one(t){let id;const m=t.match(/^([A-Za-z]\w*)=(.+)$/);if(m){id=m[1];t=m[2];}else id='u'+(++uid);let tight=false,kind='num';
   if(t[0]==='~'){tight=true;t=t.slice(1);}if(t[0]==='^'){tight=true;kind='sup';t=t.slice(1);}else if(t[0]==='_'){tight=true;kind='rad';t=t.slice(1);}
   else if(t[0]==='#'){kind='name';t=t.slice(1);}else if(t[0]==='&'){kind='unit';t=t.slice(1);}
   else if(/^[a-z]$/.test(t))kind='var';else if(KIND.test(t))kind='op';
   const n={id,k:'t',txt:t,tight,el:mk(t,kind)};if(kind==='name')n.el.dataset.role='action';n.el._n=n;Bx[id]=n;return n;}
  function parse(spec){const toks=(spec||'').match(/\S+/g)||[],out=[];let i=0;
   while(i<toks.length){const t=toks[i];if(/\[$/.test(t)){const id=t.length>1?t.slice(0,-2):'f'+(++uid),num=[],den=[];let side=num;i++;
     while(i<toks.length&&toks[i]!==']'){if(toks[i]==='/')side=den;else side.push(one(toks[i]));i++;}i++;
     const bar=document.createElement('div');bar.className='cc-work-bar';bar.style.opacity=0;area.appendChild(bar);const n={id,k:'f',num,den,bar,tight:false};Bx[id]=n;out.push(n);continue;}
    out.push(one(t));i++;}return out;}
  const els=n=>n.k==='t'?[n.el]:[...n.num.flatMap(els),...n.den.flatMap(els),n.bar];
  const isK=(n,k)=>n.k==='t'&&n.el.dataset.kind===k;
  const wOf=n=>n.k==='t'?n.el.offsetWidth:Math.max(rw(n.num),rw(n.den))+L.fs*.4;
  const gap=(n,p)=>{if(n.k!=='t'||!n.tight)return L.gap;if(isK(n,'rad')&&p&&isK(p,'rad'))return 0;return isK(n,'sup')?1:L.tight;};
  const rw=list=>list.reduce((s,n,i)=>s+(i?gap(n,list[i-1]):0)+wOf(n),0);
  function targets(list,x,cy,out){const hg=n=>n.hangGap??L.hang;let cx=x;if(list[0]&&list[0].hang)cx=x-wOf(list[0])-hg(list[0]);
   list.forEach((n,i)=>{if(i)cx+=list[i-1].hang?hg(list[i-1]):gap(n,list[i-1]);const W=wOf(n);
    if(n.k==='t'){const h=n.el.offsetHeight;out.push({e:n.el,x:cx,y:cy-h/2-(isK(n,'sup')?L.sup:0)});}
    else{const nw=rw(n.num),dw=rw(n.den);targets(n.num,cx+(W-nw)/2,cy-L.frac,out);targets(n.den,cx+(W-dw)/2,cy+L.frac,out);out.push({e:n.bar,x:cx,y:cy-1,w:W});}cx+=W;});return out;}
  function relayout(line,D,arcSet){if(line.fixed)return Promise.resolve();return Promise.all(targets(line.items,line.x,line.y,[]).map(o=>{const e=o.e;
    if(e._x==null){setXY(e,o.x,o.y);if(o.w!=null){e.style.width=o.w+'px';e._w=o.w;}return null;}
    const x0=e._x,y0=e._y,w0=e._w==null?o.w:e._w,arc=arcSet&&arcSet.has(e);
    return tween(D,k=>{if(arc){const q=qpt([x0,y0],[o.x,o.y],c.arcLift,k);setXY(e,q[0],q[1]);}else setXY(e,lerp(x0,o.x,k),lerp(y0,o.y,k));if(o.w!=null){e.style.width=lerp(w0,o.w,k).toFixed(1)+'px';e._w=o.w;}},c.move);}));}
  const hasF=items=>items.some(n=>n.k==='f');
  const nextY=(prev,items)=>prev.y+((hasF(prev.items)||hasF(items))?L.pitchF:L.pitch);
  const work=()=>lines.filter(l=>!l.fixed&&!l.gone);
  async function ensure(line){if(line.y<=L.bottom)return;const dy=line.y-L.bottom;line.y-=dy;const ps=[];
   work().forEach(l=>{if(l===line)return;l.y-=dy;if(l.y<L.top+(layoutName==='problem'?L.y:0)){l.gone=true;l.items.forEach(n=>els(n).forEach(e=>ps.push(behaviours.leave(e,c))));}else ps.push(relayout(l,c.morph));});
   arcs.forEach(a=>a.remove());arcs=[];if(frameOn){frameOn=false;ps.push(behaviours.leave(frame,c,c.fast));}
   area.querySelectorAll('.cc-work-answer').forEach(b=>ps.push(behaviours.leave(b,c,c.fast)));
   ov.querySelectorAll('.cc-work-rule').forEach(r=>{const y=+r.getAttribute('y1')-dy;r.setAttribute('y1',y);r.setAttribute('y2',y);});sfx.whoosh(.5);await Promise.all(ps);}
  function locate(id){const look=list=>{for(let i=0;i<list.length;i++){const n=list[i];if(n.id===id)return{list,i,n};if(n.k==='f'){const r=look(n.num)||look(n.den);if(r)return r;}}return null;};
   for(let k=lines.length-1;k>=0;k--){if(lines[k].gone)continue;const r=look(lines[k].items);if(r){r.line=lines[k];return r;}}throw Error('no token '+id);}
  const lineOf=R=>R.line||lines.find(l=>l.items===R.list)||cur;
  function bounds(es){const b=es.map(e=>[e._x,e._y,e._x+(e._w!=null&&e.classList.contains('cc-work-bar')?e._w:e.offsetWidth),e._y+e.offsetHeight]);
   return[Math.min(...b.map(v=>v[0])),Math.min(...b.map(v=>v[1])),Math.max(...b.map(v=>v[2])),Math.max(...b.map(v=>v[3]))];}
  const centre=es=>{const b=bounds(es);return[(b[0]+b[2])/2,(b[1]+b[3])/2];};
  function cloneN(n){if(n.k==='t'){const e=n.el.cloneNode(true);area.appendChild(e);delete e.dataset.state;setXY(e,n.el._x,n.el._y);e.style.opacity=1;e.style.rotate='';const m={id:n.id,k:'t',txt:n.txt,tight:n.tight,hang:n.hang,hangGap:n.hangGap,el:e};e._n=m;Bx[n.id]=m;return m;}
   const bar=n.bar.cloneNode(true);area.appendChild(bar);delete bar.dataset.state;setXY(bar,n.bar._x,n.bar._y);bar._w=n.bar._w;bar.style.width=bar._w+'px';bar.style.opacity=1;const m={id:n.id,k:'f',num:n.num.map(cloneN),den:n.den.map(cloneN),bar};Bx[n.id]=m;return m;}
  const toHistory=line=>line.items.forEach(n=>els(n).forEach(behaviours.mute));
  function copyEl(e){const k=e.cloneNode(true);k.classList.remove('cc-problem-q','cc-ledger-value');k.classList.add('cc-work-token');k.dataset.kind=k.dataset.kind||'num';area.appendChild(k);delete k.dataset.state;setXY(k,e._x,e._y);k.style.opacity=1;return k;}
  function rel(el){const r=el.getBoundingClientRect(),br=board.getBoundingClientRect(),s=br.width/924;return{x:(r.left-br.left)/s,y:(r.top-br.top)/s,w:r.width/s,h:r.height/s};}
  const hang=()=>{const q=parse('=')[0];q.hang=true;return q;};
  /* --- ops: each is a recipe of behaviour tokens (see components/behaviour-tokens.json → recipes) --- */
  const OP={
   async newline(spec,o={}){const items=parse(spec);const prev=cur;if(mode==='expr'&&prev&&!o.side&&!o.row&&!o.x)items.unshift(hang());if(o.row)o.side=true;
    const line={x:o.x||L.x,y:o.y!=null?o.y:(o.row&&prev?prev.y:(prev&&!o.side?nextY(prev,items):L.y)),items};
    if(!o.side){await ensure(line);if(prev&&!o.keep)toHistory(prev);}lines.push(line);if(!o.side)cur=line;
    const tg=targets(items,line.x,line.y,[]);const from=o.from||{};const ps=[],plain=[];
    tg.forEach(t=>{const n=t.e._n,src=n&&from[n.id];if(t.w!=null){setXY(t.e,t.x,t.y);t.e.style.width=t.w+'px';t.e._w=t.w;ps.push(behaviours.fadeIn(t.e,c));return;}
     if(src){const s=locate(src).n.el;setXY(t.e,s._x,s._y);t.e.style.opacity=1;sfx.whoosh(.5);ps.push(behaviours.arc(t.e,c,t.x,t.y,{lift:c.arcLift*.6}));}else plain.push(t);});
    for(const t of plain){sfx.tick();ps.push(behaviours.appear(t.e,c,{x:t.x,y:t.y}));await wait(c.typeGap);}await Promise.all(ps);},
   async down(){const P=cur;const items=P.items.map(cloneN);let q=null,chain=P.chain||null,x=P.x,drop=null;
    if(!chain&&items[0]&&isK(items[0],'name')&&items[1]&&items[1].txt==='='){const t=targets(P.items,P.x,P.y,[]);const ex=items[2]?t.find(o=>o.e===P.items[2].el||(P.items[2].k==='f'&&o.e===P.items[2].bar)):null;
     chain={name:items[0].txt,x:P.x};drop=items.shift();items[0].hang=true;items[0].hangGap=L.gap;x=ex?ex.x:P.x;}
    if(!chain&&mode==='expr'&&!(items[0]&&items[0].hang)){q=hang();items.unshift(q);}
    const line={x,y:nextY(P,items),items,chain};if(drop)behaviours.leave(drop.el,c,c.fast).then(()=>drop.el.remove());await ensure(line);toHistory(P);lines.push(line);cur=line;sfx.whoosh(.5);
    if(q){const t=targets(items,line.x,line.y,[]).find(t=>t.e===q.el);setXY(q.el,t.x-10,t.y);}await Promise.all([relayout(line,c.morph),q?behaviours.fadeIn(q.el,c):null]);},
   async focus(ids){const es=ids.flatMap(id=>els(locate(id).n)),b=bounds(es),r={x:b[0]-10,y:b[1]-6,w:b[2]-b[0]+20,h:b[3]-b[1]+12};
    if(!frameOn){frameOn=true;frameR=r;setXY(frame,r.x,r.y);frame.style.width=r.w+'px';frame.style.height=r.h+'px';sfx.click();await behaviours.fadeIn(frame,c,c.fast);return;}
    const f=frameR;frameR=r;await tween(c.enter,k=>{setXY(frame,lerp(f.x,r.x,k),lerp(f.y,r.y,k));frame.style.width=lerp(f.w,r.w,k)+'px';frame.style.height=lerp(f.h,r.h,k)+'px';},c.move);},
   async unfocus(){if(!frameOn)return;frameOn=false;await behaviours.leave(frame,c,c.fast);},
   async tint(ids,hue){ids.forEach(id=>els(locate(id).n).forEach(e=>{e.dataset.hue=hue;}));sfx.click();await wait(c.enter);},
   async untint(ids){ids.forEach(id=>els(locate(id).n).forEach(e=>{delete e.dataset.hue;}));},
   async role(ids,r){ids.forEach(id=>els(locate(id).n).forEach(e=>{if(r)e.dataset.role=r;else delete e.dataset.role;}));await wait(c.fast);},
   async dim(ids){ids.forEach(id=>els(locate(id).n).forEach(behaviours.mute));sfx.click();await wait(c.enter);},
   async split(id,spec){const R=locate(id),old=R.n,nn=parse(spec);const oe=els(old),[cx,cy]=centre(oe);
    nn.forEach(n=>els(n).forEach(e=>{setXY(e,cx-e.offsetWidth/2,cy-e.offsetHeight/2);if(e.classList.contains('cc-work-bar'))e._w=0;}));R.list.splice(R.i,1,...nn);sfx.pop();
    await Promise.all([relayout(lineOf(R),c.morph),...oe.map(e=>behaviours.leave(e,c)),...nn.flatMap(els).map(e=>behaviours.fadeIn(e,c))]);oe.forEach(e=>e.remove());},
   async merge(ids,spec){const locs=ids.map(locate),list=locs[0].list,line=lineOf(locs[0]);const oe=locs.flatMap(l=>els(l.n));const idx=Math.min(...locs.map(l=>list.indexOf(l.n)));
    const nn=parse(spec);locs.forEach(l=>{const j=list.indexOf(l.n);if(j>=0)list.splice(j,1);});list.splice(idx,0,...nn);sfx.pop();
    const tm=new Map(targets(line.items,line.x,line.y,[]).map(t=>[t.e,t]));const nb=nn.flatMap(els);nb.forEach(e=>{const t=tm.get(e);if(t){setXY(e,t.x,t.y);if(t.w!=null){e.style.width=t.w+'px';e._w=t.w;}}});
    const nc=centre(nb);await Promise.all([...oe.map(e=>behaviours.converge(e,c,nc[0]-e.offsetWidth/2,nc[1]-e.offsetHeight/2)),relayout(line,c.morph),wait(c.morph*c.mergeAt).then(()=>Promise.all(nb.map(e=>behaviours.fadeIn(e,c))))]);
    oe.forEach(e=>e.remove());sfx.drop();},
   async text(id,t){const n=locate(id).n;await behaviours.swapGlyph(n.el,c,t);n.txt=t;},
   async move(ids,where,o={}){const R=locate(ids[0]),list=R.list,line=lineOf(R);const nodes=ids.map(id=>list.find(n=>n.id===id));nodes.forEach(n=>list.splice(list.indexOf(n),1));
    const pre=o.prefix?parse(o.prefix):[];pre.forEach(n=>{const e0=nodes[0].el;setXY(n.el,e0._x-n.el.offsetWidth-6,e0._y);});
    const drops=(o.drop||[]).map(id=>list.find(n=>n.id===id)).filter(Boolean);drops.forEach(n=>list.splice(list.indexOf(n),1));
    const idx=where.start?(list[0]&&list[0].hang?1:0):where.end?list.length:where.after?list.findIndex(n=>n.id===where.after)+1:list.findIndex(n=>n.id===where.before);list.splice(idx,0,...pre,...nodes);
    if(o.set)for(const id in o.set){const n=Bx[id],s=o.set[id];if(s.tight!=null)n.tight=s.tight;if(s.kind)n.el.dataset.kind=s.kind;}
    sfx.whoosh(c.morph/1000);const arcSet=new Set(nodes.flatMap(els).concat(pre.flatMap(els)));
    const ps=[relayout(line,c.morph,arcSet),...pre.map(n=>behaviours.fadeIn(n.el,c)),...drops.flatMap(els).map(e=>behaviours.leave(e,c))];
    if(o.text)ps.push(wait(c.morph/2).then(()=>Promise.all(Object.keys(o.text).map(id=>OP.text(id,o.text[id])))));await Promise.all(ps);drops.flatMap(els).forEach(e=>e.remove());sfx.drop();},
   async flip(id,t){const n=locate(id).n;await behaviours.turnGlyph(n.el,c,t);n.txt=t;},
   async cancel(ids,o={}){const locs=ids.map(locate);const ls=new Set(locs.map(lineOf));const strikes=[];
    for(const l of locs){const b=bounds(els(l.n)),s=svg('line',{x1:b[0]-4,y1:b[3]-4,x2:b[0]-4,y2:b[3]-4,class:'cc-work-strike'},ov);strikes.push([s,b]);}
    sfx.scratch(.3);await tween(c.enter,k=>strikes.forEach(([s,b])=>{s.setAttribute('x2',lerp(b[0]-4,b[2]+4,k));s.setAttribute('y2',lerp(b[3]-4,b[1]+4,k));}),c.out);await wait(c.beat/2);
    const es=locs.flatMap(l=>els(l.n));let nn=[];if(o.to){const l0=locs[0];nn=parse(o.to);const [cx,cy]=centre(els(l0.n));nn.forEach(n=>setXY(n.el,cx-n.el.offsetWidth/2,cy-n.el.offsetHeight/2));l0.list.splice(l0.list.indexOf(l0.n),0,...nn);}
    locs.forEach(l=>{const j=l.list.indexOf(l.n);if(j>=0)l.list.splice(j,1);});
    await Promise.all([...es.map(e=>behaviours.leave(e,c)),...strikes.map(([s])=>behaviours.leave(s,c)),...nn.map(n=>behaviours.fadeIn(n.el,c))]);
    es.forEach(e=>e.remove());strikes.forEach(([s])=>s.remove());await Promise.all([...ls].map(l=>relayout(l,c.morph)));},
   async insert(spec,where,o={}){const nn=parse(spec);let list,line;
    if(where.after||where.before){const R=locate(where.after||where.before);list=R.list;line=lineOf(R);const j=list.indexOf(R.n);list.splice(where.after?j+1:j,0,...nn);}
    else{list=cur.items;line=cur;list.splice(where.start?(list[0]&&list[0].hang?1:0):list.length,0,...nn);}
    const tm=new Map(targets(line.items,line.x,line.y,[]).map(t=>[t.e,t]));
    nn.flatMap(els).forEach(e=>{const t=tm.get(e);if(o.from){const s=locate(o.from).n.el;setXY(e,s._x,s._y);e.style.opacity=1;}else setXY(e,t.x,t.y+c.rise);if(t&&t.w!=null){e.style.width=t.w+'px';e._w=t.w;}});
    sfx.pop();await Promise.all([relayout(line,c.morph,o.from?new Set(nn.flatMap(els)):null),...(o.from?[]:nn.flatMap(els).map(e=>behaviours.fadeIn(e,c)))]);},
   async remove(ids){const locs=ids.map(locate);const es=locs.flatMap(l=>els(l.n));const ls=new Set(locs.map(lineOf));locs.forEach(l=>{const j=l.list.indexOf(l.n);if(j>=0)l.list.splice(j,1);});
    await Promise.all([...es.map(e=>behaviours.leave(e,c)),...[...ls].map(l=>relayout(l,c.morph))]);es.forEach(e=>e.remove());},
   async tight(id,v){locate(id).n.tight=v;},
   async arcs(src,tgts){const s=locate(src).n.el,p0=[s._x+s.offsetWidth/2,s._y+6];sfx.scratch(.5);
    await Promise.all(tgts.map((t,i)=>{const e=locate(t).n.el,p1=[e._x+e.offsetWidth/2,e._y+6],h=40+i*28;const p=svg('path',{d:'M'+p0[0]+' '+p0[1]+' Q'+((p0[0]+p1[0])/2)+' '+(Math.min(p0[1],p1[1])-2*h)+' '+p1[0]+' '+p1[1],class:'cc-work-arc'},ov);arcs.push(p);p.style.opacity=0;return behaviours.fadeIn(p,c,c.morph);}));},
   async clearArcs(){await Promise.all(arcs.map(a=>behaviours.leave(a,c)));arcs.forEach(a=>a.remove());arcs=[];},
   async distribute(src,entries,o={}){const R=locate(src),list=R.list,line=lineOf(R),s=R.n.el;const news=[];
    entries.forEach(en=>{const nn=parse(en.spec);const j=list.findIndex(n=>n.id===en.before);list.splice(j,0,...nn);nn.forEach(n=>{setXY(n.el,s._x,s._y);n.el.style.opacity=1;});news.push(...nn);});
    const drops=(o.drop||[]).map(id=>list.find(n=>n.id===id)).filter(Boolean);drops.forEach(n=>list.splice(list.indexOf(n),1));
    sfx.whoosh(.6);await Promise.all([relayout(line,c.morph,new Set(news.flatMap(els))),...drops.flatMap(els).map(e=>behaviours.leave(e,c)),OP.clearArcs()]);drops.flatMap(els).forEach(e=>e.remove());sfx.drop();},
   async collect(ids,spec,o={}){const srcs=ids.map(id=>locate(id).n.el);let a=null;
    if(o.arc){const p=srcs[0],q=srcs[1],p0=[p._x+p.offsetWidth/2,p._y+6],p1=[q._x+q.offsetWidth/2,q._y+6];a=svg('path',{d:'M'+p0[0]+' '+p0[1]+' Q'+((p0[0]+p1[0])/2)+' '+(Math.min(p0[1],p1[1])-70)+' '+p1[0]+' '+p1[1],class:'cc-work-arc'},ov);a.style.opacity=0;await behaviours.fadeIn(a,c,c.fast);await wait(c.beat/2);}
    const cps=srcs.map(copyEl);const nn=parse(spec);cur.items.push(...nn);const tm=new Map(targets(cur.items,cur.x,cur.y,[]).map(t=>[t.e,t]));nn.flatMap(els).forEach(e=>{const t=tm.get(e);setXY(e,t.x,t.y);});
    const nc=centre(nn.flatMap(els));sfx.whoosh(.6);
    await Promise.all([...cps.map(k=>{const x=nc[0]-k.offsetWidth/2,y=nc[1]-k.offsetHeight/2;return Promise.all([behaviours.arc(k,c,x,y,{lift:40}),tween(c.morph,(q,p)=>{k.style.opacity=p<c.fadeAt?1:1-(p-c.fadeAt)/(1-c.fadeAt);})]);}),
     wait(c.morph*c.mergeAt).then(()=>Promise.all(nn.flatMap(els).map(e=>behaviours.fadeIn(e,c)))),a?wait(c.morph/2).then(()=>behaviours.leave(a,c)):null]);cps.forEach(k=>k.remove());if(a)a.remove();sfx.drop();},
   async replace(id,spec,o){const R=locate(id),list=R.list,line=lineOf(R),old=R.n;const s=locate(o.from).n.el;const nn=parse(spec);list.splice(R.i,1,...nn);nn.forEach(n=>{setXY(n.el,s._x,s._y);n.el.style.opacity=1;});
    sfx.whoosh(.6);await Promise.all([relayout(line,c.morph,new Set(nn.flatMap(els))),behaviours.leave(old.el,c)]);old.el.remove();sfx.drop();},
   async count(ids){const bs=[];for(let i=0;i<ids.length;i++){const e=locate(ids[i]).n.el,bd=document.createElement('div');bd.className='cc-work-badge';bd.textContent=i+1;area.appendChild(bd);
     setXY(bd,e._x+e.offsetWidth/2-12,e._y-26);bd.style.opacity=0;bs.push(bd);sfx.tick();await behaviours.fadeIn(bd,c,c.fast);await wait(c.beat*.6);}
    await wait(c.beat);await Promise.all(bs.map(b=>behaviours.leave(b,c)));bs.forEach(b=>b.remove());},
   async hop(id,n){for(let k=0;k<n;k++){const R=locate(id),list=R.list,line=lineOf(R);let j=list.indexOf(R.n);const base=list[0]&&list[0].hang?1:0;
     if(j===base){const z=parse('~0')[0];list.splice(base,0,z);const t=targets(line.items,line.x,line.y,[]).find(t=>t.e===z.el);setXY(z.el,t.x,t.y);sfx.pop();await Promise.all([relayout(line,c.enter),behaviours.fadeIn(z.el,c)]);j=base+1;}
     list.splice(j,1);list.splice(j-1,0,R.n);sfx.tick();await relayout(line,c.enter*1.3,new Set([R.n.el]));await wait(c.typeGap);}},
   async joinFrac(fa,opId,fb,o={}){const R=locate(fa),list=R.list,line=lineOf(R),A=R.n,op=list.find(n=>n.id===opId),Bn=list.find(n=>n.id===fb);const ids=o.ids||[];
    const d1=parse((ids[0]?ids[0]+'=':'')+'×')[0];setXY(d1.el,op.el._x,op.el._y);let d2=null;list.splice(list.indexOf(op),1);
    if(Bn.k==='f'){d2=parse((ids[1]?ids[1]+'=':'')+'×')[0];setXY(d2.el,op.el._x,op.el._y);A.num.push(d1,...Bn.num);A.den.push(d2,...Bn.den);}else A.num.push(d1,Bn);
    list.splice(list.indexOf(Bn),1);sfx.whoosh(.6);
    await Promise.all([relayout(line,c.morph),behaviours.leave(op.el,c),behaviours.fadeIn(d1.el,c),d2?behaviours.fadeIn(d2.el,c):null,Bn.k==='f'?behaviours.leave(Bn.bar,c):null]);op.el.remove();if(Bn.k==='f')Bn.bar.remove();sfx.drop();},
   async addFrac(fa,plusId,fb){const R=locate(fa),list=R.list,line=lineOf(R),A=R.n,pl=list.find(n=>n.id===plusId),Bn=list.find(n=>n.id===fb);
    list.splice(list.indexOf(pl),1);list.splice(list.indexOf(Bn),1);A.num.push(pl,...Bn.num);const de=Bn.den.flatMap(els);
    const tt=targets(line.items,line.x,line.y,[]).find(t=>t.e===A.den[0].el);sfx.whoosh(.6);
    await Promise.all([relayout(line,c.morph),...de.map(e=>behaviours.converge(e,c,tt.x,tt.y)),behaviours.leave(Bn.bar,c)]);de.forEach(e=>e.remove());Bn.bar.remove();sfx.drop();},
   async unfrac(fid){const R=locate(fid),F=R.n;const es=[...F.den.flatMap(els),F.bar];R.list.splice(R.i,1,...F.num);await Promise.all([...es.map(e=>behaviours.leave(e,c)),relayout(lineOf(R),c.morph)]);es.forEach(e=>e.remove());},
   async note(id,txt){const R=locate(id),line=lineOf(R);const b=bounds(line.items.flatMap(els));const e=mk(txt,'note');setXY(e,b[2]+22,line.y-e.offsetHeight/2);await behaviours.fadeIn(e,c);},
   async rule(){const b=bounds(cur.items.flatMap(els)),y=cur.y+L.fs*.9;const l=svg('line',{x1:b[0]-10,y1:y,x2:b[0]-10,y2:y,class:'cc-work-rule'},ov);await tween(c.enter,k=>l.setAttribute('x2',lerp(b[0]-10,b[2]+10,k)),c.out);},
   async sum(groups){const line={x:cur.x,y:cur.y+L.pitch*1.1,items:[]};await ensure(line);work().forEach(toHistory);lines.push(line);cur=line;
    for(const g of groups){const cps=g.ids.map(id=>copyEl(locate(id).n.el));
     if(!g.spec){sfx.whoosh(.4);await Promise.all(cps.map(e=>{const y0=e._y;return tween(c.morph,(k,p)=>{setXY(e,e._x,lerp(y0,y0+40,k));e.style.opacity=p<.5?1:1-(p-.5)/.5;},c.move);}));cps.forEach(e=>e.remove());continue;}
     const nn=parse(g.spec);line.items.push(...nn);const tm=new Map(targets(line.items,line.x,line.y,[]).map(t=>[t.e,t]));nn.flatMap(els).forEach(e=>{const t=tm.get(e);setXY(e,t.x,t.y);});const nc=centre(nn.flatMap(els));sfx.whoosh(.5);
     await Promise.all([...cps.map(k=>behaviours.converge(k,c,nc[0]-k.offsetWidth/2,nc[1]-k.offsetHeight/2)),wait(c.morph*c.mergeAt).then(()=>Promise.all(nn.flatMap(els).map(e=>behaviours.fadeIn(e,c))))]);cps.forEach(k=>k.remove());sfx.drop();}},
   async box(){if(cur.chain&&cur.items[0]&&cur.items[0].hang){const nm=parse('#'+cur.chain.name)[0];cur.items[0].hang=false;delete cur.items[0].hangGap;cur.items.unshift(nm);cur.x=cur.chain.x;cur.chain=null;
     const t=targets(cur.items,cur.x,cur.y,[]).find(o=>o.e===nm.el);await Promise.all([behaviours.appear(nm.el,c,{x:t.x,y:t.y}),relayout(cur,c.morph)]);}
    const es=cur.items.filter(n=>!n.hang).flatMap(els),b=bounds(es),bx=document.createElement('div');bx.className='cc-work-answer';bx.dataset.role='action';area.insertBefore(bx,frame.nextSibling);
    setXY(bx,b[0]-12,b[1]-8);bx.style.width=(b[2]-b[0]+24)+'px';bx.style.height=(b[3]-b[1]+16)+'px';bx.style.opacity=0;await behaviours.fadeIn(bx,c);sfx.right();},
   async wait(t){await wait(t);},
   /* --- multi-step problems --- */
   async statement(text){const p=document.createElement('p');p.className='cc-problem-statement';
    p.innerHTML=String(text).replace(/\{(\w+):([^}]+)\}/g,(m,id,v)=>'<span class="cc-problem-q" data-role="emphasis" data-q="'+id+'">'+v+'</span>');area.appendChild(p);p.style.opacity=0;
    await behaviours.fadeIn(p,c);const items=[...p.querySelectorAll('[data-q]')].map(s=>{const r=rel(s);s._x=r.x;s._y=r.y-(L.fs-r.h)/2;return{id:s.dataset.q,k:'t',el:s};});
    lines.unshift({fixed:true,items});const r=rel(p);L.y=Math.max(L.y,r.y+r.h+L.fs*1.5);},
   async figure(f){const g=svg('g',{class:'cc-problem-figure'},ov);const items=[];g.style.opacity=0;
    (f.parts||[]).forEach(pt=>{const e=svg('polygon',{points:pt.points.map(p=>p.join(',')).join(' '),'data-part':pt.id},g);});
    (f.marks||[]).forEach(mk2=>svg('path',{d:mk2,class:'cc-problem-mark'},g));
    (f.labels||[]).forEach(lb=>{const s=document.createElement('span');s.className='cc-problem-q cc-problem-label';s.dataset.role='emphasis';s.dataset.q=lb.id;s.textContent=lb.text;area.appendChild(s);
     setXY(s,lb.x-s.offsetWidth/2,lb.y-s.offsetHeight/2);s.style.opacity=0;items.push({id:lb.id,k:'t',el:s});});
    lines.unshift({fixed:true,items});await Promise.all([behaviours.fadeIn(g,c),...items.map(i=>behaviours.fadeIn(i.el,c))]);
    items.forEach(i=>{i.el._y=i.el._y-(L.fs-i.el.offsetHeight)/2;i.el._x=i.el._x;});},
   async shade(partId,role){const e=ov.querySelector('[data-part="'+partId+'"]');if(role){e.dataset.role=role;e.classList.add('is-shaded');}else{e.classList.remove('is-shaded');delete e.dataset.role;}sfx.tick();await wait(c.enter);},
   async ledger(items,at){const rail=document.createElement('div');rail.className='cc-ledger';area.appendChild(rail);if(at){rail.style.left=at.x+'px';rail.style.top=at.y+'px';}
    const nodes=items.map(it=>{const row=document.createElement('div');row.className='cc-ledger-item';row.dataset.role='action';row.dataset.state='muted';
     row.innerHTML='<span class="cc-ledger-name">'+it.name+'</span><span class="cc-ledger-label"></span><span class="cc-ledger-value">?</span>';row.querySelector('.cc-ledger-label').textContent=it.label;rail.appendChild(row);
     ledgerEls[it.id]=row;return{id:it.id,k:'t',el:row.querySelector('.cc-ledger-value')};});
    rail.style.opacity=0;await behaviours.fadeIn(rail,c);nodes.forEach(n=>{const r=rel(n.el);n.el._x=r.x;n.el._y=r.y-(L.fs-r.h)/2;});lines.unshift({fixed:true,items:nodes});},
   async deposit(tokenId,ledgerId,text){const src=locate(tokenId).n.el,row=ledgerEls[ledgerId],val=row.querySelector('.cc-ledger-value');const k=copyEl(src);const r=rel(val);
    sfx.whoosh(.6);await behaviours.arc(k,c,r.x+r.w/2-k.offsetWidth/2,r.y+r.h/2-k.offsetHeight/2,{lift:c.arcLift});val.textContent=text??src.textContent;delete row.dataset.state;
    const vr=rel(val);val._x=vr.x;val._y=vr.y-(L.fs-vr.h)/2;await behaviours.leave(k,c,c.fast);k.remove();sfx.drop();},
   async clear(){const ps=[];work().forEach(l=>{l.gone=true;l.items.forEach(n=>els(n).forEach(e=>ps.push(behaviours.leave(e,c))));});arcs.forEach(a=>ps.push(behaviours.leave(a,c)));
    area.querySelectorAll('.cc-work-answer').forEach(b=>ps.push(behaviours.leave(b,c)));ov.querySelectorAll('.cc-work-rule').forEach(r=>ps.push(behaviours.leave(r,c)));if(frameOn){frameOn=false;ps.push(behaviours.leave(frame,c,c.fast));}
    await Promise.all(ps);area.querySelectorAll('.cc-work-answer').forEach(b=>b.remove());ov.querySelectorAll('.cc-work-rule').forEach(r=>r.remove());arcs.forEach(a=>a.remove());arcs=[];
    lines=lines.filter(l=>l.fixed);cur=null;}
  };
  /* --- player: a script is data; a step is a list of ops --- */
  let script=null,at=0;
  function load(s){script=s;at=0;reset(s.mode);return api;}
  async function step(){if(!script||at>=script.steps.length)return false;const st=script.steps[at];say(st.say,at);for(const op of st.ops){if(!OP[op[0]])throw Error('Unknown op '+op[0]);await OP[op[0]](...op.slice(1));}at++;return true;}
  async function play(gapMs){while(await step())await wait(gapMs??c.beat);}
  const api={load,step,play,reset:()=>load(script),get index(){return at;},get length(){return script?script.steps.length:0;},ops:OP};
  return api;
 }
 global.ContentCanvasInteraction=Object.freeze({VERSION,behaviours,sfx,tween,wait,bezier,clock,createWorking,setSpeed(k){speed=k>0?k:1;}});
})(typeof window!=='undefined'?window:globalThis);
