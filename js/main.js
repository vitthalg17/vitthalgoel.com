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

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const submitButton = document.getElementById('submitButton');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.reset();
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
      } else {
        throw new Error('Form submission failed');
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('There was an error submitting the form. Please try again.');
    }).finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    });
  });
});

document.getElementById('current-year').textContent = new Date().getFullYear();

// Header images carousel rotation
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.swipe-container');
  const images = container.querySelectorAll('img');
  const imageSources = [
    './images/header-image-01.png',
    './images/header-image-02.png', 
    './images/header-image-03.png'
  ];
  
  let currentRotation = 0;
  
  function rotateImages() {
    // Add rotating class for animation
    images.forEach(img => img.classList.add('rotating'));
    
    setTimeout(() => {
      // Rotate the sources: 01->02 position, 02->03 position, 03->01 position
      currentRotation = (currentRotation + 1) % 3;
      
      images.forEach((img, index) => {
        const newSourceIndex = (index + currentRotation) % 3;
        img.src = imageSources[newSourceIndex];
      });
      
      // Remove rotating class after source change
      setTimeout(() => {
        images.forEach(img => img.classList.remove('rotating'));
      }, 50);
    }, 300);
  }
  
  // Rotate every 4 seconds (increased for smoother feel)
  setInterval(rotateImages, 4000);
});

// Smooth scroll fallback for anchor links
document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

