import { player, format, formatTimeShort } from './Synergism';
import Decimal, { DecimalSource } from 'break_infinity.js';
import { isDecimal } from './Utility';
import { antSacrificePointsToMultiplier } from './Ants';
import { Synergism } from './Events';

export type Category = 'ants' | 'reset' | 'ascend';
export type Kind = 'antsacrifice' | 'prestige' | 'transcend' | 'reincarnate' | 'ascend';
export type ResetHistoryDate = { 
    antSacrificePointsAfter: number
    antSacrificePointsBefore: number
    baseELO: number
    crumbs: string | Decimal
    crumbsPerSecond: string | Decimal
    date: number
    effectiveELO: number
    kind: Kind
    obtainium: number
    offerings: number
    seconds: number
    [key: string]: any
};

export type ResetHistoryAscend = {
    diamonds: Decimal
    offerings: number
    seconds: number
    mythos: Decimal
    obtainium: number
    particles: Decimal
    c10Completions: number
    usedCorruptions: number[]
    corruptionScore: number
    wowCubes: number
    wowTesseracts: number
    wowHypercubes: number
    wowPlatonicCubes: number
    currentChallenge: number
    date?: number
    kind?: Kind
    [key: string]: any
}

// This doesn't pass the extra args to format, and that's on purpose
const formatPlain = (str: number | Decimal) => format(str);
const formatDecimalString = (str: DecimalSource) => format(new Decimal(str));

const conditionalFormatPerSecond = (numOrStr: Decimal | number, data: ResetHistoryAscend | ResetHistoryDate) => {
    if (typeof (numOrStr) === "number" && player.historyShowPerSecond) {
        if (numOrStr === 0) { // work around format(0, 3) return 0 instead of 0.000, for consistency
            return "0.000/s";
        }
        return format(numOrStr / ((data.seconds && data.seconds > 0) ? data.seconds : 1), 3, true) + "/s";
    }
    return format(numOrStr);
}

const historyGains: Record<
    string,
    {
        img: string
        imgTitle: string
        formatter: (...args: any[]) => string,
        onlyif?: (...args: any[]) => boolean
    }
> = {
    offerings: {
        img: "Pictures/Offering.png", 
        formatter: formatPlain, 
        imgTitle: "Offerings"
    },
    obtainium: {
        img: "Pictures/Obtainium.png", 
        formatter: formatPlain, 
        imgTitle: "Obtainium"
    },
    antMulti: {
        img: "Pictures/AntSacrifice.png", 
        formatter: formatPlain, 
        imgTitle: "Ant Multiplier gains"
    },
    particles: {
        img: "Pictures/Particle.png",
        formatter: (s: DecimalSource) => extractStringExponent(formatDecimalString(s)),
        imgTitle: "Particles"
    },
    diamonds: {
        img: "Pictures/Diamond.png",
        formatter: (s: DecimalSource) => extractStringExponent(formatDecimalString(s)),
        imgTitle: "Diamonds"
    },
    mythos: {
        img: "Pictures/Mythos.png",
        formatter: (s: DecimalSource) => extractStringExponent(formatDecimalString(s)),
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
        imgTitle: "Wow! Cubes"
    },
    wowPlatonicCubes: {
        img: "Pictures/Platonic Cube.png",
        formatter: conditionalFormatPerSecond,
        imgTitle: "Platonic Cubes",
        onlyif: () => player.challengecompletions[14] > 0,
    },
};

const historyGainsOrder = [
    "offerings", "obtainium",
    "antMulti",
    "particles", "diamonds", "mythos",
    "wowCubes", "wowTesseracts", "wowHypercubes", "wowPlatonicCubes",
];

