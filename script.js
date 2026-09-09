const releaseDate = new Date("2026-11-19T00:00:00");

function updateCountdown() {
    const difference = releaseDate - new Date();

    if (difference <= 0) {
        document.querySelector(".countdown").innerHTML =
            "<h2>Игра уже вышла!</h2>";
        return;
    }

    document.getElementById("days").textContent =
        Math.floor(difference / (1000 * 60 * 60 * 24));

    document.getElementById("hours").textContent =
        Math.floor((difference / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").textContent =
        Math.floor((difference / (1000 * 60)) % 60);

    document.getElementById("seconds").textContent =
        Math.floor((difference / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);