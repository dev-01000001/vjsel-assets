// ========================================
// FILTER DROPDOWN FUNCTIONALITY
// ========================================

// Filter data
const filterData = {
  decade: [
    { value: "2020", label: "2020" },
    { value: "2010", label: "2010" },
    { value: "2000", label: "2000" },
    { value: "1990", label: "1990" },
  ],
  year: [
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
  ],
  issue: [
    { value: "v110-i12-2025", label: "Volume 110, Issue 12, December 2025" },
    { value: "v110-i11-2025", label: "Volume 110, Issue 11, November 2025" },
    { value: "v110-i10-2025", label: "Volume 110, Issue 10, October 2025" },
    { value: "v110-i9-2025", label: "Volume 110, Issue 9, September 2025" },
    { value: "v110-i8-2025", label: "Volume 110, Issue 8, August 2025" },
  ],
};

// Create dropdown menu element
function createDropdownMenu(items, currentValue) {
  const menu = document.createElement("div");
  menu.className = "filter-dropdown-menu";
  menu.setAttribute("role", "listbox");

  items.forEach((item) => {
    const option = document.createElement("div");
    option.className = "filter-dropdown-option";
    if (item.value === currentValue) {
      option.classList.add("filter-dropdown-option--selected");
    }
    option.setAttribute("role", "option");
    option.setAttribute("data-value", item.value);
    option.textContent = item.label;

    // Click handler for option
    option.addEventListener("click", function (e) {
      e.stopPropagation();
      selectOption(this);
    });

    menu.appendChild(option);
  });

  return menu;
}

// Select an option
function selectOption(optionElement) {
  const menu = optionElement.closest(".filter-dropdown-menu");
  const wrapper = menu.closest(".filter-group");
  const selectButton = wrapper.querySelector(".filter-group__select");
  const textElement = selectButton.querySelector(".filter-group__text");

  // Update selected state
  menu.querySelectorAll(".filter-dropdown-option").forEach((opt) => {
    opt.classList.remove("filter-dropdown-option--selected");
  });
  optionElement.classList.add("filter-dropdown-option--selected");

  // Update displayed text
  textElement.textContent = optionElement.textContent;

  // Close dropdown
  closeAllDropdowns();
}

// Toggle dropdown
function toggleDropdown(selectButton) {
  const wrapper = selectButton.closest(".filter-group");
  const existingMenu = wrapper.querySelector(".filter-dropdown-menu");

  // Close all other dropdowns
  closeAllDropdowns();

  // Toggle current dropdown
  if (existingMenu) {
    existingMenu.remove();
    selectButton.classList.remove("filter-group__select--active");
  } else {
    // Determine filter type
    let filterType = "";
    if (wrapper.classList.contains("filter-group--decade")) {
      filterType = "decade";
    } else if (wrapper.classList.contains("filter-group--year")) {
      filterType = "year";
    } else if (wrapper.classList.contains("filter-group--issue")) {
      filterType = "issue";
    }

    if (filterType && filterData[filterType]) {
      const currentValue =
        selectButton.getAttribute("data-value") ||
        filterData[filterType][0].value;
      const menu = createDropdownMenu(filterData[filterType], currentValue);

      // Position menu below select button
      wrapper.style.position = "relative";
      wrapper.appendChild(menu);

      selectButton.classList.add("filter-group__select--active");

      // Animate menu
      requestAnimationFrame(() => {
        menu.classList.add("filter-dropdown-menu--open");
      });
    }
  }
}

// Close all dropdowns
function closeAllDropdowns() {
  document.querySelectorAll(".filter-dropdown-menu").forEach((menu) => {
    menu.remove();
  });
  document.querySelectorAll(".filter-group__select").forEach((select) => {
    select.classList.remove("filter-group__select--active");
  });
}

// Initialize filter dropdowns
function initializeFilterDropdowns() {
  // Add click handlers to all select buttons
  document.querySelectorAll(".filter-group__select").forEach((selectButton) => {
    // Set initial data-value
    const wrapper = selectButton.closest(".filter-group");
    let filterType = "";
    if (wrapper.classList.contains("filter-group--decade")) {
      filterType = "decade";
    } else if (wrapper.classList.contains("filter-group--year")) {
      filterType = "year";
    } else if (wrapper.classList.contains("filter-group--issue")) {
      filterType = "issue";
    }

    if (filterType && filterData[filterType]) {
      selectButton.setAttribute("data-value", filterData[filterType][0].value);
    }

    // Add click handler
    selectButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleDropdown(this);
    });

    // Add keyboard support
    selectButton.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleDropdown(this);
      } else if (e.key === "Escape") {
        closeAllDropdowns();
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".filter-group")) {
      closeAllDropdowns();
    }
  });

  // Close dropdowns on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });
}

