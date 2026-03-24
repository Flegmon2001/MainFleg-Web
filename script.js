// =====================
// SETUP
// =====================

const cards = Array.from(document.querySelectorAll(".card"));

const world = {
    width: window.innerWidth,
    height: window.innerHeight
};

// =====================
// INIT CARDS
// =====================

cards.forEach(card => {

    const rect = card.getBoundingClientRect();

    card.w = rect.width;
    card.h = rect.height;

    // Startposition
    card.x = Math.random() * (world.width - card.w);
    card.y = Math.random() * (world.height - card.h);

    // Geschwindigkeit (gleichmäßig)
    const speed = 120 + Math.random() * 80; // px/sec
    const angle = Math.random() * Math.PI * 2;

    card.vx = Math.cos(angle) * speed;
    card.vy = Math.sin(angle) * speed;

    card.style.left = card.x + "px";
    card.style.top = card.y + "px";
});

// =====================
// GAME LOOP (SMOOTH)
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
// CARD PHYSICS
// =====================

function updateCards(dt) {
    cards.forEach(card => {

        // Bewegung
        card.x += card.vx * dt;
        card.y += card.vy * dt;

        // LEFT / RIGHT
        if (card.x <= 0) {
            card.x = 0;
            card.vx = Math.abs(card.vx);
        }
        else if (card.x + card.w >= world.width) {
            card.x = world.width - card.w;
            card.vx = -Math.abs(card.vx);
        }

        // TOP / BOTTOM
        if (card.y <= 0) {
            card.y = 0;
            card.vy = Math.abs(card.vy);
        }
        else if (card.y + card.h >= world.height) {
            card.y = world.height - card.h;
            card.vy = -Math.abs(card.vy);
        }

        // Position anwenden (GPU-friendly)
        card.style.transform = `translate(${card.x}px, ${card.y}px)`;
    });
}

// =====================
// GALAXY (PARALLAX)
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
        const depth = Math.random(); // 0 = far, 1 = near

        stars.push({
            x: Math.random() * world.width,
            y: Math.random() * world.height,
            z: depth,
            size: depth * 2 + 0.2,
            speed: depth * 30 + 10,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

createGalaxy();

function drawGalaxy(time) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {

        // Bewegung (Parallax)
        star.y += star.speed * 0.016;

        if (star.y > world.height) {
            star.y = 0;
            star.x = Math.random() * world.width;
        }

        // Twinkle + Größenvariation
        const pulse = Math.sin(time * 0.002 + star.twinkle) * 0.5 + 0.5;
        const size = star.size * (0.7 + pulse * 0.6);

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
        if (card.x + card.w > world.width) {
            card.x = world.width - card.w;
        }
        if (card.y + card.h > world.height) {
            card.y = world.height - card.h;
        }
    });
});