const historyKinds: Record<Kind, { img: string }> = {
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

const resetHistoryCorruptionImages = [
    "Pictures/Divisiveness Level 7.png",
    "Pictures/Maladaption Lvl 7.png",
    "Pictures/Laziness Lvl 7.png",
    "Pictures/Hyperchallenged Lvl 7.png",
    "Pictures/Scientific Illiteracy Lvl 7.png",
    "Pictures/Deflation Lvl 7.png",
    "Pictures/Extinction Lvl 7.png",
    "Pictures/Drought Lvl 7.png",
    "Pictures/Financial Collapse Lvl 7.png"
];

const resetHistoryCorruptionTitles = [
    "Divisiveness [Multipliers]",
    "Maladaption [Accelerators]",
    "Spacial Dilation [Time]",
    "Hyperchallenged [Challenge Requirements]",
    "Scientific Illiteracy [Obtainium]",
    "Market Deflation [Diamonds]",
    "Extinction [Ants]",
    "Drought [Offering EXP]",
    "Financial Recession [Coins]"
];

const extractStringExponent = (str: string) => {
    let m: RegExpMatchArray | null = null;
    return (m = str.match(/e\+?(.+)/)) !== null ? `e${m[1]}` : str;
}

/**
 * Add a history entry to the storage.
 * @param {string} category One of "ants", "reset" or "ascend"
 * @param {string} kind One of "antsacrifice", "prestige", "transcend", "reincarnate" or "ascend"
 * @param {object} data Applicable gains and poorly documented extra data
 */
const resetHistoryAdd = (
    category: Category,
    kind: Kind,
    data: ResetHistoryDate | ResetHistoryAscend
) => {
    data.date = Date.now();
    data.kind = kind;
    if (player.history[category] === undefined) {
        player.history[category] = [];
    }

    while (player.history[category].length > (player.historyCountMax - 1)) {
        player.history[category].shift();
    }

    // Convert Decimal objects to string representation, so that the data is loaded properly after a refresh
    for (const k in data) {
        if (isDecimal(data[k])) {
            data[k] = data[k].toString();
        }
    }

    player.history[category].push(data);
    resetHistoryPushNewRow(category, data);
}

Synergism.on('historyAdd', resetHistoryAdd);

const resetHistoryPushNewRow = (category: Category, data: ResetHistoryAscend | ResetHistoryDate) => {
    const row = resetHistoryRenderRow(category, data);
    const table = document.getElementById(resetHistoryTableMapping[category]);
    const tbody = table.querySelector("tbody");
    tbody.insertBefore(row, tbody.childNodes[0]);
    while (tbody.childNodes.length > player.historyCountMax) {
        tbody.removeChild(tbody.lastChild);
    }
}

const resetHistoryRenderRow = (
    _category: Category, 
    data: ResetHistoryAscend | ResetHistoryDate
) => {
    let colsUsed = 1;
    const row = document.createElement("tr");
    let rowContentHtml = "";

    const kindMeta = historyKinds[data.kind];

    const localDate = new Date(data.date).toLocaleString();
    rowContentHtml += `<td class="history-seconds" title="${localDate}"><img src="${kindMeta.img}">${formatTimeShort(data.seconds, 60)}</td>`;

    const gains = [];
    for (let gainIdx = 0; gainIdx < historyGainsOrder.length; ++gainIdx) {
        const showing = historyGainsOrder[gainIdx];
        if (Object.prototype.hasOwnProperty.call(data, showing)) {
            const gainInfo = historyGains[showing as keyof typeof historyGains];
            if (gainInfo.onlyif && !gainInfo.onlyif(data)) {
                continue;
            }
            const formatter = gainInfo.formatter || (() => {/* If no formatter is specified, don't display. */});
            const str = `<img src="${gainInfo.img}" title="${gainInfo.imgTitle || ''}">${formatter(data[showing], data)}`;

            gains.push(str);
        }
    }

    const extra: string[] = [];
    if (data.kind === "antsacrifice") {
        const oldMulti = antSacrificePointsToMultiplier(data.antSacrificePointsBefore);
        const newMulti = antSacrificePointsToMultiplier(data.antSacrificePointsAfter);
        const diff = newMulti - oldMulti;
        extra.push(
            `<span title="Ant Multiplier: ${format(oldMulti, 3, false)}--&gt;${format(newMulti, 3, false)}"><img src="Pictures/Multiplier.png" alt="Ant Multiplier">+${format(diff, 3, false)}</span>`,
            `<span title="+${formatDecimalString(data.crumbsPerSecond)} crumbs/s"><img src="Pictures/GalacticCrumbs.png" alt="Crumbs">${extractStringExponent(formatDecimalString(data.crumbs))}</span>`,
            `<span title="${format(data.baseELO)} base"><img src="Pictures/Transparent Pics/ELO.png" alt="ELO">${format(data.effectiveELO)}</span>`
        );
    } else if (data.kind === "ascend") {
        extra.push(
            `<img src="Pictures/Transparent Pics/ChallengeTen.png" title="Challenge 10 completions">${data.c10Completions}`
        );

        const corruptions = resetHistoryFormatCorruptions(data);
        if (corruptions !== null) {
            extra.push(corruptions[0]);
            extra.push(corruptions[1]);
        }
    }

    // This rendering is done this way so that all rows should have the same number of columns, which makes rows
    // equal size and prevents bad rendering. We do 2 of these so that the history doesn't shift when
    // hypercubes or platcubes get added as players unlock them.
    // The 6 and 4 numbers are arbitrary but should never be less than the actual amount of columns that can be
    // realistically displayed; you can increase them if more gains are added.

    // Render the gains plus the gains filler
    colsUsed += gains.length;
    rowContentHtml += gains.reduce((acc, value) => {
        return `${acc}<td class="history-gain">${value}</td>`;
    }, "");
    rowContentHtml += `<td class="history-filler" colspan="${6 - colsUsed}"></td>`;

    // Render the other stuff
    rowContentHtml += extra.reduce((acc, value) => {
        return `${acc}<td class="history-extra">${value}</td>`;
    }, "");
    rowContentHtml += `<td class="history-filler" colspan="${4 - extra.length}"></td>`;

    row.innerHTML = rowContentHtml;
    return row;
}

const resetHistoryRenderFullTable = (categoryToRender: Category, targetTable: HTMLElement) => {
    const tbody = targetTable.querySelector("tbody");
    tbody.innerHTML = "";

    if (!player.history[categoryToRender]) {
        return;
    }

    if (player.history[categoryToRender].length > 0) {
        for (let i = player.history[categoryToRender].length - 1; i >= 0; --i) {
            const row = resetHistoryRenderRow(categoryToRender, player.history[categoryToRender][i]);
            tbody.appendChild(row);
        }
    }
}

export const resetHistoryClearAll = () => {
    Object.keys(player.history).forEach(key => {
        if (Array.isArray(player.history[key])) {
            delete player.history[key];
        }
    });
    resetHistoryRenderAllTables();
}

export const resetHistoryRenderAllTables = () => {
    (Object.keys(resetHistoryTableMapping) as Category[]).forEach(
        key => resetHistoryRenderFullTable(key, document.getElementById(resetHistoryTableMapping[key]))
    );
}

export const resetHistoryTogglePerSecond = () => {
    player.historyShowPerSecond = !player.historyShowPerSecond;
    resetHistoryRenderAllTables();
    const button = document.getElementById("historyTogglePerSecondButton");
    button.textContent = "Per second: " + (player.historyShowPerSecond ? "ON" : "OFF");
    button.style.borderColor = player.historyShowPerSecond ? "green" : "red";
}

const resetHistoryFormatCorruptions = (data: ResetHistoryAscend | ResetHistoryDate): [string, string] => {
    let score = "Score: " + format(data.corruptionScore, 0, true);
    let corruptions = "";
    for (let i = 0; i < resetHistoryCorruptionImages.length; ++i) {
        const corruptionIdx = i + 1;
        if (corruptionIdx in data.usedCorruptions && data.usedCorruptions[corruptionIdx] !== 0) {
            corruptions += ` <img src="${resetHistoryCorruptionImages[i]}" title="${resetHistoryCorruptionTitles[i]}">${data.usedCorruptions[corruptionIdx]}`;
        }
    }
    if (data.currentChallenge !== undefined) {
        score += ` / C${data.currentChallenge}`;
    }

    return [score, corruptions];
}
