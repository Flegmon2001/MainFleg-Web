// =====================
// SETUP
// =====================

const cards = Array.from(document.querySelectorAll(".card"));

const world = {
    width: window.innerWidth,
    height: window.innerHeight
};

// =====================
// INIT CARDS (CENTER + SMOOTH START)
// =====================

cards.forEach(card => {

    const rect = card.getBoundingClientRect();

    card.w = rect.width;
    card.h = rect.height;

    const centerX = world.width / 2;
    const centerY = world.height / 2;
    const spread = 120;

    // Spawn near center
    card.x = centerX - card.w / 2 + (Math.random() - 0.5) * spread;
    card.y = centerY - card.h / 2 + (Math.random() - 0.5) * spread;

    // Target velocity (full speed)
    const speed = 140 + Math.random() * 60;
    const angle = Math.random() * Math.PI * 2;

    card.targetVx = Math.cos(angle) * speed;
    card.targetVy = Math.sin(angle) * speed;

    // Start almost still
    card.vx = card.targetVx * 0.05;
    card.vy = card.targetVy * 0.05;

    // Life timer for smooth start
    card.life = 0;

    // Initial visual style
    card.style.opacity = 0;
    card.style.transform = `translate(${card.x}px, ${card.y}px) scale(0.8)`;
});

// =====================
// GAME LOOP
// =====================

let lastTime = 0;

function loop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    updateCards(dt);
    drawGalaxy(time);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// =====================
// CARD PHYSICS & SMOOTH START
// =====================

function updateCards(dt) {
    cards.forEach(card => {

        // Increase life (0→1 for easing)
        card.life += dt;
        const ease = Math.min(card.life * 0.8, 1);

        // Smooth acceleration towards target velocity
        card.vx += (card.targetVx - card.vx) * 0.02;
        card.vy += (card.targetVy - card.vy) * 0.02;

        // Move
        card.x += card.vx * dt;
        card.y += card.vy * dt;

        // ---- Bounce X ----
        if (card.x < 0) {
            card.x = 0;
            card.vx = Math.abs(card.vx);
        } else if (card.x + card.w > world.width) {
            card.x = world.width - card.w;
            card.vx = -Math.abs(card.vx);
        }

        // ---- Bounce Y ----
        if (card.y < 0) {
            card.y = 0;
            card.vy = Math.abs(card.vy);
        } else if (card.y + card.h > world.height) {
            card.y = world.height - card.h;
            card.vy = -Math.abs(card.vy);
        }

        // Ensure minimal speed (no sticking)
        const minSpeed = 60;
        if (Math.abs(card.vx) < minSpeed) card.vx = minSpeed * Math.sign(card.vx || 1);
        if (Math.abs(card.vy) < minSpeed) card.vy = minSpeed * Math.sign(card.vy || 1);

        // Visual smooth fade + scale
        const scale = 0.8 + ease * 0.2;
        card.style.opacity = ease;
        card.style.transform = `translate(${card.x}px, ${card.y}px) scale(${scale})`;
    });
}

// =====================
// GALAXY BACKGROUND
// =====================

const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");

function resize() {
    world.width = window.innerWidth;
    world.height = window.innerHeight;

    canvas.width = world.width;
    canvas.height = world.height;
}

resize();

let stars = [];

function createGalaxy() {
    stars = [];
    for (let i = 0; i < 300; i++) {
        const depth = Math.random();
        stars.push({
            x: Math.random() * world.width,
            y: Math.random() * world.height,
            z: depth,
            size: depth * 2 + 0.2,
            speed: depth * 40 + 10,
            phase: Math.random() * Math.PI * 2
        });
    }
}

createGalaxy();

function drawGalaxy(time) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.y += star.speed * 0.016;
        if (star.y > world.height) {
            star.y = 0;
            star.x = Math.random() * world.width;
        }

        const pulse = Math.sin(time * 0.002 + star.phase);
        const size = star.size * (1 + pulse * 0.3);

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + star.z * 0.7})`;
        ctx.fill();
    });
}

// =====================
// RESIZE HANDLING
// =====================

window.addEventListener("resize", () => {
    resize();
    createGalaxy();

    cards.forEach(card => {
        if (card.x + card.w > world.width) card.x = world.width - card.w;
        if (card.y + card.h > world.height) card.y = world.height - card.h;
    });
});
