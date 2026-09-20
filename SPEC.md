# DEV505 Sound Manager — documentation website specification

Status: specification baseline; M1–M5 implemented on 19–20 September 2026. See the roadmap and [M5 validation report](validation/M5.md) for current progress.

Prepared: 19 September 2026.  
Companion: [Implementation roadmap](ROADMAP.md).

## 1. Purpose and deliverables

Build a public documentation website that helps a Unity developer install Sound Manager, play their first sound, author sound graphs, and use the complete supported API. Show what the asset can do through detailed explanations of all ten existing demo scenes, practical C# examples, and screenshots captured in Unity.

The website should feel like an extension of the demos: warm cream surfaces, forest green typography, soft rounded panels, generous space, the DEV505 character, and the existing voxel islands. Reading code and finding answers remain the primary jobs of the documentation.

Project directory: `/Users/devisv/Projects/Web/Sound-Manager-Doc`.

Version-one deliverables:

- Branded home page, getting-started guide, conceptual guides, searchable API reference, graph reference, code recipes, troubleshooting, and a gallery linking to ten complete demo pages.
- Current C# examples using generated `Sounds.*` keys and `SoundParameters.*` identifiers wherever available.
- Actual Unity Game View screenshots for every demo, plus readable Unity graph-editor captures explaining the important graph sections.
- A standalone static build, local preview commands, and a GitHub Pages deployment workflow.
- A contributor guide explaining how to update content, validate examples, recapture screenshots, and release a new documentation revision.

The initial planning step created `SPEC.md` and `ROADMAP.md`. M1 implements the foundation and Campfire slice. M2 adds the beginner setup path, core concepts, and consumer API. M3 supplies all ten screenshot galleries with verified Unity captures. M4 adds all ten detailed walkthroughs and twelve practical recipe topics. M5 adds all 49 node references, advanced integration APIs, and troubleshooting. M6 adds node category colors and completes the local quality, accessibility, performance, and Pages-readiness review. M7 tracks publication and live verification.

## 2. Source of truth and versioning

Unity source project: `/Users/devisv/projects/unity/Sound-Manager`.  
Source repository: `https://github.com/devisv505/Sound-Manager`.  
Baseline examined: `746a1cc7d2602bc59df6096eac50508ded6ef49e`.  
Current project Editor: Unity `6000.6.0f1`.

Recheck the source revision before implementation and again before release. The Unity project is being actively developed; this baseline records the audit, rather than freezing the asset API forever. Display the documented asset revision and tested Unity version on the website. Do not invent a package release number if one is not established.

Resolve conflicting information in this order:

1. Current runtime/editor implementation and reproducible behavior of the current demos.
2. Generated identifiers, relevant tests, and XML documentation checked against that implementation.
3. Current sample README files and graph annotations.
4. Older repository documentation and development plans.

The package README contains historical statements, including removed demo scenes, the older `SoundEventSO` naming, and planned features that may now be implemented. Do not copy it wholesale. The current runtime asset type is `SoundEvent`, ten demo scenes exist, and their primary usage pattern is generated keys through `SoundBus`. Audit trim/processing support against the current editor and runtime before documenting its limits.

Source map, relative to the Unity project:

| Area | Authoritative source |
| --- | --- |
| Runtime API | `Assets/DEV505/SoundManager/Scripts/Runtime/` |
| Graph authoring, import, and editor tools | `Assets/DEV505/SoundManager/Scripts/Editor/` |
| Public graph semantics | Runtime graph catalogue/execution code and editor node definitions |
| Generated event keys and parameter IDs | `Assets/DEV505/SoundManager.Generated/Sounds.cs` and `SoundParameters.cs` |
| Demo behavior and HUD | `Assets/DEV505/SoundManager/Scripts/Samples/` |
| Demo scenes and graphs | `Assets/DEV505/SoundManager/Samples/01-Campfire/` through `10-Launch/` |
| Shared visual tokens | `Scripts/Samples/Shared/SoundLabHUD.uss`, under the package root |
| Supporting behavior checks | `Assets/DEV505/SoundManager/Scripts/Tests/` |
| Editable art provenance | `ArtSource/` |

