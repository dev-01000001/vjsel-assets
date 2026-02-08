// Quản lý state cho Tabs
let currentTab = 0;
const tabs = ['featured', 'cited', 'read'];

// Chuyển đổi Tab
function switchTab(direction) {
    const tabElements = document.querySelectorAll('.tabs-group__item[data-tab]');

    // Xóa class active khỏi tab hiện tại
    tabElements[currentTab].classList.remove('tabs-group__item--active');

    // Cập nhật index tab hiện tại
    if (direction === 'next') {
        currentTab = (currentTab + 1) % tabs.length;
    } else {
        currentTab = (currentTab - 1 + tabs.length) % tabs.length;
    }

    // Thêm class active cho tab mới
    tabElements[currentTab].classList.add('tabs-group__item--active');

    // Scroll active tab into view
    scrollActiveTabIntoView(tabElements[currentTab]);
}

// Function to scroll active tab into center view
function scrollActiveTabIntoView(activeTab) {
    const container = document.querySelector('.tabs-group');
    if (!activeTab || !container) return;

    // Calculate the scroll position to center the tab
    const containerWidth = container.offsetWidth;
    const tabWidth = activeTab.offsetWidth;
    const tabLeft = activeTab.offsetLeft;

    const targetScrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);

    container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
    });
}


// Xử lý nút Xem thêm / Thu gọn (JS Truncation)
function initReadMore() {
    const descriptions = document.querySelectorAll('.article-card__description');
    
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
        if (element.scrollHeight <= maxHeight + 2) { // +2 buffer
             return;
        }

        // Binary search để tìm độ dài chuỗi phù hợp
        let start = 0;
        let end = fullText.length;
        let middle;
        let result = '';
        
        const suffix = '... <button class="inline-read-more">Mở rộng</button>';
        
        // Loop tối đa 20 lần cho performance
        while (start <= end) {
            middle = Math.floor((start + end) / 2);
            element.innerHTML = fullText.slice(0, middle) + suffix;
            
            if (element.offsetHeight <= maxHeight + 2) {
                result = fullText.slice(0, middle);
                start = middle + 1;
            } else {
                end = middle - 1;
            }
        }
        
        // Áp dụng kết quả cuối cùng
        element.innerHTML = result + suffix;
        
        // Gán sự kiện click cho nút vừa tạo
        const btn = element.querySelector('.inline-read-more');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Toggle mở rộng
                element.innerHTML = fullText + ' <button class="inline-read-more">Thu gọn</button>';
                
                // Gán sự kiện thu gọn cho nút mới tạo
                element.querySelector('.inline-read-more').addEventListener('click', (ev) => {
                     ev.stopPropagation();
                     truncate(element); // Cắt lại
                });
            });
        }
    };

    descriptions.forEach(desc => truncate(desc));

    // Xử lý resize window (debounce)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            descriptions.forEach(desc => {
                // Chỉ chạy lại truncate nếu đang không ở trạng thái mở rộng (nút là Mở rộng)
                // Hoặc đơn giản là chạy lại logic check overflow
                const btn = desc.querySelector('.inline-read-more');
                if (!btn || btn.innerText === 'Mở rộng') {
                    truncate(desc);
                }
            });
        }, 200);
    });
}


// Quản lý hiển thị tag list trên mobile
function initTagListExpand() {
    const isMobile = window.innerWidth <= 480;
    const expanders = document.querySelectorAll('.tag-list-expander');

    expanders.forEach(btn => {
        const targetId = btn.dataset.target;
        const targetList = document.getElementById(targetId);

        if (!targetList) return;

        if (isMobile) {
            // Move button inside the list if not already there (for inline flow)
            if (targetList && btn.parentNode !== targetList) {
                targetList.appendChild(btn);
            }

            // Check height to see if needs collapsing
            // 46px is roughly 1 line
            if (targetList.scrollHeight > 48) {
                // Initial state: collapsed
                // Note: Only add collapsed class if NOT already manually toggled
                if (!btn.hasAttribute('data-toggled')) {
                    targetList.classList.add('tag-list--collapsed');
                    btn.classList.remove('tag-list-expander--hidden');
                }
                
                // Add click handler if not already added
                if (!btn.hasAttribute('data-initialized')) {
                    btn.addEventListener('click', () => {
                        const isCollapsed = targetList.classList.contains('tag-list--collapsed');
                        const path = btn.querySelector('path');
                        
                        if (isCollapsed) {
                            // Expand
                            targetList.classList.remove('tag-list--collapsed');
                            // Change to minus icon (Horizontal line)
                            if(path) path.setAttribute('d', 'M5 12H19');
                            btn.setAttribute('aria-label', 'Thu gọn');
                        } else {
                            // Collapse back
                            targetList.classList.add('tag-list--collapsed');
                            // Change to plus icon
                            if(path) path.setAttribute('d', 'M12 5V19M5 12H19');
                            btn.setAttribute('aria-label', 'Hiện thêm');
                        }
                        
                        // Mark as manually toggled so resize logic doesn't override
                        btn.setAttribute('data-toggled', 'true');
                    });
                    btn.setAttribute('data-initialized', 'true');
                }
            } else {
                // If content is short enough, hide button
                if (!btn.hasAttribute('data-toggled')) {
                    targetList.classList.remove('tag-list--collapsed');
                    btn.classList.add('tag-list-expander--hidden');
                }
            }
        } else {
            // Desktop: Remove all mobile classes
            targetList.classList.remove('tag-list--collapsed');
            btn.classList.add('tag-list-expander--hidden');
        }
    });
}

