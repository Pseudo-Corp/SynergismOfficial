
    function resettimers() {
        player.prestigecounter += 0.05;
        player.transcendcounter += 0.05;
        player.reincarnationcounter += 0.05;
    }
    
    function displayRuneInformation(i,updatelevelup) {
        updatelevelup = (updatelevelup === null || updatelevelup === undefined) ? true : updatelevelup;
        
        let m = effectiveLevelMult
        let SILevelMult = (1 + player.researches[84]/1000)
		let amountPerOffering = calculateRuneExpGiven(i - 1);
        if (player.upgrades[78] === 1) document.getElementById("toggleofferingbuy").innerHTML = "Toggle amount used by sacrifice, multiplied by 1000<br>due to a Reincarnation Upgrade.";
        

        if (i == 1) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "+1 Accelerator, +0.5% Accelerators per level. +1 Accelerator Boost every 10 levels!"}
            document.getElementById("runeshowpower1").childNodes[0].textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(rune1level * m)) + " Accelerators, +" + (rune1level/2  * m).toPrecision(4) +"% Accelerators, +" + format(Math.floor(rune1level/10 * m)) + " Accelerator Boosts."
        }
        if (i == 2) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "~(floor(Level/10)) Multipliers every 10 levels, +0.5% Multipliers per level. Tax growth is delayed more for each level!"}
            document.getElementById("runeshowpower2").childNodes[0].textContent = "Duplication Rune Bonus: " + "+" + format(Math.floor(rune2level * m / 10) * Math.floor(10 + rune2level * m /10) / 2) + " Multipliers, +" + format(m *rune2level/2) +"% Multipliers, -" + (99.9 * (1 - Math.pow(6, - (rune2level * m)/500))).toPrecision(4)  + "% Tax Growth."
        }
        if (i == 3) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "~(1 + Level^2 * 2^Level / 256)x Crystal Production. +1 free level for each Crystal upgrade per 10 levels!"}
            document.getElementById("runeshowpower3").childNodes[0].textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(rune3level * m, 2).times(Decimal.pow(2, rune3level * m - 8).add(1))) + ", gain +" + format(Math.floor(rune3level/10 * m)) + " free crystal levels."
        }
        if (i == 4) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "+0.25% building cost growth delay per level, +0.125% offering recycle chance per level [MAX: 25%], 2^((200 - Level)/550) Tax growth multiplier AFTER level 200"}
            document.getElementById("runeshowpower4").childNodes[0].textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (rune4level/4 * m).toPrecision(3) + "%. Offering recycle chance +: " + Math.min(25,rune4level/8) + "%. -" + (99 * (1 - Math.pow(4, Math.min(0, (200 - rune4level)/550)))).toPrecision(4) + "% Tax Growth"
        }
        if (i == 5) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "~(2^(level/300) * (1 + level/150))x Obtainium, 1 + Level^2/1440 Ant Hatch Speed, +0.4 * level seconds of offering timer extension."}
            document.getElementById("runeshowpower5").childNodes[0].textContent = "S. Intellect Rune Bonus: " + "Obtainium gain x" + format((1 + (1 + rune5level/150 * m * SILevelMult) * Math.pow(2, rune5level * m * SILevelMult/300)),2,true) + ". Ant Speed: x" + format(1 + Math.pow(rune5level * m * SILevelMult, 2)/1440) + ". Offering timer extension: +" + (rune5level * 0.4).toFixed(2) + " seconds."
		}
		if (updatelevelup)document.getElementById("runedisplayexp").textContent = "+" + format(amountPerOffering) + " EXP per offering."
       
        
    }


    function resetofferings(i) {
        var q = 0
        var a = 0
        var b = 0
        var c = 0
        let persecond = 0;
        if (i >= 3) {
            a += 15
            if (player.achievements[52] > 0.5) {
                a += (25 * Math.min(player.reincarnationcounter/1800, 1))
            }
            if (player.upgrades[62] > 0.5) {
                a += 1 / 5 * (player.challengecompletions.one + player.challengecompletions.two + player.challengecompletions.three + player.challengecompletions.four + player.challengecompletions.five + player.challengecompletions.six + player.challengecompletions.seven + player.challengecompletions.eight)
            }
            a += 3 * player.researches[25]
            if (player.researches[95] == 1){
                a += 40
            }
            a *= Math.pow(player.reincarnationcounter / 600 * Math.pow(Math.min(optimalOfferingTimer/400, player.reincarnationcounter / 400), 1), 0.7)
    
        }
        if (i >= 2) {
            b += 3
            if (player.reincarnationCount > 0) {b += 7}
            if (player.achievements[44] > 0.5) {b += (15 * Math.min(1, player.transcendcounter/1800))}
            b += 1 * player.researches[24]
            b *= Math.pow(player.transcendcounter/540 * Math.pow(Math.min(optimalOfferingTimer/480, player.transcendcounter/480), 1), 0.6)
        }
        if (i >= 1) {
            c += 1
            if (player.transcendCount > 0 || player.reincarnationCount > 0) {c += 2}
            if (player.reincarnationCount > 0) {c += 2}
            if (player.achievements[37] > 0.5) {c += (15 * Math.min(1, player.prestigecounter/1800))}
            c += 1 * player.researches[24]
            c *= Math.pow(player.prestigecounter/480 * Math.pow(Math.min(optimalOfferingTimer/600, player.prestigecounter/600), 1), 0.5)
        }
        q = a + b + c
        if (player.achievements[33] > 0.5) {q *= 1.10}
        if (player.achievements[34] > 0.5) {q *= 1.15}
        if (player.achievements[35] > 0.5) {q *= 1.25}
        if (player.upgrades[38] == 1){q *= 1.20}
        if (player.upgrades[75] > 0.5 && player.maxobtainium !== undefined) {q *= (1 + 2 * Math.min(1, Math.pow(player.maxobtainium/30000000, 0.5)))}
        q *= (1 + 1/50 * player.shopUpgrades.offeringAutoLevel);
        q *= (1 + 1/100 * player.shopUpgrades.cashGrabLevel);
        q *= (1 + 4 * (1 - Math.pow(2, -(player.antUpgrades[6] + bonusant6)/125)))
        q = Math.floor(q) * 100/100
        player.runeshards += q

        if (i==1){persecond = q / (1 + player.prestigecounter);}
        if (i==2){persecond = q / (1 + player.transcendcounter);}
        if (i==3){persecond = q / (1 + player.reincarnationcounter);}

        if (persecond > player.offeringpersecond){
            player.offeringpersecond = persecond;
        }
    }

