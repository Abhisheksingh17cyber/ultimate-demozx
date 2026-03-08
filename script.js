/* ============================================
   INTERNITY — ANIMATIONS & INTERACTIONS
   GSAP + ScrollTrigger + Lenis
   Smooth / Premium Edition
   ============================================ */

(function () {
    'use strict';

    // ========== LENIS SMOOTH SCROLL ==========
    const lenis = new Lenis({
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ========== PRELOADER ==========
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            gsap.to('#preloader', {
                display: 'none',
                duration: 0
            });
            document.body.style.overflow = '';
            initScrollAnimations();
        }
    });

    // Stagger letters in
    preloaderTl.to('.preloader-text span', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power4.out',
    });

    // Animate progress line
    preloaderTl.to('.preloader-line', {
        width: '140px',
        duration: 1,
        ease: 'expo.inOut',
    }, '-=0.3');

    // Hold then fade out
    preloaderTl.to('#preloader', {
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'expo.inOut',
    });

    // Animate hero content in after preloader
    preloaderTl.from('.brand-name', {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 1.2,
        ease: 'expo.out',
    }, '-=0.3');

    preloaderTl.to('.tagline-word, .tagline-divider', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
    }, '-=0.8');

    // ========== CUSTOM CURSOR (GSAP-driven for smoothness) ==========
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const canvas = document.getElementById('cursor-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let mouseX = -100, mouseY = -100;
    const particles = [];

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Use GSAP quickTo for silky smooth cursor movement
        if (cursorDot) {
            gsap.to(cursorDot, {
                left: mouseX,
                top: mouseY,
                duration: 0.1,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        }

        // Add particle trail
        if (particles.length < 25) {
            particles.push({
                x: mouseX,
                y: mouseY,
                alpha: 0.5,
                size: Math.random() * 2.5 + 1,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
            });
        }
    });

    // Smooth outline following with GSAP
    function animateCursor() {
        if (cursorOutline) {
            gsap.to(cursorOutline, {
                left: mouseX,
                top: mouseY,
                duration: 0.35,
                ease: 'power3.out',
                overwrite: 'auto',
            });
        }

        // Draw canvas particles
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.alpha -= 0.012;
                p.size *= 0.98;
                p.x += p.vx;
                p.y += p.vy;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(229, 26, 34, ${p.alpha})`;
                ctx.fill();
            }
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for interactive elements
    const interactives = document.querySelectorAll('a, button, input, .product-card, .nav-menu-btn');
    interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursorDot?.classList.add('hovering');
            cursorOutline?.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot?.classList.remove('hovering');
            cursorOutline?.classList.remove('hovering');
        });
    });

    // ========== SVG MASK BRAND NAME HOVER ==========
    const brandContainer = document.getElementById('brand-name-container');
    const maskCircle = document.querySelector('.mask-circle');

    if (brandContainer && maskCircle) {
        brandContainer.addEventListener('mousemove', (e) => {
            const rect = brandContainer.getBoundingClientRect();
            const svgW = 900;
            const svgH = 130;
            const x = ((e.clientX - rect.left) / rect.width) * svgW;
            const y = ((e.clientY - rect.top) / rect.height) * svgH;

            gsap.to(maskCircle, {
                attr: { cx: x, cy: y },
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        brandContainer.addEventListener('mouseenter', () => {
            gsap.to(maskCircle, { attr: { r: 450 }, duration: 0.8, ease: 'expo.out' });
        });

        brandContainer.addEventListener('mouseleave', () => {
            gsap.to(maskCircle, { attr: { r: 0 }, duration: 0.5, ease: 'expo.in' });
        });
    }

    // ========== NAV SCROLL BEHAVIOR ==========
    const navbar = document.getElementById('navbar');

    ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
            if (self.direction === 1 && window.scrollY > 80) {
                navbar?.classList.add('scrolled');
            }
            if (window.scrollY <= 80) {
                navbar?.classList.remove('scrolled');
            }
        }
    });

    // ========== MOBILE MENU ==========
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // ========== SCROLL-TRIGGERED ANIMATIONS ==========
    function initScrollAnimations() {

        // --- Scroll Gallery: Pinned grid dispersal ---
        const gridSection = document.querySelector('.scroll-gallery');
        if (gridSection) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.scroll-gallery',
                    start: 'top top',
                    end: '+=250%',
                    pin: true,
                    scrub: 1.5,
                }
            });

            // Layer 1: fly outward far
            const l1Items = document.querySelectorAll('.layer-1 .grid-item');
            const l1Offsets = [
                { x: '-120%', y: '-120%' },
                { x: '0%', y: '-140%' },
                { x: '120%', y: '-120%' },
                { x: '-120%', y: '120%' },
                { x: '0%', y: '140%' },
                { x: '120%', y: '120%' },
            ];
            l1Items.forEach((item, i) => {
                tl.to(item, {
                    x: l1Offsets[i].x,
                    y: l1Offsets[i].y,
                    opacity: 0,
                    scale: 0.4,
                    duration: 1,
                    ease: 'power3.inOut',
                }, 0);
            });

            // Layer 2: fly outward moderately
            const l2Items = document.querySelectorAll('.layer-2 .grid-item');
            const l2Offsets = [
                { x: '-90%', y: '-90%' },
                { x: '90%', y: '-90%' },
                { x: '-110%', y: '0%' },
                { x: '110%', y: '0%' },
                { x: '-90%', y: '90%' },
                { x: '90%', y: '90%' },
            ];
            l2Items.forEach((item, i) => {
                tl.to(item, {
                    x: l2Offsets[i].x,
                    y: l2Offsets[i].y,
                    opacity: 0,
                    scale: 0.5,
                    duration: 1,
                    ease: 'power3.inOut',
                }, 0.15);
            });

            // Layer 3: fade out
            tl.to('.layer-3 .grid-item', {
                opacity: 0,
                scale: 0.6,
                y: (i) => i === 0 ? '-80%' : '80%',
                duration: 1,
                ease: 'power3.inOut',
            }, 0.3);

            // Center scaler: zoom in
            tl.to('.scaler', {
                width: '100%',
                height: '100%',
                borderRadius: '0px',
                duration: 1.2,
                ease: 'expo.out',
            }, 0.5);

            tl.to('.scaler img', {
                scale: 1,
                duration: 1.2,
                ease: 'expo.out',
            }, 0.5);
        }

        // --- Marquee: smooth parallax speed shift ---
        gsap.to('.marquee-track', {
            x: '-20%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.marquee-strip',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
            }
        });

        // --- Product Cards: stagger reveal ---
        gsap.utils.toArray('.product-card').forEach((card, i) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: i * 0.12,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                }
            });
        });

        // --- Section titles: reveal ---
        gsap.utils.toArray('.reveal-text').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 60,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            });
        });

        // --- Story section: parallax image ---
        const storyImg = document.querySelector('.story-image img');
        if (storyImg) {
            gsap.to(storyImg, {
                y: '-15%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.story',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                }
            });
        }

        // --- Story content: fade in ---
        gsap.from('.story-content', {
            opacity: 0,
            x: -80,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.story',
                start: 'top 70%',
            }
        });

        gsap.from('.story-image-wrap', {
            opacity: 0,
            x: 80,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.story',
                start: 'top 70%',
            }
        });

        // --- Stats: count up ---
        document.querySelectorAll('.stat-number').forEach((num) => {
            const target = parseInt(num.getAttribute('data-target'));
            gsap.to(num, {
                textContent: target,
                duration: 2.5,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: num,
                    start: 'top 85%',
                }
            });
        });

        // --- CTA: slide in ---
        gsap.from('.cta-content', {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 75%',
            }
        });

        // --- Section labels: fade ---
        gsap.utils.toArray('.section-label').forEach((label) => {
            gsap.from(label, {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: label,
                    start: 'top 90%',
                }
            });
        });

        // --- Footer: stagger columns ---
        gsap.from('.footer-grid > div', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '#footer',
                start: 'top 85%',
            }
        });
    }

    // ========== FORM SUBMIT ==========
    const ctaForm = document.getElementById('cta-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = ctaForm.querySelector('.cta-btn');
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                ease: 'power2.in',
                onComplete: () => {
                    btn.textContent = '✓ Subscribed';
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'elastic.out(1, 0.4)',
                    });
                    setTimeout(() => {
                        btn.textContent = 'Subscribe';
                        ctaForm.reset();
                    }, 2500);
                }
            });
        });
    }

})();
