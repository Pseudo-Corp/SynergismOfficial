function getRealTime(clock12h = false) {
    let now = new Date();
    let date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    let time = now.toLocaleTimeString([], {hour12: clock12h});
    return date + " " + time;
}

function updateSaveString() {
    player.saveString = document.getElementById("saveStringInput").value
}

function saveFilename() {
    const s = player.saveString
    return s.replace('$TIME$', getRealTime()).replace("$TIME12$", getRealTime(true));
}

function exportSynergism() {
    player.offlinetick = Date.now();
    if (player.quarkstimer >= 3600) {
        player.worlds += (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]));
        player.quarkstimer = (player.quarkstimer % 3600)
    }
    // set attribute to 0, turn tab back to white
    document.getElementById('settingstab').setAttribute('full', 0);

    saveSynergy();

    if ('clipboardData' in window) {
        window.clipboardData.setData('Text', localStorage.getItem('Synergysave2'));
        return;
    }

    const a = document.createElement('a');
    const filename = saveFilename()
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + localStorage.getItem('Synergysave2'));
    a.setAttribute('download', filename);
    a.setAttribute('id', 'downloadSave');
    a.click();

    document.getElementById("exportinfo").textContent = "Savefile copied to file!"
}

const resetGame = () => {
    if (blank_save) {
        const hold = Object.assign({}, blank_save);
        hold.codes = toStringMap(hold.codes);

        importSynergism(btoa(JSON.stringify(hold)));
    } else {
        // handle this here
        // idk lol
    }
}

function importSynergism(input) {
    const d = LZString.decompressFromBase64(input);
    const f = d ? JSON.parse(d) : JSON.parse(atob(input));
    if(f.exporttest === "YES!"){
        intervalHold.forEach(clearInt);
        intervalHold.length = 0;
        localStorage.setItem('Synergysave2', btoa(JSON.stringify(f)));
        constantIntervals();
        createTimer();
        loadSynergy();
    }
}

function promocodes() {
    const input = prompt("Got a code? Great! Enter it in (CaSe SeNsItIvE).");
    const el = document.getElementById("promocodeinfo");
    const version = player[Symbol.for('version')];

    if (input === "synergism2020" && !player.codes.get(1)) {
        player.codes.set(1, true);
        player.runeshards += 25;
        player.worlds += 50;
        el.textContent = "Promo Code 'synergism2020' Applied! +25 Offerings, +50 Quarks"
    } else if (input === "reimagining" && player[Object.getOwnPropertySymbols(player)[0]] && !player.codes.get(25)) {
        player.codes.set(25, true);
        let quarkValue = 0
        quarkValue += 250
        if(player.challengecompletions[8] > 0 || player.ascensionCount > 0){
            quarkValue += 250
        }
        if(player.challengecompletions[9] > 0 || player.ascensionCount > 0){
            quarkValue += 250
        }
        if(player.challengecompletions[10] > 0 || player.ascensionCount >0){
            quarkValue += 250
        }
        if(player.challengecompletions[10] > 2 && player.ascensionCount === 0){
            quarkValue += 500
        }
        el.textContent = "The conscience of the universe is now one. +" + format(quarkValue) + " Quarks based on your progress!"
        player.worlds += quarkValue
    } else if (input === ":unsmith:" && player.achievements[243] < 1) {
        achievementaward(243);
        el.textContent = "It's Spaghetti Time! [Awarded an achievement!!!]";
    } else if (input === ":antismith:" && player.achievements[244] < 1) {
        achievementaward(244);
        el.textContent = "Hey, isn't this just a reference to Antimatter Dimensions? Shh. [Awarded an achievement!!!]";
    } else {
        el.textContent = "Your code is either invalid or already used. Try again!"
    }

    setTimeout(function () {
        el.textContent = ''
    }, 15000);
}