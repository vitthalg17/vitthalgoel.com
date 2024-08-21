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