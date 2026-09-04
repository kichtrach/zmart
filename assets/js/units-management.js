(() => {
  const rows = [
    {id:1,name:'Piece',code:'PCS',type:'Reference Unit',base:'Yes',status:'Active',created:'25 May 2025',by:'Super Admin'},
    {id:2,name:'Kilogram',code:'KG',type:'Weight',base:'Yes',status:'Active',created:'25 May 2025',by:'Super Admin'},
    {id:3,name:'Gram',code:'GM',type:'Weight',base:'No',status:'Active',created:'25 May 2025',by:'Super Admin'},
    {id:4,name:'Litre',code:'LTR',type:'Volume',base:'Yes',status:'Active',created:'25 May 2025',by:'Super Admin'},
    {id:5,name:'Millilitre',code:'ML',type:'Volume',base:'No',status:'Active',created:'25 May 2025',by:'Super Admin'},
    {id:6,name:'Box',code:'BOX',type:'Quantity',base:'No',status:'Active',created:'26 May 2025',by:'Store Manager'},
    {id:7,name:'Pack',code:'PAC',type:'Quantity',base:'No',status:'Active',created:'26 May 2025',by:'Store Manager'},
    {id:8,name:'Dozen',code:'DZN',type:'Quantity',base:'No',status:'Inactive',created:'27 May 2025',by:'Store Manager'},
    {id:9,name:'Carton',code:'CTN',type:'Quantity',base:'No',status:'Active',created:'27 May 2025',by:'Super Admin'},
    {id:10,name:'Bundle',code:'BND',type:'Quantity',base:'No',status:'Deleted',created:'28 May 2025',by:'Super Admin'},
    {id:11,name:'Meter',code:'MTR',type:'Reference Unit',base:'Yes',status:'Active',created:'29 May 2025',by:'Super Admin'},
    {id:12,name:'Centimeter',code:'CM',type:'Reference Unit',base:'No',status:'Active',created:'29 May 2025',by:'Super Admin'},
    {id:13,name:'Pair',code:'PAIR',type:'Quantity',base:'No',status:'Active',created:'30 May 2025',by:'Store Manager'},
    {id:14,name:'Set',code:'SET',type:'Quantity',base:'No',status:'Active',created:'30 May 2025',by:'Store Manager'},
    {id:15,name:'Tray',code:'TRY',type:'Quantity',base:'No',status:'Inactive',created:'31 May 2025',by:'Super Admin'},
    {id:16,name:'Bottle',code:'BTL',type:'Quantity',base:'No',status:'Active',created:'31 May 2025',by:'Super Admin'},
    {id:17,name:'Can',code:'CAN',type:'Quantity',base:'No',status:'Active',created:'01 Jun 2025',by:'Store Manager'},
    {id:18,name:'Pouch',code:'PCH',type:'Quantity',base:'No',status:'Active',created:'01 Jun 2025',by:'Store Manager'},
    {id:19,name:'Sachet',code:'SCH',type:'Quantity',base:'No',status:'Active',created:'02 Jun 2025',by:'Super Admin'},
    {id:20,name:'Roll',code:'ROL',type:'Quantity',base:'No',status:'Inactive',created:'02 Jun 2025',by:'Super Admin'},
    {id:21,name:'Bag',code:'BAG',type:'Quantity',base:'No',status:'Active',created:'03 Jun 2025',by:'Super Admin'},
    {id:22,name:'Jar',code:'JAR',type:'Quantity',base:'No',status:'Active',created:'03 Jun 2025',by:'Store Manager'},
    {id:23,name:'Tube',code:'TUB',type:'Quantity',base:'No',status:'Active',created:'04 Jun 2025',by:'Store Manager'},
    {id:24,name:'Sheet',code:'SHT',type:'Quantity',base:'No',status:'Active',created:'04 Jun 2025',by:'Super Admin'},
    {id:25,name:'Square Meter',code:'SQM',type:'Reference Unit',base:'No',status:'Active',created:'05 Jun 2025',by:'Super Admin'},
    {id:26,name:'Milligram',code:'MG',type:'Weight',base:'No',status:'Active',created:'05 Jun 2025',by:'Super Admin'},
    {id:27,name:'Tonne',code:'TON',type:'Weight',base:'No',status:'Active',created:'06 Jun 2025',by:'Store Manager'},
    {id:28,name:'Gallon',code:'GAL',type:'Volume',base:'No',status:'Active',created:'06 Jun 2025',by:'Store Manager'},
    {id:29,name:'Cup',code:'CUP',type:'Volume',base:'No',status:'Active',created:'07 Jun 2025',by:'Super Admin'},
    {id:30,name:'Unit',code:'UNT',type:'Reference Unit',base:'Yes',status:'Active',created:'07 Jun 2025',by:'Super Admin'},
    {id:31,name:'Case',code:'CSE',type:'Quantity',base:'No',status:'Active',created:'08 Jun 2025',by:'Store Manager'},
    {id:32,name:'Crate',code:'CRT',type:'Quantity',base:'No',status:'Active',created:'08 Jun 2025',by:'Store Manager'},
    {id:33,name:'Packet',code:'PKT',type:'Quantity',base:'No',status:'Active',created:'09 Jun 2025',by:'Super Admin'},
    {id:34,name:'Strip',code:'STR',type:'Quantity',base:'No',status:'Active',created:'09 Jun 2025',by:'Super Admin'},
    {id:35,name:'Capsule',code:'CAP',type:'Quantity',base:'No',status:'Active',created:'10 Jun 2025',by:'Super Admin'},
    {id:36,name:'Tablet',code:'TAB',type:'Quantity',base:'No',status:'Active',created:'10 Jun 2025',by:'Super Admin'}
  ];

  const tbody = document.getElementById('unitTableBody');
  const search = document.getElementById('unitSearch');
  const pageSize = document.getElementById('pageSize');
  const pagination = document.getElementById('unitPagination');
  const entriesText = document.getElementById('unitEntriesText');
  const actionMenu = document.getElementById('unitActionMenu');
  const formModal = document.getElementById('unitFormModal');
  const infoModal = document.getElementById('unitInfoModal');
  const confirmModal = document.getElementById('unitConfirmModal');
  const toast = document.getElementById('unitToast');
  const filterPanel = document.getElementById('filterPanel');
  const statusModal = document.getElementById('unitStatusModal');
  const statusSuccessModal = document.getElementById('unitStatusSuccessModal');
  const statusRemarks = document.getElementById('statusRemarks');
  const remarksCount = document.getElementById('remarksCount');
  let currentPage = 1;
  let sortKey = 'id';
  let sortDir = 1;
  let selectedId = null;
  let editId = null;
  let confirmHandler = null;

  const lower = v => String(v ?? '').toLowerCase();
  const showToast = (message, isError=false) => {
    toast.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
  };
  const closeMenus = () => { actionMenu.hidden = true; document.querySelectorAll('.unit-more.active').forEach(b=>b.classList.remove('active')); };
  const closeModals = () => document.querySelectorAll('.unit-modal').forEach(m => m.hidden = true);

  function updateKpis(){
    const total=rows.length;
    const counts={Active:0,Inactive:0,Deleted:0};
    rows.forEach(r=>{ if(counts[r.status] !== undefined) counts[r.status]++; });
    const pct=n=>`${((n/total)*100).toFixed(2)}%`;
    document.getElementById('totalUnitsCount').textContent=total;
    document.getElementById('activeUnitsCount').textContent=counts.Active;
    document.getElementById('inactiveUnitsCount').textContent=counts.Inactive;
    document.getElementById('deletedUnitsCount').textContent=counts.Deleted;
    document.getElementById('activeUnitsPct').textContent=pct(counts.Active);
    document.getElementById('inactiveUnitsPct').textContent=pct(counts.Inactive);
    document.getElementById('deletedUnitsPct').textContent=pct(counts.Deleted);
  }

  function badgeClass(status){ return String(status).toLowerCase(); }

  function openStatusChange(row){
    selectedId=row.id;
    document.getElementById('statusUnitName').textContent=`${row.name} (${row.code})`;
    const currentBadge=document.getElementById('statusCurrentBadge');
    currentBadge.textContent=row.status;
    currentBadge.className=`status-chip ${badgeClass(row.status)}`;
    document.querySelectorAll('input[name="newUnitStatus"]').forEach(input=>{ input.checked=input.value===row.status; });
    statusRemarks.value='';
    remarksCount.textContent='0';
    statusModal.hidden=false;
  }

  function showStatusSuccess(row, previousStatus){
    document.getElementById('successUnitName').textContent=`${row.name} (${row.code})`;
    const previous=document.getElementById('successPreviousStatus');
    previous.textContent=previousStatus; previous.className=`status-chip ${badgeClass(previousStatus)}`;
    const next=document.getElementById('successNewStatus');
    next.textContent=row.status; next.className=`status-chip ${badgeClass(row.status)}`;
    const now=new Date();
    document.getElementById('successUpdatedOn').textContent=now.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}).replace(',', '');
    statusSuccessModal.hidden=false;
  }

  function filteredRows(){
    const q = lower(search.value.trim());
    const type = document.getElementById('typeFilter').value;
    const status = document.getElementById('statusFilter').value;
    const base = document.getElementById('baseFilter').value;
    return rows.filter(r => (!q || [r.name,r.code,r.type,r.status,r.by].some(v=>lower(v).includes(q))) && (!type || r.type===type) && (!status || r.status===status) && (!base || r.base===base));
  }

  function sortedRows(data){
    return [...data].sort((a,b) => {
      let av=a[sortKey], bv=b[sortKey];
      if(sortKey==='created'){ av=Date.parse(a.created); bv=Date.parse(b.created); }
      if(typeof av==='number' && typeof bv==='number') return (av-bv)*sortDir;
      return String(av).localeCompare(String(bv))*sortDir;
    });
  }

  function render(){
    updateKpis();
    const data = sortedRows(filteredRows());
    const size = Number(pageSize.value);
    const pages = Math.max(1, Math.ceil(data.length/size));
    if(currentPage>pages) currentPage=pages;
    const start=(currentPage-1)*size;
    const slice=data.slice(start,start+size);
    tbody.innerHTML = slice.map(r => `<tr data-id="${r.id}">
      <td>${r.id}</td><td>${r.name}</td><td>${r.code}</td><td>${r.type}</td>
      <td><span class="unit-pill ${r.base==='Yes'?'base-yes':'base-no'}">${r.base}</span></td>
      <td><span class="unit-pill status-${r.status.toLowerCase()}">${r.status}</span></td>
      <td>${r.created}</td><td>${r.by}</td>
      <td><button class="unit-more" type="button" data-row-action="${r.id}" aria-label="Actions for ${r.name}"><i class="fa-solid fa-ellipsis"></i></button></td>
    </tr>`).join('');
    entriesText.textContent = data.length ? `Showing ${start+1} to ${Math.min(start+size,data.length)} of ${data.length} entries` : 'Showing 0 entries';
    renderPagination(pages);
  }

  function renderPagination(pages){
    const visible=[];
    for(let p=1;p<=pages;p++) if(p<=4 || Math.abs(p-currentPage)<=1 || p===pages) visible.push(p);
    const unique=[...new Set(visible)].sort((a,b)=>a-b);
    let html=`<button type="button" data-page="prev" ${currentPage===1?'disabled':''}>«</button>`;
    let last=0;
    unique.forEach(p=>{ if(last && p-last>1) html += `<button type="button" disabled>…</button>`; html += `<button type="button" data-page="${p}" class="${p===currentPage?'active':''}">${p}</button>`; last=p; });
    html += `<button type="button" data-page="next" ${currentPage===pages?'disabled':''}>»</button>`;
    pagination.innerHTML=html;
  }

  function openActionMenu(button,id){
    closeMenus(); selectedId=Number(id); button.classList.add('active');
    const rect=button.getBoundingClientRect();
    actionMenu.hidden=false;
    const menuRect=actionMenu.getBoundingClientRect();
    let left=Math.min(window.innerWidth-menuRect.width-12, rect.right-menuRect.width);
    let top=rect.bottom+4;
    if(top+menuRect.height>window.innerHeight-10) top=rect.top-menuRect.height-4;
    actionMenu.style.left=`${Math.max(8,left)}px`; actionMenu.style.top=`${Math.max(8,top)}px`;
  }

  function openForm(row=null){
    editId=row?.id ?? null;
    document.getElementById('unitFormTitle').textContent=row?'Edit Unit':'Add New Unit';
    document.getElementById('unitFormSubtitle').textContent=row?'Update the selected unit details.':'Create a measurement unit for products and inventory.';
    document.getElementById('unitName').value=row?.name ?? '';
    document.getElementById('unitCode').value=row?.code ?? '';
    document.getElementById('unitType').value=row?.type ?? '';
    document.getElementById('unitBase').value=row?.base ?? 'Yes';
    document.getElementById('unitStatus').value=row?.status==='Deleted'?'Inactive':(row?.status ?? 'Active');
    document.getElementById('conversionFactor').value='';
    document.getElementById('unitDescription').value='';
    formModal.hidden=false;
    setTimeout(()=>document.getElementById('unitName').focus(),0);
  }

  function openInfo(title,subtitle,html){
    document.getElementById('unitInfoTitle').textContent=title;
    document.getElementById('unitInfoSubtitle').textContent=subtitle;
    document.getElementById('unitInfoContent').innerHTML=html;
    infoModal.hidden=false;
  }

  function askConfirm(title,text,buttonText,handler,danger=true){
    document.getElementById('confirmTitle').textContent=title;
    document.getElementById('confirmText').textContent=text;
    const btn=document.getElementById('confirmActionBtn'); btn.textContent=buttonText; btn.classList.toggle('unit-btn-danger',danger); btn.classList.toggle('unit-btn-primary',!danger);
    confirmHandler=handler; confirmModal.hidden=false;
  }

  document.getElementById('addUnitBtn').addEventListener('click',()=>{ window.location.href='add-unit.html'; });
  document.getElementById('filterBtn').addEventListener('click',()=>{filterPanel.hidden=!filterPanel.hidden;});
  document.getElementById('applyFilterBtn').addEventListener('click',()=>{currentPage=1;render();});
  document.getElementById('resetBtn').addEventListener('click',()=>{search.value='';['typeFilter','statusFilter','baseFilter'].forEach(id=>document.getElementById(id).value='');currentPage=1;sortKey='id';sortDir=1;filterPanel.hidden=true;render();showToast('Filters reset.');});
  search.addEventListener('input',()=>{currentPage=1;render();});
  pageSize.addEventListener('change',()=>{currentPage=1;render();});
  pagination.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b||b.disabled)return;const v=b.dataset.page;if(v==='prev')currentPage--;else if(v==='next')currentPage++;else currentPage=Number(v);render();});
  document.querySelectorAll('.unit-table th[data-sort]').forEach(th=>th.addEventListener('click',()=>{const key=th.dataset.sort;if(sortKey===key)sortDir*=-1;else{sortKey=key;sortDir=1;}render();}));
  tbody.addEventListener('click',e=>{const btn=e.target.closest('[data-row-action]');if(btn)openActionMenu(btn,btn.dataset.rowAction);});
  document.addEventListener('click',e=>{if(!e.target.closest('#unitActionMenu')&&!e.target.closest('[data-row-action]'))closeMenus();});
  window.addEventListener('resize',closeMenus); window.addEventListener('scroll',closeMenus,true);

  actionMenu.addEventListener('click',e=>{
    const btn=e.target.closest('[data-action]'); if(!btn)return;
    const row=rows.find(r=>r.id===selectedId); if(!row)return; closeMenus();
    const detailHtml=`<div class="unit-detail-grid"><div><small>Unit Name</small><strong>${row.name}</strong></div><div><small>Unit Code</small><strong>${row.code}</strong></div><div><small>Unit Type</small><strong>${row.type}</strong></div><div><small>Base Unit</small><strong>${row.base}</strong></div><div><small>Status</small><strong>${row.status}</strong></div><div><small>Created On</small><strong>${row.created}</strong></div><div><small>Created By</small><strong>${row.by}</strong></div><div><small>Last Updated</small><strong>04 Sep 2026</strong></div></div>`;
    if(btn.dataset.action==='view') { sessionStorage.setItem('zmart:selectedUnit', JSON.stringify(row)); location.href=`unit-details.html?id=${row.id}`; return; }
    if(btn.dataset.action==='edit') { sessionStorage.setItem('zmart:selectedUnit', JSON.stringify(row)); location.href=`edit-unit.html?id=${row.id}`; return; }
    if(btn.dataset.action==='status') { openStatusChange(row); return; }
    if(btn.dataset.action==='delete') askConfirm('Delete Unit',`Delete ${row.name}? This will mark the unit as deleted without removing its historical data.`,'Delete Unit',()=>{row.status='Deleted';render();showToast(`${row.name} moved to deleted units.`);},true);
    if(btn.dataset.action==='history') openInfo('Stock History',`${row.name} (${row.code})`,`<table class="unit-history"><thead><tr><th>Date</th><th>Transaction</th><th>Reference</th><th>Quantity</th><th>Balance</th></tr></thead><tbody><tr><td>04 Sep 2026</td><td>Stock Adjustment</td><td>ADJ-1042</td><td>+25 ${row.code}</td><td>480 ${row.code}</td></tr><tr><td>02 Sep 2026</td><td>Sale</td><td>INV-8834</td><td>-8 ${row.code}</td><td>455 ${row.code}</td></tr><tr><td>31 Aug 2026</td><td>Purchase Receipt</td><td>GRN-2096</td><td>+100 ${row.code}</td><td>463 ${row.code}</td></tr></tbody></table>`);
  });

  document.getElementById('unitForm').addEventListener('submit',e=>{
    e.preventDefault();
    const payload={name:document.getElementById('unitName').value.trim(),code:document.getElementById('unitCode').value.trim().toUpperCase(),type:document.getElementById('unitType').value,base:document.getElementById('unitBase').value,status:document.getElementById('unitStatus').value};
    if(!payload.name||!payload.code||!payload.type){showToast('Please complete all required fields.',true);return;}
    if(rows.some(r=>r.id!==editId && lower(r.code)===lower(payload.code))){showToast('Unit code already exists.',true);return;}
    if(editId){Object.assign(rows.find(r=>r.id===editId),payload);showToast('Unit updated successfully.');}
    else{const nextId=Math.max(...rows.map(r=>r.id))+1;rows.unshift({id:nextId,...payload,created:'04 Sep 2026',by:'Super Admin'});showToast('New unit added successfully.');}
    closeModals();currentPage=1;render();
  });

  statusRemarks.addEventListener('input',()=>{remarksCount.textContent=statusRemarks.value.length;});
  document.querySelectorAll('[data-close-status]').forEach(btn=>btn.addEventListener('click',()=>{statusModal.hidden=true;}));
  document.querySelectorAll('[data-close-success]').forEach(btn=>btn.addEventListener('click',()=>{statusSuccessModal.hidden=true;}));
  document.getElementById('updateUnitStatusBtn').addEventListener('click',()=>{
    const row=rows.find(r=>r.id===selectedId);
    const choice=document.querySelector('input[name="newUnitStatus"]:checked');
    if(!row || !choice){ showToast('Please select a new status.',true); return; }
    const previousStatus=row.status;
    row.status=choice.value;
    statusModal.hidden=true;
    render();
    showStatusSuccess(row, previousStatus);
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',closeModals));
  document.querySelectorAll('.unit-modal').forEach(modal=>modal.addEventListener('click',e=>{if(e.target===modal)closeModals();}));
  document.getElementById('confirmActionBtn').addEventListener('click',()=>{const fn=confirmHandler;closeModals();confirmHandler=null;fn?.();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenus();closeModals();}});

  document.getElementById('exportBtn').addEventListener('click',()=>{
    const data=sortedRows(filteredRows());
    const csv=['Unit Name,Unit Code,Unit Type,Base Unit,Status,Created On,Created By',...data.map(r=>[r.name,r.code,r.type,r.base,r.status,r.created,r.by].map(v=>`"${String(v).replaceAll('"','""')}"`).join(','))].join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='zmart-units.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);showToast('Units exported as CSV.');
  });

  document.querySelector('[data-breadcrumb="home"]').addEventListener('click',()=>location.href='../index.html');
  document.querySelector('[data-breadcrumb="product"]').addEventListener('click',()=>location.href='products.html');

  window.addEventListener('zmart:action',e=>showToast(e.detail?.message || 'Action completed.'));
  render();
})();
