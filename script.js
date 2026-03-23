// =====================
// FLOATING LINK CARDS
// =====================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    // Random start position
    card.x = Math.random() * window.innerWidth;
    card.y = Math.random() * window.innerHeight;

    // Random direction
    card.vx = (Math.random() - 0.5) * 2;
    card.vy = (Math.random() - 0.5) * 2;

    card.style.left = card.x + "px";
    card.style.top = card.y + "px";
});

function moveCards() {
    cards.forEach(card => {
        card.x += card.vx;
        card.y += card.vy;

        const rect = card.getBoundingClientRect();

        // Bounce off walls
        if (rect.left <= 0 || rect.right >= window.innerWidth) {
            card.vx *= -1;
        }
        if (rect.top <= 0 || rect.bottom >= window.innerHeight) {
            card.vy *= -1;
        }

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

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5,
        alpha: Math.random()
    });
}

function drawGalaxy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        // Move star
        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

        // Twinkle
        star.alpha += (Math.random() - 0.5) * 0.05;
        star.alpha = Math.max(0.1, Math.min(1, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
    });

    requestAnimationFrame(drawGalaxy);
}

drawGalaxy();


// Resize fix
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
