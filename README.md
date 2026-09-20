# DEV505 Sound Manager documentation

A static documentation site styled after the Sound Lab Unity demos. Built with Astro and Starlight for GitHub Pages.

## Current milestone

M5 adds the full graph reference, advanced integration APIs, and troubleshooting in plain language. All **49 shipped graph nodes** have port tables, setup notes, behavior details, and practical examples. Wave Asset trimming, lifecycle/timing, event settings, diagnostics, and every result/notification category are explained.

The site has **76 authored pages**, **11 complete C# examples checked in Unity**, **3 additional advanced excerpts compiled in Unity**, and an inventory of 163 public types with 867 member declarations. All 18 advanced integration/observation types now have reference pages. It includes **133 authentic Unity images**: M3's 84 demo captures and 49 individual node captures. The homepage pairs the Campfire graph with its code, and every node description shows its real editor appearance with enlargement. M6 local quality review is complete; M7 publication remains open. The [node-image follow-up report](validation/NODE-CAPTURES.md) records the homepage and 49-node screenshot work.

See [SPEC.md](SPEC.md), [ROADMAP.md](ROADMAP.md), and the [M6 validation report](validation/M6.md). Earlier reports record [M1](validation/M1.md), [M2](validation/M2.md), [M3](validation/M3.md), and [M4](validation/M4.md). M6 is validated locally; this milestone does not publish a new Pages revision. Open the [node catalogue](http://127.0.0.1:4321/Sound-Manager-Doc/graph/), [advanced reference](http://127.0.0.1:4321/Sound-Manager-Doc/advanced/), or [troubleshooting](http://127.0.0.1:4321/Sound-Manager-Doc/guides/troubleshooting/) after starting the preview.

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

The twenty-seven browser checks exercise the production site: navigation, all ten demo guides, all twelve recipe pages, direct nested routes, images, keyboard dismissal/focus restoration, Pagefind search, exact copying of every complete C# component, source-derived API signatures, and 390/320 px layouts. They load every gallery image and verify trim instructions and actual-size enlargement. M5 checks additionally cover every node and fixed/numbered port, advanced API anchors, excerpt copying, search, and phone layouts. M5 screenshots are saved under `validation/m5/`; historical milestone screenshots are retained separately. The test report goes to `validation/browser-results.json`; failure artifacts are ignored. The configured preview starts automatically when no server already runs on port 4321. Stop an older preview first if its root belongs to another project.

## Content and source tracking

Write for someone new to Unity, using clear, natural English. Explain unfamiliar terms, show exactly where to click and where code belongs, and describe what the reader should see or hear. Follow the [writing requirements in the specification](SPEC.md#writing-for-someone-new-to-unity--required-in-every-stage) for every stage, including revisions to existing pages. Keep API names and behavior precise while explaining them in ordinary language.

Pages are Markdown/MDX under `src/content/docs/`. Their schema requires a content kind, source revision, and source paths; demo metadata also includes a scene, keys, and screenshot IDs. All authored route links should use `sitePath()` from `src/lib/links.ts` in MDX/components. It respects the Pages repository subpath. The Unity source repository is private. Keep source paths/hashes for validation, but do not publish links to that repository; the build checks this.

- `content-data/source-baseline.json`: documented Unity source revision and audit scope.
- `content-data/public-api-inventory.json`: source-derived public declarations, source paths, and file hashes; partial declarations remain separate here.
- `content-data/api-coverage.json`: combined public type inventory and per-member coverage. Everyday, generated, advanced, and infrastructure types have explicit scope and reasons. The build checks every documented target page and anchor.
- `content-data/demos.json`: exact titles, feature summaries, and guide availability for all ten demos.
- `content-data/captures.json`: Unity image provenance, states, dimensions, reproduction steps, and hashes.
- `content-data/node-captures.json`: 49 native editor screenshots, operation mapping, file hashes, dimensions, captions, and capture provenance. `scripts/check-node-captures.mjs` verifies completeness and Unity cleanup.
- `content-data/node-colors.json`: seven exact editor header colors and all 49 native category assignments. Each reference entry shows a named swatch; the graph overview contains the color key.
- `content-data/node-catalogue.json`: all 49 runtime operations, exact port names/types, family, behavior, setup, and example. Family pages use real Markdown headings so every node appears in the table of contents.
- `content-data/demo-audit.json`: reader-facing settings for all 22 sample events, normalized from the recorded native Unity audit. `npm run audit:demos` regenerates it; validation detects drift.
- `content-data/recipes.json`: the twelve topics, demo links, and shared complete example files.
- `examples/*.cs`: the eleven complete components. Pages import these files directly instead of duplicating them in Markdown fences.
- `validation/examples.json`: source revision, compilation results, file hashes, and runtime evidence for every complete example. Content checks reject changed examples until their verification records are updated.
- `validation/campfire-example.json`, `validation/m2-unity-runtime.json`, and `validation/m4/runtime.json`: actual Unity behavior results.

Short API snippets are explicitly labeled excerpts and state their surrounding assumptions. Their contract review is separate from the complete components' compilation/runtime proof. API member blocks are rendered from the inventory through `ApiSignatures.astro`, keeping declared signatures consistent across pages.

Do not use historical README statements as the sole source for current behavior. In particular, the Campfire graph's explicit Stop connections use the nodes' authored fade-outs; the API fade applies to remaining existing voices. The site describes the runtime implementation rather than repeating the sample's older broad fade comment.

## Unity images and example verification

Original PNGs live in `media-source/unity/` and are excluded from the published output. After Astro builds, `scripts/prepare-capture-output.mjs` removes only unreferenced generated PNG copies whose hashes match the capture manifest; it refuses to remove a referenced image. Responsive WebP images and full-resolution WebP enlargements remain in the output. Matching inputs in `src/assets/demos/` are processed by Astro into responsive WebP images. Keep the originals for recapture/comparison. There are no synthetic demo screenshots.

M1 reads the composed Game View render surface at 1920 × 1080 so the HUD is included. The home hero is a second real capture with only the runtime HUD temporarily hidden. The graph uses its own Unity GUI render surface at 3456 × 2008; this avoids capturing unrelated desktop windows. Metal's texture-row orientation is normalized during capture.

M3 uses the same Game View method for the other nine demos, and native graph/Inspector surfaces for editor details. The 80 new originals have adjacent `.capture.json` sidecars with the actual capture time, dimensions, and observed state. `content-data/captures.json` adds reader-facing labels, steps, captions, alt text, source hashes, and matching published inputs. M1’s four Campfire captures remain valid against the unchanged Unity revision. The content check verifies all required states, original/input byte equality, dimensions, metadata, and session restoration records.

The capture and runtime-test `.cs.txt` files in `validation/` and `validation/m3/` record the temporary Unity scripts used for this work. They stay outside `Assets`. Capture scripts currently retain the original workstation paths; adapt those explicit output paths to your machine before reuse. Do not run the setup/restoration scripts blindly against someone else's open scene. `InventoryPublicApi.cs.txt` is a separate .NET/Roslyn helper, not a Unity script.

To revalidate the complete C# example, combine `examples/CampfireSound.cs` with `validation/VerifyCampfireExample.cs.txt` in a temporary `.cs` file outside Unity `Assets`, then run its `VerifyCampfireExample.Main` entry with the connected Editor's `run_script` command. The active Campfire scene must be in Play Mode with its manager ready and the scene fire stopped. This creates and removes one temporary test GameObject. Record the returned checks, source revision, and SHA-256 of the example in the validation JSON. The website content check rejects a changed example until that proof is updated.

For M3 recapture instructions and editor-session details, see [the capture notes](validation/m3/README.md). Reproduction steps on the site use the normal demo controls; the automated capture helpers call those same controllers and use actual keyboard input for Footstep.

Preserve unsaved scene work, record temporary Game View/background settings, and restore them after capture. Never write `.unity`/`.asset` files by hand for this documentation process.

For M2, combine `CampfireSound.cs`, `FirstSound.cs`, `MovingBeeSound.cs`, and `EngineSoundControls.cs` with `validation/VerifyM2Examples.cs.txt`, hoisting their `using` directives to the top and adding `using System.Linq;`. Call `VerifyM2Examples.Main(outputPath)` through the connected Editor's `run_script` command with Campfire open, ready, and in Play Mode. The harness temporarily registers Bee, Engine, and Footstep, creates test objects and in-memory event fixtures, then removes them in its cleanup block. It does not save scene or asset changes. Record compilation diagnostics and all example hashes as well as the runtime report. Campfire's unchanged component retains its M1 behavior evidence and is recompiled with M2.

For M4, combine all eleven files in `examples/` with `validation/m4/VerifyM4Examples.cs.txt`, hoisting their `using` directives and adding `using System.Linq;`. Call `VerifyM4Examples.Main(outputPath)` through Unity CLI `run_script` with Campfire ready in Play Mode. Allow about 30 seconds and enable background running temporarily. It registers sample events only in memory, checks the seven new components, and removes temporary objects/registrations in `finally`. The four earlier examples are recompiled and retain their recorded M1/M2 behavior proof. Restore the original scene, play/pause state, and background setting afterward. The M4 report describes the exact evidence and limits of these checks.

`validation/m4/AuditGraphs.cs.txt` records the native graph audit used for the settings tables. Update its source revision/output path before reusing it. Re-run `npm run audit:demos` after recording a new audit, and review prose as well as numbers before changing the documented baseline. The website's normal build reads the committed audit and does not connect to Unity.

To rebuild the public inventory, use `validation/InventoryPublicApi.cs.txt` in a small .NET console project with references to the SDK's `Microsoft.CodeAnalysis.dll` and `Microsoft.CodeAnalysis.CSharp.dll` under `Roslyn/bincore`. Run from the Unity project root and call `InventoryPublicApi.Main(outputPath)`. The recorded audit used .NET 9. Update the source revision literal when changing baselines. Review newly found types and members in `api-coverage.json`; do not automatically mark them documented. This helper is separate from the website build, which uses the committed JSON and needs no Unity or .NET installation.

## Updating the M5 reference

Read runtime/editor implementation before changing node behavior descriptions. `validation/m5/source-audit.json` records the checked source hashes and the three exact excerpt hashes. `scripts/check-m5.mjs` compares every node's fixed ports with the committed native Unity catalogue audit, checks numbered-port conventions, requires complete advanced coverage, and detects changed excerpts or audit harnesses.

To rerun the native reference audit, open the source project in Unity 6000.6.0f1 and keep it in Edit Mode. Concatenate `validation/m5/VerifyM5Reference.cs.txt` and `validation/m5/CompileM5Excerpts.cs.txt` into a temporary `.cs` file outside Assets. Invoke `VerifyM5Reference.Main(outputPath)` through Unity CLI `run_script`. Inspect the inner success result as well as the CLI envelope. Record before/after scene, dirty, play/pause, and background state. The audit uses temporary ScriptableObjects, an isolated test service, and a preview scene; it must not save or edit a demo.

The three advanced code blocks are explicitly excerpts, with required fields and host cleanup explained on their pages. Their exact bodies compile in the excerpt harness. The independent behavioral audit checks the service contract with a controlled test backend; it is not an audio-quality, fade-envelope, or performance benchmark. The ordinary website build consumes committed evidence and needs no Unity installation.

## GitHub Pages configuration

The site address is [devisv505.github.io/Sound-Manager-Doc](https://devisv505.github.io/Sound-Manager-Doc/), configured as `site` plus `base` in `astro.config.mjs`.

In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. The branch-based Jekyll builder cannot compile Astro files and reports invalid YAML front matter when it encounters an Astro component.

[The Pages workflow](.github/workflows/pages.yml) runs on pushes to `main` and can also be started from the Actions tab. It installs the Node version in `.nvmrc`, runs `npm ci` and `npm run validate`, uploads only the generated `dist/` directory, and deploys that artifact to the `github-pages` environment. A failed validation prevents deployment. Actions are pinned to verified release commits, and deployment uses GitHub's built-in token; no personal token or Unity installation is required.

To publish an update, validate locally, commit, and push to `main`. Check **Actions → Deploy documentation to GitHub Pages** for the build/deployment result. Do not switch Pages back to **Deploy from a branch** or commit generated `dist/` output. Deployment was brought forward to publish the M1 slice; M1–M6 content and local review are complete; M7 verifies publication of the finished site.

For implementation guidance see [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/). Static search follows [Starlight's Pagefind integration](https://starlight.astro.build/guides/site-search/).

## Typography and media

Inter is self-hosted from `@fontsource-variable/inter` 5.3.0. Its SIL Open Font License is included at `public/fonts/Inter-OFL.txt`. The Inter family matches the font used by the demos. Unity screenshots and the DEV505 mark illustrate this project's own demo/brand assets. No source audio, API keys, or Unity cache directories are needed in the documentation build.

## M6 release review

Use Node 24 (see `.nvmrc`). A fresh documentation checkout needs no Unity installation to build:

```sh
npm ci
npm run validate
npx playwright install chromium
npm run test:browser
```

The additional M6 tests visit all 77 built pages at desktop and phone sizes with axe-core, check 320 px and tablet layouts, test search and nested refresh, and exercise keyboard previews, focus restoration, 200% text sizing, and reduced motion. Wide tables become keyboard-focusable when they overflow. Automated accessibility checks support the recorded visual/keyboard review; they are not a replacement for every assistive-technology test.

With the production preview running on port 4321, measure the home page, first-sound guide, and longest node reference:

```sh
npm run preview -- --port 4321
npm run audit:performance
npm run audit:payloads
```

This uses Playwright's installed Chromium and Lighthouse's default simulated mobile profile. Reports go to `validation/m6/`. The audit fails below a performance score of 90 or at an initial transfer of 1 MB or more. It measures the current local build; hosted network conditions can differ. Optional full-size screenshots are loaded when opened, and Pagefind loads its search data on demand. The complete static artifact also contains those optional assets, so its total size is larger than one page's initial download.

When the Unity source is available, verify the documented revision, all tracked sample inputs (including Git LFS content), and exact node colors:

```sh
npm run audit:source -- /path/to/Sound-Manager
```

This read-only audit does not open Unity or change scenes. If it reports a change, review the affected prose and example evidence; recapture any invalidated pictures before updating the baseline. For individual node images, adapt `validation/node-captures/CaptureNodes.cs.txt` to your output directory, capture the real editor nodes, and record/restore the editor session. Keep the temporary capture graph out of the asset repository. See [node capture evidence](validation/NODE-CAPTURES.md).

`npm run validate` checks all internal links and anchors, canonical URLs, responsive image and font paths, private repository links, known credential patterns, and unexpected published file types. Original recordings, Unity caches, models, and source code do not belong in `dist/`. See [the M6 report](validation/M6.md) for source freshness, reading review, known limits, and clean-install evidence. M7 remains the separate live publication and hosted-site verification step.
