# Synergism - the game

## Contributing
Before running any of these commands, run `npm install` (or `make install`) to install all dependencies. If you intend to use `make`, make sure it is installed first.

- To build: `npm run build:esbuild` (or `make build`).
- To typecheck all TypeScript files: `npm run check:tsc` (or `make check`).
- To lint: `npm run lint` (or `make lintcode`).
- To lint CSS: `npm run csslint` (or `make lintcss`).
- To lint both the code and CSS, which is the equivalent of running `npm run lint` and `npm run csslint`: `make lintall`
- To get a list of commands available in the Makefile: `make help` or just `make`.
