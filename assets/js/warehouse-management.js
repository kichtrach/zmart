(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=(msg)=>window.dispatchEvent(new CustomEvent('zmart:action',{detail:{message:msg}}));

  $$('[data-href]').forEach(b=>b.addEventListener('click',()=>location.href=b.dataset.href));
  $$('[data-toggle]').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));
  $$('[data-action="reset"]').forEach(b=>b.addEventListener('click',()=>{const scope=b.closest('.wh-card,.warehouse-main')||document; $$('input,select',scope).forEach(el=>{if(el.tagName==='SELECT') el.selectedIndex=0; else el.value='';}); toast('Filters reset.');}));
  $$('[data-action="export"]').forEach(b=>b.addEventListener('click',()=>toast('Warehouse report exported.')));

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
    menu.addEventListener('click',ev=>{const act=ev.target.closest('[data-act]')?.dataset.act;if(!act)return; if(type==='warehouse' && ['view','stock-summary','stock-items','stock-movement','low-stock','out-stock'].includes(act)){openWarehouseModal(act);} else toast(`${act.replace('-',' ')} action selected.`); closeMenu();});
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
  if($('[data-step-pane]')) showStep(1);
  $$('[data-success-close]').forEach(b=>b.addEventListener('click',()=>{$('#warehouseSuccess')?.classList.remove('show');location.href='warehouse-master.html'}));

  // uploads with file name
  $$('.wh-upload input').forEach(inp=>inp.addEventListener('change',()=>{const box=inp.closest('.wh-upload'); const file=inp.files?.[0]; if(file) box.querySelector('strong').textContent=file.name;}));

  // search tables
  $$('[data-table-search]').forEach(inp=>inp.addEventListener('input',()=>{const table=$(inp.dataset.tableSearch); const q=inp.value.toLowerCase(); if(!table)return; $$('tbody tr',table).forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(q));}));

  // main stock-by-warehouse row click/select
  $$('#warehouseTable tbody tr').forEach(tr=>tr.addEventListener('click',e=>{if(!e.target.closest('button')){ $$('#warehouseTable tbody tr').forEach(r=>r.classList.remove('selected'));tr.classList.add('selected');}}));
})();
