/* Journey globe for about.html */
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

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

  const fallback = document.getElementById('globe-fallback');

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
      pill.addEventListener('click', () => {
        if (typeof window.globeFlyTo === 'function') {
          window.globeFlyTo(index);
        } else {
          updateCard(index);
        }
      });
      pills.appendChild(pill);
    });
  }

  renderPills(0);
  updateCard(0);
  setFallback('Loading 3D globe...', false);

  function initGlobe() {
    if (!window.THREE) return;

    const wrap = canvas.parentElement;
    if (!wrap) return;

    const width = () => wrap.clientWidth;
    const height = 500;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    } catch (error) {
      setFallback('Could not initialize the 3D globe on this device. The journey list is still available on the right.', false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width(), height);
    renderer.setClearColor(0x04080f, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width() / height, 0.01, 1000);
    camera.position.z = 3.1;

    const starsBuffer = new Float32Array(4500);
    for (let index = 0; index < 1500; index += 1) {
      const vector = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 8);
      starsBuffer[index * 3] = vector.x;
      starsBuffer[index * 3 + 1] = vector.y;
      starsBuffer[index * 3 + 2] = vector.z;
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsBuffer, 3));
    scene.add(
      new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.02,
          transparent: true,
          opacity: 0.55
        })
      )
    );

    const radius = 1;
    const globe = new THREE.Group();
    scene.add(globe);

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const ctx = textureCanvas.getContext('2d');
    if (!ctx) {
      setFallback('Could not draw the globe texture. The journey list is still available on the right.', false);
      return;
    }

    const oceanGradient = ctx.createLinearGradient(0, 0, 0, textureCanvas.height);
    oceanGradient.addColorStop(0, '#071828');
    oceanGradient.addColorStop(0.5, '#0e3060');
    oceanGradient.addColorStop(1, '#071828');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    for (let y = 0; y < textureCanvas.height; y += 1) {
      const lat = 90 - (y / textureCanvas.height) * 180;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, 0.035 * Math.cos((lat * Math.PI) / 180))})`;
      ctx.fillRect(0, y, textureCanvas.width, 1);
    }

    ctx.fillStyle = '#1e4020';

    function llToTexture(lat, lon) {
      return [((lon + 180) / 360) * textureCanvas.width, ((90 - lat) / 180) * textureCanvas.height];
    }

    function drawPolygon(points) {
      ctx.beginPath();
      points.forEach(([lat, lon], index) => {
        const [x, y] = llToTexture(lat, lon);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();
    }

    drawPolygon([[72, -168], [72, -140], [65, -168], [55, -130], [49, -124], [32, -117], [22, -110], [15, -92], [10, -84], [15, -83], [25, -80], [33, -78], [35, -75], [45, -66], [48, -70], [55, -60], [65, -64], [72, -78], [75, -110], [75, -140], [72, -168]]);
    drawPolygon([[84, -42], [76, -18], [62, -18], [60, -44], [65, -55], [77, -72], [84, -42]]);
    drawPolygon([[12, -72], [10, -62], [8, -60], [4, -51], [0, -50], [-5, -35], [-15, -39], [-23, -43], [-34, -53], [-42, -65], [-55, -67], [-55, -64], [-38, -57], [-22, -41], [-5, -35], [5, -77], [10, -75], [12, -72]]);
    drawPolygon([[71, 30], [65, 14], [58, 5], [44, 0], [36, 5], [36, 14], [38, 26], [42, 28], [42, 35], [48, 40], [55, 38], [60, 30], [65, 24], [71, 30]]);
    drawPolygon([[51, -11], [59, -4], [58, 0], [51, 0], [50, -4], [51, -11]]);
    drawPolygon([[61, -24], [64, -14], [66, -13], [65, -22], [61, -24]]);
    drawPolygon([[37, 10], [37, 34], [22, 38], [12, 44], [11, 51], [0, 42], [-12, 40], [-35, 27], [-35, 18], [-17, 12], [0, 10], [5, -8], [15, -17], [22, -17], [37, 10]]);
    drawPolygon([[-12, 49], [-25, 47], [-26, 44], [-13, 44], [-12, 49]]);
    drawPolygon([[72, 50], [65, 55], [38, 27], [22, 40], [10, 45], [1, 104], [10, 120], [22, 121], [35, 120], [40, 130], [53, 142], [72, 140], [72, 50]]);
    drawPolygon([[45, 141], [40, 141], [34, 131], [34, 130], [40, 128], [45, 141]]);
    drawPolygon([[22, 68], [8, 76], [8, 80], [10, 79], [22, 88], [28, 97], [25, 68], [22, 68]]);
    drawPolygon([[22, 100], [10, 100], [2, 104], [1, 104], [10, 120], [22, 100]]);
    drawPolygon([[-16, 130], [-20, 150], [-28, 154], [-38, 148], [-39, 144], [-35, 117], [-22, 114], [-16, 130]]);
    drawPolygon([[-68, 0], [-68, 180], [-68, -180], [-68, 0]]);

    const earthTexture = new THREE.CanvasTexture(textureCanvas);

    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(radius, 72, 72),
        new THREE.MeshPhongMaterial({
          color: 0x071828,
          shininess: 50,
          specular: new THREE.Color(0x1a5a9a)
        })
      )
    );

    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(radius + 0.001, 72, 72),
        new THREE.MeshPhongMaterial({
          map: earthTexture,
          transparent: true,
          opacity: 0.9,
          shininess: 8
        })
      )
    );

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x1a3a7a,
      transparent: true,
      opacity: 0.15
    });

    for (let lat = -80; lat <= 80; lat += 20) {
      const points = [];
      for (let lon = 0; lon <= 360; lon += 3) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = (lon * Math.PI) / 180;
        points.push(
          new THREE.Vector3(
            (radius + 0.003) * Math.sin(phi) * Math.cos(theta),
            (radius + 0.003) * Math.cos(phi),
            (radius + 0.003) * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMaterial));
    }

    for (let lon = 0; lon < 360; lon += 20) {
      const points = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = (lon * Math.PI) / 180;
        points.push(
          new THREE.Vector3(
            (radius + 0.003) * Math.sin(phi) * Math.cos(theta),
            (radius + 0.003) * Math.cos(phi),
            (radius + 0.003) * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMaterial));
    }

    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.09, 32, 32),
        new THREE.MeshPhongMaterial({
          color: 0x2255bb,
          transparent: true,
          opacity: 0.13,
          side: THREE.BackSide
        })
      )
    );

    scene.add(new THREE.AmbientLight(0x223366, 0.85));
    const sun = new THREE.DirectionalLight(0xaabbdd, 1.5);
    sun.position.set(5, 3, 4);
    scene.add(sun);
    const backLight = new THREE.DirectionalLight(0x112244, 0.4);
    backLight.position.set(-3, -2, -3);
    scene.add(backLight);

    function llTo3D(lat, lon, sphereRadius = radius * 1.018) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;
      return new THREE.Vector3(
        sphereRadius * Math.sin(phi) * Math.cos(theta),
        sphereRadius * Math.cos(phi),
        sphereRadius * Math.sin(phi) * Math.sin(theta)
      );
    }

    const dots = [];
    const rings = [];

    STOPS.forEach((stop, index) => {
      const position = llTo3D(stop.lat, stop.lon);
      const color = new THREE.Color(stop.col);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 })
      );
      glow.position.copy(position);
      globe.add(glow);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.019, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      dot.position.copy(position);
      dot.userData = { stop, index };
      globe.add(dot);
      dots.push(dot);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.024, 0.036, 28),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide
        })
      );
      ring.position.copy(position);
      ring.lookAt(0, 0, 0);
      globe.add(ring);
      rings.push(ring);

      const surfaceDirection = position.clone().normalize();
      globe.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            position.clone().multiplyScalar(0.985),
            position.clone().addScaledVector(surfaceDirection, 0.085)
          ]),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
        )
      );
    });

    for (let index = 0; index < STOPS.length - 1; index += 1) {
      const p1 = llTo3D(STOPS[index].lat, STOPS[index].lon);
      const p2 = llTo3D(STOPS[index + 1].lat, STOPS[index + 1].lon);
      const midpoint = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.5);
      const points = new THREE.QuadraticBezierCurve3(p1, midpoint, p2).getPoints(90);
      globe.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: new THREE.Color(STOPS[index + 1].col),
            transparent: true,
            opacity: 0.38
          })
        )
      );
    }

    function showCard(index) {
      updateCard(index);
      renderPills(index);
    }

    let targetY = -0.5;
    let targetX = 0.12;
    let targetZoom = 3.1;
    let spinning = true;

    function flyTo(index) {
      const stop = STOPS[index];
      const phi = ((90 - stop.lat) * Math.PI) / 180;
      const theta = ((stop.lon + 180) * Math.PI) / 180;
      targetY = -theta + Math.PI;
      targetX = Math.max(-1.35, Math.min(1.35, phi - Math.PI / 2));
      targetZoom = 2.05;
      spinning = false;
      showCard(index);
    }

    window.globeFlyTo = flyTo;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let moved = false;
    let previousX = 0;
    let previousY = 0;

    canvas.addEventListener('mousedown', (event) => {
      dragging = true;
      moved = false;
      previousX = event.clientX;
      previousY = event.clientY;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', (event) => {
      if (dragging && !moved) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(dots);
        if (hit.length) flyTo(hit[0].object.userData.index);
      }
      dragging = false;
      canvas.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (event) => {
      if (!dragging) return;
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      targetY += dx * 0.005;
      targetX += dy * 0.005;
      targetX = Math.max(-1.35, Math.min(1.35, targetX));
      previousX = event.clientX;
      previousY = event.clientY;
      spinning = false;
    });

    canvas.addEventListener('mousemove', (event) => {
      if (dragging) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(dots);
      const tooltip = document.getElementById('globe-tooltip');

      if (hit.length) {
        if (tooltip) {
          tooltip.textContent = hit[0].object.userData.stop.city;
          tooltip.style.color = hit[0].object.userData.stop.col;
          tooltip.style.display = 'block';
          tooltip.style.left = `${event.clientX - rect.left}px`;
          tooltip.style.top = `${event.clientY - rect.top}px`;
        }
        canvas.style.cursor = 'pointer';
      } else {
        if (tooltip) tooltip.style.display = 'none';
        if (!dragging) canvas.style.cursor = 'grab';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('globe-tooltip');
      if (tooltip) tooltip.style.display = 'none';
    });

    canvas.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        targetZoom = Math.max(1.4, Math.min(5.5, targetZoom + event.deltaY * 0.003));
        spinning = false;
      },
      { passive: false }
    );

    let touchDistance = 0;
    canvas.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length === 1) {
          previousX = event.touches[0].clientX;
          previousY = event.touches[0].clientY;
          moved = false;
        }
        if (event.touches.length === 2) {
          const a = event.touches[0];
          const b = event.touches[1];
          touchDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        }
      },
      { passive: true }
    );

    canvas.addEventListener(
      'touchmove',
      (event) => {
        event.preventDefault();
        if (event.touches.length === 1) {
          const dx = event.touches[0].clientX - previousX;
          const dy = event.touches[0].clientY - previousY;
          if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
          targetY += dx * 0.006;
          targetX += dy * 0.006;
          targetX = Math.max(-1.35, Math.min(1.35, targetX));
          previousX = event.touches[0].clientX;
          previousY = event.touches[0].clientY;
          spinning = false;
        }
        if (event.touches.length === 2) {
          const a = event.touches[0];
          const b = event.touches[1];
          const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          targetZoom = Math.max(1.4, Math.min(5.5, targetZoom - (distance - touchDistance) * 0.006));
          touchDistance = distance;
        }
      },
      { passive: false }
    );

    canvas.addEventListener('touchend', (event) => {
      if (event.changedTouches.length === 1 && !moved) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.changedTouches[0].clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.changedTouches[0].clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(dots);
        if (hit.length) flyTo(hit[0].object.userData.index);
      }
    });

    const zoomIn = document.getElementById('globe-zoom-in');
    const zoomOut = document.getElementById('globe-zoom-out');
    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        targetZoom = Math.max(1.4, targetZoom - 0.35);
        spinning = false;
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        targetZoom = Math.min(5.5, targetZoom + 0.35);
        spinning = false;
      });
    }

    globe.rotation.y = targetY;
    globe.rotation.x = targetX;
    let tick = 0;

    function animate() {
      window.requestAnimationFrame(animate);
      tick += 0.016;

      if (spinning) targetY += 0.0016;

      globe.rotation.y += (targetY - globe.rotation.y) * 0.075;
      globe.rotation.x += (targetX - globe.rotation.x) * 0.075;
      camera.position.z += (targetZoom - camera.position.z) * 0.08;

      rings.forEach((ring, index) => {
        const scale = 1 + 0.45 * Math.sin(tick * 1.7 + index * 1.3);
        ring.scale.set(scale, scale, scale);
        ring.material.opacity = 0.15 + 0.42 * (Math.sin(tick * 1.7 + index * 1.3) * 0.5 + 0.5);
      });

      sun.position.x = 5 * Math.cos(tick * 0.03);
      sun.position.z = 4 * Math.sin(tick * 0.03);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      renderer.setSize(width(), height);
      camera.aspect = width() / height;
      camera.updateProjectionMatrix();
    });

    setFallback('3D globe loaded', true);
    window.setTimeout(() => showCard(0), 350);
    animate();

    let tourIndex = 0;
    window.setInterval(() => {
      if (!spinning) return;
      tourIndex = (tourIndex + 1) % STOPS.length;
      const stop = STOPS[tourIndex];
      const phi = ((90 - stop.lat) * Math.PI) / 180;
      const theta = ((stop.lon + 180) * Math.PI) / 180;
      targetY = -theta + Math.PI;
      targetX = Math.max(-1.35, Math.min(1.35, phi - Math.PI / 2));
      targetZoom = 2.3;
      showCard(tourIndex);
      window.setTimeout(() => {
        spinning = true;
      }, 4500);
    }, 6000);
  }

  if (window.THREE) {
    initGlobe();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initGlobe;
  script.onerror = () => {
    setFallback('Could not load the 3D globe right now. The journey stops and story card still work.', false);
  };
  document.head.appendChild(script);
})();
