function toggleTabs(i) {
    currentTab = i;
    hideStuff();
}

function toggleSettings(i) {
    if (player.toggles[cardinals[i]] == true) {
        player.toggles[cardinals[i]] = false
    }
    else {player.toggles[cardinals[i]] = true}
    toggleauto();
}

function toggleChallenges(i) {
if (player.currentChallenge == "" && (i == 'one' || i == 'two' || i == 'three' || i == 'four' || i == 'five')) {
    player.currentChallenge = i;
    reset(2);
    player.transcendCount -= 1;
}
if (player.currentChallenge == "" && (i == 'six' || i == 'seven' || i == 'eight' || i == 'nine' || i== 'ten') && player.currentChallengeRein == "") {
    player.currentChallengeRein = i;
    reset(3);
    player.reincarnationCount -= 1;
}

    updateChallengeDisplay();


        if (i == "nine"){
        rune1level = 1;
        rune2level = 1;
        rune3level = 1;
        rune4level = 1;
        rune5level = 1;
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
        }
        calculateRuneLevels();
}


function toggleBuyAmount(quantity, type) {
player[type + 'buyamount'] = quantity 
let a = ""
if (quantity == 1) {a = "one"}
if (quantity == 10) {a = "ten"}
if (quantity == 100) {a = "hundred"}
if (quantity == 1000) {a = "thousand"}


let c = type + a
let d = ""
 d = d + c

document.getElementById(d).style.backgroundColor = "Green";
if (quantity !== 1) {
    a = "one"
    d = type + a
    document.getElementById(d).style.backgroundColor = "Black"
}
if (quantity !== 10) {
    a = "ten"
    d = type + a
    document.getElementById(d).style.backgroundColor = "Black"
}
if (quantity !== 100) {
    a = "hundred"
    d = type + a
    document.getElementById(d).style.backgroundColor = "Black"
}
if (quantity !== 1000) {
    a = "thousand"
    d = type + a
    document.getElementById(d).style.backgroundColor = "Black"
}
} 

function toggleShops(i) {
if (i==1 && player.shoptoggles.coin == false) {player.shoptoggles.coin = true; document.getElementById("shoptogglecoin").textContent = "Auto: ON"} else if (i == 1 && player.shoptoggles.coin == true) {player.shoptoggles.coin = false; document.getElementById("shoptogglecoin").textContent = "Auto: OFF"}
if (i==2 && player.shoptoggles.prestige == false) {player.shoptoggles.prestige = true; document.getElementById("shoptoggleprestige").textContent = "Auto: ON"} else if (i == 2 && player.shoptoggles.prestige == true) {player.shoptoggles.prestige = false; document.getElementById("shoptoggleprestige").textContent = "Auto: OFF"}
if (i==3 && player.shoptoggles.transcend == false) {player.shoptoggles.transcend = true; document.getElementById("shoptoggletranscend").textContent = "Auto: ON"} else if (i == 3 && player.shoptoggles.transcend == true) {player.shoptoggles.transcend = false; document.getElementById("shoptoggletranscend").textContent = "Auto: OFF"}
if (i==4 && player.shoptoggles.generators == false) {player.shoptoggles.generators = true; document.getElementById("shoptogglegenerator").textContent = "Auto: ON"} else if (i == 4 && player.shoptoggles.generators == true) {player.shoptoggles.generators = false; document.getElementById("shoptogglegenerator").textContent = "Auto: OFF"}

}

function keyboardtabchange(i) {
var q = 3;
if (player.unlocks.coinfour == true) {q += 1}
if (player.unlocks.prestige == true) {q += 2}
if (player.unlocks.transcend == true) {q += 2}
if (player.unlocks.reincarnate == true) {q += 2}
if (player.challengecompletions.eight > 0) {q += 1}
player.tabnumber += i
if (player.tabnumber == q) {player.tabnumber = 1}
if (player.tabnumber == 0) {player.tabnumber = q - 1}

if (player.tabnumber == 1) {toggleTabs("buildings")}
if (player.tabnumber == 2) {toggleTabs("upgrades")}
if (player.tabnumber == 3) {toggleTabs("achievements")}
if (player.tabnumber == 4) {toggleTabs("prestige")}
if (player.tabnumber == 5) {toggleTabs("runes")}
if (player.tabnumber == 6) {toggleTabs("transcension")}
if (player.tabnumber == 7) {toggleTabs("challenges")}
if (player.tabnumber == 8) {toggleTabs("reincarnation")}
if (player.tabnumber == 9) {toggleTabs("researches")}
if (player.tabnumber == 10) {toggleTabs("ants")}



}

function toggleautoreset(i) {
if (i == 1){
    if (player.resettoggle1 == 1 || player.resettoggle1 == 0){player.resettoggle1 = 2; document.getElementById("prestigeautotoggle").textContent = "Mode: TIME"}
    else{player.resettoggle1 = 1; document.getElementById("prestigeautotoggle").textContent = "Mode: AMOUNT"}
}
if (i == 2){
    if (player.resettoggle2 == 1 || player.resettoggle2 == 0){player.resettoggle2 = 2; document.getElementById("transcendautotoggle").textContent = "Mode: TIME"}
    else{player.resettoggle2 = 1; document.getElementById("transcendautotoggle").textContent = "Mode: AMOUNT"}
}
if (i == 3){
    if (player.resettoggle3 == 1 || player.resettoggle3 == 0){player.resettoggle3 = 2; document.getElementById("reincarnateautotoggle").textContent = "Mode: TIME"}
    else{player.resettoggle3 = 1; document.getElementById("reincarnateautotoggle").textContent = "Mode: AMOUNT"}
}


}

