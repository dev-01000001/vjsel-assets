/**
 * Điều hướng danh mục
 * Ẩn/hiện nút cuộn và cuộn mượt
 */

(function () {
  const scrollContainer = document.querySelector('.category-nav__scroll');
  const prevButton = document.querySelector('.category-nav__button--prev');
  const nextButton = document.querySelector('.category-nav__button--next');

  if (!scrollContainer) return;

  // Kiểm tra vị trí để ẩn/hiện nút
  function checkScrollPosition() {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    if (prevButton) {
      prevButton.style.display = scrollLeft > 10 ? 'flex' : 'none';
    }

    if (nextButton) {
      nextButton.style.display = scrollLeft + clientWidth < scrollWidth - 10 ? 'flex' : 'none';
    }
  }

  // Cuộn sang phải
  function scrollRight() {
    scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // Cuộn sang trái
  function scrollLeft() {
    scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
  }

  // Gắn sự kiện click cho nút
  if (nextButton) {
    nextButton.addEventListener('click', scrollRight);
  }

  if (prevButton) {
    prevButton.addEventListener('click', scrollLeft);
  }

  scrollContainer.addEventListener('scroll', checkScrollPosition);

  // Kiểm tra lần đầu khi load
  checkScrollPosition();

  // Kiểm tra lại khi resize màn hình
  window.addEventListener('resize', checkScrollPosition);
})();
