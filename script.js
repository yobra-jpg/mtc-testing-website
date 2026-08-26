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
