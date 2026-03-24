// =====================
// FLOATING LINK CARDS (FIXED)
// =====================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    const rect = card.getBoundingClientRect();

    card.x = Math.random() * (window.innerWidth - rect.width);
    card.y = Math.random() * (window.innerHeight - rect.height);

    // Ensure minimum speed so they never stop
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

        card.x += card.vx;
        card.y += card.vy;

        // Bounce LEFT
        if (card.x <= 0) {
            card.x = 0;
            card.vx = Math.abs(card.vx); // force right
        }

        // Bounce RIGHT
        if (card.x + width >= window.innerWidth) {
            card.x = window.innerWidth - width;
            card.vx = -Math.abs(card.vx); // force left
        }

        // Bounce TOP
        if (card.y <= 0) {
            card.y = 0;
            card.vy = Math.abs(card.vy); // force down
        }

        // Bounce BOTTOM
        if (card.y + height >= window.innerHeight) {
            card.y = window.innerHeight - height;
            card.vy = -Math.abs(card.vy); // force up
        }

        // Apply position
        card.style.left = card.x + "px";
        card.style.top = card.y + "px";
    });

    requestAnimationFrame(moveCards);
}

moveCards();
