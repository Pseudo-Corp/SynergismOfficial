var runediv = [1.5, 2, 3, 5, 8]
var runeexpbase = [1, 4, 9, 16, 1000]

// this shows the logarithm of costs. ex: upgrade one will cost 1e+6 coins, upgrade 2 1e+7, etc.
var upgradeCosts = [0, 6, 7, 8, 10, 12, 20, 25, 30, 35, 45, 55, 75, 110, 150, 200, 250, 500, 750, 1000, 1500,
    2, 3, 4, 5, 6, 7, 10, 13, 20, 30, 150, 400, 800, 1600, 3200, 10000, 20000, 50000, 100000, 200000,
    1, 2, 3, 5, 6, 7, 42, 65, 87, 150, 300, 500, 1000, 1500, 2000, 3000, 6000, 12000, 25000, 75000,
    0, 1, 2, 2, 3, 5, 6, 10, 15, 22, 30, 37, 45, 52, 60, 1900, 2500, 3000, 7482, 21397,
    3, 6, 9, 12, 15, 20, 30, 6, 8, 8, 10, 13, 60, 1, 2, 4, 8, 16, 25, 40,
    12, 16, 20, 30, 50, 500, 1250, 5000, 25000, 125000, 1500, 7500, 30000, 150000, 1000000, 250, 1000, 5000, 25000, 125000,
    1, 1000, 1e6, 1e9, 1e12];

// Mega list of Variables to be used elsewhere
var crystalUpgradesCost = [6, 15, 20, 40, 100, 200, 500, 1000]
var crystalUpgradeCostIncrement = [8, 15, 20, 40, 100, 200, 500, 1000]
var researchBaseCosts = [1e100, 1, 1, 1, 1, 1,
    1, 10, 100, 10000, 100000000,
    2, 20, 200, 20000, 200000000,
    4000, 40000000, 10, 250000, 1e8,
    80, 10, 500, 100, 2000,
    40, 200, 50, 5000, 20000000,
    777, 7777, 50000, 500000, 5000000,
    10, 2500, 1e6, 1e5, 1e9,
    1, 1, 5, 25, 125,
    2, 5, 320, 1280, 2.5e9,
    5, 500, 5e3, 5e5, 5e7,
    5, 500, 5e3, 5e5, 5e7,
    15, 50, 125, 500, 100000,
    1, 100, 1000, 10000, 100000,
    10, 40, 160, 1000, 10000,
    1e9, 2e9, 4e9, 8e9, 1.6e10,
    1e12, 1e13, 3e12, 2e13, 2e13,
    2e14, 6e14, 2e15, 6e15, 2e16,
    1e16, 2e16, 2e17, 4e17, 1e18,
    1e13, 1e14, 1e15, 7.777e18, 7.777e20,
    1e16, 3e16, 1e17, 3e17, 1e20,
    1e18, 3e18, 1e19, 3e19, 1e20,
    1e20, 2e20, 4e20, 8e20, 1e21,
    2e21, 4e21, 8e21, 2e22, 4e22,
    8e22, 2e23, 4e23, 1e21, 7.777e32,
    /*ascension tier */                5e8, 5e12, 5e16, 5e20, 5e24,
    1e25, 2e25, 4e25, 8e25, 1e26,
    4e26, 8e26, 1e27, 2e27, 1e28,
    /*challenge 11 tier */            5e9, 5e15, 5e21, 5e27, 5e28,
    1e29, 2e29, 4e29, 8e29, 1e30,
    2e30, 4e30, 8e30, 1e31, 2e31,
    /*challenge 12 tier */            5e31, 1e32, 2e32, 4e32, 8e32,
    1e33, 2e33, 4e33, 8e33, 1e34,
    3e34, 1e35, 3e35, 6e35, 1e36,
    /*challenge 13 tier */            3e36, 1e37, 3e37, 1e38, 3e38,
    1e39, 3e39, 1e40, 3e40, 1e50,
    3e41, 1e42, 3e42, 6e42, 1e43,
    /*challenge 14 tier */            3e43, 1e44, 3e44, 1e45, 3e45,
    1e46, 3e46, 1e47, 3e47, 1e60,
    3e48, 1e49, 3e49, 6e49, 1e52
]


