
(() => {
  const toast = msg => {
    let el=document.getElementById('branchToast');
    if(!el){el=document.createElement('div');el.id='branchToast';el.className='toast';document.body.appendChild(el);}
    el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);
  };

  document.addEventListener('click',e=>{
    const link=e.target.closest('[data-href]');
    if(link){location.href=link.dataset.href;return;}
  });

  const file=(location.pathname.split('/').pop()||'branch-master.html').toLowerCase();
  const activeMap={
    'branch-master.html':'Branch Master','add-branch.html':'Branch Master','edit-branch.html':'Branch Master',
    'branch-configuration.html':'Branch Configuration','branch-targets.html':'Branch Targets',
    'branch-performance.html':'Branch Performance','branch-expenses.html':'Branch Expenses',
    'branch-status.html':'Branch Status','branch-dashboard.html':'Branch Dashboard'
  };
  const activate=()=>{
    const group=document.querySelector('[data-group="branch"]');
    if(group){group.classList.add('open','active');group.querySelector('.nav-item')?.setAttribute('aria-expanded','true');}
    document.querySelectorAll('[data-subnav]').forEach(b=>b.classList.toggle('active',b.dataset.subnav===activeMap[file]));
  };
  requestAnimationFrame(activate);

  function closeFloating(){document.querySelectorAll('.action-menu').forEach(x=>x.remove());}
  document.addEventListener('click',e=>{
    if(!e.target.closest('.action-menu')&&!e.target.closest('.branch-actions'))closeFloating();
  });

  document.querySelectorAll('.branch-actions').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();closeFloating();
    const tr=btn.closest('tr'),r=btn.getBoundingClientRect();
    const menu=document.createElement('div');menu.className='action-menu';
    menu.style.left=Math.max(10,Math.min(r.left-190,innerWidth-240))+'px';
    menu.style.top=Math.max(10,Math.min(r.bottom+5,innerHeight-330))+'px';
    menu.dataset.code=tr.dataset.code;menu.dataset.name=tr.dataset.name;
    menu.innerHTML=`
      <button data-row-action="view"><i class="fa-regular fa-eye"></i><span>View Details<small>View complete branch information</small></span></button>
      <button data-row-action="edit"><i class="fa-regular fa-pen-to-square"></i><span>Edit Branch<small>Update branch information</small></span></button>
      <button data-row-action="duplicate"><i class="fa-regular fa-copy"></i><span>Duplicate Branch<small>Create a copy of this branch</small></span></button>
      <button data-row-action="status"><i class="fa-regular fa-circle-check"></i><span>Change Status<small>Activate or deactivate branch</small></span></button>
      <button data-row-action="manager"><i class="fa-regular fa-user"></i><span>Assign Manager<small>Assign or change branch manager</small></span></button>
      <button data-row-action="performance"><i class="fa-solid fa-chart-column"></i><span>View Performance<small>View branch performance report</small></span></button>
      <button class="danger" data-row-action="delete"><i class="fa-regular fa-trash-can"></i><span>Delete Branch<small>Permanently delete this branch</small></span></button>`;
    document.body.appendChild(menu);
  }));

  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-row-action]');if(!a)return;
    const menu=a.closest('.action-menu'),code=menu.dataset.code||'ZM001',name=menu.dataset.name||'ZMart Head Office';closeFloating();
    const action=a.dataset.rowAction;
    if(action==='view')return openDrawer(code,name);
    if(action==='edit')return location.href='edit-branch.html';
    if(action==='status')return openStatus(code,name);
    if(action==='manager')return openManager(code,name);
    if(action==='performance')return location.href='branch-performance.html';
    if(action==='duplicate')return toast('Branch duplicated as draft.');
    if(action==='delete')return confirm('Delete this branch?')&&toast('Branch deleted.');
  });

  function overlay(kind,inner){
    const ov=document.createElement('div');ov.className=kind==='drawer'?'drawer-overlay':'modal-overlay';ov.innerHTML=inner;document.body.appendChild(ov);
    ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('[data-close]'))ov.remove();});
    return ov;
  }
  function openDrawer(code,name){
    overlay('drawer',`<div class="drawer"><div class="drawer-head"><h2>Branch Details</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="drawer-body">
      <div class="branch-hero"><div class="branch-icon"><i class="fa-regular fa-building"></i></div><div><h3>${name} <span class="badge active">Active</span></h3><p>Branch Code : ${code}</p></div></div>
      <div class="detail-section"><h4>Contact Information</h4><div class="kv"><b>Phone Number</b><span>+91 44 1234 5678</span><b>Email</b><span>headoffice@zmartsupermarket.com</span><b>Website</b><span>www.zmartsupermarket.com</span></div></div>
      <div class="detail-section"><h4>Address</h4><div class="kv"><b>Address</b><span>No. 45, Market Street, Anna Salai</span><b>City</b><span>Chennai</span><b>State</b><span>Tamil Nadu</span><b>Pincode</b><span>600002</span></div></div>
      <div class="detail-section"><h4>Branch Manager</h4><div class="kv"><b>Manager Name</b><span>Ramesh Kumar</span><b>Designation</b><span>Chief Operating Officer</span><b>Phone</b><span>+91 98765 43210</span><b>Email</b><span>ramesh.kumar@zmartsupermarket.com</span></div></div>
      <div class="detail-section"><h4>Business Information</h4><div class="kv"><b>Date of Opening</b><span>01/01/2018</span><b>Business Type</b><span>Retail Supermarket</span><b>GST Number</b><span>33AAACZ1234A1Z5</span><b>PAN Number</b><span>AAACZ1234A</span><b>Status</b><span>Active</span></div></div>
    </div><div class="drawer-foot"><button class="btn" data-close>Close</button></div></div>`);
  }
  function openStatus(code,name){
    overlay('modal',`<div class="modal"><div class="modal-head"><h2>Change Branch Status</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">
      <div class="branch-hero"><div class="branch-icon"><i class="fa-regular fa-building"></i></div><div><h3>${code} - ${name}</h3><p>Branch Code : ${code} &nbsp; | &nbsp; City : Chennai</p></div></div>
      <p><b>Current Status</b> &nbsp; <span class="badge active">Active</span></p>
      <div class="field"><label>Change Status To <span class="req">*</span></label><label class="check"><input type="radio" name="st" checked> Active</label><label class="check"><input type="radio" name="st"> Inactive</label></div>
      <div class="field" style="margin-top:14px"><label>Reason (Optional)</label><textarea class="textarea" placeholder="Enter reason for status change..."></textarea></div>
    </div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-modal-save="status">Update Status</button></div></div>`);
  }
  function openManager(code,name){
    overlay('modal',`<div class="modal"><div class="modal-head"><h2>Assign Manager</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">
      <div class="branch-hero"><div class="branch-icon"><i class="fa-regular fa-building"></i></div><div><h3>${code} - ${name}</h3><p>Branch Code : ${code} &nbsp; | &nbsp; City : Chennai</p></div></div>
      <div class="field"><label>Current Manager</label><input class="input" value="Ramesh Kumar (Chief Operating Officer)" readonly></div>
      <div class="field" style="margin-top:14px"><label>Assign New Manager <span class="req">*</span></label><select class="select"><option>Select Manager</option><option>Karthik Raj</option><option>Priya Sharma</option></select></div>
      <div class="field" style="margin-top:14px"><label>Effective From <span class="req">*</span></label><input type="date" class="input ui-input" value="2025-05-16"></div>
      <div class="field" style="margin-top:14px"><label>Notes (Optional)</label><textarea class="textarea" placeholder="Enter notes..."></textarea></div>
    </div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-modal-save="manager">Assign Manager</button></div></div>`);
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-modal-save]');if(!b)return;
    toast(b.dataset.modalSave==='manager'?'Manager assigned successfully.':'Branch status updated successfully.');
    b.closest('.modal-overlay')?.remove();
  });

  const search=document.getElementById('branchSearch'),status=document.getElementById('statusFilter');
  const filter=()=>{
    document.querySelectorAll('#branchTable tbody tr').forEach(tr=>{
      const q=(search?.value||'').toLowerCase(),st=status?.value||'All';
      tr.style.display=((!q||tr.innerText.toLowerCase().includes(q))&&(st==='All'||tr.dataset.status===st))?'':'none';
    });
  };
  search?.addEventListener('input',filter);status?.addEventListener('change',filter);

  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-action]');if(!a)return;
    const action=a.dataset.action;
    if(action==='reset'){if(search)search.value='';if(status)status.value='All';filter();}
    if(action==='export')toast('Branch export prepared.');
    if(action==='save-branch')toast('Branch saved successfully.');
    if(action==='save-config')toast('Branch configuration saved.');
  });

  const configContent=document.getElementById('configContent');
  const configSideMount=document.getElementById('configSideMount');
  const configNote=document.getElementById('configNote');
  if(configContent){
    const sw=(label,on=true)=>`<div class="switch-row"><span>${label}</span><label class="switch"><input type="checkbox" ${on?'checked':''}><span></span></label></div>`;
    const swDesc=(title,desc,on=true)=>`<div class="switch-setting"><div><b>${title}</b>${desc?`<small>${desc}</small>`:''}</div><label class="switch"><input type="checkbox" ${on?'checked':''}><span></span></label></div>`;
    const inputSuffix=(value,suffix)=>`<div class="input-suffix"><input class="input" value="${value}"><span>${suffix}</span></div>`;
    const field=(label,html)=>`<div class="field"><label>${label}</label>${html}</div>`;
    const sel=v=>`<select class="select"><option>${v}</option></select>`;
    const table=(headers,rows)=>`<div class="table-wrap"><table class="small-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r,ri)=>`<tr data-config-row="${ri}">${r.map((c,ci)=>`<td>${headers[ci]==='Actions' ? `<button type="button" class="config-row-action" data-config-actions aria-label="Open actions"><i class="fa-solid fa-ellipsis-vertical"></i></button>` : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const miniSwitch=(on=true,attrs='')=>`<label class="switch compact-switch"><input type="checkbox" ${on?'checked':''} ${attrs}><span></span></label>`;
    const radioDot=(checked=false,name='config-default')=>`<label class="config-radio"><input type="radio" name="${name}" ${checked?'checked':''}><span></span></label>`;
    const channelIcons=(icons)=>`<span class="channel-icons">${icons.map(i=>`<i class="${i}"></i>`).join('')}</span>`;
    const timeInput=(value)=>`<div class="time-input"><input class="input" type="time" value="${value}"><i class="fa-regular fa-clock"></i></div>`;

    const general=()=>`<div class="config-layout"><div class="config-main"><div class="section-card"><h3>General Settings</h3><div class="config-grid">
      ${field('Branch Name','<input class="input" value="ZMart Head Office">')}${field('Branch Code','<input class="input" value="ZM001" readonly>')}
      ${field('Branch Type',sel('Head Office'))}${field('Parent Branch',sel('Select parent branch (if any)'))}
      ${field('Email','<input class="input" value="headoffice@zmartsupermarket.com">')}${field('Phone Number','<input class="input" value="+91 44 1234 5678">')}
      ${field('Alternate Phone','<input class="input" value="+91 98 7654 3210">')}${field('GST Number','<input class="input" value="33AAACZ1234A1Z5">')}
      ${field('PAN Number','<input class="input" value="AAACZ1234A">')}${field('Currency',sel('INR - Indian Rupee'))}
      ${field('Timezone',sel('(UTC+05:30) Asia/Kolkata'))}${field('Date Format',sel('DD/MM/YYYY'))}
      ${field('Time Format','<div class="checks"><label class="check"><input type="radio" checked> 12 Hours (AM/PM)</label><label class="check"><input type="radio"> 24 Hours</label></div>')}
      ${field('Default Warehouse',sel('ZMart Head Office Warehouse'))}${field('Financial Year Start','<input type="date" class="input ui-input" value="2025-04-01">')}${field('Status',sw('Active',true))}
    </div><div class="field" style="margin-top:14px"><label>Notes (Optional)</label><textarea class="textarea" placeholder="Enter notes about this branch..."></textarea></div></div></div>
    <div class="config-side"><div class="section-card"><h3>Module Access</h3>${['POS & Billing','Inventory Management','Purchase Management','Customer Management','Employee Management','Accounting & Finance','Reports & Analytics','CRM','E-Commerce'].map((x,i)=>`<label class="check" style="display:flex;margin:12px 0"><input type="checkbox" ${i<8?'checked':''}> ${x}</label>`).join('')}<div style="display:flex;justify-content:space-between;color:#147a2e"><b>Select All</b><b style="color:#e22">Clear All</b></div></div>
    <div class="section-card"><h3>Working Hours</h3>${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=>sw(d,true)).join('')}<button class="btn" style="margin-top:8px"><i class="fa-solid fa-plus"></i> Add Special Hours</button></div></div></div>`;

    const billing=()=>`<div class="config-layout"><div class="config-main"><div class="section-card"><h3>Invoice Settings</h3><div class="config-grid cols-3">
      ${field('Invoice Prefix','<input class="input" value="ZM001">')}${field('Invoice Numbering Format',sel('Sequential (1234, 1235, 1236...)'))}${field('Next Invoice Number','<input class="input" value="1001">')}
      ${field('Invoice Start Number','<input class="input" value="1001">')}${field('Invoice Reset Frequency',sel('Financial Year'))}${field('Financial Year',sel('2025 - 2026 (01 Apr 2025 - 31 Mar 2026)'))}
      ${field('Default Invoice Type',sel('Tax Invoice'))}${field('Default Payment Terms',sel('Immediate'))}${field('Due Days','<input class="input" value="0">')}
    </div></div><div style="display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:12px">
      <div class="section-card"><h3>Tax Settings</h3>${field('GST Registration Type','<div class="checks"><label class="check"><input type="radio" checked> Regular</label><label class="check"><input type="radio"> Composition</label></div>')}${field('GSTIN','<input class="input" value="33AAACZ1234A1Z5">')}${field('Place of Supply',sel('Tamil Nadu (33)'))}${field('Default Tax Template',sel('GST - State'))}</div>
      <div class="section-card"><h3>Additional Charges</h3>${table(['#','Charge Name','Type','Amount/Value','Status','Actions'],[['1','Delivery Charge','Fixed','₹ 50.00','Active','⋮'],['2','Packing Charge','Fixed','₹ 20.00','Active','⋮'],['3','Service Charge','Percentage','2.00 %','Active','⋮'],['4','Discount (Round Off)','Fixed','₹ 0.50','Active','⋮']])}<button class="btn" style="margin-top:10px"><i class="fa-solid fa-plus"></i> Add Charge</button></div>
      <div class="section-card"><h3>Invoice Footer</h3>${field('Footer Note (Line 1)','<textarea class="textarea">Thank you for shopping with ZMart.</textarea>')}${field('Footer Note (Line 2)','<textarea class="textarea">Goods once sold will not be taken back.</textarea>')}${field('Footer Note (Line 3)','<textarea class="textarea">This is a computer generated invoice.</textarea>')}</div>
    </div></div><div class="config-side"><div class="section-card"><h3>Invoice Types</h3><button class="btn"><i class="fa-solid fa-plus"></i> Add Invoice Type</button>${table(['#','Invoice Type','Primary','Status','Actions'],[['1','Tax Invoice','●','Active','⋮'],['2','Proforma Invoice','○','Active','⋮'],['3','Credit Note','○','Active','⋮'],['4','Debit Note','○','Active','⋮']])}</div><div class="section-card"><h3>Payment Methods</h3>${['Cash','Card','UPI','Net Banking','Cheque','Credit (Ledger)'].map((x,i)=>sw(x,i!==4)).join('')}</div></div></div>`;

    const inventory=()=>`<div class="config-layout"><div class="config-main"><div class="section-card"><h3>Inventory Settings</h3><div class="config-grid cols-3 inventory-primary-grid">
      ${field('Inventory Valuation Method <span class="req">*</span>',sel('Weighted Average'))}${field('Inventory Account <span class="req">*</span>',sel('Inventory - ZM001'))}${field('Negative Stock Warning',swDesc('', 'Enable warning for negative stock', true))}
      ${field('Stock Entry Method <span class="req">*</span>',sel('Allow Below Zero Stock'))}${field('Low Stock Alert',inputSuffix('10','% of reorder level'))}${field('Batch Management',swDesc('', 'Enable batch tracking', true))}
      ${field('Default Unit of Measure <span class="req">*</span>',sel('Piece'))}${field('Expiry Alert Days <span class="req">*</span>',inputSuffix('30','days before expiry'))}${field('Serial Number Tracking',swDesc('', 'Enable serial number tracking', false))}
    </div></div><div class="inventory-lower-grid">
      <div class="section-card"><h3>Reorder Settings</h3>${field('Reorder Level Calculation <span class="req">*</span>',sel('Based on Average Sales'))}${field('Reorder Period <span class="req">*</span>',sel('7 Days'))}${field('Safety Stock Days <span class="req">*</span>',inputSuffix('5','days'))}${swDesc('Auto Reorder Suggestion','Enable auto reorder suggestion on low stock',true)}</div>
      <div class="section-card"><h3>Stock Transfer Settings</h3>${swDesc('Allow Inter-Branch Transfer','Allow stock transfer between branches',true)}${swDesc('Require Approval for Transfer','Require approval for stock transfer',true)}${field('Default Transfer Warehouse <span class="req">*</span>',sel('ZMart Head Office Warehouse'))}${swDesc('Allow Partial Transfer','Allow partial quantity transfer',true)}</div>
      <div class="section-card"><h3>Stock Adjustment Settings</h3>${swDesc('Allow Stock Adjustment','Allow manual stock adjustments',true)}${swDesc('Require Approval for Adjustment','Require approval for adjustments',false)}${swDesc('Adjustment Reason Mandatory','Make reason mandatory for adjustments',true)}${field('Adjustment Limit',inputSuffix('5','%  Max adjustment percentage'))}</div>
    </div></div><div class="config-side"><div class="section-card warehouse-settings-card"><h3>Warehouses</h3><small class="section-subtitle">Manage warehouses for this branch.</small><div class="center-action"><button class="btn"><i class="fa-solid fa-plus"></i> Add Warehouse</button></div>${table(['#','Warehouse Name','Code','Default','Status','Actions'],[['1','ZMart Head Office Warehouse','WH001','★','Active','⋮'],['2','ZMart Secondary Warehouse','WH002','☆','Active','⋮'],['3','ZMart Return Warehouse','WH003','☆','Active','⋮']])}</div><div class="section-card"><h3>Bin / Location Settings</h3><small class="section-subtitle">Manage bin and location preferences.</small>${swDesc('','Enable bin location management',true)}${swDesc('','Make default bin mandatory',true)}${swDesc('Bin Barcode Scanning','Enable barcode scanning for bins',true)}</div><div class="section-card"><h3>Stock Count Settings</h3><small class="section-subtitle">Configure stock counting preferences.</small>${swDesc('','Enable physical stock count',true)}${field('Stock Count Frequency',sel('Monthly'))}${swDesc('Count Approval Required','Require approval for stock count',true)}${field('Count Tolerance %',inputSuffix('2','%  Allowed variance percentage'))}</div></div></div>`;

    const pos=()=>`<div class="config-main"><div class="section-card"><h3>POS Settings</h3><div class="pos-settings-grid">
      <div class="pos-column">${field('Default POS Layout <span class="req">*</span>',sel('Modern Layout'))}${field('Default Sales Type <span class="req">*</span>',sel('Retail'))}${field('Default Customer Type <span class="req">*</span>',sel('Walk-in Customer'))}${field('Hold Invoice Duration <span class="req">*</span>',inputSuffix('24','hours'))}<h4>Print Settings</h4><label class="check"><input type="checkbox" checked> Auto print invoice after payment</label><label class="check"><input type="checkbox"> Print duplicate copy</label><label class="check"><input type="checkbox" checked> Show items with images on invoice</label><label class="check"><input type="checkbox" checked> Print barcode on invoice</label></div>
      <div class="pos-column"><h4>Payment Settings</h4>${field('Default Payment Method <span class="req">*</span>',sel('Cash'))}${field('Allow Multiple Payment Methods',sw('Allow multiple payment in single invoice',true))}${field('Default Cash Received Account <span class="req">*</span>',sel('Cash in Hand'))}${field('Default Refund Account <span class="req">*</span>',sel('Sales Return'))}${field('Round Off Setting','<div class="inline-pair">'+sel('Round to nearest')+'<input class="input" value="₹ 0.50"></div>')}${field('Enable Price Override',sw('Allow price override in POS',true))}${field('Price Override Approval',sel('Manager Approval Required'))}</div>
      <div class="pos-column"><h4>POS Behavior</h4>${sw('Show Stock Availability in POS',true)}${sw('Show Last Selling Price',true)}${sw('Show Item Discount',true)}${sw('Show Customer Balance',true)}${field('Default Quantity','<input class="input" value="1">')}${field('Quick Keypad',sel('Enable'))}${field('Barcode Scanner',sel('USB Scanner'))}${field('Customer Display',sel('Enable'))}</div>
    </div></div><div class="section-card receipt-settings"><h3>Receipt & Invoice Settings</h3><div class="receipt-grid"><div class="receipt-copy">${field('Invoice Header','<div class="counter-input"><input class="input" maxlength="100" value="Thank you for shopping with ZMart."><small>38/100</small></div>')}${field('Invoice Footer','<div class="counter-input"><input class="input" maxlength="100" value="Goods once sold will not be taken back or exchanged."><small>54/100</small></div>')}</div><div class="receipt-options"><div class="receipt-terms-row"><span class="receipt-label">Show Terms & Conditions</span>${sw('',true)}</div><button type="button" class="btn btn-outline-green manage-terms-btn" data-pos-action="manage-terms">Manage Terms</button>${field('Logo on Receipt','<div class="file-control"><label class="btn file-btn">Choose File<input type="file" accept="image/*" data-pos-logo hidden></label><span data-pos-file title="pos-logo.png">pos-logo.png</span><button type="button" class="icon-btn danger" aria-label="Remove receipt logo" data-pos-action="remove-logo"><i class="fa-regular fa-trash-can"></i></button></div>')}</div></div></div></div>`;

    const posSide=()=>`<div class="config-side"><div class="section-card"><h3>POS Devices</h3><small class="section-subtitle">Manage devices used in this branch POS.</small><div class="section-action"><button type="button" class="btn btn-outline-green" data-pos-action="add-device"><i class="fa-solid fa-plus"></i> Add Device</button></div>${table(['#','Device Name','Type','Status','Actions'],[['1','Main POS Terminal','POS Terminal','Active','⋮'],['2','Receipt Printer - 1','Receipt Printer','Active','⋮'],['3','Barcode Scanner - 1','Barcode Scanner','Active','⋮'],['4','Cash Drawer - 1','Cash Drawer','Active','⋮'],['5','Customer Display - 1','Customer Display','Inactive','⋮']])}</div><div class="section-card"><h3>Other Settings</h3>${sw('Enable Kitchen/Service Printing',true)}${sw('Enable Token System',false)}${sw('Enable Table Management (Dine-in)',true)}${sw('Enable Loyalty Points in POS',true)}${sw('Ask for customer before invoice',true)}${field('Default Warehouse <span class="req">*</span>',sel('ZMart Head Office Warehouse'))}</div><div class="section-card"><h3>Shortcut Keys (POS)</h3>${table(['Action','Shortcut Key'],[['New Invoice','F1'],['Hold Invoice','F3'],['Search Item','F4'],['Discount','F6'],['Payment','F7'],['Cancel Invoice','F12']])}</div></div>`;

    const payment=()=>`<div class="config-layout payment-config"><div class="config-main"><div class="payment-top-grid">
      <div class="section-card"><h3>General Payment Settings</h3>${field('Default Currency <span class="req">*</span>',sel('INR - Indian Rupee'))}<div class="payment-inline rounding-row">${field('Rounding Off',sel('Round to nearest'))}${field('&nbsp;','<input class="input" value="0.50">')}</div>${field('Payment Timeout (Minutes) <span class="req">*</span>','<input class="input" value="15">')}<div class="split-setting"><div class="split-setting-main"><span class="split-title">Maximum Split</span>${miniSwitch(true,'data-payment-split')}</div><small>Allow split payment for invoices</small></div>${field('Maximum Split Count','<input class="input" type="number" min="2" max="10" value="5" data-max-split>')}${swDesc('Tip/Service Charge','Allow tip / service charge',true)}${field('Default Tip Percentage (%)',inputSuffix('5','%'))}${swDesc('Payment Confirmation','Show payment success screen',true)}${swDesc('Print Receipt After Payment','Automatically print receipt',true)}</div>
      <div class="section-card payment-method-card"><h3>Accepted Payment Methods</h3><small class="section-subtitle">Enable or disable payment methods for this branch.</small>${table(['#','Payment Method','Enabled','Default','Actions'],[['1','Cash',miniSwitch(true),radioDot(true,'payment-default')],['2','Credit / Debit Card',miniSwitch(true),radioDot(false,'payment-default')],['3','UPI',miniSwitch(true),radioDot(false,'payment-default')],['4','Net Banking',miniSwitch(true),radioDot(false,'payment-default')],['5','Wallet',miniSwitch(true),radioDot(false,'payment-default')],['6','Cheque',miniSwitch(false),radioDot(false,'payment-default')],['7','Gift Card',miniSwitch(true),radioDot(false,'payment-default')],['8','Store Credit',miniSwitch(true),radioDot(false,'payment-default')]])}<button class="btn btn-outline-green" data-payment-action="add-method"><i class="fa-solid fa-plus"></i> Add Payment Method</button></div>
    </div><div class="payment-bottom-grid"><div class="section-card"><h3>Cheque Settings</h3>${field('Cheque Verification',sel('On Deposit'))}<div class="clearing-days-row">${field('Cheque Clearing Days','<input class="input" value="3">')}<span class="field-suffix">days</span></div><div class="payment-inline">${field('Bounce Charge (₹)','<input class="input" value="500.00">')}${field('Cheque Validity (Days)','<input class="input" value="90">')}</div></div><div class="section-card"><h3>Store Credit Settings</h3>${swDesc('Enable Store Credit','',true)}${field('Credit Expiry (Days)','<input class="input" value="365">')}${field('Minimum Balance to Use (₹)','<input class="input" value="10.00">')}${swDesc('Notify on Credit Expiry','',true)}</div><div class="section-card"><h3>Gift Card Settings</h3>${swDesc('Enable Gift Card','',true)}${field('Minimum Load Amount (₹)','<input class="input" value="100.00">')}${field('Maximum Load Amount (₹)','<input class="input" value="10000.00">')}${field('Gift Card Validity (Months)','<input class="input" value="12">')}</div></div></div><div class="config-side"><div class="section-card online-payment-card"><h3>Online Payment Settings</h3>${swDesc('Enable Online Payments','',true)}${field('Payment Gateway <span class="req">*</span>',sel('Razorpay'))}${field('Merchant ID','<input class="input" value="rzp_live_MERCHANT12345">')}${field('API Key','<div class="password-field"><input class="input" type="password" value="secret12345"><button type="button" data-toggle-password aria-label="Show API key"><i class="fa-regular fa-eye-slash"></i></button></div>')}${field('Webhook Secret','<div class="password-field"><input class="input" type="password" value="secret98765"><button type="button" data-toggle-password aria-label="Show webhook secret"><i class="fa-regular fa-eye-slash"></i></button></div>')}<button class="btn btn-outline-green" data-payment-action="test"><i class="fa-solid fa-wifi"></i> Test Connection</button></div><div class="section-card refund-card"><h3>Refund Settings</h3>${swDesc('Allow Refund','',true)}${field('Refund Mode <span class="req">*</span>',sel('Original Payment Method'))}${swDesc('Refund Approval Required','',true)}${field('Refund Amount Limit (₹)','<input class="input" value="50000.00">')}${field('Refund Time Limit (Days)','<input class="input" value="30">')}</div></div></div>`;

    const notifications=()=>`<div class="config-layout notification-config"><div class="config-main"><div class="section-card notification-settings-card"><div class="notification-head"><div><h3>Notification Settings</h3><small class="section-subtitle">Configure notifications and alerts for this branch.</small></div><div class="notification-master"><div class="master-toggle"><span>Enable All</span>${miniSwitch(true,'data-notification-master="enable"')}</div><div class="master-toggle"><span>Disable All</span>${miniSwitch(false,'data-notification-master="disable"')}</div></div></div>${table(['#','Notification Type','Description','Channels','Enabled','Recipient','Actions'],[['1','Low Stock Alert','Notify when item stock falls below reorder level',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope','fa-regular fa-comment-dots']),miniSwitch(true,'data-notification-row'), 'Store Manager, Inventory Manager'],['2','Expiry Alert','Notify for items approaching expiry',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope','fa-regular fa-comment-dots']),miniSwitch(true,'data-notification-row'),'Inventory Manager'],['3','Purchase Order Approval','Notify when a purchase order requires approval',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope','fa-regular fa-comment-dots']),miniSwitch(true,'data-notification-row'),'Purchase Manager, Approver'],['4','GRN Received','Notify when a new GRN is received',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope','fa-regular fa-comment-dots']),miniSwitch(true,'data-notification-row'),'Store Manager, Accounts'],['5','Invoice Due','Notify for supplier invoices due for payment',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope']),miniSwitch(true,'data-notification-row'),'Accounts Manager'],['6','Sales Target Alert','Notify when sales target is achieved or missed',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope']),miniSwitch(false,'data-notification-row'),'Branch Manager'],['7','Day Close Reminder','Reminder to perform day close',channelIcons(['fa-regular fa-bell']),miniSwitch(true,'data-notification-row'),'Cashier, Branch Manager'],['8','System Alerts','Important system updates and alerts',channelIcons(['fa-regular fa-bell','fa-regular fa-envelope']),miniSwitch(true,'data-notification-row'),'All Admin Users'],['9','Payment Received','Notify when a customer payment is received',channelIcons(['fa-regular fa-envelope','fa-regular fa-comment-dots']),miniSwitch(true,'data-notification-row'),'Accounts Manager'],['10','User Activity','Notify for important user activities',channelIcons(['fa-regular fa-bell']),miniSwitch(false,'data-notification-row'),'System Administrator']])}<button class="btn btn-outline-green" data-notification-action="add"><i class="fa-solid fa-plus"></i> Add Custom Notification</button></div></div><div class="config-side"><div class="section-card notification-channels-card"><h3>Notification Channels</h3><small class="section-subtitle">Configure notification delivery channels.</small><div class="channel-setting"><i class="fa-regular fa-bell"></i><div><b>In-App Notification</b><small>Show notifications in the application</small></div>${miniSwitch(true)}</div><div class="channel-setting"><i class="fa-regular fa-envelope"></i><div><b>Email</b><small>Send notifications via email</small></div>${miniSwitch(true)}</div><div class="channel-setting"><i class="fa-regular fa-comment-dots"></i><div><b>SMS</b><small>Send notifications via SMS</small></div>${miniSwitch(true)}</div></div><div class="section-card quiet-hours-card"><h3>Quiet Hours</h3><small class="section-subtitle">Do not send non-urgent notifications during quiet hours.</small>${swDesc('Enable Quiet Hours','',true)}<div class="quiet-time-grid">${field('From Time',timeInput('22:00'))}${field('To Time',timeInput('07:00'))}</div>${field('Time Zone',sel('(UTC+05:30) Asia/Kolkata'))}</div><div class="section-card escalation-card"><h3>Escalation Settings</h3><small class="section-subtitle">Escalate unread notifications after a period of time.</small>${swDesc('Enable Escalation','',true)}${field('Escalate After (Hours)','<input class="input" value="24">')}${field('Escalate To',sel('Branch Manager, System Administrator'))}</div></div></div>`;

    const views={general,billing,inventory,pos,payment,notifications};
    const render=name=>{
      const notes={
        general:'General branch settings control core branch information, access and working hours.',
        billing:'Billing & invoice settings will be applied to all billing counters and transactions in this branch.',
        inventory:'Inventory settings will be applied to all inventory transactions and stock operations in this branch.',
        pos:'POS settings will be applied to all POS terminals and users of this branch.',
        payment:'Payment settings will be applied to all POS terminals and transactions in this branch.',
        notifications:'Critical notifications (System Alerts, Low Stock, Expiry Alert) will always be sent regardless of quiet hours.'
      };
      if(configNote){configNote.querySelector('span').textContent='Note: '+(notes[name]||notes.general);}
      const host=document.createElement('div');
      host.innerHTML=(views[name]||general)();
      const layout=host.querySelector('.config-layout');
      const main=layout?.querySelector('.config-main');
      let side=layout?.querySelector('.config-side');
      if(name==='pos'){ const tmp=document.createElement('div'); tmp.innerHTML=posSide(); side=tmp.querySelector('.config-side'); }
      const modeClasses=['general-config','billing-config','inventory-config','pos-config','payment-config','notification-config'];
      configContent.classList.remove(...modeClasses);
      configContent.classList.add(name+'-config');
      configContent.innerHTML='';
      if(main) configContent.appendChild(main);
      else configContent.innerHTML=host.innerHTML;
      if(configSideMount){
        configSideMount.classList.remove(...modeClasses);
        configSideMount.classList.add(name+'-config');
        configSideMount.innerHTML='';
        if(side) configSideMount.appendChild(side);
      }
    };
    render('general');
    document.querySelectorAll('[data-config-tab]').forEach(b=>b.addEventListener('click',()=>{
      document.querySelectorAll('[data-config-tab]').forEach(x=>x.classList.toggle('active',x===b));
      closeConfigActions();
      render(b.dataset.configTab);
    }));

    document.addEventListener('click',e=>{
      const b=e.target.closest('[data-pos-action]'); if(!b)return;
      const action=b.dataset.posAction;
      if(action==='add-device') overlay('modal',`<div class="modal"><div class="modal-head"><h2>Add POS Device</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">${field('Device Name <span class="req">*</span>','<input class="input" placeholder="Enter device name">')}${field('Device Type <span class="req">*</span>',sel('POS Terminal'))}${field('Status',sel('Active'))}</div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-pos-save="device">Add Device</button></div></div>`);
      if(action==='manage-terms') overlay('modal',`<div class="modal"><div class="modal-head"><h2>Terms & Conditions</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body"><textarea class="textarea" rows="7">Thank you for shopping with ZMart. Terms and conditions apply.</textarea></div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-pos-save="terms">Save Terms</button></div></div>`);
      if(action==='remove-logo'){const f=document.querySelector('[data-pos-file]');if(f)f.textContent='No file chosen';toast('Receipt logo removed.');}
    });
    document.addEventListener('change',e=>{if(e.target.matches('[data-pos-logo]')){const f=document.querySelector('[data-pos-file]');if(f)f.textContent=e.target.files?.[0]?.name||'No file chosen';}});
    document.addEventListener('click',e=>{const b=e.target.closest('[data-pos-save]');if(!b)return;toast(b.dataset.posSave==='device'?'POS device added successfully.':'Terms & Conditions saved.');b.closest('.modal-overlay')?.remove();});

    document.addEventListener('click',e=>{
      const p=e.target.closest('[data-payment-action]');
      if(p){
        if(p.dataset.paymentAction==='test') toast('Payment gateway connection successful.');
        if(p.dataset.paymentAction==='add-method') overlay('modal',`<div class="modal"><div class="modal-head"><h2>Add Payment Method</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">${field('Payment Method <span class="req">*</span>','<input class="input" placeholder="Enter payment method">')}${field('Status',sel('Enabled'))}${swDesc('Set as Default','Use as the default payment method',false)}</div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-config-save>Add Payment Method</button></div></div>`);
      }
      const n=e.target.closest('[data-notification-action]');
      if(n) overlay('modal',`<div class="modal"><div class="modal-head"><h2>Add Custom Notification</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">${field('Notification Type <span class="req">*</span>','<input class="input" placeholder="Enter notification type">')}${field('Description','<textarea class="textarea" placeholder="Enter description"></textarea>')}${field('Recipient',sel('Branch Manager'))}${swDesc('Enabled','Enable this notification',true)}</div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-config-save>Add Notification</button></div></div>`);
      const eye=e.target.closest('[data-toggle-password]');
      if(eye){const inp=eye.parentElement.querySelector('input');inp.type=inp.type==='password'?'text':'password';eye.innerHTML=inp.type==='password'?'<i class="fa-regular fa-eye-slash"></i>':'<i class="fa-regular fa-eye"></i>';}
      const master=e.target.closest('[data-notification-master]');
      if(master){
        const enable=master.dataset.notificationMaster==='enable';
        document.querySelectorAll('[data-notification-row]').forEach(x=>x.checked=enable);
        document.querySelectorAll('[data-notification-master]').forEach(x=>x.checked=(x===master));
        toast(enable?'All notifications enabled.':'All notifications disabled.');
      }
    });

    function closeConfigActions(){
      document.querySelectorAll('.config-action-menu').forEach(m=>m.remove());
      document.querySelectorAll('.config-row-action.active').forEach(b=>b.classList.remove('active'));
    }

    function rowData(button){
      const tr=button.closest('tr'), tableEl=button.closest('table');
      const heads=[...tableEl.querySelectorAll('thead th')].map(x=>x.textContent.trim());
      const cells=[...tr.children].map(x=>x.textContent.trim());
      const data={};
      heads.forEach((h,i)=>{if(h && h!=='Actions') data[h]=cells[i]||'';});
      const section=button.closest('.section-card')?.querySelector('h3')?.textContent.trim() || 'Configuration';
      return {section,data,primary:Object.values(data).find(v=>v && !/^\d+$/.test(v)) || 'Item'};
    }

    function openConfigActions(button){
      closeConfigActions();
      button.classList.add('active');
      const info=rowData(button), rect=button.getBoundingClientRect();
      const menu=document.createElement('div');
      menu.className='config-action-menu';
      menu._configInfo=info;
      menu.innerHTML=`
        <button data-config-menu-action="view"><i class="fa-regular fa-eye"></i><span>View Details<small>View ${info.section.toLowerCase()} information</small></span></button>
        <button data-config-menu-action="edit"><i class="fa-regular fa-pen-to-square"></i><span>Edit<small>Update selected configuration</small></span></button>
        <button data-config-menu-action="status"><i class="fa-regular fa-circle-check"></i><span>Change Status<small>Enable or disable this item</small></span></button>
        <button class="danger" data-config-menu-action="delete"><i class="fa-regular fa-trash-can"></i><span>Delete<small>Remove this configuration item</small></span></button>`;
      document.body.appendChild(menu);
      const w=228,h=menu.offsetHeight||230;
      let left=Math.min(rect.right-w,innerWidth-w-12); left=Math.max(12,left);
      let top=rect.bottom+5; if(top+h>innerHeight-12) top=Math.max(12,rect.top-h-5);
      menu.style.left=left+'px';menu.style.top=top+'px';
    }

    document.addEventListener('click',e=>{
      const trigger=e.target.closest('[data-config-actions]');
      if(trigger){e.preventDefault();e.stopPropagation();openConfigActions(trigger);return;}
      if(!e.target.closest('.config-action-menu')) closeConfigActions();
    });

    document.addEventListener('click',e=>{
      const item=e.target.closest('[data-config-menu-action]'); if(!item)return;
      const menu=item.closest('.config-action-menu'), info=menu._configInfo;
      const action=item.dataset.configMenuAction; closeConfigActions();
      if(action==='view') return openConfigView(info);
      if(action==='edit') return openConfigEdit(info);
      if(action==='status') return openConfigStatus(info);
      if(action==='delete') return openConfigDelete(info);
    });

    function detailsHTML(info){
      return `<div class="config-modal-section"><h4><i class="fa-regular fa-rectangle-list"></i> ${info.section} Details</h4><dl class="config-details">${Object.entries(info.data).map(([k,v])=>`<dt>${k}</dt><dd>${v||'—'}</dd>`).join('')}</dl></div>`;
    }
    function openConfigView(info){
      overlay('modal',`<div class="modal"><div class="modal-head"><h2>${info.section} Details</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">${detailsHTML(info)}<div class="info-note"><i class="fa-solid fa-circle-info"></i> Configuration belongs to ZMart Head Office (ZM001).</div></div><div class="modal-foot"><button class="btn" data-close>Close</button><button class="btn btn-primary" data-config-edit-from-view>Edit</button></div></div>`)._configInfo=info;
    }
    function openConfigEdit(info){
      const fields=Object.entries(info.data).filter(([k])=>!['#','Status','Default','Primary','Enabled'].includes(k)).slice(0,8);
      overlay('modal',`<div class="modal"><div class="modal-head"><h2>Edit ${info.section}</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body"><div class="config-modal-section"><h4><i class="fa-regular fa-pen-to-square"></i> Edit Information</h4><div class="config-edit-grid">${fields.map(([k,v])=>`<div class="field"><label>${k}</label><input class="input" value="${String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"></div>`).join('')}</div></div><div class="field"><label>Status</label><select class="select"><option>Active</option><option>Inactive</option></select></div></div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-config-save>Edit & Save</button></div></div>`);
    }
    function openConfigStatus(info){
      overlay('modal',`<div class="modal"><div class="modal-head"><h2>Change ${info.section} Status</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body">${detailsHTML(info)}<div class="field"><label>Change Status To <span class="req">*</span></label><select class="select"><option>Active</option><option>Inactive</option></select></div><div class="field" style="margin-top:14px"><label>Reason (Optional)</label><textarea class="textarea" placeholder="Enter reason for status change..."></textarea></div></div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-config-save>Update Status</button></div></div>`);
    }
    function openConfigDelete(info){
      overlay('modal',`<div class="modal"><div class="modal-head"><h2>Delete ${info.section}</h2><button class="icon-btn" data-close><i class="fa-solid fa-xmark"></i></button></div><div class="modal-body"><div class="config-modal-section" style="border-color:#fecaca;background:#fff7f7"><h4 style="color:#dc2626"><i class="fa-solid fa-triangle-exclamation"></i> Confirm Delete</h4><p>Are you sure you want to delete <b>${info.primary}</b>?</p><p style="color:#667085">This action cannot be undone.</p></div>${detailsHTML(info)}</div><div class="modal-foot"><button class="btn" data-close>Cancel</button><button class="btn btn-danger" data-config-delete-confirm>Delete</button></div></div>`);
    }

    document.addEventListener('click',e=>{
      if(e.target.closest('[data-config-save]')){toast('Configuration updated successfully.');e.target.closest('.modal-overlay')?.remove();}
      if(e.target.closest('[data-config-delete-confirm]')){toast('Configuration item deleted.');e.target.closest('.modal-overlay')?.remove();}
      if(e.target.closest('[data-config-edit-from-view]')){
        const ov=e.target.closest('.modal-overlay'); const info=ov?._configInfo; ov?.remove(); if(info)openConfigEdit(info);
      }
    });
  }

  // --- Branch Targets module ---
  const targetListView=document.getElementById('targetsListView');
  const targetPerformanceView=document.getElementById('targetPerformanceView');

  if(targetListView){
    const branches=[
      {name:'ZMart Anna Nagar',short:'Anna Nagar',ach:22.45,target:8.0,done:1.8045},
      {name:'ZMart T. Nagar',short:'T. Nagar',ach:28.12,target:6.5,done:1.8278},
      {name:'ZMart Velachery',short:'Velachery',ach:23.67,target:6.0,done:1.4202},
      {name:'ZMart Coimbatore',short:'Coimbatore',ach:19.88,target:7.5,done:1.491},
      {name:'ZMart Madurai',short:'Madurai',ach:21.30,target:5.5,done:1.1715},
      {name:'ZMart Trichy',short:'Trichy',ach:26.43,target:5.2,done:1.374},
      {name:'ZMart Salem',short:'Salem',ach:18.02,target:4.5,done:.811},
      {name:'ZMart Erode',short:'Erode',ach:15.60,target:5.0,done:.78}
    ];
    const salesBars=document.getElementById('salesBars');
    if(salesBars) salesBars.innerHTML=branches.map(x=>`<div class="bar-group"><span style="height:${x.target*15}px"></span><span class="ach" style="height:${x.done*28}px"></span><label>${x.short}</label></div>`).join('');
    const achBars=document.getElementById('achievementBars');
    if(achBars) achBars.innerHTML=branches.map(x=>`<div class="hbar"><span>${x.short}</span><i><b style="width:${Math.min(100,x.ach*3.1)}%"></b></i><strong>${x.ach.toFixed(2)}%</strong></div>`).join('');

    const tSearch=document.getElementById('targetSearch'),tType=document.getElementById('targetTypeFilter'),tStatus=document.getElementById('targetStatusFilter');
    const targetFilter=()=>document.querySelectorAll('[data-target-row]').forEach(tr=>{
      const okQ=!tSearch.value.trim()||tr.dataset.branch.toLowerCase().includes(tSearch.value.toLowerCase());
      const okT=tType.value==='All'||tr.dataset.type===tType.value;
      const okS=tStatus.value==='All'||tr.dataset.status===tStatus.value;
      tr.style.display=(okQ&&okT&&okS)?'':'none';
    });
    tSearch.addEventListener('input',targetFilter);tType.addEventListener('change',targetFilter);tStatus.addEventListener('change',targetFilter);

    document.getElementById('addTargetBtn')?.addEventListener('click',()=>openTargetForm('add'));

    document.querySelectorAll('.target-actions').forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();
      document.querySelectorAll('.target-action-menu').forEach(m=>m.remove());
      const tr=btn.closest('[data-target-row]'),r=btn.getBoundingClientRect();
      const m=document.createElement('div');m.className='target-action-menu';m.dataset.branch=tr.dataset.branch;
      m.style.left=Math.min(innerWidth-205,Math.max(10,r.left-135))+'px';m.style.top=Math.min(innerHeight-260,r.bottom+4)+'px';
      m.innerHTML=`<button data-target-action="view"><i class="fa-regular fa-eye"></i> View Details</button>
      <button data-target-action="edit"><i class="fa-regular fa-pen-to-square"></i> Edit Target</button>
      <button data-target-action="duplicate"><i class="fa-regular fa-copy"></i> Duplicate Target</button>
      <button data-target-action="status"><i class="fa-solid fa-rotate"></i> Change Status</button>
      <button data-target-action="performance"><i class="fa-solid fa-chart-column"></i> View Performance</button>
      <button data-target-action="delete" class="danger"><i class="fa-regular fa-trash-can"></i> Delete Target</button>`;
      document.body.appendChild(m);
    }));

    document.addEventListener('click',e=>{
      if(!e.target.closest('.target-action-menu')&&!e.target.closest('.target-actions')) document.querySelectorAll('.target-action-menu').forEach(m=>m.remove());
      const a=e.target.closest('[data-target-action]');if(!a)return;
      const menu=a.closest('.target-action-menu'),branch=menu?.dataset.branch||'ZMart Anna Nagar';menu?.remove();
      const action=a.dataset.targetAction;
      if(action==='view')openTargetDetails(branch);
      if(action==='edit')openTargetForm('edit',branch);
      if(action==='duplicate')openTargetForm('duplicate',branch);
      if(action==='status')openTargetStatus(branch);
      if(action==='performance')openTargetPerformance(branch);
      if(action==='delete'&&confirm(`Delete target for ${branch}?`))toast('Target deleted successfully.');
    });

    document.addEventListener('click',e=>{
      const exp=e.target.closest('[data-action="target-export"]');
      if(exp)toast('Branch target export prepared.');
    });
  }

  function targetModal(content,wide=false){
    const ov=document.createElement('div');ov.className='modal-overlay';
    ov.innerHTML=`<div class="modal target-modal ${wide?'wide':''}">${content}</div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('[data-target-close]'))ov.remove();});
    return ov;
  }
  const modalHead=title=>`<div class="modal-head"><h2>${title}</h2><button class="icon-btn" data-target-close><i class="fa-solid fa-xmark"></i></button></div>`;

  function milestoneRows(filled=false){
    const data=[['Q1 (Apr - Jun)','01/04/2025','30/06/2025','20,00,00,000'],['Q2 (Jul - Sep)','01/07/2025','30/09/2025','20,00,00,000'],['Q3 (Oct - Dec)','01/10/2025','31/12/2025','20,00,00,000'],['Q4 (Jan - Mar)','01/01/2026','31/03/2026','20,00,00,000']];
    return data.map((r,i)=>`<tr><td>${i+1}</td><td>${r[0]}</td><td><input class="input" value="${r[1]}"></td><td><input class="input" value="${r[2]}"></td><td><input class="input" placeholder="Enter amount" value="${filled?r[3]:''}"></td><td><button class="icon-btn"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join('');
  }

  function openTargetForm(mode,branch='ZMart Anna Nagar'){
    const edit=mode==='edit',dup=mode==='duplicate';
    const title=edit?'Edit Branch Target':dup?'Duplicate Branch Target':'Add Branch Target';
    const ov=targetModal(`${modalHead(title)}<div class="modal-body">
      ${edit?`<div class="target-summary-box"><div class="target-summary-branch"><div class="branch-icon"><i class="fa-solid fa-bullseye"></i></div><div><h3>${branch}</h3><p>Target Type &nbsp;: &nbsp; Sales Target</p><p>Status &nbsp;: &nbsp; <span class="badge active">Active</span></p></div></div><div class="summary-values"><small>Financial Year</small><b>2025 - 2026</b><span>(01 Apr 2025 - 31 Mar 2026)</span></div></div>`:''}
      <div class="target-form-grid">
        <div class="field"><label>Target Type <span class="req">*</span></label><select class="select"><option>${edit||dup?'Sales Target':'Select Target Type'}</option><option>Sales Target</option><option>Profit Target</option></select></div>
        <div class="field"><label>Branch <span class="req">*</span></label><select class="select"><option>${edit||dup?branch:'Select Branch'}</option><option>ZMart Anna Nagar</option></select></div>
        <div class="field"><label>Financial Year <span class="req">*</span></label><select class="select"><option>2025 - 2026 (01 Apr 2025 - 31 Mar 2026)</option></select></div>
        <div class="field"><label>Start Date <span class="req">*</span></label><input type="date" class="input ui-input" value="2025-04-01"></div>
        <div class="field"><label>End Date <span class="req">*</span></label><input type="date" class="input ui-input" value="2026-03-31"></div>
        <div class="field"><label>Sales Target (₹) <span class="req">*</span></label><input class="input" value="${edit?'80,00,00,000':''}" placeholder="Enter sales target"></div>
        ${edit?'<div class="field"><label>Profit Target (₹) <span class="req">*</span></label><input class="input" value="80,00,000"></div>':''}
        <div class="field description-field"><label>Description / Notes</label><textarea class="textarea target-notes" maxlength="250">${edit?'Annual sales target for ZMart Anna Nagar branch for FY 2025-26.':''}</textarea><span class="char-count">${edit?'57':'0'}/250</span></div>
        <div class="field"><label>Assign To (Users/Roles)</label><select class="select"><option>${edit?'Store Manager, Sales Manager, Cashier':'Select Role'}</option></select></div>
        <div class="field"><label>Notify Users</label><select class="select"><option>Select Users</option></select><small>Selected users will be notified about this target.</small></div>
      </div>
      <div class="milestone-heading"><div><div class="section-label">Milestone Progress (Optional)</div><small>Set quarterly milestones to track progress.</small></div><button class="btn" data-add-milestone><i class="fa-solid fa-plus"></i> Add Milestone</button></div>
      <div class="table-wrap"><table class="data-table milestone-table"><thead><tr><th>#</th><th>Milestone</th><th>From Date</th><th>To Date</th><th>Target Amount (₹)</th><th>Actions</th></tr></thead><tbody>${milestoneRows(edit)}</tbody></table></div>
    </div><div class="modal-foot"><button class="btn" data-target-close>Cancel</button><button class="btn btn-primary" data-target-save>${edit?'Update Target':'Save Target'}</button></div>`,true);
    if(edit) ov.querySelector('.target-modal')?.classList.add('edit-target-modal');
    const notes=ov.querySelector('.target-notes'), count=ov.querySelector('.char-count'); if(notes&&count) notes.addEventListener('input',()=>count.textContent=notes.value.length+'/250');
    ov.addEventListener('click',e=>{const del=e.target.closest('.milestone-table .icon-btn');if(del){del.closest('tr')?.remove();[...ov.querySelectorAll('.milestone-table tbody tr')].forEach((r,i)=>r.cells[0].textContent=i+1);}});
    ov.querySelector('[data-add-milestone]')?.addEventListener('click',()=>{const tb=ov.querySelector('.milestone-table tbody');const n=tb.rows.length+1;tb.insertAdjacentHTML('beforeend',`<tr><td>${n}</td><td>New Milestone</td><td><input class="input" type="date"></td><td><input class="input" type="date"></td><td><input class="input" placeholder="Enter amount"></td><td><button class="icon-btn"><i class="fa-regular fa-trash-can"></i></button></td></tr>`);});
    ov.querySelector('[data-target-save]').addEventListener('click',()=>{toast(edit?'Target updated successfully.':'Target saved successfully.');ov.remove();});
  }

  function getTargetRow(branch){
    return [...document.querySelectorAll('[data-target-row]')].find(r=>r.dataset.branch===branch) || null;
  }

  function targetStatusBadge(status){
    const cls=status==='At Risk'?'risk':status==='On Hold'?'hold':status==='Closed'?'closed':'active';
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function openTargetDetails(branch){
    const row=getTargetRow(branch);
    const targetType=row?.dataset.type||'Sales Target';
    const sales=row?.dataset.sales||'8,00,00,000';
    const profit=row?.dataset.profit||'80,00,000';
    const achievement=row?.dataset.achievement||'22.45';
    const status=row?.dataset.status||'Active';
    const ov=targetModal(`${modalHead('View Target Details')}<div class="modal-body target-details-body">
      <div class="target-view-header">
        <div class="target-summary-branch"><div class="branch-icon"><i class="fa-solid fa-bullseye"></i></div><div><h3>${branch}</h3><p>Target Type <span>:</span> ${targetType}</p><p>Status <span>:</span> ${targetStatusBadge(status)}</p></div></div>
        <div class="target-view-meta"><div><small>Financial Year</small><b>2025 - 2026</b><span>(01 Apr 2025 - 31 Mar 2026)</span></div><div><small>Created By</small><b>Super Admin</b><small>Created On</small><b>01 Apr 2025 10:15 AM</b></div></div>
      </div>
      <section class="target-detail-section"><h4>Target Summary</h4><div class="target-details-grid"><div><small>Sales Target (₹)</small><strong>${sales}</strong></div><div><small>Profit Target (₹)</small><strong>${profit}</strong></div><div><small>Start Date</small><strong>01 Apr 2025</strong></div><div><small>End Date</small><strong>31 Mar 2026</strong></div></div></section>
      <section class="target-detail-section"><h4>Achievement Summary</h4><div class="target-details-grid"><div><small>Sales Achievement (₹)</small><strong>1,80,45,000</strong></div><div><small>Profit Achievement (₹)</small><strong>18,05,000</strong></div><div><small>Achievement %</small><strong class="positive">${achievement}%</strong></div><div><small>Remaining (₹)</small><strong>6,19,55,000</strong></div></div></section>
      <section class="target-detail-section"><h4>Milestone Progress</h4><div class="table-wrap"><table class="perf-list-table target-view-milestones"><thead><tr><th>#</th><th>Milestone</th><th>From Date</th><th>To Date</th><th>Target Amount (₹)</th><th>Achievement (₹)</th><th>Achievement %</th><th>Status</th></tr></thead><tbody><tr><td>1</td><td>Q1 (Apr - Jun)</td><td>01 Apr 2025</td><td>30 Jun 2025</td><td>2,00,00,000</td><td>48,75,000</td><td>24.38%</td><td><span class="status-track">On Track</span></td></tr><tr><td>2</td><td>Q2 (Jul - Sep)</td><td>01 Jul 2025</td><td>30 Sep 2025</td><td>2,00,00,000</td><td>45,20,000</td><td>22.60%</td><td><span class="status-track">On Track</span></td></tr><tr><td>3</td><td>Q3 (Oct - Dec)</td><td>01 Oct 2025</td><td>31 Dec 2025</td><td>2,00,00,000</td><td>–</td><td>0.00%</td><td><span class="status-pending">Pending</span></td></tr><tr><td>4</td><td>Q4 (Jan - Mar)</td><td>01 Jan 2026</td><td>31 Mar 2026</td><td>2,00,00,000</td><td>–</td><td>0.00%</td><td><span class="status-pending">Pending</span></td></tr></tbody></table></div></section>
      <div class="target-view-bottom"><section><h4>Target Details</h4><label>Description / Notes</label><div class="detail-readonly">To achieve annual sales growth and improve profitability<br>through better customer reach and service.</div><label>Assigned To (Users/Roles)</label><div class="detail-readonly">Store Manager, Sales Manager, Cashier</div></section><section><h4>Additional Information</h4><div class="target-extra-grid"><div><small>Base Year Sales (₹)</small><strong>7,20,00,000</strong></div><div><small>Target Growth (%)</small><strong>11.11%</strong></div><div><small>Calculation Basis</small><strong>Net Sales (Excluding Returns)</strong></div><div><small>Last Updated On</small><strong>01 Apr 2025 10:15 AM</strong></div></div></section></div>
    </div><div class="modal-foot target-view-foot"><button class="btn" data-target-close>Close</button><button class="btn btn-primary" data-edit-from-view>Edit Target</button></div>`,true);
    ov.querySelector('[data-edit-from-view]').addEventListener('click',()=>{ov.remove();openTargetForm('edit',branch);});
  }

  function openTargetStatus(branch){
    const row=getTargetRow(branch);
    const current=row?.dataset.status||'Active';
    const ov=targetModal(`${modalHead('Change Target Status')}<div class="modal-body target-status-body">
      <div class="target-status-summary"><div class="branch-icon"><i class="fa-solid fa-bullseye"></i></div><div><h3>${branch}</h3><p>Target Type <span>:</span> ${row?.dataset.type||'Sales Target'}</p><p>Current Status <span>:</span> ${targetStatusBadge(current)}</p></div></div>
      <div class="status-title">Change Status To <span class="req">*</span></div>
      <div class="status-options">
        <label class="status-active"><input type="radio" name="targetStatus" value="Active" ${current==='Active'?'checked':''}><span><b>Active</b><small>Target is active and tracking is in progress.</small></span></label>
        <label class="status-risk"><input type="radio" name="targetStatus" value="At Risk" ${current==='At Risk'?'checked':''}><span><b>At Risk</b><small>Target progress is below expectation.</small></span></label>
        <label class="status-hold"><input type="radio" name="targetStatus" value="On Hold" ${current==='On Hold'?'checked':''}><span><b>On Hold</b><small>Target tracking is temporarily paused.</small></span></label>
        <label class="status-closed"><input type="radio" name="targetStatus" value="Closed" ${current==='Closed'?'checked':''}><span><b>Closed</b><small>Target is completed or not applicable.</small></span></label>
      </div>
      <div class="field target-effective"><label>Effective From <span class="req">*</span></label><input type="date" class="input ui-input" value="2025-05-01"></div>
      <div class="field target-status-notes"><label>Reason / Notes</label><textarea class="textarea" maxlength="250" placeholder="Enter reason for status change (optional)"></textarea><small class="char-count">0/250</small></div>
    </div><div class="modal-foot target-status-foot"><button class="btn" data-target-close>Cancel</button><button class="btn btn-primary" data-target-status-save>Update Status</button></div>`);
    ov.querySelector('.target-modal')?.classList.add('target-status-modal');
    const note=ov.querySelector('.target-status-notes textarea'),count=ov.querySelector('.char-count');
    note?.addEventListener('input',()=>{count.textContent=`${note.value.length}/250`;});
    ov.querySelector('[data-target-status-save]').addEventListener('click',()=>{
      const selected=ov.querySelector('input[name="targetStatus"]:checked')?.value||current;
      if(row){
        row.dataset.status=selected;
        const cell=row.querySelector('td:nth-last-child(2)');
        if(cell)cell.innerHTML=targetStatusBadge(selected);
      }
      toast(`Target status updated to ${selected}.`);ov.remove();
    });
  }

  function openTargetPerformance(branch){
    if(!targetListView||!targetPerformanceView)return;
    targetListView.hidden=true;targetPerformanceView.hidden=false;
    const months=['Apr 2025','May 2025','Jun 2025','Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025','Jan 2026','Feb 2026','Mar 2026'];
    targetPerformanceView.innerHTML=`<div class="target-toolbar"><div class="breadcrumb"><span>Home</span><i class="fa-solid fa-chevron-right"></i><span>Branch Management</span><i class="fa-solid fa-chevron-right"></i><span>Branch Targets</span><i class="fa-solid fa-chevron-right"></i><span>View Performance</span></div><div class="target-selectors"><div class="field"><label>Select Financial Year</label><select class="select"><option>2025 - 2026 (01 Apr 2025 - 31 Mar 2026)</option></select></div><div class="field"><label>Select Branch</label><select class="select"><option>${branch}</option></select></div><button class="btn" id="backToTargets"><i class="fa-solid fa-arrow-left"></i> Back to Targets</button></div></div>
    <div class="performance-top"><div class="performance-summary"><div class="target-summary-branch"><div class="branch-icon"><i class="fa-solid fa-bullseye"></i></div><div><h3>${branch}</h3><p>Target Type &nbsp;: &nbsp; Sales Target</p><p>Status &nbsp;: &nbsp; <span class="badge active">Active</span></p></div></div></div><div class="performance-kpis"><div><small>Sales Target (₹)</small><strong>8,00,00,000</strong></div><div><small>Achieved (₹)</small><strong class="green">1,80,45,000</strong></div><div><small>Achievement %</small><strong class="green">22.45%</strong></div><div><small>Remaining (₹)</small><strong class="blue">6,19,55,000</strong></div></div><div class="period-box"><small>Target Period</small><strong>01 Apr 2025 - 31 Mar 2026</strong><em>31 Days Passed</em></div></div>
    <div class="performance-tabs"><button class="active" data-perf-tab="overview">Overview</button><button data-perf-tab="monthly">Monthly Performance</button><button data-perf-tab="category">Category Performance</button><button data-perf-tab="products">Top Products</button><button data-perf-tab="daywise">Day-wise Trend</button></div><div id="performanceTabContent"></div>
    <div class="info-note"><i class="fa-solid fa-circle-info"></i><b>Note:</b> Achievement is based on actual billing data. Data is updated daily.</div>`;
    document.getElementById('backToTargets').onclick=()=>{targetPerformanceView.hidden=true;targetListView.hidden=false;};
    const content=document.getElementById('performanceTabContent');
    const render=(name)=>{
      content.innerHTML=performanceView(name,months);
      document.querySelectorAll('[data-perf-tab]').forEach(b=>b.classList.toggle('active',b.dataset.perfTab===name));
    };
    document.querySelectorAll('[data-perf-tab]').forEach(b=>b.onclick=()=>render(b.dataset.perfTab));
    render('overview');
  }

  function performanceView(name,months){
    if(name==='monthly'){
      const vals=[20.50,24.33,25.38,26.46,29.08,28.71,30.43,32.71,35.88,27.63,24.40,35.93];
      return `<div class="performance-grid"><div class="perf-main"><section class="target-card"><div class="target-card-head"><h3>Monthly Performance</h3><div><select class="select mini-select"><option>All Months</option></select> <button class="btn"><i class="fa-solid fa-download"></i> Export</button></div></div><table class="perf-list-table"><thead><tr><th>#</th><th>Month</th><th>Sales Target</th><th>Achieved</th><th>Achievement %</th><th>Remaining</th><th>Status</th><th>Trend</th></tr></thead><tbody>${months.map((m,i)=>`<tr><td>${i+1}</td><td>${m}</td><td>${i<4?'60,00,000':i<8?'70,00,000':'80,00,000'}</td><td>${(12.3+i*1.47).toFixed(2)} L</td><td>${vals[i].toFixed(2)}%</td><td>${(47.7-i*.3).toFixed(1)} L</td><td><span class="${vals[i]>30?'status-track':'status-behind'}">${vals[i]>30?'On Track':'Behind'}</span></td><td>${vals[i]>30?'↗':'↘'}</td></tr>`).join('')}</tbody></table></section><div class="perf-row-2"><section class="target-card"><h3>Monthly Performance Summary</h3><div class="target-kpis" style="grid-template-columns:repeat(4,1fr);margin-top:12px"><article><div><small>On Track Months</small><strong>3</strong><em>25.00%</em></div></article><article><div><small>Behind Months</small><strong style="color:#d85a00">8</strong><em>66.67%</em></div></article><article><div><small>Over Target Months</small><strong>0</strong><em>0.00%</em></div></article><article><div><small>Avg. Monthly Achievement</small><strong style="color:#0737b5">26.81%</strong></div></article></div></section><section class="target-card"><h3>Cumulative Progress</h3><div class="chart-placeholder"><div class="chart-line"></div></div></section></div></div><div class="perf-side"><section class="target-card"><h3>Monthly Achievement Overview</h3><div class="chart-placeholder">${columnChart(months,vals)}</div></section><section class="target-card"><h3>Best & Worst Performing Months</h3><div class="target-chart-row" style="grid-template-columns:1fr 1fr"><div class="info-note" style="margin:0"><b>Best Performing Month</b><strong>Dec 2025<br>35.88%</strong></div><div class="info-note" style="margin:0;background:#fff6ea;border-color:#f2d2a4"><b>Worst Performing Month</b><strong>Apr 2025<br>20.50%</strong></div></div></section><section class="target-card"><h3>Monthly Achievement % Heatmap</h3><div class="heatmap">${months.map((m,i)=>`<div class="${vals[i]>29?'good':''}">${m}<strong>${vals[i].toFixed(2)}%</strong></div>`).join('')}</div></section></div></div>`;
    }
    if(name==='category'){
      const cats=[['Beverages',32.04],['Snacks',28.75],['Dairy Products',23.00],['Personal Care',20.29],['Household',18.33],['Others',19.15]];
      return `<div class="performance-grid"><div class="perf-main"><div class="perf-row-2"><section class="target-card"><h3>Category Performance Overview</h3><div class="metric-donut"><div class="donut target-donut small" style="--p:22.45"><div><strong>22.45%</strong><small>Overall Achievement</small></div></div><div class="legend-stack">${cats.map(c=>`<span><i class="dot green"></i><b>${c[0]}</b><strong>${c[1].toFixed(2)}%</strong></span>`).join('')}</div></div></section><section class="target-card"><div class="target-card-head"><h3>Category Performance Details</h3><button class="btn"><i class="fa-solid fa-download"></i> Export</button></div>${tableHTML(['#','Category','Sales Target','Achieved','Achievement %','Remaining','Trend'],cats.map((c,i)=>[i+1,c[0],['1,20,00,000','1,00,00,000','80,00,000','70,00,000','60,00,000','50,40,000'][i],['38,45,000','28,75,000','18,40,000','14,20,000','11,00,000','9,65,000'][i],c[1]+'%',['81,55,000','71,25,000','61,60,000','55,80,000','49,00,000','40,75,000'][i],c[1]>22?'↗':'↘']))}</section></div><div class="perf-row-2"><section class="target-card"><h3>Achievement % by Category (vs Target)</h3><div class="chart-placeholder">${columnChart(cats.map(c=>c[0]),cats.map(c=>c[1]))}</div></section><section class="target-card"><h3>Sales Target vs Achieved (₹)</h3><div class="chart-placeholder">${columnChart(cats.map(c=>c[0]),cats.map(c=>c[1]))}</div></section></div><section class="target-card"><h3>Category Milestone Progress</h3>${tableHTML(['#','Category','Q1 Target','Q1 Achieved','Q1 %','Q2 Target','Q2 Achieved','Q2 %','Q3 Target','Q3 Achieved','Q3 %','Q4 Target','Q4 Achieved','Q4 %','Overall %'],cats.slice(0,3).map((c,i)=>[i+1,c[0],'25,00,000','12,10,000','48.40%','30,00,000','10,25,000','34.17%','32,00,000','9,80,000','30.63%','33,00,000','6,30,000','19.09%',c[1]+'%']))}</section></div><div class="perf-side"><section class="target-card"><h3>Top Performing Categories</h3><div class="mini-progress-list">${cats.slice(0,5).map(c=>`<div><span>${c[0]}</span><i><b style="width:${c[1]*2.8}%"></b></i><strong>${c[1].toFixed(2)}%</strong></div>`).join('')}</div></section><section class="target-card"><h3>Low Performing Categories</h3><div class="mini-progress-list">${cats.slice().reverse().slice(0,3).map(c=>`<div><span>${c[0]}</span><i><b style="width:${c[1]*2.8}%;background:#f09b27"></b></i><strong>${c[1].toFixed(2)}%</strong></div>`).join('')}</div></section><section class="target-card"><h3>Category Contribution to Total Achieved</h3><div class="donut target-donut small" style="--p:68.05"><div><strong>₹ 1,20,45,000</strong><small>Total Achieved</small></div></div></section></div></div>`;
    }
    if(name==='products'){
      const products=[['Amul Gold Milk 1L','Dairy Products','25,00,000','20,45,000','81.80%','12,650','45.50','11.34%','↗'],['Parle-G Biscuits 200g','Snacks','20,00,000','18,25,000','91.25%','9,842','18.55','10.12%','↗'],['Tata Tea Premium 250g','Beverages','15,00,000','14,10,000','94.00%','6,512','216.50','7.83%','↗'],['Thums Up 750ml','Beverages','15,00,000','12,70,000','84.67%','7,856','32.50','7.04%','↘'],['Ariel Matic 1kg','Household','12,00,000','10,85,000','90.42%','3,245','333.95','6.02%','↗'],['Colgate Strong Teeth 200g','Personal Care','10,00,000','9,12,000','91.20%','4,125','55.40','5.06%','↗'],['Saffola Oil 1L','Household','10,00,000','8,65,000','86.50%','3,125','276.80','4.80%','↘'],['Maggi 2-Minute Noodles','Snacks','8,00,000','7,25,000','90.63%','4,652','15.60','4.02%','↗'],['Surf Excel 1kg','Household','7,00,000','6,35,000','90.71%','2,412','263.20','3.52%','↗'],['Horlicks Health & Nutrition 500g','Dairy Products','6,00,000','5,28,000','88.00%','1,852','285.30','2.93%','↗']];
      return `<div class="performance-grid"><div class="perf-main"><section class="target-card"><h3>Top Products Overview</h3><div class="target-kpis" style="grid-template-columns:repeat(3,1fr);margin-top:12px"><article><div><small>Total Products Sold</small><strong>48,256</strong></div></article><article><div><small>Total Sales (₹)</small><strong>1,80,45,000</strong></div></article><article><div><small>Contribution to Total Sales</small><strong>68.63%</strong></div></article></div><div class="metric-donut"><div class="donut target-donut small" style="--p:68.63"><div><strong>₹1,80,45,000</strong><small>Total Sales</small></div></div></div></section><section class="target-card"><div class="target-card-head"><h3>Top Products Performance</h3><button class="btn"><i class="fa-solid fa-download"></i> Export</button></div>${tableHTML(['#','Product','Category','Sales Target','Sales Achieved','Achievement %','Quantity Sold','Avg. Selling Price','Contribution %','Trend'],products.map((p,i)=>[i+1,...p]))}</section></div><div class="perf-side"><section class="target-card"><h3>Top Selling Products by Quantity</h3>${tableHTML(['#','Product','Quantity Sold','Contribution %'],products.slice(0,5).map((p,i)=>[i+1,p[0],p[5],p[7]]))}</section><section class="target-card"><h3>Top Products by Sales Value</h3><div class="mini-progress-list">${products.slice(0,5).map(p=>`<div><span>${p[0]}</span><i><b style="width:${parseFloat(p[4])*1.02}%"></b></i><strong>₹ ${p[3]}</strong></div>`).join('')}</div></section><section class="target-card"><h3>Top Products by Achievement %</h3><div class="mini-progress-list">${products.slice(1,6).map(p=>`<div><span>${p[0]}</span><i><b style="width:${parseFloat(p[4])}%"></b></i><strong>${p[4]}</strong></div>`).join('')}</div></section></div></div>`;
    }
    if(name==='daywise'){
      const days=Array.from({length:15},(_,i)=>({date:String(i+1).padStart(2,'0')+' Apr 2025',ach:[92.45,95.31,90.12,94.22,98.11,91.04,93.20,97.51,89.80,94.65,90.22,95.12,93.87,88.31,96.40][i]}));
      return `<div class="performance-grid"><div class="perf-main"><section class="target-card"><div class="target-card-head"><h3>Sales Target vs Achieved (Day-wise)</h3><div><select class="select mini-select"><option>15 Days</option></select> <button class="btn"><i class="fa-solid fa-download"></i> Export</button></div></div><div class="chart-placeholder">${columnChart(days.map(d=>d.date.slice(0,6)),days.map(d=>d.ach))}</div></section><section class="target-card"><h3>Day-wise Performance Details</h3>${tableHTML(['#','Date','Day','Target (₹)','Achieved (₹)','Achievement %','Variance (₹)','Status','Trend'],days.map((d,i)=>[i+1,d.date,['Tue','Wed','Thu','Fri','Sat','Sun','Mon'][i%7],'28,00,000',(25.86+i*.08).toFixed(2)+' L',d.ach.toFixed(2)+'%','-'+(2.13-i*.07).toFixed(2)+' L','<span class="status-behind">Below Target</span>',d.ach>93?'↗':'↘']))}</section></div><div class="perf-side"><section class="target-card"><h3>Day-wise Summary</h3><div class="kv"><b>Total Target (₹)</b><span>4,10,95,895</span><b>Total Achieved (₹)</b><span>3,84,84,450</span><b>Average Achievement %</b><span>93.63%</span><b>Best Achievement %</b><span style="color:#087b31">98.11% (05 Apr 2025)</span><b>Lowest Achievement %</b><span style="color:#d52222">88.31% (14 Apr 2025)</span><b>Days Above Target</b><span>5</span><b>Days Below Target</b><span>10</span></div></section><section class="target-card"><h3>Achievement % Distribution</h3><div class="donut target-donut small" style="--p:73"><div><strong>15</strong><small>Days</small></div></div></section><section class="target-card"><h3>Top 5 Best Performing Days</h3><div class="mini-progress-list">${days.slice().sort((a,b)=>b.ach-a.ach).slice(0,5).map(d=>`<div><span>${d.date}</span><i><b style="width:${d.ach}%"></b></i><strong>${d.ach.toFixed(2)}%</strong></div>`).join('')}</div></section></div></div>`;
    }
    // overview
    return `<div class="performance-grid"><div class="perf-main"><div class="perf-row-2"><section class="target-card"><h3>Achievement Overview</h3><div class="metric-donut"><div class="donut target-donut small" style="--p:22.45"><div><strong>22.45%</strong><small>Achieved</small></div></div><div class="legend-stack"><span><i class="dot green"></i><b>Achieved (₹)</b><strong>1,80,45,000</strong></span><span><i class="dot gray"></i><b>Remaining (₹)</b><strong>6,19,55,000</strong></span><span><i class="dot blue"></i><b>Target (₹)</b><strong>8,00,00,000</strong></span></div></div></section><section class="target-card"><h3>Monthly Performance (₹)</h3><div class="chart-placeholder">${columnChart(months,[18.2,22.45,21.1,23.67,24.8,25.3,26.1,27.55,28.9,24.6,20.75,19.3])}</div></section></div><div class="perf-row-2"><section class="target-card"><h3>Achievement vs Target (Cumulative)</h3><div class="chart-placeholder"><div class="chart-line"></div></div></section><section class="target-card"><h3>Performance Summary</h3><div class="kv"><b>Average Monthly Target (₹)</b><span>66,66,667</span><b>Average Monthly Achievement (₹)</b><span>15,03,750</span><b>Best Performing Month</b><span style="color:#087b31">Nov 2025 (27.55%)</span><b>Lowest Performing Month</b><span style="color:#d52222">Mar 2026 (19.30%)</span><b>On Track Months</b><span>5</span><b>At Risk Months</b><span style="color:#d85a00">4</span><b>Behind Target Months</b><span style="color:#d52222">3</span></div></section></div></div><div class="perf-side"><section class="target-card"><h3>Target Details</h3><div class="kv"><b>Target Type</b><span>Sales Target</span><b>Financial Year</b><span>2025 - 2026</span><b>Start Date</b><span>01 Apr 2025</span><b>End Date</b><span>31 Mar 2026</span><b>Assigned To</b><span>Store Manager, Sales Manager, Cashier</span><b>Description</b><span>Annual sales target for ZMart Anna Nagar branch for FY 2025-26.</span></div></section><section class="target-card"><h3>Milestone Progress</h3><div class="mini-progress-list"><div><span>Q1 (Apr - Jun)</span><i><b style="width:48.75%"></b></i><strong>48.75%</strong></div><div><span>Q2 (Jul - Sep)</span><i><b style="width:45.20%"></b></i><strong>45.20%</strong></div><div><span>Q3 (Oct - Dec)</span><i><b style="width:0%"></b></i><strong>0.00%</strong></div><div><span>Q4 (Jan - Mar)</span><i><b style="width:0%"></b></i><strong>0.00%</strong></div></div></section><section class="target-card"><h3>Top Performing Categories</h3><div class="mini-progress-list">${[['Beverages',32.04],['Snacks',28.75],['Dairy Products',23],['Personal Care',20.29],['Household',18.33]].map(c=>`<div><span>${c[0]}</span><i><b style="width:${c[1]*2.8}%"></b></i><strong>${c[1].toFixed(2)}%</strong></div>`).join('')}</div></section></div></div>`;
  }

  function columnChart(labels,vals){
    return `<div class="chart-columns">${labels.map((l,i)=>`<div><span style="height:${55+(i%5)*7}%"></span><span class="ach" style="height:${Math.max(18,vals[i]||20)}%"></span><label>${l}</label></div>`).join('')}</div><div class="chart-line"></div>`;
  }
  function tableHTML(headers,rows){
    return `<div class="table-wrap"><table class="perf-list-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }


  // v29 Branch analytics tabs and action menus
  const renderAnalyticsTab=(type,tab)=>{
    const target=document.getElementById(type==='performance'?'performanceContent':type==='expenses'?'expensesContent':'statusContent');
    if(!target)return;
    if(type==='performance'){
      const rows=['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery','ZMart Adyar','ZMart Tambaram','ZMart Porur','ZMart Ambattur','ZMart Chrompet'];
      if(tab==='sales') target.innerHTML=analyticsSales(rows);
      else if(tab==='profit') target.innerHTML=analyticsProfit(rows);
      else if(tab==='transactions') target.innerHTML=analyticsTransactions(rows);
      else if(tab==='products') target.innerHTML=analyticsProducts();
      else if(tab==='growth') target.innerHTML=analyticsGrowth(rows);
      else location.reload();
    }
    if(type==='expenses'){
      if(tab==='details') target.innerHTML=expenseDetails();
      else if(tab==='category') target.innerHTML=expenseCategory();
      else if(tab==='comparison') target.innerHTML=expenseComparison();
      else if(tab==='budget') target.innerHTML=expenseBudget();
      else if(tab==='trends') target.innerHTML=expenseTrends();
      else location.reload();
    }
    if(type==='status'){
      if(tab==='operational') target.innerHTML=statusOperational();
      else if(tab==='financial') target.innerHTML=statusFinancial();
      else if(tab==='performance') target.innerHTML=statusPerformance();
      else if(tab==='alerts') target.innerHTML=statusAlerts();
      else location.reload();
    }
  };
  document.querySelectorAll('.analytics-tabs').forEach(tabs=>{
    const type=tabs.dataset.analytics;
    tabs.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
      tabs.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderAnalyticsTab(type,btn.dataset.tab);
    }));
  });
  const closeAnalyticsMenus=()=>document.querySelectorAll('.target-action-menu.analytics-menu').forEach(m=>m.remove());
  const analyticsToast=(message)=>{
    let t=document.getElementById('analyticsActionToast');
    if(!t){t=document.createElement('div');t.id='analyticsActionToast';t.style.cssText='position:fixed;right:22px;bottom:22px;z-index:100001;background:#0b7130;color:#fff;padding:11px 15px;border-radius:3px;font:600 11px Poppins;box-shadow:0 8px 24px rgba(0,0,0,.18);opacity:0;transform:translateY(8px);transition:.2s';document.body.appendChild(t)}
    t.textContent=message;t.style.opacity='1';t.style.transform='translateY(0)';clearTimeout(t._timer);t._timer=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(8px)'},1800);
  };
  const getAnalyticsRowData=(row)=>{
    if(!row) return {};
    const headers=[...row.closest('table').querySelectorAll('thead th')].map(th=>th.innerText.trim().replace(/\s+/g,' '));
    const cells=[...row.querySelectorAll('td')].map(td=>td.innerText.trim().replace(/\s+/g,' '));
    return headers.reduce((obj,h,i)=>{if(h && !/^action$/i.test(h)) obj[h]=cells[i]||'—'; return obj;},{});
  };
  const normalizeMetric=(data,patterns,fallback='—')=>{
    const key=Object.keys(data).find(k=>patterns.some(p=>p.test(k)));
    return key?data[key]:fallback;
  };
  const openPerformanceModal=(title,details,opts={})=>{
    document.querySelector('.performance-detail-modal')?.remove();
    const modal=document.createElement('div');modal.className='performance-detail-modal improved';
    const branch=opts.branch||title.split(' - ')[0]||'Branch';
    const status=opts.status||details.find(x=>/status/i.test(x[0]))?.[1]||'Active';
    const achievement=opts.achievement||details.find(x=>/achievement/i.test(x[0]))?.[1]||'—';
    const target=opts.target||details.find(x=>/target/i.test(x[0]))?.[1]||'—';
    const sales=opts.sales||details.find(x=>/total sales|sales/i.test(x[0]))?.[1]||'—';
    const growth=opts.growth||details.find(x=>/last month|growth/i.test(x[0]))?.[1]||'—';
    const bodyDetails=details.filter(x=>!['Branch Name','#'].includes(x[0]));
    modal.innerHTML=`<div class="panel" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="panel-head"><div><span class="modal-eyebrow">BRANCH PERFORMANCE</span><h3>${title}</h3></div><button class="modal-x" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="performance-hero"><div class="branch-avatar"><i class="fa-solid fa-store"></i></div><div class="branch-copy"><strong>${branch}</strong><span>Performance overview for the selected period</span></div><span class="performance-status">${status}</span></div>
      <div class="performance-summary-strip"><div><small>Achievement</small><strong>${achievement}</strong></div><div><small>Target</small><strong>${target}</strong></div><div><small>Total Sales</small><strong>${sales}</strong></div><div><small>Growth</small><strong class="positive">${growth}</strong></div></div>
      <div class="panel-body"><div class="section-title">Performance Metrics</div><div class="detail-grid">${bodyDetails.map(x=>`<div><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join('')}</div></div>
      <div class="panel-foot"><button class="modal-close"><i class="fa-solid fa-xmark"></i> Close</button><button class="secondary modal-dashboard"><i class="fa-solid fa-chart-line"></i> View Dashboard</button><button class="primary modal-export"><i class="fa-solid fa-file-export"></i> Export</button></div>
    </div>`;
    document.body.appendChild(modal);
    const close=()=>modal.remove();modal.querySelector('.modal-x').onclick=close;modal.querySelector('.modal-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});
    modal.querySelector('.modal-export').onclick=()=>{analyticsToast('Performance details exported.');};
    modal.querySelector('.modal-dashboard').onclick=()=>{window.location.href='branch-dashboard.html';};
  };
  const downloadPerformanceRow=(row)=>{
    if(!row)return;
    const cells=[...row.querySelectorAll('td')].slice(0,-1).map(td=>td.innerText.trim().replace(/\s+/g,' '));
    const headers=[...row.closest('table').querySelectorAll('thead th')].slice(0,-1).map(th=>th.innerText.trim());
    const csv=[headers,cells].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(cells[1]||'branch-performance').replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.csv';document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);a.remove();analyticsToast('Branch row exported.');
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest('.analytics-action');
    if(!b){if(!e.target.closest('.analytics-menu'))closeAnalyticsMenus();return;}
    e.preventDefault();e.stopPropagation();closeAnalyticsMenus();
    const row=b.closest('tr'),card=b.closest('.analytics-card'),r=b.getBoundingClientRect(),m=document.createElement('div');m.className='target-action-menu analytics-menu improved-menu';
    const isRow=!!row;
    m.innerHTML=isRow
      ?'<div class="menu-caption">Branch Actions</div><button data-act="details"><i class="fa-regular fa-eye"></i><span>View Details<small>Full branch metrics</small></span></button><button data-act="performance"><i class="fa-solid fa-chart-line"></i><span>Performance Summary<small>Review KPIs and growth</small></span></button><button data-act="export"><i class="fa-solid fa-file-export"></i><span>Export Branch Data<small>Download this row as CSV</small></span></button><button data-act="alerts"><i class="fa-regular fa-bell"></i><span>View Alerts<small>Operational notifications</small></span></button>'
      :'<div class="menu-caption">Chart Actions</div><button data-act="chart-details"><i class="fa-regular fa-eye"></i><span>View Chart Details<small>Show metric summary</small></span></button><button data-act="chart-export"><i class="fa-solid fa-download"></i><span>Export Chart Data<small>Download chart values</small></span></button><button data-act="chart-print"><i class="fa-solid fa-print"></i><span>Print Chart<small>Open print preview</small></span></button><button data-act="chart-refresh"><i class="fa-solid fa-rotate"></i><span>Refresh<small>Reload chart values</small></span></button>';
    document.body.appendChild(m);
    const mw=m.offsetWidth||250,mh=m.offsetHeight||250;
    let left=r.right-mw,top=r.bottom+6;if(left<8)left=8;if(left+mw>innerWidth-8)left=innerWidth-mw-8;if(top+mh>innerHeight-8)top=Math.max(8,r.top-mh-6);
    m.style.left=left+'px';m.style.top=top+'px';
    m.addEventListener('click',ev=>{
      const item=ev.target.closest('[data-act]');if(!item)return;ev.stopPropagation();const act=item.dataset.act;closeAnalyticsMenus();
      if(isRow){
        const data=getAnalyticsRowData(row),branch=data['Branch Name']||Object.values(data)[1]||'Branch';
        const details=Object.entries(data).filter(([k])=>k!=='#' && k!=='Branch Name');
        const opts={branch,status:normalizeMetric(data,[/^status$/i]),achievement:normalizeMetric(data,[/achievement/i]),target:normalizeMetric(data,[/^target/i]),sales:normalizeMetric(data,[/total sales/i,/sales value/i]),growth:normalizeMetric(data,[/vs last month/i,/growth/i])};
        if(act==='details')openPerformanceModal(branch+' - Performance Details',details,opts);
        if(act==='performance')openPerformanceModal(branch+' - Performance',details,opts);
        if(act==='export')downloadPerformanceRow(row);
        if(act==='alerts')openPerformanceModal(branch+' - Alerts',[['Critical Alerts','0'],['Inventory Alerts','2 low-stock notifications'],['Operational Status','All systems operational'],['Last Checked','01 May 2025 10:15 AM']],{branch,status:'Monitored',achievement:opts.achievement,target:opts.target,sales:opts.sales,growth:opts.growth});
      }else{
        const title=card?.querySelector('h3')?.innerText||'Performance Chart';
        if(act==='chart-details')openPerformanceModal(title,[['Metric','Sales by Branch'],['Period','This Month'],['Highest','ZMart Anna Nagar - ₹72.64 L'],['Lowest','ZMart Chrompet - ₹24.32 L'],['Branches','8 shown']],{branch:'All Branches',status:'Updated',achievement:'93.63%',target:'₹ 4.40 Cr',sales:'₹ 4.10 Cr',growth:'↑ 12.45%'});
        if(act==='chart-export')analyticsToast(title+' data exported.');
        if(act==='chart-print')window.print();
        if(act==='chart-refresh')analyticsToast(title+' refreshed.');
      }
    });
  });

  function simpleRows(names, cols){
    return names.map((n,i)=>`<tr><td>${i+1}</td><td>${n}</td>${cols.map((c,j)=>`<td>${typeof c==='function'?c(i):c}</td>`).join('')}<td><button class="icon-btn analytics-action"><i class="fa-solid fa-ellipsis-vertical"></i></button></td></tr>`).join('');
  }
  function chart(title='Trend',second=false){return `<section class="analytics-card analytics-trend-card" data-chart-title="${title}"><div class="analytics-chart-head"><h3>${title}</h3><div class="chart-period-toggle" role="group" aria-label="Chart period"><button type="button" class="active" data-chart-period="daily">Daily</button><button type="button" data-chart-period="weekly">Weekly</button><button type="button" data-chart-period="monthly">Monthly</button></div></div><div class="legend-inline"><span><i class="legend-dot"></i><b data-chart-current-label>This Month</b></span>${second?'<span><i class="legend-dot l1"></i><b data-chart-previous-label>Last Month</b></span>':''}</div><div class="fake-line"><svg viewBox="0 0 900 250" preserveAspectRatio="none"><polyline class="line-a" data-chart-line="a" points="0,170 70,140 130,105 200,180 260,125 330,155 390,90 460,145 520,110 590,165 650,125 720,85 790,155 850,120 900,80"/><polyline class="line-b" data-chart-line="b" points="0,205 70,175 130,185 200,150 260,165 330,125 390,150 460,120 520,145 590,110 650,135 720,100 790,160 850,140 900,115"/></svg></div><div class="chart-period-caption" data-chart-caption>Daily view · 01 May - 31 May</div></section>`}

  // Daily / Weekly / Monthly chart period controls used across Branch Performance views.
  const chartPeriodSeries={
    daily:{a:'0,170 70,140 130,105 200,180 260,125 330,155 390,90 460,145 520,110 590,165 650,125 720,85 790,155 850,120 900,80',b:'0,205 70,175 130,185 200,150 260,165 330,125 390,150 460,120 520,145 590,110 650,135 720,100 790,160 850,140 900,115',current:'This Month',previous:'Last Month',caption:'Daily view · 01 May - 31 May'},
    weekly:{a:'0,185 180,125 360,155 540,92 720,135 900,78',b:'0,210 180,165 360,175 540,132 720,158 900,118',current:'This Month',previous:'Last Month',caption:'Weekly view · Week 1 - Week 5'},
    monthly:{a:'0,200 82,165 164,177 246,140 328,150 410,118 492,132 574,95 656,112 738,80 820,105 900,68',b:'0,218 82,192 164,201 246,170 328,180 410,148 492,160 574,125 656,142 738,115 820,138 900,104',current:'FY 2025-26',previous:'FY 2024-25',caption:'Monthly view · Apr 2025 - Mar 2026'}
  };
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-chart-period]');
    if(!btn) return;
    const card=btn.closest('.analytics-trend-card');
    if(!card) return;
    const period=btn.dataset.chartPeriod;
    const series=chartPeriodSeries[period];
    if(!series) return;
    card.querySelectorAll('[data-chart-period]').forEach(b=>b.classList.toggle('active',b===btn));
    const a=card.querySelector('[data-chart-line="a"]');
    const b=card.querySelector('[data-chart-line="b"]');
    if(a) a.setAttribute('points',series.a);
    if(b) b.setAttribute('points',series.b);
    const current=card.querySelector('[data-chart-current-label]');
    const previous=card.querySelector('[data-chart-previous-label]');
    const caption=card.querySelector('[data-chart-caption]');
    if(current) current.textContent=series.current;
    if(previous) previous.textContent=series.previous;
    if(caption) caption.textContent=series.caption;
  });

  function donutHtml(title,total){return `<section class="analytics-card"><h3>${title}</h3><div class="donut-block"><div class="multi-donut"><div><small>Total</small><strong>${total}</strong></div></div><div class="donut-legend"><span><i style="background:#08743a"></i><b>Primary</b><em>45.32%</em></span><span><i style="background:#225de6"></i><b>Secondary</b><em>24.18%</em></span><span><i style="background:#ef8c19"></i><b>Others</b><em>30.50%</em></span></div></div></section>`}
  function cards(items){return `<div class="analytics-kpis">${items.map((x,i)=>`<article><span class="analytics-icon ${['green','blue','orange','violet','cyan','red'][i%6]}"><i class="${x[0]}"></i></span><div><small>${x[1]}</small><strong>${x[2]}</strong><em>${x[3]||'↑ vs Last Month'}</em></div></article>`).join('')}</div>`}

  function analyticsSales(names){return `${cards([['fa-solid fa-chart-line','Total Sales (₹)','4,10,95,895'],['fa-solid fa-cart-shopping','Total Orders','18,732'],['fa-solid fa-percent','Average Order Value (₹)','2,193.48'],['fa-solid fa-file-invoice','Total Items Sold','1,25,430'],['fa-solid fa-store','Return Amount (₹)','45,230'],['fa-solid fa-triangle-exclamation','Discount Given (₹)','32,14,560']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Sales Trend') }<section class="analytics-card"><h3>Sales by Branch</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Branch Name</th><th>Total Sales</th><th>vs Last Month</th><th>Total Orders</th><th>Avg. Order Value</th><th>Items Sold</th><th>Return Amount</th><th>Discount</th><th>Action</th></tr></thead><tbody>${simpleRows(names,[i=>(72.64-i*6.2).toFixed(2)+' L',i=>'↑ '+(15.32-i*.7).toFixed(2)+'%',i=>(3254-i*220).toLocaleString(),i=>(2231-i*33).toFixed(2),i=>(22145-i*1400).toLocaleString(),i=>(7245-i*400).toLocaleString(),i=>(572140-i*22000).toLocaleString()])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Sales by Payment Mode','₹ 4,10,95,895')}<section class="analytics-card"><h3>Sales by Time Slot</h3><div class="progress-list">${['06 AM - 09 AM','09 AM - 12 PM','12 PM - 03 PM','03 PM - 06 PM','06 PM - 09 PM','09 PM - 12 AM'].map((x,i)=>`<span><b>${x}</b><i><em style="width:${35+i*10}%"></em></i><strong>${55+i*8} L</strong></span>`).join('')}</div></section>${donutHtml('Sales by Customer Type','₹ 4,10,95,895')}</div></div>`}
  function analyticsProfit(names){return `${cards([['fa-solid fa-chart-line','Total Profit (₹)','68,75,430'],['fa-solid fa-percent','Total Profit Margin %','16.72%'],['fa-solid fa-wallet','Gross Profit (₹)','1,12,85,760'],['fa-solid fa-gear','Operating Profit (₹)','71,20,340'],['fa-solid fa-coins','Net Profit (₹)','68,75,430'],['fa-solid fa-percent','Net Profit Margin %','10.32%']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Profit Trend',true)}<section class="analytics-card"><h3>Profitability by Branch</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Branch Name</th><th>Gross Profit</th><th>Gross Margin %</th><th>Operating Profit</th><th>Operating Margin %</th><th>Net Profit</th><th>Net Margin %</th><th>Action</th></tr></thead><tbody>${simpleRows(names,[i=>(31.25-i*3.2).toFixed(2)+' L',i=>(23.45-i*.65).toFixed(2)+'%',i=>(18.4-i*1.8).toFixed(2)+' L',i=>(13.81-i*.55).toFixed(2)+'%',i=>(15.44-i*1.5).toFixed(2)+' L',i=>(11.59-i*.38).toFixed(2)+'%'])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Profit by Branch','₹ 68,75,430')}<section class="analytics-card"><h3>Profitability Summary</h3><div class="summary-list"><span><b>Gross Profit Margin %</b><em>22.45%</em></span><span><b>Operating Profit Margin %</b><em>14.32%</em></span><span><b>Net Profit Margin %</b><em>10.32%</em></span><span><b>Return on Investment (ROI) %</b><em>12.48%</em></span></div></section>${donutHtml('Expense Breakdown','₹ 44,10,330')}</div></div>`}
  function analyticsTransactions(names){return `${cards([['fa-solid fa-chart-line','Total Transactions','1,25,430'],['fa-solid fa-cart-shopping','Sales Transactions','1,12,350'],['fa-regular fa-credit-card','Return Transactions','7,250'],['fa-solid fa-gear','Refund Transactions','1,830'],['fa-regular fa-circle-xmark','Cancelled Transactions','2,000'],['fa-solid fa-calculator','Avg. Transaction Value (₹)','1,586.75']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Transactions Trend',true)}<section class="analytics-card"><h3>Transactions by Branch</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Branch Name</th><th>Sales</th><th>Returns</th><th>Refunds</th><th>Cancelled</th><th>Others</th><th>Total Transactions</th><th>Amount</th><th>% Change</th><th>Action</th></tr></thead><tbody>${simpleRows(names,[i=>10245-i*520,i=>652-i*25,i=>168-i*9,i=>210-i*11,i=>155-i*7,i=>11430-i*520,i=>(154.32-i*9.1).toFixed(2)+' L',i=>'↑ '+(9.32-i*.45).toFixed(2)+'%'])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Transactions by Type','1,25,430')}<section class="analytics-card"><h3>Transaction Summary</h3><div class="summary-list"><span><b>Sales</b><em>1,12,350</em></span><span><b>Returns</b><em>7,250</em></span><span><b>Refunds</b><em>1,830</em></span><span><b>Cancelled</b><em>2,000</em></span></div></section></div></div>`}
  function analyticsProducts(){let products=['Fortune Sunflower Oil (5L)','Aashirvaad Atta (5kg)','Tata Salt (1kg)','Surf Excel (2kg)','Maggi 2-Minute Noodles','Dove Beauty Soap','Colgate Strong Teeth','Parle-G (500g)','Dettol Antiseptic Liquid','Amul Gold Milk'];return `${cards([['fa-solid fa-bag-shopping','Total Sales (₹)','4,10,95,895'],['fa-solid fa-cart-shopping','Total Orders','18,732'],['fa-solid fa-box','Total Quantity Sold','2,56,430'],['fa-solid fa-tag','Avg. Selling Price (₹)','160.35'],['fa-solid fa-coins','Total Profit (₹)','68,75,430'],['fa-solid fa-percent','Gross Margin %','16.72%']])}<div class="analytics-grid-main"><div class="analytics-left"><section class="analytics-card"><h3>Top Products by Sales Value</h3><div class="fake-bars">${products.slice(0,9).map((p,i)=>`<div><b style="height:${175-i*14}px"></b><span>${p}</span></div>`).join('')}</div></section><section class="analytics-card"><h3>Top Products Details</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Product Name</th><th>Category</th><th>Brand</th><th>Quantity Sold</th><th>Sales Value</th><th>Avg. Selling Price</th><th>Gross Profit</th><th>Gross Margin %</th><th>% Contribution</th><th>Action</th></tr></thead><tbody>${simpleRows(products,[i=>i%2?'Personal Care':'Grocery',i=>['Fortune','Aashirvaad','Tata','Surf Excel','Maggi'][i%5],i=>(8450+i*800).toLocaleString(),i=>(87.45-i*5.2).toFixed(2)+' L',i=>(103-i*4.1).toFixed(2),i=>(15.23-i*.8).toFixed(2)+' L',i=>(17.43-i*.6).toFixed(2)+'%',i=>(21.26-i*1.5).toFixed(2)+'%'])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Sales Value Contribution','₹ 4,10,95,895')}<section class="analytics-card"><h3>Top Products Summary</h3><div class="summary-list"><span><b>Total Products Sold</b><em>2,56,430</em></span><span><b>Top Product</b><em>Fortune Sunflower Oil (5L)</em></span><span><b>Sales Value</b><em>₹ 87.45 L</em></span></div></section></div></div>`}
  function analyticsGrowth(names){return `${cards([['fa-solid fa-chart-line','Sales Growth','+12.45%'],['fa-solid fa-cart-shopping','Order Growth','+8.91%'],['fa-solid fa-box','Quantity Growth','+9.32%'],['fa-solid fa-coins','Profit Growth','+10.32%'],['fa-solid fa-users','Customer Growth','+7.86%'],['fa-solid fa-percent','Avg. Bill Value Growth','+3.25%']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Sales & Profit Growth Trend',true)}<section class="analytics-card"><h3>Branch wise Growth Comparison</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Branch Name</th><th>Last Month Sales</th><th>This Month Sales</th><th>Sales Growth</th><th>Orders Growth</th><th>Profit Growth</th><th>Status</th><th>Action</th></tr></thead><tbody>${simpleRows(names,[i=>(72.64-i*6.2).toFixed(2)+' L',i=>(81.75-i*6.8).toFixed(2)+' L',i=>'+'+(12.54-i*.5).toFixed(2)+'%',i=>'+'+(11.92-i*.4).toFixed(2)+'%',i=>'+'+(12.97-i*.3).toFixed(2)+'%',i=>'<span class="badge active">Good</span>'])}</tbody></table></div></section></div><div class="analytics-right">${chart('Growth by Category',true)}<section class="analytics-card"><h3>Growth Comparison Summary</h3><div class="summary-list"><span><b>Sales</b><em>+12.45%</em></span><span><b>Orders</b><em>+8.91%</em></span><span><b>Quantity Sold</b><em>+9.32%</em></span><span><b>Profit</b><em>+10.32%</em></span></div></section></div></div>`}

  function expenseDetails(){let cats=['Salaries & Wages','Rent & Lease','Utilities','Repairs & Maintenance','Marketing & Promotion','Administrative Expenses','Finance Costs','Other Expenses'];return `${cards([['fa-solid fa-wallet','Total Expenses (₹)','42,85,320'],['fa-solid fa-gear','Operating Expenses (₹)','26,57,890'],['fa-regular fa-user','Administrative Expenses (₹)','8,76,450'],['fa-solid fa-sack-dollar','Finance Costs (₹)','2,41,680'],['fa-solid fa-shapes','Other Expenses (₹)','5,09,300'],['fa-solid fa-percent','Expense / Sales Ratio','10.42%']])}<div class="analytics-grid-main"><div class="analytics-left"><section class="analytics-card"><h3>Expense Details</h3><div class="target-filter-row"><div class="field target-search"><input class="input" placeholder="Search expenses..."><i class="fa-solid fa-magnifying-glass"></i></div><select class="select"><option>All Categories</option></select><select class="select"><option>All Payment Modes</option></select></div><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Date</th><th>Expense Date</th><th>Category</th><th>Sub Category</th><th>Description</th><th>Branch</th><th>Amount</th><th>Payment Mode</th><th>Reference No.</th><th>Created By</th><th>Action</th></tr></thead><tbody>${simpleRows(cats.concat(cats.slice(0,2)),[i=>'0'+(1+i)+' May 2025',i=>'0'+(1+i)+' May 2025',i=>cats[i%cats.length],i=>['Staff Salaries','Building Rent','Electricity','Equipment Repair'][i%4],i=>'Monthly expense booking',i=>['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery'][i%3],i=>(285000-i*15500).toLocaleString(),i=>['Bank Transfer','Online Payment','UPI','Cash'][i%4],i=>'REF-2504-'+String(i+1).padStart(3,'0'),i=>['Rajesh Kumar','Priya Sharma','Arun Prasad'][i%3]])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Expense by Category','₹ 42,85,320')}<section class="analytics-card"><h3>Payment Mode Summary</h3><div class="progress-list"><span><b>Bank Transfer</b><i><em style="width:72%"></em></i><strong>52.66%</strong></span><span><b>Online Payment</b><i><em style="width:55%"></em></i><strong>23.63%</strong></span><span><b>UPI</b><i><em style="width:42%"></em></i><strong>15.06%</strong></span></div></section></div></div>`}
  function expenseCategory(){return `${cards([['fa-solid fa-wallet','Total Expenses','42,85,320'],['fa-solid fa-gear','Operating Expenses','26,57,890'],['fa-regular fa-user','Administrative Expenses','8,76,450'],['fa-solid fa-sack-dollar','Finance Costs','2,41,680'],['fa-solid fa-shapes','Other Expenses','5,09,300'],['fa-solid fa-percent','Expense / Sales Ratio','10.42%']])}<div class="analytics-grid-main"><div class="analytics-left">${donutHtml('Expense by Category (₹)','₹ 42,85,320')}${chart('Category Trend (Top 6)',true)}<section class="analytics-card"><h3>Category Wise Expense Details</h3>${document.querySelector('#expensesContent table')?.outerHTML||''}</section></div><div class="analytics-right"><section class="analytics-card"><h3>Category Summary</h3><div class="summary-list"><span><b>Salaries & Wages</b><em>35.42%</em></span><span><b>Rent & Lease</b><em>14.87%</em></span><span><b>Utilities</b><em>10.93%</em></span><span><b>Other Expenses</b><em>16.77%</em></span></div></section><section class="analytics-card"><h3>Insights</h3><p>Salaries & Wages accounts for the highest expense (35.42%).</p><p>Utilities expense increased compared to last month.</p></section></div></div>`}
  function expenseComparison(){let names=['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery','ZMart Adyar','ZMart Tambaram','ZMart Porur','ZMart Ambattur','ZMart Chrompet'];return `${cards([['fa-solid fa-wallet','Total Expenses (This Month)','₹ 42,85,320'],['fa-regular fa-calendar','Total Expenses (Last Month)','₹ 40,29,680'],['fa-solid fa-arrow-right-arrow-left','Variance (₹)','₹ 2,55,640'],['fa-solid fa-shapes','Branches Compared','8'],['fa-solid fa-award','Highest Expense Branch','ZMart Anna Nagar'],['fa-solid fa-award','Lowest Expense Branch','ZMart Chrompet']])}<div class="analytics-grid-main"><div class="analytics-left"><div class="perf-row-2">${chart('Total Expenses Comparison (₹)',true)}${chart('Expense Variance (%)',true)}</div><section class="analytics-card"><h3>Branch Wise Expense Comparison</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Branch Name</th><th>This Month</th><th>Last Month</th><th>Variance</th><th>Variance %</th><th>Action</th></tr></thead><tbody>${simpleRows(names,[i=>(8.45-i*.65).toFixed(2)+' L',i=>(7.80-i*.55).toFixed(2)+' L',i=>(.64-i*.11).toFixed(2)+' L',i=>(8.25-i*1.4).toFixed(2)+'%'])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Expense Share by Branch (This Month)','₹ 42,85,320')}<section class="analytics-card"><h3>Top 3 Highest Increase</h3><div class="summary-list"><span><b>ZMart Anna Nagar</b><em>8.25%</em></span><span><b>ZMart Porur</b><em>6.71%</em></span><span><b>ZMart T. Nagar</b><em>5.43%</em></span></div></section></div></div>`}
  function expenseBudget(){return `${cards([['fa-solid fa-wallet','Total Budget (This Month)','₹ 45,60,000'],['fa-regular fa-calendar','Total Actual (This Month)','₹ 42,85,320'],['fa-solid fa-arrow-right-arrow-left','Variance (₹)','₹ 2,74,680'],['fa-solid fa-chart-pie','Budget Utilization','93.98%'],['fa-solid fa-wallet','Total Budget (YTD)','₹ 5,47,20,000'],['fa-regular fa-calendar','Total Actual (YTD)','₹ 4,96,75,680']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Budget vs Actual Trend (Monthly)',true)}<section class="analytics-card"><h3>Category Budget vs Actual Details</h3><div class="progress-list">${['Salaries & Wages','Rent & Lease','Utilities','Repairs & Maintenance','Marketing & Promotion','Finance Costs','Other Expenses'].map((x,i)=>`<span><b>${x}</b><i><em style="width:${78+i*3}%"></em></i><strong>${(97-i*2.5).toFixed(1)}%</strong></span>`).join('')}</div></section></div><div class="analytics-right">${donutHtml('Budget vs Actual Summary','₹ 2,74,680')}<section class="analytics-card"><h3>Branch Budget vs Actual</h3><div class="summary-list"><span><b>ZMart Anna Nagar</b><em>Under Budget</em></span><span><b>ZMart T. Nagar</b><em>Under Budget</em></span><span><b>ZMart Velachery</b><em>Under Budget</em></span></div></section></div></div>`}
  function expenseTrends(){return `${cards([['fa-solid fa-wallet','Total Expenses (This Month)','₹ 42,85,320'],['fa-regular fa-calendar','Total Expenses (Last Month)','₹ 40,29,680'],['fa-solid fa-arrow-right-arrow-left','Average Daily Expense','₹ 1,42,844'],['fa-regular fa-calendar-check','Highest Expense Day','28 Apr 2025'],['fa-regular fa-clock','Lowest Expense Day','06 Apr 2025'],['fa-solid fa-arrow-trend-up','Trend','Increasing']])}<div class="analytics-grid-main"><div class="analytics-left"><div class="perf-row-2">${chart('Expense Trend (Daily)',true)}${chart('Expense Trend (Weekly)',true)}</div><section class="analytics-card"><h3>Daily Expense Trend Overview</h3><div class="summary-list"><span><b>01 Apr 2025</b><em>₹ 1,15,230</em></span><span><b>02 Apr 2025</b><em>₹ 1,08,740</em></span><span><b>30 Apr 2025</b><em>₹ 1,74,250</em></span></div></section></div><div class="analytics-right">${donutHtml('Expense Distribution Trend','₹ 42,85,320')}<section class="analytics-card"><h3>Expense Trend Insights</h3><div class="alert-list"><p><i class="fa-solid fa-arrow-right-arrow-left"></i><b>Total expenses increased by ₹ 2,55,640.</b></p><p><i class="fa-regular fa-calendar"></i><b>Expenses peak on 28 Apr 2025.</b></p></div></section></div></div>`}

  function statusOperational(){let names=['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery','ZMart Adyar','ZMart Tambaram','ZMart Porur','ZMart Ambattur','ZMart Chrompet','ZMart Coimbatore','ZMart Madurai'];return `${cards([['fa-solid fa-store','Total Branches','25'],['fa-regular fa-circle-check','Fully Operational','18'],['fa-solid fa-chart-pie','Partially Operational','4'],['fa-solid fa-triangle-exclamation','Non Operational','2'],['fa-solid fa-wrench','Under Maintenance','1']])}<div class="analytics-grid-main"><div class="analytics-left"><div class="perf-row-2">${donutHtml('Operational Status Distribution','25 Branches')}${chart('Operational Status Trend',true)}</div><section class="analytics-card"><h3>Branch Operational Status</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Branch Code</th><th>Branch Name</th><th>Location</th><th>Manager</th><th>Operational Status</th><th>Open Since</th><th>Today Uptime</th><th>Last Status Update</th><th>Action</th></tr></thead><tbody>${simpleRows(names,[i=>'ZB-'+String(i+1).padStart(3,'0'),i=>i<8?'Chennai, Tamil Nadu':'Tamil Nadu',i=>['Rajesh Kumar','Priya Sharma','Venkatesh B','Suresh R'][i%4],i=>i===6?'<span class="badge risk">Non Operational</span>':i===7?'<span class="badge risk">Under Maintenance</span>':'<span class="badge active">Fully Operational</span>',i=>'09:00 AM',i=>i<6?'100%':'78%',i=>'01 May 2025 10:10 AM'])}</tbody></table></div></section></div><div class="analytics-right"><section class="analytics-card"><h3>Status by Region</h3><div class="summary-list"><span><b>South</b><em>11</em></span><span><b>West</b><em>7</em></span><span><b>North</b><em>5</em></span><span><b>East</b><em>2</em></span></div></section><section class="analytics-card"><h3>Operational Status Insights</h3><div class="alert-list"><p><i class="fa-regular fa-circle-check"></i><b>72% of branches are fully operational.</b></p><p><i class="fa-solid fa-triangle-exclamation"></i><b>2 branches are currently non operational.</b></p></div></section></div></div>`}
  function statusFinancial(){return `${cards([['fa-solid fa-money-bill-trend-up','Total Income (This Month)','₹ 2,34,85,320'],['fa-solid fa-wallet','Total Expenses (This Month)','₹ 1,76,45,680'],['fa-solid fa-arrow-trend-up','Net Profit (This Month)','₹ 58,39,640'],['fa-solid fa-percent','Profit Margin','24.88%'],['fa-solid fa-sack-dollar','Operating Cash Flow','₹ 63,21,450'],['fa-solid fa-building-columns','Total Outstanding','₹ 1,12,38,900']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Income vs Expenses Trend',true)}<section class="analytics-card"><h3>Branch Financial Health Overview</h3><div class="progress-list">${['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery','ZMart Adyar','ZMart Tambaram','ZMart Porur','ZMart Ambattur','ZMart Chrompet'].map((x,i)=>`<span><b>${x}</b><i><em style="width:${88-i*7}%"></em></i><strong>${88-i*7}</strong></span>`).join('')}</div></section></div><div class="analytics-right"><section class="analytics-card"><h3>Financial Health Index</h3><div class="target-donut" style="--p:82;margin:auto"><div><strong>82 /100</strong><small>Good</small></div></div></section><section class="analytics-card"><h3>Key Ratios (This Month)</h3><div class="summary-list"><span><b>Gross Profit Margin</b><em>31.45%</em></span><span><b>Net Profit Margin</b><em>24.88%</em></span><span><b>Current Ratio</b><em>1.86</em></span></div></section>${donutHtml('Income Distribution (This Month)','₹ 2,34,85,320')}</div></div>`}
  function statusPerformance(){return `${cards([['fa-solid fa-trophy','Top Performing Branch','ZMart Anna Nagar'],['fa-solid fa-chart-column','Average Performance Score','68 /100'],['fa-solid fa-bullseye','Target Achieved Branches','14 /25'],['fa-solid fa-flag','Below Target Branches','8 /25'],['fa-solid fa-arrow-trend-down','Under Performing Branches','3 /25']])}<div class="analytics-grid-main"><div class="analytics-left">${chart('Performance Score Trend',true)}<section class="analytics-card"><h3>Branch Performance Overview</h3><div class="progress-list">${['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery','ZMart Adyar','ZMart Tambaram','ZMart Porur','ZMart Ambattur','ZMart Chrompet','ZMart Coimbatore','ZMart Madurai'].map((x,i)=>`<span><b>${x}</b><i><em style="width:${89-i*6}%"></em></i><strong>${89-i*6}</strong></span>`).join('')}</div></section></div><div class="analytics-right">${donutHtml('Performance Score Distribution','25 Branches')}<section class="analytics-card"><h3>Performance by Dimension (Avg. Score)</h3><div class="progress-list"><span><b>Operational Efficiency</b><i><em style="width:72%"></em></i><strong>72</strong></span><span><b>Financial Performance</b><i><em style="width:68%"></em></i><strong>68</strong></span><span><b>Customer Satisfaction</b><i><em style="width:71%"></em></i><strong>71</strong></span></div></section></div></div>`}
  function statusAlerts(){let titles=['Sales 15% below target for this month','High operating expenses detected','Reorder level reached for 8 items','Walk-in cooler temperature high','3 staff on leave today','Daily cash collection pending','Expiry alert for 12 products','Generator maintenance due','New scheme requires activation','GST return filing due in 3 days'];return `${cards([['fa-solid fa-triangle-exclamation','Critical Alerts','12'],['fa-regular fa-circle-exclamation','High Priority','18'],['fa-regular fa-bell','Medium Priority','24'],['fa-solid fa-circle-info','Low Priority','9'],['fa-regular fa-file-lines','Total Alerts','63']])}<div class="analytics-grid-main"><div class="analytics-left"><section class="analytics-card"><h3>Alerts List</h3><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>#</th><th>Alert Title</th><th>Branch</th><th>Alert Type</th><th>Priority</th><th>Status</th><th>Date & Time</th><th>Action</th></tr></thead><tbody>${simpleRows(titles,[i=>['ZMart Anna Nagar','ZMart T. Nagar','ZMart Velachery','ZMart Adyar'][i%4],i=>['Sales Performance','Financial','Inventory','Operations'][i%4],i=>'<span class="badge risk">'+['Critical','High','Medium','Low'][i%4]+'</span>',i=>'<span class="badge active">'+['New','New','In Progress','Acknowledged'][i%4]+'</span>',i=>'01 May 2025 10:10 AM'])}</tbody></table></div></section></div><div class="analytics-right">${donutHtml('Alerts by Priority','63 Alerts')}<section class="analytics-card"><h3>Alerts by Status</h3><div class="progress-list"><span><b>New</b><i><em class="red" style="width:70%"></em></i><strong>28</strong></span><span><b>In Progress</b><i><em class="orange" style="width:55%"></em></i><strong>16</strong></span><span><b>Acknowledged</b><i><em style="width:38%"></em></i><strong>12</strong></span></div></section></div></div>`}

})();

