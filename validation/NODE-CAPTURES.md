# Homepage graph and 49 node screenshots

Completed locally on 20 September 2026, following M5. No deployment was performed.

## Website changes

The homepage's “From a spark to a sound” section now pairs the existing, genuine Campfire graph capture with the matching C# play/stop excerpt. Desktop uses two columns; phones stack the graph above the code. The graph supports the existing accessible enlargement dialog.

Every one of the 49 node descriptions now includes its own Unity screenshot alongside its port table on wide screens, stacked on small screens. Each screenshot enlarges independently. The Enlarge label sits below node images, so it cannot hide a connector, label, or control. Images retain their aspect ratios and are served as responsive WebP versions, with high quality for small editor text. Native PNGs remain in the repository and are omitted from the published build.

The site now uses 133 authentic Unity images: the previous 84 demo captures plus 49 node captures. No synthetic node artwork was used.

## Capture method and provenance

- Source revision: `746a1cc7d2602bc59df6096eac50508ded6ef49e`; Unity 6000.6.0f1.
- `node-captures/CaptureNodes.cs.txt` uses Unity CLI `run_script` outside Assets to create a temporary `.soundgraph`, instantiate each of the 49 real authoring node types, and open the normal Graph Toolkit editor window.
- Captures use the editor host's own `GrabPixels` GUI surface at 1.25 graph zoom and 2 pixels per point. Each image is cropped to the node's rendered bounds, accounting for the editor root's offset. The visible node itself is not redrawn or composited.
- Most nodes show their default controls. Wave Asset has Fire_01 assigned and Range expanded; Asset Parameter has an example default/allowed list; Random Clip has two Wave Asset inputs; Play Audio has a connected clip input. These examples make the graph valid and the relevant controls visible. They are not new sample sound events.
- Pointer-leave events clear transient hover highlighting before capture. Five successful batches record all 49 operations, actual titles, dimensions, timestamps, and crop coordinates.
- Originals and individual sidecars are in `media-source/unity/nodes/`; build inputs are in `src/assets/nodes/`. `content-data/node-captures.json` maps every operation to its screenshot, alt text, caption, source hashes, and native capture proof.
- The temporary graph and its window were removed. Before/after snapshots confirm identical active scene, dirty/play/pause/background state, selection asset IDs, and original window titles/types/maximized states. The source Unity worktree retains only its preexisting changes.

To repeat the capture, copy the helper to a temporary `.cs` file outside Assets, call Setup, then Batch with comma-separated operation names in the current catalogue, and always call Cleanup afterward. Record fresh before/after snapshots and review every crop. Regenerate the manifest hashes and published image copies after any new capture. Do not overwrite another graph with the temporary asset.

## Verification

- `npm run validate` passes with zero Astro errors, warnings, or hints. Existing API, example, screenshot, and M5 checks continue to pass.
- New `check-node-captures.mjs` verifies all 49 operations have distinct images, matching PNG hashes/dimensions, matching native batch/sidecar records, a checked capture helper, and successful Unity cleanup.
- Production build: 77 HTML pages, 8,459 local links/assets, 64 API coverage targets. It omits 132 unreferenced source PNGs (44.7 MB) while retaining optimized image variants.
- `npm run test:browser`: 23 passed. New coverage checks graph/code alignment and phone stacking, code copying, all 49 image loads and full-size dialogs, unobscured node images, keyboard dismissal, 320 px layouts, and visible dialog controls.
- Visual review covered every native node using `node-captures/review-1.png` through `review-5.png`, plus the homepage pair, Wave Asset detail, and Repeat on a phone. Browser screenshots are retained in the same directory.

The node capture helper and raw proof records are contributor artifacts, not website runtime dependencies. GitHub Pages needs only the normal static build.
