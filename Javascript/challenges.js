function challengeDisplay(i, changefocus, automated) {
    changefocus = (changefocus === null || changefocus === undefined) ? true : changefocus;
    if (changefocus) {
        challengefocus = i;
        document.getElementById("challengeDetails").style.display = "block"
    }

    let quarksMultiplier = 1;
    if (changefocus) {
        challengefocus = i;
        document.getElementById("challengeDetails").style.display = "block";
        triggerChallenge = i
    }

    let maxChallenges = 0;
    if (i <= 5 && changefocus){
        if(player.challengecompletions[i] >= 100){
            document.getElementById('completionSoftcap').textContent = "|| Softcapped past 100! Effective completion count: " + CalcECC('transcend',player.challengecompletions[i])
        }
        else{
            document.getElementById('completionSoftcap').textContent = ""
        }
    }
    

    if (i > 5 && i <= 10) {
        maxChallenges = 25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension + 5 * player.platonicUpgrades[5] + 5 * player.platonicUpgrades[10] + 10 * player.platonicUpgrades[15];
        quarksMultiplier = 10;
        if(player.challengecompletions[i] >= 25 && changefocus){
            document.getElementById('completionSoftcap').textContent = "|| Softcapped past 25! Effective completion count: " + format(CalcECC('reincarnation',player.challengecompletions[i]),2,true)
        }
        else{
            document.getElementById('completionSoftcap').textContent = ""    
        }
    }
    if (i > 10) {
        maxChallenges = 30 + 3 * player.platonicUpgrades[5] + 3 * player.platonicUpgrades[10] + 4 * player.platonicUpgrades[15]
        if(player.challengecompletions[i] >= 10){
            document.getElementById('completionSoftcap').textContent = "|| Softcapped past 10! Effective completion count: " + format(CalcECC('ascension',player.challengecompletions[i]),2,true)
        }
        else{
            document.getElementById('completionSoftcap').textContent = ""
        }
    }
    let descriptor = ""
    let a = document.getElementById("challengeName");
    let b = document.getElementById("challengeFlavor");
    let c = document.getElementById("challengeRestrictions");
    let d = document.getElementById("challengeGoal");
    let e = document.getElementById("challengePer1").childNodes[0];
    let f = document.getElementById("challengePer2").childNodes[0];
    let g = document.getElementById("challengePer3").childNodes[0];
    let h = document.getElementById("challengeFirst1");
    let j = document.getElementById("challengeQuarkBonus");
    let k = document.getElementById("startChallenge");
    let l = document.getElementById("challengeCurrent1");
    let m = document.getElementById("challengeCurrent2");
    let n = document.getElementById("challengeCurrent3");


    if (i === 1 && challengefocus === 1) {
        maxChallenges = 25 + 5 * player.researches[66] + 925 * player.researches[105]
        a.textContent = "No Multipliers Challenge || " + player.challengecompletions[1] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Multipliers make the game a little too fast. Let's take them out!"
        c.textContent = "Transcend and reach the goal except Multipliers do nothing but act like Accelerators, which are nerfed by 50%!"
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "+10 base Multiplier Boosts! [+0.05 to power!] Current: "
        f.textContent = "+10% total Multiplier Boosts! Current: "
        g.textContent = "+0.04 base Rune exp per Offering! Current: "
        h.textContent = "+1 free Multiplier! +1 Base EXP per offering used!"
        k.textContent = "Start [No Multipliers]"
        l.textContent = "+" + format(10 * CalcECC('transcend', player.challengecompletions[1])) + " Boosts"
        m.textContent = "+" + format(10 * CalcECC('transcend', player.challengecompletions[1])) + "% more Boosts"
        n.textContent = "+" + format(0.04 * CalcECC('transcend', player.challengecompletions[1]), 2, true) + " Rune EXP [Highest Completion]"
    }
    if (i === 2 && challengefocus === 2) {
        maxChallenges = 25 + 5 * player.researches[67] + 925 * player.researches[105]
        a.textContent = "No Accelerators Challenge || " + player.challengecompletions[2] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Who needs accelerators? They do basically nothing now."
        c.textContent = "Transcend and reach the goal except Accelerators do nothing! Multipliers are nerfed a bit as well."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "+5 Free Accelerators! Current: "
        f.textContent = "+5% Accelerator Boost Power! Current: "
        g.textContent = "+0.25% Accelerator Power! Current: "
        h.textContent = "+1 base offering for Prestige and Transcensions."
        k.textContent = "Start [No Accelerators]"
        l.textContent = "+" + format(5 * CalcECC('transcend', player.challengecompletions[2])) + " Accelerators"
        m.textContent = "+" + format(5 * CalcECC('transcend', player.challengecompletions[2])) + "% A.Boost Power"
        n.textContent = "+" + format(0.25 * CalcECC('transcend', player.challengecompletions[2]), 2, true) + "% Accelerator Power"
    }
    if (i === 3 && challengefocus === 3) {
        maxChallenges = 25 + 5 * player.researches[68] + 925 * player.researches[105]
        a.textContent = "No Shards Challenge || " + player.challengecompletions[3] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Alright, now you're thinking, how else can I make the game harder?"
        c.textContent = "Transcend and reach the goal except you do not produce Crystals or Mythos Shards."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "Crystal --> Coin conversion exponent +0.04! Current: "
        f.textContent = "+0.5% to Grandmaster production per Mythos producer bought. Current: "
        g.textContent = "When you use a rune, all other runes gain +0.01 EXP. Current: "
        h.textContent = "Gain an offering automatically every 2 seconds!"
        k.textContent = "Start [No Shards]"
        l.textContent = "Exponent +" + format(0.04 * player.challengecompletions[3], 2, true)
        m.textContent = "+" + format(0.5 * CalcECC('transcend', player.challengecompletions[3]), 2, true) + "%"
        n.textContent = "+" + format(0.01 * CalcECC('transcend', player.challengecompletions[3]), 2, true) + " EXP"
    }
    if (i === 4 && challengefocus === 4) {
        maxChallenges = 25 + 5 * player.researches[69] + 925 * player.researches[105]
        a.textContent = "Cost+ Challenge || " + player.challengecompletions[4] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You're getting rich now, but inflation hasn't happened yet? I don't think so!"
        c.textContent = "Transcend and reach the goal except Coin/Crystal producers, Accelerators and Multipliers cost more. [Gets harder each time!]"
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "Accelerator Cost scale slows down by +5 purchases. Current: "
        f.textContent = "Multiplier Cost scale slows down by +2 purchases. Current: "
        g.textContent = "Building Cost Delay +0.5%. Current: "
        h.textContent = "None"
        k.textContent = "Start [Cost+]"
        l.textContent = "Accelerator Delay +" + format(5 * CalcECC('transcend', player.challengecompletions[4]))
        m.textContent = "Multiplier Delay +" + format(2 * CalcECC('transcend', player.challengecompletions[4]))
        n.textContent = "Building Cost Delay +" + format(0.5 * CalcECC('transcend', player.challengecompletions[4]), 2, true) + "%"
    }
    if (i === 5 && challengefocus === 5) {
        maxChallenges = 25 + 5 * player.researches[70] + 925 * player.researches[105]
        a.textContent = "Reduced Diamonds Challenge || " + player.challengecompletions[5] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You ever wonder how you get so many diamonds?"
        c.textContent = "Transcend and reach the goal except you gain far fewer Diamonds from all sources [Gets harder each time!]"
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "+0.01 Coin --> Diamond conversion exponent on Prestige! Current: "
        f.textContent = "Multiply Crystal production by 10! Current: "
        g.textContent = ""
        h.textContent = "None"
        k.textContent = "Start [Reduced Diamonds]"
        l.textContent = "Exponent = ^" + format(0.5 + CalcECC('transcend', player.challengecompletions[5]) / 100, 2, true)
        m.textContent = "Crystal production x" + format(Math.pow(10, CalcECC('transcend', player.challengecompletions[5])))
        n.textContent = ""
    }
    if (i === 6 && challengefocus === 6) {
        a.textContent = "Higher Tax Challenge || " + player.challengecompletions[6] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "The tax man caught wind that you reincarnated recently..."
        c.textContent = "Reincarnate and reach the goal except tax has a lower cap, and Coin production is divided by 1e250."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i], 6)) + " Mythos Shards in challenge."
        e.textContent = "-3.5% Taxes [Multiplicative]! Current: "
        f.textContent = "Thrift Rune Exp +10%! Current: "
        g.textContent = "Prestige Offerings +2%! Current: "
        h.textContent = "-7.5% Taxes!"
        k.textContent = "Start <Higher Tax>"
        l.textContent = "Tax multiplier x" + format(Math.pow(0.965, CalcECC('reincarnation', player.challengecompletions[6])), 3, true)
        m.textContent = "EXP +" + format(10 * CalcECC('reincarnation', player.challengecompletions[6])) + "%"
        n.textContent = "+" + format(2 * CalcECC('reincarnation', player.challengecompletions[6])) + "% Prestige-based Offerings"
    }
    if (i === 7 && challengefocus === 7) {
        a.textContent = "No Multipliers/Accelerators Challenge || " + player.challengecompletions[7] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You're really going to hate this one."
        c.textContent = "Reincarnate and reach the goal except Accelerators and Multipliers do nothing. Coin Production is divided by 1e1,250."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i],7)) + " Mythos Shards in challenge."
        e.textContent = "Accelerator/Multiplier boost power exponent +0.04! Current: "
        f.textContent = "Speed Rune Exp +10%! Current: "
        g.textContent = "Duplication Rune Exp +10%! Current: "
        h.textContent = "Multiplier Boost power +25%! The first Discord-Booster Global Diamond Upgrade."
        k.textContent = "Start <No Multipliers/Accelerators>"
        l.textContent = "Exponent = ^" + format(1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7]), 2, true)
        m.textContent = "EXP +" + format(10 * CalcECC('reincarnation', player.challengecompletions[7])) + "%"
        n.textContent = "EXP +" + format(10 * CalcECC('reincarnation', player.challengecompletions[7])) + "%"
    }
    if (i === 8 && challengefocus === 8) {
        a.textContent = "Cost++ Challenge || " + player.challengecompletions[8] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You thought you could outgrow inflation by Reincarnating?"
        c.textContent = "Reincarnate and reach the goal except Cost Scaling for producers and Accelerators/Multipliers scale much, much faster."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i],8)) + " Mythos Shards in challenge."
        e.textContent = "Base Building Power +0.25! Current: "
        f.textContent = "Prism Rune Exp +20%! Current: "
        g.textContent = "Transcend Offerings +4%! Current: "
        h.textContent = "Unlock the Anthill feature! Includes 20 new Researches. A Global Diamond Upgrade."
        k.textContent = "Start <Cost++>"
        l.textContent = "+" + format(0.25 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        m.textContent = "+" + format(20 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true) + "% EXP"
        n.textContent = "+" + format(4 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true) + "% Transcend-based offerings"
    }
    if (i === 9 && challengefocus === 9) {
        a.textContent = "No Runes Challenge || " + player.challengecompletions[9] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You'll never complain about Prism being bad again."
        c.textContent = "Reincarnate and reach the goal except runes always have level 1 effects. All coin production is divided by e2,000,000."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "+1 free Ant level! Current: "
        f.textContent = "+10% Ant speed [Multiplicative!] Current: "
        g.textContent = "SI Rune Exp +20%! Current: "
        h.textContent = "Unlock the Talismans feature! [In Runes tab]. A Global Diamond Upgrade."
        k.textContent = "Start <No Runes>"
        l.textContent = "+" + format(CalcECC('reincarnation', player.challengecompletions[9])) + " free levels"
        m.textContent = "x" + format(Math.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9])), 2, true) + " Ant Speed"
        n.textContent = "+" + format(20 * CalcECC('reincarnation', player.challengecompletions[9]), 2, true) + "% EXP"
    }
    if (i === 10 && challengefocus === 10) {
        a.textContent = "Sadistic Challenge I || " + player.challengecompletions[10] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "I'm sorry for what I've unleashed onto the world."
        c.textContent = "Reincarnate and reach the goal except run the first five challenges AT THE SAME TIME! Coin Production /e12,500,000."
        d.textContent = "Goal: Gain " + format(challengeRequirement(i, player.challengecompletions[i])) + " Coins in challenge."
        e.textContent = "+100 base ELO for sacrificing ants! Current: "
        f.textContent = "+2% Ant Sacrifice Reward! Current: "
        g.textContent = "Reincarnation Offerings +10%! Current: "
        h.textContent = "Unlock the Ascension Reset Tier!"
        k.textContent = "Start <Sadistic I>"
        l.textContent = "+" + format(100 * CalcECC('reincarnation', player.challengecompletions[10])) + " Ant ELO"
        m.textContent = "+" + format(2 * CalcECC('reincarnation', player.challengecompletions[10])) + "% Ant Sacrifice reward"
        n.textContent = "+" + format(10 * CalcECC('reincarnation', player.challengecompletions[10]), 2, true) + "% Reincarnate-based offerings"
    }
    if (i === 11 && challengefocus === 11) {
        a.textContent = "Reduced Ants Challenge || " + player.challengecompletions[11] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "The great Ant War of '21 wiped off all of the skilled ants."
        c.textContent = "Ascend and reach the goal but only get free ant upgrades and from Challenge8/9 completions. FOR ASCENSION CHALLENGES YOU MUST CLEAR CHALLENGE 10 TO ATTEMPT THEM."
        d.textContent = "Goal: Complete Challenge 10 [Sadistic Challenge I] " + format(challengeRequirement(i, player.challengecompletions[i])) + " times."
        e.textContent = "+12 free Ant Levels! Current: "
        f.textContent = "Ant Speed x(1e5)^completions! Current: "
        g.textContent = "+80 to Rune Caps! Current: "
        h.textContent = "Unlock 15 Researches, and unlock the ability to open Tesseracts!"
        k.textContent = "Start <[(Reduced Ants)]>"
        l.textContent = "+" + format(12 * CalcECC('ascension', player.challengecompletions[11])) + " free ant levels"
        m.textContent = "Ant Speed x" + format(Decimal.pow(1e5, CalcECC('ascension', player.challengecompletions[11])))
        n.textContent = "+" + format(80 * CalcECC('ascension', player.challengecompletions[11])) + " to Rune Caps"
    }
    if (i === 12 && challengefocus === 12) {
        a.textContent = "No Reincarnation Challenge || " + player.challengecompletions[12] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "For some reason, you just can't do it."
        c.textContent = "Ascend and reach the goal but you do not gain Particles and you cannot Reincarnate at all! Ant production ^0.5."
        d.textContent = "Goal: Complete Challenge 10 [Sadistic Challenge I] " + format(challengeRequirement(i, player.challengecompletions[i])) + " times."
        e.textContent = "+50% Obtainium! Current: "
        f.textContent = "+12% Offerings! Current: "
        g.textContent = "+1 Cube Tribute per opening! Current: "
        h.textContent = "Unlock 15 Researches, and unlock the mystical Spirit Power! Find these in the Runes tab."
        k.textContent = "Start <[(No Reincarnation)]>"
        l.textContent = "+" + format(50 * CalcECC('ascension', player.challengecompletions[12])) + "% Obtainium"
        m.textContent = "+" + format(12 * CalcECC('ascension', player.challengecompletions[12])) + "% Offerings"
        n.textContent = "+" + format(CalcECC('ascension', player.challengecompletions[12])) + " additional Cube Tributes"
    }
    if (i === 13 && challengefocus === 13) {
        a.textContent = "Tax+++ Challenge || " + player.challengecompletions[13] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Good luck with the IRS, buddy."
        c.textContent = "Ascend and reach the goal, but taxes are much higher and grow with challenge completions. Ant production ^0.23"
        d.textContent = "Goal: Complete Challenge 10 [Sadistic Challenge I] " + format(challengeRequirement(i, player.challengecompletions[i])) + " times."
        e.textContent = "Taxes -3.33%! Multiplicative! Current: "
        f.textContent = "+6 maximum to Talisman Level Cap! Current: "
        g.textContent = "+3% Spirit Power effectiveness! Current: "
        h.textContent = "Unlock 15 Researches, and unlock the power of the Hypercube!"
        k.textContent = "Start <[(Tax+++)]>"
        l.textContent = "-" + format(100 - 100 * Math.pow(0.966, CalcECC('ascension', player.challengecompletions[13])),3,true) + "% Corruption Tax"
        m.textContent = "+" + format(6 * CalcECC('ascension', player.challengecompletions[13])) + " Talisman Level Cap"
        n.textContent = "+" + format(3 * CalcECC('ascension', player.challengecompletions[13])) + "% Effectiveness"
    }
    if (i === 14 && challengefocus === 14) {
        a.textContent = "No Research Challenge || " + player.challengecompletions[14] + "/" + format(maxChallenges) + " Completions"
        b.textContent = "The dimension that never progressed past the dark ages. Many fear to even step foot."
        c.textContent = "Ascend and reach the goal but you do not gain Obtainium nor are any researches purchasable. Ant production ^0.2."
        d.textContent = "Goal: Complete Challenge 10 [Sadistic Challenge I] " + format(challengeRequirement(i, player.challengecompletions[i])) + " times."
        e.textContent = "+50% stronger effect on researches 1x1 through 1x5. Current: "
        f.textContent = "+1 research purchased per roomba tick! Current: "
        g.textContent = "+200 to Rune Caps! Current: "
        h.textContent = "Unlock 15 Researches, and a way to coalesce your power into the Singularity."
        k.textContent = "Start <[(No Research)]>"
        l.textContent = "+" + format(50 * CalcECC('ascension', player.challengecompletions[14])) + "% Power"
        m.textContent = "+" + format(1 * player.challengecompletions[14]) + " per Tick"
        n.textContent = "+" + format(200 * CalcECC('ascension', player.challengecompletions[14])) + " to Rune Caps"
    }
    if (i === 15 && challengefocus === 15) {
        a.textContent = "SADISTIC CHALLENGE II || " + player.challengecompletions[15] + "/9001 Completions"
        b.textContent = "The worst sin a man can do is making others suffer."
        c.textContent = "Ascend and reach the goal but you're FULLY corrupt and must stay that way."
        d.textContent = "Goal: 1e4T Coins, but get bonuses based on your best attempt."
        e.textContent = "You have no idea "
        f.textContent = "what you have just done "
        g.textContent = "the ant god shakes their mighty head "
        h.textContent = "Enter the singularity."
        k.textContent = "Start <[(Sadistic Challenge II)]>"
        l.textContent = ""
        m.textContent = ""
        n.textContent = ""
    }
    var scoreArray1 = [0, 8, 10, 12, 15, 20, 60, 80, 120, 180, 300]
    var scoreArray2 = [0, 10, 12, 15, 20, 30, 80, 120, 180, 300, 450]
    var scoreArray3 = [0, 20, 30, 50, 100, 200, 250, 300, 400, 500, 750];
    let scoreDisplay = 0;
    if(i <= 5){
        if(player.highestchallengecompletions[i] >= 750){scoreDisplay = scoreArray3[i]}
        else if(player.highestchallengecompletions[i] >= 75){scoreDisplay = scoreArray2[i]}
        else{scoreDisplay = scoreArray1[i]}
    }
    if(i > 5 && i <= 10){
        if(player.highestchallengecompletions[i] >= 60){scoreDisplay = scoreArray3[i]}
        else if(player.highestchallengecompletions[i] >= 25){scoreDisplay = scoreArray2[i]}
        else{scoreDisplay = scoreArray1[i]}
    }
    if (changefocus) {
        j.textContent = ""
    }
    if (player.ascensionCount === 0) {
        descriptor = "Quarks";
        j.style.color = "cyan"
    }
    if (player.challengecompletions[i] >= player.highestchallengecompletions[i] && player.highestchallengecompletions[i] < maxChallenges && changefocus && player.ascensionCount < 1) {
        j.textContent = "Gain " + Math.floor(quarksMultiplier * player.highestchallengecompletions[i] / 10 + 1 + player.cubeUpgrades[1] + player.cubeUpgrades[11] + player.cubeUpgrades[21] + player.cubeUpgrades[31] + player.cubeUpgrades[41]) + " " + descriptor + " for completing this challenge [First Time Bonus]!"
    }
    if(player.challengecompletions[i] >= player.highestchallengecompletions[i] && player.highestchallengecompletions[i] < maxChallenges && changefocus && player.ascensionCount >= 1){
        j.textContent = "Completing the challenge adds " + ((i > 5) ? 2 : 1) + " to Ascension Bank and increase base Score by " + scoreDisplay + "." 
    }
    if (player.challengecompletions[i] >= player.highestchallengecompletions[i] && player.highestchallengecompletions[i] < 10 && i > 10) {
        j.textContent = "Gain 1 Wow! HYPERCUBE for completing this challenge (First Time Bonus)"
    }

    (i <= 10 && player.researches[150] > 0) ?
        (document.getElementById("toggleAutoChallengeIgnore").style.display = "block", document.getElementById('toggleAutoChallengeIgnore').style.border = "2px solid green") :
        document.getElementById("toggleAutoChallengeIgnore").style.display = "none";

    let constructor = "ON"
    if (!player.autoChallengeToggles[i]) {
        constructor = "OFF";
        document.getElementById('toggleAutoChallengeIgnore').style.border = "2px solid red"
    }
    document.getElementById("toggleAutoChallengeIgnore").textContent = "Automatically Run Chal." + i + " [" + constructor + "]"

    let ella = document.getElementById("toggleAutoChallengeStart");
    (player.autoChallengeRunning) ?
        (ella.textContent = "Auto Challenge Sweep [ON]", ella.style.border = "2px solid gold") :
        (ella.textContent = "Auto Challenge Sweep [OFF]", ella.style.border = "2px solid red");
}

