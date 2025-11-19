import i18next from "i18next"
import { AntProducers, LAST_ANT_PRODUCER } from "../../structs/structs"
import { getMaxPurchasableAnts } from "../../AntProducers/lib/get-cost"
import { player } from "../../../../Synergism"
import { getBuyableMasteryLevels } from "../../AntMasteries/lib/get-buyable"
import { AntUpgrades, LAST_ANT_UPGRADE } from "../../AntUpgrades/structs/structs"
import { getMaxPurchasableAntUpgrades } from "../../AntUpgrades/lib/get-cost"
import { antUpgradeData } from "../../AntUpgrades/data/data"
import { getAchievementReward } from "../../../../Achievements"

export const allAntProducerHTML = () => {
    const autobuyersUnlocked = +getAchievementReward('antAutobuyers')
    
    // This is only visible if we can actually manually buy something.
    let purchasableHTMLIntro = ''
    let list = ''
    for (let antProducer = AntProducers.Workers; antProducer <= LAST_ANT_PRODUCER; antProducer++) {
        const nameText = i18next.t(`ants.producers.${antProducer}.name`)
        const amountPurchasable = getMaxPurchasableAnts(antProducer, player.ants.crumbs) - player.ants.producers[antProducer].purchased
        const isNotAutobuyProducer = !player.ants.toggles.autobuyProducers || antProducer > (autobuyersUnlocked - 1)
        const producerDisplayCheck = isNotAutobuyProducer && amountPurchasable > 0

        const masteriesPurchasable = getBuyableMasteryLevels(antProducer)
        const isNotAutobuyMastery = !player.ants.toggles.autobuyMasteries || antProducer > (autobuyersUnlocked - 1)
        const masteryDisplayCheck = isNotAutobuyMastery && masteriesPurchasable > 0

        if (producerDisplayCheck || masteryDisplayCheck) {
            const listItem = i18next.t('ants.clickBuyAllProducersListItem', {
                name: nameText,
                level: amountPurchasable,
                masteries: masteriesPurchasable
            })
            list += `<br>${listItem}`
            if (purchasableHTMLIntro === '') {
                purchasableHTMLIntro = i18next.t('ants.clickBuyAllIntro')
            }
        }
    }
    if (list === '') {
        list = `${i18next.t('ants.clickBuyAllNothing')}`
    }
    const disclaimerText = `<span style="font-size:0.8em">${i18next.t('ants.clickBuyAllDisclaimer')}</span>`
    return `${purchasableHTMLIntro}${list}<br>${disclaimerText}`
}

export const allAntUpgradeHTML = () => {

    let purchasableHTMLIntro = ''
    let list = ''
    for (let antUpgrade = AntUpgrades.AntSpeed; antUpgrade <= LAST_ANT_UPGRADE; antUpgrade++) {
        const nameText = antUpgradeData[antUpgrade].name()
        const amountPurchasable = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs) - player.ants.upgrades[antUpgrade]
        const isNotAutobuyUpgrade = !player.ants.toggles.autobuyUpgrades || false//antUpgrade > (autoBuyersUnlocked - 1)
        const upgradeDisplayCheck = isNotAutobuyUpgrade && amountPurchasable > 0

        if (upgradeDisplayCheck) {
            const listItem = i18next.t('ants.clickBuyAllUpgradesListItem', {
                name: nameText,
                level: amountPurchasable
            })
            list += `<br>${listItem}`
            if (purchasableHTMLIntro === '') {
                purchasableHTMLIntro = purchasableHTMLIntro = i18next.t('ants.clickBuyAllIntro')
            }
        }
    }
    if (list === '') {
        list = `${i18next.t('ants.clickBuyAllNothing')}`
    }
    const disclaimerText = `<span style="font-size:0.8em">${i18next.t('ants.clickBuyAllDisclaimer')}</span>`
    return `${purchasableHTMLIntro}${list}<br>${disclaimerText}`
}