// v47 Branch Performance reference interactions
(()=>{const toast=(m)=>{const t=document.getElementById('branchToast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};
document.getElementById('performanceFilters')?.addEventListener('click',()=>toast('Performance filters applied.'));
document.getElementById('exportPerformance')?.addEventListener('click',()=>toast('Performance report exported successfully.'));
document.querySelectorAll('.performance-side .text-link').forEach(b=>b.addEventListener('click',()=>toast('Showing complete branch performance data.')));
})();

// v53: shared Daily / Weekly / Monthly controls for static Branch module charts.
(()=>{
  const periodData={
    daily:{
      a:'0,170 70,150 130,180 200,120 260,145 330,95 390,125 460,80 520,115 590,90 650,130 720,105 790,165 850,130 900,95',
      b:'0,205 70,175 130,190 200,160 260,180 330,130 390,165 460,145 520,100 590,125 650,150 720,110 790,180 850,160 900,120',
      labels:['01 May','06 May','11 May','16 May','21 May','26 May','31 May']
    },
    weekly:{
      a:'0,180 180,128 360,156 540,92 720,136 900,82',
      b:'0,210 180,170 360,183 540,132 720,160 900,120',
      labels:['Week 1','Week 2','Week 3','Week 4','Week 5']
    },
    monthly:{
      a:'0,195 82,166 164,178 246,143 328,151 410,119 492,133 574,97 656,113 738,82 820,106 900,70',
      b:'0,220 82,194 164,202 246,173 328,181 410,151 492,161 574,128 656,144 738,117 820,140 900,106',
      labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']
    }
  };

  function updateStaticPeriod(btn){
    const group=btn.parentElement;
    if(!group) return;
    const buttons=[...group.querySelectorAll('.chip')];
    if(buttons.length<2) return;
    const card=btn.closest('.analytics-card');
    if(!card) return;
    const key=(btn.textContent||'').trim().toLowerCase();
    const data=periodData[key];
    if(!data) return;

    buttons.forEach(x=>x.classList.toggle('active',x===btn));
    const lines=card.querySelectorAll('.fake-line svg polyline');
    if(lines[0]) lines[0].setAttribute('points',data.a);
    if(lines[1]) lines[1].setAttribute('points',data.b);

    const axis=card.querySelector('.axis-labels');
    if(axis) axis.innerHTML=data.labels.map(x=>`<span>${x}</span>`).join('');

    // Keep chart title meaningful when switching period without changing the module design.
    const title=card.querySelector('.card-head h3');
    if(title){
      if(!title.dataset.baseTitle) title.dataset.baseTitle=title.textContent.replace(/\s*\((Daily|Weekly|Monthly)\)\s*$/i,'').trim();
      const base=title.dataset.baseTitle;
      if(/Expense Trend|Sales Overview/i.test(base)) title.textContent=`${base} (${btn.textContent.trim()})`;
    }

    const toast=document.getElementById('branchToast');
    if(toast){
      toast.textContent=`${btn.textContent.trim()} view applied.`;
      toast.classList.add('show');
      clearTimeout(window.__branchPeriodToast);
      window.__branchPeriodToast=setTimeout(()=>toast.classList.remove('show'),1200);
    }
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('.card-head .chip');
    if(!btn) return;
    e.preventDefault();
    updateStaticPeriod(btn);
  });
})();
