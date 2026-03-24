// =====================
// FLOATING LINK CARDS (REAL BOUNCE)
// =====================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    const rect = card.getBoundingClientRect();

    // Startposition innerhalb des Screens
    card.x = Math.random() * (window.innerWidth - rect.width);
    card.y = Math.random() * (window.innerHeight - rect.height);

    // Konstante Geschwindigkeit
    const speed = 2 + Math.random() * 2;
    const angle = Math.random() * Math.PI * 2;

    card.vx = Math.cos(angle) * speed;
    card.vy = Math.sin(angle) * speed;

    card.style.left = card.x + "px";
    card.style.top = card.y + "px";
});

function moveCards() {
    cards.forEach(card => {

        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Bewegung
        card.x += card.vx;
        card.y += card.vy;

        // LEFT / RIGHT Bounce
        if (card.x <= 0 || card.x + width >= window.innerWidth) {
            if (card.x <= 0) card.x = 0;
            if (card.x + width >= window.innerWidth) {
                card.x = window.innerWidth - width;
            }

            card.vx *= -1;
        }

        // TOP / BOTTOM Bounce
        if (card.y <= 0 || card.y + height >= window.innerHeight) {
            if (card.y <= 0) card.y = 0;
            if (card.y + height >= window.innerHeight) {
                card.y = window.innerHeight - height;
            }

            card.vy *= -1;
        }

        // Mindestgeschwindigkeit sichern (kein Steckenbleiben)
        const minSpeed = 1.5;

        if (Math.abs(card.vx) < minSpeed) {
            card.vx = minSpeed * (card.vx < 0 ? -1 : 1);
        }

        if (Math.abs(card.vy) < minSpeed) {
            card.vy = minSpeed * (card.vy < 0 ? -1 : 1);
        }

        // Position anwenden
        card.style.left = card.x + "px";
        card.style.top = card.y + "px";
    });

    requestAnimationFrame(moveCards);
}

moveCards();


// =====================
// GALAXY BACKGROUND
// =====================

const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

let stars = [];

function createStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.6 + 0.1,
            alpha: Math.random(),
            twinkleSpeed: Math.random() * 0.02
        });
    }
}

createStars();

function drawGalaxy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {

        // Bewegung (nach unten driften)
        star.y += star.speed;

        // Reset wenn außerhalb
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

        // Twinkle Effekt
        star.alpha += (Math.random() - 0.5) * star.twinkleSpeed;
        star.alpha = Math.max(0.2, Math.min(1, star.alpha));

        // leichte Größenänderung
        const dynamicSize = star.size + Math.sin(Date.now() * 0.002) * 0.3;

        ctx.beginPath();
        ctx.arc(star.x, star.y, dynamicSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
    });

    requestAnimationFrame(drawGalaxy);
}

drawGalaxy();


// =====================
// WINDOW RESIZE HANDLING
// =====================

window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();

    // Karten im Bildschirm halten
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();

        if (card.x + rect.width > window.innerWidth) {
            card.x = window.innerWidth - rect.width;
        }

        if (card.y + rect.height > window.innerHeight) {
            card.y = window.innerHeight - rect.height;
        }
    });
});
