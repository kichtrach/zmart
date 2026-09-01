(() => {
  const mount = document.getElementById('sidebarMount');
  if (!mount) return;

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
      <img src="${(location.pathname.includes('/company-management/') || location.pathname.includes('/branch-management/') || location.pathname.includes('/warehouse-management/')) ? '../assets/images/logo-zmart.png' : 'assets/images/logo-zmart.png'}" alt="ZMart" />
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
    'warehouse-master.html':'Warehouse Master',
    'add-warehouse.html':'Warehouse Master',
    'stock-by-warehouse.html':'Stock by Warehouse',
    'stock-transfers.html':'Stock Transfers',
    'new-stock-transfer.html':'Stock Transfers',
    'rack-bin-management.html':'Rack & Bin Management'
  };

  const isCompanyPage = location.pathname.includes('/company-management/');
  const isBranchPage = location.pathname.includes('/branch-management/');
  const isWarehousePage = location.pathname.includes('/warehouse-management/');
  const activeGroupKey = isCompanyPage ? 'company' : isBranchPage ? 'branch' : isWarehousePage ? 'warehouse' : 'dashboard';
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
      const inCompany = location.pathname.includes('/company-management/');
      const inBranch = location.pathname.includes('/branch-management/');
      const inWarehouse = location.pathname.includes('/warehouse-management/');
      const companyRoutes = {
        'Company Profile':'company-profile.html',
        'Financial Year':'financial-year.html',
        'Business Settings':'business-settings.html',
        'GST Settings':'gst-settings.html',
        'Invoice Settings':'invoice-settings.html',
        'Tax Configuration':'tax-configuration.html',
        'Currency Settings':'currency-settings.html',
        'Backup Settings':'backup-settings.html'
      };
      const warehouseRoutes = {
        'Warehouse Overview':'warehouse-overview.html',
        'Warehouse Master':'warehouse-master.html',
        'Stock by Warehouse':'stock-by-warehouse.html',
        'Stock Transfers':'stock-transfers.html',
        'Rack & Bin Management':'rack-bin-management.html'
      };
      const branchRoutes = {
        'Branch Master':'branch-master.html',
        'Branch Configuration':'branch-configuration.html',
        'Branch Targets':'branch-targets.html',
        'Branch Performance':'branch-performance.html',
        'Branch Expenses':'branch-expenses.html',
        'Branch Status':'branch-status.html',
        'Branch Dashboard':'branch-dashboard.html'
      };
      if (companyRoutes[label]) {
        location.href = inCompany ? companyRoutes[label] : `company-management/${companyRoutes[label]}`;
      } else if (branchRoutes[label]) {
        location.href = inBranch ? branchRoutes[label] : `branch-management/${branchRoutes[label]}`;
      } else if (warehouseRoutes[label]) {
        location.href = inWarehouse ? warehouseRoutes[label] : `warehouse-management/${warehouseRoutes[label]}`;
      } else {
        window.dispatchEvent(new CustomEvent('zmart:navigate', {detail:{label}}));
      }
      if (window.innerWidth <= 900) closeMobileSidebar();
      return;
    }
    if (!nav) return;
    const key = nav.dataset.nav;
    if (key === 'dashboard') {
      if (location.pathname.includes('/company-management/') || location.pathname.includes('/branch-management/') || location.pathname.includes('/warehouse-management/')) {
        location.href = '../index.html';
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
