function revealStuff() {
    var c1 = document.getElementsByClassName("coinunlock1");
    for (var i = 0; i < c1.length; i++) {
      c1[i].style.display = "none";
    };
    var c2 = document.getElementsByClassName("coinunlock2");
      for (var i = 0; i < c2.length; i++) {
    c2[i].style.display = "none";
      };
      var c3 = document.getElementsByClassName("coinunlock3");
      for (var i = 0; i < c3.length; i++) {
    c3[i].style.display = "none";
      };
      var c4 = document.getElementsByClassName("coinunlock4");
      for (var i = 0; i < c4.length; i++) {
    c4[i].style.display = "none";
      };

    var a = document.getElementsByClassName("prestigeunlock");
      for (var i = 0; i < a.length; i++) {
    a[i].style.display = "none";
  };
    var b = document.getElementsByClassName("generationunlock");
    for (var i = 0; i < b.length; i++) {
    b[i].style.display = "none";
    };
    var c = document.getElementsByClassName("transcendunlock");
      for (var i = 0; i < c.length; i++) {
    c[i].style.display = "none";
  };
    var d = document.getElementsByClassName("reincarnationunlock");
      for (var i = 0; i < d.length; i++) {
    d[i].style.display = "none";
};
    var e = document.getElementsByClassName("auto");
    for (var i = 0; i < e.length; i++) {
    e[i].style.display = "none";
    };
    var f = document.getElementsByClassName("reinrow1");
    for (var i = 0; i < f.length; i++) {
    f[i].style.display = "none";
    };
    var g = document.getElementsByClassName("reinrow2");
    for (var i = 0; i < g.length; i++) {
    g[i].style.display = "none";
    };
    var h = document.getElementsByClassName("reinrow3");
    for (var i = 0; i < h.length; i++) {
    h[i].style.display = "none";
    };
    var j = document.getElementsByClassName("reinrow4");
    for (var i = 0; i < j.length; i++) {
    j[i].style.display = "none";
    };
    var k = document.getElementsByClassName("chal7");
    for (var i = 0; i < k.length; i++) {
    k[i].style.display = "none"
    };
    let l = document.getElementsByClassName("chal8");
    for (var i = 0; i < l.length; i++){
    l[i].style.display = "none"
    };
    let m = document.getElementsByClassName("chal9");
    for (var i = 0; i < m.length; i++){
    m[i].style.display = "none"
    };
    let n = document.getElementsByClassName("chal10");
    for (var i = 0; i < n.length; i++){
    n[i].style.display = "none"
    };


document.getElementById("rune2area").style.display = "none"
document.getElementById("rune3area").style.display = "none"
document.getElementById("rune4area").style.display = "none"
document.getElementById("rune5area").style.display = "none"
document.getElementById("prestigeautomation").style.display = "none"
document.getElementById("transcendautomation").style.display = "none"
document.getElementById("reincarnateautomation").style.display = "none"
document.getElementById("toggleautosacrifice").style.display = "none"
document.getElementById("toggleautoresearch").style.display = "none"
document.getElementById("antSacrificeSummary").style.display = "none"
document.getElementById("sacrificeAnts").style.display = "none"
document.getElementById("togglerunesubtab").style.display = "none"
document.getElementById("talisman1area").style.display = "none"
document.getElementById("talisman2area").style.display = "none"
document.getElementById("talisman3area").style.display = "none"
document.getElementById("talisman4area").style.display = "none"
document.getElementById("talisman5area").style.display = "none"
document.getElementById("talisman6area").style.display = "none"
document.getElementById("talisman7area").style.display = "none"

if(player.achievements[38] == 1) document.getElementById("rune2area").style.display = "block";
if(player.achievements[44] == 1) document.getElementById("rune3area").style.display = "block";
if(player.achievements[102] == 1) document.getElementById("rune4area").style.display = "block";
if(player.researches[82] == 1) document.getElementById("rune5area").style.display = "block";
if(player.achievements[43] == 1) document.getElementById("prestigeautomation").style.display = "block";
if(player.upgrades[89] == 1) document.getElementById("transcendautomation").style.display = "block";
if(player.researches[46] == 1) document.getElementById("reincarnateautomation").style.display = "block";
if(player.shopUpgrades.offeringAutoLevel > 0.5) document.getElementById("toggleautosacrifice").style.display = "block";
if(player.shopUpgrades.obtainiumAutoLevel > 0.5) document.getElementById("toggleautoresearch").style.display = "block";
if(player.achievements[173] == 1) document.getElementById("sacrificeAnts").style.display = "block";
if(player.achievements[134] == 1) document.getElementById("togglerunesubtab").style.display = "block";
if(player.achievements[119] == 1) document.getElementById("talisman1area").style.display = "block";
if(player.achievements[126] == 1) document.getElementById("talisman2area").style.display = "block";
if(player.achievements[133] == 1) document.getElementById("talisman3area").style.display = "block";
if(player.achievements[140] == 1) document.getElementById("talisman4area").style.display = "block";
if(player.achievements[147] == 1) document.getElementById("talisman5area").style.display = "block";
if(player.antUpgrades[12] > 0) document.getElementById("talisman6area").style.display = "block";
if(player.shopUpgrades.talismanBought) document.getElementById("talisman7area").style.display = "block";



if (player.unlocks.coinone == true) {
    let c1 = document.getElementsByClassName("coinunlock1");
    for (var i = 0; i < c1.length; i++) {
      c1[i].style.display = "block";
    }
}
if (player.unlocks.cointwo == true) {
    let c2 = document.getElementsByClassName("coinunlock2");
      for (var i = 0; i < c2.length; i++) {
    c2[i].style.display = "block";
      }
}
if (player.unlocks.cointhree == true) {
    let c3 = document.getElementsByClassName("coinunlock3");
      for (var i = 0; i < c3.length; i++) {
    c3[i].style.display = "block";
      }
}
if (player.unlocks.coinfour == true) {
    let c4 = document.getElementsByClassName("coinunlock4");
      for (var i = 0; i < c4.length; i++) {
    c4[i].style.display = "block";
      }
}


if (player.unlocks.prestige == true) {
    let a = document.getElementsByClassName("prestigeunlock");
      for (var i = 0; i < a.length; i++) {
    a[i].style.display = "block";
  }
}
if (player.unlocks.generation == true) {
    let b = document.getElementsByClassName("generationunlock");
    for (var i = 0; i < b.length; i++) {
    b[i].style.display = "block";
    }	
}
if (player.unlocks.transcend == true) {
    let c = document.getElementsByClassName("transcendunlock");
      for (var i = 0; i < c.length; i++) {
    c[i].style.display = "block";
  }
}
if (player.unlocks.reincarnate == true) {
    let d = document.getElementsByClassName("reincarnationunlock");
    for (var i = 0; i < d.length; i++) {
    d[i].style.display = "block";
}
}
if (player.unlocks.rrow1 == true) {
let e = document.getElementsByClassName("reinrow1");
for (var i = 0; i < e.length; i++) {
e[i].style.display = "block";
    }
}
if (player.unlocks.rrow2 == true) {
    let e = document.getElementsByClassName("reinrow2");
    for (var i = 0; i < e.length; i++) {
    e[i].style.display = "block";
            }
        }
        if (player.unlocks.rrow3 == true) {
            let e = document.getElementsByClassName("reinrow3");
            for (var i = 0; i < e.length; i++) {
            e[i].style.display = "block";
                    }
                }
                if (player.unlocks.rrow4 == true) {
                    let e = document.getElementsByClassName("reinrow4");
                    for (var i = 0; i < e.length; i++) {
                    e[i].style.display = "block";
                            }
                        }
                        if (player.achievements[124] == 1){
                            let e = document.getElementsByClassName("chal7");
                            for (var i = 0; i < e.length; i++){
                                e[i].style.display= "block"
                            }
                        }
                          if (player.achievements[127] == 1){
                            let e = document.getElementsByClassName("chal8");
                            for (var i = 0; i < e.length; i++){
                              e[i].style.display = "block"
                            }
                          }
                          if (player.achievements[134] == 1){
                            let e = document.getElementsByClassName("chal9");
                            for (var i = 0; i < e.length; i++){
                              e[i].style.display = "block"
                            }
                          }
                          if (player.achievements[141] == 1){
                            let e = document.getElementsByClassName("chal10");
                            for (var i = 0; i < e.length; i++){
                              e[i].style.display = "block"
                            }
                          }
var e = document.getElementsByClassName("auto");
    if (player.upgrades[81] == 1){e[0].style.display = "block";}
    if (player.upgrades[82] == 1){e[1].style.display = "block";}
    if (player.upgrades[83] == 1){e[2].style.display = "block";}
    if (player.upgrades[84] == 1){e[3].style.display = "block";}
    if (player.upgrades[85] == 1){e[4].style.display = "block";}
    if (player.upgrades[86] == 1){e[5].style.display = "block";}
    if (player.upgrades[87] == 1){e[6].style.display = "block";}
    if (player.upgrades[88] == 1){e[7].style.display = "block";}
    if (player.upgrades[91] == 1){e[8].style.display = "block";}
    if (player.upgrades[92] == 1){e[9].style.display = "block";}
    if (player.upgrades[99] == 1){e[10].style.display = "block";}
    if (player.upgrades[90] == 1){e[11].style.display = "block";}
    if (player.unlocks.prestige) {e[12].style.display = "block";}
    if (player.achievements[78] == 1){e[13].style.display = "block";}
    if (player.achievements[85] == 1){e[14].style.display = "block";}
    if (player.achievements[92] == 1){e[15].style.display = "block";}
    if (player.achievements[99] == 1){e[16].style.display = "block";}
    if (player.achievements[106] == 1){e[17].style.display = "block";}
    if (player.achievements[43] == 1){e[18].style.display = "block";}
    if (player.upgrades[94] == 1){e[19].style.display = "block";}
    if (player.upgrades[95] == 1){e[20].style.display = "block";}
    if (player.upgrades[96] == 1){e[21].style.display = "block";}
    if (player.upgrades[97] == 1){e[22].style.display = "block";}
    if (player.upgrades[98] == 1){e[23].style.display = "block";}
    if (player.upgrades[89] == 1){e[24].style.display = "block";}
    if (player.researches[46] == 1){e[30].style.display = "block";}
    if (player.prestigeCount > 0.5 || player.reincarnationCount > 0.5){e[31].style.display = "block";}
    if (player.transcendCount > 0.5 || player.reincarnationCount > 0.5){e[32].style.display = "block";}
    if (player.reincarnationCount > 0.5){e[33].style.display = "block";}


    }

