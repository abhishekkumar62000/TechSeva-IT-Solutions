(function(){
  // Offer modal interactions and print/download helpers
  const open1 = document.getElementById('openOfferBtn');
  const open2 = document.getElementById('openOfferBtn2');
  const modal = document.getElementById('offerModal');
  const close = document.getElementById('closeOffer');
  const printBtn = document.getElementById('printOffer');
  const downloadBtn = document.getElementById('downloadOfferBtn');
  const downloadLink = document.getElementById('downloadOfferLink');
  const offerContent = document.getElementById('offerContent');

  function openModal(){ if(!modal) return; modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
  function closeModal(){ if(!modal) return; modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

  if(open1) open1.addEventListener('click', openModal);
  if(open2) open2.addEventListener('click', openModal);
  if(close) close.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  // Insert current date
  const dateEl = document.getElementById('offerDate');
  if(dateEl){ const d = new Date(); dateEl.textContent = d.toLocaleDateString(); }

  // Print action: open a new window with the offer content and call print
  function printOffer(){
    if(!offerContent) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Offer Letter</title>`+
      '<style>body{font-family:Inter, Poppins, Arial, sans-serif; padding:28px; color:#111} .header{ text-align:center; margin-bottom:18px;} .content{max-width:740px; margin:0 auto;}</style></head><body>'+
      offerContent.innerHTML + '</body></html>';
    const w = window.open('','_blank');
    if(!w) return alert('Please allow popups to print or download the offer.');
    w.document.open(); w.document.write(html); w.document.close();
    // wait a tick for images to load
    setTimeout(()=>{ w.focus(); try{ w.print(); }catch(e){ /* ignore */ } }, 400);
  }

  // Download as PDF: try to use jsPDF if present, else fallback to print window
  function downloadAsPDF(){
    if(typeof window.jspdf !== 'undefined' || typeof window.jsPDF !== 'undefined' || window.jspdf){
      // try to use html2canvas + jsPDF if available — but to keep simple, open print
      printOffer();
      return;
    }
    printOffer();
  }

  if(printBtn) printBtn.addEventListener('click', printOffer);
  if(downloadBtn) downloadBtn.addEventListener('click', function(e){ e.preventDefault(); downloadAsPDF(); });
  if(downloadLink) downloadLink.addEventListener('click', function(e){ e.preventDefault(); downloadAsPDF(); });

})();
