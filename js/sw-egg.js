// Star Wars easter egg.
// Hovering the profile picture previews the theme: gold shockwaves blast out of the picture and the
// theme spreads from it in a growing circle; moving off collapses it back into the picture. One click
// (or tap) keeps it on; another click, Escape or the BB-8 toggle turns it off. Typing "star" toggles it.
// The circle reveal uses View Transitions where the browser has them; elsewhere the theme just swaps.
(function () {
  const html = document.documentElement;
  const pic = document.getElementById('profile-pic');
  if (!pic) return;
  const pfp = pic.closest('.sw-pfp');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EXPAND = { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };   // blasts out, then settles
  const COLLAPSE = { duration: 550, easing: 'cubic-bezier(0.7, 0, 0.84, 0)' }; // implodes, fastest at the end

  let committed = false;  // clicked on: stays on when the cursor leaves
  let want = false;       // whether the theme should be showing
  let shown = false;      // whether the page currently has the theme
  let wasDark = false;    // theme to return to when it switches off: the one before a preview, dark once clicked on
  let run = null;         // the reveal in flight: { target, anim, waves, transition }

  const wavesEl = document.createElement('div');
  wavesEl.id = 'sw-waves';
  wavesEl.setAttribute('aria-hidden', 'true');
  document.body.appendChild(wavesEl);

  function persistDark() {
    // keep dark mode afterwards, with the BB-8 toggle flipped so clicking it returns to light mode
    wasDark = true;
    if (typeof setTheme === 'function') setTheme(1);
    localStorage.setItem('theme-mode', 1);
  }

  function apply(on) {
    if (on === shown) return;
    shown = on;
    if (on) {
      wasDark = html.classList.contains('dark');
      html.classList.add('dark', 'sw');
      if (committed) persistDark();
      if (window.hyperspace) window.hyperspace.start();
    } else {
      html.classList.remove('sw');
      if (!wasDark) html.classList.remove('dark');
      if (window.hyperspace) window.hyperspace.stop();
    }
  }

  function geometry() {
    const r = pic.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    return { x, y, r0: r.width / 2, far: Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) };
  }
  const circle = (g, r) => `circle(${r}px at ${g.x}px ${g.y}px)`;

  // gold rings riding the edge of the reveal: blasting out from the picture, or collapsing back into it
  function makeWaves(g, out, timing) {
    wavesEl.textContent = '';
    return [0, 1, 2].map((i) => {
      const w = document.createElement('div');
      w.className = 'sw-wave';
      w.style.left = `${g.x}px`;
      w.style.top = `${g.y}px`;
      wavesEl.appendChild(w);
      const small = 2 * g.r0, big = 2 * g.far * (out ? 1 - 0.16 * i : 1 + 0.12 * i);
      const strength = 1 - 0.28 * i;
      const a = { width: `${small}px`, height: `${small}px`, opacity: out ? strength : 1 };
      const b = { width: `${big}px`, height: `${big}px`, opacity: out ? 0 : strength * 0.4 };
      return w.animate(out ? [a, b] : [b, a], { ...timing, fill: 'both' });
    });
  }

  function punch() {
    pic.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)', offset: 0.35 }, { transform: 'scale(1)' }],
      { duration: 450, easing: 'ease-out' });
  }

  function finish(r) {
    if (run !== r) return;
    run = null;
    apply(r.target); // after a reversal this puts the page back where it started
    wavesEl.textContent = '';
    delete html.dataset.swAnim;
    reconcile();
  }

  function start(on) {
    if (reduced) { apply(on); return; }
    const g = geometry();
    const timing = on ? EXPAND : COLLAPSE;
    const r = { target: on, anim: null, waves: makeWaves(g, on, timing), transition: null };
    run = r;
    if (on) punch();
    if (!document.startViewTransition) {
      apply(on);
      r.anim = r.waves[0];
      r.anim.onfinish = () => finish(r);
      return;
    }
    html.dataset.swAnim = on ? 'expand' : 'collapse';
    r.transition = document.startViewTransition(() => apply(on));
    r.transition.ready.then(() => {
      if (run !== r) return;
      // expanding: the new (themed) page grows out of the picture; collapsing: the old one shrinks into it
      const big = circle(g, g.far), small = circle(g, g.r0);
      r.anim = html.animate({ clipPath: on ? [small, big] : [big, small] },
        { ...timing, fill: 'both', pseudoElement: on ? '::view-transition-new(root)' : '::view-transition-old(root)' });
      if (r.target !== on) r.anim.reverse(); // the cursor already left while the page was being captured
      r.anim.onfinish = () => finish(r);
    }, () => finish(r));
  }

  // the cursor changed its mind mid-animation: play back from where it is instead of jumping
  function reverse(r) {
    r.target = !r.target;
    r.waves.forEach((a) => a.reverse());
    if (!r.transition) apply(r.target); // no circle reveal to wait for
    else if (r.anim) r.anim.reverse();
  }

  function reconcile() {
    if (run) {
      if (run.target !== want) reverse(run);
      return;
    }
    if (want !== shown) start(want);
  }

  function cancel() {
    if (!run) return;
    const r = run;
    run = null;
    r.waves.forEach((a) => a.cancel());
    if (r.transition) r.transition.skipTransition();
    wavesEl.textContent = '';
    delete html.dataset.swAnim;
  }

  function activate() {
    committed = true;
    want = true;
    hidePrompt();
    if (shown) persistDark(); // already showing as a preview
    reconcile();
  }

  function deactivate(instant) {
    committed = false;
    want = false;
    if (instant) { cancel(); apply(false); } else reconcile();
  }

  const toggle = () => (committed ? deactivate(false) : activate());

  // Let the BB-8 theme toggle exit the easter egg (instantly: it has just changed the theme itself).
  window.__swEgg = { deactivate: () => deactivate(true), toggle, isActive: () => committed };

  // Hover previews it, leaving collapses it, one click keeps it. Only real moves in and out count: the
  // reveal briefly covers the page, which can make the browser report leave/enter without the cursor moving
  let hoverTimer = 0, over = false;
  const isOver = (e) => {
    const r = pic.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };
  pic.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || over) return;
    over = true;
    if (committed) return;
    hoverTimer = setTimeout(() => { want = true; reconcile(); }, 80); // ignore a cursor just passing over
  });
  pic.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || isOver(e)) return;
    over = false;
    clearTimeout(hoverTimer);
    if (committed) return;
    want = false;
    reconcile();
  });
  pic.addEventListener('click', () => {
    clearTimeout(hoverTimer);
    toggle();
  });

  // Typing "star" toggles it, Escape exits
  const SEQUENCE = 'star';
  let buffer = '';
  window.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.key === 'Escape') {
      if (committed) deactivate(false);
      buffer = '';
      return;
    }
    if (e.key && e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-SEQUENCE.length);
      if (buffer === SEQUENCE) {
        toggle();
        buffer = '';
      }
    }
  });

  // After 30s on the page, a pulsing gold glow nudges undiscovered visitors to click the picture
  let promptTimer = setTimeout(() => { if (!committed && pfp) pfp.classList.add('sw-prompt'); }, 30000);
  function hidePrompt() {
    clearTimeout(promptTimer);
    if (pfp) pfp.classList.remove('sw-prompt');
  }
})();
