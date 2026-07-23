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
    
    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // ===== LESSONS PAGE =====
    if (document.querySelector('.lessons-page')) {
        // إضافة مستمعات لأزرار التصفية
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderLessons(this.dataset.filter);
            });
        });
        renderLessons('all');
    }
    
    // ===== QUIZZES PAGE =====
    if (document.querySelector('.quizzes-page')) {
        renderQuizzes();
    }
    
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
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (currentUser) {
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (userNameDisplay) {
            userNameDisplay.textContent = `👤 ${currentUser.username}`;
        }
        
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

// ===== HAMBURGER MENU - نسخة محسنة =====
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        // تبديل القائمة عند الضغط على الهامبرغر
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // إغلاق القائمة عند الضغط على أي رابط
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // إغلاق القائمة عند الضغط خارجها
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
        
        // إغلاق القائمة عند تغيير حجم الشاشة للوضع العادي
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
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

// ===== HANDLE CONTACT FORM =====
function handleContactForm(e) {
    e.preventDefault();
    showToast('📨 تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
    this.reset();
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
            
            // Update nav
            const userNameDisplay = document.getElementById('userNameDisplay');
            if (userNameDisplay) {
                userNameDisplay.textContent = `👤 ${currentUser.username}`;
            }
            
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

// =============================================
// LESSONS PAGE
// =============================================

// بيانات الدروس
const lessonsData = [
    {
        id: 1,
        title: 'الحروف الإنجليزية',
        description: 'تعلم الحروف الإنجليزية من A إلى Z مع النطق الصحيح',
        level: 'beginner',
        category: 'أساسيات',
        duration: '30 دقيقة',
        icon: '🔤',
        completed: true,
        videoUrl: '#'
    },
    {
        id: 2,
        title: 'الأرقام والأعداد',
        description: 'تعلم الأرقام من 1 إلى 100 وكيفية استخدامها في الحياة اليومية',
        level: 'beginner',
        category: 'أساسيات',
        duration: '25 دقيقة',
        icon: '🔢',
        completed: true,
        videoUrl: '#'
    },
    {
        id: 3,
        title: 'التحيات والمقدمات',
        description: 'تعلم كيفية التحية والتعريف بنفسك باللغة الإنجليزية',
        level: 'beginner',
        category: 'محادثات',
        duration: '35 دقيقة',
        icon: '👋',
        completed: false,
        videoUrl: '#'
    },
    {
        id: 4,
        title: 'الأزمنة في الإنجليزية',
        description: 'شرح الأزمنة المختلفة: المضارع، الماضي، والمستقبل',
        level: 'intermediate',
        category: 'قواعد',
        duration: '45 دقيقة',
        icon: '⏰',
        completed: false,
        videoUrl: '#'
    },
    {
        id: 5,
        title: 'المحادثات اليومية',
        description: 'محادثات شائعة في المطعم، السوق، والعمل',
        level: 'intermediate',
        category: 'محادثات',
        duration: '40 دقيقة',
        icon: '💬',
        completed: false,
        videoUrl: '#'
    },
    {
        id: 6,
        title: 'كتابة المقالات',
        description: 'تعلم كتابة مقالات احترافية باللغة الإنجليزية',
        level: 'advanced',
        category: 'كتابة',
        duration: '50 دقيقة',
        icon: '✍️',
        completed: false,
        videoUrl: '#'
    },
    {
        id: 7,
        title: 'المصطلحات المتقدمة',
        description: 'مصطلحات متقدمة في مجالات مختلفة: الطب، الهندسة، الأعمال',
        level: 'advanced',
        category: 'مفردات',
        duration: '55 دقيقة',
        icon: '📚',
        completed: false,
        videoUrl: '#'
    }
];

// دالة عرض الدروس
function renderLessons(filter = 'all') {
    const grid = document.getElementById('lessonsGrid');
    if (!grid) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};

    let filteredLessons = lessonsData;
    if (filter !== 'all') {
        filteredLessons = lessonsData.filter(lesson => lesson.level === filter);
    }

    if (filteredLessons.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <h3>لا توجد دروس في هذا المستوى</h3>
                <p>جرب اختيار مستوى آخر</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredLessons.map(lesson => {
        const isCompleted = userProgress[lesson.id]?.completed || lesson.completed || false;
        return `
            <div class="lesson-card" data-level="${lesson.level}">
                <div class="lesson-icon">${lesson.icon}</div>
                <div class="lesson-info">
                    <h3>${lesson.title}</h3>
                    <p>${lesson.description}</p>
                    <div class="lesson-meta">
                        <span class="lesson-level ${lesson.level}">${getLevelLabel(lesson.level)}</span>
                        <span class="lesson-duration">⏱ ${lesson.duration}</span>
                        <span class="lesson-category">📂 ${lesson.category}</span>
                    </div>
                    <div class="lesson-actions">
                        ${isCompleted ? 
                            '<span class="completed-badge">✅ مكتمل</span>' : 
                            `<button class="btn-start-lesson" onclick="startLesson(${lesson.id})">▶️ ابدأ الدرس</button>`
                        }
                        ${currentUser ? 
                            `<button class="btn-add-progress" onclick="toggleProgress(${lesson.id})">
                                ${isCompleted ? '📌 إزالة من المكتمل' : '✅ وضع كمكتمل'}
                            </button>` : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// دالة الحصول على اسم المستوى
function getLevelLabel(level) {
    const levels = {
        'beginner': 'مبتدئ',
        'intermediate': 'متوسط',
        'advanced': 'متقدم'
    };
    return levels[level] || level;
}

// دالة بدء الدرس
function startLesson(lessonId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast('⚠️ يجب تسجيل الدخول أولاً!', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const lesson = lessonsData.find(l => l.id === lessonId);
    if (!lesson) return;

    showToast(`🎓 بدء الدرس: ${lesson.title}`, 'info');
}

// دالة تبديل حالة التقدم
function toggleProgress(lessonId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast('⚠️ يجب تسجيل الدخول أولاً!', 'error');
        return;
    }

    let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    
    if (userProgress[lessonId]) {
        delete userProgress[lessonId];
        showToast('📌 تم إزالة الدرس من المكتملين', 'info');
    } else {
        userProgress[lessonId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        showToast('✅ تم إضافة الدرس إلى المكتملين!', 'success');
    }
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    renderLessons(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
}

// =============================================
// QUIZZES PAGE
// =============================================

// بيانات الاختبارات
const quizzesData = [
    {
        id: 1,
        title: 'اختبار المستوى المبتدئ',
        description: 'اختبر معرفتك بالأساسيات: الحروف، الأرقام، والتحيات',
        level: 'beginner',
        questions: 10,
        timeLimit: 15,
        icon: '🌟',
        questionsList: [
            {
                question: 'ما هو الحرف الأول في الأبجدية الإنجليزية؟',
                options: ['A', 'B', 'C', 'D'],
                correct: 0
            },
            {
                question: 'كيف تقول "مرحباً" بالإنجليزية؟',
                options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'],
                correct: 1
            },
            {
                question: 'ما هو الرقم "خمسة" بالإنجليزية؟',
                options: ['Three', 'Four', 'Five', 'Six'],
                correct: 2
            }
        ]
    },
    {
        id: 2,
        title: 'اختبار القواعد الأساسية',
        description: 'اختبر فهمك للقواعد الأساسية في اللغة الإنجليزية',
        level: 'intermediate',
        questions: 10,
        timeLimit: 20,
        icon: '📝',
        questionsList: [
            {
                question: 'اختر الجملة الصحيحة:',
                options: ['He go to school', 'He goes to school', 'He going to school', 'He gone to school'],
                correct: 1
            },
            {
                question: 'ما هو زمن "أنا أدرس" بالإنجليزية؟',
                options: ['I study', 'I studied', 'I will study', 'I am studying'],
                correct: 0
            }
        ]
    },
    {
        id: 3,
        title: 'اختبار المحادثات المتقدمة',
        description: 'اختبر مهاراتك في المحادثات المتقدمة والمصطلحات',
        level: 'advanced',
        questions: 10,
        timeLimit: 25,
        icon: '🎯',
        questionsList: [
            {
                question: 'ما هو المعنى الصحيح لكلمة "Comprehensive"؟',
                options: ['محدود', 'شامل', 'صعب', 'سهل'],
                correct: 1
            },
            {
                question: 'اختر الجملة الصحيحة في الماضي التام:',
                options: ['I had went', 'I had gone', 'I have gone', 'I went'],
                correct: 1
            }
        ]
    }
];

// دالة عرض الاختبارات
function renderQuizzes() {
    const grid = document.getElementById('quizzesGrid');
    if (!grid) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || {};

    grid.innerHTML = quizzesData.map(quiz => {
        const result = quizResults[quiz.id];
        const isCompleted = result !== undefined;
        const score = result?.score || 0;
        const passed = result?.passed || false;

        return `
            <div class="quiz-card" data-level="${quiz.level}">
                <div class="quiz-icon">${quiz.icon}</div>
                <div class="quiz-info">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    <div class="quiz-meta">
                        <span class="quiz-level ${quiz.level}">${getLevelLabel(quiz.level)}</span>
                        <span class="quiz-questions">📋 ${quiz.questions} أسئلة</span>
                        <span class="quiz-time">⏱ ${quiz.timeLimit} دقيقة</span>
                    </div>
                    <div class="quiz-actions">
                        ${isCompleted ? 
                            `<div class="quiz-result ${passed ? 'passed' : 'failed'}">
                                ${passed ? '✅ نجحت!' : '❌ لم تنجح'}
                                <span>النتيجة: ${score}%</span>
                            </div>` : 
                            `<button class="btn-start-quiz" onclick="startQuiz(${quiz.id})">🚀 ابدأ الاختبار</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// دالة بدء الاختبار
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

function startQuiz(quizId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast('⚠️ يجب تسجيل الدخول أولاً!', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const quiz = quizzesData.find(q => q.id === quizId);
    if (!quiz) return;

    currentQuiz = quiz;
    currentQuestionIndex = 0;
    userAnswers = new Array(quiz.questionsList.length).fill(-1);

    document.getElementById('quizModal').style.display = 'flex';
    document.getElementById('quizTitle').textContent = quiz.title;
    
    renderQuestion();
}

// دالة عرض السؤال
function renderQuestion() {
    const body = document.getElementById('quizBody');
    if (!currentQuiz || !body) return;

    const questions = currentQuiz.questionsList;
    const total = questions.length;
    const current = currentQuestionIndex;
    const question = questions[current];

    let html = `
        <div class="question-progress">
            <span>السؤال ${current + 1} من ${total}</span>
            <div class="progress-bar">
                <div class="progress" style="width: ${((current + 1) / total) * 100}%;"></div>
            </div>
        </div>
        <div class="question-text">
            <h3>${question.question}</h3>
        </div>
        <div class="options-grid">
    `;

    question.options.forEach((option, index) => {
        const isSelected = userAnswers[current] === index;
        html += `
            <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectOption(${index})">
                <span class="option-label">${String.fromCharCode(65 + index)}.</span>
                <span class="option-text">${option}</span>
                ${isSelected ? '<span class="option-check">✓</span>' : ''}
            </div>
        `;
    });

    html += `
        </div>
        <div class="question-nav">
            <button class="btn-nav" onclick="prevQuestion()" ${current === 0 ? 'disabled' : ''}>
                السابق ←
            </button>
            <span class="question-counter">${current + 1}/${total}</span>
            <button class="btn-nav" onclick="nextQuestion()" ${current === total - 1 ? 'disabled' : ''}>
                → التالي
            </button>
        </div>
    `;

    body.innerHTML = html;
}

// دالة اختيار إجابة
function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    renderQuestion();
}

// دالة السؤال التالي
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questionsList.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

// دالة السؤال السابق
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// دالة إرسال الاختبار
function submitQuiz() {
    if (!currentQuiz) return;

    // التحقق من الإجابة على جميع الأسئلة
    const unanswered = userAnswers.some(answer => answer === -1);
    if (unanswered) {
        showToast('⚠️ يجب الإجابة على جميع الأسئلة!', 'error');
        return;
    }

    // حساب النتيجة
    const questions = currentQuiz.questionsList;
    let correct = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            correct++;
        }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;

    // حفظ النتيجة
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || {};
    quizResults[currentQuiz.id] = {
        score: score,
        passed: passed,
        completedAt: new Date().toISOString(),
        correct: correct,
        total: questions.length
    };
    localStorage.setItem('quizResults', JSON.stringify(quizResults));

    // عرض النتيجة
    const body = document.getElementById('quizBody');
    body.innerHTML = `
        <div class="quiz-result-final ${passed ? 'passed' : 'failed'}">
            <div class="result-icon">${passed ? '🎉' : '💪'}</div>
            <h2>${passed ? 'تهانينا! لقد نجحت!' : 'حاول مرة أخرى!'}</h2>
            <div class="result-score">
                <span class="score-number">${score}%</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${score}%;"></div>
                </div>
            </div>
            <p>أجبت بشكل صحيح على ${correct} من ${questions.length} أسئلة</p>
            <button class="btn-submit" onclick="closeQuiz()">إغلاق</button>
        </div>
    `;

    document.querySelector('.modal-footer').style.display = 'none';
    showToast(`✅ تم إرسال الاختبار! النتيجة: ${score}%`, passed ? 'success' : 'error');
}

// دالة إغلاق الاختبار
function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
    document.querySelector('.modal-footer').style.display = 'flex';
    currentQuiz = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    renderQuizzes();
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
            if (hamburger) hamburger.classList.remove('active');
        }
    }
});

console.log('📚 جميع الوظائف تم تحميلها بنجاح!');
// ===== SIDEBAR TOGGLE =====
function setupSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            
            // Create overlay if not exists
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }
            overlay.classList.toggle('active');
            
            // Close sidebar when clicking overlay
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        });
        
        // Close sidebar when clicking a link (mobile)
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('open');
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });
    }
}

// ===== LOGOUT FROM SIDEBAR =====
function setupSidebarLogout() {
    const logoutBtn = document.getElementById('logoutBtnSidebar');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberMe');
            showToast('👋 تم تسجيل الخروج بنجاح!', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
    }
}

// استدعاء الوظائف عند تحميل الصفحة
// أضف هذا داخل document.addEventListener('DOMContentLoaded', function() {
// setupSidebar();
// setupSidebarLogout();
// });