var researchMaxLevels = [0, 1, 1, 1, 1, 1,
    10, 10, 10, 10, 10,
    10, 10, 10, 10, 10,
    10, 10, 1, 1, 1,
    25, 25, 25, 20, 20,
    10, 10, 10, 10, 10,
    12, 12, 10, 10, 10,
    10, 10, 10, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    10, 10, 10, 10, 10,
    20, 20, 20, 20, 20,
    1, 5, 4, 5, 5,
    10, 10, 10, 10, 10,
    1, 1, 1, 1, 1,
    10, 50, 50, 50, 50,
    10, 1, 20, 20, 20,
    20, 20, 20, 20, 10,
    20, 20, 20, 20, 1,
    20, 5, 5, 2, 1,
    10, 10, 10, 10, 1,
    10, 10, 20, 25, 25,
    50, 50, 50, 50, 100,
    10, 10, 10, 100, 100,
    25, 25, 25, 1, 1,
    10, 10, 10, 10, 1,
    10, 10, 10, 10, 1,
    25, 25, 25, 15, 1,
    10, 10, 10, 10, 1,
    10, 1, 6, 10, 1,
    25, 25, 1, 15, 1,
    10, 10, 10, 10, 1,
    10, 10, 10, 10, 1,
    25, 25, 1, 15, 1,
    10, 10, 10, 10, 1,
    10, 3, 6, 10, 2,
    25, 25, 1, 15, 1,
    20, 20, 20, 1, 1,
    20, 1, 50, 50, 2,
    25, 25, 25, 15, 100000]

var ticker = 0; // TODO: Axe this

var costDivisor = 1;

var freeAccelerator = 0;
var totalAccelerator = 0;
var freeAcceleratorBoost = 0;
var totalAcceleratorBoost = 0;
var acceleratorPower = 1.10;
var acceleratorEffect = new Decimal(1);
var acceleratorEffectDisplay = new Decimal(1);
var generatorPower = new Decimal(1);

var freeMultiplier = 0;
var totalMultiplier = 0;
var multiplierPower = 2;
var multiplierEffect = 1;
var challengeOneLog = 3;
var freeMultiplierBoost = 0;
var totalMultiplierBoost = 0;

var globalCoinMultiplier = new Decimal(1);
var totalCoinOwned = new Decimal(0);
var prestigeMultiplier = new Decimal(1);
var buildingPower = 1;
var reincarnationMultiplier = new Decimal(1);

var coinOneMulti = new Decimal(1);
var coinTwoMulti = new Decimal(1);
var coinThreeMulti = new Decimal(1);
var coinFourMulti = new Decimal(1);
var coinFiveMulti = new Decimal(1);

var globalCrystalMultiplier = new Decimal(1);
var globalMythosMultiplier = new Decimal(0.01);
var grandmasterMultiplier = new Decimal(1);

var atomsMultiplier = new Decimal(1);

var mythosBuildingPower = 1;
var challengeThreeMultiplier = new Decimal(1);
var totalMythosOwned = 0;

var prestigePointGain = new Decimal(0);
var challengeFivePower = 1 / 3;

var transcendPointGain = new Decimal(0);
var reincarnationPointGain = new Decimal(0);

var produceFirst = new Decimal(0);
var produceSecond = new Decimal(0);
var produceThird = new Decimal(0);
var produceFourth = new Decimal(0);
var produceFifth = new Decimal(0);
var produceTotal = new Decimal(0);

var produceFirstDiamonds = new Decimal(0);
var produceSecondDiamonds = new Decimal(0);
var produceThirdDiamonds = new Decimal(0);
var produceFourthDiamonds = new Decimal(0);
var produceFifthDiamonds = new Decimal(0);
var produceDiamonds = new Decimal(0);

var produceFirstMythos = new Decimal(0);
var produceSecondMythos = new Decimal(0);
var produceThirdMythos = new Decimal(0);
var produceFourthMythos = new Decimal(0);
var produceFifthMythos = new Decimal(0);
var produceMythos = new Decimal(0);

var produceFirstParticles = new Decimal(0);
var produceSecondParticles = new Decimal(0);
var produceThirdParticles = new Decimal(0);
var produceFourthParticles = new Decimal(0);
var produceFifthParticles = new Decimal(0);
var produceParticles = new Decimal(0);

var producePerSecond = new Decimal(0);
var producePerSecondDiamonds = new Decimal(0);
var producePerSecondMythos = new Decimal(0);
var producePerSecondParticles = new Decimal(0);

var uFourteenMulti = new Decimal(1);
var uFifteenMulti = new Decimal(1);
var tuSevenMulti = 1;
let currentTab = "buildings"

var researchfiller1 = "Hover over the grid to get details about researches!"
var researchfiller2 = "Level: "

var ordinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"]
var cardinals = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twentyone", "twentytwo", "twentythree", "twentyfour", "twentyfive", "twentysix", "twentyseven", "twentyeight", "twentynine", "thirty", "thirtyone", "thirtytwo", "thirtythree", "thirtyfour"]

var challengeBaseRequirements = [null, 10, 20, 60, 100, 200, 125, 500, 10000, 2.5e8, 4e9]

var prestigeamount = 1;
var taxdivisor = new Decimal("1");
var taxdivisorcheck = new Decimal("1");
var runemultiplierincrease = {
    one: 1,
    two: 1,
    three: 1,
    four: 1,
    five: 1
}

var mythosupgrade13 = new Decimal("1");
var mythosupgrade14 = new Decimal("1");
var mythosupgrade15 = new Decimal("1");
var challengefocus = 0;

var maxexponent = 10000;

var maxbuyresearch = false;

var effectiveLevelMult = 1;
var optimalOfferingTimer = 600;
var optimalObtainiumTimer = 3600;

var runeSum = 0;

const shopBaseCosts = {
    offerPotion: 35,
    obtainiumPotion: 35,
    offerTimer: 150,
    obtainiumTimer: 150,
    offerAuto: 150,
    obtainiumAuto: 150,
    instantChallenge: 300,
    cashGrab: 100,
    antSpeed: 200,
}

var shopConfirmation = true;

var globalAntMult = new Decimal("1");
var antMultiplier = new Decimal("1");

var antOneProduce = new Decimal("1");
var antTwoProduce = new Decimal("1");
var antThreeProduce = new Decimal("1");
var antFourProduce = new Decimal("1");
var antFiveProduce = new Decimal("1");
var antSixProduce = new Decimal("1");
var antSevenProduce = new Decimal("1");
var antEightProduce = new Decimal("1");

var antCostGrowth = [null, 1e41, 3, 10, 1e2, 1e4, 1e8, 1e16, 1e32]

var antUpgradeBaseCost = [null, 100, 100, 1000, 1000, 1e5, 1e6, 1e8, 1e11, 1e15, 1e20, 1e40, 1e100]
var antUpgradeCostIncreases = [null, 10, 10, 10, 10, 100, 100, 100, 100, 1000, 1000, 1000, 1e100]

var bonusant1 = 0;
var bonusant2 = 0;
var bonusant3 = 0;
var bonusant4 = 0;
var bonusant5 = 0;
var bonusant6 = 0;
var bonusant7 = 0;
var bonusant8 = 0;
var bonusant9 = 0;
var bonusant10 = 0;
var bonusant11 = 0;
var bonusant12 = 0;

var rune1level = 1;
var rune2level = 1;
var rune3level = 1;
var rune4level = 1;
var rune5level = 1;
var rune1Talisman = 0;
var rune2Talisman = 0;
var rune3Talisman = 0;
var rune4Talisman = 0;
var rune5Talisman = 0;


var talisman1Effect = [null, 0, 0, 0, 0, 0]
var talisman2Effect = [null, 0, 0, 0, 0, 0]
var talisman3Effect = [null, 0, 0, 0, 0, 0]
var talisman4Effect = [null, 0, 0, 0, 0, 0]
var talisman5Effect = [null, 0, 0, 0, 0, 0]
var talisman6Effect = [null, 0, 0, 0, 0, 0]
var talisman7Effect = [null, 0, 0, 0, 0, 0]

var talisman6Power = 0;
var talisman7Quarks = 0;

var runescreen = "runes"
var settingscreen = "settings"

var talismanShardCost = 1e6
var talismanFragmentObtainiumCosts = [null, 1e14, 1e16, 1e18, 1e20, 1e22, 1e24]
var talismanFragmentOfferingCosts = [null, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9]


var talismanLevelCostMultiplier = [null, 1, 4, 1e4, 1e8, 1e13, 10, 100]

var talismanPositiveModifier = [null, 0.75, 1.5, 2.25, 3, 3.75, 4.5]
var talismanNegativeModifier = [null, 0, 0, 0, 0, 0, 0]

var commonTalismanEnhanceCost = [null, 0, 3000, 1000, 0, 0, 0, 0]
var uncommonTalismanEnchanceCost = [null, 0, 10000, 3000, 1000, 0, 0, 0]
var rareTalismanEnchanceCost = [null, 0, 100000, 20000, 2000, 500, 0, 0]
var epicTalismanEnhanceCost = [null, 0, 2e6, 2e5, 2e4, 2000, 1000, 0]
var legendaryTalismanEnchanceCost = [null, 0, 4e7, 2e6, 1e5, 20000, 2500, 200]
var mythicalTalismanEnchanceCost = [null, 0, 0, 0, 0, 0, 0, 0]

