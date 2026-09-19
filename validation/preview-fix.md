# Screenshot preview and private-source links — 20 September 2026

The screenshot dialog now reserves separate rows for controls, image, and caption. Fit mode constrains both image dimensions to the available area. Actual-size mode scrolls only the image region, keeping the toolbar reachable. Each opening resets to fit mode at the origin. Escape, focus return, and keyboard access to the scroll region are preserved.

Removed the Campfire “Explore the source” section, SoundBus source link, demo controller/graph links, and footer link to the private Unity repository. Internal source metadata and the plain revision label remain for validation. The static build rejects links to the private repository, and the specification records that requirement for future milestones.

Validation:

- `npm run validate`: passes, with clean Astro diagnostics and 60 built HTML pages checked for links/assets.
- Full browser suite: 16 passed.
- After the final toolbar alignment adjustment, the focused preview regression passed again at 1551×830, 390×844, and 844×390, using both landscape graph and portrait Inspector images.
- The regression checks image bounds against controls/caption, no overflow in fit mode, native pixel size and stationary controls while scrolling, and reset/focus behavior after reopening.
- Desktop and phone results visually reviewed in `preview-fit-desktop.png` and `preview-fit-mobile.png`.

No Unity changes or deployment.
