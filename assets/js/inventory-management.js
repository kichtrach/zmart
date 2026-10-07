(()=>{const products=[['Basmati Rice 5kg','RICE-001','Grocery','India Gate','Bag',120,20,100,50,'In Stock','🍚'],['Sunflower Oil 1L','OIL-001','Grocery','Sundrop','Bottle',45,5,40,20,'Low Stock','🧴'],['Wheat Flour 1kg','FLOUR-001','Grocery','Aashirvaad','Pack',200,10,190,100,'In Stock','🌾'],['Sugar 1kg','SUGAR-001','Grocery','MTR','Pack',15,5,10,25,'Low Stock','🥡'],['Toor Dal 1kg','DAL-001','Grocery','Tata','Pack',0,0,0,30,'Out of Stock','🫘'],['Tea Powder 500g','TEA-001','Beverages','Tata Tea','Pack',88,8,80,25,'In Stock','☕'],['Coffee Powder 200g','COFF-001','Beverages','Nescafe','Pack',32,4,28,20,'In Stock','☕'],['Detergent Powder 1kg','DET-001','Household','Surf Excel','Pack',18,2,16,30,'Low Stock','🧼'],['Shampoo 200ml','SHP-001','Personal Care','Dove','Bottle',65,10,55,20,'In Stock','🧴'],['Biscuits 200g','BIS-001','Packaged Foods','Britannia','Pack',12,0,12,25,'Low Stock','🍪'],['Bath Soap 100g','SOAP-001','Personal Care','Lux','Piece',94,9,85,30,'In Stock','🧼'],['Salt 1kg','SALT-001','Grocery','Tata Salt','Pack',140,12,128,40,'In Stock','🧂'],['Floor Cleaner 1L','CLN-001','Household','Lizol','Bottle',22,2,20,25,'Low Stock','🧴'],['Milk Powder 500g','MILK-001','Beverages','Amul','Pack',76,6,70,20,'In Stock','🥛'],['Noodles 280g','NOOD-001','Packaged Foods','Maggi','Pack',110,8,102,35,'In Stock','🍜'],['Ghee 500ml','GHEE-001','Grocery','Aavin','Bottle',58,6,52,20,'In Stock','🧈'],['Curd 500g','CURD-001','Dairy Products','Milky Mist','Cup',24,4,20,15,'In Stock','🥛'],['Dishwash Liquid 500ml','DISH-001','Household','Vim','Bottle',38,5,33,18,'In Stock','🧴'],['Toothpaste 150g','TOOTH-001','Personal Care','Colgate','Tube',72,7,65,20,'In Stock','🪥'],['Corn Flakes 475g','CORN-001','Packaged Foods','Kelloggs','Box',28,3,25,15,'In Stock','🥣'],['Cashew 250g','CASH-001','Dry Fruits','ZMart Select','Pack',14,2,12,18,'Low Stock','🥜'],['Mineral Water 1L','WATER-001','Beverages','Bisleri','Bottle',180,15,165,50,'In Stock','💧'],['Hand Wash 250ml','HAND-001','Personal Care','Dettol','Bottle',44,4,40,20,'In Stock','🧴'],['Tomato Ketchup 500g','KETCH-001','Packaged Foods','Kissan','Bottle',36,3,33,15,'In Stock','🍅'],['Tissue Roll 4pcs','TISS-001','Household','Origami','Pack',19,2,17,20,'Low Stock','🧻']];document.getElementById('stockRows').innerHTML=products.map((p,i)=>`<tr><td>☐</td><td>${i+1}</td><td><div class="prod"><span class="prod-thumb">${p[10]}</span>${p[0]}</div></td><td><span class="item-code-badge">ITM-${String(i+1).padStart(6,'0')}</span></td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td>${p[4]}</td><td>${p[5]}</td><td>${p[6]}</td><td>${p[7]}</td><td>${p[8]}</td><td><span class="badge ${p[9]==='In Stock'?'ok':p[9]==='Low Stock'?'low':'out'}">${p[9]}</span></td><td><button class="more">⋮</button></td></tr>`).join('');const items=[['Basmati Rice 5kg','RICE-001','Grocery','Bag',320,50,'BR2509A','2026-09-30',420,5,336,16800,'🍚'],['Sunflower Oil 1L','OIL-001','Grocery','Bottle',145,40,'SO2509B','2026-08-15',180,12,162.4,6496,'🧴'],['Wheat Flour 1kg','FLOUR-001','Grocery','Pack',48,100,'WF2509A','2026-12-12',65,5,50.4,5040,'🌾'],['Detergent Powder 1kg','DET-001','Household','Pack',120,30,'DP2509A','2027-02-28',160,18,141.6,4248,'🧼'],['Tea Powder 500g','TEA-001','Beverages','Pack',280,20,'TP2509A','2027-01-18',350,5,294,5880,'☕']];document.getElementById('addRows').innerHTML=items.map((p,i)=>`<tr><td>${i+1}</td><td>${p[12]} ${p[0]}</td><td><input class="item-code-input" value="ITM-${String(i+1).padStart(6,'0')}" aria-label="Item Code"></td><td>${p[2]}</td><td>${p[3]}</td><td><input value="${p[4]}.00"></td><td><div class="qty"><button>−</button><input value="${p[5]}"><button>+</button></div></td><td>${(p[4]*p[5]).toLocaleString('en-IN')}.00</td><td><button class="row-delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join('');document.getElementById('detailRows').innerHTML=items.map((p,i)=>`<tr><td>${i+1}</td><td>${p[12]} <b>${p[0]}</b><br><small>Item Code: ITM-${String(i+1).padStart(6,'0')}</small></td><td><input value="${p[6]}"></td><td><input type="date" value="${p[7]}"></td><td><input value="${p[8]}.00"></td><td><input value="${p[4]}.00"></td><td><div class="qty"><button>−</button><input value="${p[5]}"><button>+</button></div></td><td>${(p[4]*p[5]).toLocaleString('en-IN')}.00</td><td><select><option>Main Warehouse</option></select></td><td><button class="row-delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join('');document.getElementById('priceRows').innerHTML=items.map((p,i)=>`<tr><td>${i+1}</td><td>${p[12]} <b>${p[0]}</b><br><small>Item Code: ITM-${String(i+1).padStart(6,'0')}<br>Batch: ${p[6]}</small></td><td><input value="${p[8]}.00"></td><td><input value="${p[4]}.00"></td><td><select><option>${p[9]}%</option></select></td><td><input value="${p[10].toFixed(2)}" disabled></td><td><div class="qty"><button>−</button><input value="${p[5]}"><button>+</button></div></td><td>${p[11].toLocaleString('en-IN')}.00</td></tr>`).join('');document.getElementById('reviewRows').innerHTML=items.map((p,i)=>`<tr><td>${i+1}</td><td>${p[12]} <b>${p[0]}</b><br><small>Item Code: ITM-${String(i+1).padStart(6,'0')}</small></td><td>${p[6]}</td><td>${new Date(p[7]).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</td><td>${p[8]}.00</td><td>${p[4]}.00</td><td>${p[9]}%</td><td>${p[10].toFixed(2)}</td><td>${p[5]}</td><td>${p[11].toLocaleString('en-IN')}.00</td></tr>`).join('');let step=1;const overlay=document.getElementById('stockOverlay'),success=document.getElementById('successOverlay'),next=document.getElementById('nextBtn'),back=document.getElementById('backBtn');function render(){document.querySelectorAll('.step').forEach((e,i)=>{e.classList.toggle('active',i+1===step);e.classList.toggle('done',i+1<step);if(i+1<step)e.querySelector('.num').textContent='✓';else e.querySelector('.num').textContent=i+1});document.querySelectorAll('.step-pane').forEach(e=>e.classList.toggle('active',+e.dataset.pane===step));back.style.visibility=step===1?'hidden':'visible';next.innerHTML=step===4?'✓ Save Payment':'Next →'}document.getElementById('addStock').onclick=()=>{overlay.classList.add('show');step=1;render()};document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>overlay.classList.remove('show'));next.onclick=()=>{if(step<4){step++;render()}else{overlay.classList.remove('show');success.classList.add('show')}};back.onclick=()=>{if(step>1){step--;render()}};document.getElementById('doneBtn').onclick=document.getElementById('successX').onclick=()=>success.classList.remove('show');const printBtn=document.getElementById('printStockEntry');if(printBtn)printBtn.onclick=()=>window.print();const viewBtn=document.getElementById('viewStockDetails');if(viewBtn)viewBtn.onclick=()=>{success.classList.remove('show');overlay.classList.add('show');step=4;render()};render()})();

/* V87: use the same custom dropdown treatment across Inventory Management. */
(()=>{
  const root=document.querySelector('.inventory-page');
  if(!root)return;
  function enhanceSelect(sel){
    if(!sel || sel.dataset.zmEnhanced==='1')return;
    sel.dataset.zmEnhanced='1'; sel.classList.add('zm-native-select');
    const wrap=document.createElement('div'); wrap.className='zm-select';
    const btn=document.createElement('button'); btn.type='button'; btn.className='zm-select__button';
    const menu=document.createElement('div'); menu.className='zm-select__menu';
    const sync=()=>{btn.textContent=sel.options[sel.selectedIndex]?.text||'Select'; menu.querySelectorAll('.zm-select__option').forEach((o,i)=>o.classList.toggle('active',i===sel.selectedIndex));};
    [...sel.options].forEach((opt,i)=>{const o=document.createElement('button');o.type='button';o.className='zm-select__option';o.textContent=opt.text;o.addEventListener('click',()=>{sel.selectedIndex=i;sel.dispatchEvent(new Event('change',{bubbles:true}));sync();wrap.classList.remove('open');});menu.appendChild(o)});
    sel.parentNode.insertBefore(wrap,sel); wrap.append(sel,btn,menu); sync();
    btn.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.zm-select.open').forEach(x=>x!==wrap&&x.classList.remove('open'));wrap.classList.toggle('open');});
  }
  root.querySelectorAll('select').forEach(enhanceSelect);
  const overlay=document.getElementById('stockOverlay'); if(overlay) overlay.querySelectorAll('select').forEach(enhanceSelect);
  document.addEventListener('click',()=>document.querySelectorAll('.zm-select.open').forEach(x=>x.classList.remove('open')));
})();

/* V138 — Add Stock popup interactive controls */
(()=>{
  const overlay=document.getElementById('stockOverlay');
  if(!overlay)return;

  const number=v=>Number(String(v??'').replace(/[^0-9.-]/g,''))||0;
  const money=v=>number(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

  // Prevent popup controls from behaving like implicit submit buttons.
  overlay.querySelectorAll('button').forEach(b=>{ if(!b.hasAttribute('type')) b.type='button'; });

  function rowTotal(row){
    if(!row)return;
    const qtyInput=row.querySelector('.qty input');
    if(!qtyInput)return;
    const qty=Math.max(0,Math.floor(number(qtyInput.value)));
    qtyInput.value=qty;
    const cells=row.children;
    let price=0,totalCell=null;
    if(row.closest('#addRows')){ price=number(cells[5]?.querySelector('input')?.value); totalCell=cells[7]; }
    else if(row.closest('#detailRows')){ price=number(cells[5]?.querySelector('input')?.value); totalCell=cells[7]; }
    else if(row.closest('#priceRows')){ price=number(cells[5]?.querySelector('input')?.value)||number(cells[3]?.querySelector('input')?.value); totalCell=cells[7]; }
    if(totalCell) totalCell.textContent=money(price*qty);
  }

  function updateSummaries(){
    const addRows=[...overlay.querySelectorAll('#addRows tr')];
    const qty=addRows.reduce((s,r)=>s+number(r.querySelector('.qty input')?.value),0);
    const total=addRows.reduce((s,r)=>s+number(r.children[7]?.textContent),0);
    const strip=overlay.querySelector('.summary-strip');
    if(strip){
      const spans=strip.querySelectorAll('span');
      if(spans[0])spans[0].textContent=`Total Items: ${addRows.length}`;
      const strong=strip.querySelector('strong'); if(strong)strong.textContent=money(total);
    }
    const summary=overlay.querySelector('.step-pane[data-pane="2"] .review-grid');
    if(summary){const b=summary.querySelectorAll('b'); if(b[0])b[0].textContent=addRows.length; if(b[1])b[1].textContent=qty; if(b[2])b[2].textContent=money(total);}
  }

  overlay.addEventListener('click',e=>{
    const qtyBtn=e.target.closest('.qty button');
    if(qtyBtn){
      e.preventDefault(); e.stopPropagation();
      const box=qtyBtn.closest('.qty'), input=box?.querySelector('input');
      if(!input)return;
      const buttons=[...box.querySelectorAll('button')];
      const delta=qtyBtn===buttons[0]?-1:1;
      input.value=Math.max(0,Math.floor(number(input.value))+delta);
      input.dispatchEvent(new Event('input',{bubbles:true}));
      return;
    }
    const del=e.target.closest('.row-delete');
    if(del){
      e.preventDefault();
      const row=del.closest('tr');
      if(row){row.remove();updateSummaries();}
      return;
    }
    const stepEl=e.target.closest('.step[data-step]');
    if(stepEl){
      const target=Number(stepEl.dataset.step);
      const panes=overlay.querySelectorAll('.step-pane');
      overlay.querySelectorAll('.step').forEach((s,i)=>{s.classList.toggle('active',i+1===target);s.classList.toggle('done',i+1<target);const n=s.querySelector('.num');if(n)n.textContent=i+1<target?'✓':i+1;});
      panes.forEach(p=>p.classList.toggle('active',Number(p.dataset.pane)===target));
      const back=document.getElementById('backBtn'),next=document.getElementById('nextBtn');
      if(back)back.style.visibility=target===1?'hidden':'visible';
      if(next)next.innerHTML=target===4?'✓ Save Payment':'Next →';
    }
  });

  overlay.addEventListener('input',e=>{
    if(e.target.closest('.qty') || e.target.closest('#addRows') || e.target.closest('#detailRows') || e.target.closest('#priceRows')){
      rowTotal(e.target.closest('tr')); updateSummaries();
    }
  });

  // Make + / − controls keyboard-friendly and initialize totals.
  overlay.querySelectorAll('.qty input').forEach(i=>{i.inputMode='numeric';i.setAttribute('aria-label','Quantity');});
  overlay.querySelectorAll('.qty').forEach(q=>{const b=q.querySelectorAll('button');if(b[0])b[0].setAttribute('aria-label','Decrease quantity');if(b[1])b[1].setAttribute('aria-label','Increase quantity');});
  updateSummaries();
})();

/* V139 — Add Stock > Add Product picker */
(()=>{
  const stockOverlay=document.getElementById('stockOverlay');
  if(!stockOverlay)return;
  const addBtn=stockOverlay.querySelector('.add-product-btn');
  if(!addBtn)return;
  addBtn.type='button';
  const catalog=[
    ['Sugar 1kg','SUGAR-001','Grocery','Pack',44,25,'🥡'],['Toor Dal 1kg','DAL-001','Grocery','Pack',138,20,'🫘'],
    ['Coffee Powder 200g','COFF-001','Beverages','Pack',165,15,'☕'],['Shampoo 200ml','SHP-001','Personal Care','Bottle',142,18,'🧴'],
    ['Biscuits 200g','BIS-001','Packaged Foods','Pack',28,40,'🍪'],['Bath Soap 100g','SOAP-001','Personal Care','Piece',32,50,'🧼'],
    ['Salt 1kg','SALT-001','Grocery','Pack',24,60,'🧂'],['Floor Cleaner 1L','CLN-001','Household','Bottle',118,16,'🧴'],
    ['Milk Powder 500g','MILK-001','Beverages','Pack',235,12,'🥛'],['Noodles 280g','NOOD-001','Packaged Foods','Pack',52,30,'🍜']
  ];
  const modal=document.createElement('div'); modal.className='inv-product-picker'; modal.innerHTML=`<section class="inv-product-picker-card">
    <header><div><h2>Add Product</h2><p>Select products to add to this stock entry.</p></div><button type="button" class="modal-x picker-close">×</button></header>
    <div class="picker-search"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="Search product by name, item code or category..."></div>
    <div class="picker-list"></div>
    <footer><span class="picker-count">0 products selected</span><div><button type="button" class="inv-btn picker-close">Cancel</button><button type="button" class="inv-btn primary picker-add" disabled>Add Selected Products</button></div></footer>
  </section>`;
  document.body.appendChild(modal);
  const list=modal.querySelector('.picker-list'), search=modal.querySelector('input'), add=modal.querySelector('.picker-add'), count=modal.querySelector('.picker-count');
  let selected=new Set();
  function render(filter=''){
    const q=filter.toLowerCase();
    list.innerHTML=catalog.filter(p=>!q||p.slice(0,3).some(v=>String(v).toLowerCase().includes(q))).map((p,i)=>`<label class="picker-product"><input type="checkbox" data-sku="${p[1]}" ${selected.has(p[1])?'checked':''}><span class="picker-thumb">${p[6]}</span><span><b>${p[0]}</b><small>Item Code: ITM-${String(i+1).padStart(6,'0')} · ${p[2]} · ${p[3]}</small></span><strong>₹${p[4].toFixed(2)}</strong></label>`).join('')||'<div class="picker-empty">No matching products found.</div>';
  }
  function sync(){count.textContent=`${selected.size} product${selected.size===1?'':'s'} selected`;add.disabled=!selected.size;}
  addBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();selected.clear();search.value='';render();sync();modal.classList.add('show');});
  modal.querySelectorAll('.picker-close').forEach(b=>b.addEventListener('click',()=>modal.classList.remove('show')));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show');const cb=e.target.closest('input[type=checkbox][data-sku]');if(cb){cb.checked?selected.add(cb.dataset.sku):selected.delete(cb.dataset.sku);sync();}});
  search.addEventListener('input',()=>render(search.value));
  add.addEventListener('click',()=>{
    const tbody=document.getElementById('addRows'); if(!tbody)return;
    selected.forEach(sku=>{const p=catalog.find(x=>x[1]===sku);if(!p||[...tbody.rows].some(r=>r.children[2]?.textContent.trim()===sku))return;const tr=document.createElement('tr');tr.innerHTML=`<td></td><td>${p[6]} ${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td><input value="${p[4].toFixed(2)}"></td><td><div class="qty"><button type="button">−</button><input value="${p[5]}"><button type="button">+</button></div></td><td>${(p[4]*p[5]).toLocaleString('en-IN',{minimumFractionDigits:2})}</td><td><button type="button" class="row-delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button></td>`;tbody.appendChild(tr);});
    [...tbody.rows].forEach((r,i)=>r.children[0].textContent=i+1);
    tbody.querySelector('input')?.dispatchEvent(new Event('input',{bubbles:true}));
    modal.classList.remove('show');
  });
  render(); sync();
})();

/* V140 — Add Stock: Add Product / Apply to All / Review Edit actions */
(()=>{
  const overlay=document.getElementById('stockOverlay');
  if(!overlay)return;
  const num=v=>Number(String(v??'').replace(/[^0-9.-]/g,''))||0;
  const fmt=v=>num(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

  // Keep newly-added Step 1 products available in the following stock-entry steps.
  function syncAddedProducts(){
    const addRows=[...overlay.querySelectorAll('#addRows tr')];
    const detail=document.getElementById('detailRows'), price=document.getElementById('priceRows');
    if(!detail||!price)return;
    const existingDetail=new Set([...detail.rows].map(r=>r.querySelector('small')?.textContent.match(/Item Code:\s*([^\s]+)/)?.[1]||''));
    const existingPrice=new Set([...price.rows].map(r=>r.querySelector('small')?.textContent.match(/Item Code:\s*([^\s]+)/)?.[1]||''));
    addRows.forEach(r=>{
      const name=r.children[1]?.textContent.trim()||'Product', sku=r.children[2]?.textContent.trim()||'', purchase=num(r.children[5]?.querySelector('input')?.value), qty=Math.max(1,num(r.querySelector('.qty input')?.value));
      if(sku&&!existingDetail.has(sku)){
        const tr=document.createElement('tr'); tr.innerHTML=`<td></td><td><b>${name}</b><br><small>Item Code: ${itemCode}</small></td><td><input value="BATCH-${sku.replace(/[^A-Z0-9]/gi,'').slice(0,6)}"></td><td><input type="date"></td><td><input value="${(purchase*1.25).toFixed(2)}"></td><td><input value="${purchase.toFixed(2)}"></td><td><div class="qty"><button type="button">−</button><input value="${qty}"><button type="button">+</button></div></td><td>${fmt(purchase*qty)}</td><td><select><option>Main Warehouse</option></select></td><td><button type="button" class="row-delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button></td>`; detail.appendChild(tr);
      }
      if(sku&&!existingPrice.has(sku)){
        const tr=document.createElement('tr'); tr.innerHTML=`<td></td><td><b>${name}</b><br><small>Item Code: ${itemCode}<br>Batch: New</small></td><td><input value="${(purchase*1.25).toFixed(2)}"></td><td><input value="${purchase.toFixed(2)}"></td><td><select><option>5%</option><option>12%</option><option>18%</option><option>28%</option></select></td><td><input value="${(purchase*1.05).toFixed(2)}" disabled></td><td><div class="qty"><button type="button">−</button><input value="${qty}"><button type="button">+</button></div></td><td>${fmt(purchase*1.05*qty)}</td>`; price.appendChild(tr);
      }
    });
    [detail,price].forEach(t=>[...t.rows].forEach((r,i)=>r.children[0].textContent=i+1));
  }

  // Apply common tax/quantity to all rows from one compact dialog.
  const applyBtn=[...overlay.querySelectorAll('.step-pane[data-pane="3"] button')].find(b=>b.textContent.includes('Apply to All'));
  if(applyBtn){
    applyBtn.type='button';
    applyBtn.addEventListener('click',()=>{
      let modal=document.getElementById('applyAllStockModal');
      if(!modal){
        modal=document.createElement('div'); modal.id='applyAllStockModal'; modal.className='inv-product-picker';
        modal.innerHTML=`<section class="inv-product-picker-card" style="max-width:520px"><header><div><h2>Apply to All</h2><p>Apply common values to every product row.</p></div><button type="button" class="modal-x aa-close">×</button></header><div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px"><div class="field"><label>Tax (%)</label><select id="aaTax"><option value="">Keep existing</option><option>0</option><option>5</option><option>12</option><option>18</option><option>28</option></select></div><div class="field"><label>Quantity</label><input id="aaQty" type="number" min="1" placeholder="Keep existing"></div></div><footer><span></span><div><button type="button" class="inv-btn aa-close">Cancel</button><button type="button" class="inv-btn primary" id="aaApply">Apply</button></div></footer></section>`;
        document.body.appendChild(modal);
        modal.querySelectorAll('.aa-close').forEach(b=>b.onclick=()=>modal.classList.remove('show'));
        modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
        modal.querySelector('#aaApply').onclick=()=>{
          const tax=modal.querySelector('#aaTax').value, qty=modal.querySelector('#aaQty').value;
          overlay.querySelectorAll('#priceRows tr').forEach(r=>{
            const sel=r.querySelector('select'), q=r.querySelector('.qty input'), purchase=num(r.children[3]?.querySelector('input')?.value);
            if(tax!==''&&sel){const wanted=tax+'%';let o=[...sel.options].find(x=>x.textContent.trim()===wanted);if(!o){o=new Option(wanted,wanted);sel.add(o)}sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}
            if(qty!==''&&q)q.value=Math.max(1,Math.floor(num(qty)));
            const rate=tax!==''?num(tax):num(sel?.options[sel.selectedIndex]?.textContent); const unit=purchase*(1+rate/100);
            const unitInput=r.children[5]?.querySelector('input'); if(unitInput)unitInput.value=unit.toFixed(2);
            if(r.children[7])r.children[7].textContent=fmt(unit*num(q?.value));
          });
          modal.classList.remove('show');
        };
      }
      modal.classList.add('show');
    });
  }

  // Review Edit returns to Stock Information instead of doing nothing.
  const edit=overlay.querySelector('.review-edit-btn');
  if(edit){edit.type='button';edit.addEventListener('click',()=>{const first=overlay.querySelector('.step[data-step="1"]');if(first)first.click();});}

  // Before moving forward, mirror products added through the picker to later steps.
  const next=document.getElementById('nextBtn'); if(next)next.addEventListener('click',()=>syncAddedProducts(),true);
})();

/* V142 — Add Stock > Item Details > Add More Products */
(()=>{
  const overlay=document.getElementById('stockOverlay');
  if(!overlay)return;
  const primaryAdd=overlay.querySelector('.add-product-btn');
  const moreBtn=[...overlay.querySelectorAll('.step-pane[data-pane="2"] button')].find(b=>b.textContent.replace(/\s+/g,' ').trim().includes('Add More Products'));
  if(!primaryAdd||!moreBtn)return;
  moreBtn.type='button';
  moreBtn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    primaryAdd.click();
  });
})();
