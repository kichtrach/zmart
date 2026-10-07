(() => {
  const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const table=$('#productTable'), rows=$$('tbody tr',table), menu=$('#productMenu'), modal=$('#productModal'), modalTitle=$('#productModalTitle'), modalBody=$('#productModalBody'), toast=$('#productToast');
  let activeProduct='';
  const notify=(msg)=>{toast.textContent=msg;toast.hidden=false;clearTimeout(window.__prodToast);window.__prodToast=setTimeout(()=>toast.hidden=true,2400)};
  const openModal=(title,html,saveLabel='Save')=>{modalTitle.textContent=title;modalBody.innerHTML=html;$('#productModalSave').textContent=saveLabel;modal.hidden=false};
  const closeModal=()=>{modal.hidden=true;modal.classList.remove('add-product-mode')};
  $$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));
  modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});

  const addProductHtml=()=>`<div class="add-product-popup">
    <div class="ap-popup-tabs"><button class="active" type="button">Basic Information</button><button type="button">Pricing & Tax</button><button type="button">Inventory</button></div>
    <div class="modal-form add-product-grid">
      <label class="wide"><span class="field-label-inline">Product Name <em>*</em></span><input id="newProductName" placeholder="Enter product name" value="India Gate Basmati Rice 5kg"></label>
      <label><span class="field-label-inline">Item Code <em>*</em></span><input id="newProductItemCode" placeholder="e.g. ITM-000014" value="ITM-000014"></label>
      <label>Barcode<input id="newProductBarcode" placeholder="Enter / scan barcode" value="8901234500051"></label>
      <label><span class="field-label-inline">Category <em>*</em></span><select id="newProductCategory"><option>Grocery</option><option>Fruits & Vegetables</option><option>Dairy & Bakery</option><option>Beverages</option><option>Snacks</option><option>Household</option><option>Personal Care</option><option>Baby Care</option></select></label>
      <label><span class="field-label-inline">Sub Category <em>*</em></span><select id="newProductSub"><option>Rice & Grains</option><option>Cooking Oil</option><option>Flour & Atta</option><option>Spices</option><option>Pulses</option></select></label>
      <label><span class="field-label-inline">Brand <em>*</em></span><select id="newProductBrand"><option>India Gate</option><option>Aachi</option><option>Tata</option><option>Fortune</option><option>Britannia</option><option>Amul</option><option>HUL</option></select></label>
      <label><span class="field-label-inline">Unit <em>*</em></span><select id="newProductUnit"><option>Pack</option><option>Kg</option><option>Piece</option><option>Box</option><option>Bottle</option></select></label>
      <label><span class="field-label-inline">Purchase Price (₹) <em>*</em></span><input id="newProductPurchase" type="number" value="420"></label>
      <label><span class="field-label-inline">Selling Price (₹) <em>*</em></span><input id="newProductPrice" type="number" value="495"></label>
      <label><span class="field-label-inline">Tax / GST <em>*</em></span><select id="newProductTax"><option>5%</option><option>0%</option><option>12%</option><option>18%</option><option>28%</option></select></label>
      <label>HSN Code<input id="newProductHsn" value="1006"></label>
      <label><span class="field-label-inline">Opening Stock <em>*</em></span><input id="newProductStock" type="number" value="120"></label>
      <label><span class="field-label-inline">Reorder Level <em>*</em></span><input id="newProductReorder" type="number" value="25"></label>
      <label><span class="field-label-inline">Status <em>*</em></span><select id="newProductStatus"><option>Active</option><option>Inactive</option><option>Draft</option></select></label>
      <label class="wide">Description<textarea id="newProductDescription" placeholder="Enter product description">Premium long-grain basmati rice.</textarea></label>
    </div></div>`;
  const addForm=(e)=>{
    e?.preventDefault();
    e?.stopPropagation();
    if(!modal || !modalTitle || !modalBody) return;
    openModal('Add New Product',addProductHtml(),'Save Product');
    modal.classList.add('add-product-mode');
    // Popup tabs are interactive; each tab scrolls/focuses the related fields while preserving one form.
    const tabs=$$('.ap-popup-tabs button',modal);
    tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{
      tabs.forEach(x=>x.classList.remove('active')); tab.classList.add('active');
      const target=i===0?$('#newProductName',modal):i===1?$('#newProductPurchase',modal):$('#newProductStock',modal);
      target?.focus(); target?.scrollIntoView({block:'center',behavior:'smooth'});
    }));
  };
  window.zmOpenAddProduct=addForm;
  $('#addProductTop')?.addEventListener('click',addForm);
  $('#qaAddProduct')?.addEventListener('click',addForm);
  $('#productModalSave')?.addEventListener('click',()=>{
    if(modalTitle.textContent==='Add New Product'){
      const name=$('#newProductName')?.value.trim(),itemCode=$('#newProductItemCode')?.value.trim().toUpperCase(),category=$('#newProductCategory')?.value,brand=$('#newProductBrand')?.value,price=Number($('#newProductPrice')?.value||0),stock=Number($('#newProductStock')?.value||0),barcode=$('#newProductBarcode')?.value.trim();
      const required=[['#newProductName','Product Name'],['#newProductItemCode','Item Code'],['#newProductCategory','Category'],['#newProductBrand','Brand'],['#newProductPrice','Selling Price'],['#newProductStock','Opening Stock']];
      for(const [sel] of required){const el=$(sel);if(!el?.value || (el.type==='number'&&Number(el.value)<0)){el?.focus();el?.classList.add('field-error');setTimeout(()=>el?.classList.remove('field-error'),1400);return;}}
      const tbody=table?.querySelector('tbody'); if(tbody){const n=tbody.rows.length+1;const tr=document.createElement('tr');tr.dataset.brand=brand;tr.dataset.category=category;tr.dataset.status=$('#newProductStatus').value;tr.innerHTML=`<td>${n}</td><td><span class="product-thumb rice">${name.charAt(0).toUpperCase()}</span><b>${name}</b></td><td><span class="item-code-badge">${itemCode}</span></td><td>${barcode||'--'}</td><td>${category}</td><td>${brand}</td><td>₹ ${price.toFixed(2)}</td><td>${stock}</td><td><span class="product-status active">${$('#newProductStatus').value}</span></td><td><button class="product-more" data-name="${name}"><i class="fa-solid fa-ellipsis"></i></button></td>`;tbody.prepend(tr);}
      closeModal();modal.classList.remove('add-product-mode');notify('Product added successfully.');return;
    }
    closeModal();notify(`${modalTitle.textContent.replace('Add New ','')} saved successfully.`)
  });

  function filterRows(){
    const q=$('#productSearch').value.trim().toLowerCase(),cat=$('#productCategory').value,brand=$('#productBrand').value,status=$('#productStatus').value;
    let visible=0;
    rows.forEach(r=>{const okQ=!q||r.textContent.toLowerCase().includes(q),okC=cat==='All Categories'||r.dataset.category===cat,okB=brand==='All Brands'||r.dataset.brand===brand,okS=status==='All Status'||r.dataset.status===status;const show=okQ&&okC&&okB&&okS;r.hidden=!show;if(show)visible++});
    $('#productCount').textContent=`Showing ${visible?1:0} to ${visible} of ${visible} filtered entries`;
  }
  $('#productFilter')?.addEventListener('click',filterRows); $('#productSearch')?.addEventListener('input',filterRows);
  $('#productReset')?.addEventListener('click',()=>{['#productSearch'].forEach(s=>$(s).value='');$('#productCategory').selectedIndex=0;$('#productBrand').selectedIndex=0;$('#productStatus').selectedIndex=0;rows.forEach(r=>r.hidden=false);$('#productCount').textContent='Showing 1 to 10 of 2,846 entries'});

  $$('.product-more').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();activeProduct=btn.dataset.name;const r=btn.getBoundingClientRect();menu.style.left=Math.min(r.left-155,innerWidth-210)+'px';menu.style.top=Math.min(r.bottom+4,innerHeight-200)+'px';menu.hidden=false}));
  document.addEventListener('click',e=>{if(!e.target.closest('.product-menu')&&!e.target.closest('.product-more'))menu.hidden=true});
  menu?.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;menu.hidden=true;const act=b.dataset.act;if(act==='view')openModal('Product Details',`<div class="modal-form"><label class="wide">Product<strong style="display:block;margin-top:8px;font-size:16px">${activeProduct}</strong></label><label>Status<strong style="display:block;margin-top:8px;color:#07874a">Active</strong></label><label>Current Stock<strong style="display:block;margin-top:8px">235 Units</strong></label><label>Warehouse<strong style="display:block;margin-top:8px">Main Warehouse</strong></label><label>Selling Price<strong style="display:block;margin-top:8px">₹ 120.00</strong></label></div>`,'Close');if(act==='edit')openModal('Edit Product',`<div class="modal-form"><label class="wide">Product Name<input value="${activeProduct}"></label><label>Selling Price<input value="120"></label><label>Stock<input value="235"></label><label>Status<select><option>Active</option><option>Inactive</option></select></label></div>`,'Update Product');if(act==='stock')openModal('Stock History',`<div style="font-size:12px;line-height:2"><b>${activeProduct}</b><p>31 May 2025 — Stock In: +120</p><p>30 May 2025 — Sale: -24</p><p>29 May 2025 — Adjustment: +5</p></div>`,'Close');if(act==='status')openModal('Change Product Status',`<div class="modal-form"><label class="wide">Status<select><option>Active</option><option>Inactive</option><option>Discontinued</option></select></label></div>`,'Update Status');if(act==='barcode')openModal('Barcode / Print Label',`<div style="text-align:center;padding:20px"><i class="fa-solid fa-barcode" style="font-size:72px;color:#07145b"></i><p style="font-weight:600">${activeProduct}</p><p>8901234567890</p></div>`,'Print Label')});

  $('#exportProducts')?.addEventListener('click',()=>{const csv=['Product,Item Code,Barcode,Category,Brand,Price,Stock,Status',...rows.map(r=>{const c=$$('td',r);return [c[1].innerText.trim(),c[2].innerText,c[3].innerText,c[4].innerText,c[5].innerText,c[6].innerText,c[7].innerText,c[8].innerText].map(v=>'"'+v.replaceAll('"','""')+'"').join(',')})].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='zmart-products.csv';a.click();URL.revokeObjectURL(a.href);notify('Products exported successfully.')});
  $('#columnsProducts')?.addEventListener('click',()=>openModal('Choose Columns',`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">${['Product Name','Item Code','Barcode','Category','Brand','Selling Price','Stock','Status'].map(x=>`<label><input type="checkbox" checked> ${x}</label>`).join('')}</div>`,'Apply'));
  const infoAction=(id,title,msg)=>$(id)?.addEventListener('click',()=>openModal(title,`<div style="font-size:12px;line-height:1.8">${msg}</div>`,'Close'));
  infoAction('#qaImportProducts','Import Products','Upload a CSV/XLSX file to import product master data. Sample import validation and dummy preview are enabled in this prototype.');
  infoAction('#qaBulkUpload','Bulk Upload','Bulk upload supports product images and master data packages.');
  infoAction('#qaProductReport','Product Report','Product report generated for 2,846 products across all active categories.');
  infoAction('#qaLowStockReport','Low Stock Report','156 products are currently below configured reorder levels.');
  infoAction('#lowStockDetails','Low Stock Products','156 products are currently flagged as low stock. Use Inventory Management for replenishment actions.');
  infoAction('#categoryViewAll','Products by Category','Grocery: 1,256 · Home Care: 586 · Personal Care: 412 · Dairy: 298 · Others: 294.');
  infoAction('#recentProductsViewAll','Recent Product Activities','Latest product additions, updates and stock changes are shown here.');
})();
