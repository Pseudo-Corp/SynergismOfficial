// Useful reference: http://karma-runner.github.io/5.0/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // Testing root folder:  the repo's root
        basePath: "..",
        
        // Loads testing framework
        frameworks: ["mocha", "chai", "fixture"],

        /* watched(default: true):  When singleRun=false, the tests will be re-run if the corresponding file has changed.
         * served(default: true):  Ensures that the file is accessible 
         * included(default: true):  Ensures that the file is automatically loaded as a script.
         */
        files: [
            "index.html",  // Becomes a 'fixture'.
            "*.css",
            {pattern: "Pictures/**/*.png", watched: false, served: true, included: false},
            {pattern: "Pictures/**/*.gif", watched: false, served: true, included: false},

            // Order matters.
            "break_infinity.js",
            "lz-string.js",
            "bluebird.min.js",
            "Synergism.js",
            {pattern: "Javascript/*.js", watched: true, served: true, included: true},

            // The base folder for the tests we want to run.
            "Testing/cases/**/*.js",

            // The base folder for our save "file" fixtures.
            "Testing/TestSaves/**/*.json"
        ],

        port: 9876,

        preprocessors: {
            "index.html": ["html2js"],
            "Testing/TestSaves/**/*.json" : ["json_fixtures"]
        },

        // The fixture engine expects some sort of prefix.
        html2jsPreprocessor: {
            prependPrefix: "fixtures/"
        },

        jsonFixturesPreprocessor: {
            stripPrefix: "Testing", // Keeps the TestSaves prefix for saves.
            variableName: "__json__"
        },

        // Kerma likes to place all 'served' resources underneath a 'base' folder.
        proxies: {
            "/Pictures/": "/base/Pictures",
            "/Synergism.css": "/base/Synergism.css"
        },

        autoWatch: true,
        colors: true,

        // if true, Karma captures browsers, runs the tests and exits
        // if false, it generates the pages and acts as a persistent server.
        singleRun: true,

        // Determines the test report format
        reporters: ['mocha'],

        // Requires a devDependency entry within package.json - one per browser.
        // - karma-firefox-launcher
        // - karma-chrome-launcher
        browsers: ['Firefox', 'Chrome'],

        // Test in all browsers simultaneously.
        concurrency: Infinity,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO
    })
}