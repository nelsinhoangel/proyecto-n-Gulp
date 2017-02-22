var onScroll = function () {
  if(window.scrollY >= 200) {
    headerElem.classList.toggle('.header--light');
  } else {
    headerElem.classList.toggle('.header--light');
  }
}

module.exports = onScroll;
