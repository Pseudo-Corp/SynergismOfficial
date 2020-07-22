var repeatreset

function resetrepeat(i) {
    clearInterval(repeatreset);
    repeatreset = setInterval(resetdetails, 50, i)
}

function resetdetails(i) {
    var color = ''
    var text = ''
    var r = 0;

    document.getElementById("resetofferings1").src = "Pictures/Offering.png"


    if (player.currentChallenge == "one") {
        r = 1
    }
    if (player.currentChallenge == "two") {
        r = 2
    }
    if (player.currentChallenge == "three") {
        r = 3
    }
    if (player.currentChallenge == "four") {
        r = 4
    }
    if (player.currentChallenge == "five") {
        r = 5
    }


    document.getElementById("resetofferings1").style.display = "block"
    document.getElementById("resetofferings2").style.display = "block"
    if (i == 1) {
        color = 'cyan'
        if (document.getElementById("resetcurrency1").src !== "Pictures/Diamond.png"){
        document.getElementById("resetcurrency1").src = "Pictures/Diamond.png"
        }

        document.getElementById("resetcurrency2").textContent = "+" + format(prestigePointGain)
        document.getElementById("resetobtainium").src = ""
        document.getElementById("resetobtainium2").textContent = ""
        document.getElementById("resetinfo").textContent = "Coins, Coin Producers, Coin Upgrades, and Crystals are reset, but in return you gain diamonds and a few offerings. Required: " + format(player.coinsThisPrestige) + "/1e16 Coins || TIME SPENT: " + format(player.prestigecounter) + " seconds."
        if (player.coinsThisPrestige.greaterThanOrEqualTo(1e16)) {
            document.getElementById("resetinfo").style.color = "limegreen"
        } else {
            document.getElementById("resetinfo").style.color = "crimson"
        }
    }
    if (i == 2) {
        color = 'plum'
        if (document.getElementById("resetcurrency1").src !== "Pictures/Mythos.png"){
        document.getElementById("resetcurrency1").src = "Pictures/Mythos.png"
        }
        document.getElementById("resetcurrency2").textContent = "+" + format(transcendPointGain)
        document.getElementById("resetobtainium").src = ""
        document.getElementById("resetobtainium2").textContent = ""
        document.getElementById("resetinfo").textContent = "Reset all Coin and Diamond Upgrades/Features, Crystal Upgrades & Producers, for Mythos/Offerings. Required: " + format(player.coinsThisTranscension) + "/1e100 Coins || TIME SPENT: " + format(player.transcendcounter) + " seconds." 
        if (player.coinsThisTranscension.greaterThanOrEqualTo(1e100)) {
            document.getElementById("resetinfo").style.color = "limegreen"
        } else {
            document.getElementById("resetinfo").style.color = "crimson"
        }
    }
    if (i == 3) {
        var s = player.currentChallenge
        color = 'red'
        document.getElementById("resetobtainium").src = ""
        document.getElementById("resetcurrency1").src = ""
        document.getElementById("resetcurrency2").textContent = ""
        document.getElementById("resetobtainium2").textContent = ""
        if (player.currentChallenge !== "") {
            document.getElementById("resetinfo").style.color = "aquamarine"
            document.getElementById("resetinfo").textContent = "Are you tired of being in your challenge or stuck? Click to leave challenge " + r + ". Progress: " + format(player.coinsThisTranscension) + "/" + format(Decimal.pow(10, challengebaserequirements[s] * Math.pow(1 + player.challengecompletions[s], 2) * Math.pow(1.5, Math.max(0,player.challengecompletions[s]-75)))) + " Coins. TIME SPENT: " + format(player.transcendcounter) + " seconds."
        }
        if (player.currentChallenge == "") {
            document.getElementById("resetinfo").textContent = "You're not in a challenge right now. Get in one before you can leave it, duh!"
            document.getElementById("resetinfo").style.color = "crimson"
        }

    }
    if (i == 4) {
        color = 'green'
        if (document.getElementById("resetcurrency1").src !== "Pictures/Particle.png"){
        document.getElementById("resetcurrency1").src = "Pictures/Particle.png"
        }
        document.getElementById("resetcurrency2").textContent = "+" + format(reincarnationPointGain)
        document.getElementById("resetobtainium").src = "Pictures/Obtainium.png"
        document.getElementById("resetobtainium2").textContent = "+" + format(Math.floor(obtainiumGain))
        document.getElementById("resetinfo").textContent = "Reset ALL previous reset tiers, but gain Particles, Obtainium and Offerings! Required: " + format(player.transcendShards) + "/1e300 Mythos Shards || TIME SPENT: " + format(player.reincarnationcounter) + " seconds."
        if (player.transcendShards.greaterThanOrEqualTo(1e300)) {
            document.getElementById("resetinfo").style.color = "limegreen"
        } else {
            document.getElementById("resetinfo").style.color = "crimson"
        }
    }
    if (i == 5) {
        color = 'cyan'
        if (document.getElementById("resetcurrency1").src !== "Pictures/Diamond.png"){
        document.getElementById("resetcurrency1").src = "Pictures/Diamond.png"
        }
        document.getElementById("resetcurrency2").textContent = "-" + format(player.acceleratorBoostCost)
        document.getElementById("resetobtainium").src = ""
        document.getElementById("resetobtainium2").textContent = ""
        document.getElementById("resetinfo").textContent = "Reset Coin Producers/Upgrades, Crystals and Diamonds in order to increase the power of your Accelerators. Required: " + format(player.prestigePoints) + "/" + format(player.acceleratorBoostCost) + " Diamonds."
        document.getElementById("resetinfo").style.color = "cyan"
    }
    if (i == 6) {
        var s = player.currentChallengeRein
        let goal = "transcendShards";
        let goaldesc = " Mythos Shards"
        if (player.currentChallengeRein == "nine" || player.currentChallengeRein == "ten"){goal = "coins"; goaldesc = " Coins"}
        color = 'red'
        document.getElementById("resetobtainium").src = ""
        document.getElementById("resetcurrency1").src = ""
        document.getElementById("resetcurrency2").textContent = ""
        document.getElementById("resetobtainium2").textContent = ""
        document.getElementById("resetinfo").style.color = "silver"
        if (player.currentChallengeRein !== "") {
 
            document.getElementById("resetinfo").style.color = "silver"
            document.getElementById("resetinfo").textContent = "Are you done or tired of being in your challenge? Click to leave challenge " + s + ". Progress: " + format(player[goal]) + "/" + format(Decimal.pow(10, challengebaserequirementsrein[s] * Math.min(Math.pow(1.3797, player.challengecompletions[s]),Math.pow(1 + player.challengecompletions[s], 2)))) + goaldesc + ". TIME SPENT: " + format(player.reincarnationcounter) + " Seconds."
        }
        if (player.currentChallengeRein == "") {
            document.getElementById("resetinfo").textContent = "You're not in a reincarnation challenge right now. Why would you need to leave it?"
            document.getElementById("resetinfo").style.color = "crimson"
        }
    }
    if (i == 7){
        document.getElementById("resetofferings1").style.display = "none"
        document.getElementById("resetofferings2").style.display = "none"

        document.getElementById("resetobtainium").src = ""
        document.getElementById("resetcurrency1").src = ""
        document.getElementById("resetcurrency2").textContent = ""
        document.getElementById("resetobtainium2").textContent = ""
        document.getElementById("resetinfo").style.color = "gold"
        document.getElementById("resetinfo").textContent = "Ascend. 10x1 is required! +"+format(250*calculateCubeMultiplier(),0,true)+" Wow cubes for doing it (i will add more later lol!) Time: " + format(player.ascensionCounter,0,false) + " Seconds."

    }


    document.getElementById("resetofferings2").textContent = "+" + format(calculateOfferings(i))

}



