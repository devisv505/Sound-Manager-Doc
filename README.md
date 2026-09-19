# DEV505 Sound Manager documentation

A static documentation site styled after the Sound Lab Unity demos. Built with Astro and Starlight for GitHub Pages.

## Current milestone

M1 contains the branded home page, all ten demo summaries, first-sound setup, the complete `SoundBus` reference, a copyable Campfire lifecycle recipe, and the detailed Campfire walkthrough. Its images are actual Unity captures. Detailed guides for demos 02–10 and the broader API/graph reference remain in later milestones.

See [SPEC.md](SPEC.md), [ROADMAP.md](ROADMAP.md), and [the M1 validation report](validation/M1.md).

## Run locally

Use Node **24.21.0** (the pinned Node 24 LTS version). With nvm installed:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the URL printed by Astro with the `/Sound-Manager-Doc/` base path. The base path is intentional: this is a GitHub project Pages site, not an app served from `/`.

To review the production build, including search:

```sh
npm run validate
npm run preview -- --port 4321
```

Open [the local production preview](http://127.0.0.1:4321/Sound-Manager-Doc/). Astro 7 manages the preview as a background service; use `npx astro preview status`, `npx astro preview logs`, or `npx astro preview stop` to inspect or stop it.

`npm run check` checks Astro/TypeScript/content schemas and local capture/example records. `npm run validate` also builds the static output, then checks local links, anchors, image references, the repository base, and Pagefind output. Unity is not needed for a website build.

## Browser checks

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

The browser checks exercise the production site: navigation, ten-card gallery, direct nested routes, images, keyboard dismissal/focus restoration, Pagefind search, C# copy, and 390/320 px layouts. Screenshots and the test report go to `validation/`; test failure artifacts are ignored. The configured preview starts automatically when no server already runs on port 4321. Stop an older preview first if its root belongs to another project.

## Content and source tracking

Pages are Markdown/MDX under `src/content/docs/`. Their schema requires a content kind, source revision, and source paths; demo metadata also includes a scene, keys, and screenshot IDs. All authored route links should use `sitePath()` from `src/lib/links.ts` in MDX/components. It respects the Pages repository subpath.

- `content-data/source-baseline.json`: documented Unity source revision and audit scope.
- `content-data/api-coverage.json`: public member coverage; M1 accounts for every `SoundBus` method/overload and its notification property.
- `content-data/demos.json`: exact titles, feature summaries, and guide availability for all ten demos.
- `content-data/captures.json`: Unity image provenance, states, dimensions, reproduction steps, and hashes.
- `examples/CampfireSound.cs`: the complete checked example. The recipe imports this file directly instead of duplicating it in a Markdown fence.
- `validation/campfire-example.json`: Unity compilation/behavior evidence and the example hash.

Short API snippets are explicitly labeled excerpts and state their surrounding assumptions. Their contract review is separate from the complete component's compilation/runtime proof.

Do not use historical README statements as the sole source for current behavior. In particular, the Campfire graph's explicit Stop connections use the nodes' authored fade-outs; the API fade applies to remaining existing voices. The site describes the runtime implementation rather than repeating the sample's older broad fade comment.

## Unity images and example verification

Original PNGs live in `media-source/unity/` and are excluded from the published output. Matching inputs in `src/assets/demos/` are processed by Astro into responsive WebP images. Keep the originals for recapture/comparison. There are no synthetic demo screenshots.

M1 reads the composed Game View render surface at 1920 × 1080 so the HUD is included. The home hero is a second real capture with only the runtime HUD temporarily hidden. The graph uses its own Unity GUI render surface at 3456 × 2008; this avoids capturing unrelated desktop windows. Metal's texture-row orientation is normalized during capture.

The `.cs.txt` files in `validation/` record the actual temporary Unity scripts used for capture/restoration and testing. They are audit/support files outside `Assets`, not production Unity components. Capture scripts currently retain the original workstation paths; adapt those explicit output paths to your machine before reuse. Do not run the setup/restoration scripts blindly against someone else's open scene.

To revalidate the complete C# example, combine `examples/CampfireSound.cs` with `validation/VerifyCampfireExample.cs.txt` in a temporary `.cs` file outside Unity `Assets`, then run its `VerifyCampfireExample.Main` entry with the connected Editor's `run_script` command. The active Campfire scene must be in Play Mode with its manager ready and the scene fire stopped. This creates and removes one temporary test GameObject. Record the returned checks, source revision, and SHA-256 of the example in the validation JSON. The website content check rejects a changed example until that proof is updated.

Preserve unsaved scene work, record temporary Game View/background settings, and restore them after capture. Never write `.unity`/`.asset` files by hand for this documentation process.

## GitHub Pages configuration

The proposed site is `https://devisv505.github.io/Sound-Manager-Doc/`, configured as `site` plus `base` in `astro.config.mjs`. No remote repository or public deployment is created by M1. CI/deployment implementation and live publication are M6/M7.

For implementation guidance see [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/). Static search follows [Starlight's Pagefind integration](https://starlight.astro.build/guides/site-search/).

## Typography and media

Inter is self-hosted from `@fontsource-variable/inter` 5.3.0. Its SIL Open Font License is included at `public/fonts/Inter-OFL.txt`. The Inter family matches the font used by the demos. Unity screenshots and the DEV505 mark illustrate this project's own demo/brand assets. No source audio, API keys, or Unity cache directories are needed in the documentation build.
