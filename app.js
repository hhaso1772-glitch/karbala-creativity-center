/* ==========================================================================
   Interactive Application Script - Karbala Creativity Center
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Core DOM Elements
    // ==========================================
    const mainHeader = document.getElementById('mainHeader');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    
    // Views and Navigation
    const viewSections = document.querySelectorAll('.view-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const navTriggers = document.querySelectorAll('.nav-trigger');
    
    // Category Modal Elements
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryModal = document.getElementById('categoryModal');
    const catModalOverlay = document.getElementById('catModalOverlay');
    const closeCatModalBtn = document.getElementById('closeCatModalBtn');
    const catModalIcon = document.getElementById('catModalIcon');
    const catModalTitle = document.getElementById('catModalTitle');
    const catModalDesc = document.getElementById('catModalDesc');
    const catModalDetailsList = document.getElementById('catModalDetailsList');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contactForm');

    // ==========================================
    // 2. Light / Dark Mode Toggle
    // ==========================================
    // Check localStorage preference, fallback to system
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // ==========================================
    // 3. Header Scroll Behavior
    // ==========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 4. SPA Views Switcher
    // ==========================================
    function switchView(viewId) {
        // Hide all views with animation transition
        viewSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target view
        const targetSection = document.getElementById(viewId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Trigger animations specific to active view
            if (viewId === 'home') {
                animateCounters();
            }
        }

        // Update Nav links
        navLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Mobile Drawer Links
        drawerLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile drawer if open
        closeMobileDrawer();
    }

    // Nav Links event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only capture internal view changes
            const viewId = link.getAttribute('data-view');
            if (viewId) {
                e.preventDefault();
                switchView(viewId);
                // Update URL hash without jumping
                history.pushState(null, null, `#${viewId}`);
            }
        });
    });

    // Drawer Links event listeners
    drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const viewId = link.getAttribute('data-view');
            if (viewId) {
                e.preventDefault();
                switchView(viewId);
                history.pushState(null, null, `#${viewId}`);
            }
        });
    });

    // Inline triggers (like footer links or buttons)
    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const targetId = trigger.getAttribute('data-target');
            if (targetId) {
                e.preventDefault();
                switchView(targetId);
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Handle URL hash on page load
    const currentHash = window.location.hash.substring(1);
    if (currentHash && document.getElementById(currentHash)) {
        switchView(currentHash);
    } else {
        switchView('home'); // Default view
    }

    // Listen to browser forward/back buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchView(hash);
        } else {
            switchView('home');
        }
    });

    // ==========================================
    // 5. Mobile Drawer Navigation
    // ==========================================
    function openMobileDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock body scroll
    }

    function closeMobileDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Unlock scroll
    }

    mobileMenuBtn.addEventListener('click', openMobileDrawer);
    closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    drawerOverlay.addEventListener('click', closeMobileDrawer);

    // ==========================================
    // 6. Statistics Counter Animation
    // ==========================================
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return; // run once
        
        const statNums = document.querySelectorAll('.stat-num');
        statNums.forEach(counter => {
            const target = +counter.getAttribute('data-val');
            const speed = 200; // Duration factor
            const increment = target / speed;
            
            const updateCount = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target + "+"; // add plus sign at final count
                }
            };
            updateCount();
        });
        
        countersAnimated = true;
    }

    // ==========================================
    // 7. Interactive Category Details Modal
    // ==========================================
    const categoryData = {
        humanitarian: {
            title: "الحالات الإنسانية",
            iconClass: "fa-solid fa-hand-holding-heart",
            iconTheme: "red-theme",
            desc: "نهتم بتقديم الدعم الكامل والمستدام للعوائل المتعففة، ورعاية الأيتام والمرضى، وتسهيل الإسعافات الطبية واللوجستية للحالات الحرجة والطارئة بالتنسيق مع الجهات والمستشفيات المختصة في محافظة كربلاء.",
            details: [
                "تقديم السلات الغذائية الدورية والمساعدات المادية العينية.",
                "كفالة الأيتام وتأمين مستلزمات دراستهم وتأهيلهم الاجتماعي.",
                "المساهمة في توفير الأدوية وإجراء العمليات الطبية للمستحقين.",
                "تقديم الدعم الإغاثي الطارئ في الحالات الجوية الصعبة أو الكوارث."
            ]
        },
        activities: {
            title: "النشاطات والفعاليات",
            iconClass: "fa-solid fa-calendar-check",
            iconTheme: "blue-theme",
            desc: "نسعى لتنشيط المحفل الشبابي والثقافي في كربلاء من خلال إقامة البرامج الفكرية والمؤتمرات المهرجانية السنوية التي تبرز طاقات ومواهب الشباب وتدعو للتعاون والمواطنة الإيجابية.",
            details: [
                "تنظيم مهرجانات تكريم المبدعين السنوية في كربلاء.",
                "إقامة مسابقات فكرية وثقافية شبابية بمشاركة واسعة.",
                "عقد ندوات ومؤتمرات تطوعية لنشر ثقافة التكافل الاجتماعي.",
                "إحياء المناسبات الدينية والوطنية بفعاليات خدمية وجمالية متميزة."
            ]
        },
        arbaeen: {
            title: "الزيارة الأربعينية",
            iconClass: "fa-solid fa-mosque",
            iconTheme: "green-theme",
            desc: "نتشرف سنوياً بتنظيم وتسيير مفارز خدمية وطبية وإرشادية متعددة لخدمة ملايين زوار أبي الأحرار الإمام الحسين (عليه السلام) الوافدين إلى كربلاء المقدسة في الزيارة الأربعينية المليونية.",
            details: [
                "مفرزة تنظيم وتسهيل انسيابية حركة مرور الزوار في قنطرة السلام وعون.",
                "مفرزة الإسعافات الطبية الطارئة والإسعاف الفوري بالتنسيق مع صحة كربلاء.",
                "مفارز الإرشاد الجغرافي للزائرين وتوزيع الدلائل الإرشادية.",
                "إسناد الكوادر الخدمية والبلدية في الحفاظ على النظافة والجمالية."
            ]
        },
        training: {
            title: "الورش التدريبية",
            iconClass: "fa-solid fa-chalkboard-user",
            iconTheme: "purple-theme",
            desc: "برنامج تدريبي متكامل يهدف لتمكين وتدريب الشباب وتنمية قدراتهم العملية والتكنولوجية والطبية، لسد الفجوة بين الحياة الأكاديمية والعملية التطوعية أو المهنية.",
            details: [
                "دورات الإسعافات الأولية والتأهيل الطبي للمفارز الأربعينية.",
                "ورش عمل في البرمجة والذكاء الاصطناعي ومهارات الحاسوب.",
                "دورات تدريبية حول الإدارة، التنمية البشرية، والقيادة المجتمعية.",
                "منح شهادات مشاركة معتمدة تفتح آفاقاً جديدة للمتطوعين."
            ]
        },
        participations: {
            title: "المشاركات والمؤتمرات",
            iconClass: "fa-solid fa-handshake",
            iconTheme: "orange-theme",
            desc: "نؤمن بأهمية تبادل الخبرات وبناء الشراكات، لذا يحرص مركزنا على التواجد والمشاركة في المؤتمرات والملتقيات الوطنية لتمثيل الكفاءات الشبابية الكربلائية وتنسيق العمل المشترك.",
            details: [
                "حضور مؤتمرات المنظمات الشبابية والعمل التطوعي على مستوى العراق.",
                "تنسيق زيارات ميدانية متبادلة مع فرق تطوعية في المحافظات الأخرى.",
                "المساهمة في صياغة مقترحات تطوير مشاريع العمل التطوعي العام.",
                "عقد شراكات مستدامة مع القطاعين الحكومي والخاص لدعم المبادرات."
            ]
        },
        initiatives: {
            title: "المبادرات التطوعية",
            iconClass: "fa-solid fa-wand-magic-sparkles",
            iconTheme: "teal-theme",
            desc: "مبادرات ميدانية تفاعلية تهدف لتحسين البيئة المحلية وإعادة الجمال والتشجير والتأهيل للمرافق الحيوية مثل المدارس والحدائق العامة لنشر روح المبادرة والجمالية.",
            details: [
                "حملات تشجير وزيادة المساحات الخضراء في الحسينية وعون.",
                "تزيين جدران المدارس وتصليح المقاعد الدراسية لاستقبال الطلاب.",
                "حملات تنظيف وتنظيم الساحات والحدائق العامة بالتنسيق مع البلدية.",
                "توزيع المياه والعصائر الباردة لعمال النظافة والزوار في فصل الصيف."
            ]
        }
    };

    function openModal(categoryKey) {
        const data = categoryData[categoryKey];
        if (!data) return;

        // Reset icon classes
        catModalIcon.className = `cat-modal-icon ${data.iconTheme}`;
        catModalIcon.innerHTML = `<i class="${data.iconClass}"></i>`;
        
        catModalTitle.innerText = data.title;
        catModalDesc.innerText = data.desc;

        // Populate list
        catModalDetailsList.innerHTML = '';
        data.details.forEach(detail => {
            const li = document.createElement('li');
            li.innerText = detail;
            catModalDetailsList.appendChild(li);
        });

        // Open modal
        categoryModal.classList.add('open');
        catModalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        categoryModal.classList.remove('open');
        catModalOverlay.classList.remove('open');
        if (!mobileDrawer.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    }

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryKey = card.getAttribute('data-category');
            openModal(categoryKey);
        });
    });

    closeCatModalBtn.addEventListener('click', closeModal);
    catModalOverlay.addEventListener('click', closeModal);

    // ==========================================
    // 8. Contact Form WhatsApp Redirect
    // ==========================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact_name');
            const emailInput = document.getElementById('contact_email');
            const phoneInput = document.getElementById('contact_phone');
            const msgInput = document.getElementById('contact_msg');
            
            let isValid = true;

            // Reset errors
            [nameInput, phoneInput, msgInput].forEach(input => {
                input.parentElement.parentElement.classList.remove('has-error');
            });

            // Name Validate
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Phone Validate (Should be numeric and simple Iraqi length)
            const phoneVal = phoneInput.value.trim();
            if (phoneVal === '' || phoneVal.length < 10) {
                phoneInput.parentElement.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Message Validate
            if (msgInput.value.trim() === '') {
                msgInput.parentElement.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (!isValid) return;

            // Format WhatsApp Message
            const whatsappNumber = '9647745532522';
            const emailText = emailInput.value.trim() ? emailInput.value.trim() : 'غير محدد';
            
            const message = `*رسالة جديدة من الموقع الإلكتروني لمركز إبداع كربلاء:*
            
👤 *الاسم:* ${nameInput.value.trim()}
📞 *رقم الهاتف:* ${phoneVal}
📧 *البريد الإلكتروني:* ${emailText}

✉️ *الرسالة:*
${msgInput.value.trim()}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Reset Form after sending
            contactForm.reset();
            alert("تم تجهيز رسالتك! سيتم تحويلك الآن لتطبيق واتساب لتأكيد الإرسال للإدارة.");
        });
    }

    // ==========================================
    // 9. Premium Interactive 3D Physics Tilt Loop (Borderless Logo)
    // ==========================================
    const heroGraphic = document.querySelector('.hero-graphic');
    const tiltCard = document.querySelector('.logo-tilt-card');
    const logoImg = document.querySelector('.hero-logo-img');
    
    if (heroGraphic && tiltCard) {
        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;
        
        let targetScale = 1;
        let currentScale = 1;
        
        let isHovered = false;
        
        // Physics Loop (Lerp)
        function updatePhysics() {
            const lerpFactor = 0.1; // Smoothness factor
            
            currentTiltX += (targetTiltX - currentTiltX) * lerpFactor;
            currentTiltY += (targetTiltY - currentTiltY) * lerpFactor;
            currentScale += (targetScale - currentScale) * lerpFactor;
            
            // Apply 3D tilt and scale to card
            tiltCard.style.transform = `rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) scale(${currentScale})`;
            
            // Parallax element inside (logo image lifts further)
            if (logoImg) {
                const zTranslate = isHovered ? 60 : 30;
                logoImg.style.transform = `translateZ(${zTranslate}px)`;
            }
            
            requestAnimationFrame(updatePhysics);
        }
        
        // Start Loop
        requestAnimationFrame(updatePhysics);
        
        // Mousemove events
        heroGraphic.addEventListener('mousemove', (e) => {
            isHovered = true;
            const rect = tiltCard.getBoundingClientRect();
            
            // Mouse coordinates relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalize inputs (-1 to 1)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const dx = (x - centerX) / centerX;
            const dy = (y - centerY) / centerY;
            
            // Target tilt limits (max 22 degrees)
            targetTiltX = -dy * 22;
            targetTiltY = dx * 22;
            targetScale = 1.05; // hover scale up
        });
        
        // Mouseleave event
        heroGraphic.addEventListener('mouseleave', () => {
            isHovered = false;
            targetTiltX = 0;
            targetTiltY = 0;
            targetScale = 1;
        });
        
        // Click press events
        tiltCard.addEventListener('mousedown', () => {
            targetScale = 0.94; // click compression
        });
        
        tiltCard.addEventListener('mouseup', () => {
            if (isHovered) {
                targetScale = 1.05;
            } else {
                targetScale = 1;
            }
        });
    }
});
