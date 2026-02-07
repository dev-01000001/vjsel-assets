// Carousel các số báo đã xuất bản - Vanilla JS

(function () {
    'use strict';

    // State
    let currentIndex = 0;
    let cardsPerView = 4;
    const totalCards = 6;

    // DOM Elements
    const track = document.getElementById('carouselTrack');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const indicators = document.querySelectorAll('.carousel-indicators__dot');

    // Tính toán số card hiển thị dựa trên chiều rộng màn hình
    function calculateCardsPerView() {
        const width = window.innerWidth;

        if (width >= 1280) {
            cardsPerView = 4;
        } else if (width >= 768) {
            cardsPerView = 3;
        } else if (width >= 414) {
            cardsPerView = 2;
        } else {
            cardsPerView = 1;
        }

        return cardsPerView;
    }

    // Lấy tổng số trang
    function getTotalPages() {
        return Math.ceil(totalCards / cardsPerView);
    }

    // Cập nhật vị trí carousel
    function updateCarousel() {
        const cardWidth = track.querySelector('.issue-card').offsetWidth;
        
        // Get gap from computed style (handles responsive changes)
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 24; 
        
        const offset = (cardWidth + gap) * (currentIndex * cardsPerView);

        // Always use transform for smooth navigation (unless specific mobile behavior preferred)
        track.style.transform = `translateX(-${offset}px)`;

        updateIndicators();
        updateButtons();
    }

    // Cập nhật các chấm chỉ báo
    function updateIndicators() {
        const totalPages = getTotalPages();
        const indicatorsContainer = document.getElementById('carouselIndicators');

        // Xóa chỉ báo cũ
        indicatorsContainer.innerHTML = '';

        // Tạo chỉ báo mới dựa trên số trang
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-indicators__dot';

            if (i === currentIndex) {
                dot.classList.add('carousel-indicators__dot--active');
            }

            // Xử lý sự kiện click
            dot.addEventListener('click', function () {
                currentIndex = i;
                updateCarousel();
            });

            indicatorsContainer.appendChild(dot);
        }
    }

    // Cập nhật trạng thái nút điều hướng
    function updateButtons() {
        const totalPages = getTotalPages();

        // Cập nhật trạng thái nút prev
        if (currentIndex === 0) {
            prevButton.disabled = true;
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
            prevButton.style.display = 'flex';
        } else {
            prevButton.disabled = false;
            prevButton.style.opacity = '1';
            prevButton.style.cursor = 'pointer';
            prevButton.style.display = 'flex';
        }

        // Cập nhật trạng thái nút next
        if (currentIndex >= totalPages - 1) {
            nextButton.disabled = true;
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
            nextButton.style.display = 'flex';
        } else {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
            nextButton.style.display = 'flex';
        }
    }

    // Xử lý điều hướng
    function goToPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    function goToNext() {
        const totalPages = getTotalPages();
        if (currentIndex < totalPages - 1) {
            currentIndex++;
            updateCarousel();
        }
    }

    // Điều hướng bằng bàn phím
    function handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    }

    // Hỗ trợ vuốt chạm (Touch swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Vuốt trái - next
                goToNext();
            } else {
                // Vuốt phải - prev
                goToPrev();
            }
        }
    }

    // Xử lý thay đổi kích thước màn hình
    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            calculateCardsPerView();

            // Reset về index hợp lệ nếu cần
            const totalPages = getTotalPages();
            if (currentIndex >= totalPages) {
                currentIndex = totalPages - 1;
            }

            updateCarousel();
        }, 250);
    }

    // Khởi tạo
    function init() {
        calculateCardsPerView();
        updateCarousel();

        // Gán sự kiện
        prevButton.addEventListener('click', goToPrev);
        nextButton.addEventListener('click', goToNext);
        document.addEventListener('keydown', handleKeyboard);

        // Sự kiện chạm
        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Sự kiện resize
        window.addEventListener('resize', handleResize);
    }

    // Chạy khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