function getChallengeConditions(i) {
    if (player.currentChallenge.reincarnation === 9) {
        rune1level = 1;
        rune2level = 1;
        rune3level = 1;
        rune4level = 1;
        rune5level = 1;
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
    }
    prestigePointGain = new Decimal('0')
    if (i >= 6){
        transcendPointGain = new Decimal('0')
    }
    if (i >= 11){
        reincarnationPointGain = new Decimal('0')
    }
    calculateRuneLevels();
}

function toggleRetryChallenges() {
    if (player.retrychallenges) {
        player.retrychallenges = false;
        document.getElementById("retryChallenge").textContent = "Retry Challenges: OFF"
    } else {
        player.retrychallenges = true;
        document.getElementById("retryChallenge").textContent = "Retry Challenges: ON"
    }
}

function highestChallengeRewards(chalNum, highestValue) {
    let multiplier = 1 / 10
    if (chalNum >= 6) {
        multiplier = 1;
    }
    if (player.ascensionCount === 0) {
        player.worlds += (1 + Math.floor(highestValue * multiplier) * 100 / 100)
    }
}

//Works to mitigate the difficulty of calculating challenge multipliers when considering softcapping
function calculateChallengeRequirementMultiplier(type, completions, special) {
    special = special || 0;
    let requirementMultiplier = 1;
    requirementMultiplier *= Math.max(1, hyperchallengedMultiplier[player.usedCorruptions[4]] / (1 + player.platonicUpgrades[8]));
    switch (type) {
        case "transcend":
            (completions >= 75) ?
                requirementMultiplier *= Math.pow(1 + completions, 12) / Math.pow(75, 8) :
                requirementMultiplier *= Math.pow(1 + completions, 2);
            requirementMultiplier *= challenge15Rewards.transcendChallengeReduction
            return (requirementMultiplier)
        case "reincarnation":
            if (completions >= 60){
                if(special === 8){ /*Multiplier is reduced significantly for challenges requiring mythos shards*/
                    requirementMultiplier *= Math.pow(1 + completions,1) / 60
                }
                else if(special === 7){
                    requirementMultiplier *= Math.pow(1 + completions,1) / 30
                }
                else if(special === 6){
                    requirementMultiplier *= Math.pow(1 + completions,2) / 360
                }
                else{
                    requirementMultiplier *= Math.pow(1 + completions, 5) / 7200
                }
            }
            if (completions >= 25){
                requirementMultiplier *= Math.pow(1 + completions, 5) / 625
            }
            if (completions < 25){
            requirementMultiplier *= Math.min(Math.pow(1 + completions, 2), Math.pow(1.3797, completions));
            }
            requirementMultiplier *= challenge15Rewards.reincarnationChallengeReduction
            return requirementMultiplier
        case "ascension":
            (completions >= 10) ?
                requirementMultiplier *= (2 * (1 + completions) - 10) :
                requirementMultiplier *= (1 + completions);
            return (requirementMultiplier)
    }
}

