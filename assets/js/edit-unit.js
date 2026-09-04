(() => {
  const $ = id => document.getElementById(id);
  const modal = $('successModal');
  const toast = $('unitToast');
  const name = $('unitName'), code = $('unitCode'), type = $('unitType'), base = $('baseUnit');
  const factor = $('conversionFactor'), precision = $('roundingPrecision'), equivalent = $('baseEquivalent');

  // Keep shared navigation markup untouched; only set the active state/title for this page.
  requestAnimationFrame(() => {
    const title = document.querySelector('.topbar-title');
    if (title) title.textContent = 'Edit Unit';
    document.querySelectorAll('[data-subnav]').forEach(btn => btn.classList.toggle('active', btn.dataset.subnav === 'Units'));
    const productGroup = document.querySelector('.nav-group[data-group="product"]');
    productGroup?.classList.add('active','open');
    productGroup?.querySelector('[data-nav="product"]')?.setAttribute('aria-expanded','true');
  });

  // Load the unit selected from the Units list when available.
  const selected = (() => {
    try { return JSON.parse(sessionStorage.getItem('zmart:selectedUnit') || 'null'); } catch { return null; }
  })();
  if (selected) {
    name.value = selected.name || 'Kilogram';
    code.value = selected.code || 'KG';
    type.value = selected.type || 'Weight';
    base.value = selected.base || 'Yes';
    const status = document.querySelector(`input[name="unitStatus"][value="${selected.status === 'Inactive' ? 'Inactive' : 'Active'}"]`);
    if (status) status.checked = true;
  }

  const count = (input, output) => {
    output.textContent = input.value.length;
    input.addEventListener('input', () => output.textContent = input.value.length);
  };
  count($('unitDescription'), $('descCount'));
  count($('remarks'), $('remarksCount'));

  function updateEquivalent(){
    const v = Number(factor.value), p = Math.max(0, Math.min(6, Number(precision.value || 2)));
    equivalent.value = Number.isFinite(v) && v > 0 ? (1 / v).toFixed(p) : '--';
  }
  factor.addEventListener('input', updateEquivalent);
  precision.addEventListener('input', updateEquivalent);
  updateEquivalent();

  function showToast(message, success=false){
    toast.textContent = message;
    toast.classList.toggle('success', success);
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.hidden = true, 2200);
  }

  function valid(){
    const required = [[name,'Unit Name'],[code,'Unit Code'],[type,'Unit Type'],[base,'Base Unit'],[factor,'Conversion Factor']];
    const missing = required.find(([el]) => !String(el.value).trim());
    if (missing) { missing[0].focus(); showToast(`${missing[1]} is required`); return false; }
    if (Number(factor.value) <= 0) { factor.focus(); showToast('Conversion Factor must be greater than 0'); return false; }
    return true;
  }

  function fillSuccess(){
    $('savedName').textContent = name.value.trim();
    $('savedCode').textContent = code.value.trim().toUpperCase();
    $('savedType').textContent = type.value;
    $('savedBase').textContent = base.value;
    $('savedFactor').textContent = factor.value;
    $('savedPrecision').textContent = precision.value || '2';
    $('savedStatus').textContent = document.querySelector('input[name="unitStatus"]:checked')?.value || 'Active';
  }

  $('updateUnit').addEventListener('click', () => {
    if (!valid()) return;
    fillSuccess();
    const payload = {
      ...(selected || {}), name:name.value.trim(), code:code.value.trim().toUpperCase(), type:type.value,
      base:base.value, status:document.querySelector('input[name="unitStatus"]:checked')?.value || 'Active',
      symbol:$('unitSymbol').value.trim(), description:$('unitDescription').value.trim(), conversionFactor:factor.value,
      roundingPrecision:precision.value, displayOrder:$('displayOrder').value, remarks:$('remarks').value.trim(),
      trackInventory:$('trackInventory').checked
    };
    sessionStorage.setItem('zmart:selectedUnit', JSON.stringify(payload));
    modal.hidden = false;
  });

  const goUnits = () => location.href = 'units.html';
  const goDetails = () => location.href = `unit-details.html${selected?.id ? `?id=${selected.id}` : ''}`;
  $('cancelUnit').addEventListener('click', goDetails);
  $('backToUnits').addEventListener('click', goUnits);
  $('viewUnitDetails').addEventListener('click', goDetails);
  $('closeSuccess').addEventListener('click', () => modal.hidden = true);
  modal.querySelector('.au-backdrop').addEventListener('click', () => modal.hidden = true);
  document.querySelector('[data-go="home"]')?.addEventListener('click', () => location.href='../index.html');
  document.querySelector('[data-go="product"]')?.addEventListener('click', () => location.href='products.html');
  document.querySelector('[data-go="units"]')?.addEventListener('click', goUnits);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) modal.hidden = true; });
})();
