# Getting Started panel documentation

Reviewed on 2026-09-20 against the Unity working tree. These new panel files were untracked at review time; they are additions to the existing source baseline, not part of revision `746a1cc7d2602bc59df6096eac50508ded6ef49e`.

Updated `getting-started/index.mdx` and `guides/setup-and-keys.mdx` with the actual menu, button labels, setup behavior, registration, key generation, demo opening, and startup preference. Existing API examples and their baseline are unchanged.

## Reviewed source

| File | SHA-256 |
| --- | --- |
| `Assets/DEV505/SoundManager/Scripts/Editor/Setup/SoundManagerHub.cs` | `322ae2f22dfc7761293ae3241c41829fbe1f042b3d9412b0f3ee27200373b421` |
| `Assets/DEV505/SoundManager/Scripts/Editor/Setup/SoundManagerHub.uxml` | `45d1df1bb5f378ec91c75c9523f95b47c89c0e04989a983042857867b5e06249` |
| `Assets/DEV505/SoundManager/Scripts/Editor/Setup/SoundManagerSetup.cs` | `c01904301dc092b93923bf0818c511f4860cc6da7fe1b93f2540355ad20c0801` |

## Validation

- `npm run validate` passed: content checks, Astro checks, production build, local links, and release output checks.
- Astro check reported zero errors, warnings, or hints. The bundler still emitted its existing `use astro:head-inject` directive warnings.
- Panel behavior was checked against implementation and UXML; no new Unity runtime test was performed for this documentation change.
