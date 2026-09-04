(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const goNew=()=>location.href='new-stock-transfer.html';
  const baseItems=[
    ['ITM-0004','Surf Excel Matic 1kg','Pack',120,50,'Pack','BATCH-0525-001','31 Dec 2026'],
    ['ITM-0020','Aashirvaad Atta 5kg','Pack',80,40,'Pack','BATCH-0525-002','15 Jan 2027'],
    ['ITM-0017','Fortune Sunflower Oil 1L','Bottle',90,30,'Bottle','BATCH-0525-003','20 Nov 2026'],
    ['ITM-0031','Colgate Strong Teeth 200g','Pack',200,60,'Pack','BATCH-0525-004','10 Aug 2026'],
    ['ITM-0042','Horlicks Classic Malt 500g','Pack',70,20,'Pack','BATCH-0525-005','05 Feb 2027']
  ];
  let items=[...baseItems.map(x=>[...x])];

  $('#newTransfer')?.addEventListener('click',goNew); $('#quickNew')?.addEventListener('click',goNew);
  $('#cancelTransfer')?.addEventListener('click',()=>location.href='stock-transfers.html'); $('#cancelBottom')?.addEventListener('click',()=>location.href='stock-transfers.html');

  function filterRows(){
    const q=($('#transferSearch')?.value||'').trim().toLowerCase(), status=$('#statusFilter')?.value||'All Status', from=$('#fromFilter')?.value||'All Warehouses', to=$('#toFilter')?.value||'All Warehouses'; let visible=0;
    $$('#transferTable tbody tr').forEach(r=>{const okQ=!q||r.innerText.toLowerCase().includes(q),okS=status==='All Status'||r.dataset.status===status,okF=from==='All Warehouses'||r.dataset.from===from,okT=to==='All Warehouses'||r.dataset.to===to; const show=okQ&&okS&&okF&&okT;r.style.display=show?'':'none';if(show)visible++;});
    if($('#tableCount')) $('#tableCount').textContent=`Showing ${visible?1:0} to ${visible} of ${visible} filtered entries`;
  }
  $('#applyFilter')?.addEventListener('click',filterRows); $('#transferSearch')?.addEventListener('input',filterRows);
  $('#resetFilter')?.addEventListener('click',()=>{['transferSearch'].forEach(id=>{if($('#'+id))$('#'+id).value=''});['statusFilter','fromFilter','toFilter'].forEach(id=>{if($('#'+id))$('#'+id).selectedIndex=0}); filterRows(); if($('#tableCount'))$('#tableCount').textContent='Showing 1 to 10 of 48 entries';});

  const pop=$('#actionPopover');
  function closePopover(){pop?.classList.add('hidden')}
  function positionActionPopover(trigger){
    if(!pop||!trigger)return;
    const rect=trigger.getBoundingClientRect();
    const menuWidth=220, gap=8, edge=12;
    // Always anchor the menu to the LEFT of the three-dot button so it never
    // covers the Last Updated / Quick Actions rail on the right.
    let left=rect.right-menuWidth;
    left=Math.max(edge,Math.min(left,innerWidth-menuWidth-edge));
    pop.style.width=menuWidth+'px';
    pop.style.left=left+'px';
    pop.style.top='-9999px';
    pop.classList.remove('hidden');
    const menuHeight=pop.offsetHeight||184;
    let top=rect.bottom+gap;
    if(top+menuHeight>innerHeight-edge) top=rect.top-menuHeight-gap;
    pop.style.top=Math.max(edge,top)+'px';
  }
  $$('.action-menu').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    if(!pop)return;
    const id=b.dataset.transfer;
    pop.innerHTML=`<button data-act="view"><i class="fa-regular fa-eye"></i><span>View Details</span></button><button data-act="track"><i class="fa-solid fa-truck-fast"></i><span>Track Transfer</span></button><button data-act="print"><i class="fa-solid fa-print"></i><span>Print Transfer</span></button><button data-act="duplicate"><i class="fa-regular fa-copy"></i><span>Duplicate Transfer</span></button>`;
    pop.dataset.transfer=id;
    positionActionPopover(b);
  }));
  window.addEventListener('resize',closePopover);
  window.addEventListener('scroll',closePopover,true);
  document.addEventListener('click',e=>{if(!e.target.closest('.st-popover')&&!e.target.closest('.action-menu'))closePopover()});
  pop?.addEventListener('click',e=>{const btn=e.target.closest('[data-act]');if(!btn)return;const id=pop.dataset.transfer;closePopover();openGeneric(btn.dataset.act,id)});

  function modal(html){const m=$('#genericModal'),body=$('#genericModalBody');if(!m||!body)return;body.innerHTML=html;m.classList.remove('hidden')}
  function openGeneric(type,id){
    if(type==='view') modal(`<h3>Stock Transfer Details</h3><p>Transfer <b>${id}</b> from ZMart Anna Nagar to ZMart T. Nagar.</p><div class="st-panel" style="padding:14px"><div class="st-side-row"><span>Status</span><b>Completed</b></div><div class="st-side-row"><span>Transfer Date</span><b>31 May 2025</b></div><div class="st-side-row"><span>Total Items</span><b>12</b></div><div class="st-side-row"><span>Total Quantity</span><b>356</b></div></div><div class="st-modal-actions"><button class="st-btn" data-close-generic>Close</button><button class="st-btn primary" onclick="location.href='new-stock-transfer.html'">Open Transfer</button></div>`);
    if(type==='track') modal(`<h3>Track Transfer</h3><p><b>${id}</b> is currently marked as completed.</p><div class="st-panel" style="padding:14px;text-align:left"><p>✓ Requested — 31 May 2025 09:55 AM</p><p>✓ Dispatched — 31 May 2025 10:05 AM</p><p>✓ Received — 31 May 2025 10:30 AM</p></div><div class="st-modal-actions"><button class="st-btn primary" data-close-generic>Done</button></div>`);
    if(type==='print') modal(`<h3>Print Transfer</h3><p>Transfer ${id} is ready for printing.</p><div class="st-modal-actions"><button class="st-btn" data-close-generic>Cancel</button><button class="st-btn primary" onclick="window.print()"><i class="fa-solid fa-print"></i>Print</button></div>`);
    if(type==='duplicate') modal(`<h3>Duplicate Transfer</h3><p>Create a new stock transfer using ${id} as the template?</p><div class="st-modal-actions"><button class="st-btn" data-close-generic>Cancel</button><button class="st-btn primary" onclick="location.href='new-stock-transfer.html'">Create Copy</button></div>`);
  }
  document.addEventListener('click',e=>{if(e.target.closest('[data-close-generic]'))$('#genericModal')?.classList.add('hidden')});
  $$('[data-quick]').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.quick;if(t==='pending'){if($('#statusFilter')){$('#statusFilter').value='Pending';filterRows();}}else modal(`<h3>${t==='history'?'Transfer History':'Stock Transfer Report'}</h3><p>${t==='history'?'Showing recent warehouse transfer activity for May 2025.':'Report preview is ready with transfer totals, status breakdown and warehouse movement.'}</p><div class="st-panel" style="padding:14px;text-align:left"><div class="st-side-row"><span>Total Transfers</span><b>48</b></div><div class="st-side-row"><span>Completed</span><b>32</b></div><div class="st-side-row"><span>In Transit</span><b>10</b></div><div class="st-side-row"><span>Pending</span><b>6</b></div></div><div class="st-modal-actions"><button class="st-btn" data-close-generic>Close</button><button class="st-btn primary" onclick="window.print()">Export / Print</button></div>`)}));

  function itemRow(item,i){return `<tr><td>${i+1}</td><td>${item[0]}</td><td>${item[1]}</td><td>${item[2]}</td><td>${item[3]}</td><td><input value="${item[4]}" class="qty" data-index="${i}"></td><td><select data-index="${i}" class="uom"><option>${item[5]}</option></select></td><td><input value="${item[6]}" data-index="${i}" class="batch"></td><td><input value="${item[7]}" data-index="${i}" class="expiry" data-calendar></td><td><button class="st-btn remove-item" data-index="${i}"><i class="fa-regular fa-trash-can"></i></button></td></tr>`}
  function renderItems(){['#itemsTable tbody','#itemsTable2 tbody'].forEach(sel=>{const tb=$(sel);if(tb)tb.innerHTML=items.map(itemRow).join('')}); const rows=items.map((x,i)=>`<tr><td>${i+1}</td><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[4]}</td><td>${x[5]}</td><td>${x[6]}</td><td>${x[7]}</td></tr>`).join(''); const review=$('#reviewItems tbody');if(review)review.innerHTML=rows; const completed=$('#completedItems tbody');if(completed)completed.innerHTML=rows; bindItemEvents(); recalc()}
  function bindItemEvents(){ $$('.qty').forEach(inp=>inp.addEventListener('input',e=>{const idx=+e.target.dataset.index;items[idx][4]=Math.max(0,Number(e.target.value)||0);renderItems()})); $$('.remove-item').forEach(b=>b.addEventListener('click',()=>{items.splice(+b.dataset.index,1);renderItems()})); }
  function recalc(){const total=items.reduce((a,x)=>a+(Number(x[4])||0),0);$$('.totalQty').forEach(x=>x.textContent=total);['#itemCount','#itemCount2'].forEach(sel=>{if($(sel))$(sel).textContent=`${items.length} items added`});if($('#sideItemCount'))$('#sideItemCount').textContent=items.length;if($('#reviewItemCount'))$('#reviewItemCount').textContent=items.length;if($('#completedItemCount'))$('#completedItemCount').textContent=items.length}
  if($('#itemsTable'))renderItems();
  function showStep(n){[1,2,3,4].forEach(i=>$('#step'+i)?.classList.toggle('hidden',i!==n));$$('[data-step-dot]').forEach(d=>{const i=+d.dataset.stepDot;const complete=n===4||i<n;d.classList.toggle('active',n!==4&&i===n);d.classList.toggle('done',complete);const b=d.querySelector('b');if(b)b.innerHTML=complete?'<i class="fa-solid fa-check"></i>':i}); const q=$('#quickInfo');if(q)q.textContent=n===1?'Stock will be deducted from source warehouse and added to destination warehouse after transfer is completed.':n===2?'Please verify item quantities and batch details before proceeding to review and confirm.':n===3?'After submission, stock will be deducted from source warehouse. You can track this transfer in Transfer History.':'Stock transfer has been saved successfully. You can view the transfer details in Transfer History.'; const topLabel=$('#topActionLabel');const topBtn=$('#saveDraft');if(topLabel&&topBtn){if(n===1||n===2){topLabel.textContent='Save as Draft';topBtn.dataset.mode='draft';topBtn.querySelector('i').className='fa-regular fa-floppy-disk'}else{topLabel.textContent='Save & Submit Transfer';topBtn.dataset.mode=n===4?'submitted':'submit';topBtn.querySelector('i').className='fa-regular fa-paper-plane'}} window.scrollTo({top:0,behavior:'smooth'});}
  $$('.next-step').forEach(b=>b.addEventListener('click',()=>showStep(+b.dataset.next)));$$('.prev-step').forEach(b=>b.addEventListener('click',()=>showStep(+b.dataset.prev)));
  function addItemModal(){modal(`<h3>Add Item</h3><p>Select an item to add to this stock transfer.</p><div class="st-field"><label>Item</label><select id="newItemSelect"><option value="ITM-0060|Britannia Good Day 200g|Pack|95|15|Pack|BATCH-0525-006|20 Mar 2027">Britannia Good Day 200g</option><option value="ITM-0072|Tata Salt 1kg|Pack|140|25|Pack|BATCH-0525-007|18 Jan 2027">Tata Salt 1kg</option></select></div><div class="st-modal-actions"><button class="st-btn" data-close-generic>Cancel</button><button class="st-btn primary" id="confirmAddItem">Add Item</button></div>`);setTimeout(()=>$('#confirmAddItem')?.addEventListener('click',()=>{items.push($('#newItemSelect').value.split('|').map((v,i)=>[3,4].includes(i)?Number(v):v));$('#genericModal').classList.add('hidden');renderItems()}),0)}
  $('#addItem')?.addEventListener('click',addItemModal);$('#addItemStep2')?.addEventListener('click',addItemModal);
  $('#importItems')?.addEventListener('click',()=>$('#importInput')?.click());$('#importInput')?.addEventListener('change',e=>{if(e.target.files[0])modal(`<h3>Items Imported</h3><p><b>${e.target.files[0].name}</b> was selected. Demo import completed successfully.</p><div class="st-modal-actions"><button class="st-btn primary" data-close-generic>Done</button></div>`)});
  $('#attachmentInput')?.addEventListener('change',e=>{const f=e.target.files[0];if(f){$('#attachmentChip').classList.remove('hidden');$('#attachmentChip span').textContent=f.name;$('#attachmentChip b').textContent=Math.max(1,Math.round(f.size/1024))+' KB'}});$('#removeAttachment')?.addEventListener('click',()=>$('#attachmentChip')?.classList.add('hidden'));
  $('#saveDraft')?.addEventListener('click',()=>{const mode=$('#saveDraft').dataset.mode||'draft';if(mode==='submit'){$('#submitTransfer')?.click();return;}if(mode==='submitted'){modal(`<h3>Transfer Submitted</h3><p>Stock transfer <b>ST-2505-0048</b> has already been submitted successfully.</p><div class="st-modal-actions"><button class="st-btn primary" data-close-generic>Done</button></div>`);return;}modal(`<h3>Draft Saved</h3><p>Your stock transfer draft has been saved successfully.</p><div class="st-modal-actions"><button class="st-btn primary" data-close-generic>Done</button></div>`)});
  $('#submitTransfer')?.addEventListener('click',()=>{if(!$('#confirmCheck')?.checked){modal(`<h3>Confirmation Required</h3><p>Please confirm that the transfer details are correct before submitting.</p><div class="st-modal-actions"><button class="st-btn primary" data-close-generic>OK</button></div>`);return;} showStep(4);$('#successModal')?.classList.remove('hidden')});
  $('#printCompleted')?.addEventListener('click',()=>window.print());$('#closeSuccess')?.addEventListener('click',()=>$('#successModal')?.classList.add('hidden'));$('#goTransfers')?.addEventListener('click',()=>location.href='stock-transfers.html');$('#viewTransfer')?.addEventListener('click',()=>{$('#successModal')?.classList.add('hidden');showStep(4)});$('#viewAllRecent')?.addEventListener('click',()=>location.href='stock-transfers.html');
})();
