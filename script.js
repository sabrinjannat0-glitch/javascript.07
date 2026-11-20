(function () {
  const MOBILE_MAX_WIDTH = 767;
  const MOBILE_SLIDE_LIMIT = 9;

  const brandsList = document.querySelector('.brands__list');
  const toggleBtn = document.querySelector('.brands__toggle');
  const toggleText = document.querySelector('.brands__toggle-text');
  const mobileMediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

  let brandsSwiper = null;
  let detachedMobileItems = [];

  function detachExtraMobileSlides() {
    if (detachedMobileItems.length > 0 || !brandsList) {
      return;
    }

    const items = Array.from(brandsList.children);
    if (items.length <= MOBILE_SLIDE_LIMIT) {
      return;
    }

    detachedMobileItems = items.slice(MOBILE_SLIDE_LIMIT);
    detachedMobileItems.forEach((item) => item.remove());
  }

  function restoreExtraSlides() {
    if (detachedMobileItems.length === 0 || !brandsList) {
      return;
    }

    detachedMobileItems.forEach((item) => brandsList.appendChild(item));
    detachedMobileItems = [];
  }

  function updateArrowButtonsAccessibility(isMobile) {
    document.querySelectorAll('.brands__go').forEach((btn) => {
      if (isMobile) {
        btn.removeAttribute('tabindex');
        btn.removeAttribute('aria-hidden');
      } else {
        btn.setAttribute('tabindex', '-1');
        btn.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function syncSwiperMode(isMobile) {
    if (isMobile) {
      detachExtraMobileSlides();

      if (!brandsSwiper && typeof Swiper !== 'undefined') {
        brandsSwiper = new Swiper('#brands-slider', {
          slidesPerView: 'auto',
          spaceBetween: 16,
          slidesOffsetBefore: 16,
          slidesOffsetAfter: 16,
        });
      }
    } else {
      if (brandsSwiper) {
        brandsSwiper.destroy(true, true);
        brandsSwiper = null;
      }

      restoreExtraSlides();
    }

    updateArrowButtonsAccessibility(isMobile);
  }

  if (brandsList) {
    brandsList.addEventListener('click', (event) => {
      const goBtn = event.target.closest('.brands__go');
      if (!goBtn || !brandsSwiper) {
        return;
      }

      event.preventDefault();
      if (brandsSwiper.isEnd) {
        brandsSwiper.slideTo(0);
      } else {
        brandsSwiper.slideNext();
      }
    });
  }

  if (toggleBtn && toggleText && brandsList) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = brandsList.classList.toggle('brands__list--expanded');
      toggleBtn.classList.toggle('brands__toggle--expanded', isExpanded);
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
      toggleText.textContent = isExpanded ? 'Hide' : 'Show all';
    });
  }

  syncSwiperMode(mobileMediaQuery.matches);
  mobileMediaQuery.addEventListener('change', (event) => {
    syncSwiperMode(event.matches);
  });
})();
