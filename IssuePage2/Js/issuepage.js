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

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    initializeFilterDropdowns();
    initializeClearAll();
  });
} else {
  initializeFilterDropdowns();
  initializeClearAll();
}
