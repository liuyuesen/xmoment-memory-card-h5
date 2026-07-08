// Moment · Memory Card H5 — interactions
(function () {
  const video    = document.getElementById('liveVideo');
  const soundBtn = document.getElementById('soundBtn');
  const playBtn  = document.getElementById('playBtn');
  const audioBtn = document.getElementById('audioPlayBtn'); // optional (may be removed)
  const clipAudio= document.getElementById('clipAudio');
  const bubbles  = Array.from(document.querySelectorAll('.bubble'));

  // The Live is now the full 10s clip → loop the whole thing natively.

  // ---- Hero Live: loop, muted by default ----
  function tryPlay() {
    video.play().then(() => playBtn.classList.add('hidden'))
                .catch(() => playBtn.classList.remove('hidden'));
  }
  tryPlay();

  // center play button
  playBtn.addEventListener('click', () => {
    stopClip();
    video.muted = false; syncSoundIcon();
    tryPlay();
  });

  // tap the video: pause / play
  video.addEventListener('click', () => {
    if (video.paused) { tryPlay(); }
    else { video.pause(); playBtn.classList.remove('hidden'); }
  });

  // ---- sound toggle (Live video's own audio) ----
  function syncSoundIcon() { soundBtn.textContent = video.muted ? '🔇' : '🔊'; }
  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!video.muted) { video.muted = true; }
    else { stopClip(); video.muted = false; tryPlay(); } // unmuting Live stops any clip
    syncSoundIcon();
  });
  syncSoundIcon();

  // ---- Per-line audio: click a bubble → play that line's own clip file ----
  let activeEl = null;

  function resetActive() {
    if (activeEl) {
      activeEl.classList.remove('playing');
      const ic = activeEl.querySelector('.bub-play') || activeEl.querySelector('.ap-icon');
      if (ic) ic.textContent = '▶';
      if (audioBtn && activeEl === audioBtn) audioBtn.querySelector('.ap-text').textContent = 'Play the live sound';
    }
    activeEl = null;
  }

  function stopClip() {
    clipAudio.pause();
    resetActive();
  }

  function playClip(src, el) {
    // a clip and the Live audio shouldn't talk over each other
    video.muted = true; syncSoundIcon();

    // toggle off if the same element is already playing
    if (activeEl === el && !clipAudio.paused) { stopClip(); return; }

    resetActive();
    activeEl = el;
    el.classList.add('playing');
    const ic = el.querySelector('.bub-play') || el.querySelector('.ap-icon');
    if (ic) ic.textContent = '❚❚';
    if (audioBtn && el === audioBtn) audioBtn.querySelector('.ap-text').textContent = 'Playing…';

    // swap source only when it changes, then (re)load so it's ready to play
    if (clipAudio.getAttribute('src') !== src) {
      clipAudio.setAttribute('src', src);
      clipAudio.load();
    }
    try { clipAudio.currentTime = 0; } catch (e) {}
    clipAudio.play().catch(() => {});
  }

  clipAudio.addEventListener('ended', stopClip);

  bubbles.forEach((b) => {
    b.addEventListener('click', () => playClip(b.dataset.src, b));
  });

  // "Play the live sound" → play the full original clip audio (button is optional)
  if (audioBtn) audioBtn.addEventListener('click', () => playClip(audioBtn.dataset.src, audioBtn));

  // ---- light fade-in as sections scroll into view ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.style.opacity = 1;
        en.target.style.transform = 'translateY(0)';
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.module, .card-footer').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
})();
