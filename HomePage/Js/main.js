// Xử lý tương tác và hành vi động

(function () {
  'use strict';

  // Chờ DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', function () {

    // ═══════════════════════════════════════════════════════════
    // TÌM KIẾM
    // ═══════════════════════════════════════════════════════════

    const searchInput = document.querySelector('.hero__search-input');
    const searchBtn = document.querySelector('.hero__search-btn');

    if (searchBtn && searchInput) {
      // Xử lý click nút tìm kiếm
      searchBtn.addEventListener('click', handleSearch);

      // Xử lý phím Enter
      searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          handleSearch();
        }
      });
    }

    function handleSearch() {
      const query = searchInput.value.trim();

      if (query) {
        console.log('Đang tìm kiếm:', query);
        // TODO: Thực hiện chức năng tìm kiếm thực tế
        alert('Tìm kiếm: ' + query);
      } else {
        alert('Vui lòng nhập từ khóa tìm kiếm');
        searchInput.focus();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // ĐIỀU HƯỚNG (NAVIGATION)
    // ═══════════════════════════════════════════════════════════

    const navLinks = document.querySelectorAll('.top-nav__link');

    // Xử lý click link nav
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Cuộn mượt đến section nếu là anchor link
        if (href.startsWith('#')) {
          e.preventDefault();

          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }

          // Cập nhật trạng thái active
          updateActiveNavLink(this);
        }
      });
    });

    function updateActiveNavLink(activeLink) {
      // Xóa active khỏi tất cả link
      navLinks.forEach(link => {
        link.removeAttribute('aria-current');
      });

      // Set active cho link được click
      activeLink.setAttribute('aria-current', 'page');
    }

    // ═══════════════════════════════════════════════════════════
    // CHUYỂN ĐỔI NGÔN NGỮ
    // ═══════════════════════════════════════════════════════════

    const languageBtn = document.querySelector('.top-nav__language');
    const languageText = document.querySelector('.top-nav__language-text');

    if (languageBtn && languageText) {
      languageBtn.addEventListener('click', function () {
        const currentLang = languageText.textContent.trim();

        // Chuyển đổi giữa VI và EN
        if (currentLang === 'VI') {
          languageText.textContent = 'EN';
          console.log('Ngôn ngữ: Tiếng Anh');
          // TODO: Thực hiện chuyển đổi ngôn ngữ
        } else {
          languageText.textContent = 'VI';
          console.log('Ngôn ngữ: Tiếng Việt');
          // TODO: Thực hiện chuyển đổi ngôn ngữ
        }
      });
    }

    // ═══════════════════════════════════════════════════════════
    // NÚT ĐĂNG NHẬP
    // ═══════════════════════════════════════════════════════════

    const loginBtn = document.querySelector('.top-nav__btn--login');

    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        console.log('Click nút đăng nhập');
        // TODO: Thực hiện chức năng đăng nhập
        alert('Tính năng đăng nhập đang được phát triển');
      });
    }

    // ═══════════════════════════════════════════════════════════
    // HIỆU ỨNG CUỘN
    // ═══════════════════════════════════════════════════════════

    let lastScrollTop = 0;
    const nav = document.querySelector('.top-nav');

    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Thêm bóng đổ cho nav khi cuộn
      if (scrollTop > 10) {
        nav.style.boxShadow = '0px 4px 12px 0px rgba(0, 0, 0, 0.12)';
      } else {
        nav.style.boxShadow = '0px 2px 6px 0px rgba(0, 0, 0, 0.08)';
      }

      lastScrollTop = scrollTop;
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════
    // CHỈ BÁO CUỘN MENU MOBILE
    // ═══════════════════════════════════════════════════════════

    const menu = document.querySelector('.top-nav__menu');

    if (menu) {
      // Kiểm tra menu có thể cuộn không
      function checkMenuScroll() {
        const isScrollable = menu.scrollWidth > menu.clientWidth;

        if (isScrollable) {
          menu.classList.add('is-scrollable');
        } else {
          menu.classList.remove('is-scrollable');
        }
      }

      // Kiểm tra khi load và thay đổi kích thước
      checkMenuScroll();
      window.addEventListener('resize', checkMenuScroll);

      // Hiển thị bóng khi cuộn
      menu.addEventListener('scroll', function () {
        if (this.scrollLeft > 0) {
          this.classList.add('is-scrolled');
        } else {
          this.classList.remove('is-scrolled');
        }
      });
    }

    // ═══════════════════════════════════════════════════════════
    // CẢI THIỆN ACCESSIBILITY
    // ═══════════════════════════════════════════════════════════

    // Trap focus khi search được focus
    searchInput?.addEventListener('focus', function () {
      this.setAttribute('aria-expanded', 'true');
    });

    searchInput?.addEventListener('blur', function () {
      this.setAttribute('aria-expanded', 'false');
    });

    // Thông báo điều hướng cho trình đọc màn hình
    function announceNavigation(text) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = text;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }

    // ═══════════════════════════════════════════════════════════
    // HÀM TIỆN ÍCH
    // ═══════════════════════════════════════════════════════════

    // Hàm Debounce để tối ưu hiệu năng
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Kiểm tra phần tử có trong viewport không
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    // ═══════════════════════════════════════════════════════════
    // THÔNG TIN DEBUG
    // ═══════════════════════════════════════════════════════════

    console.log('%c Website VASEL ', 'background: #007fff; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log('Phiên bản: 1.0.0');
    console.log('Navigation và Hero đã khởi tạo thành công');

  });

})();

    // 
    // MOBILE SIDE MENU
    // 

    const navToggle = document.querySelector('.top-nav__toggle');
    const sideMenu = document.querySelector('.side-menu');
    const sideMenuOverlay = document.querySelector('.side-menu-overlay');
    const sideMenuClose = document.querySelector('.side-menu__close');
    const submenuToggles = document.querySelectorAll('.side-menu__submenu-toggle');

    // Open side menu
    if (navToggle && sideMenu && sideMenuOverlay) {
      navToggle.addEventListener('click', function () {
        sideMenu.classList.add('is-active');
        sideMenuOverlay.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    }

    // Close side menu function
    function closeSideMenu() {
        if (sideMenu && sideMenuOverlay) {
            sideMenu.classList.remove('is-active');
            sideMenuOverlay.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    }

    // Close when clicking close button
    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', closeSideMenu);
    }

    // Close when clicking overlay
    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', closeSideMenu);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('is-active')) {
            closeSideMenu();
        }
    });

    // Submenu Toggle
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle active state for button
            this.classList.toggle('is-active');
            
            // Toggle submenu visibility
            // The structure is button -> parent .side-menu__link-group -> sibling .side-menu__submenu
            const submenu = this.closest('.side-menu__item, .side-menu__subitem').querySelector('.side-menu__submenu');
            
            if (submenu) {
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
                // or just toggle class
                submenu.classList.toggle('is-open');
            }
        });
    });


    // 
    // SIDEBAR AUTHORS SHOW MORE
    // 
    
    const showMoreAuthorsBtn = document.getElementById('showMoreAuthorsBtn');
    
    if (showMoreAuthorsBtn) {
        showMoreAuthorsBtn.addEventListener('click', function() {
            const hiddenAuthors = document.querySelectorAll('.author-list__item--hidden');
            const btnText = this.querySelector('.sidebar-card__more-text');
            const isExpanded = this.classList.contains('is-expanded');
            
            if (!isExpanded) {
                // Show hidden authors
                hiddenAuthors.forEach(author => {
                    author.style.display = 'flex'; // Restore display flex
                });
                if (btnText) btnText.textContent = 'Thu gọn';
                this.classList.add('is-expanded');
            } else {
                // Hide authors again
                hiddenAuthors.forEach(author => {
                    author.style.display = 'none';
                });
                if (btnText) btnText.textContent = 'Xem thêm';
                this.classList.remove('is-expanded');
            }
        });
    }

