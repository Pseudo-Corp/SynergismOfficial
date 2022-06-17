.DEFAULT_GOAL := help
.PHONY: help

help:		## Show help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: 		## Install necessary dependencies
	npm install

build: 		## Builds the project
	npm run build:esbuild

check: 		## Typecheck all TypeScript files
	npm run check:tsc

lintall: 		## Lint the code and the CSS
	npm run lint
	npm run csslint

lintcode: 		## Lint just the code
	npm run lint

lintcss: 		## Lint just the CSS
	npm run csslint
