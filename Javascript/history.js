const historyGains = {
    offerings: {img: "Pictures/Offering.png", formatter: formatPlain, imgTitle: "Offerings"},
    obtainium: {img: "Pictures/Obtainium.png", formatter: formatPlain, imgTitle: "Obtainium"},

    antMulti: {img: "Pictures/AntSacrifice.png", formatter: formatPlain, imgTitle: "Ant Multiplier gains"},

    particles: {
        img: "Pictures/Particle.png",
        formatter: s => extractStringExponent(formatDecimalString(s)),
        imgTitle: "Particles"
    },
    diamonds: {
        img: "Pictures/Diamond.png",
        formatter: s => extractStringExponent(formatDecimalString(s)),
        imgTitle: "Diamonds"
    },
    mythos: {
        img: "Pictures/Mythos.png",
        formatter: s => extractStringExponent(formatDecimalString(s)),
        imgTitle: "Mythos"
    },

    wowTesseracts: {
        img: "Pictures/WowTessaract.png",
        formatter: conditionalFormatPerSecond,
        imgTitle: "Wow! Tesseracts"
    },
    wowHypercubes: {
        img: "Pictures/WowHypercube.png",
        formatter: conditionalFormatPerSecond,
        imgTitle: "Wow! Hypercubes",
        onlyif: () => player.challengecompletions[13] > 0
    },
    wowCubes: {
        img: "Pictures/WowCube.png",
        formatter: conditionalFormatPerSecond,
        onlyif: () => player.ascensionCount > 0,
        imgTitle: "Wow! Cubes",
        titler: (data) => {
            if (!data.wowCubesAscend) return "";
            return `Reincarnation: ${format(data.wowCubesReincarnate)} / Challenges: ${format(data.wowCubesChallenge)} / Ascension: ${format(data.wowCubesAscend)}`;
        }
    },
};

const historyGainsOrder = [
    "offerings", "obtainium",
    "antMulti",
    "particles", "diamonds", "mythos",
    "wowCubes", "wowTesseracts", "wowHypercubes",
];

const historyKinds = {
    "antsacrifice": {img: "Pictures/AntSacrifice.png"},
    "prestige": {img: "Pictures/Transparent Pics/Prestige.png"},
    "transcend": {img: "Pictures/Transparent Pics/Transcend.png"},
    "reincarnate": {img: "Pictures/Transparent Pics/Reincarnate.png"},
    "ascend": {img: "Pictures/questionable.png"},
};

const resetHistoryTableMapping = {
    "ants": "historyAntsTable",
    "reset": "historyResetTable",
    "ascend": "historyAscendTable",
};

// This doesn't pass the extra args to format, and that's on purpose
function formatPlain(str) {
    return format(str);
}

function conditionalFormatPerSecond(numOrStr, data) {
    if (typeof (numOrStr) === "number" && player.historyShowPerSecond) {
        if (numOrStr === 0) { // work around format(0, 3) return 0 instead of 0.000, for consistency
            return "0.000/s";
        }
        return format(numOrStr / ((data.seconds && data.seconds > 0) ? data.seconds : 1), 3) + "/s";
    }
    return format(numOrStr);
}

function formatDecimalString(str) {
    return format(new Decimal(str));
}

function extractStringExponent(str) {
    let m;
    if ((m = str.match(/e\+?(.+)/)) !== null) {
        return "e" + m[1];
    }
    return str;
}

/**
 * Add a history entry to the storage.
 * @param {string} category One of "ants", "reset" or "ascend"
 * @param {string} kind One of "antsacrifice", "prestige", "transcend", "reincarnate" or "ascend"
 * @param {object} data Applicable gains and poorly documented extra data
 */
function resetHistoryAdd(category, kind, data) {
    data.date = Date.now();
    data.kind = kind;
    if (player.history[category] === undefined) {
        player.history[category] = [];
    }

    while (player.history[category].length > (player.historyCountMax - 1)) {
        player.history[category].shift();
    }

    // Convert Decimal objects to string representation, so that the data is loaded properly after a refresh
    Object.keys(data).forEach(k => {
        if (data[k] instanceof Decimal) {
            data[k] = data[k].toString();
        }
    });

    player.history[category].push(data);
    resetHistoryPushNewRow(category, data);
}

function resetHistoryPushNewRow(category, data) {
    let row = resetHistoryRenderRow(category, data);
    let table = document.getElementById(resetHistoryTableMapping[category]);
    let tbody = table.querySelector("tbody");
    tbody.insertBefore(row, tbody.childNodes[0]);
    while (tbody.childNodes.length > player.historyCountMax) {
        tbody.removeChild(tbody.lastChild);
    }
}

