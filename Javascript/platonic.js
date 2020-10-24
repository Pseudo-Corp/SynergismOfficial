var platUpgradeBaseCosts = {
    1: {
        obtainium: 1e70,
        offerings: 1e45,
        cubes: 1e13,
        tesseracts: 1e6,
        hypercubes: 1e5,
        platonics: 1e4,
        abyssals: 0,
        maxLevel: 100
    },
    2: {
        obtainium: 3e70,
        offerings: 2e45,
        cubes: 1e11,
        tesseracts: 1e8,
        hypercubes: 1e5,
        platonics: 1e4,
        abyssals: 0,
        maxLevel: 100
    },
    3: {
        obtainium: 1e71,
        offerings: 4e45,
        cubes: 1e11,
        tesseracts: 1e6,
        hypercubes: 1e7,
        platonics: 1e4,
        abyssals: 0,
        maxLevel: 100
    },
    4: {
        obtainium: 4e71,
        offerings: 1e46,
        cubes: 1e12,
        tesseracts: 1e7,
        hypercubes: 1e6,
        platonics: 1e6,
        abyssals: 0,
        maxLevel: 100
    },
    5: {
        obtainium: 1e75,
        offerings: 1e50,
        cubes: 1e14,
        tesseracts: 1e9,
        hypercubes: 1e8,
        platonics: 1e7,
        abyssals: 0,
        maxLevel: 1
    },
    6: {
        obtainium: 1e75,
        offerings: 1e50,
        cubes: 1e14,
        tesseracts: 1e9,
        hypercubes: 1e8,
        platonics: 1e7,
        abyssals: 0,
        maxLevel: 10
    },
    7: {
        obtainium: 1e76,
        offerings: 3e50,
        cubes: 2e14,
        tesseracts: 2e9,
        hypercubes: 2e8,
        platonics: 1.5e7,
        abyssals: 0,
        maxLevel: 15
    },
    8: {
        obtainium: 1e77,
        offerings: 1e51,
        cubes: 4e14,
        tesseracts: 4e9,
        hypercubes: 4e8,
        platonics: 3e7,
        abyssals: 0,
        maxLevel: 5
    },
    9: {
        obtainium: 1e78,
        offerings: 3e52,
        cubes: 1e15,
        tesseracts: 1e10,
        hypercubes: 1e9,
        platonics: 5e7,
        abyssals: 0,
        maxLevel: 1
    },
    10: {
        obtainium: 1e80,
        offerings: 1e54,
        cubes: 1e17,
        tesseracts: 1e12,
        hypercubes: 1e11,
        platonics: 1e9,
        abyssals: 0,
        maxLevel: 1
    },
    11: {
        obtainium: 2e79,
        offerings: 2e53,
        cubes: 2e16,
        tesseracts: 2e11,
        hypercubes: 2e10,
        platonics: 2e8,
        abyssals: 0,
        maxLevel: 1
    },
    12: {
        obtainium: 2e80,
        offerings: 2e54,
        cubes: 1e17,
        tesseracts: 1e12,
        hypercubes: 1e11,
        platonics: 1e9,
        abyssals: 0,
        maxLevel: 10
    },
    13: {
        obtainium: 2e81,
        offerings: 2e55,
        cubes: 4e17,
        tesseracts: 4e12,
        hypercubes: 4e11,
        platonics: 4e9,
        abyssals: 0,
        maxLevel: 1
    },
    14: {
        obtainium: 1e82,
        offerings: 1e56,
        cubes: 1e18,
        tesseracts: 1e13,
        hypercubes: 1e12,
        platonics: 1e10,
        abyssals: 0,
        maxLevel: 1
    },
    15: {
        obtainium: 1e85,
        offerings: 1e60,
        cubes: 1e20,
        tesseracts: 1e15,
        hypercubes: 1e14,
        platonics: 1e12,
        abyssals: 1,
        maxLevel: 1
    }
}

function buyPlatonicUpgrades(index){
    let checksum = 0
    let resources = ['obtainium','offerings','cubes','tesseracts','hypercubes','platonics','abyssals']
    let resourceNames = ['researchPoints','runeshards','wowCubes','wowTesseracts','wowHypercubes','wowPlatonicCubes','wowAbyssals']
    for(var i = 0; i < resources.length; i++){
        if (platUpgradeBaseCosts[index][resources[i]] <= player[resourceNames[i]]){
            checksum++
        }
    }
    if (checksum === resources.length && player.platonicUpgrades[index] < platUpgradeBaseCosts[index].maxLevel){
        player.platonicUpgrades[index] += 1
        player.researchPoints -= platUpgradeBaseCosts[index].obtainium
        player.runeshards -= platUpgradeBaseCosts[index].offerings
        player.wowCubes -= platUpgradeBaseCosts[index].cubes
        player.wowTesseracts -= platUpgradeBaseCosts[index].tesseracts
        player.wowHypercubes -= platUpgradeBaseCosts[index].hypercubes
        player.wowPlatonicCubes -= platUpgradeBaseCosts[index].platonics
        player.wowAbyssals -= platUpgradeBaseCosts[index].abyssals
    }
}
