function setupCarousel(carouselSlideId, prevBtnId, nextBtnId) {
    const imageWrapper = document.querySelector(`#${carouselSlideId}`);
    let imageItems = imageWrapper.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const delay = 2000;
    const perView = 3;
  
    for (let i = 0; i < perView; i++) {
      const clone = imageItems[i].cloneNode(true);
      imageWrapper.appendChild(clone);
    }
  
    const itemWidth = imageItems[0].offsetWidth + parseInt(getComputedStyle(imageItems[0]).marginRight);
  
    function updateCarousel() {
      imageWrapper.style.transition = 'transform 0.3s ease-out';
      imageWrapper.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
    }
  
    imageWrapper.addEventListener('transitionend', () => {
      imageItems = imageWrapper.querySelectorAll('.carousel-item');
      if (currentIndex >= imageItems.length - perView) {
        imageWrapper.style.transition = 'none';
        currentIndex = 0;
        imageWrapper.style.transform = `translateX(${0}px)`;
      }
    });
  
    let autoScroll = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, delay);
  
    imageWrapper.addEventListener('mouseenter', () => clearInterval(autoScroll));
    imageWrapper.addEventListener('mouseleave', () => autoScroll = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, delay));
  
    document.getElementById(prevBtnId).addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + imageItems.length) % imageItems.length;
      updateCarousel();
    });
  
    document.getElementById(nextBtnId).addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imageItems.length;
      updateCarousel();
    });
  }
  
  // Setup the first carousel
  setupCarousel('carouselSlide', 'prevBtn', 'nextBtn');
  // Setup the second carousel
  setupCarousel('carouselSlide2', 'prevBtn2', 'nextBtn2');
  // Setup the third carousel
  setupCarousel('carouselSlide3', 'prevBtn3', 'nextBtn3');