var talismanRespec = 1;

var obtainiumGain = 0;

var mirrorTalismanStats = [null, 1, 1, 1, 1, 1];
var antELO = 0;
var effectiveELO = 0;

var timeWarp = false

var blessingMultiplier = 1;
var spiritMultiplier = 1;
var runeBlessings = [0, 0, 0, 0, 0, 0];
var runeSpirits = [0, 0, 0, 0, 0, 0];

var effectiveRuneBlessingPower = [0, 0, 0, 0, 0, 0];
var effectiveRuneSpiritPower = [0, 0, 0, 0, 0, 0];


var triggerChallenge = ""

var prevReductionValue = -1;

var buildingSubTab = "coin"
//1,000 of each before Diminishing Returns
var blessingbase = [null, 1 / 500, 1 / 5000, 1 / 2000, 1 / 750, 1 / 200, 1 / 10000, 1 / 5000, 1 / 10, 1 / 10000, 1 / 1000]
var blessingDRPower = [null, 1 / 3, 1 / 3, 2 / 3, 1 / 2, 2 / 3, 2, 1 / 3, 1 / 3, 1 / 16, 1 / 16]
//100 of each before Diminishing Returns
var giftbase = [null, 1 / 500, 1 / 500, 1 / 500, 1 / 500, 1 / 500, 1 / 500, 1 / 500, 1 / 500, 1 / 500, 1 / 500]
var giftDRPower = [null, 1 / 6, 1 / 6, 1 / 3, 1 / 4, 1 / 3, 1, 1 / 6, 1 / 6, 1 / 32, 1 / 32]
//10 of each before Diminishing Returns
var benedictionbase = [null, 3 / 100, 3 / 100, 3 / 100, 3 / 100, 3 / 100, 3 / 100, 3 / 100, 3 / 100, 3 / 100, 3 / 100]
var benedictionDRPower = [null, 1 / 12, 1 / 12, 1 / 6, 1 / 8, 1 / 6, 1 / 2, 1 / 12, 1 / 12, 1 / 64, 1 / 64]


var cubeBonusMultiplier = [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
var tesseractBonusMultiplier = [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
var hypercubeBonusMultiplier = [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

var buyMaxCubeUpgrades = false;
var autoOfferingCounter = 0;
var autoOfferingCounter2 = 0;

var researchOrderByCost = []

var divisivenessMultiplier = [1, 0.75, 0.5, 0.3, 0.2, 0.15, 0.1, 0.06]
var maladaptiveMultiplier = [1, 0.75, 0.5, 0.3, 0.2, 0.15, 0.1, 0.06]
var lazinessMultiplier = [1, 0.66, 0.50, 0.33, 0.25, 0.15, 0.05, 0.01]
var hyperchallengedMultiplier = [1, 1.2, 1.5, 2, 3, 5, 10, 20]
var illiteracyPower = [1, 0.98, 0.93, 0.85, 0.8, 0.7, 0.6, 0.5]
var deflationMultiplier = [1, 0.75, 0.5, 0.25, 0.125, 0.06, 0.03, 0.01]
var extinctionMultiplier = [1, 1.25, 1.5, 2, 3, 6, 11, 26]
var droughtMultiplier = [1, 2, 3, 5, 10, 20, 50, 100]
var financialcollapsePower = [1, 0.9, 0.75, 0.5, 0.4, 0.3, 0.2, 0.1]

var corruptionAddPointArray = [0, 50, 100, 150, 200, 300, 400, 500]
var corruptionMultiplyPointArray = [0, 10, 20, 30, 50, 80, 110, 150]

var ascendBuildingProduction = {
    first: new Decimal('0'),
    second: new Decimal('0'),
    third: new Decimal('0'),
    fourth: new Decimal('0'),
    fifth: new Decimal('0'),
}
var freeUpgradeAccelerator = 0;
var freeUpgradeMultiplier = 0;

var acceleratorMultiplier = 1;
var multiplierMultiplier = 1;
var indevSpeed = 1

var testArray = []

var constUpgradeCosts = [null, 1, 13, 17, 237, 316, 4216, 5623, 74989, 1e10, 1e24]

var globalConstantMult = new Decimal("1")
var autoTalismanTimer = 0

var autoChallengeTimerIncrement = 0;