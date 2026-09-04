(() => {
  const mount = document.getElementById('sidebarMount');
  if (!mount) return;

  // Centralized route registry. Keep every reusable sidebar link in one place so
  // inner pages can reuse the same component without hard-coded relative paths.
  const MODULE_ROUTES = {
    dashboard: 'index.html',
    company: {
      'Company Profile':'company-profile.html',
      'Financial Year':'financial-year.html',
      'Business Settings':'business-settings.html',
      'GST Settings':'gst-settings.html',
      'Invoice Settings':'invoice-settings.html',
      'Tax Configuration':'tax-configuration.html',
      'Currency Settings':'currency-settings.html',
      'Backup Settings':'backup-settings.html'
    },
    branch: {
      'Branch Master':'branch-master.html',
      'Branch Configuration':'branch-configuration.html',
      'Branch Targets':'branch-targets.html',
      'Branch Performance':'branch-performance.html',
      'Branch Expenses':'branch-expenses.html',
      'Branch Status':'branch-status.html',
      'Branch Dashboard':'branch-dashboard.html'
    },
    warehouse: {
      'Warehouse Overview':'warehouse-overview.html',
      'Warehouse Master':'warehouse-master.html',
      'Stock by Warehouse':'stock-by-warehouse.html',
      'Stock Transfers':'stock-transfers.html',
      'Rack & Bin Management':'rack-bin-management.html'
    },
    product: {
      'Categories':'categories.html',
      'Sub Categories':'sub-categories.html',
      'Brands':'brands.html',
      'Products':'products.html',
      'Product Variants':'product-variants.html',
      'Units':'units.html',
      'Barcode Management':'barcode-management.html',
      'Batch Management':'batch-management.html'
    }
  };

  const moduleFolder = {
    company: 'company-management',
    branch: 'branch-management',
    warehouse: 'warehouse-management',
    product: 'product-management'
  };

  const currentModuleKey = () => {
    const p = location.pathname;
    if (p.includes('/company-management/')) return 'company';
    if (p.includes('/branch-management/')) return 'branch';
    if (p.includes('/warehouse-management/')) return 'warehouse';
    if (p.includes('/product-management/')) return 'product';
    return 'dashboard';
  };

  const navigateToModuleFile = (moduleKey, fileName) => {
    const current = currentModuleKey();
    if (moduleKey === 'dashboard') {
      location.href = current === 'dashboard' ? 'index.html' : '../index.html';
      return;
    }
    const folder = moduleFolder[moduleKey];
    if (!folder || !fileName) return;
    location.href = current === moduleKey ? fileName : `${current === 'dashboard' ? '' : '../'}${folder}/${fileName}`;
  };

  const groups = [
    ['dashboard','fa-house','Dashboard',false],
    ['company','fa-building','Company Management',true],
    ['branch','fa-shop','Branch Management',true],
    ['warehouse','fa-warehouse','Warehouse Management',true],
    ['product','fa-boxes-stacked','Product Management',true],
    ['supplier','fa-cubes-stacked','Supplier Management',true],
    ['purchase','fa-cart-shopping','Purchase Management',true],
    ['inventory','fa-box-archive','Inventory Management',true],
    ['sales','fa-cash-register','Sales & Billing',true],
    ['customer','fa-user','Customer Management',true],
    ['employee','fa-user-tie','Employee Management',true],
    ['finance','fa-file-invoice-dollar','Accounting & Finance',true],
    ['reports','fa-chart-pie','Reports & Analytics',true],
    ['settings','fa-gear','System Settings',true],
  ];

  const submenuMap = {
    company:['Company Profile','Financial Year','Business Settings','GST Settings','Invoice Settings','Tax Configuration','Currency Settings','Backup Settings'],
    branch:['Branch Master','Branch Configuration','Branch Targets','Branch Performance','Branch Expenses','Branch Status','Branch Dashboard'],
    warehouse:['Warehouse Overview','Warehouse Master','Stock by Warehouse','Stock Transfers','Rack & Bin Management'],
    product:['Categories','Sub Categories','Brands','Products','Product Variants','Units','Barcode Management','Batch Management'],
    supplier:['Supplier Master','Supplier Ledger','Supplier Performance'],
    purchase:['Purchase Orders','GRN','Purchase Returns','Supplier Payments'],
    inventory:['Stock Register','Stock Transfers','Stock Adjustments','Stock Count','Expiry Management','Reorder Management','Batch Tracking','Damage / Wastage'],
    sales:['POS Billing','Sales Orders','Sales Returns','Credit Sales','Pending Bills','Day Close','Counterwise Sales','Payment Collection'],
    customer:['Customer Master','Loyalty Program','Customer Groups','Customer Feedback','Customer Offers'],
    employee:['Employee Master','Roles & Permissions','Attendance','Shift Management','Payroll Integration'],
    finance:['Income','Expenses','Bank Accounts','Journals','Contra Entries','Tax','Reports'],
    reports:['Sales Reports','Purchase Reports','Inventory Reports','Profit & Loss','GST Reports','Branch Performance','Product Performance','Customer Reports','Employee Reports'],
    settings:['General Settings','Notification Settings','User Management','Audit Logs','Backup & Restore']
  };

  mount.className = 'app-sidebar';
  mount.innerHTML = `
    <div class="sidebar-brand">
      <img src="${(location.pathname.includes('/company-management/') || location.pathname.includes('/branch-management/') || location.pathname.includes('/warehouse-management/') || location.pathname.includes('/product-management/')) ? '../assets/images/logo-zmart.png' : 'assets/images/logo-zmart.png'}" alt="ZMart" />
    </div>
    <nav class="sidebar-nav">
      ${groups.map(([key,icon,label,expandable]) => `
        <div class="nav-group" data-group="${key}">
          <button class="nav-item" type="button" data-nav="${key}" aria-expanded="false">
            <span class="nav-icon"><i class="fa-solid ${icon}"></i></span>
            <span class="nav-label">${label}</span>
            ${expandable ? '<i class="fa-solid fa-chevron-down nav-chevron"></i>' : ''}
          </button>
          ${expandable ? `<div class="submenu">${(submenuMap[key]||[]).map(item=>`<button type="button" data-subnav="${item}">${item}</button>`).join('')}</div>` : ''}
        </div>`).join('')}
    </nav>
    <div class="sidebar-bottom">
      <button class="sidebar-support" type="button" data-nav="support"><i class="fa-solid fa-headset"></i><span>Support</span></button>
      <div class="sidebar-footer"><strong>© 2025 ZMart Supermarket.</strong><span>All rights reserved.</span></div>
    </div>`;

  const sidebar = mount;

  // Set the correct active sidebar group/subnav from the current page URL.
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const routeToSubnav = {
    'company-profile.html':'Company Profile',
    'financial-year.html':'Financial Year',
    'financial-year-details.html':'Financial Year',
    'financial-year-edit.html':'Financial Year',
    'financial-year-report.html':'Financial Year',
    'business-settings.html':'Business Settings',
    'gst-settings.html':'GST Settings',
    'invoice-settings.html':'Invoice Settings',
    'tax-configuration.html':'Tax Configuration',
    'currency-settings.html':'Currency Settings',
    'backup-settings.html':'Backup Settings',
    'branch-master.html':'Branch Master',
    'add-branch.html':'Branch Master',
    'edit-branch.html':'Branch Master',
    'branch-configuration.html':'Branch Configuration',
    'branch-targets.html':'Branch Targets',
    'branch-performance.html':'Branch Performance',
    'branch-expenses.html':'Branch Expenses',
    'branch-status.html':'Branch Status',
    'branch-dashboard.html':'Branch Dashboard',
    'warehouse-overview.html':'Warehouse Overview',
    'overview-list.html':'Warehouse Overview',
    'warehouse-master.html':'Warehouse Master',
    'add-warehouse.html':'Warehouse Master',
    'stock-by-warehouse.html':'Stock by Warehouse',
    'stock-transfers.html':'Stock Transfers',
    'new-stock-transfer.html':'Stock Transfers',
    'rack-bin-management.html':'Rack & Bin Management',
    'add-rack-bin.html':'Rack & Bin Management',
    'categories.html':'Categories',
    'add-category.html':'Categories',
    'category-success.html':'Categories',
    'sub-categories.html':'Sub Categories',
    'add-sub-category.html':'Sub Categories',
    'brands.html':'Brands',
    'add-brand.html':'Brands',
    'products.html':'Products',
    'add-product.html':'Products',
    'product-variants.html':'Product Variants',
    'add-product-variant.html':'Product Variants',
    'units.html':'Units',
    'add-unit.html':'Units',
    'barcode-management.html':'Barcode Management',
    'add-new-barcode.html':'Barcode Management'
  };

  const activeGroupKey = currentModuleKey();
  const activeGroup = sidebar.querySelector(`[data-group="${activeGroupKey}"]`);
  activeGroup?.classList.add('active');
  if (activeGroupKey !== 'dashboard') {
    activeGroup?.classList.add('open');
    activeGroup?.querySelector('.nav-item')?.setAttribute('aria-expanded','true');
    const activeLabel = routeToSubnav[currentFile];
    if (activeLabel) {
      activeGroup?.querySelectorAll('[data-subnav]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subnav === activeLabel);
      });
    }
  }

  // Reusable responsive sidebar overlay.
  let mobileOverlay = document.querySelector('.sidebar-overlay');
  if (!mobileOverlay) {
    mobileOverlay = document.createElement('button');
    mobileOverlay.type = 'button';
    mobileOverlay.className = 'sidebar-overlay';
    mobileOverlay.setAttribute('aria-label', 'Close navigation menu');
    document.body.appendChild(mobileOverlay);
  }

  const closeMobileSidebar = () => {
    document.body.classList.remove('sidebar-mobile-open');
    document.getElementById('sidebarToggle')?.setAttribute('aria-expanded', 'false');
  };

  mobileOverlay.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeMobileSidebar();
  });

  sidebar.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    const sub = e.target.closest('[data-subnav]');
    if (sub) {
      const label = sub.dataset.subnav;
      const groupKey = sub.closest('.nav-group')?.dataset.group;
      const route = MODULE_ROUTES[groupKey]?.[label];
      if (route) {
        navigateToModuleFile(groupKey, route);
      } else {
        // Modules that are not yet implemented still emit a reusable navigation
        // event instead of sending the browser to a broken URL.
        window.dispatchEvent(new CustomEvent('zmart:navigate', {detail:{label, module:groupKey}}));
      }
      if (window.innerWidth <= 900) closeMobileSidebar();
      return;
    }
    if (!nav) return;
    const key = nav.dataset.nav;
    if (key === 'dashboard') {
      if (currentModuleKey() !== 'dashboard') {
        navigateToModuleFile('dashboard', MODULE_ROUTES.dashboard);
      } else {
        document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('active'));
        nav.closest('.nav-group')?.classList.add('active');
        document.getElementById('mainContent')?.scrollTo({top:0, behavior:'smooth'});
      }
      if (window.innerWidth <= 900) closeMobileSidebar();
      return;
    }
    if (key === 'support') {
      window.dispatchEvent(new CustomEvent('zmart:action', {detail:{message:'Support action selected.'}}));
      if (window.innerWidth <= 900) closeMobileSidebar();
      return;
    }
    const group = nav.closest('.nav-group');
    if (!group) return;
    const isOpen = group.classList.contains('open');
    document.querySelectorAll('.nav-group.open').forEach(g => {
      if (g !== group) {
        g.classList.remove('open');
        g.querySelector('.nav-item')?.setAttribute('aria-expanded','false');
      }
    });
    group.classList.toggle('open', !isOpen);
    nav.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('sidebar-mobile-open')) {
      closeMobileSidebar();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMobileSidebar();
  });

  window.ZMartSidebar = {
    toggle() { document.body.classList.toggle('sidebar-collapsed'); },
    closeMobile: closeMobileSidebar
  };
})();
