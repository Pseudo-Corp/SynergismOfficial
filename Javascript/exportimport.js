const format24 = new Intl.DateTimeFormat("EN-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit"
})
const format12 = new Intl.DateTimeFormat("EN-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    second: "2-digit"
})

function getRealTime(use12 = false) {
    let format = use12 ? format12 : format24;
    let dateParts = format
        .formatToParts(new Date())
        .filter((x) => x.type !== "literal")
        .reduce((a, x) => {
            a[x.type] = x.value;
            return a
        }, {});
    return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}_${dateParts.minute}_${dateParts.second}${(use12 ? ` ${dateParts.dayPeriod.toUpperCase()}` : "")}`

}

function updateSaveString() {
    player.saveString = document.getElementById("saveStringInput").value
}

function saveFilename() {
    const s = player.saveString
    return s
        .replace("$VERSION$", "v" + player.version)
        .replace("$TIME$", getRealTime())
        .replace("$TIME12$", getRealTime(true));
}

async function exportSynergism() {
    player.offlinetick = Date.now();
    if (player.quarkstimer >= 3600) {
        player.worlds += (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]));
        player.quarkstimer = (player.quarkstimer % 3600)
    }
    // set attribute to 0, turn tab back to white
    document.getElementById('settingstab').setAttribute('full', 0);

    saveSynergy();

    const toClipboard = document.getElementById('saveType').checked;
    const save = localStorage.getItem('Synergysave2');
    if ('clipboard' in navigator && toClipboard) {
        await navigator.clipboard.writeText(save)
            .catch(e => console.error(e));
    } else if (toClipboard) { // old browsers
        const textArea = document.createElement('textarea');
        textArea.value = save;
        textArea.setAttribute('style', 'top: 0; left: 0; position: fixed;');

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (_) {
        }

        document.body.removeChild(textArea);
    } else {
        const a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + save);
        a.setAttribute('download', saveFilename());
        a.setAttribute('id', 'downloadSave');
        // "Starting in Firefox 75, the click() function works even when the element is not attached to a DOM tree."
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
        // so let's have it work on older versions of Firefox, doesn't change functionality.
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    document.getElementById("exportinfo").textContent = toClipboard
        ? 'Copied save to your clipboard!'
        : 'Savefile copied to file!';
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
    if (f.exporttest === "YES!") {
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

    if (input === "synergism2020" && !player.codes.get(1)) {
        player.codes.set(1, true);
        player.runeshards += 25;
        player.worlds += 50;
        el.textContent = "Promo Code 'synergism2020' Applied! +25 Offerings, +50 Quarks"
    } else if (input === ":unsmith:" && player.achievements[243] < 1) {
        achievementaward(243);
        el.textContent = "It's Spaghetti Time! [Awarded an achievement!!!]";
    } else if (input === ":antismith:" && player.achievements[244] < 1) {
        achievementaward(244);
        el.textContent = "Hey, isn't this just a reference to Antimatter Dimensions? Shh. [Awarded an achievement!!!]";
    } else if(input === 'Khafra' && !player.codes.get(26)) {
        player.codes.set(26, true);
        const quarks = Math.floor(Math.random() * (400 - 100 + 1) + 100);
        player.worlds += quarks;
        el.textContent = 'Khafra has blessed you with ' + quarks + ' quarks!';
    } else if(input === 'november13' && !player.codes.get(27)) {
        player.codes.set(27, true);
        player.worlds += 300;
        el.textContent = 'Be careful, on friday the thirteenth! [+300 Quarks]';
    } else if(input === '2million' && !player.codes.get(28)) {
        player.codes.set(28, true);
        player.worlds += 700;
        el.textContent = 'Thank you for 2 million plays on kongregate!';
    } else if(input === 'version2.1.0' && !player.codes.get(29)) {
        player.codes.set(29, true);
        let quarkCounter = 250;
        if(player.challengecompletions[11] > 0 || player.highestchallengecompletions[11] >0){
            quarkCounter += 250;
        }
        if(player.challengecompletions[12] > 0 || player.highestchallengecompletions[12] >0){
            quarkCounter += 250;
        }
        if(player.challengecompletions[13] > 0 || player.highestchallengecompletions[13] >0){
            quarkCounter += 500;
        }
        if(player.challengecompletions[14] > 0 || player.highestchallengecompletions[14] >0){
            quarkCounter += 500;
        }
        if(player.challengecompletions[13] >= 18 || player.highestchallengecompletions[13] >= 18){
            quarkCounter += 750;
        }
        if(player.challengecompletions[13] >= 22 || player.highestchallengecompletions[13] >= 22){
            quarkCounter += 1;
        }
        player.worlds += quarkCounter
        el.textContent = 'Welcome to the Abyss! Based on your progress, you gained ' + format(quarkCounter) + " Quarks.";
    }/* else if(!Number.isNaN(+input)) {
        const now = Date.now();
        if((now - 86400000) <= player.rngCode) {
            el.textContent = `You already guessed today!`;
            return;
        }

        // [0, 65535]
        const random = window.crypto.getRandomValues(new Uint16Array(1))[0];
        player.rngCode = now;
        if(+input === random) {
            player.worlds += random;
            el.textContent = `You might be the only person to ever guess this correctly. Here's your ${random.toLocaleString()} quarks.`;
        } else {
            el.textContent = `So close, you were only ${Math.abs(random - +input).toLocaleString()} off!`;
        }
    } */else {
        el.textContent = "Your code is either invalid or already used. Try again!"
    }

    saveSynergy(); // should fix refresh bug where you can continuously enter promocodes
    setTimeout(function () {
        el.textContent = ''
    }, 15000);
}
