(() => {
  const $ = id => document.getElementById(id);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const product = $('product'), sku = $('sku'), category = $('category'), unit = $('unit'), brand = $('brand');
  const barcodeNumber = $('barcodeNumber'), barcodeValue = $('barcodeValue'), previewNumber = $('previewNumber');
  const notes = $('notes'), noteCount = $('noteCount'), stepProgress = $('stepProgress');
  let currentStep = 1;

  const setTopTitle = () => { const t=document.querySelector('.topbar-title'); if(t) t.textContent='Add New Barcode'; };
  setTopTitle();
  const nav = url => { location.href=url; };
  const goBarcodeList = () => nav('barcode-management.html');
  const byText = (id, fallback='—') => { const el=$(id); return el && String(el.value||'').trim() ? String(el.value).trim() : fallback; };

  const navMap = { home:'../index.html', product:'categories.html', barcode:'barcode-management.html' };
  $$('[data-navto]').forEach(el => el.onclick = () => nav(navMap[el.dataset.navto]));
  ['topCancelBtn','bottomCancelBtn','settingsCancelBtn','step3CancelBtn','step4CancelBtn'].forEach(id=>{ const el=$(id); if(el) el.onclick=goBarcodeList; });

  product.addEventListener('change',()=>{
    const opt=product.options[product.selectedIndex];
    sku.value=opt.dataset.sku||'';
    if(opt.dataset.category) category.value=opt.dataset.category;
    if(opt.dataset.unit) unit.value=opt.dataset.unit;
    if(opt.dataset.brand) brand.value=opt.dataset.brand;
  });

  function generateNumber(){ let n='89'; for(let i=0;i<11;i++) n += Math.floor(Math.random()*10); return n; }
  function updatePreview(n){ const value=(n||'8901234567890').replace(/\D/g,'').slice(0,13); previewNumber.textContent=value||'8901234567890'; barcodeValue.value=value; }
  barcodeNumber.addEventListener('input',()=>{ barcodeNumber.value=barcodeNumber.value.replace(/\D/g,''); const r=document.querySelector('input[name="method"]:checked'); if(r && r.value==='manual') updatePreview(barcodeNumber.value); });
  $$('input[name="method"]').forEach(r=>r.addEventListener('change',()=>{ if(r.checked && r.value==='auto' && !barcodeNumber.value){ const n=generateNumber(); barcodeNumber.value=n; updatePreview(n); } }));
  $('generateBarcodeBtn').onclick=()=>{ const n=generateNumber(); barcodeNumber.value=n; updatePreview(n); toast('New barcode generated.'); };
  notes.addEventListener('input',()=>noteCount.textContent=notes.value.length);
  if($('extraNotes')) $('extraNotes').addEventListener('input',()=> $('extraNoteCount').textContent=$('extraNotes').value.length);

  function validateStep1(){
    if(!product.value){ toast('Please select a product.'); product.focus(); return false; }
    if(!barcodeNumber.value){ toast('Please enter or generate a barcode number.'); barcodeNumber.focus(); return false; }
    if($('barcodeType').value==='EAN-13' && barcodeNumber.value.length!==13){ toast('EAN-13 barcode number must contain 13 digits.'); barcodeNumber.focus(); return false; }
    return true;
  }
  function validateStep2(){
    if(!$('startNumber').value.trim()){ toast('Please enter the start number.'); $('startNumber').focus(); return false; }
    const q=Number($('generateQuantity').value||0); if(q<1){ toast('Generate quantity must be at least 1.'); $('generateQuantity').focus(); return false; }
    return true;
  }

  function setStep(step){
    currentStep=Math.max(1,Math.min(4,step));
    $$('.step').forEach(el=>{ const n=+el.dataset.step; el.classList.toggle('active',n===currentStep); el.classList.toggle('done',n<currentStep); });
    $$('.step-panel').forEach(panel=>panel.classList.toggle('active',+panel.dataset.panel===currentStep));
    stepProgress.style.width=(currentStep*25)+'%';
    if(currentStep===2) syncSettingsPreview();
    if(currentStep===3) syncStep3FromStep1();
    if(currentStep===4) renderReview();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $('nextBtn').onclick=()=>{ if(validateStep1()) setStep(2); };
  $('previousBtn').onclick=()=>setStep(1);
  $('settingsNextBtn').onclick=()=>{ if(validateStep2()) setStep(3); };
  $('step3PreviousBtn').onclick=()=>setStep(2);
  $('step3NextBtn').onclick=()=>setStep(4);
  $('step4PreviousBtn').onclick=()=>setStep(3);
  $('step4SaveBtn').onclick=()=>saveBarcode();
  $$('.step').forEach(el=>el.addEventListener('click',()=>{ const n=+el.dataset.step; if(n<currentStep) setStep(n); }));
  $$('.review-edit').forEach(btn=>btn.onclick=()=>setStep(+btn.dataset.editStep));

  const settingIds=['settingsBarcodeType','barcodeValueType','prefix','startNumber','includeCheckDigit','generateQuantity','incrementBy'];
  settingIds.forEach(id=>{ const el=$(id); if(el) el.addEventListener(el.tagName==='SELECT'||el.type==='checkbox'?'change':'input',syncSettingsPreview); });
  function onlyDigits(id){ const el=$(id); el.addEventListener('input',()=>{el.value=el.value.replace(/\D/g,''); syncSettingsPreview();}); }
  onlyDigits('prefix'); onlyDigits('startNumber');

  function barcodeRange(){
    const type=$('settingsBarcodeType').value;
    const prefix=$('prefix').value.replace(/\D/g,'');
    const start=$('startNumber').value.replace(/\D/g,'')||'0';
    const qty=Math.max(1,Number($('generateQuantity').value||1));
    const inc=Math.max(1,Number($('incrementBy').value||1));
    const total=type==='EAN-13'?13:(type==='UPC-A'?12:14);
    const check=$('includeCheckDigit').checked?1:0;
    const numLen=Math.max(1,total-prefix.length-check);
    const make=(n,digit='1') => (prefix+String(n).padStart(numLen,'0')+(check?digit:'')).slice(0,total).padEnd(total,'0');
    const startNum=Number(start)||0;
    return { type,prefix,start,total,check,numLen,qty,inc,first:make(startNum,'1'),last:make(startNum+(qty-1)*inc,'9') };
  }

  function syncSettingsPreview(){
    const r=barcodeRange();
    $('totalLength').value=r.total; $('prefixLength').value=r.prefix.length; $('numberLength').value=r.numLen;
    $('previewTypeText').textContent=r.type; $('previewPrefixText').textContent=r.prefix||'—'; $('previewStartText').textContent=r.start; $('previewLengthText').textContent=r.total;
    $('sampleDigits').textContent=r.first.split('').join(' ');
    const maxCount=9999, endNum=(Number(r.start)||0)+maxCount-1;
    const maxLast=(r.prefix+String(endNum).padStart(r.numLen,'0')+(r.check?'9':'')).slice(0,r.total);
    $('rangeInfo').innerHTML=`System will auto generate barcode from<br>${r.first} to ${maxLast}<br>(Total 9,999 barcodes)`;
  }

  function syncStep3FromStep1(){
    if(!$('extraLocation').value && $('location').value) $('extraLocation').value=$('location').value;
    if(!$('extraRack').value && $('rack').value){
      const map={'Rack A / Bin 01':'A1-R1-B2','Rack B / Bin 06':'A2-R3-B1','Rack C / Bin 12':'B1-R2-B5'};
      $('extraRack').value=map[$('rack').value]||'';
    }
    if(!$('extraExpiryDate').value && $('expiryDate').value) $('extraExpiryDate').value=$('expiryDate').value;
    if(!$('extraNotes').value && notes.value){ $('extraNotes').value=notes.value; $('extraNoteCount').textContent=notes.value.length; }
  }

  function setupUpload(id,nameId){
    const inp=$(id), out=$(nameId); if(!inp) return;
    inp.addEventListener('change',()=>{ const f=inp.files && inp.files[0]; if(!f){out.textContent='No file chosen';return;} if(f.size>2*1024*1024){ toast('File size must be 2MB or less.'); inp.value=''; out.textContent='No file chosen'; return; } out.textContent=f.name; });
  }
  setupUpload('labelTemplate','labelTemplateName'); setupUpload('productImage','productImageName');

  const item=(k,v)=>`<div class="review-item"><dt>${k}</dt><span>:</span><dd>${v||'—'}</dd></div>`;
  function renderReview(){
    const selectedProduct=product.value||'Aashirvaad Atta 5kg';
    const displayCategory=category.value||'Grocery';
    const displayUnit=unit.value ? `${unit.value}${unit.value==='Piece'?' (PCS)':''}` : 'Piece (PCS)';
    const displayBrand=brand.value||'Aashirvaad';
    const variant=$('variant').value||'Regular';
    $('reviewBarcodeDetails').innerHTML=[item('Product',selectedProduct),item('Category',displayCategory),item('SKU / Code',sku.value||'ATT5005'),item('Brand',displayBrand),item('Unit',displayUnit),item('Product Variant',variant)].join('');

    const r=barcodeRange();
    $('reviewBarcodeSettings').innerHTML=[item('Barcode Type',r.type),item('Total Length',r.total),item('Barcode Value Type',$('barcodeValueType').value),item('Prefix Length',r.prefix.length),item('Prefix',r.prefix||'—'),item('Number Length',r.numLen),item('Start Number',r.start),item('Include Check Digit',r.check?'Yes':'No')].join('');

    const cost=byText('costPrice',''); const mrp=byText('mrp','');
    $('reviewAdditionalInfo').innerHTML=[item('Location',byText('extraLocation','Main Warehouse')),item('Expiry Date',formatDate(byText('extraExpiryDate','2026-05-25'))),item('Rack / Bin',byText('extraRack','A1-R1-B2')),item('Cost Price',cost?`₹${Number(cost).toFixed(2)}`:'₹320.00'),item('Batch Number',byText('batchNumber','BATCH25052501')),item('MRP',mrp?`₹${Number(mrp).toFixed(2)}`:'₹450.00'),item('Manufacturing Date',formatDate(byText('manufacturingDate','2025-05-25'))),item('Tax Rate',byText('taxRate','5% (GST)')),item('Supplier',byText('supplier','ITC Limited')),item('UOM',byText('uom','PCS')),item('Notes',byText('extraNotes','Store in a cool and dry place.'))].join('');
    $('reviewUploads').innerHTML=[item('Label Template',$('labelTemplateName').textContent==='No file chosen'?'atta_label_template.png':$('labelTemplateName').textContent),item('Product Image',$('productImageName').textContent==='No file chosen'?'aashirvaad_atta_5kg.jpg':$('productImageName').textContent)].join('');

    $('reviewBarcodeNumber').textContent=r.first; $('reviewBarcodeType').textContent=r.type;
    $('generationSummary').innerHTML=`<dt>Generate Quantity</dt><dd>:</dd><dd>${r.qty}</dd><dt>Increment By</dt><dd>:</dd><dd>${r.inc}</dd><dt>From</dt><dd>:</dd><dd>${r.first}</dd><dt>To</dt><dd>:</dd><dd>${r.last}</dd><dt>Total Barcodes</dt><dd>:</dd><dd>${r.qty}</dd>`;
  }
  function formatDate(v){ if(!v||v==='—') return '—'; const d=new Date(v+'T00:00:00'); if(Number.isNaN(d.getTime())) return v; return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }

  function saveBarcode(){
    const r=barcodeRange();
    $('savedProduct').textContent=product.value||'Aashirvaad Atta 5kg';
    $('savedType').textContent=r.type;
    $('savedQuantity').textContent=r.qty;
    $('savedFrom').textContent=r.first;
    $('savedTo').textContent=r.last;
    $('successModal').hidden=false;
    buildPrintPreview(r);
  }
  $('saveGenerateBtn').onclick=()=>{ if(currentStep===1){ if(validateStep1()) setStep(2); } else if(currentStep===2){ if(validateStep2()) setStep(3); } else if(currentStep===3){ setStep(4); } else saveBarcode(); };
  $('successClose').onclick=()=> $('successModal').hidden=true;
  $('viewBarcodeListBtn').onclick=goBarcodeList;
  $('doneBtn').onclick=goBarcodeList;
  $('printBarcodesBtn').onclick=()=>{ $('successModal').hidden=true; $('printModal').hidden=false; };

  let printPreviewState={page:1,perPage:20,expanded:false,range:null};
  function makeBarcodeDigits(r,index){
    const base=Number(r.start)||0;
    const n=base+index*r.inc;
    return (r.prefix+String(n).padStart(r.numLen,'0')+(r.check?String((index%9)+1):'')).slice(0,r.total).padEnd(r.total,'0');
  }
  function renderPrintPreviewPage(){
    const r=printPreviewState.range||barcodeRange();
    const totalPages=Math.max(1,Math.ceil(r.qty/printPreviewState.perPage));
    printPreviewState.page=Math.min(Math.max(1,printPreviewState.page),totalPages);
    const start=(printPreviewState.page-1)*printPreviewState.perPage;
    const count=Math.min(printPreviewState.perPage,r.qty-start);
    const visibleCount=printPreviewState.expanded?count:Math.min(8,count);
    const grid=$('labelGrid'); if(!grid) return; grid.innerHTML='';
    for(let i=0;i<visibleCount;i++){
      const digits=makeBarcodeDigits(r,start+i);
      const div=document.createElement('div'); div.className='barcode-label'; div.innerHTML=`<div class="mini-bars"></div><strong>${digits}</strong>`; grid.appendChild(div);
    }
    $('previewPage').value=printPreviewState.page;
    $('previewTotalPages').textContent=totalPages;
    const more=$('moreLabelsBtn'), text=$('moreLabelsText');
    if(count>8){
      more.hidden=false;
      more.setAttribute('aria-expanded',String(printPreviewState.expanded));
      text.innerHTML=printPreviewState.expanded?'Show less':`… …<br>and ${count-8} more`;
    }else more.hidden=true;
    $('previewFirst').disabled=$('previewPrev').disabled=printPreviewState.page===1;
    $('previewLast').disabled=$('previewNext').disabled=printPreviewState.page===totalPages;
  }
  function buildPrintPreview(r=barcodeRange()){
    $('allCount').textContent=r.qty; $('previewCount').textContent=r.qty; $('printFrom').value=r.first; $('printTo').value=r.last;
    printPreviewState={page:1,perPage:20,expanded:false,range:r};
    renderPrintPreviewPage();
  }
  $('moreLabelsBtn').onclick=()=>{ printPreviewState.expanded=!printPreviewState.expanded; renderPrintPreviewPage(); };
  $('previewFirst').onclick=()=>{printPreviewState.page=1;printPreviewState.expanded=false;renderPrintPreviewPage();};
  $('previewPrev').onclick=()=>{printPreviewState.page--;printPreviewState.expanded=false;renderPrintPreviewPage();};
  $('previewNext').onclick=()=>{printPreviewState.page++;printPreviewState.expanded=false;renderPrintPreviewPage();};
  $('previewLast').onclick=()=>{const r=printPreviewState.range||barcodeRange();printPreviewState.page=Math.max(1,Math.ceil(r.qty/printPreviewState.perPage));printPreviewState.expanded=false;renderPrintPreviewPage();};
  $('printClose').onclick=()=>$('printModal').hidden=true;
  $('printCancel').onclick=()=>$('printModal').hidden=true;
  $('printModal').addEventListener('click',e=>{ if(e.target===$('printModal')) $('printModal').hidden=true; });
  $('successModal').addEventListener('click',e=>{ if(e.target===$('successModal')) $('successModal').hidden=true; });
  $('copyMinus').onclick=()=> $('copies').value=Math.max(1,Number($('copies').value)-1);
  $('copyPlus').onclick=()=> $('copies').value=Math.min(99,Number($('copies').value)+1);
  $('confirmPrint').onclick=()=>toast('Print job prepared successfully.');
  $('downloadPdf').onclick=()=>toast('Barcode PDF prepared for download.');

  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),2200); }
  setStep(1); syncSettingsPreview();
})();
