import htm from 'https://esm.sh/htm@3.1.1';
const R = window.React;
const { useState, useEffect, useRef, useCallback, forwardRef } = R;
const html = htm.bind(R.createElement);

/* ---------- Mantine design tokens (verbatim from the bound system) ---------- */
const SYS='-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
const BLUE='#228be6', BLUE7='#1c7ed6', BLUE0='#e7f5ff', BLUE1='#d0ebff', BLUE2='#a5d8ff', BLUE9='#1864ab';
const VIOLET='#7950f2', VIOLET0='#f3f0ff', VIOLET2='#d0bfff', VIOLET9='#5f3dc4';   // MAX
const TEAL='#12b886', TEAL0='#e6fcf5', TEAL2='#96f2d7', TEAL8='#099268', TEAL9='#087f5b'; // Spark
const GREEN='#2f9e44', RED='#e03131', REDF='#fa5252';
const ORANGE='#fd7e14', GRAPE='#be4bdb', CYAN='#15aabf', YELLOW='#f08c00';
const INK='#212529', TXT='#343a40', DIM='#868e96';                 // gray-9 / gray-8 / gray-6
const G0='#f8f9fa', G1='#f1f3f5', G2='#e9ecef', G3='#dee2e6', G4='#ced4da', G5='#adb5bd';
const BORDER=G3, CANVAS=G0, CARD='#ffffff';
const SH_XS='var(--mantine-shadow-xs)', SH_SM='var(--mantine-shadow-sm)', SH_MD='var(--mantine-shadow-md)', SH_LG='var(--mantine-shadow-lg)';
const cardSx={ background:CARD, border:`1px solid ${BORDER}`, borderRadius:8, boxShadow:SH_XS };

/* Mantine components (resolved at render — assigned in mount before first paint) */
let M = {};

/* ---------- lightweight layout primitives (MUI-compatible props), rendered on the DC's React ---------- */
const SP={p:['padding'],px:['paddingLeft','paddingRight'],py:['paddingTop','paddingBottom'],pt:['paddingTop'],pb:['paddingBottom'],pl:['paddingLeft'],pr:['paddingRight'],m:['margin'],mx:['marginLeft','marginRight'],my:['marginTop','marginBottom'],mt:['marginTop'],mb:['marginBottom'],ml:['marginLeft'],mr:['marginRight'],gap:['gap'],rowGap:['rowGap'],columnGap:['columnGap']};
function rv(v){ if(v&&typeof v==='object'&&!Array.isArray(v)&&('xs'in v||'sm'in v||'md'in v||'lg'in v||'xl'in v)) return v.md??v.sm??v.xs??v.lg??v.xl; return v; }
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
const TYP={h3:{fontSize:34,fontWeight:700,lineHeight:1.3},h4:{fontSize:28,fontWeight:700,lineHeight:1.35},h5:{fontSize:20,fontWeight:700,lineHeight:1.5},h6:{fontSize:18,fontWeight:700,lineHeight:1.45},subtitle1:{fontSize:16,fontWeight:600},subtitle2:{fontSize:14,fontWeight:700},body2:{fontSize:14,fontWeight:400}};
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
  return html`<div style=${{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:1500,background:'#343a40',color:'#fff',padding:'10px 16px',borderRadius:8,fontSize:14,fontWeight:600,boxShadow:SH_LG}}>${message}</div>`;
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
function Decor({subject='generic'}){
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
  const glowTint='245,205,70';
  const gImg=(a)=>`linear-gradient(to right, rgba(${glowTint},${a}) 1px, transparent 1px), linear-gradient(to bottom, rgba(${glowTint},${a}) 1px, transparent 1px)`;
  const bandMask=(R,i,p)=>`radial-gradient(circle ${R}px at var(--gx,-9999px) var(--gy,-9999px), transparent ${i}%, rgba(0,0,0,1) ${p}%, transparent 100%)`;
  // crisp & bright at the pointer → progressively blurrier and fainter, reaching 0 by the 100px edge
  const blurLayers=[{R:40,i:0,p:0,b:0,a:.40},{R:65,i:28,p:55,b:1.8,a:.30},{R:85,i:48,p:72,b:3.4,a:.22},{R:100,i:66,p:86,b:5,a:.15}];
  return html`<div ref=${glowRef} style=${{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
    <div style=${{position:'absolute',inset:0,background:`radial-gradient(1100px 720px at 6% -8%, rgba(253,126,20,.07), transparent 56%), radial-gradient(1000px 680px at 100% 2%, rgba(121,80,242,.08), transparent 56%), radial-gradient(820px 560px at 50% 116%, rgba(121,80,242,.045), transparent 60%), radial-gradient(640px 440px at 92% 98%, rgba(253,126,20,.05), transparent 60%), linear-gradient(125deg, rgba(255,255,255,.6) 0%, rgba(255,255,255,0) 40%)`}}/>
    <div style=${{position:'absolute',inset:0,backgroundImage:'linear-gradient(to right, rgba(33,37,41,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(33,37,41,.04) 1px, transparent 1px), radial-gradient(circle 1.4px at 0 0, rgba(130,170,235,.5), transparent 72%)',backgroundSize:'15px 15px',maskImage:'radial-gradient(circle at 50% 38%, #000, transparent 82%)',WebkitMaskImage:'radial-gradient(circle at 50% 38%, #000, transparent 82%)'}}/>
    ${blurLayers.map((L,k)=>html`<div key=${k} style=${{position:'absolute',inset:0,backgroundImage:gImg(L.a),backgroundSize:'15px 15px',filter:L.b?`blur(${L.b}px)`:'none',maskImage:bandMask(L.R,L.i,L.p),WebkitMaskImage:bandMask(L.R,L.i,L.p)}}/>`)}
    ${DECOR_SPOTS.map((sp,i)=>{ const col=subject==='generic'?(i%3===0?'34,139,230':i%3===1?'18,184,134':'121,80,242'):tint; return html`<i key=${i} class=${'ti ti-'+list[i%list.length]} style=${{position:'absolute',left:sp.l+'%',top:sp.t+'%',fontSize:sp.s,color:`rgba(${col},.14)`}}/>`; })}
  </div>`;
}
function Screen({children,sx={},decor='generic'}){
  return html`<${Box} sx=${{position:'relative',minHeight:'100vh',background:CANVAS,color:INK,fontFamily:SYS,overflow:'hidden'}}>
    <${Decor} subject=${decor}/>
    <${Box} sx=${{position:'relative',zIndex:1,minHeight:'100vh',...sx}}>${children}<//>
  <//>`;
}

