/* Shared case studies for the Work and Projects pages. */
const PROJECTS = {
  cs4750: {
    title: 'Mobile Robot Kinematics & LiDAR Localization',
    meta: 'Cornell CS 4750 · Team coursework · HW1–HW3',
    intro: 'A mobile-robot coursework sequence connecting ROS integration, differential-drive kinematics, wheel odometry, and LiDAR-based particle-filter localization in a provided map.',
    image: 'assets/img/projects/cs4750-wheel-kinematics.png',
    alt: 'Foxglove plots comparing predicted and measured angular velocities for the robot’s left and right wheels',
    caption: 'HW2 recording: predicted and measured wheel velocities track closely during steady motion, with discrepancies around direction changes. This plot shows one recorded run, not an aggregate error benchmark.',
    pipeline: [
      ['Wheel telemetry', 'Forward kinematics turns wheel velocities into body motion and an odometry prediction.'],
      ['LiDAR + supplied map', 'Scan distances are compared with expected ranges to evaluate particle likelihoods.'],
      ['Robot pose', 'The particle filter combines motion prediction, observation weighting, and resampling to estimate position and heading.']
    ],
    bullets: [
      'HW1 — Connected ROS publishers/subscribers and teleoperation topics, and visualized the robot model and live LiDAR scans in Foxglove.',
      'HW2 — Implemented differential-drive forward and inverse kinematics, converting between wheel angular velocities and body linear/angular motion.',
      'Integrated wheel odometry with midpoint heading updates, quaternion orientation, and odom-to-base_link transforms; examined failure cases when wheels spun without corresponding robot motion.',
      'HW3 — Implemented a LiDAR sensor-likelihood model and low-variance particle resampling within the course-provided localization framework.',
      'Captured gyroscope-tuning plots and documented qualitative comparisons between odometry-only localization, particle filtering, and AMCL.'
    ],
    figures: [
      {
        heading: 'ROS integration & live LiDAR',
        image: 'assets/img/projects/cs4750-lidar.png',
        alt: 'Foxglove 3D view of the mobile robot surrounded by live LiDAR scan points',
        caption: 'HW1 screenshot from the submitted writeup: the robot model and live scan points in Foxglove. This is a sensor visualization.'
      },
      {
        heading: 'Gyroscope calibration',
        image: 'assets/img/projects/cs4750-gyro-tuning.png',
        alt: 'Foxglove IMU plots showing tuned angular-velocity readings near zero and linear-acceleration traces',
        caption: 'HW3 tuned-gyroscope screenshot from the team writeup. These stationary sensor traces document calibration; they do not measure localization accuracy.'
      }
    ],
    evaluation: 'The team writeup describes accumulated odometry drift and qualitatively compares localization behavior with LiDAR corrections and AMCL. This case study covers HW1–HW3 and uses a provided map. No numerical localization-accuracy or recovery-time benchmark is reported.',
    tags: ['Python', 'ROS', 'Kinematics', 'Odometry', 'LiDAR', 'Particle filters', 'Foxglove']
  },
  riscv: {
    title: 'Pipelined RISC-V Processor',
    meta: 'Computer architecture · Team project · Fall 2026 · In progress',
    intro: 'Building a five-stage TinyRV2 processor and exploring the tradeoff between a stalling pipeline and a fully bypassed design.',
    image: 'assets/img/projects/riscv-pipeline.svg',
    alt: 'Conceptual five-stage processor pipeline with forwarding and hazard control',
    caption: 'Architecture overview. The processor and its verification are ongoing coursework.',
    bullets: [
      'Implementing X/M/W forwarding, RAW hazard detection, and stall/squash control across the five pipeline stages.',
      'Designed fixed- and variable-latency iterative multipliers with FSM control and zero-bit skipping.',
      'Integrating the 32-bit multiplier through val/rdy handshakes and coordinated pipeline stalls.',
      'Verifying RTL against Python reference models with directed and randomized pytest regressions, injected memory delays, execution traces, and VCD waveforms.'
    ],
    tags: ['Verilog', 'TinyRV2', 'Microarchitecture', 'pytest', 'VCD']
  },
  accelerator: {
    title: 'RISC-V Processor & Accelerator',
    meta: 'Digital hardware · Cornell ECE · December 2025',
    intro: 'Implemented a single-cycle TinyRV1 processor, then moved a repeated accumulation workload into dedicated hardware.',
    image: 'assets/img/projects/accelerator-cycles.svg',
    alt: 'Cycle-count comparison: TinyRV1 baseline 131 cycles, accumulation accelerator 32 cycles',
    caption: 'Cycle counts for the evaluated 31-element accumulation workload.',
    metrics: [['131 → 32', 'cycles on a 31-element workload'], ['4.09×', 'cycle-count speedup']],
    bullets: [
      'Built the 32-bit datapath, register file, instruction decoder, ALU control, and memory-mapped peripheral interfaces.',
      'Designed a custom 32-bit accumulation accelerator with address and sum datapaths, a 16-bit counter, and FSM control.',
      'Validated the processor through RTL simulation and FPGA hardware I/O testing. The speedup describes this specific workload and cycle-count comparison.'
    ],
    tags: ['Verilog', 'TinyRV1', 'FPGA', 'FSM', 'Datapath design']
  },
  fpga: {
    title: 'FPGA Logic & Timing Optimization',
    meta: 'Digital hardware · Cornell ECE · December 2025',
    intro: 'Compared gate-level and RTL counter implementations, then applied synchronous logic design to a Moore FSM music player.',
    image: 'assets/img/projects/fpga-timing.svg',
    alt: 'Counter timing and utilization results: 24.553 to 7.774 nanoseconds and 1545 to 109 ALUTs',
    caption: 'Comparison of the evaluated 16-bit counter implementations.',
    metrics: [['24.553 → 7.774 ns', 'critical-path delay'], ['1,545 → 109', 'ALUTs for the 16-bit counter']],
    bullets: [
      'Reduced the counter critical path by 68.3% and logic utilization by 92.9% in the evaluated FPGA implementations.',
      'Implemented programmable counters, registers, note-generation logic, and a Moore FSM for the music player.',
      'Used synthesis and timing reports to compare area and performance, and checked output timing with oscilloscope measurements.'
    ],
    tags: ['Verilog', 'Quartus', 'RTL', 'Timing analysis', 'Oscilloscope']
  },
  rtos: {
    title: 'Preemptive RTOS & Scheduler',
    meta: 'Embedded systems · ARM Cortex-M0+ · 2025–2026',
    intro: 'Built a small preemptive kernel around explicit process states, synchronization, and deadline-aware scheduling.',
    image: 'assets/img/projects/rtos-scheduler.svg',
    alt: 'Scheduler overview showing a timer tick, deadline-ordered ready queue, context switch, and running task',
    caption: 'Conceptual kernel flow: timer interrupts drive scheduling and process transitions.',
    bullets: [
      'Implemented context switching, process-state queues, spin locks, and blocking locks in C and ARM assembly.',
      'Used a 1 ms interrupt-driven time base with Earliest Deadline First scheduling, deadline-ordered ready queues, and delayed task activation.',
      'Enabled real-time tasks to preempt non-real-time processes.',
      'Exercised concurrency and synchronization with tests for lock contention, race conditions, and deadlines.'
    ],
    tags: ['C', 'ARM assembly', 'Cortex-M0+', 'EDF', 'Concurrency']
  },
  occupancy: {
    title: 'Bidirectional Occupancy Monitor',
    meta: 'ECE 3140 · Team coursework · Spring 2026 · bd453 & jlp378',
    intro: 'A FRDM-KL46Z occupancy-counter coursework prototype with a button-driven board implementation, a separate dual-beam sensor experiment, and a Python USB-serial logger.',
    image: 'assets/img/projects/occupancy-system.svg',
    alt: 'Manual entry and exit buttons and a separate two-beam light-sensor experiment connect to an ARM occupancy counter and Python serial logger',
    caption: 'Conceptual overview of the distinct firmware and sensor experiment included in the team archive.',
    bullets: [
      'The supplied board main.c implements GPIO button inputs for manual entry/exit counts, capacity-threshold LEDs, and UART event output.',
      'A separate laser.c experiment polls two light-dependent sensors every 10 ms and infers direction from beam-break order; it references LCD support files that are not included in the archive.',
      'The Python USB-serial bridge reconnects to the board and appends timestamped colon-delimited messages to CSV. The current parser also accepts debug messages, not only entry/exit events.',
      'VL53L0X initialization in main.c is commented out, so the archive does not establish a working ToF sensor path or a fully integrated dual-beam build.'
    ],
    evaluation: 'The archive contains separate manual-counter and light-sensor code paths. The LCD implementation is missing, the ToF path is commented out, and hardware execution was not independently verified.',
    tags: ['C', 'ARM Cortex-M0+', 'GPIO', 'LDR sensors', 'UART', 'Python'],
    links: [['GitHub source', 'https://github.com/boubakar12/boubakar12.github.io/tree/main/coursework/ece3140-occupancy-monitor']]
  },
  'ios-coursework': {
    title: 'UIKit App Development Coursework',
    meta: 'Swift · UIKit · Three coursework snapshots',
    intro: 'Three early iOS assignment archives covering a profile editor, a social feed scaffold, and a food-planning app shell. The source is presented as coursework in its supplied state.',
    bullets: [
      'A2 Profile includes fuller programmatic profile and edit-screen source files, while the included Xcode projects also point at skeletal duplicate controller files. The Save action only returns to the profile and does not persist edits.',
      'A3 ChatDev includes UIKit feed cells and a collection-view controller, but core feed, post-model, and networking code still contains TODOs.',
      'A4 ChefOS is an Xcode project shell with a generated, empty view controller.',
      'The grouped repository documents archive limitations and retains the three assignment folders for review.'
    ],
    evaluation: 'These are coursework snapshots, not finished or tested apps. The archive READMEs specify the original Swift, iOS, and Xcode requirements; the project source has not been rebuilt in a current Xcode environment.',
    tags: ['Swift', 'UIKit', 'Auto Layout', 'UICollectionView'],
    links: [['GitHub source', 'https://github.com/boubakar12/boubakar12.github.io/tree/main/coursework/ios-coursework-apps']]
  },
  hexacopter: {
    title: 'Hexacopter UAV Integration',
    meta: 'Robotics · Electrical integration · July 2026',
    intro: 'Integrated the electrical and control systems of a six-rotor UAV, from the motor harness to telemetry and failsafes.',
    bullets: [
      'Connected six ESCs, power-distribution hardware, GPS/compass, and a Pixhawk controller running ArduPilot.',
      'Enabled live voltage and current telemetry, and calibrated accelerometer, compass, ESC throttle ranges, and RC endpoints.',
      'Configured low-battery and RC-loss failsafes.',
      'Validated system integration through bench and tethered testing.'
    ],
    tags: ['Pixhawk', 'ArduPilot', 'ESCs', 'Power distribution', 'Telemetry']
  },
  mobile: {
    title: 'Autonomous Mobile Robot',
    meta: 'Robotics · Electrical & controls · January–September 2026',
    intro: 'Developed motor-control and power interfaces for a mobile robot with closed-loop sensor feedback.',
    bullets: [
      'Implemented PID motor control, actuator interfaces, signal-conditioning circuits, and embedded navigation control logic.',
      'Designed DC/DC regulation, battery management, and custom electrical interfaces.',
      'Used oscilloscopes and multimeters to validate electrical performance under load.'
    ],
    tags: ['PID control', 'Motor drivers', 'DC/DC', 'Sensor feedback', 'Hardware validation']
  },
  ewb: {
    title: 'Rover-Drone Crop Analytics',
    meta: 'Engineers Without Borders · Robotics & Hardware Systems Lead · October 2024–January 2026',
    intro: 'Adapted an open-source NASA rover architecture for agricultural sensing, connecting custom electronics, a ROS-controlled arm, and on-device crop analytics.',
    image: 'assets/img/ewb_main.png',
    alt: 'Agricultural rover and multirotor platform beside a crop field',
    caption: 'Rover-drone project field imagery.',
    gallery: [
      ['assets/img/ewm_main1.png', 'Rover and aerial platform in a crop field'],
      ['assets/img/rd_proj.png', 'Crop imagery collected for analysis'],
      ['assets/img/ewb2.png', 'Rover project hardware']
    ],
    bullets: [
      'Designed and fabricated custom PCBs, motor-driver circuits, and power-regulation subsystems; led board bring-up and hardware/software integration.',
      'Integrated a ROS-controlled robotic arm and diagnosed power and sensor-interface faults using laboratory instrumentation.',
      'Deployed CNN inference on NVIDIA Jetson Orin Nano with transfer learning, spatial augmentation, and GPIO-triggered alerts.',
      'Integrated GPS waypoint navigation and image-capture pipelines, and developed Python sequences to test motor control and navigation across three field sites.'
    ],
    tags: ['ROS', 'NVIDIA Jetson', 'PCB bring-up', 'Computer vision', 'UAV'],
    links: [['Field video', 'assets/img/ewb4.MOV']]
  },
  forecasting: {
    title: 'Time-Series Forecasting Research',
    meta: 'Machine learning · TempusBench evaluation · March–May 2026',
    intro: 'Prepared large-scale mobility data and reproducible GPU evaluations to study zero-shot time-series forecasting.',
    image: 'assets/img/projects/tempusbench.webp',
    alt: 'TempusBench task explorer comparing forecast trajectories and uncertainty against ground truth',
    caption: 'TempusBench task explorer, used to inspect model forecasts and uncertainty. This screenshot illustrates the benchmark interface.',
    metrics: [['30M+', 'NYC ride-hailing records'], ['263', 'taxi zones represented']],
    bullets: [
      'Prepared NYC mobility records for forecasting evaluation across 263 zones.',
      'Patched open-source forecasting code, dependencies, and configuration with Python and Bash to stabilize GPU evaluation.',
      'Benchmarked Kronos 2, TiRex, and TimesFM on an NVIDIA T4 using reproducible zero-shot evaluation workflows.',
      'Inspected model error and uncertainty within the evaluation setup; results depend on the dataset, split, scaling, and forecast horizon.'
    ],
    tags: ['Python', 'Time series', 'TiRex', 'TimesFM', 'NVIDIA T4']
  },
  ws: {
    title: 'WholeStory Health',
    meta: 'Clinical AI · Hackathon project · 2026',
    intro: 'Exploring multilingual patient intake through speech, translation, body mapping, and structured clinical summaries.',
    image: 'assets/img/projects/wholestory-demo.webp',
    alt: 'WholeStory Health web demo with eight language choices',
    caption: 'The web demo’s eight-language interface. The separate Jetson prototype explores offline inference.',
    bullets: [
      'Built an offline NLP prototype combining Whisper, language identification, neural translation, and spaCy entity extraction, with approximately 2-second pipeline latency.',
      'Applied Jetson model quantization to reduce memory use by 40% while maintaining evaluated accuracy.',
      'The collaborative web demo adds an eight-language UI, a 3D body map, browser speech recognition, and Gemini-powered translation and summaries.',
      'The web demo uses online services; the offline inference work is a separate prototype.'
    ],
    tags: ['Python', 'Whisper', 'Jetson', 'React', 'Three.js', 'Gemini'],
    links: [['Concept presentation', 'assets/docs/WholeStory_Health_Concept.pdf']]
  },
  ml: {
    title: 'Water-Quality Modeling',
    meta: 'Environmental machine learning · EY AI Challenge · 2026',
    intro: 'Built a tabular modeling workflow to predict water-quality measurements from environmental and location features.',
    bullets: [
      'Prepared 9,319 training records with 60 features for dissolved reactive phosphorus, electrical conductance, and total alkalinity.',
      'Compared Random Forest, Extra Trees, and Ridge regression separately for each target.',
      'Used grouped cross-validation to separate locations during evaluation and inspected per-fold scores to understand geographic variation.'
    ],
    tags: ['Python', 'scikit-learn', 'Feature engineering', 'GroupKFold', 'Environmental data']
  },
  bird: {
    title: 'Bird-Call Classification',
    meta: 'Audio machine learning · Eight-class classification',
    intro: 'Turned short field recordings into statistical audio features, then compared classifiers and combined gradient-boosted models for the final submission.',
    image: 'assets/img/projects/bird-call-spectrogram.webp',
    alt: 'Spectrogram of a training bird-call recording, showing frequency content over time',
    caption: 'An example training clip from the repository, visualized for this case study.',
    metrics: [['20,000', 'labeled training clips'], ['8', 'bird-call classes']],
    bullets: [
      'Built a librosa preprocessing pipeline that resamples audio to 22.05 kHz and pads or trims recordings to three seconds.',
      'Extracted time-aggregated MFCCs and their first/second derivatives, mel spectra, chroma, spectral descriptors, zero crossings, and RMS energy.',
      'Created a stratified 80/20 training/validation split and cached feature matrices for repeatable experiments.',
      'Combined probability outputs from five HistGradientBoosting models trained on different 90% subsamples, then generated labels for 4,000 test clips.'
    ],
    tags: ['Python', 'librosa', 'scikit-learn', 'MFCC', 'Gradient boosting'],
    links: [['GitHub source', 'https://github.com/boubakar12/bird-call-classification']]
  },
  hexagonian: {
    title: 'Hexagonian Digit Classification',
    meta: 'Computer vision · Cornell ECE 3200/5200 · Spring 2026',
    intro: 'Classified pairs of overlapping handwritten digits into 15 classes, comparing simple statistical baselines with a residual convolutional network.',
    image: 'assets/img/projects/hexagonian-cnn.svg',
    alt: 'Residual CNN architecture with 64, 128, and 256-channel blocks leading to 15 digit-pair classes',
    caption: 'Conceptual architecture based on the PyTorch implementation.',
    metrics: [['97.66%', 'best logged validation accuracy'], ['15', 'overlapping digit-pair classes']],
    bullets: [
      'Prepared 82,875 labeled 28 × 28 grayscale images with normalization and a stratified 80/20 validation split.',
      'Compared Gaussian Naive Bayes and softmax regression with a three-block residual CNN using BatchNorm, ReLU, pooling, and dropout.',
      'Trained with Adam, a OneCycle learning-rate schedule, label smoothing, gradient clipping, and training-only image augmentation.',
      'Explored multiple random seeds and test-time augmentation. The strongest logged single-model run reached 97.66% validation accuracy after 80 epochs.'
    ],
    tags: ['PyTorch', 'Residual CNN', 'Computer vision', 'Augmentation', 'Model evaluation'],
    links: [['GitHub source', 'https://github.com/boubakar12/hexagonian-digit-classification'], ['Project report', 'assets/docs/Hexagonian_Digit_Classification_Report.pdf']]
  },
  audio: {
    title: 'Audio Signal Prediction',
    meta: 'Signal processing · Regression & regularization',
    intro: 'Predicted the next sample of an audio waveform from a short history, studying how window size and regularization affect generalization.',
    image: 'assets/img/projects/audio-prediction.webp',
    alt: 'Actual and predicted audio samples from a four-sample linear predictor on the test segment',
    caption: 'Reproduced from the repository’s 8.82 kHz clip: train on the first half, evaluate one-step predictions on the second half. Each prediction uses the preceding observed samples.',
    metrics: [['0.957', 'reproduced one-step test R²'], ['4 samples', 'history window for this result']],
    bullets: [
      'Built a NumPy/scikit-learn workflow for single-sample and sliding-window linear predictors.',
      'Separated the recording chronologically into training and test halves, preserving time order.',
      'Compared model behavior across window sizes and Ridge penalties, and explored LASSO for sparse coefficient selection.',
      'The four-sample ordinary-least-squares result reproduces the reported R² ≈ 0.957 on the supplied recording; it evaluates one-step sample prediction on that clip.'
    ],
    tags: ['Python', 'NumPy', 'Linear regression', 'Ridge', 'LASSO', 'DSP'],
    links: [['GitHub source', 'https://github.com/boubakar12/audio-signal-prediction']]
  },
  sat4: {
    title: 'SAT-4 Land-Cover Classification',
    meta: 'Remote sensing · k-NN & SVM · Cornell ECE 2720',
    intro: 'Compared classical classifiers on raw RGB/NIR image values and compact color-statistic features to study accuracy, runtime, and overfitting.',
    image: 'assets/img/projects/sat4-samples.webp',
    alt: 'Four actual SAT-4 image samples with their RGB and near-infrared channels',
    caption: 'RGB and NIR examples included in the repository. Each input patch is 28 × 28 pixels.',
    gallery: [['assets/img/projects/sat4-svm-results.webp', 'Original SVM feature-space experiment: training and test accuracy as C varies']],
    metrics: [['3,136 → 8', 'input values to engineered features'], ['4', 'land-cover classes']],
    bullets: [
      'Compared k-nearest neighbors and RBF-kernel SVMs across neighborhood sizes and regularization settings.',
      'Engineered eight features from the means and standard deviations of hue, saturation, value, and near-infrared channels.',
      'Normalized features using training-set statistics and inspected correct predictions, errors, and support-vector examples.',
      'The repository reports k = 2 for its feature-space k-NN model and C = 57 for the selected SVM, with 674 support vectors. The supplied split was used for parameter selection.'
    ],
    tags: ['Python', 'scikit-learn', 'SVM', 'k-NN', 'HSV + NIR', 'Remote sensing'],
    links: [['GitHub source', 'https://github.com/boubakar12/sat4-knn-svm-classification']]
  },
  marble: {
    title: 'African Marble Game',
    meta: 'Interactive software · Solo build · Playable web demo',
    intro: 'A digital take on a familiar marble game, built around aiming, power, collision, and repeatable game state.',
    image: 'assets/img/projects/marble-game.webp',
    alt: 'Live African Marble Game showing the 3D sand board and hole challenge',
    caption: 'The publicly playable Level 1: Hole Challenge.',
    bullets: [
      'Implemented a 3D web experience with React Three Fiber and Three.js.',
      'Built drag-to-shoot controls, trajectory calculation, power scaling, and rigid-body collision mechanics.',
      'Built three challenges: Hole, Triangle Formation, and Circle & Cross, with level progression and adjustable AI-opponent difficulty.',
      'Persisted marble counts, wins, losses, shots, and level completions with Zustand so sessions survive page reloads.'
    ],
    tags: ['React Three Fiber', 'Three.js', 'TypeScript', 'Zustand'],
    links: [['Play the web game', 'https://boubakar12.github.io/african-marble-game'], ['Source', 'https://github.com/boubakar12/african-marble-game']]
  },
  chromalog: {
    title: 'ChromaLog — Weekly Planner',
    meta: 'Personal productivity app · 2026',
    intro: 'A color-coded planning workspace that turns a weekly schedule into a lightweight record of how time is spent, with AI-assisted goals and weekly summaries.',
    image: 'assets/img/projects/chromalog-calendar.svg',
    alt: 'Illustration of a weekly hour calendar with color-coded activity blocks',
    caption: 'Custom illustration of the weekly calendar and activity palette; this is not a captured app screen.',
    bullets: [
      'Built an hour-by-hour weekly calendar with color-coded activity blocks, a movable activity palette, and notes.',
      'Added weekly and monthly reports, an AI weekly summary, category streaks, goal planning that schedules tasks on the calendar, and group calendar sharing.',
      'Implemented Firebase authentication and Firestore sync, plus CSV and JSON export/import for personal data.'
    ],
    tags: ['JavaScript', 'HTML/CSS', 'Firebase Auth', 'Firestore', 'Chart.js'],
    links: [['GitHub source', 'https://github.com/boubakar12/chromalog']]
  },
  marbleg: {
    title: 'MarbleG for iOS',
    meta: 'Native iOS game · Personal project · 2026 · App Store preparation',
    intro: 'A native SwiftUI Mancala-style strategy game with local multiplayer, configurable AI matches, and a reusable rules engine.',
    image: 'assets/img/projects/marbleg-board.svg',
    alt: 'Illustration of a Mancala-style board with two rows of pits and marble counters',
    caption: 'Custom game-board illustration, not a screenshot of the iOS app. App Store preparation is still in progress.',
    bullets: [
      'Built a Swift game model and rules engine for legal moves, sowing, captures, extra turns, and end-of-game scoring.',
      'Implemented a SwiftUI board with local two-player and AI modes, adjustable difficulty and play style, turn timers, match series, move hints, and an in-app guide.',
      'Added player profiles, saved match history, onboarding, accessibility announcements, and audio feedback.',
      'The AI uses alpha-beta minimax search at configured depths for medium and hard modes. The app is in release preparation; its readiness checklist still calls for screenshots and external TestFlight feedback.'
    ],
    tags: ['Swift', 'SwiftUI', 'Game AI', 'Minimax', 'iOS'],
    links: [['Support page', 'https://boubakar12.github.io/apps-site/marbleg/support.html'], ['Privacy policy', 'https://boubakar12.github.io/apps-site/marbleg/privacy.html']]
  },
  'email-digest': {
    title: 'Local AI Email Digest',
    meta: 'Personal automation · Prototype · Python',
    intro: 'A command-line workflow that summarizes the previous week of inbox messages with a locally run language model and emails a weekly digest.',
    bullets: [
      'Fetches recent messages over IMAP, skips messages without a body, and analyzes each message before creating a combined summary.',
      'Uses LM Studio or GPT4All for local model inference, then sends the result as an email digest.',
      'Reads account credentials and the digest recipient from environment variables rather than hard-coding them in the script.'
    ],
    tags: ['Python', 'IMAP', 'Local LLM', 'LM Studio', 'GPT4All'],
    links: [['GitHub source', 'https://github.com/boubakar12/email-assistant']]
  },
  revery: {
    title: 'Rêvery — Audio DSP',
    meta: 'Audio software · Personal project',
    intro: 'Exploring real-time voice transformation and acoustic effects across web and iOS interfaces.',
    bullets: [
      'Developed audio-processing and voice-transformation workflows with custom acoustic presets.',
      'Worked with Web Audio API, Swift interfaces, and neural audio inference.'
    ],
    tags: ['DSP', 'Web Audio API', 'Swift', 'ONNX Runtime']
  },
  ip: {
    title: 'LNIS IP & Commercialization',
    meta: 'Engineering analysis · Cornell ECE · Fall 2025',
    intro: 'Evaluated the technology-readiness, intellectual-property landscape, and commercialization paths of a Liquid Nanoparticle Ion Source.',
    image: 'assets/img/projects/ip1.png',
    alt: 'Liquid Nanoparticle Ion Source illustration from the team presentation',
    caption: 'Technology illustration from the commercialization presentation.',
    bullets: [
      'Researched prior art, patent positioning, and potential applications in satellite propulsion.',
      'Prepared a commercialization brief and presentation connecting the engineering concept with market and licensing considerations.'
    ],
    tags: ['TRL assessment', 'Patent research', 'Commercialization'],
    links: [['View presentation', 'assets/img/IP_Presentation.pdf']]
  },
  ccra: {
    title: 'Cornell Computer Reuse',
    meta: 'Community engineering · Treasurer & volunteer',
    intro: 'Supporting electronics reuse, computer refurbishment, and access to technology through Cornell Computer Reuse Association.',
    gallery: [
      ['assets/img/ccra/ccra1.png', 'Cornell Computer Reuse Association activities'],
      ['assets/img/ccra/ccra2.png', 'Computer reuse and refurbishment'],
      ['assets/img/ccra/ccra3.png', 'CCRA community work']
    ],
    bullets: [
      'Helped troubleshoot and repurpose donated computers and supported the association’s organizational finances.',
      'Contributed to a team focused on repair, reuse, and technology access for underserved communities.'
    ],
    tags: ['Hardware troubleshooting', 'Electronics reuse', 'Community', 'Finance'],
    links: [['About CCRA', 'assets/img/ccra/CCRA.pdf']]
  },
  quincy: {
    title: 'City of Quincy — Traffic Engineering',
    meta: 'Public works internship · Quincy, MA · Summer 2022',
    intro: 'An early engineering experience documenting pedestrian-signal conditions and accessibility needs in the city’s busiest intersections.',
    image: 'assets/img/city1.png',
    alt: 'City of Quincy internship project image',
    caption: 'From the municipal internship project materials.',
    bullets: [
      'Surveyed 46 intersections, testing pedestrian signals and documenting sign and crosswalk conditions.',
      'Prepared findings and recommendations to support intersection improvements.',
      'Joined construction-site visits and planning meetings, and helped organize departmental records.'
    ],
    tags: ['Field survey', 'Public infrastructure', 'Accessibility', 'Technical reporting'],
    links: [['Read internship report', 'assets/img/intern_report.pdf']]
  }
};

