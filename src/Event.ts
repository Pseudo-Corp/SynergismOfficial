import { player, getTimePinnedToLoadDate } from './Synergism'
import { Globals as G } from './Variables';
import { DOMCacheGetOrSet } from './Cache/DOM';

interface HolidayData {
    name: string
    color: string
    url: string
    everyYear: boolean
    start: string
    end: string
    notice: number
    event: boolean
    buffs: {
        quark?: number
        goldenQuark?: number
        cubes?: number
        powderConversion?: number
        ascensionSpeed?: number
        globalSpeed?: number
        ascensionScore?: number
        antSacrifice?: number
        offering?: number
        obtainium?: number
        octeract?: number
    }
}

// Editing the event is here
// can change the basic game balance by setting default to event: true, but cannot stack events
const events: Record<string, HolidayData> = {
    default: {
        name: 'Game Modified',
        color: 'white',
        url: '',
        everyYear: true,
        start: '1/1/2001 00:00:00',
        end: '12/31/2099 23:59:59',
        notice: 0,
        event: false,
        buffs: {
            quark: -0.2,
            goldenQuark: 0,
            cubes: 0,
            powderConversion: 0,
            ascensionSpeed: 0,
            globalSpeed: 0,
            ascensionScore: 0,
            antSacrifice: 0,
            offering: 0,
            obtainium: 0
        }
    },
    // Last active event
    last: {
        name: 'Derpsmith Tea Party',
        color: 'white',
        url: 'https://www.youtube.com/watch?v=znxoba0k000',
        everyYear: false,
        start: '09/24/2022 00:00:00',
        end: '10/01/2022 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 0.25,
            globalSpeed: 1,
            ascensionSpeed: 1,
            antSacrifice: 1,
            offering: 1,
            obtainium: 1,
            octeract: 0.3
        }
    }
    // Event example
    /*
    newyear: {
        name: '&#127881; New Year Event! &#127881;',
        color: 'yellow',
        url: '',
        everyYear: true,
        start: '12/31/2001 00:00:00',
        end: '01/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            ascensionSpeed: 2,
            globalSpeed: 2
        }
    },
    spring: {
        name: '&#127800; Spring Event! &#127800;',
        color: 'pink',
        url: '',
        everyYear: true,
        start: '04/01/2001 00:00:00',
        end: '04/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            ascensionScore: 0.5,
            antSacrifice: 1
        }
    },
    summer: {
        name: '&#9728 Summer Event! &#9728',
        color: 'lightgoldenrodyellow',
        url: '',
        everyYear: true,
        start: '07/01/2001 00:00:00',
        end: '07/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            ascensionSpeed: 1,
            obtainium: 2
        }
    },
    autumn: {
        name: '&#127810; Autumn Event! &#127810;',
        color: 'tomato',
        url: '',
        everyYear: true,
        start: '10/01/2001 00:00:00',
        end: '10/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            cubes: 1,
            offering: 2
        }
    },
    winter: {
        name: '&#10052 Winter Event! &#10052',
        color: 'lightblue',
        url: '',
        everyYear: true,
        start: '02/01/2001 00:00:00',
        end: '02/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            powderConversion: 2,
            globalSpeed: 2
        }
    },
    birthday: {
        name: '&#127874; Synergism Birthday! &#127874;',
        color: 'white',
        url: '',
        everyYear: true,
        start: '01/05/2001 00:00:00',
        end: '01/05/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            goldenQuark: 1,
            cubes: 1,
            powderConversion: 1,
            ascensionSpeed: 1,
            globalSpeed: 1,
            ascensionScore: 1,
            antSacrifice: 1,
            offering: 1,
            obtainium: 1
        }
    }
    */
}

let nowEvent = events.default;

export const getEvent = (): HolidayData => {
    return nowEvent;
}

