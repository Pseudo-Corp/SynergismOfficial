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
