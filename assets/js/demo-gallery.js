(function(){
  const items = Array.from(document.querySelectorAll('.wd-gallery-item'));
  if(!items.length) return;

  const lightbox = document.getElementById('demoLightbox');
  const lbImage = lightbox && lightbox.querySelector('.lb-image');
  const lbTitle = lightbox && lightbox.querySelector('.lb-title');
  const lbDesc = lightbox && lightbox.querySelector('.lb-desc');
  const btnClose = lightbox && lightbox.querySelector('.lb-close');
  const btnPrev = lightbox && lightbox.querySelector('.lb-prev');
  const btnNext = lightbox && lightbox.querySelector('.lb-next');

  const data = items.map((btn, i)=>({
    src: btn.querySelector('img') ? btn.querySelector('img').getAttribute('src') : '',
    title: btn.querySelector('.wd-caption') ? btn.querySelector('.wd-caption').textContent.trim() : ('Demo '+(i+1)),
    desc: ''
  }));

  let current = 0;

  function open(index){
    current = index;
    const d = data[current];
    if(lbImage) { lbImage.src = d.src; lbImage.alt = d.title; }
    if(lbTitle) lbTitle.textContent = d.title;
    if(lbDesc) lbDesc.textContent = d.desc;
    lightbox.setAttribute('aria-hidden','false');
    // trap focus on close
    btnClose && btnClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function close(){
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    // return focus to the originating gallery item
    const origin = items[current]; if(origin) origin.focus();
  }

  function prev(){ current = (current-1+data.length)%data.length; open(current); }
  function next(){ current = (current+1)%data.length; open(current); }

  items.forEach((el, idx)=>{
    el.addEventListener('click', ()=> open(idx));
    el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); open(idx); } });
  });

  if(btnClose) btnClose.addEventListener('click', close);
  if(btnPrev) btnPrev.addEventListener('click', prev);
  if(btnNext) btnNext.addEventListener('click', next);

  // close on outside click
  if(lightbox) lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) close(); });

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(!lightbox || lightbox.getAttribute('aria-hidden')==='true') return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });

})();
