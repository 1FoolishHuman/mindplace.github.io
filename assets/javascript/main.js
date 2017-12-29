'use strict';

function addScrollEffectToNavbar(){
  var navbarEl = document.getElementById('navbar');
  var specialShadow = document.getElementById('specialShadow');
  var NAVBAR_HEIGHT = 52;
  var THRESHOLD = 52;
  var navbarOpen = false;
  var horizon = NAVBAR_HEIGHT;
  var whereYouStoppedScrolling = 0;
  var scrollFactor = 0;
  var currentTranslate = 0;

  function upOrDown(lastY, currentY) {
    if (currentY >= lastY) {
      return goingDown(currentY);
    }
    return goingUp(currentY);
  }

  function goingDown(currentY) {
    var trigger = NAVBAR_HEIGHT;
    whereYouStoppedScrolling = currentY;

    if (currentY > horizon) {
      horizon = currentY;
    }

    translateHeader(currentY, false);
  }

  function goingUp(currentY) {
    var trigger = 0;

    if (currentY < whereYouStoppedScrolling - NAVBAR_HEIGHT) {
      horizon = currentY + NAVBAR_HEIGHT;
    }

    translateHeader(currentY, true);
  }

  function constrainDelta(delta) {
    return Math.max(0, Math.min(delta, NAVBAR_HEIGHT));
  }

  function translateHeader(currentY, upwards) {
    // let topTranslateValue;
    var translateValue = void 0;

    if (upwards && currentTranslate == 0) {
      translateValue = 0;
    } else if (currentY <= NAVBAR_HEIGHT) {
      translateValue = currentY * -1;
    } else {
      var delta = constrainDelta(Math.abs(currentY - horizon));
      translateValue = delta - NAVBAR_HEIGHT;
    }

    if (translateValue != currentTranslate) {
      var navbarStyle = '\n        transform: translateY(' + translateValue + 'px);\n      ';
      currentTranslate = translateValue;
      navbarEl.setAttribute('style', navbarStyle);
    }

    if (currentY > THRESHOLD * 2) {
      scrollFactor = 1;
    } else if (currentY > THRESHOLD) {
      scrollFactor = (currentY - THRESHOLD) / THRESHOLD;
    } else {
      scrollFactor = 0;
    }

    var translateFactor = 1 + translateValue / NAVBAR_HEIGHT;
    specialShadow.style.opacity = scrollFactor;
    specialShadow.style.transform = 'scaleY(' + translateFactor + ')';
  }

  translateHeader(window.scrollY, false);

  var ticking = false;
  var lastY = 0;

  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        upOrDown(lastY, currentY);
        ticking = false;
        lastY = currentY;
      });
    }

    ticking = true;
  });
};

function manageParallax(){
  function shuffle(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
  }

  var availableImages = ["lady.jpg", "mountain.jpg", "north.jpg", "phone-flower.jpg", "stars.jpg"]
  shuffle(availableImages);

  var parallaxItems = $('.parallax');
  $.each(parallaxItems, function(index, item){
    var imageSRC = '/assets/images/' + availableImages[index];

    $(item).parallax({
      imageSrc: imageSRC,
      speed: 0.8
    });
  })
};

$(document).ready(function () {

  addScrollEffectToNavbar();
  manageParallax();

});