function redeemShards(runeIndexPlusOne,auto,autoMult) {
	// runeIndex, the rune being added to
	let runeIndex = runeIndexPlusOne - 1;
	
    auto = auto || false;
    autoMult = autoMult || 1;
	if(player.upgrades[78] == 1){autoMult *= 1000}
	
	// How much a runes max level is increased by
    let increaseMaxLevel = [
		5 *(player.researches[78] + player.researches[111]),
		5 *(player.researches[80] + player.researches[112]),
		5 *(player.researches[79] + player.researches[113]),
		5 *(player.researches[77] + player.researches[114]),
		5 *(player.researches[115])
	];

	// Whether or not a rune is unlocked array
	let unlockedRune = [
		true,
		player.achievements[38] > 0.5,
		player.achievements[44] > 0.5,
		player.achievements[102] > 0.5,
		player.researches[82] > 0.5
	];

	let recycleMultiplier = calculateRecycleMultiplier();

	// amount of offerings being spent, if offerings is less than amount set to be bought then set amount to current offerings
    let amount = Math.min(player.runeshards, player.offeringbuyamount * (1 + 999 * player.upgrades[78]));
    // if autobuyer is enabled then set the amount to the proper autobuyer amount based on the shop upgrade level, or current offerings if it's less than that
	if (auto){amount = Math.min(player.runeshards, Math.pow(2, 1 + player.shopUpgrades.offeringAutoLevel) * autoMult)}
    if (player.runeshards >= 1 && player.runelevels[runeIndex] < (500 + increaseMaxLevel[runeIndex]) && unlockedRune[runeIndex]) {

        // Removes the offerings from the player
		player.runeshards -= amount;
		// Adds the exp given by the amount of offerings
		player.runeexp[runeIndex] += amount * calculateRuneExpGiven(runeIndex);
        // foreach rune update it's value
        for (let runeToUpdate = 0; runeToUpdate < 5; ++runeToUpdate) {
			if (unlockedRune[runeToUpdate])
			{
				// If particle upgrade 1x2 is unlocked give each rune 3 exp per offering used
				if (player.upgrades[66] > 0.5)
				{
					player.runeexp[runeToUpdate] += 3 * amount * recycleMultiplier;
				}
				
            	while (player.runeexp[runeToUpdate] >= calculateRuneExpToLevel(runeToUpdate) && player.runelevels[runeToUpdate] < (500 + increaseMaxLevel[runeToUpdate])){
            	    player.runelevels[runeToUpdate] += 1;
				}
			}
        }
        
        displayRuneInformation(runeIndexPlusOne);
    }
    calculateRuneLevels();
}



