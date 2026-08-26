/* ============================================
   MercyLife Training College — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Loader ----
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
        }, 800);
    });
    // Fallback hide
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
    }, 2500);

    // ---- AOS ----
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }

    // ---- Announcement bar ----
    const announcement = document.getElementById('announcement');
    const navbar = document.getElementById('navbar');
    const closeBtn = document.querySelector('.announcement-close');
    if (closeBtn && announcement) {
        closeBtn.addEventListener('click', () => {
            announcement.classList.add('hidden');
            if (navbar) navbar.classList.add('announcement-hidden');
            sessionStorage.setItem('announcementClosed', '1');
        });
    }
    if (sessionStorage.getItem('announcementClosed') === '1' && announcement) {
        announcement.classList.add('hidden');
        if (navbar) navbar.classList.add('announcement-hidden');
    }

    // ---- Sticky navbar ----
    function updateNavbar() {
        if (!navbar) return;
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ---- Mobile nav ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Hero particles (subtle medical icons) ----
    const particlesEl = document.getElementById('particles');
    if (particlesEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const icons = ['✚', '❤', '🩺', '⚕', '💊', '🏥'];
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            p.textContent = icons[Math.floor(Math.random() * icons.length)];
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (12 + Math.random() * 12) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            p.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
            particlesEl.appendChild(p);
        }
    }

    // ---- Animated counters ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            countersStarted = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                const duration = 1800;
                const start = performance.now();
                const suffix = el.parentElement.querySelector('.stat-suffix');

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.floor(eased * target);
                    el.textContent = current + (target >= 100 ? '+' : target >= 10 ? '+' : '');
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target + (target >= 10 ? '+' : '');
                    }
                }
                requestAnimationFrame(update);
            });
        }
    }
    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    // ---- Testimonials slider ----
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    const totalSlides = track ? track.children.length : 0;

    function goToSlide(index) {
        if (!track) return;
        currentSlide = (index + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-advance
    if (totalSlides > 1) {
        setInterval(() => goToSlide(currentSlide + 1), 6000);
    }

    // ---- Back to top ----
    const backToTop = document.getElementById('backToTop');
    function updateBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ---- Intake Countdown ----
// Set target date: 27 September 2026 (adjust when college confirms real date)
(function () {
    const target = new Date('2026-09-27T08:00:00+03:00').getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    if (!daysEl) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const now = Date.now();
        let diff = target - now;
        if (diff < 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }
        const d = Math.floor(diff / 86400000);
        diff %= 86400000;
        const h = Math.floor(diff / 3600000);
        diff %= 3600000;
        const m = Math.floor(diff / 60000);
        diff %= 60000;
        const s = Math.floor(diff / 1000);
        daysEl.textContent = d;
        hoursEl.textContent = pad(h);
        minsEl.textContent = pad(m);
        secsEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
})();

// ---- Phase 3: Parallax hero ----
(function () {
    const heroImg = document.getElementById('heroImage');
    const hero = document.getElementById('hero');
    if (!heroImg || !hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const progress = -rect.top * 0.25;
                heroImg.style.transform = `scale(1.08) translateY(${progress}px)`;
            }
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---- Phase 3: Page transitions for internal links ----
(function () {
    const overlay = document.getElementById('pageTransition');
    if (!overlay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) return;
        if (link.target === '_blank') return;

        link.addEventListener('click', function (e) {
            // Same-page anchors already handled
            if (href.includes('.html') || href === '/' || !href.includes('#')) {
                e.preventDefault();
                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 320);
            }
        });
    });

    // Fade out overlay on load
    window.addEventListener('pageshow', () => {
        overlay.classList.remove('active');
    });
})();
