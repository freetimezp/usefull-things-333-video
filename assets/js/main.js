gsap.registerPlugin(ScrollTrigger);

/* LENIS SMOOTH SCROLL */
const lenis = new Lenis({
    duration: 1.2,
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* CONNECT LENIS TO SCROLLTRIGGER */
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* HERO INTRO */

/* SPLIT HERO TEXT */
const heroTitle = document.querySelector(".hero-title");
heroTitle.innerHTML = heroTitle.textContent
    .split("")
    .map((letter) => `<span>${letter}</span>`)
    .join("");

gsap.from(".hero-title span", {
    y: 100,
    opacity: 0,
    stagger: 0.13,
    duration: 1,
    ease: "power4.out",
});

gsap.from(".hero-sub", {
    y: 40,
    opacity: 0,
    delay: 0.8,
});

gsap.from(".btn", {
    scale: 0.8,
    opacity: 0,
    delay: 1,
});

/* VIDEO PARALLAX */
gsap.to(".video-wrapper video", {
    scale: 1,
    scrollTrigger: {
        scrub: true,
    },
});

/* MAGNETIC BUTTON */
const magnetic = document.querySelector(".magnetic");

magnetic.addEventListener("mousemove", (e) => {
    const rect = magnetic.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(magnetic, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
    });
});

magnetic.addEventListener("mouseleave", () => {
    gsap.to(magnetic, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1,0.4)",
    });
});

/* PROJECT REVEAL */
gsap.utils.toArray(".project-card").forEach((card) => {
    gsap.from(card, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        },
    });
});

/* ABOUT ANIMATION */
gsap.from(".about-content", {
    opacity: 0,
    y: 100,
    duration: 1.2,
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
    },
});

/* CUSTOM CURSOR */
const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
    });
});

/* 3D TILT */
document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const inner = card.querySelector(".card-inner");
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = -(y - rect.height / 2) / 15;
        const rotateY = (x - rect.width / 2) / 15;

        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.querySelector(".card-inner").style.transform = "rotateX(0) rotateY(0)";
    });
});

/* ================= PARTICLE SYSTEM ================= */

const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
const PARTICLE_COUNT = 120;
const mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Cursor repulsion
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const angle = Math.atan2(dy, dx);
                const force = (120 - dist) / 120;
                this.x += Math.cos(angle) * force * 3;
                this.y += Math.sin(angle) * force * 3;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = dx * dx + dy * dy;

            if (distance < 15000) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255,255,255,0.05)";
                ctx.lineWidth = 1;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
        p.update();
        p.draw();
    });

    connectParticles();

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
