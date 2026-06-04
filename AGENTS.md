# Synergism Agent Notes

Synergism is a TypeScript/HTML/CSS idle game. Frontend entry points are `src/Synergism.ts`, `index.html`, `Synergism.css`, and `translations/en.json`.

## High-Impact Rules

- Ask the user before adding fields to the `player` object; save size matters.
- New player fields must be reflected in `src/types/Synergism.ts`, `src/saves/PlayerSchema.ts`, and the `player` definition in `src/Synergism.ts`.
- Add all user-facing text to `translations/en.json` for i18next. Colored text uses `<<color|{{text}}>>`.
- Use `DOMCacheGetOrSet('elementId')` instead of `document.getElementById`.
  - Import with `import { DOMCacheGetOrSet } from './Cache/DOM'`.
- Match existing TypeScript/import/naming patterns. Hoist constant objects and arrays to module scope when practical.

## Platform-Specific Code

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
