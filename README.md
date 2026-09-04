# ZMart Super Admin Dashboard

Reusable front-end module recreated from the provided reference image.

## Run
Open `index.html` in a browser. Internet access is required only for the Google Poppins font and Font Awesome CDN. The dashboard itself is plain HTML/CSS/JS.

## Reusable components
- `components/sidebar/` — isolated sidebar CSS, JavaScript, and icon rules.
- `components/topbar/` — isolated topbar CSS, JavaScript, and icon rules.

Both components are mounted into `#sidebarMount` and `#topbarMount` by their own JavaScript, so future inner pages can reuse the same shell without duplicating markup.

## Dashboard module
- `assets/css/dashboard.css`
- `assets/js/dashboard.js`
- `assets/images/logo-zmart.png`

Sidebar parent links expand/collapse. Dashboard is active. Inner-link and quick-action hooks are wired and show functional feedback; replace the relevant handlers with page URLs as new inner pages are added.

## Shared UI component layer
Reusable themed controls are now available in `components/ui/`.
- `components/ui/css/ui-components.css`: select boxes, input boxes, search boxes, date/calendar controls, dropdowns, buttons, checkbox/radio and generic form styles.
- `components/ui/js/ui-components.js`: shared helpers and automatic styling for dynamically added controls.
- `components/ui/icons/ui-icons.css`: Font Awesome icon helper classes.

Theme variables are declared under `:root` in `ui-components.css`. Change `--zm-theme` once to update the UI accent across modules.
The desktop sidebar width is controlled by `--sidebar-width` in `components/sidebar/css/sidebar.css` and is currently 260px.


Company Management module pages added under /company-management with shared sidebar, topbar and UI components.

## Warehouse Management (v31)
Implemented Warehouse Overview, Warehouse Master, Add Warehouse 5-step wizard, Stock by Warehouse, Warehouse Details tabs, action menus, upload inputs, stock summary/items/movement/low-stock/out-of-stock/documents, Stock Transfers and Rack & Bin navigation. Warehouse pages reuse shared Sidebar and Topbar components, Poppins, and Font Awesome.


## Stock Transfer module
Implemented reference-matched Stock Transfers list and 3-step New Stock Transfer flow with reusable sidebar/topbar components. Files: warehouse-management/stock-transfers.html, warehouse-management/new-stock-transfer.html, assets/css/stock-transfer.css, assets/js/stock-transfer.js.

## Warehouse Management implementation

The Warehouse Management module includes the reference-driven screens and interactions for Warehouse Overview, Warehouse Master, the Add Warehouse five-step workflow, Stock by Warehouse detail tabs/action menus, Stock Transfers, and Rack & Bin Management. Shared Sidebar and Topbar remain reusable components under `components/sidebar/` and `components/topbar/`, with isolated CSS, JavaScript, and icon styles. Poppins and Font Awesome are used consistently.

## Product Management - Sub Categories
- `product-management/sub-categories.html`
- `assets/css/sub-category-management.css`
- `assets/js/sub-category-management.js`
- Uses reusable `components/sidebar/*` and `components/topbar/*`.
- Sidebar route Product Management > Sub Categories is connected and active-state aware.

## Product Management – Products
- `product-management/products.html`
- `assets/css/product-management.css`
- `assets/js/product-management.js`
- Sidebar route: Product Management → Products
- Topbar title: Products
- Working filters, table actions, export, modal actions, quick actions and dummy data.

## Products - Add Product workflow
- `product-management/products.html` – Products list screen.
- `product-management/add-product.html` – Add New Product form and full-page success state.
- `assets/css/add-product.css` / `assets/js/add-product.js` – dedicated Product inner-page styles and behavior.
- Products sidebar and topbar routes remain reusable components; Add New Product keeps Product Management → Products active.
