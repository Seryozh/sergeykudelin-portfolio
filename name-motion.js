(() => {
  const name = document.getElementById('name');
  if (!name || name.dataset.motionReady === 'true') return;
  const letters = [...name.querySelectorAll('.name-letter')];
  if (!letters.length) return;
  name.dataset.motionReady = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = letters.map(element => ({ element, center: 0, y: 0, rotation: 0 }));
  let bounds;
  let pointer = null;
  let active = false;
  let frame = 0;
  let previousTime = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const measure = () => {
    bounds = name.getBoundingClientRect();
    state.forEach(letter => {
      const rect = letter.element.getBoundingClientRect();
      letter.center = rect.left + rect.width / 2;
    });
  };

  const reset = () => {
    active = false;
    pointer = null;
    cancelAnimationFrame(frame);
    frame = 0;
    state.forEach(letter => {
      letter.y = 0;
      letter.rotation = 0;
      letter.element.style.removeProperty('transform');
    });
  };

  const animate = time => {
    frame = 0;
    if (reducedMotion.matches || document.hidden) return reset();
    const dt = clamp((time - previousTime) / 1000, 0, 0.033);
    previousTime = time;
    // Refresh-rate-independent damping cannot overshoot. Leave uses the same
    // state and eases back more slowly, without restarting any animation.
    const alpha = 1 - Math.exp(-dt / (active ? 0.16 : 0.28));
    const radius = Math.max(75, bounds.height * 1.1);
    const vertical = pointer
      ? clamp((pointer.y - bounds.top - bounds.height / 2) / (bounds.height * 0.65), -1, 1)
      : 0;
    let unsettled = false;

    state.forEach(letter => {
      let targetY = 0;
      let targetRotation = 0;
      if (active && pointer) {
        const distance = (pointer.x - letter.center) / radius;
        const influence = Math.exp(-distance * distance * 0.75);
        // A soft local lift follows the cursor and spreads into nearby letters.
        targetY = clamp((-1.4 + 0.85 * vertical) * influence, -2.5, 2.5);
        targetRotation = clamp(-distance * influence * 1.2, -1.2, 1.2);
      }
      letter.y += (targetY - letter.y) * alpha;
      letter.rotation += (targetRotation - letter.rotation) * alpha;
      const settled = Math.abs(targetY - letter.y) < 0.005
        && Math.abs(targetRotation - letter.rotation) < 0.005;
      if (settled) {
        letter.y = targetY;
        letter.rotation = targetRotation;
      } else {
        unsettled = true;
      }
      if (!active && settled) {
        letter.element.style.removeProperty('transform');
      } else {
        letter.element.style.transform = `translateY(${letter.y.toFixed(3)}px) rotate(${letter.rotation.toFixed(3)}deg)`;
      }
    });
    if (unsettled) frame = requestAnimationFrame(animate);
  };

  const wake = () => {
    if (frame || reducedMotion.matches || document.hidden) return;
    previousTime = performance.now();
    frame = requestAnimationFrame(animate);
  };
  const move = event => {
    // Touch can scroll and select the name; it never creates a hover state.
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    if (!active) measure();
    active = true;
    pointer = { x: event.clientX, y: event.clientY };
    wake();
  };
  const leave = () => {
    active = false;
    pointer = null;
    wake();
  };
  const remeasure = () => {
    measure();
    if (active && pointer) {
      if (pointer.x < bounds.left || pointer.x > bounds.right
        || pointer.y < bounds.top || pointer.y > bounds.bottom) leave();
      else wake();
    }
  };

  measure();
  name.addEventListener('pointerenter', move);
  name.addEventListener('pointermove', move);
  name.addEventListener('pointerleave', leave);
  name.addEventListener('pointercancel', leave);
  name.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') leave();
  });
  window.addEventListener('blur', leave);
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('scroll', remeasure, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
  reducedMotion.addEventListener('change', () => {
    reset();
    measure();
  });
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(name);
  if (document.fonts) document.fonts.ready.then(remeasure);
})();
