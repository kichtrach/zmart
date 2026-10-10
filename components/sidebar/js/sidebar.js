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
      'Brands':'brands.html',
      'Products':'products.html',
      'Product Variants':'product-variants.html',
      'Units':'units.html'
    },
    itemmaster: {'Item Master':'item-master.html'},
    admin: {'Product Master Configuration':'product-master-configuration.html', 'Barcode Management':'../product-management/barcode-management.html', 'Batch Management':'../product-management/batch-management.html'},
    supplier: {
      'Supplier List':'supplier-management.html',
      'Add New Supplier':'add-new-supplier.html',
      'Supplier Categories':'supplier-categories.html',
      'Supplier Contacts':'supplier-contacts.html'
    },
    purchase: {
      'Purchase Orders':'purchase-orders.html',
      'Goods Receipt (GRN)':'goods-receipt.html',
      'Purchase Returns':'purchase-returns.html',
      'Purchase Invoices':'purchase-invoices.html',
      'Supplier Payments':'supplier-payments.html',
      'Purchase Reports':'purchase-reports.html'
    },
    inventory: {'Stock Register':'stock-register.html','Stock Transfers':'stock-transfers.html','Stock Adjustments':'stock-adjustment.html','Stock Count':'stock-count.html','Expiry Management':'expiry-management.html','Reorder Levels':'reorder-levels.html','Batch Tracking':'batch-tracking.html','Damage / Wastage':'damage-wastage.html'}, sales: {'POS Billing':'pos-billing.html','Sales Orders':'sales-orders.html','Sales Returns':'sales-returns.html','Credit Sales':'credit-sales.html','Pending Bills':'pending-bills.html','Day Close':'day-close.html','Counterwise Sales':'counterwise-sales.html','Payment Collection':'payment-collection.html'}, customer: {'Customer Master':'customer-master.html','Customer Feedback':'customer-feedback.html','Customer Offers':'customer-offers.html'}, employee: {'Employee Master':'employee-management.html','Departments':'departments.html','Designations':'designations.html','Roles & Permissions':'roles-permissions.html','Attendance':'attendance.html','Shift Management':'shift-management.html','Payroll Integration':'payroll-integration.html','Accounting & Finance':'employee-finance.html'}, finance: {'Income':'income.html','Expenses':'expenses.html','Bank Accounts':'bank-accounts.html','Journals':'journals.html','Contra Entries':'contra-entries.html','Tax':'tax.html','Reports':'reports.html'}, reports: {'Sales Reports':'sales-reports.html','Purchase Reports':'purchase-reports.html','Inventory Reports':'inventory-reports.html','Profit & Loss':'profit-loss.html','GST Reports':'gst-reports.html','Branch Performance':'branch-performance.html','Product Performance':'product-performance.html','Customer Reports':'customer-reports.html','Employee Reports':'employee-reports.html'}, settings: {'General Settings':'general-settings.html','Notification Settings':'notification-settings.html','User Management':'user-management.html','Audit Logs':'audit-logs.html','Backup & Restore':'backup-restore.html'}
  };

  const moduleFolder = {
    company: 'company-management',
    branch: 'branch-management',
    warehouse: 'warehouse-management',
    product: 'product-management',
    itemmaster: 'item-master-management',
    admin: 'admin',
    supplier: 'supplier-management',
    purchase: 'purchase-management',
    inventory:'inventory-management', sales:'sales-billing', customer:'customer-management', employee:'employee-management', finance:'accounting-finance', reports:'reports-analytics', settings:'system-settings', support:'support'
  };

  const MODULE_HOME = {company:'company-management.html',branch:'branch-management.html',warehouse:'warehouse-management.html',product:'product-management.html',itemmaster:'item-master.html',admin:'product-master-configuration.html',supplier:'supplier-overview.html',purchase:'purchase-management.html',inventory:'inventory-management.html',sales:'sales-billing.html',customer:'customer-management.html',employee:'employee-management.html',finance:'accounting-finance.html',reports:'reports-analytics.html',settings:'system-settings.html'};

  const currentModuleKey = () => {
    const p = location.pathname;
    if (p.includes('/company-management/')) return 'company';
    if (p.includes('/branch-management/')) return 'branch';
    if (p.includes('/warehouse-management/')) return 'warehouse';
    if (p.includes('/product-management/') && /\/(barcode-management|add-new-barcode|batch-management|add-new-batch)\.html(?:$|[?#])/.test(p)) return 'admin';
    if (p.includes('/product-management/')) return 'product';
    if (p.includes('/item-master-management/')) return 'itemmaster';
    if (p.includes('/admin/')) return 'admin';
    if (p.includes('/supplier-management/')) return 'supplier';
    if (p.includes('/purchase-management/')) return 'purchase';
    if (p.includes('/inventory-management/')) return 'inventory';
    if (p.includes('/sales-billing/')) return 'sales';
    if (p.includes('/customer-management/')) return 'customer';
    if (p.includes('/employee-management/')) return 'employee';
    if (p.includes('/accounting-finance/')) return 'finance';
    if (p.includes('/reports-analytics/')) return 'reports';
    if (p.includes('/support/')) return 'support';
    if (p.includes('/system-settings/')) return 'settings';
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
    if (moduleKey === 'admin' && fileName.startsWith('../product-management/')) {
      location.href = `${current === 'dashboard' ? '' : '../'}product-management/${fileName.split('/').pop()}`;
      return;
    }
    location.href = current === moduleKey ? fileName : `${current === 'dashboard' ? '' : '../'}${folder}/${fileName}`;
  };

  const sidebarSvg = {
    dashboard: `<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>`,
    company: `<path d="M4 21V5h10v16"/><path d="M14 9h6v12"/><path d="M8 9h2M8 13h2M8 17h2M17 13h1M17 17h1"/>`,
    branch: `<path d="M3 10h18"/><path d="M5 10V7l2-3h10l2 3v3"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>`,
    warehouse: `<path d="m3 9 9-6 9 6v12H3Z"/><path d="M7 21v-8h10v8M7 13h10"/>`,
    product: `<path d="m21 8-9 5-9-5"/><path d="m3 8 9-5 9 5v8l-9 5-9-5Z"/><path d="M12 13v8"/>`,
    admin: `<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
    itemmaster: `<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>`,
    supplier: `<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><path d="M16 7h5M18.5 4.5 21 7l-2.5 2.5"/>`,
    purchase: `<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 10.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.6L21 8H7"/>`,
    inventory: `<path d="M5 5h14v16H5Z"/><path d="M8 3h8v4H8Z"/><path d="M9 11h6M9 15h6"/>`,
    sales: `<path d="M5 3h14v18H5Z"/><path d="M8 7h8v4H8Z"/><path d="M8 15h2M14 15h2M8 18h2M14 18h2"/>`,
    customer: `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
    employee: `<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="m10 12 2 3 2-3"/>`,
    finance: `<path d="M6 2h9l4 4v16H6Z"/><path d="M14 2v5h5"/><path d="M9 12h6M9 16h6"/>`,
    reports: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`,
    settings: `<circle cx="12" cy="12" r="3"/><path d="M19 15.5a7.5 7.5 0 1 0-14 0"/><path d="M12 9v6M9 12h6"/>`
  };
  const sidebarIcon = key => `<svg class="sidebar-svg-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${sidebarSvg[key]||sidebarSvg.dashboard}</svg>`;

  const groups = [
    ['dashboard','fa-house','Dashboard',false],
    ['company','fa-building','Company Management',true],
    ['branch','fa-shop','Branch Management',true],
    ['warehouse','fa-warehouse','Warehouse Management',true],
    ['product','fa-boxes-stacked','Product Management',true],
    ['itemmaster','fa-list-check','Item Master Management',true],
    ['admin','fa-user-shield','Admin',true],
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
    product:['Categories'],
    itemmaster:['Item Master'],
    admin:['Product Master Configuration','Barcode Management','Batch Management'],
    supplier:['Supplier List','Add New Supplier','Supplier Categories','Supplier Contacts'],
    purchase:['Purchase Orders','Goods Receipt (GRN)','Purchase Returns','Purchase Invoices','Supplier Payments','Purchase Reports'],
    inventory:['Stock Register','Stock Transfers','Stock Adjustments','Stock Count','Expiry Management','Reorder Levels','Batch Tracking','Damage / Wastage'],
    sales:['POS Billing','Sales Orders','Sales Returns','Credit Sales','Pending Bills','Day Close','Counterwise Sales','Payment Collection'],
    customer:['Customer Master','Customer Feedback','Customer Offers'],
    employee:['Employee Master','Departments','Designations','Roles & Permissions','Attendance','Shift Management','Payroll Integration','Accounting & Finance'],
    finance:['Income','Expenses','Bank Accounts','Journals','Contra Entries','Tax','Reports'],
    reports:['Sales Reports','Purchase Reports','Inventory Reports','Profit & Loss','GST Reports','Branch Performance','Product Performance','Customer Reports','Employee Reports'],
    settings:['General Settings','Notification Settings','User Management','Audit Logs','Backup & Restore']
  };

  mount.className = 'app-sidebar';
  mount.innerHTML = `
    <div class="sidebar-brand">
      <img src="${currentModuleKey() !== 'dashboard' ? '../assets/images/logo-zmart.png' : 'assets/images/logo-zmart.png'}" alt="ZMart" />
    </div>
    <nav class="sidebar-nav">
      ${groups.map(([key,icon,label,expandable]) => `
        <div class="nav-group" data-group="${key}">
          <button class="nav-item" type="button" data-nav="${key}" aria-expanded="false">
            <span class="nav-icon">${sidebarIcon(key)}</span>
            <span class="nav-label">${label}</span>
            ${expandable ? '<span class="nav-chevron" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="m6 8 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' : ''}
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
    'item-master.html':'Item Master',
    'customer-master.html':'Customer Master',
    'customer-feedback.html':'Customer Feedback',
    'customer-offers.html':'Customer Offers',
    'employee-management.html':'Employee Master',
    'departments.html':'Departments',
    'designations.html':'Designations',
    'roles-permissions.html':'Roles & Permissions',
    'attendance.html':'Attendance',
    'shift-management.html':'Shift Management',
    'payroll-integration.html':'Payroll Integration',
    'employee-finance.html':'Accounting & Finance',
    'income.html':'Income',
    'expenses.html':'Expenses',
    'bank-accounts.html':'Bank Accounts',
    'journals.html':'Journals',
    'contra-entries.html':'Contra Entries',
    'tax.html':'Tax',
    'reports.html':'Reports',
    'sales-reports.html':'Sales Reports',
    'inventory-reports.html':'Inventory Reports',
    'backup-restore.html':'Backup & Restore',
    'audit-logs.html':'Audit Logs',
    'user-management.html':'User Management',
    'notification-settings.html':'Notification Settings',
    'general-settings.html':'General Settings',
    'profit-loss.html':'Profit & Loss',
    'employee-reports.html':'Employee Reports',
    'customer-reports.html':'Customer Reports',
    'product-performance.html':'Product Performance',
    'branch-performance.html':'Branch Performance',
    'gst-reports.html':'GST Reports',
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
    'add-new-barcode.html':'Barcode Management',
    'batch-management.html':'Batch Management',
    'add-new-batch.html':'Batch Management',
    'supplier-management.html':'Supplier List',
    'add-new-supplier.html':'Add New Supplier',
    'supplier-categories.html':'Supplier Categories',
    'supplier-contacts.html':'Supplier Contacts',
    'purchase-orders.html':'Purchase Orders',
    'new-purchase-order.html':'Purchase Orders',
    'purchase-order-items.html':'Purchase Orders',
    'review-purchase-order.html':'Purchase Orders',
    'purchase-order-complete.html':'Purchase Orders',
    'goods-receipt.html':'Goods Receipt (GRN)',
    'new-grn.html':'Goods Receipt (GRN)',
    'grn-items.html':'Goods Receipt (GRN)',
    'grn-review.html':'Goods Receipt (GRN)',
    'grn-complete.html':'Goods Receipt (GRN)',
    'edit-grn.html':'Goods Receipt (GRN)',
    'edit-grn-items.html':'Goods Receipt (GRN)',
    'edit-grn-review.html':'Goods Receipt (GRN)',
    'edit-grn-complete.html':'Goods Receipt (GRN)',
    'purchase-returns.html':'Purchase Returns',
    'new-purchase-return.html':'Purchase Returns',
    'purchase-return-items.html':'Purchase Returns',
    'purchase-return-review.html':'Purchase Returns',
    'purchase-return-complete.html':'Purchase Returns',
    'purchase-invoices.html':'Purchase Invoices',
    'supplier-payments.html':'Supplier Payments',
    'purchase-reports.html':'Purchase Reports',
    'stock-register.html':'Stock Register',
    'stock-adjustment.html':'Stock Adjustments',
    'stock-count.html':'Stock Count',
    'expiry-management.html':'Expiry Management',
    'reorder-levels.html':'Reorder Levels',
    'batch-tracking.html':'Batch Tracking',
    'damage-wastage.html':'Damage / Wastage',
    'inventory-management.html':'Stock Register',
    'sales-returns.html':'Sales Returns',
    'sales-billing.html':'POS Billing',
    'pos-billing.html':'POS Billing',
    'sales-orders.html':'Sales Orders',
    'new-sales-order.html':'Sales Orders',
    'credit-sales.html':'Credit Sales',
    'new-credit-sale.html':'Credit Sales',
    'pending-bills.html':'Pending Bills',
    'resume-pending-bill.html':'Pending Bills',
    'day-close.html':'Day Close',
    'close-business-day.html':'Day Close',
    'counterwise-sales.html':'Counterwise Sales',
    'payment-collection.html':'Payment Collection',
    'new-sales-invoice.html':'POS Billing'
  };

  const activeGroupKey = currentModuleKey();
  const activeGroup = sidebar.querySelector(`[data-group="${activeGroupKey}"]`);
  activeGroup?.classList.add('active');
  // Support is a dedicated footer action rather than an expandable nav group.
  // Keep it visibly selected on the Support Center page just like module links.
  if (activeGroupKey === 'support') {
    const supportLink = sidebar.querySelector('.sidebar-support');
    supportLink?.classList.add('active');
    supportLink?.setAttribute('aria-current', 'page');
  }
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

  // Keep the current Sales & Billing submenu visibly selected on list and inner pages.
  const syncActiveSubnav = () => {
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const label = routeToSubnav[file];
    const groupKey = currentModuleKey();
    const group = sidebar.querySelector(`[data-group="${groupKey}"]`);
    if (!group || !label) return;
    group.classList.add('active','open');
    group.querySelector('.nav-item')?.setAttribute('aria-expanded','true');
    group.querySelectorAll('[data-subnav]').forEach(btn => {
      const selected = (btn.dataset.subnav || '').trim() === label;
      btn.classList.toggle('active', selected);
      if (selected) btn.setAttribute('aria-current','page');
      else btn.removeAttribute('aria-current');
    });
  };
  syncActiveSubnav();
  requestAnimationFrame(syncActiveSubnav);
  // Inner workflow pages can mount after the page shell; re-apply once the DOM is fully ready.
  document.addEventListener('DOMContentLoaded', syncActiveSubnav);
  window.addEventListener('load', syncActiveSubnav);
  if (currentFile === 'new-credit-sale.html') {
    const forceCreditSalesActive = () => {
      const salesGroup = sidebar.querySelector('[data-group="sales"]');
      if (!salesGroup) return;
      salesGroup.classList.add('active','open');
      salesGroup.querySelector('.nav-item')?.setAttribute('aria-expanded','true');
      salesGroup.querySelectorAll('[data-subnav]').forEach(btn => {
        const selected = (btn.dataset.subnav || '').trim() === 'Credit Sales';
        btn.classList.toggle('active', selected);
        if (selected) btn.setAttribute('aria-current','page'); else btn.removeAttribute('aria-current');
      });
    };
    forceCreditSalesActive();
    setTimeout(forceCreditSalesActive, 0);
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
      navigateToModuleFile('support', 'support.html');
      if (window.innerWidth <= 900) closeMobileSidebar();
      return;
    }
    const group = nav.closest('.nav-group');
    if (!group) return;
    if (MODULE_HOME[key] && currentModuleKey() !== key) {
      navigateToModuleFile(key, MODULE_HOME[key]);
      return;
    }
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
