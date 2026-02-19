/**
 * NEXUS AI - High-End Frontend Logic
 * Implements Interactive Neural Background, Magnetic UX, and Premium Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNeuralBackground();
    initMagneticButtons();
    initTypewriter();
    initScrollReveal();
    initStatsCounter();
    initCustomCursor();
});

/* --- 1. Loader Logic --- */
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }, 1500);
    });
}

/* --- 2. Neural Background (Canvas) --- */
function initNeuralBackground() {
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');

    let width, height, particles, orbs;
    const particleCount = 100;
    const orbCount = 3;
    const connectionDistance = 180;
    const mouse = { x: null, y: null, radius: 200 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Orb {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.r = Math.random() * 300 + 300;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.color = Math.random() > 0.5 ? 'var(--clr-primary)' : 'var(--clr-accent)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -this.r || this.x > width + this.r) this.vx *= -1;
            if (this.y < -this.r || this.y > height + this.r) this.vy *= -1;
        }

        draw() {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            gradient.addColorStop(0, this.color.includes('primary') ? 'rgba(56, 189, 248, 0.08)' : 'rgba(168, 85, 247, 0.08)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= dx * force * 0.03;
                    this.y -= dy * force * 0.03;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        orbs = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        for (let i = 0; i < orbCount; i++) orbs.push(new Orb());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(148, 163, 184, ${0.1 * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
}

/* --- 3. Magnetic Buttons --- */
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic');

    magnets.forEach((btn) => {
        btn.addEventListener('mousemove', function (e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseout', function () {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* --- 4. Typewriter Effect --- */
function initTypewriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;

    const words = JSON.parse(element.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentWord = words[wordIndex % words.length];

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 75;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --- 5. Custom Cursor --- */
function initCustomCursor() {
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    const links = document.querySelectorAll('a, button, .tilt');

    document.addEventListener('mousemove', (e) => {
        cursorOuter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorInner.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursorOuter.classList.add('expand'));
        link.addEventListener('mouseleave', () => cursorOuter.classList.remove('expand'));
    });
}

/* --- 6. Scroll Reveal & Tilt --- */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Simple Tilt Effect for Feature Cards
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xc = rect.width / 2;
            const yc = rect.height / 2;

            const dx = x - xc;
            const dy = y - yc;

            card.style.transform = `perspective(1000px) rotateX(${-dy / 20}deg) rotateY(${dx / 20}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* --- 7. Stats Counter --- */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const current = progress * target;

                    entry.target.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });

    counters.forEach(c => observer.observe(c));
}