function hideStuff() {
document.getElementById("buildings").style.display = "none"	
document.getElementById("buildingstab").style.backgroundColor = "#171717";
document.getElementById("upgrades").style.display = "none"
document.getElementById("upgradestab").style.backgroundColor = "#171717"
document.getElementById("settings").style.display = "none"
document.getElementById("settingstab").style.backgroundColor = "#171717"
document.getElementById("settingstab").style.color = "white"
document.getElementById("statistics").style.display = "none"
document.getElementById("achievementstab").style.backgroundColor = "#171717"
document.getElementById("achievementstab").style.color = "white"
document.getElementById("prestige").style.display = "none"
document.getElementById("prestigetab").style.backgroundColor = "#171717"
document.getElementById("runes").style.display = "none"
document.getElementById("runestab").style.backgroundColor = "#171717"
document.getElementById("transcension").style.display = "none"
document.getElementById("transcensiontab").style.backgroundColor = "#171717"
document.getElementById("challenges").style.display = "none"
document.getElementById("challengetab").style.backgroundColor = "#171717"
document.getElementById("reincarnation").style.display = "none"
document.getElementById("reincarnationtab").style.backgroundColor = "#171717"
document.getElementById("research").style.display = "none"
document.getElementById("researchtab").style.backgroundColor = "#171717"
document.getElementById("shop").style.display = "none"
document.getElementById("shoptab").style.backgroundColor = "purple"
document.getElementById("ants").style.display = "none"
document.getElementById("anttab").style.backgroundColor = "#171717"

document.getElementById("activaterune2").style.display = "none"
document.getElementById("activaterune3").style.display = "none"
document.getElementById("activaterune4").style.display = "none"

if (currentTab == "buildings") {
    document.getElementById("buildingstab").style.backgroundColor = "orange";
    document.getElementById("buildings").style.display = "block"
    player.tabnumber = 1;
}
if (currentTab == "upgrades") {
    document.getElementById("upgrades").style.display = "block"
    document.getElementById("upgradestab").style.backgroundColor = "orange"
    document.getElementById("upgradedescription").textContent = "Hover over an upgrade to view details!"
    player.tabnumber = 2;
}
if (currentTab == "settings") {
    document.getElementById("settings").style.display = "block"
    document.getElementById("settingstab").style.backgroundColor = "white"
    document.getElementById("settingstab").style.color = "black"


}
if (currentTab == "achievements") {
    document.getElementById("statistics").style.display = "block"
    document.getElementById("achievementstab").style.backgroundColor = "white"
    document.getElementById("achievementstab").style.color = "black"
    document.getElementById("achievementprogress").textContent = "Achievement Points: " + player.achievementPoints + "/" + totalachievementpoints + " [" + (100 * player.achievementPoints/totalachievementpoints).toPrecision(4) + "%]"
    player.tabnumber = 3;
}
if (currentTab == "prestige") {
    document.getElementById("prestige").style.display = "block"
    document.getElementById("prestigetab").style.backgroundColor = "blue"
    player.tabnumber = 4;
}
if (currentTab == "runes") {
    document.getElementById("runes").style.display = "block"
    document.getElementById("runestab").style.backgroundColor = "blue"
    document.getElementById("runeshowlevelup").textContent = "Hey, hover over a rune icon to get details on what each one does and what benefits they're giving you!"
    document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * effectiveLevelMult - 100).toPrecision(4) + "%"
    displayruneinformation(1,false)
    displayruneinformation(2,false)
    displayruneinformation(3,false)
    displayruneinformation(4,false)
    displayruneinformation(5,false)
    player.tabnumber = 5;
}
if (currentTab == "transcension") {
    document.getElementById("transcension").style.display = "block"
    document.getElementById("transcensiontab").style.backgroundColor = "purple"
    player.tabnumber = 6;
}
if (currentTab == "challenges") {
    document.getElementById("challenges").style.display = "block"
    document.getElementById("challengetab").style.backgroundColor = "purple"
    player.tabnumber = 7;
}
if (currentTab == "reincarnation") {
    document.getElementById("reincarnation").style.display = "block"
    document.getElementById("reincarnationtab").style.backgroundColor = "green"
    player.tabnumber = 8;

}
if (currentTab == "researches") {
    document.getElementById("research").style.display = "block"
    document.getElementById("researchtab").style.backgroundColor = "green"
    player.tabnumber = 9;
}
if (currentTab == "shop") {
  document.getElementById("shop").style.display = "block"
  document.getElementById("shoptab").style.backgroundColor = "limegreen"
}
if (currentTab == "ants"){
  document.getElementById("ants").style.display = "block"
  document.getElementById("anttab").style.backgroundColor = "brown"
}

