jQuery(document).ready(function () {
  "use strict"

  $(".body").ripples({ //function to get the  ripple water effect 
    dropRadius: 12,
    perturbance: 0.01,

  });
});

/////No F12

$(document).keydown(function (event) {
  if (event.keyCode == 123) {
    return false;
  }
  else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
    return false;
  }
});

$(document).on("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {

  var days = document.querySelector('.days span');
  var hour = document.querySelector('.hour');
  var min = document.querySelector('.min');
  var second = document.querySelector('.second');

  var startDate = new Date(2021, 2, 20);
  days.innerText = Math.floor((new Date - startDate) / 86400000);
  countTime();

  function countTime() {
    let today = new Date();
    let ms = (today - startDate) % 86400000;
    hour.innerText = Math.floor(ms / 3600000);
    min.innerText = Math.floor(ms % 3600000 / 60000);
    second.innerText = Math.floor(ms % 3600000 % 60000 / 1000);
  }

  setInterval(countTime, 1000);

}, false);


//loading///

; (function () {
  function id(v) { return document.getElementById(v); }
  function loadbar() {
    var ovrl = id("overlay"),
      prog = id("progress"),
      stat = id("progstat"),
      img = document.images,
      c = 0;
    tot = img.length;

    function imgLoaded() {
      c += 1;
      var perc = ((100 / tot * c) << 0) + "%";
      prog.style.width = perc;
      stat.innerHTML = "Loading " + perc;
      if (c === tot) return doneLoading();
    }
    function doneLoading() {
      ovrl.style.opacity = 0;
      setTimeout(function () {
        ovrl.style.display = "none";
      }, 1200);
    }
    for (var i = 0; i < tot; i++) {
      var tImg = new Image();
      tImg.onload = imgLoaded;
      tImg.onerror = imgLoaded;
      tImg.src = img[i].src;
    }
  }
  document.addEventListener('DOMContentLoaded', loadbar, false);
}());

//// swiperrr////
// var swiper = new Swiper(".box_video", {
//     effect: "cube",
//     grabCursor: true,
//     loop:true,
//     cubeEffect: {
//       shadow: true,
//       slideShadows: true,
//       shadowOffset: 20,
//       shadowScale: 0.94,
//     },
//   });

var swiper = new Swiper(".box_video", {
  effect: "cards",
  grabCursor: true,
});
