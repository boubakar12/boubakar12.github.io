/* Journey globe for about.html */
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const STOPS = [
    {
      city: 'Conakry, Guinea',
      lat: 9.641,
      lon: -13.578,
      col: '#f0b429',
      yr: 'Origin',
      role: 'Birthplace · West Africa',
      desc: 'Born and raised in Conakry, Guinea. The starting point of a journey that now stretches across two continents.'
    },
    {
      city: 'Boston / Quincy, MA',
      lat: 42.253,
      lon: -71.002,
      col: '#f0b429',
      yr: '2019 –',
      role: 'Home base · United States',
      desc: 'Immigrated to the United States, studied at North Quincy High School, and started early engineering work with the City of Quincy.'
    },
    {
      city: 'Ithaca, NY',
      lat: 42.453,
      lon: -76.473,
      col: '#60a5fa',
      yr: '2024 –',
      role: 'Cornell University · ECE',
      desc: 'Electrical and Computer Engineering at Cornell, plus scholarships, leadership work, and the start of deeper systems engineering.'
    },
    {
      city: 'Jacksonville, FL',
      lat: 30.332,
      lon: -81.656,
      col: '#4ade80',
      yr: 'Summer 2025',
      role: 'ADAS Safe · Embedded Intern',
      desc: 'Built real-time multi-sensor firmware for safety-critical ADAS validation using synchronized radar, IMU, and LiDAR pipelines.'
    },
    {
      city: 'San Jose, CA',
      lat: 37.338,
      lon: -121.886,
      col: '#f472b6',
      yr: 'Fall 2025',
      role: 'Beta University · Silicon Valley',
      desc: 'Selected nationally for an 8-week accelerator-style experience centered on hardware-constrained AI and venture-backed product thinking.'
    },
    {
      city: 'New York City, NY',
      lat: 40.713,
      lon: -74.006,
      col: '#4ade80',
      yr: '2026 –',
      role: 'Simulacrum · Embedded Data Intern',
      desc: 'Working on low-latency embedded data infrastructure in New York, connecting sensor systems, streaming pipelines, and observability.'
    }
  ];

  const CONTINENTS = [
    [[72, -168], [72, -140], [65, -168], [55, -130], [49, -124], [32, -117], [22, -110], [15, -92], [10, -84], [15, -83], [25, -80], [33, -78], [35, -75], [45, -66], [48, -70], [55, -60], [65, -64], [72, -78], [75, -110], [75, -140], [72, -168]],
    [[84, -42], [76, -18], [62, -18], [60, -44], [65, -55], [77, -72], [84, -42]],
    [[12, -72], [10, -62], [8, -60], [4, -51], [0, -50], [-5, -35], [-15, -39], [-23, -43], [-34, -53], [-42, -65], [-55, -67], [-55, -64], [-38, -57], [-22, -41], [-5, -35], [5, -77], [10, -75], [12, -72]],
    [[71, 30], [65, 14], [58, 5], [44, 0], [36, 5], [36, 14], [38, 26], [42, 28], [42, 35], [48, 40], [55, 38], [60, 30], [65, 24], [71, 30]],
    [[51, -11], [59, -4], [58, 0], [51, 0], [50, -4], [51, -11]],
    [[61, -24], [64, -14], [66, -13], [65, -22], [61, -24]],
    [[37, 10], [37, 34], [22, 38], [12, 44], [11, 51], [0, 42], [-12, 40], [-35, 27], [-35, 18], [-17, 12], [0, 10], [5, -8], [15, -17], [22, -17], [37, 10]],
    [[-12, 49], [-25, 47], [-26, 44], [-13, 44], [-12, 49]],
    [[72, 50], [65, 55], [38, 27], [22, 40], [10, 45], [1, 104], [10, 120], [22, 121], [35, 120], [40, 130], [53, 142], [72, 140], [72, 50]],
    [[45, 141], [40, 141], [34, 131], [34, 130], [40, 128], [45, 141]],
    [[22, 68], [8, 76], [8, 80], [10, 79], [22, 88], [28, 97], [25, 68], [22, 68]],
    [[22, 100], [10, 100], [2, 104], [1, 104], [10, 120], [22, 100]],
    [[-16, 130], [-20, 150], [-28, 154], [-38, 148], [-39, 144], [-35, 117], [-22, 114], [-16, 130]],
    [[-68, 0], [-68, 180], [-68, -180], [-68, 0]]
  ];

  const DEG = Math.PI / 180;
  const fallback = document.getElementById('globe-fallback');
  const wrap = canvas.parentElement;
  const offscreen = document.createElement('canvas');
  const offscreenCtx = offscreen.getContext('2d');
  const textureCanvas = document.createElement('canvas');
  const textureCtx = textureCanvas.getContext('2d');

  if (!wrap || !offscreenCtx || !textureCtx) return;

  const state = {
    width: 0,
    height: 500,
    dpr: 1,
    radius: 0,
    centerX: 0,
    centerY: 0,
    spin: true,
    drag: false,
    moved: false,
    pointerX: 0,
    pointerY: 0,
    tick: 0,
    activeIndex: 0,
    rotationY: -0.7,
    rotationX: 0.22,
    targetY: -0.7,
    targetX: 0.22,
    zoom: 1,
    targetZoom: 1,
    touchDistance: 0,
    lastFrame: 0,
    renderSize: 320,
    globePixels: [],
    markerScreenPositions: []
  };

  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.8 + 0.3,
    alpha: Math.random() * 0.55 + 0.12
  }));

  let textureData = null;

  function setFallback(message, hidden) {
    if (!fallback) return;
    fallback.textContent = message;
    fallback.classList.toggle('is-hidden', hidden);
  }

  function updateCard(index) {
    const stop = STOPS[index];
    const accent = document.getElementById('globe-card-accent');
    const cardIndex = document.getElementById('globe-card-index');
    const city = document.getElementById('globe-card-city');
    const role = document.getElementById('globe-card-role');
    const desc = document.getElementById('globe-card-desc');
    const bar = document.getElementById('globe-card-bar');
    const card = document.getElementById('globe-card');

    if (!card) return;

    if (accent) accent.style.background = stop.col;
    if (cardIndex) cardIndex.textContent = `${String(index + 1).padStart(2, '0')} / ${STOPS.length}  ·  ${stop.yr}`;
    if (city) {
      city.textContent = stop.city;
      city.style.color = stop.col;
    }
    if (role) {
      role.textContent = stop.role;
      role.style.color = `${stop.col}cc`;
    }
    if (desc) desc.textContent = stop.desc;
    if (bar) {
      bar.style.width = `${((index + 1) / STOPS.length) * 100}%`;
      bar.style.background = stop.col;
    }

    card.classList.add('on');
    document.querySelectorAll('.g-pill').forEach((pill, pillIndex) => {
      pill.classList.toggle('on', pillIndex === index);
    });
  }

  function renderPills(activeIndex) {
    const pills = document.getElementById('globe-pills');
    if (!pills) return;

    pills.innerHTML = '';
    STOPS.forEach((stop, index) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `g-pill${index === activeIndex ? ' on' : ''}`;
      pill.innerHTML = `
        <span class="g-pill-dot" style="background:${stop.col}"></span>
        <span class="g-pill-text">
          <span class="g-pill-city">${stop.city}</span>
          <span class="g-pill-role">${stop.yr} · ${stop.role}</span>
        </span>
      `;
      pill.addEventListener('click', () => flyTo(index));
      pills.appendChild(pill);
    });
  }

  function buildTexture() {
    textureCanvas.width = 1024;
    textureCanvas.height = 512;

    const gradient = textureCtx.createLinearGradient(0, 0, 0, textureCanvas.height);
    gradient.addColorStop(0, '#163d6a');
    gradient.addColorStop(0.45, '#0f2e56');
    gradient.addColorStop(1, '#071828');
    textureCtx.fillStyle = gradient;
    textureCtx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    for (let y = 0; y < textureCanvas.height; y += 1) {
      const lat = 90 - (y / textureCanvas.height) * 180;
      textureCtx.fillStyle = `rgba(255,255,255,${Math.max(0, 0.042 * Math.cos(lat * DEG))})`;
      textureCtx.fillRect(0, y, textureCanvas.width, 1);
    }

    function llToTexture(lat, lon) {
      return [((lon + 180) / 360) * textureCanvas.width, ((90 - lat) / 180) * textureCanvas.height];
    }

    function drawPolygon(points) {
      textureCtx.beginPath();
      points.forEach(([lat, lon], index) => {
        const [x, y] = llToTexture(lat, lon);
        if (index === 0) textureCtx.moveTo(x, y);
        else textureCtx.lineTo(x, y);
      });
      textureCtx.closePath();
      textureCtx.fill();
    }

    textureCtx.fillStyle = '#2f7c46';
    CONTINENTS.forEach(drawPolygon);

    textureCtx.strokeStyle = 'rgba(255,255,255,0.06)';
    textureCtx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = ((90 - lat) / 180) * textureCanvas.height;
      textureCtx.beginPath();
      textureCtx.moveTo(0, y);
      textureCtx.lineTo(textureCanvas.width, y);
      textureCtx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 20) {
      const x = ((lon + 180) / 360) * textureCanvas.width;
      textureCtx.beginPath();
      textureCtx.moveTo(x, 0);
      textureCtx.lineTo(x, textureCanvas.height);
      textureCtx.stroke();
    }

    textureData = textureCtx.getImageData(0, 0, textureCanvas.width, textureCanvas.height).data;
  }

  function resizeCanvas() {
    state.width = wrap.clientWidth;
    state.height = 500;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.radius = Math.min(state.width * 0.34, state.height * 0.34);
    state.centerX = state.width * 0.48;
    state.centerY = state.height * 0.52;

    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    state.renderSize = Math.min(Math.max(Math.round(state.radius * 1.7), 220), 360);
    offscreen.width = state.renderSize;
    offscreen.height = state.renderSize;
    buildSpherePixels();
  }

  function buildSpherePixels() {
    const size = state.renderSize;
    const half = size / 2;
    state.globePixels = [];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const nx = (x + 0.5 - half) / half;
        const ny = -(y + 0.5 - half) / half;
        const rr = nx * nx + ny * ny;
        if (rr > 1) continue;
        state.globePixels.push({
          x,
          y,
          nx,
          ny,
          nz: Math.sqrt(1 - rr)
        });
      }
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function latLonToVector(lat, lon) {
    const latR = lat * DEG;
    const lonR = lon * DEG;
    const cosLat = Math.cos(latR);
    return {
      x: cosLat * Math.cos(lonR),
      y: Math.sin(latR),
      z: cosLat * Math.sin(lonR)
    };
  }

  function rotateVectorWorldToView(vector) {
    const cosY = Math.cos(state.rotationY);
    const sinY = Math.sin(state.rotationY);
    const cosX = Math.cos(state.rotationX);
    const sinX = Math.sin(state.rotationX);

    const x1 = vector.x * cosY + vector.z * sinY;
    const z1 = -vector.x * sinY + vector.z * cosY;
    const y1 = vector.y;

    return {
      x: x1,
      y: y1 * cosX - z1 * sinX,
      z: y1 * sinX + z1 * cosX
    };
  }

  function inverseRotateViewToWorld(vector) {
    const cosX = Math.cos(state.rotationX);
    const sinX = Math.sin(state.rotationX);
    const cosY = Math.cos(state.rotationY);
    const sinY = Math.sin(state.rotationY);

    const y1 = vector.y * cosX + vector.z * sinX;
    const z1 = -vector.y * sinX + vector.z * cosX;
    const x1 = vector.x;

    return {
      x: x1 * cosY - z1 * sinY,
      y: y1,
      z: x1 * sinY + z1 * cosY
    };
  }

  function projectPoint(lat, lon, scale) {
    const rotated = rotateVectorWorldToView(latLonToVector(lat, lon));
    if (rotated.z <= 0) return null;
    const radius = state.radius * scale;
    return {
      x: state.centerX + rotated.x * radius,
      y: state.centerY - rotated.y * radius,
      z: rotated.z
    };
  }

  function sampleTexture(lat, lon) {
    if (!textureData) return [9, 26, 46];
    const tx = clamp(Math.floor(((lon + Math.PI) / (Math.PI * 2)) * textureCanvas.width), 0, textureCanvas.width - 1);
    const ty = clamp(Math.floor((0.5 - lat / Math.PI) * textureCanvas.height), 0, textureCanvas.height - 1);
    const idx = (ty * textureCanvas.width + tx) * 4;
    return [textureData[idx], textureData[idx + 1], textureData[idx + 2]];
  }

  function renderSphereTexture() {
    const size = state.renderSize;
    const image = offscreenCtx.createImageData(size, size);
    const data = image.data;
    const light = { x: -0.2, y: 0.35, z: 0.92 };

    state.globePixels.forEach((pixel) => {
      const world = inverseRotateViewToWorld({
        x: pixel.nx,
        y: pixel.ny,
        z: pixel.nz
      });

      const lon = Math.atan2(world.z, world.x);
      const lat = Math.asin(clamp(world.y, -1, 1));
      const [r, g, b] = sampleTexture(lat, lon);

      const diffuse = Math.max(0, pixel.nx * light.x + pixel.ny * light.y + pixel.nz * light.z);
      const rim = Math.pow(1 - pixel.nz, 1.8) * 0.42;
      const shade = 0.42 + diffuse * 0.88 + rim;
      const offset = (pixel.y * size + pixel.x) * 4;

      data[offset] = Math.min(255, r * shade);
      data[offset + 1] = Math.min(255, g * shade);
      data[offset + 2] = Math.min(255, b * shade);
      data[offset + 3] = 255;
    });

    offscreenCtx.putImageData(image, 0, 0);
  }

  function drawStars() {
    const bg = ctx.createLinearGradient(0, 0, 0, state.height);
    bg.addColorStop(0, '#07101c');
    bg.addColorStop(0.55, '#04080f');
    bg.addColorStop(1, '#02050a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    stars.forEach((star, index) => {
      const alpha = star.alpha + Math.sin(state.tick * 0.8 + index * 0.35) * 0.04;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.08, alpha)})`;
      ctx.beginPath();
      ctx.arc(star.x * state.width, star.y * state.height, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawGlow() {
    const glow = ctx.createRadialGradient(
      state.centerX,
      state.centerY,
      state.radius * 0.55,
      state.centerX,
      state.centerY,
      state.radius * 1.4
    );
    glow.addColorStop(0, 'rgba(48,102,189,0.28)');
    glow.addColorStop(0.5, 'rgba(21,57,120,0.18)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, state.radius * 1.45, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(165, 202, 255, 0.18)';
    ctx.lineWidth = 1;

    function drawGeoLine(pointsBuilder) {
      ctx.beginPath();
      let drawing = false;

      for (let step = 0; step <= 120; step += 1) {
        const point = pointsBuilder(step);
        if (!point) {
          drawing = false;
          continue;
        }
        if (!drawing) {
          ctx.moveTo(point.x, point.y);
          drawing = true;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }

    for (let lat = -60; lat <= 60; lat += 20) {
      drawGeoLine((step) => projectPoint(lat, -180 + (360 * step) / 120, state.zoom));
    }

    for (let lon = -180; lon < 180; lon += 20) {
      drawGeoLine((step) => projectPoint(-90 + (180 * step) / 120, lon, state.zoom));
    }

    ctx.restore();
  }

  function slerpVector(a, b, t) {
    const dot = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
    const omega = Math.acos(dot);
    if (omega < 1e-5) return a;
    const sinOmega = Math.sin(omega);
    const scaleA = Math.sin((1 - t) * omega) / sinOmega;
    const scaleB = Math.sin(t * omega) / sinOmega;
    return {
      x: a.x * scaleA + b.x * scaleB,
      y: a.y * scaleA + b.y * scaleB,
      z: a.z * scaleA + b.z * scaleB
    };
  }

  function drawArcs() {
    for (let index = 0; index < STOPS.length - 1; index += 1) {
      const from = latLonToVector(STOPS[index].lat, STOPS[index].lon);
      const to = latLonToVector(STOPS[index + 1].lat, STOPS[index + 1].lon);

      ctx.beginPath();
      let drawing = false;

      for (let step = 0; step <= 80; step += 1) {
        const t = step / 80;
        const point = slerpVector(from, to, t);
        const lift = 1 + Math.sin(Math.PI * t) * 0.18;
        const rotated = rotateVectorWorldToView({
          x: point.x * lift,
          y: point.y * lift,
          z: point.z * lift
        });

        if (rotated.z <= 0) {
          drawing = false;
          continue;
        }

        const x = state.centerX + rotated.x * state.radius * state.zoom;
        const y = state.centerY - rotated.y * state.radius * state.zoom;
        if (!drawing) {
          ctx.moveTo(x, y);
          drawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = `${STOPS[index + 1].col}88`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }

  function drawMarkers() {
    state.markerScreenPositions = [];

    STOPS.forEach((stop, index) => {
      const projected = projectPoint(stop.lat, stop.lon, state.zoom * 1.02);
      if (!projected) return;

      const pulse = 1 + 0.2 * Math.sin(state.tick * 2.1 + index);

      ctx.fillStyle = `${stop.col}33`;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 12 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `${stop.col}88`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 8 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = stop.col;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 3.1, 0, Math.PI * 2);
      ctx.fill();

      state.markerScreenPositions.push({
        index,
        x: projected.x,
        y: projected.y
      });
    });
  }

  function drawSphere() {
    renderSphereTexture();
    const size = state.radius * 2 * state.zoom;

    ctx.save();
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, state.radius * state.zoom, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(offscreen, state.centerX - size / 2, state.centerY - size / 2, size, size);
    ctx.restore();

    ctx.strokeStyle = 'rgba(173, 216, 255, 0.26)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, state.radius * state.zoom + 0.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(115, 169, 255, 0.14)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, state.radius * state.zoom + 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawTooltip(event) {
    const tooltip = document.getElementById('globe-tooltip');
    if (!tooltip) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const hit = state.markerScreenPositions.find((marker) => {
      const dx = marker.x - mouseX;
      const dy = marker.y - mouseY;
      return dx * dx + dy * dy < 180;
    });

    if (!hit) {
      tooltip.style.display = 'none';
      if (!state.drag) canvas.style.cursor = 'grab';
      return;
    }

    const stop = STOPS[hit.index];
    tooltip.textContent = stop.city;
    tooltip.style.color = stop.col;
    tooltip.style.display = 'block';
    tooltip.style.left = `${mouseX}px`;
    tooltip.style.top = `${mouseY}px`;
    canvas.style.cursor = 'pointer';
  }

  function flyTo(index) {
    const stop = STOPS[index];
    state.targetY = -stop.lon * DEG + Math.PI / 2;
    state.targetX = clamp(-stop.lat * DEG * 0.8, -1.2, 1.2);
    state.targetZoom = 1.18;
    state.spin = false;
    state.activeIndex = index;
    updateCard(index);
    renderPills(index);
  }

  window.globeFlyTo = flyTo;

  function renderFrame(timestamp) {
    window.requestAnimationFrame(renderFrame);
    if (timestamp - state.lastFrame < 32) return;
    state.lastFrame = timestamp;

    state.tick += 0.016;
    if (state.spin) state.targetY += 0.0022;

    state.rotationY += (state.targetY - state.rotationY) * 0.08;
    state.rotationX += (state.targetX - state.rotationX) * 0.08;
    state.zoom += (state.targetZoom - state.zoom) * 0.1;

    drawStars();
    drawGlow();
    drawSphere();
    drawGrid();
    drawArcs();
    drawMarkers();
  }

  function onPointerDown(x, y) {
    state.drag = true;
    state.moved = false;
    state.pointerX = x;
    state.pointerY = y;
    canvas.style.cursor = 'grabbing';
  }

  function onPointerMove(x, y) {
    if (!state.drag) return;
    const dx = x - state.pointerX;
    const dy = y - state.pointerY;
    if (Math.abs(dx) + Math.abs(dy) > 2) state.moved = true;
    state.targetY += dx * 0.006;
    state.targetX = clamp(state.targetX + dy * 0.006, -1.15, 1.15);
    state.pointerX = x;
    state.pointerY = y;
    state.spin = false;
  }

  function onPointerUp(x, y) {
    if (state.drag && !state.moved) {
      const hit = state.markerScreenPositions.find((marker) => {
        const dx = marker.x - x;
        const dy = marker.y - y;
        return dx * dx + dy * dy < 200;
      });
      if (hit) flyTo(hit.index);
    }

    state.drag = false;
    canvas.style.cursor = 'grab';
  }

  function bindEvents() {
    canvas.addEventListener('mousedown', (event) => onPointerDown(event.clientX, event.clientY));
    window.addEventListener('mousemove', (event) => onPointerMove(event.clientX, event.clientY));
    window.addEventListener('mouseup', (event) => onPointerUp(event.clientX, event.clientY));

    canvas.addEventListener('mousemove', drawTooltip);
    canvas.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('globe-tooltip');
      if (tooltip) tooltip.style.display = 'none';
      if (!state.drag) canvas.style.cursor = 'grab';
    });

    canvas.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        state.targetZoom = clamp(state.targetZoom - event.deltaY * 0.0008, 0.82, 1.85);
        state.spin = false;
      },
      { passive: false }
    );

    canvas.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length === 1) {
          onPointerDown(event.touches[0].clientX, event.touches[0].clientY);
        }
        if (event.touches.length === 2) {
          const a = event.touches[0];
          const b = event.touches[1];
          state.touchDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        }
      },
      { passive: true }
    );

    canvas.addEventListener(
      'touchmove',
      (event) => {
        event.preventDefault();
        if (event.touches.length === 1) {
          onPointerMove(event.touches[0].clientX, event.touches[0].clientY);
        }
        if (event.touches.length === 2) {
          const a = event.touches[0];
          const b = event.touches[1];
          const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          state.targetZoom = clamp(state.targetZoom + (distance - state.touchDistance) * 0.0035, 0.82, 1.85);
          state.touchDistance = distance;
          state.spin = false;
        }
      },
      { passive: false }
    );

    canvas.addEventListener('touchend', (event) => {
      if (event.changedTouches.length === 1) {
        onPointerUp(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      }
    });

    const zoomIn = document.getElementById('globe-zoom-in');
    const zoomOut = document.getElementById('globe-zoom-out');
    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        state.targetZoom = clamp(state.targetZoom + 0.18, 0.82, 1.85);
        state.spin = false;
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        state.targetZoom = clamp(state.targetZoom - 0.18, 0.82, 1.85);
        state.spin = false;
      });
    }

    window.addEventListener('resize', resizeCanvas);
  }

  function startAutoTour() {
    let tourIndex = 0;
    window.setInterval(() => {
      if (!state.spin) return;
      tourIndex = (tourIndex + 1) % STOPS.length;
      flyTo(tourIndex);
      window.setTimeout(() => {
        state.spin = true;
      }, 4200);
    }, 6500);
  }

  buildTexture();
  resizeCanvas();
  renderPills(0);
  updateCard(0);
  bindEvents();
  setFallback('Canvas globe ready', true);
  window.requestAnimationFrame(renderFrame);
  startAutoTour();
})();