(() => {
  const dialog = document.createElement('dialog');
  dialog.id = 'project-dialog';
  dialog.className = 'project-dialog';
  dialog.setAttribute('aria-labelledby', 'project-dialog-title');
  document.body.append(dialog);
  let opener;
  let originalOverflow = '';

  // All content is authored locally; text is still escaped before templating.
  const escape = text => String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const imageLink = (src, alt, className) => `<a href="${escape(src)}" target="_blank" rel="noopener" class="${className}"><img src="${escape(src)}" alt="${escape(alt)}" loading="lazy"></a>`;

  function openProject(id, trigger) {
    const project = PROJECTS[id];
    if (!Object.hasOwn(PROJECTS, id)) return;
    opener = trigger || document.activeElement;
    const media = project.image ? `<figure class="case-figure">${imageLink(project.image, project.alt, 'case-cover')}<figcaption>${escape(project.caption)}</figcaption></figure>` : '';
    const gallery = project.gallery ? `<div class="modal-gallery">${project.gallery.map(([src, alt]) => imageLink(src, alt, 'modal-thumb')).join('')}</div>` : '';
    const pipeline = project.pipeline ? `<section class="case-flow-section" aria-label="Localization system overview"><h3 class="case-subhead">How the system fits together</h3><ol class="case-flow">${project.pipeline.map(([title, description]) => `<li><h4>${escape(title)}</h4><p>${escape(description)}</p></li>`).join('')}</ol></section>` : '';
    const figures = project.figures ? project.figures.map(figure => `<section class="case-evidence"><h3 class="case-subhead">${escape(figure.heading)}</h3><figure class="case-figure">${imageLink(figure.image, figure.alt, 'case-cover')}<figcaption>${escape(figure.caption)}</figcaption></figure></section>`).join('') : '';
    const evaluation = project.evaluation ? `<section class="case-evaluation"><h3 class="case-subhead">Evaluation scope</h3><p class="modal-desc">${escape(project.evaluation)}</p></section>` : '';
    const metrics = project.metrics ? `<dl class="case-metrics">${project.metrics.map(([value, label]) => `<div><dt>${escape(value)}</dt><dd>${escape(label)}</dd></div>`).join('')}</dl>` : '';
    const links = project.links ? `<div class="modal-actions">${project.links.map(([label, url]) => `<a class="btn-out" href="${escape(url)}" target="_blank" rel="noopener">${escape(label)} ↗</a>`).join('')}</div>` : '';
    dialog.innerHTML = `<div class="modal-accent-bar"></div><div class="modal-inner">
      <button type="button" class="modal-close" aria-label="Close project" autofocus>×</button>
      <p class="modal-tag">${escape(project.meta)}</p>
      <h2 class="modal-h" id="project-dialog-title">${escape(project.title)}</h2>
      <p class="modal-desc">${escape(project.intro)}</p>
      ${pipeline}${media}${gallery}${metrics}
      <h3 class="case-subhead">Engineering work</h3>
      <ul class="modal-list">${project.bullets.map(item => `<li>${escape(item)}</li>`).join('')}</ul>
      ${figures}${evaluation}
      <div class="modal-chips">${project.tags.map(tag => `<span class="chip">${escape(tag)}</span>`).join('')}</div>
      ${links}
    </div>`;
    dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
    originalOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.scrollTop = 0;
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('a[data-project]');
    if (!trigger || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    openProject(trigger.dataset.project, trigger);
  });
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = originalOverflow;
    opener?.focus({ preventScroll: true });
    if (Object.hasOwn(PROJECTS, location.hash.slice(1).replace(/^project-/, ''))) history.replaceState(null, '', location.pathname + location.search);
  });

  const filters = document.querySelectorAll('[data-project-filter]');
  const cards = document.querySelectorAll('[data-categories]');
  const count = document.getElementById('project-count');
  if (count) count.textContent = `${cards.length} projects`;
  // Show only categories represented on this page's selection.
  filters.forEach(button => {
    const category = button.dataset.projectFilter;
    button.hidden = category !== 'all' && ![...cards].some(card => card.dataset.categories.split(' ').includes(category));
  });
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let visible = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && !card.dataset.categories.split(' ').includes(category);
      if (!card.hidden) { visible++; card.classList.add('visible'); }
      const railLink = document.querySelector(`.section-nav a[href="#heading-${card.id.replace('project-', '')}"]`);
      if (railLink) {
        railLink.hidden = card.hidden;
        railLink.removeAttribute('aria-current');
      }
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  }));
  const openFromHash = () => {
    const id = location.hash.slice(1).replace(/^project-/, '');
    if (!dialog.open && Object.hasOwn(PROJECTS, id)) openProject(id, document.querySelector(`[data-project="${id}"]`));
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
