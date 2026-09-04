(() => {
  const $ = id => document.getElementById(id);
  const name = $('unitName'), code = $('unitCode'), type = $('unitType'), base = $('baseUnit');
  const factor = $('conversionFactor'), equivalent = $('baseEquivalent');
  const modal = $('successModal'), toast = $('unitToast');

  function counter(input, target){
    input.addEventListener('input',()=>target.textContent=input.value.length);
  }
  counter($('unitDescription'), $('descCount'));
  counter($('remarks'), $('remarksCount'));

  function updateEquivalent(){
    const v = Number(factor.value);
    equivalent.value = Number.isFinite(v) && v > 0 ? (1 / v).toFixed(Number($('roundingPrecision').value || 2)) : '--';
  }
  factor.addEventListener('input',updateEquivalent);
  $('roundingPrecision').addEventListener('input',updateEquivalent);

  function showToast(message){
    toast.textContent = message; toast.hidden = false;
    clearTimeout(showToast.t); showToast.t = setTimeout(()=>toast.hidden=true,2200);
  }

  function valid(){
    const required = [[name,'Unit Name'],[code,'Unit Code'],[type,'Unit Type'],[base,'Base Unit'],[factor,'Conversion Factor']];
    const missing = required.find(([el])=>!String(el.value).trim());
    if(missing){missing[0].focus(); showToast(`${missing[1]} is required`); return false;}
    return true;
  }

  $('saveUnit').addEventListener('click',()=>{
    if(!valid()) return;
    $('savedName').textContent = name.value.trim();
    $('savedCode').textContent = code.value.trim().toUpperCase();
    $('savedType').textContent = type.value;
    $('savedBase').textContent = base.value;
    $('savedStatus').textContent = document.querySelector('input[name="unitStatus"]:checked')?.value || 'Active';
    modal.hidden = false;
  });

  const goUnits = () => location.href = 'units.html';
  $('cancelUnit').addEventListener('click',goUnits);
  $('viewUnits').addEventListener('click',goUnits);
  $('closeSuccess').addEventListener('click',()=>modal.hidden=true);
  modal.querySelector('.au-backdrop').addEventListener('click',()=>modal.hidden=true);
  $('addAnotherUnit').addEventListener('click',()=>{
    document.querySelectorAll('.au-card input:not([readonly]), .au-card textarea').forEach(el=>{if(el.type==='radio'||el.type==='checkbox')return;el.value='';});
    type.value=''; base.value=''; $('roundingPrecision').value='2'; $('displayOrder').value='0'; $('trackInventory').checked=true;
    const active=document.querySelector('input[name="unitStatus"][value="Active"]'); if(active) active.checked=true;
    $('descCount').textContent='0'; $('remarksCount').textContent='0'; equivalent.value='--'; modal.hidden=true; name.focus();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)modal.hidden=true;});
})();
