// Provides our assertion library - the set of tools used to judge if the code is working correctly.
var assert = chai.assert;

function setSaveFromFixture(name) {
    // true:  'appends' the fixture so that our previous loads aren't lost.
    let saveToLoad = fixture.load(name, true)

    // Prevent offline loading.  (It's simpler; no need to wait for the calculator.)
    // Write an alternate version when targetting offline, as controlling _how much_ offline
    // will require .offlineTick manipulation.
    saveToLoad.offlinetick = Date.now();
    localStorage.setItem("Synergysave2", btoa(JSON.stringify(saveToLoad)));
}

// This test-specification format is due to use of Mocha.
// describe - creates a named grouping of tests.  May be nested.
// it - a single unit test.
describe("Basic tests", function() {
    // Runs this code once for the entire test grouping BEFORE any tests run
    before(function(done) {
        this.timeout(3000); // 6 seconds.

        fixture.setBase('');

        // Set the game to a clean state, no offline ticks.  They get in the way of test init.
        setSaveFromFixture("TestSaves/CleanStart.json");

        // Loads the actual test page.
        fixture.load("/index.html");

        window.setTimeout(function() {
            // Use of the optional parameter 'done' indicates that this is asynchronous.
            // We call done() to tell Mocha that setup is complete.
            done();
        }, 2500); // We give the page 2.5 seconds to load as a safety margin.
    });

    // Runs this code once BEFORE each test.
    beforeEach(function(done) {
        setSaveFromFixture("TestSaves/CleanStart.json");
        loadSynergy();

        // The game needs a bit of time to load the file.
        window.setTimeout(function() {
            done();
        }, 500)
    });

    after(function() {
        fixture.cleanup();
    });

    afterEach(function() {

    });

    it("loaded", function() {
        assert.isOk(player);
    })
});