function shuffle(array) {
  var j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

function fallbackImages() {
  var base = '/assets/images/parallax_fallback/';
  var availableImages = [
    {
      urls: { full: base + "mountain.jpg" },
      user: {
        name: "Samuel Scrimshaw",
        links: { html: "https://unsplash.com/photos/2oFdVd00xOg" },
      },
    },
    {
      urls: { full: base + "north.jpg" },
      user: {
        name: "Martin Jernberg",
        links: { html: "https://unsplash.com/photos/UdURxHDhrgY" },
      },
    },
    {
      urls: { full: base + "stars.jpg" },
      user: {
        name: "Nathan Anderson",
        links: { html: "https://unsplash.com/photos/L-7cP4p5hik" },
      },
    },
    {
      urls: { full: base + "stones.jpg" },
      user: {
        name: "Danny Postma",
        links: { html: "https://unsplash.com/photos/XqtJY5gTo5k" },
      },
    },
  ];

  return shuffle(availableImages);
};

function keywordSearch() {
  var keywords = ["forest-mountain", "nature", "tea", "books"];
  return shuffle(keywords)[0];
}

function buildPhotosFetcher() {
  var parallaxItems = $('.parallax');
  var photoCount = parallaxItems.length;
  var param = "8537fc6f3f82700ac356a09754ceac2d9c32286598268e44e09304e5e271cd52";

  return $.ajax({
    url: "https://api.unsplash.com/photos/random?query=" + keywordSearch() + "&count=" + photoCount + "&client_id=" + param
  }).done(function(response){
    return response;
  }).error(function(response){
    return fallbackImages();
  });
};

function appendPhotos(photos){
  var parallaxItems = $('.parallax');
  var referralText = "?utm_source=personal_site&utm_medium=referral&utm_content=creditCopyText";
  var unsplashLink = "https://unsplash.com/" + referralText;

  $.each(parallaxItems, function(index, parallaxItem){
    var image = photos[index];
    var userLink = image.user.links.html + referralText;
    var imageSrc = image.urls.full + referralText;

    $(parallaxItem).find(".attribution .artist-link").attr('href', userLink);
    $(parallaxItem).find(".attribution .artist-link").text(image.user.name);
    $(parallaxItem).find(".attribution .unsplash-link").attr('href', unsplashLink);
    $(parallaxItem).removeClass("parallax-loaded");
    $(parallaxItem).find('img').attr('src', imageSrc)
  });
};

function enableParallaxOnImage(e) {
  var image = $(e.target);
  var imageParallaxContainer = $(image).parents()[0];
  var imageSrc = $(image).attr('src');
  $(imageParallaxContainer).parallax({ imageSrc: imageSrc, speed: 0.8 });
  $(image).hide();
  $(imageParallaxContainer).addClass("parallax-loaded");
};

function fetchAndAttachImages(){
  Promise.all(buildPhotosFetcher()).then(function(result) {
    appendPhotos(result);
  });
};

$(document).ready(function() {
  document.querySelectorAll('.parallax img').forEach(function(image) {
    image.addEventListener('load', enableParallaxOnImage);
  });

  fetchAndAttachImages();

  // Handler for when Unsplash API is down
  window.addEventListener("unhandledrejection", function(e) {
    e.preventDefault();
    appendPhotos(fallbackImages());
  });
});
