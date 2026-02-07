// Trang chi tiết - Cấu trúc BEM
// Xử lý các tương tác cho trang chi tiết bài viết

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // TƯƠNG TÁC HEADER
  // Xử lý tương tác cho header navigation
  // ========================================

  // Chọn ngôn ngữ
  const languageSelector = document.querySelector(".language-selector");
  if (languageSelector) {
    languageSelector.addEventListener("click", function () {
      console.log("Language selector clicked");
      // TODO: Làm dropdown chọn ngôn ngữ
    });

    // Xử lý phím tắt accessibility
    languageSelector.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  }

  // Trạng thái active cho menu
  const mainNavLinks = document.querySelectorAll(".main-nav__link");
  mainNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Xóa khi có navigation thật

      // Xóa active khỏi tất cả link
      mainNavLinks.forEach((l) => l.classList.remove("main-nav__link--active"));

      // Thêm active cho link được click
      this.classList.add("main-nav__link--active");

      console.log("Navigation clicked:", this.textContent);
      // TODO: Làm navigation thật
    });
  });

  // Nút đăng nhập
  const loginBtn = document.querySelector(".login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Xóa khi có login thật
      console.log("Login button clicked");
      // TODO: Làm modal hoặc chuyển trang login
    });
  }

  // Dropdown trích dẫn
  const citationDropdown = document.querySelector(".btn--tertiary");
  if (citationDropdown) {
    citationDropdown.addEventListener("click", function () {
      console.log("Citation dropdown clicked");
      // Thêm dropdown nếu cần
    });
  }

  // Chuyển tab trích dẫn
  const citationTabs = document.querySelectorAll(".citation-tabs__tab");
  citationTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Xóa active khỏi tất cả tab
      citationTabs.forEach((t) =>
        t.classList.remove("citation-tabs__tab--active"),
      );
      // Thêm active cho tab được click
      this.classList.add("citation-tabs__tab--active");
      console.log("Tab switched to:", this.textContent);
    });
  });

  // Mục lục
  const tocItems = document.querySelectorAll(".toc-list__item");
  tocItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Xóa active khỏi tất cả mục
      tocItems.forEach((i) => i.classList.remove("toc-list__item--active"));
      // Thêm active cho mục được click
      this.classList.add("toc-list__item--active");
      console.log("TOC item clicked:", this.textContent);
      // Thêm cuộn mượt đến phần nếu cần
    });
  });

  // Các nút sidebar
  const actionButtons = document.querySelectorAll(".action-sidebar__btn");
  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Action button clicked");
      // Thêm xử lý cụ thể ở đây
    });
  });

  // ========================================
  // CHUYỂN TAB BÀI VIẾT LIÊN QUAN
  // Xử lý điều hướng tab cho phần bài viết liên quan
  // ========================================
  const postTabs = document.querySelectorAll(".post-tabs__tab");
  postTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Xóa active khỏi tất cả tab
      postTabs.forEach((t) => t.classList.remove("post-tabs__tab--active"));
      // Thêm active cho tab được click
      this.classList.add("post-tabs__tab--active");

      // Lấy loại tab
      const tabType = this.dataset.tab;
      console.log("Post tab switched to:", tabType);

      // TODO: Load bài viết theo loại tab
      // - 'related': Bài viết liên quan
      // - 'cited': Được trích dẫn nhiều nhất
      // - 'trending': Tìm kiếm nhiều tháng qua
    });
  });

  // ========================================
  // TỪ KHÓA
  // Xử lý click vào tag từ khóa
  // ========================================
  const keywordTags = document.querySelectorAll(".keyword-tag");
  keywordTags.forEach((tag) => {
    tag.addEventListener("click", function () {
      const keyword = this.querySelector(".keyword-tag__text").textContent;
      console.log("Keyword clicked:", keyword);
      // TODO: Làm filter hoặc điều hướng từ khóa
    });
  });

  // ========================================
  // POST EXCERPT EXPAND / COLLAPSE
  // Handle truncation and expansion of post excerpts
  // Learned from HomePage implementation
  // ========================================
  function initExcerptReadMore() {
    const excerpts = document.querySelectorAll(".post-card__excerpt");

    // Function to truncate text
    const truncate = (element) => {
      // Save original text if not already saved
      if (!element.dataset.fullText) {
        element.dataset.fullText = element.textContent.trim();
      }

      const fullText = element.dataset.fullText;
      // Calculate max height for 2 lines (line-height 1.4 * 16px ~ 22.4px/line)
      const lineHeight = parseFloat(
        window.getComputedStyle(element).lineHeight,
      );
      const maxHeight = lineHeight * 2;

      // Reset to full text to measure
      element.innerHTML = fullText;

      // If no overflow, do nothing
      if (element.scrollHeight <= maxHeight + 2) {
        // +2 buffer
        return;
      }

      // Binary search to find appropriate text length
      let start = 0;
      let end = fullText.length;
      let middle;
      let result = "";

      const suffix = '... <button class="inline-read-more">Read more</button>';

      // Loop max 20 times for performance
      while (start <= end) {
        middle = Math.floor((start + end) / 2);
        element.innerHTML = fullText.slice(0, middle) + suffix;

        // Use scrollHeight instead of offsetHeight to avoid conflict with min-height
        if (element.scrollHeight <= maxHeight + 2) {
          result = fullText.slice(0, middle);
          start = middle + 1;
        } else {
          end = middle - 1;
        }
      }

      // Apply final result
      element.innerHTML = result + suffix;

      // Attach click event to new button
      const btn = element.querySelector(".inline-read-more");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          // Toggle expand
          element.innerHTML =
            fullText + ' <button class="inline-read-more">Show less</button>';

          // Attach collapse event to new button
          element
            .querySelector(".inline-read-more")
            .addEventListener("click", (ev) => {
              ev.stopPropagation();
              truncate(element); // Truncate again
            });
        });
      }
    };

    excerpts.forEach((excerpt) => truncate(excerpt));

    // Handle window resize (debounce)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        excerpts.forEach((excerpt) => {
          // Re-truncate if not expanded or no button exists (text fits without overflow)
          const btn = excerpt.querySelector(".inline-read-more");
          // Only skip if user has expanded (button text is "Show less")
          if (!btn || btn.textContent === "Read more") {
            truncate(excerpt);
          }
        });
      }, 250);
    });
  }

  // Initialize after DOM load
  initExcerptReadMore();
});