function resetHistoryRenderRow(category, data) {
    // Formatter that does nothing
    const dontChange = (value) => value;

    let colsUsed = 1;
    let row = document.createElement("tr");
    let rowContentHtml = "";

    let kindMeta = historyKinds[data.kind];

    let localDate = new Date(data.date).toLocaleString();
    rowContentHtml += `<td class="history-seconds" title="${localDate}"><img src="${kindMeta.img}">${formatTimeShort(data.seconds, 10)}</td>`;

    let gains = [];
    for (let gainIdx = 0; gainIdx < historyGainsOrder.length; ++gainIdx) {
        let showing = historyGainsOrder[gainIdx];
        if (data.hasOwnProperty(showing)) {
            let gainInfo = historyGains[showing];
            if (gainInfo.onlyif && !gainInfo.onlyif(data)) {
                continue;
            }
            let formatter = gainInfo.formatter || dontChange;
            let str = `<img src="${gainInfo.img}" title="${gainInfo.imgTitle || ''}"> ${formatter(data[showing], data)}`;

            if (gainInfo.titler) {
                let title = gainInfo.titler(data);
                if (title !== "") {
                    str = `<span title="${gainInfo.titler(data)}">${str}</span>`;
                }
            }
            gains.push(str);
        }
    }

    let extra = [];
    if (data.kind === "antsacrifice") {
        let oldMulti = antSacrificePointsToMultiplier(data.antSacrificePointsBefore);
        let newMulti = antSacrificePointsToMultiplier(data.antSacrificePointsAfter);
        let diff = newMulti - oldMulti;
        extra = [
            `<span title="${format(oldMulti, 3, false)}-&gt;${format(newMulti, 3, false)}"><img src="Pictures/Plus.png">+${format(diff, 3, false)} multi</span>`,
            `<span title="+${formatDecimalString(data.crumbsPerSecond)} crumbs/s"><img src="Pictures/GalacticCrumbs.png">${extractStringExponent(formatDecimalString(data.crumbs))}</span>`,
            `<span title="${format(data.baseELO)} base">${format(data.effectiveELO)} ELO</span>`
        ];
    } else if (data.kind === "ascend") {
        extra = [
            `<img src="Pictures/Transparent Pics/ChallengeTen.png" title="Challenge 10 completions"> ${data.c10Completions}`
        ];

        // TODO: Track and display corruption data here
        if (data.corruptionScore) {
            extra.push(`Score: ${data.corruptionScore}`);
        }
    }

    colsUsed += gains.length + extra.length;

    rowContentHtml += gains.reduce((acc, value) => {
        return `${acc}<td class="history-gain">${value}</td>`;
    }, "");
    rowContentHtml += extra.reduce((acc, value) => {
        return `${acc}<td class="history-extra">${value}</td>`;
    }, "");

    // This exists to give all rows the same number of columns without having to calculate them ahead of time
    // Makes the trs equal size
    rowContentHtml += `<td class="history-filler" colspan="${10 - colsUsed}"></td>`;

    row.innerHTML = rowContentHtml;
    return row;
}

function resetHistoryRenderFullTable(categoryToRender, targetTable) {
    let tbody = targetTable.querySelector("tbody");
    tbody.innerHTML = "";

    if (!player.history[categoryToRender]) {
        return;
    }

    if (player.history[categoryToRender].length > 0) {
        for (let i = player.history[categoryToRender].length - 1; i >= 0; --i) {
            let row = resetHistoryRenderRow(categoryToRender, player.history[categoryToRender][i]);
            tbody.appendChild(row);
        }
    }
}

function resetHistoryClearAll() {
    Object.keys(player.history).forEach(key => {
        if (Array.isArray(player.history[key])) {
            delete player.history[key];
        }
    });
    resetHistoryRenderAllTables();
}

function resetHistoryRenderAllTables() {
    Object.keys(resetHistoryTableMapping).forEach(
        key => resetHistoryRenderFullTable(key, document.getElementById(resetHistoryTableMapping[key]))
    );
}

function resetHistoryTogglePerSecond(category) {
    player.historyShowPerSecond = !player.historyShowPerSecond;
    resetHistoryRenderAllTables();
    let button = document.getElementById("historyTogglePerSecondButton");
    button.textContent = "Per second: " + (player.historyShowPerSecond ? "ON" : "OFF");
    button.style.borderColor = player.historyShowPerSecond ? "green" : "red";
}
