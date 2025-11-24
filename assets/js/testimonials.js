(function(){
  const items = Array.from(document.querySelectorAll('.testimonial'));
  if(!items.length) return;

  let idx = items.findIndex(i=>i.classList.contains('active'));
  if(idx < 0) idx = 0;
  let paused = false;
  const interval = 5000;
  let t;

  function show(i){
    items.forEach((it)=> it.classList.toggle('active', Number(it.dataset.index) === i));
  }

  function next(){ idx = (idx + 1) % items.length; show(idx); }
  function prev(){ idx = (idx - 1 + items.length) % items.length; show(idx); }

  function start(){ t = setInterval(()=>{ if(!paused) next(); }, interval); }
  function stop(){ clearInterval(t); }

  // pause on hover/focus
  items.forEach(it=>{
    it.addEventListener('mouseenter', ()=> paused = true);
    it.addEventListener('mouseleave', ()=> paused = false);
    it.addEventListener('focusin', ()=> paused = true);
    it.addEventListener('focusout', ()=> paused = false);
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  start();
})();
