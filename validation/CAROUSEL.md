# Homepage demo carousel

Implemented 20 September 2026. The homepage scene card now rotates through all ten demos every five seconds, with a short horizontal slide transition and matching guide links.

The carousel reuses the real Unity captures. CSS frames the central scene so the captured HUD does not compete with the website controls. No Unity scenes, original captures, or capture provenance records were changed.

Previous/next buttons, arrow keys, Home/End, touch swipes, and Play/Pause provide manual control. Rotation pauses on mouse hover, keyboard focus, hidden tabs, and when less than a quarter of the carousel is on screen. Explicit Play resumes immediately. Reduced-motion visitors start paused and see immediate transitions. Manual changes are announced to assistive technology; automatic changes are not repeatedly announced. Focus follows the active guide link when navigating slides with the keyboard.

The first image loads eagerly and the next image is prepared ahead of time; other hidden slides remain lazy. The no-JavaScript fallback shows the first demo and retains the complete gallery below it.

Validation:

- `npm run validate` passed: framework/content checks, production build, links, assets, and release output.
- Five focused browser tests passed: all ten images/titles/links, wraparound, automatic rotation, hover/focus/explicit pause, off-screen pause, keyboard navigation/focus, reduced motion, accessibility, homepage links, and mobile navigation.
- Visual review covered individual slides and widths of 320, 390, 768, and 1920 pixels. Primary controls meet the 44 px touch target.
- Initial mobile transfer measured 149,538 bytes on local production preview, below the 1 MB target. No-JavaScript fallback was checked separately.

Evidence: [browser results](carousel/browser-results.json), [payload and fallback](carousel/payload-fallback.json), and slide/layout screenshots in `carousel/`. Previous milestone reports and screenshots remain historical evidence. The change is available in local preview; no commit or deployment was performed by the assistant.
