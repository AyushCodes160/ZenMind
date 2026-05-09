// Shared sidebar navigation — call initNav('pageid') on each page
function initNav(active) {
  const pages = [
    { id:'home',      label:'Home',         href:'index.html',      icon:'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9' },
    { id:'zen-ai',    label:'Talk to Zen',  href:'zen-ai.html',     icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', badge:'AI' },
    { id:'community', label:'Community',    href:'community.html',  icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75' },
    { id:'quotes',    label:'Daily Quotes', href:'quotes.html',     icon:'M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z' },
    { id:'videos',    label:'Calm Videos',  href:'videos.html',     icon:'M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.938L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z' },
    { id:'meditation',label:'Meditations',  href:'meditation.html', icon:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16a4 4 0 100-8 4 4 0 000 8z M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' },
    { id:'journal',   label:'My Journal',   href:'journal.html',    icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
  ];

  const streak = parseInt(localStorage.getItem('za_streak') || '0');

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.setAttribute('aria-label', 'Main navigation');
  sidebar.innerHTML = `
    <a href="index.html" class="sidebar-logo" aria-label="Zen Alpha home">
      <div class="sidebar-logo-mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6">
          <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>
          <circle cx="12" cy="12" r="1.5" fill="white" stroke="none"/>
        </svg>
      </div>
      <div>
        <div class="sidebar-logo-name">Zen Alpha</div>
        <div class="sidebar-logo-tagline">Find your calm</div>
      </div>
    </a>

    <nav class="sidebar-nav" aria-label="Pages">
      <div class="sidebar-section-label" aria-hidden="true">Menu</div>
      ${pages.map(p => `
        <a href="${p.href}" class="nav-link ${active === p.id ? 'active' : ''}" ${active === p.id ? 'aria-current="page"' : ''}>
          <span class="nav-link-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="${active === p.id ? 'var(--sage)' : 'currentColor'}"
              stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              ${p.icon.split(' M').map((d,i) => `<path d="${i===0?d:'M'+d}"/>`).join('')}
            </svg>
          </span>
          ${p.label}
          ${p.badge ? `<span class="nav-link-badge" aria-label="${p.badge}">${p.badge}</span>` : ''}
        </a>
      `).join('')}
    </nav>

    <div class="sidebar-bottom">
      ${streak > 0 ? `
        <div style="margin-bottom:10px;padding:10px 12px;background:oklch(24% 0.04 160);border-radius:12px;display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px" aria-hidden="true">🔥</span>
          <div>
            <div style="font-size:13px;font-weight:600;color:white;" aria-label="${streak} day streak">${streak}-day streak</div>
            <div style="font-size:11px;color:oklch(48% 0.03 160);">Keep it going!</div>
          </div>
        </div>
      ` : ''}
      <div class="sidebar-user" role="button" tabindex="0" aria-label="User profile" id="auth-btn">
        <div class="user-avatar" aria-hidden="true" id="user-avatar-text">G</div>
        <div>
          <div class="user-name" id="user-name-text">Sign in with Google</div>
          <div class="user-plan" id="user-plan-text">Sync your progress</div>
        </div>
        <svg style="margin-left:auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(38% 0.03 160)" stroke-width="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </div>
    </div>
  `;
  document.body.prepend(sidebar);

  // bump streak on visit
  const lastVisit = localStorage.getItem('za_last_visit');
  const today = new Date().toDateString();
  if (lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const s = parseInt(localStorage.getItem('za_streak') || '0');
    localStorage.setItem('za_streak', lastVisit === yesterday ? s + 1 : 1);
    localStorage.setItem('za_last_visit', today);
  }

  // Inject Firebase Auth logic
  const authScript = document.createElement('script');
  authScript.type = 'module';
  authScript.textContent = `
    import { loginWithGoogle, logout, onAuthStateChanged, auth, db } from './firebase-setup.js';
    import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

    const authBtn = document.getElementById('auth-btn');
    const avatar = document.getElementById('user-avatar-text');
    const nameText = document.getElementById('user-name-text');
    const planText = document.getElementById('user-plan-text');

    let currentUser = null;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        nameText.textContent = user.displayName;
        planText.textContent = 'Calm Plan ✦';
        avatar.innerHTML = user.photoURL ? '<img src="' + user.photoURL + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">' : user.displayName.charAt(0);
        
        // Sync streak from Firestore
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
             const data = docSnap.data();
             if (data.streak) {
                 localStorage.setItem('za_streak', data.streak.toString());
                 // Optionally update UI if streak element exists
                 const sd = document.getElementById('streak-display');
                 if(sd) sd.textContent = '🔥 ' + data.streak + '-day streak';
             }
          }
        } catch(e) { console.error('Firestore error:', e); }

      } else {
        currentUser = null;
        nameText.textContent = 'Sign in with Google';
        planText.textContent = 'Sync your progress';
        avatar.textContent = 'G';
      }
    });

    authBtn.addEventListener('click', async () => {
      if (!currentUser) {
        try {
          await loginWithGoogle();
        } catch (error) {
          alert('Could not sign in. Check console and make sure you added your Firebase Config in firebase-setup.js');
        }
      } else {
        if(confirm('Do you want to log out?')) {
          await logout();
        }
      }
    });
  `;
  document.body.appendChild(authScript);
}

// Shared sidebar toggle — used by every page
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen = sidebar.classList.toggle('mobile-open');
  if (overlay) overlay.classList.toggle('visible', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebar-overlay')?.classList.remove('visible');
  document.body.style.overflow = '';
}

document.addEventListener('click', function(e) {
  const link = e.target.closest('.nav-link');
  if (link && window.innerWidth <= 900) closeSidebar();
});

// Add Google Translate and Language Toggle
function injectLanguageSupport() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);

  const translateDiv = document.createElement('div');
  translateDiv.id = 'google_translate_element';
  translateDiv.style.display = 'none';
  document.body.appendChild(translateDiv);

  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,hi', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google_translate_element');
  };

  // Add toggle to the UI (e.g., topbar if it exists)
  setTimeout(() => {
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight) {
      const langToggle = document.createElement('div');
      langToggle.innerHTML = `
        <select id="lang-select" style="background:var(--cream-2); border:1px solid var(--border); border-radius:12px; padding:6px 12px; font-family:'DM Sans'; font-size:14px; margin-right: 12px; cursor:pointer;">
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      `;
      topbarRight.prepend(langToggle);
      
      const select = document.getElementById('lang-select');
      
      // try to sync with current google translate state
      const currentLang = getCookie('googtrans');
      if (currentLang && currentLang.includes('hi')) {
        select.value = 'hi';
      }

      select.addEventListener('change', (e) => {
        const val = e.target.value;
        const gtSelect = document.querySelector('.goog-te-combo');
        if (gtSelect) {
            gtSelect.value = val;
            gtSelect.dispatchEvent(new Event('change'));
        } else {
            // Fallback if the widget hasn't fully loaded
            setCookie('googtrans', `/en/${val}`, 30);
            window.location.reload();
        }
      });
    }
  }, 500);
}

function setCookie(name, value, days, domain) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    let domainStr = domain ? ("; domain=" + domain) : "";
    document.cookie = name + "=" + (value || "")  + expires + "; path=/" + domainStr;
}

injectLanguageSupport();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

