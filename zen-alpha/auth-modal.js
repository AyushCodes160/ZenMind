/**
 * ZenMind Auth Modal Logic
 */

(function() {
    const authHTML = `
    <div class="auth-overlay" id="authOverlay">
        <div class="auth-modal" id="authModal">
            <div class="auth-header">
                <div class="auth-logo-mark">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </div>
                <h2 class="auth-title" id="authTitle">Welcome Back</h2>
                <p class="auth-subtitle" id="authSubtitle">Please enter your details to continue your journey.</p>
            </div>
            
            <div class="auth-body">
                <div style="overflow: hidden;">
                    <div class="auth-form-container" id="authFormContainer">
                        <!-- Sign In Pane -->
                        <div class="auth-form-pane">
                            <form id="signInForm">
                                <div class="auth-form-group">
                                    <label class="auth-label">Username</label>
                                    <input type="text" class="auth-input" placeholder="e.g. alex_zen" required id="si-username">
                                </div>
                                <div class="auth-form-group">
                                    <label class="auth-label">Password</label>
                                    <input type="password" class="auth-input" placeholder="••••••••" required id="si-password">
                                </div>
                                <button type="submit" class="auth-submit">
                                    Sign In
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </form>
                        </div>
                        
                        <!-- Sign Up Pane -->
                        <div class="auth-form-pane">
                            <form id="signUpForm">
                                <div class="auth-form-group">
                                    <label class="auth-label">Username</label>
                                    <input type="text" class="auth-input" placeholder="Choose a username" required id="su-username">
                                </div>
                                <div class="auth-form-group">
                                    <label class="auth-label">Password</label>
                                    <input type="password" class="auth-input" placeholder="Create a password" required id="su-password">
                                </div>
                                <div class="auth-form-group">
                                    <label class="auth-label">City</label>
                                    <input type="text" class="auth-input" placeholder="Where are you from?" required id="su-city">
                                </div>
                                <div class="auth-form-group">
                                    <label class="auth-label">How did you know about us?</label>
                                    <select class="auth-input auth-select" required id="su-source">
                                        <option value="" disabled selected>Select an option</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Reddit">Reddit</option>
                                        <option value="Whatsapp">Whatsapp</option>
                                        <option value="Friends">Friends</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <button type="submit" class="auth-submit">
                                    Create Account
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="auth-footer">
                    <span id="toggleText">Don't have an account?</span>
                    <button class="auth-toggle-btn" id="authToggle">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Inject styles and HTML
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'auth-styles.css';
    document.head.appendChild(link);

    document.body.insertAdjacentHTML('beforeend', authHTML);

    const overlay = document.getElementById('authOverlay');
    const modal = document.getElementById('authModal');
    const toggleBtn = document.getElementById('authToggle');
    const toggleText = document.getElementById('toggleText');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    let isSignUp = false;

    function toggleAuth() {
        isSignUp = !isSignUp;
        if (isSignUp) {
            modal.classList.add('showing-signup');
            authTitle.textContent = "Start Your Journey";
            authSubtitle.textContent = "Join our community of mindfulness and peace.";
            toggleText.textContent = "Already have an account?";
            toggleBtn.textContent = "Sign In";
        } else {
            modal.classList.remove('showing-signup');
            authTitle.textContent = "Welcome Back";
            authSubtitle.textContent = "Please enter your details to continue your journey.";
            toggleText.textContent = "Don't have an account?";
            toggleBtn.textContent = "Sign Up";
        }
    }

    toggleBtn.addEventListener('click', toggleAuth);

    function showModal() {
        overlay.classList.add('active');
    }

    function hideModal() {
        overlay.classList.remove('active');
    }

    function updateUI(username) {
        const h = new Date().getHours();
        const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
        
        // Update main greeting
        const greeting = document.getElementById('greeting-title');
        if (greeting) greeting.textContent = `${greet}, ${username} ✦`;
        
        // Update sidebar
        const nameText = document.getElementById('user-name-text');
        const avatar = document.getElementById('user-avatar-text');
        const planText = document.getElementById('user-plan-text');
        
        if (nameText) nameText.textContent = username;
        if (avatar) avatar.textContent = username.charAt(0).toUpperCase();
        if (planText) planText.textContent = 'Zen Member ✦';
    }

    // Handle Form Submissions
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('si-username').value;
        // Mock sign in
        localStorage.setItem('za_user', JSON.stringify({ username }));
        updateUI(username);
        hideModal();
    });

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('su-username').value;
        const city = document.getElementById('su-city').value;
        const source = document.getElementById('su-source').value;
        
        // Mock sign up
        localStorage.setItem('za_user', JSON.stringify({ username, city, source }));
        updateUI(username);
        hideModal();
    });

    // Check if user is already logged in
    window.addEventListener('DOMContentLoaded', () => {
        const user = localStorage.getItem('za_user');
        if (!user) {
            setTimeout(showModal, 500); // Small delay for visual effect
        } else {
            const userData = JSON.parse(user);
            updateUI(userData.username);
        }
        
        // Hook into sidebar auth button for custom logout if za_user exists
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', (e) => {
                if (localStorage.getItem('za_user')) {
                    if (confirm('Do you want to log out from ZenMind?')) {
                        localStorage.removeItem('za_user');
                        window.location.reload();
                    }
                }
            });
        }
    });
})();
