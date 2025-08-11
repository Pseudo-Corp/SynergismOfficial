# Synergism - the game

## Contributing
Before running any of these commands below, make sure to have installed:

NodeJS >= 24.0.0 - https://nodejs.org/en/
git - https://git-scm.com/downloads

## Recommended Software

VSCode - https://code.visualstudio.com/Download

---
1. Fork this repository at https://github.com/Pseudo-Corp/SynergismOfficial/fork
2. Clone the repository you forked with `git clone https://github.com/<USERNAME>/SynergismOfficial` (make sure to change `<USERNAME>` with your own GitHub username).
3. cd SynergismOfficial
4. Install the project dependencies, running `npm install` (or `make install` - If you intend to use `make` from here and on, make sure it is installed first)
5. Switch to a new branch with `git checkout -b "my-branch-name"`
6. Run `node --run dev` (or `make dev`)
7. Make your desired changes and test them.
8. Typecheck all your TypeScript files by running `node --run check:tsc` (or `make check`).
9. Lint the code by running `node --run lint` (or `make lintcode`).
10. Lint the CSS by running `node --run csslint` (or `make lintcss`).
11. Run `git add /path/to/file` for every file updated or created (or `git add -A` for every file).
12. If everything is good to go, commit your changes with `git commit -m "title of my commit"`
13. Push your changes to your personal Github Repository with `git push -u origin my-branch-name`
14. Open a Pull Request (PR) on the Official Synergism Repository at https://github.com/Pseudo-Corp/SynergismOfficial/pulls (make sure you click on `compare across forks` to select your fork and branch)
---
To get a list of available commands in the Makefile, run `make help` or just `make`
