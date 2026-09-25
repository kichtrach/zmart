(() => {
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  window.addEventListener('zmart:action', e => showToast(e.detail?.message || 'Action selected.'));
  window.addEventListener('zmart:navigate', e => showToast(`${e.detail?.label || 'Page'} selected. Connect this link to the matching inner page.`));

  const dateBtn = document.getElementById('dateRangeBtn');
  const datePopover = document.getElementById('datePopover');
  const calendarGrid = document.getElementById('calendarGrid');
  const monthLabel = document.getElementById('calendarMonthLabel');
  const fromLabel = document.getElementById('calendarFrom');
  const toLabel = document.getElementById('calendarTo');
  const prevBtn = document.getElementById('calendarPrev');
  const nextBtn = document.getElementById('calendarNext');
  const clearBtn = document.getElementById('calendarClear');
  const applyBtn = document.getElementById('calendarApply');

  let viewDate = new Date(2025, 4, 1);
  let appliedStart = new Date(2025, 4, 1);
  let appliedEnd = new Date(2025, 4, 31);
  let draftStart = new Date(appliedStart);
  let draftEnd = new Date(appliedEnd);
  let selectingEnd = false;

  const pad = n => String(n).padStart(2, '0');
  const cloneDate = d => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
  const dayStamp = d => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : null;
  const sameDay = (a, b) => !!a && !!b && dayStamp(a) === dayStamp(b);
  const formatDate = d => d
    ? `${pad(d.getDate())} ${d.toLocaleString('en-GB', {month:'short'})} ${d.getFullYear()}`
    : 'Select date';

  function syncSummary(){
    if (fromLabel) fromLabel.textContent = formatDate(draftStart);
    if (toLabel) toLabel.textContent = formatDate(draftEnd);
  }

  function renderCalendar(){
    if (!calendarGrid || !monthLabel) return;

    calendarGrid.innerHTML = '';
    monthLabel.textContent = viewDate.toLocaleString('en-GB', {month:'long', year:'numeric'});

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

    for (let i = 0; i < 42; i++) {
      const current = new Date(gridStart);
      current.setDate(gridStart.getDate() + i);

      const day = document.createElement('button');
      day.type = 'button';
      day.className = 'calendar-day';
      day.textContent = current.getDate();
      day.dataset.date = `${current.getFullYear()}-${pad(current.getMonth()+1)}-${pad(current.getDate())}`;
      day.setAttribute('aria-label', formatDate(current));

      if (current.getMonth() !== month) day.classList.add('outside');

      const stamp = dayStamp(current);
      const startStamp = dayStamp(draftStart);
      const endStamp = dayStamp(draftEnd);

      if (startStamp !== null && endStamp !== null && stamp >= startStamp && stamp <= endStamp) {
        day.classList.add('in-range');
      }
      if (sameDay(current, draftStart)) day.classList.add('range-start');
      if (sameDay(current, draftEnd)) day.classList.add('range-end');

      calendarGrid.appendChild(day);
    }

    syncSummary();
  }

  function openCalendar(){
    if (!datePopover || !dateBtn) return;
    draftStart = cloneDate(appliedStart);
    draftEnd = cloneDate(appliedEnd);
    selectingEnd = false;
    viewDate = cloneDate(appliedStart) || new Date();
    viewDate.setDate(1);
    renderCalendar();
    datePopover.hidden = false;
    dateBtn.setAttribute('aria-expanded', 'true');
  }

  function closeCalendar(){
    if (!datePopover || !dateBtn) return;
    datePopover.hidden = true;
    dateBtn.setAttribute('aria-expanded', 'false');
    selectingEnd = false;
  }

  dateBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (datePopover?.hidden) openCalendar();
    else closeCalendar();
  });

  datePopover?.addEventListener('click', event => {
    event.stopPropagation();
  });

  calendarGrid?.addEventListener('click', event => {
    event.preventDefault();
    const day = event.target.closest('.calendar-day');
    if (!day) return;

    const [year, month, dayNumber] = day.dataset.date.split('-').map(Number);
    const picked = new Date(year, month - 1, dayNumber);

    if (!selectingEnd) {
      draftStart = picked;
      draftEnd = null;
      selectingEnd = true;
    } else {
      if (dayStamp(picked) < dayStamp(draftStart)) {
        draftEnd = cloneDate(draftStart);
        draftStart = picked;
      } else {
        draftEnd = picked;
      }
      selectingEnd = false;
    }

    if (picked.getMonth() !== viewDate.getMonth() || picked.getFullYear() !== viewDate.getFullYear()) {
      viewDate = new Date(picked.getFullYear(), picked.getMonth(), 1);
    }

    renderCalendar();
  });

  prevBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  clearBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    draftStart = null;
    draftEnd = null;
    selectingEnd = false;
    renderCalendar();
  });

  applyBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    if (!draftStart) {
      showToast('Select a start date.');
      return;
    }

    if (!draftEnd) draftEnd = cloneDate(draftStart);

    appliedStart = cloneDate(draftStart);
    appliedEnd = cloneDate(draftEnd);

    const rangeText = `${formatDate(appliedStart)} - ${formatDate(appliedEnd)}`;
    const label = dateBtn?.querySelector('.date-range-label');
    if (label) label.textContent = rangeText;

    closeCalendar();
    showToast(`Date range changed to ${rangeText}.`);
  });

  document.addEventListener('click', event => {
    if (!datePopover || datePopover.hidden) return;
    if (!event.target.closest('.date-picker-wrap')) closeCalendar();
  });

  document.getElementById('branchFilter')?.addEventListener('change', e => showToast(`Dashboard filtered by ${e.target.value}.`));
  document.getElementById('refreshBtn')?.addEventListener('click', e => {
    const icon = e.currentTarget.querySelector('i');
    icon?.classList.add('fa-spin');
    setTimeout(()=>icon?.classList.remove('fa-spin'),700);
    showToast('Dashboard data refreshed.');
  });
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const csv = [
      ['Metric','Value'],['Total Sales','124560890'],['Branch-wise Sales','113220450'],['Profit & Loss','14580440'],['Purchase Summary','78540230'],['Inventory Summary','92530540']
    ].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');a.href=url;a.download='zmart-super-admin-dashboard.csv';a.click();URL.revokeObjectURL(url);
    showToast('Dashboard export downloaded.');
  });

  const actionMessages = {
    'branch-performance':'Branch Performance selected.',
    'view-alerts':'Alerts & Notifications selected.',
    'purchase-report':'Purchase Report selected.',
    'inventory-report':'Inventory Report selected.',
    'live-billing':'Live Billing selected.',
    'add-branch':'Add Branch action selected.',
    'add-product':'Add Product action selected.',
    'new-purchase':'New Purchase Order action selected.',
    'stock-transfer':'Stock Transfer action selected.',
    'create-offer':'Create Offer action selected.',
    'add-employee':'Add Employee action selected.',
    'customer-registration':'Customer Registration action selected.',
    'backup':'Backup started successfully.'
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    showToast(actionMessages[el.dataset.action] || 'Action selected.');
  });
})();
