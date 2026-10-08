(() => {
  'use strict';

  const canvas = document.getElementById('paper-grid');
  if (!canvas || !canvas.getContext) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const GRID = 24;
  const MAX_NODES = 4000;
  const RADIUS = 156;
  const pointer = { x: 0, y: 0, active: false, down: false, pullX: 0, pullY: 0 };
  let width = 0;
  let height = 0;
  let meshStep = GRID;
  let columns = 0;
  let rows = 0;
  let count = 0;
  let x = new Float32Array(0);
  let y = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let strokeColor = '';
  let frame = 0;
  let previousTime = 0;
  let quietFrames = 0;
  let deformed = false;
  let failed = false;

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }

  function fallback() {
    failed = true;
    stop();
    root.classList.remove('grid-ready');
    canvas.hidden = true;
  }

  // A coarse spring mesh keeps the work bounded on large displays. The drawn
  // notebook lines still remain 24 CSS pixels apart.
  function buildMesh() {
    meshStep = GRID;
    do {
      columns = Math.ceil(width / meshStep) + 3;
      rows = Math.ceil(height / meshStep) + 3;
      if (columns * rows <= MAX_NODES) break;
      meshStep += GRID;
    } while (meshStep < Math.max(width, height) + GRID);
    count = columns * rows;
    x = new Float32Array(count);
    y = new Float32Array(count);
    vx = new Float32Array(count);
    vy = new Float32Array(count);
    deformed = false;
    quietFrames = 0;
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = strokeColor;
    context.lineWidth = 1;
    context.beginPath();

    if (!deformed || reducedMotion.matches) {
      for (let line = 0.5; line <= width; line += GRID) {
        context.moveTo(line, 0);
        context.lineTo(line, height);
      }
      for (let line = 0.5; line <= height; line += GRID) {
        context.moveTo(0, line);
        context.lineTo(width, line);
      }
    } else {
      // Interpolate the spring mesh for each crossing. This keeps neighboring
      // lines on one continuous sheet instead of making separate moving tiles.
      function vertex(px, py, first) {
        const gx = px / meshStep + 1;
        const gy = py / meshStep + 1;
        const col = Math.max(0, Math.min(columns - 2, Math.floor(gx)));
        const row = Math.max(0, Math.min(rows - 2, Math.floor(gy)));
        const tx = gx - col;
        const ty = gy - row;
        const a = row * columns + col;
        const b = a + 1;
        const c = a + columns;
        const d = c + 1;
        const top = (1 - tx) * (1 - ty);
        const right = tx * (1 - ty);
        const bottom = (1 - tx) * ty;
        const corner = tx * ty;
        const dx = x[a] * top + x[b] * right + x[c] * bottom + x[d] * corner;
        const dy = y[a] * top + y[b] * right + y[c] * bottom + y[d] * corner;
        if (first) context.moveTo(px + dx, py + dy);
        else context.lineTo(px + dx, py + dy);
      }

      for (let line = 0.5; line <= height; line += GRID) {
        for (let col = 0; col < columns; col++) {
          vertex((col - 1) * meshStep, line, col === 0);
        }
      }
      for (let line = 0.5; line <= width; line += GRID) {
        for (let row = 0; row < rows; row++) {
          vertex(line, (row - 1) * meshStep, row === 0);
        }
      }
    }
    context.stroke();
  }

  function step(delta) {
    let motion = 0;
    const damping = Math.pow(0.65, delta);
    const pressure = pointer.down ? 5 : 3.5;
    const radiusSquared = RADIUS * RADIUS;

    // Update velocities before positions so every spring reads the same sheet.
    for (let row = 0; row < rows; row++) {
      const py = (row - 1) * meshStep;
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        let targetX = 0;
        let targetY = 0;
        if (pointer.active) {
          const dx = (col - 1) * meshStep - pointer.x;
          const dy = py - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < radiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const falloff = Math.pow(1 - distanceSquared / radiusSquared, 2);
            const pressureAtPoint = pressure * falloff / (distance + 30);
            targetX = dx * pressureAtPoint + pointer.pullX * falloff;
            targetY = dy * pressureAtPoint + pointer.pullY * falloff;
          }
        }

        let neighborX = 0;
        let neighborY = 0;
        let neighbors = 0;
        if (col > 0) { neighborX += x[index - 1]; neighborY += y[index - 1]; neighbors++; }
        if (col < columns - 1) { neighborX += x[index + 1]; neighborY += y[index + 1]; neighbors++; }
        if (row > 0) { neighborX += x[index - columns]; neighborY += y[index - columns]; neighbors++; }
        if (row < rows - 1) { neighborX += x[index + columns]; neighborY += y[index + columns]; neighbors++; }

        const ax = (targetX - x[index]) * 0.03 + (neighborX / neighbors - x[index]) * 0.01;
        const ay = (targetY - y[index]) * 0.03 + (neighborY / neighbors - y[index]) * 0.01;
        vx[index] = (vx[index] + ax * delta) * damping;
        vy[index] = (vy[index] + ay * delta) * damping;
        motion = Math.max(motion, Math.abs(vx[index]), Math.abs(vy[index]), Math.abs(ax), Math.abs(ay));
      }
    }

    for (let index = 0; index < count; index++) {
      x[index] += vx[index] * delta;
      y[index] += vy[index] * delta;
    }
    pointer.pullX *= Math.pow(0.84, delta);
    pointer.pullY *= Math.pow(0.84, delta);
    deformed = true;
    return motion;
  }

  function tick(time) {
    frame = 0;
    if (failed || document.hidden || reducedMotion.matches) return;
    try {
      const delta = previousTime ? Math.min(2, Math.max(0.25, (time - previousTime) / (1000 / 60))) : 1;
      previousTime = time;
      const motion = step(delta);
      draw();
      quietFrames = motion < 0.004 ? quietFrames + 1 : 0;
      if (quietFrames < 10) frame = window.requestAnimationFrame(tick);
      else {
        previousTime = 0;
        if (!pointer.active) {
          x.fill(0);
          y.fill(0);
          vx.fill(0);
          vy.fill(0);
          deformed = false;
          draw();
        }
      }
    } catch (_) { fallback(); }
  }

  function wake() {
    if (failed || frame || document.hidden || reducedMotion.matches || !width || !height) return;
    quietFrames = 0;
    frame = window.requestAnimationFrame(tick);
  }

  function refreshColor() {
    if (failed) return;
    try {
      strokeColor = getComputedStyle(root).getPropertyValue('--grid').trim() || 'rgba(85,106,118,.07)';
      draw();
    } catch (_) { fallback(); }
  }

  function resize() {
    if (failed) return;
    try {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(bounds.width * ratio);
      const pixelHeight = Math.round(bounds.height * ratio);
      if (width === bounds.width && height === bounds.height && canvas.width === pixelWidth && canvas.height === pixelHeight) return;
      stop();
      width = bounds.width;
      height = bounds.height;
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildMesh();
      strokeColor = getComputedStyle(root).getPropertyValue('--grid').trim() || 'rgba(85,106,118,.07)';
      draw();
      root.classList.add('grid-ready');
      if (pointer.active) wake();
    } catch (_) { fallback(); }
  }

  function leave() {
    if (!pointer.active && !pointer.down) return;
    pointer.active = false;
    pointer.down = false;
    wake();
  }

  function move(event) {
    if (failed || document.hidden || reducedMotion.matches || event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    const nextX = event.clientX - bounds.left;
    const nextY = event.clientY - bounds.top;
    if (nextX < 0 || nextY < 0 || nextX > width || nextY > height) { leave(); return; }
    if (pointer.active) {
      pointer.pullX = Math.max(-0.6, Math.min(0.6, (nextX - pointer.x) * 0.035));
      pointer.pullY = Math.max(-0.6, Math.min(0.6, (nextY - pointer.y) * 0.035));
    }
    pointer.x = nextX;
    pointer.y = nextY;
    pointer.active = true;
    wake();
  }

  try {
    resize();
    if (failed) return;
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' || event.button !== 0 || reducedMotion.matches) return;
      move(event);
      pointer.down = true;
      wake();
    }, { passive: true });
    window.addEventListener('pointerup', () => { pointer.down = false; wake(); }, { passive: true });
    window.addEventListener('pointercancel', leave, { passive: true });
    window.addEventListener('blur', leave);
    root.addEventListener('pointerleave', leave, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pointer.active = false;
        pointer.down = false;
        stop();
      } else {
        resize();
        refreshColor();
        if (deformed) wake();
      }
    });

    const onMotionChange = () => {
      stop();
      pointer.active = false;
      pointer.down = false;
      pointer.pullX = 0;
      pointer.pullY = 0;
      x.fill(0);
      y.fill(0);
      vx.fill(0);
      vy.fill(0);
      deformed = false;
      refreshColor();
    };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
    else reducedMotion.addListener(onMotionChange);
    if (colorScheme.addEventListener) colorScheme.addEventListener('change', refreshColor);
    else colorScheme.addListener(refreshColor);

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    if (window.MutationObserver) {
      const themeObserver = new MutationObserver(refreshColor);
      themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
      if (document.body) themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
    }
    canvas.addEventListener('contextlost', fallback);
  } catch (_) { fallback(); }
})();
