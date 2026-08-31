
(() => {
  const toast = document.getElementById('toast');
  let timer;
  const showToast = msg => {
    if(!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(timer); timer=setTimeout(()=>toast.classList.remove('show'),2200);
  };

  // Because these pages live one level below the dashboard module,
  // component image paths need to resolve from the page folder.
  document.querySelectorAll('#sidebarMount img').forEach(img=>{
    if(img.getAttribute('src')==='assets/images/logo-zmart.png') img.src='../assets/images/logo-zmart.png';
  });

  // Make Company Management the active/expanded sidebar section.
  const activateCompany = () => {
    document.querySelectorAll('.nav-group').forEach(g=>g.classList.remove('active'));
    const group=document.querySelector('.nav-group[data-group="company"]');
    if(group){group.classList.add('active','open');group.querySelector('.nav-item')?.setAttribute('aria-expanded','true');}
    const file=location.pathname.split('/').pop();
    const labels={
      'company-profile.html':'Company Profile','financial-year.html':'Financial Year','financial-year-details.html':'Financial Year',
      'financial-year-edit.html':'Financial Year','financial-year-report.html':'Financial Year','business-settings.html':'Business Settings',
      'gst-settings.html':'GST Settings','invoice-settings.html':'Invoice Settings','tax-configuration.html':'Tax Configuration',
      'currency-settings.html':'Currency Settings','backup-settings.html':'Backup Settings'
    };
    document.querySelectorAll('[data-subnav]').forEach(b=>{
      const active = b.dataset.subnav===labels[file];
      b.classList.toggle('active',active);
      if(active) b.setAttribute('aria-current','page');
      else b.removeAttribute('aria-current');
    });
  };
  requestAnimationFrame(activateCompany);
  window.addEventListener('load', activateCompany);

  // Override component navigation with actual inner page links.
  const companyRoutes={
    'Company Profile':'company-profile.html','Financial Year':'financial-year.html','Business Settings':'business-settings.html',
    'GST Settings':'gst-settings.html','Invoice Settings':'invoice-settings.html','Tax Configuration':'tax-configuration.html',
    'Currency Settings':'currency-settings.html','Backup Settings':'backup-settings.html'
  };
  document.addEventListener('click', e=>{
    const tab=e.target.closest('[data-href]');
    if(tab){ e.preventDefault(); location.href=tab.dataset.href; return; }
    const sub=e.target.closest('[data-subnav]');
    if(sub && companyRoutes[sub.dataset.subnav]){e.preventDefault();e.stopPropagation();location.href=companyRoutes[sub.dataset.subnav];return;}
  }, true);

  const modalRoot=document.createElement('div');
  modalRoot.className='ui-modal-backdrop'; modalRoot.hidden=true; document.body.appendChild(modalRoot);
  const closeModal=()=>{modalRoot.hidden=true;modalRoot.innerHTML=''};
  modalRoot.addEventListener('click',e=>{if(e.target===modalRoot||e.target.closest('[data-close-modal]'))closeModal()});

  function modal(html, wide=false){
    modalRoot.innerHTML=`<div class="ui-modal ${wide?'wide':''}">${html}</div>`; modalRoot.hidden=false;
  }

  function yearActions(year='2025 - 2026'){
    modal(`<div class="ui-modal-header"><h3>Financial Year Actions</h3><button class="ui-close" data-close-modal>&times;</button></div>
      <div class="ui-modal-body">
        <div class="modal-summary"><strong><i class="fa-regular fa-calendar-days" style="color:#19872d"></i> &nbsp; ${year}</strong> &nbsp; <span class="ui-badge success">Current</span><div style="font-size:11px;margin-top:5px">01 Apr 2025 - 31 Mar 2026</div></div>
        <div class="actions-list" style="margin-top:14px">
          <button class="action-row" data-modal-action="view"><i class="fa-regular fa-eye"></i><span><strong>View Details</strong><small>View financial year details and information.</small></span><i class="fa-solid fa-chevron-right"></i></button>
          <button class="action-row" data-modal-action="edit"><i class="fa-regular fa-pen-to-square"></i><span><strong>Edit</strong><small>Edit financial year information.</small></span><i class="fa-solid fa-chevron-right"></i></button>
          <button class="action-row" data-modal-action="close-year"><i class="fa-solid fa-lock"></i><span><strong>Close Financial Year</strong><small>Close this financial year. You will not be able to add or edit transactions after closing.</small></span><i class="fa-solid fa-chevron-right"></i></button>
          <button class="action-row" data-modal-action="report"><i class="fa-regular fa-file-lines"></i><span><strong>Generate Financial Year Report</strong><small>Generate summary report for this financial year.</small></span><i class="fa-solid fa-chevron-right"></i></button>
          <button class="action-row danger" data-modal-action="delete"><i class="fa-regular fa-trash-can"></i><span><strong>Delete</strong><small>Delete this financial year. This action cannot be undone.</small></span><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div><div class="ui-modal-footer"><button class="ui-btn" data-close-modal>Cancel</button></div>`);
  }

  function closeYearModal(){
    modal(`<div class="ui-modal-header"><h3>Close Financial Year</h3><button class="ui-close" data-close-modal>&times;</button></div><div class="ui-modal-body">
      <div class="ui-warning-box"><strong><i class="fa-solid fa-triangle-exclamation" style="color:#e8a200"></i> &nbsp; You are about to close the current financial year.</strong><div style="margin-top:4px">This action cannot be undone.</div></div>
      <div class="ui-card" style="margin-top:12px"><div class="ui-card-title"><i class="fa-regular fa-calendar-days"></i> Financial Year Details</div><div class="cm-card-body detail-list"><span>Financial Year</span><b>:</b><span>2025 - 2026</span><span>Start Date</span><b>:</b><span>01 Apr 2025</span><span>End Date</span><b>:</b><span>31 Mar 2026</span><span>Duration</span><b>:</b><span>12 Months</span></div></div>
      <div class="ui-card" style="margin-top:12px"><div class="ui-card-title"><i class="fa-regular fa-calendar-check"></i> Pre-close Checklist</div><div class="cm-card-body" style="font-size:11px;line-height:2"><div>✅ All transactions are completed for this financial year.</div><div>✅ All reports have been generated.</div><div>✅ Data has been verified and backed up.</div><div>⚠ Once closed, you will not be able to add or edit any transactions in this financial year.</div></div></div>
      <div class="ui-info-box" style="margin-top:12px"><div class="ui-field"><label>Type CLOSE to confirm</label><input class="ui-input" id="closeConfirm" placeholder="Type CLOSE here"></div></div>
      </div><div class="ui-modal-footer"><button class="ui-btn" data-close-modal>Cancel</button><button class="ui-btn ui-btn-danger" id="confirmClose"><i class="fa-solid fa-lock"></i> Close Financial Year</button></div>`);
  }
  function deleteYearModal(){
    modal(`<div class="ui-modal-header"><h3>Delete Financial Year</h3><button class="ui-close" data-close-modal>&times;</button></div><div class="ui-modal-body">
      <div class="ui-danger-box"><strong style="color:#dc2626"><i class="fa-regular fa-trash-can"></i> &nbsp; Are you sure you want to delete this financial year?</strong><div style="margin-top:5px">This action cannot be undone.</div></div>
      <div class="ui-card" style="margin-top:12px"><div class="ui-card-title" style="color:#dc2626">Financial Year Details</div><div class="cm-card-body detail-list"><span>Financial Year</span><b>:</b><span>2021 - 2022</span><span>Start Date</span><b>:</b><span>01 Apr 2021</span><span>End Date</span><b>:</b><span>31 Mar 2022</span><span>Status</span><b>:</b><span>Closed</span><span>Created On</span><b>:</b><span>01/04/2021 10:00 AM</span></div></div>
      <div class="ui-warning-box" style="margin-top:12px"><strong>Please Note</strong><ul class="note-list"><li>You cannot delete a financial year that has transactions.</li><li>Please ensure all related transactions and data are removed or archived before deleting.</li></ul></div>
      <div class="ui-field" style="margin-top:12px"><label>Type DELETE to confirm</label><input class="ui-input" id="deleteConfirm" placeholder="Type DELETE here"></div>
      </div><div class="ui-modal-footer"><button class="ui-btn" data-close-modal>Cancel</button><button class="ui-btn ui-btn-danger" id="confirmDelete"><i class="fa-regular fa-trash-can"></i> Delete Financial Year</button></div>`);
  }

  function addTaxModal(){
    modal(`<div class="ui-modal-header"><h3>Add New Tax Rate</h3><button class="ui-close" data-close-modal>&times;</button></div><div class="ui-modal-body">
      <div class="ui-card-title" style="padding-left:0;border:0"><i class="fa-solid fa-percent"></i> Tax Rate Information</div>
      <div class="modal-form-grid">
      <div class="ui-field"><label>Tax Name / Description <span class="req">*</span></label><input class="ui-input" placeholder="Enter tax name (e.g., GST 18%)"></div>
      <div class="ui-field"><label>CGST (%) <span class="req">*</span></label><input class="ui-input" type="number" placeholder="Enter CGST percentage"></div>
      <div class="ui-field"><label>Tax Type <span class="req">*</span></label><select class="ui-select"><option>Standard</option><option>Cess</option></select></div>
      <div class="ui-field"><label>SGST (%) <span class="req">*</span></label><input class="ui-input" type="number" placeholder="Enter SGST percentage"></div>
      <div class="ui-field"><label>Tax Category</label><select class="ui-select"><option>Select category</option></select></div>
      <div class="ui-field"><label>IGST (%) <span class="req">*</span></label><input class="ui-input" type="number" placeholder="Enter IGST percentage"></div>
      <div class="ui-field"><label>HSN / SAC Applicability</label><select class="ui-select"><option>Select applicability</option></select></div>
      <div class="ui-field"><label>CESS (%)</label><input class="ui-input" type="number" placeholder="Enter CESS percentage"></div>
      <div class="ui-field"><label>Effective From Date <span class="req">*</span></label><input class="ui-input" type="date"></div>
      <div class="ui-field"><label>Effective To Date</label><input class="ui-input" type="date"></div>
      </div>
      <div class="ui-card-title" style="padding-left:0;margin-top:10px"><i class="fa-solid fa-gear"></i> Additional Options</div>
      <div class="cm-grid cols-2" style="padding-top:10px"><label class="ui-checkbox"><input type="checkbox"> Applicable for Intra-State Transactions (CGST + SGST)</label><label class="ui-checkbox"><input type="checkbox"> Include in E-Invoicing</label><label class="ui-checkbox"><input type="checkbox"> Applicable for Inter-State Transactions (IGST)</label><label class="ui-checkbox"><input type="checkbox" checked> Active</label></div>
      </div><div class="ui-modal-footer"><button class="ui-btn" data-close-modal>Cancel</button><button class="ui-btn">Reset</button><button class="ui-btn ui-btn-primary" data-save-modal><i class="fa-regular fa-floppy-disk"></i> Save Tax Rate</button></div>`,true);
  }

  function addBankModal(){
    modal(`<div class="ui-modal-header"><h3>Add New Bank Account</h3><button class="ui-close" data-close-modal>&times;</button></div><div class="ui-modal-body">
      <div class="ui-card-title" style="padding-left:0;border:0"><i class="fa-solid fa-building-columns"></i> Bank Account Information</div>
      <div class="modal-form-grid">
      <div class="ui-field"><label>Account Holder Name <span class="req">*</span></label><input class="ui-input" value="ZMart Supermarket Private Limited"></div><div class="ui-field"><label>Bank Name <span class="req">*</span></label><select class="ui-select"><option>Select Bank</option><option>HDFC Bank</option></select></div>
      <div class="ui-field"><label>Account Number <span class="req">*</span></label><input class="ui-input" placeholder="Enter account number"></div><div class="ui-field"><label>Confirm Account Number <span class="req">*</span></label><input class="ui-input" placeholder="Re-enter account number"></div>
      <div class="ui-field"><label>Account Type <span class="req">*</span></label><select class="ui-select"><option>Select Account Type</option><option>Current Account</option></select></div><div class="ui-field"><label>IFSC Code <span class="req">*</span></label><input class="ui-input" placeholder="Enter IFSC code"></div>
      <div class="ui-field"><label>Branch Name <span class="req">*</span></label><input class="ui-input" placeholder="Enter branch name"></div><div class="ui-field"><label>Branch Address</label><textarea class="ui-textarea" placeholder="Enter branch address"></textarea></div>
      <div class="ui-field"><label>City <span class="req">*</span></label><input class="ui-input" placeholder="Enter city"></div><div class="ui-field"><label>State <span class="req">*</span></label><select class="ui-select"><option>Select State</option><option>Karnataka</option></select></div>
      <div class="ui-field"><label>PIN Code <span class="req">*</span></label><input class="ui-input" placeholder="Enter PIN code"></div><div class="ui-field"><label>Country <span class="req">*</span></label><select class="ui-select"><option>India</option></select></div>
      </div><div class="ui-card-title" style="padding-left:0;margin-top:10px"><i class="fa-regular fa-circle-info"></i> Upload Documents</div><div class="ui-field"><label>Cancelled Cheque / Passbook Copy <span class="req">*</span></label>
      <div class="dropzone" data-upload-zone>
        <input class="ui-file-input" type="file" data-upload-input accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf">
        <span data-upload-text><i class="fa-solid fa-cloud-arrow-up"></i> Click to upload or drag and drop<span class="upload-meta">JPG, PNG, PDF (Max. 2MB)</span></span>
      </div></div>
      </div><div class="ui-modal-footer"><button class="ui-btn" data-close-modal>Cancel</button><button class="ui-btn">Reset</button><button class="ui-btn ui-btn-primary" data-save-modal><i class="fa-regular fa-floppy-disk"></i> Save Bank Account</button></div>`,true);
  }


  const maxUploadBytes = 2 * 1024 * 1024;

  const validateUpload = (file, allowedTypes) => {
    if (!file) return false;
    if (file.size > maxUploadBytes) {
      showToast('File size must be 2 MB or less.');
      return false;
    }
    if (allowedTypes?.length && !allowedTypes.includes(file.type)) {
      showToast('Unsupported file type.');
      return false;
    }
    return true;
  };

  const updateLogoPreview = file => {
    if (!validateUpload(file, ['image/png','image/jpeg','image/webp'])) return;
    const preview = document.getElementById('companyLogoPreview');
    const fileName = document.getElementById('companyLogoFileName');
    if (!preview) return;
    const oldUrl = preview.dataset.objectUrl;
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.dataset.objectUrl = url;
    if (fileName) fileName.textContent = file.name;
    showToast('Company logo selected successfully.');
  };

  const renderUploadedFile = (zone, file) => {
    if (!validateUpload(file, ['image/jpeg','image/png','application/pdf'])) return;
    const text = zone.querySelector('[data-upload-text]');
    if (text) {
      text.innerHTML = `<i class="fa-solid fa-circle-check"></i> Upload ready<span class="upload-file-name">${file.name}</span><span class="upload-meta">${(file.size/1024).toFixed(1)} KB</span>`;
    }
    zone.classList.remove('drag-over');
    showToast('File selected successfully.');
  };

  document.getElementById('companyLogoInput')?.addEventListener('change', event => {
    updateLogoPreview(event.target.files?.[0]);
  });

  document.addEventListener('click', event => {
    const zone = event.target.closest('[data-upload-zone]');
    if (zone && !event.target.closest('input[type="file"]')) {
      event.preventDefault();
      zone.querySelector('[data-upload-input]')?.click();
    }
  });

  document.addEventListener('change', event => {
    const input = event.target.closest('[data-upload-input]');
    if (!input) return;
    const zone = input.closest('[data-upload-zone]');
    const file = input.files?.[0];
    if (zone && file) renderUploadedFile(zone, file);
  });

  document.addEventListener('dragover', event => {
    const zone = event.target.closest('[data-upload-zone]');
    if (!zone) return;
    event.preventDefault();
    zone.classList.add('drag-over');
  });

  document.addEventListener('dragleave', event => {
    const zone = event.target.closest('[data-upload-zone]');
    if (!zone) return;
    zone.classList.remove('drag-over');
  });

  document.addEventListener('drop', event => {
    const zone = event.target.closest('[data-upload-zone]');
    if (!zone) return;
    event.preventDefault();
    zone.classList.remove('drag-over');
    const file = event.dataTransfer?.files?.[0];
    const input = zone.querySelector('[data-upload-input]');
    if (file && input) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
      } catch (_) {}
      renderUploadedFile(zone, file);
    }
  });



  const updateInvoiceLogoPreview = file => {
    if (!validateUpload(file, ['image/png','image/jpeg','image/webp'])) return;

    const fileName = document.getElementById('invoiceLogoFileName');
    const smallPreview = document.getElementById('invoiceLogoPreview');
    const invoicePreview = document.getElementById('invoicePreviewBrandLogo');

    const currentUrl = smallPreview?.dataset.objectUrl || invoicePreview?.dataset.objectUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);

    const url = URL.createObjectURL(file);

    if (smallPreview) {
      smallPreview.src = url;
      smallPreview.dataset.objectUrl = url;
    }
    if (invoicePreview) {
      invoicePreview.src = url;
      invoicePreview.dataset.objectUrl = url;
    }
    if (fileName) fileName.textContent = file.name;

    showToast('Invoice logo selected successfully.');
  };

  document.addEventListener('change', event => {
    if (event.target.id !== 'invoiceLogoInput') return;
    updateInvoiceLogoPreview(event.target.files?.[0]);
  });

  const invoiceGeneralHTML = document.getElementById('invoiceTabContent')?.innerHTML || '';

  function invoiceNumberingHTML(){
    return `<div class="invoice-left-grid" style="grid-column:1">
      <div class="ui-card"><div class="ui-card-title"><i class="fa-regular fa-rectangle-list"></i> Invoice Numbering Configuration</div><div class="setting-list">
      <div class="setting-row"><span>Enable Custom Invoice Numbering</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
      <div class="cm-grid cols-2"><div class="ui-field"><label>Prefix</label><input class="ui-input" value="INV"></div><div class="ui-field"><label>Year Format</label><select class="ui-select"><option>YYYY (2025)</option></select></div><div class="ui-field"><label>Suffix</label><input class="ui-input"></div><div class="ui-field"><label>Start Sequence From</label><input class="ui-input" value="00001"></div><div class="ui-field"><label>Reset Sequence</label><select class="ui-select"><option>Yearly</option></select></div><div class="ui-field"><label>Preview Next Number</label><input class="ui-input" value="INV-2025-00001" readonly></div></div></div></div>
      <div class="ui-card"><div class="ui-card-title"><i class="fa-regular fa-clipboard"></i> Invoice Numbering Rules</div><div class="setting-list"><div>✅ Invoice numbers must be unique.</div><div>✅ Sequence will reset based on selected Reset Sequence.</div><div>✅ Changes will apply for new invoices only.</div><div>✅ Existing invoice numbers will not be affected.</div></div></div>
      <div class="ui-card" style="grid-column:1/-1"><div class="tax-section-head"><span><i class="fa-solid fa-list-ol"></i> Numbering by Invoice Type</span><button class="ui-btn ui-btn-primary ui-btn-sm" data-action="add-invoice-type"><i class="fa-solid fa-plus"></i> Add Invoice Type</button></div><table class="ui-table"><tr><th>Invoice Type</th><th>Prefix</th><th>Number Format</th><th>Reset Sequence</th><th>Next Number</th><th>Status</th><th>Actions</th></tr>${['Tax Invoice|INV','Proforma Invoice|PI','Credit Note|CN','Debit Note|DN','Estimate|EST'].map(x=>{const [n,p]=x.split('|');return `<tr><td>${n}</td><td>${p}</td><td>${p}-2025-00001</td><td>Yearly</td><td>${p}-2025-00001</td><td><span class="ui-badge success">Active</span></td><td><button class="ui-icon-btn"><i class="fa-regular fa-pen-to-square"></i></button> <button class="ui-icon-btn"><i class="fa-regular fa-trash-can"></i></button></td></tr>`}).join('')}</table></div>
    </div><div class="ui-card invoice-preview-card"><div class="invoice-preview-head"><strong>Invoice Preview</strong></div><div class="invoice-paper"><div class="invoice-brand"><img src="../assets/images/logo-zmart.png"><div><h2>TAX INVOICE</h2><p>Invoice #: INV-2025-00001</p></div></div><p><strong>ZMart Supermarket Private Limited</strong><br>No. 123, ZMart Towers, Bangalore</p></div></div>`;
  }

  function invoiceTaxesHTML(){
    return `<div style="grid-column:1">
      <div class="ui-card cm-section"><div class="tax-section-head"><span><i class="fa-regular fa-clipboard"></i> Tax Configuration</span><button class="ui-btn ui-btn-primary ui-btn-sm" data-action="add-invoice-tax"><i class="fa-solid fa-plus"></i> Add Tax Rate</button></div><table class="ui-table"><tr><th>#</th><th>Tax Name</th><th>Tax Type</th><th>Rate (%)</th><th>HSN/SAC Applicability</th><th>Status</th><th>Actions</th></tr>${[['CGST','Central Tax','2.50'],['SGST','State Tax','2.50'],['IGST','Integrated Tax','5.00'],['CESS','Cess','1.00']].map((x,i)=>`<tr><td>${i+1}</td><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>Yes</td><td><span class="ui-badge success">Active</span></td><td><button class="ui-icon-btn"><i class="fa-regular fa-pen-to-square"></i></button> <button class="ui-icon-btn"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join('')}</table></div>
      <div class="ui-card"><div class="tax-section-head"><span><i class="fa-regular fa-clipboard"></i> Additional Charges</span><button class="ui-btn ui-btn-primary ui-btn-sm" data-action="add-charge"><i class="fa-solid fa-plus"></i> Add Charge</button></div><table class="ui-table"><tr><th>#</th><th>Charge Name</th><th>Charge Type</th><th>Calculation Type</th><th>Rate / Amount</th><th>Taxable</th><th>Status</th><th>Actions</th></tr>${[['Packing Charges','Fixed Amount','Fixed','₹ 20.00'],['Delivery Charges','Percentage','Percentage','2.00 %'],['Handling Charges','Fixed Amount','Fixed','₹ 15.00'],['Installation Charges','Percentage','Percentage','5.00 %']].map((x,i)=>`<tr><td>${i+1}</td>${x.map(v=>`<td>${v}</td>`).join('')}<td>Yes</td><td><span class="ui-badge success">Active</span></td><td><button class="ui-icon-btn"><i class="fa-regular fa-pen-to-square"></i></button></td></tr>`).join('')}</table></div>
    </div><div class="ui-card invoice-preview-card"><div class="invoice-preview-head"><strong>Invoice Preview</strong></div><div class="invoice-paper"><div class="invoice-brand"><img src="../assets/images/logo-zmart.png"><div><h2>TAX INVOICE</h2></div></div><p><strong>ZMart Supermarket Private Limited</strong></p><div class="invoice-total"><span>Subtotal</span><b>₹ 987.00</b><span>Total Tax</span><b>₹ 46.86</b><span>CESS</span><b>₹ 9.87</b><span>Packing Charges</span><b>₹ 20.00</b><span>Total Amount</span><b>₹ 1,063.73</b></div></div></div>`;
  }


  function invoiceTemplateHTML(){
    return `<div style="grid-column:1">
      <div class="ui-card cm-section">
        <div class="ui-card-title"><i class="fa-solid fa-palette"></i> Template Selection</div>
        <div class="template-choice-grid">
          <label class="template-choice active">
            <input type="radio" name="invoiceTemplate" checked>
            <span class="template-thumb classic"><b>ZMart</b><i></i><i></i><i></i></span>
            <strong>Classic</strong><small>Clean standard invoice layout</small>
          </label>
          <label class="template-choice">
            <input type="radio" name="invoiceTemplate">
            <span class="template-thumb modern"><b>ZMart</b><i></i><i></i><i></i></span>
            <strong>Modern</strong><small>Modern header and compact totals</small>
          </label>
          <label class="template-choice">
            <input type="radio" name="invoiceTemplate">
            <span class="template-thumb minimal"><b>ZMart</b><i></i><i></i><i></i></span>
            <strong>Minimal</strong><small>Simple low-ink invoice style</small>
          </label>
        </div>
      </div>

      <div class="ui-card cm-section">
        <div class="ui-card-title"><i class="fa-solid fa-sliders"></i> Layout & Branding</div>
        <div class="cm-form-grid cols-2">
          <div class="ui-field"><label>Primary Color</label><input class="ui-input" type="color" value="#168238"></div>
          <div class="ui-field"><label>Accent Color</label><input class="ui-input" type="color" value="#2e9f34"></div>
          <div class="ui-field"><label>Logo Position</label><select class="ui-select"><option>Top Left</option><option>Top Center</option><option>Top Right</option></select></div>
          <div class="ui-field"><label>Invoice Title Position</label><select class="ui-select"><option>Top Right</option><option>Top Center</option></select></div>
          <div class="ui-field"><label>Paper Size</label><select class="ui-select"><option>A4</option><option>Letter</option></select></div>
          <div class="ui-field"><label>Font Size</label><select class="ui-select"><option>Normal</option><option>Compact</option><option>Large</option></select></div>
        </div>
      </div>

      <div class="ui-card">
        <div class="ui-card-title"><i class="fa-regular fa-eye"></i> Visible Sections</div>
        <div class="cm-form-grid cols-2">
          <label class="ui-checkbox"><input type="checkbox" checked> Company Address</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Customer GSTIN</label>
          <label class="ui-checkbox"><input type="checkbox" checked> HSN/SAC Column</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Tax Summary</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Amount in Words</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Authorized Signature</label>
          <label class="ui-checkbox"><input type="checkbox"> Company Stamp</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Footer Note</label>
        </div>
      </div>
    </div>${invoicePreviewHTML('TEMPLATE PREVIEW')}`;
  }

  function invoiceTermsHTML(){
    return `<div style="grid-column:1">
      <div class="ui-card cm-section">
        <div class="ui-card-title"><i class="fa-regular fa-file-lines"></i> Terms & Conditions</div>
        <div class="setting-list">
          <div class="ui-field"><label>Default Terms & Conditions</label>
            <textarea class="ui-textarea invoice-long-text">1. Goods once sold will not be taken back or exchanged.
