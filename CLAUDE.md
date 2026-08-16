# Synergism Project Context for Claude

## Project Overview
- **Name**: Synergism (idle game)
- **Tech Stack**: TypeScript, HTML, CSS
- **URL**: https://synergism.cc
- **Repository**: Primarily for frontend features of Synergism
- **Backend**: Connected via `src/login.ts` with mocking in `src/mock/`

## Agent Role & Workflow
### Primary Tasks
- Implement frontend features
- Fix bugs and issues
- Architect new feature systems

### Required Actions
1. **Always ask permission** before adding variables to `player` object (affects savefile size)
2. **Check back with user** after writing significant code
3. **Ask questions** when task requirements are unclear

## File Structure Rules
```
src/                       # Core game logic
index.html
Synergism.css
translations/en.json       # Required for all new text strings
```

## Development Patterns

### String Internationalization
- i18next: Add all user-facing text to `translations/en.json`
- **Styling**: `<<color|{{text}}>>` for colored text

### Save System Variables
**CRITICAL**: Before adding to `player` object:
1. Get explicit permission from user
2. Add to `src/types/Synergism.ts`
3. Add to `src/saves/PlayerSchema.ts`
4. Variable location: `player` in `src/Synergism.ts`

## Code Conventions

### Critical Performance & Style Requirements
- **DOM Access**: ALWAYS use `DOMCacheGetOrSet('elementId')` instead of `document.getElementById`
  - Import: `import { DOMCacheGetOrSet } from './Cache/DOM'`
  - Reason: Performance optimization through caching

### General Patterns
- Follow existing TypeScript patterns in codebase
- Use established import/export structures
- Match existing naming conventions
- Maintain consistency with current architecture

### Live Modals & `data-modal-preserve`
- `Modal()` (in `src/UpdateHTML.ts`) re-runs its HTML closure on an interval and diffs the result
  against the live modal DOM (`patchNodes`), overwriting any difference.
- Mark stable wrapper elements and `<img>`s with `data-modal-preserve="children"` (on BOTH the element
  and its parent chain down from the modal root) so they are patched attribute-by-attribute in place.
  Without it, any change to an element's serialized HTML replaces the whole node — for `<img>` this
  reloads the image and visibly flickers.
- Missing image files: `imgErrorHandler` (in `src/Themes.ts`) rewrites a 404'd img's `src` through the
  icon-set fallback chain, ending at `MISSINGIMAGE.png`. Modal HTML closures that rebuild the URL from
  `IconSets[player.iconSet]` each tick would fight this and flicker forever; `updateModal` prevents it
  by resolving every generated `<img src>` through the recorded fallback map (`resolveImgSrc`) before
  diffing. Never bypass `updateModal` to write modal img srcs directly. When the modal is opened from
  an element that already contains the same icon (e.g. a hovered node), prefer passing that element's
  live `.src` instead of rebuilding the URL.

### Steam
- There is a Steam version of the app that uses Electron.
- Steam features MUST be gated by checking the `platform` variable from Config.ts
- When using a feature only available to the Electron app, you MUST use dynamic imports. Example:

```ts
import { platform } from './Config'

async function myFunction () {
  if (platform === 'steam') {
    const { steamOnlyFeature } = await import('./steam/steam')

    await steamOnlyFeature()
  } else {
    // browser version
    browserOnlyFeature()
  }
}
```

- The platform variable comes from esbuild define hooks. These act as macros essentially, which removes the
  `else` block on Steam and vice-versa on browser builds.
- **Wrong**: `import { steamOnlyFeature } from './steam/steam'`W

### Recommended Patterns
- Objects and arrays that are constant should be hoisted to the module scope when possible.

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