//Works to mitigate the difficulty of calculating challenge reward multipliers when considering softcapping
function CalcECC(type, completions) { //ECC stands for "Effective Challenge Completions"
    let effective = 0;
    switch (type) {
        case "transcend":
            effective += Math.min(100, completions);
            effective += 1 / 20 * (Math.max(100, completions) - 100);
            return (effective);
        case "reincarnation":
            effective += Math.min(25, completions);
            effective += 1 / 2 * (Math.max(25, completions) - 25);
            return (effective);
        case "ascension":
            effective += Math.min(10, completions);
            effective += 1 / 2 * (Math.max(10, completions) - 10);
            return (effective);
    }
}

function challengeRequirement(challenge, completion, special) {
    special = special || 0
    let base = challengeBaseRequirements[challenge];
    if (challenge <= 5) {
        return Decimal.pow(10, base * calculateChallengeRequirementMultiplier("transcend", completion, special))
    } else if (challenge <= 10) {
        let c10Reduction = 0;
        if (challenge === 10) {
            c10Reduction = (1e8 * (player.researches[140] + player.researches[155] + player.researches[170] + player.researches[185]) + 2e7 * player.shopUpgrades.challenge10Tomes)
        }
        return Decimal.pow(10, (base - c10Reduction) * calculateChallengeRequirementMultiplier('reincarnation', completion, special))
    } else if (challenge <= 14) {
        return calculateChallengeRequirementMultiplier("ascension", completion, special)
    } else if (challenge === 15) {
        return Decimal.pow(10, 4 * Math.pow(10, 30))
    }
}