if (player.achievements[38] > 0.5) {
    document.getElementById("activaterune2").style.display = "block"
}
if (player.achievements[44] > 0.5) {
    document.getElementById("activaterune3").style.display = "block"
}
if (player.achievements[102]> 0.5) {
    document.getElementById("activaterune4").style.display = "block"
}
}

function htmlInserts() {
document.getElementById("coinDisplay").textContent = format(player.coins)
document.getElementById("offeringDisplay").textContent = format(player.runeshards)
document.getElementById("diamondDisplay").textContent = format(player.prestigePoints)
document.getElementById("mythosDisplay").textContent = format(player.transcendPoints)
document.getElementById("mythosshardDisplay").textContent = format(player.transcendShards)
document.getElementById("particlesDisplay").textContent = format(player.reincarnationPoints)
document.getElementById("quarkDisplay").textContent = format(player.worlds)
document.getElementById("obtainiumDisplay").textContent = format(player.researchPoints)

if (currentTab == "buildings") {
    document.getElementById("buildtext1").textContent = "Workers: " + format(player.firstOwnedCoin) + " [+" + format(player.firstGeneratedCoin) + "]"
    document.getElementById("buildtext2").textContent = "Coins/Sec: " + format((produceFirst.dividedBy(taxdivisor)).times(40),2) + " [" + (produceFirst.dividedBy(produceTotal.add(0.00001)).times(100)).toPrecision(3) + "%]"
    document.getElementById("buildtext3").textContent = "Investments: " + format(player.secondOwnedCoin) + " [+" + format(player.secondGeneratedCoin) + "]"
    document.getElementById("buildtext4").textContent = "Coins/Sec: " + format((produceSecond.dividedBy(taxdivisor)).times(40),2) + " [" + (produceSecond.dividedBy(produceTotal.add(0.00001)).times(100)).toPrecision(3) + "%]"
    document.getElementById("buildtext5").textContent = "Printers: " + format(player.thirdOwnedCoin) + " [+" + format(player.thirdGeneratedCoin) + "]"
    document.getElementById("buildtext6").textContent = "Coins/Sec: " + format((produceThird.dividedBy(taxdivisor)).times(40),2) + " [" + (produceThird.dividedBy(produceTotal.add(0.00001)).times(100)).toPrecision(3) + "%]"
    document.getElementById("buildtext7").textContent = "Coin Mints: " + format(player.fourthOwnedCoin) + " [+" + format(player.fourthGeneratedCoin) + "]"
    document.getElementById("buildtext8").textContent = "Coins/Sec: " + format((produceFourth.dividedBy(taxdivisor)).times(40),2) + " [" + (produceFourth.dividedBy(produceTotal.add(0.00001)).times(100)).toPrecision(3) + "%]"
    document.getElementById("buildtext9").textContent = "Alchemies: " + format(player.fifthOwnedCoin) + " [+" + format(player.fifthGeneratedCoin) + "]"
    document.getElementById("buildtext10").textContent = "Coins/Sec: " + format((produceFifth.dividedBy(taxdivisor)).times(40),2) + " [" + (produceFifth.dividedBy(produceTotal.add(0.00001)).times(100)).toPrecision(3) + "%]"
    document.getElementById("buildtext11").textContent = "Accelerators: " + format(player.acceleratorBought) + " [+" + format(freeAccelerator) + "]"
    document.getElementById("buildtext12").textContent = "Acceleration Power: " + ((acceleratorPower - 1)*(100)).toPrecision(4) +  "% || Acceleration Multiplier: " + format(acceleratorEffect,2) + "x"
    document.getElementById("buildtext13").textContent = "Multipliers: " + format(player.multiplierBought) + " [+" + format(freeMultiplier) + "]"
    document.getElementById("buildtext14").textContent = "Multiplier Power: " + multiplierPower.toPrecision(4) + "x || Multiplier: " + format(multiplierEffect,2) + "x"
    document.getElementById("buildtext15").textContent = "Accelerator Boost: " + format(player.acceleratorBoostBought) + " [+" + freeAcceleratorBoost + "]"
    document.getElementById("buildtext16").textContent = "Reset Diamonds and Prestige Upgrades, but add " + (tuSevenMulti * (1 + player.researches[16]/50) * (1 + player.challengecompletions.two / 100)).toPrecision(4) + "% Acceleration Power and 5 free Accelerators."

    document.getElementById("buycoin1").textContent = "Cost: " + format(player.firstCostCoin) + " coins."
    document.getElementById("buycoin2").textContent = "Cost: " + format(player.secondCostCoin) + " coins."
    document.getElementById("buycoin3").textContent = "Cost: " + format(player.thirdCostCoin) + " coins."
    document.getElementById("buycoin4").textContent = "Cost: " + format(player.fourthCostCoin) + " coins."
    document.getElementById("buycoin5").textContent = "Cost: " + format(player.fifthCostCoin) + " coins."
    document.getElementById("buyaccelerator").textContent = "Cost: " + format(player.acceleratorCost) + " coins."
    document.getElementById("buymultiplier").textContent = "Cost: " + format(player.multiplierCost) + " coins."
    document.getElementById("buyacceleratorboost").textContent = "Cost: " + format(player.acceleratorBoostCost) + " Diamonds."
}

if (currentTab == "upgrades") {}
if (currentTab == "settings") {}
if (currentTab == "achievements") {}
if (currentTab == "prestige") {
    document.getElementById("prestigeshardinfo").textContent = "You have " + format(player.prestigeShards,2) + " Crystals, multiplying Coin production by " + format(prestigeMultiplier,2) + "x."
    document.getElementById("prestigetext1").textContent = "Refineries: " + format(player.firstOwnedDiamonds) + " [+" + format(player.firstGeneratedDiamonds,2) + "]"
    document.getElementById("prestigetext2").textContent = "Crystal/sec: " + format((produceFirstDiamonds).times(40),2)
    document.getElementById("prestigetext3").textContent = "Coal Plants: " + format(player.secondOwnedDiamonds) + " [+" + format(player.secondGeneratedDiamonds,2) + "]"
    document.getElementById("prestigetext4").textContent = "Ref./Sec: " + format((produceSecondDiamonds).times(40),2)
    document.getElementById("prestigetext5").textContent = "Coal Rigs: " + format(player.thirdOwnedDiamonds) + " [+" + format(player.thirdGeneratedDiamonds,2) + "]"
    document.getElementById("prestigetext6").textContent = "Plants/Sec: " + format((produceThirdDiamonds).times(40),2) 
    document.getElementById("prestigetext7").textContent = "Pickaxes: " + format(player.fourthOwnedDiamonds) + " [+" + format(player.fourthGeneratedDiamonds,2) + "]"
    document.getElementById("prestigetext8").textContent = "Rigs/Sec: " + format((produceFourthDiamonds).times(40),2) 
    document.getElementById("prestigetext9").textContent = "Pandora's Boxes: " + format(player.fifthOwnedDiamonds) + " [+" + format(player.fifthGeneratedDiamonds,2) + "]"
    document.getElementById("prestigetext10").textContent = "Pickaxes/Sec: " + format((produceFifthDiamonds).times(40),2) 
    
    document.getElementById("buydiamond1").textContent = "Cost: " + format(player.firstCostDiamonds,2) + " Diamonds"
    document.getElementById("buydiamond2").textContent = "Cost: " + format(player.secondCostDiamonds,2) + " Diamonds"
    document.getElementById("buydiamond3").textContent = "Cost: " + format(player.thirdCostDiamonds) + " Diamonds"
    document.getElementById("buydiamond4").textContent = "Cost: " + format(player.fourthCostDiamonds) + " Diamonds"
    document.getElementById("buydiamond5").textContent = "Cost: " + format(player.fifthCostDiamonds) + " Diamonds"
    if (player.resettoggle1 == 1 || player.resettoggle1 == 0) {
        var p = new Decimal.pow(10, Decimal.log(prestigePointGain.add(1),10) - Decimal.log(player.prestigePoints.sub(1),10))
        document.getElementById("autoprestige").textContent = "Prestige when your Diamonds can increase by a factor " + format(Decimal.pow(10, player.prestigeamount)) + " [Toggle number above]. Current Multiplier: " + format(p) + "."
    }
    if (player.resettoggle1 == 2) {
    document.getElementById("autoprestige").textContent = "Prestige when the timer is at least " + (player.prestigeamount) + " seconds. [Toggle number above]. Current timer: " + format(player.prestigecounter,1) + "s." 
    }
}
if (currentTab == "runes"){
    if (runescreen == "runes"){
    document.getElementById("runeshards").textContent = "You have " + format(player.runeshards,0,true) + " Offerings."
  //  document.getElementById("rune1level").textContent = "Level: " + player.runelevels[0] + "/" + (500 + player.researches[78])
    document.getElementById('rune1level').childNodes[0].textContent = "Level: " + player.runelevels[0] + "/" + (500 + player.researches[78] + player.researches[111])
    document.getElementById("rune2level").childNodes[0].textContent = "Level: " + player.runelevels[1] + "/" + (500 + player.researches[80] + player.researches[112])
    document.getElementById("rune3level").childNodes[0].textContent = "Level: " + player.runelevels[2] + "/" + (500 + player.researches[79] + player.researches[113])
    document.getElementById("rune4level").childNodes[0].textContent = "Level: " + player.runelevels[3] + "/" + (500 + player.researches[77] + player.researches[114])
    document.getElementById("rune5level").childNodes[0].textContent = "Level: " + player.runelevels[4] + "/" + (500 + player.researches[115])
    document.getElementById("rune1exp").textContent = "+1 in " + format(Math.ceil(Math.max(0, (1 * Math.pow(player.runelevels[0] , 3) * (4 * player.runelevels[0] + 100)/500 * (Math.max(1, (player.runelevels[0]-500)/25)) * (Math.max(1, (player.runelevels[0]-600)/30)) * (Math.max(1, (player.runelevels[0]-700)/25)) * (Math.max(1, Math.pow(1.03, player.runelevels[0] - 750))) * (1 - 0.02 * player.challengecompletions.seven) - player.runeexp[0]))),2) + " EXP" 
    document.getElementById("rune2exp").textContent = "+1 in " + format(Math.ceil(Math.max(0, (4 * Math.pow(player.runelevels[1] , 3) * (4 * player.runelevels[1] + 100)/500 * (Math.max(1, (player.runelevels[1]-500)/25)) * (Math.max(1, (player.runelevels[1]-600)/30)) * (Math.max(1, (player.runelevels[1]-700)/25)) * (Math.max(1, Math.pow(1.03, player.runelevels[1] - 750))) * (1 - 0.02 * player.challengecompletions.seven) - player.runeexp[1]))),2) + " EXP"
    document.getElementById("rune3exp").textContent = "+1 in " + format(Math.ceil(Math.max(0, (9 * Math.pow(player.runelevels[2] , 3) * (4 * player.runelevels[2] + 100)/500 * (Math.max(1, (player.runelevels[2]-500)/25)) * (Math.max(1, (player.runelevels[2]-600)/30)) * (Math.max(1, (player.runelevels[2]-700)/25)) * (Math.max(1, Math.pow(1.03, player.runelevels[2] - 750)))  - player.runeexp[2]))),2) + " EXP"
    document.getElementById("rune4exp").textContent = "+1 in " + format(Math.ceil(Math.max(0, (16 * Math.pow(player.runelevels[3] , 3) * (4 * player.runelevels[3] + 100)/500 * (Math.max(1, (player.runelevels[3]-500)/25)) * (Math.max(1, (player.runelevels[3]-600)/30)) * (Math.max(1, (player.runelevels[3]-700)/25)) * (Math.max(1, Math.pow(1.03, player.runelevels[3] - 750))) * (1 - 0.02 * player.challengecompletions.six) - player.runeexp[3]))),2) + " EXP"
    document.getElementById("rune5exp").textContent = "+1 in " + format(Math.ceil(Math.max(0, (1000 * Math.pow(player.runelevels[4] , 3) * (4 * player.runelevels[4] + 100)/500 * (Math.max(1, (player.runelevels[4]-500)/25)) * (Math.max(1, (player.runelevels[4]-600)/30)) * (Math.max(1, (player.runelevels[4]-700)/25)) * (Math.max(1, Math.pow(1.03, player.runelevels[4] - 750))) - player.runeexp[4]))),2) + " EXP"
    document.getElementById("runedetails").textContent = "Gain " + (25 + 3 * player.researches[22] + 2 * player.researches[23] + 3 * player.upgrades[66] + 5 * player.upgrades[61]) + "* EXP per offering sacrificed. Optimal Reset time for Offerings: " + format(600 + 0.4 * (rune5level) + 6 * player.researches[85] + 120 * player.shopUpgrades.offeringTimerLevel) + " Seconds." 

    document.getElementById("bonusrune1").textContent = " [" + format(player.antUpgrades[9] + bonusant9 + rune1Talisman) + "]"
    document.getElementById("bonusrune2").textContent = " [" + format(player.antUpgrades[9] + bonusant9 + rune2Talisman) + "]"
    document.getElementById("bonusrune3").textContent = " [" + format(player.antUpgrades[9] + bonusant9 + rune3Talisman) + "]"
    document.getElementById("bonusrune4").textContent = " [" + format(player.antUpgrades[9] + bonusant9 + rune4Talisman) + "]"
    document.getElementById("bonusrune5").textContent = " [" + format(player.antUpgrades[9] + bonusant9 + rune5Talisman) + "]"

   
    
    document.getElementById("runerecycle").textContent = "You have " +(5 * player.achievements[80] + 5 * player.achievements[87] + 5 * player.achievements[94] + 5 * player.achievements[101] + 5 * player.achievements[108] + 5 * player.achievements[115] + 7.5 * player.achievements[122] + 7.5 * player.achievements[129] + 5 * player.upgrades[61] + Math.min(25, player.runelevels[3]/8))  + "% chance of recycling your offerings. This multiplies EXP gain by " + format(1/(1- .05 * player.achievements[80] -.05 * player.achievements[87] - 0.05 * player.achievements[94] -0.05 * player.achievements[101] -.05 * player.achievements[108] - .05 * player.achievements[115] - .075 * player.achievements[122] - .075 * player.achievements[129] - 0.05 * player.upgrades[61] - Math.min(.25, player.runelevels[3]/800)),2) + "!"
    }
    if (runescreen == "talismans"){
      document.getElementById("talisman1level").textContent = "Level " + player.talismanLevels[1] + "/" + (30 * player.talismanRarity[1])
      document.getElementById("talisman2level").textContent = "Level " + player.talismanLevels[2] + "/" + (30 * player.talismanRarity[2])
    document.getElementById("talisman3level").textContent = "Level " + player.talismanLevels[3] + "/" + (30 * player.talismanRarity[3])
    document.getElementById("talisman4level").textContent = "Level " + player.talismanLevels[4] + "/" + (30 * player.talismanRarity[4])
    document.getElementById("talisman5level").textContent = "Level " + player.talismanLevels[5] + "/" + (30 * player.talismanRarity[5])
    document.getElementById("talisman6level").textContent = "Level " + player.talismanLevels[6] + "/" + (30 * player.talismanRarity[6])
    document.getElementById("talisman7level").textContent = "Level " + player.talismanLevels[7] + "/" + (30 * player.talismanRarity[7])

    }
}
if (currentTab == "transcension") {
    document.getElementById("transcendshardinfo").textContent = "You have " + format(player.transcendShards,2) + " Mythos Shards, providing " + format(totalMultiplierBoost) + " Multiplier Power boosts."
    document.getElementById("transcendtext1").textContent = "Augments: " + format(player.firstOwnedMythos) + " [+" + format(player.firstGeneratedMythos,2) + "]"
    document.getElementById("transcendtext2").textContent = "Shards/Sec: " + format((produceFirstMythos).times(40),2) 
    document.getElementById("transcendtext3").textContent = "Enchantments: " + format(player.secondOwnedMythos) + " [+" + format(player.secondGeneratedMythos,2) + "]"
    document.getElementById("transcendtext4").textContent = "Augments/Sec: " + format((produceSecondMythos).times(40),2) 
    document.getElementById("transcendtext5").textContent = "Wizards: " + format(player.thirdOwnedMythos) + " [+" + format(player.thirdGeneratedMythos,2) + "]"
    document.getElementById("transcendtext6").textContent = "Enchantments/Sec: " + format((produceThirdMythos).times(40),2) 
    document.getElementById("transcendtext7").textContent = "Oracles: " + format(player.fourthOwnedMythos) + " [+" + format(player.fourthGeneratedMythos,2) + "]"
    document.getElementById("transcendtext8").textContent = "Wizards/Sec: " + format((produceFourthMythos).times(40),2) 
    document.getElementById("transcendtext9").textContent = "Grandmasters: " + format(player.fifthOwnedMythos) + " [+" + format(player.fifthGeneratedMythos,2) + "]"
    document.getElementById("transcendtext10").textContent = "Oracles/Sec: " + format((produceFifthMythos).times(40),2)
    
    document.getElementById("buymythos1").textContent = "Cost: " + format(player.firstCostMythos,2) + " Mythos"
    document.getElementById("buymythos2").textContent = "Cost: " + format(player.secondCostMythos) + " Mythos"
    document.getElementById("buymythos3").textContent = "Cost: " + format(player.thirdCostMythos) + " Mythos"
    document.getElementById("buymythos4").textContent = "Cost: " + format(player.fourthCostMythos) + " Mythos"
    document.getElementById("buymythos5").textContent = "Cost: " + format(player.fifthCostMythos) + " Mythos"
    if (player.resettoggle2 == 1 || player.resettoggle2 == 0) {
        document.getElementById("autotranscend").textContent = "Prestige when your Mythos can increase by a factor " + format(Decimal.pow(10, player.transcendamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(transcendPointGain.add(1),10) - Decimal.log(player.transcendPoints.add(1),10),2)) + "."
    }
    if (player.resettoggle2 == 2) {
    document.getElementById("autotranscend").textContent = "Transcend when the timer is at least " + (player.transcendamount) + " seconds. [Toggle number above]. Current timer: " + format(player.transcendcounter,1) + "s." 
    } 
}
if (currentTab == "challenges") {
}

if (currentTab == "reincarnation") {
    document.getElementById("reincarnationshardinfo").textContent = "You have " + format(player.reincarnationShards,2) + " Atoms, providing " + buildingPower.toPrecision(4) + " Building Power. Multiplier to Coin Production: " + format(reincarnationMultiplier)
    document.getElementById("reincarnationtext1").textContent = "Protons: " + format(player.firstOwnedParticles) + " [+" + format(player.firstGeneratedParticles,2) + "]"
    document.getElementById("reincarnationtext6").textContent = "Atoms/Sec: " + format((produceFirstParticles).times(40),2) 
    document.getElementById("reincarnationtext2").textContent = "Elements: " + format(player.secondOwnedParticles) + " [+" + format(player.secondGeneratedParticles,2) + "]"
    document.getElementById("reincarnationtext7").textContent = "Protons/Sec: " + format((produceSecondParticles).times(40),2) 
    document.getElementById("reincarnationtext3").textContent = "Pulsars: " + format(player.thirdOwnedParticles) + " [+" + format(player.thirdGeneratedParticles,2) + "]"
    document.getElementById("reincarnationtext8").textContent = "Elements/Sec: " + format((produceThirdParticles).times(40),2) 
    document.getElementById("reincarnationtext4").textContent = "Quasars: " + format(player.fourthOwnedParticles) + " [+" + format(player.fourthGeneratedParticles,2) + "]"
    document.getElementById("reincarnationtext9").textContent = "Pulsars/Sec: " + format((produceFourthParticles).times(40),2) 
    document.getElementById("reincarnationtext5").textContent = "Galactic Nuclei: " + format(player.fifthOwnedParticles) + " [+" + format(player.fifthGeneratedParticles,2) + "]"
    document.getElementById("reincarnationtext10").textContent = "Quasars/Sec: " + format((produceFifthParticles).times(40),2) 
    
    document.getElementById("buyparticles1").textContent = "Cost: " + format(Decimal.pow(2, player.firstOwnedParticles)) + " Particles"
    document.getElementById("buyparticles2").textContent = "Cost: " + format(Decimal.pow(2, player.secondOwnedParticles).times(1e2)) + " Particles"
    document.getElementById("buyparticles3").textContent = "Cost: " + format(Decimal.pow(2, player.thirdOwnedParticles).times(1e4)) + " Particles"
    document.getElementById("buyparticles4").textContent = "Cost: " + format(Decimal.pow(2, player.fourthOwnedParticles).times(1e8)) + " Particles"
    document.getElementById("buyparticles5").textContent = "Cost: " + format(Decimal.pow(2, player.fifthOwnedParticles).times(1e16)) + " Particles"
    if (player.resettoggle3 == 1 || player.resettoggle3 == 0) {
        document.getElementById("autoreincarnate").textContent = "Reincarnate when your Particles can increase by a factor " + format(Decimal.pow(10, player.reincarnationamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(reincarnationPointGain.add(1),10) - Decimal.log(player.reincarnationPoints.add(1),10),2)) + "."
    }
    if (player.resettoggle3 == 2) {
    document.getElementById("autoreincarnate").textContent = "Reincarnate when the timer is at least " + (player.reincarnationamount) + " seconds. [Toggle number above]. Current timer: " + format(player.reincarnationcounter,1) + "s." 
    } 
}

if (currentTab == "researches") {
    document.getElementById("researchinfo").textContent = "You have " + format(player.researchPoints,0,true) + " Obtainium"
    document.getElementById("contentteaser1").textContent = "Optimal Reincarnation Time for Obtainium [Assuming e22 Upgrade bought]: " + format((3600 + 120 * player.shopUpgrades.obtainiumTimerLevel)) + " Seconds."
}
if (currentTab == "settings") {
    document.getElementById("temporarystats1").textContent = "Prestige count: " + format(player.prestigeCount)
    document.getElementById("temporarystats2").textContent = "Transcend count: " + format(player.transcendCount)
    document.getElementById("temporarystats3").textContent = "Reincarnation count: " + format(player.reincarnationCount)
    document.getElementById("temporarystats4").textContent = "Fastest Prestige: " + format(1000 * player.fastestprestige) + "ms"
    document.getElementById("temporarystats5").textContent = "Fastest Transcend: " + format(1000 * player.fastesttranscend) + "ms"
    document.getElementById("temporarystats6").textContent = "Fastest Reincarnation: " + format(1000 * player.fastestreincarnate) + "ms"
    document.getElementById("temporarystats7").textContent = "Most Offerings saved at once: " + format(player.maxofferings) 
    document.getElementById("temporarystats8").textContent = "Most Obtainium saved at once: " + format(player.maxobtainium)  
    document.getElementById("temporarystats9").textContent = "Best Obtainium/sec: " + format(player.maxobtainiumpersecond,2,true)
    document.getElementById("temporarystats10").textContent = "Summative Rune Levels: " + format(runeSum)
    document.getElementById("temporarystats11").textContent = "Current Obtainium/sec " + format(player.obtainiumpersecond,2,true) 


    
}

if (currentTab == "shop") {
    document.getElementById("quarkamount").textContent = "You have " + format(player.worlds) + " Quarks!"

    document.getElementById("offeringpotionowned").textContent = "Own: " + format(player.shopUpgrades.offeringPotion)
    document.getElementById("obtainiumpotionowned").textContent = "Own: " + format(player.shopUpgrades.obtainiumPotion)
    
    document.getElementById("offeringtimerlevel").textContent = "Level: " + player.shopUpgrades.offeringTimerLevel + "/7"
    document.getElementById("obtainiumtimerlevel").textContent = "Level: " + player.shopUpgrades.obtainiumTimerLevel + "/7"
    document.getElementById("offeringautolevel").textContent = "Level: " + player.shopUpgrades.offeringAutoLevel + "/7"
    document.getElementById("obtainiumautolevel").textContent = "Level: " + player.shopUpgrades.obtainiumAutoLevel + "/7"
    document.getElementById("instantchallenge").textContent = "Not Bought"
    document.getElementById("antspeed").textContent = "Level: " + player.shopUpgrades.antSpeedLevel + "/3"
    document.getElementById("cashgrab").textContent = "Level: " + player.shopUpgrades.cashGrabLevel + "/7"
    document.getElementById("shoptalisman").textContent = "Not Bought"

    document.getElementById("offeringtimerbutton").textContent = "Upgrade for " + (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) + " Quarks"
    document.getElementById("offeringautobutton").textContent = "Upgrade for " + (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) + " Quarks"
    document.getElementById("obtainiumtimerbutton").textContent = "Upgrade for " + (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) + " Quarks"
    document.getElementById("obtainiumautobutton").textContent = "Upgrade for " + (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel) + " Quarks"
    document.getElementById("instantchallengebutton").textContent = "Buy for " + (shopBaseCosts.instantChallenge) + " Quarks"
    document.getElementById("antspeedbutton").textContent = "Upgrade for " + (shopBaseCosts.antSpeed + 200 * player.shopUpgrades.antSpeedLevel) + " Quarks"
    document.getElementById("cashgrabbutton").textContent = "Upgrade for " + (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel) + " Quarks"
    document.getElementById("shoptalismanbutton").textContent = "Buy for 1500 Quarks"

    if(player.shopUpgrades.offeringTimerLevel == 7){document.getElementById("offeringtimerbutton").textContent = "Maxed!"}
    if(player.shopUpgrades.offeringAutoLevel == 7){document.getElementById("offeringautobutton").textContent = "Maxed!"}
    if(player.shopUpgrades.obtainiumTimerLevel == 7){document.getElementById("obtainiumtimerbutton").textContent = "Maxed!"}
    if(player.shopUpgrades.obtainiumAutoLevel == 7){document.getElementById("obtainiumautobutton").textContent = "Maxed!"}
    if(player.shopUpgrades.instantChallengeBought){document.getElementById("instantchallengebutton").textContent = "Bought!"; document.getElementById("instantchallenge").textContent = "Bought!"}
    if(player.shopUpgrades.antSpeedLevel == 3){document.getElementById("antspeedbutton").textContent = "Maxed!"}
    if(player.shopUpgrades.cashGrabLevel == 7){document.getElementById("cashgrabbutton").textContent = "Maxed!"}
    if(player.shopUpgrades.talismanBought){document.getElementById("shoptalismanbutton").textContent = "Bought!"; document.getElementById("shoptalisman").textContent = "Bought!"}
}
if (currentTab == "ants"){
  document.getElementById("crumbcount").textContent = "You have " + format(player.antPoints,2) + " Galactic Crumbs [" + format(antOneProduce,2) + "/s], providing a " + format(Decimal.pow(Decimal.max(1, player.antPoints),100000 + 900000 * (1 - Math.pow(2, -player.antUpgrades[2]/125)))) + "x Coin Multiplier."
}

}