function toggleauto() {
	var e = document.getElementsByClassName("auto");
		for (var i = 0; i < e.length; i++) {
			var a = ""
			var b = ""
			if ((i <= 7 && i>=0) || (i <= 17 && i >= 13) || (i <= 23 && i >= 19) || (i <= 29 && i >= 25)) {a = "Auto ["}
			if (i == 12) {a = "Hover-to-buy ["}
			if (i == 18) {a = "Auto Prestige ["}
			if (i == 24) {a = "Auto Transcend ["}
			if (i == 30) {a = "Auto Reincarnate ["}
			if ((i == 31) || (i == 32) || (i == 33)){
				a = "["
			}
			var u = 0
			if (i <= 7) {u = i}
			if (i >= 12) {u = i - 4}
			if (player.toggles[cardinals[u]] == true){b = "ON]"}
			if (player.toggles[cardinals[u]] == false) {b = "OFF]"}

			if (i <= 7 || i >= 12) {
			e[i].textContent = a + b
			}
	}

}

function toggleResearchBuy() {
    if (maxbuyresearch){
        maxbuyresearch = false;
        document.getElementById("toggleresearchbuy").textContent = "Upgrade: 1 Level"
    }
    else {maxbuyresearch = true; document.getElementById("toggleresearchbuy").textContent = "Upgrade: MAX [if possible]"}
}

/*function toggleFocus(i) {
    if (i==1){document.getElementById("prestigeamount").focus();}
    if (i==2){document.getElementById("transcendamount").focus();}
    if (i==3){document.getElementById("reincarnationamount").focus();}
}*/

function toggleAutoResearch() {
    let el = document.getElementById("toggleautoresearch")
    if (player.autoResearchToggle){player.autoResearchToggle = false; el.textContent = "Automatic: OFF"; player.autoResearch = 0;}
    else {player.autoResearchToggle = true; el.textContent = "Automatic: ON"};


    if(!player.autoResearchToggle){
        for (var i = 1; i <= 125; i++){
            let l = document.getElementById("res" + i)
            if (player.researches[i] == 0){l.style.backgroundColor = "black"}
            if (player.researches[i] > 0 && player.researches[i] < researchMaxLevels[i]){l.style.backgroundColor = "purple"}
            if (player.researches[i] == researchMaxLevels[i]){l.style.backgroundColor = "green"}
        }
    }
}

function toggleAutoSacrifice(index) {
    let el = document.getElementById("toggleautosacrifice")
    if (index == 0){
    if (player.autoSacrificeToggle){player.autoSacrificeToggle = false; el.textContent = "Automatic: OFF"; player.autoSacrifice = 0;}
    else {player.autoSacrificeToggle = true; el.textContent = "Automatic: ON"}
    }
    if(player.autoSacrificeToggle && player.shopUpgrades.offeringAutoLevel > 0.5){
    switch(index){
        case 1: player.autoSacrifice = 1; break;
        case 2: player.autoSacrifice = 2; break;
        case 3: player.autoSacrifice = 3; break;
        case 4: player.autoSacrifice = 4; break;
        case 5: player.autoSacrifice = 5; break;
    }
    }
    for(var i = 1; i <= 5; i++){
        if(player.autoSacrifice == i){document.getElementById("rune"+i).style.backgroundColor = "orange"}
        else{document.getElementById("rune"+i).style.backgroundColor = "black"}
    }
    calculateRuneLevels();
}

function toggleRuneScreen(){
    if (runescreen == "runes"){
        runescreen = "talismans";
        document.getElementById("runecontainer1").style.display = "none";
        document.getElementById("runecontainer2").style.display = "block";
        document.getElementById("togglerunesubtab").textContent = "GO BACK TO RUNES"
        document.getElementById("togglerunesubtab").style.border = "2px solid orangered"
    }
    else{
        runescreen = "runes";
        document.getElementById("runecontainer1").style.display = "block";
        document.getElementById("runecontainer2").style.display = "none";
        document.getElementById("togglerunesubtab").textContent = "GO TO TALISMANS"
        document.getElementById("togglerunesubtab").style.border = "2px solid grey"
    };
}
function toggleSettingScreen(){
    if (settingscreen == "settings"){
        settingscreen = "credits";
        document.getElementById("settingsubtab").style.display = "none";
        document.getElementById("creditssubtab").style.display = "block";
        document.getElementById("switchsettingtab").textContent = "Go back to Settings"
    }
    else{
        settingscreen = "settings";
        document.getElementById("settingsubtab").style.display = "block";
        document.getElementById("creditssubtab").style.display = "none";
        document.getElementById("switchsettingtab").textContent = "Credits & Acknowledgements"
    };
}

function toggleShopConfirmation(){
    let el = document.getElementById("toggleConfirmShop")
    if(shopConfirmation){shopConfirmation = false; el.textContent = "Shop Confirmations: OFF"}
    else{shopConfirmation = true; el.textContent = "Shop Confirmations: ON"}
}

function toggleAntMaxBuy() {
    let el = document.getElementById("toggleAntMax");
    if(player.antMax){player.antMax = false; el.textContent = "Buy Max: OFF";}
    else{player.antMax = true; el.textContent = "Buy Max: ON";};
}
function toggleAntAutoSacrifice(){
    let el = document.getElementById("toggleAutoSacrificeAnt");
    if(player.autoAntSacrifice){player.autoAntSacrifice = false; el.textContent = "Auto Sacrifice Every 15 Minutes: OFF"}
    else{player.autoAntSacrifice = true; el.textContent = "Auto Sacrifice Every 15 Minutes: ON"}
}