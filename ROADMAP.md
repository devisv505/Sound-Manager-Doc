# DEV505 Sound Manager — documentation roadmap

Status: M1–M3 complete; M4–M7 remain open, with the Pages workflow brought forward to fix M1 publication. M3 is validated locally and has not been published by this milestone.

Prepared: 19 September 2026.  
Specification: [SPEC.md](SPEC.md).  
Target directory: `/Users/devisv/Projects/Web/Sound-Manager-Doc`.

## Delivery order

Build one complete slice first: the shared theme, setup path, a useful API page, and the Campfire walkthrough with real Unity images. Use it to establish the visual and content pattern before expanding to all ten demos. Complete API and graph coverage alongside the remaining walkthroughs, then validate the actual GitHub Pages build.

Checked items reflect completed work. M0–M3 are complete; the remaining milestones are open. Validation and capture evidence are recorded in each milestone's linked report.

## Writing requirement for every stage

Use clear, natural language that someone new to Unity can follow. Apply the [writing requirements in the specification](SPEC.md#writing-for-someone-new-to-unity--required-in-every-stage) to every page, API explanation, demo, caption, and code example.

Before marking any stage complete, review its content for these questions:

- Does it explain what the reader will do and why?
- Are unfamiliar Unity, audio, and Sound Manager terms explained when they appear?
- Does it say exactly what to open, select, create, attach, or assign?
- Does each code example explain its prerequisites, where it belongs, and its important lines?
- Does the reader know what they should see or hear and what to check if it does not work?
- Are advanced details introduced after the basic explanation, with accurate API names and behavior preserved?

This requirement also applies when revising completed work. M2 includes a reading review and revision of the existing M1 pages; that review is recorded separately from M1's original implementation checks.

## M0 — Source audit and planning

- [x] Confirm the separate documentation destination and GitHub Pages requirement.
- [x] Inventory the ten current scenes and their exact titles.
- [x] Inspect current API entry points, context/parameter usage, generated keys, sample behavior, and shared HUD styling.
- [x] Identify stale repository documentation and important behavior distinctions.
- [x] Choose a static documentation approach and verify its official hosting/search guidance.
- [x] Create `SPEC.md` and `ROADMAP.md` before website implementation.

Deliverables: these two documents. Baseline source revision: `746a1cc7d2602bc59df6096eac50508ded6ef49e`.

Exit condition: the intended website, content coverage, visual direction, capture requirements, and release checks are explicit.

## M1 — Foundation and one complete example

Depends on: M0.

- [x] Recheck the Unity source revision and any newer API or demo changes; record the content baseline.
- [x] Scaffold Astro/Starlight in this directory with static output, compatible pinned dependencies, a lockfile, and a declared Node version.
- [x] Configure a repository-relative site base and local build/preview/check commands.
- [x] Establish content metadata, API-coverage records, and screenshot-manifest formats.
- [x] Implement the cream/forest theme, typography, responsive navigation, code blocks, explanation panel, demo card, and accessible screenshot enlargement.
- [x] Inspect font licensing and establish local font/media attribution.
- [x] Create the home-page structure, main navigation, and demo gallery data with all ten entries.
- [x] Capture the first real Unity Game View states and graph sections for Campfire; verify HUD inclusion, image resolution, framing, and readability.
- [x] Write the setup/first-sound path, a complete `SoundBus` reference page, and the Campfire walkthrough with an explained code recipe.
- [x] Compile and exercise the first complete example against the documented Unity API.
- [x] Review the result at phone and desktop sizes and test built-site search and base-path image loading.

Completed: 19 September 2026. Evidence: [M1 validation report](validation/M1.md).

Deliverable: a local preview demonstrating the final visual and editorial pattern with real content and images.

Exit condition: a new reader can follow the first-sound example, the Campfire page explains the asset's behavior, and the site visibly matches the demo family without sacrificing code readability.

## M2 — Setup, core concepts, and consumer API

Depends on: M1; may proceed alongside M3.

- [x] Review and revise the M1 setup, API, recipe, and Campfire pages using the beginner writing requirements above.
- [x] Complete the public API inventory and classify supported consumer, advanced, and infrastructure types.
- [x] Finish setup, manager/library registration, graph creation, key generation, and first-play troubleshooting.
- [x] Write the event/play/voice model and the relationship between graph authoring and runtime commands.
- [x] Document context construction, initial typed parameters, override precedence, four-value inline limit, and larger override sets.
- [x] Document fixed versus followed positions, listener orientation, 2D/3D event settings, and owner/follow-target lifetime.
- [x] Document handles, stale identifiers, stop/fade/release, pause, source-wide operations, and cleanup.
- [x] Document signals, notifications, subscription lifecycle, result/status handling, concurrency, cooldown, and voice limits.
- [x] Complete the consumer API pages with exact signatures, overloads, defaults, examples, and links.
- [x] Record the source revision and validation state for every complete example.

Completed: 19 September 2026. Evidence: [M2 validation report](validation/M2.md). The site has 27 authored pages and four verified complete examples. The inventory accounts for 163 public types and 867 member declarations, with advanced and infrastructure scope explicitly identified.

Deliverable: a usable setup-to-integration documentation path and the main public API reference.

Exit condition: every supported everyday API member has accounted-for coverage and examples use the actual generated keys/current context conventions.

## M3 — Capture the ten demos in Unity

Depends on: M1 capture pilot. Capture alongside M4 so screenshots support the explanation being written.

- [x] Record the current Editor scene, dirty state, Play Mode, Game View settings, and capture baseline before each session.
- [x] Reproduce the required states through real scene/controller interactions.
- [x] Capture original 1920 × 1080 PNG Game Views, including the actual HUD, using the existing cameras and visual effects.
- [x] Capture graph overviews, readable subgraph crops, event settings, and the Footstep trim editor details.
- [x] Record state, control steps, relevant values, revision, date, dimensions, file paths, captions, and alt text in the manifest.
- [x] Generate responsive web images and verify graph legibility after optimization.
- [x] Restore temporary capture settings/session state and preserve the user's unsaved work.
- [x] Review the full image set for consistency, correct current models, meaningful states, and accidental editor overlays.

Completed: 19 September 2026. Evidence: [M3 validation report](validation/M3.md). The screenshot library contains 84 authentic Unity images: 34 Game Views with the real HUD, one retained home hero, 41 graph views, and eight Inspector views. All ten demos have a picture gallery with captions and reproduction steps.

Required state checklist:

| Demo | Game View captures | Graph/editor captures |
| --- | --- | --- |
| 01-Campfire | Unlit; lit; release if useful | Ignition, loop, and stop/release flow |
| 02-Footstep | Grass; stone; wood | Surface branches, variation groups, readable trim-range editor |
| 03-Bee | Rest; flight on different sides of the listener | Followed loop, parameter graph, spatial settings |
| 04-Engine | Idle; driving at higher throttle/RPM | Layer groups, parameter mapping, Horn/Shift response |
| 05-Weather | Clear; rain; actual lightning flash | Weather layers and spatial thunder/delay |
| 06-Workshop | Hammer; handsaw; drill; hammer tap during another tool | Tool selection, ordered sequence, signal/tap flow |
| 07-Arcade | Calm; busy chaos with readable results/counters | Per-event settings and variation/play flow |
| 08-Jukebox | Playing/dancing; crossfade; paused | Allowed track asset, gain shaping, volume |
| 09-Portals | Both destinations; crossing; Stop/Detach comparison | Owner-loss settings and event roles |
| 10-Launch | Ready; warning/manual condition; countdown; flight; abort or pause | Six event roles with readable condition/countdown/release crops |

Deliverable: authentic, optimized, documented screenshots for every demo. At least two meaningful Game View states and one readable graph capture per demo; follow the larger state list above where specified.

Exit condition: every required screenshot reference resolves to a current Unity capture, with a useful caption and a reproducible capture record. Historical attachments and placeholders do not satisfy this milestone.

## M4 — Detailed demo walkthroughs and practical recipes

Depends on: M1, the relevant M2 API contracts, and each demo's M3 captures.

- [ ] Write all ten demo pages using the common specification template and exact current titles.
- [ ] Add the “What this demo shows” panel below every demo title.
- [ ] Verify controls, event keys, parameter types/ranges/defaults, and signal names against the current graph/controller.
- [ ] Explain each interaction from input through C# calls and graph flow to the audible result.
- [ ] Add small focused examples and complete integration examples where lifecycle/setup is necessary.
- [ ] Explain the boundary between sample animation/gameplay code and Sound Manager functionality.
- [ ] Add captions, graph annotations in prose, common mistakes, API/recipe links, and previous/next navigation.
- [ ] Complete the recipe catalogue listed in `SPEC.md`, reusing checked code sources where possible.
- [ ] Compile complete snippets and run focused Unity behavior checks for follow, owner loss, overlap, crossfade, pause, and graph completion.

Demo completion tracker — Unity images are supplied by M3; full walkthrough review remains in M4:

| Demo | Detailed page | Unity images | Graph explanation | Code verified | Final review |
| --- | --- | --- | --- | --- | --- |
| 01-Campfire — A little warmth. | [ ] | [x] | [ ] | [ ] | [ ] |
| 02-Footstep — Every step counts. | [ ] | [x] | [ ] | [ ] | [ ] |
| 03-Bee — A little buzz. | [ ] | [x] | [ ] | [ ] | [ ] |
| 04-Engine — A little drive. | [ ] | [x] | [ ] | [ ] | [ ] |
| 05-Weather — A little rain. | [ ] | [x] | [ ] | [ ] | [ ] |
| 06-Workshop — A little work. | [ ] | [x] | [ ] | [ ] | [ ] |
| 07-Arcade — A little chaos. | [ ] | [x] | [ ] | [ ] | [ ] |
| 08-Jukebox — A little groove. | [ ] | [x] | [ ] | [ ] | [ ] |
| 09-Portals — A little elsewhere. | [ ] | [x] | [ ] | [ ] | [ ] |
| 10-Launch — A little liftoff. | [ ] | [x] | [ ] | [ ] | [ ] |

Deliverable: ten complete walkthroughs and a practical recipe library.

Exit condition: a reader can identify what each demo demonstrates, reproduce its interactions, understand its graph, and adapt its C# integration without confusing sample code with package APIs.

## M5 — Graph reference, advanced API, and troubleshooting

Depends on: M2; use M3/M4 captures and explanations.

- [ ] Inventory the implemented node catalogue and distinguish runtime-supported authoring from future roadmap items.
- [ ] Document ports, execution order, conditions, branches, loops, repeat/wait/delay behavior, termination, and lifecycle entry points.
- [ ] Explain Wave Asset trimming/preview and independent ranges from one source recording.
- [ ] Document event settings, groups/notes, diagnostics, and validation errors.
- [ ] Finish service registration/preparation/observation and custom backend/clock reference material.
- [ ] Document result and notification categories completely, including relevant failure and cancellation cases.
- [ ] Write troubleshooting for missing manager/registration, no audible output, wrong spatial direction, initial parameters arriving too late, stale handles, asset restrictions, voice/concurrency refusal, and owner cleanup.
- [ ] Explain runtime debug counters/inspection and their potential UI-related FPS overhead.
- [ ] Resolve API-coverage gaps and add cross-links from every node family/advanced topic to relevant examples where available.

Deliverable: complete authored-graph and advanced integration reference, with practical diagnostics.

Exit condition: all advertised shipped capabilities have a supported explanation; deferred capabilities are not presented as existing features.

## M6 — Quality review and GitHub Pages readiness

Depends on: M2–M5.

- [ ] Perform a clean dependency install, content/framework checks, and production build from the documentation repository alone.
- [ ] Validate all internal links, section anchors, image references, source links, and required metadata.
- [ ] Preview the production output under the real repository subpath; test nested-page refresh, 404 behavior, search, and all image/font URLs.
- [ ] Test search with exact API symbols and human terms, including trim, follow, crossfade, and owner.
- [ ] Review phone/tablet/desktop layouts, long signatures, tables, code copy controls, and image enlargement.
- [ ] Check keyboard navigation, focus restoration, text contrast, alt text, semantic headings, 200% text zoom, and reduced-motion behavior.
- [ ] Measure image payloads and mobile Lighthouse performance; address avoidable regressions against the specification targets.
- [ ] Check every demo page against the current source revision and recapture screenshots invalidated by source changes.
- [ ] Review the complete site as a reader new to Unity: explain terms, verify step-by-step setup and code placement, and make expected results and troubleshooting clear.
- [ ] Confirm examples' Unity compilation/behavior records and document genuine limitations.
- [x] Add the Pages build/deploy workflow with appropriate permissions and pinned action versions verified at implementation time. Brought forward on 19 September 2026 to fix the default Jekyll build for the M1 site.
- [ ] Write `README.md` with local commands, content conventions, source/API validation, screenshot recapture, and deployment instructions.
- [ ] Ensure no secrets, local filesystem links in published pages, Unity cache directories, or unnecessary source recordings are included.

Deliverable: a complete, reviewable website build and deployment configuration.

Exit condition: all acceptance criteria in `SPEC.md` pass in production preview. Preparing this workflow does not by itself create a remote repository or publish the site.

## M7 — Publish and verify the live site

Depends on: M6 and the actual GitHub repository/Pages configuration being established for deployment.

- [ ] Verify the documentation repository owner/name and public visibility required for the chosen free hosting arrangement.
- [ ] Set the final site origin/base path and configure Pages to use GitHub Actions.
- [ ] Publish the validated revision through the configured workflow.
- [ ] Verify the live home page, direct demo/API routes, search, code copy, images, and mobile navigation.
- [ ] Record the live URL, documentation revision, documented Unity source revision, and release validation summary.

Deliverable: the live documentation URL and reproducible release process.

Exit condition: the published site works at its real GitHub Pages address without paid services or a runtime backend.

## Dependencies and known risks

| Issue | Planned response |
| --- | --- |
| Asset API changes during documentation work | Record revisions, reread changed source before release, and revalidate affected snippets/pages. |
| Historical README differs from current behavior | Use the source precedence in the specification; treat historical plans as context only. |
| Exact generated keys differ in a user's project | Explain generation/registration and mark demo-specific identifiers clearly. |
| Scene enum values differ from graph parameter values | Show the explicit Footstep mapping and validate typed values in examples. |
| Visually attractive screenshots explain little | Capture contrasting states and pair every image with the feature it demonstrates. |
| Small graph text becomes unreadable online | Use focused crops, high-resolution enlargement, and prose/code alongside images. |
| Transient states are difficult to capture | Use repeatable interactions and record capture timing/values; do not fabricate UI states. |
| Editor commands stall during background Play Mode | Bring the existing Editor forward; avoid duplicate requests or destructive scene resets. |
| Demo timing is mistaken for DSP guarantees | Document actual graph timing and controller responsibilities explicitly. |
| Root-relative URLs break project Pages hosting | Validate the built site at the repository subpath before release and again live. |
| Default docs styling loses the existing identity | Establish and review the themed Campfire slice before expanding the site. |

## Ongoing maintenance after version one

For an API change, update the coverage manifest and source revision, revise affected reference/recipe/demo pages, compile the examples, and rerun focused behavior checks. For a visual or interaction change, recapture the affected scene states and update image metadata. Keep website CI independent of local Unity paths; record Unity verification separately.

Future enhancements can include versioned documentation, localized content, optional audio previews, or playable web demos. Keep them separate from the first release so they do not delay accurate API documentation and the ten existing walkthroughs.

## Definition of done

The work is complete when all ten demos have detailed, accurate pages with actual Unity screenshots; the supported API and implemented graph features are documented; usage examples are verified; the shared visual style is recognizable; the static build and contributor workflow are reproducible; and the live GitHub Pages site passes the publication checks.

M0 produced the specification and roadmap. M1 delivered the first working documentation slice with actual Unity captures and a verified example. The user subsequently established the public documentation repository and enabled Pages; its initial Jekyll build failed because the site uses Astro. The Pages workflow and deployment instructions were brought forward to support M1 publication. M2 adds the complete setup-to-integration path and everyday API reference, with source-derived signatures and checked Unity examples. M3 adds all ten screenshot galleries with actual Unity captures, readable graph details, event settings, and reproducible image records. M4–M7 remain open for the complete documentation release.
