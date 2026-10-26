/* Use the project's installed React/build tool. CSS and runtime must load once.
   Props connect to existing lesson logic; do not replace its event/completion API. */
import React, {useEffect,useRef,useState,useId} from 'react';
export function CanvasApplet({theme,onValueChange=()=>{}}){
 const sliderId=useId();
 const themeRef=useRef(null),viewport=useRef(null),[n,setN]=useState(3);
 useEffect(()=>window.ContentCanvas.mount(viewport.current),[]);
 useEffect(()=>{window.ContentCanvas.setTheme(themeRef.current,theme)},[theme]);
 return <div ref={themeRef} className="cc-theme" data-theme={theme}>
  <div className="cc-viewport" ref={viewport}>
   <section className="cc-board cc-center" data-board-kind="explore" data-layout="I01" data-rhythm="surface" data-band="upper" data-claim="The exponent counts repeated factors." data-role="concept">
    <h2 className="cc-title">Build a power</h2>
    <div className="cc-content cc-center" data-content>
     <div className="cc-surface cc-figure-value cc-math">2<sup><span className="cc-anchor" data-focal="" data-state="emphasis" data-cc-kind="text">{n}</span></sup> = <span className="cc-anchor" data-role="action">{2**n}</span></div>
     <p className="cc-body cc-math">{Array(n).fill('2').join(' × ')}</p>
     <p className="cc-body">The exponent counts the factors.</p>
    </div>
    <div className="cc-control" data-role="concept" style={{width:600,'--cc-pct':`${(n-1)*25}%`}}>
     <label className="cc-label" htmlFor={sliderId}>Exponent</label>
      <div className="cc-slider"><div className="cc-slider-rail"><div className="cc-slider-fill"/>
       <input id={sliderId} type="range" min="1" max="5" step="1" value={n} onChange={e=>{const v=Number(e.target.value);setN(v);onValueChange(v)}}/>
       <span className="cc-slider-thumb"/>
      </div></div>
    </div>
   </section>
  </div>
 </div>;
}

/** Reusable adapter for every registered component. Pass a resolved light/dark theme
 * on an ancestor .cc-theme. Values and state use the same schema as the HTML API. */
export function CanvasComponent({type,variant,state="default",values={},onChange}) {
 const root=useRef(null),instance=useRef(null),callback=useRef(onChange);
 callback.current=onChange;
 const valuesJSON=JSON.stringify(values);
 useEffect(()=>{
  instance.current=window.ContentCanvas.createComponent(root.current,{
   type,variant,state,values:JSON.parse(valuesJSON),
   onChange:value=>callback.current?.(value)
  });
  return()=>{instance.current?.destroy();instance.current=null;};
 },[type]);
 useEffect(()=>{
  instance.current?.update({variant,state,values:JSON.parse(valuesJSON)});
 },[variant,state,valuesJSON]);
 return <div ref={root}/>;
}

/** Valid rendering does not imply conformance - that principle stays. In the studio, conformance is
 * proven by the GATES (they validate the applet against canvas.css's own tokens), not by an in-applet
 * manifest call - so the former ContentCanvasGovernance manifest helpers are removed, not stubbed. */
