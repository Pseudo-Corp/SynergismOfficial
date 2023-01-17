import i18next from 'i18next';
import { DOMCacheGetOrSet } from './Cache/DOM';
import { langStatistics } from './Statistics';
import { achievementPoints } from './Achievements';

// Everything here is an embedding of index.html. if not write to langUpdate()
export const langUpdateHTML = () => {

    // Buildings
    DOMCacheGetOrSet('buildinghotkeys').innerHTML = i18next.t('buildings.coin.hotkeys');



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

    // Corruptions
    DOMCacheGetOrSet('corruptionIntroduction').textContent = i18next.t('corruptions.corruptionIntroduction');
    DOMCacheGetOrSet('corruptionInfo1').innerHTML = i18next.t('corruptions.introduction1');
    DOMCacheGetOrSet('corruptionInfo2').innerHTML = i18next.t('corruptions.introduction2');
    DOMCacheGetOrSet('corruptionAntExponent1').innerHTML = i18next.t('corruptions.antExponent1');
    DOMCacheGetOrSet('corruptionAntExponent2').innerHTML = i18next.t('corruptions.antExponent2');
    DOMCacheGetOrSet('corruptionSpiritBonus1').innerHTML = i18next.t('corruptions.spiritBonus1');
    DOMCacheGetOrSet('corruptionSpiritBonus2').innerHTML = i18next.t('corruptions.spiritBonus2');
    DOMCacheGetOrSet('corruptionBank1').innerHTML = i18next.t('corruptions.bank1');
    DOMCacheGetOrSet('corruptionBank2').innerHTML = i18next.t('corruptions.bank2');

    DOMCacheGetOrSet('corruptionScore1').innerHTML = i18next.t('corruptions.score1');
    DOMCacheGetOrSet('corruptionScore2').innerHTML = i18next.t('corruptions.score2');
    DOMCacheGetOrSet('corruptionScore3').innerHTML = i18next.t('corruptions.score3');
    DOMCacheGetOrSet('corruptionScore4').innerHTML = i18next.t('corruptions.score4');
    DOMCacheGetOrSet('corruptionScore5').innerHTML = i18next.t('corruptions.score5');

    DOMCacheGetOrSet('corruptionAscensionCount1').innerHTML = i18next.t('corruptions.ascensionCount1');
    DOMCacheGetOrSet('corruptionAscensionCount2').innerHTML = i18next.t('corruptions.ascensionCount2');
    
    DOMCacheGetOrSet('corruptionCubes1').innerHTML = i18next.t('corruptions.cubes1');
    DOMCacheGetOrSet('corruptionCubes2').innerHTML = i18next.t('corruptions.cubes2');
    DOMCacheGetOrSet('corruptionTesseracts1').innerHTML = i18next.t('corruptions.tesseracts1');
    DOMCacheGetOrSet('corruptionTesseracts2').innerHTML = i18next.t('corruptions.tesseracts2');
    DOMCacheGetOrSet('corruptionHypercubes1').innerHTML = i18next.t('corruptions.hypercubes1');
    DOMCacheGetOrSet('corruptionHypercubes2').innerHTML = i18next.t('corruptions.hypercubes2');
    DOMCacheGetOrSet('corruptionPlatonicCubes1').innerHTML = i18next.t('corruptions.platonicCubes1');
    DOMCacheGetOrSet('corruptionPlatonicCubes2').innerHTML = i18next.t('corruptions.platonicCubes2');
    DOMCacheGetOrSet('corruptionHepteracts1').innerHTML = i18next.t('corruptions.hepteracts1');
    DOMCacheGetOrSet('corruptionHepteracts2').innerHTML = i18next.t('corruptions.hepteracts2');





    langUpdate();
}

export const langUpdate = () => {
}
