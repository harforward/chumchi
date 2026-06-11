/* ============================================
   CHUMCHI — nav.js
   Shared sidebar, spoon loader, page transitions
   Include AFTER app.js on every page.
   Call initNav(activeId, role) on each page.
   ============================================ */

// ── Spoon loader ──────────────────────────────
function showSpoonLoader(cb) {
  const el = document.createElement('div');
  el.id = 'spoon-loader';
  el.innerHTML = `
    <div class="sl-inner">
      <svg class="sl-spoon" viewBox="0 0 40 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="16" rx="13" ry="15" stroke="rgba(196,120,90,0.9)" stroke-width="2"/>
        <line x1="20" y1="31" x2="20" y2="98" stroke="rgba(196,120,90,0.9)" stroke-width="2" stroke-linecap="round"/>
        <!-- Steam wisps -->
        <path class="steam s1" d="M14 8 Q11 4 14 0" stroke="rgba(240,192,112,0.7)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path class="steam s2" d="M20 6 Q17 2 20 -2" stroke="rgba(240,192,112,0.7)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path class="steam s3" d="M26 8 Q29 4 26 0" stroke="rgba(240,192,112,0.7)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="sl-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #spoon-loader {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(253,246,236,0.88);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      animation: slFadeIn 0.18s ease;
    }
    @keyframes slFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slFadeOut { from{opacity:1} to{opacity:0} }

    .sl-inner { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; }

    .sl-spoon {
      width: 36px;
      animation: spoonSpin 1.1s cubic-bezier(0.4,0,0.2,1) infinite;
      transform-origin: 20px 50px;
    }
    @keyframes spoonSpin {
      0%   { transform: rotate(-22deg); }
      50%  { transform: rotate(22deg); }
      100% { transform: rotate(-22deg); }
    }

    .steam { animation: steamRise 1.4s ease-in-out infinite; opacity: 0; }
    .s1 { animation-delay: 0s; }
    .s2 { animation-delay: 0.2s; }
    .s3 { animation-delay: 0.4s; }
    @keyframes steamRise {
      0%   { opacity: 0; transform: translateY(4px); }
      40%  { opacity: 0.9; }
      100% { opacity: 0; transform: translateY(-8px); }
    }

    .sl-dots { display: flex; gap: 6px; }
    .sl-dots span {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--clay, #C4785A);
      animation: slDot 1s ease-in-out infinite;
      opacity: 0.5;
    }
    .sl-dots span:nth-child(2) { animation-delay: 0.2s; }
    .sl-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes slDot {
      0%,100% { transform: scale(1); opacity: 0.5; }
      50%      { transform: scale(1.5); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(el);

  if (cb) {
    setTimeout(() => {
      el.style.animation = 'slFadeOut 0.22s ease forwards';
      setTimeout(() => { el.remove(); style.remove(); cb(); }, 220);
    }, 680);
  }
  return el;
}

// Navigate with spoon transition
function spoonNav(url) {
  const loader = showSpoonLoader();
  setTimeout(() => { window.location.href = url; }, 500);
}

// ── Shared sidebar builder ─────────────────────
function buildSidebar(activeId, role) {
  const sess = JSON.parse(sessionStorage.getItem('chumchi_session') || 'null');
  const family = sess?.family || 'rafiq';
  const isAdmin = sess?.role === 'admin' || sess?.role === 'superadmin';
  const MEMBERS = (typeof TREE !== 'undefined') ? TREE[family]?.members || {} : {};

  // Members who have recipes
  const FAMILY_RECIPES = (typeof RECIPES !== 'undefined') ? RECIPES[family] || [] : [];
  const membersWithRecipes = Object.values(MEMBERS).filter(m =>
    FAMILY_RECIPES.some(r => r.assignedTo === m.id)
  );
  const myRecipes = FAMILY_RECIPES.filter(r => r.uploadedBy === (sess?.memberId || 'meher'));
  const myUploads = FAMILY_RECIPES.filter(r => r.uploadedBy === (sess?.memberId || 'meher'));

  const isActive = (id) => activeId === id ? 'active' : '';

  // Depth: which folder are we in?
  const isAdmin2 = window.location.pathname.includes('/admin/');
  const isFam   = window.location.pathname.includes('/family/');
  const root     = isAdmin2 ? '../' : isFam ? '../' : './';

  const recipeItems = membersWithRecipes.slice(0,2).map(m => `
    <a class="sidebar-item ${isActive('member-'+m.id)}"
       href="javascript:spoonNav('${root}family/recipe.html?member=${m.id}')">
      <span class="icon">◌</span> ${m.name}
    </a>
  `).join('');

  const seeMoreRecipes = membersWithRecipes.length > 2
    ? `<a class="sidebar-see-more" href="javascript:spoonNav('${root}family/all-recipes.html')">see more →</a>`
    : '';

  const adminItems = isAdmin ? `
    <span class="sidebar-section">Admin</span>
    <a class="sidebar-item ${isActive('family-admin')}"
       href="javascript:spoonNav('${root}admin/family-admin.html')">
      <span class="icon">⊡</span> Manage Tree
    </a>
    <a class="sidebar-item ${isActive('requests')}"
       href="javascript:spoonNav('${root}admin/requests.html')">
      <span class="icon">◌</span> Access Requests
    </a>
    ${sess && sess.role === 'superadmin' ? '<a class="sidebar-item ' + isActive('dashboard') + '" href="javascript:spoonNav(' + "'" + root + 'admin/dashboard.html' + "'" + ')"><span class="icon">⊞</span> All Families</a><a class="sidebar-item ' + isActive('credentials') + '" href="javascript:spoonNav(' + "'" + root + 'admin/credentials.html' + "'" + ')"><span class="icon">⊟</span> Credentials</a>' : ''}
  ` : '';

  const html = `
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
    <div class="sidebar" id="sidebar">
      <button class="sidebar-close" onclick="closeSidebar()">✕</button>

      <div class="sidebar-brand">
        <span>Chumchi</span>
        <small>silver spoon energy</small>
      </div>

      <nav class="sidebar-nav">
        <span class="sidebar-section">Navigate</span>
        <a class="sidebar-item ${isActive('tree')}"
           href="javascript:spoonNav('${root}family/tree.html')">
          <span class="icon">◉</span> Family Tree
        </a>
        <a class="sidebar-item ${isActive('family-list')}"
           href="javascript:spoonNav('${root}family/family-list.html')">
          <span class="icon">◎</span> Family List
        </a>
        <a class="sidebar-item ${isActive('upload')}"
           href="javascript:spoonNav('${root}family/upload.html')">
          <span class="icon">↑</span> Upload Recipe
        </a>

        <span class="sidebar-section">Recipes</span>
        <a class="sidebar-item ${isActive('my-uploads')}"
           href="javascript:spoonNav('${root}family/my-uploads.html')">
          <span class="icon">⬡</span> Recipes I've Uploaded
        </a>
        <a class="sidebar-item ${isActive('my-recipes')}"
           href="javascript:spoonNav('${root}family/my-recipes.html')">
          <span class="icon">☽</span> My Recipes
        </a>

        <span class="sidebar-section">Family Recipes</span>
        ${recipeItems}
        ${seeMoreRecipes}

        ${adminItems}
      </nav>

      <div class="sidebar-footer">
        <button onclick="doLogout()">Sign Out</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', html);

  // Wire hamburger
  const ham = document.getElementById('navHamburger');
  if (ham) ham.addEventListener('click', openSidebar);
}

