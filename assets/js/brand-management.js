(() => {
  const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=(m)=>{const t=$('#brandToast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
  const applyFilter=()=>{const q=$('#brandSearch').value.trim().toLowerCase(), st=$('#brandStatus').value, cat=$('#brandCategory').value;let visible=0;$$('#brandTable tbody tr').forEach(row=>{const okQ=!q||row.cells[1].innerText.toLowerCase().includes(q), okS=st==='All Status'||row.dataset.status===st, okC=cat==='All Categories'||row.dataset.category===cat;const ok=okQ&&okS&&okC;row.hidden=!ok;if(ok)visible++});$('#brandCount').textContent=`Showing ${visible?1:0} to ${visible} of ${visible} filtered entries`;};
  $('#brandFilter')?.addEventListener('click',applyFilter);$('#brandSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')applyFilter()});
  $('#brandReset')?.addEventListener('click',()=>{$('#brandSearch').value='';$('#brandStatus').value='All Status';$('#brandCategory').value='All Categories';$$('#brandTable tbody tr').forEach(r=>r.hidden=false);$('#brandCount').textContent='Showing 1 to 10 of 128 entries';});
  ['#addBrandTop','#qaAddBrand'].forEach(s=>$(s)?.addEventListener('click',()=>{ location.href='add-brand.html'; }));
  $('#exportBrands')?.addEventListener('click',()=>toast('Brand export prepared.')); $('#columnsBrands')?.addEventListener('click',()=>toast('Column selector opened.')); $('#qaImportBrands')?.addEventListener('click',()=>toast('Import Brands action opened.')); $('#qaBrandReport')?.addEventListener('click',()=>toast('Brand Report opened.')); $('#topBrandsViewAll')?.addEventListener('click',()=>toast('Showing all top brands.')); $('#recentViewAll')?.addEventListener('click',()=>toast('Showing all brand activities.'));
  const menu=$('#brandMenu'), modal=$('#brandActionModal'), body=$('#brandActionBody');
  let selectedRow=null, currentAction='';
  const closeMenu=()=>{if(menu)menu.hidden=true;};
  const closeModal=()=>{modal.hidden=true;currentAction='';};
  const field=(label,value,editable=false)=>`<label>${label}<input data-field="${label}" value="${String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" ${editable?'':'readonly'}></label>`;
  const openAction=(action)=>{
    if(!selectedRow)return;
    currentAction=action;closeMenu();
    const name=selectedRow.cells[1].querySelector('b')?.textContent.trim()||'',category=selectedRow.dataset.category,products=selectedRow.cells[3].textContent.trim(),status=selectedRow.dataset.status;
    const title={view:'Brand Details',edit:'Edit Brand',products:'Brand Products',status:'Change Brand Status',delete:'Delete Brand'}[action];
    $('#brandActionTitle').textContent=title;
    const save=$('#brandActionSave');save.textContent=action==='view'||action==='products'?'Close':action==='delete'?'Delete Brand':action==='status'?'Update Status':'Save Changes';
    save.classList.toggle('danger-action',action==='delete');
    if(action==='view')body.innerHTML=field('Brand Name',name)+field('Category',category)+field('Products',products)+field('Status',status);
    if(action==='edit')body.innerHTML=field('Brand Name',name,true)+`<label>Category<select data-field="Category">${[category,'Grocery','Personal Care','Home Care','Dairy','Beverages','Oral Care'].filter((v,i,a)=>a.indexOf(v)===i).map(v=>`<option>${v}</option>`).join('')}</select></label>`;
    if(action==='products')body.innerHTML=`<p><strong>${name}</strong> has <strong>${products}</strong> mapped products.</p><p>Open Product Management to view the product records.</p>`;
    if(action==='status')body.innerHTML=`<label>Status<select data-field="Status"><option ${status==='Active'?'selected':''}>Active</option><option ${status==='Inactive'?'selected':''}>Inactive</option></select></label>`;
    if(action==='delete')body.innerHTML=`<p>Delete <strong></strong> from this table? This action cannot be undone in the current page.</p>`,body.querySelector('strong').textContent=name;
    modal.hidden=false;
  };
  $$('.brand-more').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();selectedRow=btn.closest('tr');if(!menu.hidden&&menu.dataset.row===String(selectedRow.rowIndex)){closeMenu();return;}menu.dataset.row=String(selectedRow.rowIndex);menu.hidden=false;const r=btn.getBoundingClientRect(),mw=190,mh=menu.offsetHeight||210;menu.style.left=Math.max(10,Math.min(r.right-mw,innerWidth-mw-10))+'px';menu.style.top=(r.bottom+mh+8>innerHeight?Math.max(8,r.top-mh-6):r.bottom+6)+'px';}));
  menu?.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;e.stopPropagation();openAction(b.dataset.act);});
  $('#brandActionClose')?.addEventListener('click',closeModal);$('#brandActionCancel')?.addEventListener('click',closeModal);
  modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  $('#brandActionSave')?.addEventListener('click',()=>{
    if(currentAction==='edit'){
      const name=body.querySelector('[data-field="Brand Name"]').value.trim(),cat=body.querySelector('[data-field="Category"]').value;
      if(!name){toast('Brand name is required.');return;}
      selectedRow.cells[1].querySelector('b').textContent=name;selectedRow.dataset.category=cat;selectedRow.cells[2].textContent=cat;selectedRow.querySelector('.brand-more').dataset.name=name;
      toast('Brand updated.');
    }else if(currentAction==='status'){
      const status=body.querySelector('select').value;selectedRow.dataset.status=status;
      const badge=selectedRow.querySelector('.brand-status');badge.textContent=status;badge.className='brand-status '+status.toLowerCase();toast('Brand status updated.');
    }else if(currentAction==='delete'){selectedRow.remove();toast('Brand removed from table.');}
    closeModal();
  });
  document.addEventListener('click',e=>{if(!e.target.closest('#brandMenu')&&!e.target.closest('.brand-more'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeModal();}});
  $$('.pages button').forEach(b=>b.addEventListener('click',()=>{if(/^\d+$/.test(b.textContent)){ $$('.pages button').forEach(x=>x.classList.remove('active'));b.classList.add('active');toast(`Page ${b.textContent} selected.`)}}));
})();
