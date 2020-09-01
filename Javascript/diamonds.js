function produceDiamondBuildings() {
    produceFirstDiamonds = player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).times(player.firstProduceDiamonds).times(globalCrystalMultiplier)
    produceSecondDiamonds = player.secondGeneratedDiamonds.add(player.secondOwnedDiamonds).times(player.secondProduceDiamonds).times(globalCrystalMultiplier)
    produceThirdDiamonds = player.thirdGeneratedDiamonds.add(player.thirdOwnedDiamonds).times(player.thirdProduceDiamonds).times(globalCrystalMultiplier)
    produceFourthDiamonds = player.fourthGeneratedDiamonds.add(player.fourthOwnedDiamonds).times(player.fourthProduceDiamonds).times(globalCrystalMultiplier)
    produceFifthDiamonds = player.fifthGeneratedDiamonds.add(player.fifthOwnedDiamonds).times(player.fifthProduceDiamonds).times(globalCrystalMultiplier)

    player.fourthGeneratedDiamonds = player.fourthGeneratedDiamonds.add(produceFifthDiamonds)
    player.thirdGeneratedDiamonds = player.thirdGeneratedDiamonds.add(produceFourthDiamonds)
    player.secondGeneratedDiamonds = player.secondGeneratedDiamonds.add(produceThirdDiamonds)
    player.firstGeneratedDiamonds = player.firstGeneratedDiamonds.add(produceSecondDiamonds)
    produceDiamonds = produceFirstDiamonds;

    if (player.currentChallenge.transcension !== 3) {
        player.prestigeShards = player.prestigeShards.add(produceDiamonds)
    }
}