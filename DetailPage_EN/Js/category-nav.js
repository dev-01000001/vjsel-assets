/**
 * Điều hướng danh mục
 * Xử lý ẩn/hiện nút cuộn và cuộn mượt mà
 */

(function () {
  const scrollContainer = document.querySelector('.category-nav__scroll');
  const prevButton = document.querySelector('.category-nav__button--prev');
  const nextButton = document.querySelector('.category-nav__button--next');

  if (!scrollContainer) return;

  // Kiểm tra vị trí cuộn để ẩn/hiện nút
  function checkScrollPosition() {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    if (prevButton) {
      prevButton.style.display = scrollLeft > 10 ? 'flex' : 'none';
    }

    if (nextButton) {
      nextButton.style.display = scrollLeft + clientWidth < scrollWidth - 10 ? 'flex' : 'none';
    }
  }

  // Cuộn phải
  function scrollRight() {
    scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // Cuộn trái
  function scrollLeft() {
    scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
  }

  // Gắn sự kiện click
  if (nextButton) {
    nextButton.addEventListener('click', scrollRight);
  }

  if (prevButton) {
    prevButton.addEventListener('click', scrollLeft);
  }

  scrollContainer.addEventListener('scroll', checkScrollPosition);

  // Kiểm tra lần đầu
  checkScrollPosition();

  // Kiểm tra lại khi thay đổi kích thước màn hình
  window.addEventListener('resize', checkScrollPosition);
})();
