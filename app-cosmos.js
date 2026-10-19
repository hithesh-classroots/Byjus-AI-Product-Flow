import htm from 'https://esm.sh/htm@3.1.1';
const R = window.React;
const { useState, useEffect, useRef, useCallback, forwardRef } = R;
const html = htm.bind(R.createElement);

/* Navigate to the standalone Teaching Room page (Resume a class → lesson) */
const TEACHING_ROOM_URL='Teaching Room.dc.html';
function openTeachingRoom(){ try{ window.location.href=encodeURI(TEACHING_ROOM_URL); }catch(e){} }

/* Navigate to the standalone Chapter Journey page (Max tap + Chapter Journey button) */
const CHAPTER_JOURNEY_URL='Chapter Journey - L&P.dc.html';
function openChapterJourney(){ try{ window.location.href=encodeURI(CHAPTER_JOURNEY_URL); }catch(e){} }

/* Navigate to the standalone Assessment page (product-level entry, sibling of Chapter Journey) */
const PRACTICE_URL='Assessment.dc.html';
function openPractice(){ try{ window.location.href=encodeURI(PRACTICE_URL); }catch(e){} }

/* Navigate to the Goals journey (Goal Page) — sibling of Chapter Journey and Challenges */
const GOALS_URL='Goal Page.dc.html';
function openGoals(){ try{ window.location.href=encodeURI(GOALS_URL); }catch(e){} }

/* ---------- tweaks bridge (values published by the DC shell's Component) ---------- */
function readTweaks(){ const t=window.__BYJUS_TWEAKS||{}; return { ambience:t.ambience||'cosmic', companions:t.companions||'duo', pace:t.pace||'balanced' }; }
function useTweaks(){ const [tw,setTw]=useState(readTweaks); useEffect(()=>{ const h=()=>setTw(readTweaks()); window.addEventListener('byjus-tweaks',h); return ()=>window.removeEventListener('byjus-tweaks',h); },[]); return tw; }

/* ---------- Mantine design tokens (verbatim from the bound system) ---------- */
const SYS='-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
/* ---- type scale: the only sizes/weights allowed in this product (see Type Scale.md) ---- */
const T={ display:38, title:30, heading:24, subheading:20, body:16, secondary:14, caption:12, eyebrow:11 };
const FW={ regular:500, bold:700, heavy:800 };
// ---- Cosmos theme: light galaxy / milky-way variant (indigo-violet primary) ----
const BLUE='#339af0', BLUE7='#1c7ed6', BLUE0='#e7f5ff', BLUE1='#d0ebff', BLUE2='#a5d8ff', BLUE9='#1864ab'; // Mantine blue — the product primary
const VIOLET='#7950f2', VIOLET0='#f3f0ff', VIOLET2='#d0bfff', VIOLET9='#5f3dc4';   // MAX
const TEAL='#f59f00', TEAL0='#fff9db', TEAL2='#ffe066', TEAL8='#e8590c', TEAL9='#d9480f'; // Spark = the yellow flash, as on every other screen
const GREEN='#2f9e44', RED='#e03131', REDF='#fa5252';
const ORANGE='#fd7e14', GRAPE='#be4bdb', CYAN='#15aabf', YELLOW='#f08c00';
const INK='#212529', TXT='#343a40', DIM='#868e96';                 // gray-9 / gray-8 / gray-6
const G0='#f6f5fd', G1='#efedfa', G2='#e6e3f5', G3='#ddd9ee', G4='#cdc8e2', G5='#a9a3c4'; // cosmic-tinted grays
const BORDER=G3, CARD='#ffffff';
/* Ambient blobs live in the canvas background stack (blur() cannot apply to one background layer, so
   the softness comes from the 70% transparent falloff instead). Three variants for the ambience tweak. */
const BLOB_V='radial-gradient(18% 28% at 12% 22%,var(--cv-blob-v),transparent 70%)';
const BLOB_W='radial-gradient(20% 30% at 86% 78%,var(--cv-blob-w),transparent 70%)';
const BLOB_V_SOFT='radial-gradient(18% 28% at 12% 22%,rgba(208,191,255,.12),transparent 70%)';
const BLOB_W_SOFT='radial-gradient(20% 30% at 86% 78%,rgba(255,216,168,.084),transparent 70%)';
const CANVAS_LIN='var(--cv-linear)';
const CANVAS=BLOB_V+','+BLOB_W+','+CANVAS_LIN;
const CANVAS_SERENE=BLOB_V_SOFT+','+BLOB_W_SOFT+','+CANVAS_LIN;
const canvasFor=(amb)=>amb==='spotlight'?CANVAS_LIN:(amb==='serene'?CANVAS_SERENE:CANVAS);
const SH_XS='0 2px 6px -3px rgba(70,46,146,.16)', SH_SM='0 6px 14px -8px rgba(70,46,146,.22)', SH_MD='0 10px 24px -12px rgba(70,46,146,.30)', SH_LG='0 14px 30px -18px rgba(70,46,146,.36)';
const cardSx={ background:CARD, border:'1.5px solid #dee2e6', borderRadius:14, boxShadow:SH_XS };
/* HUD (heads-up-display) glass panel — matches the planet-timeline chrome */
const hudSx={ background:'linear-gradient(158deg, #f3f4fd 0%, #e9ecfa 52%, #e0e3f5 100%)', border:'1px solid #c6caea', boxShadow:'0 14px 34px rgba(28,18,74,.16), inset 0 1px 0 rgba(255,255,255,.92), inset 0 0 0 1px rgba(255,255,255,.5)' };
function Rivets({inset=6,size=6}){ return null; }

/* Mantine components (resolved at render — assigned in mount before first paint) */
let M = {};

/* ---------- lightweight layout primitives (MUI-compatible props), rendered on the DC's React ---------- */
const SP={p:['padding'],px:['paddingLeft','paddingRight'],py:['paddingTop','paddingBottom'],pt:['paddingTop'],pb:['paddingBottom'],pl:['paddingLeft'],pr:['paddingRight'],m:['margin'],mx:['marginLeft','marginRight'],my:['marginTop','marginBottom'],mt:['marginTop'],mb:['marginBottom'],ml:['marginLeft'],mr:['marginRight'],gap:['gap'],rowGap:['rowGap'],columnGap:['columnGap']};
const BP={xs:0,sm:576,md:768,lg:992,xl:1200};
const BPORDER=['xs','sm','md','lg','xl'];
let __vw=(typeof window!=='undefined')?window.innerWidth:1280;
let __vh=(typeof window!=='undefined')?window.innerHeight:900;
function isPhone(){ return __vw < BP.md || __vh < 500; }
/* Height tiers describe a PHONE's height and nothing else. Without the isPhone() guard they
   fired on any desktop window 768px+ wide and 500-639px tall — a non-maximised laptop, or one
   with devtools docked — which hid Vyom and flipped the resume cards to the landscape row. */
// short = a phone that cannot hold the full hero (landscape phones)
function isShort(){ return isPhone() && __vh < 520; }
// compact = fits the whole hero, but only with a smaller mascot (iPhone SE at 571px)
function isCompact(){ return isPhone() && __vh < 640; }
function rv(v){
  if(!(v&&typeof v==='object'&&!Array.isArray(v))) return v;
  if(!('xs'in v||'sm'in v||'md'in v||'lg'in v||'xl'in v)) return v;
  let pick;
  for(let i=0;i<BPORDER.length;i++){ const k=BPORDER[i]; if(__vw>=BP[k]&&v[k]!==undefined) pick=v[k]; }
  if(pick===undefined) for(let i=0;i<BPORDER.length;i++){ if(v[BPORDER[i]]!==undefined){ pick=v[BPORDER[i]]; break; } }
  return pick;
}
function sxStyle(sx){ const out={},hover={}; if(!sx) return {out,hover};
  for(let k in sx){ let val=sx[k];
    if(k==='&:hover'){ const r=sxStyle(val); Object.assign(hover,r.out); continue; }
    if(k.charAt(0)==='&'||k.charAt(0)===':'){ continue; }
    val=rv(val);
    if(SP[k]){ const px=typeof val==='number'?val*8+'px':val; SP[k].forEach(c=>out[c]=px); continue; }
    out[k]=val;
  }
  return {out,hover};
}
const Box=forwardRef(function Box({children,sx,style,component,className,onClick,onMouseEnter,onMouseLeave,...rest},ref){
  const {out,hover}=sxStyle(sx); const hasHover=Object.keys(hover).length>0; const [h,setH]=useState(false);
  const Tag=component||'div';
  return html`<${Tag} ref=${ref} className=${className} style=${{...out,...(h?hover:{}),...style}} onClick=${onClick}
    onMouseEnter=${e=>{if(hasHover)setH(true);onMouseEnter&&onMouseEnter(e);}}
    onMouseLeave=${e=>{if(hasHover)setH(false);onMouseLeave&&onMouseLeave(e);}} ...${rest}>${children}<//>`;
});
const Stack=forwardRef(function Stack({children,direction='column',spacing=0,alignItems,justifyContent,flexWrap,useFlexGap,sx,style,onClick,...rest},ref){
  const {out,hover}=sxStyle(sx); const hasHover=Object.keys(hover).length>0; const [h,setH]=useState(false);
  const base={display:'flex',flexDirection:direction,gap:(typeof spacing==='number'?spacing*8+'px':spacing),alignItems,justifyContent,flexWrap};
  return html`<div ref=${ref} onClick=${onClick} style=${{...base,...out,...(h?hover:{}),...style}}
    onMouseEnter=${()=>{if(hasHover)setH(true);}} onMouseLeave=${()=>{if(hasHover)setH(false);}} ...${rest}>${children}<//>`;
});
const TYP={h3:{fontSize:30,fontWeight:700,lineHeight:1.3},h4:{fontSize:30,fontWeight:700,lineHeight:1.35},h5:{fontSize:20,fontWeight:700,lineHeight:1.5},h6:{fontSize:16,fontWeight:700,lineHeight:1.45},subtitle1:{fontSize:16,fontWeight:700},subtitle2:{fontSize:14,fontWeight:700},body2:{fontSize:14,fontWeight:500}};
function Typography({children,variant,sx,style,color,noWrap,component,textAlign,...rest}){
  const {out}=sxStyle(sx);
  const base={margin:0,fontFamily:SYS,color:INK,...(TYP[variant]||{})};
  if(color==='text.secondary') base.color=DIM; else if(color) base.color=color;
  if(noWrap){ base.whiteSpace='nowrap'; base.overflow='hidden'; base.textOverflow='ellipsis'; }
  if(textAlign) base.textAlign=textAlign;
  const Tag=component||(variant&&variant.charAt(0)==='h'?variant:'div');
  return html`<${Tag} style=${{...base,...out,...style}} ...${rest}>${children}<//>`;
}
function LinearProgress({value=0,variant,sx,style}){ const {out}=sxStyle(sx);
  return html`<div style=${{height:8,borderRadius:4,background:G2,overflow:'hidden',...out,...style}}>
    <div style=${{height:'100%',width:(variant==='determinate'?Math.max(0,Math.min(100,value)):100)+'%',background:BLUE,borderRadius:4,transition:'width .3s ease'}}/>
  </div>`;
}
function Collapse({in:open,children}){
  return html`<div style=${{display:'grid',gridTemplateRows:open?'1fr':'0fr',transition:'grid-template-rows .26s ease, opacity .26s ease',opacity:open?1:0}}>
    <div style=${{overflow:'hidden',minHeight:0}}>${children}</div>
  </div>`;
}
function Dialog({open,children,PaperProps={}}){ if(!open) return null; const {out}=sxStyle(PaperProps.sx);
  return html`<div style=${{position:'fixed',inset:0,zIndex:1300,display:'grid',placeItems:'center',background:'rgba(0,0,0,.45)',padding:16}}>
    <div style=${{background:CARD,borderRadius:8,border:`1px solid ${BORDER}`,boxShadow:SH_LG,maxWidth:'94vw',...out}}>${children}</div>
  </div>`;
}
function DialogContent({children,sx,style}){ const {out}=sxStyle(sx); return html`<div style=${{padding:16,...out,...style}}>${children}</div>`; }
function Menu({anchorEl,open,onClose,children}){ if(!open||!anchorEl) return null; const r=anchorEl.getBoundingClientRect();
  return html`<div onClick=${onClose} style=${{position:'fixed',inset:0,zIndex:1400}}>
    <div onClick=${e=>e.stopPropagation()} style=${{position:'fixed',left:r.left,top:r.top-6,transform:'translateY(-100%)',background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,boxShadow:SH_MD,padding:6,minWidth:170}}>${children}</div>
  </div>`;
}
function MenuItem({children,onClick,sx}){ const {out}=sxStyle(sx); const [h,setH]=useState(false);
  return html`<div onClick=${onClick} onMouseEnter=${()=>setH(true)} onMouseLeave=${()=>setH(false)} style=${{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:6,cursor:'pointer',background:h?G0:'transparent',...out}}>${children}</div>`;
}
function Snackbar({open,message,onClose,autoHideDuration}){
  useEffect(()=>{ if(open&&autoHideDuration){ const t=setTimeout(()=>onClose&&onClose(),autoHideDuration); return ()=>clearTimeout(t); } },[open,message]);
  if(!open) return null;
  return html`<div style=${{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:1500,background:'#343a40',color:'#fff',padding:'10px 16px',borderRadius:8,fontSize:14,fontWeight:700,boxShadow:SH_LG}}>${message}</div>`;
}

/* ---------- icon (Tabler) ---------- */
function Icon({n,size=18,color,style={}}){
  return html`<i className=${'ti ti-'+n} style=${{fontSize:size,lineHeight:1,color:color||'inherit',display:'inline-flex',...style}}/>`;
}

const SUBJECT_ICONS={
  math:['math-symbols','calculator','percentage','math-pi','ruler-2','square-root-2','sigma','math-function','divide','math-x-divide-y'],
  science:['atom','flask','microscope','dna','test-pipe','planet','temperature','bulb','magnet','atom-2'],
};
const DECOR_SPOTS=[{l:4,t:14,s:24},{l:14,t:64,s:18},{l:25,t:30,s:15},{l:35,t:82,s:20},{l:47,t:15,s:16},{l:60,t:72,s:22},{l:70,t:26,s:15},{l:83,t:60,s:19},{l:91,t:17,s:16},{l:55,t:45,s:14},{l:8,t:90,s:17},{l:78,t:90,s:15}];
/* deterministic star field (denser along the milky-way diagonal) */
const STARS=(()=>{ let seed=1337; const rnd=()=>{ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; };
  const arr=[]; const cols=['76,110,245','121,80,242','21,170,191','190,75,219','60,79,199'];
  for(let i=0;i<120;i++){ const l=rnd()*100; let t=rnd()*100;
    // bias ~half the stars toward the diagonal band (t ≈ 100-l)
    if(rnd()<0.5){ t=(100-l)+(rnd()*34-17); }
    if(t<0||t>100) continue;
    arr.push({l:+l.toFixed(2),t:+t.toFixed(2),s:+(rnd()*2.4+0.8).toFixed(2),d:+(rnd()*6).toFixed(2),dur:+(2.6+rnd()*3.4).toFixed(2),o:+(0.35+rnd()*0.5).toFixed(2),c:cols[(rnd()*cols.length)|0]}); }
  return arr; })();
function Decor({subject='generic'}){
  const __tw=useTweaks();
  const list = subject==='science'?SUBJECT_ICONS.science : subject==='math'?SUBJECT_ICONS.math
    : SUBJECT_ICONS.math.slice(0,6).flatMap((m,i)=>[m,SUBJECT_ICONS.science[i]]);
  const tint = subject==='science'?'18,184,134':'34,139,230';
  const glowRef = useRef(null);
  useEffect(()=>{
    let raf=0, px=-9999, py=-9999;
    const apply=()=>{ raf=0; const el=glowRef.current; if(!el) return; const r=el.getBoundingClientRect();
      el.style.setProperty('--gx',(px-r.left)+'px'); el.style.setProperty('--gy',(py-r.top)+'px'); };
    const onMove=(e)=>{ px=e.clientX; py=e.clientY; if(!raf) raf=requestAnimationFrame(apply); };
    window.addEventListener('pointermove',onMove,{passive:true});
    return ()=>{ window.removeEventListener('pointermove',onMove); if(raf) cancelAnimationFrame(raf); };
  },[]);
  const glowTint='121,80,242';
  const gImg=(a)=>`radial-gradient(rgba(${glowTint},${a}) 1.1px, transparent 1.1px)`;
  const bandMask=(R,i,p)=>`radial-gradient(circle ${R}px at var(--gx,-9999px) var(--gy,-9999px), transparent ${i}%, rgba(0,0,0,1) ${p}%, transparent 100%)`;
  // crisp & bright at the pointer → progressively blurrier and fainter, reaching 0 by the 100px edge
  const blurLayers=[{R:40,i:0,p:0,b:0,a:.34},{R:65,i:28,p:55,b:1.8,a:.26},{R:85,i:48,p:72,b:3.4,a:.18},{R:100,i:66,p:86,b:5,a:.12}];
  if(__tw.ambience==='spotlight') return null;
  return html`<div ref=${glowRef} style=${{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0,opacity:__tw.ambience==='serene'?0.42:1,transition:'opacity .45s ease'}}>
    
    <div style=${{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(151,117,250,.07) 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
    ${blurLayers.map((L,k)=>html`<div key=${k} style=${{position:'absolute',inset:0,backgroundImage:gImg(L.a),backgroundSize:'24px 24px',filter:L.b?`blur(${L.b}px)`:'none',maskImage:bandMask(L.R,L.i,L.p),WebkitMaskImage:bandMask(L.R,L.i,L.p)}}/>`)}
    ${DECOR_SPOTS.map((sp,i)=>{ const col=subject==='generic'?'34,139,230':tint; return html`<i key=${i} class=${'ti ti-'+list[i%list.length]} style=${{position:'absolute',left:sp.l+'%',top:sp.t+'%',fontSize:sp.s,color:`rgba(${col},.13)`}}/>`; })}
  </div>`;
}
function Screen({children,sx={},decor='generic'}){
  const __tw=useTweaks();
  return html`<${Box} sx=${{position:'relative',minHeight:'100vh',background:canvasFor(__tw.ambience),color:INK,fontFamily:SYS,overflow:isPhone()?'visible':'hidden'}}>
    <${Decor} subject=${decor}/>
    <${Box} sx=${{position:'relative',zIndex:1,minHeight:'100vh',...sx}}>${children}<//>
  <//>`;
}