function buttoncolorchange() {
if (!player.toggles.fifteen || player.achievements[43] == 0){document.getElementById("prestigebtn").style.backgroundColor = "#171717"}
if (!player.toggles.twentyone || player.upgrades[89] == 0){document.getElementById("transcendbtn").style.backgroundColor = "#171717"}
if (!player.toggles.twentyseven || player.researches[46] == 0){document.getElementById("reincarnatebtn").style.backgroundColor = "#171717"}
if (!player.toggles.eight || player.upgrades[88] == 0){document.getElementById("acceleratorboostbtn").style.backgroundColor = "#171717"}
if (player.currentChallenge !== ""){document.getElementById("challengebtn").style.backgroundColor = "purple"}
if (player.currentChallengeRein !== ""){document.getElementById("reincarnatechallengebtn").style.backgroundColor = "purple"}



if (player.toggles.fifteen && player.achievements[43] > 0.5){document.getElementById("prestigebtn").style.backgroundColor = "green"}
if (player.toggles.twentyone && player.upgrades[89] > 0.5 && (player.currentChallenge == "")){document.getElementById("transcendbtn").style.backgroundColor = "green"}
if (player.toggles.twentyseven && player.researches[46] > 0.5 && (player.currentChallenge == "" && player.currentChallengeRein == "")){document.getElementById("reincarnatebtn").style.backgroundColor = "green"}
if (player.toggles.eight && player.upgrades[88] > 0.5){document.getElementById("acceleratorboostbtn").style.backgroundColor = "green"}
if (player.currentChallenge ==""){document.getElementById("challengebtn").style.backgroundColor = "#171717"}
if (player.currentChallengeRein == ""){document.getElementById("reincarnatechallengebtn").style.backgroundColor = "#171717"}




if (currentTab == "buildings"){
document.getElementById("buycoin1").style.backgroundColor = "#171717"
document.getElementById("buycoin2").style.backgroundColor = "#171717"
document.getElementById("buycoin3").style.backgroundColor = "#171717"
document.getElementById("buycoin4").style.backgroundColor = "#171717"
document.getElementById("buycoin5").style.backgroundColor = "#171717"
document.getElementById("buyaccelerator").style.backgroundColor = "#171717"
document.getElementById("buymultiplier").style.backgroundColor = "#171717"
document.getElementById("buyacceleratorboost").style.backgroundColor = "#171717"




if ((!player.toggles.one || player.upgrades[81] == 0) && player.coins.greaterThanOrEqualTo(player.firstCostCoin)){document.getElementById("buycoin1").style.backgroundColor = "#555555"}
if ((!player.toggles.two || player.upgrades[82] == 0) && player.coins.greaterThanOrEqualTo(player.secondCostCoin)){document.getElementById("buycoin2").style.backgroundColor = "#555555"}
if ((!player.toggles.three || player.upgrades[83] == 0) && player.coins.greaterThanOrEqualTo(player.thirdCostCoin)){document.getElementById("buycoin3").style.backgroundColor = "#555555"}
if ((!player.toggles.four || player.upgrades[84] == 0) && player.coins.greaterThanOrEqualTo(player.fourthCostCoin)){document.getElementById("buycoin4").style.backgroundColor = "#555555"}
if ((!player.toggles.five || player.upgrades[85] == 0) && player.coins.greaterThanOrEqualTo(player.fifthCostCoin)){document.getElementById("buycoin5").style.backgroundColor = "#555555"}
if ((!player.toggles.six || player.upgrades[86] == 0) && player.coins.greaterThanOrEqualTo(player.acceleratorCost)){document.getElementById("buyaccelerator").style.backgroundColor = "#555555"}
if ((!player.toggles.seven || player.upgrades[87] == 0) && player.coins.greaterThanOrEqualTo(player.multiplierCost)){document.getElementById("buymultiplier").style.backgroundColor = "#555555"}
if ((!player.toggles.eight || player.upgrades[88] == 0) && player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)){document.getElementById("buyacceleratorboost").style.backgroundColor = "#555555"}

}
if (currentTab == "prestige"){
document.getElementById("buydiamond1").style.backgroundColor = "#171717"
document.getElementById("buydiamond2").style.backgroundColor = "#171717"
document.getElementById("buydiamond3").style.backgroundColor = "#171717"
document.getElementById("buydiamond4").style.backgroundColor = "#171717"
document.getElementById("buydiamond5").style.backgroundColor = "#171717"
document.getElementById("buycrystalupgrade1").style.backgroundColor = "#171717"
document.getElementById("buycrystalupgrade2").style.backgroundColor = "#171717"
document.getElementById("buycrystalupgrade3").style.backgroundColor = "#171717"
document.getElementById("buycrystalupgrade4").style.backgroundColor = "#171717"
document.getElementById("buycrystalupgrade5").style.backgroundColor = "#171717"

if ((!player.toggles.ten || player.achievements[78] == 0) && player.prestigePoints.greaterThanOrEqualTo(player.firstCostDiamonds)){document.getElementById("buydiamond1").style.backgroundColor = "#555555"}
if ((!player.toggles.eleven || player.achievements[85] == 0) && player.prestigePoints.greaterThanOrEqualTo(player.secondCostDiamonds)){document.getElementById("buydiamond2").style.backgroundColor = "#555555"}
if ((!player.toggles.twelve || player.achievements[92] == 0) && player.prestigePoints.greaterThanOrEqualTo(player.thirdCostDiamonds)){document.getElementById("buydiamond3").style.backgroundColor = "#555555"}
if ((!player.toggles.thirteen || player.achievements[99] == 0) && player.prestigePoints.greaterThanOrEqualTo(player.fourthCostDiamonds)){document.getElementById("buydiamond4").style.backgroundColor = "#555555"}
if ((!player.toggles.fourteen || player.achievements[106] == 0) && player.prestigePoints.greaterThanOrEqualTo(player.fifthCostDiamonds)){document.getElementById("buydiamond5").style.backgroundColor = "#555555"}

var c = 0;
c += Math.floor(player.runelevels[2]/10 * (1 + player.researches[5] /10) * (1 + player.researches[21]/800)) * 100/100
if (player.upgrades[73] > 0.5 && player.currentChallengeRein !== ""){c += 10}

if (player.achievements[79] < 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[0] + crystalUpgradeCostIncrement[0] * Math.floor(Math.pow(player.crystalUpgrades[0] + 0.5 - c, 2) /2))))) {document.getElementById("buycrystalupgrade1").style.backgroundColor = "purple"}
if (player.achievements[86] < 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[1] + crystalUpgradeCostIncrement[1] * Math.floor(Math.pow(player.crystalUpgrades[1] + 0.5 - c, 2) /2))))) {document.getElementById("buycrystalupgrade2").style.backgroundColor = "purple"}
if (player.achievements[93] < 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[2] + crystalUpgradeCostIncrement[2] * Math.floor(Math.pow(player.crystalUpgrades[2] + 0.5 - c, 2) /2))))) {document.getElementById("buycrystalupgrade3").style.backgroundColor = "purple"}
if (player.achievements[100] < 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[3] + crystalUpgradeCostIncrement[3] * Math.floor(Math.pow(player.crystalUpgrades[3] + 0.5 - c, 2) /2))))) {document.getElementById("buycrystalupgrade4").style.backgroundColor = "purple"}
if (player.achievements[107] < 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[4] + crystalUpgradeCostIncrement[4] * Math.floor(Math.pow(player.crystalUpgrades[4] + 0.5 - c, 2) /2))))) {document.getElementById("buycrystalupgrade5").style.backgroundColor = "purple"}

