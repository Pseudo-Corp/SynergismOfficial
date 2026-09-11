# Synergism Agent Notes

Synergism is a TypeScript/HTML/CSS idle game. Frontend entry points are `src/Synergism.ts`, `index.html`, `Synergism.css`, and `translations/en.json`.

## High-Impact Rules

- Ask the user before adding fields to the `player` object; save size matters.
- New player fields must be reflected in `src/types/Synergism.ts`, `src/saves/PlayerSchema.ts`, and the `player` definition in `src/Synergism.ts`.
- Treat `player` as the sole source of truth for permanent game state. Definition objects such as upgrade registries may contain static metadata or derived/transient state, but must not duplicate values already stored on `player`; read and write those values directly on `player`.
  - For registries such as `ambrosiaUpgrades`, `redAmbrosiaUpgrades`, `purpleReactorUpgrades`, `octeractUpgrades`, and `goldenQuarkUpgrades`, do not synchronize duplicate permanent values during save, reload, or save migration.
  - Access nested upgrade state directly (for example, `player.goldenQuarkUpgrades[key].level`); do not introduce local aliases for `player` upgrade entries.
- Add all user-facing text to `translations/en.json` for i18next. Colored text uses `<<color|{{text}}>>`.
- Use `DOMCacheGetOrSet('elementId')` instead of `document.getElementById`.
  - Import with `import { DOMCacheGetOrSet } from './Cache/DOM'`.
- Match existing TypeScript/import/naming patterns. Hoist constant objects and arrays to module scope when practical.

## Platform-Specific Code

- When possible, keep HTML and rendering shared between mobile and web. Isolate platform-specific behavior in event listeners, modal invocation/configuration, or other interaction wiring instead of branching the generated HTML.
- Steam code must be gated with `platform` from `src/Config.ts`.
- Electron/Steam-only APIs must use dynamic imports inside the gated branch so browser/mobile bundles can tree-shake correctly.

```ts
import { platform } from './Config'

async function runFeature () {
  if (platform === 'steam') {
    const { steamOnlyFeature } = await import('./steam/steam')
    await steamOnlyFeature()
  } else {
    browserFeature()
  }
}
```

## Useful Commands

- `npm run lint`
- `npm run check:tsc`
- `npm run csslint`
- `npm run htmllint`
- `npm run build:esbuild`
- `npm run dev`

## Repo Map

- `src/`: core game logic and frontend systems
- `src/login.ts`: backend login integration
- `src/mock/`: backend mocking
- `translations/en.json`: English source strings
- `electron/`: Steam/Electron shell
- `android/`, `ios/`: Capacitor targets
