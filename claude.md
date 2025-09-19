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

### Quality Assurance Commands
Run these after making changes:
```bash
node --run format           # Format code
npx -p typescript tsc      # TypeScript check
```

## File Structure Rules
```
src/                       # Core game logic
├── mock/                  # Mock API responses  
├── Purchases/             # Purchase-related logic
├── saves/                 # Save system logic
├── types/                 # TypeScript definitions
└── [FeatureName].ts       # Individual game features

index.html                 # Single HTML file - add new divs in body
Synergism.css             # Single CSS file
translations/en.json       # Required for all new text strings
```

## Development Patterns

### Adding New Features
1. **File Location**: 
   - Use existing subfolders if feature fits
   - Otherwise place directly in `src/`
2. **HTML**: Add new `<div>` elements one level into `<body>`
3. **CSS**: Add styles to `Synergism.css`

### String Internationalization
- **Required**: Add all user-facing text to `translations/en.json`
- **Format**: `i18n` library usage
- **Variables**: `{{variableName}}` for dynamic content
- **Styling**: `<<color|text>>` for colored text

### Save System Variables
**CRITICAL**: Before adding to `player` object:
1. Get explicit permission from user
2. Add to `src/types/Synergism.d.ts`
3. Add to `src/saves/PlayerSchema.ts`
4. Variable location: `player` in `src/Synergism.ts`

## Code Conventions
- Follow existing TypeScript patterns in codebase
- Use established import/export structures
- Match existing naming conventions
- Maintain consistency with current architecture