if (player.achievements[79] > 0.5){document.getElementById("buycrystalupgrade1").style.backgroundColor = "green"}
if (player.achievements[86] > 0.5){document.getElementById("buycrystalupgrade2").style.backgroundColor = "green"}
if (player.achievements[93] > 0.5){document.getElementById("buycrystalupgrade3").style.backgroundColor = "green"}
if (player.achievements[100] > 0.5){document.getElementById("buycrystalupgrade4").style.backgroundColor = "green"}
if (player.achievements[107] > 0.5){document.getElementById("buycrystalupgrade5").style.backgroundColor = "green"}


}
if (currentTab == "runes") {
if (runescreen == "runes") {
document.getElementById("activaterune1").style.backgroundColor = "#171717"
document.getElementById("activaterune2").style.backgroundColor = "#171717"
document.getElementById("activaterune3").style.backgroundColor = "#171717"
document.getElementById("activaterune4").style.backgroundColor = "#171717"
document.getElementById("activaterune5").style.backgroundColor = "#171717"

if (player.runeshards > 0.5){
    document.getElementById("activaterune1").style.backgroundColor = "purple"
    document.getElementById("activaterune2").style.backgroundColor = "purple"
    document.getElementById("activaterune3").style.backgroundColor = "purple"
    document.getElementById("activaterune4").style.backgroundColor = "purple"	
    document.getElementById("activaterune5").style.backgroundColor = "purple"	
}
}
if (runescreen == "talismans"){
document.getElementById("buyShard").style.backgroundColor = "#171717"
document.getElementById("buyCommonFragment").style.backgroundColor = "#171717"
document.getElementById("buyUncommonFragment").style.backgroundColor = "#171717"
document.getElementById("buyRareFragment").style.backgroundColor = "#171717"
document.getElementById("buyEpicFragment").style.backgroundColor = "#171717"
document.getElementById("buyLegendaryFragment").style.backgroundColor = "#171717"
document.getElementById("buyMythicalFragment").style.backgroundColor = "#171717"

if (player.researchPoints > 1e6){document.getElementById("buyShard").style.backgroundColor = "purple"}
if (player.researchPoints > 3e6){document.getElementById("buyCommonFragment").style.backgroundColor = "purple"}
if (player.researchPoints > 1e7 && player.runeshards > 100){document.getElementById("buyUncommonFragment").style.backgroundColor = "purple"}
if (player.researchPoints > 1e8 && player.runeshards > 1000){document.getElementById("buyRareFragment").style.backgroundColor = "purple"}
if (player.researchPoints > 1e9 && player.runeshards > 10000){document.getElementById("buyEpicFragment").style.backgroundColor = "purple"}
if (player.researchPoints > 1e10 && player.runeshards > 100000){document.getElementById("buyLegendaryFragment").style.backgroundColor = "purple"}
if (player.researchPoints > 1e11 && player.runeshards > 1e6){document.getElementById("buyMythicalFragment").style.backgroundColor = "purple"}
}

}
if (currentTab == "transcension"){
document.getElementById("buymythos1").style.backgroundColor = "#171717"
document.getElementById("buymythos2").style.backgroundColor = "#171717"
document.getElementById("buymythos3").style.backgroundColor = "#171717"
document.getElementById("buymythos4").style.backgroundColor = "#171717"
document.getElementById("buymythos5").style.backgroundColor = "#171717"

if ((!player.toggles.sixteen || player.upgrades[94] == 0) && player.transcendPoints.greaterThanOrEqualTo(player.firstCostMythos)){document.getElementById("buymythos1").style.backgroundColor = "#555555"}
if ((!player.toggles.seventeen || player.upgrades[95] == 0) && player.transcendPoints.greaterThanOrEqualTo(player.secondCostMythos)){document.getElementById("buymythos2").style.backgroundColor = "#555555"}
if ((!player.toggles.eighteen || player.upgrades[96] == 0) && player.transcendPoints.greaterThanOrEqualTo(player.thirdCostMythos)){document.getElementById("buymythos3").style.backgroundColor = "#555555"}
if ((!player.toggles.nineteen || player.upgrades[97] == 0) && player.transcendPoints.greaterThanOrEqualTo(player.fourthCostMythos)){document.getElementById("buymythos4").style.backgroundColor = "#555555"}
if ((!player.toggles.twenty || player.upgrades[98] == 0) && player.transcendPoints.greaterThanOrEqualTo(player.fifthCostMythos)){document.getElementById("buymythos5").style.backgroundColor = "#555555"}


}
if (currentTab == "reincarnation"){
document.getElementById("buyparticles1").style.backgroundColor = "#171717"
document.getElementById("buyparticles2").style.backgroundColor = "#171717"
document.getElementById("buyparticles3").style.backgroundColor = "#171717"
document.getElementById("buyparticles4").style.backgroundColor = "#171717"
document.getElementById("buyparticles5").style.backgroundColor = "#171717"

if (player.reincarnationPoints.greaterThanOrEqualTo(player.firstCostParticles)){document.getElementById("buyparticles1").style.backgroundColor = "#555555"}
if (player.reincarnationPoints.greaterThanOrEqualTo(player.secondCostParticles)){document.getElementById("buyparticles2").style.backgroundColor = "#555555"}
if (player.reincarnationPoints.greaterThanOrEqualTo(player.thirdCostParticles)){document.getElementById("buyparticles3").style.backgroundColor = "#555555"}
if (player.reincarnationPoints.greaterThanOrEqualTo(player.fourthCostParticles)){document.getElementById("buyparticles4").style.backgroundColor = "#555555"}
if (player.reincarnationPoints.greaterThanOrEqualTo(player.fifthCostParticles)){document.getElementById("buyparticles5").style.backgroundColor = "#555555"}
}

