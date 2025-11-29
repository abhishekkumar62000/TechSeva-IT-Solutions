// Mobile and carousel enhancements for app-development page
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var slides = Array.from(document.querySelectorAll('.device-slide'));
    if(!slides || slides.length === 0) return;

    var current = 0;
    var frame = document.querySelector('.device-frame');
    var prevBtn = document.querySelector('.carousel-btn.prev');
    var nextBtn = document.querySelector('.carousel-btn.next');
    var touchStartX = 0;
    var touchEndX = 0;
    var swipeThreshold = 30; // px

    function show(index){
      current = (index + slides.length) % slides.length;
      slides.forEach(function(s, i){
        s.style.opacity = (i === current) ? '1' : '0';
        s.style.pointerEvents = (i === current) ? 'auto' : 'none';
      });
    }

    function next(){ show(current + 1); }
    function prev(){ show(current - 1); }

    if(prevBtn) prevBtn.addEventListener('click', prev);
    if(nextBtn) nextBtn.addEventListener('click', next);

    // Keyboard controls
    document.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft') prev();
      if(e.key === 'ArrowRight') next();
    });

    // Touch / swipe support on the frame
    if(frame){
      frame.addEventListener('touchstart', function(e){
        touchStartX = e.changedTouches[0].screenX;
      }, {passive:true});

      frame.addEventListener('touchmove', function(e){
        touchEndX = e.changedTouches[0].screenX;
      }, {passive:true});

      frame.addEventListener('touchend', function(){
        var dx = touchEndX - touchStartX;
        if(Math.abs(dx) > swipeThreshold){
          if(dx < 0) next(); else prev();
        }
        touchStartX = 0; touchEndX = 0;
      });

      // Also allow click on frame to advance (helpful on mobile)
      frame.addEventListener('click', function(e){
        // avoid interfering when user clicked a control
        var target = e.target;
        if(target && (target.classList.contains('carousel-btn') || target.closest('.carousel-btn'))) return;
        next();
      });
    }

    // Initialize
    show(0);

    // Floating CTA for mobile (improves conversions)
    function createFloatingCTA(){
      if(document.querySelector('.floating-cta')) return;
      var btn = document.createElement('a');
      btn.className = 'floating-cta';
      btn.href = '#contact-app';
      btn.innerHTML = '<span>Get Quote</span>';
      btn.setAttribute('aria-label', 'Get a quote');
      document.body.appendChild(btn);

      // Smooth scroll on click (minor enhancement)
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var target = document.querySelector('#contact-app');
        if(target){ target.scrollIntoView({behavior:'smooth', block:'center'}); }
      });
    }

    function removeFloatingCTA(){
      var existing = document.querySelector('.floating-cta');
      if(existing) existing.remove();
    }

    function checkCTA(){
      if(window.innerWidth <= 768){ createFloatingCTA(); } else { removeFloatingCTA(); }
    }

    checkCTA();
    window.addEventListener('resize', checkCTA);

  });
})();
