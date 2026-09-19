# M3 capture records

These files record the 19 September 2026 capture session. Unity was already running at revision `746a1cc7d2602bc59df6096eac50508ded6ef49e`, using Editor `6000.6.0f1`. No scene, graph, model, or sound settings were saved or changed by this work.

## Reproduce an image by hand

Use the ordered steps for that image in `content-data/captures.json` or its website gallery. Open the named scene, enter Play Mode, and use its normal controls. For a graph, leave Play Mode, open the named `.soundgraph`, and pan/zoom to the indicated nodes. Inspector captures select the graph asset and expand the named settings section. Jukebox's allowed assets are shown in the native Debug Inspector; its gallery explains how to inspect that list and return to normal mode.

Keep the current scene models, camera, lighting, effects, and HUD. Game Views are 1920 × 1080. A different frame may show a slightly different animation pose or counter value; do not alter the HUD to imitate the recorded frame.

## Automated capture evidence

- `CaptureGameViews.cs.txt` contains the setup, actual Game View readback, and successful controller/keyboard capture routines. The abandoned wood-lane staging experiment is omitted; all final Footstep PNGs came from normal keyboard-driven movement across the lanes.
- `CaptureGraphViews.cs.txt` records native graph and Inspector readback, framing, and range expansion. `graph-framing.py.txt` records the precise graph regions used for close views; `graph-overviews.py.txt` records the graph inventory.
- `run-scenes.py.txt` is the scene orchestration used for the ordinary controller captures. Launch and Footstep use the same `M3Capture.Launch` and `M3Capture.Footstep` entries in their respective scenes.
- The C# files were compiled in memory through the connected Editor's `run_script` command, outside `Assets`. They use internal Editor reflection tied to this Editor version. These are session records, not a portable Unity package or website dependency.
- The Jukebox allowed-tracks view was captured after expanding the imported Track parameter and Allowed Assets in Unity's native Debug Inspector. No parameter value was changed.
- Every new PNG has an adjacent `.capture.json` record under `media-source/unity/`. Controller state is sampled alongside image readback. A HUD may update on a separate cadence; the Weather lightning caption explicitly explains the previous HUD thunder count during the first flash.

Adapt workstation paths before reusing the scripts. The Python records expect `m3_run.py`, `m3_graphs.py`, and the C# files under `/tmp`; rename/copy them accordingly. Start from Edit Mode with clean scenes. Run setup once, capture, then restore in a cleanup path even if a capture fails. The installed CLI did not accept the skill's `--caller`/`--skill` metadata flags, so the recorded commands omit them.

For a new session, save an Editor layout backup before maximizing graph windows. Unity can recreate window instances when it restores a maximized layout: do not identify the original tab set only by instance ID. Restore by window type/title or the saved layout. The temporary Game View resolution must be removed using its index in `GetDisplayTexts()` (built-in and custom sizes combined), not its custom-only index.

## Session restoration and verification

`session-before.json` and `session-after.json` record the original and restored Launch scene, Play/Pause state, background setting, selected Game View size, custom size count, selection, and original 15-tab set. Footstep's temporary keyboard and focus settings were cleaned up in `finally`.

Unity rebuilt EditorWindow instances during maximization. The original tabs were reopened by title/type and temporary capture tabs were closed. The original tab set and scene/settings are restored; exact per-tab zoom, scroll, and instance IDs are not claimed to be identical. The scene is clean and in Edit Mode.

`capture-checks.json` records 18 checks of the actual captured states and source baseline, including source hashes for 60 files. It does not claim subjective listening tests or sample-accurate audio timing. `unity-worktree.txt` contains only the pre-existing staged/deleted graph and `.DS_Store` entries. The capture process added no Unity project changes.
