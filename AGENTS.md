## High-Impact Rules

- Treat `player` as the sole source of truth for permanent game state. Definition objects such as upgrade registries may contain static metadata or derived/transient state, but must not duplicate values already stored on `player`; read and write those values directly on `player`.
  - For registries such as `ambrosiaUpgrades`, `redAmbrosiaUpgrades`, `purpleReactorUpgrades`, `octeractUpgrades`, and `goldenQuarkUpgrades`, do not synchronize duplicate permanent values during save, reload, or save migration.
  - Access nested upgrade state directly (for example, `player.goldenQuarkUpgrades[key].level`); do not introduce local aliases for `player` upgrade entries.
- Add all user-facing text to `translations/en.json` for i18next. Colored text uses `<<color|{{text}}>>`.
- Use `DOMCacheGetOrSet('elementId')` instead of `document.getElementById`.
- Match existing TypeScript/import/naming patterns. Hoist constant objects and arrays to module scope when practical.

## Platform-Specific Code

- When possible, keep HTML and rendering shared between mobile and web. Isolate platform-specific behavior in event listeners, modal invocation/configuration, or other interaction wiring instead of branching the generated HTML.
- Platform-dependent code (such as Steam or Mobile specific APIs or libraries) must be gated with the esbuild `PLATFORM` macro.

```ts
async function runFeature () {
  if (PLATFORM === 'steam') {
    const { steamOnlyFeature } = await import('./steam/steam')
    await steamOnlyFeature()
  } else if (PLATFORM === 'mobile') {
    const { mobileOnlyFeature } = await import('./mobile/mobile')
    await mobileOnlyFeature()
  } else {
    browserDefault()
  }
}
```

## Hoist Object Creation When Possible

- Objects and arrays that are constant should be hoisted to the module scope when possible.
- You may also place these objects under the Globals object.

Example (wrong):
```ts
function myFunction () {
  const arr = [1, 2, 3, 4, 5]
  return arr
}
```

Example (correct):
```ts
const arr = [1, 2, 3, 4, 5]

function myFunction () {
  return arr
}
```

## Comments

Please do not write comments. You suck at writing.