function updateAutoReset(i) {
    if (i == 1) {
        var t = document.getElementById("prestigeamount").value
         if (t >= 0){player.prestigeamount = t;}
         else {player.prestigeamount = 0;}
    }
    if (i == 2) {
        var u = document.getElementById("transcendamount").value
         if (u >= 0){player.transcendamount = u;}
         else{player.transcendamount = 0;}
    }
    if (i == 3) {
        var v = document.getElementById("reincarnationamount").value
        if (v >= 0){player.reincarnationamount = v;}
        else {player.reincarnationamount = 0;}
    }
}


function reset(i,fast) {
    fast = fast || false
    resetofferings(i)
    resetUpgrades(1,fast);
    player.coins = new Decimal("102");
    player.coinsThisPrestige = new Decimal("100");
    player.firstOwnedCoin = 0;
    player.firstGeneratedCoin = new Decimal("0");
    player.firstCostCoin = new Decimal("100");
    player.secondOwnedCoin = 0;
    player.secondGeneratedCoin = new Decimal("0");
    player.secondCostCoin = new Decimal("2e3");
    player.thirdOwnedCoin = 0;
    player.thirdGeneratedCoin = new Decimal("0");
    player.thirdCostCoin = new Decimal("4e4");
    player.fourthOwnedCoin = 0;
    player.fourthGeneratedCoin = new Decimal("0");
    player.fourthCostCoin = new Decimal("8e5");
    player.fifthOwnedCoin = 0;
    player.fifthGeneratedCoin = new Decimal("0");
    player.fifthCostCoin = new Decimal("1.6e7");
    player.firstGeneratedDiamonds = new Decimal("0");
    player.secondGeneratedDiamonds = new Decimal("0");
    player.thirdGeneratedDiamonds = new Decimal("0");
    player.fourthGeneratedDiamonds = new Decimal("0");
    player.fifthGeneratedDiamonds = new Decimal("0");
    player.multiplierCost = new Decimal("1e5");
    player.multiplierBought = 0;
    player.acceleratorCost = new Decimal("500");
    player.acceleratorBought = 0;

    player.prestigeCount += 1;

    player.prestigePoints = player.prestigePoints.add(prestigePointGain);
    player.prestigeShards = new Decimal("0");
    player.prestigenoaccelerator = true;
    player.prestigenomultiplier = true;
    player.prestigenocoinupgrades = true;

    player.unlocks.prestige = true;

    if (player.prestigecounter < player.fastestprestige) {
        player.fastestprestige = player.prestigecounter;
    }


    player.prestigecounter = 0;


    if (i > 1.5) {
        resetUpgrades(2,fast);
        player.coinsThisTranscension = new Decimal("100");
        player.firstOwnedDiamonds = 0;
        player.firstCostDiamonds = new Decimal("100");
        player.secondOwnedDiamonds = 0;
        player.secondCostDiamonds = new Decimal("1e5");
        player.thirdOwnedDiamonds = 0;
        player.thirdCostDiamonds = new Decimal("1e15");
        player.fourthOwnedDiamonds = 0;
        player.fourthCostDiamonds = new Decimal("1e40");
        player.fifthOwnedDiamonds = 0;
        player.fifthCostDiamonds = new Decimal("1e100");
        player.firstGeneratedMythos = new Decimal("0");
        player.secondGeneratedMythos = new Decimal("0");
        player.thirdGeneratedMythos = new Decimal("0");
        player.fourthGeneratedMythos = new Decimal("0");
        player.fifthGeneratedMythos = new Decimal("0");
        player.acceleratorBoostBought = 0;
        player.acceleratorBoostCost = new Decimal("1e3");

        player.transcendCount += 1;


        player.prestigePoints = new Decimal("0");
        player.transcendPoints = player.transcendPoints.add(transcendPointGain);
        player.transcendShards = new Decimal("0");
        player.transcendnocoinupgrades = true;
        player.transcendnocoinorprestigeupgrades = true;
        player.transcendnoaccelerator = true;
        player.transcendnomultiplier = true;

        if (player.achievements[78] > 0.5) {
            player.firstOwnedDiamonds += 1
        }
        if (player.achievements[85] > 0.5) {
            player.secondOwnedDiamonds += 1
        }
        if (player.achievements[92] > 0.5) {
            player.thirdOwnedDiamonds += 1
        }
        if (player.achievements[99] > 0.5) {
            player.fourthOwnedDiamonds += 1
        }
        if (player.achievements[106] > 0.5) {
            player.fifthOwnedDiamonds += 1
        }

        if (player.achievements[4] > 0.5) {
            player.upgrades[81] = 1
        }
        if (player.achievements[11] > 0.5) {
            player.upgrades[82] = 1
        }
        if (player.achievements[18] > 0.5) {
            player.upgrades[83] = 1
        }
        if (player.achievements[25] > 0.5) {
            player.upgrades[84] = 1
        }
        if (player.achievements[32] > 0.5) {
            player.upgrades[85] = 1
        }
        if (player.achievements[80] > 0.5) {
            player.upgrades[87] = 1
        }

        if (player.transcendcounter < player.fastesttranscend && player.currentChallenge == "") {
            player.fastesttranscend = player.transcendcounter;
        }

        player.transcendcounter = 0;



    }
    if (i > 2.5) {

        player.researchPoints += Math.floor(obtainiumGain);

        let opscheck = obtainiumGain/(1 + player.reincarnationcounter)
        if (opscheck > player.obtainiumpersecond){
        player.obtainiumpersecond = opscheck
        }
        
        resetUpgrades(3,fast);
        player.coinsThisReincarnation = new Decimal("100");
        player.firstOwnedMythos = 0;
        player.firstCostMythos = new Decimal("1");
        player.secondOwnedMythos = 0;
        player.secondCostMythos = new Decimal("1e2");
        player.thirdOwnedMythos = 0;
        player.thirdCostMythos = new Decimal("1e4");
        player.fourthOwnedMythos = 0;
        player.fourthCostMythos = new Decimal("1e8");
        player.fifthOwnedMythos = 0;
        player.fifthCostMythos = new Decimal("1e16");
        player.firstGeneratedParticles = new Decimal("0");
        player.secondGeneratedParticles = new Decimal("0");
        player.thirdGeneratedParticles = new Decimal("0");
        player.fourthGeneratedParticles = new Decimal("0");
        player.fifthGeneratedParticles = new Decimal("0");

        player.reincarnationCount += 1;

        player.transcendPoints = new Decimal("0");
        player.reincarnationPoints = player.reincarnationPoints.add(reincarnationPointGain);
        player.reincarnationShards = new Decimal("0");
        player.challengecompletions = {
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0,
            six: player.challengecompletions.six,
            seven: player.challengecompletions.seven,
            eight: player.challengecompletions.eight,
            nine: player.challengecompletions.nine,
            ten: player.challengecompletions.ten
        }

        if (player.shopUpgrades.instantChallengeBought && player.currentChallengeRein == ""){
            player.challengecompletions.one = player.highestchallengecompletions.one
            player.challengecompletions.two = player.highestchallengecompletions.two
            player.challengecompletions.three = player.highestchallengecompletions.three
            player.challengecompletions.four = player.highestchallengecompletions.four
            player.challengecompletions.five = player.highestchallengecompletions.five

        }

        player.reincarnatenocoinupgrades = true;
        player.reincarnatenocoinorprestigeupgrades = true;
        player.reincarnatenocoinprestigeortranscendupgrades = true;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = true;
        player.reincarnatenoaccelerator = true;
        player.reincarnatenomultiplier = true;

        if (player.reincarnationcounter < player.fastestreincarnate && player.currentChallengeRein == "") {
            player.fastestreincarnate = player.reincarnationcounter;
        }
        if (player.ascensionCount > 0){
            let toAdd = Math.min(1000, 100/100 * Math.floor(player.reincarnationcounter / 60));
            player.wowCubes += toAdd;
            player.cubesThisAscension.reincarnation += toAdd;
            if (i < 3.5)
                updateCubesPerSec()
        }
        calculateCubeBlessings();
        player.reincarnationcounter = 0;


        if (player.autoResearchToggle && player.autoResearch > 0.5){
            buyResearch(player.autoResearch, true)
        }
        calculateRuneLevels();
        calculateAnts();

    }

    if(i > 3.5){
    resetResearches();
    resetAnts();
    resetTalismans();
    player.reincarnationPoints = new Decimal("0");
    player.reincarnationShards = new Decimal("0");
    player.obtainiumpersecond = 0;
    player.maxobtainiumpersecond = 0;
    player.offeringpersecond = 0;
    player.antPoints = new Decimal("0");
    player.antSacrificePoints = 0;
    player.antSacrificeTimer = 0;
    player.antUpgrades[12] = 0;
    for(var j = 61; j <= 80; j++){
        player.upgrades[j] = 0;
    }
    for(var j = 94; j <= 100; j++){
        player.upgrades[j] = 0;
    }
    player.firstOwnedParticles = 0;
    player.secondOwnedParticles = 0;
    player.thirdOwnedParticles = 0;
    player.fourthOwnedParticles = 0;
    player.fifthOwnedParticles = 0;
    player.firstCostParticles = new Decimal("1");
    player.secondCostParticles = new Decimal("100");
    player.thirdCostParticles = new Decimal("1e4");
    player.fourthCostParticles = new Decimal("1e8");
    player.fifthCostParticles = new Decimal("1e16");
    player.runeexp = [0,0,0,0,0];
    player.runelevels = [0,0,0,0,0];
    player.runeshards = 0;
    player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0];

    player.runelevels[0] = 3 * player.cubeUpgrades[26];
    player.runelevels[1] = 3 * player.cubeUpgrades[26];
    player.runelevels[2] = 3 * player.cubeUpgrades[26];
    player.runelevels[3] = 3 * player.cubeUpgrades[26];
    player.runelevels[4] = 3 * player.cubeUpgrades[26];

    if(player.cubeUpgrades[27] == 1){
    player.firstOwnedParticles = 1;
    player.secondOwnedParticles = 1;
    player.thirdOwnedParticles = 1;
    player.fourthOwnedParticles = 1;
    player.fifthOwnedParticles = 1;
    }

    player.researchPoints = 1000 * player.cubeUpgrades[28]
    
    player.researches[65] = player.cubeUpgrades[42]
    player.researches[76] = player.cubeUpgrades[42]
    player.researches[81] = 2 * player.cubeUpgrades[43]

    player.reincarnationcounter = 3 * player.cubeUpgrades[46]

    if(player.cubeUpgrades[48] > 0){player.firstOwnedAnts += 1}

    player.challengecompletions = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: player.cubeUpgrades[49],
        seven: player.cubeUpgrades[49],
        eight: player.cubeUpgrades[49],
        nine: 0,
        ten: 0
    }

    player.highestchallengecompletions = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: player.cubeUpgrades[49],
        seven: player.cubeUpgrades[49],
        eight: player.cubeUpgrades[49],
        nine: 0,
        ten: 0
    }

    player.roombaResearchIndex = 1;

    for (j = 1; j <= (125); j++) {
        var k = "res" + j
        if (player.researches[j] > 0.5 && player.researches[j] < researchMaxLevels[j]) {document.getElementById(k).style.backgroundColor = "purple"}
        else if (player.researches[j] > 0.5 && player.researches[j] >= researchMaxLevels[j]) {document.getElementById(k).style.backgroundColor = "green"}
        else {document.getElementById(k).style.backgroundColor = "black"}
    }

    calculateAnts();
    calculateRuneLevels();
    calculateAntSacrificeELO();
    calculateTalismanEffects();
    calculateObtainium();

    player.ascensionCount += 1;
    player.wowCubes += 100/100 * calculateCubeMultiplier() * 250;
    player.cubesThisAscension.challenges = 0;
    player.cubesThisAscension.reincarnation = 0;
    player.cubesThisAscension.maxCubesPerSec = 0;
    player.cubesThisAscension.ascension = 100/100 * calculateCubeMultiplier() * 250;
    player.ascensionCounter = 0;

    updateTalismanInventory();
    updateTalismanAppearance(1);
    updateTalismanAppearance(2);
    updateTalismanAppearance(3);
    updateTalismanAppearance(4);
    updateTalismanAppearance(5);
    updateTalismanAppearance(6);
    updateTalismanAppearance(7);
    calculateCubeBlessings();

    if(player.cubeUpgrades[4] === 1){
        player.upgrades[94] = 1;
        player.upgrades[95] = 1;
        player.upgrades[96] = 1;
        player.upgrades[97] = 1;
        player.upgrades[98] = 1;
    }
    if(player.cubeUpgrades[5] === 1){
        player.upgrades[99] = 1;
    }
    if(player.cubeUpgrades[6] === 1){
        player.upgrades[100] = 1
    }

    for(var j = 61; j <= 80; j++){
        document.getElementById("upg"+j).style.backgroundColor = "black"
    }
    for(var j = 94; j <= 100; j++){
        if (player.upgrades[j] == 0){
        document.getElementById("upg"+j).style.backgroundColor = "black"
        }
    }
    document.getElementById("toggleofferingbuy").innerHTML = "Toggle amount to use per sacrifice"
    }



    if (i > 0.5) {
        player.unlocks.prestige = true
    }
    if (i > 1.5) {
        player.unlocks.transcend = true
    }
    if (i > 2.5) {
        player.unlocks.reincarnate = true
    }
    if (!fast){
    revealStuff();
    }
}