function openSidebar()  {
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}
function doLogout() {
  sessionStorage.clear();
  spoonNav('../index.html');
}

// Shared sidebar CSS (injected once)
(function injectSidebarCSS() {
  if (document.getElementById('chumchi-sidebar-css')) return;
  const style = document.createElement('style');
  style.id = 'chumchi-sidebar-css';
  style.textContent = `
    .sidebar-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(44,33,24,0.3); z-index: 199;
    }
    .sidebar-overlay.open { display: block; }

    .sidebar {
      position: fixed; top:0; left:0;
      width: 240px; height: 100vh;
      background: rgba(107,79,58,0.96);
      backdrop-filter: blur(12px);
      z-index: 200;
      transform: translateX(-100%);
      transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
      display: flex; flex-direction: column;
      padding: 1.5rem 0;
      box-shadow: 4px 0 32px rgba(44,33,24,0.18);
      overflow-y: auto;
    }
    .sidebar.open { transform: translateX(0); }

    .sidebar-close {
      position: absolute; top:1rem; right:1rem;
      background:none; border:none;
      color:rgba(253,246,236,0.5); font-size:1.1rem;
      cursor:pointer; transition:color 0.2s;
    }
    .sidebar-close:hover { color:rgba(253,246,236,0.9); }

    .sidebar-brand {
      padding: 0 1.5rem 1.4rem;
      border-bottom: 1px solid rgba(253,246,236,0.1);
      margin-bottom: 0.5rem;
    }
    .sidebar-brand span {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem; font-weight:300;
      letter-spacing:0.28em; text-transform:uppercase;
      color: rgba(253,246,236,0.9);
    }
    .sidebar-brand small {
      display:block; font-family:'Cormorant Garamond',serif;
      font-style:italic; font-size:0.7rem;
      color:rgba(240,192,112,0.7); letter-spacing:0.1em; margin-top:0.1rem;
    }

    .sidebar-nav { flex:1; padding:0.5rem 0; }

    .sidebar-section {
      padding: 0.6rem 1.5rem 0.2rem;
      font-size: 0.52rem; letter-spacing:0.22em;
      text-transform:uppercase;
      color:rgba(253,246,236,0.25); margin-top:0.4rem;
      display:block;
    }

    .sidebar-item {
      display:flex; align-items:center; gap:0.7rem;
      padding: 0.65rem 1.5rem;
      color: rgba(253,246,236,0.62);
      text-decoration:none; font-size:0.73rem;
      letter-spacing:0.12em; text-transform:uppercase;
      transition: all 0.2s; cursor:pointer;
      border:none; background:none; width:100%;
      text-align:left; font-family:'Inter',sans-serif;
    }
    .sidebar-item:hover, .sidebar-item.active {
      color:rgba(253,246,236,0.95);
      background:rgba(253,246,236,0.08);
    }
    .sidebar-item .icon { font-size:0.9rem; width:16px; text-align:center; }

    .sidebar-see-more {
      display:block; margin: 0.2rem 1.5rem 0 3rem;
      font-size:0.6rem; letter-spacing:0.14em;
      color:rgba(240,192,112,0.55); text-decoration:none;
      font-family:'Cormorant Garamond',serif; font-style:italic;
      transition:color 0.2s;
    }
    .sidebar-see-more:hover { color:rgba(240,192,112,0.9); }

    .sidebar-footer {
      padding:1rem 1.5rem;
      border-top:1px solid rgba(253,246,236,0.1);
    }
    .sidebar-footer button {
      font-size:0.65rem; letter-spacing:0.14em;
      text-transform:uppercase; color:rgba(253,246,236,0.35);
      background:none; border:none; cursor:pointer;
      font-family:'Inter',sans-serif; transition:color 0.2s;
    }
    .sidebar-footer button:hover { color:rgba(253,246,236,0.7); }
  `;
  document.head.appendChild(style);
})();
