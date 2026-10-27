const releaseDate = new Date("2026-11-19T00:00:00");
const navButtons = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".page-panel");
const backgroundVideo = document.querySelector(".background-video");
const musicButtons = document.querySelectorAll(".music-toggle");
const skipButtons = document.querySelectorAll(".music-skip");
const celebrationCanvas = document.querySelector("#celebration-canvas");
let celebrationStarted = false;

function showPage(targetPage) {
    navButtons.forEach((button) => {
        const isActive = button.dataset.page === targetPage;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetPage);
    });
}

navButtons.forEach((button) => {
    button.addEventListener("click", () => showPage(button.dataset.page));
});

const backgroundAudio = new Audio();
backgroundAudio.preload = "auto";
backgroundAudio.volume = 0.45;

const musicCandidates = [
    "media/music1.mp3",
    "media/music2.mp3",
    "media/music3.mp3"
];

let musicIndex = 0;

function setAudioSource() {
    const nextTrack = musicCandidates[musicIndex % musicCandidates.length];
    backgroundAudio.src = nextTrack;
    backgroundAudio.load();
}

function updateMusicButtons(isPlaying) {
    musicButtons.forEach((button) => {
        button.textContent = isPlaying ? "❚❚ Pause" : "▶ Play";
        button.setAttribute("aria-label", isPlaying ? "Остановить музыку" : "Включить музыку");
        button.classList.toggle("is-playing", isPlaying);
    });
}

async function playCurrentTrack() {
    try {
        await backgroundAudio.play();
        updateMusicButtons(true);
    } catch (error) {
        updateMusicButtons(false);
    }
}

async function toggleMusic() {
    if (!backgroundAudio.src) {
        setAudioSource();
    }

    if (backgroundAudio.paused) {
        try {
            await playCurrentTrack();
        } catch (error) {
            updateMusicButtons(false);
        }
    } else {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        updateMusicButtons(false);
    }
}

async function skipMusic() {
    const shouldPlay = !backgroundAudio.paused;
    musicIndex = (musicIndex + 1) % musicCandidates.length;
    setAudioSource();

    if (shouldPlay) {
        await playCurrentTrack();
    }
}

musicButtons.forEach((button) => {
    button.addEventListener("click", toggleMusic);
});

skipButtons.forEach((button) => {
    button.addEventListener("click", skipMusic);
});

backgroundAudio.addEventListener("ended", () => {
    musicIndex += 1;
    setAudioSource();
    playCurrentTrack();
});

function updateVideoOnScroll() {
    if (!backgroundVideo) return;

    const scrollValue = window.scrollY;
    const maxScroll = window.innerHeight * 0.95;
    const progress = Math.min(scrollValue / maxScroll, 1);
    const opacity = Math.max(0, 0.62 - progress * 0.7);

    backgroundVideo.style.opacity = opacity.toFixed(3);
    backgroundVideo.style.transform = `scale(${1.02 + progress * 0.12})`;
    document.body.classList.toggle("video-hidden", progress > 0.8);
}

function updateCountdown() {
    const difference = releaseDate - new Date();
    const countdown = document.querySelector(".countdown");

    if (!countdown) return;

    if (difference <= 0) {
        countdown.innerHTML = '<div class="release-celebration"><span class="celebration-kicker">ПРАЗДНИК НАЧАЛСЯ</span><h2>Игра уже вышла!</h2><p>Добро пожаловать в Леониду.</p></div>';
        startCelebration();
        return;
    }

    document.getElementById("days").textContent = Math.floor(difference / (1000 * 60 * 60 * 24));
    document.getElementById("hours").textContent = Math.floor((difference / (1000 * 60 * 60)) % 24);
    document.getElementById("minutes").textContent = Math.floor((difference / (1000 * 60)) % 60);
    document.getElementById("seconds").textContent = Math.floor((difference / 1000) % 60);
}

function startCelebration() {
    if (celebrationStarted || !celebrationCanvas) return;

    celebrationStarted = true;
    document.body.classList.add("celebration-active");

    const context = celebrationCanvas.getContext("2d");
    const particles = [];
    const fireworks = [];
    const colors = ["#ff4fa3", "#ffdd72", "#81f7ff", "#a77dff", "#ffffff"];

    function resizeCanvas() {
        const pixelRatio = window.devicePixelRatio || 1;
        celebrationCanvas.width = window.innerWidth * pixelRatio;
        celebrationCanvas.height = window.innerHeight * pixelRatio;
        celebrationCanvas.style.width = `${window.innerWidth}px`;
        celebrationCanvas.style.height = `${window.innerHeight}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function launchFirework() {
        fireworks.push({
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            targetY: 90 + Math.random() * window.innerHeight * 0.45,
            speed: 7 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function explode(firework) {
        for (let index = 0; index < 48; index += 1) {
            const angle = (Math.PI * 2 * index) / 48;
            const speed = 1.5 + Math.random() * 4;
            particles.push({
                x: firework.x,
                y: firework.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: firework.color
            });
        }
    }

    function animateCelebration() {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.globalCompositeOperation = "lighter";

        fireworks.forEach((firework, index) => {
            firework.y -= firework.speed;
            context.fillStyle = firework.color;
            context.fillRect(firework.x, firework.y, 3, 10);
            if (firework.y <= firework.targetY) {
                explode(firework);
                fireworks.splice(index, 1);
            }
        });

        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.045;
            particle.life -= 0.012;
            context.globalAlpha = Math.max(particle.life, 0);
            context.fillStyle = particle.color;
            context.fillRect(particle.x, particle.y, 3, 3);
            if (particle.life <= 0) particles.splice(index, 1);
        });

        context.globalAlpha = 1;
        window.requestAnimationFrame(animateCelebration);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.setInterval(launchFirework, 850);
    launchFirework();
    animateCelebration();
}

updateCountdown();
setInterval(updateCountdown, 1000);
window.addEventListener("scroll", updateVideoOnScroll, { passive: true });
window.addEventListener("load", updateVideoOnScroll);
updateVideoOnScroll();