function initAuthorsExpand() {
    const authorLists = document.querySelectorAll('.article-card__authors');
    
    authorLists.forEach(list => {
        // Reset state for re-calculation
        const existingBtn = list.querySelector('.inline-read-more');
        if (existingBtn) {
            existingBtn.remove();
        }
        list.classList.remove('expanded');
        const authors = Array.from(list.querySelectorAll('.article-card__author'));
        authors.forEach(a => a.style.display = ''); // Reset display

        // Check overflow
        // Note: list needs max-height or height limited in CSS to detect scrollHeight > clientHeight
        // list.clientHeight is confined by max-height: 24px
        if (list.scrollHeight > list.clientHeight + 2) { 
            // Create "Mở rộng" button
            const btn = document.createElement('button');
            btn.className = 'inline-read-more';
            btn.innerText = 'Mở rộng';
            // btn.style.cssText is removed as styles are now in .inline-read-more class
            
            list.appendChild(btn);
            
            const hiddenAuthors = [];
            
            // Loop to hide items until button fits on the first line
            let safety = 100;
            while (safety-- > 0) {
                 // Check if button is wrapped to next line
                 // Since list detects wrapping, if button is wrapped, it's vertically offset
                 // We assume 1st line offsetTop is small (e.g. 0-5px depending on padding)
                 // If btn.offsetTop > 10px, it's likely on 2nd line.
                 if (btn.offsetTop > 12) { 
                     // Hide last visible author
                     let lastVisible = null;
                     for(let i = authors.length -1; i >= 0; i--) {
                         if (authors[i].style.display !== 'none') {
                             lastVisible = authors[i];
                             break;
                         }
                     }
                     
                     if (lastVisible) {
                         lastVisible.style.display = 'none';
                         hiddenAuthors.push(lastVisible);
                     } else {
                         // If checks fail (no visible authors left but btn still wraps?)
                         break;
                     }
                 } else {
                     break; // Fits cleanly
                 }
            }
            
            // Click handler
            let isExpanded = false;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                isExpanded = !isExpanded;
                if (isExpanded) {
                    // Expand
                    hiddenAuthors.forEach(a => a.style.display = '');
                    list.classList.add('expanded');
                    btn.innerText = 'Thu gọn';
                } else {
                    // Collapse
                    hiddenAuthors.forEach(a => a.style.display = 'none');
                    list.classList.remove('expanded');
                    btn.innerText = 'Mở rộng';
                }
            });
        }
    });
}

// Khởi tạo sự kiện
function init() {
    // Sự kiện nút chuyển tab kế tiếp
    const nextTabBtn = document.getElementById('nextTabBtn');
    if (nextTabBtn) {
        nextTabBtn.addEventListener('click', () => switchTab('next'));
    }

    // Sự kiện click vào từng tab
    const tabElements = document.querySelectorAll('.tabs-group__item[data-tab]');
    tabElements.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Xóa active khỏi tất cả tab
            tabElements.forEach(t => t.classList.remove('tabs-group__item--active'));
            // Thêm active vào tab được click
            tab.classList.add('tabs-group__item--active');
            currentTab = index;

            // Scroll active tab into view
            scrollActiveTabIntoView(tab);
        });
    });

    // Khởi tạo nút xem thêm
    // Sử dụng setTimeout để đảm bảo layout đã được render xong (font, styles)
    setTimeout(initReadMore, 100);
    setTimeout(initTagListExpand, 100);
    setTimeout(initAuthorsExpand, 100);
    
    // Initial scroll for active tab
    setTimeout(() => {
        const activeTab = document.querySelector('.tabs-group__item--active');
        if (activeTab) scrollActiveTabIntoView(activeTab);
    }, 150);

    // Re-check on resize
    window.addEventListener('resize', () => {
        // Debounce simple
        setTimeout(initTagListExpand, 200);
        setTimeout(initAuthorsExpand, 200);
    });
}


// Chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
