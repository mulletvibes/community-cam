function getRandomCamera() {
  return CAMERAS[Math.floor(Math.random() * CAMERAS.length)];
}

function loadCamera(camera) {
  const frame = document.getElementById('camera-frame');
  frame.src =
    `https://www.youtube.com/embed/${camera.embedId}` +
    '?autoplay=1&mute=1&controls=0&disablekb=1&playsinline=1&iv_load_policy=3&rel=0';
}

// Chat panel toggle
const chatPanel  = document.getElementById('chat-panel');
const chatToggle = document.getElementById('chat-toggle');
const chatClose  = document.getElementById('chat-close');

chatToggle.addEventListener('click', () => {
  chatPanel.classList.add('open');
  chatToggle.classList.add('hidden');
});

chatClose.addEventListener('click', () => {
  chatPanel.classList.remove('open');
  chatToggle.classList.remove('hidden');
});

// Init — load a random camera on page load
loadCamera(getRandomCamera());
