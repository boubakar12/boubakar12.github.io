# Boubakar Diallo — Portfolio

Cornell Electrical & Computer Engineering, Class of 2028. Digital hardware,
embedded systems, robotics, and applied AI.

[Portfolio](https://boubakar12.github.io) · [Email](mailto:bd453@cornell.edu)

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`. The site is static and requires no build step.

## Content

- `index.html`: introduction, experience, selected projects, and contact.
- `projects.html`: project summaries and category filters.
- `assets/js/projects.js`: shared case-study content and dialog behavior.
- `about.html`: biography, focused PDF resumes, and the journey globe.
- `assets/css/style.css`: shared responsive styles.
- `assets/docs/`: focused resume PDFs; the main resume retains its existing path
  at `assets/img/Boubakar_Diallo_Resume.pdf`.

Keep a project's summary in the HTML consistent with its case study in
`projects.js`. Project visuals include screenshots, field imagery, and
conceptual SVG diagrams; captions distinguish their purpose.

See [project evidence and figure notes](assets/docs/project-evidence.md) for
repository sources, evaluation context, and the audio-result reproduction.

The journey uses self-hosted Globe.gl assets and an SVG fallback. See
`assets/vendor/globe-gl/README.md` for licenses and asset sources.
