// =============================================
// منصة تعلم الإنجليزية - JavaScript
// English Learning Platform - JavaScript
// =============================================

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CHECK LOGIN STATUS =====
    checkLoginStatus();
    
    // ===== HAMBURGER MENU =====
    setupHamburgerMenu();
    
    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // ===== REGISTER FORM =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // ===== LOGOUT BUTTONS =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const logoutBtnDashboard = document.getElementById('logoutBtnDashboard');
    if (logoutBtnDashboard) {
        logoutBtnDashboard.addEventListener('click', handleLogout);
    }
    
    // ===== LOAD DASHBOARD DATA =====
    if (document.querySelector('.dashboard')) {
        loadDashboardData();
    }
    
    // ===== SMOOTH SCROLL =====
    setupSmoothScroll();
    
    // ===== ANIMATE PROGRESS BARS =====
    setupProgressAnimation();
    
    console.log('🚀 منصة تعلم الإنجليزية جاهزة!');
});

// =============================================
// FUNCTIONS
// =============================================

// ===== CHECK LOGIN STATUS =====
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');
    
    if (currentUser) {
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        
        // Update username in dashboard if exists
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.textContent = `👋 مرحباً، ${currentUser.username}`;
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }
}

// ===== HAMBURGER MENU =====
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            }
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            });
        });
    }
}

// ===== HANDLE LOGIN =====
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    const errorMsg = document.getElementById('errorMsg');
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            level: user.level || 'beginner',
            registeredAt: user.registeredAt
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        // Show success message
        showToast('✅ تم تسجيل الدخول بنجاح!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    } else {
        // Show error
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة!';
        
        // Check if email exists
        const emailExists = users.some(u => u.email === email);
        if (!emailExists) {
            errorMsg.textContent = '❌ هذا البريد الإلكتروني غير مسجل! قم بإنشاء حساب.';
        }
        
        // Shake animation
        const form = document.getElementById('loginForm');
        form.style.animation = 'none';
        setTimeout(() => {
            form.style.animation = 'shake 0.5s ease';
        }, 10);
    }
}

// ===== HANDLE REGISTER =====
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    // Reset messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ جميع الحقول مطلوبة!';
        return;
    }
    
    if (username.length < 3) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ اسم المستخدم يجب أن يكون 3 أحرف على الأقل!';
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ البريد الإلكتروني غير صحيح!';
        return;
    }
    
    if (password.length < 6) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل!';
        return;
    }
    
    if (password !== confirmPassword) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ كلمة المرور غير متطابقة!';
        document.getElementById('regConfirmPassword').focus();
        return;
    }
    
    if (!agreeTerms) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ يجب الموافقة على الشروط والأحكام!';
        return;
    }
    
    // Get existing users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ هذا البريد الإلكتروني مسجل بالفعل!';
        return;
    }
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ اسم المستخدم موجود بالفعل! اختر اسم آخر.';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        level: 'beginner',
        registeredAt: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success
    successMsg.style.display = 'block';
    successMsg.innerHTML = '✅ تم إنشاء الحساب بنجاح! <a href="login.html">تسجيل الدخول</a> الآن.';
    
    // Clear form
    document.getElementById('registerForm').reset();
    
    // Show toast
    showToast('🎉 تم إنشاء الحساب بنجاح!', 'success');
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
}

// ===== HANDLE LOGOUT =====
function handleLogout(e) {
    e.preventDefault();
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    
    showToast('👋 تم تسجيل الخروج بنجاح!', 'info');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ===== LOAD DASHBOARD DATA =====
function loadDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update profile info
    document.getElementById('displayUsername').textContent = currentUser.username;
    document.getElementById('displayEmail').textContent = currentUser.email;
    document.getElementById('displayDate').textContent = currentUser.registeredAt || '2026-01-15';
    document.getElementById('displayLevel').textContent = getLevelName(currentUser.level);
    document.getElementById('userLevel').textContent = getLevelName(currentUser.level);
    
    // Update welcome message
    document.getElementById('welcomeMessage').textContent = `👋 مرحباً، ${currentUser.username}`;
}

// ===== GET LEVEL NAME =====
function getLevelName(level) {
    const levels = {
        'beginner': 'مبتدئ',
        'intermediate': 'متوسط',
        'advanced': 'متقدم'
    };
    return levels[level] || 'مبتدئ';
}

// ===== EDIT PROFILE =====
function editProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const newUsername = prompt('✏️ أدخل اسم المستخدم الجديد:', currentUser.username);
    if (newUsername && newUsername.trim().length >= 3) {
        // Update in users array
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].username = newUsername.trim();
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user
            currentUser.username = newUsername.trim();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update display
            document.getElementById('displayUsername').textContent = currentUser.username;
            document.getElementById('welcomeMessage').textContent = `👋 مرحباً، ${currentUser.username}`;
            
            showToast('✅ تم تحديث اسم المستخدم بنجاح!', 'success');
        }
    } else if (newUsername !== null) {
        showToast('❌ اسم المستخدم يجب أن يكون 3 أحرف على الأقل!', 'error');
    }
}

// ===== SETUP SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SETUP PROGRESS ANIMATION =====
function setupProgressAnimation() {
    const progressBars = document.querySelectorAll('.progress, .mini-bar div');
    
    const animateProgress = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                if (width && !bar.dataset.animated) {
                    bar.dataset.animated = 'true';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }
            }
        });
    };
    
    const observer = new IntersectionObserver(animateProgress, {
        threshold: 0.3
    });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===== PREVENT FORM RESUBMISSION =====
if (window.history && window.history.replaceState) {
    window.addEventListener('load', function() {
        if (window.history.state === null) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Press Escape to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.getElementById('hamburger');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.textContent = '☰';
        }
    }
});

console.log('📚 جميع الوظائف تم تحميلها بنجاح!');