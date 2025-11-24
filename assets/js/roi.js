(function(){
  // ROI / Quote modal injector
  const modalHtml = `
  <div id="roi-modal" class="roi-modal" role="dialog" aria-modal="true" aria-hidden="true" style="display:none;position:fixed;inset:0;align-items:center;justify-content:center;z-index:9999;">
    <div style="background:#fff;border-radius:10px;max-width:720px;width:94%;box-shadow:0 10px 30px rgba(0,0,0,0.2);overflow:hidden;font-family:Poppins,system-ui,sans-serif;">
      <div style="padding:18px 20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;font-size:18px">Project ROI & Quick Quote</h3>
        <button id="roi-close" aria-label="Close" style="background:transparent;border:0;font-size:20px;cursor:pointer">✕</button>
      </div>
      <div style="padding:18px;display:grid;grid-template-columns:1fr;gap:12px;">
        <label style="font-size:13px">Project Type
          <select id="roi-project" style="width:100%;padding:8px;margin-top:6px">
            <option value="Website">Website</option>
            <option value="UI/UX">UI/UX</option>
            <option value="App">App</option>
            <option value="Dashboard">Dashboard</option>
            <option value="Marketing">Digital Marketing</option>
            <option value="Automation">Business Automation</option>
            <option value="Video">Video / Content</option>
            <option value="Consulting">IT Consulting</option>
          </select>
        </label>

        <label style="font-size:13px">Monthly Visitors / Users (estimate)
          <input id="roi-visitors" type="number" min="0" value="1000" style="width:100%;padding:8px;margin-top:6px" />
        </label>

        <div style="display:flex;gap:8px;">
          <label style="flex:1;font-size:13px">Current Conversion Rate (%)
            <input id="roi-current" type="number" min="0" max="100" value="1" style="width:100%;padding:8px;margin-top:6px" />
          </label>
          <label style="flex:1;font-size:13px">Expected Conversion Rate (%)
            <input id="roi-expected" type="number" min="0" max="100" value="2" style="width:100%;padding:8px;margin-top:6px" />
          </label>
        </div>

        <label style="font-size:13px">Average Order Value (₹)
          <input id="roi-aov" type="number" min="0" value="500" style="width:100%;padding:8px;margin-top:6px" />
        </label>

        <div style="display:flex;gap:8px;align-items:center;">
          <button id="roi-calc" class="btn" style="flex:1">Calculate</button>
          <button id="roi-quote" class="btn" style="flex:1;background:#1f7aee">Request Quote</button>
        </div>

        <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
          <button id="roi-save" class="btn" style="flex:1;background:#2dca73">Save Quote</button>
          <button id="roi-download" class="btn" style="flex:1;background:#6c5ce7">Download PDF</button>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
          <button id="roi-chat" class="btn" style="flex:1;background:#ff6b6b">Chat About This</button>
        </div>

        <div id="roi-result" style="padding:12px;border:1px dashed #eee;border-radius:8px;background:#fafafa;display:none"></div>
      </div>
    </div>
  </div>`;

  document.addEventListener('DOMContentLoaded', function(){
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('roi-modal');
    const closeBtn = document.getElementById('roi-close');
    const calcBtn = document.getElementById('roi-calc');
    const quoteBtn = document.getElementById('roi-quote');
    const saveBtn = document.getElementById('roi-save');
    const downloadBtn = document.getElementById('roi-download');
    const resultBox = document.getElementById('roi-result');

    function showModal(){ modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); }
    function hideModal(){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); resultBox.style.display='none'; }

    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', function(e){ if(e.target===modal) hideModal(); });

    function compute(){
      const visitors = Number(document.getElementById('roi-visitors').value) || 0;
      const curr = Number(document.getElementById('roi-current').value) / 100 || 0;
      const expected = Number(document.getElementById('roi-expected').value) / 100 || 0;
      const aov = Number(document.getElementById('roi-aov').value) || 0;

      const currentRevenue = visitors * curr * aov;
      const expectedRevenue = visitors * expected * aov;
      const upliftMonthly = Math.max(0, expectedRevenue - currentRevenue);
      const upliftYearly = upliftMonthly * 12;

      return {
        visitors, curr, expected, aov,
        currentRevenue: Math.round(currentRevenue),
        expectedRevenue: Math.round(expectedRevenue),
        upliftMonthly: Math.round(upliftMonthly),
        upliftYearly: Math.round(upliftYearly)
      };
    }

    calcBtn.addEventListener('click', function(){
      const out = compute();
      resultBox.style.display='block';
      resultBox.innerHTML = `
        <strong>Estimated monthly revenue now:</strong> ₹${out.currentRevenue.toLocaleString()}<br/>
        <strong>Estimated monthly revenue after improvements:</strong> ₹${out.expectedRevenue.toLocaleString()}<br/>
        <strong>Estimated monthly uplift:</strong> ₹${out.upliftMonthly.toLocaleString()}<br/>
        <strong>Estimated yearly uplift:</strong> ₹${out.upliftYearly.toLocaleString()}<br/>
        <small style=\"color:#666\">Tip: Use "Request Quote" to send this summary to us — we'll follow up with a tailored plan.</small>
      `;
    });

    // Save quote locally
    saveBtn.addEventListener('click', function(){
      const out = compute();
      const proj = document.getElementById('roi-project').value;
      const now = new Date().toISOString();
      const item = { id: now, project: proj, created: now, roi: out };
      try{
        const existing = JSON.parse(localStorage.getItem('techseva_quotes') || '[]');
        existing.push(item);
        localStorage.setItem('techseva_quotes', JSON.stringify(existing));
        resultBox.style.display='block';
        resultBox.innerHTML = '<strong>Saved locally — view in your browser localStorage (key: techseva_quotes).</strong>';
      }catch(e){
        resultBox.style.display='block';
        resultBox.innerHTML = '<strong>Unable to save locally — your browser may block storage.</strong>';
      }
    });

    // Download PDF using jsPDF if available, otherwise fallback to text file
    downloadBtn.addEventListener('click', function(){
      const out = compute();
      const proj = document.getElementById('roi-project').value;
      const title = `TechSeva_Quote_${proj}_${new Date().toISOString().slice(0,10)}`;
      if(window.jspdf && window.jspdf.jsPDF){
        try{
          const doc = new window.jspdf.jsPDF();
          doc.setFontSize(14);
          doc.text('TechSeva Solutions — Quick ROI Quote', 14, 20);
          doc.setFontSize(11);
          doc.text(`Project: ${proj}`, 14, 32);
          doc.text(`Monthly visitors: ${out.visitors}`, 14, 40);
          doc.text(`Current monthly revenue: ₹${out.currentRevenue}`, 14, 48);
          doc.text(`Expected monthly revenue: ₹${out.expectedRevenue}`, 14, 56);
          doc.text(`Monthly uplift: ₹${out.upliftMonthly}`, 14, 64);
          doc.text(`Yearly uplift: ₹${out.upliftYearly}`, 14, 72);
          doc.save(title + '.pdf');
        }catch(e){
          // fallback
          const blob = new Blob([JSON.stringify({project:proj,roi:out}, null, 2)],{type:'text/plain'});
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = title + '.txt'; a.click();
        }
      } else {
        const blob = new Blob([JSON.stringify({project:proj,roi:out}, null, 2)],{type:'text/plain'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = title + '.txt'; a.click();
      }
    });

    // Chat about the quote: try opening embedded chat (Chatbase) with message, fallback to mailto
    const chatBtn = document.getElementById('roi-chat');
    if(chatBtn){
      chatBtn.addEventListener('click', function(){
        const out = compute();
        const proj = document.getElementById('roi-project').value;
        const message = `I'd like to discuss a ${proj} project.\n\nROI Summary:\n- Monthly visitors: ${out.visitors}\n- Current monthly revenue: ₹${out.currentRevenue}\n- Expected monthly revenue: ₹${out.expectedRevenue}\n- Monthly uplift: ₹${out.upliftMonthly}\n- Yearly uplift: ₹${out.upliftYearly}`;
        try{
          if(window.chatbase && typeof window.chatbase === 'function'){
            try{ window.chatbase('open'); }catch(e){}
            try{ window.chatbase('send', message); }catch(e){}
            try{ window.chatbase('message', message); }catch(e){}
          } else {
            window.location.href = 'mailto:info@techsevasolutions.com?subject='+encodeURIComponent('Chat about '+proj)+'&body='+encodeURIComponent(message);
          }
        }catch(e){
          window.location.href = 'mailto:info@techsevasolutions.com?subject='+encodeURIComponent('Chat about '+proj)+'&body='+encodeURIComponent(message);
        }
      });
    }

    quoteBtn.addEventListener('click', function(){
      const proj = document.getElementById('roi-project').value;
      const out = compute();
      const subject = `Quick Quote Request: ${proj} project`;
      const bodyPlain = `Hello TechSeva team,\n\nI'd like a quote for a ${proj} project.\n\nROI Summary:\n- Monthly visitors: ${out.visitors}\n- Current monthly revenue: ₹${out.currentRevenue}\n- Expected monthly revenue: ₹${out.expectedRevenue}\n- Monthly uplift: ₹${out.upliftMonthly}\n- Yearly uplift: ₹${out.upliftYearly}\n\nPlease share a starting estimate and next steps.\n\nThanks!`;

      // If SITE_CONFIG.FORM_ENDPOINT is set to a real endpoint, POST the quote data there first.
      const formEndpoint = (window.SITE_CONFIG && window.SITE_CONFIG.FORM_ENDPOINT) ? window.SITE_CONFIG.FORM_ENDPOINT : '';

      if(formEndpoint && !/your_form_id/.test(formEndpoint)){
        // Send JSON payload
        fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: subject, message: bodyPlain, project: proj, roi: out })
        }).then(function(resp){
          if(resp.ok){
            // show a thank you in modal
            resultBox.style.display='block';
            resultBox.innerHTML = '<strong>Thanks — your quote request was sent. We will contact you within 24 hours.</strong>';
            setTimeout(hideModal,2500);
          } else {
            // fallback to mailto
            const mailto = `mailto:info@techsevasolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;
            window.location.href = mailto;
          }
        }).catch(function(){
          const mailto = `mailto:info@techsevasolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;
          window.location.href = mailto;
        });
      } else {
        // fallback to mailto
        const mailto = `mailto:info@techsevasolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;
        window.location.href = mailto;
      }
    });

    // Intercept CTA buttons with data-mailto and open ROI modal instead (friendly)
    document.addEventListener('click', function(e){
      const el = e.target.closest && e.target.closest('[data-mailto]');
      if(!el) return;
      e.preventDefault();
      // try to extract subject from data-mailto
      const dt = el.getAttribute('data-mailto') || '';
      const m = dt.match(/subject=([^&]+)/i);
      if(m){
        try{ document.getElementById('roi-project').value = decodeURIComponent(m[1]).replace(/\+/g,' '); }catch(e){}
      }
      showModal();
    }, false);

  });

})();
