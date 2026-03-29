/* Journey map for about.html using Google Maps 3D. */
(function () {
  const host = document.getElementById('globe-map-host');
  if (!host) return;

  const fallback = document.getElementById('globe-fallback');
  const resetButton = document.getElementById('journey-reset');
  const tourButton = document.getElementById('journey-tour');

  const STOPS = [
    {
      city: 'Conakry, Guinea',
      lat: 9.641,
      lng: -13.578,
      col: '#f0b429',
      yr: 'Origin',
      role: 'Birthplace · West Africa',
      desc: 'Born and raised in Conakry, Guinea. The starting point of a journey that now stretches across two continents.',
      camera: { range: 2800000, tilt: 46, heading: 18, altitude: 120 }
    },
    {
      city: 'Boston / Quincy, MA',
      lat: 42.253,
      lng: -71.002,
      col: '#f0b429',
      yr: '2019 –',
      role: 'Home base · United States',
      desc: 'Immigrated to the United States, studied at North Quincy High School, and started early engineering work with the City of Quincy.',
      camera: { range: 1200000, tilt: 58, heading: 34, altitude: 110 }
    },
    {
      city: 'Ithaca, NY',
      lat: 42.453,
      lng: -76.473,
      col: '#60a5fa',
      yr: '2024 –',
      role: 'Cornell University · ECE',
      desc: 'Electrical and Computer Engineering at Cornell, plus scholarships, leadership work, and the start of deeper systems engineering.',
      camera: { range: 850000, tilt: 58, heading: 8, altitude: 90 }
    },
    {
      city: 'Jacksonville, FL',
      lat: 30.332,
      lng: -81.656,
      col: '#4ade80',
      yr: 'Summer 2025',
      role: 'ADAS Safe · Embedded Intern',
      desc: 'Built real-time multi-sensor firmware for safety-critical ADAS validation using synchronized radar, IMU, and LiDAR pipelines.',
      camera: { range: 1150000, tilt: 54, heading: -18, altitude: 120 }
    },
    {
      city: 'San Jose, CA',
      lat: 37.338,
      lng: -121.886,
      col: '#f472b6',
      yr: 'Fall 2025',
      role: 'Beta University · Silicon Valley',
      desc: 'Selected nationally for an 8-week accelerator-style experience centered on hardware-constrained AI and venture-backed product thinking.',
      camera: { range: 980000, tilt: 60, heading: -26, altitude: 100 }
    },
    {
      city: 'New York City, NY',
      lat: 40.713,
      lng: -74.006,
      col: '#4ade80',
      yr: '2026 –',
      role: 'Simulacrum · Embedded Data Intern',
      desc: 'Working on low-latency embedded data infrastructure in New York, connecting sensor systems, streaming pipelines, and observability.',
      camera: { range: 780000, tilt: 64, heading: -34, altitude: 90 }
    }
  ];

  const WORLD_VIEW = {
    center: { lat: 27, lng: -38, altitude: 0 },
    range: 17000000,
    tilt: 16,
    heading: 0
  };

  const state = {
    activeIndex: 0,
    map: null,
    maps3d: null,
    PinElement: null,
    markers: [],
    touring: false,
    tourTimers: [],
    loaderPromise: null
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
    if (tourButton) tourButton.textContent = 'Play Route';
    if (state.map && typeof state.map.stopCameraAnimation === 'function') {
      state.map.stopCameraAnimation();
    }
  }

  function getSelectedPin(stop, index) {
    return new state.PinElement({
      background: stop.col,
      borderColor: '#ffffff',
      glyphColor: '#07101c',
      glyphText: String(index + 1),
      scale: 1.22
    });
  }

  function getDefaultPin(stop, index) {
    return new state.PinElement({
      background: stop.col,
      borderColor: '#ffffff',
      glyphColor: '#07101c',
      glyphText: String(index + 1),
      scale: 0.95
    });
  }

  function refreshMarkers() {
    if (!state.PinElement) return;

    state.markers.forEach((entry, index) => {
      entry.marker.replaceChildren(index === state.activeIndex ? getSelectedPin(entry.stop, index) : getDefaultPin(entry.stop, index));
      entry.marker.zIndex = index === state.activeIndex ? 12 : 4;
    });
  }

  function getCameraForStop(stop) {
    return {
      center: {
        lat: stop.lat,
        lng: stop.lng,
        altitude: stop.camera.altitude
      },
      range: stop.camera.range,
      tilt: stop.camera.tilt,
      heading: stop.camera.heading
    };
  }

  function flyToCamera(camera, duration) {
    if (!state.map) return;

    if (typeof state.map.flyCameraTo === 'function') {
      state.map.flyCameraTo({
        endCamera: camera,
        durationMillis: duration
      });
      return;
    }

    state.map.center = camera.center;
    state.map.range = camera.range;
    state.map.tilt = camera.tilt;
    state.map.heading = camera.heading;
  }

  function focusStop(index, options) {
    const settings = options || {};
    state.activeIndex = index;
    updateCard(index);
    renderPills(index);
    refreshMarkers();

    if (!settings.keepTour) stopTour();
    if (!state.map) return;

    flyToCamera(getCameraForStop(STOPS[index]), settings.durationMillis || 2200);
  }

  function flyToWorldView(duration) {
    stopTour();
    flyToCamera(WORLD_VIEW, duration || 2000);
  }

  function playTour() {
    if (!state.map) return;

    if (state.touring) {
      stopTour();
      return;
    }

    stopTour();
    state.touring = true;
    if (tourButton) tourButton.textContent = 'Stop Route';

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

  function getConfig() {
    const config = window.PORTFOLIO_SITE_CONFIG || {};
    return {
      apiKey: typeof config.googleMapsApiKey === 'string' ? config.googleMapsApiKey.trim() : '',
      mapId: typeof config.googleMapsMapId === 'string' ? config.googleMapsMapId.trim() : ''
    };
  }

  function loadGoogleMapsApi(apiKey) {
    if (window.google && window.google.maps && typeof window.google.maps.importLibrary === 'function') {
      return Promise.resolve();
    }

    if (state.loaderPromise) return state.loaderPromise;

    state.loaderPromise = new Promise((resolve, reject) => {
      const callbackName = '__portfolioGoogleMaps3DReady';
      const script = document.createElement('script');

      window[callbackName] = function () {
        delete window[callbackName];
        if (window.google && window.google.maps && typeof window.google.maps.importLibrary === 'function') {
          resolve();
          return;
        }
        reject(new Error('Google Maps loaded without importLibrary support.'));
      };

      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=beta&loading=async&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMapsJourney = 'true';
      script.onerror = function () {
        delete window[callbackName];
        reject(new Error('Google Maps JavaScript API failed to load.'));
      };

      document.head.appendChild(script);
    });

    return state.loaderPromise;
  }

  async function initMap() {
    const { Map3DElement, MapMode, AltitudeMode, GestureHandling, Marker3DInteractiveElement, Polyline3DElement } = await window.google.maps.importLibrary('maps3d');
    const { PinElement } = await window.google.maps.importLibrary('marker');
    const config = getConfig();

    state.maps3d = {
      Map3DElement,
      MapMode,
      AltitudeMode,
      GestureHandling,
      Marker3DInteractiveElement,
      Polyline3DElement
    };
    state.PinElement = PinElement;

    host.innerHTML = '';

    const mapOptions = {
      ...WORLD_VIEW,
      mode: MapMode.HYBRID,
      gestureHandling: GestureHandling.COOPERATIVE,
      defaultUIHidden: true,
      defaultUIDisabled: true,
      description: "Boubakar Diallo's journey across Guinea and the United States."
    };

    if (config.mapId) mapOptions.mapId = config.mapId;

    const map = new Map3DElement(mapOptions);
    host.append(map);
    state.map = map;

    STOPS.slice(0, -1).forEach((stop, index) => {
      const next = STOPS[index + 1];
      const route = new Polyline3DElement({
        coordinates: [
          { lat: stop.lat, lng: stop.lng, altitude: 120 },
          { lat: next.lat, lng: next.lng, altitude: 120 }
        ],
        strokeColor: next.col,
        outerColor: '#ffffff',
        strokeWidth: 6,
        outerWidth: 0.28,
        altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
        geodesic: true,
        extruded: false,
        drawsOccludedSegments: true,
        zIndex: 2
      });
      map.append(route);
    });

    state.markers = STOPS.map((stop, index) => {
      const marker = new Marker3DInteractiveElement({
        position: { lat: stop.lat, lng: stop.lng, altitude: 140 },
        altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
        extruded: true,
        drawsWhenOccluded: true,
        label: stop.city,
        title: `${stop.city} — ${stop.role}`,
        sizePreserved: true,
        zIndex: index === state.activeIndex ? 12 : 4
      });

      marker.append(index === state.activeIndex ? getSelectedPin(stop, index) : getDefaultPin(stop, index));
      marker.addEventListener('gmp-click', () => {
        focusStop(index);
      });
      map.append(marker);

      return { marker, stop };
    });

    setFallback('Google Maps 3D ready', true);
    setButtonsEnabled(true);
  }

  async function bootJourneyMap() {
    const config = getConfig();

    renderPills(state.activeIndex);
    updateCard(state.activeIndex);
    setButtonsEnabled(false);

    if (!config.apiKey) {
      setFallback('Add your Google Maps API key in assets/js/portfolio-config.js to enable the live 3D journey map.', false);
      return;
    }

    setFallback('Loading Google Maps 3D...', false);

    try {
      await loadGoogleMapsApi(config.apiKey);
      await initMap();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start Google Maps 3D.';
      setFallback(`Google Maps 3D could not start here. ${message}`, false);
      setButtonsEnabled(false);
    }
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      flyToWorldView(2000);
    });
  }

  if (tourButton) {
    tourButton.addEventListener('click', () => {
      playTour();
    });
  }

  bootJourneyMap();
})();
