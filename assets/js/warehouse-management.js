(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=(msg)=>window.dispatchEvent(new CustomEvent('zmart:action',{detail:{message:msg}}));

  $$('[data-href]').forEach(b=>b.addEventListener('click',()=>location.href=b.dataset.href));
  $$('[data-toggle]').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));
  $$('[data-action="reset"]').forEach(b=>b.addEventListener('click',()=>{const scope=b.closest('.wh-card,.warehouse-main')||document; $$('input,select',scope).forEach(el=>{if(el.tagName==='SELECT') el.selectedIndex=0; else el.value='';}); toast('Filters reset.');}));
  $$('[data-action="export"]').forEach(b=>b.addEventListener('click',()=>{
    const table = $('#warehouseTable') || $('#masterTable');
    if(!table){ toast('Warehouse report exported.'); return; }
    const rows = [...table.querySelectorAll('tr')].map(tr => [...tr.children].slice(0,-1).map(cell => `"${cell.innerText.trim().replaceAll('"','""')}"`).join(','));
    const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'zmart-warehouse-report.csv'; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
    toast('Warehouse report exported.');
  }));

  // generic action menus
  let menu;
  const closeMenu=()=>{menu?.remove();menu=null};
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.wh-more[data-menu]');
    if(!btn){ if(!e.target.closest('.wh-action-menu')) closeMenu(); return; }
    e.stopPropagation(); closeMenu();
    menu=document.createElement('div'); menu.className='wh-action-menu';
    const type=btn.dataset.menu;
    const common = type==='warehouse' ? [
      ['fa-eye','View Details','view'],['fa-chart-column','Stock Summary','stock-summary'],['fa-boxes-stacked','Stock Items','stock-items'],['fa-right-left','Stock Movement','stock-movement'],['fa-triangle-exclamation','Low Stock Report','low-stock'],['fa-ban','Out of Stock Report','out-stock'],['fa-pen','Edit Warehouse','edit'],['fa-file-export','Export Stock Report','export']
    ] : [['fa-eye','View Details','view'],['fa-pen','Edit Item','edit'],['fa-clock-rotate-left','Stock History','history'],['fa-right-left','Stock Movement','stock-movement'],['fa-arrow-right-arrow-left','Transfer Stock','transfer'],['fa-sliders','Adjust Stock','adjust'],['fa-barcode','Barcode / Print Label','barcode'],['fa-power-off','Deactivate Item','deactivate']];
    menu.innerHTML=common.map(([i,l,a])=>`<button data-act="${a}" class="${a==='deactivate'?'danger':''}"><i class="fa-solid ${i}"></i>${l}</button>`).join('');
    document.body.appendChild(menu); const r=btn.getBoundingClientRect(); menu.style.left=Math.min(r.left-150,innerWidth-210)+'px'; menu.style.top=Math.min(r.bottom+4,innerHeight-menu.offsetHeight-8)+'px';
    menu.addEventListener('click',ev=>{const act=ev.target.closest('[data-act]')?.dataset.act;if(!act)return;
      if(type==='warehouse' && ['view','stock-summary','stock-items','stock-movement','low-stock','out-stock'].includes(act)) openWarehouseModal(act);
      else if(type==='warehouse' && act==='edit') location.href='add-warehouse.html?mode=edit&warehouse=WH-002';
      else if(type==='warehouse' && act==='export') document.querySelector('[data-action="export"]')?.click();
      else toast(`${act.replaceAll('-',' ')} action selected.`);
      closeMenu();
    });
  });

  function openWarehouseModal(tab='view'){
    const modal=$('#warehouseModal'); if(!modal)return; modal.classList.add('show'); document.body.style.overflow='hidden';
    const map={view:'overview','stock-summary':'summary','stock-items':'items','stock-movement':'movement','low-stock':'low','out-stock':'out'};
    activateTab(map[tab]||'overview');
  }
  function closeWarehouseModal(){const modal=$('#warehouseModal'); if(modal) modal.classList.remove('show'); document.body.style.overflow='';}
  function activateTab(name){$$('.wh-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name)); $$('.wh-tab-pane').forEach(p=>p.classList.toggle('active',p.dataset.pane===name));}
  $$('.wh-tab').forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.tab)));
  $$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeWarehouseModal));
  $('#warehouseModal')?.addEventListener('click',e=>{if(e.target.id==='warehouseModal')closeWarehouseModal()});

  // wizard
  let step=1;
  const maxStep=5;
  function showStep(n){step=Math.max(1,Math.min(maxStep,n));$$('.wh-step').forEach((s,i)=>{s.classList.toggle('active',i+1===step);s.classList.toggle('done',i+1<step)});$$('[data-step-pane]').forEach(p=>p.style.display=+p.dataset.stepPane===step?'block':'none'); const prev=$('[data-prev]'); if(prev)prev.style.visibility=step===1?'hidden':'visible'; const next=$('[data-next]'); if(next)next.innerHTML=step===5?'<i class="fa-regular fa-floppy-disk"></i> Save Warehouse':'Save & Next <i class="fa-solid fa-arrow-right"></i>';}
  $$('[data-next]').forEach(b=>b.addEventListener('click',()=>{if(step<5)showStep(step+1);else $('#warehouseSuccess')?.classList.add('show')}));
  $$('[data-prev]').forEach(b=>b.addEventListener('click',()=>showStep(step-1)));
  $$('[data-step-jump]').forEach(b=>b.addEventListener('click',()=>showStep(+b.dataset.stepJump)));
  if($('[data-step-pane]')) {
    const editMode = new URLSearchParams(location.search).get('mode') === 'edit';
    showStep(1);
    if(editMode){
      const title = document.querySelector('.topbar-title'); if(title) title.textContent='Edit Warehouse';
      const name = document.querySelector('[data-step-pane="1"] input[placeholder="Enter warehouse name"]'); if(name) name.value='ZMart Anna Nagar Warehouse';
      toast('Warehouse loaded in edit mode.');
    }
  }
  $$('[data-success-close]').forEach(b=>b.addEventListener('click',()=>{$('#warehouseSuccess')?.classList.remove('show');location.href='warehouse-master.html'}));

  // uploads with file name
  $$('.wh-upload input').forEach(inp=>inp.addEventListener('change',()=>{const box=inp.closest('.wh-upload'); const file=inp.files?.[0]; if(file) box.querySelector('strong').textContent=file.name;}));

  // search tables
  $$('[data-table-search]').forEach(inp=>inp.addEventListener('input',()=>{const table=$(inp.dataset.tableSearch); const q=inp.value.toLowerCase(); if(!table)return; $$('tbody tr',table).forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(q));}));

  // main stock-by-warehouse row click/select
  $$('#warehouseTable tbody tr').forEach(tr=>tr.addEventListener('click',e=>{if(!e.target.closest('button')){ $$('#warehouseTable tbody tr').forEach(r=>r.classList.remove('selected'));tr.classList.add('selected');}}));
})();

