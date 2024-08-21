// Light switcher
const lightSwitches = document.querySelectorAll('.light-switch');
if (lightSwitches.length > 0) {
  lightSwitches.forEach((lightSwitch, i) => {
    if (localStorage.getItem('dark-mode') === 'true') {
      // eslint-disable-next-line no-param-reassign
      lightSwitch.checked = true;
    }
    lightSwitch.addEventListener('change', () => {
      const { checked } = lightSwitch;
      lightSwitches.forEach((el, n) => {
        if (n !== i) {
          // eslint-disable-next-line no-param-reassign
          el.checked = checked;
        }
      });
      if (lightSwitch.checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('dark-mode', true);
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dark-mode', false);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const swipeContainer = document.querySelector('.swipe-container');
  const images = swipeContainer.querySelectorAll('img');

  // Adjust initial scroll position to center the first image
  const centerFirstImage = () => {
    const firstImage = images[0];
    const containerWidth = swipeContainer.clientWidth;
    const imageWidth = firstImage.clientWidth;
    const initialScrollPosition = firstImage.offsetLeft - (containerWidth - imageWidth) / 2;
    swipeContainer.scrollLeft = initialScrollPosition;
  };

  centerFirstImage();

  let isDown = false;
  let startX;
  let scrollLeft;

  // Handle mouse events
  swipeContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - swipeContainer.offsetLeft;
    scrollLeft = swipeContainer.scrollLeft;
  });

  swipeContainer.addEventListener('mouseleave', () => {
    isDown = false;
  });

  swipeContainer.addEventListener('mouseup', () => {
    isDown = false;
    snapToImage();
  });

  swipeContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - swipeContainer.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    swipeContainer.scrollLeft = scrollLeft - walk;
  });

  // Handle touch events
  swipeContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    scrollLeft = swipeContainer.scrollLeft;
  });

  swipeContainer.addEventListener('touchmove', (e) => {
    const x = e.touches[0].clientX;
    const walk = (startX - x) * 1.5; // Adjust scroll speed
    swipeContainer.scrollLeft = scrollLeft + walk;
  });

  swipeContainer.addEventListener('touchend', snapToImage);

  // Snap to the nearest image based on the scroll position
  function snapToImage() {
    let nearestImage = images[0];
    let nearestDistance = Math.abs(swipeContainer.scrollLeft - nearestImage.offsetLeft);

    images.forEach((image) => {
      const distance = Math.abs(swipeContainer.scrollLeft - image.offsetLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestImage = image;
      }
    });

    swipeContainer.scrollTo({
      left: nearestImage.offsetLeft - (swipeContainer.clientWidth - nearestImage.clientWidth) / 2,
      behavior: 'smooth',
    });
  }
});
