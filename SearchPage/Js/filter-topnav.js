/**
 * FILTER TOP NAVIGATION - JavaScript
 * Xử lý tương tác cho thanh tìm kiếm và nút advanced search
 */

console.log("=== FILTER-TOPNAV.JS LOADED ===");

// ===========================================
// DOM ELEMENTS - Các phần tử DOM
// ===========================================
const searchInput = document.querySelector(".filter-search-box__input");
const advancedBtn = document.querySelector(".filter-topnav__advanced-btn");
const searchBox = document.querySelector(".filter-search-box");

console.log("Elements found:");
console.log("- searchInput:", searchInput);
console.log("- advancedBtn:", advancedBtn);
console.log("- searchBox:", searchBox);

// ===========================================
// SEARCH FUNCTIONALITY - Chức năng tìm kiếm
// ===========================================

/**
 * Xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
 */
if (searchInput) {
  // Tìm kiếm khi nhấn Enter
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSearch(this.value.trim());
    }
  });

  // Xử lý real-time search (tùy chọn)
  let searchTimeout;
  searchInput.addEventListener("input", function (e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.trim();
      if (query.length >= 3) {
        // Chỉ tìm kiếm khi có ít nhất 3 ký tự
        handleLiveSearch(query);
      }
    }, 500); // Debounce 500ms
  });

  // Làm nổi bật search box khi focus
  searchInput.addEventListener("focus", function () {
    searchBox?.classList.add("filter-search-box--focused");
  });

  searchInput.addEventListener("blur", function () {
    searchBox?.classList.remove("filter-search-box--focused");
  });
}

/**
 * Xử lý tìm kiếm chính
 * @param {string} query - Từ khóa tìm kiếm
 */
function handleSearch(query) {
  if (!query) {
    console.warn("Vui lòng nhập từ khóa tìm kiếm");
    return;
  }

  console.log("Đang tìm kiếm:", query);

  // TODO: Gọi API tìm kiếm hoặc chuyển hướng đến trang kết quả
  // window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

/**
 * Xử lý tìm kiếm real-time (tùy chọn)
 * @param {string} query - Từ khóa tìm kiếm
 */
function handleLiveSearch(query) {
  console.log("Live search:", query);

  // TODO: Gọi API để hiển thị gợi ý tìm kiếm
  // Ví dụ: hiển thị dropdown với kết quả gợi ý
}

// ===========================================
// ADVANCED SEARCH - Tìm kiếm nâng cao
// ===========================================

/**
 * Mở modal hoặc trang tìm kiếm nâng cao
 */
function handleAdvancedSearch() {
  console.log("Mở Advanced Search");

  // Check if mobile (width <= 767px)
  const isMobile = window.innerWidth <= 767;
  console.log("Is Mobile:", isMobile, "Window width:", window.innerWidth);

  if (isMobile) {
    // Toggle drawer on mobile
    toggleDrawer();
  } else {
    // Desktop: toggle class for filters
    document.body.classList.toggle("filter-advanced-active");
  }
}

// ===========================================
// DRAWER FUNCTIONALITY - Chức năng ngăn kéo (Mobile)
// ===========================================

/**
 * Toggle drawer on mobile
 */
function toggleDrawer() {
  const sidebarCard = document.querySelector(".sidebar__card");
  const body = document.body;

  console.log("toggleDrawer called, sidebarCard:", sidebarCard);

  if (!sidebarCard) {
    console.error("sidebar__card not found!");
    return;
  }

  // Check if drawer is open
  const isOpen = sidebarCard.classList.contains("drawer-open");
  console.log("Drawer is currently open:", isOpen);

  if (isOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

/**
 * Open drawer
 */
function openDrawer() {
  const sidebarCard = document.querySelector(".sidebar__card");
  const body = document.body;

  console.log("openDrawer called, sidebarCard:", sidebarCard);

  if (!sidebarCard) {
    console.error("sidebar__card not found in openDrawer!");
    return;
  }

  // Create backdrop if not exists
  let backdrop = document.querySelector(".drawer-backdrop");
  if (!backdrop) {
    console.log("Creating backdrop...");
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    body.appendChild(backdrop);

    // Close drawer when clicking backdrop
    backdrop.addEventListener("click", closeDrawer);
  }

  // Create drawer handle if not exists
  let handle = sidebarCard.querySelector(".drawer-handle");
  if (!handle) {
    console.log("Creating drawer handle...");
    handle = document.createElement("div");
    handle.className = "drawer-handle";
    sidebarCard.insertBefore(handle, sidebarCard.firstChild);

    // Close drawer when swiping down on handle
    handle.addEventListener("touchstart", handleTouchStart);
    handle.addEventListener("touchmove", handleTouchMove);
    handle.addEventListener("touchend", handleTouchEnd);
  }

  // Create close button if not exists
  let closeBtn = sidebarCard.querySelector(".drawer-close-btn");
  if (!closeBtn) {
    console.log("Creating close button...");
    closeBtn = document.createElement("button");
    closeBtn.className = "drawer-close-btn";
    closeBtn.setAttribute("type", "button");
    closeBtn.setAttribute("aria-label", "Đóng bộ lọc");
    closeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    sidebarCard.insertBefore(closeBtn, sidebarCard.firstChild);

    // Close drawer when clicking X button
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeDrawer();
    });
  }

  // Open drawer
  console.log("Opening drawer...");
  setTimeout(() => {
    backdrop.classList.add("active");
    sidebarCard.classList.add("drawer-open");
    body.style.overflow = "hidden"; // Prevent body scroll
    console.log("Drawer opened! Classes:", sidebarCard.className);
  }, 10);
}

/**
 * Close drawer
 */
function closeDrawer() {
  const sidebarCard = document.querySelector(".sidebar__card");
  const backdrop = document.querySelector(".drawer-backdrop");
  const body = document.body;

  if (!sidebarCard) return;

  // Close drawer
  sidebarCard.classList.remove("drawer-open");
  if (backdrop) {
    backdrop.classList.remove("active");
  }
  body.style.overflow = ""; // Restore body scroll
}

// Touch handling for swipe down to close
let touchStartY = 0;
let touchCurrentY = 0;

function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  touchCurrentY = e.touches[0].clientY;
  const diff = touchCurrentY - touchStartY;

  // Only allow swipe down
  if (diff > 0) {
    const sidebarCard = document.querySelector(".sidebar__card");
    if (sidebarCard) {
      sidebarCard.style.transform = `translateY(${Math.min(diff, 100)}px)`;
    }
  }
}

