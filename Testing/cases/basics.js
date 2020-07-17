// Provides our assertion library - the set of tools used to judge if the code is working correctly.
// The handy reference:  https://www.chaijs.com/api/assert/
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

// This test-specification format is due to use of Mocha.  https://mochajs.org/#getting-started
// describe - creates a named grouping of tests.  May be nested.
// it - a single unit test.
describe("Basic tests", function() {
    // Runs this code once for the entire test grouping BEFORE any tests run
    before(function(done) {
        this.timeout(3000); // 6 seconds.

        window.setTimeout(function() {
            // Use of the optional parameter 'done' indicates that this is asynchronous.
            // We call done() to tell Mocha that setup is complete.
            done();
        }, 2800); // We give the page 2.5 seconds to load as a safety margin.

        // Now that the timeout is set, we can start loading things.
        fixture.setBase('');

        // Set the game to a clean state, no offline ticks.  They get in the way of test init.
        setSaveFromFixture("TestSaves/CleanStart.json");

        // Loads the actual test page.
        fixture.load("/index.html");
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

    // ACTUAL TEST DEFINITIONS:  BEGIN! ----------------------------------

    it("loads without errors", function() {
        assert.isOk(player);
    });

    describe("with new save", function() {  
        it("does not autogenerate resources", function() {
            // When a player first loads the game, they have no coin buildings purchased.
            assert.isTrue(player.coins.equals(new Decimal(100)));
            assert.equal(player.firstOwnedCoin, 0);
            assert.equal(player.secondOwnedCoin, 0);
            assert.equal(player.thirdOwnedCoin, 0);
            assert.equal(player.fourthOwnedCoin, 0);
            assert.equal(player.fifthOwnedCoin, 0);

            // Just to be extra-sure, let's generate a tick.
            tick();

            assert.isTrue(player.coins.equals(new Decimal(100)));
        });

        it("can buy first coin building and earn resources", function() {
            assert.equal(player.firstOwnedCoin, 0);

            buyProducer('first', 'Coin', 1);
            assert.equal(player.firstOwnedCoin, 1);

            buyProducer('first', 'Coin', 1)
            assert.notEqual(player.firstOwnedCoin, 2); // we don't have the money!

            tick();

            assert.isTrue(player.coins.greaterThan(0));
        });
    });
});