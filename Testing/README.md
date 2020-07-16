Synergism automated testing relies on use of a [NodeJS](https://nodejs.org) environment.  Use of the most current LTS version is recommended.

Before running any tests, be sure to run a `npm install` from the command line / terminal so that the testing environment can be properly established.  The tests are currently configured to run against Firefox and Chrome, but this detail may be changed with relative ease.

I've made sure to somewhat heavily document the "basic" tests.  If you're fairly new to automated testing, please check out `Testing/cases/basics.js`.

If you'd like the testing framework to stay active in "watch" mode, simply open `karma.conf.js` and change the entry for `singleRun` from `true` to `false`.   Should any automated test 'fail', using this mode and clicking Karma's big "Debug" button will launch a version of the page that you can then interactively debug when using your browser's Developer console.