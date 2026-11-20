# Dream Marathon Spirit

A responsive community website for **Dream Marathon Spirit**, announcing Dream Marathon 2026 and inviting runners to register.

## Live website

Visit the live site:

**https://nightwatchman17.github.io/dream-marathon/**

The site is a static frontend. Registration details are collected through [the Google Form](https://forms.gle/8o8HJQmVtt72QehG7); this project does not use a database. The Facebook button in the header links to [the community page](https://web.facebook.com/profile.php?id=61596623797076).

## Registration slots

The panel just below the homepage countdown shows total slots, booked slots, slots left, and the percentage still available. To update it, change `data-total` and `data-booked` on the `.slots` section in `index.html` — the displayed numbers and progress bar are calculated automatically. Current values: 200 total, 90 booked, 110 left (55% remaining).

## Gallery

Photos live in the `gallery/` folder and are listed in `gallery/photos.js`. To add photos:

1. Copy the images into `gallery/`.
2. Optionally list captions in `gallery/captions.txt`, one photo per line:
   ```
   img 0001 - Runner: Abdul Kaium
   ```
3. Run:
   ```
   node scripts/build-gallery.mjs
   ```
4. Adjust captions in `gallery/photos.js` if the generated ones need rewording. Re-running the script keeps existing captions.

Open `gallery.html` or click **Gallery** in the site navigation to view them. A thumbnail strip at the top lets visitors jump between photos, and each photo is displayed large and centered, one after another, with a caption below. Images keep their natural aspect ratio.

## Countdown

The homepage shows a live countdown to Dream Marathon 2026 right after the big news banner. It targets **11 December 2026, 00:00 Bangladesh time**; change `RACE_START` in `script.js` when the exact start time is confirmed.

## Run locally

Open `index.html` in a web browser. The site uses the images in `photos/` and its stylesheet in `style.css`.

## GitHub Pages

Pages is configured to deploy from the `main` branch and the repository root (`/`). New commits to `main` will be published automatically after the Pages build completes.
