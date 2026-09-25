(() => {
  const $ = (s,r=document)=>r.querySelector(s);
  const toast = (message) => { const el=$('#brandToast'); if(!el)return; el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); };
  const updateCounter=(id,out,max)=>{const el=$(id),target=$(out); if(!el||!target)return; const fn=()=>target.textContent=`${el.value.length}/${max}`;el.addEventListener('input',fn);fn();};
  updateCounter('#brandDescription','#descriptionCount',255); updateCounter('#metaTitle','#metaTitleCount',60); updateCounter('#metaDescription','#metaDescriptionCount',160); updateCounter('#metaKeywords','#metaKeywordsCount',160);
  const name=$('#brandName'), category=$('#brandCategory'), status=$('#brandStatus'), order=$('#displayOrder');
  const syncPreview=()=>{ $('#previewName').textContent=name.value.trim()||'Brand Name'; $('#previewCategory').textContent=category.value||'--'; $('#previewStatus').textContent=status.value; $('#previewOrder').textContent=order.value||'--'; };
  [name,category,status,order].forEach(el=>el?.addEventListener(el.tagName==='SELECT'?'change':'input',syncPreview)); syncPreview();
  const logo=$('#brandLogo'), previewImg=$('#logoPreviewImg'), previewIcon=$('#logoPreview i');
  let logoData='';
  logo?.addEventListener('change',()=>{const file=logo.files?.[0];if(!file)return;if(file.size>2*1024*1024){toast('Logo must be 2MB or smaller.');logo.value='';return;}const reader=new FileReader();reader.onload=()=>{logoData=reader.result;previewImg.src=logoData;previewImg.style.display='block';if(previewIcon)previewIcon.style.display='none';};reader.readAsDataURL(file);});
  $('#brandBanner')?.addEventListener('change',e=>{const file=e.target.files?.[0];if(file&&file.size>5*1024*1024){toast('Banner must be 5MB or smaller.');e.target.value='';}});
  const resetForm=()=>{document.querySelector('.brand-form-card')?.querySelectorAll('input,textarea').forEach(el=>{if(el.type==='checkbox')el.checked=false;else if(el.type!=='file')el.value='';});category.value='';status.value='Active';logo.value='';$('#brandBanner').value='';logoData='';previewImg.removeAttribute('src');previewImg.style.display='none';if(previewIcon)previewIcon.style.display='block';syncPreview();['#descriptionCount','#metaTitleCount','#metaDescriptionCount','#metaKeywordsCount'].forEach((s,i)=>$(s).textContent=`0/${[255,60,160,160][i]}`);name.focus();};
  const showForm=()=>{$('#brandSuccessState').hidden=true;$('#brandFormState').hidden=false;window.scrollTo({top:0,behavior:'smooth'});};
  const fillSuccess=()=>{
    const brand=name.value.trim(); const cat=category.value; const stat=status.value; const ord=order.value;
    $('#successBrandName').textContent=brand; $('#successCategory').textContent=cat; $('#successOrder').textContent=ord; $('#successStatus').textContent=stat;
    $('#successPreviewName').textContent=brand; $('#successPreviewCategory').textContent=cat; $('#successPreviewOrder').textContent=ord; $('#successPreviewStatus').textContent=stat; $('#activityBrandName').textContent=brand;
    const img=$('#successLogoImg'), ico=$('.success-logo i'); if(logoData){img.src=logoData;img.style.display='block';if(ico)ico.style.display='none'} else {img.style.display='none';if(ico)ico.style.display='block'}
    const now=new Date(); $('#activityTime').textContent=now.toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  };
  $('#cancelBrand')?.addEventListener('click',()=>location.href='brands.html');
  $('#saveBrand')?.addEventListener('click',()=>{const brand=name.value.trim();if(!brand){toast('Enter brand name.');name.focus();return;}if(!category.value){toast('Select a category.');category.focus();return;}if(!logo.files?.length){toast('Upload a brand logo.');logo.click();return;}if(!order.value||Number(order.value)<1){toast('Enter a valid display order.');order.focus();return;}fillSuccess();$('#brandFormState').hidden=true;$('#brandSuccessState').hidden=false;window.scrollTo({top:0,behavior:'smooth'});});
  $('#addAnother')?.addEventListener('click',()=>{resetForm();showForm();});
  $('#quickAddBrand')?.addEventListener('click',()=>{resetForm();showForm();});
  $('#viewBrands')?.addEventListener('click',()=>location.href='brands.html'); $('#goBrands')?.addEventListener('click',()=>location.href='brands.html');
  $('#printLabel')?.addEventListener('click',()=>window.print()); $('#quickReport')?.addEventListener('click',()=>toast('Brand report prepared with dummy data.')); $('#quickImport')?.addEventListener('click',()=>toast('Import Brands action is ready.'));
  $('#duplicateBrand')?.addEventListener('click',()=>{const saved=$('#successBrandName').textContent;showForm();resetForm();name.value=`${saved} Copy`;category.value=$('#successCategory').textContent;status.value=$('#successStatus').textContent;order.value=$('#successOrder').textContent;syncPreview();toast('Brand duplicated. Update details and save.');});
})();
