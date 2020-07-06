var runediv = [1.5, 2, 3, 5, 8]
var runeexpbase = [1, 4, 9, 16, 1000]

// this shows the logarithm of costs. ex: upgrade one will cost 1e+6 coins, upgrade 2 1e+7, etc.
var upgradeCosts = [0, 6, 7, 8, 10, 12, 20, 25, 30, 35, 45, 55, 75, 110, 150, 200, 250, 500, 750, 1000, 1500,
					   2, 3, 4, 5, 6, 7, 10, 13, 20, 30, 150, 400, 800, 1600, 3200, 10000, 20000, 50000, 100000, 200000,
						1, 2, 3, 5, 6, 7, 42, 65, 87, 150, 300, 500, 1000, 1500, 2000, 3000, 6000, 12000, 25000, 75000,
						0, 1, 2, 2, 3, 5, 6, 10, 15, 22, 30, 37, 45, 52, 60, 1900, 2500, 3000, 7482, 21397,
						3, 6, 9, 12, 15, 20, 30, 6, 8, 8, 10, 13, 60, 1, 2, 4, 8, 16, 25, 40,
						12, 16, 20, 30, 50, 500, 1250, 5000, 25000, 125000, 1500, 7500, 30000, 150000, 1000000, 250, 1000, 5000, 25000, 125000];

// Mega list of Variables to be used elsewhere
var crystalUpgradesCost = [6, 15, 20, 40, 100, 200, 500, 1000]
var crystalUpgradeCostIncrement = [8, 15, 20, 40, 100, 200, 500, 1000]
var researchBaseCosts = [0, 1, 1, 1, 1, 1,
							1, 5, 25, 500, 10000,
							1, 5, 25, 500, 10000,
							20, 250, 10, 2500, 750000,
							10, 10, 500, 100, 2000,
							10, 50, 25, 2500, 100000,
							777, 7.777e7, 10000, 100000, 1000000,
							2, 500, 250000, 2500, 50000,
							1, 1, 5, 25, 125,
							2, 5, 320, 1280, 2.5e9,
							10, 100, 1000, 100000, 2000000,
							10, 100, 1000, 25000, 500000,
							15, 50, 125, 500, 20000,
							2, 20, 200, 2000, 20000,
							10, 40, 160, 1000, 10000,
							5e6, 1e7, 1e7, 2e7, 2e7,
							7.5e7, 2.5e8, 5e7, 5e8, 7.5e7,
							1e8, 1.25e8, 1.5e8, 2e8, 3e8,
							1e8, 4e8, 1e9, 2.5e9, 1e10,
							2e9, 5e9, 2e10, 5e9, 7.777e12,
							5e10, 1.5e11, 3e10, 3e11, 1e13,
							5e11, 1e13, 5e10, 1e12, 2e13,
							1e15, 2e15, 4e15, 8e15, 1.5e16,
							1e16, 1e17, 1e18, 1e18, 1e20,
							1e17, 1e17, 1e18, 1e18, 1e24
							]



var researchMaxLevels = [0, 1, 1, 1, 1, 1,
							 10, 20, 30, 40, 50,
							 10, 20, 30, 40, 50,
							 50, 50, 1, 1, 1,
							 200, 25, 25, 20, 20,
							 90, 180, 40, 40, 40,
							 12, 12, 55, 55, 55,
							 50, 50, 50, 1, 1,
							 1, 1, 1, 1, 1,
							 1, 1, 1, 1, 1,
							 10, 10, 10, 10, 10,
							 20, 20, 20, 20, 20,
							 1, 4, 4, 5, 50,
							 50, 50, 50, 50, 50,
							 1, 1, 1, 1, 1,
							 50, 50, 50, 50, 50,
							 100, 1, 50, 100, 100,
							 100, 100, 100, 100, 10,
							 100, 100, 100, 100, 1,
							 100, 20, 20, 2, 1,
							 10, 10, 25, 25, 1,
							 10, 10, 100, 125, 25,
							 50, 50, 50, 50, 100,
							 10, 10, 10, 100, 100,
							 100, 100, 100, 1, 1]								

var ticker = 0;

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
var challengeFivePower = 1/3;

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

var challengebaserequirements = {
	one: 10,
	two: 20,
	three: 60,
	four: 100,
	five: 200,
	six: 1000,
	seven: 1000,
	eight: 1000,
	nine: 1000,
	ten: 1000,
}

var challengebaserequirementsrein = {
	six: 125,
	seven: 500,
	eight: 12000,
	nine: 2.66e8,
	ten: 1e9,
}

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
var talismanFragmentObtainiumCosts = [null, 3e6, 1e7, 1e8, 1e9, 1e10, 1e11]
var talismanFragmentOfferingCosts = [null, 0, 5, 40, 400, 2000, 10000]


var talismanLevelCostMultiplier = [null, 1, 4, 9, 16, 25, 10, 100]

var talismanPositiveModifier = [null, 0.25, 0.5, 0.75, 1, 1.25, 1.5]
var talismanNegativeModifier = [null, 0.2, 0.4, 0.6, 0.8, 1, 1.2]

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

var divineBlessing1 = 1;
var divineBlessing2 = 1;
var divineBlessing3 = 1;
var divineBlessing4 = 1;
var divineBlessing5 = 0;

var triggerChallenge = ""

var prevReductionValue = -1;