/* v23 - functional buttons, popup content and demo data */
(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const fire=(msg)=>window.dispatchEvent(new CustomEvent('zmart:action',{detail:{message:msg}}));

  // Reusable popup used by buttons/actions that previously had no response.
  let modal=document.getElementById('whGenericModal');
  if(!modal){
    modal=document.createElement('div'); modal.id='whGenericModal'; modal.className='wh-generic-modal';
    modal.innerHTML='<div class="wh-generic-dialog"><div class="wh-generic-head"><h3 id="whGenericTitle">Action</h3><button class="wh-generic-close" type="button">&times;</button></div><div id="whGenericBody"></div><div class="wh-popup-actions"><button class="wh-btn wh-modal-cancel" type="button">Cancel</button><button class="wh-btn primary wh-modal-confirm" type="button">Save</button></div></div>';
    document.body.appendChild(modal);
  }
  const close=()=>modal.classList.remove('show');
  modal.querySelector('.wh-generic-close').onclick=close; modal.querySelector('.wh-modal-cancel').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  function popup(title,body,confirm='Save',onConfirm){
    $('#whGenericTitle').textContent=title; $('#whGenericBody').innerHTML=body; const btn=modal.querySelector('.wh-modal-confirm'); btn.textContent=confirm; btn.onclick=()=>{onConfirm?.();close();}; modal.classList.add('show');
  }
  const field=(label,value='',type='text')=>`<div class="wh-field"><label>${label}</label><input class="wh-input" type="${type}" value="${value}"></div>`;

  // Add Warehouse demo data, select options, auto calculation and review-ready values.
  if(location.pathname.endsWith('/add-warehouse.html')){
    const vals={
      'Enter warehouse name':'ZMart Anna Nagar Warehouse','Enter warehouse code':'WH-002','Enter contact number':'+91 44 4567 8911','Enter email address':'annanagar.wh@zmart.com','Enter address line 1':'No. 12, 2nd Avenue','Enter address line 2':'Anna Nagar','Enter landmark':'Near 5th Avenue Park','Enter pincode':'600040','Enter total capacity':'25000','Enter utilized capacity':'18500','Enter number of floors':'2','Enter loading / unloading bay':'2','Enter short name':'Anna Nagar WH','Enter description':'Primary warehouse for central stock storage and distribution.','Enter area / locality':'Anna Nagar','Enter latitude (e.g., 12.9716)':'13.0827','Enter longitude (e.g., 77.5946)':'80.2707','Enter height clearance':'18','Enter description about warehouse (Optional)':'Primary warehouse for central stock storage and distribution.','Enter insurance details':'Comprehensive warehouse insurance coverage','Enter insured value':'5000000','Enter GSTIN':'33ABCDE1234F1Z5','Enter PAN':'ABCDE1234F','Enter TAN':'CHNA12345B','Enter vendor / builder name':'ZMart Infrastructure Pvt Ltd','Enter any additional remarks':'Fire and safety audit completed.'
    };
    $$('input[placeholder],textarea[placeholder]').forEach(el=>{if(vals[el.placeholder]!==undefined&&!el.value)el.value=vals[el.placeholder]});
    const setSelect=(label,opts,val)=>{const f=$$('.wh-field').find(x=>x.querySelector('label')?.textContent.includes(label)); const s=f?.querySelector('select'); if(!s)return; s.innerHTML=opts.map(o=>`<option${o===val?' selected':''}>${o}</option>`).join('')};
    setSelect('Branch',['-- Select Branch --','ZMart Anna Nagar','ZMart Velachery','ZMart Coimbatore'],'ZMart Anna Nagar');
    setSelect('Manager / In-charge',['-- Select Manager --','Aravind S','Rajesh Kumar','Karthik P'],'Aravind S');
    setSelect('Warehouse Type',['-- Select Type --','Central Warehouse','Regional Warehouse','Distribution Center'],'Central Warehouse');
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('State')).forEach(f=>{const s=f.querySelector('select');if(s)s.innerHTML='<option>Tamil Nadu</option><option>Kerala</option><option>Karnataka</option>'});
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('City')).forEach(f=>{const s=f.querySelector('select');if(s)s.innerHTML='<option>Chennai</option><option>Coimbatore</option><option>Madurai</option>'});
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('Storage Temperature')).forEach(f=>{const s=f.querySelector('select');if(s)s.innerHTML='<option>15°C - 25°C</option><option>2°C - 8°C</option><option>Ambient</option>'});
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('Weekly Off')).forEach(f=>{const s=f.querySelector('select');if(s)s.value='Sunday'});
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('Default Receiving Location')).forEach(f=>{const s=f.querySelector('select');if(s)s.innerHTML='<option>Receiving Bay - 01</option><option>Receiving Bay - 02</option>'});
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('Security / Access Control')).forEach(f=>{const s=f.querySelector('select');if(s)s.innerHTML='<option>Level 3 - Restricted</option><option>Level 2 - Controlled</option><option>Level 1 - Standard</option>'});
    $$('.wh-field').filter(x=>x.querySelector('label')?.textContent.includes('Surveillance')).forEach(f=>{const s=f.querySelector('select');if(s)s.innerHTML='<option>24x7 CCTV + Security</option><option>CCTV Only</option>'});
    $$('input[type=date]').forEach((d,i)=>{if(!d.value)d.value=i===0?'2026-12-31':i===1?'2022-03-15':'2022-04-01'});
    const capInputs=$$('input[placeholder="Enter total capacity"],input[placeholder="Enter utilized capacity"]');
    const recalc=()=>{const pane=$('[data-step-pane="3"]');if(!pane)return;const t=+pane.querySelector('input[placeholder="Enter total capacity"]')?.value||0,u=+pane.querySelector('input[placeholder="Enter utilized capacity"]')?.value||0,a=pane.querySelector('input[placeholder="Auto calculated"]');if(a)a.value=Math.max(0,t-u)}; capInputs.forEach(x=>x.addEventListener('input',recalc));recalc();
    $('.wh-add-new')?.addEventListener('click',e=>{e.preventDefault();popup('Add Warehouse Manager',`<div class="wh-popup-grid">${field('Manager Name','Suresh R')}${field('Employee ID','EMP-1048')}${field('Contact Number','+91 98765 43210','tel')}${field('Email','suresh.r@zmart.com','email')}<div class="wh-field full"><label>Assigned Branch</label><select class="wh-select"><option>ZMart Anna Nagar</option><option>ZMart Velachery</option></select></div></div>`,'Add Manager',()=>fire('Manager added successfully.'))});
    const saveContinue=$$('.wh-foot-actions .right .wh-btn').find(b=>b.textContent.includes('Save & Continue')); saveContinue?.addEventListener('click',()=>{fire('Warehouse draft saved.'); const next=$('[data-next]'); next?.click()});
  }

  // Make generic Filter buttons interactive.
  $$('.wh-btn').filter(b=>b.textContent.trim()==='Filter'&&!b.dataset.bound).forEach(b=>{b.dataset.bound='1';b.addEventListener('click',()=>popup('Filter Warehouses',`<div class="wh-popup-grid"><div class="wh-field"><label>Status</label><select class="wh-select"><option>All Status</option><option>Active</option><option>Inactive</option></select></div><div class="wh-field"><label>Warehouse Type</label><select class="wh-select"><option>All Types</option><option>Central Warehouse</option><option>Regional Warehouse</option></select></div><div class="wh-field full"><label>Location</label><input class="wh-input" value="Chennai"></div></div>`,'Apply Filter',()=>fire('Warehouse filters applied.')))});

  // Rack & Bin add button popup.
  if(location.pathname.endsWith('/rack-bin-management.html')){
    const add=$$('.wh-btn.primary').find(b=>!b.dataset.href); add?.addEventListener('click',()=>popup('Add New Rack / Bin',`<div class="wh-popup-grid">${field('Rack Code','RACK-A01')}${field('Bin Code','BIN-A01-01')}${field('Warehouse','ZMart Anna Nagar Warehouse')}${field('Capacity','500 Units')}<div class="wh-field full"><label>Location Description</label><input class="wh-input" value="Floor 1 - Grocery Zone"></div></div>`,'Save Rack / Bin',()=>fire('Rack / Bin created successfully.')));
  }

  // Create PO, Upload Document and quick action buttons inside warehouse tabs.
  document.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b||b.closest('.wh-generic-modal'))return;
    const text=b.textContent.trim();
    if(text==='Create PO'){e.preventDefault();popup('Create Purchase Order',`<div class="wh-popup-message">A purchase order will be created for the selected out-of-stock item using its preferred supplier and reorder quantity.</div><div class="wh-popup-grid" style="margin-top:14px">${field('PO Number','PO-2025-0148')}${field('Quantity','100','number')}${field('Supplier','ABC Distributors')}${field('Expected Date','2025-06-05','date')}</div>`,'Create PO',()=>fire('Purchase order PO-2025-0148 created.'))}
    else if(/Upload Document/i.test(text)){e.preventDefault();popup('Upload Warehouse Document',`<div class="wh-popup-grid">${field('Document Name','Fire Safety Certificate')}${field('Reference No.','FSC/2025/1187')}<div class="wh-field full"><label>Document Type</label><select class="wh-select"><option>Certificate</option><option>License</option><option>Agreement</option><option>Tax Document</option><option>Insurance</option><option>NOC</option></select></div><div class="wh-field full"><label>Expiry Date</label><input class="wh-input" type="date" value="2026-05-27"></div><div class="wh-field full"><label>Choose File <span style="color:#d22">*</span></label><label class="wh-upload-drop"><input id="whDocumentFile" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" hidden><span class="wh-upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></span><b>Click to choose a file</b><small>PDF, PNG, JPG, DOC or DOCX · Max 5MB</small><em id="whDocumentFileName">No file selected</em></label></div></div>`,'Upload',()=>{const f=document.getElementById('whDocumentFile')?.files?.[0];if(!f){fire('Please choose a document to upload.');setTimeout(()=>modal.classList.add('show'),0);return;}if(f.size>5*1024*1024){fire('File size must be 5MB or less.');setTimeout(()=>modal.classList.add('show'),0);return;}const name=$('#whGenericBody input.wh-input')?.value?.trim()||f.name;const ref=$$('#whGenericBody input.wh-input')[1]?.value?.trim()||'WH/DOC/2025/001';const type=$('#whGenericBody select')?.value||'Certificate';const exp=$('#whGenericBody input[type=date]')?.value||'-';const pane=document.querySelector('[data-pane="documents"]');const tb=pane?.querySelector('tbody');if(tb){const n=tb.rows.length+1;const now=new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});tb.insertAdjacentHTML('beforeend',`<tr><td>${n}</td><td><i class="fa-regular fa-file-pdf" style="color:#08743A;margin-right:8px"></i>${name}</td><td>${type}</td><td>${ref}</td><td>${(f.size/1024).toFixed(0)} KB</td><td>Super Admin</td><td>${now}</td><td>${exp}</td><td><span class="status active">Active</span></td><td><button class="wh-more"><i class="fa-solid fa-ellipsis-vertical"></i></button></td></tr>`)}fire(`Document ${f.name} uploaded successfully.`);})
      setTimeout(()=>{const inp=document.getElementById('whDocumentFile'),name=document.getElementById('whDocumentFileName');if(inp&&name)inp.addEventListener('change',()=>{const f=inp.files?.[0];name.textContent=f?`${f.name} · ${(f.size/1024).toFixed(0)} KB`:'No file selected';name.classList.toggle('has-file',!!f)})},0)}
  });

  // Pagination visual/functionality.
  $$('.wh-page').forEach(p=>p.addEventListener('click',()=>{if(/^\d+$/.test(p.textContent.trim())){$$('.wh-page',p.parentElement).forEach(x=>x.classList.remove('active'));p.classList.add('active');fire(`Page ${p.textContent.trim()} loaded with demo data.`)}}));
})();
