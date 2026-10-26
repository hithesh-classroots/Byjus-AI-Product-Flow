const root=document.querySelector('.cc-theme');
// Standalone host: OS preference is read once and on change. In an embedded applet,
// replace these three lines with your host adapter calling ContentCanvas.setTheme.
const preference=matchMedia('(prefers-color-scheme: dark)');
const applyTheme=()=>ContentCanvas.setTheme(root,preference.matches?'dark':'light');
preference.addEventListener('change',applyTheme);applyTheme();
document.querySelectorAll('.cc-viewport').forEach(v=>ContentCanvas.mount(v));
const board=document.querySelector('.cc-board');
ContentCanvas.bindSlider(board.querySelector('.cc-slider'),{readout:'object',onChange:n=>{
 board.querySelector('[data-exponent]').textContent=n;
 board.querySelector('[data-product]').textContent=2**n;
 board.querySelector('[data-factors]').textContent=Array(n).fill('2').join(' × ');
}});