if (currentTab == "ants"){
document.getElementById("anttier1").style.backgroundColor = "#171717"
document.getElementById("anttier2").style.backgroundColor = "#171717"
document.getElementById("anttier3").style.backgroundColor = "#171717"
document.getElementById("anttier4").style.backgroundColor = "#171717"
document.getElementById("anttier5").style.backgroundColor = "#171717"
document.getElementById("anttier6").style.backgroundColor = "#171717"
document.getElementById("anttier7").style.backgroundColor = "#171717"
document.getElementById("anttier8").style.backgroundColor = "#171717"

for (var i = 1; i <= 12; i++){
  if(player.antPoints.greaterThanOrEqualTo(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]))){
  document.getElementById("antUpgrade" + i).style.backgroundColor = "silver"
  }
  else {
  document.getElementById("antUpgrade" + i).style.backgroundColor = "#171717";
  }
}

if(player.reincarnationPoints.greaterThanOrEqualTo(player.firstCostAnts)){document.getElementById("anttier1").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.secondCostAnts)){document.getElementById("anttier2").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.thirdCostAnts)){document.getElementById("anttier3").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.fourthCostAnts)){document.getElementById("anttier4").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.fifthCostAnts)){document.getElementById("anttier5").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.sixthCostAnts)){document.getElementById("anttier6").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.seventhCostAnts)){document.getElementById("anttier7").style.backgroundColor = "white"}
if(player.antPoints.greaterThanOrEqualTo(player.eighthCostAnts)){document.getElementById("anttier8").style.backgroundColor = "white"}
}
}

