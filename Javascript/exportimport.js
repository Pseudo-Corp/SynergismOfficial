function getRealTime() {
    let now = new Date();
    let date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    let time = now.toLocaleTimeString();
    return date + " " + time;
}

function updateSaveString() {
    player.saveString = document.getElementById("saveStringInput").value
}

function saveFilename() {
    let s = player.saveString
    let re = /(.+)\$TIME\$(.*)\.txt/
    let match = s.match(re)
    if (match !== null) {
        return match[1] + getRealTime() + match[2] + ".txt"
    } else {
        return s
    }
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

    intervalHold.forEach(clearInterval);
    intervalHold.length = 0;
    localStorage.setItem('Synergysave2', btoa(JSON.stringify(f)));
    constantIntervals();
    createTimer();
    loadSynergy();
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
    } else if (input === "anticipation" && ['1.010', '1.0101'].includes(version) && !player.codes.get(21)) {
        player.codes.set(21, true);
        player.worlds += 250;
        el.textContent = "It's finally here. Thank you for sticking with the game and playing it this long! [+250 Quarks]"
    } else if (input === "750,000" && ['1.010', '1.0101'].includes(version) && !player.codes.get(22)) {
        player.codes.set(22, true);
        player.worlds += 150;
        player.shopUpgrades.obtainiumPotion += 2;
        player.shopUpgrades.offeringPotion += 2;
        el.textContent = "Three Quarters of a million plays in under 2 months! Thank you so much for playing! [+150 Quarks, 2 of each potion!]"
    } else if (input === "RIPKongregate" && version === "1.0101" && !player.codes.get(23)) {
        player.codes.set(23, true);
        player.worlds += 150;
        player.shopUpgrades.obtainiumPotion += 2;
        player.shopUpgrades.offeringPotion += 2;
        el.textContent = "It's a shame, isn't it? [+150 Quarks, 2 of each potion!]"
    } else if (input === "thisCodeCanBeLiterallyAnything" && (player.version === "1.0101") && !player.codes.get(24)) {
        player.codes.set(24, true);
        player.worlds += 200;
        el.textContent = "And so it was. [+200 Quarks]"
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