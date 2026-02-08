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

  // ========================================
  // TOC SCROLL SPY
  // Tự động active menu bên phải khi scroll
  // ========================================

  // Lấy tất cả các link trong TOC
  const tocLinks = document.querySelectorAll(".toc-list__link");

  // Lấy tất cả các section dựa trên href của link
  const sectionIds = [
    "tom-tat",
    "doi-tuong-phuong-phap",
    "ket-qua",
    "ban-luan",
    "ket-luan",
    "tai-lieu-tham-khao",
  ];

  // Biến cờ để tránh conflict khi click
  let isScrolling = false;
  let scrollTimeout;

  function setActiveLink(targetId) {
    console.log("setActiveLink called with:", targetId); // DEBUG

    // Xóa active khỏi tất cả toc-list__item
    const allItems = document.querySelectorAll(".toc-list__item");
    console.log("Found toc-list__item:", allItems.length); // DEBUG

    allItems.forEach((item) => {
      item.classList.remove("toc-list__item--active");
    });

    // Tìm link có href tương ứng và active parent (toc-list__item)
    const activeLink = document.querySelector(
      `.toc-list__link[href="#${targetId}"]`,
    );
    console.log("Active link found:", activeLink); // DEBUG

    if (activeLink) {
      const parentItem = activeLink.closest(".toc-list__item");
      console.log("Parent item:", parentItem); // DEBUG
      if (parentItem) {
        parentItem.classList.add("toc-list__item--active");
        console.log("Added active class to:", parentItem); // DEBUG
      }
    }
  }

  function onScroll() {
    if (isScrolling) return;

    const scrollPos = window.scrollY + 200; // offset từ top

    let currentSection = sectionIds[0]; // Mặc định là section đầu tiên

    for (let i = 0; i < sectionIds.length; i++) {
      const section = document.getElementById(sectionIds[i]);
      if (section) {
        const sectionTop = section.offsetTop;
        if (scrollPos >= sectionTop) {
          currentSection = sectionIds[i];
        }
      }
    }

    // Nếu scroll gần cuối trang, active mục cuối
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 100
    ) {
      currentSection = sectionIds[sectionIds.length - 1];
    }

    setActiveLink(currentSection);
  }

  // Lắng nghe sự kiện scroll
  window.addEventListener("scroll", onScroll);

  // Xử lý khi trang load với hash URL (ví dụ: #ket-luan)
  function handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1); // Bỏ dấu #
      if (sectionIds.includes(targetId)) {
        setActiveLink(targetId);
        return true; // Đã xử lý hash
      }
    }
    return false;
  }

  // Chạy lần đầu khi load trang
  // Ưu tiên check hash URL trước, nếu không có thì check scroll position
  const hasHash = handleInitialHash();

  if (!hasHash) {
    onScroll();
  }

  // KHÔNG gọi onScroll trong setTimeout nếu đã có hash
  // vì nó sẽ ghi đè lại trạng thái active đúng

  // Xử lý click vào TOC link
  tocLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1); // Bỏ dấu #
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Tạm dừng scroll spy
        isScrolling = true;
        clearTimeout(scrollTimeout);

        // Active ngay lập tức
        setActiveLink(targetId);

        // Cập nhật URL hash (không reload trang)
        history.pushState(null, null, `#${targetId}`);

        // Cuộn đến section
        const headerOffset = 120;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Sau 1 giây, bật lại scroll spy
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    });
  });

  // Lắng nghe sự kiện hash change (khi user bấm back/forward)
  window.addEventListener("hashchange", function () {
    handleInitialHash();
  });

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

  // Mục lục - Đã xóa duplicate handler (xử lý bởi TOC SCROLL SPY ở trên)

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

      // Cuộn để căn giữa tab đang active
      this.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });

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
  // AUTHOR LIST SCROLL
  // Xử lý cuộn danh sách tác giả
  // ========================================
  const authorScrollBtn = document.querySelector(".author-list__scroll-btn");
  const authorList = document.querySelector(".author-list");

  if (authorScrollBtn && authorList) {
    authorScrollBtn.addEventListener("click", function () {
      const card = authorList.querySelector(".author-card");
      if (!card) return;

      // Tính toán khoảng cách cuộn: width card + gap (12px)
      // Lấy style thực tế để chắc chắn về gap
      const style = window.getComputedStyle(authorList);
      const gap = parseFloat(style.gap) || 12;
      const scrollAmount = card.offsetWidth + gap;

      // Kiểm tra xem đã cuộn đến cuối chưa
      const maxScrollLeft = authorList.scrollWidth - authorList.clientWidth;

      // Cho phép sai số 5px
      if (authorList.scrollLeft >= maxScrollLeft - 5) {
        // Nếu đã cuối thì quay về đầu
        authorList.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Cuộn tiếp
        authorList.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    });
  }

  // ========================================
  // POST EXCERPT MỞ RỘNG / THU GỌN
  // Xử lý cắt ngắn và mở rộng trích đoạn bài viết
  // Học từ HomePage implementation
  // ========================================
  function initExcerptReadMore() {
    const excerpts = document.querySelectorAll(".post-card__excerpt");

    // Hàm thực hiện cắt chuỗi
    const truncate = (element) => {
      // Lưu text gốc nếu chưa có
      if (!element.dataset.fullText) {
        element.dataset.fullText = element.textContent.trim();
      }

      const fullText = element.dataset.fullText;
      // Tính toán chiều cao tối đa cho 2 dòng (line-height 1.4 * 16px ~ 22.4px/dòng)
      const lineHeight = parseFloat(
        window.getComputedStyle(element).lineHeight,
      );
      const maxHeight = lineHeight * 2;

      // Reset về full text để đo
      element.innerHTML = fullText;

      // Nếu không bị tràn thì thôi
      if (element.scrollHeight <= maxHeight + 2) {
        // +2 buffer
        return;
      }

      // Binary search để tìm độ dài chuỗi phù hợp
      let start = 0;
      let end = fullText.length;
      let middle;
      let result = "";

      const suffix = '... <button class="inline-read-more">Mở rộng</button>';

      // Loop tối đa 20 lần cho performance
      while (start <= end) {
        middle = Math.floor((start + end) / 2);
        element.innerHTML = fullText.slice(0, middle) + suffix;

        // Dùng scrollHeight thay vì offsetHeight để tránh conflict với min-height
        if (element.scrollHeight <= maxHeight + 2) {
          result = fullText.slice(0, middle);
          start = middle + 1;
        } else {
          end = middle - 1;
        }
      }

      // Áp dụng kết quả cuối cùng
      element.innerHTML = result + suffix;

      // Gán sự kiện click cho nút vừa tạo
      const btn = element.querySelector(".inline-read-more");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          // Toggle mở rộng
          element.innerHTML =
            fullText + ' <button class="inline-read-more">Thu gọn</button>';

          // Gán sự kiện thu gọn cho nút mới tạo
          element
            .querySelector(".inline-read-more")
            .addEventListener("click", (ev) => {
              ev.stopPropagation();
              truncate(element); // Cắt lại
            });
        });
      }
    };

    excerpts.forEach((excerpt) => truncate(excerpt));

    // Xử lý resize window (debounce)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        excerpts.forEach((excerpt) => {
          // Re-truncate nếu chưa mở rộng hoặc chưa có button (text vừa không overflow)
          const btn = excerpt.querySelector(".inline-read-more");
          // Chỉ bỏ qua nếu user đã mở rộng (button text là "Thu gọn")
          if (!btn || btn.textContent === "Mở rộng") {
            truncate(excerpt);
          }
        });
      }, 250);
    });
  }

  // Khởi tạo sau khi DOM load
  initExcerptReadMore();

  // ========================================
  // AUTHOR LIST MỞ RỘNG / THU GỌN
  // Xử lý danh sách tác giả bị tràn
  // ========================================
  function initAuthorReadMore() {
    const authorContainers = document.querySelectorAll(".post-card__authors");

    const processContainer = (container) => {
      // 1. Kiểm tra xem có bị tràn dòng không
      // Lấy phần tử đầu tiên để so sánh offsetTop
      const firstChild = container.firstElementChild;
      if (!firstChild) return;

      const baseTop = firstChild.offsetTop;
      let hasOverflow = false;

      // Kiểm tra xem có phần tử nào bị đẩy xuống dòng dưới không
      const children = Array.from(container.children);
      for (let i = 0; i < children.length; i++) {
        if (Math.abs(children[i].offsetTop - baseTop) > 10) {
          // Check chênh lệch > 10px
          hasOverflow = true;
          break;
        }
      }

      // Nếu đã có nút Mở rộng/Thu gọn thì kiểm tra lại
      const existingBtn = container.querySelector(".inline-read-more");
      if (existingBtn) {
        if (existingBtn.textContent === "Thu gọn") return; // Đang mở rộng thì không can thiệp
        existingBtn.remove(); // Xóa đi tính lại
        // Unhide all
        Array.from(container.children).forEach((c) => (c.style.display = ""));
        // Đo lại overflow sau khi reset
        hasOverflow = false;
        for (let i = 0; i < container.children.length; i++) {
          if (Math.abs(container.children[i].offsetTop - baseTop) > 10) {
            hasOverflow = true;
            break;
          }
        }
      }

      if (!hasOverflow) return;

      // 2. Thêm nút Mở rộng logic
      // Tạo nút
      const btn = document.createElement("button");
      btn.className = "inline-read-more";
      btn.textContent = "Mở rộng";
      btn.style.marginLeft = "4px";

      // Append nút vào cuối
      container.appendChild(btn);

      // 3. Ẩn bớt các element cho đến khi nút Mở rộng nằm cùng dòng với element đầu tiên
      const allChildren = Array.from(container.children);
      const itemsToHide = allChildren.slice(0, -1).reverse(); // Duyệt ngược từ cuối lên (trừ btn)

      const isBtnOnFirstLine = () => {
        const first = container.firstElementChild;
        if (!first) return true;
        const currentBaseTop = first.offsetTop;
        return Math.abs(btn.offsetTop - currentBaseTop) <= 10;
      };

      if (!isBtnOnFirstLine()) {
        for (let item of itemsToHide) {
          if (item.classList.contains("post-card__label")) continue;

          item.style.display = "none";

          if (isBtnOnFirstLine()) {
            break;
          }
        }
      }

      // 4. Xử lý sự kiện click
      btn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (btn.textContent === "Mở rộng") {
          // Mở rộng: Hiện tất cả
          Array.from(container.children).forEach((c) => (c.style.display = ""));
          btn.textContent = "Thu gọn";
        } else {
          // Thu gọn: Chạy lại logic ẩn
          btn.textContent = "Mở rộng";
          const currentChildren = Array.from(container.children);
          const tags = currentChildren.slice(0, -1).reverse();

          // Unhide hết để tính toán lại chính xác vị trí ban đầu
          Array.from(container.children).forEach((c) => (c.style.display = ""));

          if (!isBtnOnFirstLine()) {
            for (let item of tags) {
              if (item.classList.contains("post-card__label")) continue;
              item.style.display = "none";
              if (isBtnOnFirstLine()) break;
            }
          }
        }
      };
    };

    authorContainers.forEach(processContainer);

    // Xử lý resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        authorContainers.forEach((container) => {
          const btn = container.querySelector(".inline-read-more");
          if (btn && btn.textContent === "Thu gọn") return;
          processContainer(container);
        });
      }, 250);
    });
  }

  initAuthorReadMore();
});
