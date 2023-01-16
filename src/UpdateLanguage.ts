import i18next from 'i18next';
import { DOMCacheGetOrSet } from './Cache/DOM';
import { langUpdateSubTab } from './Toggles';
import { langStatistics } from './Statistics';
import { achievementPoints } from './Achievements';

// Everything here is an embedding of index.html. if not write to langUpdate()
export const langUpdateHTML = () => {
    // Dialogs
    DOMCacheGetOrSet('ok_confirm').textContent = i18next.t('dialog.confirmOk');
    DOMCacheGetOrSet('cancel_confirm').textContent = i18next.t('dialog.confirmCancel');
    DOMCacheGetOrSet('ok_alert').textContent = i18next.t('dialog.alertOk');
    DOMCacheGetOrSet('ok_prompt').textContent = i18next.t('dialog.promptOk');
    DOMCacheGetOrSet('cancel_prompt').textContent = i18next.t('dialog.promptCancel');

    // Tabs
    DOMCacheGetOrSet('buildingstab').textContent = i18next.t('tabs.buildings');
    DOMCacheGetOrSet('upgradestab').textContent = i18next.t('tabs.upgrades');
    DOMCacheGetOrSet('achievementstab').textContent = i18next.t('tabs.achievements');
    DOMCacheGetOrSet('runestab').textContent = i18next.t('tabs.runes');
    DOMCacheGetOrSet('challengetab').textContent = i18next.t('tabs.challenge');
    DOMCacheGetOrSet('researchtab').textContent = i18next.t('tabs.research');
    DOMCacheGetOrSet('anttab').textContent = i18next.t('tabs.ant');
    DOMCacheGetOrSet('cubetab').textContent = i18next.t('tabs.cube');
    DOMCacheGetOrSet('traitstab').textContent = i18next.t('tabs.traits');
    DOMCacheGetOrSet('singularitytab').textContent = i18next.t('tabs.singularity');
    DOMCacheGetOrSet('settingstab').textContent = i18next.t('tabs.settings');
    DOMCacheGetOrSet('shoptab').textContent = i18next.t('tabs.shop');

    // SubTabs
    langUpdateSubTab();

    // Stats for Nerds
    langStatistics();
    DOMCacheGetOrSet('summaryGeneration').textContent = i18next.t('statistics.summaryGeneration');

    // Achievements
    achievementPoints();
    DOMCacheGetOrSet('achievementtutorial').textContent = i18next.t('achievements.information1');
    DOMCacheGetOrSet('achievementcolorcode1').textContent = i18next.t('achievements.information2');
    DOMCacheGetOrSet('achievementcolorcode2').textContent = i18next.t('achievements.information3');
    DOMCacheGetOrSet('achievementcolorcode3').textContent = i18next.t('achievements.information4');
    DOMCacheGetOrSet('achievementcolorcode4').textContent = i18next.t('achievements.information5');

    langUpdate();
}

export const langUpdate = () => {
}
