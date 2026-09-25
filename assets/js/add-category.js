(()=>{
  const $=s=>document.querySelector(s);
  const toast=$('#toast');
  const notify=m=>{if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(window.__catToast);window.__catToast=setTimeout(()=>toast.classList.remove('show'),2200)};
  const safe=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const sync=()=>{
    if(!$('#previewName')) return;
    $('#previewName').textContent=$('#categoryName').value.trim()||'Category Name';
    $('#previewParent').textContent=$('#parentCategory').value.startsWith('--')?'--':$('#parentCategory').value;
    $('#previewOrder').textContent=$('#displayOrder').value||'--';
    $('#previewStatus').textContent=$('#status').value;
  };
  ['#categoryName','#parentCategory','#displayOrder','#status'].forEach(id=>{const el=$(id);if(el){el.addEventListener('input',sync);el.addEventListener('change',sync)}});
  const count=(id,out,max)=>{const el=$(id),target=$(out);if(el&&target)el.addEventListener('input',()=>target.textContent=`${el.value.length}/${max}`)};
  count('#description','#descCount',255);count('#metaTitle','#metaTitleCount',60);count('#metaDescription','#metaDescriptionCount',160);count('#metaKeywords','#metaKeywordsCount',160);

  const imageFile=$('#imageFile');
  if(imageFile) imageFile.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1024*1024){notify('Image must be 5MB or smaller.');e.target.value='';return}const img=$('#previewImg');img.src=URL.createObjectURL(f);img.style.display='block';const icon=$('#imagePreview i');if(icon)icon.style.display='none';notify('Category image selected.')});
  const iconFile=$('#iconFile');
  if(iconFile) iconFile.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(f.size>2*1024*1024){notify('Icon must be 2MB or smaller.');e.target.value='';return}notify('Category icon selected.')});

  const successMarkup=data=>`<div class="category-success-wrap">
    <div class="success-hero">
      <div class="success-burst"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span><span class="dot d4"></span><span class="dot d5"></span><span class="dot d6"></span><div class="success-circle"><i class="fa-solid fa-check"></i></div></div>
      <h1>Category Saved Successfully!</h1>
      <p>The new category has been created and added to the system.</p>
    </div>
    <div class="success-summary">
      <div><span class="success-icon"><i class="fa-regular fa-folder"></i></span><small>Category Name</small><strong>${safe(data.name)}</strong></div>
      <div><span class="success-icon"><i class="fa-solid fa-sitemap"></i></span><small>Parent Category</small><strong>${safe(data.parent)}</strong></div>
      <div><span class="success-icon"><i class="fa-solid fa-arrow-down-up-across-line"></i></span><small>Display Order</small><strong>${safe(data.order)}</strong></div>
      <div><span class="success-icon"><i class="fa-solid fa-shield-halved"></i></span><small>Status</small><strong><span class="status-pill">${safe(data.status)}</span></strong></div>
    </div>
    <div class="success-actions">
      <button class="success-btn" id="addAnother"><i class="fa-solid fa-plus"></i>Add Another Category</button>
      <button class="success-btn" id="printLabel"><i class="fa-solid fa-print"></i>Print Label</button>
      <button class="success-btn primary" id="viewCategoryList"><i class="fa-solid fa-list"></i>View Category List</button>
    </div>
    <div class="or-row"><span></span><b>OR</b><span></span></div>
    <button class="go-categories" id="goCategories">Go to Categories</button>
  </div>`;

  const successSide=data=>`<section class="side-card preview-card"><h3>Category Preview</h3><div class="folder-preview"><i class="fa-regular fa-folder"></i></div><h4>${safe(data.name)}</h4><span class="status-pill">${safe(data.status)}</span><dl><dt>Parent Category</dt><dd>${safe(data.parent)}</dd><dt>Display Order</dt><dd>${safe(data.order)}</dd></dl></section>
  <section class="side-card"><h3>Quick Actions</h3><div class="success-quick-actions">
    <button id="quickAddCategory"><i class="fa-solid fa-plus"></i>Add New Category</button><button id="quickAddSub"><i class="fa-solid fa-diagram-project"></i>Add Sub Category</button><button id="quickImport"><i class="fa-solid fa-download"></i>Import Categories</button><button id="quickReport"><i class="fa-regular fa-file-lines"></i>Category Report</button><button id="quickPrint"><i class="fa-solid fa-print"></i>Print Label</button>
  </div></section>
  <section class="side-card"><div class="side-card-title"><h3>Recent Activities</h3><button id="recentViewAll">View All</button></div><div class="recent-line"><i class="fa-regular fa-circle-check"></i><div>New Category “${safe(data.name)}” added successfully<small>31 May 2025 12:35 PM</small></div></div></section>`;

  const wireSuccess=()=>{
    const nav=()=>location.href='categories.html';
    $('#addAnother')?.addEventListener('click',()=>location.href='add-category.html');
    $('#viewCategoryList')?.addEventListener('click',nav);$('#goCategories')?.addEventListener('click',nav);
    $('#printLabel')?.addEventListener('click',()=>window.print());$('#quickPrint')?.addEventListener('click',()=>window.print());
    $('#quickAddCategory')?.addEventListener('click',()=>location.href='add-category.html');
    $('#quickAddSub')?.addEventListener('click',()=>notify('Add Sub Category action selected.'));
    $('#quickImport')?.addEventListener('click',()=>notify('Import Categories action selected.'));
    $('#quickReport')?.addEventListener('click',()=>notify('Category report generated.'));
    $('#recentViewAll')?.addEventListener('click',()=>notify('Recent category activities opened.'));
  };

  const showSuccess=data=>{
    const main=$('#categoryMainCard'),side=$('#categorySideStack');if(!main||!side)return;
    main.classList.add('success-card');main.innerHTML=successMarkup(data);side.innerHTML=successSide(data);
    const actions=document.querySelector('.head-actions');if(actions)actions.style.display='none';
    sessionStorage.setItem('zmartCategoryLastSaved',JSON.stringify(data));
    wireSuccess();window.scrollTo({top:0,behavior:'smooth'});
  };

  const save=()=>{
    const name=$('#categoryName')?.value.trim()||'';
    const order=$('#displayOrder')?.value.trim()||'';
    if(!name){notify('Enter category name.');$('#categoryName')?.focus();return}
    if(!order){notify('Enter display order.');$('#displayOrder')?.focus();return}
    const parent=$('#parentCategory').value.startsWith('--')?'None':$('#parentCategory').value;
    const status=$('#status').value;
    showSuccess({name,parent,order,status});
  };
  $('#saveTop')?.addEventListener('click',save);
  $('#cancelTop')?.addEventListener('click',()=>location.href='categories.html');
  sync();
})();