Published pages must use site-relative links or verified repository URLs, never local filesystem links. Content builds must not require a checkout of the Unity project.

## 3. Audience and reading paths

**New user:** home → setup → first sound → play at a position → Campfire and Footstep.

**Gameplay programmer:** API overview → contexts and parameters → handles/ownership → live control → relevant recipe and demo.

**Sound designer:** graph authoring → Wave Asset trimming and preview → branching/randomization → signal and sequence behavior → demo graph walkthroughs.

**Advanced integrator:** service lifecycle → notifications → concurrency and voice limits → custom service/backend/clock contracts → troubleshooting.

No account or login is required to read, search, copy examples, or view screenshots. English is the initial documentation language, matching the existing HUD titles.

### Writing for someone new to Unity — required in every stage

Write in clear, natural English for a reader who may be new to both Unity and Sound Manager. This applies to every milestone and every reader-facing part of the site: setup steps, API explanations, demo walkthroughs, code comments, captions, navigation labels, and troubleshooting. Review existing M1 pages against this requirement as the documentation expands.

- Start with what the reader wants to do and what they will see or hear. Explain one idea at a time with short sentences and familiar words.
- Explain Unity and audio terms when they first appear on a page. For example, describe a GameObject as an object in the scene and the Inspector as the panel where its settings appear. Link to a fuller explanation when useful; a glossary must not be required just to follow a step.
- Use the same plain explanation for Sound Manager concepts throughout the site. Introduce a parameter as a value the sound graph can read, such as the surface under a foot. Explain a handle as a value saved after starting a sound so the code can control that particular play.
- Give concrete, numbered setup steps. Name the window or menu to open, the object or asset to select, the setting to change, and any field where a reference must be assigned. Avoid instructions such as “configure the context” without showing how.
- Before each code example, explain what must already exist. For complete scripts, state the filename, where to put the script, which object to attach it to, which Inspector fields to fill in, and how to try it. Explain the important lines after the example. Clearly label short excerpts that cannot run on their own.
- End each practical sequence with the expected result and a simple check if it does not work. For demos, connect the control the reader uses to the sound they hear and the setting or code that caused it.
- Keep exact API names, signatures, units, defaults, and behavior accurate. Put detailed reference information after the plain explanation, and identify advanced sections with links to their prerequisites.
- Use helpful, conversational wording. Avoid unexplained acronyms, dense strings of technical terms, and phrases such as “obviously”, “simply”, or “just” that dismiss a beginner's difficulty.

For example, introduce `.Following(bee)` with: “The buzzing sound moves with the bee. Pass the bee's Transform—the component that stores its position—to tell Sound Manager which object to follow.” Then explain the exact API behavior and any required setup.

Every stage's content review must answer: Can someone new to Unity tell where to start, what to click or change, where the code belongs, what should happen, and what to check if it does not? Revise unclear passages before marking that stage complete.

## 4. Static architecture and hosting