function resetUpgrades(i, fast) {
    fast = fast || false
    if (i > 2.5) {
        var i
        for (i = 41; i < 61; i++) {
            if (i !== 46) {
                player.upgrades[i] = 0;
            }
        }

        if (player.researches[41] == 0) {
            player.upgrades[46] = 0;
        }

        player.keepUpgrades.autobuyers = false;

        if (player.researches[41] < 0.5) {
            player.upgrades[88] = 0;
        }
        if (player.achievements[50] == 0) {
            player.upgrades[89] = 0;
        }
        if (player.researches[42] < 0.5) {
            player.upgrades[90] = 0;
            player.keepUpgrades.generators = false;
        }
        if (player.researches[43] < 0.5) {
            player.upgrades[91] = 0;
            player.keepUpgrades.coinUpgrades = false;
        }
        if (player.researches[44] < 0.5) {
            player.upgrades[92] = 0;
            player.keepUpgrades.prestigeUpgrades = false;
        }
        if (player.researches[45] < 0.5) {
            player.upgrades[93] = 0;
            player.resourceGenerators.diamonds = false;
        }

        player.upgrades[116] = 0;
        player.upgrades[117] = 0;
        player.upgrades[118] = 0;
        player.upgrades[119] = 0;
        player.upgrades[120] = 0;


    }

    var j
    for (j = 1; j < 21; j++) {
        player.upgrades[j] = 0;
    }
    player.upgrades[106] = 0;
    player.upgrades[107] = 0;
    player.upgrades[108] = 0;
    player.upgrades[109] = 0;
    player.upgrades[110] = 0;

    if (i > 1.5) {
        if (player.achievements[4] < 0.5) {
            player.upgrades[81] = 0;
        }
        if (player.achievements[11] < 0.5) {
            player.upgrades[82] = 0;
        }
        if (player.achievements[18] < 0.5) {
            player.upgrades[83] = 0;
        }
        if (player.achievements[25] < 0.5) {
            player.upgrades[84] = 0;
        }
        if (player.achievements[32] < 0.5) {
            player.upgrades[85] = 0;
        }
        if (player.achievements[87] < 0.5) {
            player.upgrades[86] = 0;
        }
        if (player.achievements[80] < 0.5) {
            player.upgrades[87] = 0;
        }



        player.upgrades[101] = 0;
        player.upgrades[102] = 0;
        player.upgrades[103] = 0;
        player.upgrades[104] = 0;
        player.upgrades[105] = 0;


    }

    if (i > 1.5) {
        var k
        for (k = 21; k < 41; k++) {
            player.upgrades[k] = 0;
        }

        player.upgrades[111] = 0;
        player.upgrades[112] = 0;
        player.upgrades[113] = 0;
        player.upgrades[114] = 0;
        player.upgrades[115] = 0;
    }

    if (i > 1.5) {
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
        player.crystalUpgradesCost = [7, 15, 20, 40, 100, 200, 500, 1000]

        var m = 0;
        m += Math.floor(rune3level * effectiveLevelMult / 10) * 100 / 100
        if (player.upgrades[73] > 0.5 && player.currentChallengeRein !== "") {
            m += 10
        }
        player.crystalUpgrades = [m, m, m, m, m, m, m, m]
    }


    

    var x
    for (x = 1; x < player.upgrades.length; x++) {
        upgradeupdate(x, true)
    }
    if (player.achievements[87] > 0.5) {
        player.upgrades[86] = 1
    }
    if (!fast){
    }
}

