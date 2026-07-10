/* 그 밤 · 干杯夜 — 交互 */
(function () {
  var video   = document.getElementById('liveVideo');
  var playBtn = document.getElementById('playBtn');
  var soundBtn= document.getElementById('soundBtn');
  var clip    = document.getElementById('clipAudio');
  var tracks  = document.querySelectorAll('.track');
  var cheers  = document.getElementById('cheers');

  /* ---- 视频：点击播放/暂停，喇叭切静音 ---- */
  function showPlay(show){ playBtn.classList.toggle('hidden', !show); }
  function toggleVideo(){
    if (video.paused){ video.play(); showPlay(false); }
    else { video.pause(); showPlay(true); }
  }
  if (video){
    video.addEventListener('click', toggleVideo);
    playBtn.addEventListener('click', toggleVideo);
    video.addEventListener('play',  function(){ showPlay(false); });
    video.addEventListener('pause', function(){ showPlay(true);  });
    // 自动尝试静音循环播放（移动端允许）
    video.play().then(function(){ showPlay(false); }).catch(function(){ showPlay(true); });
  }
  if (soundBtn){
    soundBtn.addEventListener('click', function(){
      video.muted = !video.muted;
      soundBtn.textContent = video.muted ? '🔈' : '🔊';
      if (!video.muted && video.paused) video.play();
    });
  }

  /* ---- 音频气泡：点一个播一个，互斥 ---- */
  var current = null;
  function stopAll(){
    tracks.forEach(function(t){ t.classList.remove('playing'); });
    clip.pause();
    current = null;
  }
  tracks.forEach(function(t){
    t.addEventListener('click', function(){
      var src = t.getAttribute('data-src');
      if (current === t){ stopAll(); return; }
      stopAll();
      clip.src = src;
      clip.play().catch(function(){});
      t.classList.add('playing');
      current = t;
    });
  });
  clip.addEventListener('ended', stopAll);

  /* ---- 干杯彩蛋：点标题/碰卡片，掉一串🍻 ---- */
  var emojis = ['🍻','🥂','🍺','✨','🔥'];
  function rainCheers(){
    for (var i=0;i<14;i++){
      (function(i){
        var s = document.createElement('span');
        s.className = 'drop';
        s.textContent = emojis[i % emojis.length];
        s.style.left = (Math.random()*100) + '%';
        s.style.animationDelay = (Math.random()*0.5) + 's';
        s.style.fontSize = (18 + Math.random()*20) + 'px';
        cheers.appendChild(s);
        setTimeout(function(){ s.remove(); }, 2000);
      })(i);
    }
  }
  var title = document.querySelector('.ai-title');
  if (title){ title.style.cursor='pointer'; title.addEventListener('click', rainCheers); }
  var tapHint = document.querySelector('.tap-hint');
  if (tapHint){ tapHint.style.cursor='pointer'; tapHint.addEventListener('click', rainCheers); }

  /* ---- Hero 顶部时钟：定格在拍摄时刻的氛围（静态展示，不走真实时间） ---- */
  // 保持 HTML 里的 21:47，作为“那一夜”的时间锚点，不做实时更新。
})();