function updateChallengeDisplay(){
  //Sets background colors on load/challenge initiation
  let ordinals = [null,'one','two','three','four','five','six','seven','eight','nine','ten']
  let el = ""
  for (var k = 1; k <= 10; k++){
    el = document.getElementById("challenge"+ordinals[k])
    el.style.backgroundColor = "#171717"
    if (player.currentChallenge == ordinals[k]){el.style.backgroundColor = "plum"}
    if (player.currentChallengeRein == ordinals[k]){el.style.backgroundColor = "plum"}

}
  //Corrects HTML on retry challenges button
  if(player.retrychallenges){document.getElementById("retryChallenge").textContent = "Retry Challenges: ON"}
  else{document.getElementById("retryChallenge").textContent = "Retry Challenges: OFF"}
}

function updateAchievementBG(){
  //When loading/importing, the game needs to correctly update achievement backgrounds.

  
  for (var i = 1; i <= 182; i++){ //Initiates by setting all to default
    document.getElementById("ach"+i).style.backgroundColor = "black"
  }
  
  var fixDisplay1 = document.getElementsByClassName('purpleach')
  var fixDisplay2 = document.getElementsByClassName('redach')
  
  for (var i = 0; i < fixDisplay1.length; i++){
    fixDisplay1[i].style.backgroundColor = "purple" //Sets the appropriate achs to purple
  }
  for (var i = 0; i < fixDisplay2.length; i++){
    fixDisplay2[i].style.backgroundColor = "maroon" //Sets the appropriate achs to maroon (red)
  }
  
  for (var i = 1; i < player.achievements.length; i++) {
    if (player.achievements[i] > 0.5 && player.achievements[i] !== undefined) {
      achievementaward(i, 0) //This sets all completed ach to green (0 in 2nd arg to prevent awarding quarks/pts again)
    }
  }
}