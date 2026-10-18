/* Self-hosted Globe.gl journey, with a local SVG map for devices without WebGL. */
(function () {
  const host = document.getElementById('globe-map-host');
  if (!host) return;

  const fallback = document.getElementById('globe-fallback');
  const resetButton = document.getElementById('journey-reset');
  const tourButton = document.getElementById('journey-tour');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const STOPS = [
    {
      city: 'Conakry, Guinea',
      lat: 9.641,
      lng: -13.578,
      col: '#f0b429',
      yr: 'Origin',
      role: 'Birthplace · West Africa',
      desc: 'Born and raised in Conakry, Guinea. The starting point of a journey that now stretches across two continents.'
    },
    {
      city: 'Boston / Quincy, MA',
      lat: 42.253,
      lng: -71.002,
      col: '#f0b429',
      yr: '2019 –',
      role: 'Home base · United States',
      desc: 'Immigrated to the United States, studied at North Quincy High School, and started early engineering work with the City of Quincy.'
    },
    {
      city: 'Ithaca, NY',
      lat: 42.453,
      lng: -76.473,
      col: '#60a5fa',
      yr: '2024 –',
      role: 'Cornell University · ECE',
      desc: 'Electrical and Computer Engineering at Cornell, plus scholarships, leadership work, and the start of deeper systems engineering.'
    },
    {
      city: 'Jacksonville, FL',
      lat: 30.332,
      lng: -81.656,
      col: '#4ade80',
      yr: 'Summer 2025',
      role: 'ADAS Safe · Embedded Intern',
      desc: 'Built real-time multi-sensor firmware for safety-critical ADAS validation using synchronized radar, IMU, and LiDAR pipelines.'
    },
    {
      city: 'San Jose, CA',
      lat: 37.338,
      lng: -121.886,
      col: '#f472b6',
      yr: 'Fall 2025',
      role: 'Beta University · Silicon Valley',
      desc: 'Selected nationally for an 8-week accelerator-style experience centered on hardware-constrained AI and venture-backed product thinking.'
    },
    {
      city: 'New York City, NY',
      lat: 40.713,
      lng: -74.006,
      col: '#4ade80',
      yr: '2026 –',
      role: 'Simulacrum · Embedded Data Intern',
      desc: 'Working on low-latency embedded data infrastructure in New York, connecting sensor systems, streaming pipelines, and observability.'
    }
  ];

  const WORLD_VIEW = { lat: 24, lng: -62, altitude: 2.2 };
  const ROUTES = STOPS.slice(1).map((stop, index) => ({
    startLat: STOPS[index].lat,
    startLng: STOPS[index].lng,
    endLat: stop.lat,
    endLng: stop.lng,
    colors: [STOPS[index].col, stop.col],
    endIndex: index + 1
  }));

  const state = {
    activeIndex: 0,
    view: WORLD_VIEW,
    globe: null,
    globeLayer: null,
    routeMap: null,
    markers: [],
    touring: false,
    tourTimers: [],
    inView: false
  };

  function setFallback(message, hidden) {
    if (!fallback) return;
    fallback.textContent = message;
    fallback.classList.toggle('is-hidden', hidden);
  }

  function setButtonsEnabled(enabled) {
    if (resetButton) resetButton.disabled = !enabled;
    if (tourButton) tourButton.disabled = !enabled;
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
      pill.setAttribute('aria-pressed', String(pillIndex === index));
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
      pill.setAttribute('aria-pressed', String(index === activeIndex));
      pill.innerHTML = `
        <span class="g-pill-dot" style="background:${stop.col}"></span>
        <span class="g-pill-text">
          <span class="g-pill-city">${stop.city}</span>
          <span class="g-pill-role">${stop.yr} · ${stop.role}</span>
        </span>
      `;
      pill.addEventListener('click', () => focusStop(index));
      pills.appendChild(pill);
    });
  }

  function clearTourTimers() {
    state.tourTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    state.tourTimers = [];
  }

  function queueTourStep(callback, delay) {
    const timerId = window.setTimeout(() => {
      state.tourTimers = state.tourTimers.filter((value) => value !== timerId);
      callback();
    }, delay);
    state.tourTimers.push(timerId);
  }

  function stopTour() {
    clearTourTimers();
    state.touring = false;
    if (tourButton) {
      tourButton.textContent = 'Play Route';
      tourButton.setAttribute('aria-pressed', 'false');
    }
    if (state.globe) state.globe.pointOfView(state.globe.pointOfView(), 0);
  }

  function refreshMarkers() {
    state.markers.forEach((marker, index) => {
      marker.classList.toggle('is-active', index === state.activeIndex);
      marker.setAttribute('aria-pressed', String(index === state.activeIndex));
    });
    if (!state.globe) return;
    state.globe.arcStroke((route) => route.endIndex === state.activeIndex ? 0.8 : 0.55);
    state.globe.ringsData(reducedMotion.matches ? [] : [STOPS[state.activeIndex]]);
  }

  function getCameraForStop(stop) {
    return { lat: stop.lat, lng: stop.lng, altitude: 0.8 };
  }

  function flyToCamera(camera, duration) {
    state.view = camera;
    if (state.globe) state.globe.pointOfView(camera, reducedMotion.matches ? 0 : duration);
  }

  function zoomGlobe(factor) {
    stopTour();
    const view = state.globe.pointOfView();
    flyToCamera({ ...view, altitude: Math.max(0.4, Math.min(5, view.altitude * factor)) }, 300);
  }

  function focusStop(index, options) {
    const settings = options || {};
    state.activeIndex = index;
    updateCard(index);
    refreshMarkers();
    if (state.routeMap) state.routeMap.focus(index);

    if (!settings.keepTour) stopTour();
    flyToCamera(getCameraForStop(STOPS[index]), settings.durationMillis ?? 1800);
  }

  function flyToWorldView(duration) {
    stopTour();
    if (state.routeMap) state.routeMap.reset();
    flyToCamera(WORLD_VIEW, duration ?? 1800);
  }

  function playTour() {
    if (!state.globe && !state.routeMap) return;

    if (state.touring) {
      stopTour();
      return;
    }

    stopTour();
    state.touring = true;
    if (tourButton) {
      tourButton.textContent = 'Stop Route';
      tourButton.setAttribute('aria-pressed', 'true');
    }

    const dwell = 3400;
    STOPS.forEach((stop, index) => {
      queueTourStep(() => {
        focusStop(index, { durationMillis: 2200, keepTour: true });
      }, index * dwell);
    });

    queueTourStep(() => {
      state.touring = false;
      if (tourButton) tourButton.textContent = 'Play Route';
      flyToWorldView(2400);
    }, STOPS.length * dwell);
  }

  function initRouteMap() {
    const namespace = 'http://www.w3.org/2000/svg';
    function element(tag, attributes, parent) {
      const node = document.createElementNS(namespace, tag);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      if (parent) parent.appendChild(node);
      return node;
    }
    function project(stop) {
      return [stop.lng, -Math.log(Math.tan(Math.PI / 4 + stop.lat * Math.PI / 360)) * 180 / Math.PI];
    }

    const svg = element('svg', {
      class: 'journey-route-map',
      role: 'group',
      'aria-label': 'Journey route map. Use arrow keys to pan, plus or minus to zoom, and Home for the world view.',
      tabindex: '0'
    }, host);
    const grid = element('g', { class: 'journey-grid', 'aria-hidden': 'true' }, svg);
    for (let longitude = -180; longitude <= 180; longitude += 20) {
      element('path', { d: `M${longitude},-180V180` }, grid);
    }
    for (let latitude = -80; latitude <= 80; latitude += 20) {
      const y = project({ lat: latitude, lng: 0 })[1];
      element('path', { d: `M-180,${y}H180` }, grid);
    }
    element('image', {
      href: 'assets/img/journey-land.svg', x: '-180', y: '-180', width: '360', height: '360',
      'aria-hidden': 'true'
    }, svg);

    const points = STOPS.map(project);
    const routes = points.slice(1).map((end, index) => {
      const start = points[index];
      const bend = Math.min(16, Math.hypot(end[0] - start[0], end[1] - start[1]) * 0.28);
      return element('path', {
        d: `M${start}Q${(start[0] + end[0]) / 2},${(start[1] + end[1]) / 2 - bend} ${end}`,
        class: 'journey-route', stroke: STOPS[index + 1].col, 'aria-hidden': 'true'
      }, svg);
    });
    const pins = STOPS.map((stop, index) => {
      const pin = element('g', {
        class: 'journey-pin', role: 'button', tabindex: '0',
        'aria-label': `${index + 1}. ${stop.city}: ${stop.role}`, 'aria-pressed': 'false'
      }, svg);
      const leader = element('path', { class: 'journey-pin-leader', stroke: stop.col }, pin);
      const dot = element('circle', { class: 'journey-pin-dot', fill: stop.col }, pin);
      const number = element('text', { class: 'journey-pin-number', 'aria-hidden': 'true' }, pin);
      number.textContent = String(index + 1);
      const label = element('text', { class: 'journey-pin-label', 'aria-hidden': 'true' }, pin);
      label.textContent = stop.city;
      element('circle', { class: 'journey-pin-hit', r: '22' }, pin);
      pin.addEventListener('click', () => focusStop(index));
      pin.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        focusStop(index);
      });
      return { pin, leader, dot, number, label };
    });

    const zoomControls = document.createElement('div');
    zoomControls.className = 'journey-zoom';
    zoomControls.setAttribute('aria-label', 'Map zoom controls');
    host.appendChild(zoomControls);
    const view = { x: -65, y: -30, width: 158 };
    function draw() {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const units = view.width / width;
      const viewHeight = height * units;
      view.x = Math.max(-180 + view.width / 2, Math.min(180 - view.width / 2, view.x));
      view.y = Math.max(-155, Math.min(155, view.y));
      svg.setAttribute('viewBox', `${view.x - view.width / 2} ${view.y - viewHeight / 2} ${view.width} ${viewHeight}`);
      pins.forEach(({ pin, leader, dot, number, label }, index) => {
        const [x, y] = points[index];
        // Fan out nearby Northeast stops in the overview while keeping their geographic anchors.
        const offsets = view.width > 70 ? { 1: [18, -20], 2: [-18, -8], 5: [12, 20] } : {};
        const [dx, dy] = offsets[index] || [0, 0];
        pin.setAttribute('transform', `translate(${x} ${y}) scale(${units})`);
        leader.setAttribute('d', `M0,0L${dx},${dy}`);
        dot.setAttribute('cx', dx);
        dot.setAttribute('cy', dy);
        dot.setAttribute('r', index === state.activeIndex ? 13 : 10);
        number.setAttribute('x', dx);
        number.setAttribute('y', dy);
        const labelOnLeft = index === 0 || index === 2;
        label.setAttribute('x', dx + (labelOnLeft ? -20 : 20));
        label.setAttribute('y', dy + 4);
        label.setAttribute('text-anchor', labelOnLeft ? 'end' : 'start');
        label.style.display = index === state.activeIndex ? '' : 'none';
        pin.classList.toggle('is-active', index === state.activeIndex);
        pin.setAttribute('aria-pressed', String(index === state.activeIndex));
        pin.lastElementChild.setAttribute('cx', dx);
        pin.lastElementChild.setAttribute('cy', dy);
      });
      routes.forEach((route, index) => route.classList.toggle('is-active', index + 1 === state.activeIndex));
    }
    function zoom(factor) {
      stopTour();
      if (state.globe) {
        zoomGlobe(factor);
        return;
      }
      view.width = Math.max(12, Math.min(360, view.width * factor));
      draw();
    }
    [['Zoom in', '+', 0.7], ['Zoom out', '−', 1 / 0.7]].forEach(([label, text, factor]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', label);
      button.textContent = text;
      button.addEventListener('click', () => zoom(factor));
      zoomControls.appendChild(button);
    });
    svg.addEventListener('keydown', (event) => {
      if (event.target !== svg) return;
      const pan = view.width * 0.08;
      if (event.key === '+' || event.key === '=') zoom(0.7);
      else if (event.key === '-') zoom(1 / 0.7);
      else if (event.key === 'Home') flyToWorldView();
      else if (event.key === 'ArrowLeft') view.x -= pan;
      else if (event.key === 'ArrowRight') view.x += pan;
      else if (event.key === 'ArrowUp') view.y -= pan;
      else if (event.key === 'ArrowDown') view.y += pan;
      else return;
      event.preventDefault();
      stopTour();
      draw();
    });
    let drag = null;
    svg.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.closest('.journey-pin')) return;
      stopTour();
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      svg.setPointerCapture(event.pointerId);
      svg.classList.add('is-dragging');
    });
    svg.addEventListener('pointermove', (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const scale = view.width / host.clientWidth;
      view.x -= (event.clientX - drag.x) * scale;
      view.y -= (event.clientY - drag.y) * scale;
      drag.x = event.clientX;
      drag.y = event.clientY;
      draw();
    });
    function endDrag() {
      drag = null;
      svg.classList.remove('is-dragging');
    }
    svg.addEventListener('lostpointercapture', endDrag);
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);
    svg.addEventListener('wheel', (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoom(event.deltaY > 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });
    new ResizeObserver(draw).observe(host);
    state.routeMap = {
      focus(index) {
        [view.x, view.y] = points[index];
        view.width = 28;
        draw();
      },
      reset() {
        Object.assign(view, { x: -65, y: -30, width: 158 });
        draw();
      }
    };
    draw();
    setFallback('', true);
    setButtonsEnabled(true);
  }

  function loadGlobeLibrary() {
    if (typeof window.Globe === 'function') return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = window.setTimeout(() => reject(new Error('Globe library loading timed out.')), 15000);
      script.src = 'assets/vendor/globe-gl/globe.gl.min.js?v=2.46.2';
      script.async = true;
      script.onload = () => {
        window.clearTimeout(timeout);
        if (typeof window.Globe === 'function') resolve();
        else reject(new Error('Globe library unavailable.'));
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('Globe library could not load.'));
      };
      document.head.appendChild(script);
    });
  }

  function loadEarthTexture() {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timeout = window.setTimeout(() => reject(new Error('Earth texture loading timed out.')), 15000);
      image.onload = () => {
        window.clearTimeout(timeout);
        resolve(image.src);
      };
      image.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('Earth texture unavailable.'));
      };
      image.src = 'assets/img/journey-earth.jpg';
    });
  }

  function createGlobeMarker(stop) {
    const index = STOPS.indexOf(stop);
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = `journey-globe-pin${index === state.activeIndex ? ' is-active' : ''}`;
    marker.style.setProperty('--pin-color', stop.col);
    marker.dataset.stop = String(index);
    marker.setAttribute('aria-label', `${index + 1}. ${stop.city}: ${stop.role}`);
    marker.setAttribute('aria-pressed', String(index === state.activeIndex));
    const number = document.createElement('span');
    number.className = 'journey-globe-number';
    number.textContent = String(index + 1);
    const label = document.createElement('span');
    label.className = 'journey-globe-label';
    label.textContent = stop.city;
    marker.append(number, label);
    marker.addEventListener('pointerdown', (event) => event.stopPropagation());
    marker.addEventListener('click', (event) => {
      event.stopPropagation();
      focusStop(index);
    });
    state.markers[index] = marker;
    return marker;
  }

  function syncRendering() {
    if (!state.globe) return;
    if (document.hidden || !state.inView) state.globe.pauseAnimation();
    else state.globe.resumeAnimation();
  }

  async function initGlobe() {
    const [, texture] = await Promise.all([loadGlobeLibrary(), loadEarthTexture()]);
    const layer = document.createElement('div');
    layer.className = 'journey-globe-layer';
    layer.tabIndex = 0;
    layer.setAttribute('role', 'group');
    layer.setAttribute('aria-label', 'Interactive Earth globe. Drag to rotate, use arrow keys to turn, plus or minus to zoom, and Home for the world view.');
    host.appendChild(layer);
    state.globeLayer = layer;

    let globe;
    let resizeObserver;
    let readyTimeout;
    let rejectReady;
    try {
      globe = new window.Globe(layer, { animateIn: false, rendererConfig: { antialias: true, alpha: true } });
      const ready = new Promise((resolve, reject) => {
        rejectReady = reject;
        readyTimeout = window.setTimeout(() => reject(new Error('Globe initialization timed out.')), 15000);
        globe.onGlobeReady(resolve);
      });
      globe
        .width(host.clientWidth)
        .height(host.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl(texture)
        .showAtmosphere(true)
        .atmosphereColor('#73acd6')
        .atmosphereAltitude(0.12)
        .globeCurvatureResolution(2)
        .arcsData(ROUTES)
        .arcColor('colors')
        .arcStroke((route) => route.endIndex === state.activeIndex ? 0.8 : 0.55)
        .arcAltitudeAutoScale(0.25)
        .arcDashLength(0.65)
        .arcDashGap(0.18)
        .arcDashAnimateTime(reducedMotion.matches ? 0 : 2400)
        .arcsTransitionDuration(0)
        .htmlElementsData(STOPS)
        .htmlAltitude(0.025)
        .htmlElement(createGlobeMarker)
        .htmlElementVisibilityModifier((marker, isVisible) => {
          marker.hidden = !isVisible;
          marker.tabIndex = isVisible ? 0 : -1;
          marker.setAttribute('aria-hidden', String(!isVisible));
        })
        .ringsData(reducedMotion.matches ? [] : [STOPS[state.activeIndex]])
        .ringColor('col')
        .ringAltitude(0.008)
        .ringMaxRadius(2)
        .ringPropagationSpeed(1.2)
        .ringRepeatPeriod(1800)
        .pointOfView(state.view, 0);

      globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      globe.renderer().domElement.setAttribute('aria-hidden', 'true');
      const controls = globe.controls();
      controls.enablePan = false;
      controls.minDistance = globe.getGlobeRadius() * 1.4;
      controls.maxDistance = globe.getGlobeRadius() * 6;
      controls.addEventListener('start', stopTour);

      layer.addEventListener('wheel', (event) => {
        // Preserve page scrolling; touch pinch and the zoom buttons remain available.
        event.stopPropagation();
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();
        if (state.globe) zoomGlobe(event.deltaY > 0 ? 1.12 : 1 / 1.12);
      }, { capture: true, passive: false });
      layer.addEventListener('keydown', (event) => {
        if (event.target.closest('.journey-globe-pin')) return;
        const view = globe.pointOfView();
        if (event.key === '+' || event.key === '=') zoomGlobe(0.7);
        else if (event.key === '-') zoomGlobe(1 / 0.7);
        else if (event.key === 'Home') flyToWorldView();
        else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          stopTour();
          if (event.key === 'ArrowLeft') view.lng -= 10;
          if (event.key === 'ArrowRight') view.lng += 10;
          if (event.key === 'ArrowUp') view.lat = Math.min(80, view.lat + 8);
          if (event.key === 'ArrowDown') view.lat = Math.max(-80, view.lat - 8);
          flyToCamera(view, 300);
        } else return;
        event.preventDefault();
      });
      const cleanup = () => {
        resizeObserver?.disconnect();
        globe.pauseAnimation();
        controls.dispose();
        globe.renderer().dispose();
      };
      globe.renderer().domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        cleanup();
        useRouteMap();
        rejectReady(new Error('WebGL context lost.'));
      }, { once: true });
      await ready;
      state.globe = globe;
      globe.pointOfView(state.view, 0);
      globe.onZoom((view) => {
        state.view = view;
        layer.classList.toggle('is-overview', view.altitude > 1.3);
      });
      layer.classList.toggle('is-overview', state.view.altitude > 1.3);
      host.classList.add('has-3d');
      host.dataset.mapView = 'globe';
      refreshMarkers();
      resizeObserver = new ResizeObserver(() => globe.width(host.clientWidth).height(host.clientHeight));
      resizeObserver.observe(host);
      syncRendering();
    } catch (error) {
      if (globe) {
        globe.pauseAnimation();
        globe.controls().dispose();
        globe.renderer().dispose();
      }
      useRouteMap();
    } finally {
      window.clearTimeout(readyTimeout);
    }
  }

  function useRouteMap() {
    state.globe = null;
    state.markers = [];
    state.globeLayer?.remove();
    state.globeLayer = null;
    host.classList.remove('has-3d');
    host.dataset.mapView = 'map';
    if (state.view.altitude < 1.3) state.routeMap.focus(state.activeIndex);
    setFallback('', true);
    setButtonsEnabled(true);
  }

  function bootJourneyMap() {
    renderPills(state.activeIndex);
    updateCard(state.activeIndex);
    initRouteMap();
    host.dataset.mapView = 'map';
    let started = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        state.inView = entry.isIntersecting;
        if (state.inView && !started) {
          started = true;
          initGlobe().catch(useRouteMap);
        }
        syncRendering();
      }, { rootMargin: '200px' }).observe(host);
    } else {
      state.inView = true;
      initGlobe().catch(useRouteMap);
    }
  }

  resetButton?.addEventListener('click', () => flyToWorldView());
  tourButton?.addEventListener('click', playTour);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTour();
    syncRendering();
  });
  reducedMotion.addEventListener('change', () => {
    refreshMarkers();
    state.globe?.arcDashAnimateTime(reducedMotion.matches ? 0 : 2400);
  });

  bootJourneyMap();
})();
