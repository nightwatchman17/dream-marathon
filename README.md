# Dream Marathon Spirit

A responsive community website for **Dream Marathon Spirit**, announcing Dream Marathon 1.0 and inviting runners to register.

## Live website

Visit the live site:

**https://nightwatchman17.github.io/Dream-Marathon/**

The site is a static frontend. Registration details are collected through [the Google Form](https://forms.gle/8o8HJQmVtt72QehG7); this project does not use a database.

## Gallery

Photos live in the `gallery/` folder and are listed in `gallery/photos.js`. To add photos:

1. Copy the images into `gallery/`.
2. Run:
   ```
   node scripts/build-gallery.mjs
   ```
3. Adjust captions in `gallery/photos.js` if the generated ones need rewording. Re-running the script keeps existing captions.

Open `gallery.html` or click **Gallery** in the site navigation to view them. Images keep their natural aspect ratio, stay centered inside their frame, and are shown with a caption.

## Countdown

The homepage shows a live countdown to Dream Marathon 1.0 right after the big news banner. It targets **4 December 2026, 00:00 Bangladesh time**; change `RACE_START` in `script.js` when the exact start time is confirmed.

## Run locally

Open `index.html` in a web browser. The site uses the images in `photos/` and its stylesheet in `style.css`.

## GitHub Pages

Pages is configured to deploy from the `main` branch and the repository root (`/`). New commits to `main` will be published automatically after the Pages build completes.