function runChallengeSweep(dt){
//This auto challenge thing is sure a doozy aint it
if (player.researches[150] > 0 && player.autoChallengeRunning && (player.reincarnationPoints.greaterThanOrEqualTo('0') || player.currentChallenge.ascension === 12)) {
    autoChallengeTimerIncrement += dt
    if (autoChallengeTimerIncrement >= player.autoChallengeTimer.exit) {
        if (player.currentChallenge.transcension !== 0 && player.autoChallengeIndex <= 5) {
            resetCheck('challenge', null, true)
            autoChallengeTimerIncrement = 0;
            player.autoChallengeIndex += 1
            if (player.autoChallengeTimer.enter >= 1) {
                toggleAutoChallengeTextColors(3)
            }
        }
        if (player.currentChallenge.reincarnation !== 0 && player.autoChallengeIndex > 5) {
            resetCheck('reincarnationchallenge', null, true)
            autoChallengeTimerIncrement = 0;
            player.autoChallengeIndex += 1
            if (player.autoChallengeTimer.enter >= 1) {
                toggleAutoChallengeTextColors(3)
            }
        }
        if (player.autoChallengeIndex > 10) {
            player.autoChallengeIndex = 1
            if (player.autoChallengeTimer.start >= 1) {
                toggleAutoChallengeTextColors(1)
            }
        }
    }
    if (player.autoChallengeIndex === 1 && autoChallengeTimerIncrement >= player.autoChallengeTimer.start) {
        while (!player.autoChallengeToggles[player.autoChallengeIndex]) {
            player.autoChallengeIndex += (!player.autoChallengeToggles[player.autoChallengeIndex]) ? 1 : 0;
            if (player.autoChallengeIndex === 10) {
                break;
            }
        }
        if (player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
            autoChallengeTimerIncrement = 0;
        }
        toggleChallenges(player.autoChallengeIndex, true);
        if (player.autoChallengeTimer.exit >= 1) {
            toggleAutoChallengeTextColors(2)
        }
    }
    if (player.autoChallengeIndex !== 1 && autoChallengeTimerIncrement >= player.autoChallengeTimer.enter) {
        if (player.currentChallenge.transcension === 0 && player.autoChallengeIndex <= 5) {
            while (!player.autoChallengeToggles[player.autoChallengeIndex]) {
                player.autoChallengeIndex += 1
                if (player.autoChallengeIndex > 10) {
                    player.autoChallengeIndex = 1;
                    if (player.autoChallengeTimer.start >= 1) {
                        toggleAutoChallengeTextColors(1)
                    }
                    break;
                }
            }
            if (player.autoChallengeIndex !== 1) {
                toggleChallenges(player.autoChallengeIndex, true);
                if (player.autoChallengeTimer.exit >= 1) {
                    toggleAutoChallengeTextColors(2)
                }
            }
            autoChallengeTimerIncrement = 0;
        }
        if (player.currentChallenge.reincarnation === 0 && player.autoChallengeIndex > 5) {
            while (player.challengecompletions[player.autoChallengeIndex] >= (25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension + 5 * player.platonicUpgrades[5]) || !player.autoChallengeToggles[player.autoChallengeIndex]) {
                player.autoChallengeIndex += 1
                if (player.autoChallengeIndex > 10) {
                    player.autoChallengeIndex = 1;
                    if (player.autoChallengeTimer.start >= 1) {
                        toggleAutoChallengeTextColors(1)
                    }
                    break;
                }
            }
            if (player.autoChallengeIndex !== 1) {
                toggleChallenges(player.autoChallengeIndex, true);
                if (player.autoChallengeTimer.exit >= 1) {
                    toggleAutoChallengeTextColors(2)
                }
            }
            autoChallengeTimerIncrement = 0;
        }
    }
}
}
