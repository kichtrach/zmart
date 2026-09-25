(() => {
  // Keep the shared sidebar/topbar components unchanged while applying the page-specific state.
  requestAnimationFrame(() => {
    const title = document.querySelector('.topbar-title');
    if (title) title.textContent = 'Unit Details';
    document.querySelectorAll('[data-subnav]').forEach(btn => btn.classList.toggle('active', btn.dataset.subnav === 'Units'));
    const productGroup = document.querySelector('.nav-group[data-group="product"]');
    productGroup?.classList.add('active','open');
    productGroup?.querySelector('[data-nav="product"]')?.setAttribute('aria-expanded','true');
  });

  const goUnits = () => { location.href = 'units.html'; };
  document.getElementById('backToUnits')?.addEventListener('click', goUnits);
  document.querySelector('[data-go="units"]')?.addEventListener('click', goUnits);
  document.querySelector('[data-go="product"]')?.addEventListener('click', () => location.href='products.html');
  document.querySelector('[data-go="home"]')?.addEventListener('click', () => location.href='../index.html');
  document.getElementById('editUnit')?.addEventListener('click', () => location.href='edit-unit.html?unit=KG');

  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === tab.dataset.tab));
  }));
})();
