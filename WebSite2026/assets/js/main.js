// main script
(function () {
  "use strict";

  // Logo Slider
  // ----------------------------------------
  if (document.querySelector(".logo-slider")) {
    new Swiper(".logo-slider", {
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      slidesPerView: 2,
      breakpoints: {
        576: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
        992: {
          slidesPerView: 5,
        },
        1200: {
          slidesPerView: 6,
        },
      },
    });
  }

  // Blog Slider
  // ----------------------------------------
  if (document.querySelector(".blog-slider")) {
    new Swiper(".blog-slider", {
      spaceBetween: 24,
      loop: true,
      pagination: {
        el: ".blog-slider-pagination",
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        576: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      },
    });
  }

  // Testimonial Slider
  // ----------------------------------------
  if (document.querySelector(".testimonial-slider")) {
    new Swiper(".testimonial-slider", {
      spaceBetween: 24,
      loop: true,
      pagination: {
        el: ".testimonial-slider-pagination",
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      },
    });
  }
})();
