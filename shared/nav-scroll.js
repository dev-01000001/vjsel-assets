/**
 * SHARED NAV-SCROLL - Swiper Navigation Scroll
 * Tự động chuyển đổi thanh điều hướng chính thành Swiper
 * với mũi tên < > ở responsive (< 1440px)
 *
 * Hỗ trợ:
 *   - System A: .top-nav__menu (HomePage, HomePage_EN)
 *   - System B: .main-nav (DetailPage, DetailLock, DetailPage_EN, IssuePage, SearchPage)
 *
 * Rule: KHÔNG thay đổi DOM gì ở 1440px+
 *       Chỉ build DOM khi < 1440px, teardown khi >= 1440px
 */
(function () {
  "use strict";

  var BREAKPOINT = 1440;
  var swiperInstance = null;
  var isDomBuilt = false;
  var navEl = null;
  var navParent = null;
  var navOriginalParent = null; // lưu parent gốc để restore
  var navNextSibling = null; // lưu vị trí gốc để restore
  var swiperContainer = null;
  var arrowsContainer = null;
  var prevBtn = null;
  var nextBtn = null;
  var systemType = null;

  var CHEVRON_LEFT =
    '<svg viewBox="0 0 16 16"><polyline points="10 3 5 8 10 13"/></svg>';
  var CHEVRON_RIGHT =
    '<svg viewBox="0 0 16 16"><polyline points="6 3 11 8 6 13"/></svg>';

  function detectNavSystem() {
    var mainNav = document.querySelector(".site-header__nav .main-nav");
    if (mainNav) {
      navEl = mainNav;
      navParent = mainNav.closest(".site-header__nav");
      systemType = "B";
      return true;
    }
    var topNavMenu = document.querySelector(
      ".top-nav__container .top-nav__menu",
    );
    if (topNavMenu) {
      navEl = topNavMenu;
      navParent = topNavMenu.closest(".top-nav__container");
      systemType = "A";
      return true;
    }
    return false;
  }

  function buildDom() {
    if (isDomBuilt) return;

    // Lưu vị trí gốc của navEl để có thể restore
    navOriginalParent = navEl.parentNode;
    navNextSibling = navEl.nextSibling;

    // 1. Tạo swiper container
    swiperContainer = document.createElement("div");
    swiperContainer.className = "nav-scroll-swiper swiper";

    // 2. Thêm swiper classes
    navEl.classList.add("swiper-wrapper");
    var items = navEl.children;
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("swiper-slide");
    }

    // 3. Wrap navEl trong swiper container
    navOriginalParent.insertBefore(swiperContainer, navEl);
    swiperContainer.appendChild(navEl);

    // 4. Tạo arrows (chỉ tạo 1 lần, reuse)
    if (!arrowsContainer) {
      arrowsContainer = document.createElement("div");
      arrowsContainer.className = "nav-scroll-arrows";

      prevBtn = document.createElement("button");
      prevBtn.className = "nav-scroll-prev";
      prevBtn.setAttribute("aria-label", "Previous");
      prevBtn.setAttribute("type", "button");
      prevBtn.innerHTML = CHEVRON_LEFT;

      nextBtn = document.createElement("button");
      nextBtn.className = "nav-scroll-next";
      nextBtn.setAttribute("aria-label", "Next");
      nextBtn.setAttribute("type", "button");
      nextBtn.innerHTML = CHEVRON_RIGHT;

      arrowsContainer.appendChild(prevBtn);
      arrowsContainer.appendChild(nextBtn);
    }

    // 5. Insert arrows
    if (systemType === "A") {
      var actions = navParent.querySelector(".top-nav__actions");
      if (actions) {
        navParent.insertBefore(arrowsContainer, actions);
      } else {
        navParent.appendChild(arrowsContainer);
      }
    } else {
      navParent.appendChild(arrowsContainer);
    }

    arrowsContainer.style.display = "flex";
    navParent.classList.add("nav-scroll-enabled");
    isDomBuilt = true;
  }

  function teardownDom() {
    if (!isDomBuilt) return;

    // 1. Destroy Swiper trước
    destroySwiper();

    // 2. Gỡ swiper classes
    navEl.classList.remove("swiper-wrapper");
    // Xóa inline style mà Swiper thêm vào
    navEl.style.transform = "";
    navEl.style.transitionDuration = "";
    navEl.style.transitionTimingFunction = "";
    navEl.style.transitionDelay = "";
    navEl.style.transitionProperty = "";

    var items = navEl.children;
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("swiper-slide");
      items[i].style.width = "";
      items[i].style.marginRight = "";
    }

    // 3. Đưa navEl về vị trí gốc (unwrap khỏi swiperContainer)
    if (navNextSibling) {
      navOriginalParent.insertBefore(navEl, navNextSibling);
    } else {
      navOriginalParent.appendChild(navEl);
    }

    // 4. Gỡ swiperContainer khỏi DOM
    if (swiperContainer && swiperContainer.parentNode) {
      swiperContainer.parentNode.removeChild(swiperContainer);
    }

    // 5. Ẩn arrows
    if (arrowsContainer && arrowsContainer.parentNode) {
      arrowsContainer.parentNode.removeChild(arrowsContainer);
    }

    navParent.classList.remove("nav-scroll-enabled");
    isDomBuilt = false;
  }

  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    if (swiperInstance) return;
    if (!swiperContainer) return;

    swiperInstance = new Swiper(swiperContainer, {
      slidesPerView: "auto",
      spaceBetween: systemType === "A" ? 20 : 8,
      freeMode: {
        enabled: true,
        sticky: false,
        momentumBounce: false,
      },
      watchOverflow: true,
      watchSlidesProgress: true,
      resistance: true,
      resistanceRatio: 0.5,
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      on: {
        init: function () {
          updateArrowVisibility(this);
        },
        slideChange: function () {
          updateArrowVisibility(this);
        },
        reachBeginning: function () {
          updateArrowVisibility(this);
        },
        reachEnd: function () {
          updateArrowVisibility(this);
        },
        progress: function () {
          updateArrowVisibility(this);
        },
        resize: function () {
          updateArrowVisibility(this);
        },
      },
    });
  }

  function destroySwiper() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }

  function updateArrowVisibility(swiper) {
    if (!arrowsContainer) return;
    var hasOverflow = false;
    if (swiper && swiper.slides) {
      var totalWidth = 0;
      for (var i = 0; i < swiper.slides.length; i++) {
        totalWidth +=
          swiper.slides[i].offsetWidth +
          (i < swiper.slides.length - 1 ? swiper.params.spaceBetween : 0);
      }
      hasOverflow = totalWidth > swiper.width;
    }
    arrowsContainer.style.display = hasOverflow ? "flex" : "none";
  }

  /**
   * System B: dùng sticky với top âm để chỉ hiện nav row khi scroll
   * Logo + Actions bị đẩy lên trên viewport, chỉ nav dính lại
   */
  function updateStickyOffset() {
    if (systemType !== "B") return;
    var header = document.querySelector(".site-header");
    if (!header || !navParent) return;

    if (window.innerWidth < BREAKPOINT) {
      // Bắt buộc reflow trước khi đo
      header.offsetHeight;

      // navParent = .site-header__nav
      // offsetTop = khoảng cách từ top padding-edge của header đến top nav
      var navTop = navParent.offsetTop;

      // Fallback: nếu offsetTop = 0 (chưa reflow kịp), tính thủ công
      if (navTop <= 0) {
        // Đo chiều cao logo row = max(logo.offsetHeight, actions.offsetHeight) + padding-top + gap
        var logo = header.querySelector(".site-header__logo");
        var actions = header.querySelector(".site-header__actions");
        var logoH = logo ? logo.offsetHeight : 0;
        var actionsH = actions ? actions.offsetHeight : 0;
        var rowH = Math.max(logoH, actionsH);
        // Lấy computed padding-top và gap
        var cs = window.getComputedStyle(header);
        var padTop = parseFloat(cs.paddingTop) || 0;
        var rowGap = parseFloat(cs.rowGap) || parseFloat(cs.gap) || 0;
        navTop = padTop + rowH + rowGap;
      }

      if (navTop > 0) {
        header.style.setProperty("--header-sticky-top", "-" + navTop + "px");
      }
    } else {
      header.style.removeProperty("--header-sticky-top");
    }
  }

  function handleResize() {
    var width = window.innerWidth;

    if (width < BREAKPOINT) {
      // Responsive: build DOM + init Swiper
      if (!isDomBuilt) {
        buildDom();
      }
      if (!swiperInstance) {
        initSwiper();
      } else {
        swiperInstance.update();
        updateArrowVisibility(swiperInstance);
      }
    } else {
      // Desktop >= 1440px: teardown everything, restore original DOM
      if (isDomBuilt) {
        teardownDom();
      }
    }

    // Tính lại sticky offset (đợi 1 frame để layout xong)
    requestAnimationFrame(function () {
      updateStickyOffset();
    });
  }

  function init() {
    if (!detectNavSystem()) return;
    handleResize();

    // Tính lại sau khi mọi thứ đã load xong (fonts, images, etc.)
    if (systemType === "B") {
      window.addEventListener("load", function () {
        updateStickyOffset();
      });
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
