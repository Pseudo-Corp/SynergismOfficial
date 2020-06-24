
    function resettimers() {
        player.prestigecounter += 0.05;
        player.transcendcounter += 0.05;
        player.reincarnationcounter += 0.05;
    }
    
    function displayruneinformation(i,updatelevelup) {
        updatelevelup = (updatelevelup === null || updatelevelup === undefined) ? true : updatelevelup;
        
        var m = effectiveLevelMult
        let antmult = Math.pow(1.01, player.antUpgrades[8] + bonusant8)
        let SIMult1 = (1 + player.researches[83]/50);
        let SILevelMult = (1 + player.researches[84]/1000)
        let mult1 = (1 + player.researches[91]/100);
        let mult2 = (1 + player.researches[92]/100);
        let recycleMult = 1/(1 - 0.05 * player.achievements[80] - 0.05 * player.achievements[87] - 0.05 * player.achievements[94] - 0.05 * player.achievements[101] - 0.05 * player.achievements[108] - 0.05 * player.achievements[115] - 0.075 * player.achievements[122] - 0.075 * player.achievements[129] - 0.05 * player.upgrades[61] - Math.min(0.25,rune4level/800))
        let s = 0;
        if (player.upgrades[71] == 1 && i == 1){s = player.runelevels[0]}
        if (player.upgrades[71] == 1 && i == 2){s = player.runelevels[1]}
        if (player.upgrades[71] == 1 && i == 3){s = player.runelevels[2]}
        if (player.upgrades[71] == 1 && i == 4){s = player.runelevels[3]}
        if (player.upgrades[71] == 1 && i == 5){s = player.runelevels[4]}
        

        if (i == 1) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "+1 Accelerator, +0.5% Accelerators per level. +1 Accelerator Boost every 10 levels!"}
            document.getElementById("runeshowpower1").childNodes[0].textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(rune1level * m)) + " Accelerators, +" + (rune1level/2  * m).toPrecision(4) +"% Accelerators, +" + format(Math.floor(rune1level/10 * m)) + " Accelerator Boosts."
            if (updatelevelup)document.getElementById("runedisplayexp").textContent = "+" + format(antmult * recycleMult * mult1 * mult2 * (1 + player.researches[78]/250) * (25 + 3 * player.researches[22] + 2 * player.researches[23] + 5 * player.upgrades[61] + s)) + " EXP per offering."
        }
        if (i == 2) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "~(floor(Level/10)) Multipliers every 10 levels, +0.5% Multipliers per level. Tax growth is delayed more for each level!"}
            document.getElementById("runeshowpower2").childNodes[0].textContent = "Duplication Rune Bonus: " + "+" + format(Math.floor(rune2level * m / 10) * Math.floor(10 + rune2level * m /10) / 2) + " Multipliers, +" + format(m *rune2level/2) +"% Multipliers, -" + (99.9 * (1 - Math.pow(6, - (rune2level * m)/500))).toPrecision(4)  + "% Tax Growth."
            if (updatelevelup)document.getElementById("runedisplayexp").textContent = "+" + format(antmult * recycleMult * mult1 * mult2 * (1 + player.researches[80]/250) * (25 + 3 * player.researches[22] + 2 * player.researches[23] + 5 * player.upgrades[61] + s)) + " EXP per offering."
        }
        if (i == 3) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "~(1 + Level^2 * 2^Level / 256)x Crystal Production. +1 free level for each Crystal upgrade per 10 levels!"}
            document.getElementById("runeshowpower3").childNodes[0].textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(rune3level * m, 2).times(Decimal.pow(2, rune3level * m - 8).add(1))) + ", gain +" + format(Math.floor(rune3level/10 * m)) + " free crystal levels."
            if (updatelevelup)document.getElementById("runedisplayexp").textContent = "+" + format(antmult * recycleMult * mult1 * mult2 * (1 + player.researches[79]/250) * (25 + 3 * player.researches[22] + 2 * player.researches[23] + 5 * player.upgrades[61] + s)) + " EXP per offering."
        }
        if (i == 4) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "+0.25% building cost growth delay per level, +0.125% offering recycle chance per level [MAX: 25%], 2^((200 - Level)/550) Tax growth multiplier AFTER level 200"}
            document.getElementById("runeshowpower4").childNodes[0].textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (rune4level/4 * m).toPrecision(3) + "%. Offering recycle chance +: " + Math.min(25,rune4level/8) + "%. -" + (99 * (1 - Math.pow(4, Math.min(0, (200 - rune4level)/550)))).toPrecision(4) + "% Tax Growth"
            if (updatelevelup)document.getElementById("runedisplayexp").textContent = "+" + format(antmult * recycleMult * mult1 * mult2 * (1 + player.researches[77]/250) * (25 + 3 * player.researches[22] + 2 * player.researches[23] + 5 * player.upgrades[61] + s)) + " EXP per offering."
        }
        if (i == 5) {
            if (updatelevelup) {document.getElementById("runeshowlevelup").textContent = "~(2^(level/300) * (1 + level/150))x Obtainium, 1 + Level^2/1440 Ant Hatch Speed, +0.4 * level seconds of offering timer extension."}
            document.getElementById("runeshowpower5").childNodes[0].textContent = "S. Intellect Rune Bonus: " + "Obtainium gain +" + format((100 * (1 + rune5level/150 * m * SILevelMult) * Math.pow(2, rune5level * m * SILevelMult/300) - 100).toPrecision(3),2,true) + "%. Ant Speed: x" + format(1 + Math.pow(rune5level * m * SILevelMult, 2)/1440) + ". Offering timer extension: +" + (rune5level * 0.4).toFixed(2) + " seconds."
            if (updatelevelup)document.getElementById("runedisplayexp").textContent = "+" + format(antmult * recycleMult * SIMult1 * mult1 * mult2 * (25 + 3 * player.researches[22] + 2 * player.researches[23] + 5 * player.upgrades[61] + s)) + " EXP per offering."
        }
       
        
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

    function redeemshards(runeIndexPlusOne,auto,autoMult) {
        auto = auto || false;
        autoMult = autoMult || 1;
        if(player.upgrades[78] == 1){autoMult *= 1000}
        let increaseMaxLevel = {
                    0: player.researches[78],
                    1: player.researches[80],
                    2: player.researches[79],
                    3: player.researches[77],
                    4: 0
                }
        let increaseMaxLevel2 = {
                    0: player.researches[111],
                    1: player.researches[112],
                    2: player.researches[113],
                    3: player.researches[114],
                    4: player.researches[115]
        }
        // runeIndex, the rune being added to
        let runeIndex = runeIndexPlusOne - 1;
        // res1mult, research1?, refers to the 1x17 - 1x20 researches
        let res1mult = 1;
        // SIMult1, refers to 2x18 research
        let SIMult1 = 1;
        // res2mult, research2mult refers to 4x16
        let res2mult = (1 + player.researches[91]/100);
        // res3mult, research3mult refers to 4x17
        let res3mult = (1 + player.researches[92]/100);
        // antmult is bonus from ant upgrade 8
        let antmult = Math.pow(1.01, player.antUpgrades[8] + bonusant8)
        // amount of offerings being spent, if offerings is less than amount set to be bought then set amount to current offerings
        let amount = Math.min(player.runeshards, player.offeringbuyamount * (1 + 999 * player.upgrades[78]));
        // if autobuyer is enabled then set the amount to the proper autobuyer amount based on the shop upgrade level, or current offerings if it's less than that
        if (auto){amount = Math.min(player.runeshards, Math.pow(2, 1 + player.shopUpgrades.offeringAutoLevel) * autoMult)}
        // recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
        let recycleMult = 1/(1 - 0.05 * player.achievements[80] - 0.05 * player.achievements[87] - 0.05 * player.achievements[94] - 0.05 * player.achievements[101] - 0.05 * player.achievements[108] - 0.05 * player.achievements[115] - 0.075 * player.achievements[122] - 0.075 * player.achievements[129] - 0.05 * player.upgrades[61] - Math.min(0.25,rune4level/800));
    
        if (runeIndex == 0){res1mult = (1 + player.researches[78]/250);};
        if (runeIndex == 1){res1mult = (1 + player.researches[80]/250);};
        if (runeIndex == 2){res1mult = (1 + player.researches[79]/250);};
        if (runeIndex == 3){res1mult = (1 + player.researches[77]/250);};
        if (runeIndex == 4){res1mult = 1; SIMult1 = (1 + player.researches[83]/50);};
        if (player.runeshards >= 1) {
            // s stores the value of the currently being upgraded rune as additional exp for completing particle upgrade 3x1
            var s = 0;
    
            if (player.runelevels[runeIndex] < (500 + increaseMaxLevel[runeIndex] + increaseMaxLevel2[runeIndex]) && (runeIndex == 0 || (runeIndex == 1 && player.achievements[38] == 1) || (runeIndex== 2 && player.achievements[44] == 1) || (runeIndex== 3 && player.achievements[102] == 1) || (runeIndex== 4 && player.researches[82] == 1))) {    
                
                if (player.upgrades[71] > 0.5) {s += player.runelevels[runeIndex]}
    
                // Adds exp to the runes, and detracts offerings
                player.runeshards -= amount;
                player.runeexp[runeIndex] += amount * recycleMult * Math.floor((25 + 3 * player.researches[22] + 2 * player.researches[23] + 5 * player.upgrades[61] + s) * res1mult * res2mult * res3mult * SIMult1 * antmult);
                // If upgrade[66] is bought (+3 exp to all runes, particle upgrade 2x1)
                if (player.upgrades[66] > 0.5) {
                    // if each rune is unlocked then apply the bonus +3 exp
                    player.runeexp[0] += 3 * amount * recycleMult
                    if (player.achievements[38] > 0.5) {player.runeexp[1] += 3 * amount * recycleMult}
                    if (player.achievements[44] > 0.5) {player.runeexp[2] += 3 * amount * recycleMult}
                    if (player.achievements[102] > 0.5) {player.runeexp[3] += 3 * amount * recycleMult}
                    if (player.researches[82] > 0.5){player.runeexp[4] += 3 * amount * recycleMult}
                }
                // foreach rune update it's value
                for (let runeToUpdate = 0; runeToUpdate < 5; ++runeToUpdate)	{
                    // r stores the decrease in thrift costs from tax+ challenge, or the decrease in speed/dup costs from m/a-- challenge
                    let r = 1;
                    if (player.challengecompletions.six > 0.5 && runeToUpdate == 3) {r -= 0.02 * player.challengecompletions.six};
                    if (player.challengecompletions.seven > 0.5 && (runeToUpdate == 0 || runeToUpdate == 1)) {r -= 0.02 * player.challengecompletions.seven};
                    while (player.runeexp[runeToUpdate] >= (runeexpbase[runeToUpdate] * Math.pow(player.runelevels[runeToUpdate], 3) * ((4 * player.runelevels[runeToUpdate]) + 100)/500 * r) * Math.max(1, (player.runelevels[runeToUpdate] - 500)/25) * Math.max(1, (player.runelevels[runeToUpdate] - 600)/30) * Math.max(1, (player.runelevels[runeToUpdate]-700)/25) * Math.max(1, Math.pow(1.03, player.runelevels[runeToUpdate] - 750)) && player.runelevels[runeToUpdate] < (500 + increaseMaxLevel[runeToUpdate] + increaseMaxLevel2[runeToUpdate])){
                        player.runelevels[runeToUpdate] += 1;
                    }
                }
                
                displayruneinformation(runeIndexPlusOne);
            }
        }
        calculateRuneLevels();
    }