function handleTouchEnd(e) {
  const diff = touchCurrentY - touchStartY;

  // If swiped down more than 50px, close drawer
  if (diff > 50) {
    closeDrawer();
  } else {
    // Reset position
    const sidebarCard = document.querySelector(".sidebar__card");
    if (sidebarCard) {
      sidebarCard.style.transform = "";
    }
  }

  touchStartY = 0;
  touchCurrentY = 0;
}

// ===========================================
// KEYBOARD SHORTCUTS - Phím tắt
// ===========================================

/**
 * Xử lý phím tắt toàn cục
 */
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K: Focus vào ô tìm kiếm
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    searchInput?.focus();
  }

  // Ctrl/Cmd + Shift + F: Mở Advanced Search
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
    e.preventDefault();
    handleAdvancedSearch();
  }

  // Escape: Xóa nội dung search hoặc đóng advanced search/drawer
  if (e.key === "Escape") {
    if (document.activeElement === searchInput) {
      searchInput.value = "";
      searchInput.blur();
    }

    // Check if mobile and drawer is open
    const isMobile = window.innerWidth <= 767;
    const sidebarCard = document.querySelector(".sidebar__card");

    if (
      isMobile &&
      sidebarCard &&
      sidebarCard.classList.contains("drawer-open")
    ) {
      closeDrawer();
    } else {
      document.body.classList.remove("filter-advanced-active");
    }
  }
});

// ===========================================
// WINDOW RESIZE HANDLER - Xử lý thay đổi kích thước
// ===========================================

/**
 * Handle window resize to close drawer when switching between mobile and desktop
 */
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const isMobile = window.innerWidth <= 767;
    const sidebarCard = document.querySelector(".sidebar__card");

    // Close drawer when switching from mobile to desktop
    if (
      !isMobile &&
      sidebarCard &&
      sidebarCard.classList.contains("drawer-open")
    ) {
      closeDrawer();
    }
  }, 250);
});

// ===========================================
// ACCESSIBILITY - Hỗ trợ khả năng tiếp cận
// ===========================================

/**
 * Thông báo cho screen reader khi có kết quả tìm kiếm
 * @param {string} message - Thông báo
 */
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "filter-sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Xóa announcement sau 1 giây
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ===========================================
// INITIALIZATION - Khởi tạo
// ===========================================

/**
 * Khởi tạo khi DOM đã sẵn sàng
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("Filter Top Navigation initialized");

  // Gắn event listener cho Advanced Search button
  if (advancedBtn) {
    advancedBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Advanced Search button clicked");
      handleAdvancedSearch();
    });

    // Xử lý keyboard navigation (Enter hoặc Space)
    advancedBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleAdvancedSearch();
      }
    });
  }

  // Kiểm tra query string để tự động focus search
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("focus-search")) {
    searchInput?.focus();
  }

  // Load search query từ URL nếu có
  const savedQuery = urlParams.get("q");
  if (savedQuery && searchInput) {
    searchInput.value = savedQuery;
  }
});

// ===========================================
// EXPORTS - Xuất để sử dụng từ file khác (nếu dùng modules)
// ===========================================

// Nếu dùng ES6 modules, uncomment dòng dưới:
// export { handleSearch, handleAdvancedSearch, handleLiveSearch };
