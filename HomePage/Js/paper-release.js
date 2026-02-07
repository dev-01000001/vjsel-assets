// Carousel các số báo đã xuất bản - Swiper JS

document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.articles-carousel', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        
        spaceBetween: 20, // Fixed 20px spacing for small screens
        slidesPerView: 'auto', // Allow partial visibility

        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 414px
            414: {
                slidesPerView: 'auto',
                spaceBetween: 20
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window width is >= 1280px
            1280: {
                slidesPerView: 4,
                spaceBetween: 24
            },
            // when window width is >= 1440px
            1440: {
                slidesPerView: 6,
                spaceBetween: 24
            }
        },

        // Navigation arrows
        navigation: {
            nextEl: '.carousel-nav--next',
            prevEl: '.carousel-nav--prev',
        },

        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});

