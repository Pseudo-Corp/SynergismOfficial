# Synergism - the game

## Contributing
Before running any of these commands below, make sure to have installed:

VSCode - https://code.visualstudio.com/Download

NodeJS - https://nodejs.org/en/ (current, not LTS).

---
1. Fork this repository at https://github.com/Pseudo-Corp/SynergismOfficial/fork
2. Clone the repository you forked with `git clone https://github.com/<USERNAME>/SynergismOfficial` (make sure to change `<USERNAME>` with your own Github username)
3. Open the repository you just downloaded in VSCode
4. Install the project dependencies, running `npm install` (or `make install` - If you intend to use `make` from here and on, make sure it is installed first)
5. Install the liveserver extension for VSCode at https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer (or by searching for `Live Server` inside the Extensions Marketplace in VSCode. You can open the Extensions Marketplace by pressing `Ctrl+Shift+X`)
6. Switch to a new branch with `git checkout -b "my-branch-name"`
7. Run `npm run watch:esbuild` (or `make watch`)
8. Open the liveserver (bottom right corner icon similar to an Antenna in VSCode)
9. Make your desired changes and test them. When you are done making changes, press `Ctrl+C` to exit from the previous command.
10. If any new files were created, run `git add /path/to/file` (or `git add -A` to add all)
11. Before commiting any changes you made, check and lint your code to see if everything you've done is good to go by doing steps 12 through 14
12. Typecheck all your TypeScript files by running `npm run check:tsc` (or `make check`)
13. Lint the code by running `npm run lint` (or `make lintcode`)
14. Lint the CSS by running `npm run csslint` (or `make lintcss`)
15. If everything is good to go, commit your changes with `git commit -am "title of my commit"`
16. Push your changes to your personal Github Repository with `git push -u origin my-branch-name`
17. Open a Pull Request (PR) on the Official Synergism Repository at https://github.com/Pseudo-Corp/SynergismOfficial/pulls (make sure you click on `compare across forks` to select your fork and branch)
---
To get a list of available commands in the Makefile, run `make help` or just `make`
