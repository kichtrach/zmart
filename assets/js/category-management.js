(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const table=$('#categoryTable'), search=$('#categorySearch'), status=$('#filterStatus'), parent=$('#filterParent'), menu=$('#categoryActionMenu'), modal=$('#categoryModal'), toast=$('#categoryToast');
  let activeName='';
  const showToast=msg=>{toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200)};
  const visibleRows=()=>$$('tbody tr',table).filter(r=>!r.hidden);
  const filterRows=()=>{const q=search.value.trim().toLowerCase(),st=status.value,pa=parent.value;$$('tbody tr',table).forEach(tr=>{const ok=(!q||tr.textContent.toLowerCase().includes(q))&&(st==='All Status'||tr.dataset.status===st)&&(pa==='All'||tr.dataset.parent===pa);tr.hidden=!ok});const n=visibleRows().length;$('#categoryCount').textContent=`Showing ${n?1:0} to ${Math.min(n,10)} of ${n} matching entries`;};
  $('#applyCategoryFilter').addEventListener('click',filterRows);search.addEventListener('keydown',e=>{if(e.key==='Enter')filterRows()});
  $('#resetCategoryFilter').addEventListener('click',()=>{search.value='';status.value='All Status';parent.value='All';$$('tbody tr',table).forEach(r=>r.hidden=false);$('#categoryCount').textContent='Showing 1 to 10 of 38 entries'});
  ['#addCategoryTop','#addCategoryQuick'].forEach(id=>$(id)?.addEventListener('click',()=>location.href='add-category.html'));
  const closeModal=()=>modal?.classList.remove('show');
  const openModal=(title='Category Details',name='')=>{if(!modal)return;$('#categoryModalTitle').textContent=title;$('#modalCategoryName').value=name;modal.classList.add('show')};
  $('#closeCategoryModal')?.addEventListener('click',closeModal);$('#cancelCategoryModal')?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  $('#categoryForm')?.addEventListener('submit',e=>{e.preventDefault();const name=$('#modalCategoryName').value.trim();if(!name)return;closeModal();showToast(`${name} saved successfully.`)});
  $$('.cat-more').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();activeName=btn.dataset.name;const r=btn.getBoundingClientRect(),w=205,h=205;let left=r.right-w,top=r.bottom+5;if(top+h>innerHeight-8)top=Math.max(8,r.top-h-5);left=Math.max(8,Math.min(innerWidth-w-8,left));menu.style.left=`${left}px`;menu.style.top=`${top}px`;menu.classList.add('show')}));
  document.addEventListener('click',e=>{if(!e.target.closest('.cat-more')&&!e.target.closest('.cat-action-menu'))menu?.classList.remove('show')});
  menu?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;menu.classList.remove('show');const a=b.dataset.act;if(a==='edit')openModal('Edit Category',activeName);else if(a==='sub')openModal(`Add Sub Category`,activeName);else if(a==='view')openModal('Category Details',activeName);else if(a==='status')showToast(`${activeName} status changed successfully.`);else if(a==='delete')showToast(`${activeName} delete confirmation opened.`)});

  $('#exportCategories')?.addEventListener('click',()=>{
    const rows=[['Category Name','Parent Category','Products','Status','Created On']];
    visibleRows().forEach(tr=>{const c=tr.children;rows.push([c[1].innerText.trim(),c[2].innerText.trim(),c[3].innerText.trim(),c[4].innerText.trim(),c[5].innerText.trim()])});
    const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='zmart-categories.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);showToast('Category list exported.');
  });

  const columnsBtn=$('#columnsBtn');
  if(columnsBtn){
    const cm=document.createElement('div');cm.className='columns-menu';cm.innerHTML=['#','Category Name','Parent Category','Products','Status','Created On','Action'].map((n,i)=>`<label><input type="checkbox" data-col="${i}" checked ${i===0||i===1?'disabled':''}>${n}</label>`).join('');document.body.appendChild(cm);
    columnsBtn.addEventListener('click',e=>{e.stopPropagation();const r=columnsBtn.getBoundingClientRect();cm.style.left=`${Math.max(8,r.right-190)}px`;cm.style.top=`${r.bottom+5}px`;cm.classList.toggle('show')});
    cm.addEventListener('change',e=>{const i=Number(e.target.dataset.col);$$('tr',table).forEach(tr=>{if(tr.children[i])tr.children[i].style.display=e.target.checked?'':'none'})});
    document.addEventListener('click',e=>{if(!e.target.closest('.columns-menu')&&!e.target.closest('#columnsBtn'))cm.classList.remove('show')});
  }
  $('#viewAllTop')?.addEventListener('click',()=>{search.value='';status.value='All Status';parent.value='All';filterRows();showToast('All top categories displayed.')});
  $('#categoryHierarchy')?.addEventListener('click',()=>openModal('Category Hierarchy','Grocery → Dairy / Beverages / Snacks'));
  $('#categoryReport')?.addEventListener('click',()=>showToast('Category report generated.'));
  $$('.cat-pages button').forEach(b=>b.addEventListener('click',()=>{if(/^\d+$/.test(b.textContent.trim())){$$('.cat-pages button').forEach(x=>x.classList.remove('active'));b.classList.add('active');showToast(`Category page ${b.textContent.trim()} loaded.`)}}));
})();
