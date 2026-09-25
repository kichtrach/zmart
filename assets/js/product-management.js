(() => {
  const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const table=$('#productTable'), rows=$$('tbody tr',table), menu=$('#productMenu'), modal=$('#productModal'), modalTitle=$('#productModalTitle'), modalBody=$('#productModalBody'), toast=$('#productToast');
  let activeProduct='';
  const notify=(msg)=>{toast.textContent=msg;toast.hidden=false;clearTimeout(window.__prodToast);window.__prodToast=setTimeout(()=>toast.hidden=true,2400)};
  const openModal=(title,html,saveLabel='Save')=>{modalTitle.textContent=title;modalBody.innerHTML=html;$('#productModalSave').textContent=saveLabel;modal.hidden=false};
  const closeModal=()=>modal.hidden=true;
  $$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));
  modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});

  const addForm=()=>{ location.href='add-product.html'; };
  $('#addProductTop')?.addEventListener('click',addForm); $('#qaAddProduct')?.addEventListener('click',addForm);
  $('#productModalSave')?.addEventListener('click',()=>{closeModal();notify(`${modalTitle.textContent.replace('Add New ','')} saved successfully.`)});

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

  $('#exportProducts')?.addEventListener('click',()=>{const csv=['Product,SKU,Category,Brand,Price,Stock,Status',...rows.map(r=>{const c=$$('td',r);return [c[1].innerText.trim(),c[2].innerText,c[4].innerText,c[5].innerText,c[6].innerText,c[7].innerText,c[8].innerText].map(v=>'"'+v.replaceAll('"','""')+'"').join(',')})].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='zmart-products.csv';a.click();URL.revokeObjectURL(a.href);notify('Products exported successfully.')});
  $('#columnsProducts')?.addEventListener('click',()=>openModal('Choose Columns',`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">${['Product Name','SKU','Barcode','Category','Brand','Selling Price','Stock','Status'].map(x=>`<label><input type="checkbox" checked> ${x}</label>`).join('')}</div>`,'Apply'));
  const infoAction=(id,title,msg)=>$(id)?.addEventListener('click',()=>openModal(title,`<div style="font-size:12px;line-height:1.8">${msg}</div>`,'Close'));
  infoAction('#qaImportProducts','Import Products','Upload a CSV/XLSX file to import product master data. Sample import validation and dummy preview are enabled in this prototype.');
  infoAction('#qaBulkUpload','Bulk Upload','Bulk upload supports product images and master data packages.');
  infoAction('#qaProductReport','Product Report','Product report generated for 2,846 products across all active categories.');
  infoAction('#qaLowStockReport','Low Stock Report','156 products are currently below configured reorder levels.');
  infoAction('#lowStockDetails','Low Stock Products','156 products are currently flagged as low stock. Use Inventory Management for replenishment actions.');
  infoAction('#categoryViewAll','Products by Category','Grocery: 1,256 · Home Care: 586 · Personal Care: 412 · Dairy: 298 · Others: 294.');
  infoAction('#recentProductsViewAll','Recent Product Activities','Latest product additions, updates and stock changes are shown here.');
})();
