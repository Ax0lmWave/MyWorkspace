const targetDate = new Date('2026-11-19T00:00:00');
const playBtn = document.querySelector('.play');

function updateCountdown() {
  const diff = targetDate - new Date();
  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

let isPlaying = false;

playBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? '❚❚ Pause' : '▶ Play';
});

updateCountdown();
setInterval(updateCountdown, 1000);