Use **Astro with Starlight**, Markdown/MDX content, local image assets, and custom theme/components. Use its static output and built-in Pagefind search. There is no application server, database, paid search service, or runtime connection to Unity. Pagefind indexing is checked against a production build, since the development server is not the final search environment. See the [Starlight search documentation](https://starlight.astro.build/guides/site-search/).

Use Starlight's custom CSS and component extension points for the visual identity, home page, demo cards, explanation panels, and screenshot galleries. Retain accessible navigation and documentation behavior where possible. See [Starlight styling](https://starlight.astro.build/guides/css-and-tailwind/).

Select compatible stable framework versions and a supported Node LTS version when implementation starts; commit the lockfile and Node version declaration. Do not depend on an unpinned `latest` installation in CI.

GitHub Pages is the hosting target. A public documentation repository supports free Pages hosting; private-repository eligibility depends on the account plan. Keep this documentation project independent of the Unity source repository. See [GitHub Pages limits and availability](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Repository name: `Sound-Manager-Doc`. The configured URL is `https://devisv505.github.io/Sound-Manager-Doc/`. The M1 site was published through GitHub Actions after replacing the default Jekyll build. M6 is validated locally; publishing later changes remains a separate release step.

Configure Astro `site` for the actual Pages origin and `base` for the repository subpath. Internal links, images, search assets, canonical URLs, and the sitemap must all work under that subpath. Direct navigation and refresh on nested pages must work without SPA rewrite rules. Follow the [official Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

Provide a GitHub Actions build-and-deploy workflow using Pages artifacts, the `github-pages` environment, and scoped `contents: read`, `pages: write`, and `id-token: write` permissions. PRs run validation; deployment follows the configured release branch after hosting is set up. No personal access token is needed in browser code. See [GitHub's custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Planned project layout:

```text
Sound-Manager-Doc/
  SPEC.md
  ROADMAP.md
  README.md                       # contributor/build instructions, created later
  astro.config.mjs
  package.json
  package-lock.json
  src/content/docs/
    index.mdx
    getting-started/
    guides/
    api/
    graph/
    recipes/
    demos/
    troubleshooting/
  src/components/                 # explanation panel, demo card, screenshot gallery
  src/styles/                     # shared web theme
  src/assets/demos/<demo-slug>/    # optimized publication images
  media-source/unity/<demo-slug>/  # original captures; excluded from published output
  content-data/                   # API coverage and screenshot/source manifests
  examples/                       # checked C# snippets and validation harness metadata
  scripts/                        # content/link/media validation
  public/                         # favicon and appropriate static files
  .github/workflows/
```

The final website build must succeed from this repository alone. Unity is needed to verify C# behavior and create screenshots, not to serve or build the published documentation.

## 5. Information architecture

All routes below are relative to the configured site base.

| Section | Route | Required content |
| --- | --- | --- |
| Home | `/` | What the asset does, short code example, getting-started link, capability overview, ten-demo gallery |
| Getting started | `/getting-started/` | Supported setup, installation, manager/library registration, first graph, generated keys, first successful play |
| Guides | `/guides/` | Events vs plays vs voices; contexts; typed parameters; 2D/3D sound; ownership; timing; pause; concurrency; diagnostics |
| API | `/api/` | Categorized public API, exact signatures and overloads, defaults, results, lifecycle, examples |
| Graph reference | `/graph/` | Authoring workflow, event settings, node families, ports, trimming, groups, notes, runtime inspection |
| Recipes | `/recipes/` | Small practical integrations with complete prerequisites and links to relevant demos/API |
| Demos | `/demos/` | Capability filter/gallery and ten numbered walkthroughs |
| Troubleshooting | `/troubleshooting/` | Symptoms, checks, explanations, and remedies grounded in actual behavior |

Use a desktop sidebar, compact mobile navigation, page table of contents, breadcrumbs where helpful, previous/next links, and prominent search. A user should reach any demo from the home page and any primary API type from the API index without searching through unrelated articles.

Each page has a descriptive title, summary, content kind, source references/revision, and relevant feature tags. Source paths and revision hashes are internal verification metadata. The Unity Sound-Manager repository is private: do not expose GitHub source links or an “Explore the source” section in the public site. Demo pages also carry their number, exact scene title, scene path, event keys, and screenshot references. Define and validate this metadata during implementation.

## 6. API documentation contract

Create an explicit public API inventory before writing the reference. Categorize every public type as everyday integration, advanced integration, or implementation/editor infrastructure. Fully document the supported consumer surface; keep internal serialization and compiled graph bookkeeping out of the beginner navigation. Any exclusion must be deliberate and recorded in the coverage manifest.

| Reference family | Initial inventory and scope |
| --- | --- |
| Entry points | `SoundBus`, `SoundServices`, `ISoundService`, relevant `SoundService` methods |
| Identity and dispatch | `SoundKey`, generated `Sounds`, `SoundRequest`, request kinds and dispatch results |
| One play | `SoundPlayContext`, `SoundPlayResult`, `SoundPlayStatus`, `SoundHandle`, handle convenience extensions |
| Parameters and signals | `SoundParameterId`, generated `SoundParameters`, `SoundValue`, float/typed overrides, `SoundParameterState`, `SoundSignalId` |
| Ownership | `SoundOwnerToken`, owner acquisition/release, owner-wide controls, follow-target loss and owner-loss settings |
| Notifications | `SoundNotifications`, notification payloads/kinds, subscription and unsubscription lifecycle |
| Unity setup | `SoundManager`, `SoundEmitter`, `SoundListener`, listener selection and position/follow configuration |
| Authored assets | `SoundEvent`, `SoundLibrary`, `SoundEventSettings`, `SoundManagerSettings` and user-facing enum choices |
| Advanced service usage | Registration/resolution, preparation/readiness, observation, `SoundServiceOptions`, service lifecycle |
| Extension contracts | `ISoundVoiceBackend`, `ISoundClock`, relevant voice handles/requests/states; clearly identified as advanced |

Every documented member needs: exact signature and overloads; concise purpose; parameter types/defaults/units; return value or rejection behavior; relevant exceptions; valid lifecycle/thread usage; one useful example; related settings, guides, and demos. Avoid pages that merely restate a method name.

Preserve these verified distinctions:

- `SoundBus` routes synchronous commands to the active service. It does not buffer plays until a manager appears; missing service is a `NoManager` result.
- Generated `Sounds.*` and `SoundParameters.*` are project output, not a fixed universal catalogue. Explain registration and regeneration.
- `.With(...)` returns a copy of `SoundPlayContext`. Initial overrides apply before `OnStart`; setting a parameter after playback starts is too late for an initial branch decision.
- The inline context accepts up to four overrides. Explain the typed-array alternative and verified service overloads for larger sets. Initial precedence is float overrides, then typed overrides, then inline overrides.
- `.At(position)` captures a location. `.Following(transform, owner)` follows a target while the play runs. Explain listener orientation, event spatial settings, and what happens when the target is destroyed.
- `SoundBus.Play(key, transform)` follows and automatically uses the transform's GameObject as owner. Constructing a `Following` context does not itself assign that automatic owner. Position following and lifetime ownership must be explained separately.
- `SoundHandle.IsValid` is not proof the play is still alive. Use the current service/handle liveness query; stale session/generation identifiers must not control another play.
- `SoundPlayContext.Delay` describes the delay of voices started by that play, excluding `OnStop` release voices. Explain it separately from graph `Delay` flow and DSP scheduling.
- Nonzero `Seed` selects a repeatable isolated random stream. Do not turn this into a claim that all visual or audio playback timing is deterministic.
- Stop/fade/release behavior, per-handle pause, service pause, owner loss, concurrency, and notifications require distinct explanations.

Examples should prefer `SoundBus.Play(Sounds.Footstep, context)` and generated parameter identifiers. Document direct `SoundEvent` overloads as supported alternatives where useful. Do not require users to introduce serialized event references for the main tutorial path.

Code quality requirements:

- State prerequisite graph keys, parameters, manager registration, and expected scene references.
- Include namespaces and enough surrounding lifecycle code to make a complete example usable. Mark abbreviated excerpts explicitly.
- Check play acceptance where recovery matters; keep handles for loops; unsubscribe and clean up owned/retained plays at the appropriate lifecycle boundary.
- Do not hide setup in undefined helper methods or imply sample-only controllers are package APIs.
- Compile complete examples against the documented Unity revision in a temporary validation harness. Verify stateful examples in Unity. Track source location, revision, and validation result; website syntax highlighting alone does not validate C#.

## 7. Guides, recipes, and graph reference

Required recipes, each linked to actual sample behavior:

1. Start, stop, and release a loop — Campfire.
2. Play a trimmed variation for a surface — Footstep.
3. Follow a moving 3D emitter — Bee.
4. Change pitch/layers with smoothed live parameters — Engine and Weather.
5. Send a signal to a running event — Engine and Workshop.
6. Schedule a spatial response and cancel it when its owner stops — Weather.
7. Combine integer tool selection, sequences, and overlapping one-shots — Workshop.
8. Handle concurrency refusal, replacement, cooldown, and finite voice budgets — Arcade.
9. Supply an allowed audio asset parameter and crossfade two plays — Jukebox.
10. Pause and resume all plays involved in an interaction — Jukebox and Launch.
11. Compare owner-loss Stop and Detach behavior — Portals.
12. Gate an action on conditions and react to completion notifications — Launch.

Graph reference must cover the authoring workflow, inputs/outputs and execution order, compile/validation feedback, event settings, and the implemented node catalogue. Organize nodes into entry/lifecycle, playback/assets, parameters, selection/randomization, math/conversion, conditions/branching, timing/loops/sequences, and termination.

Explain Wave Asset trim controls with real editor screenshots: selected recording, Start/Length, range selection/preview, and multiple independently trimmed steps from one recording. Explain the difference between a synchronous `Sequence` and elapsed-time flow through delay/repeat/wait nodes. Use existing graph groups and descriptions as part of the walkthroughs.

Explain runtime debug counters and graph inspection, including the existing warning that UI interaction during playback can reduce FPS. Document this as diagnostic functionality, without claiming a universal measured performance cost. Do not publish roadmap features as implemented DSP/audio-processing capabilities.

## 8. Demo page requirements

Each page uses the same structure:

1. Number, exact scene title, a brief introduction, and an active-state Unity screenshot.
2. A panel directly below the title: **What this demo shows**. Explain the Sound Manager capabilities in plain language.
3. Scene setup and controls, including prerequisites and what the listener represents.
4. A short interaction walkthrough: what to do, what should be heard, and why it changes.
5. Event/key inventory, graph walkthrough, parameter and signal tables with verified types/ranges/defaults.
6. C# integration in small explained steps: start, update/control, stop/cleanup as applicable.
7. Additional state screenshots, readable graph captures, and captions connecting visuals to behavior.
8. A clear account of what the sound graph controls and what the demo's C# animation/gameplay code controls.
9. Common mistakes and current limitations, source references, related API/recipe links, and previous/next demo.

The ten pages use these stable slugs and content scopes. All scenes live at `Assets/DEV505/SoundManager/Samples/<NN-Name>/Demo.unity`.

### 01-Campfire — “A little warmth.”

Route: `/demos/01-campfire/`. Event: `Sounds.Campfire`.

Explain ignition, continuous crackle, stopping, and the `OnStop` extinguish/release tail. Show the minimal key-based play/stop interaction and how its handle/lifetime relates to the fire. Document `Intensity` from the current graph without inventing a HUD control. Walk through the actual F/button interaction.

Capture the unlit and lit states, plus the release state if it communicates the transition clearly. Use the current rebuilt model with straight logs at fixed angles and voxel particles; flame geometry is not part of the static model. Include the start/loop/stop graph sections. Author this page from code and graph behavior; a sample README is currently absent.

### 02-Footstep — “Every step counts.”

Route: `/demos/02-footstep/`. Event: `Sounds.Footstep`.

Explain one short play per grounded footfall, fixed contact position, integer surface selection, trimmed variations, and random selection without immediate repetition. The graph uses Grass `0`, Stone `1`, Wood `2`; the scene enum reserves `0` for Unknown and uses `1`, `2`, `3`. Show the mapping explicitly rather than casting the enum directly.

Capture grass, stone, and wood interactions. Include the grouped branches and a readable Wave Asset trim-range close-up. The code example must pass `Surface` in the initial context before the graph starts.

### 03-Bee — “A little buzz.”

Route: `/demos/03-bee/`. Event: `Sounds.Bee`.

Explain the moving mono 3D loop, `Following(bee)`, listener position/orientation, attenuation, and `WingSpeed`. Clarify that the demo moves the bee and the sound follows its transform; the sound graph does not implement the flight path. Explain Space/Release/Recall and the reason headphones help hear direction.

Capture the resting bee and flight on different sides of the listener. Include spatial event settings and the relevant playback/parameter graph.

### 04-Engine — “A little drive.”

Route: `/demos/04-engine/`. Event: `Sounds.Engine`.

Explain layered engine loops, live `Rpm` and `Load`, smoothing, pitch/gain mapping, and the `Horn` and `Shift` signals on the running event. Connect the initial context, retained handle, subsequent parameter updates, signals, and shutdown. Explain the actual driving controls from the current HUD/controller.

Capture idle and driving with visibly different throttle/RPM states. Include the authored graph groups for layers, parameter shaping, and signal responses. Distinguish vehicle movement and gear simulation from sound playback.

### 05-Weather — “A little rain.”

Route: `/demos/05-weather/`. Events: `Sounds.Weather`, `Sounds.Thunder`.

Explain smoothed `Rain`/`Wind` ambience layers, a lightning flash, delayed thunder at the strike location, and stopping pending thunder when the weather owner stops. Show the two event roles, context/parameter setup, spatial placement, and cancellation/cleanup.

Capture clear weather, rain, and a real lightning-flash frame. Include both graphs and an explanation of the delay. Identify the flash and rain visuals as demo effects rather than sound-engine rendering features.

### 06-Workshop — “A little work.”

Route: `/demos/06-workshop/`. Event: `Sounds.Workshop`.

Explain `Tool` selection, `Pace`, Work/Pause/strike signaling, and graph execution order. A `Sequence` orders actions such as stopping the old tool and starting the selected one; it is not inherently a timed playlist. Explain how manual hammer taps can overlap handsaw or drill activity and how the demo maintains the relevant plays.

Capture each tool and a manual hammer tap while another tool is active. Include the important sequence/branch groups. Document the actual 1–3, Space, and T controls and distinguish automatic work rhythm from a manual tap.

### 07-Arcade — “A little chaos.”

Route: `/demos/07-arcade/`. Events: `Sounds.ArcadeZap`, `Sounds.ArcadeCoin`, `Sounds.ArcadeJackpot`.

Explain play acceptance/rejection, per-event concurrency, replacement, cooldown, no-repeat variation, and a finite voice budget. The current demo uses six voices: Zap permits three with ReplaceOldest, Coin two with RejectNew, and Jackpot one with RejectNew plus cooldown. Explain actual status/notification handling. Do not describe this as cross-event priority voice stealing; the current allocation leaves capacity for the jackpot.

Capture a calm state and busy automatic chaos with readable counters/results, plus useful graph/settings crops. Explain that score/reset and automatic trigger scheduling are demo logic, and counters are diagnostics rather than a benchmark.

### 08-Jukebox — “A little groove.”

Route: `/demos/08-jukebox/`. Event: `Sounds.Jukebox`.

Explain the `Track` asset parameter and allowed clips, two overlapping stereo plays, smoothed `Gain`, equal-power shaping, shared `Volume`, and pause/resume of both plays. The current controller creates a roughly 2.5-second crossfade and retains the last requested selection while transitioning; that selection queue belongs to the demo controller.

Capture normal playback, a two-play transition, and pause. Explain DEV505's dance using authored BPM metadata. State the current boundaries: transitions are not beat matched, the dance is not live spectrum analysis, and the UI progress estimate is not an exact DSP playhead. Include the gain/asset graph sections and outgoing-handle cleanup.

### 09-Portals — “A little elsewhere.”

Route: `/demos/09-portals/`. Events: `Sounds.PortalWorld`, `Sounds.PortalHum`, `Sounds.PortalEcho`, `Sounds.PortalCut`, `Sounds.PortalArrival`.

Explain owner tokens, moving/listener-relative sound, Stop versus Detach on owner loss, and keeping detached sounds at their last position. Trace the outgoing rig being destroyed, ambience/hum stopping, an echo continuing, and destination arrival. Explain the actual crossing, echo, close, and wake controls.

Capture both destinations, the crossing, and a clear Stop/Detach comparison. Include the relevant event settings and graph sections. This sample demonstrates destruction of audio-rig GameObjects within one visible scene; do not claim it loads/unloads Unity scenes. Show cleanup of detached handles when the demo itself is disabled.

### 10-Launch — “A little liftoff.”

Route: `/demos/10-launch/`. Events: `Sounds.LaunchPad`, `Sounds.LaunchSequence`, `Sounds.LaunchFlight`, `Sounds.LaunchVent`, `Sounds.LaunchClamp`, `Sounds.LaunchUI`.

Explain the combined system: layered pad machinery, `Power`/`Pressure`, clamps, condition gating, repeating warning/countdown flow, signals, abort/release, notifications, moving rocket audio, separate pad/rocket ownership, and pause behavior. Trace the completion notification that starts flight. Separate graph timing from visual countdown presentation.

Capture ready state, a manual condition/warning, countdown, flight, and abort or pause. Include a graph overview and legible crops for the six event roles instead of shrinking every graph into one image. Use the current flare treatment without the removed star element. Document the existing auto/manual and safety controls from the current controller, not guessed shortcuts.

## 9. Unity screenshot production

All demo screenshots must originate in the running Unity project. Blender renders, generated illustrations, and historical chat attachments do not substitute for the requested Unity screenshots.

Capture requirements:

- Use the current scene cameras, isometric composition, lighting, post-processing, models, and HUD. Standard Game View target: **1920 × 1080**, with a consistent aspect ratio and readable UI.
- Produce at least two meaningful Game View states per demo; the per-demo requirements above raise this count for more complex scenes. Include at least one readable graph capture per demo, with additional crops for multi-event graphs and trim/settings details.
- Capture the composed Game View so the actual HUD is included. A separate clean hero image is optional; a camera-only render must not accidentally omit UI from explanatory screenshots.
- Capture graph/settings views inside Unity with useful zoom and clean framing. Do not leave selection overlays obscuring nodes, tooltips covering labels, or tiny unreadable graph overviews as the only explanation.
- Trigger the real demo controls and wait for the expected state. Record seeds/parameters where relevant. Capture actual transient states such as lightning and countdown; do not manufacture HUD values or imply unimplemented behavior.
- Keep original PNG captures outside the published output. Generate responsive WebP derivatives at appropriate widths, preserving readable graph text. Use lossless/high-resolution graph imagery where necessary.
- Give every image a descriptive filename, alt text, and a caption explaining what the reader should notice. Offer accessible enlargement for graphs and detailed screenshots.

Create a capture manifest containing scene path, demo slug, source revision, capture date, Unity version, resolution, state name, relevant control steps/parameter values, original and published filenames, and caption/alt text. Store the manifest in the documentation repository.

Protect the user's working session: inspect the current scene, dirty state, and Play Mode before switching; preserve unsaved edits; record and restore temporary capture settings and the original scene/state where feasible. Do not change project-wide settings solely to make a screenshot. Bring the running Editor to the foreground if background Play Mode prevents capture commands from progressing.

M1 captured and reviewed the Campfire pilot set. M3 completed the remaining nine demos; M4 and M5 reuse the 84 verified captures against the unchanged Unity source revision.

## 10. Visual system and interaction

Use the shared demo HUD as the visual reference. The following values come from its current stylesheet except where marked as a web adaptation.

| Token | Value | Intended use |
| --- | --- | --- |
| Ink | `#29332E` | Main text and headings |
| Forest | `#2B4135` | Primary buttons and strong surfaces |
| Forest hover | `#3E5A44` | Hover feedback |
| Forest active | `#1F3026` | Pressed/strong contrast state |
| Cream | `#F8F2E0` | Cards and reading panels |
| Warm yellow | `#FFE8A9` | Text/accent on dark green |
| Eyebrow green | `#5A6955` | Section identifiers |
| Secondary text | `#5E6857` | Subtitles where contrast permits |
| Page backdrop | Approximately `#D8D3BB` | Web adaptation; confirm against captured scenes |
| Terracotta / mint | Sample from current demo art | Small feature badges and accents |

Use a bold friendly sans serif for headings, an easily readable sans serif for prose, and a monospace face for code. Inspect the existing font and its redistribution license before reusing it; otherwise choose a licensed, self-hosted visual match. Keep long explanations and code crisp rather than applying pixel styling to text.

Use rounded cards around 10–12 px, clear spacing, restrained borders, and minimal shadows. Carry the DEV505/SOUND LAB eyebrow, numbered demos, and explanatory cards into the site. Create a custom home/demo layout instead of leaving the default documentation theme unchanged.

Code blocks should provide C# highlighting, language labels, accessible copy buttons, and horizontal scrolling for long lines. Use dark forest code surfaces if the syntax palette remains readable. Screenshot galleries need keyboard-accessible enlargement, Escape to close, sensible focus restoration, and captions.

Keep motion limited to subtle feedback and the requested homepage demo carousel. Its ten slides rotate every five seconds, with previous/next and Play/Pause controls; hover, keyboard focus, hidden tabs, and off-screen placement pause rotation. Reduced-motion visitors start paused and use immediate transitions. Respect reduced-motion preferences elsewhere. No autoplay audio or decorative effects that compete with documentation. A dark theme, embedded audio players, and interactive browser demos are optional future work rather than release requirements.

## 11. Quality, accessibility, and publication

Responsive checks: narrow phone, tablet, standard laptop, and wide desktop. At 320 CSS px, prose and navigation must not cause page-wide horizontal scrolling; code and large tables may scroll within their containers. Support keyboard navigation, visible focus, semantic headings, a skip link, accessible image descriptions, and 200% text zoom.

Target WCAG AA text contrast. Adjust inherited muted HUD colors where necessary for small web text. Do not use color alone to identify parameter types, failures, or active navigation. Use comfortable touch targets, targeting 44 × 44 CSS px for primary mobile controls.

Performance targets: optimized route images, lazy loading below the fold, self-hosted fonts, no external trackers, and no Unity builds or source recordings in the site bundle. Aim for a cold initial documentation page below 1 MB transferred, excluding optional enlarged images/search data, and a mobile Lighthouse performance score of at least 90. Treat measurements as build-specific targets, not guarantees about every device.

Validation must cover:

- A beginner reading review using the writing requirements in section 3: explained terms, explicit prerequisites, actionable steps, code placement, expected results, and helpful troubleshooting.
- Clean `npm ci`, framework/content checks, and static build from a fresh documentation checkout.
- Internal routes, API anchors, captions, source references, and image paths; no production link to a local filesystem path.
- The actual `/Sound-Manager-Doc/` base path, including search, direct nested-page refresh, canonical URLs, and 404 handling.
- Production-preview search for API names and ordinary terms such as “trim”, “follow”, “crossfade”, and “owner”.
- C# example compilation plus focused Unity behavior checks for stateful examples.
- All ten scene walkthroughs, current screenshots, and visual/accessibility review at the target screen sizes.

Do not copy API keys, environment files, unrelated project assets, Unity `Library`/`Temp` directories, or source music into the public documentation repository. Screenshots and prose are sufficient for the initial release. Include appropriate font/media attributions where applicable.

## 12. Acceptance criteria and scope boundary

Version one is ready when a developer can follow setup to a working key-based play; look up the supported consumer API with exact behavior; understand and reproduce each demo's audio feature; and use the website entirely through a free static GitHub Pages deployment.

Completion requires all ten detailed pages, current Unity screenshots and graph captures, verified code examples, API coverage accounting, useful static search, responsive branded styling, a reproducible build, base-path validation, and contributor instructions. No empty reference pages, placeholder screenshots, or unsupported feature claims should remain.

Out of scope for this release: changing Sound Manager itself, rebuilding its demo models, adding new demo scenes, WebGL ports, a browser graph editor, cloud accounts/backends, paid hosting, automatic API-doc publishing from an unreviewed source update, and translating the whole site. These can be separate follow-up projects.

Implementation can proceed using the choices in this specification. The documentation repository and GitHub Actions Pages configuration were established for M1 publication. Verify them again when publishing later revisions; local milestone completion alone does not publish the site.