/* ---------- buddy avatar (flat brand character) ---------- */
function Buddy({who='max',size=96,mood='smile',bob=true,excited=false,style={}}){
  const isMax=who==='max', s=size;
  if(isMax) return html`<img src="max-mascot-sm.png" alt="MAX" decoding="async" style=${{width:s,height:s,objectFit:'contain',flex:'none',filter:'drop-shadow(0 6px 14px rgba(34,139,230,.28))',animation:bob?'bob 3.2s ease-in-out infinite':'none',...style}}/>`;
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
    ${['M','T','W','T','F','S','S'].map((d,i)=>html`<${Box} key=${i} sx=${{flex:1,py:.5,borderRadius:'4px',textAlign:'center',fontSize:9,fontWeight:700,
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
    <${Typography} variant="h4">Hi, we're MAX and Spark 👋<//>
    <${Typography} sx=${{color:DIM,maxWidth:340,fontSize:15}}>We'll learn together, one step at a time. First, a couple of quick questions.<//>
    <${M.Button} size="md" onClick=${next} rightSection=${html`<${Icon} n="arrow-right"/>`}>Let's go<//>
  <//>`);

  if(step===1) return Frame(html`<${Stack} spacing=${2.5}>
    <${Typography} variant="h5">Which class are you in?<//>
    <${Stack} direction="row" spacing=${1.5}>
      ${['6','7','8'].map(g=>{ const on=grade===g; return html`<${Box} key=${g} onClick=${()=>setGrade(g)} sx=${{flex:1,height:90,borderRadius:'8px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'background-color .12s, border-color .12s',
        color:on?'#fff':INK, background:on?BLUE:CARD, border:`1px solid ${on?BLUE:G4}`,'&:hover':{background:on?BLUE:G0}}}>
        <${Typography} sx=${{fontSize:30,fontWeight:700,lineHeight:1,color:'inherit'}}>${g}<//>
        <${Typography} sx=${{fontSize:11,fontWeight:600,color:'inherit',opacity:.75,mt:.4}}>Class<//>
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
          <${Typography} sx=${{fontWeight:700,fontSize:14.5}}>${b.t}<//>
          <${Stack} direction="row" spacing=${.5} alignItems="center" sx=${{mt:.3}}><${Icon} n="circle-check" size=${14} color=${TEAL8}/><${Typography} sx=${{fontSize:12,fontWeight:600,color:TEAL8}}>${b.note}<//><//>
        <//>
        ${on&&html`<${Icon} n="circle-check-filled" size=${22} color=${BLUE}/>`}
      <//>`; })}
    <${Stack} direction="row" spacing=${.6} alignItems="center" onClick=${()=>{setSnap(s=>!s);setBook(null);}} sx=${{cursor:'pointer',alignSelf:'flex-start'}}>
      <${Icon} n="camera" size=${16} color=${BLUE}/>
      <${Typography} sx=${{fontSize:13,fontWeight:600,color:BLUE7}}>Can't find it? Snap your book<//>
    <//>
    <${Collapse} in=${snap}>
      <${Box} sx=${{p:2.5,textAlign:'center',borderRadius:'8px',background:G0,border:`1px dashed ${G4}`}}>
        <${Box} sx=${{width:48,height:48,mx:'auto',mb:1,borderRadius:'8px',background:BLUE0,display:'grid',placeItems:'center',color:BLUE7}}><${Icon} n="upload" size=${24}/><//>
        <${Typography} sx=${{fontWeight:600,fontSize:13,mb:1.2,color:TXT}}>Drop a PDF or photograph the contents pages<//>
        <${LinearProgress} variant="determinate" value=${extract} sx=${{mb:.8}}/>
        <${Typography} sx=${{fontSize:12,fontWeight:600,color:DIM}}>${extract<100?`Reading your book… topics found: ${Math.round(extract/7)}`:'Done — 14 topics mapped to the knowledge graph'}<//>
      <//>
      <${Collapse} in=${extract>=100}>
        <${Box} sx=${{mt:1.2,borderRadius:'8px',overflow:'hidden',...cardSx}}>
          <${Stack} direction="row" alignItems="center" spacing=${.7} sx=${{px:1.4,pt:1.4,pb:1}}>
            <${Icon} n="list-check" size=${15} color=${TEAL8}/>
            <${Eyebrow}>Identified topics<//>
            <${Box} sx=${{flex:1}}/>
            <${Typography} sx=${{fontSize:10.5,fontWeight:600,color:DIM}}>scroll<//>
          <//>
          <${Box} sx=${{maxHeight:150,overflowY:'auto',display:'flex',flexDirection:'column',gap:.5,px:1.4,pb:1.4}}>
            ${TOPICS.map((t,i)=>{ const hot=t.startsWith('Fractions'); return html`<${Stack} key=${t} direction="row" alignItems="center" spacing=${1} sx=${{px:1,py:.8,borderRadius:'6px',background:hot?BLUE0:G0}}>
              <${Box} sx=${{width:22,height:22,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',fontSize:10,fontWeight:700,color:'#fff',background:hot?BLUE:G5}}>${i+1}<//>
              <${Typography} sx=${{flex:1,fontSize:12.5,fontWeight:hot?700:500,color:INK}}>${t}<//>
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
      <${Typography} sx=${{fontWeight:600,color:BLUE9,lineHeight:1.6,textAlign:'center'}}>Class ${grade} · CBSE · ${book==='rds'?'R.D. Sharma':'NCERT Maths'}<br/>Starting with <${Box} component="span" sx=${{fontWeight:700}}>Fractions<//> first.<//>
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
    if(withSpark) steps.push({who:'spark',text:SPARK_LINES[Math.floor(Math.random()*SPARK_LINES.length)]});
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
  const rootSx=embedded?{position:'relative',width:'100%',height:'100%',minWidth:0,background:CARD,display:'flex',flexDirection:'column',overflow:'hidden'}:{position:'fixed',right:0,top:0,height:'100vh',width:panelW,zIndex:25,background:CARD,borderLeft:`1px solid ${BORDER}`,display:{xs:'none',md:'flex'},flexDirection:'column',boxShadow:'-10px 0 34px rgba(33,37,41,.045)',transition:'box-shadow .3s ease'};
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
  const rdur=hov?4.76:7.14;
  const ring=(idx,icons)=>html`<${Box} sx=${{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:48,height:48,animation:`expand ${rdur}s ${idx*rdur/3}s ease-out infinite`}}>
    <${Box} sx=${{position:'absolute',inset:0,borderRadius:'50%',background:'linear-gradient(135deg, #1c7ed6 0%, #74c0fc 52%, #ffffff 100%)',padding:'2px',WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude'}}/>
    ${icons.map((ic,k)=>{ const a=(k/icons.length)*Math.PI*2 - Math.PI/2; const cx=50+50*Math.cos(a), cy=50+50*Math.sin(a); return html`<span key=${k} style=${{position:'absolute',left:cx+'%',top:cy+'%',transform:'translate(-50%,-50%)',width:24,height:24,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center',boxShadow:'0 1px 6px rgba(28,126,214,.32)',zIndex:2}}><i class=${'ti ti-'+ic} style=${{fontSize:15,color:'#1c7ed6',WebkitTextStroke:'0.6px #1c7ed6'}}/></span>`; })}
  <//>`;
  return html`<${Box} ref=${panelRef} onMouseEnter=${()=>setHovBoth(true)} onMouseLeave=${()=>setHovBoth(false)} onMouseMove=${onMove} sx=${rootSx}>
    ${(started&&!embedded)?html`<${Box} sx=${{position:'fixed',inset:0,zIndex:-1,background:CANVAS,pointerEvents:'none'}}/>`:''}
    <${Box} sx=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',opacity:(hov&&!started)?1:0,transition:'opacity .5s ease',animation:(hov&&!started)?'panelbreathe 2.4s ease-in-out infinite':'none',
      background:'radial-gradient(125% 70% at 50% 36%, rgba(121,80,242,.13), rgba(34,139,230,.08) 42%, rgba(121,80,242,0) 74%)'}}/>
    <${Box} sx=${{position:'absolute',inset:0,zIndex:5,padding:'1.5px',pointerEvents:'none',opacity:(hov&&(embedded||!started))?1:0,transition:'opacity .25s ease',
      background:'radial-gradient(150px circle at var(--mx,-300px) var(--my,-300px), rgba(34,139,230,.7), rgba(34,139,230,0) 62%)',
      WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude'}}/>
    <${Box} sx=${{position:'relative',zIndex:1,p:2.2,flex:'none',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:1.4}}>
      ${withSpark?html`<${Box} sx=${{flexShrink:0,display:'flex',alignItems:'flex-end'}}>
        <${Buddy} who="max" size=${40} bob=${false} style=${{flexShrink:0,transformOrigin:'bottom center',transform:'rotate(8deg)'}}/>
        <${Buddy} who="spark" size=${34} bob=${false} style=${{flexShrink:0,marginLeft:-11,animation:'none',transformOrigin:'bottom center',transform:'scaleX(-1) rotate(8deg)'}}/>
      <//>`:(started?html`<${Buddy} who="max" size=${42} bob=${false} style=${{flexShrink:0}}/>`:'')}
      <${Box} sx=${{flex:1,minWidth:0}}>
        <${Eyebrow} color=${BLUE7}>${withSpark?'In-class chat':'Ask MAX'}<//>
        <${Typography} sx=${{fontSize:15,fontWeight:700,mt:.2}}>${withSpark?'MAX & Spark are here with you':'Your AI tutor'}<//>
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
      <${Typography} sx=${{position:'absolute',bottom:24,left:0,right:0,px:3,fontSize:13,fontWeight:600,color:hov?BLUE7:DIM,transition:'color .3s',textAlign:'center'}}>${hov?"Yes! Let's solve something together.":'Hi! Ask me anything about your lesson.'}<//>
    <//>
    <${Box} ref=${scrollRef} sx=${{display:started?'flex':'none',flexDirection:'column',gap:1.6,flex:1,minHeight:0,overflowY:'auto',position:'relative',zIndex:1,px:3,py:3,alignItems:'stretch'}}>
      <${Box} sx=${{width:'100%',maxWidth:720,mx:'auto',display:'flex',flexDirection:'column',gap:1.6}}>
        ${messages.map(m=> m.kind==='sparksum'
          ? html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start',width:'100%',maxWidth:560}}>
              <${Box} sx=${{flexShrink:0,pt:.4}}><${Buddy} who="spark" size=${m.id===lastMaxId?44:28} bob=${false}/><//>
              <${Box} sx=${{flex:1,minWidth:0,position:'relative',borderRadius:'4px 16px 16px 16px',background:'#fffdf2',border:'1px solid #efe2b0',boxShadow:SH_SM,overflow:'hidden'}}>
                <${Box} sx=${{px:2,pt:1.6,pb:1.6}}>
                  <${Box} sx=${{display:'inline-flex',alignItems:'center',gap:.6,color:TEAL9,fontSize:10,fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',mb:.8}}><${Icon} n="sparkles" size=${13}/> Spark side-quest · compressed<//>
                  <${Box} sx=${{fontSize:14.5,fontWeight:800,color:INK,mb:.5}}>${m.title}<//>
                  <${Box} sx=${{fontSize:13.5,color:TXT,lineHeight:1.55}}>${m.text}<//>
                  <${Box} onClick=${()=>onExpandSpark&&onExpandSpark()} sx=${{mt:1.4,display:'inline-flex',alignItems:'center',gap:.6,cursor:'pointer',px:1.6,py:.9,borderRadius:10,border:`1px solid ${TEAL2}`,background:TEAL0,color:TEAL9,fontSize:12.5,fontWeight:700,transition:'.15s','&:hover':{background:'#c3fae8'}}}><${Icon} n="arrows-maximize" size=${15}/> Expand conversation<//>
                <//>
              <//>
            <//>`
          : m.role==='student'
          ? html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.2} alignItems="flex-start" justifyContent="flex-end" sx=${{alignSelf:'flex-end',maxWidth:'82%'}}>
              <${Box} sx=${{background:BLUE,color:'#fff',borderRadius:'16px 16px 4px 16px',px:2,py:1.3,fontSize:14.5,fontWeight:500,lineHeight:1.5,boxShadow:SH_SM}}>${m.text}<//>
              <${Box} sx=${{flexShrink:0,width:36,height:36,mt:.3,borderRadius:'12px',background:BLUE,color:'#fff',display:'grid',placeItems:'center',fontSize:13,fontWeight:800,boxShadow:SH_XS}}>A<//>
            <//>`
          : m.role==='spark'
          ? html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start',maxWidth:'88%'}}>
              <${Box} sx=${{flexShrink:0,width:46,position:'relative',zIndex:3,display:'flex',flexDirection:'column',alignItems:'center',gap:.7,pt:.4}}>
                <${Box} sx=${{transformOrigin:'center',...(enterId===m.id?{animation:'sparkpop 1.5s cubic-bezier(.2,.7,.3,1) both'}:{transform:emphId===m.id?'scale(1.75)':'scale(1)',transition:'transform .32s cubic-bezier(.2,.7,.3,1)'})}}><${Buddy} who="spark" size=${m.id===lastMaxId?40:26} bob=${readingId===m.id}/><//>
                ${readingId===m.id?html`<div style=${{display:'flex',alignItems:'center',gap:2.5,padding:'4px 8px',borderRadius:999,background:'#f59f0a',boxShadow:'0 2px 6px rgba(240,140,0,.3)',height:18,marginTop:6}}>${[0,1,2,3,4].map(i=>html`<span key=${i} style=${{width:2.5,height:'100%',borderRadius:999,background:'#fff',transformOrigin:'center',animation:`siri 1s ${i*0.12}s ease-in-out infinite`}}/>`)}</div>`:''}
              <//>
              <${Box} sx=${{position:'relative',zIndex:1,minWidth:0,overflow:'hidden',pl:'16px',pb:'16px'}}>
                <div style=${{animation:enterId===m.id?'sparkslide 1.5s cubic-bezier(.2,.8,.3,1) both':'none'}}>
                <${Box} sx=${{background:'#FFF7E6',border:'1px solid rgba(240,140,0,.42)',borderRadius:'4px 16px 16px 16px',px:2,py:1.2,fontSize:14.5,fontWeight:500,color:'#8a5300',lineHeight:1.5,boxShadow:'0 3px 12px rgba(240,140,0,.18)'}}>
                  <${Eyebrow} color="#e8830f">Spark ⚡<//>
                  <${Box} sx=${{mt:.3}}>${m.text}<//>
                  <${Box} onClick=${()=>readOut(m)} sx=${{mt:1.2,display:'inline-flex',alignItems:'center',gap:.5,cursor:'pointer',color:readingId===m.id?'#c2710c':'#b8893a',fontSize:11.5,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',transition:'.15s','&:hover':{color:'#e8830f'}}}><${Icon} n=${readingId===m.id?'player-stop-filled':'volume'} size=${15}/> ${readingId===m.id?'Stop':'Listen'}<//>
                <//>
              </div>
              <//>
            <//>`
          : html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start',maxWidth:'88%'}}>
              <${Box} sx=${{flexShrink:0,width:46,display:'flex',flexDirection:'column',alignItems:'center',gap:.7,pt:.4}}>
                <${Box} sx=${{transformOrigin:'center',transform:emphId===m.id?'scale(1.75)':'scale(1)',transition:'transform .32s cubic-bezier(.2,.7,.3,1)'}}><${Buddy} who="max" size=${m.id===lastMaxId?40:26} bob=${readingId===m.id}/><//>
                ${readingId===m.id?html`<div style=${{display:'flex',alignItems:'center',gap:2.5,padding:'4px 8px',borderRadius:999,background:BLUE,boxShadow:'0 2px 6px rgba(33,37,41,.14)',height:18,marginTop:6}}>${[0,1,2,3,4].map(i=>html`<span key=${i} style=${{width:2.5,height:'100%',borderRadius:999,background:'#fff',transformOrigin:'center',animation:`siri 1s ${i*0.12}s ease-in-out infinite`}}/>`)}</div>`:''}
              <//>
              <${Box} sx=${{position:'relative',background:CARD,border:`1px solid ${BORDER}`,borderRadius:'4px 16px 16px 16px',px:2,py:1.3,fontSize:14.5,fontWeight:500,color:INK,boxShadow:SH_XS,lineHeight:1.55}}>
                ${m.explain?html`<${Box} sx=${{position:'absolute',inset:0,borderRadius:'4px 16px 16px 16px',padding:'1px',pointerEvents:'none',background:`radial-gradient(circle 100px at 0% 0%, ${ORANGE} 0%, ${ORANGE} 16%, rgba(253,126,20,0) 100%), radial-gradient(circle 50px at 100% 100%, ${ORANGE} 0%, ${ORANGE} 18%, rgba(253,126,20,0) 100%)`,WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude'}}/>`:''}
                ${m.text}
                <${Box} onClick=${()=>readOut(m)} sx=${{mt:1.2,display:'inline-flex',alignItems:'center',gap:.5,cursor:'pointer',color:readingId===m.id?BLUE7:DIM,fontSize:11.5,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',transition:'.15s','&:hover':{color:BLUE}}}><${Icon} n=${readingId===m.id?'player-stop-filled':'volume'} size=${15}/> ${readingId===m.id?'Stop':'Listen'}<//>
                ${m.prompt?html`<${Box} sx=${{mt:1.4}}><${RippleHover} onClick=${onSend} radius="12px" sx=${{px:2.2,py:1.1,placeItems:'center',cursor:'pointer',color:'#fff',background:BLUE,boxShadow:SH_SM,'&:hover':{background:BLUE7}}}><${Box} sx=${{display:'flex',alignItems:'center',gap:.7,fontSize:14,fontWeight:700}}>Start the class <${Icon} n="arrow-right" size=${17}/><//><//><//>`:''}
              <//>
            <//>`)}
        ${thinking?html`<${Stack} direction="row" spacing=${1.3} alignItems="flex-start" sx=${{alignSelf:'flex-start'}}>
          <${Box} sx=${{flexShrink:0,width:42,display:'flex',flexDirection:'column',alignItems:'center',gap:.7,pt:.2}}>
            <${Buddy} who=${thinking==='spark'?'spark':'max'} size=${36} bob=${true}/>
            <div style=${{display:'flex',gap:4,padding:'6px 9px',borderRadius:999,background:thinking==='spark'?'#f59f0a':BLUE,boxShadow:'0 2px 6px rgba(33,37,41,.14)'}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:'#fff',animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</div>
          <//>
        <//>`:''}
      <//>
    <//>
    <${Box} sx=${{position:'relative',zIndex:1,p:1.6,flex:'none',borderTop:`1px solid ${BORDER}`}}>
      <${Box} sx=${{position:'absolute',left:0,right:0,bottom:0,height:300,pointerEvents:'none',zIndex:0,background:'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(34,139,230,.20) 0%, rgba(120,170,230,.13) 24%, rgba(173,181,189,.10) 48%, rgba(255,255,255,0) 78%)'}}/>
      <${Box} sx=${{position:'relative',zIndex:1,width:'100%',maxWidth:started?720:'none',mx:'auto'}}>
      <${Box} onMouseEnter=${()=>setInHov(true)} onMouseLeave=${()=>setInHov(false)} sx=${{position:'relative',overflow:'hidden',borderRadius:'16px',
        border:`1px solid ${recording?'transparent':(inActive?BLUE2:BORDER)}`,
        boxShadow:recording?'0 8px 22px rgba(33,37,41,.16)':(inActive?`0 0 0 3px ${BLUE}1f, 0 0 18px ${BLUE}33`:'none'),
        background:recording?'linear-gradient(120deg, #228be6 0%, #7950f2 100%)':CARD,
        minHeight:recording?90:(chatFocus?141:(inHov?96:78)),
        transform:(inHov&&!recording)?'translateY(-2px)':'none',
        transition:'min-height .28s cubic-bezier(.2,.7,.3,1), box-shadow .3s ease, border-color .3s ease, background .3s ease, transform .25s ease',
        display:'flex',alignItems:'center',px:1.4}}>
        ${recording?html`
          <${Box} onClick=${()=>setRecording(false)} sx=${{width:38,height:38,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:'rgba(255,255,255,.22)',boxShadow:'0 0 0 4px rgba(255,255,255,.14)',animation:'pulsemic 1.4s ease-in-out infinite'}}><${Icon} n="microphone" size=${19}/><//>
          <${VoiceWave}/>
          <${Box} onClick=${()=>setRecording(false)} sx=${{width:34,height:34,flex:'none',borderRadius:'8px',display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:'rgba(255,255,255,.2)','&:hover':{background:'rgba(255,255,255,.34)'}}}><${Icon} n="player-stop-filled" size=${16}/><//>
        `:html`
          <${Stack} direction="row" alignItems="center" spacing=${.5} sx=${{flex:1,minWidth:0}}>
            ${iconBtn('paperclip')}
            <input value=${chatText} onChange=${e=>setChatText(e.target.value)} onFocus=${()=>setChatFocus(true)} onBlur=${()=>setChatFocus(false)}
              onKeyDown=${e=>{ if(e.key==='Enter') submit(); }} placeholder=${started?'Reply to MAX…':'Ask me anything…'}
              style=${{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',fontFamily:SYS,fontSize:14,fontWeight:500,color:INK,caretColor:BLUE}}/>
            <${Box} onClick=${()=>setRecording(true)} sx=${{width:36,height:36,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.18s','&:hover':{background:G0,color:BLUE}}}><${Icon} n="microphone" size=${19}/><//>
            <${RippleHover} onClick=${submit} radius="10px" sx=${{width:38,height:38,placeItems:'center',cursor:'pointer',color:'#fff',background:BLUE,boxShadow:SH_SM,transition:'.2s','&:hover':{background:BLUE7}}}>
              <${Box} sx=${{width:'100%',height:'100%',display:'grid',placeItems:'center'}}><${Icon} n="send" size=${18}/><//>
            <//>
          <//>
        `}
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
  const onEnter=(e)=>{ const el=ref.current; if(!el) return; const r=el.getBoundingClientRect(); setRip({x:e.clientX-r.left,y:e.clientY-r.top,key:Date.now()}); };
  return html`<${Box} ref=${ref} onClick=${onClick} onMouseEnter=${onEnter} sx=${{position:'relative',overflow:'hidden',borderRadius:radius,display:'inline-flex',...sx}}>
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
        <${Typography} noWrap sx=${{fontWeight:700,fontSize:18,maxWidth:navOpen?150:0,opacity:navOpen?1:0,overflow:'hidden',transition:'.22s'}}>Byjus.AI<//>
      <//>
      <${Box} sx=${{height:'1px',background:BORDER,mx:.4,mt:.2,mb:1}}/>
      ${NAV.map(navItem)}
      <${Box} sx=${{mt:'auto'}}/>
      <${Box} onClick=${e=>setMenuEl(e.currentTarget)} sx=${{display:'flex',alignItems:'center',justifyContent:navOpen?'flex-start':'center',gap:navOpen?1.2:0,height:52,borderRadius:'8px',cursor:'pointer','&:hover':{background:G0}}}>
        <${Box} sx=${{flexShrink:0,width:38,height:38,borderRadius:'12px',background:BLUE,color:'#fff',display:'grid',placeItems:'center',fontSize:14,fontWeight:800}}>A<//>
        <${Box} sx=${{minWidth:0,maxWidth:navOpen?150:0,opacity:navOpen?1:0,overflow:'hidden',transition:'.22s'}}>
          <${Typography} noWrap sx=${{fontWeight:700,fontSize:14,lineHeight:1.15}}>Aarav<//>
          <${Typography} noWrap sx=${{fontSize:11,color:DIM,fontWeight:500}}>Class 7 · CBSE<//>
        <//>
      <//>
      <${Menu} anchorEl=${menuEl} open=${!!menuEl} onClose=${()=>setMenuEl(null)}>
        <${MenuItem} onClick=${()=>{setMenuEl(null);onRestart();}} sx=${{fontWeight:600,fontSize:14,gap:1}}><${Icon} n="refresh" size=${17}/> Restart demo<//>
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
            <${Typography} sx=${{fontSize:28,fontWeight:700,lineHeight:1}}>${s.v}<//>
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
                <${Typography} sx=${{fontSize:13.5,fontWeight:500,flex:1}}>${g.t}<//>
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
                <${Typography} sx=${{fontSize:14,fontWeight:600,flex:1,color:c.lock?DIM:INK}}>${c.t}<//>
                ${c.s&&html`<${Typography} sx=${{fontSize:11,fontWeight:600,color:c.hot?BLUE7:DIM}}>${c.s}<//>`}
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
  {k:'doubt',i:'help-hexagon',c:VIOLET,bg:VIOLET0,t:'I have a doubt',s:'Ask MAX anything'},
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
const JUMP=[
  {k:'calendar',i:'calendar-month',t:'Calendar'},
  {k:'courses',i:'books',t:'My Courses'},
  {k:'assignments',i:'clipboard-list',t:'Assignments'},
  {k:'stats',i:'chart-histogram',t:'My stats'},
  {k:'profile',i:'user-circle',t:'Profile'},
];
const GOALS2=[
  {i:'trophy',c:TEAL,cl:'teal',t:'Score 90%+ in the year-end exam',s:'Long-term'},
  {i:'clipboard-check',c:BLUE,cl:'blue',t:'Ace the Fractions unit test',s:'in 9 days'},
  {i:'checkbox',c:ORANGE,cl:'orange',t:'Finish adding unlike fractions',s:'today'},
];
const CHAPTERS=[
  {t:'Integers',sub:'Operations & number rules',p:30,status:'now'},
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',p:55,status:'now'},
  {t:'Data Handling',sub:'Mean, median & mode',p:0,status:'planned'},
  {t:'Simple Equations',sub:'Solving for x',p:0,status:'planned'},
];
const RESUME_CLASSES=[
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',p:55,c:BLUE,bg:BLUE0,icon:'math-symbols'},
  {t:'Integers',sub:'Multiplication & division',p:30,c:VIOLET,bg:VIOLET0,icon:'divide'},
];
const JOURNEY=[
  {t:'Whole Numbers',sub:'Place value & operations',status:'done'},
  {t:'Integers',sub:'Operations & number rules',status:'now',p:30},
  {t:'Fractions & Decimals',sub:'Adding unlike denominators',status:'prog',p:55},
  {t:'Data Handling',sub:'Mean, median & mode',status:'locked'},
  {t:'Simple Equations',sub:'Solving for x',status:'locked'},
  {t:'Lines & Angles',sub:'Shapes & properties',status:'locked'},
];
const STREAK_WEEK=[{d:'Mo',s:'done'},{d:'Tu',s:'done'},{d:'We',s:'done'},{d:'Th',s:'active'},{d:'Fr',s:'next'},{d:'Sa',s:'future'},{d:'Su',s:'future'}];
const SHIELD='polygon(50% 0, 100% 12%, 100% 58%, 50% 100%, 0 58%, 0 12%)';

function HomeChat({onResume,full,onExpand,onClose}){
  const [text,setText]=useState('');
  const [focus,setFocus]=useState(false);
  const [inHov,setInHov]=useState(false);
  const [messages,setMessages]=useState([]);
  const [thinking,setThinking]=useState(false);
  const [stage,setStage]=useState('idle');    // idle | explaining | asking | understood | wrap
  const [vis,setVis]=useState('closed');       // closed | concept | transcript
  const [step,setStep]=useState(0);
  const [transcript,setTranscript]=useState([]);
  const [histCol,setHistCol]=useState(false);
  const [histSort,setHistSort]=useState('recent');
  const [dust,setDust]=useState(false);
  const [comp,setComp]=useState(null);
  useEffect(()=>{ if(full){ setDust(true); const t=setTimeout(()=>setDust(false),1300); return ()=>clearTimeout(t); } },[full]);
  const started=messages.length>0;
  const active=focus||inHov;
  const idRef=useRef(0); const seqRef=useRef([]); const scrollRef=useRef(null);
  const clearT=()=>{ seqRef.current.forEach(clearTimeout); seqRef.current=[]; };
  const push=(m)=>setMessages(x=>[...x,{id:++idRef.current,...m}]);
  useEffect(()=>()=>clearT(),[]);
  useEffect(()=>{ const el=scrollRef.current; if(el) el.scrollTop=el.scrollHeight; },[messages,thinking,stage]);

  const startFrac=(q)=>{
    clearT();
    setStage('explaining'); setHistCol(true); setVis('closed'); setStep(0);
    setMessages([{id:++idRef.current,role:'student',text:(typeof q==='string'&&q)?q:FRAC_DOUBT_DEFAULT,concept:'frac'}]);
    setThinking(true);
    seqRef.current.push(setTimeout(()=>{ setThinking(false); push({role:'max',explain:true,concept:'frac'}); },1700));
    seqRef.current.push(setTimeout(()=>setStep(1),2100));
    seqRef.current.push(setTimeout(()=>setStep(2),2900));
    seqRef.current.push(setTimeout(()=>setStep(3),3700));
    seqRef.current.push(setTimeout(()=>{ push({role:'max',text:FRAC_ASK_TEXT,ask:true,concept:'frac'}); setStage('asking'); },4500));
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
  const submit=()=>{ const t=text.trim(); if(!t) return; setText(''); if(!full){ onExpand&&onExpand(); startFrac(t); return; } if(vis==='transcript'){ setTranscript(x=>[...x,{id:++idRef.current,role:'student',text:t}]); seqRef.current.push(setTimeout(()=>setTranscript(x=>[...x,{id:++idRef.current,role:'max',text:FRAC_FOLLOWUP_A}]),900)); return; } if(stage==='asking') answer('doubt',t); else startFrac(t); };
  const preset=(p,e)=>{ e&&e.stopPropagation&&e.stopPropagation(); if(!full) onExpand&&onExpand(); startFrac(); };
  const iconBtn=(n,onClick,title)=>html`<${Box} onClick=${onClick} title=${title} sx=${{width:36,height:36,flex:'none',borderRadius:'8px',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.15s','&:hover':{background:G0,color:INK}}}><${Icon} n=${n} size=${19}/><//>`;

  const rdur=6.5;
  const ring=(idx,icons)=>html`<${Box} sx=${{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:48,height:48,animation:`expand ${rdur}s ${idx*rdur/3}s ease-out infinite`}}>
    <${Box} sx=${{position:'absolute',inset:0,borderRadius:'50%',background:'linear-gradient(135deg, #1c7ed6 0%, #74c0fc 52%, #ffffff 100%)',padding:'2px',WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude'}}/>
    ${icons.map((ic,k)=>{ const a=(k/icons.length)*Math.PI*2 - Math.PI/2; const cx=50+50*Math.cos(a), cy=50+50*Math.sin(a); return html`<span key=${k} style=${{position:'absolute',left:cx+'%',top:cy+'%',transform:'translate(-50%,-50%)',width:24,height:24,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center',boxShadow:'0 1px 6px rgba(28,126,214,.32)',zIndex:2}}><i class=${'ti ti-'+ic} style=${{fontSize:15,color:'#1c7ed6',WebkitTextStroke:'0.6px #1c7ed6'}}/></span>`; })}
  <//>`;

  const heroBlock=html`<${Box} sx=${{flex:1,minHeight:0,overflowY:'auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',px:3,pt:3,pb:11}}>
    <${Box} sx=${{position:'relative',display:'grid',placeItems:'center',mb:2}}>
      <${Box} sx=${{position:'absolute',width:240,height:240,borderRadius:'50%',background:'radial-gradient(circle at 50% 45%, rgba(121,80,242,.14), rgba(34,139,230,.08) 46%, rgba(121,80,242,0) 72%)',animation:'panelbreathe 3.4s ease-in-out infinite'}}/>
      <${Box} sx=${{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:440,height:440,pointerEvents:'none',WebkitMaskImage:'linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,.55) 60%, transparent 74%)',maskImage:'linear-gradient(to bottom, #000 0%, #000 46%, rgba(0,0,0,.55) 60%, transparent 74%)'}}>
        <${Box} sx=${{position:'absolute',left:'50%',top:'50%',width:0,height:0}}>
          ${ring(0,['plus','divide','percentage'])}${ring(1,['math-function','math-pi','square-root-2'])}${ring(2,['atom-2','flask','calculator'])}
        <//>
      <//>
      <${Buddy} who="max" size=${112} mood="grin" style=${{position:'relative',zIndex:1}}/>
    <//>
    <${Typography} variant="h5" sx=${{fontSize:25,mt:'20px'}}>Hi Aarav! 👋<//>
    <${Typography} sx=${{color:DIM,fontSize:16,mt:.7,maxWidth:340,lineHeight:1.5}}>Pick up where you left off — or ask me anything below.<//>
    <${Box} sx=${{width:'100%',maxWidth:full?600:'none',mt:2.6,display:'flex',flexDirection:'column',gap:1.1}}>
      <${Box} sx=${{display:'flex',alignItems:'center',gap:1.2,mb:.2}}>
        <${Typography} sx=${{fontSize:11,fontWeight:800,letterSpacing:'.6px',textTransform:'uppercase',color:DIM,whiteSpace:'nowrap',flex:'none'}}>Resume a class<//>
        <${Box} sx=${{flex:1,height:'1px',background:BORDER}}/>
      <//>
      ${RESUME_CLASSES.map(r=>html`<${HoverTile} key=${r.t} onClick=${onResume} sx=${{...cardSx,p:1.3,cursor:'pointer',display:'flex',alignItems:'center',gap:1.4,textAlign:'left',borderRadius:14,transition:'border-color .16s ease, background .16s ease, box-shadow .16s ease','&:hover':{border:`1px solid ${r.c}`,background:r.bg,boxShadow:SH_SM},'&:hover .resume-go':{transform:'scale(1.08)',boxShadow:`0 6px 16px ${r.c}55`}}}>
        <${Box} sx=${{width:46,height:46,flex:'none',borderRadius:12,display:'grid',placeItems:'center',background:r.bg,color:r.c}}><${Icon} n=${r.icon} size=${23}/><//>
        <${Box} sx=${{flex:1,minWidth:0}}>
          <${Typography} noWrap sx=${{fontWeight:700,fontSize:15}}>${r.t}<//>
          <${Typography} noWrap sx=${{fontSize:12.5,color:DIM,fontWeight:500,mt:.1}}>${r.sub}<//>
          <${Box} sx=${{display:'flex',alignItems:'center',gap:1,mt:.8}}>
            <div style=${{flex:1,height:6,borderRadius:3,background:G1,overflow:'hidden'}}><div style=${{height:'100%',width:r.p+'%',background:r.c,borderRadius:3}}/></div>
            <${Typography} sx=${{fontSize:11.5,fontWeight:800,color:r.c}}>${r.p}%<//>
          <//>
        <//>
        <${Box} className="resume-go" sx=${{width:38,height:38,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',background:r.c,color:'#fff',boxShadow:`0 4px 12px ${r.c}44`,transition:'.18s ease'}}><${Icon} n="player-play-filled" size=${16}/><//>
      <//>`)}
    <//>
  <//>`;

  const wrapW=full?764:'100%';
  const rowWrap=(key,extra,children)=>html`<div key=${key} class="msg" style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',...extra}}>${children}</div>`;
  const suck=(m)=> ({});
  const speak=(t)=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(t)); u.rate=1; u.pitch=1.05; window.speechSynthesis.speak(u); }catch(e){} };
  const listenBtn=(t,dark)=>html`<${Box} onClick=${()=>speak(t)} sx=${{marginTop:9,display:'inline-flex',alignItems:'center',gap:5,cursor:'pointer',fontSize:10.5,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',color:DIM,transition:'.15s','&:hover':{color:BLUE7}}}><i class="ti ti-volume" style=${{fontSize:14}}/>Listen<//>`;
  const maxRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start',...suck(m)},html`<${R.Fragment}>
    <${Buddy} who="max" size=${38} bob=${false} style=${{flexShrink:0,marginTop:2}}/>
    <div style=${{flex:1,minWidth:0,maxWidth:m.visual?460:'none'}}>
      <div style=${{fontSize:10,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:4}}>MAX</div>
      <div style=${{background:m.featured?BLUE0:'#fff',border:`1px solid ${m.featured?BLUE2:BORDER}`,borderRadius:'4px 15px 15px 15px',padding:'12px 15px',fontSize:15,lineHeight:1.55,color:INK,boxShadow:SH_XS,whiteSpace:'pre-wrap'}}>
        ${m.featured?html`<div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:7,color:BLUE7,fontSize:10,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i class="ti ti-sparkles" style=${{fontSize:13}}/>Key idea</div>`:''}
        <div>${m.text}</div>
        ${m.visual?html`<div style=${{marginTop:12,paddingTop:12,borderTop:`1px solid ${m.featured?BLUE2:BORDER}`}}>
          <${FractionVisual} step=${step}/>
          <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:14}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
        </div>`:''}
        ${listenBtn(m.text)}
      </div>
    </div>
  <//>`);
  const studentRow=(m)=>rowWrap(m.id,{display:'flex',justifyContent:'flex-end',gap:10,...suck(m)},html`<${R.Fragment}>
    <div style=${{maxWidth:'80%',background:BLUE,color:'#fff',borderRadius:'15px 15px 4px 15px',padding:'11px 15px',fontSize:15,fontWeight:500,lineHeight:1.5,boxShadow:SH_XS}}>${m.text}</div>
    <div style=${{width:34,height:34,flex:'none',marginTop:2,borderRadius:10,overflow:'hidden',border:`1px solid ${BORDER}`}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>
  <//>`);
  const summaryRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start'},html`<${R.Fragment}>
    <${Buddy} who="max" size=${38} bob=${false} style=${{flexShrink:0,marginTop:2}}/>
    <div style=${{flex:1,minWidth:0}}>
      <div style=${{fontSize:10,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:4}}>MAX · SUMMARY</div>
      <div style=${{position:'relative',background:'#fffdf2',border:`1px solid #efe2b0`,borderRadius:'4px 15px 15px 15px',padding:'13px 15px',boxShadow:SH_SM,overflow:'hidden',animation:'capsulepop .55s cubic-bezier(.2,1.2,.4,1) both'}}>
        <div style=${{position:'absolute',inset:0,borderRadius:'inherit',padding:'2px',pointerEvents:'none',background:'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, #ffd43b 340deg, #ffffff 355deg, #ffd43b 360deg)',WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',maskComposite:'exclude',animation:'rimspin 1.1s linear 1 both'}}/>
        ${[{x:12,y:20,s:12,d:.7,dl:.1},{x:86,y:16,s:10,d:.8,dl:.25},{x:70,y:66,s:13,d:.7,dl:.15},{x:26,y:74,s:10,d:.9,dl:.35},{x:50,y:12,s:9,d:.75,dl:.45}].map((sp,i)=>html`<i key=${i} class="ti ti-sparkles" style=${{position:'absolute',left:sp.x+'%',top:sp.y+'%',fontSize:sp.s,color:i%2?'#f59f00':'#ffc933',pointerEvents:'none',filter:'drop-shadow(0 0 4px rgba(245,159,0,.5))',animation:`dusttw ${sp.d}s ${sp.dl}s ease-in-out both`}}/>`)}
        <div style=${{position:'relative',zIndex:1}}>
          <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:8,color:TEAL9,fontSize:10,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i class="ti ti-circle-check" style=${{fontSize:13}}/>Concept cleared · Adding unlike fractions</div>
          <div style=${{fontSize:14,lineHeight:1.55,color:INK}}>${SUMMARY_TEXT}</div>
          <${FracMini}/>
          <${Box} onClick=${()=>setVis(v=>v==='transcript'?'closed':'transcript')} sx=${{marginTop:11,display:'inline-flex',alignItems:'center',gap:6,cursor:'pointer',fontSize:12.5,fontWeight:700,color:BLUE7,'&:hover':{color:BLUE9}}}><i class=${'ti '+(vis==='transcript'?'ti-arrows-diagonal-minimize-2':'ti-arrows-diagonal')} style=${{fontSize:15}}/>${vis==='transcript'?'Hide full explanation':'Expand full explanation'}<//>
          ${listenBtn(SUMMARY_TEXT)}
        </div>
      </div>
    </div>
  <//>`);
  const bubble=(m)=> m.summary?summaryRow(m) : m.explain?explainRow(m) : m.role==='student'?studentRow(m) : maxRow(m);
  const explainRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start'},html`<${R.Fragment}>
    <${Buddy} who="max" size=${38} bob=${false} style=${{flexShrink:0,marginTop:2}}/>
    <div style=${{flex:1,minWidth:0}}>
      <div style=${{fontSize:10,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:4}}>MAX</div>
      <div style=${{background:'#fff',border:`1px solid ${BORDER}`,borderRadius:'4px 15px 15px 15px',padding:'14px 16px',boxShadow:SH_XS}}>
        <div style=${{fontSize:15,lineHeight:1.55,color:INK}}>${FRAC_INTRO}</div>
        <div style=${{marginTop:12,background:BLUE0,border:`1px solid ${BLUE2}`,borderRadius:12,padding:'12px 14px'}}>
          <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:6,color:BLUE7,fontSize:10,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i class="ti ti-sparkles" style=${{fontSize:13}}/>Key idea<//>
          <div style=${{fontSize:14.5,lineHeight:1.55,color:INK,fontWeight:600}}>${FRAC_KEY}</div>
          <div style=${{marginTop:12,paddingTop:12,borderTop:`1px solid ${BLUE2}`}}>
            <${FractionVisual} step=${step}/>
            <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:14}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
          </div>
        </div>
        ${listenBtn(FRAC_INTRO+' '+FRAC_KEY)}
      </div>
    </div>
  <//>`);
  const visualRow=(m)=>rowWrap(m.id,{display:'flex',gap:11,alignItems:'flex-start',...suck(m)},html`<${R.Fragment}>
    <${Buddy} who="max" size=${38} bob=${false} style=${{flexShrink:0,marginTop:2}}/>
    <div style=${{flex:1,minWidth:0,maxWidth:430}}>
      <div style=${{fontSize:10,fontWeight:700,letterSpacing:'.5px',color:VIOLET9,marginBottom:4}}>MAX · VISUAL AID</div>
      <div style=${{background:'#fff',border:`1px solid ${BORDER}`,borderRadius:'4px 15px 15px 15px',padding:'14px 15px',boxShadow:SH_XS}}>
        <${FractionVisual} step=${step}/>
        <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:14}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
      </div>
    </div>
  <//>`);

  const typingRow=html`<div class="msg" style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',display:'flex',gap:11,alignItems:'center'}}>
    <${Buddy} who="max" size=${38} bob=${true} style=${{flexShrink:0}}/>
    <div style=${{display:'flex',gap:4,padding:'10px 12px',borderRadius:999,background:'#fff',border:`1px solid ${BORDER}`,boxShadow:SH_XS}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:VIOLET,animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</div>
  </div>`;
  const askChips=html`<div style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',display:'flex',gap:10,paddingLeft:49,flexWrap:'wrap'}}>
    <${RippleHover} onClick=${()=>answer('got')} radius="10px" sx=${{px:1.9,py:1.05,cursor:'pointer',color:'#fff',background:TEAL8,fontSize:13.5,fontWeight:700,boxShadow:SH_XS,display:'flex',alignItems:'center',gap:7,'&:hover':{background:TEAL9}}}><i class="ti ti-thumb-up" style=${{fontSize:16}}/>I've got it<//>
    <${RippleHover} onClick=${()=>answer('doubt')} radius="10px" sx=${{px:1.9,py:1.05,cursor:'pointer',color:INK,background:'#fff',border:`1px solid ${BORDER}`,fontSize:13.5,fontWeight:700,display:'flex',alignItems:'center',gap:7,'&:hover':{borderColor:BLUE2,background:BLUE0}}}><i class="ti ti-help-circle" style=${{fontSize:16,color:BLUE}}/>I still have a doubt<//>
  </div>`;
  const wrapOpts=html`<div style=${{width:'100%',maxWidth:wrapW,alignSelf:'center',display:'flex',gap:10,paddingLeft:49,flexWrap:'wrap'}}>
    <${RippleHover} onClick=${onResume} radius="10px" sx=${{px:2,py:1.1,cursor:'pointer',color:'#fff',background:BLUE,fontSize:14,fontWeight:700,boxShadow:SH_SM,display:'flex',alignItems:'center',gap:7,'&:hover':{background:BLUE7}}}><i class="ti ti-player-play-filled" style=${{fontSize:15}}/>Start the class<//>
    <${RippleHover} onClick=${reset} radius="10px" sx=${{px:2,py:1.1,cursor:'pointer',color:INK,background:'#fff',border:`1px solid ${BORDER}`,fontSize:14,fontWeight:700,display:'flex',alignItems:'center',gap:7,'&:hover':{borderColor:VIOLET2,background:VIOLET0}}}><i class="ti ti-message-plus" style=${{fontSize:16,color:VIOLET}}/>Ask another doubt<//>
  </div>`;

  const compPill=html`<div style=${{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:3,display:'flex',alignItems:'center',gap:8,padding:'9px 16px',borderRadius:999,background:'#fff',border:`1px solid #f0c000`,boxShadow:SH_MD,fontSize:13,fontWeight:700,color:'#a5750b',whiteSpace:'nowrap'}}>Compressing<span style=${{display:'inline-flex',gap:3}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:'#f0a000',animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</span></div>`;
  const chatBlock=html`<${Box} ref=${scrollRef} sx=${{flex:1,minHeight:0,overflowY:'auto',display:'flex',flexDirection:'column',gap:16,px:full?3:2.2,py:2.6}}>
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
  const histW=!full?0:(histCol?70:447);
  const histItem=(h,showChip)=>{ const c=chapColor(h.chapter); return html`<${Box} key=${h.id} sx=${{padding:'10px 11px',borderRadius:11,border:`1px solid ${BORDER}`,cursor:'pointer',background:'#fff',transition:'background .15s ease, box-shadow .15s ease','&:hover':{background:c+'0d',boxShadow:SH_SM}}}>
    ${showChip?html`<div style=${{marginBottom:6}}><span style=${{display:'inline-flex',alignItems:'center',gap:5,fontSize:10,fontWeight:700,color:c,background:c+'16',padding:'2px 8px',borderRadius:999}}><span style=${{width:6,height:6,borderRadius:'50%',background:c}}/>${h.chapter}</span></div>`:''}
    <div style=${{fontSize:13.5,fontWeight:600,color:INK,lineHeight:1.3}}>${h.t}</div>
    <div style=${{display:'flex',alignItems:'center',gap:5,fontSize:11,color:DIM,fontWeight:500,marginTop:4}}><i class="ti ti-clock" style=${{fontSize:13}}/>${h.date} · ${h.time}</div>
  <//>`; };
  const sortPill=(k,label)=>html`<${Box} onClick=${()=>setHistSort(k)} sx=${{flex:1,textAlign:'center',py:.6,borderRadius:8,fontSize:11.5,fontWeight:700,cursor:'pointer',color:histSort===k?INK:DIM,background:histSort===k?'#fff':'transparent',boxShadow:histSort===k?SH_XS:'none',transition:'.15s'}}>${label}<//>`;
  const chapterGroups=(()=>{ const order=[],by={}; HISTORY.forEach(h=>{ if(!by[h.chapter]){ by[h.chapter]=[]; order.push(h.chapter); } by[h.chapter].push(h); }); return order.map(ch=>({ch,items:by[ch]})); })();
  const historyCol=html`<${Box} sx=${{width:histW,flex:'none',background:'#fff',borderRight:full?`1px solid ${BORDER}`:'none',display:'flex',flexDirection:'column',transition:'width .5s cubic-bezier(.2,.7,.3,1)',overflow:'hidden'}}>
    <${Box} sx=${{width:histCol?70:447,flex:1,minHeight:0,display:'flex',flexDirection:'column'}}>
      ${histCol
        ? html`<${R.Fragment}>
            <div style=${{minHeight:65,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:`1px solid ${BORDER}`}}>
              <${Box} onClick=${()=>setHistCol(false)} title="Show history" sx=${{width:40,height:40,borderRadius:9,display:'grid',placeItems:'center',cursor:'pointer',color:DIM,'&:hover':{background:G0,color:INK}}}><${Icon} n="layout-sidebar-left-expand" size=${21}/><//>
            </div>
            <div style=${{flex:1,minHeight:0,overflowY:'auto',padding:'12px 0',display:'flex',flexDirection:'column',gap:11,alignItems:'center'}}>
              <${Box} onClick=${()=>setHistCol(false)} title="Chat history" sx=${{width:42,height:42,flex:'none',borderRadius:11,display:'grid',placeItems:'center',background:BLUE0,color:BLUE7,cursor:'pointer',transition:'background .15s ease','&:hover':{background:BLUE1}}}><${Icon} n="message-2" size=${20}/><//>
            </div>
          <//>`
        : html`<${R.Fragment}>
            <div style=${{minHeight:65,flex:'none',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',borderBottom:`1px solid ${BORDER}`}}>
              <div style=${{fontSize:12,fontWeight:700,letterSpacing:'.6px',textTransform:'uppercase',color:DIM}}>Chat history</div>
              ${iconBtn('layout-sidebar-left-collapse',()=>setHistCol(true),'Collapse')}
            </div>
            <div style=${{flex:'none',padding:'12px 12px 0'}}>
              <div style=${{display:'flex',gap:4,padding:3,background:G1,borderRadius:10}}>${sortPill('recent','Recent')}${sortPill('chapter','By chapter')}</div>
            </div>
            <div style=${{flex:1,minHeight:0,overflowY:'auto',padding:'12px',display:'flex',flexDirection:'column',gap:histSort==='chapter'?18:8,WebkitMaskImage:'linear-gradient(to bottom, #000 82%, transparent 99%)',maskImage:'linear-gradient(to bottom, #000 82%, transparent 99%)'}}>
              ${histSort==='recent'
                ? [...HISTORY].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(h=>histItem(h,true))
                : chapterGroups.map(g=>{ const c=chapColor(g.ch); const total=CHAP_TOTALS[g.ch]||g.items.length; const shown=g.items.slice(0,6); const more=total-shown.length; return html`<div key=${g.ch} style=${{background:c+'0b',border:`1px solid ${c}2e`,borderRadius:14,padding:'12px 12px 10px'}}>
                    <div style=${{display:'flex',alignItems:'center',gap:7,padding:'0 4px 11px'}}>
                      <span style=${{width:9,height:9,borderRadius:'50%',flex:'none',background:c}}/>
                      <span style=${{flex:1,minWidth:0,fontSize:11.5,fontWeight:700,letterSpacing:'.3px',textTransform:'uppercase',color:INK,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>${g.ch}</span>
                      <span style=${{flex:'none',fontSize:10,fontWeight:700,color:c,background:'#fff',border:`1px solid ${c}33`,borderRadius:999,padding:'1px 8px'}}>${total}</span>
                    </div>
                    <div style=${{display:'flex',flexDirection:'column',gap:7}}>${shown.map(h=>histItem(h,false))}</div>
                    ${more>0?html`<${Box} sx=${{mt:1,display:'flex',alignItems:'center',justifyContent:'center',gap:.6,padding:'8px',borderRadius:10,cursor:'pointer',fontSize:12,fontWeight:700,color:c,transition:'background .15s ease','&:hover':{background:c+'16'}}}>View ${more} more<i class="ti ti-chevron-down" style=${{fontSize:15}}/><//>`:''}
                  </div>`; })}
            </div>
          <//>`}
    <//>
  <//>`;

  /* ---- RIGHT: visual aid / transcript (present only in full) ---- */
  const rightOpen=full && vis!=='closed';
  const transcriptBody=html`<div style=${{display:'flex',flexDirection:'column',gap:13}}>
    ${transcript.map(m=> m.role==='student'
      ? html`<div key=${m.id} style=${{display:'flex',justifyContent:'flex-end'}}><div style=${{maxWidth:'86%',background:BLUE,color:'#fff',borderRadius:'12px 12px 3px 12px',padding:'8px 12px',fontSize:13,fontWeight:500,lineHeight:1.45}}>${m.text}</div></div>`
      : m.explain
      ? html`<div key=${m.id} style=${{display:'flex',gap:8,alignItems:'flex-start'}}>
          <${Buddy} who="max" size=${28} bob=${false} style=${{flexShrink:0,marginTop:1}}/>
          <div style=${{flex:1,minWidth:0,background:'#fff',border:`1px solid ${BORDER}`,borderRadius:'3px 12px 12px 12px',padding:'11px 12px'}}>
            <div style=${{fontSize:13,lineHeight:1.5,color:INK}}>${FRAC_INTRO}</div>
            <div style=${{marginTop:10,background:BLUE0,border:`1px solid ${BLUE2}`,borderRadius:10,padding:'10px 11px'}}>
              <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:5,color:BLUE7,fontSize:9.5,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase'}}><i class="ti ti-sparkles" style=${{fontSize:12}}/>Key idea<//>
              <div style=${{fontSize:12.5,lineHeight:1.5,color:INK,fontWeight:600}}>${FRAC_KEY}</div>
              <div style=${{marginTop:10,paddingTop:10,borderTop:`1px solid ${BLUE2}`}}><${FractionVisual} step=${3}/></div>
            </div>
          </div>
        </div>`
      : html`<div key=${m.id} style=${{display:'flex',gap:8,alignItems:'flex-start'}}>
          <${Buddy} who="max" size=${28} bob=${false} style=${{flexShrink:0,marginTop:1}}/>
          <div style=${{flex:1,background:m.featured?BLUE0:'#fff',border:`1px solid ${m.featured?BLUE2:BORDER}`,borderRadius:'3px 12px 12px 12px',padding:'8px 11px',fontSize:13,lineHeight:1.5,color:INK,whiteSpace:'pre-wrap'}}>${m.text}</div>
        </div>`)}
  </div>`;
  const rightCol=html`<${Box} sx=${{width:rightOpen?796:0,flex:'none',background:'#fff',borderLeft:rightOpen?`1px solid ${BORDER}`:'none',display:'flex',flexDirection:'column',transition:'width .45s cubic-bezier(.2,.7,.3,1)',overflow:'hidden'}}>
    <${Box} sx=${{width:796,flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <div style=${{minHeight:65,flex:'none',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px 0 18px',borderBottom:`1px solid ${BORDER}`}}>
        <div style=${{display:'flex',alignItems:'center',gap:8}}>
          <div style=${{width:30,height:30,borderRadius:8,display:'grid',placeItems:'center',background:vis==='transcript'?VIOLET0:BLUE0,color:vis==='transcript'?VIOLET:BLUE}}><${Icon} n=${vis==='transcript'?'messages':'chart-donut-3'} size=${18}/></div>
          <div>
            <div style=${{fontSize:14,fontWeight:700,color:INK,lineHeight:1.1}}>${vis==='transcript'?'Full explanation':'Visual aid'}</div>
            <div style=${{fontSize:11.5,color:DIM,fontWeight:500}}>Adding unlike fractions</div>
          </div>
        </div>
        ${iconBtn('x',()=>setVis('closed'),'Close')}
      </div>
      <div style=${{flex:1,minHeight:0,overflowY:'auto',padding:'18px 16px'}}>
        ${vis==='transcript'?transcriptBody:html`<${R.Fragment}>
          <${FractionVisual} step=${step}/>
          <div style=${{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:16}}>${[1,2,3].map(i=>html`<span key=${i} style=${{width:step>=i?20:7,height:7,borderRadius:999,background:step>=i?BLUE:G3,transition:'.4s'}}/>`)}</div>
        <//>`}
      </div>
      ${vis==='transcript'?html`<div style=${{flex:'none',padding:'12px 16px',borderTop:`1px solid ${BORDER}`}}>
        <${RippleHover} onClick=${resumeConversation} radius="10px" sx=${{width:'100%',py:1.2,cursor:'pointer',color:'#fff',background:BLUE,fontSize:14,fontWeight:700,boxShadow:SH_SM,display:'flex',alignItems:'center',justifyContent:'center',gap:8,'&:hover':{background:BLUE7}}}><i class="ti ti-arrow-back-up" style=${{fontSize:17}}/>Resume this conversation<//>
      </div>`:''}
    <//>
  <//>`;

  const centerCol=html`<${Box} sx=${{flex:1,minWidth:0,display:'flex',flexDirection:'column',background:'linear-gradient(180deg, #eee9fd 0%, #f8f5fe 46%, #fdfaf0 100%)'}}>
    <${Box} sx=${{flex:'none',display:'flex',alignItems:'center',gap:1.2,px:2.2,minHeight:65,borderBottom:`1px solid ${BORDER}`,background:full?'rgba(255,255,255,.66)':'transparent',backdropFilter:full?'blur(8px)':'none'}}>
      <${Box} sx=${{width:38,height:38,flex:'none',borderRadius:'8px',overflow:'hidden',border:`1px solid ${BORDER}`,display:'grid',placeItems:'center'}}><img src="logo.png" alt="Byjus.AI" style=${{width:'100%',height:'100%',objectFit:'contain'}}/><//>
      <${Box} sx=${{flex:1,minWidth:0}}>
        <${Typography} sx=${{fontWeight:700,fontSize:18,lineHeight:1.1}}>Byjus.AI<//>
      <//>
      ${started?iconBtn('edit',reset,'New chat'):''}
      ${full?html`<${Box} onClick=${(e)=>{ e&&e.stopPropagation&&e.stopPropagation(); closeRoom(); }} title="Close" sx=${{width:38,height:38,flex:'none',borderRadius:'9px',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,border:`1px solid ${BORDER}`,background:'#fff',transition:'.15s','&:hover':{color:INK,border:`1px solid ${G4}`}}}><${Icon} n="x" size=${19}/><//>`:''}
    <//>

    ${started?chatBlock:heroBlock}

    <${Box} sx=${{flex:'none',px:full?3:1.8,pt:1.6,pb:1.8,opacity:vis==='transcript'?.45:1,pointerEvents:vis==='transcript'?'none':'auto',filter:vis==='transcript'?'grayscale(.4)':'none',transition:'opacity .3s ease'}}>
      <${Box} onMouseEnter=${()=>setInHov(true)} onMouseLeave=${()=>setInHov(false)} sx=${{position:'relative',maxWidth:full?764:'none',mx:full?'auto':0,borderRadius:'16px',border:`1px solid ${active?BLUE2:BORDER}`,boxShadow:active?`0 0 0 3px ${BLUE}1f, 0 0 16px ${BLUE}22`:'none',background:CARD,minHeight:62,display:'flex',alignItems:'center',px:1.2,transition:'box-shadow .3s ease, border-color .3s ease'}}>
        ${iconBtn('paperclip')}
        <input value=${text} disabled=${vis==='transcript'} onChange=${e=>setText(e.target.value)} onFocus=${()=>setFocus(true)} onBlur=${()=>setFocus(false)}
          onKeyDown=${e=>{ if(e.key==='Enter') submit(); }} placeholder=${vis==='transcript'?'Reading the full explanation…':(started?'Reply to MAX…':'Ask MAX anything…')}
          style=${{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',fontFamily:SYS,fontSize:15.5,fontWeight:500,color:INK,caretColor:BLUE}}/>
        <${Box} sx=${{width:36,height:36,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer',color:DIM,transition:'.15s','&:hover':{background:G0,color:BLUE}}}><${Icon} n="microphone" size=${19}/><//>
        <${RippleHover} onClick=${submit} radius="11px" sx=${{width:40,height:40,placeItems:'center',cursor:'pointer',color:'#fff',background:'linear-gradient(45deg, #228be6 0%, #15aabf 100%)',boxShadow:`0 4px 12px ${BLUE}3a`,transition:'.2s','&:hover':{filter:'brightness(1.06)',boxShadow:`0 6px 16px ${BLUE}4a`}}}>
          <${Box} sx=${{width:'100%',height:'100%',display:'grid',placeItems:'center'}}><${Icon} n="send" size=${18}/><//>
        <//>
      <//>
    <//>
  <//>`;

  return html`<${Box} sx=${{position:'relative',height:'100%',display:'flex',overflow:'hidden',background:CARD,borderRight:full?'none':`1px solid ${BORDER}`}}>
    ${historyCol}
    ${centerCol}
    ${rightCol}
    ${(full&&dust)?html`<div style=${{position:'absolute',inset:0,zIndex:60,pointerEvents:'none',overflow:'hidden'}}>
      <div style=${{position:'absolute',top:0,bottom:0,left:0,width:'42%',background:'linear-gradient(90deg, rgba(121,80,242,0) 0%, rgba(121,80,242,.09) 45%, rgba(34,139,230,.13) 66%, rgba(255,255,255,.5) 100%)',filter:'blur(3px)',animation:'roomsweep .9s cubic-bezier(.3,.6,.2,1) both'}}/>
      ${DUST.map((d,i)=>html`<i key=${i} class="ti ti-sparkles" style=${{position:'absolute',left:d.x+'%',top:d.y+'%',fontSize:d.s,color:d.col,filter:'drop-shadow(0 0 4px rgba(121,80,242,.45))',animation:`dusttw ${d.dur}s ${d.delay}s ease-in-out both`}}/>`)}
    </div>`:''}
  <//>`;
}

function JourneyMap({onResume}){
  const N=JOURNEY.length;
  const NS=74, YU=134, YD=259, H=403;
  const cx=(i)=>((i+0.5)/N)*100;
  const cy=(i)=>(i%2===0)?YU:YD;
  const meta={done:{c:TEAL},now:{c:BLUE},prog:{c:BLUE},next:{c:VIOLET},locked:{c:G4}};
  const curIdx=Math.max(...JOURNEY.map((n,i)=>(n.status==='done'||n.status==='now'||n.status==='prog')?i:-1));
  const doneCount=JOURNEY.filter(n=>n.status==='done').length;
  const segs=[];
  for(let i=0;i<N-1;i++){ const x0=cx(i),y0=cy(i),x1=cx(i+1),y1=cy(i+1),xm=(x0+x1)/2; segs.push({d:`M ${x0} ${y0} C ${xm} ${y0}, ${xm} ${y1}, ${x1} ${y1}`,traveled:(i+1)<=curIdx,c:meta[JOURNEY[i].status].c}); }
  const spk=[{l:-10,t:6,s:14,d:0},{l:76,t:-6,s:11,d:.5},{l:80,t:70,s:12,d:.9}];
  return html`<${HoverTile} sx=${{...cardSx,boxShadow:SH_SM,p:{xs:2,md:2.4},background:'radial-gradient(120% 130% at 50% 0%, #eef4ff 0%, #f6f4ff 46%, #ffffff 100%)',borderColor:BLUE1,overflow:'hidden'}}>
    <${Box} sx=${{display:'flex',alignItems:'center',gap:1.2,flexWrap:'wrap',mb:.5}}>
      <${Eyebrow} color=${BLUE7}>Your learning journey<//>
      <${Box} sx=${{flex:1}}/>
      <${Box} sx=${{display:'flex',alignItems:'center',gap:.6,pl:.5,pr:1.2,py:.4,borderRadius:999,background:'linear-gradient(180deg,#ffffff,#f2fbf7)',border:`1px solid ${TEAL2}`,boxShadow:`0 4px 12px ${TEAL}2e`}}>
        <${Box} sx=${{width:22,height:22,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',background:TEAL,color:'#fff'}}><${Icon} n="trophy" size=${13}/><//>
        <${Typography} sx=${{fontSize:11.5,fontWeight:800,color:TEAL9,whiteSpace:'nowrap'}}>Goal · 90%+<//>
      <//>
      <${M.Badge} variant="light" color="teal" size="lg" leftSection=${html`<${Icon} n="map-2" size=${15}/>`} style=${{textTransform:'none'}}>${doneCount}/${N} isles<//>
    <//>

    <${Box} sx=${{position:'relative',width:'100%',height:H}}>
      <svg width="100%" height=${H} viewBox=${`0 0 100 ${H}`} preserveAspectRatio="none" style=${{position:'absolute',inset:0,pointerEvents:'none'}}>
        ${segs.filter(s=>!s.traveled).map((s,i)=>html`<path key=${'u'+i} d=${s.d} fill="none" stroke=${G3} stroke-width=${4} stroke-linecap="round" stroke-dasharray="0.5 13" vector-effect="non-scaling-stroke"/>`)}
        ${segs.filter(s=>s.traveled).map((s,i)=>html`<path key=${'tg'+i} d=${s.d} fill="none" stroke=${s.c+'33'} stroke-width=${13} stroke-linecap="round" vector-effect="non-scaling-stroke"/>`)}
        ${segs.filter(s=>s.traveled).map((s,i)=>html`<path key=${'tc'+i} d=${s.d} fill="none" stroke=${s.c} stroke-width=${6} stroke-linecap="round" vector-effect="non-scaling-stroke"/>`)}
      </svg>
      ${JOURNEY.map((n,i)=>{ const c=meta[n.status].c; const left=cx(i)<50; const lit=n.status!=='locked'; const playish=n.status==='now'||n.status==='prog'; return html`<${Box} key=${n.t} onClick=${playish?onResume:undefined} sx=${{position:'absolute',left:cx(i)+'%',top:cy(i)+'px',transform:'translate(-50%,-50%)',width:NS,height:NS,zIndex:n.status==='now'?4:2,cursor:lit?'pointer':'default',transition:'transform .2s cubic-bezier(.2,.8,.3,1.2)','&:hover':{transform:`translate(-50%,-50%) scale(${lit?1.09:1.04})`,zIndex:6},'&:hover .isle-face':{boxShadow:lit?`0 12px 26px ${c}77, inset 0 2px 5px rgba(255,255,255,.6)`:SH_SM},'&:active':{transform:'translate(-50%,-50%) scale(.98)'}}}>
        <div style=${{position:'absolute',inset:0,borderRadius:'50%',transform:'translateY(6px)',background:lit?c:G4,filter:'brightness(.8)',opacity:lit?1:.55}}/>
        ${playish?html`<div style=${{position:'absolute',inset:-6,borderRadius:'50%',background:`conic-gradient(${BLUE} ${(n.p||0)*3.6}deg, ${BLUE}22 0)`,boxShadow:'0 0 0 3px #fff'}}/>`:''}
        <div class="isle-face" style=${{position:'absolute',inset:0,borderRadius:'50%',border:'5px solid #fff',background:lit?`radial-gradient(circle at 36% 28%, rgba(255,255,255,.62), ${c} 68%)`:`radial-gradient(circle at 36% 28%, #fff, ${G1} 74%)`,display:'grid',placeItems:'center',boxShadow:lit?`0 8px 18px ${c}66, inset 0 2px 5px rgba(255,255,255,.55)`:SH_XS,animation:n.status==='now'?'nodepulse 2.1s ease-out infinite':'none',color:lit?'#fff':G5,transition:'box-shadow .2s ease'}}>
          ${n.status==='done'?html`<${Icon} n="check" size=${34}/>`:''}
          ${playish?html`<${Icon} n="player-play-filled" size=${30}/>`:''}
          ${n.status==='next'?html`<${Icon} n="star-filled" size=${28}/>`:''}
          ${n.status==='locked'?html`<${Icon} n="lock" size=${25}/>`:''}
        </div>
        ${n.status==='done'?[{l:5,t:-14,s:13},{l:35,t:-22,s:16},{l:65,t:-14,s:13}].map((st,k)=>html`<i key=${k} class="ti ti-star-filled" style=${{position:'absolute',left:st.l+'px',top:st.t+'px',fontSize:st.s,color:'#ffc93c',filter:'drop-shadow(0 1px 2px rgba(0,0,0,.16))',animation:`starpop .4s ${.1+k*.08}s both`}}/>`):''}
        ${n.status==='now'?spk.map((sp,k)=>html`<i key=${'s'+k} class="ti ti-sparkles" style=${{position:'absolute',left:sp.l+'px',top:sp.t+'px',fontSize:sp.s,color:'#ffd43b',filter:'drop-shadow(0 0 4px rgba(255,200,60,.6))',animation:`twinkle 2.3s ${sp.d}s ease-in-out infinite`}}/>`):''}
        ${''}
        <div style=${{position:'absolute',left:'50%',top:'calc(100% + 7px)',transform:'translateX(-50%)',width:118,textAlign:'center'}}>
          <div style=${{fontSize:12.5,fontWeight:800,color:lit?INK:DIM,lineHeight:1.15}}>${n.t}</div>
          <div style=${{display:'inline-block',marginTop:3,padding:'1px 7px',borderRadius:999,background:lit?c+'1f':G1,color:playish?BLUE7:n.status==='next'?VIOLET9:n.status==='done'?TEAL9:DIM,fontSize:9.5,fontWeight:800,letterSpacing:'.3px'}}>${n.status==='done'?'Mastered':playish?(n.p+'% · Resume'):n.status==='next'?'Up next':'Locked'}</div>
        </div>
      <//>`; })}
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

  const profile=html`<${Box} sx=${{position:'relative',flex:'none'}}>
    <${Box} onClick=${()=>setProfOpen(o=>!o)} sx=${{display:'flex',alignItems:'center',gap:1,pl:.6,pr:profOpen?1.2:.6,py:.6,borderRadius:999,cursor:'pointer',background:CARD,border:`1px solid ${profOpen?BLUE2:BORDER}`,boxShadow:SH_XS,transition:'.15s','&:hover':{border:`1px solid ${BLUE2}`}}}>
      <${Box} sx=${{width:44,height:44,flex:'none',borderRadius:'50%',overflow:'hidden',background:BLUE0}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/><//>
      <${Icon} n=${profOpen?'chevron-up':'chevron-down'} size=${18} color=${DIM}/>
    <//>
    ${profOpen?html`<${R.Fragment}>
      <${Box} onClick=${()=>setProfOpen(false)} sx=${{position:'fixed',inset:0,zIndex:40}}/>
      <${Box} sx=${{position:'absolute',right:0,top:'calc(100% + 10px)',zIndex:41,width:236,background:CARD,border:`1px solid ${BORDER}`,borderRadius:'12px',boxShadow:SH_LG,overflow:'hidden',p:.8}}>
        <${Stack} direction="row" spacing=${1.2} alignItems="center" sx=${{px:1.4,py:1.2}}>
          <${Box} sx=${{width:42,height:42,flex:'none',borderRadius:'50%',overflow:'hidden',background:BLUE0}}><img src="aarav-avatar.png" alt="Aarav" style=${{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/><//>
          <${Box} sx=${{minWidth:0}}>
            <${Typography} sx=${{fontWeight:700,fontSize:15.5,lineHeight:1.2}}>Aarav<//>
            <${Typography} sx=${{fontSize:12.5,color:DIM,fontWeight:500}}>Class 7 · CBSE<//>
          <//>
        <//>
        <${Box} sx=${{height:1,background:BORDER,my:.6}}/>
        ${JUMP.map(j=>html`<${Box} key=${j.k} onClick=${()=>{setProfOpen(false);onNav(j);}} sx=${{display:'flex',alignItems:'center',gap:1.3,px:1.4,py:1.1,borderRadius:'8px',cursor:'pointer',color:TXT,fontSize:14.5,fontWeight:600,transition:'.12s','&:hover':{background:BLUE0,color:BLUE7}}}>
          <${Icon} n=${j.i} size=${19}/> ${j.t}
        <//>`)}
        <${Box} sx=${{height:1,background:BORDER,my:.6}}/>
        <${Box} onClick=${()=>{setProfOpen(false);onRestart();}} sx=${{display:'flex',alignItems:'center',gap:1.3,px:1.4,py:1.1,borderRadius:'8px',cursor:'pointer',color:DIM,fontSize:14.5,fontWeight:600,transition:'.12s','&:hover':{background:G0,color:INK}}}>
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
          <${Stack} direction="row" spacing=${.7} alignItems="center" sx=${{color:TEAL9}}><${Icon} n="arrow-right-circle" size=${17}/><${Typography} sx=${{fontSize:15,fontWeight:600}}>Next up · Data Handling — Mean, median & mode<//><//>
        <//>
        <${RippleHover} radius="8px"><${M.Button} size="md" color="teal" onClick=${onResume} rightSection=${html`<${Icon} n="arrow-right" size=${16}/>`}>Get started<//><//>
      <//>`
    : html`<${JourneyMap} onResume=${onResume}/>`;

  const statusMeta={done:{cl:'teal',label:'Done',c:TEAL},now:{cl:'blue',label:'In progress',c:BLUE},next:{cl:'violet',label:'Up next',c:VIOLET},planned:{cl:'gray',label:'Planned',c:G5}};

  return html`<${Box} sx=${{flex:1,minWidth:0,height:'100vh',overflow:'hidden'}}>
    <${Box} sx=${{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',px:{xs:2.5,md:5},py:{xs:2.5,md:3.5}}}>
    <${Box} sx=${{width:'100%',maxWidth:1180,mx:'auto',flex:'1 1 auto',minHeight:0,maxHeight:'100%',display:'flex',flexDirection:'column',gap:2.6}}>
      <${Stack} direction="row" alignItems="flex-start" justifyContent="space-between" spacing=${2} sx=${{flex:'none'}}>
        <${Box} sx=${{minWidth:0}}>
          <${Eyebrow} color=${DIM}>${dateStr}<//>
          <${Typography} variant="h3" sx=${{fontSize:{xs:28,md:36},mt:.5}}><span style=${{background:'linear-gradient(92deg,#1c7ed6 0%,#4c6ef5 46%,#7950f2 100%)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',color:'transparent'}}>Hey Aarav<//> 👋<//>
          <${Typography} sx=${{color:DIM,fontSize:16.5,mt:.6}}>Here's your learning plan for ${monthName}.<//>
        <//>
        <${Stack} direction="row" alignItems="center" spacing=${1.4} sx=${{flex:'none'}}>
          <${Box} sx=${{position:'relative',flex:'none'}}>
            <${Box} ref=${streakRef} onClick=${()=>setStreakOpen(o=>!o)} sx=${{display:'flex',alignItems:'center',gap:.7,pl:1,pr:1.4,py:.65,borderRadius:999,flex:'none',cursor:'pointer',background:'#fff4e6',border:`1px solid ${(streakCele||streakOpen)?ORANGE:'#ffe0b3'}`,boxShadow:streakCele?`0 0 0 2px ${ORANGE}44`:'none',transition:'.15s',animation:streakCele?'cardpop .6s ease':'none','&:hover':{background:'#ffe8cc'}}}>
              <${Icon} n="flame" size=${18} color=${ORANGE}/>
              <${Typography} sx=${{fontSize:14,fontWeight:700,color:'#e8590c',lineHeight:1,whiteSpace:'nowrap'}}><span style=${{fontWeight:800}}>4</span> day streak<//>
            <//>
            ${streakOpen?html`<${R.Fragment}>
              <${Box} onClick=${()=>setStreakOpen(false)} sx=${{position:'fixed',inset:0,zIndex:40}}/>
              <${Box} sx=${{position:'absolute',right:0,top:'calc(100% + 10px)',zIndex:41,width:352,background:CARD,border:`1px solid ${BORDER}`,borderRadius:'18px',boxShadow:SH_LG,p:2.2}}>
                <div style=${{position:'relative'}}>
                  <div style=${{display:'flex'}}>
                    ${STREAK_WEEK.map(w=>html`<div key=${w.d} style=${{flex:1,textAlign:'center',fontSize:12.5,fontWeight:700,color:w.s==='future'?DIM:INK,marginBottom:8}}>${w.d}</div>`)}
                  <//>
                  <div style=${{position:'relative',display:'flex'}}>
                    <div style=${{position:'absolute',left:0,top:-3,bottom:-3,width:'calc(400% / 7)',borderRadius:999,background:'#ffe8d9'}}/>
                    ${STREAK_WEEK.map(w=>html`<div key=${w.d} style=${{flex:1,display:'grid',placeItems:'center',position:'relative',zIndex:1}}>
                      ${w.s==='active'
                        ? html`<div style=${{width:42,height:42,clipPath:SHIELD,background:ORANGE,display:'grid',placeItems:'center'}}><${Icon} n="flame" size=${21} color="#fff"/></div>`
                        : html`<div style=${{width:42,height:42,borderRadius:'50%',display:'grid',placeItems:'center',background:'#fff',border:`2.5px solid ${w.s==='done'?ORANGE:w.s==='next'?INK:'#ced4da'}`}}>${w.s==='done'?html`<${Icon} n="flame" size=${20} color=${ORANGE}/>`:''}<//>`}
                    <//>`)}
                  <//>
                <//>
                <div style=${{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:16,paddingTop:14,borderTop:`1px solid ${BORDER}`}}>
                  <div style=${{display:'flex',alignItems:'center',gap:8}}>
                    <${Icon} n="flame" size=${22} color=${ORANGE}/>
                    <span style=${{fontSize:16,fontWeight:800,color:INK}}>4 days</span>
                  <//>
                  <div style=${{display:'flex',alignItems:'center',gap:7}}>
                    <div title="Streak saver ready" style=${{width:26,height:26,clipPath:SHIELD,background:ORANGE,display:'grid',placeItems:'center'}}><${Icon} n="flame" size=${13} color="#fff"/><//>
                    <div title="Next reward locked" style=${{width:26,height:26,clipPath:SHIELD,background:'#ced4da'}}/>
                  <//>
                <//>
              <//>
            <//>`:''}
          <//>
          ${profile}
        <//>
      <//>

      ${hero}
      <${Box} sx=${{flex:1,minHeight:0,display:'grid',gridTemplateColumns:{xs:'1fr',md:'1fr 1fr'},gap:2.6,alignItems:'stretch'}}>
        <${HoverTile} sx=${{...cardSx,p:{xs:2.6,md:3.2}}}>
          <${Stack} direction="row" spacing=${1} alignItems="center" sx=${{mb:2.4}}><${Icon} n="target-arrow" size=${21} color=${BLUE}/><${Typography} variant="subtitle2" sx=${{fontSize:18.5}}>Goals to hit<//><//>
          <${Stack} spacing=${2.2}>
            ${GOALS2.map(g=>html`<${Stack} key=${g.t} direction="row" spacing=${1.4} alignItems="center">
              <${Box} sx=${{width:38,height:38,flex:'none',borderRadius:'8px',display:'grid',placeItems:'center',background:`${g.c}1a`,color:g.c}}><${Icon} n=${g.i} size=${19}/><//>
              <${Typography} sx=${{flex:1,minWidth:0,fontSize:15.5,fontWeight:600}}>${g.t}<//>
              <${M.Badge} variant="light" color=${g.cl} size="md" style=${{textTransform:'none',flex:'none'}}>${g.s}<//>
            <//>`)}
          <//>
        <//>

        <${HoverTile} sx=${{...cardSx,p:{xs:2.6,md:3.2}}}>
          <${Stack} direction="row" spacing=${1} alignItems="center" sx=${{mb:.5}}><${Icon} n="calendar-month" size=${21} color=${BLUE}/><${Typography} variant="subtitle2" sx=${{fontSize:18.5}}>${monthName} plan<//><${Box} sx=${{flex:1}}/><${M.Badge} variant="light" color="blue" size="md">${done} / ${CHAPTERS.length} done<//><//>
          <${Typography} sx=${{fontSize:13.5,fontWeight:500,color:DIM,mb:2.2}}>Chapters mapped for this month<//>
          <${Stack} spacing=${1.4}>
            ${CHAPTERS.map((c,i)=>{ const sm=statusMeta[c.status]; return html`<${Stack} key=${c.t} direction="row" spacing=${1.4} alignItems="flex-start" sx=${{p:1.4,borderRadius:'12px',background:sm.c+'12',border:`1px solid ${sm.c}33`}}>
              <${Box} sx=${{width:32,height:32,flex:'none',mt:.1,borderRadius:'8px',display:'grid',placeItems:'center',fontSize:13,fontWeight:800,color:c.status==='planned'?DIM:'#fff',background:c.status==='planned'?G2:sm.c}}>${c.status==='done'?html`<${Icon} n="check" size=${17}/>`:i+1}<//>
              <${Box} sx=${{flex:1,minWidth:0}}>
                <${Stack} direction="row" alignItems="center" spacing=${1}>
                  <${Typography} noWrap sx=${{fontSize:15,fontWeight:700,flex:1,minWidth:0}}>${c.t}<//>
                  <${M.Badge} variant=${c.status==='planned'?'default':'light'} color=${sm.cl} size="sm" style=${{textTransform:'none',flex:'none'}}>${sm.label}<//>
                <//>
                <${Typography} noWrap sx=${{fontSize:13,color:DIM,fontWeight:500,mt:.2}}>${c.sub}<//>
                ${(c.status==='now'||c.status==='done')?html`<${LinearProgress} variant="determinate" value=${c.p} sx=${{mt:.9,height:6}}/>`:''}
              <//>
            <//>`; })}
          <//>
        <//>
      <//>
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
    <div style=${{width:46,flex:'none',fontSize:15,fontWeight:800,color:INK,textAlign:'center'}}>${label}</div>
    <div style=${{flex:1,minWidth:0}}>${children}</div>
  </div>`;
}
function VPanel({title,idx,step,children}){
  const on=step>=idx;
  return html`<div style=${{opacity:on?1:.3,transform:on?'translateY(0)':'translateY(7px)',transition:'opacity .5s ease, transform .5s ease',background:'#fff',border:`1px solid ${BORDER}`,borderRadius:12,padding:'13px 15px',boxShadow:on?SH_XS:'none'}}>
    <div style=${{display:'flex',alignItems:'center',gap:8,marginBottom:11}}>
      <div style=${{width:21,height:21,flex:'none',borderRadius:'50%',display:'grid',placeItems:'center',fontSize:11,fontWeight:700,color:'#fff',background:on?BLUE:G4,transition:'background .4s'}}>${idx}</div>
      <div style=${{fontSize:13,fontWeight:700,color:INK}}>${title}</div>
    </div>
    ${children}
  </div>`;
}
function FractionVisual({step}){
  return html`<div style=${{display:'flex',flexDirection:'column',gap:14}}>
    <${VPanel} title="The problem" idx=${1} step=${step}>
      <div style=${{display:'flex',flexDirection:'column',gap:9}}>
        <${VisRow} label="½"><${FracBar} denom=${2} fills=${[VIOLET,null]}/><//>
        <${VisRow} label="⅓"><${FracBar} denom=${3} fills=${[BLUE,null,null]}/><//>
      </div>
      <div style=${{fontSize:12,color:DIM,marginTop:10,fontWeight:500}}>Different-size pieces — we can't add them yet.</div>
    <//>
    <${VPanel} title="Make the pieces match (sixths)" idx=${2} step=${step}>
      <div style=${{display:'flex',flexDirection:'column',gap:9}}>
        <${VisRow} label="3/6"><${FracBar} denom=${6} fills=${[VIOLET,VIOLET,VIOLET,null,null,null]}/><//>
        <${VisRow} label="2/6"><${FracBar} denom=${6} fills=${[BLUE,BLUE,null,null,null,null]}/><//>
      </div>
      <div style=${{fontSize:12,color:DIM,marginTop:10,fontWeight:500}}>½ = 3/6 and ⅓ = 2/6 — same-size pieces now.</div>
    <//>
    <${VPanel} title="Add the tops" idx=${3} step=${step}>
      <${VisRow} label="5/6"><${FracBar} denom=${6} fills=${[VIOLET,VIOLET,VIOLET,BLUE,BLUE,null]}/><//>
      <div style=${{fontSize:12,color:DIM,marginTop:10,fontWeight:500}}>3 + 2 = 5 sixths. So ½ + ⅓ = <b style=${{color:INK}}>5/6</b>.</div>
    <//>
  </div>`;
}
function FracMini(){
  return html`<div style=${{display:'flex',alignItems:'center',gap:10,marginTop:11,padding:'9px 12px',background:G0,border:`1px solid ${BORDER}`,borderRadius:10}}>
    <div style=${{fontSize:13,fontWeight:800,color:INK,whiteSpace:'nowrap'}}>½ + ⅓ =</div>
    <div style=${{flex:1,maxWidth:200}}><${FracBar} denom=${6} fills=${[VIOLET,VIOLET,VIOLET,BLUE,BLUE,null]}/></div>
    <div style=${{fontSize:14,fontWeight:800,color:BLUE7}}>5/6</div>
  </div>`;
}

function Home({onResume,onRestart,moduleDone}){
  const [snack,setSnack]=useState('');
  const streakRef=useRef(null);
  const [streakCele,setStreakCele]=useState(false);
  const [mode,setMode]=useState('rest'); // rest | hover | full
  useEffect(()=>{ const today=new Date().toDateString(); if(localStorage.getItem('byjus_streakDay')!==today){ localStorage.setItem('byjus_streakDay',today); const t=setTimeout(()=>{ const el=streakRef.current; if(el){ const r=el.getBoundingClientRect(); burst(r.left+r.width/2,r.top+r.height/2,[ORANGE,BLUE,TEAL,GRAPE]); } setStreakCele(true); setTimeout(()=>setStreakCele(false),1600); },850); return ()=>clearTimeout(t); } },[]);
  const onNav=(j)=>setSnack(`${j.t} — coming soon`);
  const full=mode==='full';
  const hover=mode==='hover';
  const pw = full?'100vw':hover?'50vw':'40vw';
  const restLeft='min(40vw, 600px)';
  const dashLeft = (full||hover)?'50vw':restLeft;
  const dashWidth = (full||hover)?'50vw':`calc(100vw - ${restLeft})`;
  const dashX = full?'50vw':'0px';
  return html`<${Screen} decor="math" sx=${{position:'relative',height:'100vh',overflow:'hidden'}}>
    <${Box} sx=${{position:'absolute',top:0,left:dashLeft,width:dashWidth,height:'100vh',overflow:'hidden',transform:`translateX(${dashX})`,transition:'left .55s cubic-bezier(.2,.7,.3,1), width .55s cubic-bezier(.2,.7,.3,1), transform .55s cubic-bezier(.2,.7,.3,1)'}}>
      <${Dashboard} moduleDone=${moduleDone} onResume=${onResume} onNav=${onNav} onRestart=${onRestart} streakRef=${streakRef} streakCele=${streakCele}/>
    <//>
    <${Box}
      onMouseEnter=${()=>{ if(mode==='rest') setMode('hover'); }}
      onMouseLeave=${()=>{ if(mode==='hover') setMode('rest'); }}
      onClick=${()=>{ if(mode!=='full') setMode('full'); }}
      sx=${{position:'absolute',top:0,left:0,width:pw,minWidth:full?'100vw':360,maxWidth:(full||hover)?'none':'600px',height:'100vh',cursor:full?'default':'pointer',zIndex:20,boxShadow:mode==='rest'?'none':SH_MD,transition:'width .55s cubic-bezier(.2,.7,.3,1), min-width .55s cubic-bezier(.2,.7,.3,1), max-width .55s cubic-bezier(.2,.7,.3,1), box-shadow .4s ease'}}>
      <${HomeChat} onResume=${onResume} full=${full} onExpand=${()=>setMode('full')} onClose=${()=>setMode('rest')}/>
    <//>
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
    ${playing?html`<${Waveform} color=${tint} bars=${4} height=${16}/>`:html`<span style=${{fontSize:10,fontWeight:700,letterSpacing:'.4px',textTransform:'uppercase',color:tint,opacity:.85}}>Read aloud<//>`}
  </div>`;
}
function ChatBubble({m,speakingId,onReplay}){
  if(m.role==='student') return html`<div class="msg" style=${{display:'flex',justifyContent:'flex-end'}}>
    <div style=${{maxWidth:'82%',background:BLUE,color:'#fff',borderRadius:'10px 10px 3px 10px',padding:'8px 12px',fontSize:13,fontWeight:500}}>${m.text}</div>
  </div>`;
  const isMax=m.role==='max'; const tint=isMax?VIOLET:TEAL; const playing=speakingId===m.id;
  if(m.featured) return html`<div class="msg" style=${{display:'flex',gap:9,alignItems:'flex-start'}}>
    <${Buddy} who=${m.role} size=${36} bob=${false} mood=${m.mood||'grin'}/>
    <div style=${{flex:1,minWidth:0,background:BLUE0,border:`1px solid ${BLUE2}`,borderRadius:'3px 10px 10px 10px',padding:'10px 12px'}}>
      <div style=${{display:'inline-flex',alignItems:'center',gap:5,marginBottom:5,color:BLUE7,fontSize:10,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase'}}><i className="ti ti-sparkles" style=${{fontSize:13}}/>Key idea</div>
      <div style=${{fontSize:13,fontWeight:600,lineHeight:1.45,color:INK,whiteSpace:'pre-wrap'}}>${m.text}</div>
      <${PlayCtl} role=${m.role} playing=${playing} onClick=${()=>onReplay(m)}/>
    </div>
  </div>`;
  return html`<div class="msg" style=${{display:'flex',gap:9,alignItems:'flex-start'}}>
    <${Buddy} who=${m.role} size=${36} bob=${false} mood=${m.mood||'smile'}/>
    <div style=${{minWidth:0,flex:1}}>
      <div style=${{fontSize:10,fontWeight:700,letterSpacing:'.5px',color:isMax?VIOLET9:TEAL9,marginBottom:3}}>${isMax?'MAX':'SPARK'}</div>
      <div style=${{background:isMax?CARD:TEAL0,border:`1px solid ${isMax?BORDER:TEAL2}`,borderLeft:`3px solid ${tint}`,borderRadius:'3px 10px 10px 10px',padding:'8px 12px'}}>
        <div style=${{fontSize:13,fontWeight:400,lineHeight:1.45,whiteSpace:'pre-wrap',color:INK}}>${m.text}</div>
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
      pushRef.current&&pushRef.current({kind:'sparksum',title:'Why do we take the LCM?',text:"Spark asked why we find the LCM of 2 and 3. MAX explained: fractions can only be added when the pieces are the same size, and the LCM \u2014 6 \u2014 is the smallest shared size, so \u00bd = 3/6 and \u2153 = 2/6."});
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
        : "Ooh, I think the bottoms have to match before we add them — same-size pieces! But let's ask MAX to be totally sure.", 'smile'); }
    setThinking(false); if(to==='max') setMaxMood('smile'); else setSparkMood('smile');
  }

  const fTile=(t,teal)=>{ const c=teal?TEAL:VIOLET, bg=teal?TEAL0:VIOLET0, bd=teal?TEAL2:VIOLET2, fg=teal?TEAL9:VIOLET9;
    return html`<${Box} sx=${{fontWeight:700,fontSize:28,color:fg,background:bg,border:`1px dashed ${bd}`,borderRadius:'8px',px:2.4,py:1.1}}>${t}<//>`; };
  const sep=(t)=>html`<${Typography} sx=${{fontWeight:600,fontSize:28,color:DIM}}>${t}<//>`;
  const choiceBtn=(label,onClick)=>{ const p=picked&&picked.k===label?picked:null;
    const col=p?(p.correct?'green':'red'):'gray';
    const variant=p?'filled':'default';
    return html`<${M.Button} key=${label} variant=${variant} color=${col} size="lg" onClick=${onClick}
      style=${{minWidth:104,fontSize:22,fontWeight:700,height:60,...(p&&!p.correct?{animation:'shake .35s'}:{})}}>${label}<//>`; };

  const videoNode=()=>html`<${Stack} spacing=${2} alignItems="center" justifyContent="center" sx=${{height:'100%',maxWidth:980,mx:'auto',width:'100%'}}>
    <${Box} sx=${{width:'100%',aspectRatio:'16/9',borderRadius:'12px',position:'relative',overflow:'hidden',background:'#242424',border:`1px solid ${G4}`,boxShadow:SH_LG,display:'grid',placeItems:'center'}}>
      <${Box} sx=${{position:'absolute',top:12,left:14,display:'flex',gap:.7,alignItems:'center',color:'rgba(255,255,255,.7)'}}><${Icon} n="movie" size=${15}/><${Eyebrow} color=${'rgba(255,255,255,.7)'}>Video placeholder<//><//>
      <${Box} sx=${{width:68,height:68,borderRadius:'50%',background:'#fff',display:'grid',placeItems:'center',color:BLUE,boxShadow:SH_MD,cursor:'pointer',zIndex:1}}><${Icon} n="player-play-filled" size=${28}/><//>
      <${Typography} sx=${{position:'absolute',bottom:38,color:'rgba(255,255,255,.9)',fontWeight:600,fontSize:14}}>Why the bottoms must match<//>
      <${Box} sx=${{position:'absolute',left:14,right:14,bottom:14,display:'flex',alignItems:'center',gap:1,color:'rgba(255,255,255,.8)'}}>
        <${Icon} n="player-play-filled" size=${12}/>
        <${Box} sx=${{flex:1,height:4,borderRadius:999,background:'rgba(255,255,255,.25)'}}><${Box} sx=${{width:'18%',height:'100%',borderRadius:999,background:BLUE}}/><//>
        <${Typography} sx=${{fontSize:11,fontWeight:500}}>0:16 / 1:28<//>
      <//>
    <//>
    <${Typography} sx=${{color:DIM,fontWeight:500,fontSize:13}}>An animated explainer would play here — drop in the Lottie / MP4 source.<//>
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
    <${Typography} sx=${{color:DIM,fontWeight:500,fontSize:13,textAlign:'center'}}>Live applet (GeoGebra / custom) mounts here — students drag the bars to feel why 5/6 fills.<//>
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
            <${Box} sx=${{fontSize:15.5,fontWeight:700,color:INK}}>Find the LCM of 2 and 3<//>
          <//>
          <${Typography} sx=${{fontSize:15,fontWeight:600,color:INK}}>LCM(2, 3) = <${Box} component="span" sx=${{color:VIOLET9,fontWeight:800}}>6<//><//>
          <${Stack} direction="row" spacing=${2}>
            <${Typography} sx=${{fontSize:15,fontWeight:600,color:INK}}>½ = <b>3/6</b><//>
            <${Typography} sx=${{fontSize:15,fontWeight:600,color:INK}}>⅓ = <b>2/6</b><//>
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
        <${Box} sx=${{fontSize:10,fontWeight:800,letterSpacing:'.4px',textTransform:'uppercase',color:'#e8830f',mb:.4}}>Spark ⚡<//>
        <${Typography} sx=${{fontWeight:500,fontSize:14.5,color:'#8a5300',lineHeight:1.45}}>Ooh ooh, I think I've got it! ½ + ⅓ = ⅖ — you just add the tops AND the bottoms, right?<//>
      <//>
    <//>`:''}
    <${Typography} variant="h6" textAlign="center" sx=${{opacity:sparkPop?1:.35,transition:'opacity .4s ease'}}>Help MAX — what should both bottoms become?<//>
    <${Stack} direction="row" spacing=${2} justifyContent="center" sx=${{opacity:sparkPop?1:.35,pointerEvents:sparkPop?'auto':'none',transition:'opacity .4s ease'}}>${[5,6,9].map(n=>choiceBtn(String(n),(e)=>chooseDenom(n,e)))}<//>
    ${!sparkPop?html`<${Stack} direction="row" spacing=${1} alignItems="center" justifyContent="center" sx=${{color:DIM}}><${Icon} n="message-2" size=${15}/><${Typography} sx=${{fontSize:12.5,fontWeight:600}}>Spark is working it out on the board…<//><//>`:''}
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
    <${Typography} sx=${{color:DIM,fontSize:12.5,fontWeight:500}}>Pick the answer — or ask MAX a doubt in the chat.<//>
  <//>`;

  const lastBuddy=[...messages].reverse().find(x=>x.role!=='student')?.role||'max';
  const activeRole=speaking||lastBuddy;
  const NODES={teach:{label:'Teaching',icon:'presentation',c:VIOLET},question:{label:'Question',icon:'help-circle',c:YELLOW},applet:{label:'Activity',icon:'box',c:TEAL8},sim:{label:'Simulation',icon:'adjustments-horizontal',c:CYAN},video:{label:'Video',icon:'player-play',c:BLUE}};
  const stepNode=[['teach','Guided talk'],['video','Why bottoms must match'],['teach','Slide · common denominator'],['question','Help MAX'],['sim','Fraction-bar applet'],['applet','Build the sixths'],['question','Exit question']];
  const [ntype,nsub]=stepNode[step]||stepNode[0]; const node=NODES[ntype];
  function sparkBubble(m){ if(m.who==='student') return html`<${Box} key=${m.id} className="msg" sx=${{alignSelf:'flex-end',maxWidth:'85%',background:BLUE,color:'#fff',borderRadius:'13px 13px 4px 13px',px:1.5,py:.85,fontSize:12.5,fontWeight:500,lineHeight:1.45,boxShadow:SH_XS}}>${m.text}<//>`;
    const isSpark=m.who==='spark';
    return html`<${Stack} key=${m.id} className="msg" direction="row" spacing=${.8} alignItems="flex-start" sx=${{alignSelf:'flex-start',maxWidth:'93%'}}>
      <${Buddy} who=${isSpark?'spark':'max'} size=${26} bob=${false} style=${{flexShrink:0,marginTop:2}}/>
      <${Box} sx=${{background:isSpark?'#FFF7E6':CARD,border:`1px solid ${isSpark?'rgba(240,140,0,.42)':BORDER}`,borderRadius:'4px 12px 12px 12px',px:1.4,py:.85,fontSize:12.5,fontWeight:500,color:isSpark?'#8a5300':INK,lineHeight:1.45,boxShadow:SH_XS}}>
        <${Box} sx=${{fontSize:8.5,fontWeight:800,letterSpacing:'.4px',textTransform:'uppercase',color:isSpark?'#e8830f':VIOLET9,mb:.3}}>${isSpark?'Spark ⚡':'MAX'}<//>
        ${m.text}
      <//>
    <//>`; }
  function renderSparkWindow(){
    if(!sparkWin) return '';
    const inputRow = html`<${Box} sx=${{display:'flex',alignItems:'center',gap:.6,border:`1px solid ${BORDER}`,borderRadius:10,px:1,py:.35,background:CARD}}>
      <input value=${sparkInput} onChange=${e=>setSparkInput(e.target.value)} onKeyDown=${e=>{ if(e.key==='Enter') askSpark(); }} placeholder="Ask your own question…" style=${{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',fontFamily:SYS,fontSize:12.5,fontWeight:500,color:INK,caretColor:BLUE,padding:'5px 3px'}}/>
      <${Box} onClick=${askSpark} sx=${{width:28,height:28,flexShrink:0,borderRadius:8,display:'grid',placeItems:'center',cursor:'pointer',color:'#fff',background:BLUE,transition:'.15s','&:hover':{background:BLUE7}}}><${Icon} n="send" size=${14}/><//>
    <//>`;
    const footer = sparkTyping
      ? html`<${Box} sx=${{fontSize:11.5,fontWeight:600,color:DIM,textAlign:'center',py:.5}}>MAX & Spark are talking…<//>`
      : sparkStage===0
      ? html`<${Box} sx=${{fontSize:11.5,fontWeight:600,color:DIM,textAlign:'center',py:.5}}>Listening to Spark…<//>`
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
          <${Box} sx=${{fontSize:9,fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',color:'#e8830f'}}>Spark asked on the board<//>
          <${Box} sx=${{fontSize:13.5,fontWeight:700,color:INK}}>Quick question ⚡<//>
        <//>
        ${sparkDone?html`<${Box} sx=${{fontSize:9.5,fontWeight:700,color:'#b8893a',border:'1px solid rgba(240,140,0,.35)',borderRadius:999,px:.9,py:.3}}>Recap<//>`:''}
      <//>
      <${Box} ref=${sparkScrollRef} sx=${{display:'flex',flexDirection:'column',gap:1,px:1.4,py:1.4,maxHeight:224,overflowY:'auto',maskImage:'linear-gradient(to bottom, transparent 0, #000 20px)',WebkitMaskImage:'linear-gradient(to bottom, transparent 0, #000 20px)'}}>
        ${sparkMsgs.map(sparkBubble)}
        ${sparkTyping?html`<${Stack} direction="row" spacing=${.8} alignItems="center" sx=${{alignSelf:'flex-start',mt:.3}}><${Buddy} who=${sparkTyping} size=${24}/><div style=${{display:'flex',gap:4,padding:'6px 9px',borderRadius:999,background:sparkTyping==='spark'?'#f59f0a':BLUE}}>${[0,1,2].map(i=>html`<span key=${i} style=${{width:5,height:5,borderRadius:'50%',background:'#fff',animation:`dots 1.2s ${i*0.2}s infinite`}}/>`)}</div><//>`:''}
      <//>
      <${Box} sx=${{px:1.4,py:1.2,borderTop:`1px solid ${BORDER}`,background:G0}}>${footer}<//>
    <//>
  <//>`;
  }
  const roomBg=`radial-gradient(1300px 860px at 12% -10%, ${node.c}22, transparent 58%), radial-gradient(1150px 760px at 103% 114%, ${node.c}1a, transparent 55%), linear-gradient(162deg, #edeef5 0%, #e6e7f0 52%, #ece9f4 100%)`;
  return html`<${Box} sx=${{position:'fixed',inset:0,display:'flex',flexDirection:'column',overflow:'hidden',background:roomBg,transition:'background .6s ease'}}>
    <${Box} sx=${{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',opacity:.6,backgroundImage:`radial-gradient(${node.c}26 1px, transparent 1.5px)`,backgroundSize:'24px 24px',maskImage:'radial-gradient(130% 105% at 50% -5%, #000, transparent 76%)',WebkitMaskImage:'radial-gradient(130% 105% at 50% -5%, #000, transparent 76%)'}}/>
    ${DECOR_SPOTS.map((sp,i)=>html`<i key=${i} class=${'ti ti-'+SUBJECT_ICONS.math[i%SUBJECT_ICONS.math.length]} style=${{position:'absolute',left:sp.l+'%',top:sp.t+'%',fontSize:sp.s,color:`${node.c}22`,zIndex:0,pointerEvents:'none',transition:'color .6s ease'}}/>`)}
    <!-- goal bar -->
    <${Box} sx=${{position:'relative',zIndex:1,flex:'none',display:'flex',alignItems:'center',gap:1.5,px:2,py:1.2,background:`linear-gradient(90deg, ${node.c}12, ${CARD} 42%)`,borderBottom:`1px solid ${node.c}30`,boxShadow:SH_XS}}>
      <${M.ActionIcon} variant="default" color="gray" size=${36} onClick=${onExit}><${Icon} n="arrow-left" size=${18}/><//>
      <${M.Badge} variant="light" color="blue" size="lg" leftSection=${html`<${Icon} n="math-symbols" size=${14}/>`} style=${{textTransform:'none'}}>Add fractions · unlike denominators<//>
      <${Box} sx=${{flex:1,maxWidth:280,display:{xs:'none',sm:'block'}}}><${LinearProgress} variant="determinate" value=${celebrate?100:PROG[step]}/><//>
      <${Typography} sx=${{fontSize:12.5,fontWeight:700,color:DIM,display:{xs:'none',sm:'block'}}}>Step ${Math.min(step+1,7)}/7<//>
      <${Box} sx=${{flex:1}}/>
      <${M.Badge} variant="light" color="orange" size="lg" leftSection=${html`<${Icon} n="flame" size=${14}/>`}>4<//>
    <//>

    <${Box} sx=${{position:'relative',zIndex:1,flex:1,display:'flex',minHeight:0,overflow:'hidden'}}>
      <!-- main -->
      <${Box} sx=${{flex:1,minWidth:0,display:'flex',flexDirection:'column',position:'relative',p:1.5,gap:2}}>
        <${Box} sx=${{flex:1,borderRadius:'8px',position:'relative',overflow:'hidden',background:CARD,border:`1px solid ${node.c}33`,boxShadow:SH_SM,display:'flex',flexDirection:'column'}}>
          <${Box} sx=${{flex:'none',height:3,background:`linear-gradient(90deg, ${node.c}, ${node.c}55)`}}/>
          <${Box} sx=${{flex:'none',display:'flex',alignItems:'center',gap:1.4,px:1.6,py:1.1,borderBottom:`1px solid ${node.c}33`,background:`linear-gradient(90deg, ${node.c}1f, ${node.c}08 55%, ${G0})`}}>
            <${Stack} direction="row" spacing=${.7} alignItems="center" sx=${{flexShrink:0,px:1,py:.4,borderRadius:999,background:`${node.c}14`,border:`1px solid ${node.c}3a`,color:node.c}}>
              <${Icon} n=${node.icon} size=${14}/>
              <${Typography} sx=${{fontSize:10.5,fontWeight:700,letterSpacing:'.5px',textTransform:'uppercase',whiteSpace:'nowrap'}}>${node.label}<//>
            <//>
            <${Typography} noWrap sx=${{fontSize:11.5,fontWeight:600,color:DIM,display:{xs:'none',lg:'block'}}}>${nsub}<//>
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
          <${Box} sx=${{display:'flex',alignItems:'center',gap:1,px:2,py:1,borderRadius:999,background:'#FFF7E6',border:'1px solid rgba(240,140,0,.42)',boxShadow:SH_SM,color:'#8a5300',fontSize:12.5,fontWeight:700}}><${Buddy} who="spark" size=${22} bob=${true}/> Spark has a question on the board ⚡<//>
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
              <${Stack} direction="row" spacing=${.8} alignItems="center"><${Icon} n="chart-line" size=${16} color=${BLUE}/><${Typography} sx=${{fontWeight:700,fontSize:13,color:INK}}>Fractions mastery<//><//>
              <${M.Badge} variant="light" color="teal" size="sm">+20%<//>
            <//>
            <${Box} sx=${{position:'relative',height:12,borderRadius:999,background:G2,overflow:'hidden'}}>
              <${Box} sx=${{position:'absolute',left:0,top:0,bottom:0,width:'60%',borderRadius:999,background:BLUE}}/>
              <${Box} sx=${{position:'absolute',left:'40%',top:0,bottom:0,width:'20%',background:'repeating-linear-gradient(45deg,rgba(255,255,255,.5) 0 4px,transparent 4px 8px)'}}/>
            <//>
            <${Stack} direction="row" justifyContent="space-between" sx=${{mt:.7}}><${Typography} sx=${{fontSize:10.5,fontWeight:500,color:DIM}}>was 40%<//><${Typography} sx=${{fontSize:10.5,fontWeight:700,color:BLUE7}}>now 60%<//><//>
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
   APP
   ========================================================= */
function App(){
  const [screen,setScreen]=useState(()=>localStorage.getItem('byjus_onboarded')==='1'?'home':'onboarding');
  const [moduleDone,setModuleDone]=useState(false);
  const finishOnboard=()=>{ localStorage.setItem('byjus_onboarded','1'); setScreen('home'); };
  const restart=()=>{ localStorage.setItem('byjus_onboarded','0'); setScreen('onboarding'); };
  return html`<${R.Fragment}>
    ${screen==='onboarding'&&html`<${Onboarding} onDone=${finishOnboard}/>`}
    ${screen==='home'&&html`<${Home} moduleDone=${moduleDone} onResume=${()=>{setModuleDone(false);setScreen('lesson');}} onRestart=${restart}/>`}
    ${screen==='lesson'&&html`<${Lesson} onExit=${()=>setScreen('home')} onComplete=${()=>{setModuleDone(true);setScreen('home');}}/>`}
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
      @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
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
      #byjus-host .msg{animation:riseIn .3s cubic-bezier(.2,.7,.3,1) both}
      #byjus-host .scrn{animation:riseIn .34s cubic-bezier(.2,.7,.3,1) both}
      #byjus-host::-webkit-scrollbar{width:10px;height:10px}
      #byjus-host::-webkit-scrollbar-thumb{background:rgba(33,37,41,.18);border-radius:999px;border:3px solid transparent;background-clip:content-box}`;
    document.head.appendChild(st);
  }
  ['dc-root','app-root'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; });
  let host=document.getElementById('byjus-host');
  if(!host){ host=document.createElement('div'); host.id='byjus-host'; document.body.appendChild(host); }
  host.style.cssText='position:fixed;inset:0;overflow:auto;background:#f8f9fa;z-index:1;font-family:'+SYS;
  window.ReactDOM.createRoot(host).render(html`<${App}/>`);
})();
