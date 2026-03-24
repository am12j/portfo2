// Initialize EmailJS with your User ID
// The user needs to setup EmailJS and put their public key here.
(function() {
    // Replace with your actual EmailJS public key
    emailjs.init("5VsgE2hT-8NlhMuCx");
})();

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Mobile Navigation Toggle
    ========================================= */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    /* =========================================
       2. Sticky Navbar & Active Link state
    ========================================= */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    /* =========================================
       3. Theme Toggle (Dark/Light Mode)
    ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        body.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'light') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Re-initialize ThreeJS colors based on theme if needed
        updateCanvasColors();
    });

    /* =========================================
       4. Form Submission via EmailJS
    ========================================= */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.innerText;
            btnText.innerText = 'Sending...';
            submitBtn.disabled = true;

            // These IDs need to match your EmailJS Service ID and Template ID
            // Make sure to replace them after signing up at emailjs.com
            const serviceID = 'service_ecgsvo6';
            const templateID = 'template_qiddefo';

            // Send via EmailJS
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                }, (err) => {
                    formStatus.textContent = 'Failed to send message. Please try again.';
                    formStatus.className = 'form-status error';
                    console.log(JSON.stringify(err));
                })
                .finally(() => {
                    btnText.innerText = originalText;
                    submitBtn.disabled = false;
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = 'form-status';
                    }, 5000);
                });
        });
    }

    /* =========================================
       5. GSAP Scroll Animations
    ========================================= */
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade up animation for sections
    const fadeUpElements = document.querySelectorAll('.gs_reveal');
    
    fadeUpElements.forEach((elem) => {
        let x = 0;
        let y = 50;
        
        if (elem.classList.contains('gs_reveal_fromLeft')) {
            x = -100;
            y = 0;
        } else if (elem.classList.contains('gs_reveal_fromRight')) {
            x = 100;
            y = 0;
        }

        elem.style.transform = `translate(${x}px, ${y}px)`;
        elem.style.opacity = "0";

        gsap.to(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Animation starts when element is 85% down the viewport
                toggleActions: "play none none reverse"
            },
            duration: 1,
            x: 0,
            y: 0,
            opacity: 1,
            ease: "power3.out"
        });
    });

    // Hero section entrance animation
    const heroTl = gsap.timeline();
    heroTl.from(".greeting", {y: 20, opacity: 0, duration: 0.5, delay: 0.2})
          .from(".name", {y: 20, opacity: 0, duration: 0.5}, "-=0.3")
          .from(".role", {y: 20, opacity: 0, duration: 0.5}, "-=0.3")
          .from(".intro", {y: 20, opacity: 0, duration: 0.5}, "-=0.3")
          .from(".hero-buttons", {y: 20, opacity: 0, duration: 0.5}, "-=0.3")
          .from(".social-links", {y: 20, opacity: 0, duration: 0.5}, "-=0.3");

    /* =========================================
       6. Background Animations
    ========================================= */
    initThreeJSBackground();
    initCanvasBackground();
    
    // Set initial visibility
    updateCanvasColors();
});

// Three.js Background Implementation (Dark Mode)
let scene, camera, renderer, particlesThree;

function initThreeJSBackground() {
    const container = document.getElementById('canvas-container-dark');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x58a6ff, // Matching accent blue color
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particlesThree = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particlesThree);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesThree.rotation.y += 0.001;
        particlesThree.rotation.x += 0.0005;
        
        particlesThree.rotation.y += 0.05 * (targetX - particlesThree.rotation.y);
        particlesThree.rotation.x += 0.05 * (targetY - particlesThree.rotation.x);
        
        particlesThree.position.y = Math.sin(elapsedTime * 0.5) * 2;

        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Interactive Canvas Background Implementation (Light Mode)
let canvas, ctx;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function initCanvasBackground() {
    const container = document.getElementById('canvas-container-light');
    if (!container) return;

    // Clear existing content (like old ThreeJS)
    container.innerHTML = '';

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle mouse movement
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Handle touch movement for mobile
    window.addEventListener('touchmove', function(event) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    });

    // Handle mouse out
    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle resize
    window.addEventListener('resize', function() {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
    });

    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.baseSize = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Bounce off walls
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;

            // Interactivity
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Slight attraction to mouse if close enough (creates the cluster effect)
                if (distance < mouse.radius) {
                    // Light mode stretch
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x += forceDirectionX * force * 2;
                    this.y += forceDirectionY * force * 2;

                    // Grow subtly when hovered
                    if (this.size < this.baseSize * 2) {
                        this.size += 0.2;
                    }
                } else if (this.size > this.baseSize) {
                    this.size -= 0.1;
                }
            } else if (this.size > this.baseSize) {
                this.size -= 0.1;
            }

            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        // Number of particles based on screen size
        let numberOfParticles = (canvas.width * canvas.height) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let dx = (Math.random() - 0.5) * 0.8; // Slow movement
            let dy = (Math.random() - 0.5) * 0.8;
            
            // Random base colors that will be overridden by theme colors later
            particles.push(new Particle(x, y, dx, dy, size, 'rgba(0,0,0,0)'));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Light mode matches the Google-style blue/purple scattered lines
        const lineColor = 'rgba(147, 51, 234, 0.15)';

        for (let i = 0; i < particles.length; i++) {
            // Alternate between blue and purple dots for light mode
            particles[i].color = (i % 2 === 0) ? 'rgba(66, 133, 244, 0.6)' : 'rgba(168, 85, 247, 0.6)';
            particles[i].update();
        }

        connectParticles(lineColor);
    }

    function connectParticles(lineColor) {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Maximum distance to draw a line
                let connectionDistance = (canvas.width / 7) * (canvas.height / 7);

                if (distance < 120) {
                    // Calculate opacity based on distance
                    opacityValue = 1 - (distance / 120);
                    
                    ctx.strokeStyle = lineColor.replace(/[\d\.]+\)$/g, `${opacityValue * 0.5})`);
                    ctx.lineWidth = 1;

                    // Draw the line
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
            
            // Draw lines from particles to mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particles[a].x - mouse.x;
                let dy = particles[a].y - mouse.y;
                let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                
                if (mouseDistance < mouse.radius) {
                    opacityValue = 1 - (mouseDistance / mouse.radius);
                    
                    // Stronger, slightly bolder cursor connection lines in light mode
                    let cursorLineColor = `rgba(66, 133, 244, ${opacityValue * 0.8})`;
                    
                    ctx.strokeStyle = cursorLineColor;
                    ctx.lineWidth = 1.5;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    animate();
}

function updateCanvasColors() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const darkContainer = document.getElementById('canvas-container-dark');
    const lightContainer = document.getElementById('canvas-container-light');
    
    if (darkContainer && lightContainer) {
        if (isLight) {
            darkContainer.style.opacity = '0';
            lightContainer.style.opacity = '1';
        } else {
            darkContainer.style.opacity = '1';
            lightContainer.style.opacity = '0';
        }
    }
}
