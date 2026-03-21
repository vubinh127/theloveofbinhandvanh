'use strict';

var audioCtx, analyser, sourceNode, audioEl;
var vizPlaying = false;
var vizMuted   = false;
var dataArr;
var fakePhase  = 0;

function initAudio() {
  if (audioCtx) return;
  audioEl    = document.getElementById('bgAudio');
  audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
  analyser   = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  dataArr    = new Uint8Array(analyser.frequencyBinCount);
  sourceNode = audioCtx.createMediaElementSource(audioEl);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);
}

function vizToggleMute() {
  if (!audioEl) audioEl = document.getElementById('bgAudio');
  vizMuted      = !vizMuted;
  audioEl.muted = vizMuted;
  document.getElementById('iconUnmute').style.display = vizMuted ? 'none'  : 'block';
  document.getElementById('iconMute'  ).style.display = vizMuted ? 'block' : 'none';
}

var canvas = document.getElementById('vizCanvas');
var ctx2d  = canvas.getContext('2d');
var BARS   = 40;

function resizeCanvas() {
  var dpr = window.devicePixelRatio || 1;
  canvas.width  = canvas.offsetWidth  * dpr;
  canvas.height = canvas.offsetHeight * dpr;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

function drawBars() {
  var W = canvas.width, H = canvas.height;
  var bw = (W / BARS) * 0.58, gap = (W / BARS) * 0.42;
  ctx2d.clearRect(0, 0, W, H);

  if (vizPlaying && analyser) analyser.getByteFrequencyData(dataArr);
  else fakePhase += 0.035;

  for (var i = 0; i < BARS; i++) {
    var val = vizPlaying && analyser
      ? dataArr[Math.floor(i * dataArr.length / BARS)] / 255
      : 0.07 + 0.05 * Math.sin(fakePhase + i * 0.4) + 0.03 * Math.sin(fakePhase * 1.6 + i * 0.85);

    var bh = Math.max(3, val * H * 0.86);
    var x  = i * (bw + gap) + gap / 2;
    var y  = (H - bh) / 2;

    var g = ctx2d.createLinearGradient(0, y, 0, y + bh);
    g.addColorStop(0, 'rgba(207,45,149,.9)');
    g.addColorStop(1, 'rgba(207,45,36,.7)');
    ctx2d.fillStyle = g;
    ctx2d.beginPath();
    if (ctx2d.roundRect) ctx2d.roundRect(x, y, bw, bh, 2);
    else ctx2d.rect(x, y, bw, bh);
    ctx2d.fill();
  }
  requestAnimationFrame(drawBars);
}
drawBars();

function enterSite() {
  var overlay = document.getElementById('overlay');
  overlay.style.opacity = '0';
  setTimeout(function () { overlay.style.display = 'none'; }, 900);

  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  audioEl.play().then(function () { vizPlaying = true; }).catch(function () {});
}

(function () {
  var prog = document.getElementById('progress');
  var stat = document.getElementById('progstat');
  var btn  = document.getElementById('getInBtn');
  var imgs = Array.from(document.images).filter(function (i) { return i.src; });
  var tot  = imgs.length, c = 0;

  function onLoad() {
    c++;
    var pct = Math.floor(100 / tot * c);
    prog.style.width = pct + '%';
    stat.textContent = 'Loading ' + pct + '%';
    if (c === tot) done();
  }

  function done() {
    stat.textContent = 'Ready ♥';
    prog.style.width = '100%';
    setTimeout(function () {
      stat.style.display = 'none';
      btn.style.display  = 'block';
    }, 500);
  }

  if (tot === 0) { done(); return; }
  imgs.forEach(function (img) {
    var t = new Image();
    t.onload = t.onerror = onLoad;
    t.src = img.src;
  });
}());

var modal = document.getElementById('mediaModal');

function openModal() { modal.classList.add('open'); }

function closeModal(e) {
  if (!e || e.target === modal || e.currentTarget !== modal) {
    modal.classList.remove('open');
    modal.querySelectorAll('video').forEach(function (v) { v.pause(); });
  }
}


document.addEventListener('DOMContentLoaded', function () {
  if (window.Swiper) {
    new Swiper('.box_video', { effect: 'cards', grabCursor: true, loop: true });
  }
  /* ripple — chạy sau khi jQuery và plugin đã load */
  if (window.$ && $.fn.ripples) {
    try { $('body').ripples({ dropRadius: 12, perturbance: 0.01 }); }
    catch (e) { /* WebGL không hỗ trợ thì bỏ qua */ }
  }
});


(function () {
  var startDate = new Date(2021, 2, 20);

  var elDays    = document.querySelector('.days span');
  var elHour    = document.querySelector('.hour');
  var elMin     = document.querySelector('.min');
  var elSec     = document.querySelector('.second');
  var elYears   = document.querySelector('.years');
  var elMonths  = document.querySelector('.months');
  var elWeeks   = document.querySelector('.weeks');
  var elDDays   = document.querySelector('.ddays');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function update() {
    var now  = new Date();
    var diff = now - startDate;

    elDays.textContent = Math.floor(diff / 86400000);

    var y = now.getFullYear() - startDate.getFullYear();
    var m = now.getMonth()    - startDate.getMonth();
    var d = now.getDate()     - startDate.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }

    elYears.textContent  = y;
    elMonths.textContent = m;
    elWeeks.textContent  = Math.floor(d / 7);
    elDDays.textContent  = d % 7;

    var ms = diff % 86400000;
    elHour.textContent = pad(Math.floor(ms / 3600000));
    elMin.textContent  = pad(Math.floor(ms % 3600000 / 60000));
    elSec.textContent  = pad(Math.floor(ms % 60000 / 1000));
  }

  update();
  setInterval(update, 1000);
}());


document.addEventListener('keydown', function (e) {
  if (e.keyCode === 123) e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault();
});
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });