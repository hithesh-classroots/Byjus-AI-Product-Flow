/* Practice Room · topic-specific "board" questions (data, coordinates, shapes, number & algebra).
   Each question is {type:'board', kind}. State lives in the quiz's per-question qsLinks object (L).
   vals() returns template values: a figure scene for the right panel (bdR*), an optional left scene
   (bdL*), plus left-column controls (table, chip rows, readout, input, equation, message). */
(function(){
  const V='#7048e8', VL='#b197fc', VXL='#e5dbff', N='#dee2e6', AX='#868e96', INK='#212529',
        G='#40c057', GI='#2b8a3e', R='#fa5252', RI='#c92a2a', GR='#ced4da';
  let K=0; const key=()=>'b'+(++K);
  const Sc=(vb,maxW,maxH)=>({vb, maxW:maxW||'390px', maxH:maxH||'340px', rects:[], paths:[], lines:[], circles:[], texts:[], hitR:[], hitC:[]});
  const rect=(s,x,y,w,h,f,o={})=>s.rects.push({key:key(),x,y,w,h,rx:o.rx||0,f,s:o.s||'none',sw:o.sw||0,d:o.d||'',o:o.o==null?1:o.o});
  const path=(s,d,f,o={})=>s.paths.push({key:key(),dd:d,f,s:o.s||'none',sw:o.sw||0,d:o.d||'',o:o.o==null?1:o.o,tap:o.tap||null,cur:o.tap?'pointer':'default'});
  const line=(s,x1,y1,x2,y2,c,w,o={})=>s.lines.push({key:key(),x1,y1,x2,y2,c,w:w||1,d:o.d||'',o:o.o==null?1:o.o});
  const circ=(s,cx,cy,r,f,o={})=>s.circles.push({key:key(),cx,cy,r,f,s:o.s||'none',sw:o.sw||0,d:o.d||'',o:o.o==null?1:o.o});
  const text=(s,x,y,t,o={})=>s.texts.push({key:key(),x,y,t:String(t),a:o.a||'middle',fs:o.fs||14,fw:o.fw||700,f:o.f||'#495057'});
  const hitR=(s,x,y,w,h,tap,down,cur)=>s.hitR.push({key:key(),x,y,w,h,tap:tap||null,down:down||null,cur:cur||'pointer'});
  /* Drag a value along the svg's y axis: maps pointer y to viewBox y and reports every change */
  const dragXY=(e,onP)=>{ e.preventDefault(); const svg=e.currentTarget.ownerSVGElement||e.currentTarget; const m=svg.getScreenCTM&&svg.getScreenCTM(); if(!m) return;
    const inv=m.inverse(), pt=svg.createSVGPoint(); const toP=ev=>{ pt.x=ev.clientX; pt.y=ev.clientY; const p=pt.matrixTransform(inv); return [p.x,p.y]; };
    onP(toP(e)); const mv=ev=>onP(toP(ev));
    const up=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); window.removeEventListener('pointercancel',up); };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up); };
  const dragY=(e,onY)=>{ e.preventDefault(); const svg=e.currentTarget.ownerSVGElement||e.currentTarget; const m=svg.getScreenCTM&&svg.getScreenCTM(); if(!m) return;
    const inv=m.inverse(), pt=svg.createSVGPoint(); const toY=cy=>{ pt.x=0; pt.y=cy; return pt.matrixTransform(inv).y; };
    onY(toY(e.clientY)); const mv=ev=>onY(toY(ev.clientY));
    const up=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); window.removeEventListener('pointercancel',up); };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up); };
  const hitC=(s,cx,cy,r,tap)=>s.hitC.push({key:key(),cx,cy,r,tap,down:null,cur:'pointer'});
  const poly=pts=>'M'+pts.map(p=>p.join(',')).join(' L')+' Z';
  const SCENE_KEYS=['rects','paths','lines','circles','texts','hitR','hitC'];
  /* An HTML input laid over a table cell, positioned in % of the scene's viewBox. */
  const cellInput=(b,vb,x,y,w,h,o)=>{ const [, , vw, vh]=vb.split(/\s+/).map(Number);
    Object.assign(b,{bdRInOn:true, bdRInL:(x/vw*100).toFixed(2)+'%', bdRInT:(y/vh*100).toFixed(2)+'%', bdRInW:(w/vw*100).toFixed(2)+'%', bdRInH:(h/vh*100).toFixed(2)+'%', bdRInFs:(16/vw*100).toFixed(3)+'cqw'}, o); };
  const out=(b,P,s)=>{ const [, , vw, vh]=s.vb.split(/\s+/).map(Number);
    b[P+'VB']=s.vb; b[P+'MaxW']=s.maxW; b[P+'MaxH']=s.maxH;
    b[P+'Ratio']=vw+' / '+vh; b[P+'Wrap']='min(100%, '+s.maxW+', calc('+s.maxH+' * '+(vw/vh).toFixed(4)+'))';
    SCENE_KEYS.forEach(k=>{ b[P+k[0].toUpperCase()+k.slice(1)]=s[k]; });
    /* SVG <text> can't hold template holes, so labels render as HTML over the svg, sized in cqw */
    b[P+'Labels']=s.texts.map(t=>({ key:t.key, t:t.t, f:t.f, fw:t.fw,
      lx:(t.x/vw*100).toFixed(2)+'%', ly:((t.y-t.fs*0.36)/vh*100).toFixed(2)+'%',
      fs:(t.fs/vw*100).toFixed(3)+'cqw', tf: t.a==='start' ? 'translate(0,-50%)' : t.a==='end' ? 'translate(-100%,-50%)' : 'translate(-50%,-50%)' })); };
  const chip=(t,o={})=>{ const m={on:['#7950f2','#f3f0ff',INK],done:[G,'#ebfbee',GI],ok:[G,'#ebfbee',GI],bad:[R,'#fff5f5',RI],off:[N,'#f8f9fa','#adb5bd'],'':[N,'#ffffff',INK]}[o.st||''];
    return {key:key(),t,bd:m[0],bg:m[1],ink:m[2],sh:o.st==='off'?'none':'0 4px 13px rgba(120,90,200,.08)',cur:o.tap?'pointer':'default',tap:o.tap||(()=>{}),hasIc:!!o.ic,ic:o.ic||'',hasSw:!!o.sw,sw:o.sw||'transparent'}; };
  const cell=(t,o={})=>({key:key(),t:String(t),h:o.h||'48px',jc:o.jc||'center',bg:o.bg||'#ffffff',ink:o.ink||INK,bt:o.bt||'1px solid '+N,fs:o.fs||'18px',ls:o.ls||'0'});
  /* Table spec (one rule for every table in the room)
     - No row rules. Rows separate by height alone; the header sits on a grey band, a total row on its own band.
     - Type: header 13 / 700 / #495057 · row label (first column) 15 / 600 / #212529 · value 15 / 500 / #212529 · total row 15 / 700.
     - Alignment: first column left; every value column centred, and its header centred over it; inputs centred in their cell. */
  const table=(s,x0,y0,cw,rh,data,o={})=>{ const W=cw.reduce((a,b)=>a+b,0), H=rh*data.length, xs=[]; let acc=x0; cw.forEach(w=>{ xs.push(acc); acc+=w; });
    rect(s,x0,y0,W,H,'#ffffff',{rx:12,s:N,sw:1.5}); rect(s,x0+1,y0+1,W-2,rh-1,'#f1f3f5',{rx:11}); rect(s,x0+1,y0+rh/2,W-2,rh/2,'#f1f3f5');
    if(o.total!=null){ const ty=y0+o.total*rh; rect(s,x0+1,ty,W-2,rh-1,'#f8f9fa',{rx:11}); rect(s,x0+1,ty,W-2,rh/2,'#f8f9fa'); }
    (o.fills||[]).forEach(f=>rect(s, f.c==null?x0+1:xs[f.c]+4, y0+f.r*rh+4, f.c==null?W-2:cw[f.c]-8, rh-8, f.f, Object.assign({rx:8}, f.s?{s:f.s,sw:2}:{})));
    data.forEach((row,r)=>row.forEach((v,c)=>{ if(v==='') return; const head=r===0, left=c===0, tot=o.total===r, ink=(o.ink&&o.ink[r+','+c])||(head?'#495057':INK);
      text(s, left?xs[c]+16:xs[c]+cw[c]/2, y0+r*rh+rh/2+5, v, {a:left?'start':'middle', f:ink, fs:head?13:15, fw: head||tot ? 700 : left ? 600 : 500}); }));
    if(o.tap) data.forEach((row,r)=>row.forEach((v,c)=>{ if(r>0&&c>0&&(o.tapRows==null||o.tapRows.indexOf(r)>=0)) hitR(s,xs[c],y0+r*rh,cw[c],rh,()=>o.tap(r,c)); }));
    return {xs, W, H}; };
  const ZONE={bars:['panel','Drag'],readbar:['panel','Tap'],pie:['panel','Drag'],dot:['panel','Tap'],plot:['panel','Tap'],line:['panel','Tap'],
    measure:['panel','Drag'],mirror:['panel','Tap'],shade:['panel','Tap'],numline:['panel','Tap'],ttwoway:['panel','Tap'],tmissing:['panel','Type'],trule:['panel','Type'],
    readpie:['left','Tap'],linegraph:['left','Tap'],picto:['left','Tap'],mapgrid:['left','Tap'],move:['left','Tap'],tlookup:['left','Tap'],tmost:['left','Tap'],tally:['left','Type']};
  const SEEN={};
  const ZICON={Drag:'ti-hand-move',Tap:'ti-hand-finger',Type:'ti-keyboard'};
  const fmt=n=>{ if(!isFinite(n)) return '?'; const r=Math.round(n*100)/100; return (r<0?'\u2212':'')+Math.abs(r); };

  const T={data:'Data & graphs', co:'Coordinates', sh:'Shapes & constructions', na:'Number & algebra'};
  const Q=[
    {kind:'bars', topic:T.data, q:'On the chart, drag each bar up to match the data.', why:{ok:'All four bars match the table.', no:'Each bar must reach the number under its day.'}},
    {kind:'readbar', topic:T.data, q:'On the chart, tap the month that had the most rain.', why:{ok:'April had 9 cm, the tallest bar.', no:'April is the tallest bar, at 9 cm.'}},
    {kind:'pie', topic:T.data, q:'On the pie, drag the handle to show the cricket slice.', why:{ok:'20 of 40 is half the pie: 50%.', no:'Cricket is 20 of 40 students, which is half: 50%.'}},
    {kind:'readpie', topic:T.data, q:'How many of the 40 students play football?', why:{ok:'30% of 40 is 12.', no:'Football is 30% of 40 students: 12.'}},
    {kind:'linegraph', topic:T.data, wide:true, q:'The graph shows the temperature during one day. At what time was it warmest?', why:{ok:'The highest point is at 2 pm: 27\u00b0.', no:'Find the highest point on the line: 2 pm, at 27\u00b0.'}},
    {kind:'picto', topic:T.data, wide:true, q:'Each star stands for 2 books. How many books did Class B read?', why:{ok:'5 stars \u00d7 2 books = 10 books.', no:'Class B has 5 stars, and each star is 2 books: 10 books.'}},
    {kind:'tally', topic:T.data, q:'Count each fruit in the picture, then type the totals.', why:{ok:'4 apples, 3 oranges and 2 cherries.', no:'There are 4 apples, 3 oranges and 2 cherries. Tap a fruit to tick it off as you count.'}},
    {kind:'dot', topic:T.data, q:'On the number line, tap the median of this data.', why:{ok:'The middle of the 9 values is the 5th one: 5.', no:'Line the 9 values up in order; the 5th one is 5.'}},
    {kind:'plot', topic:T.co, q:'On the grid, tap to plot the point (3, 2).', why:{ok:'Across 3, then up 2.', no:'Go across 3 first, then up 2.'}},
    {kind:'line', topic:T.co, q:'On the grid, tap two points to draw y = 2x \u2212 1.', why:{ok:'It climbs 2 for every 1 across.', no:'Try x = 1 gives y = 1, and x = 3 gives y = 5.'}},
    {kind:'mapgrid', topic:T.co, wide:true, q:'How do you get from Home to School on the map?', why:{ok:'5 squares east, then 3 squares north.', no:'Count across first: 5 east. Then up: 3 north.'}},
    {kind:'move', topic:T.co, q:'Which move reflects the triangle in the orange line?', why:{ok:'A flip mirrors the shape across the line.', no:'A reflection is a flip across the mirror line.'}},
    {kind:'measure', topic:T.sh, target:130, q:'On the protractor, drag the arm to make 130\u00b0.', why:{ok:'Read from 0 on the line: 130\u00b0 is past the 90 mark.', no:'Start at 0 on the flat line and count round to 130, past 90.'}},
    {kind:'construct', topic:T.sh, q:'Construct the perpendicular bisector of AB.', why:{ok:'Same radius from A and B, more than half of AB, then join the crossings.', no:'Use one radius, more than half of AB, from both A and B, then join where the arcs cross.'}},
    {kind:'label', topic:T.sh, q:'Pick a name, then tap where it goes on the circle.', why:{ok:'Radius, chord and tangent are all in place.', no:'A tangent touches the circle once; a chord joins two points on it.'}},
    {kind:'mirror', topic:T.sh, q:'On the grid, shade squares to complete the mirror image.', why:{ok:'Both halves match across the line.', no:'Each square needs a twin the same distance from the line.'}},
    {kind:'numline', topic:T.na, wide:true, q:'On the bar, shade \u00be.', why:{ok:'Any 3 of the 4 equal parts make \u00be.', no:'\u00be means 3 of the 4 equal parts. Shade any 3.'}},
    {kind:'shade', topic:T.na, q:'On the grid, shade \u00be of the squares.', why:{ok:'9 of 12 is the same as \u00be.', no:'\u00be of 12 squares is 9 squares.'}},
    {kind:'clock', topic:T.na, q:'Set the clock to quarter to four.', why:{ok:'Minute hand on 9, hour hand just before 4.', no:'Quarter to four: minute hand on 9, hour hand near 4.'}},
    {kind:'balance', topic:T.na, q:'Solve 3x + 5 = 20. Pick a move and apply it to both sides.', why:{ok:'Take away 5, then share by 3: x = 5.', no:'Take 5 from both sides, then divide both sides by 3: x = 5.'}},
    {kind:'tlookup', topic:T.data, q:'How many pencils did Riya buy on Tuesday?', why:{ok:'Riya\u2019s row meets the Tue column at 5.', no:'Go along Riya\u2019s row to the Tue column: 5.'}},
    {kind:'tmost', topic:T.data, q:'Which class collected the most cans?', why:{ok:'6B has the biggest number: 57.', no:'Compare every number in the Cans column: 57 is the biggest, so 6B.'}},
    {kind:'tmissing', topic:T.data, q:'The total is 60 votes. Type the missing number in the table.', why:{ok:'18 + 15 + 12 = 45, and 60 \u2212 45 = 15.', no:'Add the others: 18 + 15 + 12 = 45. Then 60 \u2212 45 = 15.'}},
    {kind:'trule', topic:T.na, wide:true, q:'Find the rule, then type the missing number in the table.', why:{ok:'Each step adds 2, so after 9 comes 11.', no:'y goes up by 2 each time: 3, 5, 7, 9, 11.'}},
    {kind:'ttwoway', topic:T.data, wide:true, q:'In the table, tap the number of girls who chose football.', why:{ok:'The Girls row meets the Football column at 11.', no:'Follow the Girls row to the Football column: 11.'}},
  ].map(q=>Object.assign({type:'board'}, q));

  const BARS=[4,6,3,5], DAYS=['Mon','Tue','Wed','Thu'];
  const RAIN=[4,3,6,9,5], MONTHS=['Jan','Feb','Mar','Apr','May'];
  const PIE_NEED=[6,3,3], PIE_COL=[V,'#4dabf7','#fab005'], PIE_NAME=['Cricket \u00b7 20','Football \u00b7 10','Chess \u00b7 10'];
  const FRUIT=[['apple',44,52],['orange',156,44],['cherry',266,66],['apple',96,156],['cherry',214,146],['orange',284,206],['apple',54,266],['orange',176,256],['apple',268,290]];
  const TALLY=[['Apple','apple','#e03131',4],['Orange','orange','#e8590c',3],['Cherry','cherry','#c2255c',2]];
  const DOTS={2:1,3:2,5:3,7:1,8:1,9:1};
  const TRI={orig:[[58,228],[126,228],[58,92]], 0:[[194,228],[262,228],[194,92]], 1:[[262,228],[194,228],[262,92]], 2:[[262,92],[194,92],[262,228]]};
  const SLOTS=[[205,138],[142,64],[266,238]], PARTS=['Radius','Chord','Tangent'];
  const MIRROR=[[2,1],[1,2],[2,2],[0,3],[1,3],[2,3],[2,4]];
  const MIRROR_T=MIRROR.map(([c,r])=>r*6+(5-c)).sort((a,b)=>a-b);
  const STEPS=[{t:'Arc from A', tool:'compass', spot:'A'},{t:'Arc from B', tool:'compass', spot:'B'},{t:'Join the crossings', tool:'ruler', spot:'X'}];
  const bal=L=>({a:L.a==null?3:L.a, b:L.b==null?5:L.b, c:L.c==null?20:L.c});
  const sgn=n=>(n<0?'\u2212':'')+Math.abs(n);
  const eqStr=({a,b,c})=>(a===1?'':a)+'x'+(b>0?' + '+b:b<0?' \u2212 '+(-b):'')+' = '+sgn(c);
  const onLine=p=>p[1]===2*p[0]-1;

  function answered(q,L){
    switch(q.kind){
      case 'bars': return Object.keys(L.h||{}).length===4;
      case 'readbar': case 'dot': case 'move': case 'linegraph': case 'picto': case 'mapgrid': case 'tlookup': case 'tmost': return L.p!=null;
      case 'numline': return (L.cells||[]).length>0;
      case 'tmissing': case 'trule': return String(L.v||'').length>0;
      case 'ttwoway': return !!L.cell;
      case 'pie': return (L.pct||0)>0;
      case 'readpie': return L.p!=null;
      case 'tally': return TALLY.every((x,i)=>(L.t||{})[i]!=null);
      case 'plot': return !!L.pt;
      case 'line': return (L.pts||[]).length===2;
      case 'measure': return !!L.moved;
      case 'construct': return !!L.line;
      case 'label': return Object.keys(L.slot||{}).length===3;
      case 'mirror': case 'shade': return (L.cells||[]).length>0;
      case 'clock': return !!L.touched;
      case 'balance': return (L.moves||0)>0;
    } return false;
  }
  function right(q,L){
    switch(q.kind){
      case 'bars': return BARS.every((v,i)=>(L.h||{})[i]===v);
      case 'readbar': return L.p===3;
      case 'linegraph': case 'picto': return L.p===1;
      case 'mapgrid': return L.p===0;
      case 'tlookup': return L.p===2;
      case 'tmost': return L.p===1;
      case 'tmissing': return Number(L.v)===15;
      case 'trule': return Number(L.v)===11;
      case 'ttwoway': return !!L.cell && L.cell[0]===2 && L.cell[1]===2;
      case 'pie': return L.pct===50;
      case 'readpie': return L.p===1;
      case 'tally': return TALLY.every((x,i)=>((L.t||{})[i]||0)===x[3]);
      case 'dot': return L.p===5;
      case 'plot': return !!L.pt && L.pt[0]===3 && L.pt[1]===2;
      case 'line': { const p=L.pts||[]; return p.length===2 && p.every(onLine); }
      case 'move': return L.p===1;
      case 'measure': return L.ang===(q.target||90);
      case 'construct': { const a=(L.arcs||{}); return !!L.line && a.A!=null && a.A===a.B && a.A>90; }
      case 'label': return [0,1,2].every(k=>(L.slot||{})[k]===k);
      case 'mirror': return (L.cells||[]).slice().sort((a,b)=>a-b).join(',')===MIRROR_T.join(',');
      case 'numline': return (L.cells||[]).length===3;
      case 'shade': return (L.cells||[]).length===9;
      case 'clock': return (L.min==null?0:L.min)===45 && (L.hr||12)===3;
      case 'balance': { const e=bal(L); return e.a===1 && e.b===0; }
    } return false;
  }
  function act(q,L,a,v){
    const tog=(arr,x)=>{ const i=arr.indexOf(x); if(i>=0) arr.splice(i,1); else arr.push(x); return arr; };
    switch(q.kind){
      case 'bars': L.h=L.h||{}; if(v[1]>0) L.h[v[0]]=v[1]; else delete L.h[v[0]]; break;
      case 'readbar': case 'dot': case 'move': case 'linegraph': case 'picto': case 'mapgrid': case 'tlookup': case 'tmost': L.p=v; break;
      case 'tmissing': case 'trule': L.v=String(v).replace(/[^0-9]/g,'').slice(0,3); break;
      case 'ttwoway': L.cell=v; break;
      case 'pie': L.pct=v; break;
      case 'readpie': L.p=v; break;
      case 'tally':
        if(a==='count'){ L.c=L.c||{}; if(L.c[v]) delete L.c[v]; else L.c[v]=true; }
        else { L.t=L.t||{}; const d=String(v[1]).replace(/[^0-9]/g,'').slice(0,2); if(d==='') delete L.t[v[0]]; else L.t[v[0]]=Number(d); }
        break;
      case 'plot': L.pt=v; break;
      case 'line': { const p=(L.pts||[]).filter(x=>!(x[0]===v[0]&&x[1]===v[1])); if(p.length===(L.pts||[]).length){ p.push(v); while(p.length>2) p.shift(); } L.pts=p; break; }
      case 'measure': L.ang=v; L.moved=true; break;
      case 'construct':
        if(a==='tool'){ L.tool=v; L.msg=''; break; }
        if(a==='radius'){ L.r=v; break; }
        if(a==='spot'){ if(L.tool!=='compass'){ L.msg='Use the compass to draw an arc.'; break; } L.arcs=Object.assign({},L.arcs||{}); L.arcs[v]=L.r||60; L.line=false; L.msg=''; break; }
        if(a==='join'){ if(L.tool!=='ruler'){ L.msg='Use the ruler to draw a line.'; break; } L.line=true; L.msg=''; break; }
        break;
      case 'label':
        if(a==='chip'){ L.sel = L.sel===v ? null : v; break; }
        L.slot=L.slot||{};
        if(L.sel==null){ delete L.slot[v]; break; }
        Object.keys(L.slot).forEach(k=>{ if(L.slot[k]===L.sel) delete L.slot[k]; });
        L.slot[v]=L.sel; L.sel=null; break;
      case 'mirror': case 'shade': case 'numline': L.cells=tog((L.cells||[]).slice(), v); break;
      case 'clock':
        if(a==='hand'){ L.hand=v; break; }
        L.touched=true; if((L.hand||'min')==='min') L.min=(v%12)*5; else L.hr=v; break;
      case 'balance': {
        if(a==='op'){ L.op=v; L.msg=''; break; }
        if(a==='num'){ L.n=v; L.msg=''; break; }
        if(a==='reset'){ delete L.a; delete L.b; delete L.c; L.prev=''; L.moves=0; L.msg=''; break; }
        const e=bal(L), before=eqStr(e), n=L.n, op=L.op;
        if(!op || !n){ L.msg='Pick a move and a number first.'; break; }
        const nx=Object.assign({},e);
        if(op==='\u2212'){ nx.b-=n; nx.c-=n; }
        else if(op==='+'){ nx.b+=n; nx.c+=n; }
        else if(op==='\u00d7'){ nx.a*=n; nx.b*=n; nx.c*=n; }
        else { if(e.a%n||e.b%n||e.c%n){ L.msg='That does not share evenly. Try another move.'; break; } nx.a/=n; nx.b/=n; nx.c/=n; }
        if(Math.abs(nx.a)>30||Math.abs(nx.b)>60||Math.abs(nx.c)>99){ L.msg='The numbers are getting big. Try Start again.'; break; }
        Object.assign(L,nx); L.prev=before; L.moves=(L.moves||0)+1; L.msg=''; L.op=null; L.n=null; break; }
    }
  }

  function defaults(){
    const b={ bdOn:false, bdPanelOn:false, bdEqOn:false, bdPrev:'', bdPrevOn:false, bdEq:'', bdTableOn:false, bdTableCols:'', bdTable:[],
      bdLeftOn:false, bdChipRows:[], bdReadOn:false, bdRead:'', bdInputOn:false, bdInputVal:'', bdInputBd:N, bdInputBg:'#ffffff', bdOnInput:()=>{}, bdUnit:'',
      bdMsgOn:false, bdPanelPad:'16px', bdPanelBg:'#ffffff', bdPanelSh:'inset 0 0 0 1px #e9ecef', bdMsg:'', bdMsgInk:'#495057', bdFieldsOn:false, bdFields:[], bdPanelAlign:'stretch', bdPanelAR:'auto',
      bdPanelRing:'none', bdPanelAnim:'none', bdPanelTagOn:false, bdLeftRing:'none', bdLeftAnim:'none', bdLeftPad:'0', bdLeftTagOn:false, bdZoneVerb:'', bdZoneIcon:'',
      bdOptsOn:false, bdOpts:[], bdTableCapOn:false, bdTableCap:'', bdRInOn:false, bdRInL:'0', bdRInT:'0', bdRInW:'0', bdRInH:'0', bdRInFs:'16px', bdRInVal:'', bdRInOnChange:()=>{}, bdRInBd:N, bdRInBg:'#ffffff', bdRInInk:INK };
    out(b,'bdR',Sc('0 0 320 300')); out(b,'bdL',Sc('0 0 480 110','480px','110px')); return b;
  }

  function vals(q,L,done,ok,act){
    const b=defaults(); b.bdOn=true; b.bdPanelOn=true;
    b.qsGridCols='auto minmax(0,540px)'; b.qsGridGap='48px'; b.qsFigOp='1'; b.qsFigTf='none'; b.qsFigDelay='0s';
    if(done){ b.qsVerdictOn=true; b.qsVerdictText= ok?'Correct':'Not quite'; b.qsVerdictBg= ok?'#ebfbee':'#fff5f5'; b.qsVerdictFg= ok?GI:RI; b.qsVerdictIcon= ok?'ti-check':'ti-x'; b.qsWhy= ok?q.why.ok:q.why.no; }
    const tone=good=>done ? (good?G:R) : V;
    /* Only when the action is on the figure, and only for the first 10s of the question. */
    { const z=ZONE[q.kind]; if(z && z[0]==='panel' && !done){ const t0=SEEN[q._i]||(SEEN[q._i]=Date.now());
        if(Date.now()-t0<10000){ b.bdZoneVerb=z[1]; b.bdZoneIcon=ZICON[z[1]]; b.bdPanelRing='inset 0 0 0 2px #7950f2'; b.bdPanelAnim=(q._i%2?'bdAttnA':'bdAttnB')+' 1.1s ease-in-out 2'; b.bdPanelTagOn=true; } } }
    /* Landscape figures: the panel widens to about half the canvas and takes a 16:10 shape. */
    if(q.wide){ b.qsGridCols='auto minmax(0,600px)'; b.bdPanelAlign='center'; b.bdPanelAR='16 / 10'; }
    /* Left-column choices stack vertically, styled like the quiz's own answer options. */
    const pick=(opts,ans)=>{ b.bdOptsOn=true; b.bdOpts=opts.map((t,i)=>{ const st= done ? (i===ans?'ok':(L.p===i?'bad':'')) : (L.p===i?'on':'');
      const m={on:['#7950f2','#f3f0ff','#7950f2','#ffffff'],ok:[G,'#ebfbee',G,'#ffffff'],bad:[R,'#fff5f5',R,'#ffffff'],'':[N,'#ffffff','#ffffff','#495057']}[st];
      return {key:'o'+i, t, letter:'ABCDE'[i], bd:m[0], bg:m[1], lBg:m[2], lInk:m[3], lBd: st?m[2]:GR, cur: done?'default':'pointer', tap: done?(()=>{}):(()=>act('pick',i))}; }); b.bdOptsList=opts; b.bdOptsAns=ans; b.bdOptsAct=i=>act('pick',i); };
    let s=Sc('0 0 320 300'), sL=null; const rows=[];
    switch(q.kind){
      case 'bars': {
        /* Content Canvas §15: no gridlines behind bars, axis 1.5 #adb5bd, ticks 14/700 #868e96,
           value label 16/700 above the mark; draggable point = white circle, 2.5 accent ring (§16). */
        const AXC='#adb5bd';
        for(let i=0;i<=6;i++){ if(i) rect(s,44,260-i*32-0.5,256,1,'#e9ecef'); line(s,38,260-i*32,44,260-i*32,AXC,1.5); text(s,30,265-i*32,i,{a:'end',f:AX,fs:14}); }
        line(s,44,260,300,260,AXC,1.5); line(s,44,40,44,260,AXC,1.5);
        const h=L.h||{};
        BARS.forEach((val,i)=>{ const x=64+i*60, hv=h[i]||0, top=260-hv*32, cx=x+20;
          if(hv) rect(s,x,top,40,hv*32,tone(hv===val));
          if(done && hv!==val) rect(s,x,260-val*32,40,val*32,'none',{s:G,sw:2,d:'6 4'});
          text(s,cx,284,DAYS[i],{f:'#495057',fs:14});
          if(done){ if(hv) text(s,cx,top-10,hv,{f:hv===val?GI:RI,fs:16}); }
          else {
            circ(s,cx,top+2.5,11,'#5f3dc4'); circ(s,cx,top,11,'#ffffff',{s:V,sw:2.5});
            text(s,cx,top-20,hv,{f:hv?'#5f3dc4':AX,fs:16});
            let last=hv; hitR(s,x-10,28,60,248,null,e=>dragY(e,y=>{ const lv=Math.max(0,Math.min(6,Math.round((260-y)/32))); if(lv!==last){ last=lv; act('bar',[i,lv]); } }),'ns-resize'); }
        });
        b.bdTableOn=true; b.bdTableCapOn=true; b.bdTableCap='Data'; b.bdTableCols='repeat(4,76px)';
        b.bdTable=[...DAYS.map(d=>cell(d,{h:'44px',bg:'#f8f9fa',ink:'#495057',bt:'none'})), ...BARS.map(v=>cell(v))];
        break; }
      case 'readbar': {
        for(let i=0;i<=5;i++){ if(i) rect(s,44,260-i*40-0.5,256,1,'#e9ecef'); line(s,38,260-i*40,44,260-i*40,'#adb5bd',1.5); text(s,30,265-i*40,i*2,{a:'end',f:AX,fs:14}); }
        line(s,44,260,300,260,'#adb5bd',1.5); line(s,44,40,44,260,'#adb5bd',1.5); text(s,20,30,'cm',{a:'start',f:AX,fs:12});
        RAIN.forEach((v,i)=>{ const x=58+i*48, h=v*20; let f = L.p===i ? V : VXL;
          if(done){ if(i===3) f=G; else if(L.p===i) f=R; }
          rect(s,x,260-h,32,h,f); text(s,x+16,284,MONTHS[i],{fs:14});
          if(done && i===3) text(s,x+16,252-h,'9 cm',{f:GI});
          if(!done) hitR(s,x-6,40,44,222,()=>act('pick',i)); });
        break; }
      case 'pie': {
        /* Build: one handle on the rim, dragged clockwise from 12 o'clock; snaps to 10% steps. */
        const cx=160, cy=150, r=118, pct=L.pct||0, col=tone(pct===50);
        const at=p=>{ const a=(p*3.6-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; };
        const disc='M'+cx+','+(cy-r)+' A'+r+','+r+' 0 1 1 '+cx+','+(cy+r)+' A'+r+','+r+' 0 1 1 '+cx+','+(cy-r)+' Z';
        path(s,disc,'#ffffff',{s:GR,sw:2});
        if(pct>=100) path(s,disc,col);
        else if(pct>0){ const [x,y]=at(pct); path(s,'M'+cx+','+cy+' L'+cx+','+(cy-r)+' A'+r+','+r+' 0 '+(pct>50?1:0)+' 1 '+x.toFixed(1)+','+y.toFixed(1)+' Z',col); }
        if(done && pct!==50) path(s,'M'+cx+','+(cy-r)+' L'+cx+','+cy+' L'+cx+','+(cy+r),'none',{s:G,sw:2.5,d:'6 5'});
        line(s,cx,cy,cx,cy-r,pct?'#ffffff':GR,2);
        const [hx,hy]=at(pct), [lx,ly]=(()=>{ const a=(pct*3.6-90)*Math.PI/180; return [cx+(r+30)*Math.cos(a), cy+(r+30)*Math.sin(a)]; })();
        if(!done){ circ(s,hx,hy+2.5,13,'#5f3dc4'); circ(s,hx,hy,13,'#ffffff',{s:V,sw:2.5});
          let last=pct; hitC(s,cx,cy,r+26,null); s.hitC.pop();
          s.hitC.push({key:key(),cx,cy,r:r+26,tap:null,down:e=>dragXY(e,([x,y])=>{ let d=(Math.atan2(x-cx,-(y-cy))*180/Math.PI+360)%360; let p=Math.round(d/36)*10;
            if(last>=80 && p<=20 && d>270) p=100; if(last>=80 && p<=10) p=100; p=Math.max(0,Math.min(100,p)); if(p!==last){ last=p; act('pct',p); } }),cur:'grab'}); }
        text(s,lx,ly+5,pct+'%',{f:done?(pct===50?GI:RI):'#5f3dc4',fs:16});
        b.bdTableOn=true; b.bdTableCapOn=true; b.bdTableCap='Data'; b.bdTableCols='150px 110px';
        const H=o=>Object.assign({h:'40px',bg:'#f8f9fa',ink:'#495057',bt:'none',fs:'14px'},o);
        b.bdTable=[cell('Sport',H({jc:'flex-start'})),cell('Students',H({jc:'flex-end'})),
          cell('Cricket',{jc:'flex-start'}),cell(20,{jc:'flex-end'}),cell('Football',{jc:'flex-start'}),cell(10,{jc:'flex-end'}),
          cell('Chess',{jc:'flex-start'}),cell(10,{jc:'flex-end'}),cell('Total',{jc:'flex-start',bt:'2px solid #495057'}),cell(40,{jc:'flex-end',bt:'2px solid #495057'})];
        break; }
      case 'readpie': {
        /* Read: a finished pie, labelled directly (§15a: start at 12, largest first, clockwise). */
        const cx=160, cy=150, r=118, SL=[['Cricket',50,V],['Football',30,'#4dabf7'],['Chess',20,'#fab005']];
        let acc=0;
        SL.forEach(([n,p,c])=>{ const a0=(acc*3.6-90)*Math.PI/180, a1=((acc+p)*3.6-90)*Math.PI/180, am=((acc+p/2)*3.6-90)*Math.PI/180;
          path(s,'M'+cx+','+cy+' L'+(cx+r*Math.cos(a0)).toFixed(1)+','+(cy+r*Math.sin(a0)).toFixed(1)+' A'+r+','+r+' 0 '+(p>50?1:0)+' 1 '+(cx+r*Math.cos(a1)).toFixed(1)+','+(cy+r*Math.sin(a1)).toFixed(1)+' Z',c,{s:'#ffffff',sw:2.5, o: done&&n!=='Football'?.45:1});
          const tx=cx+r*.58*Math.cos(am), ty=cy+r*.58*Math.sin(am);
          text(s,tx,ty-2,n,{f:'#ffffff',fs:14}); text(s,tx,ty+16,p+'%',{f:'#ffffff',fs:16}); acc+=p; });
        pick(['10 students','12 students','16 students'],1);
        break; }
      case 'linegraph': {
        s=Sc('0 0 480 300','100%','100%');
        const T=[14,17,21,25,27,24,19], X=i=>70+i*62, Yt=t=>250-(t-10)*10;
        for(let t=10;t<=30;t+=5){ if(t>10) rect(s,70,Yt(t)-0.5,380,1,'#e9ecef'); text(s,58,Yt(t)+5,t+'\u00b0',{a:'end',f:AX,fs:13}); }
        line(s,70,250,456,250,'#adb5bd',1.5); line(s,70,40,70,250,'#adb5bd',1.5);
        ['6 am','8','10','12 pm','2','4','6 pm'].forEach((l,i)=>text(s,X(i),272,l,{f:'#495057',fs:13}));
        path(s,'M'+T.map((t,i)=>X(i)+','+Yt(t)).join(' L'),'none',{s:V,sw:2.5});
        T.forEach((t,i)=>{ const hi=done&&i===4; circ(s,X(i),Yt(t),hi?8:5,hi?G:'#ffffff',{s:hi?'#ffffff':V,sw:2.5}); });
        if(done) text(s,X(4),Yt(27)-16,'27\u00b0',{f:GI,fs:15});
        pick(['12 pm','2 pm','4 pm'],1);
        break; }
      case 'picto': {
        s=Sc('0 0 480 300','100%','100%');
        const star=(cx,cy,r,f)=>{ const p=[]; for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rr=k%2?r*.45:r; p.push([ (cx+rr*Math.cos(a)).toFixed(1),(cy+rr*Math.sin(a)).toFixed(1) ]); } path(s,'M'+p.map(q=>q.join(',')).join(' L')+' Z',f); };
        star(360,38,10,'#fab005'); text(s,378,43,'= 2 books',{a:'start',f:'#495057',fs:14});
        [['Class A',4],['Class B',5],['Class C',3]].forEach(([n,c],r)=>{ const y=100+r*66, hi=done&&r===1;
          if(hi) rect(s,20,y-28,440,56,'#ebfbee',{rx:12});
          text(s,36,y+5,n,{a:'start',f:hi?GI:INK,fs:15});
          for(let k=0;k<c;k++) star(150+k*50,y,17,'#fab005');
          if(r<2) rect(s,20,y+33-0.5,440,1,'#e9ecef'); });
        pick(['5 books','10 books','12 books'],1);
        break; }
      case 'mapgrid': {
        s=Sc('0 0 480 300','100%','100%');
        const cs=40, x0=40, y0=40, P=(c,r)=>[x0+c*cs+cs/2, y0+r*cs+cs/2];
        for(let c=0;c<=10;c++) rect(s,x0+c*cs-0.5,y0,1,5*cs,'#dee2e6'); for(let r=0;r<=5;r++) rect(s,x0,y0+r*cs-0.5,10*cs,1,'#dee2e6');
        const [hx,hy]=P(1,4), [sx,sy]=P(6,1);
        if(done){ const [mx]=P(6,4); line(s,hx,hy,mx,hy,G,3,{d:'7 5'}); line(s,mx,hy,sx,sy,G,3,{d:'7 5'}); }
        path(s,'M'+(hx-13)+','+(hy-2)+' L'+hx+','+(hy-14)+' L'+(hx+13)+','+(hy-2)+' Z',V); rect(s,hx-10,hy-2,20,14,V);
        rect(s,sx-14,sy-8,28,20,'#4dabf7'); line(s,sx,sy-8,sx,sy-22,INK,2); path(s,'M'+sx+','+(sy-22)+' L'+(sx+12)+','+(sy-18)+' L'+sx+','+(sy-14)+' Z','#fa5252');
        text(s,hx,hy+30,'Home',{f:'#5f3dc4',fs:13}); text(s,sx,sy+30,'School',{f:'#1864ab',fs:13});
        path(s,'M458,70 L452,86 L464,86 Z',INK); text(s,458,62,'N',{f:INK,fs:13});
        pick(['5 east, 3 north','3 east, 5 north','5 east, 4 north'],0);
        break; }
      case 'tlookup': {
        s=Sc('0 0 320 240');
        const hiF= done ? [{r:1,c:2,f: L.p===2?'#ebfbee':'#ebfbee'}] : [];
        table(s,9,30,[92,70,70,70],46,[['Name','Mon','Tue','Wed'],['Riya','3','5','2'],['Arjun','4','2','6'],['Meera','1','4','3']],{fills:hiF, ink: done?{'1,2':GI}:{}});
        pick(['2 pencils','4 pencils','5 pencils'],2);
        break; }
      case 'tmost': {
        s=Sc('0 0 320 280');
        table(s,30,20,[150,110],46,[['Class','Cans'],['6A','42'],['6B','57'],['6C','49'],['6D','38']],{fills: done?[{r:2,f:'#ebfbee'}]:[], ink: done?{'2,0':GI,'2,1':GI}:{}});
        pick(['6A','6B','6C'],1);
        break; }
      case 'tmissing': {
        s=Sc('0 0 320 300');
        const v=L.v||'', ok15=Number(v)===15;
        table(s,30,20,[150,110],46,[['Fruit','Votes'],['Mango','18'],['Apple',''],['Banana','15'],['Grapes','12'],['Total','60']],{total:5});
        cellInput(b,'0 0 320 300',30+150+21,20+92+7,68,32,{bdRInVal:v, bdRInOnChange:e=>act('val',e.target.value), bdRInBd: done?(ok15?G:R):'#7950f2', bdRInBg: done?(ok15?'#ebfbee':'#fff5f5'):'#f3f0ff', bdRInInk: done?(ok15?GI:RI):INK});
        break; }
      case 'trule': {
        s=Sc('0 0 480 200','100%','100%');
        const v=L.v||'', ok=Number(v)===11;
        table(s,25,40,[80,70,70,70,70,70],52,[['x','1','2','3','4','5'],['y','3','5','7','9','']]);
        cellInput(b,'0 0 480 200',25+80+4*70+8,40+52+8,54,36,{bdRInVal:v, bdRInOnChange:e=>act('val',e.target.value), bdRInBd: done?(ok?G:R):'#7950f2', bdRInBg: done?(ok?'#ebfbee':'#fff5f5'):'#f3f0ff', bdRInInk: done?(ok?GI:RI):INK});
        if(done) text(s,240,180,'y = 2x + 1',{f:GI,fs:16});
        break; }
      case 'ttwoway': {
        s=Sc('0 0 480 240','100%','100%');
        const sel=L.cell, fills=[];
        if(sel){ fills.push({r:sel[0],f:'#f8f6ff'}); for(let r=1;r<=3;r++) fills.push({r,c:sel[1],f:'#f8f6ff'}); fills.push({r:sel[0],c:sel[1],f: done?(sel[0]===2&&sel[1]===2?'#ebfbee':'#fff5f5'):'#e5dbff', s: done?(sel[0]===2&&sel[1]===2?G:R):'#7950f2'}); }
        if(done && !(sel&&sel[0]===2&&sel[1]===2)) fills.push({r:2,c:2,f:'#ebfbee',s:G});
        table(s,25,30,[110,85,85,85,85],50,[['','Cricket','Football','Chess','Total'],['Boys','12','9','4','25'],['Girls','7','11','6','24'],['Total','19','20','10','49']],
          {total:3, fills, tap: done?null:(r,c)=>act('cell',[r,c]), tapRows:[1,2]});
        break; }
      case 'tally': {
        /* The picture is the data. Ticking a fruit is only a counting aid; the student sets each total. */
        s=Sc('0 0 330 340');
        FRUIT.forEach(([k,x,y],i)=>{ const on=!!(L.c||{})[i], o=on?.45:1;
          rect(s,x-28,y-28,56,56,'#ffffff',{rx:14,o});
          if(k==='apple'){ circ(s,x,y+3,16,'#fa5252',{o}); circ(s,x+6,y-15,5,'#40c057',{o}); }
          else if(k==='orange'){ circ(s,x,y+2,16,'#fd7e14',{o}); circ(s,x,y-14,3,'#2b8a3e',{o}); }
          else { line(s,x-8,y+4,x,y-16,'#2b8a3e',2,{o}); line(s,x+8,y+6,x,y-16,'#2b8a3e',2,{o}); circ(s,x-8,y+6,9,'#c2255c',{o}); circ(s,x+8,y+8,9,'#c2255c',{o}); }
          /* Tick is always drawn (hidden when off) so element keys stay stable and ticked fruits don't remount. */
          circ(s,x+24,y-24,10,'#868e96',{o:on?1:0}); text(s,x+24,y-19,'\u2713',{f:on?'#ffffff':'transparent',fs:13});
          if(!done) hitC(s,x,y,30,()=>act('count',i)); });
        const t=L.t||{};
        b.bdFieldsOn=true;
        b.bdFields=TALLY.map(([name,k,c,ans],i)=>{ const v=t[i], has=v!=null, good=has&&v===ans;
          return {key:'f'+i, name, sw:c, val: has?String(v):'', onChange:e=>act('set',[i,e.target.value]),
            bd: done ? (good?G:R) : (has?'#7950f2':'#b197fc'), bg: done ? (good?'#ebfbee':'#fff5f5') : (has?'#ffffff':'#f3f0ff'), bs: (!done&&!has)?'dashed':'solid'}; });
        if(!done) text(s,165,328,'Tap a fruit to tick it off as you count',{f:AX,fs:13,fw:600});
        break; }
      case 'dot': {
        const X=i=>30+i*26; line(s,30,220,290,220,AX,1.5);
        for(let i=0;i<=10;i++){ line(s,X(i),214,X(i),226,AX,1.5); text(s,X(i),248,i,{f:AX}); if(!done) hitR(s,X(i)-13,110,26,170,()=>act('mark',i)); }
        for(const k in DOTS) for(let j=0;j<DOTS[k];j++) circ(s,X(k),200-j*22,9,VL);
        if(done && L.p!==5) line(s,X(5),118,X(5),262,G,2,{d:'5 4'});
        if(L.p!=null){ const x=X(L.p), c=tone(L.p===5);
          path(s,`M${x},262 L${x-11},282 L${x+11},282 Z`,c); line(s,x,118,x,262,c,2,{d:'5 4'});
          rect(s,x-52,88,104,28,INK,{rx:7}); text(s,x,107,'Median = '+L.p,{f:'#ffffff'}); }
        break; }
      case 'plot': {
        s=Sc('0 0 320 310'); const P=(x,y)=>[40+x*40,280-y*40];
        for(let i=0;i<=6;i++){ rect(s,40+i*40-0.5,40,1,240,'#e9ecef'); rect(s,40,280-i*40-0.5,240,1,'#e9ecef'); text(s,40+i*40,300,i,{f:AX}); text(s,28,285-i*40,i,{a:'end',f:AX}); }
        line(s,40,280,290,280,'#adb5bd',1.5); line(s,40,30,40,280,'#adb5bd',1.5);
        if(done && !right(q,L)){ const [gx,gy]=P(3,2); circ(s,gx,gy,14,'none',{s:G,sw:2.5,d:'4 3'}); }
        if(L.pt){ const [x,y]=P(L.pt[0],L.pt[1]), c=tone(right(q,L));
          /* Before Submit only the dot shows; the read-off guides and coordinates are the feedback. */
          if(done){ line(s,x,y,x,280,c,1.5,{d:'4 4'}); line(s,40,y,x,y,c,1.5,{d:'4 4'}); rect(s,x+12,y-36,58,26,INK,{rx:6}); text(s,x+41,y-18,'('+L.pt[0]+', '+L.pt[1]+')',{f:'#ffffff',fs:13}); }
          circ(s,x,y,18,c,{o:.15}); circ(s,x,y,10,c); }
        if(!done) for(let x=0;x<=6;x++) for(let y=0;y<=6;y++){ const [px,py]=P(x,y); hitC(s,px,py,15,()=>act('pt',[x,y])); }
        if(done){ b.bdFbNote='You placed ('+L.pt[0]+', '+L.pt[1]+')'; }
        break; }
      case 'line': {
        const ox=60, oy=240, st=36, P=(x,y)=>[ox+x*st, oy-y*st];
        for(let i=0;i<=6;i++) line(s,ox+i*st,24,ox+i*st,276,N,1); for(let j=-1;j<=6;j++) line(s,ox-st,oy-j*st,ox+6*st,oy-j*st,N,1);
        line(s,ox-st,oy,ox+6*st,oy,AX,1.5); line(s,ox,24,ox,276,AX,1.5);
        for(let i=1;i<=6;i++) text(s,ox+i*st,oy+20,i,{f:AX}); for(let j=1;j<=6;j++) text(s,ox-8,oy-j*st+5,j,{a:'end',f:AX}); text(s,ox-8,oy+st+5,'\u22121',{a:'end',f:AX});
        const seg=(m,c,col,w,o)=>{ const xs=[]; const yLo=-1.2, yHi=6.4, xLo=-0.9, xHi=6.3;
          if(m===Infinity){ return; }
          let a=xLo, z=xHi; if(m!==0){ const x1=(yLo-c)/m, x2=(yHi-c)/m; a=Math.max(xLo,Math.min(x1,x2)); z=Math.min(xHi,Math.max(x1,x2)); }
          const [p1,p2]=P(a,m*a+c), [p3,p4]=P(z,m*z+c); line(s,p1,p2,p3,p4,col,w,o||{}); };
        if(done && !right(q,L)) seg(2,-1,G,2.5,{d:'6 5'});
        const pts=L.pts||[];
        if(pts.length===2){ const [[x1,y1],[x2,y2]]=pts;
          if(x1===x2){ const [a1,a2]=P(x1,-1.2),[a3,a4]=P(x1,6.4); line(s,a1,a2,a3,a4,tone(false),3); b.bdRead='That makes a vertical line'; }
          else { const m=(y2-y1)/(x2-x1), c=y1-m*x1; seg(m,c,tone(right(q,L)),3); b.bdRead='Slope '+fmt(m)+' \u00b7 crosses y at '+fmt(c); } }
        else b.bdRead = pts.length ? 'Tap one more point' : 'Tap two points on the grid';
        pts.forEach(([x,y])=>{ const [px,py]=P(x,y); circ(s,px,py,10,'#ffffff',{s:done?tone(right(q,L)):V,sw:3}); });
        if(!done) for(let x=0;x<=6;x++) for(let y=-1;y<=6;y++){ const [px,py]=P(x,y); hitC(s,px,py,14,()=>act('pt',[x,y])); }
        b.bdReadOn=true; break; }
      case 'move': {
        s=Sc('0 0 320 320');
        for(let i=0;i<=8;i++){ line(s,24+i*34,24,24+i*34,296,N,1); line(s,24,24+i*34,296,24+i*34,N,1); }
        line(s,160,16,160,304,'#e8590c',2.5,{d:'6 5'});
        path(s,poly(TRI.orig),VXL,{s:VL,sw:2});
        if(done && L.p!==1) path(s,poly(TRI[1]),'none',{s:G,sw:2.5,d:'6 5'});
        if(L.p!=null) path(s,poly(TRI[L.p]),tone(L.p===1),{o:.9});
        pick(['Slide','Flip','Turn'],1);
        break; }
      case 'measure': {
        s=Sc('0 0 320 280'); const bx=160, by=230;
        path(s,`M${bx-120},${by} A120,120 0 0 1 ${bx+120},${by} Z`,'rgba(112,72,232,.08)',{s:V,sw:1.5});
        for(let a=0;a<=180;a+=10){ const r=Math.PI*a/180, l=a%30?8:14; line(s,bx+120*Math.cos(r),by-120*Math.sin(r),bx+(120-l)*Math.cos(r),by-(120-l)*Math.sin(r),V,1.2); if(a%30===0) text(s,bx+96*Math.cos(r),by-96*Math.sin(r)+4,a,{fs:11,f:'#5f3dc4'}); }
        /* The arm is the answer: drag it round B; it snaps to 5\u00b0 and only shows its size after Submit. */
        const tgt=q.target||90, ang=L.ang==null?40:L.ang, ar=ang*Math.PI/180, ex=bx+150*Math.cos(ar), ey=by-150*Math.sin(ar), ok90=ang===tgt, c=done?(ok90?G:R):INK;
        line(s,bx,by,bx+150,by,INK,3); line(s,bx,by,ex,ey,c,3); circ(s,bx,by,4,INK);
        if(done && !ok90){ const tr=tgt*Math.PI/180; line(s,bx,by,bx+150*Math.cos(tr),by-150*Math.sin(tr),G,2,{d:'6 5'}); }
        if(done && tgt===90 && ok90) path(s,'M'+(bx+18)+','+by+' L'+(bx+18)+','+(by-18)+' L'+bx+','+(by-18),'none',{s:G,sw:2});
        text(s,bx-8,by+24,'B',{f:INK,fs:16}); text(s,bx+156,by+24,'C',{f:INK,fs:16}); text(s,bx+168*Math.cos(ar),by-168*Math.sin(ar)+5,'A',{f:INK,fs:16});
        if(done) text(s,bx+46*Math.cos(ar/2),by-46*Math.sin(ar/2)+5,ang+'\u00b0',{f:ok90?GI:RI,fs:15});
        if(!done){ circ(s,ex,ey+2.5,11,'#5f3dc4'); circ(s,ex,ey,11,'#ffffff',{s:V,sw:2.5});
          let last=ang; s.hitC.push({key:key(),cx:bx,cy:by,r:170,tap:null,cur:'grab',down:e=>dragXY(e,([x,y])=>{ let d=Math.atan2(by-y,x-bx)*180/Math.PI; if(d<-90) d=180; d=Math.max(0,Math.min(180,Math.round(d/5)*5)); if(d!==last){ last=d; act('ang',d); } })}); }
        break; }
      case 'construct': {
        /* Open task: no steps listed. The student sets the compass radius, draws arcs from any end,
           and joins crossings with the ruler. Only one radius, over half of AB, from both ends works. */
        s=Sc('0 0 320 340'); const Ax=70, Bx=250, Y=170, rad=L.r||60, arcs=L.arcs||{};
        line(s,Ax,Y,Bx,Y,INK,3); circ(s,Ax,Y,5,INK); circ(s,Bx,Y,5,INK); text(s,Ax-10,Y+24,'A',{f:INK,fs:16}); text(s,Bx+10,Y+24,'B',{f:INK,fs:16});
        const arc=(cx,r,dir)=>{ const k=70*Math.PI/180, p=(t)=>[cx+r*Math.cos(t), Y+r*Math.sin(t)];
          const [x1,y1]=p(dir===0?-k:Math.PI+k), [x2,y2]=p(dir===0?k:Math.PI-k);
          path(s,'M'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+r+','+r+' 0 0 '+(dir===0?1:0)+' '+x2.toFixed(1)+','+y2.toFixed(1),'none',{s:V,sw:2.5}); };
        if(arcs.A!=null) arc(Ax,arcs.A,0); if(arcs.B!=null) arc(Bx,arcs.B,1);
        let X=null; if(arcs.A!=null && arcs.B!=null){ const d=Bx-Ax, ra=arcs.A, rb=arcs.B, aa=(ra*ra-rb*rb+d*d)/(2*d), hh=ra*ra-aa*aa; if(hh>0){ const h=Math.sqrt(hh); X=[[Ax+aa,Y-h],[Ax+aa,Y+h]]; } }
        if(X) X.forEach(([x,y])=>circ(s,x,y,5,'#ffffff',{s:V,sw:2}));
        if(L.line && X){ const c=done?tone(right(q,L)):V; line(s,X[0][0],X[0][1]-24,X[1][0],X[1][1]+24,c,3); }
        if(done && !right(q,L)) line(s,160,40,160,300,G,2,{d:'6 5'});
        if(!done){
          hitC(s,Ax,Y,22,()=>act('spot','A')); hitC(s,Bx,Y,22,()=>act('spot','B'));
          if(X) X.forEach(([x,y])=>hitC(s,x,y,20,()=>act('join',1))); }
        rows.push([['Compass','ti-compass','compass'],['Ruler','ti-ruler-2','ruler']].map(([t,ic,id])=>chip(t,{ic, st: !done&&L.tool===id?'on':'', tap: done?null:()=>act('tool',id)})));
        /* Compass opening lives in the question column; capped at 140 so both crossings stay in view. */
        if(L.tool==='compass' || arcs.A!=null || arcs.B!=null)
          rows.push([60,80,100,120,140].map(r=>chip('r = '+r,{st: !done&&rad===r?'on':'', tap: done?null:()=>act('radius',r)})));
        if(L.msg && !done){ b.bdMsgOn=true; b.bdMsg=L.msg; b.bdMsgInk=RI; }
        break; }
      case 'label': {
        circ(s,150,160,100,'#ffffff',{s:INK,sw:2.5}); circ(s,150,160,4,INK); text(s,140,180,'O',{f:INK});
        line(s,150,160,250,160,INK,2.5); line(s,72,98,212,82,INK,2.5); line(s,40,262,300,262,INK,2.5); circ(s,150,260,4,INK);
        const slot=L.slot||{};
        SLOTS.forEach(([x,y],k)=>{ const v=slot[k];
          if(v!=null){ rect(s,x-46,y-16,92,32,done?(v===k?G:R):V,{rx:10}); text(s,x,y+5,PARTS[v],{f:'#ffffff',fs:13}); }
          else { rect(s,x-46,y-16,92,32,'#ffffff',{rx:10,s:L.sel!=null?'#7950f2':AX,sw:1.5,d:'4 3'}); text(s,x,y+5,'?',{f:AX,fs:13}); }
          if(!done) hitR(s,x-50,y-20,100,40,()=>act('slot',k)); });
        const used=Object.values(slot);
        rows.push(PARTS.map((t,i)=>chip(t,{ic:'ti-grip-vertical', st: used.indexOf(i)>=0 ? 'off' : (L.sel===i&&!done?'on':''), tap: done?null:()=>act('chip',i)})));
        if(!done && L.sel!=null){ b.bdMsgOn=true; b.bdMsg='Now tap where '+PARTS[L.sel].toLowerCase()+' goes.'; }
        break; }
      case 'mirror': {
        const cs=36, x0=52, y0=40, me=L.cells||[];
        for(let c=0;c<6;c++) for(let r=0;r<6;r++) rect(s,x0+c*cs,y0+r*cs,cs,cs,'#ffffff',{s:N,sw:1});
        MIRROR.forEach(([c,r])=>rect(s,x0+c*cs+2,y0+r*cs+2,cs-4,cs-4,VL,{rx:4}));
        me.forEach(i=>{ const c=i%6, r=Math.floor(i/6); rect(s,x0+c*cs+2,y0+r*cs+2,cs-4,cs-4,done?(MIRROR_T.indexOf(i)>=0?G:R):V,{rx:4}); });
        if(done) MIRROR_T.filter(i=>me.indexOf(i)<0).forEach(i=>{ const c=i%6, r=Math.floor(i/6); rect(s,x0+c*cs+3,y0+r*cs+3,cs-6,cs-6,'none',{rx:4,s:G,sw:2,d:'4 3'}); });
        line(s,x0+3*cs,y0-12,x0+3*cs,y0+6*cs+12,'#e8590c',2.5,{d:'6 5'});
        if(!done) for(let c=3;c<6;c++) for(let r=0;r<6;r++) hitR(s,x0+c*cs,y0+r*cs,cs,cs,()=>act('cell',r*6+c));
        b.bdReadOn=true; b.bdRead=me.length+(me.length===1?' square':' squares')+' shaded';
        break; }
      case 'numline': {
        /* Shade any 3 of 4 parts. After Submit the number line appears and marks \u00be, linking the bar to the line. */
        s=Sc('0 0 480 300','100%','100%'); const X=i=>40+i*100, me=L.cells||[], ok3=me.length===3;
        for(let i=0;i<4;i++){ const on=me.indexOf(i)>=0, f= on ? (done?(ok3?G:R):V) : '#ffffff';
          rect(s,40+i*100,done?40:90,100,56,f,{s:on?'#ffffff':GR,sw:2}); if(!done) hitR(s,40+i*100,90,100,56,()=>act('cell',i)); }
        if(!done){ text(s,240,178,me.length+' of 4 parts shaded',{f:'#495057',fs:14,fw:600}); }
        else {
          text(s,240,124,'\u00be = 3 of 4 equal parts',{f:'#495057',fs:14,fw:600});
          line(s,40,210,440,210,INK,2.5);
          for(let i=0;i<=4;i++){ line(s,X(i),198,X(i),222,INK,2.5); text(s,X(i),252,['0','\u00bc','\u00bd','\u00be','1'][i],{f:INK,fs:18}); }
          path(s,'M'+X(3)+',190 L'+(X(3)-11)+',170 L'+(X(3)+11)+',170 Z',G); circ(s,X(3),210,8,G); }
        break; }
      case 'shade': {
        s=Sc('0 0 320 240'); const me=L.cells||[];
        for(let r=0;r<3;r++) for(let c=0;c<4;c++){ const i=r*4+c, on=me.indexOf(i)>=0; rect(s,40+c*62,40+r*62,56,56,on?tone(ok):'#ffffff',{rx:8,s:on?tone(ok):N,sw:2}); if(!done) hitR(s,40+c*62,40+r*62,56,56,()=>act('cell',i)); }
        b.bdReadOn=true; b.bdRead=me.length+' of 12 shaded';
        break; }
      case 'clock': {
        const cx=160, cy=150, r=118, hr=L.hr||12, mn=L.min==null?0:L.min, hand=L.hand||'min';
        circ(s,cx,cy,r,'#ffffff',{s:INK,sw:3});
        for(let i=0;i<60;i++){ const a=i*6*Math.PI/180, l=i%5?6:12; line(s,cx+(r-4)*Math.sin(a),cy-(r-4)*Math.cos(a),cx+(r-4-l)*Math.sin(a),cy-(r-4-l)*Math.cos(a),i%5?AX:INK,i%5?1:2.5); }
        for(let h=1;h<=12;h++){ const a=h*30*Math.PI/180, x=cx+(r-30)*Math.sin(a), y=cy-(r-30)*Math.cos(a); text(s,x,y+6,h,{f:INK,fs:16}); if(!done) hitC(s,x,y,18,()=>act('num',h)); }
        const hA=((hr%12)+mn/60)*30*Math.PI/180, mA=mn*6*Math.PI/180;
        const hc=done?tone(ok):INK, mc=done?tone(ok):V;
        line(s,cx,cy,cx+60*Math.sin(hA),cy-60*Math.cos(hA),hc,6); line(s,cx,cy,cx+92*Math.sin(mA),cy-92*Math.cos(mA),mc,4);
        if(!done){ const a=hand==='min'?mA:hA, l=hand==='min'?92:60; circ(s,cx+l*Math.sin(a),cy-l*Math.cos(a),10,'#ffffff',{s:V,sw:3}); }
        circ(s,cx,cy,6,INK);
        rows.push([['Minute hand','min'],['Hour hand','hr']].map(([t,id])=>chip(t,{st: !done&&hand===id?'on':'', tap: done?null:()=>act('hand',id)})));
        b.bdReadOn=true; b.bdRead=hr+':'+String(mn).padStart(2,'0');
        break; }
      case 'balance': {
        /* The student chooses every move; the scale stays level because each move hits both pans. */
        const e=bal(L), cx=160, cy=150, hl=110, lx=cx-hl, rx=cx+hl;
        path(s,'M160,160 L130,282 L190,282 Z',GR); line(s,lx,cy,rx,cy,INK,4); circ(s,cx,cy,6,INK);
        const pan=x=>{ line(s,x,cy,x-44,cy+62,AX,1.5); line(s,x,cy,x+44,cy+62,AX,1.5); rect(s,x-50,cy+62,100,8,INK,{rx:4}); };
        pan(lx); pan(rx); const py=cy+62;
        const fits=e.a>=1&&e.a<=4&&e.b>=0&&e.b<=10;
        if(fits){ let ix=lx-46; for(let i=0;i<e.a;i++){ rect(s,ix,py-34,22,32,V,{rx:5}); text(s,ix+11,py-12,'x',{f:'#ffffff',fs:14}); ix+=24; }
          for(let i=0;i<e.b;i++) rect(s,ix+(i%3)*13,py-12-Math.floor(i/3)*13,11,11,'#fab005',{rx:2}); }
        else text(s,lx,py-14,eqStr(e).split(' = ')[0],{f:'#5f3dc4',fs:16});
        if(e.c>=0&&e.c<=20) for(let i=0;i<e.c;i++) rect(s,rx-46+(i%5)*19,py-15-Math.floor(i/5)*15,13,13,'#fab005',{rx:2});
        else text(s,rx,py-14,sgn(e.c),{f:'#5f3dc4',fs:16});
        if(done){ const fin=e.a===1&&e.b===0; text(s,cx,310,fin?'x = '+sgn(e.c):'x is not on its own yet',{f:fin?GI:RI,fs:16}); }
        b.bdEqOn=true; b.bdEq=eqStr(e); b.bdPrevOn=!!L.prev; b.bdPrev=L.prev||'';
        if(!done){
          rows.push(['\u2212','+','\u00d7','\u00f7'].map(o=>chip(o,{st:L.op===o?'on':'', tap:()=>act('op',o)})));
          rows.push([1,2,3,4,5,6,7,8,9].map(n=>chip(String(n),{st:L.n===n?'on':'', tap:()=>act('num',n)})));
          rows.push([chip('Apply to both sides',{ic:'ti-scale', st: L.op&&L.n?'on':'', tap:()=>act('apply',1)}), chip('Start again',{ic:'ti-rotate', tap:()=>act('reset',1)})]); }
        if(L.msg && !done){ b.bdMsgOn=true; b.bdMsg=L.msg; b.bdMsgInk=RI; }
        break; }
    }
    out(b,'bdR',s); if(sL){ out(b,'bdL',sL); b.bdLeftOn=true; }
    b.bdChipRows=rows.map((c,i)=>({key:'r'+i, chips:c}));
    if(b.bdReadOn) b.bdPanelPad='56px 16px 16px';
    /* Table-only boards: the table is the figure, no box around it. */
    if(['tlookup','tmost','tmissing','trule','ttwoway'].indexOf(q.kind)>=0){ b.bdPanelBg='transparent'; b.bdPanelSh='none'; b.bdPanelPad='0'; b.bdPanelAR='auto'; b.bdPanelRing='none'; b.bdPanelAnim='none'; b.bdPanelTagOn=false; }
    /* Nothing to show beside the board: centre the board on its own. */
    if(!(b.bdOptsOn||b.bdTableOn||b.bdLeftOn||rows.length||b.bdFieldsOn||b.bdInputOn||b.bdEqOn||b.bdMsgOn)){ b.qsGridCols='0px minmax(0,'+(q.wide?'600px':'540px')+')'; b.qsGridGap='0px'; }
    return b;
  }

  window.PracticeBoards={ set:()=>Q.filter(q=>['construct','label','clock','balance'].indexOf(q.kind)<0).map((q,i)=>Object.assign({_i:i},q)), answered, right, act, vals, defaults };
})();
