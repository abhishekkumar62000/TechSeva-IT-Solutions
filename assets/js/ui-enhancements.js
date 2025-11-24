(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Floating contact CTA
    const cta = document.createElement('a');
    cta.setAttribute('href','mailto:info@techsevasolutions.com');
    cta.setAttribute('aria-label','Contact TechSeva');
    cta.className = 'floating-cta';
    cta.innerHTML = '<span style="display:inline-block;transform:translateY(2px);">✉️</span>';
    document.body.appendChild(cta);

    // Inject minimal styles
    const style = document.createElement('style');
    style.textContent = `
      .floating-cta{position:fixed;right:18px;bottom:18px;background:#1f7aee;color:#fff;padding:12px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,0.18);z-index:9998;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;font-size:18px}
      .floating-cta:focus{outline:3px solid #ffea75;outline-offset:2px}
      html{scroll-behavior:smooth}
    `;
    document.head.appendChild(style);

    // Smooth scroll for navbar links that point to anchors
    document.addEventListener('click', function(e){
      ```javascript
      (function(){
        document.addEventListener('DOMContentLoaded', function(){
          // Floating contact CTA
          const cta = document.createElement('a');
          cta.setAttribute('href','mailto:info@techsevasolutions.com');
          cta.setAttribute('aria-label','Contact TechSeva');
          cta.className = 'floating-cta';
          cta.innerHTML = '<span style="display:inline-block;transform:translateY(2px);">✉️</span>';
          document.body.appendChild(cta);

          // Inject minimal styles
          const style = document.createElement('style');
          style.textContent = `
            .floating-cta{position:fixed;right:18px;bottom:18px;background:#1f7aee;color:#fff;padding:12px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,0.18);z-index:9998;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;font-size:18px}
            .floating-cta:focus{outline:3px solid #ffea75;outline-offset:2px}
            html{scroll-behavior:smooth}
          `;
          document.head.appendChild(style);

          // Smooth scroll for navbar links that point to anchors
          document.addEventListener('click', function(e){
            const a = e.target.closest && e.target.closest('a');
            if(!a) return;
            const href = a.getAttribute('href') || '';
            if(href.startsWith('#')){
              e.preventDefault();
              const target = document.querySelector(href);
              if(target){ target.scrollIntoView({behavior:'smooth',block:'start'}); target.focus({preventScroll:true}); }
            }
          }, false);

          // Floating chat CTA (left) — opens Chatbase if available, otherwise falls back to mailto
          const chat = document.createElement('button');
          chat.setAttribute('aria-label','Chat with TechSeva');
          chat.className = 'floating-chat';
          chat.innerHTML = '<span style="display:inline-block;transform:translateY(2px);">💬</span>';
          chat.addEventListener('click', function(){
            const message = 'Hello, I would like to discuss a project. Please help.';
            try{
              if(window.chatbase && typeof window.chatbase === 'function'){
                // try common command names used by embed proxies
                try{ window.chatbase('open'); }catch(e){}
                try{ window.chatbase('send', message); }catch(e){}
                try{ window.chatbase('message', message); }catch(e){}
              } else {
                window.location.href = 'mailto:info@techsevasolutions.com?subject=Chat%20Request&body='+encodeURIComponent(message);
              }
            }catch(err){
              window.location.href = 'mailto:info@techsevasolutions.com?subject=Chat%20Request&body='+encodeURIComponent(message);
            }
          });
          document.body.appendChild(chat);
          // style for chat button
          const style2 = document.createElement('style');
          style2.textContent = `.floating-chat{position:fixed;left:18px;bottom:18px;background:#ff6b6b;color:#fff;padding:12px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,0.18);z-index:9999;border:0;cursor:pointer;font-size:18px}`;
          document.head.appendChild(style2);

        });
      })();

      /* Founder section interactions: reveal, tilt, social animation and modal */
      (function(){
        function initFounder(){
          const sec = document.querySelector('.founder-section');
          if(!sec) return;

          // reveal on scroll
          const io = new IntersectionObserver(entries=>{
            entries.forEach(ent=>{ if(ent.isIntersecting){ ent.target.classList.add('visible'); io.unobserve(ent.target); } });
          }, {threshold:0.18});
          io.observe(sec);

          // avatar element
          const avatar = sec.querySelector('.founder-avatar');
          // hover tilt for avatar with gentle smoothing
          if(avatar){
            let raf;
            avatar.addEventListener('mousemove', (e)=>{
              cancelAnimationFrame(raf);
              raf = requestAnimationFrame(()=>{
                const r = avatar.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2;
                const dx = (e.clientX-cx)/r.width*10; const dy = (e.clientY-cy)/r.height*10;
                avatar.style.transform = `perspective(900px) translateZ(6px) rotateX(${ -dy }deg) rotateY(${ dx }deg)`;
              });
            });
            avatar.addEventListener('mouseleave', ()=> { avatar.style.transform=''; });
            // keyboard friendly interactions
            avatar.addEventListener('focus', ()=> avatar.style.transform='translateY(-6px) scale(1.03)');
            avatar.addEventListener('blur', ()=> avatar.style.transform='');
          }

          // social icons micro-animations and entrance
          const socials = Array.from(sec.querySelectorAll('.founder-social a'));
          socials.forEach((s, idx)=>{
            // add small staggered entrance class
            setTimeout(()=> s.classList.add('enter'), 80 * idx + 120);
            s.addEventListener('mouseenter', ()=> s.animate([
              { transform: 'translateY(0) scale(1)' },
              { transform: 'translateY(-8px) scale(1.12)' },
              { transform: 'translateY(0) scale(1)' }
            ], { duration: 420, easing: 'cubic-bezier(.2,.9,.2,1)' }));
          });

          // profile modal with focus trap and Esc handling
          const openBtn = sec.querySelector('.view-profile');
          function buildModal(){
            const modal = document.createElement('div'); modal.className='founder-modal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.id='founderModal';
            modal.innerHTML = `
              <button class="close" aria-label="Close">×</button>
              <div class="founder-card" role="document">
                <figure><img src="./assets/images/founder.jpg" alt="Abhishek Yadav"></figure>
                <div class="bio">
                  <h2>Abhishek Yadav — Founder & AI/LLM Engineer</h2>
                  <p>Abhishek leads product strategy, UX, and engineering at TechSeva. He specialises in web & mobile apps, automation, and applied AI. He helps teams ship products faster and smarter.</p>
                  <p><strong>Connect:</strong> <a href="https://www.linkedin.com/in/abhishek-yadav-70a69829a" target="_blank">LinkedIn</a> · <a href="https://github.com/abhishekkumar62000" target="_blank">GitHub</a> · <a href="https://abhi-yadav.vercel.app/" target="_blank">Portfolio</a></p>
                </div>
              </div>`;
            document.body.appendChild(modal);

            // open animation class
            setTimeout(()=> modal.classList.add('open'), 20);

            // focus trap
            const focusable = modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0]; const last = focusable[focusable.length-1];
            function keyHandler(e){
              if(e.key === 'Escape'){ close(); }
              if(e.key === 'Tab'){
                if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
                else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
              }
            }

            function close(){
              modal.classList.remove('open');
              document.removeEventListener('keydown', keyHandler);
              modal.remove();
              if(openBtn) openBtn.focus();
            }

            modal.querySelector('.close').addEventListener('click', close);
            modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });
            document.addEventListener('keydown', keyHandler);

            // move focus into modal
            if(first) first.focus();
            return modal;
          }

          if(openBtn){ openBtn.addEventListener('click', (e)=>{ e.preventDefault(); const m = buildModal(); // small attention animation on the button
            openBtn.classList.add('pulse'); setTimeout(()=> openBtn.classList.remove('pulse'), 2200);
          }); }

        }

        if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(initFounder, 120); else document.addEventListener('DOMContentLoaded', initFounder);
      })();
      /* Additional UI enhancers: tilt effect, carousel and feature reveals for app-development */
      (function(){
        function initAppShowcase(){
          const cards = document.querySelectorAll('.af-card');
          cards.forEach(card=>{
            card.addEventListener('mousemove', function(e){
              const r = card.getBoundingClientRect();
              const cx = r.left + r.width/2;
              const cy = r.top + r.height/2;
              const dx = e.clientX - cx; const dy = e.clientY - cy;
              const rx = (dy / r.height) * 8; const ry = (dx / r.width) * -8;
              card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
            });
            card.addEventListener('mouseleave', function(){ card.style.transform=''; });
            // keyboard focus effect
            card.addEventListener('focus', function(){ card.classList.add('focused'); });
            card.addEventListener('blur', function(){ card.classList.remove('focused'); });
          });

          // Reveal on scroll for device slides and cards
          const io = new IntersectionObserver((entries)=>{
            entries.forEach(ent=>{
              if(ent.isIntersecting){
                ent.target.classList.add('visible');
                io.unobserve(ent.target);
              }
            });
          }, {threshold:0.18});
          document.querySelectorAll('.af-card, .device-frame').forEach(el=> io.observe(el));

          // Carousel
          const carousel = document.querySelector('.device-carousel');
          if(!carousel) return;
          const slides = carousel.querySelectorAll('.device-slide');
          let idx = 0;
          const show = (i)=>{
            slides.forEach((s,si)=>{ s.style.opacity = (si===i? '1':'0'); s.style.transform = (si===i? 'translateY(0) scale(1)':'translateY(10px) scale(.98)'); });
          };
          show(idx);
          const prev = carousel.querySelector('.carousel-btn.prev');
          const next = carousel.querySelector('.carousel-btn.next');
          prev && prev.addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; show(idx); });
          next && next.addEventListener('click', ()=>{ idx = (idx+1)%slides.length; show(idx); });
          // auto rotate with pause on hover
          let rotating = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4200);
          carousel.addEventListener('mouseenter', ()=> clearInterval(rotating));
          carousel.addEventListener('mouseleave', ()=>{ rotating = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4200); });
        }

        if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(initAppShowcase, 120); else document.addEventListener('DOMContentLoaded', initAppShowcase);
      })();

      /* UI/UX showcase interactions */
      (function(){
        function initUXShowcase(){
          const ux = document.querySelector('.ux-showcase');
          if(!ux) return;

          // carousel
          const frame = ux.querySelector('.ux-frame');
          const slides = frame.querySelectorAll('.ux-slide');
          let i = 0;
          const show = (n)=>{ slides.forEach((s,si)=>{ s.style.opacity = (si===n? '1':'0'); s.style.transform = (si===n? 'translateY(0) scale(1)':'translateY(8px) scale(.99)'); }); };
          show(i);
          ux.querySelector('.ux-btn.prev').addEventListener('click', ()=>{ i=(i-1+slides.length)%slides.length; show(i); });
          ux.querySelector('.ux-btn.next').addEventListener('click', ()=>{ i=(i+1)%slides.length; show(i); });

          // theme toggles (visual demo only)
          ux.querySelectorAll('.theme-dot').forEach(btn=>{
            btn.addEventListener('click', ()=>{
              const theme = btn.getAttribute('data-theme');
              document.documentElement.dataset.demoTheme = theme;
              // small visual demo: toggle frame background and card shadows
              if(theme==='dark'){
                frame.style.background = '#071022'; frame.querySelectorAll('.ux-slide').forEach(s=> s.style.filter='brightness(.9)');
              } else if(theme==='accent'){
                frame.style.background = 'linear-gradient(180deg,#fff,#fff)'; frame.querySelectorAll('.ux-slide').forEach(s=> s.style.filter='contrast(1.02)');
              } else { frame.style.background = '#fff'; frame.querySelectorAll('.ux-slide').forEach(s=> s.style.filter=''); }
            });
          });

          // small reveal & tilt for cards
          ux.querySelectorAll('.ux-card').forEach(c=>{
            c.addEventListener('mousemove', (e)=>{
              const r = c.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2;
              const dx=(e.clientX-cx)/r.width*10; const dy=(e.clientY-cy)/r.height*10;
              c.style.transform = `perspective(900px) rotateX(${ -dy }deg) rotateY(${ dx }deg)`;
            });
            c.addEventListener('mouseleave', ()=> c.style.transform='');
          });
        }

        if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(initUXShowcase, 160); else document.addEventListener('DOMContentLoaded', initUXShowcase);
      })();

      /* Branding showcase interactions */
      (function(){
        function initBranding(){
          const sec = document.querySelector('.branding-showcase');
          if(!sec) return;

          const frame = sec.querySelector('.brand-frame');
          const slides = frame.querySelectorAll('.brand-slide');
          let idx = 0;
          const show = (n)=>{ slides.forEach((s,i)=>{ s.style.opacity = (i===n? '1':'0'); s.style.transform = (i===n? 'translateY(0) scale(1)':'translateY(6px) scale(.995)'); }); };
          show(idx);

          const prev = sec.querySelector('.brand-btn.prev');
          const next = sec.querySelector('.brand-btn.next');
          prev && prev.addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; show(idx); });
          next && next.addEventListener('click', ()=>{ idx = (idx+1)%slides.length; show(idx); });

          // Preview Motion: small Lottie modal demo (if lottie available)
          const preview = sec.querySelector('#previewMotion');
          preview && preview.addEventListener('click', ()=>{
            const modal = document.createElement('div'); modal.className='motion-modal';
            modal.innerHTML = `<div class="motion-card"><button class="motion-close" aria-label="close">×</button><lottie-player src="https://assets6.lottiefiles.com/packages/lf20_hu9cd9.json" background="transparent" speed="1" style="width:320px;height:320px;" loop autoplay></lottie-player></div>`;
            document.body.appendChild(modal);
            modal.querySelector('.motion-close').addEventListener('click', ()=> modal.remove());
            modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.remove(); });
          });

          // small tilt on brand cards
          sec.querySelectorAll('.brand-card').forEach(c=>{
            c.addEventListener('mousemove', (e)=>{
              const r = c.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2;
              const dx=(e.clientX-cx)/r.width*8; const dy=(e.clientY-cy)/r.height*8;
              c.style.transform = `perspective(900px) rotateX(${ -dy }deg) rotateY(${ dx }deg)`;
            });
            c.addEventListener('mouseleave', ()=> c.style.transform='');
          });
        }

        if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(initBranding, 160); else document.addEventListener('DOMContentLoaded', initBranding);
      })();

      ```

        if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(initBranding, 160); else document.addEventListener('DOMContentLoaded', initBranding);
      })();

      /* Our Features: reveal, stagger and interactions */
      (function(){
        function initFeatures(){
          const list = document.querySelector('.features-list');
          if(!list) return;
          const cards = Array.from(list.querySelectorAll('.features-card'));

          // set CSS index var for stagger
          cards.forEach((c, i)=> { c.style.setProperty('--i', i); });

          // IntersectionObserver to reveal with stagger
          const io = new IntersectionObserver((entries, obs)=>{
            entries.forEach(entry=>{
              if(entry.isIntersecting){
                const visibleCards = cards.slice();
                visibleCards.forEach((card, idx)=>{
                  setTimeout(()=> card.classList.add('visible'), idx * 90);
                });
                list.setAttribute('data-animate','stagger');
                obs.disconnect();
              }
            });
          }, { threshold: 0.12 });
          io.observe(list);

          // Micro-interactions: tilt & subtle pulse on hover/tap
          cards.forEach((card)=>{
            let raf;
            card.addEventListener('mousemove', (e)=>{
              cancelAnimationFrame(raf);
              raf = requestAnimationFrame(()=>{
                const r = card.getBoundingClientRect(); const cx = r.left + r.width/2; const cy = r.top + r.height/2;
                const dx = (e.clientX - cx) / r.width; const dy = (e.clientY - cy) / r.height;
                const rx = (dy) * 6; const ry = (dx) * -8;
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
              });
            });
            card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });

            // accessible keyboard focus effects
            card.addEventListener('focus', ()=>{ card.classList.add('visible'); card.style.transform = 'translateY(-8px) scale(1.02)'; });
            card.addEventListener('blur', ()=>{ card.style.transform = ''; });
          });
        }

        if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(initFeatures, 180); else document.addEventListener('DOMContentLoaded', initFeatures);
      })();