/* ---------- buddy avatar (flat brand character) ---------- */
function Buddy({who='max',size=96,mood='smile',bob=true,excited=false,style={}}){
  const isMax=who==='max', s=size;
  if(isMax) return html`<vyom-rive alt="Vyom" style=${{width:s,height:s,display:'inline-block',position:'relative',flex:'none',filter:'drop-shadow(0 6px 14px rgba(34,139,230,.28))',animation:bob?'bob 3.2s ease-in-out infinite':'none',...style}}/>`;
  if(who==='spark') return html`<img src="spark-mascot-sm.png" alt="Spark" decoding="async" style=${{width:s,height:s,objectFit:'contain',flex:'none',filter:'drop-shadow(0 4px 10px rgba(240,140,0,.32))',transformOrigin:'center',animation:'sparkin .6s cubic-bezier(.2,1.4,.4,1) both, sparkwiggle 1.9s .6s ease-in-out infinite',...style}}/>`;
  const body=isMax?VIOLET:TEAL;
  const eyeW=Math.max(6,s*0.10), eyeH=Math.max(8,s*0.13), eyeY=s*0.40, eyeX=s*0.27;
  const lw=Math.max(2,s*0.03);
  let mouth;
  if(mood==='oops') mouth=html`<span style=${{position:'absolute',left:'50%',top:s*0.58,transform:'translateX(-50%)',width:s*0.16,height:s*0.16,border:`${lw}px solid #fff`,borderRadius:'50%'}}/>`;
  else if(mood==='think') mouth=html`<span style=${{position:'absolute',left:s*0.34,top:s*0.66,width:s*0.3,height:0,borderTop:`${lw}px solid #fff`,borderRadius:2}}/>`;
  else { const w=mood==='grin'?s*0.4:s*0.32, h=mood==='grin'?s*0.22:s*0.16;
    mouth=html`<span style=${{position:'absolute',left:'50%',top:s*0.58,transform:'translateX(-50%)',width:w,height:h,border:`${lw}px solid #fff`,borderTop:'none',borderRadius:`0 0 ${s}px ${s}px`,background:mood==='grin'?'rgba(255,255,255,.18)':'transparent'}}/>`; }
  return html`<div style=${{position:'relative',width:s,height:s,borderRadius:s*0.32,background:body,
    boxShadow:'var(--mantine-shadow-sm)',
    animation:bob?`${isMax?'bob 3.2s':'bobb 2.5s'} ease-in-out infinite`:'none',flex:'none',...style}}>
    <span style=${{position:'absolute',left:'16%',top:'12%',width:'38%',height:'30%',borderRadius:'50%',background:'rgba(255,255,255,.22)'}}/>
    <span style=${{position:'absolute',left:eyeX,top:eyeY,width:eyeW,height:eyeH,background:'#fff',borderRadius:'50%'}}/>
    <span style=${{position:'absolute',right:eyeX,top:eyeY,width:eyeW,height:eyeH,background:'#fff',borderRadius:'50%'}}/>
    ${mouth}
  </div>`;
}

function Waveform({active=true,bars=7,color=BLUE,height=18}){
  return html`<div style=${{display:'flex',alignItems:'center',gap:3,height}}>
    ${Array.from({length:bars}).map((_,i)=>{ const d=Math.abs(i-(bars-1)/2); const rest=Math.max(.22,.85-d*0.16);
      return html`<span key=${i} style=${{width:3,height:'100%',borderRadius:999,background:color,transformOrigin:'center',transform:active?undefined:`scaleY(${rest})`,animation:active?`siri 1.15s ease-in-out ${i*0.085}s infinite`:'none',opacity:active?1:.5}}/>`; })}
  </div>`;
}

function burst(x,y,colors){
  colors=colors||[BLUE,VIOLET,TEAL,GRAPE];
  let layer=document.getElementById('fx-layer');
  if(!layer){ layer=document.createElement('div'); layer.id='fx-layer'; layer.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:4000;overflow:hidden'; document.body.appendChild(layer); }
  for(let i=0;i<16;i++){
    const p=document.createElement('div'); const sz=6+Math.random()*6; const c=colors[i%colors.length];
    p.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;border-radius:${Math.random()<.5?'50%':'2px'};background:${c};will-change:transform,opacity`;
    layer.appendChild(p);
    const ang=(Math.PI*2*i)/16+Math.random()*0.5, dist=40+Math.random()*64;
    const dx=Math.cos(ang)*dist, dy=Math.sin(ang)*dist-16, rot=(Math.random()*2-1)*180;
    p.animate([
      {transform:'translate(-50%,-50%) scale(.3) rotate(0deg)',opacity:1},
      {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1) rotate(${rot}deg)`,opacity:1,offset:.7},
      {transform:`translate(calc(-50% + ${dx*1.15}px),calc(-50% + ${dy*1.2+32}px)) scale(.2) rotate(${rot}deg)`,opacity:0}
    ],{duration:640+Math.random()*320,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>p.remove();
  }
}

/* uppercase micro-eyebrow (a recurring Mantine dashboard pattern) */
function Eyebrow({children,color=DIM}){
  return html`<${Typography} sx=${{fontSize:11,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase',color}}>${children}<//>`;
}

/* meaningful micro-visual inside each stat tile (flat, single accent) */
function StatExtra({s}){
  const c=s.c;
  if(s.kind==='dots') return html`<${Stack} direction="row" spacing=${.6} sx=${{mt:1.4}}>
    ${['M','T','W','T','F','S','S'].map((d,i)=>html`<${Box} key=${i} sx=${{flex:1,py:.5,borderRadius:'4px',textAlign:'center',fontSize:11,fontWeight:700,
      background:i<4?c:G1,color:i<4?'#fff':DIM}}>${d}<//>`)}
  <//>`;
  if(s.kind==='bar') return html`<${Box} sx=${{mt:1.7,height:8,borderRadius:999,background:G2,overflow:'hidden'}}>
    <${Box} sx=${{width:'82%',height:'100%',borderRadius:999,background:c}}/>
  <//>`;
  if(s.kind==='spark') return html`<${Stack} direction="row" spacing=${.6} alignItems="flex-end" sx=${{mt:1.4,height:28}}>
    ${[12,18,10,26,15,22,14].map((h,i)=>html`<${Box} key=${i} sx=${{flex:1,height:h,borderRadius:'3px',background:i===3?c:`${c}55`}}/>`)}
  <//>`;
  return html`<${Stack} direction="row" spacing=${.6} sx=${{mt:1.7,flexWrap:'wrap',rowGap:.6}}>
    ${Array.from({length:8}).map((_,i)=>html`<${Box} key=${i} sx=${{width:13,height:13,borderRadius:'50%',background:i<6?c:G2}}/>`)}
  <//>`;
}

/* =========================================================
   ONBOARDING
   ========================================================= */
const INTENTS=[
  {k:'gap',icon:'puzzle',c:VIOLET,t:'I have gaps — patch them up',tag:'Supplemental'},
  {k:'scratch',icon:'plant-2',c:TEAL,t:'Teach me from scratch',tag:'Primary'},
  {k:'revise',icon:'bolt',c:ORANGE,t:'Quick revision',tag:'Fast'},
  {k:'watch',icon:'movie',c:GRAPE,t:'Just sit back and watch',tag:'Passive'},
  {k:'test',icon:'pencil',c:CYAN,t:'Just test me',tag:'Test-driven'},
];
const BOOKS=[
  {id:'ncert',t:'NCERT Mathematics · Class 7',note:'In our library — instant setup'},
  {id:'rds',t:'R.D. Sharma · Class 7',note:'In our library'},
];
const TOPICS=['Integers','Fractions & Decimals','Data Handling','Simple Equations','Lines & Angles','The Triangle & Its Properties','Congruence of Triangles','Comparing Quantities','Rational Numbers','Perimeter & Area','Algebraic Expressions','Exponents & Powers','Symmetry','Visualising Solid Shapes'];
function Dots({n,i}){ return html`<div style=${{display:'flex',gap:7,justifyContent:'center'}}>
  ${Array.from({length:n}).map((_,k)=>html`<span key=${k} style=${{width:k===i?22:8,height:8,borderRadius:999,background:k<=i?BLUE:G3,transition:'all .3s'}}/>`)}
</div>`; }

function Onboarding({onDone}){
  const [step,setStep]=useState(0);
  const [grade,setGrade]=useState('7');
  const [book,setBook]=useState('ncert');
  const [intent,setIntent]=useState('gap');
  const [snap,setSnap]=useState(false);
  const [extract,setExtract]=useState(0);
  const N=4;
  useEffect(()=>{ if(snap){ setExtract(0); const t=setInterval(()=>setExtract(p=>Math.min(100,p+12)),220); return ()=>clearInterval(t); } },[snap]);
  const next=()=>setStep(s=>Math.min(N-1,s+1));
  const back=()=>setStep(s=>Math.max(0,s-1));
  const canNext = step===1?!!grade : step===2?(!!book||extract>=100) : true;

  const Frame=(children)=>html`<${Screen} decor="generic" sx=${{display:'grid',placeItems:'center',p:3}}>
      <${Box} key=${step} className="scrn" sx=${{width:'min(540px,94vw)',background:CARD,border:`1px solid ${BORDER}`,borderRadius:'8px',boxShadow:SH_SM,overflow:'hidden'}}>
        <${Box} sx=${{height:4,background:BLUE}}/>
        <${Box} sx=${{p:{xs:3,sm:4}}}>
          <${Box} sx=${{mb:3}}><${Dots} n=${N} i=${step}/><//>
          ${children}
        <//>
      <//>
  <//>`;

  if(step===0) return Frame(html`<${Stack} spacing=${2.5} alignItems="center" textAlign="center" sx=${{py:1}}>
    <${Stack} direction="row" spacing=${2} alignItems="flex-end">
      <${Buddy} who="max" size=${112} mood="grin"/>
      <${Buddy} who="spark" size=${84} mood="smile"/>
    <//>
    <${Typography} variant="h4">Hi, we're Vyom and Spark 👋<//>
    <${Typography} sx=${{color:DIM,maxWidth:340,fontSize:14}}>We'll learn together, one step at a time. First, a couple of quick questions.<//>
    <${M.Button} size="md" onClick=${next} rightSection=${html`<${Icon} n="arrow-right"/>`}>Let's go<//>
  <//>`);

  if(step===1) return Frame(html`<${Stack} spacing=${2.5}>
    <${Typography} variant="h5">Which class are you in?<//>
    <${Stack} direction="row" spacing=${1.5}>
      ${['6','7','8'].map(g=>{ const on=grade===g; return html`<${Box} key=${g} onClick=${()=>setGrade(g)} sx=${{flex:1,height:90,borderRadius:'8px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'background-color .12s, border-color .12s',
        color:on?'#fff':INK, background:on?BLUE:CARD, border:`1px solid ${on?BLUE:G4}`,'&:hover':{background:on?BLUE:G0}}}>
        <${Typography} sx=${{fontSize:30,fontWeight:700,lineHeight:1,color:'inherit'}}>${g}<//>
        <${Typography} sx=${{fontSize:11,fontWeight:700,color:'inherit',opacity:.75,mt:.4}}>Class<//>
      <//>`; })}
    <//>
    <${Typography} variant="subtitle2">Your board<//>
    <${Stack} direction="row" spacing=${1}>
      <${M.Badge} variant="filled" color="blue" size="lg" leftSection=${html`<${Icon} n="check" size=${13}/>`}>CBSE<//>
      <${M.Badge} variant="default" size="lg">ICSE<//>
      <${M.Badge} variant="default" size="lg">State board<//>
    <//>
    ${NavRow(back,next,canNext,step)}
  <//>`);

  if(step===2) return Frame(html`<${Stack} spacing=${2}>
    <${Typography} variant="h5">Which maths book does your school use?<//>
    <${M.TextInput} placeholder="Search by name…" leftSection=${html`<${Icon} n="search" size=${16}/>`}/>
    ${BOOKS.map(b=>{ const on=book===b.id; return html`<${Box} key=${b.id} onClick=${()=>{setBook(b.id);setSnap(false);}} sx=${{cursor:'pointer',display:'flex',alignItems:'center',gap:1.5,p:1.5,borderRadius:'8px',transition:'.12s',
        background:on?BLUE0:CARD, border:`1px solid ${on?BLUE:BORDER}`,'&:hover':{border:`1px solid ${on?BLUE:G4}`}}}>
        <${Box} sx=${{width:40,height:52,borderRadius:'4px',flex:'none',background:TEAL0,border:`1px solid ${TEAL2}`,display:'grid',placeItems:'center',color:TEAL8}}><${Icon} n="book-2" size=${22}/><//>
        <${Box} sx=${{flex:1}}>
          <${Typography} sx=${{fontWeight:700,fontSize:14}}>${b.t}<//>
          <${Stack} direction="row" spacing=${.5} alignItems="center" sx=${{mt:.3}}><${Icon} n="circle-check" size=${14} color=${TEAL8}/><${Typography} sx=${{fontSize:12,fontWeight:700,color:TEAL8}}>${b.note}<//><//>
        <//>
        ${on&&html`<${Icon} n="circle-check-filled" size=${22} color=${BLUE}/>`}
      <//>`; })}
    <${Stack} direction="row" spacing=${.6} alignItems="center" onClick=${()=>{setSnap(s=>!s);setBook(null);}} sx=${{cursor:'pointer',alignSelf:'flex-start'}}>
      <${Icon} n="camera" size=${16} color=${BLUE}/>
      <${Typography} sx=${{fontSize:12,fontWeight:700,color:BLUE7}}>Can't find it? Snap your book<//>
    <//>
    <${Collapse} in=${snap}>
      <${Box} sx=${{p:2.5,textAlign:'center',borderRadius:'8px',background:G0,border:`1px dashed ${G4}`}}>
        <${Box} sx=${{width:48,height:48,mx:'auto',mb:1,borderRadius:'8px',background:BLUE0,display:'grid',placeItems:'center',color:BLUE7}}><${Icon} n="upload" size=${24}/><//>
        <${Typography} sx=${{fontWeight:700,fontSize:12,mb:1.2,color:TXT}}>Drop a PDF or photograph the contents pages<//>
        <${LinearProgress} variant="determinate" value=${extract} sx=${{mb:.8}}/>
        <${Typography} sx=${{fontSize:12,fontWeight:700,color:DIM}}>${extract<100?`Reading your book… topics found: ${Math.round(extract/7)}`:'Done — 14 topics mapped to the knowledge graph'}<//>
      <//>
      <${Collapse} in=${extract>=100}>
        <${Box} sx=${{mt:1.2,borderRadius:'8px',overflow:'hidden',...cardSx}}>
          <${Stack} direction="row" alignItems="center" spacing=${.7} sx=${{px:1.4,pt:1.4,pb:1}}>
            <${Icon} n="list-check" size=${15} color=${TEAL8}/>
            <${Eyebrow}>Identified topics<//>
            <${Box} sx=${{flex:1}}/>
            <${Typography} sx=${{fontSize:11,fontWeight:700,color:DIM}}>scroll<//>
          <//>
          <${Box} sx=${{maxHeight:150,overflowY:'auto',display:'flex',flexDirection:'column',gap:.5,px:1.4,pb:1.4}}>
            ${TOPICS.map((t,i)=>{ const hot=t.startsWith('Fractions'); return html`<${Stack} key=${t} direction="row" alignItems="center" spacing=${1} sx=${{px:1,py:.8,borderRadius:'6px',background:hot?BLUE0:G0}}>
              <${Box} sx=${{width:22,height:22,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',fontSize:11,fontWeight:700,color:'#fff',background:hot?BLUE:G5}}>${i+1}<//>
              <${Typography} sx=${{flex:1,fontSize:12,fontWeight:hot?700:500,color:INK}}>${t}<//>
              ${hot?html`<${M.Badge} variant="light" color="blue" size="sm">Start here<//>`:html`<${Icon} n="check" size=${14} color=${TEAL8}/>`}
            <//>`; })}
          <//>
        <//>
      <//>
    <//>
    ${NavRow(back,next,canNext,step)}
  <//>`);

  return Frame(html`<${Stack} spacing=${2.5} alignItems="center" textAlign="center" sx=${{py:1}}>
    <${Stack} direction="row" spacing=${2} alignItems="flex-end"><${Buddy} who="max" size=${100} mood="grin"/><${Buddy} who="spark" size=${76} mood="grin"/><//>
    <${Typography} variant="h4">You're all set<//>
    <${Box} sx=${{width:'100%',px:3,py:2,borderRadius:'8px',background:BLUE0,border:`1px solid ${BLUE1}`}}>
      <${Typography} sx=${{fontWeight:700,color:BLUE9,lineHeight:1.6,textAlign:'center'}}>Class ${grade} · CBSE · ${book==='rds'?'R.D. Sharma':'NCERT Maths'}<br/>Starting with <${Box} component="span" sx=${{fontWeight:700}}>Fractions<//> first.<//>
    <//>
    <${M.Button} size="md" onClick=${onDone} rightSection=${html`<${Icon} n="arrow-right"/>`}>Enter Byjus.AI<//>
  <//>`);
}
function NavRow(back,next,can,step){
  return html`<${Stack} direction="row" justifyContent="space-between" alignItems="center" sx=${{pt:1}}>
    <${Box} sx=${{visibility:step===0?'hidden':'visible'}}><${M.Button} variant="subtle" color="gray" onClick=${back} leftSection=${html`<${Icon} n="arrow-left"/>`}>Back<//><//>
    <${M.Button} onClick=${next} disabled=${!can} rightSection=${html`<${Icon} n="arrow-right"/>`}>Next<//>
  <//>`;
}

/* =========================================================
   HOME
   ========================================================= */
const STATS=[
  {i:'flame',v:'4',l:'Day streak',c:ORANGE,kind:'dots',chip:'+1 today',cl:'orange'},
  {i:'target',v:'82%',l:'Accuracy',c:TEAL,kind:'bar',chip:'+4%',cl:'teal'},
  {i:'clock',v:'3h 20m',l:'Time learning',c:VIOLET,kind:'spark',chip:'This week',cl:'violet'},
  {i:'star',v:'6',l:'Islands done',c:GRAPE,kind:'pips',chip:'2 to go',cl:'grape'},
];
const GOALS=[{c:TEAL,t:'Long arc · great year-end marks',s:''},{c:BLUE,t:'Unit test · Fractions',s:'in 9 days'},{c:INK,t:'Today · finish adding fractions',s:''}];
const COURSES=[{i:'book',t:'Fractions',s:'55% · now',hot:true,c:BLUE},{i:'book-2',t:'Decimals',s:'next',c:VIOLET},{i:'lock',t:'Integers',s:'',lock:true,c:DIM}];
const NAV=[{i:'home',k:'home',t:'Home'},{i:'books',k:'learn',t:'Learn'},{i:'chart-line',k:'progress',t:'Progress'},{i:'trophy',k:'leagues',t:'Leagues'}];

function VoiceWave(){
  const barsRef=useRef([]);
  const N=22;
  useEffect(()=>{
    let raf=0, ac=null, stream=null, cancelled=false;
    const simulate=()=>{ barsRef.current.forEach((b,i)=>{ if(b) b.style.animation=`siri 1.05s ${(i%7)*0.08}s ease-in-out infinite`; }); };
    (async()=>{
      try{
        stream=await navigator.mediaDevices.getUserMedia({audio:true});
        if(cancelled){ stream.getTracks().forEach(t=>t.stop()); return; }
        ac=new (window.AudioContext||window.webkitAudioContext)();
        const src=ac.createMediaStreamSource(stream); const an=ac.createAnalyser();
        an.fftSize=64; an.smoothingTimeConstant=.78; src.connect(an);
        const data=new Uint8Array(an.frequencyBinCount);
        const loop=()=>{ an.getByteFrequencyData(data); const bars=barsRef.current;
          for(let i=0;i<bars.length;i++){ const v=data[i+1]/255; if(bars[i]) bars[i].style.transform=`scaleY(${Math.max(0.14,v*1.15)})`; }
          raf=requestAnimationFrame(loop); };
        loop();
      }catch(e){ simulate(); }
    })();
    return ()=>{ cancelled=true; if(raf) cancelAnimationFrame(raf); if(ac) ac.close(); if(stream) stream.getTracks().forEach(t=>t.stop()); };
  },[]);
  return html`<div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:3,height:30,flex:1}}>
    ${Array.from({length:N}).map((_,i)=>html`<span key=${i} ref=${el=>barsRef.current[i]=el} style=${{width:3,height:'100%',borderRadius:999,background:'rgba(255,255,255,.95)',transformOrigin:'center',transform:'scaleY(.18)',transition:'transform .07s linear'}}/>`)}
  </div>`;
}

const SPARK_LINES=["Ooh ooh, I love this bit! \u26a1 Can we try a tricky one next?","Wait wait \u2014 so the bottoms HAVE to match? That's so cool!","Zap! I knew that one\u2026 mostly. \ud83d\ude04","Hehe, fractions are kinda fun when you put it that way!","Quick quick \u2014 what if the bottoms were 4 and 6? Ooh I wanna know!"];
function maxAnswer(q){ return "Good question! When two fractions have different bottoms (denominators), we can't add them straight away — first we rename them to the same size. Take ½ + ⅓: the smallest shared bottom is 6, so ½ becomes 3/6 and ⅓ becomes 2/6. Now the pieces match, and 3/6 + 2/6 = 5/6. The golden rule is: make the bottoms equal first, then add the tops.";
}
function maxAnswerChunks(q){ return [
  "Good question! When two fractions have different bottoms (denominators), we can't add them straight away — first we rename them to the same size.",
  "Take ½ + ⅓: the smallest shared bottom is 6, so ½ becomes 3/6 and ⅓ becomes 2/6.",
  "Now the pieces match, and 3/6 + 2/6 = 5/6.",
  "The golden rule is: make the bottoms equal first, then add the tops.",
];
}

function AskMaxPanel({chatText,setChatText,chatFocus,setChatFocus,onSend,onHoverChange,onStartChange,navOpen,embedded,intro,withSpark,pushRef,onExpandSpark}){
  const panelRef=useRef(null);
  const __twP=useTweaks(); const showSpark = withSpark && __twP.companions!=='solo';
  const [hov,setHov]=useState(false);
  const setHovBoth=(v)=>{ setHov(v); onHoverChange&&onHoverChange(v); };
  const [inHov,setInHov]=useState(false);
  const [recording,setRecording]=useState(false);
  const inActive=chatFocus||inHov||hov;
  const [messages,setMessages]=useState([]);
  const [started,setStarted]=useState(false);
  const [thinking,setThinking]=useState(false);
  const [enterId,setEnterId]=useState(null);
  const enterSeenRef=useRef({});
  useEffect(()=>{ const last=messages[messages.length-1];
    if(last && last.role==='spark' && last.text && !enterSeenRef.current[last.id]){ enterSeenRef.current[last.id]=true; const id=last.id; setEnterId(id); const t=setTimeout(()=>setEnterId(v=>v===id?null:v),1520); return ()=>clearTimeout(t); }
  },[messages]);
  const scrollRef=useRef(null); const idRef=useRef(0);
  const seqRef=useRef([]);
  useEffect(()=>()=>{ seqRef.current.forEach(clearTimeout); },[]);
  useEffect(()=>{ const el=scrollRef.current; if(el) el.scrollTop=el.scrollHeight; },[messages,thinking]);
  const submit=()=>{ const t=(chatText||'').trim(); if(!t) return; setChatText('');
    setMessages(m=>[...m,{id:++idRef.current,role:'student',text:t}]);
    if(!started){ setStarted(true); onStartChange&&onStartChange(true); }
    const chunks=maxAnswerChunks(t);
    const steps=chunks.map((c,i)=>({who:'max',text:c,explain:i===0}));
    if(showSpark) steps.push({who:'spark',text:SPARK_LINES[Math.floor(Math.random()*SPARK_LINES.length)]});
    steps.push({who:'max',prompt:true,text:"That's exactly what we'll master together today. Ready to start the class?"});
    // initial thinking, first bubble at ~1.5s, each following bubble 7s apart (with a short typing lead-in)
    setThinking('max');
    seqRef.current.forEach(clearTimeout); seqRef.current=[];
    let acc=1500;
    steps.forEach((s,i)=>{
      if(i>0){ const lead=900; seqRef.current.push(setTimeout(()=>setThinking(s.who),Math.max(0,acc-lead))); }
      seqRef.current.push(setTimeout(()=>{ setThinking(false); setMessages(m=>[...m,{id:++idRef.current,role:s.who,text:s.text,prompt:s.prompt,explain:s.explain}]); },acc));
      acc+=7000;
    });
  };
  const endChat=()=>{ setStarted(false); setMessages([]); setThinking(false); onStartChange&&onStartChange(false); };
  const [vw,setVw]=useState(typeof window!=='undefined'?window.innerWidth:1280);
  useEffect(()=>{ const f=()=>setVw(window.innerWidth); window.addEventListener('resize',f); return ()=>window.removeEventListener('resize',f); },[]);
  const restW=Math.max(Math.round(vw*0.20),264);
  const hovW=Math.round(restW*1.4);
  const fullW=(vw-(navOpen?212:78));
  const panelW=(started?fullW:(hov?hovW:restW))+'px';
  const rootSx=embedded?{position:'relative',width:'100%',height:'100%',minWidth:0,background:'radial-gradient(120% 40% at 50% 6%, rgba(121,80,242,.13), rgba(34,139,230,.05) 44%, transparent 70%), linear-gradient(180deg, #f3f0ff 0%, #f8f9fa 52%, #fff4e6 100%)',display:'flex',flexDirection:'column',overflow:'hidden'}:{position:'fixed',right:0,top:0,height:'100vh',width:panelW,zIndex:25,background:'transparent',borderLeft:'none',display:{xs:'none',md:'flex'},flexDirection:'column',boxShadow:'none',transition:'box-shadow .3s ease'};
  const [readingId,setReadingId]=useState(null);
  const stopRead=()=>{ try{ window.speechSynthesis.cancel(); }catch(e){} setReadingId(null); };
  const readOut=(m)=>{ if(readingId===m.id){ stopRead(); return; } try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(m.text); u.rate=1; u.pitch=1.05; u.onend=()=>setReadingId(null); u.onerror=()=>setReadingId(null); setReadingId(m.id); window.speechSynthesis.speak(u); }catch(e){ setReadingId(null); } };
  useEffect(()=>()=>{ try{ window.speechSynthesis.cancel(); }catch(e){} },[]);
  useEffect(()=>{ if(intro){ setMessages([{id:++idRef.current,role:'max',text:intro}]); setStarted(true); onStartChange&&onStartChange(true); } },[]);
  if(pushRef) pushRef.current=(msg)=>{ setStarted(true); onStartChange&&onStartChange(true); if(msg.think){ setThinking(msg.think); return; } setThinking(false); setMessages(m=>[...m,{id:++idRef.current,...msg}]); };
  let lastMaxId=null; for(let i=messages.length-1;i>=0;i--){ if(messages[i].role==='max'||messages[i].role==='spark'||messages[i].kind==='sparksum'){ lastMaxId=messages[i].id; break; } }
  const emphId = readingId!=null ? readingId : lastMaxId;
  const onMove=(e)=>{ const el=panelRef.current; if(!el) return; const r=el.getBoundingClientRect(); el.style.setProperty('--mx',(e.clientX-r.left)+'px'); el.style.setProperty('--my',(e.clientY-r.top)+'px'); };
  const iconBtn=(n)=>html`<${Box} onClick=${onSend} sx=${{width:34,height:34,borderRadius:'8px',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.18s','&:hover':{background:G0,color:BLUE}}}><${Icon} n=${n} size=${18}/><//>`;
  const rdur=hov?3.2:4.6;
  /* plain DOM + a stylesheet class: emotion's generated width/height rule was competing with the
     expand keyframe, which is what left the rings frozen at their start size */
  const ring=(idx,icons)=>html`<div class="ringx" style=${{animationDuration:rdur+'s',animationDelay:(idx*rdur/3)+'s'}}>
    <div class="ringx-line"/>
    ${icons.map((ic,k)=>{ const a=(k/icons.length)*Math.PI*2 - Math.PI/2; const cx=50+50*Math.cos(a), cy=50+50*Math.sin(a); return html`<span key=${k} style=${{position:'absolute',left:cx+'%',top:cy+'%',transform:'translate(-50%,-50%)',width:24,height:24,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center',boxShadow:'0 1px 6px rgba(28,126,214,.32)',zIndex:2}}><i class=${'ti ti-'+ic} style=${{fontSize:14,color:'#1c7ed6',WebkitTextStroke:'0.6px #1c7ed6'}}/></span>`; })}
  </div>`;
  return html`<${Box} ref=${panelRef} onMouseEnter=${()=>setHovBoth(true)} onMouseLeave=${()=>setHovBoth(false)} onMouseMove=${onMove} sx=${rootSx}>
    ${embedded?html`<${R.Fragment}>
      <div style=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',opacity:.5,background:'radial-gradient(1.5px 1.5px at 18% 20%, rgba(121,80,242,.5), transparent 60%), radial-gradient(1.4px 1.4px at 62% 14%, rgba(90,150,255,.45), transparent 60%), radial-gradient(1.6px 1.6px at 80% 40%, rgba(150,120,255,.45), transparent 60%), radial-gradient(1.3px 1.3px at 34% 56%, rgba(90,150,255,.4), transparent 60%), radial-gradient(1.4px 1.4px at 70% 72%, rgba(150,120,255,.4), transparent 60%), radial-gradient(1.2px 1.2px at 22% 82%, rgba(120,140,255,.4), transparent 60%)'}}></div>
      <div style=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',filter:'blur(1.2px)',WebkitMaskImage:'radial-gradient(72% 46% at 50% 18%, #000 4%, rgba(0,0,0,.4) 44%, transparent 74%)',maskImage:'radial-gradient(72% 46% at 50% 18%, #000 4%, rgba(0,0,0,.4) 44%, transparent 74%)',backgroundImage:'linear-gradient(rgba(99,80,240,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(99,80,240,.14) 1px, transparent 1px)',backgroundSize:'40px 40px',backgroundPosition:'center'}}></div>
      <div style=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',backdropFilter:'blur(5px) saturate(1.04) brightness(1.03)',WebkitBackdropFilter:'blur(5px) saturate(1.04) brightness(1.03)',background:'linear-gradient(180deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,.24) 50%, rgba(255,255,255,.3) 100%)'}}></div>
    <//>`:''}
    ${(started&&!embedded)?html`<${Box} sx=${{position:'fixed',inset:0,zIndex:-1,background:CANVAS,pointerEvents:'none'}}/>`:''}
    <${Box} sx=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',opacity:(hov&&!started)?1:0,transition:'opacity .5s ease',animation:(hov&&!started)?'panelbreathe 2.4s ease-in-out infinite':'none',
      background:'radial-gradient(125% 70% at 50% 36%, rgba(121,80,242,.13), rgba(34,139,230,.08) 42%, rgba(121,80,242,0) 74%)'}}/>
    <${Box} sx=${{position:'absolute',inset:0,zIndex:5,padding:'1.5px',pointerEvents:'none',opacity:(hov&&(embedded||!started))?1:0,transition:'opacity .25s ease',
      background:'radial-gradient(150px circle at var(--mx,-300px) var(--my,-300px), rgba(34,139,230,.7), rgba(34,139,230,0) 62%)',
      WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude'}}/>
    <${Box} sx=${{position:'relative',zIndex:1,p:2.2,flex:'none',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:1.4}}>
      ${showSpark?html`<${Box} sx=${{flexShrink:0,display:'flex',alignItems:'flex-end'}}>
        <${Buddy} who="max" size=${40} bob=${false} style=${{flexShrink:0,transformOrigin:'bottom center',transform:'rotate(8deg)'}}/>
        <${Buddy} who="spark" size=${34} bob=${false} style=${{flexShrink:0,marginLeft:-11,animation:'none',transformOrigin:'bottom center',transform:'scaleX(-1) rotate(8deg)'}}/>
      <//>`:(started?html`<${Buddy} who="max" size=${42} bob=${false} style=${{flexShrink:0}}/>`:'')}
      <${Box} sx=${{flex:1,minWidth:0}}>
        <${Eyebrow} color=${BLUE7}>${showSpark?'In-class chat':'Ask Vyom'}<//>
        <${Typography} sx=${{fontSize:14,fontWeight:700,mt:.2}}>${showSpark?'Vyom & Spark are here with you':'Your AI tutor'}<//>
      <//>
      ${(started&&!embedded)?html`<${Box} onClick=${endChat} sx=${{width:34,height:34,flex:'none',borderRadius:'8px',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.15s','&:hover':{background:G0,color:INK}}}><${Icon} n="x" size=${18}/><//>`:''}
    <//>
    <${Box} sx=${{flex:1,position:'relative',zIndex:1,display:started?'none':'grid',placeItems:'center',overflow:'hidden'}}>
      ${hov&&html`<${Box} sx=${{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden',animation:'streaksin .5s ease both',maskImage:'radial-gradient(130% 105% at 50% 45%, #000 55%, transparent 100%)',WebkitMaskImage:'radial-gradient(130% 105% at 50% 45%, #000 55%, transparent 100%)'}}>
        <${Box} sx=${{position:'absolute',left:'2%',top:'40%',width:200,height:200,filter:'blur(30px)',background:'radial-gradient(circle at 50% 50%, rgba(34,139,230,.8), rgba(105,90,235,.4) 42%, rgba(34,139,230,0) 72%)',animation:'morphA 11s ease-in-out infinite, blobpulse 6s ease-in-out infinite'}}/>
        <${Box} sx=${{position:'absolute',right:'-4%',top:'22%',width:230,height:230,filter:'blur(34px)',background:'radial-gradient(circle at 50% 50%, rgba(121,80,242,.75), rgba(34,139,230,.35) 45%, rgba(121,80,242,0) 73%)',animation:'morphB 13s ease-in-out infinite, blobpulse 7.5s ease-in-out infinite'}}/>
        <${Box} sx=${{position:'absolute',left:'32%',bottom:'4%',width:180,height:180,filter:'blur(30px)',background:'radial-gradient(circle at 50% 50%, rgba(80,110,240,.7), rgba(121,80,242,.42) 44%, rgba(80,110,240,0) 73%)',animation:'morphA 9.5s 1.5s ease-in-out infinite, blobpulse 5.5s 1s ease-in-out infinite'}}/>
      <//>`}
      <${Box} sx=${{position:'absolute',left:'50%',top:'50%',width:0,height:0}}>
        ${ring(0,['plus','divide','percentage'])}${ring(1,['math-function','math-pi','square-root-2'])}${ring(2,['atom-2','flask','calculator'])}
      <//>
      <${Box} sx=${{position:'relative',zIndex:1,transition:'transform .5s cubic-bezier(.2,.7,.3,1)',transform:hov?'scale(1.32)':'scale(1)',animation:hov?'excitedpop .55s ease both':'none'}}><${Buddy} who="max" size=${108} mood="grin" bob=${true} excited=${hov}/><//>
      ${hov&&html`<${Box} sx=${{position:'absolute',inset:0,pointerEvents:'none',zIndex:2}}>
        ${[{l:30,t:24,s:16,d:1.8,o:0},{l:69,t:30,s:13,d:2.2,o:.5},{l:24,t:54,s:14,d:2,o:.9},{l:73,t:58,s:17,d:1.7,o:.3},{l:46,t:16,s:12,d:2.4,o:1.2},{l:56,t:72,s:15,d:1.9,o:.7},{l:18,t:38,s:12,d:2.1,o:1.5},{l:80,t:44,s:14,d:1.6,o:.2}].map((s,i)=>html`<i key=${i} class="ti ti-sparkles" style=${{position:'absolute',left:s.l+'%',top:s.t+'%',fontSize:s.s,color:i%2?'#f1f3f5':'#ffffff',filter:'drop-shadow(0 0 5px rgba(206,212,218,.9))',animation:`twinkle ${s.d}s ${s.o}s ease-in-out infinite`}}/>`)}
      <//>`}
      <${Typography} sx=${{position:'absolute',bottom:24,left:0,right:0,px:3,fontSize:12,fontWeight:700,color:hov?BLUE7:DIM,transition:'color .3s',textAlign:'center'}}>${hov?"Yes! Let's solve something together.":'Hi! Ask me anything about your lesson.'}<//>
    <//>
    <${Box} ref=${scrollRef} sx=${{display:started?'flex':'none',flexDirection:'column',gap:1.6,flex:1,minHeight:0,overflowY:'auto',position:'relative',zIndex:1,px:3,py:3,alignItems:'stretch'}}>
      <${Box} sx=${{width:'100%',maxWidth:720,mx:'auto',display:'flex',flexDirection:'column',gap:1.6}}>
        ${messages.map(m=> m.kind==='sparksum'
          ? html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start',width:'100%',maxWidth:560}}>
              <${Box} sx=${{flexShrink:0,pt:.4}}><${Buddy} who="spark" size=${m.id===lastMaxId?44:28} bob=${false}/><//>
              <${Box} sx=${{flex:1,minWidth:0,position:'relative',borderRadius:'4px 16px 16px 16px',background:'#fffdf2',border:'1px solid #efe2b0',boxShadow:SH_SM,overflow:'hidden'}}>
                <${Box} sx=${{px:2,pt:1.6,pb:1.6}}>
                  <${Box} sx=${{display:'inline-flex',alignItems:'center',gap:.6,color:TEAL9,fontSize:11,fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',mb:.8}}><${Icon} n="sparkles" size=${13}/> Spark side-quest · compressed<//>
                  <${Box} sx=${{fontSize:14,fontWeight:800,color:INK,mb:.5}}>${m.title}<//>
                  <${Box} sx=${{fontSize:12,color:TXT,lineHeight:1.55}}>${m.text}<//>
                  <${Box} onClick=${()=>onExpandSpark&&onExpandSpark()} sx=${{mt:1.4,display:'inline-flex',alignItems:'center',gap:.6,cursor:'pointer',px:1.6,py:.9,borderRadius:10,border:`1px solid ${TEAL2}`,background:TEAL0,color:TEAL9,fontSize:12,fontWeight:700,transition:'.15s','&:hover':{background:'#c3fae8'}}}><${Icon} n="arrows-maximize" size=${15}/> Expand conversation<//>
                <//>
              <//>
            <//>`
          : m.role==='student'
          ? html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.2} alignItems="flex-start" justifyContent="flex-end" sx=${{alignSelf:'flex-end',maxWidth:'82%'}}>
              <${Box} sx=${{background:BLUE,color:'#fff',borderRadius:'16px 16px 4px 16px',px:2,py:1.3,fontSize:14,fontWeight:500,lineHeight:1.5,boxShadow:SH_SM}}>${m.text}<//>
              <${Box} sx=${{flexShrink:0,width:36,height:36,mt:.3,borderRadius:'12px',background:BLUE,color:'#fff',display:'grid',placeItems:'center',fontSize:12,fontWeight:800,boxShadow:SH_XS}}>A<//>
            <//>`
          : m.role==='spark'
          ? html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start',maxWidth:'88%'}}>
              <${Box} sx=${{flexShrink:0,width:46,position:'relative',zIndex:3,display:'flex',flexDirection:'column',alignItems:'center',gap:.7,pt:.4}}>
                <${Box} sx=${{transformOrigin:'center',...(enterId===m.id?{animation:'sparkpop 1.5s cubic-bezier(.2,.7,.3,1) both'}:{transform:emphId===m.id?'scale(1.75)':'scale(1)',transition:'transform .32s cubic-bezier(.2,.7,.3,1)'})}}><${Buddy} who="spark" size=${m.id===lastMaxId?40:26} bob=${readingId===m.id}/><//>
                ${readingId===m.id?html`<div style=${{display:'flex',alignItems:'center',gap:2.5,padding:'4px 8px',borderRadius:999,background:'#f59f0a',boxShadow:'0 2px 6px rgba(240,140,0,.3)',height:18,marginTop:6}}>${[0,1,2,3,4].map(i=>html`<span key=${i} style=${{width:2.5,height:'100%',borderRadius:999,background:'#fff',transformOrigin:'center',animation:`siri 1s ${i*0.12}s ease-in-out infinite`}}/>`)}</div>`:''}
              <//>
              <${Box} sx=${{position:'relative',zIndex:1,minWidth:0,overflow:'hidden',pl:'16px',pb:'16px'}}>
                <div style=${{animation:enterId===m.id?'sparkslide 1.5s cubic-bezier(.2,.8,.3,1) both':'none'}}>
                <${Box} sx=${{background:'#FFF7E6',border:'1px solid rgba(240,140,0,.42)',borderRadius:'4px 16px 16px 16px',px:2,py:1.2,fontSize:14,fontWeight:500,color:'#8a5300',lineHeight:1.5,boxShadow:'0 3px 12px rgba(240,140,0,.18)'}}>
                  <${Eyebrow} color="#e8830f">Spark ⚡<//>
                  <${Box} sx=${{mt:.3}}>${m.text}<//>
                  <${Box} onClick=${()=>readOut(m)} sx=${{mt:1.2,display:'inline-flex',alignItems:'center',gap:.5,cursor:'pointer',color:readingId===m.id?'#c2710c':'#b8893a',fontSize:11,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',transition:'.15s','&:hover':{color:'#e8830f'}}}><${Icon} n=${readingId===m.id?'player-stop-filled':'volume'} size=${15}/> ${readingId===m.id?'Stop':'Listen'}<//>
                <//>
              </div>
              <//>
            <//>`
          : html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start',maxWidth:'88%'}}>
              <${Box} sx=${{flexShrink:0,width:46,display:'flex',flexDirection:'column',alignItems:'center',gap:.7,pt:.4}}>
                <${Box} sx=${{transformOrigin:'center',transform:emphId===m.id?'scale(1.75)':'scale(1)',transition:'transform .32s cubic-bezier(.2,.7,.3,1)'}}><${Buddy} who="max" size=${m.id===lastMaxId?40:26} bob=${readingId===m.id}/><//>
                ${readingId===m.id?html`<div style=${{display:'flex',alignItems:'center',gap:2.5,padding:'4px 8px',borderRadius:999,background:BLUE,boxShadow:'0 2px 6px rgba(33,37,41,.14)',height:18,marginTop:6}}>${[0,1,2,3,4].map(i=>html`<span key=${i} style=${{width:2.5,height:'100%',borderRadius:999,background:'#fff',transformOrigin:'center',animation:`siri 1s ${i*0.12}s ease-in-out infinite`}}/>`)}</div>`:''}
              <//>
              <${Box} sx=${{position:'relative',background:CARD,border:`1px solid ${BORDER}`,borderRadius:'4px 16px 16px 16px',px:2,py:1.3,fontSize:14,fontWeight:500,color:INK,boxShadow:SH_XS,lineHeight:1.55}}>
                ${m.text}
                <${Box} onClick=${()=>readOut(m)} sx=${{mt:1.2,display:'inline-flex',alignItems:'center',gap:.5,cursor:'pointer',color:readingId===m.id?BLUE7:DIM,fontSize:11,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',transition:'.15s','&:hover':{color:BLUE}}}><${Icon} n=${readingId===m.id?'player-stop-filled':'volume'} size=${15}/> ${readingId===m.id?'Stop':'Listen'}<//>
                ${m.prompt?html`<${Box} sx=${{mt:1.4}}><${RippleHover} onClick=${onSend} radius="12px" sx=${{px:2.2,py:1.1,placeItems:'center',cursor:'pointer',color:'#fff',background:BLUE,boxShadow:SH_SM,'&:hover':{background:BLUE7}}}><${Box} sx=${{display:'flex',alignItems:'center',gap:.7,fontSize:14,fontWeight:700}}>Start the class <${Icon} n="arrow-right" size=${17}/><//><//><//>`:''}
              <//>
            <//>`)}
        ${thinking?html`<${Stack} direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start'}}>
          <${Box} sx=${{flexShrink:0,width:42,display:'flex',flexDirection:'column',alignItems:'center',gap:.7,pt:.2}}>
            ${avSlot({id:'__typing__'},'left',html`<${Buddy} who=${thinking==='spark'?'spark':'max'} size=${36} bob=${true}/>`,36)}
            <div style=${{display:'flex',gap:4,padding:'6px 9px',borderRadius:999,background:thinking==='spark'?'#f59f0a':BLUE,boxShadow:'0 2px 6px rgba(33,37,41,.14)'}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:'#fff',animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</div>
          <//>
        <//>`:''}
      <//>
    <//>
    <${Box} sx=${{position:'relative',zIndex:1,p:1.6,flex:'none',borderTop:`1px solid ${BORDER}`}}>
      <${Box} sx=${{position:'absolute',left:0,right:0,bottom:0,height:300,pointerEvents:'none',zIndex:0,background:'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(34,139,230,.20) 0%, rgba(120,170,230,.13) 24%, rgba(173,181,189,.10) 48%, rgba(255,255,255,0) 78%)'}}/>
      <${Box} sx=${{position:'relative',zIndex:1,width:'100%',maxWidth:started?720:'none',mx:'auto'}}>
      <${Box} onMouseEnter=${()=>{ if(!ftueOn) setInHov(true); }} onMouseLeave=${()=>setInHov(false)} sx=${{position:'relative',borderRadius:'18px',p:'7px',
        background:'linear-gradient(158deg,#f3f4fd 0%,#e9ecfa 54%,#e0e3f5 100%)',
        border:`1px solid ${inActive?BLUE2:'#c6caea'}`,
        boxShadow:inActive?`0 0 0 3px ${BLUE}1f, 0 12px 30px rgba(28,18,74,.2)`:'0 10px 26px rgba(28,18,74,.14), inset 0 1px 0 rgba(255,255,255,.9)',
        transition:'box-shadow .3s ease, border-color .3s ease'}}>
        <${Box} sx=${{position:'relative',zIndex:1,display:'flex',alignItems:'center',px:1.1,minHeight:recording?76:54,borderRadius:'12px',background:recording?'linear-gradient(120deg, #228be6 0%, #7950f2 100%)':CARD,border:`1px solid ${recording?'transparent':BORDER}`,transition:'background .3s ease, min-height .28s ease'}}>
        ${recording?html`
          <${Box} onClick=${()=>setRecording(false)} sx=${{width:38,height:38,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:'rgba(255,255,255,.22)',boxShadow:'0 0 0 4px rgba(255,255,255,.14)',animation:'pulsemic 1.4s ease-in-out infinite'}}><${Icon} n="microphone" size=${19}/><//>
          <${VoiceWave}/>
          <${Box} onClick=${()=>setRecording(false)} sx=${{width:34,height:34,flex:'none',borderRadius:'8px',display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:'rgba(255,255,255,.2)','&:hover':{background:'rgba(255,255,255,.34)'}}}><${Icon} n="player-stop-filled" size=${16}/><//>
        `:html`
          ${iconBtn('paperclip')}
          <input value=${chatText} onChange=${e=>setChatText(e.target.value)} onFocus=${()=>setChatFocus(true)} onBlur=${()=>setChatFocus(false)}
            onKeyDown=${e=>{ if(e.key==='Enter') submit(); }} placeholder=${started?'Reply to Vyom…':'Ask me anything…'}
            style=${{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',fontFamily:SYS,fontSize:14,fontWeight:500,color:INK,caretColor:BLUE}}/>
          <${Box} onClick=${()=>setRecording(true)} sx=${{width:36,height:36,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.18s','&:hover':{background:G0,color:BLUE}}}><${Icon} n="microphone" size=${19}/><//>
          <${RippleHover} onClick=${submit} radius="999px" sx=${{width:{xs:44,md:40},height:{xs:44,md:40},borderRadius:isPhone()?'50%':'11px',placeItems:'center',cursor:'pointer',color:'#fff',background:isPhone()?'linear-gradient(180deg,#339af0,#1c7ed6)':'linear-gradient(45deg, #228be6 0%, #15aabf 100%)',boxShadow:`0 4px 12px ${BLUE}3a`,transition:'.2s','&:hover':{filter:'brightness(1.06)',boxShadow:`0 6px 16px ${BLUE}4a`}}}>
            <${Box} sx=${{width:'100%',height:'100%',display:'grid',placeItems:'center'}}><${Icon} n="send" size=${18}/><//>
          <//>
        `}
        <//>
      <//>
      <//>
    <//>
  <//>`;
}

function HoverTile({children,sx={},onClick,domRef}){
  const [hov,setHov]=useState(false);
  const setRef=(node)=>{ if(domRef){ if(typeof domRef==='function') domRef(node); else domRef.current=node; } };
  const {boxShadow:baseShadow,...restSx}=sx;
  return html`<${Box} ref=${setRef} onClick=${onClick} onMouseEnter=${()=>setHov(true)} onMouseLeave=${()=>setHov(false)}
    sx=${{position:'relative',transition:'box-shadow .22s ease, transform .22s ease',transform:hov?'translateY(-3px)':'none',boxShadow:hov?SH_MD:(baseShadow??SH_XS),...restSx}}>
    ${children}
  <//>`;
}

function RippleHover({children,sx={},onClick,radius='8px'}){
  const ref=useRef(null);
  const [rip,setRip]=useState(null);
  const ripT=useRef(null);
  /* the ripple layer must be UNMOUNTED once it finishes — leaving it in place keeps a blurred
     composited layer inside the overflow:hidden box, which paints a faint 1px seam on the edge */
  const clearRip=()=>{ clearTimeout(ripT.current); ripT.current=null; setRip(null); };
  useEffect(()=>()=>clearTimeout(ripT.current),[]);
  const onEnter=(e)=>{ const el=ref.current; if(!el) return; const r=el.getBoundingClientRect(); clearTimeout(ripT.current); setRip({x:e.clientX-r.left,y:e.clientY-r.top,key:Date.now()}); ripT.current=setTimeout(()=>setRip(null),620); };
  return html`<${Box} ref=${ref} onClick=${onClick} onMouseEnter=${onEnter} onMouseLeave=${clearRip} sx=${{position:'relative',overflow:'hidden',borderRadius:radius,display:'inline-flex',...sx}}>
    ${children}
    ${rip&&html`<div key=${rip.key} style=${{position:'absolute',left:rip.x+'px',top:rip.y+'px',width:200,height:200,borderRadius:'50%',pointerEvents:'none',zIndex:3,background:'radial-gradient(circle, rgba(34,139,230,.42), rgba(121,80,242,.32) 48%, rgba(121,80,242,0) 72%)',filter:'blur(2px)',animation:'tileripple .6s ease-out forwards'}}/>`}
  <//>`;
}

function HomeLegacy({onResume,onRestart}){
  const [navK,setNavK]=useState('home');
  const [menuEl,setMenuEl]=useState(null);
  const [navOpen,setNavOpen]=useState(false);
  const [panelHov,setPanelHov]=useState(false);
  const [chatFull,setChatFull]=useState(false);
  const navRef=useRef(null);
  const navMove=(e)=>{ const el=navRef.current; if(!el) return; const r=el.getBoundingClientRect(); el.style.setProperty('--nx',(e.clientX-r.left)+'px'); el.style.setProperty('--ny',(e.clientY-r.top)+'px'); };
  const [chatHover,setChatHover]=useState(false);
  const [chatFocus,setChatFocus]=useState(false);
  const [chatText,setChatText]=useState('');
  const chatActive=chatHover||chatFocus;
  const sendChat=()=>{ onResume(); };
  const streakRef=useRef(null);
  const [streakCele,setStreakCele]=useState(false);
  useEffect(()=>{ const today=new Date().toDateString(); if(localStorage.getItem('byjus_streakDay')!==today){ localStorage.setItem('byjus_streakDay',today); const t=setTimeout(()=>{ const el=streakRef.current; if(el){ const r=el.getBoundingClientRect(); burst(r.left+r.width/2,r.top+r.height/2,[ORANGE,BLUE,TEAL,GRAPE]); } setStreakCele(true); setTimeout(()=>setStreakCele(false),1600); },850); return ()=>clearTimeout(t); } },[]);
  const navItem=(n)=>{ const on=navK===n.k; return html`<${Box} key=${n.k} onClick=${()=>setNavK(n.k)} sx=${{display:'flex',alignItems:'center',justifyContent:navOpen?'flex-start':'center',gap:navOpen?1.4:0,height:44,px:navOpen?1.4:0,borderRadius:'8px',cursor:'pointer',color:on?BLUE7:DIM,
      background:on?BLUE0:'transparent','&:hover':{background:on?BLUE0:G0}}}>
      <${Box} sx=${{width:26,flex:'none',display:'grid',placeItems:'center'}}><${Icon} n=${n.i} size=${21}/><//>
      <${Typography} noWrap sx=${{fontWeight:on?700:600,fontSize:14,maxWidth:navOpen?160:0,opacity:navOpen?1:0,overflow:'hidden',transition:'.22s'}}>${n.t}<//>
    <//>`; };
  return html`<${Screen} decor="math">
    <${Box} ref=${navRef} onMouseEnter=${()=>setNavOpen(true)} onMouseLeave=${()=>setNavOpen(false)} onMouseMove=${navMove} sx=${{position:'fixed',left:0,top:0,height:'100vh',width:navOpen?212:78,zIndex:30,transition:'width .26s cubic-bezier(.2,.7,.3,1)',
      background:CARD,borderRight:`1px solid ${BORDER}`,boxShadow:navOpen?SH_MD:'none',display:'flex',flexDirection:'column',gap:.5,p:1.4,overflow:'hidden'}}>
      <${Box} sx=${{position:'absolute',inset:0,zIndex:9,padding:'1.5px',pointerEvents:'none',opacity:navOpen?1:0,transition:'opacity .25s ease',
        background:'radial-gradient(150px circle at var(--nx,-300px) var(--ny,-300px), rgba(121,80,242,.7), rgba(121,80,242,0) 62%)',
        WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude'}}/>
      <${Box} sx=${{display:'flex',alignItems:'center',justifyContent:navOpen?'flex-start':'center',gap:navOpen?1.2:0,height:44,mb:.6}}>
        <${Box} sx=${{width:40,height:40,flex:'none',borderRadius:'8px',overflow:'hidden',display:'grid',placeItems:'center',background:CARD,border:`1px solid ${BORDER}`}}><img src="logo.png" alt="Classroots" style=${{width:'100%',height:'100%',objectFit:'contain'}}/><//>
        <${Typography} noWrap sx=${{fontWeight:700,fontSize:16,maxWidth:navOpen?150:0,opacity:navOpen?1:0,overflow:'hidden',transition:'.22s'}}>Byjus.AI<//>
      <//>
      <${Box} sx=${{height:'1px',background:BORDER,mx:.4,mt:.2,mb:1}}/>
      ${NAV.map(navItem)}
      <${Box} sx=${{mt:'auto'}}/>
      <${Box} onClick=${e=>setMenuEl(e.currentTarget)} sx=${{display:'flex',alignItems:'center',justifyContent:navOpen?'flex-start':'center',gap:navOpen?1.2:0,height:52,borderRadius:'8px',cursor:'pointer','&:hover':{background:G0}}}>
        <${Box} sx=${{flexShrink:0,width:38,height:38,borderRadius:'12px',background:BLUE,color:'#fff',display:'grid',placeItems:'center',fontSize:14,fontWeight:800}}>A<//>
        <${Box} sx=${{minWidth:0,maxWidth:navOpen?150:0,opacity:navOpen?1:0,overflow:'hidden',transition:'.22s'}}>
          <${Typography} noWrap sx=${{fontWeight:700,fontSize:14,lineHeight:1.15}}>Aarav<//>
          <${Typography} noWrap sx=${{fontSize:11,color:DIM,fontWeight:500}}>Class 10 · CBSE<//>
        <//>
      <//>
      <${Menu} anchorEl=${menuEl} open=${!!menuEl} onClose=${()=>setMenuEl(null)}>
        <${MenuItem} onClick=${()=>{setMenuEl(null);onRestart();}} sx=${{fontWeight:700,fontSize:14,gap:1}}><${Icon} n="refresh" size=${17}/> Restart demo<//>
      <//>
    <//>
    <${Box} sx=${{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',py:5,pl:navOpen?{xs:'100px',md:'232px'}:{xs:'86px',md:'94px'},pr:{xs:2,md:(panelHov||chatFull)?'calc(28% + 40px)':'calc(20% + 40px)'},transition:'padding-left .26s cubic-bezier(.2,.7,.3,1), padding-right .32s cubic-bezier(.2,.7,.3,1)'}}>
      <${Box} sx=${{width:'100%',maxWidth:1040}}>
        <${Stack} direction="row" alignItems="center" spacing=${1.5} useFlexGap sx=${{mb:3.5,flexWrap:'wrap',rowGap:1.2}}>
          <${Typography} variant="h3" sx=${{flexShrink:0,fontSize:{xs:28,md:34}}}>Hey Aarav 👋<//>
          <${M.Badge} variant="light" color="orange" size="lg" leftSection=${html`<${Icon} n="flame" size=${14}/>`}>4-day streak<//>
          <${Box} sx=${{flex:1,minWidth:8}}/>
          <${M.Badge} variant="light" color="blue" size="lg" leftSection=${html`<${Icon} n="target" size=${14}/>`} style=${{textTransform:'none'}}>Goal · ace the unit test<//>
        <//>

        <${HoverTile} sx=${{mb:3.5,...cardSx,boxShadow:SH_SM,p:{xs:2.5,md:3},background:BLUE0,borderColor:BLUE1,display:'flex',alignItems:'center',gap:2.5,flexWrap:'wrap'}}>
          <${Box} sx=${{flex:1,minWidth:230}}>
            <${Eyebrow} color=${BLUE7}>Welcome back<//>
            <${Typography} variant="h5" sx=${{my:.4,fontSize:{xs:19,md:22}}}>Fractions · Adding unlike denominators<//>
            <${Stack} direction="row" spacing=${1.2} alignItems="center" sx=${{mt:1.2}}>
              <${LinearProgress} variant="determinate" value=${55} sx=${{flex:1,maxWidth:280}}/>
              <${Typography} sx=${{fontSize:12,fontWeight:700,color:BLUE7}}>55%<//>
            <//>
          <//>
          <${RippleHover} radius="8px"><${M.Button} size="md" onClick=${onResume} leftSection=${html`<${Icon} n="player-play-filled" size=${16}/>`}>Resume<//><//>
        <//>

        <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'repeat(4,1fr)'},gap:2,mb:3.5}}>
          ${STATS.map(s=>html`<${HoverTile} key=${s.l} domRef=${s.i==='flame'?streakRef:null} sx=${{...cardSx,p:'18px',animation:(streakCele&&s.i==='flame')?'cardpop .6s ease':'none',boxShadow:(streakCele&&s.i==='flame')?`0 0 0 2px ${s.c}, ${SH_MD}`:SH_XS}}>
            <${Stack} direction="row" alignItems="center" justifyContent="space-between" sx=${{mb:1.2}}>
              <${Box} sx=${{width:38,height:38,borderRadius:'8px',display:'grid',placeItems:'center',background:`${s.c}1a`,color:s.c}}><${Icon} n=${s.i} size=${20}/><//>
              <${M.Badge} variant="light" color=${s.cl} size="sm">${s.chip}<//>
            <//>
            <${Typography} sx=${{fontSize:30,fontWeight:700,lineHeight:1}}>${s.v}<//>
            <${Eyebrow}>${s.l}<//>
            <${StatExtra} s=${s}/>
          <//>`)}
        <//>

        <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:2.5}}>
          <${HoverTile} sx=${{...cardSx,p:'22px'}}>
            <${Stack} direction="row" spacing=${1} alignItems="center" sx=${{mb:2}}><${Icon} n="flag" size=${19} color=${BLUE}/><${Typography} variant="subtitle2">Your goals<//><//>
            <${Stack} spacing=${1.6}>
              ${GOALS.map(g=>html`<${Stack} key=${g.t} direction="row" alignItems="center" spacing=${1.3}>
                <${Box} sx=${{width:11,height:11,borderRadius:'50%',flex:'none',background:g.c}}/>
                <${Typography} sx=${{fontSize:12,fontWeight:500,flex:1}}>${g.t}<//>
                ${g.s&&html`<${M.Badge} variant="default" size="sm" style=${{textTransform:'none'}}>${g.s}<//>`}
              <//>`)}
            <//>
            <${Stack} direction="row" spacing=${.6} alignItems="center" sx=${{mt:2,color:DIM}}><${Icon} n="stack-2" size=${14}/><${Typography} sx=${{fontSize:11,fontWeight:500}}>Nested goal stack · long ▸ mid ▸ session<//><//>
          <//>
          <${HoverTile} sx=${{...cardSx,p:'22px'}}>
            <${Stack} direction="row" spacing=${1} alignItems="center" sx=${{mb:2}}><${Icon} n="math-symbols" size=${19} color=${BLUE}/><${Typography} variant="subtitle2">Maths · Class 7<//><//>
            <${Stack} spacing=${1}>
              ${COURSES.map(c=>html`<${Stack} key=${c.t} direction="row" alignItems="center" spacing=${1.3} sx=${{p:1.2,borderRadius:'8px',
                background:c.hot?BLUE0:G0, border:`1px solid ${c.hot?BLUE1:'transparent'}`}}>
                <${Box} sx=${{width:32,height:32,borderRadius:'8px',flex:'none',display:'grid',placeItems:'center',color:c.lock?DIM:'#fff',
                  background:c.lock?G2:c.c}}><${Icon} n=${c.i} size=${17}/><//>
                <${Typography} sx=${{fontSize:14,fontWeight:700,flex:1,color:c.lock?DIM:INK}}>${c.t}<//>
                ${c.s&&html`<${Typography} sx=${{fontSize:11,fontWeight:700,color:c.hot?BLUE7:DIM}}>${c.s}<//>`}
              <//>`)}
            <//>
          <//>
        <//>
      <//>
    <//>
    ${/* ---- Ask MAX · right panel ---- */''}
    <${AskMaxPanel} chatText=${chatText} setChatText=${setChatText} chatFocus=${chatFocus} setChatFocus=${setChatFocus} onSend=${sendChat} onHoverChange=${setPanelHov} onStartChange=${setChatFull} navOpen=${navOpen}/>
  <//>`;
}

/* =========================================================
   HOME v2 — chat launcher (40%) + curriculum dashboard (60%)
   ========================================================= */
const PRESETS=[
  {k:'doubt',i:'help-hexagon',c:VIOLET,bg:VIOLET0,t:'I have a doubt',s:'Ask Vyom anything'},
  {k:'hw',i:'pencil',c:BLUE,bg:BLUE0,t:'Homework help',s:'Solve it together'},
  {k:'revise',i:'refresh',c:ORANGE,bg:'#fff4e6',t:'Need a revision',s:'Recap a chapter'},
  {k:'test',i:'checkup-list',c:TEAL,bg:TEAL0,t:'Test me',s:'Quick practice'},
];
const PRESET_REPLY={
  doubt:"Of course — tell me exactly what's confusing and I'll break it down step by step. Want to open the lesson and clear it together?",
  hw:"Happy to help with homework! Type your question or snap a photo, and we'll work through it one step at a time.",
  revise:"Let's do a quick revision — I'll recap the key ideas from your current chapter, then give you a couple of fast checks.",
  test:"Great — a few quick questions coming up to see what's solid. Ready when you are!",
};
/* Same order as the Profile page's own rail, so the two never disagree. */
const JUMP=[
  {k:'profile',i:'user-circle',t:'Profile'},
  {k:'group',i:'users-group',t:'Study group'},
  {k:'rewards',i:'gift',t:'Rewards'},
  {k:'stats',i:'chart-histogram',t:'My stats'},
  {k:'goals',i:'target-arrow',t:'Goals'},
];
const GOALS2=[
  {i:'trophy',c:TEAL,cl:'teal',t:'Score 90%+ in the year-end exam',s:'Long-term',pr:68},
  {i:'clipboard-check',c:BLUE,cl:'blue',t:'Ace the Fractions unit test',s:'in 9 days',pr:45},
  {i:'checkbox',c:ORANGE,cl:'orange',t:'Finish adding unlike fractions',s:'today',pr:80},
];
const CHAPTERS=[
  {t:'Integers',sub:'Operations & number rules',p:30,status:'now'},
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',p:55,status:'now'},
  {t:'Data Handling',sub:'Mean, median & mode',p:0,status:'planned'},
  {t:'Simple Equations',sub:'Solving for x',p:0,status:'planned'},
];
/* `c` is the SURFACE accent — the 46px icon tint and the hover border, where a light step is
   right. `tc` is its text-safe sibling, used for the progress numeral and the bar fill, which
   both carry meaning and must clear contrast. Blue's accent is blue-5 (#339af0) and reads at
   2.99:1 as 12px text, so the two roles cannot share one value. */
const RESUME_CLASSES=[
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',p:55,c:BLUE,tc:'#1864ab',bg:BLUE0,icon:'math-symbols'},
  {t:'Integers',sub:'Multiplication & division',p:30,c:BLUE,tc:'#1864ab',bg:BLUE0,icon:'divide'},
];
/* The goal the phone home shows under the resume cards — same pct-led statement the Chapter
   Journey chrome uses, so the two never disagree about what the student is working towards. */
const GOAL_HOME={pct:68,label:'of scoring 90%+ in the year-end exam'};
const JOURNEY=[
  {t:'Whole Numbers',sub:'Place value & operations',status:'done',p1:'#a7f3d9',p2:'#12b886',p3:'#0b6e50',ring:false,moon:true},
  {t:'Integers',sub:'Operations & number rules',status:'now',p:30,p1:'#bcd0ff',p2:'#4c6ef5',p3:'#28347d',ring:false,moon:true},
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',status:'prog',p:55,p1:'#e6c6ff',p2:'#9b5cf6',p3:'#4a2585',ring:true,ringC:'#c9a6ff'},
  {t:'Data Handling',sub:'Mean, median & mode',status:'locked',p1:'#ffe0b0',p2:'#f59f3b',p3:'#8a4d10',ring:true,ringC:'#ffd08a'},
  {t:'Simple Equations',sub:'Solving for x',status:'locked',p1:'#c4f2fb',p2:'#22b8cf',p3:'#0b5c6b',ring:false,moon:false},
  {t:'Lines & Angles',sub:'Shapes & properties',status:'locked',p1:'#ffc9d4',p2:'#f0698a',p3:'#8a2540',ring:false,moon:true},
];
// full academic timeline — past (done) through future (locked), grouped by month
const GALAXY_CH=[
  {t:'Playing with Numbers',sub:'Primes, HCF & LCM',status:'done',stars:3,month:"May '26",p1:'#ffd9a8',p2:'#f97316',p3:'#7a3410',moon:true},
  {t:'Perimeter & Area',sub:'Composite shapes',status:'done',stars:2,month:"May '26",p1:'#b9f0d8',p2:'#0ca678',p3:'#0a5c44'},
  {t:'Whole Numbers',sub:'Place value & operations',status:'done',stars:3,month:"Jun '26",p1:'#a7f3d9',p2:'#12b886',p3:'#0b6e50',moon:true},
  {t:'Integers',sub:'Operations & number rules',status:'now',p:30,month:"Jul '26",p1:'#bcd0ff',p2:'#4c6ef5',p3:'#28347d',moon:true},
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',status:'prog',p:55,month:"Jul '26",p1:'#e6c6ff',p2:'#9b5cf6',p3:'#4a2585',ring:true,ringC:'#c9a6ff'},
  {t:'Data Handling',sub:'Mean, median & mode',status:'locked',month:"Aug '26",p1:'#ffe0b0',p2:'#f59f3b',p3:'#8a4d10',ring:true,ringC:'#ffd08a'},
  {t:'Simple Equations',sub:'Solving for x',status:'locked',month:"Aug '26",p1:'#c4f2fb',p2:'#22b8cf',p3:'#0b5c6b'},
  {t:'Lines & Angles',sub:'Shapes & properties',status:'locked',month:"Sep '26",p1:'#ffc9d4',p2:'#f0698a',p3:'#8a2540',moon:true},
  {t:'The Triangle',sub:'Angle sum & properties',status:'locked',month:"Sep '26",p1:'#d0bfff',p2:'#7950f2',p3:'#3d2585'},
];
const STREAK_WEEK=[{d:'Mo',s:'done'},{d:'Tu',s:'done'},{d:'We',s:'done'},{d:'Th',s:'active'},{d:'Fr',s:'next'},{d:'Sa',s:'future'},{d:'Su',s:'future'}];
const SHIELD='polygon(50% 0, 100% 12%, 100% 58%, 50% 100%, 0 58%, 0 12%)';
const MAXSTARS=[{x:-150,y:-120,s:16,c:'#ffffff',d:1.5,dl:0},{x:160,y:-90,s:13,c:'#ffe08a',d:1.6,dl:.15},{x:-190,y:40,s:14,c:'#8fd0ff',d:1.5,dl:.3},{x:200,y:70,s:15,c:'#ffffff',d:1.7,dl:.1},{x:-90,y:-180,s:12,c:'#8fd0ff',d:1.5,dl:.35},{x:110,y:-190,s:14,c:'#ffffff',d:1.6,dl:.2},{x:-210,y:-30,s:13,c:'#ffe08a',d:1.7,dl:.05},{x:220,y:-20,s:12,c:'#8fd0ff',d:1.5,dl:.28},{x:0,y:-215,s:15,c:'#ffffff',d:1.6,dl:.4},{x:-120,y:150,s:13,c:'#ffe08a',d:1.7,dl:.22},{x:130,y:170,s:14,c:'#8fd0ff',d:1.55,dl:.12},{x:-30,y:210,s:12,c:'#ffffff',d:1.6,dl:.32}];
const NEBULA_BLOBS=[{l:14,t:22,s:300,c:'rgba(155,92,246,.5)',d:1.2,dl:0,md:9},{l:72,t:16,s:330,c:'rgba(34,139,230,.44)',d:1.4,dl:.15,md:11},{l:78,t:66,s:300,c:'rgba(230,64,190,.42)',d:1.3,dl:.3,md:10},{l:22,t:70,s:270,c:'rgba(21,170,191,.4)',d:1.2,dl:.2,md:8.5},{l:46,t:44,s:340,c:'rgba(121,80,242,.4)',d:1.5,dl:.1,md:12},{l:88,t:40,s:190,c:'rgba(255,214,120,.34)',d:1.1,dl:.35,md:7}];

const FTUE_Q=[
  {t:"How did this lesson feel?", s:'Lesson felt', o:['Easy','Just right','Hard','Very hard']},
  {t:"How would you like me to help?", s:'Help with', multi:true, o:['Homework','Class test','Revision','Understanding concepts','More practice']},
  {t:"How much time can you study in one go?", s:'Study stretch', o:['10 min','20 min','30 min','60 min']},
  {t:"When do you usually study?", s:'Study time', multi:true, o:['Morning','Afternoon','Evening','Night']}
];
const FTUE_LOAD=["Looking at your learning goal…","Choosing the best lesson sequence…","Adjusting lessons to your study time…","Preparing your next step…"];
function HomeChat({onResume,full,onExpand,onClose,onMaxClick,homeMode,widgets}){
  const [text,setText]=useState('');
  const [focus,setFocus]=useState(false);
  const [moreSug,setMoreSug]=useState(false);
  const [inHov,setInHov]=useState(false);
  const [messages,setMessages]=useState([]);
  const [thinking,setThinking]=useState(false);
  const [stage,setStage]=useState('idle');    // idle | explaining | asking | understood | wrap
  const [vis,setVis]=useState('closed');       // closed | concept | transcript
  const [step,setStep]=useState(0);
  const [xs,setXs]=useState(6);
  const [transcript,setTranscript]=useState([]);
  const [histCol,setHistCol]=useState(!!homeMode);
  const [maxHov,setMaxHov]=useState(false);
  const [dust,setDust]=useState(false);
  const [comp,setComp]=useState(null);
  const [convo,setConvo]=useState(false);
  const [sumOpen,setSumOpen]=useState(false);
  const [launch,setLaunch]=useState(0);
  const [ftueOn,setFtueOn]=useState(()=>{ try{ const on=localStorage.getItem('ftueStage')==='setup'; if(on) localStorage.removeItem('ftueStage'); return on; }catch(e){ return false; } });
  const [fq,setFq]=useState(-1);          // newest question asked (-1 = none)
  const [fans,setFans]=useState({});      // question index -> answer (string, or string[] when multi)
  const [fgate,setFgate]=useState(false); // confirmation gate reached
  const [fload,setFload]=useState(false);
  const [floadMsg,setFloadMsg]=useState(0);
  const doLaunch=()=>{ if(!onMaxClick||launch) return; setLaunch(1); seqRef.current.push(setTimeout(()=>{ setLaunch(2); onMaxClick(); },1050)); seqRef.current.push(setTimeout(()=>setLaunch(0),3200)); };
  useEffect(()=>{ if(full&&!homeMode){ setDust(true); const t=setTimeout(()=>setDust(false),1300); return ()=>clearTimeout(t); } },[full]);
  const started=messages.length>0;
  const active=focus||inHov;
  const idRef=useRef(0); const seqRef=useRef([]); const scrollRef=useRef(null);
  const clearT=()=>{ seqRef.current.forEach(clearTimeout); seqRef.current=[]; };
  const push=(m)=>setMessages(x=>[...x,{id:++idRef.current,...m}]);
  const goalChatRef=useRef(false), goalTurnRef=useRef(0);
  useEffect(()=>{ if(!homeMode) return; let q=null; try{ q=new URLSearchParams(location.search); }catch(e){} const gc=q&&q.get('goalChat'); if(!gc) return;
    const names={g1:'Unit test 2',g2:'Master Circles',g3:'Year-end syllabus'}; const gname=names[q.get('goal')]||'your goal';
    const first = gc==='edit' ? "Let's update “"+gname+"”. What would you like to change — the date, the chapters, or how much time you spend each day?" : "Let's set up a new goal. Is there a test coming up at school, or something you want to get really good at?";
    goalChatRef.current=true; const t=setTimeout(()=>{ if(!full){ onExpand&&onExpand(); } setConvo(true); setMessages([{id:++idRef.current,role:'max',text:first}]); },400);
    return ()=>clearTimeout(t); },[]);
  const enterConvo=()=>{ if(convo) return; if(!full){ onExpand&&onExpand(); } setConvo(true); setMessages(x=> x.length ? x : [{id:++idRef.current,role:'max',text:"Hey Aarav! I'm all ears — what would you like to work on today?"}]); };
  const exitConvo=()=>{ clearT(); setXs(6); setConvo(false); setMessages([]); setThinking(false); setStage('idle'); setVis('closed'); setStep(0); setTranscript([]); setText(''); if(ftueOn){ try{ localStorage.removeItem('ftueStage'); }catch(e){} setFtueOn(false); setFq(-1); setFopts([]); } };
  useEffect(()=>()=>clearT(),[]);
  useEffect(()=>{ const el=scrollRef.current; if(el) el.scrollTop=el.scrollHeight; },[messages,thinking,stage,fq,fans,fgate]);

  /* ---- FTUE questionnaire (entered from the Teaching Room's "Set up my goals") ---- */
  const askFtue=(i)=>{ setThinking(true); seqRef.current.push(setTimeout(()=>{ setThinking(false); push({role:'max',ftueQ:i}); setFq(i); },850)); };
  /* answers stay editable: options are never removed, so advancing only ever happens from the newest question */
  const ftueNext=(i)=>{
    if(i+1<FTUE_Q.length){ seqRef.current.push(setTimeout(()=>askFtue(i+1),380)); return; }
    seqRef.current.push(setTimeout(()=>{ push({role:'max',ftueGate:true}); setFgate(true); },420));
  };
  const pickFtue=(i,opt)=>{
    const q=FTUE_Q[i];
    if(q.multi){ setFans(a=>{ const cur=Array.isArray(a[i])?a[i]:[]; return {...a,[i]:cur.indexOf(opt)>=0?cur.filter(x=>x!==opt):[...cur,opt]}; }); return; }
    setFans(a=>({...a,[i]:opt}));
    if(i===fq && !fgate) ftueNext(i);   // only the live question advances; re-picking an earlier one just edits it
  };
  useEffect(()=>{ if(!ftueOn||!homeMode) return;
    setConvo(true);
    setMessages([{id:++idRef.current,role:'max',text:"Great! I'll ask four quick questions to shape your learning flow.\nThere are no right or wrong answers."}]);
    seqRef.current.push(setTimeout(()=>askFtue(0),1100));
  },[]);
  useEffect(()=>{ if(!fload) return;
    const go=setTimeout(()=>{ try{ localStorage.setItem('ftueStage','land'); }catch(e){} openChapterJourney(); },1150);
    return ()=>clearTimeout(go);
  },[fload]);

  const startFrac=(q)=>{
    clearT();
    setStage('explaining'); setHistCol(true); setVis('closed'); setStep(0);
    setMessages([{id:++idRef.current,role:'student',text:(typeof q==='string'&&q)?q:FRAC_DOUBT_DEFAULT,concept:'frac'}]);
    setThinking(true);
    setXs(0);
    // One bubble, revealed in stages: intro → key idea → step 1 → 2 → 3 → check-in
    seqRef.current.push(setTimeout(()=>{ setThinking(false); setXs(1); push({role:'max',explain:true,concept:'frac'}); },1700));
    seqRef.current.push(setTimeout(()=>setXs(2),3300));
    seqRef.current.push(setTimeout(()=>{ setXs(3); setStep(1); },4900));
    seqRef.current.push(setTimeout(()=>{ setXs(4); setStep(2); },6400));
    seqRef.current.push(setTimeout(()=>{ setXs(5); setStep(3); },7900));
    seqRef.current.push(setTimeout(()=>{ setXs(6); setStage('asking'); },9400));
  };
  const answer=(kind,custom)=>{
    clearT();
    if(kind==='got'){
      setStage('understood'); setVis('closed'); setComp('outline');
      seqRef.current.push(setTimeout(()=>setComp('collapse'),700));
      seqRef.current.push(setTimeout(()=>{
        setMessages(prev=>{ const c=prev.filter(m=>m.concept==='frac'); setTranscript(c); const kept=prev.filter(m=>m.concept!=='frac'); return [...kept,{id:++idRef.current,role:'max',summary:true}]; });
        setComp(null);
      },1300));
      seqRef.current.push(setTimeout(()=>{ push({role:'max',text:WRAP_TEXT,wrap:true}); setStage('wrap'); },2700));
    } else {
      setStage('explaining'); setVis('closed');
      push({role:'student',text:(custom&&custom.trim())||FRAC_FOLLOWUP_Q,concept:'frac'});
      setThinking(true);
      seqRef.current.push(setTimeout(()=>{ setThinking(false); push({role:'max',text:FRAC_FOLLOWUP_A,concept:'frac'}); setStep(3); },950));
      seqRef.current.push(setTimeout(()=>{ push({role:'max',text:FRAC_ASK_TEXT,ask:true,concept:'frac'}); setStage('asking'); },2550));
    }
  };
  const reset=()=>{ clearT(); setMessages([]); setThinking(false); setStage('idle'); setVis('closed'); setStep(0); setTranscript([]); setHistCol(false); };
  const closeRoom=()=>{ reset(); onClose&&onClose(); };
  const resumeConversation=()=>{ clearT(); setMessages(prev=>[...prev.filter(m=>!m.summary), ...transcript.map(m=>({...m,id:++idRef.current,concept:'frac'})), {id:++idRef.current,role:'max',text:"We're back in this thread — ask me anything and I'll fold it into the summary when you're done.",concept:'frac'}]); setVis('closed'); setStage('asking'); };
  const submit=()=>{ const t=text.trim(); if(!t) return; setText(''); if(goalChatRef.current){ clearT(); push({role:'student',text:t}); setThinking(true); goalTurnRef.current++; const turn=goalTurnRef.current; seqRef.current.push(setTimeout(()=>{ setThinking(false); push({role:'max',text: turn===1 ? "Got it. And by when do you want this done?" : "Done — I've updated your goal and reshaped your path. Head back to your Goals journey to see it."}); if(turn>=2){ seqRef.current.push(setTimeout(()=>{ try{ window.location.href=encodeURI('Goal Page.dc.html'); }catch(e){} },2600)); } },1100)); return; } if(homeMode&&!convo&&!ftueOn){ if(!full) onExpand&&onExpand(); setConvo(true); startFrac(t); return; } if(!full){ onExpand&&onExpand(); startFrac(t); return; } if(vis==='transcript'){ setTranscript(x=>[...x,{id:++idRef.current,role:'student',text:t}]); seqRef.current.push(setTimeout(()=>setTranscript(x=>[...x,{id:++idRef.current,role:'max',text:FRAC_FOLLOWUP_A}]),900)); return; } if(stage==='asking') answer('doubt',t); else startFrac(t); };
  const preset=(p,e)=>{ e&&e.stopPropagation&&e.stopPropagation(); if(!full) onExpand&&onExpand(); startFrac(); };
  const iconBtn=(n,onClick,title)=>html`<${Box} onClick=${onClick} title=${title} sx=${{width:{xs:44,md:36},height:{xs:44,md:36},flex:'none',borderRadius:isPhone()?'50%':'8px',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.15s','&:hover':{background:G0,color:INK}}}><${Icon} n=${n} size=${19}/><//>`;

  const rdur=launch?1.05:4.2;
  /* plain DOM + a stylesheet class: emotion's generated width/height rule was competing with the
     expand keyframe, which is what left the rings frozen at their start size */
  const ring=(idx,icons)=>html`<div class="ringx" style=${{animationDuration:rdur+'s',animationDelay:(idx*rdur/3)+'s'}}>
    <div class="ringx-line"/>
    ${icons.map((ic,k)=>{ const a=(k/icons.length)*Math.PI*2 - Math.PI/2; const cx=50+50*Math.cos(a), cy=50+50*Math.sin(a); return html`<span key=${k} style=${{position:'absolute',left:cx+'%',top:cy+'%',transform:'translate(-50%,-50%)',width:24,height:24,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center',boxShadow:'0 1px 6px rgba(28,126,214,.32)',zIndex:2}}><i class=${'ti ti-'+ic} style=${{fontSize:14,color:'#1c7ed6',WebkitTextStroke:'0.6px #1c7ed6'}}/></span>`; })}
  </div>`;

  const heroBlock=html`<${Box} sx=${{position:'relative',zIndex:1,flex:1,minHeight:0,overflowY:'auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'safe center',textAlign:'center',px:{xs:2,md:3},pt:homeMode?(isPhone()?`calc(${isCompact()?8:(__vh>=800?88:16)}px + max(env(safe-area-inset-top,0px), var(--dp-safe-top,0px)))`:(__vh>=900?'148px':(__vh>=700?'96px':'40px'))):4,pb:isPhone()?(isCompact()?.75:2):(__vh>=900?6:2)}}>
    <${Box} sx=${{position:'relative',display:(isShort()&&__vw>=600)?'none':'grid',placeItems:'center',mt:isPhone()?(isCompact()?1.2:3):0,mb:isCompact()?1:2}}>
      <${Box} sx=${{position:'absolute',width:{xs:150,md:240},height:{xs:150,md:240},borderRadius:'50%',background:'radial-gradient(circle at 50% 45%, rgba(34,139,230,.20), rgba(51,154,240,.12) 46%, rgba(34,139,230,0) 72%)',animation:'panelbreathe 3.4s ease-in-out infinite'}}/>
      <${Box} sx=${{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:{xs:300,md:400},height:{xs:300,md:400},pointerEvents:'none',WebkitMaskImage:'linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,.55) 60%, transparent 74%)',maskImage:'linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,.55) 60%, transparent 74%)',WebkitMaskRepeat:'no-repeat',maskRepeat:'no-repeat',WebkitMaskSize:'100% 100%',maskSize:'100% 100%'}}>
        <${Box} sx=${{position:'absolute',left:'50%',top:'50%',width:0,height:0}}>
          ${ring(0,['plus','divide','percentage'])}${ring(1,['math-function','math-pi','square-root-2'])}${ring(2,['atom-2','flask','calculator'])}
        <//>
      <//>
      <${Box} onClick=${onMaxClick?doLaunch:undefined} onMouseEnter=${()=>setMaxHov(true)} onMouseLeave=${()=>setMaxHov(false)} sx=${{position:'relative',zIndex:2,cursor:onMaxClick?'pointer':'default',transition:launch>=2?'transform 2.1s cubic-bezier(.3,0,.3,1), opacity .95s ease .2s':'transform .25s cubic-bezier(.2,.8,.3,1.2)',transform:launch>=2?'translateY(20px) scale(2)':(maxHov?'translateY(20px) scale(1.06)':'translateY(20px)'),opacity:launch>=2?0:1}}>
        <${Buddy} who="max" size=${isPhone()?(isShort()?52:(isCompact()?56:60)):81} mood="grin"/>
        ${(onMaxClick&&!launch)?html`<${Box} sx=${{position:'absolute',left:'50%',bottom:-14,transform:'translateX(-50%)',display:'flex',alignItems:'center',gap:.5,px:1.1,py:.4,borderRadius:999,whiteSpace:'nowrap',background:'rgba(45,32,90,.9)',color:'#fff',fontSize:11,fontWeight:700,boxShadow:SH_MD,opacity:maxHov?1:0,transition:'opacity .2s ease',pointerEvents:'none'}}><i class="ti ti-planet" style=${{fontSize:14}}/>Open my journey<//>`:''}
      <//>
      ${launch?html`<${Box} sx=${{position:'absolute',left:'50%',top:'50%',width:0,height:0,zIndex:3,pointerEvents:'none'}}>
        ${MAXSTARS.map((s,i)=>html`<i key=${i} class="ti ti-sparkles" style=${{position:'absolute',left:0,top:0,color:s.c,fontSize:s.s,filter:`drop-shadow(0 0 5px ${s.c})`,'--dx':s.x+'px','--dy':s.y+'px',animation:`starburst ${s.d}s ${s.dl}s ease-out infinite`}}/>`)}
      <//>`:''}
    <//>
    <${Box} sx=${{display:'flex',flexDirection:'column',alignItems:'center',width:'100%',transform:launch>=2?'translateY(78vh)':'translateY(0)',opacity:launch>=2?0:1,transition:'transform 1.6s cubic-bezier(.4,0,.2,1), opacity 1.1s ease'}}>
    <${Typography} variant="h5" sx=${{fontSize:{xs:26,md:24},mt:isShort()?'4px':{xs:'12px',md:'20px'}}}>${isPhone()?'Hi Aarav':'Hi Aarav! 👋'}<//>
    ${isPhone()?'':html`<${Typography} sx=${{color:DIM,fontSize:16,mt:.7,maxWidth:340,lineHeight:1.5}}>Pick up where you left off — or ask me anything below.<//>`}
    <${Box} sx=${{width:{xs:'100%',md:'80%'},maxWidth:full?600:'none',marginTop:isShort()?'10px':(isCompact()?'32px':{xs:'32px',md:(__vh>=900?'71px':(__vh>=700?'40px':'22px'))}),display:'flex',flexDirection:'column',gap:isPhone()?1:(isCompact()?.8:1.1)}}>
      <${Box} sx=${{display:isShort()?'none':'flex',alignItems:'center',justifyContent:'center',gap:1.2,mb:isPhone()?1.5:.2}}>
        <${Typography} sx=${{fontSize:12,fontWeight:isPhone()?500:800,letterSpacing:isPhone()?'.3px':'.6px',textTransform:'uppercase',color:isPhone()?'#6b6580':DIM,whiteSpace:'nowrap',flex:'none'}}>Pick up where you left off<//>
      <//>
      <${Box} sx=${{display:'flex',flexDirection:isPhone()?'row':'column',alignItems:'stretch',gap:isPhone()?2:(isCompact()?.8:1.1)}}>
      ${RESUME_CLASSES.map(r=>(isPhone()&&!isShort())
        ? html`<${HoverTile} key=${r.t} onClick=${()=>openTeachingRoom()} sx=${{flex:'1 1 0',minWidth:0,minHeight:138,p:2,position:'relative',overflow:'hidden',cursor:'pointer',display:'flex',flexDirection:'column',justifyContent:'space-between',textAlign:'left',borderRadius:16,background:`linear-gradient(152deg,#ffffff 0%,#ffffff 34%,${r.bg} 100%)`,border:`1px solid ${r.c}1f`,boxShadow:`inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(70,46,146,.05)`,transition:'transform .16s ease, box-shadow .16s ease','&:active':{transform:'scale(.975)'}}}>
            <${Box} aria-hidden="true" sx=${{position:'absolute',right:-16,bottom:-4,lineHeight:0,color:r.c,opacity:.11,filter:'blur(.6px)',pointerEvents:'none',transform:'rotate(-10deg)'}}><${Icon} n=${r.icon} size=${92}/><//>
            <${Typography} sx=${{position:'relative',fontWeight:700,fontSize:14,lineHeight:1.35,letterSpacing:'-.01em',color:INK}}>${r.sub}<//>
            <${Box} sx=${{position:'relative',alignSelf:'flex-start',display:'flex',alignItems:'center',gap:.55,color:r.tc}}>
              <${Icon} n="player-play-filled" size=${11}/>
              <${Typography} sx=${{fontSize:12,fontWeight:700,color:r.tc,letterSpacing:'.01em'}}>Continue<//>
            <//>
          <//>`
        : html`<${HoverTile} key=${r.t} onClick=${()=>openTeachingRoom()} sx=${{...cardSx,flex:isShort()?'1 1 0':'none',minWidth:0,pl:isShort()?1.2:2.2,pr:isShort()?1.2:2.2,py:isShort()?'9px':'25px',cursor:'pointer',display:'flex',alignItems:'center',gap:isShort()?1:1.4,textAlign:'left',borderRadius:14,transition:'border-color .16s ease, background .16s ease, box-shadow .16s ease','&:hover':{border:`1px solid ${r.c}`,background:r.bg,boxShadow:SH_SM},'&:hover .resume-go':{transform:'scale(1.08)',boxShadow:'0 6px 16px rgba(28,126,214,.45)'}}}>
            <${Box} sx=${{width:isShort()?34:46,height:isShort()?34:46,flex:'none',borderRadius:isShort()?10:12,display:'grid',placeItems:'center',background:r.bg,color:r.c}}><${Icon} n=${r.icon} size=${isShort()?17:23}/><//>
            <${Box} sx=${{flex:1,minWidth:0}}>
              <${Typography} noWrap sx=${{fontSize:12.5,color:DIM,fontWeight:600,letterSpacing:'.2px'}}>${r.t}<//>
              <${Typography} noWrap sx=${{fontWeight:isShort()?700:800,fontSize:isShort()?14:17,mt:.15,letterSpacing:'-.01em'}}>${r.sub}<//>
            <//>
            <${Box} className="resume-go" sx=${{width:isShort()?34:40,height:isShort()?34:40,flex:'none',borderRadius:'11px',display:'grid',placeItems:'center',background:'linear-gradient(180deg,#339af0,#1c7ed6)',color:'#fff',boxShadow:'0 4px 12px rgba(28,126,214,.35)',transition:'.18s ease'}}><${Icon} n="player-play-filled" size=${16}/><//>
          <//>`)}
      <//>
    <//>
    <//>
  <//>`;

  const wrapW=full?764:'100%';
  // last index per speaker — everything earlier retracts its avatar
  // while thinking, the typing row owns the Vyom avatar — no real message may keep one
  const _lastVyomId=(()=>{ if(thinking) return '__typing__'; for(let i=messages.length-1;i>=0;i--){ const m=messages[i]; if(m.role!=='student') return m.id; } return null; })();
  const _lastStudentId=(()=>{ for(let i=messages.length-1;i>=0;i--){ const m=messages[i]; if(m.role==='student') return m.id; } return null; })();
  const _prevOwners = R.useRef({v:null,s:null});
  const _prevV=_prevOwners.current.v, _prevS=_prevOwners.current.s;
  _prevOwners.current={v:_lastVyomId,s:_lastStudentId};
  // an unmounting holder (the typing row) never fades, so its lane must not defer
  const _vDefer = _prevV!=null && _prevV!=='__typing__' && _prevV!==_lastVyomId;
  const _sDefer = _prevS!=null && _prevS!==_lastStudentId;
  const avSlot=(m,side,child,size)=>{
    if(isPhone()) return null;
    const live = m && (m.id===_lastVyomId || m.id===_lastStudentId);
    const defer = live && (m.id===_lastVyomId ? _vDefer : _sDefer);
    const dx = side==='left' ? 38 : -38;
    const sz = size || (side==='left'?29:34);
    return html`<div style=${{position:'relative',flex:'none',width:sz,height:sz,alignSelf:'flex-start',marginTop:side==='left'?0:2}}>
      <div style=${{position:'absolute',inset:0,zIndex:live?3:0,opacity:live?1:0,transform:live?'translateX(0) scale(1)':`translateX(${dx}px) scale(.62)`,transition:live?'none':'opacity .15s ease, transform .15s cubic-bezier(.2,.7,.3,1)',animation:live?(defer?'avIn .01s linear .15s both':'none'):'none',pointerEvents:live?'auto':'none'}}>${child}</div>
    </div>`;
  };
  const rowWrap=(key,extra,children)=>html`<div key=${key} class="msg" style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',...extra}}>${children}</div>`;
  const suck=(m)=> ({});
  const speak=(t)=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(t)); u.rate=1; u.pitch=1.05; window.speechSynthesis.speak(u); }catch(e){} };
  const listenBtn=(t,dark)=>html`<${Box} onClick=${()=>speak(t)} sx=${{marginTop:9,display:'inline-flex',alignItems:'center',gap:5,cursor:'pointer',fontSize:11,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',color:DIM,transition:'.15s','&:hover':{color:BLUE7}}}><i class="ti ti-volume" style=${{fontSize:14}}/>Listen<//>`;
  const maxRow=(m)=>rowWrap(m.id,{display:'flex',gap:isPhone()?0:11,alignItems:'flex-start',...suck(m)},html`<${R.Fragment}>
    ${avSlot(m,'left',html`<${Buddy} who="max" size=${29} bob=${false} style=${{flexShrink:0,marginTop:0}}/>`)}
    <div style=${{position:'relative',zIndex:2,flex:ftueOn?'none':1,width:ftueOn?'min(560px, 100%)':'auto',minWidth:0,maxWidth:m.visual?460:(ftueOn?'none':'none')}}>
      
      <div style=${{background:m.featured?BLUE0:'rgba(244,241,255,.95)',border:m.featured?`1px solid ${BLUE2}`:'none',borderRadius:'4px 15px 15px 15px',padding:'12px 15px',fontSize:16,fontWeight:500,lineHeight:1.55,color:'#3a3450',boxShadow:SH_XS,whiteSpace:'pre-wrap'}}>
        ${m.featured?html`<div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:7,color:BLUE7,fontSize:11,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i class="ti ti-sparkles" style=${{fontSize:12}}/>Key idea</div>`:''}
        <div>${m.text}</div>
        ${m.visual?html`<div style=${{marginTop:12,paddingTop:12,borderTop:`1px solid ${m.featured?BLUE2:'rgba(120,90,200,.16)'}`}}>
          <${FractionVisual} step=${step}/>
          <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:14}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
        </div>`:''}
        ${(ftueOn||isPhone())?'':listenBtn(m.text)}
      </div>
    </div>
  <//>`);
  const studentRow=(m)=>rowWrap(m.id,{display:'flex',justifyContent:'flex-end',gap:isPhone()?0:10,...suck(m)},html`<${R.Fragment}>
    <div style=${{position:'relative',zIndex:2,maxWidth:'80%',background:BLUE,color:'#fff',borderRadius:'15px 15px 4px 15px',padding:'11px 15px',fontSize:16,fontWeight:500,lineHeight:1.5,boxShadow:SH_XS}}>${m.text}</div>
    ${avSlot(m,'right',html`<div style=${{width:34,height:34,borderRadius:10,overflow:'hidden',border:`1px solid ${BORDER}`}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>`)}
  <//>`);
  const summaryRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start'},html`<${R.Fragment}>
    ${avSlot(m,'left',html`<${Buddy} who="max" size=${29} bob=${false} style=${{flexShrink:0,marginTop:0}}/>`)}
    <div style=${{position:'relative',zIndex:2,flex:1,minWidth:0}}>
      <div style=${{fontSize:11,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:4}}>SUMMARY</div>
      <div style=${{position:'relative',background:'rgba(244,241,255,.95)',border:'none',borderRadius:'4px 15px 15px 15px',padding:'13px 15px',boxShadow:SH_SM,overflow:'hidden',animation:'capsulepop .55s cubic-bezier(.2,1.2,.4,1) both'}}>
        <div style=${{position:'relative',zIndex:1}}>
          <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:8,color:VIOLET9,fontSize:11,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i class="ti ti-circle-check" style=${{fontSize:12}}/>Concept cleared · Adding unlike fractions</div>
          <div style=${{fontSize:16,fontWeight:500,lineHeight:1.55,color:INK}}>${SUMMARY_TEXT}</div>
          <${FracMini}/>
          <${Box} onClick=${()=>setSumOpen(o=>!o)} sx=${{marginTop:11,display:'inline-flex',alignItems:'center',gap:6,cursor:'pointer',fontSize:12,fontWeight:700,color:BLUE7,'&:hover':{color:BLUE9}}}><i class=${'ti '+(sumOpen?'ti-arrows-diagonal-minimize-2':'ti-arrows-diagonal')} style=${{fontSize:14}}/>${sumOpen?'Hide full explanation':'Expand full explanation'}<//>
          ${listenBtn(SUMMARY_TEXT)}
          ${sumOpen?html`<div style=${{marginTop:13,paddingTop:13,borderTop:'1px solid rgba(120,90,200,.16)',animation:'selin .3s ease both'}}>
            <div style=${{fontSize:11,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:10,textTransform:'uppercase'}}>Full explanation</div>
            ${transcriptBody()}
          </div>`:''}
        </div>
      </div>
    </div>
  <//>`);
  const bubble=(m)=> m.ftueQ!=null?ftueQRow(m) : m.ftueGate?ftueGateRow(m) : m.summary?summaryRow(m) : m.explain?explainRow(m) : m.role==='student'?studentRow(m) : maxRow(m);
  const ftueSel=(i)=>{ const q=FTUE_Q[i], a=fans[i]; return q.multi?(Array.isArray(a)?a:[]):(a?[a]:[]); };
  const ftueComplete=FTUE_Q.every((q,i)=>ftueSel(i).length>0);
  const FTUE_BUBBLE_W='min(560px, 100%)';
  const vyomShell=(key,children)=>rowWrap(key,{display:'flex',gap:11,alignItems:'flex-start'},html`<${R.Fragment}>
    ${avSlot({id:key},'left',html`<${Buddy} who="max" size=${29} bob=${false} style=${{flexShrink:0,marginTop:0}}/>`)}
    <div style=${{position:'relative',zIndex:2,flex:'none',width:FTUE_BUBBLE_W,minWidth:0}}>
      
      <div style=${{width:'100%',background:'rgba(244,241,255,.95)',border:'none',borderRadius:'4px 15px 15px 15px',padding:'12px 15px',boxShadow:SH_XS}}>${children}</div>
    </div>
  <//>`);
  const ftueQRow=(m)=>{
    const i=m.ftueQ, q=FTUE_Q[i], sel=ftueSel(i), live=(i===fq && !fgate);
    return vyomShell(m.id,html`<${R.Fragment}>
      <div style=${{fontSize:16,lineHeight:1.55,color:INK,fontWeight:500}}>${q.t}</div>
      ${q.multi?html`<div style=${{marginTop:5,display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:500,color:DIM}}><i class="ti ti-hand-finger" style=${{fontSize:14}}/>Pick as many as you like<//>`:''}
      <div style=${{marginTop:12,paddingTop:12,borderTop:`1px solid ${BORDER}`,display:'flex',flexWrap:'wrap',gap:9}}>
        ${q.o.map(o=>{ const on=sel.indexOf(o)>=0; return html`<${RippleHover} key=${o} onClick=${()=>pickFtue(i,o)} radius="10px" sx=${{display:'flex',alignItems:'center',gap:.6,px:1.9,py:1.05,cursor:'pointer',borderRadius:10,fontSize:16,fontWeight:500,transition:'.15s',color:on?BLUE7:INK,background:on?BLUE0:'#fff',borderWidth:'1.5px',borderStyle:'solid',borderColor:on?BLUE:BORDER,boxShadow:'none','&:hover':{background:BLUE0,borderColor:on?BLUE7:BLUE2}}}><i class="ti ti-check" style=${{fontSize:15,width:on?15:0,opacity:on?1:0,overflow:'hidden',transition:'width .15s ease,opacity .15s ease'}}/>${o}<//>`; })}
      </div>
      ${(q.multi&&live&&sel.length>0)?html`<div style=${{marginTop:13}}><${RippleHover} onClick=${()=>ftueNext(i)} radius="10px" sx=${{display:'inline-flex',alignItems:'center',gap:.875,px:2,py:1.1,cursor:'pointer',borderRadius:10,color:'#fff',background:BLUE,fontSize:14,fontWeight:500,boxShadow:SH_SM,'&:hover':{background:BLUE7}}}>Next<i class="ti ti-arrow-right" style=${{fontSize:16}}/><//></div>`:''}
    <//>`);
  };
  const ftueGateRow=(m)=>vyomShell(m.id,html`<${R.Fragment}>
    <div style=${{fontSize:16,lineHeight:1.55,color:INK,fontWeight:500}}>Here's what I've got — does this look right? Tap any option above to change it.</div>
    <div style=${{marginTop:13}}>
      <${RippleHover} onClick=${()=>{ if(ftueComplete) setFload(true); }} radius="10px" sx=${{display:'inline-flex',alignItems:'center',gap:.875,px:2,py:1.1,borderRadius:10,fontSize:14,fontWeight:500,cursor:ftueComplete?'pointer':'not-allowed',color:'#fff',background:ftueComplete?BLUE:'#c3bfd6',boxShadow:ftueComplete?SH_SM:'none','&:hover':{background:ftueComplete?BLUE7:'#c3bfd6'}}}><i class="ti ti-check" style=${{fontSize:16}}/>Confirm & continue<//>
    </div>
  <//>`);
  const explainRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start'},html`<${R.Fragment}>
    ${avSlot(m,'left',html`<${Buddy} who="max" size=${29} bob=${false} style=${{flexShrink:0,marginTop:0}}/>`)}
    <div style=${{position:'relative',zIndex:2,flex:1,minWidth:0}}>
      
      <div style=${{background:'rgba(244,241,255,.95)',border:'none',borderRadius:'4px 15px 15px 15px',padding:'14px 16px',boxShadow:SH_XS}}>
        <div style=${{fontSize:16,fontWeight:500,lineHeight:1.55,color:'#3a3450',animation:'xsIn .45s ease both'}}>${FRAC_INTRO}</div>
        ${xs>=2?html`<div style=${{marginTop:12,background:BLUE0,border:`1px solid ${BLUE2}`,borderRadius:12,padding:'12px 14px',animation:'xsIn .45s ease both'}}>
          <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:6,color:BLUE7,fontSize:11,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i class="ti ti-sparkles" style=${{fontSize:12}}/>Key idea<//>
          <div style=${{fontSize:14,lineHeight:1.55,color:INK,fontWeight:700}}>${FRAC_KEY}</div>
          <div style=${{marginTop:12,paddingTop:12,borderTop:`1px solid ${BLUE2}`}}>
            <${FractionVisual} step=${xs>=3?step:0} hide=${true}/>
            <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:14}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:(xs>=3&&step>=i)?20:7,height:7,borderRadius:999,background:(xs>=3&&step>=i)?BLUE:G3,transition:'.4s'}}/>`)}</div>
          </div>
        </div>`:''}
        ${xs>=6?html`<div style=${{marginTop:14,fontSize:16,fontWeight:500,lineHeight:1.55,color:'#3a3450',animation:'xsIn .45s ease both'}}>${FRAC_ASK_TEXT}</div>`:''}
        ${xs<6?html`<div style=${{display:'flex',gap:4,marginTop:12,padding:'4px 0'}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:6,height:6,borderRadius:'50%',background:VIOLET,opacity:.55,animation:`xsDot 1s ${i*.16}s infinite ease-in-out`}}/>`)}</div>`:''}
        ${xs>=6?listenBtn(FRAC_INTRO+' '+FRAC_KEY+' '+FRAC_ASK_TEXT):''}
      </div>
    </div>
  <//>`);
  const visualRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start',...suck(m)},html`<${R.Fragment}>
    ${avSlot(m,'left',html`<${Buddy} who="max" size=${29} bob=${false} style=${{flexShrink:0,marginTop:0}}/>`)}
    <div style=${{position:'relative',zIndex:2,flex:1,minWidth:0,maxWidth:430}}>
      <div style=${{fontSize:12,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:4}}>VISUAL AID</div>
      <div style=${{background:'rgba(244,241,255,.95)',border:'none',borderRadius:'4px 15px 15px 15px',padding:'14px 15px',boxShadow:SH_XS}}>
        <${FractionVisual} step=${step}/>
        <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:14}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
      </div>
    </div>
  <//>`);

  const typingRow=html`<div key="typing" class="msg" style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',display:'flex',gap:11,alignItems:'center'}}>
    ${avSlot({id:'__typing__'},'left',html`<${Buddy} who="max" size=${38} bob=${true} style=${{flexShrink:0}}/>`,38)}
    <div style=${{display:'flex',gap:4,padding:'10px 12px',borderRadius:999,background:'#fff',border:`1px solid ${BORDER}`,boxShadow:SH_XS}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:VIOLET,animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</div>
  </div>`;
  const askChips=html`<div style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',display:'flex',gap:10,paddingLeft:49,flexWrap:'wrap'}}>
    <${RippleHover} onClick=${()=>answer('got')} radius="10px" sx=${{px:1.9,py:1.05,cursor:'pointer',color:'#fff',background:TEAL8,fontSize:12,fontWeight:700,boxShadow:SH_XS,display:'flex',alignItems:'center',gap:7,'&:hover':{background:TEAL9}}}><i class="ti ti-thumb-up" style=${{fontSize:16}}/>I've got it<//>
    <${RippleHover} onClick=${()=>answer('doubt')} radius="10px" sx=${{px:1.9,py:1.05,cursor:'pointer',color:INK,background:'#fff',borderWidth:'1px',borderStyle:'solid',borderColor:BORDER,fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:7,'&:hover':{borderColor:BLUE2,background:BLUE0}}}><i class="ti ti-help-circle" style=${{fontSize:16,color:BLUE}}/>I still have a doubt<//>
  </div>`;
  const wrapOpts=html`<div style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',display:'flex',gap:10,paddingLeft:49,flexWrap:'wrap'}}>
    <${RippleHover} onClick=${onResume} radius="10px" sx=${{px:2,py:1.1,cursor:'pointer',color:'#fff',background:BLUE,fontSize:14,fontWeight:700,boxShadow:SH_SM,display:'flex',alignItems:'center',gap:7,'&:hover':{background:BLUE7}}}><i class="ti ti-player-play-filled" style=${{fontSize:14}}/>Start the class<//>
    <${RippleHover} onClick=${reset} radius="10px" sx=${{px:2,py:1.1,cursor:'pointer',color:INK,background:'#fff',borderWidth:'1px',borderStyle:'solid',borderColor:BORDER,fontSize:14,fontWeight:700,display:'flex',alignItems:'center',gap:7,'&:hover':{borderColor:VIOLET2,background:VIOLET0}}}><i class="ti ti-message-plus" style=${{fontSize:16,color:VIOLET}}/>Ask another doubt<//>
  </div>`;

  const compPill=html`<div style=${{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:3,display:'flex',alignItems:'center',gap:8,padding:'9px 16px',borderRadius:999,background:'#fff',border:`1px solid #f0c000`,boxShadow:SH_MD,fontSize:12,fontWeight:700,color:'#a5750b',whiteSpace:'nowrap'}}>Compressing<span style=${{display:'inline-flex',gap:3}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:'#f0a000',animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</span></div>`;
  const chatBlock=html`<${Box} ref=${scrollRef} sx=${{position:'relative',zIndex:1,flex:1,minHeight:0,overflowY:'auto',display:'flex',flexDirection:'column',gap:16,px:full?3:2.2,pt:homeMode?'92px':2.6,pb:2.6}}>
    ${comp?html`<div style=${{position:'relative',width:'100%',maxWidth:wrapW,alignSelf:'center',borderRadius:18,padding:'14px 12px',border:'2px solid #f0c000',background:'#fff9db',boxShadow:'0 0 0 4px rgba(240,192,0,.14)',animation:'selin .4s ease both'}}>
        <div style=${{display:'flex',flexDirection:'column',gap:2,transformOrigin:'center center',opacity:comp==='collapse'?0:.7,transform:comp==='collapse'?'scale(.55)':'scale(1)',transition:'opacity .55s ease, transform .58s cubic-bezier(.6,0,.75,0)'}}>
          ${messages.map(bubble)}
        </div>
        ${compPill}
      </div>`
    : html`<div style=${{display:'flex',flexDirection:'column',gap:16,opacity:vis==='transcript'?.3:1,transition:'opacity .35s ease'}}>
        ${messages.map(bubble)}
        ${thinking?typingRow:''}
        ${stage==='asking'?askChips:''}
        ${stage==='wrap'?wrapOpts:''}
      </div>`}
  <//>`;

  /* ---- LEFT: chat history (present only in full; slides in from the left) ---- */
  const phone=isPhone();
  const histW=!full?0:(phone?(histCol?0:'100%'):(histCol?72:447));
  const histItem=(h,showChip)=>{ const c=chapColor(h.chapter); return html`<${Box} key=${h.id} sx=${{padding:'10px 11px',borderRadius:11,border:`1px solid ${BORDER}`,cursor:'pointer',background:'#fff',transition:'background .15s ease, box-shadow .15s ease','&:hover':{background:c+'0d',boxShadow:SH_SM}}}>
    ${showChip?html`<div style=${{marginBottom:6}}><span style=${{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,color:c,background:c+'16',padding:'2px 8px',borderRadius:999}}><span style=${{width:6,height:6,borderRadius:'50%',background:c}}/>${h.chapter}</span></div>`:''}
    <div style=${{fontSize:12,fontWeight:700,color:INK,lineHeight:1.3}}>${h.t}</div>
    <div style=${{display:'flex',alignItems:'center',gap:5,fontSize:11,color:DIM,fontWeight:500,marginTop:4}}><i class="ti ti-clock" style=${{fontSize:12}}/>${h.date} · ${h.time}</div>
  <//>`; };
  const historyCol=html`<${Box} sx=${{width:histW,flex:'none',...(phone&&!histCol?{position:'absolute',inset:0,zIndex:26,background:'linear-gradient(180deg,#f3f0ff 0%,#f8f9fa 52%,#fff4e6 100%)'}:{}),...(phone&&histCol?{display:'none'}:{}),background:'transparent',borderRight:(full&&!histCol)?`1px solid ${BORDER}`:'none',display:'flex',flexDirection:'column',transition:'width .5s cubic-bezier(.2,.7,.3,1)',overflow:'hidden'}}>
    <${Box} sx=${{width:phone?'100%':(histCol?72:447),flex:1,minHeight:0,display:'flex',flexDirection:'column'}}>
      ${histCol
        ? html`<${Box} sx=${{flex:1,minHeight:0,display:'flex',flexDirection:'column','&:hover .hist-icon':{background:'#e7f5ff',color:'#1c7ed6'}}}>
            <div style=${{height:64,flex:'none',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'24px 0 0',boxSizing:'border-box'}}>
              <${Box} sx=${{width:40,height:40,flex:'none',borderRadius:8,overflow:'hidden',display:'grid',placeItems:'center',background:'transparent'}}><img src="logo.png" alt="Byjus.AI" style=${{width:'100%',height:'100%',objectFit:'contain'}}/><//>
            </div>
            <span aria-hidden="true" style=${{display:'block',margin:'16px auto 0',width:28,height:1,flex:'none',background:'rgba(112,72,232,.18)',borderRadius:1}}></span>
            <div style=${{flex:1,minHeight:0,overflowY:'auto',padding:'16px 0 12px',display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
              ${[['target',openGoals,'Goals'],['map-2',openChapterJourney,'Chapters']].map(([n,fn,t])=>html`<${Box} key=${t} onClick=${(e)=>{ e.stopPropagation(); fn(); }} title=${t} sx=${{width:52,height:52,flex:'none',borderRadius:14,display:'grid',placeItems:'center',background:'#e9e2fe',color:'#5c5f8a',cursor:'pointer',transition:'background .15s ease, color .15s ease','&:hover':{background:'#e7f5ff',color:'#1c7ed6'}}}><${Icon} n=${n} size=${24}/><//>`)}
              <span aria-hidden="true" style=${{display:'block',margin:'8px 0',width:28,height:1,flex:'none',background:'rgba(112,72,232,.18)',borderRadius:1}}></span><${Box} onClick=${(e)=>{ e.stopPropagation(); try{ window.location.href=encodeURI('Profile.dc.html'); }catch(err){} }} title="Profile" sx=${{width:52,height:52,flex:'none',borderRadius:14,overflow:'hidden',background:'#e9e2fe',cursor:'pointer',transition:'box-shadow .15s ease','&:hover':{boxShadow:'0 0 0 2px #74c0fc'}}}><${Box} sx=${{width:'100%',height:'100%'}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/><//><//>
            </div>
          <//>`
        : html`<${R.Fragment}>
            <div style=${{minHeight:88,flex:'none',display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'24px 28px 0'}}>
              <${Box} onClick=${()=>{ if(started) reset(); }} title="Byjus.AI — home" sx=${{display:'flex',alignItems:'center',gap:1,minWidth:0,height:40,cursor:'pointer'}}>
                <${Box} sx=${{width:40,height:40,flex:'none',borderRadius:8,overflow:'hidden',display:'grid',placeItems:'center',background:'transparent'}}><img src="logo.png" alt="Byjus.AI" style=${{width:'100%',height:'100%',objectFit:'contain'}}/><//>
                <${Typography} noWrap sx=${{fontWeight:700,fontSize:16}}>Byjus.AI<//>
              <//>
              <${Box} sx=${{height:40,display:'flex',alignItems:'center'}}>${iconBtn('layout-sidebar-left-collapse',()=>setHistCol(true),'Collapse')}<//>
            </div>
            <div style=${{flex:1,minHeight:0,overflowY:'auto',padding:'12px 12px 12px',display:'flex',flexDirection:'column',gap:8,WebkitMaskImage:'linear-gradient(to bottom, #000 82%, transparent 99%)',maskImage:'linear-gradient(to bottom, #000 82%, transparent 99%)'}}>
              ${[...HISTORY].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(h=>histItem(h,true))}
            </div>
          <//>`}
    <//>
  <//>`;

  /* ---- RIGHT: visual aid / transcript (present only in full) ---- */
  const rightOpen=full && vis!=='closed';
  function transcriptBody(){ return html`<div style=${{display:'flex',flexDirection:'column',gap:13}}>
    ${transcript.filter(m=>!m.ask&&m.text!==FRAC_ASK_TEXT).map(m=> m.role==='student'
      ? html`<div key=${m.id} style=${{display:'flex',justifyContent:'flex-end'}}><div style=${{maxWidth:'86%',background:BLUE,color:'#fff',borderRadius:'12px 12px 3px 12px',padding:'8px 12px',fontSize:12,fontWeight:500,lineHeight:1.45}}>${m.text}</div></div>`
      : m.explain
      ? html`<div key=${m.id} style=${{display:'flex',gap:8,alignItems:'flex-start'}}>
          <${Buddy} who="max" size=${28} bob=${false} style=${{flexShrink:0,marginTop:1}}/>
          <div style=${{flex:1,minWidth:0,background:'rgba(244,241,255,.95)',border:'none',borderRadius:'3px 12px 12px 12px',padding:'11px 12px'}}>
            <div style=${{fontSize:12,lineHeight:1.5,color:'#3a3450'}}>${FRAC_INTRO}</div>
            <div style=${{marginTop:10,background:BLUE0,border:`1px solid ${BLUE2}`,borderRadius:10,padding:'10px 11px'}}>
              <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:5,color:BLUE7,fontSize:11,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase'}}><i class="ti ti-sparkles" style=${{fontSize:12}}/>Key idea<//>
              <div style=${{fontSize:12,lineHeight:1.5,color:INK,fontWeight:700}}>${FRAC_KEY}</div>
              <div style=${{marginTop:10,paddingTop:10,borderTop:`1px solid ${BLUE2}`}}><${FractionVisual} step=${3}/></div>
            </div>
          </div>
        </div>`
      : html`<div key=${m.id} style=${{display:'flex',gap:8,alignItems:'flex-start'}}>
          <${Buddy} who="max" size=${28} bob=${false} style=${{flexShrink:0,marginTop:1}}/>
          <div style=${{flex:1,background:m.featured?BLUE0:'rgba(244,241,255,.95)',border:m.featured?`1px solid ${BLUE2}`:'none',borderRadius:'3px 12px 12px 12px',padding:'8px 11px',fontSize:12,lineHeight:1.5,color:INK,whiteSpace:'pre-wrap'}}>${m.text}</div>
        </div>`)}
  </div>`; }
  const rightCol=html`<${Box} sx=${{width:rightOpen?796:0,flex:'none',background:'#fff',borderLeft:rightOpen?`1px solid ${BORDER}`:'none',display:'flex',flexDirection:'column',transition:'width .45s cubic-bezier(.2,.7,.3,1)',overflow:'hidden'}}>
    <${Box} sx=${{width:796,flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <div style=${{minHeight:65,flex:'none',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px 0 18px',borderBottom:`1px solid ${BORDER}`}}>
        <div style=${{display:'flex',alignItems:'center',gap:8}}>
          <div style=${{width:30,height:30,borderRadius:8,display:'grid',placeItems:'center',background:vis==='transcript'?VIOLET0:BLUE0,color:vis==='transcript'?VIOLET:BLUE}}><${Icon} n=${vis==='transcript'?'messages':'chart-donut-3'} size=${18}/></div>
          <div>
            <div style=${{fontSize:14,fontWeight:700,color:INK,lineHeight:1.1}}>${vis==='transcript'?'Full explanation':'Visual aid'}</div>
            <div style=${{fontSize:11,color:DIM,fontWeight:500}}>Adding unlike fractions</div>
          </div>
        </div>
        ${iconBtn('x',()=>setVis('closed'),'Close')}
      </div>
      <div style=${{flex:1,minHeight:0,overflowY:'auto',padding:'18px 16px'}}>
        ${vis==='transcript'?transcriptBody():html`<${R.Fragment}>
          <${FractionVisual} step=${step}/>
          <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:16}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
        <//>`}
      </div>
      ${vis==='transcript'?html`<div style=${{flex:'none',padding:'12px 16px',borderTop:`1px solid ${BORDER}`}}>
        <${RippleHover} onClick=${resumeConversation} radius="10px" sx=${{width:'100%',py:1.2,cursor:'pointer',color:'#fff',background:BLUE,fontSize:14,fontWeight:700,boxShadow:SH_SM,display:'flex',alignItems:'center',justifyContent:'center',gap:8,'&:hover':{background:BLUE7}}}><i class="ti ti-arrow-back-up" style=${{fontSize:16}}/>Resume this conversation<//>
      </div>`:''}
    <//>
  <//>`;

  useEffect(()=>{
    if(!homeMode) return;
    const r=document.documentElement.style;
    const hide = convo && isPhone();
    r.setProperty('--nav-off', hide?'150%':'0%');
    r.setProperty('--nav-op', hide?'0':'1');
    r.setProperty('--nav-pe', hide?'none':'auto');
  },[convo,homeMode]);

  const centerCol=html`<${Box} sx=${{flex:1,minWidth:0,position:'relative',display:'flex',flexDirection:'column',overflow:'hidden',background:'transparent'}}>
    <${Box} sx=${{flex:'none',position:homeMode?'absolute':'relative',top:homeMode?(isPhone()?`calc(10px + max(env(safe-area-inset-top,0px), var(--dp-safe-top,0px)))`:'16px'):0,left:0,right:0,zIndex:34,display:'flex',alignItems:'center',gap:1.2,pl:(homeMode&&histCol&&!phone)?'12px':{xs:'10px',md:'17.6px'},pr:{xs:'10px',md:'17.6px'},minHeight:(phone&&homeMode&&!convo)?0:{xs:56,md:65},borderBottom:homeMode?'none':`1px solid ${BORDER}`,background:homeMode?'transparent':(full?'rgba(255,255,255,.66)':'transparent'),backdropFilter:(!homeMode&&full)?'blur(8px)':'none'}}>
      ${homeMode
        ? html`<${R.Fragment}>
            <${Box} sx=${{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:1.2,transform:(convo||launch>=2)?'translateY(-150%)':'translateY(0)',opacity:(convo||launch>=2)?0:1,transition:launch>=2?'transform 1.6s cubic-bezier(.4,0,.2,1), opacity 1.1s ease':'transform .58s cubic-bezier(.5,0,.2,1), opacity .38s ease',pointerEvents:(convo||launch>=2)?'none':'auto'}}>${(phone&&homeMode)?'':widgets}<//>
            ${(convo&&phone)?html`<${Box} onClick=${()=>{ const last=[...messages].reverse().find(m=>m.role!=='student'); if(last) speak(last.text); }} title="Read aloud" sx=${{width:44,height:44,flex:'none',borderRadius:'11px',display:'grid',placeItems:'center',cursor:'pointer',color:'#6b6580',background:'transparent',transition:'color .15s ease','&:hover':{color:INK}}}><${Icon} n="volume" size=${20}/><//>`:''}
            ${(convo&&phone)?html`<${Box} onClick=${()=>setHistCol(false)} title="Chat history" sx=${{width:44,height:44,flex:'none',borderRadius:'11px',display:'grid',placeItems:'center',cursor:'pointer',color:'#6b6580',background:'transparent',transition:'color .15s ease','&:hover':{color:INK}}}><${Icon} n="history" size=${20}/><//>`:''}
            ${convo?html`<${Box} onClick=${exitConvo} title="Close conversation" sx=${{width:44,height:44,flex:'none',borderRadius:'11px',display:'grid',placeItems:'center',cursor:'pointer',color:'#6b6580',fontSize:20,border:'none',background:'transparent',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',boxShadow:'0 8px 22px rgba(150,120,215,.14)',animation:'capsulepop .4s ease both',transition:'color .15s ease','&:hover':{color:INK}}}><${Icon} n="x" size=${20}/><//>`:''}
          <//>`
        : html`<${R.Fragment}>
            <${Box} sx=${{width:38,height:38,flex:'none',borderRadius:'8px',overflow:'hidden',border:`1px solid ${BORDER}`,display:'grid',placeItems:'center'}}><img src="logo.png" alt="Byjus.AI" style=${{width:'100%',height:'100%',objectFit:'contain'}}/><//>
            <${Box} sx=${{flex:1,minWidth:0}}>
              <${Typography} sx=${{fontWeight:700,fontSize:16,lineHeight:1.1}}>Byjus.AI<//>
            <//>
            ${started?iconBtn('edit',reset,'New chat'):''}
            ${full?html`<${Box} onClick=${(e)=>{ e&&e.stopPropagation&&e.stopPropagation(); closeRoom(); }} title="Close" sx=${{width:38,height:38,flex:'none',borderRadius:'9px',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,border:`1px solid ${BORDER}`,background:'#fff',transition:'.15s','&:hover':{color:INK,border:`1px solid ${G4}`}}}><${Icon} n="x" size=${19}/><//>`:''}
          <//>`}
    <//>

    ${homeMode
      ? html`<${Box} sx=${{position:'relative',zIndex:1,flex:1,minHeight:0,overflow:'hidden'}}>
          <${Box} sx=${{position:'absolute',inset:0,display:'flex',flexDirection:'column',transform:convo?'translateY(-112%)':'translateY(0)',opacity:convo?0:1,transition:'transform .58s cubic-bezier(.5,0,.2,1), opacity .4s ease',pointerEvents:convo?'none':'auto'}}>${heroBlock}<//>
          <${Box} sx=${{position:'absolute',inset:0,display:'flex',flexDirection:'column',transform:convo?'translateY(0)':'translateY(16px)',opacity:convo?1:0,transition:'transform .5s cubic-bezier(.4,0,.2,1) .1s, opacity .45s ease .1s',pointerEvents:convo?'auto':'none'}}>${chatBlock}<//>
        <//>`
      : (started?chatBlock:heroBlock)}

    <${Box} sx=${{position:'relative',zIndex:1,flex:'none',px:full?{xs:2,md:3}:1.8,pt:{xs:1.2,md:1.6},pb:homeMode?(isPhone()?`calc(${convo?24:(isShort()?92:(__vh>=800?136:100))}px + max(env(safe-area-inset-bottom,0px), var(--dp-safe-bottom,0px)))`:'74px'):(isPhone()?`calc(136px + max(env(safe-area-inset-bottom,0px), var(--dp-safe-bottom,0px)))`:'18px'),transform:launch>=2?'translateY(64vh)':'translateY(0)',opacity:launch>=2?0:(vis==='transcript'?.45:1),pointerEvents:(launch>=2||vis==='transcript')?'none':'auto',filter:vis==='transcript'?'grayscale(.4)':'none',transition:launch>=2?'transform 1.6s cubic-bezier(.4,0,.2,1), opacity 1.1s ease':'padding-bottom .42s cubic-bezier(.4,0,.2,1), opacity .3s ease'}}>
      <${Box} sx=${{position:'relative',maxWidth:full?820:'none',mx:full?'auto':0,opacity:ftueOn?.2:1,pointerEvents:ftueOn?'none':'auto',transition:'opacity .3s ease'}}>
        <div style=${{position:'absolute',inset:isPhone()?'-22px -14px':'-12px -8px',borderRadius:isPhone()?999:24,background:isPhone()?'radial-gradient(70% 150% at 50% 112%, rgba(51,154,240,.34), rgba(34,139,230,.16) 52%, transparent 76%)':'radial-gradient(62% 130% at 50% 118%, rgba(76,110,245,.22), rgba(121,80,242,.10) 55%, transparent 78%)',filter:isPhone()?'blur(16px)':'blur(11px)',pointerEvents:'none',animation:'hudglow 4s ease-in-out infinite'}}/>
        <${Box} onMouseEnter=${()=>{ if(!ftueOn) setInHov(true); }} onMouseLeave=${()=>setInHov(false)} sx=${{position:'relative',borderRadius:isPhone()?'999px':'18px',p:isPhone()?0:'7px',background:isPhone()?'transparent':'linear-gradient(158deg,#f3f4fd 0%,#e9ecfa 54%,#e0e3f5 100%)',border:isPhone()?'none':`1px solid ${active?BLUE2:'#c6caea'}`,boxShadow:isPhone()?'none':(active?`0 0 0 3px ${BLUE}1f, 0 12px 30px rgba(28,18,74,.2)`:'0 10px 26px rgba(28,18,74,.14), inset 0 1px 0 rgba(255,255,255,.9)'),transition:'box-shadow .3s ease, border-color .3s ease'}}>
          ${isPhone()?'':html`<${Rivets} inset=${5} size=${5}/>`}
          ${(()=>{ const sugOpen=(focus&&!ftueOn&&vis!=='transcript'&&!convo)||(convo&&!goalChatRef.current&&!thinking&&messages.length<=2);
            const ALL=[['help-circle','Doubt','I have a doubt'],['target','Set a goal','I want to set a goal'],['trophy','Practice','I want to practice'],['notebook','Homework','I need homework help'],['pencil','Change goal','I want to change my goal']];
            const list=moreSug?ALL:ALL.slice(0,3);
            const chip=(k,ic,label,fn,d)=>html`<${Box} key=${k} onClick=${fn} sx=${{display:'inline-flex',alignItems:'center',gap:'7px',height:36,px:'14px',pl:'10px',borderRadius:999,background:'rgba(112,72,232,.08)',color:'#3f3a63',fontSize:14,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'background .15s ease',animation:sugOpen?`sugIn .32s ${d}s cubic-bezier(.2,.8,.3,1) both`:'none','&:hover':{background:'rgba(112,72,232,.14)'}}}><${Icon} n=${ic} size=${17} style=${{color:'#7048e8'}}/>${label}<//>`;
            const chips=[...list.map(([ic,l,t],k)=>chip(l,ic,l,()=>{ setText(t); setTimeout(()=>{ const el=document.querySelector('input[placeholder]'); el&&el.focus(); },0); },k*.04)), moreSug?'':chip('more','dots','More',()=>setMoreSug(true),list.length*.04)];
            if(isPhone()) return sugOpen?html`<${Box} onMouseDown=${(e)=>e.preventDefault()} sx=${{position:'absolute',bottom:'100%',left:0,right:0,pb:'12px',display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'8px',zIndex:2}}>${chips}<//>`:'';
            return html`<div onMouseDown=${(e)=>e.preventDefault()} style=${{position:'relative',zIndex:1,display:'grid',gridTemplateRows:sugOpen?'1fr':'0fr',transition:'grid-template-rows .32s cubic-bezier(.2,.8,.3,1)'}}><div style=${{minHeight:0,overflow:'hidden'}}><div style=${{display:'flex',flexWrap:'wrap',gap:8,padding:'4px 6px 10px'}}>${sugOpen?chips:''}</div></div></div>`; })()}
          <${Box} sx=${{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:.4,px:isPhone()?.9:1.1,minHeight:{xs:64,md:54},borderRadius:isPhone()?'999px':'12px',background:isPhone()?'rgba(255,255,255,.86)':CARD,backdropFilter:isPhone()?'blur(18px) saturate(1.6)':'none',WebkitBackdropFilter:isPhone()?'blur(18px) saturate(1.6)':'none',border:isPhone()?'1px solid rgba(255,255,255,.9)':`1px solid ${BORDER}`,boxShadow:(isPhone()?(active?`0 0 0 3px ${BLUE}26, 0 14px 34px -12px rgba(70,46,146,.42), inset 0 1px 0 rgba(255,255,255,.95)`:'0 12px 30px -12px rgba(70,46,146,.32), 0 2px 6px rgba(70,46,146,.10), inset 0 1px 0 rgba(255,255,255,.95)'):'none'),transition:'box-shadow .28s ease'}}>
        ${iconBtn('paperclip')}
        <input value=${text} disabled=${vis==='transcript'||ftueOn} onChange=${e=>setText(e.target.value)} onFocus=${()=>setFocus(true)} onBlur=${()=>{ setFocus(false); setMoreSug(false); }}
          onKeyDown=${e=>{ if(e.key==='Enter'&&!ftueOn) submit(); }} placeholder=${ftueOn?'':(vis==='transcript'?'Reading the full explanation…':(started?'Reply to Vyom…':'Ask Vyom anything…'))}
          style=${{flex:1,minWidth:0,alignSelf:'stretch',border:'none',outline:'none',background:'transparent',fontFamily:SYS,fontSize:isPhone()?14:14,fontWeight:500,color:INK,caretColor:BLUE}}/>
        <${Box} sx=${{width:{xs:44,md:36},height:{xs:44,md:36},flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.15s','&:hover':{background:G0,color:BLUE}}}><${Icon} n="microphone" size=${19}/><//>
        <${RippleHover} onClick=${submit} radius="999px" sx=${{width:{xs:44,md:40},height:{xs:44,md:40},borderRadius:isPhone()?'50%':'11px',placeItems:'center',cursor:'pointer',color:'#fff',background:isPhone()?'linear-gradient(180deg,#339af0,#1c7ed6)':'linear-gradient(45deg, #228be6 0%, #15aabf 100%)',boxShadow:`0 4px 12px ${BLUE}3a`,transition:'.2s','&:hover':{filter:'brightness(1.06)',boxShadow:`0 6px 16px ${BLUE}4a`}}}>
          <${Box} sx=${{width:'100%',height:'100%',display:'grid',placeItems:'center'}}><${Icon} n="send" size=${18}/><//>
        <//>
          <//>
        <//>
      <//>
    <//>
  <//>`;

  return html`<${Box} sx=${{position:'relative',height:'100%',display:'flex',overflow:'hidden',background:'transparent',borderRight:full?'none':`1px solid ${BORDER}`}}>
    ${historyCol}
    ${centerCol}
    ${rightCol}
    ${fload?html`<${Box} sx=${{position:'fixed',inset:0,zIndex:9999,display:'grid',placeItems:'center',background:'rgba(40,30,70,.28)',backdropFilter:'blur(14px) saturate(1.05)',WebkitBackdropFilter:'blur(14px) saturate(1.05)'}}>
      <${Box} sx=${{width:'min(460px,88%)',background:'#fff',border:'1px solid #ece5ff',boxShadow:'0 34px 90px rgba(60,30,140,.34)',borderRadius:'26px',padding:'34px',display:'flex',flexDirection:'column',alignItems:'center',gap:2,textAlign:'center'}}>
        <div style=${{width:46,height:46,borderRadius:'50%',border:`3px solid ${BLUE2}`,borderTopColor:BLUE,animation:'spin 0.9s linear infinite'}}/>
        <${Box} sx=${{fontSize:20,fontWeight:800,color:INK,letterSpacing:'-.01em'}}>Setting up your personalised learning flow<//>
        <${Box} sx=${{fontSize:14,fontWeight:700,color:DIM}}>${FTUE_LOAD[floadMsg]}<//>
      <//>
    <//>`:''}
    ${launch?html`<${Box} sx=${{position:'absolute',inset:0,zIndex:15,pointerEvents:'none',overflow:'hidden'}}>
      ${NEBULA_BLOBS.map((b,i)=>html`<${Box} key=${i} sx=${{position:'absolute',left:b.l+'%',top:b.t+'%',width:b.s,height:b.s,marginLeft:`${-b.s/2}px`,marginTop:`${-b.s/2}px`,borderRadius:'50%',background:`radial-gradient(closest-side, ${b.c}, transparent 72%)`,filter:'blur(30px)',opacity:0,animation:`nebin ${b.d}s ${b.dl}s ease-out both, blobpulse ${b.md}s ${b.dl}s ease-in-out infinite`}}/>`)}
    <//>`:''}
    ${(full&&dust)?html`<div style=${{position:'absolute',inset:0,zIndex:60,pointerEvents:'none',overflow:'hidden'}}>
      <div style=${{position:'absolute',top:0,bottom:0,left:0,width:'42%',background:'linear-gradient(90deg, rgba(121,80,242,0) 0%, rgba(121,80,242,.09) 45%, rgba(34,139,230,.13) 66%, rgba(255,255,255,.5) 100%)',filter:'blur(3px)',animation:'roomsweep .9s cubic-bezier(.3,.6,.2,1) both'}}/>
      ${DUST.map((d,i)=>html`<i key=${i} class="ti ti-sparkles" style=${{position:'absolute',left:d.x+'%',top:d.y+'%',fontSize:d.s,color:d.col,filter:'drop-shadow(0 0 4px rgba(121,80,242,.45))',animation:`dusttw ${d.dur}s ${d.delay}s ease-in-out both`}}/>`)}
    </div>`:''}
  <//>`;
}

const CHAP_TOPICS={
  'Playing with Numbers':['Factors & multiples','Prime & composite numbers','Divisibility rules','Prime factorisation','Highest Common Factor','Lowest Common Multiple','Common factors & multiples','HCF–LCM word problems','Tests of divisibility'],
  'Perimeter & Area':['Perimeter of rectangles','Perimeter of squares','Area of a rectangle','Area of a square','Composite figures','Area of triangles','Units of measurement','Real-world perimeter','Estimating area'],
  'Whole Numbers':['The number line','Successor & predecessor','Properties of addition','Properties of multiplication','Patterns in numbers','Place value revisited','Rounding & estimation','Whole-number word problems'],
  'Integers':['Understanding integers','Integers on the number line','Adding integers','Subtracting integers','Multiplying integers','Dividing integers','Comparing & ordering','Absolute value','Integer word problems'],
  'Fractions & Decimals':['Types of fractions','Equivalent fractions','Comparing fractions','Adding like denominators','Adding unlike denominators','Subtracting fractions','Multiplying fractions','Introduction to decimals','Decimal place value','Fractions ↔ decimals','Word problems'],
};
const GEN_TOPICS=['Introduction','Core concept','Guided practice','Worked examples','Common mistakes','Applying the idea','Challenge problems','Chapter review'];
function buildChapter(n){
  const topics=CHAP_TOPICS[n.t]||GEN_TOPICS;
  const durs=['6 min','8 min','9 min','11 min','12 min','14 min'];
  const diffs=['Easy','Easy','Medium','Medium','Hard'];
  const pct=n.status==='done'?100:(n.p||0);
  const doneN=Math.round(topics.length*pct/100);
  const modules=topics.map((t,i)=>({t,dur:durs[i%durs.length],diff:diffs[i%diffs.length],status:n.status==='done'?'done':(i<doneN?'done':(i===doneN?'active':'locked'))}));
  const videos=topics.map((t,i)=>({t:`${t} — video lesson`,dur:durs[(i+2)%durs.length],mod:t})).slice(0,Math.min(12,topics.length));
  const aicons=['device-gamepad-2','math-function','ruler-2','chart-dots','abacus','shapes'];
  const applets=topics.filter((_,i)=>i%2===0).slice(0,6).map((t,i)=>({t:`${t} explorer`,mod:t,i:aicons[i%aicons.length]}));
  return {modules,videos,applets};
}

function JourneyMap({onResume,hideWorlds,intro}){
  const CH=GALAXY_CH;
  const N=CH.length;
  const NS=76, STEP=224, PADL=150, PADR=160, BAND=286, YU=90, YD=204;
  const trackW=PADL+(N-1)*STEP+PADR;
  const xOf=(i)=>PADL+i*STEP;
  const yOf=(i)=>(i%2===0)?YU:YD;
  const curIdx=Math.max(...CH.map((n,i)=>(n.status!=='locked')?i:-1));
  const doneCount=CH.filter(n=>n.status==='done').length;
  const bounds=[]; { let pm=null; CH.forEach((n,i)=>{ if(n.month!==pm){ bounds.push({x:xOf(i)-STEP/2,label:n.month}); pm=n.month; } }); }
  const nowMonth=(CH.find(n=>n.status==='now')||CH.find(n=>n.status==='prog')||{}).month;
  const segs=[];
  for(let i=0;i<N-1;i++){ const x0=xOf(i),y0=yOf(i),x1=xOf(i+1),y1=yOf(i+1),xm=(x0+x1)/2; segs.push({d:`M ${x0} ${y0} C ${xm} ${y0}, ${xm} ${y1}, ${x1} ${y1}`,traveled:(i+1)<=curIdx}); }
  const spk=[{l:-10,t:6,s:14,d:0},{l:76,t:-6,s:11,d:.5},{l:80,t:70,s:12,d:.9}];
  const pstars=(()=>{ let s=99; const r=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;}; const a=[]; for(let k=0;k<130;k++){ a.push({l:+(r()*100).toFixed(2),t:+(r()*100).toFixed(2),z:+(r()*2.2+0.6).toFixed(2),d:+(r()*5).toFixed(2),dur:+(2.4+r()*3).toFixed(2),o:+(0.35+r()*0.55).toFixed(2)}); } return a; })();
  const wrapRef=useRef(null);
  const [vw,setVw]=useState(0);
  const [offset,setOffset]=useState(0);
  const [dragging,setDragging]=useState(false);
  const drag=useRef({on:false,sx:0,so:0,moved:0});
  const inited=useRef(false);
  const clampO=(o,w)=>Math.min(0,Math.max(w-trackW,o));
  const [hint,setHint]=useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setHint(false),10000); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ const el=wrapRef.current; if(!el) return; const measure=()=>setVw(el.clientWidth); measure(); let ro; if(window.ResizeObserver){ ro=new ResizeObserver(measure); ro.observe(el); } window.addEventListener('resize',measure); return ()=>{ ro&&ro.disconnect(); window.removeEventListener('resize',measure); }; },[]);
  const [scale,setScale]=useState(1); const [introMode,setIntroMode]=useState(false);
  const [sel,setSel]=useState(null); const [panel,setPanel]=useState(false); const [view,setView]=useState('modules'); const [anchor,setAnchor]=useState(null); const [lockMsg,setLockMsg]=useState(false);
  const lockRef=useRef(null);
  const openChapter=(i,e)=>{ if(drag.current.moved>=6) return; const n=CH[i]; if(n.status==='locked'){ setLockMsg(true); clearTimeout(lockRef.current); lockRef.current=setTimeout(()=>setLockMsg(false),2200); return; } const r=e.currentTarget.getBoundingClientRect(); setAnchor({x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)}); setView('modules'); setSel(i); setTimeout(()=>setPanel(true),380); };
  const closeChapter=()=>{ setPanel(false); setTimeout(()=>setSel(null),560); };
  useEffect(()=>{ if(vw&&!inited.current){ inited.current=true; const focus=clampO(vw/2-xOf(curIdx),vw); if(intro){ const fit=Math.min(1, vw/trackW); setScale(fit); setOffset(0); requestAnimationFrame(()=>requestAnimationFrame(()=>{ setIntroMode(true); setScale(1); setOffset(focus); })); setTimeout(()=>setIntroMode(false),2000); } else { setOffset(focus); } } },[vw]);
  const onDown=(e)=>{ if(sel!=null) return; setDragging(true); drag.current={on:true,sx:e.clientX,so:offset,moved:0,cap:false}; };
  const onMove=(e)=>{ if(!drag.current.on) return; const dx=e.clientX-drag.current.sx; drag.current.moved=Math.max(drag.current.moved,Math.abs(dx)); if(drag.current.moved>5&&!drag.current.cap){ try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){} drag.current.cap=true; } setOffset(clampO(drag.current.so+dx,vw)); };
  const onUp=()=>{ drag.current.on=false; setDragging(false); };
  const canDrag=trackW>vw+2;
  return html`<${Box} sx=${{position:'relative',height:'100%',minHeight:360}}>
    <${Box} ref=${wrapRef} onPointerDown=${onDown} onPointerMove=${onMove} onPointerUp=${onUp} onPointerCancel=${onUp} sx=${{position:'relative',height:'100%',overflow:'hidden',background:'radial-gradient(150% 120% at 14% -10%, #6f59da 0%, #4a3ab2 34%, #372c93 66%, #29236e 100%)',cursor:canDrag?(dragging?'grabbing':'grab'):'default',touchAction:'pan-y',userSelect:'none',transform:sel!=null?'scale(1.32)':'none',transformOrigin:anchor?`${anchor.x}px ${anchor.y}px`:'50% 50%',transition:'transform .65s cubic-bezier(.4,0,.2,1)'}}>
    <${Box} sx=${{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(640px 420px at 82% 0%, rgba(155,92,246,.4), transparent 60%), radial-gradient(560px 380px at 6% 14%, rgba(76,110,245,.36), transparent 62%), radial-gradient(660px 440px at 70% 120%, rgba(34,184,207,.24), transparent 60%), radial-gradient(520px 360px at 28% 108%, rgba(240,105,138,.22), transparent 62%)'}}/>
    <${Box} sx=${{position:'absolute',left:'52%',top:'14%',width:560,height:400,pointerEvents:'none',borderRadius:'50%',background:'radial-gradient(closest-side, rgba(230,64,190,.5), rgba(196,44,208,.24) 46%, transparent 76%)',filter:'blur(34px)',mixBlendMode:'screen',animation:'blobpulse 7.5s ease-in-out infinite'}}/>
    <${Box} sx=${{position:'absolute',left:'64%',top:'30%',width:320,height:260,pointerEvents:'none',borderRadius:'50%',background:'radial-gradient(closest-side, rgba(255,92,214,.4), transparent 70%)',filter:'blur(26px)',mixBlendMode:'screen',animation:'blobpulse 9s ease-in-out 1.2s infinite'}}/>
    <${Box} sx=${{position:'absolute',inset:'-16%',pointerEvents:'none',background:'linear-gradient(118deg, transparent 33%, rgba(255,255,255,.12) 47%, rgba(200,180,255,.22) 50%, rgba(255,255,255,.12) 53%, transparent 67%)',filter:'blur(26px)'}}/>
    ${pstars.map((st,k)=>html`<span key=${'ps'+k} style=${{position:'absolute',left:st.l+'%',top:st.t+'%',width:st.z,height:st.z,borderRadius:'50%',background:`rgba(255,255,255,${st.o})`,boxShadow:`0 0 ${st.z*3}px rgba(200,210,255,${st.o*0.8})`,pointerEvents:'none',animation:`twinkle ${st.dur}s ease-in-out ${st.d}s infinite`}}/>`)}

    <div style=${{position:'absolute',top:0,bottom:0,left:0,width:trackW,transform:`translateX(${offset}px) scale(${scale})`,transformOrigin:'0 50%',transition:dragging?'none':(introMode?'transform 1.8s cubic-bezier(.4,0,.2,1)':'transform .3s cubic-bezier(.2,.8,.3,1)')}}>
      ${(()=>{ const bi=bounds.findIndex(b=>b.label===nowMonth); if(bi<0) return ''; const x0=bounds[bi].x, x1=bi+1<bounds.length?bounds[bi+1].x:trackW; return html`<div style=${{position:'absolute',left:x0,top:0,bottom:0,width:x1-x0,background:'linear-gradient(to bottom, rgba(139,110,255,0), rgba(139,110,255,.16) 26%, rgba(139,110,255,.16) 82%, rgba(139,110,255,0))',boxShadow:'inset 0 0 0 1px rgba(180,160,255,.14)',pointerEvents:'none',opacity:sel!=null?0:1,transition:'opacity .45s ease'}}/>`; })()}
      ${bounds.map((b,k)=>html`<div key=${'gl'+k} style=${{position:'absolute',left:b.x,top:0,bottom:0,width:1,background:'linear-gradient(to bottom, rgba(255,255,255,0), rgba(184,194,255,.24) 20%, rgba(184,194,255,.24) 84%, rgba(255,255,255,0))',pointerEvents:'none',opacity:sel!=null?0:1,transition:'opacity .45s ease'}}/>`)}
      ${bounds.map((b,k)=>{ const cur=b.label===nowMonth; return html`<div key=${'gm'+k} style=${{position:'absolute',left:b.x+13,bottom:46,fontSize:11,fontWeight:800,letterSpacing:'1.2px',textTransform:'uppercase',color:cur?'#ffffff':'rgba(206,193,255,.92)',pointerEvents:'none',whiteSpace:'nowrap',opacity:sel!=null?0:1,transition:'opacity .45s ease',...(cur?{background:'rgba(139,110,255,.5)',border:'1px solid rgba(255,255,255,.28)',padding:'3px 9px',borderRadius:'999px',boxShadow:'0 2px 8px rgba(80,50,180,.35)'}:{})}}>${b.label}${cur?' \u00b7 Now':''}</div>`; })}
      <div style=${{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:trackW,height:BAND}}>
        <svg width=${trackW} height=${BAND} viewBox=${`0 0 ${trackW} ${BAND}`} style=${{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible',opacity:sel!=null?0:1,transition:'opacity .45s ease'}}>
          ${segs.filter(s=>!s.traveled).map((s,i)=>html`<path key=${'u'+i} d=${s.d} fill="none" stroke="rgba(190,200,255,.32)" stroke-width=${3} stroke-linecap="round" stroke-dasharray="1 12"/>`)}
          ${segs.filter(s=>s.traveled).map((s,i)=>html`<path key=${'tg'+i} d=${s.d} fill="none" stroke="rgba(255,231,168,.16)" stroke-width=${14} stroke-linecap="round"/>`)}
          ${segs.filter(s=>s.traveled).map((s,i)=>html`<path key=${'tc'+i} d=${s.d} fill="none" stroke="#ffe7a8" stroke-width=${3.5} stroke-linecap="round" stroke-dasharray="1.5 9" style=${{filter:'drop-shadow(0 0 3px rgba(255,220,120,.9))'}}/>`)}
        </svg>
        ${CH.map((n,i)=>{ const lit=n.status!=='locked'; const playish=n.status==='now'||n.status==='prog'; const pct=n.p||0; const ringOut=(NS/2+8); const ang=(-90+pct*3.6)*Math.PI/180; const dotX=Math.cos(ang)*ringOut, dotY=Math.sin(ang)*ringOut;
          return html`<${Box} key=${n.t} onClick=${(e)=>openChapter(i,e)} sx=${{position:'absolute',left:xOf(i)+'px',top:yOf(i)+'px',transform:'translate(-50%,-50%)',width:NS,height:NS,zIndex:sel===i?10:(n.status==='now'?4:2),opacity:(sel==null||sel===i)?1:0,cursor:'pointer',transition:'transform .2s cubic-bezier(.2,.8,.3,1.2), opacity .5s ease','&:hover':{transform:`translate(-50%,-50%) scale(${lit?1.1:1.04})`,zIndex:6}}}>
          ${n.ring?html`<div style=${{position:'absolute',left:'50%',top:'50%',width:NS*1.72,height:NS*0.6,transform:'translate(-50%,-50%) rotate(-22deg)',borderRadius:'50%',border:`${lit?6:5}px solid ${lit?n.ringC:'#57527e'}`,borderLeftColor:'transparent',borderRightColor:'transparent',opacity:lit?.92:.42,boxShadow:lit?`0 0 12px ${n.ringC}66`:'none',pointerEvents:'none'}}/>`:''}
          ${playish?html`<div style=${{position:'absolute',left:'50%',top:'50%',width:NS*2.3,height:NS*2.3,transform:'translate(-50%,-50%)',borderRadius:'50%',background:`radial-gradient(closest-side, ${n.p2}66, ${n.p2}22 46%, transparent 72%)`,filter:'blur(7px)',pointerEvents:'none',zIndex:-1,animation:'blobpulse 3.2s ease-in-out infinite'}}/>`:''}
          ${playish?html`<div style=${{position:'absolute',inset:-8,borderRadius:'50%',background:`conic-gradient(#ffe7a8 ${pct*3.6}deg, rgba(255,255,255,.16) 0)`,WebkitMaskImage:'radial-gradient(closest-side, transparent 79%, #000 81%)',maskImage:'radial-gradient(closest-side, transparent 79%, #000 81%)',pointerEvents:'none'}}/>`:''}
          ${playish?html`<div style=${{position:'absolute',left:`calc(50% + ${dotX}px)`,top:`calc(50% + ${dotY}px)`,width:10,height:10,transform:'translate(-50%,-50%)',borderRadius:'50%',background:'#fff',boxShadow:'0 0 8px 2px rgba(255,231,168,.95)',pointerEvents:'none'}}/>`:''}
          <div class="planet-face" style=${{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden',background:lit?`radial-gradient(circle at 32% 26%, ${n.p1}, ${n.p2} 54%, ${n.p3} 100%)`:'radial-gradient(circle at 32% 26%, #6d6896, #3b3763 56%, #211e3e 100%)',boxShadow:lit?`0 0 0 1px rgba(255,255,255,.28), 0 10px 24px ${n.p2}80, 0 0 30px ${n.p2}55, inset -7px -9px 18px rgba(0,0,0,.42)`:'0 8px 18px rgba(0,0,0,.5), inset -6px -8px 16px rgba(0,0,0,.55)',display:'grid',placeItems:'center',animation:playish?'bob 3.8s ease-in-out infinite':'none'}}>
            <span style=${{position:'absolute',left:'-30%',top:'34%',width:'160%',height:'16%',borderRadius:'50%',background:'rgba(255,255,255,.14)',transform:'rotate(-8deg)'}}/>
            <span style=${{position:'absolute',left:'-20%',top:'60%',width:'150%',height:'12%',borderRadius:'50%',background:'rgba(0,0,0,.16)',transform:'rotate(-8deg)'}}/>
            <span style=${{position:'absolute',left:'20%',top:'16%',width:'34%',height:'26%',borderRadius:'50%',background:'rgba(255,255,255,.4)',filter:'blur(2px)'}}/>
            ${n.status==='done'?html`<${Icon} n="check" size=${30} color="#fff" style=${{filter:'drop-shadow(0 1px 3px rgba(0,0,0,.4))'}}/>`:''}
            ${playish?html`<${Icon} n="player-play-filled" size=${26} color="#fff" style=${{filter:'drop-shadow(0 1px 3px rgba(0,0,0,.45))'}}/>`:''}
            ${n.status==='locked'?html`<${Icon} n="lock" size=${23} color="rgba(255,255,255,.72)"/>`:''}
          </div>
          ${n.moon&&lit?'':''}
          ${n.status==='done'?html`<div style=${{position:'absolute',left:'50%',top:-25,transform:'translateX(-50%)',display:'flex',alignItems:'flex-end',gap:3,pointerEvents:'none'}}>
            ${[0,1,2].map(si=>html`<i key=${'star'+si} class="ti ti-star-filled" style=${{fontSize:si===1?17:13,marginBottom:si===1?4:0,color:si<(n.stars||0)?'#ffd43b':'rgba(255,255,255,.24)',filter:si<(n.stars||0)?'drop-shadow(0 1px 4px rgba(255,190,50,.75))':'none'}}/>`)}
          </div>`:''}
          ${n.status==='now'?spk.map((sp,k)=>html`<i key=${'s'+k} class="ti ti-sparkles" style=${{position:'absolute',left:sp.l+'px',top:sp.t+'px',fontSize:sp.s,color:'#ffe08a',filter:'drop-shadow(0 0 5px rgba(255,210,90,.8))',animation:`twinkle 2.3s ${sp.d}s ease-in-out infinite`}}/>`):''}
          <div style=${{position:'absolute',left:'50%',top:'calc(100% + 9px)',transform:'translateX(-50%)',width:130,textAlign:'center',pointerEvents:'none'}}>
            <div style=${{fontSize:12,fontWeight:800,color:lit?'#f3efff':'rgba(226,222,255,.6)',lineHeight:1.15,textShadow:'0 1px 4px rgba(10,6,40,.7)'}}>${n.t}</div>
            <div style=${{display:'inline-block',marginTop:3,padding:'1px 8px',borderRadius:999,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',color:playish?'#ffe7a8':n.status==='done'?'#8ff0cf':'rgba(226,222,255,.72)',fontSize:11,fontWeight:800,letterSpacing:'.3px'}}>${n.status==='done'?'Mastered':playish?(pct+'%'):'Locked'}</div>
          </div>
        <//>`; })}
      </div>
    </div>

    ${hideWorlds?'':html`<${Box} sx=${{position:'absolute',bottom:80,right:20,zIndex:6,display:'flex',alignItems:'center',gap:.5,px:1.1,py:.5,borderRadius:999,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.24)',backdropFilter:'blur(6px)',color:'#e7deff',fontSize:12,fontWeight:800,whiteSpace:'nowrap',pointerEvents:'none'}}>
      <${Icon} n="planet" size=${15}/> ${doneCount}/${N} worlds
    <//>`}

    ${canDrag?html`<${Box} sx=${{position:'absolute',bottom:12,left:'50%',transform:hint?'translateX(-50%) translateY(0)':'translateX(-50%) translateY(140px)',opacity:hint?1:0,transition:'transform .6s cubic-bezier(.4,0,.2,1), opacity .45s ease',zIndex:6,display:'flex',alignItems:'center',gap:.6,px:1.3,py:.5,borderRadius:999,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',color:'rgba(230,226,255,.82)',fontSize:11,fontWeight:700,pointerEvents:'none'}}><${Icon} n="arrows-horizontal" size=${14}/> Drag to explore the timeline<//>`:''}
  <//>
    ${sel!=null?html`<${Box} onClick=${closeChapter} sx=${{position:'fixed',inset:0,zIndex:68,cursor:'pointer',backdropFilter:panel?'blur(11px)':'blur(0px)',WebkitBackdropFilter:panel?'blur(11px)':'blur(0px)',background:panel?'rgba(18,12,50,.24)':'rgba(18,12,50,0)',transition:'backdrop-filter .5s ease, background .5s ease',pointerEvents:panel?'auto':'none'}}/>`:''}
    ${sel!=null?(()=>{ const ch=CH[sel]; const cc=buildChapter(ch); const seg=(k,lbl,ic)=>html`<${Box} key=${k} onClick=${()=>setView(k)} sx=${{display:'flex',alignItems:'center',gap:.6,px:1.6,py:.9,borderRadius:9,cursor:'pointer',fontSize:12,fontWeight:700,color:view===k?INK:DIM,background:view===k?'#fff':'transparent',boxShadow:view===k?SH_XS:'none',transition:'.15s'}}><${Icon} n=${ic} size=${16}/> ${lbl}<//>`;
      return html`<${Box} sx=${{position:'fixed',top:20,left:20,right:20,bottom:20,zIndex:70,transformOrigin:anchor?`${anchor.x-20}px ${anchor.y-20}px`:'50% 50%',transform:panel?'scale(1)':'scale(.02)',opacity:panel?1:0,transition:'transform .55s cubic-bezier(.4,0,.2,1), opacity .32s ease',...hudSx,borderColor:'#c6caea',borderRadius:'24px',boxShadow:'0 30px 80px rgba(12,8,44,.5), inset 0 1px 0 rgba(255,255,255,.9)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <${Box} sx=${{flex:'none',display:'flex',alignItems:'center',gap:1.6,px:{xs:2.5,md:4},py:2.2,borderBottom:'1px solid rgba(120,110,180,.22)',background:`linear-gradient(90deg, ${ch.p2}22, rgba(255,255,255,.12) 66%)`}}>
          <${Box} sx=${{width:46,height:46,flex:'none',borderRadius:'50%',background:`radial-gradient(circle at 32% 26%, ${ch.p1}, ${ch.p2} 58%, ${ch.p3})`,boxShadow:`0 6px 16px ${ch.p2}66, inset -4px -5px 10px rgba(0,0,0,.35)`}}/>
          <${Box} sx=${{flex:1,minWidth:0}}>
            <div style=${{fontSize:11,fontWeight:800,letterSpacing:'.6px',textTransform:'uppercase',color:ch.p2}}>Chapter</div>
            <${Typography} noWrap sx=${{fontSize:{xs:19,md:25},fontWeight:800,lineHeight:1.15,color:INK}}>${ch.t}<//>
          <//>
          <${Box} sx=${{display:{xs:'none',md:'flex'},gap:.4,p:.4,borderRadius:12,background:G1}}>${seg('modules','Modules','list-check')}${seg('videos','Videos','player-play')}${seg('applets','Applets','device-gamepad-2')}<//>
          <${Box} onClick=${closeChapter} sx=${{width:44,height:44,flex:'none',borderRadius:12,display:'grid',placeItems:'center',cursor:'pointer',color:DIM,borderWidth:'1px',borderStyle:'solid',borderColor:BORDER,background:'#fff',transition:'.15s','&:hover':{color:INK,borderColor:G4}}}><${Icon} n="x" size=${21}/><//>
        <//>
        <${Box} sx=${{flex:'none',display:{xs:'flex',md:'none'},gap:.4,p:.4,mx:2.5,mt:1.6,borderRadius:12,background:G1}}>${seg('modules','Modules','list-check')}${seg('videos','Videos','player-play')}${seg('applets','Applets','device-gamepad-2')}<//>
        <${Box} sx=${{flex:1,minHeight:0,overflowY:'auto',px:{xs:2.5,md:4},py:3}}>
          ${view==='modules'?html`<${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr',lg:'1fr 1fr 1fr'},gap:2}}>
            ${cc.modules.map((m,mi)=>html`<${Box} key=${mi} onClick=${m.status==='locked'?undefined:()=>onResume()} sx=${{display:'flex',alignItems:'center',gap:1.4,p:2,borderRadius:14,background:'#fff',border:`1px solid ${BORDER}`,boxShadow:SH_XS,cursor:m.status==='locked'?'default':'pointer',transition:'.15s','&:hover':m.status==='locked'?{}:{boxShadow:SH_SM,borderColor:ch.p2}}}>
              <${Box} sx=${{width:40,height:40,flex:'none',borderRadius:10,display:'grid',placeItems:'center',background:m.status==='done'?'#e6fcf2':m.status==='active'?`${ch.p2}18`:G1,color:m.status==='done'?TEAL8:m.status==='active'?ch.p2:DIM}}><${Icon} n=${m.status==='done'?'check':m.status==='active'?'player-play-filled':'lock'} size=${19}/><//>
              <${Box} sx=${{flex:1,minWidth:0}}>
                <div style=${{fontSize:11,fontWeight:800,letterSpacing:'.4px',textTransform:'uppercase',color:DIM,marginBottom:2}}>Module ${mi+1}${m.status==='done'?' · Done':m.status==='active'?' · In progress':''}</div>
                <${Typography} noWrap sx=${{fontWeight:700,fontSize:14,color:INK}}>${m.t}<//>
                <div style=${{display:'flex',alignItems:'center',gap:12,marginTop:5,fontSize:12,color:DIM,fontWeight:700}}><span style=${{display:'inline-flex',alignItems:'center',gap:4}}><i class="ti ti-clock" style=${{fontSize:14}}/>${m.dur}</span><span style=${{display:'inline-flex',alignItems:'center',gap:4}}><i class="ti ti-chart-bar" style=${{fontSize:14}}/>${m.diff}</span></div>
              <//>
            <//>`)}
          <//>`
          :view==='videos'?html`<${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr',lg:'1fr 1fr 1fr'},gap:2}}>
            ${cc.videos.map((v,vi)=>html`<${Box} key=${vi} sx=${{borderRadius:14,overflow:'hidden',background:'#fff',border:`1px solid ${BORDER}`,boxShadow:SH_XS,cursor:'pointer',transition:'.15s','&:hover':{boxShadow:SH_SM}}}>
              <${Box} sx=${{position:'relative',aspectRatio:'16 / 9',background:`linear-gradient(135deg, ${ch.p2}, ${ch.p3})`,display:'grid',placeItems:'center'}}>
                <${Box} sx=${{width:46,height:46,borderRadius:'50%',background:'rgba(255,255,255,.92)',display:'grid',placeItems:'center',color:ch.p2,boxShadow:SH_SM}}><${Icon} n="player-play-filled" size=${20}/><//>
                <div style=${{position:'absolute',right:8,bottom:8,padding:'2px 7px',borderRadius:6,background:'rgba(0,0,0,.6)',color:'#fff',fontSize:11,fontWeight:700}}>${v.dur}</div>
              <//>
              <${Box} sx=${{p:1.6}}>
                <${Typography} noWrap sx=${{fontWeight:700,fontSize:14,color:INK}}>${v.t}<//>
                <div style=${{fontSize:11,color:DIM,fontWeight:700,marginTop:3,display:'flex',alignItems:'center',gap:4}}><i class="ti ti-book" style=${{fontSize:12}}/>${v.mod}</div>
              <//>
            <//>`)}
          <//>`
          :html`<${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(3,1fr)'},gap:2}}>
            ${cc.applets.map((a,ai)=>html`<${Box} key=${ai} sx=${{display:'flex',flexDirection:'column',gap:1.2,p:2.2,borderRadius:14,background:'#fff',borderWidth:'1px',borderStyle:'solid',borderColor:BORDER,boxShadow:SH_XS,cursor:'pointer',transition:'.15s','&:hover':{boxShadow:SH_SM,borderColor:ch.p2}}}>
              <${Box} sx=${{width:52,height:52,borderRadius:14,display:'grid',placeItems:'center',background:`${ch.p2}16`,color:ch.p2}}><${Icon} n=${a.i} size=${26}/><//>
              <${Box} sx=${{minWidth:0}}>
                <${Typography} sx=${{fontWeight:700,fontSize:14,color:INK,lineHeight:1.2}}>${a.t}<//>
                <div style=${{fontSize:11,color:DIM,fontWeight:700,marginTop:3,display:'flex',alignItems:'center',gap:4}}><i class="ti ti-book" style=${{fontSize:12}}/>${a.mod}</div>
              <//>
            <//>`)}
          <//>`}
        <//>
      <//>`; })():''}
    ${lockMsg?html`<${Box} sx=${{position:'fixed',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:75,display:'flex',alignItems:'center',gap:1,px:2.4,py:1.5,borderRadius:14,background:'rgba(20,14,54,.92)',border:'1px solid rgba(255,255,255,.18)',color:'#fff',fontSize:14,fontWeight:700,boxShadow:'0 16px 40px rgba(0,0,0,.4)',animation:'capsulepop .4s ease both',backdropFilter:'blur(6px)'}}><${Icon} n="lock" size=${18} color="#ffd8a8"/> This chapter is yet to be unlocked<//>`:''}
  <//>`;
}

/* Streak widget: two rows collapsed (label + last 7 days as rounded-rect dots, most recent
   at the right), and on click the SAME widget grows to add a month grid with arrow month-paging.
   Present days are filled; absent days are stroke-only. */
const STREAK_TODAY=new Date(2026,7,6);
const STREAK_PRESENT=new Set([
  '2026-8-3','2026-8-4','2026-8-5','2026-8-6',
  '2026-7-28','2026-7-29','2026-7-31','2026-7-24','2026-7-25','2026-7-22','2026-7-20','2026-7-17','2026-7-16','2026-7-15','2026-7-13','2026-7-10','2026-7-9','2026-7-8','2026-7-6','2026-7-3','2026-7-2','2026-7-1',
]);
function useDismiss(open,close){
  const ref=R.useRef(null);
  useEffect(()=>{
    if(!open) return;
    const onDown=(e)=>{ if(ref.current&&!ref.current.contains(e.target)) close(); };
    const onKey=(e)=>{ if(e.key==='Escape') close(); };
    document.addEventListener('pointerdown',onDown,true);
    document.addEventListener('keydown',onKey);
    return ()=>{ document.removeEventListener('pointerdown',onDown,true); document.removeEventListener('keydown',onKey); };
  },[open,close]);
  return ref;
}
const skey=(d)=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const SMONS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function StreakDot({on,future,size=13,today}){
  // warm palette throughout: absent days are a faint sand fill (not a cool outlined box, which read as
  // an empty checkbox), future days are a barely-there pip so the month keeps its shape without
  // looking like a field of blanks
  if(future) return html`<div style=${{width:size,height:size,display:'grid',placeItems:'center',flex:'none'}}><div style=${{width:4,height:4,borderRadius:'50%',background:'#e7e0f2'}}/><//>`;
  return html`<div style=${{width:size,height:size,borderRadius:Math.max(4,Math.round(size*.36)),flex:'none',
    background:on?ORANGE:'#f3eae2',boxShadow:today?`0 0 0 2px #fff, 0 0 0 3.5px ${ORANGE}`:'none'}}/>`;
}
/* XP + orbs, drawn exactly as the Teaching Room, Practice and Profile draw them, so the two
   currencies read the same wherever they appear. The streak moved into My stats, where it
   sits on a real calendar instead of seven dots in the chrome. */
function XpOrbs(){
  const cmp=isPhone();
  return html`<${Box} sx=${{display:'flex',alignItems:'center',flex:'0 1 auto',minWidth:0,gap:cmp?.2:1,alignSelf:'center'}}>
    <div title="Experience points" style=${{display:'flex',alignItems:'center',gap:cmp?5:8,padding:cmp?'6px 6px 6px 4px':'8px 15px 8px 12px',borderRadius:12}}>
      <${Icon} n="star-filled" size=${20} color="#fab005"/>
      <span style=${{fontWeight:800,color:'#7a4700',fontSize:cmp?16:18,letterSpacing:'-.01em'}}>4,820</span>
    </div>
    <span aria-hidden="true" style=${{width:1,height:20,flex:'none',margin:cmp?'0 2px':'0 6px',background:'linear-gradient(180deg,rgba(120,90,200,0),rgba(120,90,200,.22) 30%,rgba(120,90,200,.22) 70%,rgba(120,90,200,0))'}}/>
    <div title="Energy orbs" style=${{display:'flex',alignItems:'center',gap:cmp?5:8,padding:cmp?'6px 6px 6px 4px':'8px 16px 8px 13px',borderRadius:12}}>
      <span style=${{width:18,height:18,flex:'none',borderRadius:'50%',background:'radial-gradient(circle at 34% 28%,#fff,#ffe066 42%,#ff922b 78%,#e8590c)',boxShadow:'0 0 10px rgba(255,193,7,.95),0 0 3px rgba(255,255,255,.9)'}}/>
      <span style=${{fontWeight:800,color:'#7a4700',fontSize:cmp?16:18,letterSpacing:'-.01em'}}>32</span>
    </div>
  <//>`;
}
function StreakWidget({streakRef,streakCele}){
  const [open,setOpen]=useState(false);
  const [mOff,setMOff]=useState(0);
  const last7=[...Array(7)].map((_,i)=>{ const d=new Date(STREAK_TODAY); d.setDate(d.getDate()-(6-i)); return {k:skey(d),on:STREAK_PRESENT.has(skey(d))}; });
  const mDate=new Date(STREAK_TODAY.getFullYear(),STREAK_TODAY.getMonth()+mOff,1);
  const dim=new Date(mDate.getFullYear(),mDate.getMonth()+1,0).getDate();
  const pad=new Date(mDate.getFullYear(),mDate.getMonth(),1).getDay();
  const cells=[...Array(pad)].map((_,i)=>({k:'p'+i,blank:true}))
    .concat([...Array(dim)].map((_,i)=>{ const d=new Date(mDate.getFullYear(),mDate.getMonth(),i+1); return {k:skey(d),on:STREAK_PRESENT.has(skey(d)),future:d>STREAK_TODAY,today:skey(d)===skey(STREAK_TODAY)}; }));
  const arrow=(n,fn,dis)=>html`<div onClick=${(e)=>{e.stopPropagation();if(!dis)fn();}} style=${{width:22,height:22,borderRadius:7,display:'grid',placeItems:'center',cursor:dis?'default':'pointer',color:dis?'#c9c2dd':'#6b6390'}}><${Icon} n=${n} size=${15}/><//>`;
  const dref=useDismiss(open,()=>setOpen(false));
  return html`<${Box} ref=${dref} sx=${{position:'relative',flex:'none',width:144,height:49,alignSelf:'center'}}>
    <${Box} ref=${streakRef} onClick=${()=>setOpen(o=>!o)} sx=${{position:'absolute',top:0,right:0,width:open?232:144,zIndex:41,cursor:'pointer',borderRadius:'12px',px:'10px',py:open?'10px':'5px',
      background:open?'linear-gradient(180deg,#f3f0ff 0%,#f8f9fa 52%,#fff4e6 100%)':'transparent',
      border:'none',
      boxShadow:open?'0 14px 30px -14px rgba(70,46,146,.28)':(streakCele?`0 0 0 2px ${ORANGE}44`:'0 8px 14px -10px rgba(70,46,146,.34)'),
      transition:'width .26s cubic-bezier(.2,.8,.3,1), padding .26s, box-shadow .2s, background .2s',animation:streakCele?'cardpop .6s ease':'none'}}>
      <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontSize:14,fontWeight:700,color:'#e8590c',lineHeight:1,whiteSpace:'nowrap'}}>
        <${Icon} n="flame" size=${17} color=${ORANGE}/><span><span style=${{fontWeight:800,fontSize:18}}>4</span> day streak</span>
      </div>
      ${open?'':html`<div style=${{display:'flex',gap:5,marginTop:7,marginBottom:1,justifyContent:'center'}}>
        ${last7.map(d=>html`<${StreakDot} key=${d.k} on=${d.on}/>`)}
      </div>`}
      ${open?html`<div style=${{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(120,90,200,.14)'}}>
        <div style=${{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:11}}>
          ${arrow('chevron-left',()=>setMOff(o=>o-1),mOff<=-11)}
          <span style=${{fontSize:12.5,fontWeight:800,color:'#211a4a',letterSpacing:'-.01em'}}>${SMONS[mDate.getMonth()]} ${mDate.getFullYear()}</span>
          ${arrow('chevron-right',()=>setMOff(o=>o+1),mOff>=0)}
        </div>
        <div style=${{display:'grid',gridTemplateColumns:'repeat(7,1fr)',rowGap:6,justifyItems:'center'}}>
          ${['S','M','T','W','T','F','S'].map((d,i)=>html`<div key=${'h'+i} style=${{fontSize:9,fontWeight:700,letterSpacing:'.04em',color:'#a49cc4',marginBottom:3}}>${d}</div>`)}
          ${cells.map(c=>c.blank?html`<div key=${c.k}/>`:html`<${StreakDot} key=${c.k} on=${c.on} future=${c.future} today=${c.today} size=${16}/>`)}
        </div>
      </div>`:''}
    <//>
  <//>`;
}
/* Same widget as Chapter Journey's goal chrome: pct-led statement, 340px hairline bar,
   #d9480f fill, no card chrome — rotated on the same 30s cadence. */
const GOALS_CJ=[
  {pct:68,label:'of scoring 90%+ in the year-end exam'},
  {pct:45,label:'of acing the Fractions unit test'},
  {pct:80,label:'of finishing adding unlike fractions today'},
];
function RotatingGoals(){
  const [idx,setIdx]=useState(0);
  const [open,setOpen]=useState(false);
  // rotation freezes while expanded, as in Chapter Journey
  useEffect(()=>{ if(open) return; const t=setInterval(()=>setIdx(i=>(i+1)%GOALS_CJ.length),30000); return ()=>clearInterval(t); },[open]);
  const g=GOALS_CJ[idx];
  const row=(x,k,first)=>html`<div key=${k} style=${{marginTop:first?0:12,paddingTop:first?0:12,borderTop:first?'none':'1px solid rgba(120,90,200,.18)'}}>
    <div style=${{width:340,fontSize:14,fontWeight:700,color:'#211a4a',lineHeight:1.4,whiteSpace:'nowrap',fontFamily:SYS}}><span style=${{color:'#d9480f',fontWeight:800,fontSize:18}}>${x.pct}%</span> ${x.label}</div>
    <div style=${{width:340,height:5,marginTop:7,borderRadius:999,background:'rgba(33,26,74,.13)',overflow:'hidden'}}>
      <div style=${{height:'100%',width:x.pct+'%',background:'#d9480f',borderRadius:999}}/>
    </div>
  </div>`;
  const gref=useDismiss(open,()=>setOpen(false));
  return html`<${Box} ref=${gref} sx=${{position:'relative',top:'-2px',flex:'none',display:{xs:'none',md:'block'},width:340,height:38,minWidth:0}}>
    <${Box} onClick=${()=>setOpen(o=>!o)} sx=${{position:'absolute',top:0,left:0,width:340,zIndex:40,cursor:'pointer',borderRadius:'14px'}}>
      ${html`<div style=${{position:'absolute',inset:open?'-16px -18px':'-10px -14px',borderRadius:open?16:14,zIndex:-1,transition:'inset .26s ease, background .26s ease, box-shadow .26s ease',background:open?'linear-gradient(180deg,#f3f0ff 0%,#f8f9fa 52%,#fff4e6 100%)':'transparent',boxShadow:open?'0 14px 30px -14px rgba(70,46,146,.28)':'0 8px 14px -10px rgba(70,46,146,.34)'}}/>`}
      ${open
        ? GOALS_CJ.map((x,i)=>row(x,'g'+i,i===0))
        : html`<${R.Fragment}>
            <${Box} key=${idx} sx=${{position:'relative',height:26,overflow:'hidden',animation:'goalcycle .5s cubic-bezier(.2,.8,.3,1)'}}>
              <div style=${{position:'absolute',left:0,bottom:0,width:340,fontSize:14,fontWeight:700,color:'#211a4a',lineHeight:1.4,whiteSpace:'nowrap',fontFamily:SYS}}><span style=${{color:'#d9480f',fontWeight:800,fontSize:18}}>${g.pct}%</span> ${g.label}</div>
            <//>
            <div style=${{width:340,height:5,marginTop:7,borderRadius:999,background:'rgba(33,26,74,.13)',overflow:'hidden'}}>
              <div style=${{height:'100%',width:g.pct+'%',background:'#d9480f',borderRadius:999,transition:'width .7s cubic-bezier(.2,.8,.3,1)'}}/>
            </div>
          <//>`}
    <//>
  <//>`;
}

function Dashboard({moduleDone,onResume,onNav,onRestart,streakRef,streakCele}){
  const now=new Date();
  const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateStr=`${DAYS[now.getDay()]}, ${now.getDate()} ${MONS[now.getMonth()]}`;
  const monthName=MONS[now.getMonth()];
  const done=CHAPTERS.filter(c=>c.status==='done').length;
  const [profOpen,setProfOpen]=useState(false);
  const [streakOpen,setStreakOpen]=useState(false);

  const pref=useDismiss(profOpen,()=>setProfOpen(false));
  const profile=html`<${Box} ref=${pref} sx=${{position:'relative',flex:'none'}}>
    <${Box} onClick=${()=>setProfOpen(o=>!o)} sx=${{display:'flex',alignItems:'center',gap:1,pl:.6,pr:1.2,py:.6,borderRadius:profOpen?'999px 999px 0 0':999,cursor:'pointer',background:CARD,border:`1px solid ${profOpen?BLUE2:BORDER}`,borderBottomColor:profOpen?'transparent':undefined,boxShadow:SH_XS,transition:'.15s','&:hover':{border:`1px solid ${BLUE2}`}}}>
      <${Box} sx=${{width:44,height:44,flex:'none',borderRadius:'50%',overflow:'hidden',background:BLUE0}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/><//>
      <${Icon} n=${profOpen?'chevron-up':'chevron-down'} size=${18} color=${DIM}/>
    <//>
    ${profOpen?html`<${R.Fragment}>
      <${Box} sx=${{position:'absolute',right:0,top:'100%',zIndex:41,width:{xs:216,md:236},maxWidth:'calc(100vw - 32px)',background:CARD,border:`1px solid ${BORDER}`,borderRadius:'12px 0 12px 12px',boxShadow:SH_LG,overflow:'hidden',p:.8}}>
        <${Box} onClick=${()=>{setProfOpen(false);onNav({k:'profile',t:'Profile'});}} sx=${{display:'flex',alignItems:'center',gap:1.2,px:1.4,py:1.2,borderRadius:'8px',cursor:'pointer','&:hover':{background:BLUE0}}}>
          <${Box} sx=${{minWidth:0}}>
            <${Typography} sx=${{fontWeight:700,fontSize:14,lineHeight:1.2}}>Aarav<//>
            <${Typography} sx=${{fontSize:12,color:DIM,fontWeight:500}}>Class 10 · CBSE<//>
          <//>
        <//>
        <${Box} sx=${{height:1,background:BORDER,my:.6}}/>
        ${JUMP.map(j=>html`<${Box} key=${j.k} onClick=${()=>{setProfOpen(false);onNav(j);}} sx=${{display:'flex',alignItems:'center',gap:1.3,px:1.4,py:1.1,borderRadius:'8px',cursor:'pointer',color:TXT,fontSize:14,fontWeight:700,transition:'.12s','&:hover':{background:BLUE0,color:BLUE7}}}>
          <${Icon} n=${j.i} size=${19}/> ${j.t}
        <//>`)}
        <${Box} sx=${{height:1,background:BORDER,my:.6}}/>
        <${Box} onClick=${()=>{setProfOpen(false);onRestart();}} sx=${{display:'flex',alignItems:'center',gap:1.3,px:1.4,py:1.1,borderRadius:'8px',cursor:'pointer',color:DIM,fontSize:14,fontWeight:700,transition:'.12s','&:hover':{background:G0,color:INK}}}>
          <${Icon} n="refresh" size=${19}/> Restart demo
        <//>
      <//>
    <//>`:''}
  <//>`;

  const hero = moduleDone
    ? html`<${HoverTile} sx=${{...cardSx,boxShadow:SH_SM,p:{xs:2.6,md:3.2},background:TEAL0,borderColor:TEAL2,display:'flex',alignItems:'center',gap:2.6,flexWrap:'wrap'}}>
        <${Box} sx=${{flex:1,minWidth:210}}>
          <${Eyebrow} color=${TEAL9}>Chapter complete 🎉<//>
          <${Typography} variant="h5" sx=${{my:.5,fontSize:{xs:22,md:27}}}>Nice work — ready for your next class?<//>
          <${Stack} direction="row" spacing=${.7} alignItems="center" sx=${{color:TEAL9}}><${Icon} n="arrow-right-circle" size=${17}/><${Typography} sx=${{fontSize:14,fontWeight:700}}>Next up · Data Handling — Mean, median & mode<//><//>
        <//>
        <${RippleHover} radius="8px"><${M.Button} size="md" color="teal" onClick=${onResume} rightSection=${html`<${Icon} n="arrow-right" size=${16}/>`}>Get started<//><//>
      <//>`
    : html`<${JourneyMap} onResume=${onResume}/>`;

  const statusMeta={done:{cl:'teal',label:'Done',c:TEAL},now:{cl:'blue',label:'In progress',c:BLUE},next:{cl:'violet',label:'Up next',c:VIOLET},planned:{cl:'gray',label:'Planned',c:G5}};

  return html`<${Box} sx=${{flex:1,minWidth:0,height:'100vh',overflow:'hidden'}}>
    <${Box} sx=${{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',px:{xs:2.5,md:5},py:{xs:2.5,md:3.5}}}>
    <${Box} sx=${{width:'100%',maxWidth:1180,mx:'auto',flex:'1 1 auto',minHeight:0,maxHeight:'100%',display:'flex',flexDirection:'column',gap:2.6}}>
      <${Stack} direction="row" alignItems="center" justifyContent="space-between" spacing=${2} sx=${{flex:'none',flexWrap:'wrap',rowGap:1.4}}>
        <${Box} sx=${{flex:1}}/>
        <${Stack} direction="row" alignItems="center" spacing=${1.4} sx=${{flex:'none'}}>
          <${RotatingGoals}/>
          <${XpOrbs}/>
          ${profile}
        <//>
      <//>

      <${Box} sx=${{flex:1,minHeight:0,display:'flex',flexDirection:'column'}}>${hero}<//>
    <//>
    <//>
  <//>`;
}

/* =========================================================
   FULL-SCREEN CHAT ROOM (3 columns: history · chat · visual aid)
   ========================================================= */
const HISTORY=[
  {id:'f1',chapter:'Fractions & Decimals',t:'Adding unlike fractions',date:'6 Jul 2026',time:'4:12 PM'},
  {id:'f2',chapter:'Fractions & Decimals',t:'Decimal place value',date:'5 Jul 2026',time:'7:20 PM'},
  {id:'f3',chapter:'Fractions & Decimals',t:'Comparing fractions',date:'4 Jul 2026',time:'9:02 AM'},
  {id:'f4',chapter:'Fractions & Decimals',t:'Equivalent fractions',date:'3 Jul 2026',time:'6:15 PM'},
  {id:'f5',chapter:'Fractions & Decimals',t:'Multiplying decimals',date:'2 Jul 2026',time:'8:40 PM'},
  {id:'f6',chapter:'Fractions & Decimals',t:'Converting fractions to decimals',date:'1 Jul 2026',time:'5:05 PM'},
  {id:'i1',chapter:'Integers',t:'Integers — timed practice',date:'4 Jul 2026',time:'8:05 AM'},
  {id:'i2',chapter:'Integers',t:'BODMAS order of operations',date:'3 Jul 2026',time:'3:15 PM'},
  {id:'i3',chapter:'Integers',t:'Multiplying negative numbers',date:'2 Jul 2026',time:'6:48 PM'},
  {id:'i4',chapter:'Integers',t:'Jumps on the number line',date:'1 Jul 2026',time:'4:30 PM'},
  {id:'i5',chapter:'Integers',t:'Absolute value basics',date:'30 Jun 2026',time:'7:12 PM'},
  {id:'i6',chapter:'Integers',t:'Dividing integers',date:'29 Jun 2026',time:'5:50 PM'},
  {id:'p1',chapter:'Perimeter & Area',t:'Perimeter of L-shaped fields',date:'5 Jul 2026',time:'6:30 PM'},
  {id:'p2',chapter:'Perimeter & Area',t:'Area of triangles',date:'3 Jul 2026',time:'5:20 PM'},
  {id:'p3',chapter:'Perimeter & Area',t:'Circumference of a circle',date:'1 Jul 2026',time:'8:00 AM'},
  {id:'p4',chapter:'Perimeter & Area',t:'Area of composite shapes',date:'30 Jun 2026',time:'6:05 PM'},
  {id:'n1',chapter:'Playing with Numbers',t:'What makes a number prime?',date:'3 Jul 2026',time:'5:48 PM'},
  {id:'n2',chapter:'Playing with Numbers',t:'HCF and LCM together',date:'2 Jul 2026',time:'7:35 PM'},
  {id:'n3',chapter:'Playing with Numbers',t:'Divisibility rules',date:'1 Jul 2026',time:'4:18 PM'},
];
const CHAP_COLORS={'Fractions & Decimals':VIOLET,'Perimeter & Area':BLUE,'Integers':TEAL8,'Playing with Numbers':ORANGE};
const DUST=Array.from({length:22}).map(()=>({x:5+Math.random()*90,y:6+Math.random()*88,s:7+Math.random()*11,dur:.6+Math.random()*.5,delay:Math.random()*.5,col:Math.random()>.5?'#7950f2':'#228be6'}));
const CHAP_TOTALS={'Fractions & Decimals':52,'Integers':37,'Perimeter & Area':18,'Playing with Numbers':23};
const chapColor=(c)=>CHAP_COLORS[c]||GRAPE;
const FRAC_DOUBT_DEFAULT="How do I add ½ and ⅓? The bottoms are different.";
const FRAC_ASK_TEXT="Does that make sense? Ask me anything, or tap ‘I've got it’ when you're ready.";
const FRAC_FOLLOWUP_Q="But why don't we add the bottoms too — 2 + 3?";
const FRAC_FOLLOWUP_A="Great catch — that's the most common mix-up! The bottom only tells us the *size* of each piece. We're counting pieces, so only the tops add up; the size (sixths) stays the same. Adding the bottoms would quietly change the piece size halfway through.";
const FRAC_SCRIPT=[
  {text:"Great question! When two fractions have different bottoms — like ½ and ⅓ — we can't add them as they are.",panel:1},
  {text:"First we find the smallest number both bottoms fit into. For 2 and 3 that's 6 — so we cut both fractions into sixths.",panel:2},
  {text:"½ becomes 3/6 and ⅓ becomes 2/6 — every piece is the same size now.",featured:true,visual:true,panel:2},
  {text:"Now just add the tops: 3 + 2 = 5, and keep the bottom. So ½ + ⅓ = 5/6.",panel:3},
];
const FRAC_INTRO="Great question! When two fractions have different bottoms — like ½ and ⅓ — we can't add them yet. First we find the smallest number both bottoms fit into: for 2 and 3 that's 6, so we cut both fractions into sixths.";
const FRAC_KEY="½ becomes 3/6 and ⅓ becomes 2/6 — every piece is the same size now. Then just add the tops: 3 + 2 = 5, keep the bottom, and you get 5/6.";
const SUMMARY_TEXT="You asked how to add ½ + ⅓. We gave both the same bottom of 6 (½ → 3/6, ⅓ → 2/6), then added the tops to get 5/6 — that's the whole trick for adding unlike fractions.";
const WRAP_TEXT="Nice work, Aarav! 🎉 That doubt's sorted. Want to lock it in with today's class, or is there another doubt on your mind?";

function FracBar({denom,fills,w='100%'}){
  return html`<div style=${{display:'flex',width:w,height:30,borderRadius:7,overflow:'hidden',border:`1px solid ${G3}`,boxShadow:SH_XS}}>
    ${Array.from({length:denom}).map((_,i)=>html`<div key=${i} style=${{flex:1,background:fills[i]||'#fff',borderRight:i<denom-1?`1px solid ${fills[i]?'rgba(255,255,255,.6)':G2}`:'none'}}/>`)}
  </div>`;
}
function VisRow({label,children}){
  return html`<div style=${{display:'flex',alignItems:'center',gap:10}}>
    <div style=${{width:46,flex:'none',fontSize:14,fontWeight:800,color:INK,textAlign:'center'}}>${label}</div>
    <div style=${{flex:1,minWidth:0}}>${children}</div>
  </div>`;
}
function VPanel({title,idx,step,hide,children}){
  const on=step>=idx;
  if(hide&&!on) return null;
  return html`<div style=${{opacity:on?1:.3,transform:on?'translateY(0)':'translateY(7px)',transition:'opacity .5s ease, transform .5s ease',background:'#fff',border:`1px solid ${BORDER}`,borderRadius:12,padding:'13px 15px',boxShadow:on?SH_XS:'none'}}>
    <div style=${{display:'flex',alignItems:'center',gap:8,marginBottom:11}}>
      <div style=${{width:21,height:21,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',fontSize:11,fontWeight:700,color:'#fff',background:on?BLUE:G4,transition:'background .4s'}}>${idx}</div>
      <div style=${{fontSize:12,fontWeight:700,color:INK}}>${title}</div>
    </div>
    ${children}
  </div>`;
}
function FractionVisual({step,hide}){
  return html`<div style=${{display:'flex',flexDirection:'column',gap:14}}>
    <${VPanel} title="The problem" idx=${1} step=${step} hide=${hide}>
      <div style=${{display:'flex',flexDirection:'column',gap:9}}>
        <${VisRow} label="½"><${FracBar} denom=${2} fills=${[VIOLET,null]}/><//>
        <${VisRow} label="⅓"><${FracBar} denom=${3} fills=${[BLUE,null,null]}/><//>
      </div>
      <div style=${{fontSize:12,color:DIM,marginTop:10,fontWeight:500}}>Different-size pieces — we can't add them yet.</div>
    <//>
    <${VPanel} title="Make the pieces match (sixths)" idx=${2} step=${step} hide=${hide}>
      <div style=${{display:'flex',flexDirection:'column',gap:9}}>
        <${VisRow} label="3/6"><${FracBar} denom=${6} fills=${[VIOLET,VIOLET,VIOLET,null,null,null]}/><//>
        <${VisRow} label="2/6"><${FracBar} denom=${6} fills=${[BLUE,BLUE,null,null,null,null]}/><//>
      </div>
      <div style=${{fontSize:12,color:DIM,marginTop:10,fontWeight:500}}>½ = 3/6 and ⅓ = 2/6 — same-size pieces now.</div>
    <//>
    <${VPanel} title="Add the tops" idx=${3} step=${step} hide=${hide}>
      <${VisRow} label="5/6"><${FracBar} denom=${6} fills=${[VIOLET,VIOLET,VIOLET,BLUE,BLUE,null]}/><//>
      <div style=${{fontSize:12,color:DIM,marginTop:10,fontWeight:500}}>3 + 2 = 5 sixths. So ½ + ⅓ = <b style=${{color:INK}}>5/6</b>.</div>
    <//>
  </div>`;
}
function FracMini(){
  return html`<div style=${{display:'flex',alignItems:'center',gap:10,marginTop:11,padding:'9px 12px',background:G0,border:`1px solid ${BORDER}`,borderRadius:10}}>
    <div style=${{fontSize:12,fontWeight:800,color:INK,whiteSpace:'nowrap'}}>½ + ⅓ =</div>
    <div style=${{flex:1,maxWidth:200}}><${FracBar} denom=${6} fills=${[VIOLET,VIOLET,VIOLET,BLUE,BLUE,null]}/></div>
    <div style=${{fontSize:14,fontWeight:800,color:BLUE7}}>5/6</div>
  </div>`;
}

function HomeWidgets({onNav,onRestart,streakRef,streakCele,onHome,floating}){
  const [profOpen,setProfOpen]=useState(false);
  const [streakOpen,setStreakOpen]=useState(false);
  const [logoHov,setLogoHov]=useState(false);
  const pref2=useDismiss(profOpen,()=>setProfOpen(false));
  return html`<${Box} sx=${{flex:floating?1:'none',minWidth:0,position:'relative',zIndex:30,display:'flex',alignItems:'flex-start',gap:floating?1.2:{xs:'14px',md:'40px'},px:floating?0:{xs:'16px',md:'28px'},py:floating?0:{xs:'14px',md:'24px'}}}>
    ${floating?'':html`<${Box} onClick=${onHome} onMouseEnter=${()=>setLogoHov(true)} onMouseLeave=${()=>setLogoHov(false)} title="Home" sx=${{width:40,height:40,flex:'none',borderRadius:11,overflow:'hidden',display:'grid',placeItems:'center',background:'transparent',opacity:logoHov?.82:1,cursor:'pointer',transition:'.15s'}}><img src="logo.png" alt="Byjus.AI — home" style=${{width:'100%',height:'100%',objectFit:'contain'}}/><//>`}
    <${RotatingGoals}/>
    <${Box} sx=${{flex:1}}/>
    <${XpOrbs}/>
    <${Box} ref=${pref2} sx=${{position:'relative',flex:'none',zIndex:2,display:isPhone()?'block':'none'}}>
      <${Box} onClick=${()=>setProfOpen(o=>!o)} sx=${{display:'flex',alignItems:'center',flex:'none',gap:{xs:.3,md:.8},pl:.5,pr:{xs:.5,md:1},py:.5,borderRadius:profOpen?'12px 12px 0 0':12,cursor:'pointer',...hudSx,borderColor:profOpen?BLUE2:'#c6caea',borderBottomColor:profOpen?'transparent':undefined}}>
        <${Box} sx=${{width:40,height:40,flex:'none',borderRadius:'50%',overflow:'hidden',background:BLUE0}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/><//>
        <${Icon} n=${profOpen?'chevron-up':'chevron-down'} size=${18} color=${DIM}/>
      <//>
      ${profOpen?html`<${R.Fragment}>
        <${Box} sx=${{position:'absolute',right:0,top:'100%',zIndex:41,width:{xs:216,md:236},maxWidth:'calc(100vw - 32px)',background:CARD,border:`1px solid ${BORDER}`,borderRadius:'12px 0 12px 12px',boxShadow:SH_LG,overflow:'hidden',p:.8}}>
          <${Box} onClick=${()=>{setProfOpen(false);onNav({k:'profile',t:'Profile'});}} sx=${{display:'flex',alignItems:'center',gap:1.2,px:1.4,py:1.2,borderRadius:'8px',cursor:'pointer','&:hover':{background:BLUE0}}}>
            <${Box} sx=${{minWidth:0}}>
              <${Typography} sx=${{fontWeight:700,fontSize:14,lineHeight:1.2}}>Aarav<//>
              <${Typography} sx=${{fontSize:12,color:DIM,fontWeight:500}}>Class 10 · CBSE<//>
            <//>
          <//>
          <${Box} sx=${{height:1,background:BORDER,my:.6}}/>
          ${JUMP.map(j=>html`<${Box} key=${j.k} onClick=${()=>{setProfOpen(false);onNav(j);}} sx=${{display:'flex',alignItems:'center',gap:1.3,px:1.4,py:1.1,borderRadius:'8px',cursor:'pointer',color:TXT,fontSize:14,fontWeight:700,transition:'.12s','&:hover':{background:BLUE0,color:BLUE7}}}><${Icon} n=${j.i} size=${19}/> ${j.t}<//>`)}
          <${Box} sx=${{height:1,background:BORDER,my:.6}}/>
          <${Box} onClick=${()=>{setProfOpen(false);onRestart();}} sx=${{display:'flex',alignItems:'center',gap:1.3,px:1.4,py:1.1,borderRadius:'8px',cursor:'pointer',color:DIM,fontSize:14,fontWeight:700,transition:'.12s','&:hover':{background:G0,color:INK}}}><${Icon} n="refresh" size=${19}/> Restart demo<//>
        <//>
      <//>`:''}
    <//>
  <//>`;
}

function Home({onResume,onRestart,moduleDone}){
  const [snack,setSnack]=useState('');
  const streakRef=useRef(null);
  const [streakCele,setStreakCele]=useState(false);
  const [tl,setTl]=useState(false);
  const [tlDust,setTlDust]=useState(false);
  const [zoom,setZoom]=useState(false);
  useEffect(()=>{ const today=new Date().toDateString(); if(localStorage.getItem('byjus_streakDay')!==today){ localStorage.setItem('byjus_streakDay',today); const t=setTimeout(()=>{ const el=streakRef.current; if(el){ const r=el.getBoundingClientRect(); burst(r.left+r.width/2,r.top+r.height/2,[ORANGE,BLUE,TEAL,GRAPE]); } setStreakCele(true); setTimeout(()=>setStreakCele(false),1600); },850); return ()=>clearTimeout(t); } },[]);
  // profile and stats now have a real page; the rest of the menu is still unbuilt
  const onNav=(j)=>{
    const PANE={profile:'profile',group:'group',rewards:'rewards',stats:'stats',goals:'goals'};
    if(PANE[j.k]){ try{ window.location.href='Profile.dc.html?pane='+PANE[j.k]; }catch(e){} return; }
    setSnack(`${j.t} — coming soon`);
  };
  const openTimeline=()=>{ setTl(true); setTlDust(true); setTimeout(()=>setTlDust(false),2200); };
  const closeTimeline=()=>setTl(false);
  return html`<${Screen} decor="math" sx=${{height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden'}}>
    <${Box} sx=${{flex:1,minHeight:0,position:'relative'}}>
      <${HomeChat} full=${true} homeMode=${true} onResume=${onResume} onMaxClick=${openChapterJourney}
        widgets=${html`<${HomeWidgets} floating=${true} onNav=${onNav} onRestart=${onRestart} streakRef=${streakRef} streakCele=${streakCele} onHome=${closeTimeline}/>`}/>
    <//>

    ${tl?html`<${Box} sx=${{position:'fixed',inset:0,zIndex:80,overflow:'hidden',animation:'streaksin 1.6s ease both'}}>
      <${Box} sx=${{position:'absolute',inset:0}}><${JourneyMap} intro=${true} hideWorlds=${true} onResume=${()=>{closeTimeline();onResume();}}/><//>
      ${tlDust?html`<${Box} sx=${{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',overflow:'hidden'}}>
        ${NEBULA_BLOBS.map((b,i)=>html`<${Box} key=${i} sx=${{position:'absolute',left:b.l+'%',top:b.t+'%',width:b.s,height:b.s,marginLeft:`${-b.s/2}px`,marginTop:`${-b.s/2}px`,borderRadius:'50%',background:`radial-gradient(closest-side, ${b.c}, transparent 72%)`,filter:'blur(34px)',mixBlendMode:'screen',opacity:0,animation:`nebfade 2.2s ${b.dl}s ease-in-out both`}}/>`)}
        ${MAXSTARS.slice(0,9).map((s,i)=>html`<i key=${'st'+i} class="ti ti-sparkles" style=${{position:'absolute',left:`calc(50% + ${s.x*1.4}px)`,top:`calc(50% + ${s.y*1.15}px)`,color:s.c,fontSize:s.s,filter:`drop-shadow(0 0 6px ${s.c})`,animation:`dusttw 1.7s ${s.dl}s ease-in-out both`}}/>`)}
      <//>`:''}
      <${Box} sx=${{position:'absolute',top:0,left:0,right:0,zIndex:5,display:'flex',alignItems:'center',gap:1.4,px:3,py:2,pointerEvents:'none',background:'linear-gradient(180deg, rgba(20,14,54,.55) 0%, rgba(20,14,54,0) 100%)'}}>
        <${Buddy} who="max" size=${46} bob=${false}/>
        <${Box} sx=${{flex:1,minWidth:0}}>
          <${Typography} sx=${{color:'#fff',fontSize:20,fontWeight:800,lineHeight:1.1}}>Your learning journey<//>
          <${Typography} sx=${{color:'rgba(220,214,255,.72)',fontSize:12,fontWeight:500,mt:.2}}>Every world you've explored — and what's coming next<//>
        <//>
        <${Box} sx=${{pointerEvents:'none',display:'flex',alignItems:'center',gap:.5,px:1.2,py:.7,borderRadius:999,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.24)',backdropFilter:'blur(6px)',color:'#e7deff',fontSize:12,fontWeight:800,whiteSpace:'nowrap'}}><${Icon} n="planet" size=${15}/> ${GALAXY_CH.filter(n=>n.status==='done').length}/${GALAXY_CH.length} worlds<//>
        <${Box} onClick=${closeTimeline} sx=${{pointerEvents:'auto',width:42,height:42,flex:'none',borderRadius:12,display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.22)',transition:'.15s','&:hover':{background:'rgba(255,255,255,.2)'}}}><${Icon} n="x" size=${22}/><//>
      <//>
    <//>`:''}

    ${false?html`<${Box} sx=${{position:'fixed',inset:0,zIndex:95,pointerEvents:'none',display:'grid',placeItems:'center'}}>
      <img src="max-mascot-sm.png" alt="" style=${{width:150,height:150,objectFit:'contain',animation:'mzoom .92s cubic-bezier(.55,0,.75,.2) both'}}/>
    <//>`:''}

    ${isPhone()?html`<mobile-nav active="home"></mobile-nav>`:''}

    <${Snackbar} open=${!!snack} autoHideDuration=${2400} onClose=${()=>setSnack('')} message=${snack} anchorOrigin=${{vertical:'bottom',horizontal:'center'}}/>
  <//>`;
}

/* =========================================================
   LESSON
   ========================================================= */
function PlayCtl({role,playing,onClick}){
  const tint=role==='max'?VIOLET:TEAL8;
  return html`<div onClick=${onClick} style=${{display:'inline-flex',alignItems:'center',gap:6,marginTop:7,cursor:'pointer',userSelect:'none'}}>
    <span style=${{width:20,height:20,borderRadius:'50%',flex:'none',display:'grid',placeItems:'center',background:playing?tint:`${tint}1a`,color:playing?'#fff':tint}}><i className=${'ti ti-'+(playing?'volume':'player-play-filled')} style=${{fontSize:11}}/></span>
    ${playing?html`<${Waveform} color=${tint} bars=${4} height=${16}/>`:html`<span style=${{fontSize:11,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',color:tint,opacity:.85}}>Read aloud<//>`}
  </div>`;
}
function ChatBubble({m,speakingId,onReplay}){
  if(m.role==='student') return html`<div class="msg" style=${{display:'flex',justifyContent:'flex-end'}}>
    <div style=${{maxWidth:'82%',background:BLUE,color:'#fff',borderRadius:'10px 10px 3px 10px',padding:'8px 12px',fontSize:12,fontWeight:500}}>${m.text}</div>
  </div>`;
  const isMax=m.role==='max'; const tint=isMax?VIOLET:TEAL; const playing=speakingId===m.id;
  if(m.featured) return html`<div class="msg" style=${{display:'flex',gap:9,alignItems:'flex-start'}}>
    <${Buddy} who=${m.role} size=${36} bob=${false} mood=${m.mood||'grin'}/>
    <div style=${{flex:1,minWidth:0,background:BLUE0,border:`1px solid ${BLUE2}`,borderRadius:'3px 10px 10px 10px',padding:'10px 12px'}}>
      <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:5,color:BLUE7,fontSize:11,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i className="ti ti-sparkles" style=${{fontSize:12}}/>Key idea</div>
      <div style=${{fontSize:12,fontWeight:700,lineHeight:1.45,color:INK,whiteSpace:'pre-wrap'}}>${m.text}</div>
      <${PlayCtl} role=${m.role} playing=${playing} onClick=${()=>onReplay(m)}/>
    </div>
  </div>`;
  return html`<div class="msg" style=${{display:'flex',gap:9,alignItems:'flex-start'}}>
    <${Buddy} who=${m.role} size=${36} bob=${false} mood=${m.mood||'smile'}/>
    <div style=${{minWidth:0,flex:1}}>
      <div style=${{fontSize:11,fontWeight:700,letterSpacing:'.5px',color:isMax?VIOLET9:TEAL9,marginBottom:3}}>${isMax?'MAX':'SPARK'}</div>
      <div style=${{background:isMax?CARD:TEAL0,border:`1px solid ${isMax?BORDER:TEAL2}`,borderLeft:`3px solid ${tint}`,borderRadius:'3px 10px 10px 10px',padding:'8px 12px'}}>
        <div style=${{fontSize:12,fontWeight:500,lineHeight:1.45,whiteSpace:'pre-wrap',color:INK}}>${m.text}</div>
        <${PlayCtl} role=${m.role} playing=${playing} onClick=${()=>onReplay(m)}/>
      </div>
    </div>
  </div>`;
}

const PROG=[10,24,40,55,70,85,96];
function Lesson({onExit,onComplete}){
  const idRef=useRef(0);
  const [messages,setMessages]=useState([]);
  const [step,setStep]=useState(0);
  const pushRef=useRef(null);
  const [railHov,setRailHov]=useState(false);
  const [sparkPop,setSparkPop]=useState(false);
  useEffect(()=>{ // Step 4 (question): Spark's guess appears ON THE BOARD (canvas), not in the chat
    if(step!==3){ setSparkPop(false); return; }
    setSparkPop(false);
    const t=setTimeout(()=>setSparkPop(true),650);
    return ()=>clearTimeout(t);
  },[step]);
  const [maxMood,setMaxMood]=useState('smile');
  const [sparkMood,setSparkMood]=useState('grin');
  const [listening,setListening]=useState(false);
  const [doubtText,setDoubtText]=useState('');
  const [lcFocus,setLcFocus]=useState(false);
  const [thinking,setThinking]=useState(false);
  const [celebrate,setCelebrate]=useState(false);
  const [picked,setPicked]=useState(null);
  const [snack,setSnack]=useState('');
  const [speaking,setSpeaking]=useState(null);
  const [speakingId,setSpeakingId]=useState(null);
  const speakTimer=useRef(null);
  const chatRef=useRef(null);
  // ---- Spark's on-canvas side-quest (Step 2 · Why LCM?) ----
  const [sparkWin,setSparkWin]=useState(null);       // null | 'active' | 'closing'
  const [sparkMsgs,setSparkMsgs]=useState([]);
  const [sparkTyping,setSparkTyping]=useState(null); // 'spark' | 'max' | null
  const [sparkStage,setSparkStage]=useState(0);      // 0 opening · 1 awaiting reply · 2 wrapping · 3 done
  const [sparkDone,setSparkDone]=useState(false);
  const sparkIdRef=useRef(0);
  const sparkScrollRef=useRef(null);
  const sparkTimers=useRef([]);
  const clearSparkTimers=()=>{ sparkTimers.current.forEach(clearTimeout); sparkTimers.current=[]; };
  const T=(fn,ms)=>sparkTimers.current.push(setTimeout(fn,ms));
  const pushSpark=(m)=>setSparkMsgs(a=>[...a,{id:++sparkIdRef.current,...m}]);
  useEffect(()=>{ const el=sparkScrollRef.current; if(el) el.scrollTop=el.scrollHeight; },[sparkMsgs,sparkTyping]);
  useEffect(()=>()=>clearSparkTimers(),[]);
  useEffect(()=>{ // auto-open Spark's question on the LCM slide (first time only)
    if(step!==2||sparkDone){ return; }
    clearSparkTimers(); setSparkMsgs([]); setSparkStage(0); setSparkWin(null);
    T(()=>setSparkWin('active'),900);
    T(()=>setSparkTyping('spark'),1300);
    T(()=>{ setSparkTyping(null); pushSpark({who:'spark',text:"Wait wait \u2014 why are we taking the LCM of 2 and 3? Why does the LCM even matter here? \u26a1"}); },2600);
    T(()=>setSparkTyping('max'),3300);
    T(()=>{ setSparkTyping(null); pushSpark({who:'max',text:"Great question, Spark! We can only add fractions when the pieces are the same size \u2014 and halves and thirds are different sizes."}); },4700);
    T(()=>setSparkTyping('max'),5300);
    T(()=>{ setSparkTyping(null); pushSpark({who:'max',text:"The LCM of 2 and 3 is the smallest number both fit into \u2014 that's 6 \u2014 so we cut everything into sixths."}); setSparkStage(1); },6800);
    return ()=>clearSparkTimers();
  },[step,sparkDone]);
  useEffect(()=>{ if(step!==2&&sparkWin){ clearSparkTimers(); setSparkWin(null); } },[step]);
  const sparkReply=()=>{ if(sparkStage!==1) return; setSparkStage(2);
    pushSpark({who:'student',text:"Ohh \u2014 so the LCM just gives the smallest common size?"});
    clearSparkTimers();
    T(()=>setSparkTyping('max'),500);
    T(()=>{ setSparkTyping(null); pushSpark({who:'max',text:"Exactly, Aarav! 6 is the least common multiple, so \u00bd = 3/6 and \u2153 = 2/6. Now the pieces match and we simply add the tops."}); },1700);
    T(()=>setSparkTyping('spark'),2300);
    T(()=>{ setSparkTyping(null); pushSpark({who:'spark',text:"Ohhh! LCM = the smallest shared size. That clicks now! \u26a1"}); setSparkStage(3); },3500);
  };
  const finishSpark=()=>{ clearSparkTimers(); setSparkWin('closing');
    T(()=>{ setSparkWin(null); setSparkDone(true);
      pushRef.current&&pushRef.current({kind:'sparksum',title:'Why do we take the LCM?',text:"Spark asked why we find the LCM of 2 and 3. Vyom explained: fractions can only be added when the pieces are the same size, and the LCM \u2014 6 \u2014 is the smallest shared size, so \u00bd = 3/6 and \u2153 = 2/6."});
    },820);
  };
  const hideSpark=()=>{ clearSparkTimers(); setSparkWin('closing'); T(()=>setSparkWin(null),700); };
  const reopenSpark=()=>{ clearSparkTimers(); setStep(2); setSparkWin('active'); };
  const [sparkInput,setSparkInput]=useState('');
  const askSpark=()=>{ const t=(sparkInput||'').trim(); if(!t||sparkTyping) return; setSparkInput('');
    clearSparkTimers(); pushSpark({who:'student',text:t});
    T(()=>setSparkTyping('max'),450);
    T(()=>{ setSparkTyping(null); pushSpark({who:'max',text:sparkAnswer(t)}); setSparkStage(s=>s<3?3:s); },1750);
  };
  function sparkAnswer(q){ const s=(q||'').toLowerCase();
    if(/why/.test(s)&&/lcm|common|multiple|match|same|6/.test(s)) return "Because both fractions need the same-size pieces before we can add them — 6 is the smallest size that halves AND thirds fit into evenly.";
    if(/lcm|multiple/.test(s)) return "The LCM of 2 and 3 is 6 — the smallest number both 2 and 3 divide into. That's why we rewrite ½ and ⅓ over 6.";
    if(/gcd|hcf|factor/.test(s)) return "Good catch — GCD is for simplifying. To ADD fractions we want the LCM of the denominators so the pieces line up.";
    if(/add|top|numerator|answer|sum/.test(s)) return "Once the bottoms match (both 6), we just add the tops: 3/6 + 2/6 = 5/6 — the bottom stays 6.";
    if(/bigger|larger|smaller|other|another|12|any/.test(s)) return "We could use any common multiple (like 12), but the LCM — 6 — keeps the numbers smallest and simplest.";
    return "Great question, Aarav! The key idea: matching the bottoms with the LCM (6) lets us add ½ and ⅓ as 3/6 + 2/6 = 5/6.";
  }

  const speakMsg=useCallback((role,id,text)=>{ setSpeaking(role); setSpeakingId(id); clearTimeout(speakTimer.current); speakTimer.current=setTimeout(()=>{setSpeaking(null);setSpeakingId(null);},Math.min(5200,1500+(text?text.length:30)*30)); },[]);
  const say=useCallback((role,text,mood,featured)=>{ const id=++idRef.current; setMessages(m=>[...m,{id,role,text,mood,featured}]); if(role!=='student'){ setSpeaking(role); setSpeakingId(id); clearTimeout(speakTimer.current); speakTimer.current=setTimeout(()=>{setSpeaking(s=>s===role?null:s); setSpeakingId(i=>i===id?null:i);},Math.min(5200,1500+text.length*30)); } },[]);
  const onReplay=useCallback((m)=>speakMsg(m.role,m.id,m.text),[speakMsg]);
  useEffect(()=>{ const c=chatRef.current; if(c) c.scrollTop=c.scrollHeight; },[messages,thinking]);
  useEffect(()=>{
    setTimeout(()=>say('spark',"Ooh, and I'll try one too — watch me (mostly) nail it!",'grin'),700);
  },[]);

  const go=(n)=>{ setPicked(null); setStep(n); };
  const burstAt=(e)=>{ if(e&&e.currentTarget){ const r=e.currentTarget.getBoundingClientRect(); burst(r.left+r.width/2, r.top+r.height/2); } };
  const toVideo=()=>{ go(1); };
  const toSlide=()=>{ go(2); };
  const toSpark=()=>{ setSparkMood('oops'); say('spark',"Easy! ½ + ⅓ = ⅖ — just add the tops AND the bottoms, right?",'oops'); setTimeout(()=>{ say('max',"Careful, Spark — adding the bottoms changes the size of the pieces! Aarav, what should BOTH bottoms become so halves and thirds fit?",'think'); },400); go(3); };
  const chooseDenom=(n,e)=>{ const correct=n===6; setPicked({k:String(n),correct}); say('student',`Make them ${n}!`); if(correct){ burstAt(e); setSparkMood('smile'); setMaxMood('grin'); setTimeout(()=>{ say('max',"Exactly! 6 works for halves AND thirds. So ½ = 3/6 and ⅓ = 2/6. Let's see it on the fraction bars.",'grin',true); go(4); },650);} else { say('max',`Not quite — ${n} doesn't split into halves and thirds evenly. Think of the smallest number both 2 and 3 fit into.`,'think'); setTimeout(()=>setPicked(null),900); } };
  const toActivity=()=>{ say('max',"Now — how many sixths is that altogether?",'smile'); go(5); };
  const chooseTotal=(n,e)=>{ const correct=n===5; setPicked({k:String(n),correct}); say('student',`${n} sixths`); if(correct){ burstAt(e); setTimeout(()=>{ say('max',"You've got it — 3/6 + 2/6 = 5/6.",'grin'); setTimeout(()=>{ say('max',"Last check — write the answer for ½ + ⅓.",'smile'); },450); go(6); },650);} else { say('max',"Count again: 3 sixths plus 2 sixths…",'think'); setTimeout(()=>setPicked(null),900); } };
  const chooseAns=(v,e)=>{ const correct=v==='5/6'; setPicked({k:v,correct}); say('student',v); if(correct){ burstAt(e); setMaxMood('grin'); setSparkMood('grin'); setTimeout(()=>{ say('max',"Perfect! ½ + ⅓ = 5/6. You just bridged a brand-new island.",'grin',true); setCelebrate(true); },650);} else { say('max',"Close — remember we made it sixths. Try once more!",'think'); setTimeout(()=>setPicked(null),900); } };

  const iKnow=()=>{ if(step===0)toVideo(); else if(step===1)toSlide(); else if(step===2)toSpark(); else if(step===4)toActivity(); else setSnack("Tap an answer to keep going!"); };
  const prevStep=()=>{ if(step>0){ setPicked(null); setStep(s=>s-1); } };
  const repeat=()=>{ const lastMax=[...messages].reverse().find(m=>m.role==='max'); if(lastMax) say('max',"Sure — "+lastMax.text,'smile'); };
  const mic=()=>{ setListening(true); setTimeout(()=>{ setListening(false); setDoubtText("Why do we need the same denominator?"); },1300); };

  function pickResponder(q){ const s=q.toLowerCase();
    const academic=/\b(why|how|what|explain|mean|calcul|solve|answer|denominator|numerator|fraction|add|subtract|multiply|divide|equal|formula|step|wrong|right|prove|reason|sixth|half|third|bottom|top)\b|[?]/;
    const social=/\b(hi|hey|hello|how are you|bored|tired|fun|funny|cool|awesome|love|hate|scared|nervous|excited|friend|play|joke|thanks|thank you|nice|hungry|sleepy|happy|sad)\b/;
    if(social.test(s)&&!academic.test(s)) return 'spark';
    if(academic.test(s)) return 'max';
    return 'max';
  }
  async function submitDoubt(){
    const q=doubtText.trim(); if(!q) return;
    setDoubtText('');
    const guess=pickResponder(q);
    if(guess==='max') setMaxMood('think'); else setSparkMood('think');
    say('student','🙋 '+q); setThinking(guess);
    let to=guess, reply='';
    try{
      const prompt=`You are routing a young student's chat message inside a maths lesson with two characters:\n- MAX: the warm, patient TEACHER who explains concepts.\n- Spark: a cheerful fellow-LEARNER buddy (a friend/classmate, NOT a teacher) who chats, encourages and reacts.\nAarav is an 11-year-old CBSE Class 7 student learning to add fractions with unlike denominators (NCERT). Decide who should respond: choose MAX for any maths/concept/how/why/explain question, and Spark for casual, social, emotional or playful messages. Then write that character's reply in 2-3 short, simple, friendly sentences a child enjoys (plain text, no markdown). If Spark answers a tricky maths fact, give a simple take and suggest checking with MAX. Return ONLY strict JSON: {"who":"max"|"spark","reply":"..."} Message: "${q}"`;
      const text=await window.claude.complete({messages:[{role:'user',content:prompt}]});
      const mm=(text||'').match(/\{[\s\S]*\}/);
      if(mm){ const o=JSON.parse(mm[0]); if(o.who==='max'||o.who==='spark') to=o.who; reply=(o.reply||'').trim(); }
      if(to!==guess){ setThinking(to); if(to==='max') setMaxMood('think'); else setSparkMood('think'); }
      say(to, reply||(to==='max'?"Great question! Let's keep going and it'll click.":"Ooh good one — let's figure it out together!"),'smile');
    }catch(e){ to=guess; say(guess, guess==='max'
        ? "Good question! The bottom number tells us how big each slice is — to add slices fairly, they need to be the same size. That's why we match the denominators first."
        : "Ooh, I think the bottoms have to match before we add them — same-size pieces! But let's ask Vyom to be totally sure.", 'smile'); }
    setThinking(false); if(to==='max') setMaxMood('smile'); else setSparkMood('smile');
  }

  const fTile=(t,teal)=>{ const c=teal?TEAL:VIOLET, bg=teal?TEAL0:VIOLET0, bd=teal?TEAL2:VIOLET2, fg=teal?TEAL9:VIOLET9;
    return html`<${Box} sx=${{fontWeight:700,fontSize:30,color:fg,background:bg,border:`1px dashed ${bd}`,borderRadius:'8px',px:2.4,py:1.1}}>${t}<//>`; };
  const sep=(t)=>html`<${Typography} sx=${{fontWeight:700,fontSize:30,color:DIM}}>${t}<//>`;
  const choiceBtn=(label,onClick)=>{ const p=picked&&picked.k===label?picked:null;
    const col=p?(p.correct?'green':'red'):'gray';
    const variant=p?'filled':'default';
    return html`<${M.Button} key=${label} variant=${variant} color=${col} size="lg" onClick=${onClick}
      style=${{minWidth:104,fontSize:20,fontWeight:700,height:60,...(p&&!p.correct?{animation:'shake .35s'}:{})}}>${label}<//>`; };

  const videoNode=()=>html`<${Stack} spacing=${2} alignItems="center" justifyContent="center" sx=${{height:'100%',maxWidth:980,mx:'auto',width:'100%'}}>
    <${Box} sx=${{width:'100%',aspectRatio:'16/9',borderRadius:'12px',position:'relative',overflow:'hidden',background:'#242424',border:`1px solid ${G4}`,boxShadow:SH_LG,display:'grid',placeItems:'center'}}>
      <${Box} sx=${{position:'absolute',top:12,left:14,display:'flex',gap:.7,alignItems:'center',color:'rgba(255,255,255,.7)'}}><${Icon} n="movie" size=${15}/><${Eyebrow} color=${'rgba(255,255,255,.7)'}>Video placeholder<//><//>
      <${Box} sx=${{width:68,height:68,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center',color:BLUE,boxShadow:SH_MD,cursor:'pointer',zIndex:1}}><${Icon} n="player-play-filled" size=${28}/><//>
      <${Typography} sx=${{position:'absolute',bottom:38,color:'rgba(255,255,255,.9)',fontWeight:700,fontSize:14}}>Why the bottoms must match<//>
      <${Box} sx=${{position:'absolute',left:14,right:14,bottom:14,display:'flex',alignItems:'center',gap:1,color:'rgba(255,255,255,.8)'}}>
        <${Icon} n="player-play-filled" size=${12}/>
        <${Box} sx=${{flex:1,height:4,borderRadius:999,background:'rgba(255,255,255,.25)'}}><${Box} sx=${{width:'18%',height:'100%',borderRadius:999,background:BLUE}}/><//>
        <${Typography} sx=${{fontSize:11,fontWeight:500}}>0:16 / 1:28<//>
      <//>
    <//>
    <${Typography} sx=${{color:DIM,fontWeight:500,fontSize:12}}>An animated explainer would play here — drop in the Lottie / MP4 source.<//>
    <${M.Button} onClick=${toSlide} rightSection=${html`<${Icon} n="arrow-right"/>`}>I've watched it<//>
  <//>`;

  const simNode=()=>html`<${Stack} spacing=${2} alignItems="center" justifyContent="center" sx=${{height:'100%',maxWidth:860,mx:'auto',width:'100%'}}>
    <${Box} sx=${{width:'100%',borderRadius:'12px',p:3.5,boxShadow:SH_LG,...cardSx}}>
      <${Stack} direction="row" justifyContent="space-between" alignItems="center" sx=${{mb:2.5}}>
        <${Stack} direction="row" spacing=${.7} alignItems="center" sx=${{color:CYAN}}><${Icon} n="adjustments-horizontal" size=${17}/><${Eyebrow} color=${CYAN}>Interactive applet<//><//>
        <${M.Badge} variant="light" color="cyan" size="sm">Drag to explore<//>
      <//>
      <${Stack} spacing=${1.8}>
        <${Box}>
          <${Eyebrow}>½ → 3/6<//>
          <${Box} sx=${{display:'flex',gap:.7,mt:.6}}>${[1,1,1,0,0,0].map((on,i)=>html`<${Box} key=${i} sx=${{flex:1,height:50,borderRadius:'6px',border:`1px solid ${VIOLET}`,background:on?VIOLET:'transparent'}}/>`)}<//>
        <//>
        <${Box}>
          <${Eyebrow}>⅓ → 2/6<//>
          <${Box} sx=${{display:'flex',gap:.7,mt:.6}}>${[1,1,0,0,0,0].map((on,i)=>html`<${Box} key=${i} sx=${{flex:1,height:50,borderRadius:'6px',border:`1px solid ${TEAL}`,background:on?TEAL:'transparent'}}/>`)}<//>
        <//>
        <${Box} sx=${{position:'relative'}}>
          <${Eyebrow}>Combined<//>
          <${Box} sx=${{display:'flex',gap:.7,mt:.6}}>${[1,1,1,1,1,0].map((on,i)=>html`<${Box} key=${i} sx=${{flex:1,height:50,borderRadius:'6px',border:`1px solid ${G4}`,background:on?(i<3?VIOLET:TEAL):'transparent'}}/>`)}<//>
          <${Box} sx=${{position:'absolute',right:'14%',top:22,bottom:0,width:2,borderRight:`2px dashed ${REDF}`}}/>
        <//>
      <//>
    <//>
    <${Typography} sx=${{color:DIM,fontWeight:500,fontSize:12,textAlign:'center'}}>Live applet (GeoGebra / custom) mounts here — students drag the bars to feel why 5/6 fills.<//>
    <${M.Button} color="teal" onClick=${toActivity} rightSection=${html`<${Icon} n="arrow-right"/>`}>I see it — continue<//>
  <//>`;

  let main;
  if(step===0) main=html`<${Stack} spacing=${2.5} alignItems="center" justifyContent="center" sx=${{height:'100%',textAlign:'center'}}>
    <${Typography} variant="h5" sx=${{maxWidth:460}}>Ready to add fractions with different bottoms?<//>
    <${Stack} direction="row" spacing=${2.5} alignItems="center">${fTile('½')}${sep('+')}${fTile('⅓',true)}<//>
    <${M.Button} size="md" onClick=${toVideo} rightSection=${html`<${Icon} n="arrow-right"/>`}>Let's start<//>
  <//>`;
  else if(step===1) main=videoNode();
  else if(step===2) main=html`<${Stack} spacing=${2.5} alignItems="center" justifyContent="center" sx=${{height:'100%'}}>
    <${Stack} direction="row" spacing=${1.6} alignItems="center">${fTile('½')}${sep('+')}${fTile('⅓',true)}<//>
    <${Stack} direction="row" spacing=${2.5} alignItems="flex-start" justifyContent="center" sx=${{width:'100%',maxWidth:'100%',flexWrap:'wrap',rowGap:2.5}}>
      <${Box} sx=${{width:400,flexShrink:0,borderRadius:'12px',border:`1px solid ${VIOLET2}`,background:'#fff',boxShadow:SH_SM,overflow:'hidden'}}>
        <${Box} sx=${{px:2,py:1,background:VIOLET0,borderBottom:`1px solid ${VIOLET2}`,fontSize:11,fontWeight:800,letterSpacing:'.5px',color:VIOLET9,textTransform:'uppercase'}}>Step 1 · Make the bottoms match<//>
        <${Stack} spacing=${1.3} sx=${{p:2.2}}>
          <${Box} sx=${{alignSelf:'flex-start',display:'inline-flex',alignItems:'center',gap:1,px:1.4,py:.8,borderRadius:10,background:sparkWin?'#FFF7E6':G0,border:`1px solid ${sparkWin?'rgba(240,140,0,.55)':BORDER}`,transition:'background .4s ease, border-color .4s ease',...(sparkWin?{animation:'anchorpulse 1.8s ease-out infinite'}:{})}}>
            <${Icon} n="math-symbols" size=${16} color=${sparkWin?'#e8830f':DIM}/>
            <${Box} sx=${{fontSize:14,fontWeight:700,color:INK}}>Find the LCM of 2 and 3<//>
          <//>
          <${Typography} sx=${{fontSize:14,fontWeight:700,color:INK}}>LCM(2, 3) = <${Box} component="span" sx=${{color:VIOLET9,fontWeight:800}}>6<//><//>
          <${Stack} direction="row" spacing=${2}>
            <${Typography} sx=${{fontSize:14,fontWeight:700,color:INK}}>½ = <b>3/6</b><//>
            <${Typography} sx=${{fontSize:14,fontWeight:700,color:INK}}>⅓ = <b>2/6</b><//>
          <//>
        <//>
      <//>
      ${renderSparkWindow()}
    <//>
    <${M.Button} onClick=${toSpark} rightSection=${html`<${Icon} n="arrow-right"/>`}>Got it — next<//>
  <//>`;
  else if(step===3) main=html`<${Stack} spacing=${2.5} justifyContent="center" sx=${{height:'100%',px:1,maxWidth:560,mx:'auto'}}>
    ${!(picked&&picked.correct)?html`<${Box} sx=${{position:'relative',p:2,borderRadius:'4px 14px 14px 14px',background:'#FFF7E6',border:'1px solid rgba(240,140,0,.45)',boxShadow:SH_SM,display:'flex',gap:1.5,alignItems:'flex-start',opacity:sparkPop?1:0,transform:sparkPop?'translateY(0) scale(1)':'translateY(10px) scale(.96)',transition:'opacity .4s ease, transform .4s cubic-bezier(.2,1.3,.4,1)'}}>
      <${Buddy} who="spark" size=${44} bob=${false} mood="oops" style=${{flexShrink:0}}/>
      <${Box} sx=${{minWidth:0}}>
        <${Box} sx=${{fontSize:11,fontWeight:800,letterSpacing:'.4px',textTransform:'uppercase',color:'#e8830f',mb:.4}}>Spark ⚡<//>
        <${Typography} sx=${{fontWeight:500,fontSize:14,color:'#8a5300',lineHeight:1.45}}>Ooh ooh, I think I've got it! ½ + ⅓ = ⅖ — you just add the tops AND the bottoms, right?<//>
      <//>
    <//>`:''}
    <${Typography} variant="h6" textAlign="center" sx=${{opacity:sparkPop?1:.35,transition:'opacity .4s ease'}}>Help Vyom — what should both bottoms become?<//>
    <${Stack} direction="row" spacing=${2} justifyContent="center" sx=${{opacity:sparkPop?1:.35,pointerEvents:sparkPop?'auto':'none',transition:'opacity .4s ease'}}>${[5,6,9].map(n=>choiceBtn(String(n),(e)=>chooseDenom(n,e)))}<//>
    ${!sparkPop?html`<${Stack} direction="row" spacing=${1} alignItems="center" justifyContent="center" sx=${{color:DIM}}><${Icon} n="message-2" size=${15}/><${Typography} sx=${{fontSize:12,fontWeight:700}}>Spark is working it out on the board…<//><//>`:''}
  <//>`;
  else if(step===4) main=simNode();
  else if(step===5) main=html`<${Stack} spacing=${3} alignItems="center" justifyContent="center" sx=${{height:'100%'}}>
    <${Typography} variant="h6" textAlign="center">½ = 3/6 and ⅓ = 2/6. How many sixths in total?<//>
    <${Stack} direction="row" spacing=${1.2} alignItems="center">
      <${Stack} direction="row" spacing=${.6}>${[0,1,2].map(i=>html`<${Box} key=${i} sx=${{width:42,height:42,borderRadius:'6px',background:VIOLET}}/>`)}<//>
      ${sep('+')}
      <${Stack} direction="row" spacing=${.6}>${[0,1].map(i=>html`<${Box} key=${i} sx=${{width:42,height:42,borderRadius:'6px',background:TEAL}}/>`)}<//>
    <//>
    <${Stack} direction="row" spacing=${2} justifyContent="center">${[4,5,6].map(n=>choiceBtn(String(n),(e)=>chooseTotal(n,e)))}<//>
  <//>`;
  else main=html`<${Stack} spacing=${3} alignItems="center" justifyContent="center" sx=${{height:'100%'}}>
    <${Box} sx=${{display:'flex',alignItems:'center',gap:1.5}}>${fTile('½ + ⅓')}${sep('=')}<${Typography} sx=${{fontSize:38,fontWeight:700,color:INK}}>?<//><//>
    <${Stack} direction="row" spacing=${2} justifyContent="center">${['⅖','5/6','⅗'].map(v=>choiceBtn(v,(e)=>chooseAns(v==='5/6'?'5/6':v,e)))}<//>
    <${Typography} sx=${{color:DIM,fontSize:12,fontWeight:500}}>Pick the answer — or ask Vyom a doubt in the chat.<//>
  <//>`;

  const lastBuddy=[...messages].reverse().find(x=>x.role!=='student')?.role||'max';
  const activeRole=speaking||lastBuddy;
  const NODES={teach:{label:'Teaching',icon:'presentation',c:VIOLET},question:{label:'Question',icon:'help-circle',c:YELLOW},applet:{label:'Activity',icon:'box',c:TEAL8},sim:{label:'Simulation',icon:'adjustments-horizontal',c:CYAN},video:{label:'Video',icon:'player-play',c:BLUE}};
  const stepNode=[['teach','Guided talk'],['video','Why bottoms must match'],['teach','Slide · common denominator'],['question','Help MAX'],['sim','Fraction-bar applet'],['applet','Build the sixths'],['question','Exit question']];
  const [ntype,nsub]=stepNode[step]||stepNode[0]; const node=NODES[ntype];
  function sparkBubble(m){ if(m.who==='student') return html`<${Box} key=${m.id} className="msg" sx=${{alignSelf:'flex-end',maxWidth:'85%',background:BLUE,color:'#fff',borderRadius:'13px 13px 4px 13px',px:1.5,py:.85,fontSize:12,fontWeight:500,lineHeight:1.45,boxShadow:SH_XS}}>${m.text}<//>`;
    const isSpark=m.who==='spark';
    return html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${.8} alignItems="flex-start" sx=${{alignSelf:'flex-start',maxWidth:'93%'}}>
      <${Buddy} who=${isSpark?'spark':'max'} size=${26} bob=${false} style=${{flexShrink:0,marginTop:2}}/>
      <${Box} sx=${{background:isSpark?'#FFF7E6':CARD,border:`1px solid ${isSpark?'rgba(240,140,0,.42)':BORDER}`,borderRadius:'4px 12px 12px 12px',px:1.4,py:.85,fontSize:12,fontWeight:500,color:isSpark?'#8a5300':INK,lineHeight:1.45,boxShadow:SH_XS}}>
        <${Box} sx=${{fontSize:11,fontWeight:800,letterSpacing:'.4px',textTransform:'uppercase',color:isSpark?'#e8830f':VIOLET9,mb:.3}}>${isSpark?'Spark ⚡':'MAX'}<//>
        ${m.text}
      <//>
    <//>`; }
  function renderSparkWindow(){
    if(!sparkWin) return '';
    const inputRow = html`<${Box} sx=${{display:'flex',alignItems:'center',gap:.6,border:`1px solid ${BORDER}`,borderRadius:10,px:1,py:.35,background:CARD}}>
      <input value=${sparkInput} onChange=${e=>setSparkInput(e.target.value)} onKeyDown=${e=>{ if(e.key==='Enter') askSpark(); }} placeholder="Ask your own question…" style=${{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',fontFamily:SYS,fontSize:12,fontWeight:500,color:INK,caretColor:BLUE,padding:'5px 3px'}}/>
      <${Box} onClick=${askSpark} sx=${{width:28,height:28,flexShrink:0,borderRadius:8,display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:BLUE,transition:'.15s','&:hover':{background:BLUE7}}}><${Icon} n="send" size=${14}/><//>
    <//>`;
    const footer = sparkTyping
      ? html`<${Box} sx=${{fontSize:11,fontWeight:700,color:DIM,textAlign:'center',py:.5}}>Vyom & Spark are talking…<//>`
      : sparkStage===0
      ? html`<${Box} sx=${{fontSize:11,fontWeight:700,color:DIM,textAlign:'center',py:.5}}>Listening to Spark…<//>`
      : html`<${Stack} spacing=${1}>
          ${(!sparkDone&&sparkStage===1)?html`<${RippleHover} onClick=${sparkReply} radius="10px" sx=${{px:1.4,py:.85,cursor:'pointer',border:`1px solid ${BLUE2}`,background:BLUE0,color:BLUE7,'&:hover':{background:BLUE1}}}><${Box} sx=${{display:'flex',alignItems:'center',gap:.6,fontSize:12,fontWeight:700}}><${Icon} n="corner-down-right" size=${14}/> Ohh — so the LCM gives the common size?<//><//>`:''}
          ${inputRow}
          ${sparkDone
            ? html`<${M.Button} fullWidth variant="light" color="gray" size="xs" onClick=${hideSpark} leftSection=${html`<${Icon} n="x" size=${14}/>`}>Close recap<//>`
            : (sparkStage>=3?html`<${M.Button} fullWidth color="teal" size="xs" onClick=${finishSpark} rightSection=${html`<${Icon} n="arrow-right" size=${14}/>`}>Got it — back to the lesson<//>`:'')}
        <//>`;
    return html`<${Box} sx=${{position:'relative',width:330,flexShrink:0,zIndex:40,pointerEvents:sparkWin==='closing'?'none':'auto',animation:sparkWin==='closing'?'sparkwinout .8s cubic-bezier(.5,0,.75,.4) forwards':'sparkwinin .5s cubic-bezier(.2,1.25,.4,1) both',transformOrigin:'bottom left'}}>
    <${Box} sx=${{position:'absolute',left:-7,top:44,width:14,height:14,background:'#FFF7E6',borderLeft:'1px solid rgba(240,140,0,.5)',borderBottom:'1px solid rgba(240,140,0,.5)',transform:'rotate(45deg)',zIndex:2}}/>
    <${Box} sx=${{position:'relative',borderRadius:'14px',background:CARD,border:'1px solid rgba(240,140,0,.5)',boxShadow:'0 20px 48px rgba(240,140,0,.22), 0 6px 16px rgba(33,37,41,.12)',overflow:'hidden'}}>
      <${Box} sx=${{display:'flex',alignItems:'center',gap:1,px:1.6,py:1.1,background:'linear-gradient(90deg,#FFF7E6,#fffdf5)',borderBottom:'1px solid rgba(240,140,0,.3)'}}>
        <${Box} sx=${{flexShrink:0,display:'flex',alignItems:'flex-end'}}><${Buddy} who="spark" size=${30} bob=${false}/><${Buddy} who="max" size=${26} bob=${false} style=${{marginLeft:-8}}/><//>
        <${Box} sx=${{flex:1,minWidth:0}}>
          <${Box} sx=${{fontSize:11,fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',color:'#e8830f'}}>Spark asked on the board<//>
          <${Box} sx=${{fontSize:12,fontWeight:700,color:INK}}>Quick question ⚡<//>
        <//>
        ${sparkDone?html`<${Box} sx=${{fontSize:11,fontWeight:700,color:'#b8893a',border:'1px solid rgba(240,140,0,.35)',borderRadius:999,px:.9,py:.3}}>Recap<//>`:''}
      <//>
      <${Box} ref=${sparkScrollRef} sx=${{display:'flex',flexDirection:'column',gap:1,px:1.4,py:1.4,maxHeight:224,overflowY:'auto',maskImage:'linear-gradient(to bottom, transparent 0, #000 20px)',WebkitMaskImage:'linear-gradient(to bottom, transparent 0, #000 20px)'}}>
        ${sparkMsgs.map(sparkBubble)}
        ${sparkTyping?html`<${Stack} direction="row" spacing=${.8} alignItems="center" sx=${{alignSelf:'flex-start',mt:.3}}><${Buddy} who=${sparkTyping} size=${24}/><div style=${{display:'flex',gap:4,padding:'6px 9px',borderRadius:999,background:sparkTyping==='spark'?'#f59f0a':BLUE}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:'#fff',animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</div><//>`:''}
      <//>
      <${Box} sx=${{px:1.4,py:1.2,borderTop:`1px solid ${BORDER}`,background:G0}}>${footer}<//>
    <//>
  <//>`;
  }
  const roomBg=`radial-gradient(1300px 860px at 12% -10%, ${node.c}1e, transparent 58%), radial-gradient(1150px 760px at 103% 114%, ${node.c}16, transparent 55%), linear-gradient(180deg, #f3f0ff 0%, #f8f9fa 52%, #fff4e6 100%)`;
  return html`<${Box} sx=${{position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden',background:roomBg,transition:'background .6s ease'}}>
    <${Box} sx=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',opacity:.6,backgroundImage:`radial-gradient(${node.c}26 1px, transparent 1.5px)`,backgroundSize:'24px 24px',maskImage:'radial-gradient(130% 105% at 50% -5%, #000, transparent 76%)',WebkitMaskImage:'radial-gradient(130% 105% at 50% -5%, #000, transparent 76%)'}}/>
    ${DECOR_SPOTS.map((sp,i)=>html`<i key=${i} class=${'ti ti-'+SUBJECT_ICONS.math[i%SUBJECT_ICONS.math.length]} style=${{position:'absolute',left:sp.l+'%',top:sp.t+'%',fontSize:sp.s,color:`${node.c}22`,zIndex:0,pointerEvents:'none',transition:'color .6s ease'}}/>`)}
    <!-- goal bar -->
    <${Box} sx=${{position:'relative',zIndex:1,flex:'none',display:'flex',alignItems:'center',gap:1.5,px:2,py:1.2,background:CARD,borderBottom:`1px solid ${node.c}30`,boxShadow:SH_XS}}>
      <${Box} sx=${{display:'flex',alignItems:'center',gap:.8,minWidth:0}}>
        <${Box} sx=${{width:26,height:26,flex:'none',borderRadius:7,display:'grid',placeItems:'center',background:`${node.c}16`,color:node.c}}><${Icon} n="math-symbols" size=${15}/><//>
        <${Typography} noWrap sx=${{fontSize:12,fontWeight:700,color:DIM}}>Fractions & Decimals<//>
        <${Icon} n="chevron-right" size=${15} color=${DIM}/>
        <${Typography} noWrap sx=${{fontSize:12,fontWeight:700,color:INK}}>Add fractions · unlike denominators<//>
      <//>
      <${Box} sx=${{flex:1}}/>
      <${M.ActionIcon} variant="default" color="gray" size=${36} onClick=${onExit} title="Close"><${Icon} n="x" size=${18}/><//>
    <//>

    <${Box} sx=${{position:'relative',zIndex:1,flex:1,display:'flex',minHeight:0,overflow:'hidden'}}>
      <!-- main -->
      <${Box} sx=${{flex:1,minWidth:0,display:'flex',flexDirection:'column',position:'relative',p:1.5,gap:2}}>
        <${Box} sx=${{flex:1,borderRadius:'8px',position:'relative',overflow:'hidden',background:CARD,border:`1px solid ${node.c}33`,boxShadow:SH_SM,display:'flex',flexDirection:'column'}}>
          <${Box} sx=${{flex:'none',height:3,background:`linear-gradient(90deg, ${node.c}, ${node.c}55)`}}/>
          <${Box} sx=${{flex:'none',display:'flex',alignItems:'center',gap:1.4,px:1.6,py:1.1,borderBottom:`1px solid ${node.c}33`,background:`linear-gradient(90deg, ${node.c}1f, ${node.c}08 55%, ${G0})`}}>
            <${Stack} direction="row" spacing=${.7} alignItems="center" sx=${{flexShrink:0,px:1,py:.4,borderRadius:999,background:`${node.c}14`,border:`1px solid ${node.c}3a`,color:node.c}}>
              <${Icon} n=${node.icon} size=${14}/>
              <${Typography} sx=${{fontSize:11,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase',whiteSpace:'nowrap'}}>${node.label}<//>
            <//>
            <${Typography} noWrap sx=${{fontSize:11,fontWeight:700,color:DIM,display:{xs:'none',lg:'block'}}}>${nsub}<//>
            <${Box} sx=${{flex:1}}/>
            <${Stack} direction="row" spacing=${.6} alignItems="center">${[0,1,2,3,4,5,6].map(i=>html`<${Box} key=${i} sx=${{width:i===step?18:7,height:7,borderRadius:999,background:i<=step?node.c:`${node.c}30`,transition:'all .3s cubic-bezier(.2,.7,.3,1)'}}/>`)}<//>
          <//>
          <${Box} sx=${{position:'relative',flex:1,minHeight:0,backgroundImage:`radial-gradient(${node.c}1c 1px, transparent 1.4px)`,backgroundSize:'15px 15px',backgroundPosition:'center',boxShadow:`inset 0 0 80px ${node.c}0f`}}>
            <${Box} sx=${{position:'absolute',inset:0,p:3.5,pb:'72px'}}>${main}<//>
            <${Box} sx=${{position:'absolute',left:0,right:0,bottom:0,display:'flex',justifyContent:'space-between',gap:1,px:2,py:1.4,borderTop:`1px solid ${node.c}26`,background:`${CARD}cc`,backdropFilter:'blur(4px)'}}>
              <${M.Button} variant="default" color="gray" size="sm" onClick=${prevStep} disabled=${step===0} leftSection=${html`<${Icon} n="arrow-left" size=${15}/>`}>Previous<//>
            <//>
          <//>
        <//>
      <//>

      <!-- companion rail -->
      <${Box} sx=${{order:-1,width:'30vw',flex:'none',display:{xs:'none',md:'flex'},flexDirection:'column',minHeight:0,position:'relative',background:CARD,borderRight:`1px solid ${node.c}2e`,overflow:'hidden'}}>
        <${AskMaxPanel} embedded withSpark onHoverChange=${setRailHov} pushRef=${pushRef} intro=${`Hey Aarav! Today we're adding fractions with different bottoms, like ½ + ⅓. Here's the whole idea, start to finish:

1.  Different bottoms — we can't add them as they are.
2.  Rename both to the same bottom (the smallest that fits 2 and 3 is 6): ½ = 3/6 and ⅓ = 2/6.
3.  Add the tops: 3 + 2 = 5, keep the bottom → 5/6.

I'll walk you through each step on the board — ask me anything as we go!`} chatText=${doubtText} setChatText=${setDoubtText} chatFocus=${lcFocus} setChatFocus=${setLcFocus} onSend=${()=>{}} onExpandSpark=${reopenSpark}/>
        ${sparkWin?html`<${Box} sx=${{position:'absolute',inset:0,zIndex:20,background:'rgba(248,249,250,.74)',backdropFilter:'blur(1.5px)',display:'flex',alignItems:'flex-end',justifyContent:'center',pb:5,pointerEvents:'auto'}}>
          <${Box} sx=${{display:'flex',alignItems:'center',gap:1,px:2,py:1,borderRadius:999,background:'#FFF7E6',border:'1px solid rgba(240,140,0,.42)',boxShadow:SH_SM,color:'#8a5300',fontSize:12,fontWeight:700}}><${Buddy} who="spark" size=${22} bob=${true}/> Spark has a question on the board ⚡<//>
        <//>`:''}
      <//>
    <//>

    <!-- celebration -->
    <${Dialog} open=${celebrate} PaperProps=${{sx:{width:440,maxWidth:'94vw'}}}>
      <${DialogContent} sx=${{textAlign:'center',p:4}}>
        <${Stack} spacing=${2} alignItems="center">
          <${Stack} direction="row" spacing=${2} alignItems="flex-end" sx=${{animation:'pop .5s ease both'}}><${Buddy} who="max" size=${84} mood="grin"/><${Buddy} who="spark" size=${62} mood="grin"/><//>
          <${Typography} variant="h4">You did it!<//>
          <${Typography} sx=${{color:DIM,fontWeight:500}}>½ + ⅓ = 5/6 — exit question passed.<//>
          <${Box} sx=${{width:'100%',p:2,borderRadius:'8px',background:G0,border:`1px solid ${BORDER}`}}>
            <${Stack} direction="row" justifyContent="space-between" alignItems="center" sx=${{mb:1}}>
              <${Stack} direction="row" spacing=${.8} alignItems="center"><${Icon} n="chart-line" size=${16} color=${BLUE}/><${Typography} sx=${{fontWeight:700,fontSize:12,color:INK}}>Fractions mastery<//><//>
              <${M.Badge} variant="light" color="teal" size="sm">+20%<//>
            <//>
            <${Box} sx=${{position:'relative',height:12,borderRadius:999,background:G2,overflow:'hidden'}}>
              <${Box} sx=${{position:'absolute',left:0,top:0,bottom:0,width:'60%',borderRadius:999,background:BLUE}}/>
              <${Box} sx=${{position:'absolute',left:'40%',top:0,bottom:0,width:'20%',background:'repeating-linear-gradient(45deg,rgba(255,255,255,.5) 0 4px,transparent 4px 8px)'}}/>
            <//>
            <${Stack} direction="row" justifyContent="space-between" sx=${{mt:.7}}><${Typography} sx=${{fontSize:11,fontWeight:500,color:DIM}}>was 40%<//><${Typography} sx=${{fontSize:11,fontWeight:700,color:BLUE7}}>now 60%<//><//>
          <//>
          <${M.Badge} variant="light" color="teal" size="lg" leftSection=${html`<${Icon} n="map-pin" size=${13}/>`} style=${{textTransform:'none'}}>New island unlocked · Subtracting fractions<//>
          <${M.Button} size="md" onClick=${onComplete} rightSection=${html`<${Icon} n="home" size=${16}/>`} style=${{marginTop:6}}>Back to home<//>
        <//>
      <//>
    <//>

    <${Snackbar} open=${!!snack} autoHideDuration=${2600} onClose=${()=>setSnack('')} message=${snack} anchorOrigin=${{vertical:'bottom',horizontal:'center'}}/>
  <//>`;
}

/* =========================================================
   TEACHING ROOM (new) — embedded at the Lesson / Classroom node
   ========================================================= */
function RoomFrame({onExit,onComplete,solo}){
  useEffect(()=>{
    const h=(e)=>{ const d=(e&&e.data)||{}; if(d.type==='byjus-room-exit'){ onExit&&onExit(); } else if(d.type==='byjus-room-complete'){ onComplete&&onComplete(); } };
    window.addEventListener('message',h); return ()=>window.removeEventListener('message',h);
  },[]);
  const src="Byjus.AI%20Teaching%20Room.dc.html?spark="+(solo?'0':'1');
  return html`<div style=${{position:'fixed',inset:0,zIndex:60,background:CANVAS}}>
    <iframe src=${src} title="Teaching room" style=${{width:'100%',height:'100%',border:'none',display:'block'}}/>
  </div>`;
}

/* =========================================================
   APP
   ========================================================= */
function App(){
  const tw=useTweaks();
  const [,setBpTick]=useState(0);
  useEffect(()=>{
    const f=()=>{ const w=window.innerWidth, h=window.innerHeight; if(w===__vw&&h===__vh) return; __vw=w; __vh=h; setBpTick(t=>t+1); };
    f(); window.addEventListener('resize',f); window.addEventListener('orientationchange',f);
    return ()=>{ window.removeEventListener('resize',f); window.removeEventListener('orientationchange',f); };
  },[]);
  const [screen,setScreen]=useState(()=>localStorage.getItem('byjus_onboarded')==='1'?'home':'onboarding');
  const [moduleDone,setModuleDone]=useState(false);
  const finishOnboard=()=>{ localStorage.setItem('byjus_onboarded','1'); setScreen('home'); };
  const restart=()=>{ localStorage.setItem('byjus_onboarded','0'); setScreen('onboarding'); };
  useEffect(()=>{ const h=document.getElementById('byjus-host'); if(h){ h.setAttribute('data-ambience',tw.ambience); h.setAttribute('data-pace',tw.pace); } },[tw.ambience,tw.pace]);
  return html`<${R.Fragment}>
    ${screen==='onboarding'&&html`<${Onboarding} onDone=${finishOnboard}/>`}
    ${screen==='home'&&html`<${Home} moduleDone=${moduleDone} onResume=${()=>{setModuleDone(false);setScreen('lesson');}} onRestart=${restart}/>`}
    ${screen==='lesson'&&html`<${RoomFrame} solo=${tw.companions==='solo'} onExit=${()=>setScreen('home')} onComplete=${()=>{setModuleDone(true);setScreen('home');}}/>`}
  <//>`;
}
(function mount(){
  if(!document.body || !(window.MantineDesignSystem_bdb301 && window.MantineDesignSystem_bdb301.Button) || !(window.React && window.ReactDOM && window.ReactDOM.createRoot)){ return setTimeout(mount,30); }
  M = window.MantineDesignSystem_bdb301;
  // The DC runtime scopes helmet <link>/<style> away from our body-mounted host,
  // so inject everything our light-DOM app needs straight into <head>.
  const DSBASE='_ds/mantine-design-system-bdb30156-1a6b-4162-8181-1c297f319a1c/';
  const sheets=[ DSBASE+'tokens/colors.css', DSBASE+'tokens/semantic.css', DSBASE+'tokens/typography.css',
    DSBASE+'tokens/spacing.css', 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css' ];
  for(const href of sheets){ if(!document.head.querySelector(`link[data-byjus="${href}"]`)){ const l=document.createElement('link'); l.rel='stylesheet'; l.href=href; l.setAttribute('data-byjus',href); document.head.appendChild(l); } }
  if(!document.getElementById('byjus-kf')){
    const st=document.createElement('style'); st.id='byjus-kf';
    const hues=['blue','violet','teal','green','red','orange','grape','cyan','gray','yellow','indigo','pink'];
    let vars=':root{';
    for(const h of hues){ vars+=`--mantine-color-${h}-filled:var(--mantine-color-${h}-6);--mantine-color-${h}-filled-hover:var(--mantine-color-${h}-7);--mantine-color-${h}-light:var(--mantine-color-${h}-0);--mantine-color-${h}-light-hover:var(--mantine-color-${h}-1);--mantine-color-${h}-light-color:var(--mantine-color-${h}-6);`; }
    vars+='}';
    st.textContent=vars+`
      @keyframes sugIn{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}@keyframes xsIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes xsDot{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-3px);opacity:.9}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes avIn{from{opacity:0}to{opacity:1}}
      @keyframes cjspin{to{transform:rotate(360deg)}}
      @keyframes bobb{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes riseIn{from{transform:translateY(10px)}to{transform:translateY(0)}}
      @keyframes pop{0%{transform:scale(.72)}70%{transform:scale(1.06)}100%{transform:scale(1)}}
      @keyframes cardpop{0%{transform:scale(1)}28%{transform:scale(1.05)}58%{transform:scale(.99)}100%{transform:scale(1)}}
      @keyframes siri{0%,100%{transform:scaleY(.28)}20%{transform:scaleY(.85)}40%{transform:scaleY(.45)}60%{transform:scaleY(1)}80%{transform:scaleY(.6)}}
      @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
      @keyframes dots{0%,80%,100%{opacity:.25}40%{opacity:1}}
      @keyframes sparkwinin{0%{opacity:0;transform:translateY(14px) scale(.9)}100%{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes sparkwinout{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(-46px,74px) scale(.32)}}
      @keyframes anchorpulse{0%,100%{box-shadow:0 0 0 0 rgba(240,140,0,.45)}50%{box-shadow:0 0 0 7px rgba(240,140,0,0)}}
      @keyframes starburst{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}22%{opacity:1}100%{transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1);opacity:0}}
      @keyframes nebin{0%{opacity:0}32%{opacity:1}100%{opacity:.72}}
      @keyframes nebfade{0%{opacity:0}25%{opacity:.75}68%{opacity:.5}100%{opacity:0}}
      #byjus-host[data-pace="calm"] img{animation-duration:5.8s!important}
      #byjus-host[data-pace="spirited"] img{animation-duration:1.9s!important}
      #byjus-host[data-pace="calm"] [style*="twinkle"]{animation-duration:9s!important}
      #byjus-host[data-pace="spirited"] [style*="twinkle"]{animation-duration:2.2s!important}
      #byjus-host .msg{animation:riseIn .3s cubic-bezier(.2,.7,.3,1) both}
      #byjus-host .scrn{animation:riseIn .34s cubic-bezier(.2,.7,.3,1) both}
      #byjus-host::-webkit-scrollbar{width:10px;height:10px}
      #byjus-host::-webkit-scrollbar-thumb{background:rgba(33,37,41,.18);border-radius:999px;border:3px solid transparent;background-clip:content-box}`;
    document.head.appendChild(st);
  }
  ['dc-root','app-root'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; });
  let host=document.getElementById('byjus-host');
  if(!host){ host=document.createElement('div'); host.id='byjus-host'; document.body.appendChild(host); }
  host.style.cssText='position:fixed;inset:0;overflow:auto;z-index:1;font-family:'+SYS+';background-color:var(--cv-base);background-image:var(--cv-lattice),var(--cv-linear);background-size:24px 24px,100% 100%;background-attachment:local,local;';
  window.ReactDOM.createRoot(host).render(html`<${App}/>`);
})();
