// Simple lightbox for portfolio page
(function(){
  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  const grid = qs('.portfolio-grid');
  const lightbox = qs('#lightbox');
  const lightboxImg = qs('.lightbox-img');
  const caption = qs('.lightbox-caption');
  const closeBtn = qs('.lightbox-close');
  const prevBtn = qs('.lightbox-prev');
  const nextBtn = qs('.lightbox-next');

  if(!grid || !lightbox) return;

  let currentIndex = -1;

  function open(src, title){
    // determine index from cards
    currentIndex = cards.findIndex(c => c.getAttribute('data-src') === src || c.querySelector('img')?.getAttribute('src') === src);
    lightboxImg.src = src;
    lightboxImg.alt = title || '';
    caption.textContent = title || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus close button for accessibility
    setTimeout(()=>{ closeBtn && closeBtn.focus(); }, 60);
  }

  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    caption.textContent = '';
    document.body.style.overflow = '';
    // return focus to the last opened card, if available
    if(currentIndex >= 0 && cards[currentIndex]){
      const opener = cards[currentIndex].querySelector('[data-action]') || cards[currentIndex];
      opener && opener.focus();
    }
    currentIndex = -1;
  }

  // Open from card buttons or clicking image
  qsa('.portfolio-card').forEach(card=>{
    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title');
    card.addEventListener('click', e=>{
      const action = e.target.closest('[data-action]');
      if(action) { e.preventDefault(); open(src, title); return; }
      // clicking anywhere on card opens as well
      open(src, title);
    });
  });

  // Also open when clicking images in the services gallery
  qsa('.services-gallery img').forEach(img => {
    img.addEventListener('click', e => {
      const src = img.getAttribute('src');
      const title = img.getAttribute('alt') || '';
      open(src, title);
    });
  });

  // --- Filtering & Search ---
  const filterBtns = qsa('.filter-btn');
  const searchInput = qs('#portfolio-search');
  const cards = qsa('.portfolio-card');

  function normalize(str){ return (str||'').toString().toLowerCase().trim(); }

  function applyFilter(filter){
    cards.forEach(card => {
      const cat = normalize(card.getAttribute('data-category') || 'web');
      const title = normalize(card.getAttribute('data-title') || card.querySelector('h3')?.textContent);
      const text = normalize(card.textContent || '');
      const matchesCategory = (filter === 'all') || (cat === filter);
      const query = normalize(searchInput?.value || '');
      const matchesSearch = !query || title.includes(query) || text.includes(query);
      if(matchesCategory && matchesSearch){
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      const filter = btn.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  if(searchInput){
    let t;
    searchInput.addEventListener('input', ()=>{
      clearTimeout(t);
      t = setTimeout(()=>{
        const active = qs('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        applyFilter(active);
      }, 180);
    });
  }

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox || e.target === closeBtn) close();
  });
  // keyboard handlers: Esc, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') return close();
    if(e.key === 'ArrowLeft') return prev();
    if(e.key === 'ArrowRight') return next();
  });

  // Prev / Next click handlers
  prevBtn && prevBtn.addEventListener('click', (e)=>{ e.stopPropagation(); prev(); });
  nextBtn && nextBtn.addEventListener('click', (e)=>{ e.stopPropagation(); next(); });

  // touch swipe support for mobile
  (function(){
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox && lightbox.addEventListener('touchstart', (ev)=>{ touchStartX = ev.changedTouches[0].screenX; });
    lightbox && lightbox.addEventListener('touchend', (ev)=>{ touchEndX = ev.changedTouches[0].screenX; const diff = touchStartX - touchEndX; if(Math.abs(diff) > 50){ if(diff > 0) next(); else prev(); } });
  })();

  function prev(){
    if(cards.length === 0) return;
    if(currentIndex < 0) currentIndex = cards.findIndex(c => c.querySelector('img')?.getAttribute('src') === lightboxImg.src);
    const nextIndex = (currentIndex - 1 + cards.length) % cards.length;
    const card = cards[nextIndex];
    if(card){ const src = card.getAttribute('data-src'); const title = card.getAttribute('data-title'); currentIndex = nextIndex; open(src, title); }
  }

  function next(){
    if(cards.length === 0) return;
    if(currentIndex < 0) currentIndex = cards.findIndex(c => c.querySelector('img')?.getAttribute('src') === lightboxImg.src);
    const nextIndex = (currentIndex + 1) % cards.length;
    const card = cards[nextIndex];
    if(card){ const src = card.getAttribute('data-src'); const title = card.getAttribute('data-title'); currentIndex = nextIndex; open(src, title); }
  }
})();
