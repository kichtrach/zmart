(() => {
  const mount = document.getElementById('topbarMount');
  if (!mount) return;
  mount.className = 'app-topbar';
  mount.innerHTML = `
    <div class="topbar-left">
      <button class="hamburger" id="sidebarToggle" type="button" aria-label="Toggle sidebar" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      <strong class="topbar-title">${
        location.pathname.includes("/warehouse-management/add-warehouse") ? "Add Warehouse" :
        location.pathname.includes("/warehouse-management/warehouse-master") ? "Warehouse Master" :
        location.pathname.includes("/warehouse-management/stock-by-warehouse") ? "Stock by Warehouse" :
        location.pathname.includes("/warehouse-management/new-stock-transfer") ? "New Stock Transfer" :
        location.pathname.includes("/warehouse-management/stock-transfers") ? "Stock Transfers" :
        location.pathname.includes("/warehouse-management/rack-bin-management") ? "Rack & Bin Management" :
        location.pathname.includes("/warehouse-management/") ? "Warehouse Management" :
        location.pathname.includes("/branch-management/branch-dashboard") ? "Branch Dashboard - ZMART Anna Nagar" :
        location.pathname.includes("/branch-management/branch-performance") ? "Branch Performance" :
        location.pathname.includes("/branch-management/branch-expenses") ? "Branch Expenses" :
        location.pathname.includes("/branch-management/branch-status") ? "Branch Status" :
        (location.pathname.includes("/branch-management/branch-configuration") || location.pathname.includes("/branch-management/branch-targets")) ? "Branch Configuration" :
        location.pathname.includes("/branch-management/add-branch") ? "Add Branch" :
        location.pathname.includes("/branch-management/edit-branch") ? "Edit Branch" :
        location.pathname.includes("/branch-management/") ? "Branch Management" :
        location.pathname.includes("/company-management/") ? "Company Management" :
        "Super Admin Dashboard"
      }</strong>
    </div>
    <div class="topbar-search">
      <input id="globalSearch" type="search" placeholder="Search here..." aria-label="Search" />
      <button id="searchBtn" type="button" aria-label="Submit search"><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>
    <div class="topbar-right">
      <div class="notification-wrap">
        <button class="notification-btn" id="notificationBtn" type="button" aria-label="Notifications"><i class="fa-regular fa-bell"></i><span>8</span></button>
        <div class="topbar-popover notification-popover" id="notificationPopover" hidden>
          <div class="popover-head"><strong>Notifications</strong><button type="button" data-close-popover>&times;</button></div>
          <button>Low stock alert <small>126 items require attention</small></button>
          <button>Expiry alert <small>58 items expire within 30 days</small></button>
          <button>Branch target reached <small>5 branches crossed 100%</small></button>
        </div>
      </div>
      <div class="profile-wrap">
        <button class="profile-btn" id="profileBtn" type="button" aria-expanded="false">
          <span class="avatar"><i class="fa-solid fa-user"></i></span>
          <span class="profile-copy"><strong>Super Admin</strong><small>Head Office</small></span>
          <i class="fa-solid fa-chevron-down profile-chevron"></i>
        </button>
        <div class="topbar-popover profile-popover" id="profilePopover" hidden>
          <button type="button"><i class="fa-regular fa-user"></i> My Profile</button>
          <button type="button"><i class="fa-solid fa-gear"></i> Preferences</button>
          <button type="button"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        </div>
      </div>
    </div>`;

  const sidebarToggle = document.getElementById('sidebarToggle');
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationPopover = document.getElementById('notificationPopover');
  const profileBtn = document.getElementById('profileBtn');
  const profilePopover = document.getElementById('profilePopover');
  const globalSearch = document.getElementById('globalSearch');
  const searchBtn = document.getElementById('searchBtn');

  sidebarToggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.innerWidth <= 900) {
      const willOpen = !document.body.classList.contains('sidebar-mobile-open');
      document.body.classList.toggle('sidebar-mobile-open', willOpen);
      sidebarToggle.setAttribute('aria-expanded', String(willOpen));
    } else {
      window.ZMartSidebar?.toggle();
      sidebarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  function hidePopovers(except) {
    [notificationPopover,profilePopover].forEach(p => {if(p!==except) p.hidden=true;});
  }
  notificationBtn.addEventListener('click', e => {e.stopPropagation();hidePopovers(notificationPopover);notificationPopover.hidden=!notificationPopover.hidden;});
  profileBtn.addEventListener('click', e => {e.stopPropagation();hidePopovers(profilePopover);profilePopover.hidden=!profilePopover.hidden;profileBtn.setAttribute('aria-expanded',String(!profilePopover.hidden));});
  document.addEventListener('click', e => {if(!e.target.closest('.notification-wrap')&&!e.target.closest('.profile-wrap')) hidePopovers();});
  document.querySelectorAll('[data-close-popover]').forEach(b=>b.addEventListener('click',()=>hidePopovers()));

  const submitSearch = () => {
    const q = globalSearch.value.trim();
    if (!q) return;
    window.dispatchEvent(new CustomEvent('zmart:action',{detail:{message:`Search requested for “${q}”.`}}));
  };
  searchBtn.addEventListener('click', submitSearch);
  globalSearch.addEventListener('keydown', e => { if(e.key==='Enter') submitSearch(); });
})();
