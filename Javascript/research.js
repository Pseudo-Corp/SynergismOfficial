function buyResearch(index, auto) {
    auto = auto || false
    let c14 = 0;
    let spiritBonus = 0;
    let maxResearchIndex = maxRoombaResearchIndex(player);
    if (index <= 5) {
        c14 += player.challengecompletions[14]
    }
    if (index === 84) {
        spiritBonus += Math.ceil(20 * calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[5])
    }

    if (player.autoResearchToggle && player.autoResearch > 0.5 && !auto) {
        let p = player.autoResearch
        if (player.researches[p] === researchMaxLevels[p]) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "green"
        } else if (player.researches[p] > 0.5) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "purple"
        } else {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "black"
        }
    }
    if (!auto && player.autoResearchToggle && player.shopUpgrades.obtainiumAutoLevel > 0.5 && player.cubeUpgrades[9] === 0) {
        player.autoResearch = index;
        document.getElementById("res" + index).style.backgroundColor = "orange"
    }

    let buyamount = 1;
    let i = 1;
    if (maxbuyresearch || auto) {
        buyamount = 1000
    }
    if (auto || !player.autoResearchToggle) {
        while (player.researches[index] < (researchMaxLevels[index] + c14 + spiritBonus) && player.researchPoints >= (researchBaseCosts[index]) && buyamount >= i) {
            player.researchPoints -= researchBaseCosts[index]
            player.researches[index] += 1;
            researchfiller2 = "Level: " + player.researches[index] + "/" + (researchMaxLevels[index] + c14 + spiritBonus)
            researchDescriptions(index, auto)

            if (index === 47 && player.unlocks.rrow1 === false) {
                player.unlocks.rrow1 = true;
                revealStuff()
            }
            if (index === 48 && player.unlocks.rrow2 === false) {
                player.unlocks.rrow2 = true;
                revealStuff()
            }
            if (index === 49 && player.unlocks.rrow3 === false) {
                player.unlocks.rrow3 = true;
                revealStuff()
            }
            if (index === 50 && player.unlocks.rrow4 === false) {
                player.unlocks.rrow4 = true;
                revealStuff()
            }
            i++
        }
        if (i > 1) {
            revealStuff()
        }
    }

    if (0 < index && index <= maxResearchIndex) {
        if (player.researches[index] === (researchMaxLevels[index] + c14 + spiritBonus)) {
            document.getElementById("res" + index).style.backgroundColor = "green"
        }
    }
    if (auto && player.cubeUpgrades[9] === 1) {
        player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
        if (player.researches[player.autoResearch] >= (researchMaxLevels[player.autoResearch] + c14 + spiritBonus)) {
            player.roombaResearchIndex += 1;
        }
        if (player.roombaResearchIndex <= maxResearchIndex) {
            document.getElementById("res" + researchOrderByCost[player.roombaResearchIndex]).style.backgroundColor = "orange"
        }
    }
    calculateRuneLevels();
    calculateAnts();
}

/**
 * Calculates the max research index for the research roomba
 */
function maxRoombaResearchIndex(p = player) {
    let base = p.ascensionCount > 0 ? 140 : 0; // 125 researches pre-A + 15 from A
    let c11 = p.challengecompletions[11] > 0 ? 15 : 0;
    let c12 = p.challengecompletions[12] > 0 ? 15 : 0;
    let c13 = p.challengecompletions[13] > 0 ? 15 : 0;
    let c14 = p.challengecompletions[14] > 0 ? 15 : 0;
    return base + c11 + c12 + c13 + c14;
}
