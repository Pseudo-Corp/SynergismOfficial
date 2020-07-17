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
describe("Automatic purchases", function() {
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

    describe("for coin buildings", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start.
            // Then, give the player a ton of coins.
            player.coins = Decimal.pow(10, 4000000);

            updateAll();

            // Did any coin building get purchased?
            assert.equal(player.firstOwnedCoin, 0);
            assert.equal(player.secondOwnedCoin, 0);
            assert.equal(player.thirdOwnedCoin, 0);
            assert.equal(player.fourthOwnedCoin, 0);
            assert.equal(player.fifthOwnedCoin, 0);
        });

        it("does not autopurchase with toggles disabled", function() {
            // Again, a basic start, then we modify it.
            player.coins = Decimal.pow(10, 4000000);
            
            player.upgrades[81] = 1;  player.toggles.one = false;
            player.upgrades[82] = 1;  player.toggles.two = false;
            player.upgrades[83] = 1;  player.toggles.three = false;
            player.upgrades[84] = 1;  player.toggles.four = false;
            player.upgrades[85] = 1;  player.toggles.five = false;

            updateAll();

            // Did any coin building get purchased?
            assert.equal(player.firstOwnedCoin, 0);
            assert.equal(player.secondOwnedCoin, 0);
            assert.equal(player.thirdOwnedCoin, 0);
            assert.equal(player.fourthOwnedCoin, 0);
            assert.equal(player.fifthOwnedCoin, 0);
        });

        it("does autopurchase with perks and toggles enabled", function() {
            // Again, a basic start, then we modify it.
            player.coins = Decimal.pow(10, 4000000);
            
            player.upgrades[81] = 1;  player.toggles.one = true;
            player.upgrades[82] = 1;  player.toggles.two = true;
            player.upgrades[83] = 1;  player.toggles.three = true;
            player.upgrades[84] = 1;  player.toggles.four = true;
            player.upgrades[85] = 1;  player.toggles.five = true;

            updateAll();

            // Did any coin building get purchased?
            assert.notEqual(player.firstOwnedCoin, 0);
            assert.notEqual(player.secondOwnedCoin, 0);
            assert.notEqual(player.thirdOwnedCoin, 0);
            assert.notEqual(player.fourthOwnedCoin, 0);
            assert.notEqual(player.fifthOwnedCoin, 0);
        });
    });

    describe("for accelerators, multipiers, and boosts", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.coins               = Decimal.pow(10, 400000000);
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.transcendPoints     = Decimal.pow(10, 400000000);

            updateAll();

            assert.equal(player.acceleratorBought, 0);
            assert.equal(player.multiplierBought, 0);
            assert.equal(player.acceleratorBoostBought, 0);
        });

        it("does not autopurchase with toggles disabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.coins               = Decimal.pow(10, 400000000);
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.transcendPoints     = Decimal.pow(10, 400000000);

            player.upgrades[86] = true;  player.toggles.six = false;
            player.upgrades[87] = true;  player.toggles.seven = false;
            player.upgrades[88] = true;  player.toggles.eight = false;

            player.upgrades[46] = true; // Prevents reset when buying a boost.

            updateAll();

            assert.equal(player.acceleratorBought, 0);
            assert.equal(player.multiplierBought, 0);
            assert.equal(player.acceleratorBoostBought, 0);
        });

        it("does autopurchase with perks and toggles enabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.coins               = Decimal.pow(10, 400000000);
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.transcendPoints     = Decimal.pow(10, 400000000);

            player.upgrades[86] = true;  player.toggles.six = true;
            player.upgrades[87] = true;  player.toggles.seven = true;
            player.upgrades[88] = true;  player.toggles.eight = true;

            player.upgrades[46] = true; // Prevents reset when buying a boost.

            updateAll();

            assert.notEqual(player.acceleratorBought, 0);
            assert.notEqual(player.multiplierBought, 0);
            assert.notEqual(player.acceleratorBoostBought, 0);
        });
    });

    describe("for upgrades", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.coins               = Decimal.pow(10, 400000000);
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.transcendPoints     = Decimal.pow(10, 400000000);
            player.reincarnationPoints = Decimal.pow(10, 400000000);
            player.unlocks.generation  = false;

            autoUpgrades();

            // Did any related upgrade get purchased?
            for(let i=0; i <= 60; i++) {
                assert.equal(player.upgrades[i], 0);
            }

            for(let i=101; i <= 120; i++) {
                assert.equal(player.upgrades[i], 0);
            }
        });

        it("does not autopurchase with toggles disabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.coins               = Decimal.pow(10, 400000000);
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.transcendPoints     = Decimal.pow(10, 400000000);
            player.reincarnationPoints = Decimal.pow(10, 400000000);
            player.unlocks.generation  = true;

            player.shoptoggles.generators = false; player.upgrades[90] = 1;
            player.shoptoggles.coin = false;       player.upgrades[91] = 1;
            player.shoptoggles.transcend = false;  player.upgrades[92] = 1;
            player.shoptoggles.prestige = false;   player.upgrades[99] = 1;

            autoUpgrades();

            // Did any related upgrade get purchased?
            for(let i=0; i <= 60; i++) {
                assert.equal(player.upgrades[i], 0);
            }

            for(let i=101; i <= 120; i++) {
                assert.equal(player.upgrades[i], 0);
            }
        });

        it("does autopurchase with perks and toggles enabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.coins               = Decimal.pow(10, 400000000);
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.transcendPoints     = Decimal.pow(10, 400000000);
            player.reincarnationPoints = Decimal.pow(10, 400000000);
            player.unlocks.generation  = true;

            player.shoptoggles.generators = true; player.upgrades[90] = 1;
            player.shoptoggles.coin = true;       player.upgrades[91] = 1;
            player.shoptoggles.transcend = true;  player.upgrades[92] = 1;
            player.shoptoggles.prestige = true;   player.upgrades[99] = 1;

            autoUpgrades();

            let setNames = ["coin upgrade", "diamond upgrade", "mythos upgrade", "generator shop upgrade"];

            // Did any related upgrade get purchased?
            for(let set = 0; set < 4; set++) {
                let setOffset = set * 20;
                if(set == 3) {
                    setOffset = 100; // Generators start here.
                }
                let purchaseMade = false;

                for(let i=1; i <= 20; i++) {
                    purchaseMade = purchaseMade || player.upgrades[setOffset + i] > 0;
                }

                assert.isTrue(purchaseMade, "did not purchase a " + setNames[set]);
            }
        });
    });

    describe("for diamond buildings", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.prestigePoints      = Decimal.pow(10, 400000000);

            updateAll();

            assert.equal(player.firstOwnedDiamonds, 0);
            assert.equal(player.secondOwnedDiamonds, 0);
            assert.equal(player.thirdOwnedDiamonds, 0);
            assert.equal(player.fourthOwnedDiamonds, 0);
            assert.equal(player.fifthOwnedDiamonds, 0);
        });

        it("does not autopurchase with toggles disabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.prestigePoints      = Decimal.pow(10, 400000000);

            player.achievements[78]  = 1;  player.toggles.ten = false;
            player.achievements[85]  = 1;  player.toggles.eleven = false;
            player.achievements[92]  = 1;  player.toggles.twelve = false;
            player.achievements[99]  = 1;  player.toggles.thirteen = false;
            player.achievements[106] = 1;  player.toggles.fourteen = false;

            updateAll();

            assert.equal(player.firstOwnedDiamonds, 0);
            assert.equal(player.secondOwnedDiamonds, 0);
            assert.equal(player.thirdOwnedDiamonds, 0);
            assert.equal(player.fourthOwnedDiamonds, 0);
            assert.equal(player.fifthOwnedDiamonds, 0);
        });

        it("does autopurchase with perks and toggles enabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.prestigePoints      = Decimal.pow(10, 400000000);

            player.achievements[78]  = 1;  player.toggles.ten = true;
            player.achievements[85]  = 1;  player.toggles.eleven = true;
            player.achievements[92]  = 1;  player.toggles.twelve = true;
            player.achievements[99]  = 1;  player.toggles.thirteen = true;
            player.achievements[106] = 1;  player.toggles.fourteen = true;

            updateAll();

            assert.notEqual(player.firstOwnedDiamonds, 0);
            assert.notEqual(player.secondOwnedDiamonds, 0);
            assert.notEqual(player.thirdOwnedDiamonds, 0);
            assert.notEqual(player.fourthOwnedDiamonds, 0);
            assert.notEqual(player.fifthOwnedDiamonds, 0);
        });
    });

    describe("for crystal upgrades", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.prestigeShards      = Decimal.pow(10, 400000000);

            updateAll();

            for(let i=0; i < 5; i++) {
                assert.equal(player.crystalUpgrades[i], 0);
            }
        });

        it("does autopurchase with perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.prestigePoints      = Decimal.pow(10, 400000000);
            player.prestigeShards      = Decimal.pow(10, 400000000);

            player.achievements[79]  = 1;
            player.achievements[86]  = 1;
            player.achievements[93]  = 1;
            player.achievements[100] = 1;
            player.achievements[107] = 1;

            updateAll();

            for(let i=0; i < 5; i++) {
                assert.notEqual(player.crystalUpgrades[i], 0);
            }
        });
    });

    describe("for mythos buildings", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.transcendPoints = Decimal.pow(10, 400000000);

            updateAll();

            assert.equal(player.firstOwnedMythos, 0);
            assert.equal(player.secondOwnedMythos, 0);
            assert.equal(player.thirdOwnedMythos, 0);
            assert.equal(player.fourthOwnedMythos, 0);
            assert.equal(player.fifthOwnedMythos, 0);
        });

        it("does not autopurchase with toggles disabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.transcendPoints = Decimal.pow(10, 400000000);

            player.upgrades[94] = 1;  player.toggles.sixteen = false;
            player.upgrades[95] = 1;  player.toggles.seventeen = false;
            player.upgrades[96] = 1;  player.toggles.eighteen = false;
            player.upgrades[97] = 1;  player.toggles.nineteen = false;
            player.upgrades[98] = 1;  player.toggles.twenty = false;

            updateAll();

            assert.equal(player.firstOwnedMythos, 0);
            assert.equal(player.secondOwnedMythos, 0);
            assert.equal(player.thirdOwnedMythos, 0);
            assert.equal(player.fourthOwnedMythos, 0);
            assert.equal(player.fifthOwnedMythos, 0);
        });

        it("does autopurchase with perks and toggles enabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.transcendPoints = Decimal.pow(10, 400000000);

            player.upgrades[94] = 1;  player.toggles.sixteen = true;
            player.upgrades[95] = 1;  player.toggles.seventeen = true;
            player.upgrades[96] = 1;  player.toggles.eighteen = true;
            player.upgrades[97] = 1;  player.toggles.nineteen = true;
            player.upgrades[98] = 1;  player.toggles.twenty = true;

            updateAll();

            assert.notEqual(player.firstOwnedMythos, 0);
            assert.notEqual(player.secondOwnedMythos, 0);
            assert.notEqual(player.thirdOwnedMythos, 0);
            assert.notEqual(player.fourthOwnedMythos, 0);
            assert.notEqual(player.fifthOwnedMythos, 0);
        });
    });

    describe("for particle buildings", function() {  
        it("does not autopurchase without perks", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.reincarnationPoints = Decimal.pow(10, 400000000);

            updateAll();

            assert.equal(player.firstOwnedParticles, 0);
            assert.equal(player.secondOwnedParticles, 0);
            assert.equal(player.thirdOwnedParticles, 0);
            assert.equal(player.fourthOwnedParticles, 0);
            assert.equal(player.fifthOwnedParticles, 0);
        });

        it("does not autopurchase with toggles disabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.reincarnationPoints = Decimal.pow(10, 400000000);

            player.cubeUpgrades[7] = 1;  player.toggles.twentytwo = false;
            player.cubeUpgrades[7] = 1;  player.toggles.twentythree = false;
            player.cubeUpgrades[8] = 1;  player.toggles.twentyfour = false;
            player.cubeUpgrades[8] = 1;  player.toggles.twentyfive = false;
            player.cubeUpgrades[9] = 1;  player.toggles.twentysix = false;

            updateAll();

            assert.equal(player.firstOwnedParticles, 0);
            assert.equal(player.secondOwnedParticles, 0);
            assert.equal(player.thirdOwnedParticles, 0);
            assert.equal(player.fourthOwnedParticles, 0);
            assert.equal(player.fifthOwnedParticles, 0);
        });

        it("does autopurchase with perks and toggles enabled", function() {
            // We start with a basic start and build the 'player' we want from there.
            player.reincarnationPoints = Decimal.pow(10, 400000000);

            player.cubeUpgrades[7] = 1;  player.toggles.twentytwo = true;
            player.cubeUpgrades[7] = 1;  player.toggles.twentythree = true;
            player.cubeUpgrades[8] = 1;  player.toggles.twentyfour = true;
            player.cubeUpgrades[8] = 1;  player.toggles.twentyfive = true;
            player.cubeUpgrades[9] = 1;  player.toggles.twentysix = true;

            updateAll();

            assert.notEqual(player.firstOwnedParticles, 0);
            assert.notEqual(player.secondOwnedParticles, 0);
            assert.notEqual(player.thirdOwnedParticles, 0);
            assert.notEqual(player.fourthOwnedParticles, 0);
            assert.notEqual(player.fifthOwnedParticles, 0);
        });
    });
});