2. Payment must be made within the agreed due date.
3. Interest may be charged on overdue payments.
4. Any dispute is subject to Bangalore jurisdiction.
5. Please verify goods and quantities at the time of delivery.</textarea>
          </div>
          <div class="ui-field"><label>Payment Terms Note</label>
            <textarea class="ui-textarea">Payment is due within 15 days from the invoice date unless otherwise agreed in writing.</textarea>
          </div>
          <div class="ui-field"><label>Return / Refund Policy</label>
            <textarea class="ui-textarea">Returns are accepted only for eligible products in saleable condition with the original invoice.</textarea>
          </div>
        </div>
      </div>

      <div class="ui-card">
        <div class="ui-card-title"><i class="fa-solid fa-list-check"></i> Display Options</div>
        <div class="cm-form-grid cols-2">
          <label class="ui-checkbox"><input type="checkbox" checked> Show Terms & Conditions</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Show Payment Terms</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Show Return Policy</label>
          <label class="ui-checkbox"><input type="checkbox"> Show Bank Details</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Show Footer Declaration</label>
          <label class="ui-checkbox"><input type="checkbox" checked> Show Authorized Signatory</label>
        </div>
      </div>
    </div>${invoicePreviewHTML('TERMS PREVIEW')}`;
  }

  function invoiceAdditionalHTML(){
    return `<div style="grid-column:1">
      <div class="ui-card cm-section">
        <div class="ui-card-title"><i class="fa-solid fa-gears"></i> Additional Invoice Settings</div>
        <div class="cm-form-grid cols-2">
          <div class="setting-row"><span>Auto Generate Invoice Number</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Auto Calculate Tax</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Allow Invoice Edit After Save</span><label class="ui-switch"><input type="checkbox"><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Allow Negative Stock Billing</span><label class="ui-switch"><input type="checkbox"><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Email Invoice After Save</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Enable E-Invoice Integration</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Enable E-Way Bill</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
          <div class="setting-row"><span>Print Duplicate Copy Label</span><label class="ui-switch"><input type="checkbox" checked><span class="ui-switch-track"></span></label></div>
        </div>
      </div>

      <div class="ui-card cm-section">
        <div class="ui-card-title"><i class="fa-solid fa-print"></i> Print & Export Preferences</div>
        <div class="cm-form-grid cols-2">
          <div class="ui-field"><label>Default Print Copies</label><select class="ui-select"><option>1 Copy</option><option>2 Copies</option><option>3 Copies</option></select></div>
          <div class="ui-field"><label>Default Export Format</label><select class="ui-select"><option>PDF</option><option>Excel</option></select></div>
          <div class="ui-field"><label>Invoice PDF Password</label><input class="ui-input" placeholder="Optional password"></div>
          <div class="ui-field"><label>PDF File Name Format</label><select class="ui-select"><option>Invoice Number - Customer</option><option>Invoice Number Only</option></select></div>
        </div>
      </div>

      <div class="ui-card">
        <div class="ui-card-title"><i class="fa-regular fa-envelope"></i> Delivery Preferences</div>
        <div class="cm-form-grid cols-2">
          <div class="ui-field"><label>Email Subject Template</label><input class="ui-input" value="Invoice {invoice_no} from ZMart"></div>
          <div class="ui-field"><label>Email CC</label><input class="ui-input" value="accounts@zmart.com"></div>
          <div class="ui-field" style="grid-column:1/-1"><label>Email Message</label><textarea class="ui-textarea">Dear Customer, please find your invoice attached. Thank you for shopping with ZMart.</textarea></div>
        </div>
      </div>
    </div>${invoicePreviewHTML('ADDITIONAL SETTINGS PREVIEW')}`;
  }

  function invoicePreviewHTML(title){
    return `<div class="ui-card invoice-preview-card">
      <div class="invoice-preview-head"><strong>${title}</strong><button class="ui-btn ui-btn-sm">Preview in Full Page <i class="fa-solid fa-arrow-up-right-from-square"></i></button></div>
      <div class="invoice-paper">
        <div class="invoice-brand"><img src="../assets/images/logo-zmart.png"><div><h2>TAX INVOICE</h2><p>Invoice #: INV-2025-000123<br>Date: 15/05/2025</p></div></div>
        <strong>ZMart Supermarket Private Limited</strong>
        <p>No. 123, ZMart Towers, Business Park<br>Outer Ring Road, Bangalore - 560103, Karnataka, India.<br>GSTIN: 29AAACZ1234A1Z5</p>
        <hr>
        <div class="cm-grid cols-2"><div><strong>Bill To</strong><p>Customer Name<br>Bangalore - 560001</p></div><div><strong>Ship To</strong><p>Customer Name<br>Bangalore - 560001</p></div></div>
        <table class="ui-table"><tr><th>#</th><th>Item Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr><tr><td>1</td><td>Basmati Rice 1kg</td><td>5</td><td>80.00</td><td>400.00</td></tr><tr><td>2</td><td>Sunflower Oil 1L</td><td>3</td><td>150.00</td><td>450.00</td></tr></table>
        <div class="invoice-total"><span>Subtotal</span><b>₹ 850.00</b><span>Tax</span><b>₹ 42.50</b><span>Total Amount</span><b>₹ 892.50</b></div>
        <div class="invoice-terms-preview"><strong>Terms & Conditions</strong><ol><li>Goods once sold will not be taken back or exchanged.</li><li>Payment must be made within the agreed due date.</li></ol></div>
      </div>
    </div>`;
  }

  document.addEventListener('click', e=>{
    const tab=e.target.closest('[data-invoice-tab]');
    if(tab){
      document.querySelectorAll('[data-invoice-tab]').forEach(b=>b.classList.toggle('active',b===tab));
      const c=document.getElementById('invoiceTabContent');
      if(!c) return;
      const views={
        general:invoiceGeneralHTML,
        numbering:invoiceNumberingHTML(),
        taxes:invoiceTaxesHTML(),
        template:invoiceTemplateHTML(),
        terms:invoiceTermsHTML(),
        additional:invoiceAdditionalHTML()
      };
      c.innerHTML=views[tab.dataset.invoiceTab] || invoiceGeneralHTML;
    }
  });

  function simpleFormModal(title, body, saveLabel){
    modal(`<div class="ui-modal-header"><h3>${title}</h3><button class="ui-close" data-close-modal>&times;</button></div><div class="ui-modal-body">${body}</div><div class="ui-modal-footer"><button class="ui-btn" data-close-modal><i class="fa-solid fa-xmark"></i> Cancel</button><button class="ui-btn ui-btn-primary" data-save-modal><i class="fa-regular fa-floppy-disk"></i> ${saveLabel}</button></div>`,true);
  }

  function addInvoiceTypeModal(){ simpleFormModal('Add New Invoice Type',`
    <div class="ui-card-title" style="padding-left:0;border:0"><i class="fa-regular fa-clipboard"></i> Invoice Type Information</div>
    <div class="modal-form-grid"><div class="ui-field"><label>Invoice Type Name <span class="req">*</span></label><input class="ui-input" placeholder="Enter invoice type name"></div><div class="ui-field"><label>Prefix <span class="req">*</span></label><input class="ui-input" placeholder="INV"></div><div class="ui-field"><label>Suffix</label><input class="ui-input" placeholder="TI"></div><div class="ui-field"><label>Sequence Length <span class="req">*</span></label><select class="ui-select"><option>5</option></select></div><div class="ui-field"><label>Start Sequence From <span class="req">*</span></label><input class="ui-input" value="00001"></div><div class="ui-field"><label>Reset Sequence <span class="req">*</span></label><select class="ui-select"><option>Yearly</option></select></div></div>`, 'Save Invoice Type');}
  function addInvoiceTaxModal(){ simpleFormModal('Add Tax Rate',`<div class="modal-form-grid"><div class="ui-field"><label>Tax Name <span class="req">*</span></label><input class="ui-input" placeholder="CGST"></div><div class="ui-field"><label>Tax Type <span class="req">*</span></label><select class="ui-select"><option>Central Tax</option></select></div><div class="ui-field"><label>Rate (%) <span class="req">*</span></label><input class="ui-input" placeholder="2.50"></div><div class="ui-field"><label>HSN/SAC Applicability</label><select class="ui-select"><option>Yes</option></select></div><div class="ui-field"><label>Apply On</label><select class="ui-select"><option>Taxable Amount</option></select></div><div class="ui-field"><label>Calculation Type</label><select class="ui-select"><option>Percentage (%)</option></select></div></div>`, 'Save Tax Rate');}
  function addChargeModal(){ simpleFormModal('Add New Charge',`<div class="modal-form-grid"><div class="ui-field"><label>Charge Name <span class="req">*</span></label><input class="ui-input" placeholder="Packing Charges"></div><div class="ui-field"><label>Charge Type <span class="req">*</span></label><select class="ui-select"><option>Fixed Amount</option></select></div><div class="ui-field"><label>Calculation Type <span class="req">*</span></label><select class="ui-select"><option>Fixed</option></select></div><div class="ui-field"><label>Charge Amount / Value <span class="req">*</span></label><input class="ui-input" placeholder="20.00"></div><div class="ui-field"><label>Taxable <span class="req">*</span></label><select class="ui-select"><option>Yes</option></select></div><div class="ui-field"><label>Priority</label><input class="ui-input" value="1"></div></div>`, 'Save Charge');}
  function addCurrencyModal(){ simpleFormModal('Add Currency',`<div class="modal-form-grid"><div class="ui-field"><label>Currency Name <span class="req">*</span></label><input class="ui-input" placeholder="US Dollar"></div><div class="ui-field"><label>Currency Code <span class="req">*</span></label><input class="ui-input" placeholder="USD"></div><div class="ui-field"><label>Currency Symbol <span class="req">*</span></label><input class="ui-input" placeholder="$"></div><div class="ui-field"><label>Currency Position <span class="req">*</span></label><select class="ui-select"><option>Before Amount</option></select></div><div class="ui-field"><label>Decimal Places</label><select class="ui-select"><option>2</option></select></div><div class="ui-field"><label>Exchange Rate</label><input class="ui-input" value="0.0000"></div></div>`, 'Save Currency');}
  function editPriorityModal(){ simpleFormModal('Edit Tax Priority',`<div class="modal-form-grid"><div class="ui-field"><label>Priority <span class="req">*</span></label><input class="ui-input" value="1"></div><div class="ui-field"><label>Tax Name <span class="req">*</span></label><select class="ui-select"><option>CGST</option></select></div><div class="ui-field"><label>Tax Type <span class="req">*</span></label><select class="ui-select"><option>Central Tax</option></select></div><div class="ui-field"><label>Apply On <span class="req">*</span></label><select class="ui-select"><option>Taxable Amount</option></select></div><div class="ui-field"><label>Tax Rate (%) <span class="req">*</span></label><input class="ui-input" value="2.50"></div><div class="ui-field"><label>Status</label><select class="ui-select"><option>Active</option></select></div></div>`, 'Update Tax Priority');}

  document.addEventListener('click', e=>{
    const a=e.target.closest('[data-action]');
    if(!a) return;
    const action=a.dataset.action;
    if(action==='year-actions') yearActions(a.dataset.year);
    else if(action==='add-tax') addTaxModal();
    else if(action==='add-bank') addBankModal();
    else if(action==='add-invoice-type') addInvoiceTypeModal();
    else if(action==='add-invoice-tax') addInvoiceTaxModal();
    else if(action==='add-charge') addChargeModal();
    else if(action==='add-currency') addCurrencyModal();
    else if(action==='edit-priority') editPriorityModal();
    else if(action==='change-logo') document.getElementById('companyLogoInput')?.click();
    else if(action==='change-invoice-logo') document.getElementById('invoiceLogoInput')?.click();
    else if(action==='save') showToast('Changes saved successfully.');
    else if(action==='reset') showToast('Form reset.');
    else if(action==='print') window.print();
    else if(action==='generate-report') showToast('Report generated successfully.');
    else if(action==='download-report') showToast('Report download started.');
    else showToast(`${action.replaceAll('-',' ')} selected.`);
  });

  modalRoot.addEventListener('click',e=>{
    const a=e.target.closest('[data-modal-action]');
    if(!a) return;
    const x=a.dataset.modalAction;
    if(x==='view') location.href='financial-year-details.html';
    if(x==='edit') location.href='financial-year-edit.html';
    if(x==='report') location.href='financial-year-report.html';
    if(x==='close-year') closeYearModal();
    if(x==='delete') deleteYearModal();
  });
  modalRoot.addEventListener('click',e=>{
    if(e.target.closest('[data-save-modal]')){showToast('Saved successfully.');closeModal();}
    if(e.target.id==='confirmClose'){
      if(document.getElementById('closeConfirm')?.value.trim().toUpperCase()==='CLOSE'){showToast('Financial year closed successfully.');closeModal();}
      else showToast('Type CLOSE to confirm.');
    }
    if(e.target.id==='confirmDelete'){
      if(document.getElementById('deleteConfirm')?.value.trim().toUpperCase()==='DELETE'){showToast('Financial year deleted successfully.');closeModal();}
      else showToast('Type DELETE to confirm.');
    }
  });
})();