// Clear All functionality
function initializeClearAll() {
  const clearButton = document.querySelector(".filter-panel__clear");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      // Reset all filters to first option
      document
        .querySelectorAll(".filter-group__select")
        .forEach((selectButton) => {
          const wrapper = selectButton.closest(".filter-group");
          const textElement = selectButton.querySelector(".filter-group__text");

          let filterType = "";
          if (wrapper.classList.contains("filter-group--decade")) {
            filterType = "decade";
          } else if (wrapper.classList.contains("filter-group--year")) {
            filterType = "year";
          } else if (wrapper.classList.contains("filter-group--issue")) {
            filterType = "issue";
          }

          if (filterType && filterData[filterType]) {
            const firstOption = filterData[filterType][0];
            textElement.textContent = firstOption.label;
            selectButton.setAttribute("data-value", firstOption.value);
          }
        });

      closeAllDropdowns();
    });
  }
}

// ========================================
// READ MORE FUNCTIONALITY FOR ABSTRACTS
// ========================================

// Xử lý nút Mở rộng / Thu gọn cho abstract
function initReadMore() {
  const abstracts = document.querySelectorAll(".article-card__abstract");

  // Hàm thực hiện cắt chuỗi
  const truncate = (element) => {
    // Lưu text gốc nếu chưa có
    if (!element.dataset.fullText) {
      element.dataset.fullText = element.textContent.trim();
    }

    const fullText = element.dataset.fullText;
    // Tính toán chiều cao tối đa cho 2 dòng (line-height 1.4 * 16px ~ 22.4px/dòng)
    const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
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
    let iterations = 0;
    while (start <= end && iterations < 20) {
      middle = Math.floor((start + end) / 2);
      element.innerHTML = fullText.slice(0, middle) + suffix;

      if (element.offsetHeight <= maxHeight + 2) {
        result = fullText.slice(0, middle);
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      iterations++;
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

  abstracts.forEach((abstract) => truncate(abstract));

  // Xử lý resize window (debounce)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      abstracts.forEach((abstract) => {
        const btn = abstract.querySelector(".inline-read-more");
        // Chỉ chạy lại truncate nếu nút hiện tại là "Mở rộng"
        if (btn && btn.textContent === "Mở rộng") {
          truncate(abstract);
        }
      });
    }, 100);
  });
}

// ========================================
// AUTHORS EXPAND/COLLAPSE FUNCTIONALITY
// ========================================

function initAuthorsExpand() {
  const authorLists = document.querySelectorAll(".article-card__authors");

  authorLists.forEach((list) => {
    // Reset state for re-calculation
    const existingBtn = list.querySelector(".inline-read-more");
    if (existingBtn) {
      existingBtn.remove();
    }
    list.classList.remove("expanded");
    const authors = Array.from(list.querySelectorAll(".author-tag"));
    authors.forEach((a) => (a.style.display = "")); // Reset display

    // Check overflow
    // list.clientHeight is confined by max-height: 24px in responsive CSS
    if (list.scrollHeight > list.clientHeight + 2) {
      // Create "Mở rộng" button
      const btn = document.createElement("button");
      btn.className = "inline-read-more";
      btn.innerText = "Mở rộng";

      list.appendChild(btn);

      const hiddenAuthors = [];

      // Loop to hide items until button fits on the first line
      let safety = 100;
      while (safety-- > 0) {
        // Check if button is wrapped to next line
        if (btn.offsetTop > 12) {
          // Hide last visible author
          let lastVisible = null;
          for (let i = authors.length - 1; i >= 0; i--) {
            if (authors[i].style.display !== "none") {
              lastVisible = authors[i];
              break;
            }
          }

          if (lastVisible) {
            lastVisible.style.display = "none";
            hiddenAuthors.push(lastVisible);
          } else {
            break;
          }
        } else {
          break; // Fits cleanly
        }
      }

      // Click handler
      let isExpanded = false;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        isExpanded = !isExpanded;
        if (isExpanded) {
          // Expand
          hiddenAuthors.forEach((a) => (a.style.display = ""));
          list.classList.add("expanded");
          btn.innerText = "Thu gọn";
        } else {
          // Collapse
          hiddenAuthors.forEach((a) => (a.style.display = "none"));
          list.classList.remove("expanded");
          btn.innerText = "Mở rộng";
        }
      });
    }
  });
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    initializeFilterDropdowns();
    initializeClearAll();
    initReadMore();
    setTimeout(initAuthorsExpand, 100);
  });
} else {
  initializeFilterDropdowns();
  initializeClearAll();
  initReadMore();
  setTimeout(initAuthorsExpand, 100);
}

// Re-check authors expand on window resize
window.addEventListener("resize", () => {
  setTimeout(initAuthorsExpand, 200);
});
