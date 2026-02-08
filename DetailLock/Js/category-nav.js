/**
 * Điều hướng danh mục using Swiper
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if Swiper is loaded
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.category-nav__scroll', {
            slidesPerView: 'auto',
            spaceBetween: 12,
            slidesPerGroup: 1,
            grabCursor: true,
            watchOverflow: false,
            navigation: {
                nextEl: '.category-nav__button--next',
                prevEl: '.category-nav__button--prev',
            },
            on: {
                init: function() {
                    this.update();
                }
            }
        });
    } else {
        console.warn('Swiper not loaded');
    }
});