function resetAnts(){
    player.firstOwnedAnts = 0;
    player.secondOwnedAnts = 0;
    player.thirdOwnedAnts = 0;
    player.fourthOwnedAnts = 0;
    player.fifthOwnedAnts = 0;
    player.sixthOwnedAnts = 0;
    player.seventhOwnedAnts = 0;
    player.eighthOwnedAnts = 0;

    player.firstGeneratedAnts = new Decimal("0");
    player.secondGeneratedAnts = new Decimal("0");
    player.thirdGeneratedAnts = new Decimal("0");
    player.fourthGeneratedAnts = new Decimal("0");
    player.fifthGeneratedAnts = new Decimal("0");
    player.sixthGeneratedAnts = new Decimal("0");
    player.seventhGeneratedAnts = new Decimal("0");
    player.eighthGeneratedAnts = new Decimal("0");

    player.firstCostAnts = new Decimal("1e800");
    player.secondCostAnts = new Decimal("3");
    player.thirdCostAnts = new Decimal("100");
    player.fourthCostAnts = new Decimal("1e4");
    player.fifthCostAnts = new Decimal("1e12");
    player.sixthCostAnts = new Decimal("1e36");
    player.seventhCostAnts = new Decimal("1e100");
    player.eighthCostAnts = new Decimal("1e300");


    let ant12 = player.antUpgrades[12];
    player.antUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ant12];
    player.antPoints = new Decimal("1");

    calculateAnts();
    calculateRuneLevels();
}

function resetResearches(){
    player.researchPoints = 0;
    //Array listing all the research indexes deserving of removal
    let destroy = [null, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25,
                        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
                        51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70,
                        76, 81, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98,
                        101, 102, 103, 104, 106, 107, 108, 109, 110, 116, 117, 118, 121, 122, 123]
    //Iterates through "destroy"
    for(var i = 1; i < destroy.length; i++){player.researches[destroy[i]] = 0;}
}

function resetTalismans(){
    player.talismanLevels = [null, 0, 0, 0, 0, 0, 0, 0];
    player.talismanRarity = [null, 1, 1, 1, 1, 1, 1, 1];

    player.talismanShards = 0;
    player.commonFragments = 0;
    player.uncommonFragments = 0;
    player.rareFragments = 0;
    player.epicFragments = 0;
    player.legendaryFragments = 0;
    player.mythicalFragments = 0;
}