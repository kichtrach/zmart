(() => {
  const $ = id => document.getElementById(id);
  const product = $('product'), sku = $('sku'), category = $('category'), unit = $('unit'), brand = $('brand');
  const barcodeNumber = $('barcodeNumber'), barcodeValue = $('barcodeValue'), previewNumber = $('previewNumber');
  const notes = $('notes'), noteCount = $('noteCount'), stepProgress = $('stepProgress');
  let currentStep = 1;

  const setTopTitle = () => { const t=document.querySelector('.topbar-title'); if(t) t.textContent='Add New Barcode'; };
  setTopTitle();

  function nav(url){ location.href=url; }
  document.querySelector('[data-navto="home"]').onclick=()=>nav('../index.html');
  document.querySelector('[data-navto="product"]').onclick=()=>nav('categories.html');
  document.querySelector('[data-navto="barcode"]').onclick=()=>nav('barcode-management.html');
  $('topCancelBtn').onclick=$('bottomCancelBtn').onclick=()=>nav('barcode-management.html');

  product.addEventListener('change',()=>{
    const opt=product.options[product.selectedIndex];
    sku.value=opt.dataset.sku||'';
    if(opt.dataset.category) category.value=opt.dataset.category;
    if(opt.dataset.unit) unit.value=opt.dataset.unit;
    if(opt.dataset.brand) brand.value=opt.dataset.brand;
  });

  function generateNumber(){
    let n='89'; for(let i=0;i<11;i++) n += Math.floor(Math.random()*10); return n;
  }
  function updatePreview(n){ const value=(n||'8901234567890').replace(/\D/g,'').slice(0,13); previewNumber.textContent=value||'8901234567890'; barcodeValue.value=value; }
  barcodeNumber.addEventListener('input',()=>{ barcodeNumber.value=barcodeNumber.value.replace(/\D/g,''); if(document.querySelector('input[name="method"]:checked').value==='manual') updatePreview(barcodeNumber.value); });
  document.querySelectorAll('input[name="method"]').forEach(r=>r.addEventListener('change',()=>{ if(r.checked && r.value==='auto' && !barcodeNumber.value){ const n=generateNumber(); barcodeNumber.value=n; updatePreview(n); } }));
  $('generateBarcodeBtn').onclick=()=>{ const n=generateNumber(); barcodeNumber.value=n; updatePreview(n); toast('New barcode generated.'); };
  notes.addEventListener('input',()=>noteCount.textContent=notes.value.length);

  function validate(){
    if(!product.value){ toast('Please select a product.'); product.focus(); return false; }
    if(!barcodeNumber.value){ toast('Please enter or generate a barcode number.'); barcodeNumber.focus(); return false; }
    if($('barcodeType').value==='EAN-13' && barcodeNumber.value.length!==13){ toast('EAN-13 barcode number must contain 13 digits.'); barcodeNumber.focus(); return false; }
    return true;
  }
  function setStep(step){
    currentStep=Math.max(1,Math.min(4,step));
    document.querySelectorAll('.step').forEach(el=>{ const n=+el.dataset.step; el.classList.toggle('active',n===currentStep); el.classList.toggle('done',n<currentStep); });
    stepProgress.style.width=(currentStep*25)+'%';
    $('nextBtn').innerHTML=currentStep===4?'Save & Generate <i class="fa-solid fa-check"></i>':'Next <i class="fa-solid fa-chevron-right"></i>';
  }
  $('nextBtn').onclick=()=>{ if(!validate())return; if(currentStep<4){setStep(currentStep+1); if(currentStep===2) document.querySelector('.barcode-info').scrollIntoView({behavior:'smooth',block:'center'}); else if(currentStep===3) document.querySelector('.additional-section').scrollIntoView({behavior:'smooth',block:'center'}); else window.scrollTo({top:0,behavior:'smooth'});} else saveBarcode(); };

  function saveBarcode(){
    if(!validate()) return;
    updatePreview(barcodeNumber.value);
    $('savedBarcode').textContent=barcodeNumber.value;
    $('savedProduct').textContent=product.value;
    $('savedType').textContent=$('barcodeType').value;
    $('savedStatus').textContent=$('status').value;
    $('successModal').hidden=false;
  }
  $('saveGenerateBtn').onclick=saveBarcode;
  $('successClose').onclick=()=>$('successModal').hidden=true;
  $('backToBarcodesBtn').onclick=()=>nav('barcode-management.html');
  $('createAnotherBtn').onclick=()=>{ $('successModal').hidden=true; $('barcodeForm').reset(); sku.value=''; noteCount.textContent='0'; barcodeNumber.value=''; barcodeValue.value=''; previewNumber.textContent='8901234567890'; setStep(1); window.scrollTo({top:0,behavior:'smooth'}); };
  $('successModal').addEventListener('click',e=>{if(e.target===$('successModal'))$('successModal').hidden=true;});

  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),2200); }
})();
