/**
 * Category Navigation using Swiper
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper for Category Nav
    if (typeof Swiper !== 'undefined') {
        const categorySwiper = new Swiper('.category-nav__scroll', {
            slidesPerView: 'auto',
            spaceBetween: 12,
            freeMode: true,
            grabCursor: true, 
            navigation: {
                nextEl: '.category-nav__button--next',
                prevEl: '.category-nav__button--prev',
            },
            keyboard: {
                enabled: true,
            },
            mousewheel: {
                forceToAxis: true,
            },
        });
    } else {
        console.warn('Swiper library not loaded');
    }
});
