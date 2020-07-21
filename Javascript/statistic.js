function loadStatisticsAccelerator() {
    document.getElementById("sA1").textContent = "+"+format(freeUpgradeAccelerator,0,false)
    document.getElementById("sA2").textContent = "+"+format(totalAcceleratorBoost * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + cubeBonusMultiplier[1]),0,false)
    document.getElementById("sA3").textContent = "+"+format(Math.floor(rune1level * effectiveLevelMult),0,true)
    document.getElementById("sA4").textContent = "x"+format(1 + rune1level * 1/200 * effectiveLevelMult,3,true)
    document.getElementById("sA5").textContent = "x"+format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]),3,true)
    document.getElementById("sA6").textContent = "x"+format(Math.pow(1.01, player.achievements[60] + player.achievements[61] + player.achievements[62]),3,true)
    document.getElementById("sA7").textContent = "x"+format(1 + 1/5 * player.researches[1],3,true)
    document.getElementById("sA8").textContent = "x"+format(1 + 1/20 * player.researches[6] + 1/25 * player.researches[7] + 1/40 * player.researches[8] + 3/200 * player.researches[9] + 1/200 * player.researches[10],3,true)
    document.getElementById("sA9").textContent = "x"+format(1 + 1/20 * player.researches[86],3,true)
    document.getElementById("sA10").textContent = "x"+format(1.25,3,true)
    document.getElementById("sA11").textContent = "x"+format(maladaptiveMultiplier[player.usedCorruptions[2]],3,true)
    document.getElementById("sA12").textContent = format(freeAccelerator,0,true)
}