export const eventCheck = () => {
    if (!player.dayCheck) {
        return;
    }
    const now = new Date(getTimePinnedToLoadDate());
    let start: Date;
    let end: Date;

    // Disable the event if there is any fraud, such as setting a device clock in the past
    /* TODO: Figure out why some people get tagged for cheating even when they are playing legitimately
             I have temporarily disabled the checks. */
    nowEvent = events.default;
    //if (now.getTime() >= player.dayCheck.getTime()) {
    // Update currently valid events
    for (const e in events) {
        const event = events[e];
        if (event.name !== 'default' && event.event === true) {
            start = new Date(event.start);
            end = new Date(event.end);
            if (event.everyYear === true) {
                const nowFullYear = now.getFullYear();
                start = new Date(event.start);
                end = new Date(event.end);
                start.setFullYear(nowFullYear);
                end.setFullYear(nowFullYear);
                if (start.getTime() > end.getTime()) {
                    end.setFullYear(nowFullYear + 1);
                }
                if (now.getTime() >= start.getTime() - 31536000000 && now.getTime() <= end.getTime() - 31536000000) {
                    start.setFullYear(start.getFullYear() - 1);
                    end.setFullYear(end.getFullYear() - 1);
                }
                if (now.getTime() >= end.getTime() + 86400000) {
                    continue;
                }
            } else if (now.getTime() >= end.getTime() + 86400000) {
                continue;
            }
            if (now.getTime() >= start.getTime() - event.notice * 86400000 && now.getTime() <= end.getTime()) {
                nowEvent = event;
                if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
                    break;
                }
            }
        }
    }
    //}
    const happyHolidays = DOMCacheGetOrSet('happyHolidays') as HTMLAnchorElement;
    const eventBuffs = DOMCacheGetOrSet('eventBuffs');
    if (nowEvent.event === true) {
        start = new Date(nowEvent.start);
        end = new Date(nowEvent.end);
        if (nowEvent.everyYear === true) {
            const nowFullYear = now.getFullYear();
            start.setFullYear(nowFullYear);
            end.setFullYear(nowFullYear);
            if (start.getTime() > end.getTime()) {
                end.setFullYear(nowFullYear + 1);
            }
            if (now.getTime() >= start.getTime() - 31536000000 && now.getTime() <= end.getTime() - 31536000000) {
                start.setFullYear(start.getFullYear() - 1);
                end.setFullYear(end.getFullYear() - 1);
            }
        }
        G['isEvent'] = now.getTime() >= start.getTime() && now.getTime() <= end.getTime();
        let buffs = '';
        for (let i = 0; i < eventBuffType.length; i++) {
            const eventBuff = calculateEventSourceBuff(eventBuffType[i]);
            if (eventBuff !== 0) {
                buffs += `${eventBuff >= 0 ? '+' : '-'}${Math.round(Math.abs(eventBuff) * 100)}% ${eventBuffName[i]}, `;
            }
        }
        if (buffs.length > 2) {
            buffs = buffs.substring(0, buffs.length - 2);
            buffs += '!';
        }
        DOMCacheGetOrSet('eventCurrent').textContent = G['isEvent'] ? 'ACTIVE UNTIL ' + end : 'STARTS ' + start;
        eventBuffs.textContent = G['isEvent'] ? 'Current Buffs: ' + buffs : '';
        eventBuffs.style.color = 'lime';
        happyHolidays.innerHTML = nowEvent.name;
        happyHolidays.style.color = nowEvent.color;
        happyHolidays.href = nowEvent.url.length > 0 && G['isEvent'] ? nowEvent.url : '#';
    } else {
        G['isEvent'] = false;
        DOMCacheGetOrSet('eventCurrent').textContent = 'INACTIVE';
        eventBuffs.textContent = now.getTime() >= player.dayCheck.getTime() ? '' : ''
        eventBuffs.style.color = 'red';
        happyHolidays.innerHTML = '';
        happyHolidays.href = '';
    }
}

const eventBuffType = ['Quarks', 'Golden Quarks', 'Cubes', 'Powder Conversion', 'Ascension Speed', 'Global Speed', 'Ascension Score', 'Ant Sacrifice', 'Offering', 'Obtainium', 'Octeract'];
const eventBuffName = ['Quarks', 'Golden Quarks', 'Cubes from all type', 'Powder Conversion', 'Ascension Speed', 'Global Speed', 'Ascension Score', 'Ant Sacrifice rewards', 'Offering', 'Obtainium', 'Eight Dimensional Hypercubes'];

export const calculateEventSourceBuff = (buff: string): number => {
    const event = getEvent();
    switch (buff) {
        case 'Quarks': return event.buffs.quark || 0;
        case 'Golden Quarks': return event.buffs.goldenQuark || 0;
        case 'Cubes': return event.buffs.cubes || 0;
        case 'Powder Conversion': return event.buffs.powderConversion || 0;
        case 'Ascension Speed': return event.buffs.ascensionSpeed || 0;
        case 'Global Speed': return event.buffs.globalSpeed || 0;
        case 'Ascension Score': return event.buffs.ascensionScore || 0;
        case 'Ant Sacrifice': return event.buffs.antSacrifice || 0;
        case 'Offering': return event.buffs.offering || 0;
        case 'Obtainium': return event.buffs.obtainium || 0;
        case 'Octeract': return event.buffs.octeract || 0;
        default: return 0;
    }
}
