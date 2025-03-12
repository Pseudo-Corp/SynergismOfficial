# Synergism - the game

## Contributing
Before running any of these commands below, make sure to have installed:

VSCode - https://code.visualstudio.com/Download

NodeJS - https://nodejs.org/en/ (current, not LTS).

---
1. Fork this repository at https://github.com/Pseudo-Corp/SynergismOfficial/fork
2. Clone the repository you forked with `git clone https://github.com/<USERNAME>/SynergismOfficial`.
3. Open the repository you just downloaded in your code editor of choice (VSCode is recommended for beginners).
4. Install the project dependencies, running `npm install` (or `make install`).
5. Switch to a new branch with `git checkout -b "my-branch-name"`.
6. Run `npm run dev` (or `make watch`).
7. Make your desired changes and test them.
8. If any new files were created, run `git add /path/to/file` (or `git add -A` to add all)
9. Typecheck all your TypeScript files by running `npm run check:tsc` (or `make check`)
10. Lint the code by running `npm run lint` (or `make lintcode`)
11. Lint the CSS by running `npm run csslint` (or `make lintcss`)
12. If everything is good to go, commit your changes with `git commit -am "title of my commit"`
13. Push your changes to your personal Github Repository with `git push -u origin my-branch-name`
14. Open a Pull Request in the Synergism Repository at https://github.com/Pseudo-Corp/SynergismOfficial/pulls
---
To get a list of available commands in the Makefile, run `make help` or just `make`
