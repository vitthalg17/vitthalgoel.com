// Hyperspace starfield background — shown only in dark mode.
// Dependency-free adaptation of a "jump to hyperspace" canvas demo
// (original used GSAP/TweenMax + lodash; here it's vanilla and ambient).
(function () {
  const canvas = document.getElementById('hyperspace');
  if (!canvas) return;
  const context = canvas.getContext('2d');

  const BASE_SIZE = 1;
  const VELOCITY_INC = 1.01; // stars accelerate outward -> streaks lengthen
  const SIZE_INC = 1.01;
  const RAD = Math.PI / 180;
  const STAR_COUNT = 300;

  const randomInRange = (max, min) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A single particle: position, velocity vector, length and alpha.
  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      const angle = randomInRange(0, 360) * RAD;
      const vX = Math.cos(angle);
      const vY = Math.sin(angle);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const travelled =
        Math.random() > 0.5
          ? Math.random() * Math.max(w, h) + Math.random() * (w * 0.24)
          : Math.random() * (w * 0.25);
      this.STATE = {
        alpha: Math.random(),
        x: Math.floor(vX * travelled) + w / 2,
        y: Math.floor(vY * travelled) + h / 2,
        vX,
        vY,
        size: BASE_SIZE,
      };
    }
  }

  let stars = [];
  let running = false;
  let rafId = null;

  function setup() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.lineCap = 'round';
  }

  function makeStars() {
    stars = new Array(STAR_COUNT).fill().map(() => new Star());
  }

  function drawStatic() {
    // Reduced-motion: a calm, non-animated star field.
    const w = window.innerWidth;
    const h = window.innerHeight;
    context.clearRect(0, 0, w, h);
    for (const star of stars) {
      const s = star.STATE;
      context.fillStyle = `rgba(255,255,255,${s.alpha})`;
      context.fillRect(s.x, s.y, 1.4, 1.4);
    }
  }

  function render() {
    if (!running) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    context.clearRect(0, 0, w, h);
    for (const star of stars) {
      const s = star.STATE;
      // Recycle a star once it leaves the viewport.
      if (s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
        star.reset();
        continue;
      }
      const prevX = s.x;
      const prevY = s.y;
      s.x += s.vX;
      s.y += s.vY;
      s.vX *= VELOCITY_INC;
      s.vY *= VELOCITY_INC;
      s.size *= SIZE_INC;
      context.strokeStyle = `rgba(255,255,255,${s.alpha})`;
      context.lineWidth = s.size;
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(s.x, s.y);
      context.stroke();
    }
    rafId = requestAnimationFrame(render);
  }

  function start() {
    if (running) return;
    setup();
    makeStars();
    if (prefersReducedMotion) {
      drawStatic();
      return;
    }
    running = true;
    rafId = requestAnimationFrame(render);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Only redo work while the easter egg is active.
      if (!document.documentElement.classList.contains('sw')) return;
      setup();
      makeStars();
      if (prefersReducedMotion) drawStatic();
    }, 250);
  });

  window.hyperspace = { start, stop };
})();
