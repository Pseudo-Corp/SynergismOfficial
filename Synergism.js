

// BETA SAVE FUNCTION

const player = {
	worlds: 0,
	coins: new Decimal("1e2"),
	coinsThisPrestige: new Decimal("1e2"),
	coinsThisTranscension: new Decimal("1e2"),
	coinsThisReincarnation: new Decimal("1e2"),
	coinsTotal: new Decimal("100"),

	firstOwnedCoin: 0,
	firstGeneratedCoin: new  Decimal("0"),
	firstCostCoin: new Decimal("100"),
	firstProduceCoin: 0.25,

	secondOwnedCoin: 0,
	secondGeneratedCoin: new Decimal("0"),
	secondCostCoin: new Decimal("2e3"),
	secondProduceCoin: 2.5,

	thirdOwnedCoin: 0,
   thirdGeneratedCoin: new Decimal("0"),
   thirdCostCoin: new Decimal("4e4"),
   thirdProduceCoin: 25,

   fourthOwnedCoin: 0,
   fourthGeneratedCoin: new Decimal("0"),
   fourthCostCoin: new Decimal("8e5"),
   fourthProduceCoin: 250,

   fifthOwnedCoin: 0,
   fifthGeneratedCoin: new Decimal("0"),
   fifthCostCoin: new Decimal("16e6"),
   fifthProduceCoin: 2500,

   firstOwnedDiamonds: 0,
   firstGeneratedDiamonds: new Decimal("0"),
   firstCostDiamonds: new Decimal("100"),
   firstProduceDiamonds: 0.05,
   
   secondOwnedDiamonds: 0,
   secondGeneratedDiamonds: new Decimal("0"),
   secondCostDiamonds: new Decimal("1e5"),
   secondProduceDiamonds: 0.0005,
   
   thirdOwnedDiamonds: 0,
   thirdGeneratedDiamonds: new Decimal("0"),
   thirdCostDiamonds: new Decimal("1e15"),
   thirdProduceDiamonds: 0.00005,
   
   fourthOwnedDiamonds: 0,
   fourthGeneratedDiamonds: new Decimal("0"),
   fourthCostDiamonds: new Decimal("1e40"),
   fourthProduceDiamonds: 0.000005,
   
   fifthOwnedDiamonds: 0,
   fifthGeneratedDiamonds: new Decimal("0"),
   fifthCostDiamonds: new Decimal("1e100"),
   fifthProduceDiamonds: 0.000005,

   firstOwnedMythos: 0,
   firstGeneratedMythos: new Decimal("0"),
   firstCostMythos: new Decimal("1"),
   firstProduceMythos: 1,

   secondOwnedMythos: 0,
   secondGeneratedMythos: new Decimal("0"),
   secondCostMythos: new Decimal("100"),
   secondProduceMythos: 0.01,

   thirdOwnedMythos: 0,
   thirdGeneratedMythos: new Decimal("0"),
   thirdCostMythos: new Decimal("1e4"),
   thirdProduceMythos: 0.001,

   fourthOwnedMythos: 0,
   fourthGeneratedMythos: new Decimal("0"),
   fourthCostMythos: new Decimal("1e8"),
   fourthProduceMythos: 0.0002,

   fifthOwnedMythos: 0,
   fifthGeneratedMythos: new Decimal("0"),
   fifthCostMythos: new Decimal("1e16"),
   fifthProduceMythos: 0.00004,

   firstOwnedParticles: 0,
   firstGeneratedParticles: new Decimal("0"),
   firstCostParticles: new Decimal("1"),
   firstProduceParticles: .25,

   secondOwnedParticles: 0,
   secondGeneratedParticles: new Decimal("0"),
   secondCostParticles: new Decimal("100"),
   secondProduceParticles: .20,
   
   thirdOwnedParticles: 0,
   thirdGeneratedParticles: new Decimal("0"),
   thirdCostParticles: new Decimal("1e4"),
   thirdProduceParticles: .15,

   fourthOwnedParticles: 0,
   fourthGeneratedParticles: new Decimal("0"),
   fourthCostParticles: new Decimal("1e8"),
   fourthProduceParticles: .10,

   fifthOwnedParticles: 0,
   fifthGeneratedParticles: new Decimal("0"),
   fifthCostParticles: new Decimal("1e16"),
   fifthProduceParticles: .5,

   firstOwnedAnts: 0,
   firstGeneratedAnts: new Decimal("0"),
   firstCostAnts: new Decimal("1e800"),
   firstProduceAnts: .0001,

   secondOwnedAnts: 0,
   secondGeneratedAnts: new Decimal("0"),
   secondCostAnts: new Decimal("3"),
   secondProduceAnts: .00005,

   thirdOwnedAnts: 0,
   thirdGeneratedAnts: new Decimal("0"),
   thirdCostAnts: new Decimal("100"),
   thirdProduceAnts: .00002,

   fourthOwnedAnts: 0,
   fourthGeneratedAnts: new Decimal("0"),
   fourthCostAnts: new Decimal("1e4"),
   fourthProduceAnts: .00001,

   fifthOwnedAnts: 0,
   fifthGeneratedAnts: new Decimal("0"),
   fifthCostAnts: new Decimal("1e12"),
   fifthProduceAnts: .000005,

   sixthOwnedAnts: 0,
   sixthGeneratedAnts: new Decimal("0"),
   sixthCostAnts: new Decimal("1e36"),
   sixthProduceAnts: .000002,

   seventhOwnedAnts: 0,
   seventhGeneratedAnts: new Decimal("0"),
   seventhCostAnts: new Decimal("1e100"),
   seventhProduceAnts: .000001,

   eighthOwnedAnts: 0,
   eighthGeneratedAnts: new Decimal("0"),
   eighthCostAnts: new Decimal("1e300"),
   eighthProduceAnts: .00000001,
   
   multiplierCost: new Decimal("1e5"),
   multiplierBought: 0,

   acceleratorCost: new Decimal("500"),
   acceleratorBought: 0,

   acceleratorBoostBought: 0,
   acceleratorBoostCost: new Decimal("1e3"),

   upgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, //Coin Upgrades, Ignore First.
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,    //Prestige Upgrades
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,	   //Transcend Upgrades
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,	   //Reincarnation Upgrades
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,	   //Automation Upgrades
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],   //Generator Upgrades
   

			   prestigeCount: 0,
			   transcendCount: 0,
			   reincarnationCount: 0,
			  
			   prestigePoints: new Decimal("0"),
			   transcendPoints: new Decimal("0"),
			   reincarnationPoints: new Decimal("0"),
			  
			   prestigeShards: new Decimal("0"),
			   transcendShards: new Decimal("0"),
			   reincarnationShards: new Decimal("0"),
			  
			   toggles: {
				   one: false,
				   two: false,
				   three: false,
				   four: false,
				   five: false,
				   six: false,
				   seven: false,
				   eight: false,
				   nine: false,
				   ten: false,
				   eleven: false,
				   twelve: false,
				   thirteen: false,
				   fourteen: false,
				   fifteen: false,
				   sixteen: false,
				   seventeen: false,
				   eighteen: false,
				   nineteen: false,
				   twenty: false,
				   twentyone: false,
				   twentytwo: true,
				   twentythree: true,
				   twentyfour: true,
				   twentyfive: true,
				   twentysix: true,
				   twentyseven: false,
				   twentyeight: true,
				   twentynine: true,
				   thirty: true,
				   thirtyone: false,
				   thirtytwo: false,
				   thirtythree: false,
			   },
			   
			  resourceGenerators: {
				  diamonds: false,
				  mythos: false,
			  },
			  
			  keepUpgrades: {
				  coinUpgrades: false,
				  prestigeUpgrades: false,
				  crystalUpgrades: false,
				  transcendUpgrades: false,
				  autobuyers: false,
				  generators: false
			  },
			  
			  challengecompletions: {
				  one: 0,
				  two: 0,
				  three: 0,
				  four: 0,
				  five: 0,
				  six: 0,
				  seven: 0,
				  eight: 0,
				  nine: 0,
				  ten: 0
			  },
			  
			  highestchallengecompletions: {
				  one: 0,
				  two: 0,
				  three: 0,
				  four: 0,
				  five: 0,
				  six: 0,
				  seven: 0,
				  eight: 0,
				  nine: 0,
				  ten: 0
			  },
			  retrychallenges: false,
			   currentChallenge: "",
			   currentChallengeRein: "",
			  researchPoints: 0,
			  obtainiumtimer: 0,
			  obtainiumlocktoggle: false,
			  obtainiumpersecond: 0,
			  maxobtainiumpersecond: 0,
			  maxobtainium: 0,
			  // Ignore the first index. The other 25 are shaped in a 5x5 grid similar to the production appearance
			  researches: [0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0,
							   0, 0, 0, 0, 0],
			  
			  unlocks: {
				  coinone: false,
				  cointwo: false,
				  cointhree: false,
				  coinfour: false,
				  prestige: false,
				  generation: false,
				  transcend: false,
				  reincarnate: false,
				  rrow1: false,
				  rrow2: false,
				  rrow3: false,
				  rrow4: false
			  },
			  achievements: [0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0,
							  0, 0, 0, 0, 0, 0, 0],
			  
			  achievementPoints: 0,
			  
			  prestigenomultiplier: true,
			  prestigenoaccelerator: true,
			  transcendnomultiplier: true,
			  transcendnoaccelerator: true,
			  reincarnatenomultiplier: true,
			  reincarnatenoaccelerator: true,
			  prestigenocoinupgrades: true,
			  transcendnocoinupgrades: true,
			  transcendnocoinorprestigeupgrades: true,
			  reincarnatenocoinupgrades: true,
			  reincarnatenocoinorprestigeupgrades: true,
			  reincarnatenocoinprestigeortranscendupgrades: true,
			  reincarnatenocoinprestigetranscendorgeneratorupgrades: true,
			  
			  crystalUpgrades: [0,0,0,0,0,0,0,0],
			  crystalUpgradesCost: [7, 15, 20, 40, 100, 200, 500, 1000],
			  
			  runelevels: [1, 1, 1, 1, 1],
			  runeexp: [0, 0, 0, 0, 0,],
			  runeshards: 0,
			  offeringlocktoggle: false,
			  maxofferings: 0,
			  offeringpersecond: 0,

			  prestigecounter: 0,
			  transcendcounter: 0,
			  reincarnationcounter: 0,
			  offlinetick: 0,
			  
			  prestigeamount: 0,
			  transcendamount: 0,
			  reincarnationamount: 0,
			  
			  fastestprestige: 9999999999,
			  fastesttranscend: 99999999999,
			  fastestreincarnate: 999999999999,
			  
			  resettoggle1: 1,
			  resettoggle2: 1,
			  resettoggle3: 1,
			  
			  coinbuyamount: 1,
			  crystalbuyamount: 1,
			  mythosbuyamount: 1,
			  particlebuyamount: 1,
			  offeringbuyamount: 1,
			  
			  
			  
			  shoptoggles: {
				  coin: true,
				  prestige: true,
				  transcend: true,
				  generators: true,
			  },
			  tabnumber: 1,
			  
			  offerpromo1used: false,
			  offerpromo2used: false,
			  offerpromo3used: false,
			  offerpromo4used: false,
			  offerpromo5used: false,
			  offerpromo6used: false,
			  offerpromo7used: false,
			  offerpromo8used: false,
			  offerpromo9used: false,
			  offerpromo10used: false,
			  offerpromo11used: false,
			  offerpromo12used: false,
			  offerpromo13used: false,
			  offerpromo14used: false,
			  offerpromo15used: false,
			  offerpromo16used: false,
			  offerpromo17used: false,
			  offerpromo18used: false,
			  offerpromo19used: false,
			  offerpromo20used: false,
			  offerpromo21used: false,
			  offerpromo22used: false,
			  offerpromo23used: false,

			  loaded1009: false,
			  loaded1009hotfix1: false,
			  loaded10091: false,
			  loaded1010: false,
			  loaded10101: false,

			  shopUpgrades: {
				  offeringPotion: 1,
				  obtainiumPotion: 1,
				  offeringTimerLevel: 0,
				  obtainiumTimerLevel: 0,
				  offeringAutoLevel: 0,
				  obtainiumAutoLevel: 0,
				  instantChallengeBought: false,
				  cashGrabLevel: 0,
				  antSpeedLevel: 0,
				  talismanBought: false,
			  },
			  autoSacrificeToggle: false,
			  autoResearchToggle: false,
			  autoResearch: 0,
			  autoSacrifice: 0,
			  sacrificeTimer: 0,
			  quarkstimer: 90000,

			  antPoints: new Decimal("1"),
			  antUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  antSacrificePoints: 0,
			  antSacrificeTimer: 0,

			  talismanLevels: [null, 0, 0, 0, 0, 0, 0, 0],
			  talismanRarity: [null, 1, 1, 1, 1, 1, 1, 1],
			  talismanOne: [null, -1, 1, 1, 1, -1],
			  talismanTwo: [null, 1, 1, -1, -1, 1],
			  talismanThree: [null, 1, -1, 1, 1, -1],
			  talismanFour: [null, -1, -1, 1, 1, 1],
			  talismanFive: [null, 1, 1, -1, -1, 1],
			  talismanSix: [null, 1, 1, 1, -1, -1],
			  talismanSeven: [null, -1, 1, -1, 1, 1],
			  talismanShards: 0,
			  commonFragments: 0,
			  uncommonFragments: 0,
			  rareFragments: 0,
			  epicFragments: 0,
			  legendaryFragments: 0,
			  mythicalFragments: 0,

			  buyTalismanShardPercent: 10,

			  autoAntSacrifice: false,
			  antMax: false,

			  brokenfile1: false,
			  exporttest: "YES!",
			  kongregatetest: "NO!"
}

Object.defineProperty(player, 'version', {
   configurable: false,
   enumerable: true,
   value: '1.0101'
});

function saveSynergy(button) {
	   player.offlinetick = Date.now()
	   player.loaded1009 = true;
	   player.loaded1009hotfix1 = true;
	   
   	const p = player; // temp hold
	delete p.version; // don't save
   	localStorage.setItem("Synergysave2", btoa(JSON.stringify(p)));	

   	if (button) {
		let el = document.getElementById("saveinfo").textContent;
		el = "Game saved successfully!"
		setTimeout(function() {
			el = '';
		}, 4000);
   	}
}



function loadSynergy() {
   const string = localStorage.getItem("Synergysave2");
   const data = string ? JSON.parse(atob(string)) : null;


   if (data) {
	   function isDecimal(o) {
		   if(!(o instanceof Object)) {
			   return false;
		   }
		   return Object.keys(o).length === 2 && Object.keys(o).every(function(v) { return ['mantissa', 'exponent'].indexOf(v) > -1 });
	   }

	   if(data.version) {
		   delete data.version;
	   }
	   try{
	   Object.keys(data).forEach(function(v) {
		   Object.defineProperty(player, v, {
			   value: isDecimal(player[v]) ? new Decimal(data[v]) : data[v]
		   });
	   });}
	   catch(err){console.log(err)}

	   if (data.loaded1009 === undefined || !data.loaded1009 || data.loaded1009 === null){player.loaded1009 = false;}
	   if (data.loaded1009hotfix1 === undefined || !data.loaded1009hotfix1 || data.loaded1009hotfix1 === null){player.loaded1009hotfix1 = false;}
	   if (data.loaded10091 === undefined){player.loaded10091 = false;}
	   if (data.offerpromo20used === undefined){player.offerpromo20used = false;}
	   if (data.loaded1010 === undefined){player.loaded1010 = false;}
	   if (data.offerpromo22used === undefined){player.offerpromo22used = false;}
	   if (data.loaded10101 === undefined){player.loaded10101 = false;}

	   if (player.offerpromo6used === undefined){
		player.offerpromo6used = false; 
		player.obtainiumtimer = 0; 
		player.offlinetick = new Date.now();
	   }
	   if (player.offerpromo7used === undefined){
		player.offerpromo7used = false;
		if(player.fastestreincarnate < 15) {
			player.fastestreincarnate = 999999
		}
		
		player.researchPoints += 100 * player.researches[19];
		player.researchPoints += 1000 * player.researches[20];
		player.researchPoints += 1 * player.researches[51];
		player.researchPoints += 10 * player.researches[52];
		player.researchPoints += 500 * player.researches[53];
		player.researchPoints += 15000 * player.researches[54];
		player.researchPoints += 500000 * player.researches[55];
		player.researchPoints += 5 * player.researches[56];
		player.researchPoints += 25 * player.researches[57];
		player.researchPoints += 125 * player.researches[58];
		player.researchPoints += 625 * player.researches[59];
		player.researchPoints += 3125 * player.researches[60];
		player.researchPoints += 5 * player.researches[37];
		player.researchPoints += 25 * player.researches[38];
		player.researchPoints += 100 * player.researches[68];
		player.researchPoints += 250 * player.researches[69];
		player.researchPoints += 1000 * player.researches[70];

		player.researches[19] = 0;
		player.researches[20] = 0;
		player.researches[51] = 0;
		player.researches[52] = 0;
		player.researches[53] = 0;
		player.researches[54] = 0;
		player.researches[55] = 0;
		player.researches[56] = 0;
		player.researches[57] = 0;
		player.researches[58] = 0;
		player.researches[59] = 0;
		player.researches[60] = 0;
		player.researches[37] = 0;
		player.researches[38] = 0;
		player.researches[68] = 0;
		player.researches[69] = 0;
		player.researches[70] = 0;   
	   }

	   if (player.offerpromo8used === undefined){
		player.offerpromo8used = false;
		player.researchPoints += 5 * player.researches[61];
		player.researchPoints += 20 * player.researches[62];
		player.researchPoints += 80 * player.researches[63];
		player.researchPoints += 320 * player.researches[64];
		player.researchPoints += 1280 * player.researches[65];

		player.researches[61] = 0;
		player.researches[62] = 0;
		player.researches[63] = 0;
		player.researches[64] = 0;
		player.researches[65] = 0;


	}

	if (player.offerpromo9used === undefined){
		player.offerpromo9used = false;
	}
	if (player.offerpromo10used === undefined){
		player.offerpromo10used = false;
		player.resettoggle1 = 1;
		player.resettoggle2 = 1;
		player.resettoggle3 = 1;
		player.retrychallenges = false
	}
	if (player.offerpromo11used === undefined){
		player.offerpromo11used = false;
	}
	if (player.offerpromo12used === undefined) {
		player.offerpromo12used = false;
	}
	if (player.offerpromo13used === undefined){
		player.offerpromo13used = false;
		player.researches.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	    player.achievements.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	    player.offeringlocktoggle = false;
		player.obtainiumlocktoggle = false;
		player.researchPoints += 51200 * player.researches[50];
		player.researches[50] = 0;
		player.maxofferings = player.runeshards;
		player.maxobtainium = player.researchPoints;

	}
	if (player.researches[76] === undefined){
		player.offerpromo13used = false;
		player.researches.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
		player.achievements.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
		player.maxofferings = player.runeshards;
		player.maxobtainium = player.researchPoints;
		player.researchPoints += 51200 * player.researches[50];
		player.researches[50] = 0;
		player.offeringlocktoggle = false;
		player.obtainiumlocktoggle = false;
	}

	if (player.offerpromo14used === undefined){
		player.offerpromo14used = false;
		if (player.researches[50] < 0.5) {player.unlocks.rrow4 = false;}
		player.reincarnatenomultiplier = true;
	}
	
	player.maxofferings = player.maxofferings || 0;
	player.maxobtainium = player.maxobtainium || 0;
	player.runeshards = player.runeshards || 0;
	player.researchPoints = player.researchPoints || 0;

	if (player.offerpromo15used === undefined){
		player.offerpromo15used = false;
		if (player.runeshards > 1000000){player.runeshards = 1000000; player.maxofferings = 1000000;};
		if (player.researchPoints > 1.5e9){player.researchPoints = 1.5e9; player.maxobtainium = 1.5e9;};

	}
	if (player.offerpromo16used === undefined){
		player.offerpromo16used = false;
		player.brokenfile1 = false;
	}
	if (player.offerpromo17used === undefined){
		player.offerpromo17used = false;
		player.offeringpersecond = 0;
		player.obtainiumpersecond = 0;
		player.quarkstimer = 90000;
		player.researchPoints += (100 * player.researches[31] + 1000 * player.researches[32]);
		player.researches[31] = 0;
		player.researches[32] = 0;
	}

	if (!data.loaded1009 || data.loaded1009 === undefined || data.loaded1009hotfix1 === null || data.shopUpgrades.offeringPotion === undefined) {
		player.firstOwnedParticles = 0;
		player.secondOwnedParticles = 0;
		player.thirdOwnedParticles = 0;
		player.fourthOwnedParticles = 0;
		player.fifthOwnedParticles = 0;
		player.firstCostParticles = new Decimal("1");
		player.secondCostParticles = new Decimal("1e2");
		player.thirdCostParticles = new Decimal("1e4");
		player.fourthCostParticles = new Decimal("1e8");
		player.fifthCostParticles = new Decimal("1e16");
		player.autoSacrificeToggle = false;
		player.autoResearchToggle = false;
		player.autoResearch = 0;
		player.autoSacrifice = 0;
		player.sacrificeTimer = 0;
		player.loaded1009 = true;
		player.offerpromo18used = false;
		player.shopUpgrades = {
			offeringPotion: 1,
			obtainiumPotion: 1,
			offeringTimerLevel: 0,
			obtainiumTimerLevel: 0,
			offeringAutoLevel: 0,
			obtainiumAutoLevel: 0,
			instantChallengeBought: false,
			cashGrabLevel: 0
		};
	} 
	if (!data.loaded1009hotfix1 || data.loaded1009hotfix1 === undefined || data.loaded1009hotfix1 === null) {
		player.loaded1009hotfix1 = true;
		player.offerpromo19used = true;
		player.firstOwnedParticles = 0;
		player.secondOwnedParticles = 0;
		player.thirdOwnedParticles = 0;
		player.fourthOwnedParticles = 0;
		player.fifthOwnedParticles = 0;
		player.firstCostParticles = new Decimal("1");
		player.secondCostParticles = new Decimal("1e2");
		player.thirdCostParticles = new Decimal("1e4");
		player.fourthCostParticles = new Decimal("1e8");
		player.fifthCostParticles = new Decimal("1e16");
	}
	if (data.offerpromo19used === undefined || data.loaded10091 === undefined || !data.loaded10091 || player.researches[86] > 100 || player.researches[87] > 100 || player.researches[88] > 100 || player.researches[89] > 100 || player.researches[90] > 10){
		player.offerpromo19used = false;
		player.loaded10091 = true;
		player.researchPoints += 7.5e8 * player.researches[82];
		player.researchPoints += 2e8 * player.researches[83];
		player.researchPoints += 4.5e9 * player.researches[84];
		player.researchPoints += 2.5e7 * player.researches[86];
		player.researchPoints += 7.5e7 * player.researches[87];
		player.researchPoints += 3e8 * player.researches[88];
		player.researchPoints += 1e9 * player.researches[89];
		player.researchPoints += 2.5e7 * player.researches[90];
		player.researchPoints += 1e8 * player.researches[91];
		player.researchPoints += 2e9 * player.researches[92];
		player.researchPoints += 9e9 * player.researches[93];
		player.researchPoints += 7.25e10 * player.researches[94];
		player.researches[86] = 0;
		player.researches[87] = 0;
		player.researches[88] = 0;
		player.researches[89] = 0;
		player.researches[90] = 0;
		player.researches[91] = 0;
		player.researches[92] = 0;
	}

	if (data.achievements[169] === undefined || player.achievements[169] === undefined || data.shopUpgrades.antSpeedLevel === undefined || player.shopUpgrades.antSpeedLevel === undefined || data.loaded1010 === undefined || player.loaded1010 === false) {
		player.loaded1010 = true;
		player.offerpromo21used = false;

		player.firstOwnedAnts = 0;
   		player.firstGeneratedAnts = new Decimal("0");
   		player.firstCostAnts = new Decimal("1e1200");
   		player.firstProduceAnts = .0001;

		player.secondOwnedAnts = 0;
		player.secondGeneratedAnts = new Decimal("0");
		player.secondCostAnts = new Decimal("3");
		player.secondProduceAnts = .00005;

		player.thirdOwnedAnts = 0;
		player.thirdGeneratedAnts = new Decimal("0");
		player.thirdCostAnts = new Decimal("100");
		player.thirdProduceAnts = .00002;

		player.fourthOwnedAnts = 0,
   		player.fourthGeneratedAnts = new Decimal("0");
   		player.fourthCostAnts = new Decimal("1e4");
   		player.fourthProduceAnts = .00001;

   		player.fifthOwnedAnts = 0;
   		player.fifthGeneratedAnts = new Decimal("0");
   		player.fifthCostAnts = new Decimal("1e12");
   		player.fifthProduceAnts = .000005;

   		player.sixthOwnedAnts = 0;
   		player.sixthGeneratedAnts = new Decimal("0");
   		player.sixthCostAnts = new Decimal("1e36");
   		player.sixthProduceAnts = .000002;

   		player.seventhOwnedAnts = 0;
   		player.seventhGeneratedAnts = new Decimal("0");
   		player.seventhCostAnts = new Decimal("1e100");
   		player.seventhProduceAnts = .000001;

   		player.eighthOwnedAnts = 0;
   		player.eighthGeneratedAnts = new Decimal("0");
   		player.eighthCostAnts = new Decimal("1e300");
   		player.eighthProduceAnts = .00000001;
	
		player.achievements.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0);
		player.antPoints = new Decimal("1");

		player.upgrades[38] = 0;
		player.upgrades[39] = 0;
		player.upgrades[40] = 0;

		player.upgrades[76] = 0;
		player.upgrades[77] = 0;
		player.upgrades[78] = 0;
		player.upgrades[79] = 0;
		player.upgrades[80] = 0;


		player.shopUpgrades.antSpeedLevel = 0;
		player.shopUpgrades.talismanBought = false;

		player.antUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		player.unlocks.rrow4 = false;
		player.researchPoints += 3e7 * player.researches[50];
		player.researchPoints += 2e9 * player.researches[96];
		player.researchPoints += 5e9 * player.researches[97];
		player.researchPoints += 3e10 * player.researches[98];
		player.researches[50] = 0;
		player.researches[96] = 0;
		player.researches[97] = 0;
		player.researches[98] = 0;
		player.researches.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)

		player.talismanLevels = [null, 0, 0, 0, 0, 0, 0, 0];
		player.talismanRarity = [null, 1, 1, 1, 1, 1, 1, 1];

		player.talismanShards = 0;
		player.commonFragments = 0;
		player.uncommonFragments = 0;
		player.rareFragments = 0;
		player.epicFragments = 0;
		player.legendaryFragments = 0;
		player.mythicalFragments = 0;
		player.buyTalismanShardPercent = 10;

		player.talismanOne = [null, -1, 1, 1, 1, -1];
		player.talismanTwo = [null, 1, 1, -1, -1, 1];
		player.talismanThree = [null, 1, -1, 1, 1, -1];
		player.talismanFour = [null, -1, -1, 1, 1, 1];
		player.talismanFive = [null, 1, 1, -1, -1, 1];
		player.talismanSix = [null, 1, 1, 1, -1, -1];
		player.talismanSeven = [null, -1, 1, -1, 1, 1];

		player.antSacrificePoints = 0;
		player.antSacrificeTimer = 0;

		player.obtainiumpersecond = 0;
		player.maxobtainiumpersecond = 0;
		
	}

	if(data.offerpromo22used === undefined || data.offerpromo22used === false){
		player.offerpromo22used = false;
	}

	if(data.loaded10101 === undefined || data.loaded10101 === false){
		player.offerpromo23used = false;
		player.loaded10101 = true;

		let refundThese = [0,31,32,61,62,63,64,76,77,78,79,80,
							81, 98, 104, 105, 106, 107, 108,
							109, 110, 111, 112, 113, 114, 115, 116,
							117, 118, 119, 120, 121, 122, 123, 125];
		let refundReward = [0, 2, 20, 5, 10, 80, 5e3, 1e7, 1e7, 2e7, 3e7, 4e7,
							2e8, 3e10, 1e11, 1e12, 2e11, 1e12, 2e10,
							2e11, 1e12, 2e13, 5e13, 1e14, 2e14, 5e14, 1e15,
							2e15, 1e16, 1e15, 1e16, 1e14, 1e15, 1e15, 1e20];
		for (var i = 1; i < refundThese.length; i++){
			player.researchPoints += player.researches[refundThese[i]] * refundReward[i]
			player.researches[refundThese[i]] = 0; 
		}
		player.autoAntSacrifice = false;
		player.antMax = false;
	}


		if (player.transcendCount < 0){player.transcendCount = 0};
		if (player.reincarnationCount < 0){player.reincarnationCount = 0;};
		if (player.runeshards < 0){player.runeshards = 0;};
		if (player.researchPoints < 0){player.researchPoints = 0;};

	if (player.resettoggle1 == 0) {
		player.resettoggle1 = 1;
		player.resettoggle2 = 1;
		player.resettoggle3 = 1;
	}
	if (player.reincarnationCount < 0.5 && player.unlocks.rrow4 == true) {
		player.unlocks = {
			coinone: false,
			cointwo: false,
			cointhree: false,
			coinfour: false,
			prestige: false,
			generation: false,
			transcend: false,
			reincarnate: false,
			rrow1: false,
			rrow2: false,
			rrow3: false,
			rrow4: false
		}
	}
	if (player.achievements[176] === undefined || data.achievements[176] === undefined){
		player.achievements.push(0,0,0,0,0,0,0)
	}


var j
for (j = 1; j < player.upgrades.length; j++) {
		upgradeupdate(j);
	}

for (j = 1; j <= (125); j++) {
	var k = "res" + j
	if (player.researches[j] > 0.5 && player.researches[j] < researchMaxLevels[j]) {document.getElementById(k).style.backgroundColor = "purple"}
	else if (player.researches[j] > 0.5 && player.researches[j] >= researchMaxLevels[j]) {document.getElementById(k).style.backgroundColor = "green"}
	else {document.getElementById(k).style.backgroundColor = "black"}
}

runescreen = "runes";
document.getElementById("runecontainer1").style.display = "block";
document.getElementById("runecontainer2").style.display = "none";
document.getElementById("togglerunesubtab").textContent = "GO TO TALISMANS"
document.getElementById("togglerunesubtab").style.border = "2px solid grey"

	
var q = ['coin','crystal','mythos','particle','offering']
for (j = 0; j <= 4; j++) {
	for (k = 0; k < 4; k++) {
		if (k == 0){var d = 'one'}
		if (k == 1){var d = 'ten'}
		if (k == 2){var d = 'hundred'}
		if (k == 3){var d = 'thousand'}
		var e = q[j] + d
	document.getElementById(e).style.backgroundColor = "#000000"
	}
	if (player[q[j] + 'buyamount'] == 1) {var c = 'one'}
	if (player[q[j] + 'buyamount'] == 10) {var c = 'ten'}
	if (player[q[j] + 'buyamount'] == 100) {var c = 'hundred'}
	if (player[q[j] + 'buyamount'] == 1000) {var c = 'thousand'}

	var b = q[j] + c
	document.getElementById(b).style.backgroundColor = "green"

}

if (player.shoptoggles.coin == false) {document.getElementById("shoptogglecoin").textContent = "Auto: OFF"}
if (player.shoptoggles.prestige == false) {document.getElementById("shoptoggleprestige").textContent = "Auto: OFF"}
if (player.shoptoggles.transcend == false) {document.getElementById("shoptoggletranscend").textContent = "Auto: OFF"}
if (player.shoptoggles.generator == false) {document.getElementById("shoptogglegenerator").textContent = "Auto: OFF"}


updateChallengeDisplay();
revealStuff();
toggleauto();



var m = 1;
m *= effectiveLevelMult

/* document.getElementById("runeshowpower1").textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(rune1level * m)) + " Accelerators, +" + (rune1level/2  * m).toPrecision(2) +"% Accelerators, +" + format(Math.floor(rune1level/10 * m)) + " Accelerator Boosts."
if (player.achievements[38] == 1)document.getElementById("runeshowpower2").textContent = "Duplication Rune Bonus: " + "+" + Math.floor(rune2level * m / 10) * Math.floor(10 + rune2level * m /10) / 2 + " +" + m *rune2level/2 +"% Multipliers, -" + (100 * (1 - Math.pow(10, - rune2level/500))).toPrecision(4)  + "% Tax Growth.";
if (player.achievements[44] == 1)document.getElementById("runeshowpower3").textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(rune3level * m, 2).times(Decimal.pow(2, rune3level * m - 8).add(1))) + ", gain +" + format(Math.floor(rune3level/10 * m)) + " free crystal levels.";
if (player.achievements[102] == 1)document.getElementById("runeshowpower4").textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (rune4level/4 * m).toPrecision(3) + "% buildings. Increase offering recycling chance: " + rune4level/8 + "%."; */



document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * effectiveLevelMult - 100).toPrecision(4) + "%";

document.getElementById("runecontainer2").style.display = "none"
document.getElementById("talismanlevelup").style.display = "none"
document.getElementById("talismanrespec").style.display = "none"

updateTalismanAppearance(1);
updateTalismanAppearance(2);
updateTalismanAppearance(3);
updateTalismanAppearance(4);
updateTalismanAppearance(5);
updateTalismanAppearance(6);
updateTalismanAppearance(7);


if (player.resettoggle1 == 1) {document.getElementById("prestigeautotoggle").textContent = "Mode: AMOUNT"}
if (player.resettoggle2 == 1) {document.getElementById("transcendautotoggle").textContent = "Mode: AMOUNT"}
if (player.resettoggle3 == 1) {document.getElementById("reincarnateautotoggle").textContent = "Mode: AMOUNT"}

if (player.resettoggle1 == 2) {document.getElementById("prestigeautotoggle").textContent = "Mode: TIME"}
if (player.resettoggle2 == 2) {document.getElementById("transcendautotoggle").textContent = "Mode: TIME"}
if (player.resettoggle3 == 2) {document.getElementById("reincarnateautotoggle").textContent = "Mode: TIME"}


if (player.autoResearchToggle){document.getElementById("toggleautoresearch").textContent = "Automatic: ON"}
if (!player.autoResearchToggle){document.getElementById("toggleautoresearch").textContent = "Automatic: OFF"}
if (player.autoSacrificeToggle){document.getElementById("toggleautosacrifice").textContent = "Automatic: ON"}
if (!player.autoSacrificeToggle){document.getElementById("toggleautosacrifice").textContent = "Automatic: OFF"}

for(var i = 1; i<=2; i++){
	toggleAntMaxBuy()
	toggleAntAutoSacrifice()
}

if (player.autoResearchToggle && player.autoResearch > 0.5){document.getElementById("res" + player.autoResearch).style.backgroundColor = "orange"};
if (player.autoSacrificeToggle && player.autoSacrifice > 0.5){document.getElementById("rune" + player.autoSacrifice).style.backgroundColor = "orange"};

calculateOffline();

toggleTalismanBuy(player.buyTalismanShardPercent);
updateTalismanInventory();
calculateObtainium();
calculateAnts();
calculateRuneLevels();

}
updateAchievementBG();
}

(function () {
	const dec = LZString.decompressFromBase64(localStorage.getItem('Synergysave2'));
	const isLZString = dec !== '';
 
	if(isLZString) {
		localStorage.clear();
		localStorage.setItem('Synergysave2', btoa(dec));
		loadSynergy();
		alert('Transferred save to new format successfully!');
	}
 })();

function format(input,accuracy,long){
	//This function displays the numbers such as 1,234 or 1.00e1234 or 1.00e1.234M.

	//Input is the number to be formatted (string or value)
	//Accuracy is how many decimal points that are to be displayed (Values <10 if !long, <1000 if long)
	// Accuracy only works up to 305 (308 - 3), however it only worked up to ~14 due to rounding errors regardless
	//Long dictates whether or not a given number displays as scientific at 1,000,000. This auto defaults to short if input >= 1e13
	accuracy = accuracy || 0;
	long = long || false;
	let power;
	let mantissa;
	// Gets power and mantissa if input is of type decimal
	if (input instanceof Decimal)
	{
		power = input.e;
		mantissa = input.mantissa;
	}
	// Gets power and mantissa if input is of type number and isnt 0
	else if (typeof input === "number" && input !== 0)
	{
		power = Math.floor(Math.log10(Math.abs(input)));
		mantissa = input / Math.pow(10, power);
	}
	// If it isn't one of those two it isn't formattable, return 0
	else
	{
		return "0";
	}

	// This prevents numbers from jittering between two different powers by rounding errors
	if (mantissa > 9.999)
	{
		mantissa = 1;
		++power;
	}
	if (mantissa < 1 && mantissa > 0.999)
	{
		mantissa = 1;
	}

	// If the power is less than 12 it's effectively 0
	if (power < -12)
	{
		return "0";
	}
	// If the power is less than 6 or format long and less than 13 use standard formatting (123,456,789)
	else if (power < 6 || (long && power < 13))
	{
		// Gets the standard representation of the number, safe as power is guaranteed to be > -12 and < 13
		let standard = mantissa * Math.pow(10, power);
		// If the power is less than 1 or format long and less than 3 apply toFixed(accuracy) to get decimal places
		if ((power < 1 || (long && power < 3)) && accuracy > 0)
		{
			standard = standard.toFixed(accuracy);
		}
		// If it doesn't fit those criteria drop the decimal places
		else
		{
			standard = Math.floor(standard);
		}
		// Turn the number to string
		standard = standard.toString();
		// Split it on the decimal place
		let split = standard.split('.');
		// Get the front half of the number (pre-decimal point)
		let front = split[0];
		// Get the back half of the number (post-decimal point)
		let back = split[1];
		// Apply a number group 3 comma regex to the front
		front = front.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
		// if the back is undefined that means there are no decimals to display, return just the front
		if (back === undefined)
		{
			return front;
		}
		// Else return the front.back
		else
		{
			return front + "." + back;
		}
	}
	// If the power is less than 1e6 then apply standard scientific notation
	else if (power < 1e6)
	{
		// Makes mantissa be to 2 decimal places 
		let mantissaLook = mantissa.toFixed(2);
		mantissaLook = mantissaLook.toString();
		// Makes the power group 3 with commas
		let powerLook = power.toString();
		powerLook = powerLook.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
		// returns format (1.23e456,789)
		return mantissaLook + "e" + powerLook;
	}
	// if the power is greater than 1e6 apply notation scientific notation
	else if (power >= 1e6)
	{
		// Makes mantissa be to 2 decimal places
		let mantissaLook = mantissa.toFixed(2);
		mantissaLook = mantissaLook.toString();
		// Drops the power down to 4 digits total but never greater than 1000 in increments that equate to notations, (1234000 -> 1.234) ( 12340000 -> 12.34) (123400000 -> 123.4) (1234000000 -> 1.234) 
		let powerDigits = Math.ceil(Math.log10(power));
		let powerFront = ((powerDigits - 1) % 3) + 1;
		let powerLook = power / Math.pow(10, powerDigits - powerFront );
		if (powerLook === 1000)
		{
    	powerLook = 1;
    	powerFront = 1;
		}
		powerLook = powerLook.toFixed(4 - powerFront);
		powerLook = powerLook.toString();
		// Return relevant notations alongside the "look" power based on what the power actually is
		if (power < 1e9) { return mantissaLook + "e" + powerLook + "M"; }
		if (power < 1e12) { return mantissaLook + "e" + powerLook + "B"; }
		if (power < 1e15) { return mantissaLook + "e" + powerLook + "T"; }
		if (power < 1e18) { return mantissaLook + "e" + powerLook + "Qa"; }
		// If it doesn't fit a notation then default to mantissa e power
		return mantissa + "e" + power;
	}
	// Failsafe
	else
	{
		return "undefined";
	}
}
// Update calculations for Accelerator/Multiplier as well as just Production modifiers in general [Lines 600-897]

function updateAllTick() {
	let a = 0;
	let b = 0;
    totalAccelerator = player.acceleratorBought;
	
	costDivisor = 1;

    if (player.upgrades[8] > 0.5) {a += Math.floor(player.multiplierBought / 7);}
    if (player.upgrades[21] > 0.5) {a += 5;}
    if (player.upgrades[22] > 0.5) {a += 4;}
    if (player.upgrades[23] > 0.5) {a += 3;}
	if (player.upgrades[24] > 0.5) {a += 2;}
	if (player.upgrades[25] > 0.5) {a += 1;}
    if (player.upgrades[27] > 0.5) {a += Math.min(250, Math.floor(Decimal.log(player.coins.add(1), 1e3))) + Math.min(1750, Math.max(0, Math.floor(Decimal.log(player.coins.add(1),1e15)) - 50));}
    if (player.upgrades[29] > 0.5) {a += Math.floor(Math.min(2000,(player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 80))}
    if (player.upgrades[32] > 0.5) {a += Math.min(500, Math.floor(Decimal.log(player.prestigePoints.add(1), 1e25)));}
    if (player.upgrades[45] > 0.5) {a += Math.min(2500, Math.floor(Decimal.log(player.transcendShards.add(1), 10)));}
	if (player.achievements[5] > 0.5) {a += Math.floor(player.firstOwnedCoin / 500)}
	if (player.achievements[12] > 0.5) {a += Math.floor(player.secondOwnedCoin / 500)}
	if (player.achievements[19] > 0.5) {a += Math.floor(player.thirdOwnedCoin / 500)}
	if (player.achievements[26] > 0.5) {a += Math.floor(player.fourthOwnedCoin / 500)}
	if (player.achievements[33] > 0.5) {a += Math.floor(player.fifthOwnedCoin / 500)}
	if (player.achievements[60] > 0.5) {a += 2}
	if (player.achievements[61] > 0.5) {a += 2}
	if (player.achievements[62] > 0.5) {a += 2}
	
	b = 0
	if (player.upgrades[26] > 0.5) {b += 1;}
	if (player.upgrades[31] > 0.5) {b += Math.floor(totalCoinOwned/2000) * 100/100}
	if (player.achievements[7] > 0.5){b += Math.floor(player.firstOwnedCoin/2000)}
	if (player.achievements[14] > 0.5){b += Math.floor(player.secondOwnedCoin/2000)}
	if (player.achievements[21] > 0.5){b += Math.floor(player.thirdOwnedCoin/2000)}
	if (player.achievements[28] > 0.5){b += Math.floor(player.fourthOwnedCoin/2000)}
	if (player.achievements[35] > 0.5){b += Math.floor(player.fifthOwnedCoin/2000)}

	b += player.researches[93] * Math.floor(1/100 * (rune1level + rune2level + rune3level + rune4level + rune5level))
	b += Math.floor((0.01 + rune1level) * effectiveLevelMult / 10);
	b *= (1 + 1/5 * player.researches[3])
	b *= (1 + 1/100 * player.researches[16] + 1/100 * player.researches[17])
	b *= (1 + 1/100 * player.researches[88])
	b *= (1 + 1/50 * (player.antUpgrades[4] + bonusant4))
	if (player.upgrades[73] > 0.5 && player.currentChallengeRein !== "") {b *= 2}
	b = Math.floor(b)
	freeAcceleratorBoost = b;

	totalAcceleratorBoost = Math.floor(player.acceleratorBoostBought + freeAcceleratorBoost) * 100/100;


		a += totalAcceleratorBoost * (5 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20]);
		if (player.unlocks.prestige == true) {
		a += rune1level  * (1 + rune2level / 200) * effectiveLevelMult
		}
		a += 5 * player.challengecompletions.two
		a *=(1 + rune1level * 1/200) * effectiveLevelMult;
		a += (player.acceleratorBought * rune1level * 1/200 * effectiveLevelMult)
		a *=(1 + player.achievements[60]/100)
		a *=(1 + player.achievements[61]/100)
		a *=(1 + player.achievements[62]/100)
		a *=(1 + 1/5 * player.researches[1])
		a *=(1 + 1/20 * player.researches[6] + 1/80 * player.researches[7] + 1/150 * player.researches[8] + 3/800 * player.researches[9] + 1/500 * player.researches[10]);
		a *=(1 + 1/100 * player.researches[86])
		a *= Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25])
		if ((player.currentChallenge !== "" || player.currentChallengeRein !== "") && player.upgrades[50] > 0.5) {a *= 1.25}
		a = Math.floor(a)
	
	freeAccelerator = a;
	totalAccelerator += freeAccelerator;
	
	tuSevenMulti = 1;


	if (player.upgrades[46] > 0.5) {
		tuSevenMulti = 1.05;
	}
	
	if (player.currentChallenge !== "two" && player.currentChallenge !== "three" && player.currentChallengeRein !== "seven") {
	 	acceleratorPower = Math.pow(1.1 + tuSevenMulti * (totalAcceleratorBoost / 100) * (1 + player.challengecompletions.two / 20), 1 + 0.04 * player.challengecompletions.seven);
	}
	if (player.currentChallenge == "two" || player.currentChallengeRein == "seven" || player.currentChallengeRein == "ten") {
        acceleratorPower = 1;
	}
	if (player.currentChallenge == "three" && player.currentChallengeRein !== "seven" && player.currentChallengeRein !== "ten") {
		acceleratorPower = 1.05 + 2 *  tuSevenMulti * (totalAcceleratorBoost/300) * (1 + player.challengecompletions.two / 20);
	}
	if (player.currentChallenge == "one" && player.currentChallengeRein !== "seven" && player.currentChallengeRein !== "ten") {
		acceleratorPower *= 0.5
		acceleratorPower += 0.55
	}
	if (player.currentChallengeRein == "ten"){
		acceleratorPower = 1;
	}
	if (player.currentChallenge !== "two" && player.currentChallengeRein !== "seven" && player.achievements[3] > 0.5) {acceleratorPower += 0.0005}
	if (player.currentChallenge !== "two" && player.currentChallengeRein !== "seven" && player.achievements[10] > 0.5) {acceleratorPower += 0.001}
	if (player.currentChallenge !== "two" && player.currentChallengeRein !== "seven" && player.achievements[17] > 0.5) {acceleratorPower += 0.0015}
	if (player.currentChallenge !== "two" && player.currentChallengeRein !== "seven" && player.achievements[24] > 0.5) {acceleratorPower += 0.002}
	if (player.currentChallenge !== "two" && player.currentChallengeRein !== "seven" && player.achievements[31] > 0.5) {acceleratorPower += 0.0025}

	if (player.currentChallenge !== "two" && player.currentChallengeRein !== "seven") {
		acceleratorPower += 1/200 * Math.floor(player.challengecompletions.two / 2) * 100/100
	}

	if (player.currentChallenge !== "one") { 
	acceleratorEffect = Decimal.pow(acceleratorPower, totalAccelerator);
	}

	if (player.currentChallenge == "one") {
		acceleratorEffect = Decimal.pow(acceleratorPower, totalAccelerator + totalMultiplier);
	}
		acceleratorEffectDisplay = acceleratorPower * 100 - 100
	if (player.currentChallengeRein == "ten"){
		acceleratorEffect = 1;
	}
	generatorPower = new Decimal(1);
	if (player.upgrades[11] > 0.5  && player.currentChallengeRein !== "seven") {
		generatorPower = Decimal.pow(1.02, totalAccelerator)
	}

	}

function updateAllMultiplier() {
	let a = 0;

    if (player.upgrades[7] > 0.5) {
        a += Math.min(4, 1 + Math.floor(Decimal.log(player.fifthOwnedCoin + 1, 10)));
    }
    if (player.upgrades[9] > 0.5) {
        a += Math.floor(player.acceleratorBought / 10);
    }
    if (player.upgrades[21] > 0.5) {
        a += 1;
    }
    if (player.upgrades[22] > 0.5) {
        a += 1;
    }
    if (player.upgrades[23] > 0.5) {
        a += 1;
	}
	if (player.upgrades[24] > 0.5) {
        a += 1;
	}
	if (player.upgrades[25] > 0.5) {
        a += 1;
    }
    if (player.upgrades[28] > 0.5) {
        a += Math.min(1000, Math.floor((player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin)/160))
    }
    if (player.upgrades[30] > 0.5) {
        a += Math.min(75, Math.floor(Decimal.log(player.coins.add(1), 1e10))) + Math.min(925, Math.floor(Decimal.log(player.coins.add(1), 1e30)));
	}
	if (player.upgrades[33] > 0.5) {
		a += totalAcceleratorBoost
	}
    if (player.upgrades[34] > 0.5) {
		a *= 1.03 * 100/100
	}
	if (player.upgrades[35] > 0.5) {
		a *= 1.05/1.03 * 100/100
	}
    if (player.upgrades[49] > 0.5) {
        a += Math.min(50, Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10)));
	}
	if (player.upgrades[68] > 0.5) {
		a += Math.min(2500, Math.floor(Decimal.log(taxdivisor, 10) * 1/1000))
	}

	if (player.challengecompletions.one > 0.5) {
		a += 1
	}
	if (player.achievements[6] > 0.5) {a += Math.floor(player.firstOwnedCoin/1000)}
	if (player.achievements[13] > 0.5) {a += Math.floor(player.secondOwnedCoin/1000)}
	if (player.achievements[20] > 0.5) {a += Math.floor(player.thirdOwnedCoin/1000)}
	if (player.achievements[27] > 0.5) {a += Math.floor(player.fourthOwnedCoin/1000)}
	if (player.achievements[34] > 0.5) {a += Math.floor(player.fifthOwnedCoin/1000)}
	if (player.achievements[57] > 0.5) {a += 1}
	if (player.achievements[58] > 0.5) {a += 1}
	if (player.achievements[59] > 0.5) {a += 1}
		a += 20 * player.researches[94] * Math.floor((rune1level + rune2level + rune3level + rune4level + rune5level)/100)


	if (player.achievements[38] > 0.5) {
		a += Math.floor(Math.floor(rune2level / 10 * effectiveLevelMult) * Math.floor(10 + rune2level / 10 * effectiveLevelMult) / 2) * 100/100
	}
	
	a *= (1 + player.achievements[57]/100)
	a *= (1 + player.achievements[58]/100)
	a *= (1 + player.achievements[59]/100)
	a *= Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25])
    a *=(1 + 1/5 * player.researches[2])
	a *=(1 + 1/20 * player.researches[11] + 1/40 * player.researches[12] + 1/200 * player.researches[13] + 1/400 * player.researches[14] + 1/500 * player.researches[15])
	a *=(1 + rune2level/200 * effectiveLevelMult)
	a *=(1 + 1/100 * player.researches[87])
	a *=(1 + 1/25 * (player.antUpgrades[5] + bonusant5))
	if ((player.currentChallenge !== "" || player.currentChallengeRein !== "") && player.upgrades[50] > 0.5) {a *= 1.25};
		
	a = Math.floor(a)
	freeMultiplier = a;
    totalMultiplier = freeMultiplier + player.multiplierBought;
	
	multiplierPower = 2;
	challengeOneLog = 3;

	let b = 0;
	let c = 0;
	b += Decimal.log(player.transcendShards.add(1), 3);
	b *= (1 + player.researches[33]/50)
	b *= (1 + player.researches[34]/50)
	b *= (1 + player.researches[35]/50)
	b *= (1 + player.researches[89]/25)
	b *= divineBlessing2

	c += Math.floor((0.1 * b * player.challengecompletions.one))

	c += (player.challengecompletions.one * 10);
	freeMultiplierBoost = c;
	totalMultiplierBoost = Math.pow(Math.floor(b) + c, 1 + player.challengecompletions.seven * 0.04);
	
	let c7 = 1
	if (player.challengecompletions.seven > 0.5) {c7 = 1.25}

    if (player.currentChallenge !== "one" && player.currentChallenge !== "two" && player.currentChallengeRein !== "seven") {multiplierPower = (2 + 0.005 * (totalMultiplierBoost) * c7);}
    if (player.currentChallenge == "one" || player.currentChallengeRein == "seven" || player.currentChallengeRein == "ten") {multiplierPower = 1;}
    if (player.currentChallenge == "two" && player.currentChallengeRein !== "seven" && player.currentChallengeRein !== "ten") {multiplierPower = (1.25 + 0.0012 * (b + c) * c7);}
	multiplierEffect = Decimal.pow(multiplierPower, totalMultiplier);
	}

function multipliers() {
	let s = new Decimal(1);
	let c = new Decimal(1);

totalCoinOwned = player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin;
prestigeMultiplier = Decimal.pow(player.prestigeShards, 1/3 + Math.min(10, 0.05 * player.crystalUpgrades[3]) + 0.04 * player.challengecompletions.three + 0.02 * (player.researches[28] + player.researches[29] + 0.5 * player.researches[30])).add(1);

let c7 = 1;
if (player.currentChallengeRein == "seven") {c7 = 0.05}
if (player.currentChallengeRein == "eight") {c7 = 0}
buildingPower = 1 + (1 - Math.pow(2, -1/160)) * c7 * Decimal.log(player.reincarnationShards.add(1), 10) * (1 + 1/100 * player.researches[36] + 1/200 * player.researches[37] + 1/200 * player.researches[38]) + (c7 + 0.2) * 0.25/1.2 * player.challengecompletions.eight

reincarnationMultiplier = Decimal.pow(buildingPower, totalCoinOwned);

antMultiplier = Decimal.pow(Decimal.max(1, player.antPoints), 100000 + 900000 * (1 - Math.pow(2, -(player.antUpgrades[2] + bonusant2)/125)));

s = s.times(multiplierEffect);
s = s.times(acceleratorEffect);
s = s.times(prestigeMultiplier);
s = s.times(reincarnationMultiplier);
s = s.times(antMultiplier)

if (player.upgrades[6] > 0.5) {
	s = s.times((totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, totalCoinOwned)));
}
if (player.upgrades[12] > 0.5) {
	s = s.times(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)));
}
if (player.upgrades[20] > 0.5) {
	s = s.times(Math.pow(totalCoinOwned / 4 + 1 , 10));
}
if (player.upgrades[41] > 0.5) {
	s = s.times(Decimal.min(1e30,Decimal.pow(player.transcendPoints.add(1), 1/2)));
}
if (player.upgrades[43] > 0.5) {
	s = s.times(Decimal.min(1e30,Decimal.pow(1.01, player.transcendCount)));
}
if (player.upgrades[48] > 0.5) {
	s = s.times(Math.pow((totalMultiplier * totalAccelerator / 1000 + 1), 8));
}
if (player.currentChallengeRein == "six") {s = s.dividedBy(1e250)}
if (player.currentChallengeRein == "seven") {s = s.dividedBy("1e1250")}
if (player.currentChallengeRein == "nine") {s = s.dividedBy("1e2000000")}
c = Decimal.pow(s , 1 + 0.001 * player.researches[17]);

globalCoinMultiplier = c;

coinOneMulti = new Decimal(1);

	if (player.upgrades[1] > 0.5) {
		coinOneMulti = coinOneMulti.times((totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, totalCoinOwned)));
	}
	if (player.upgrades[10] > 0.5) {
		coinOneMulti = coinOneMulti.times(Decimal.pow(2, Math.min(50, player.secondOwnedCoin/15)));
	}
	if (player.upgrades[56] > 0.5) {
		coinOneMulti = coinOneMulti.times("1e5000")
	}

coinTwoMulti = new Decimal(1);

	if (player.upgrades[2] > 0.5) {
		coinTwoMulti = coinTwoMulti.times((totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, totalCoinOwned)));
	}
	if (player.upgrades[13] > 0.5) {
		coinTwoMulti = coinTwoMulti.times(Decimal.min(1e50, Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), 4/3).times(1e10)));
	}
	if (player.upgrades[19] > 0.5) {
		coinTwoMulti = coinTwoMulti.times(Decimal.min(1e200, player.transcendPoints.times(1e30).add(1)));
	}
	if (player.upgrades[57] > 0.5) {
		coinTwoMulti = coinTwoMulti.times("1e7500")
	}

coinThreeMulti = new Decimal(1);

	if (player.upgrades[3] > 0.5) {
	coinThreeMulti = coinThreeMulti.times((totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, totalCoinOwned)));
}
	if (player.upgrades[18] > 0.5) {
		coinThreeMulti = coinThreeMulti.times(Decimal.min(1e125, player.transcendShards.add(1)));
	}
	if (player.upgrades[58] > 0.5) {
		coinThreeMulti = coinThreeMulti.times("1e15000")
	}

coinFourMulti = new Decimal(1);

	if (player.upgrades[4] > 0.5) {
	coinFourMulti = coinFourMulti.times((totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, totalCoinOwned)));
}
	
	if (player.upgrades[17] > 0.5) {
		coinFourMulti = coinFourMulti.times(1e100);
	}

	if (player.upgrades[59] > 0.5) {
		coinFourMulti = coinFourMulti.times("1e25000")
	}

coinFiveMulti = new Decimal(1);

	if (player.upgrades[5] > 0.5) {
		coinFiveMulti = coinFiveMulti.times((totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, totalCoinOwned)));
	}

	if (player.upgrades[60] > 0.5) {
		coinFiveMulti = coinFiveMulti.times("1e35000")
	}
	
globalCrystalMultiplier = new Decimal(1)
if (player.achievements[36] > 0.5) {
	globalCrystalMultiplier = globalCrystalMultiplier.times(2)
}
if (player.achievements[37] > 0.5 && player.prestigePoints.greaterThanOrEqualTo(10)) {
	globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.log(player.prestigePoints.add(1), 10))
}
if (player.achievements[43] > 0.5) {
	globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(rune3level * effectiveLevelMult, 2).times(Decimal.pow(2, rune3level * effectiveLevelMult  - 8).add(1)))
}
if (player.upgrades[36] > 0.5) {globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min("1e5000", Decimal.pow(player.prestigePoints, 1/500)))}
if (player.upgrades[63] > 0.5) {globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min("1e6000",Decimal.pow(player.reincarnationPoints.add(1),6)))}
if (player.researches[39] > 0.5) {globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(reincarnationMultiplier, 1/50))}

globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min(Decimal.pow(10, 50 + 2 * player.crystalUpgrades[0]), Decimal.pow(1.05, player.achievementPoints * player.crystalUpgrades[0])))
globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min(Decimal.pow(10, 100 + 5 * player.crystalUpgrades[1]), Decimal.pow(Decimal.log(player.coins.add(1), 10),player.crystalUpgrades[1]/3)))
globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1 + Math.min(0.12, 0.001 * player.crystalUpgrades[2]), player.firstOwnedDiamonds + player.secondOwnedDiamonds + player.thirdOwnedDiamonds + player.fourthOwnedDiamonds + player.fifthOwnedDiamonds))	
globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1.01, (player.challengecompletions.one + player.challengecompletions.two +player.challengecompletions.three +player.challengecompletions.four +player.challengecompletions.five) * player.crystalUpgrades[4]))
globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(10, player.challengecompletions.five))
globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1.10, player.researches[26]))
globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1.05, player.researches[27]))


		globalMythosMultiplier = new Decimal(1)

	if (player.upgrades[37] > 0.5) {globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(Decimal.log(player.prestigePoints.add(10),10),2))}
	if (player.upgrades[42] > 0.5) {
		globalMythosMultiplier = globalMythosMultiplier.times(Decimal.min(1e50, Decimal.pow(player.prestigePoints.add(1), 1/50).dividedBy(2.5).add(1)));
	}
	if (player.upgrades[47] > 0.5) {globalMythosMultiplier = globalMythosMultiplier.times(Math.pow(1.05, player.achievementPoints)).times(player.achievementPoints + 1)}
	if (player.upgrades[51] > 0.5) {
		globalMythosMultiplier = globalMythosMultiplier.times(Math.pow(totalAcceleratorBoost, 2))
	}
	if (player.upgrades[52] > 0.5) {
		globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(globalMythosMultiplier, 0.025))
	}
	if (player.upgrades[64] > 0.5) {globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(player.reincarnationPoints.add(1),2))}
	if (player.researches[40] > 0.5) {globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(reincarnationMultiplier, 1/250))}
 grandmasterMultiplier = new Decimal(1);
 totalMythosOwned = player.firstOwnedMythos + player.secondOwnedMythos + player.thirdOwnedMythos + player.fourthOwnedMythos + player.fifthOwnedMythos;

	mythosBuildingPower = 1 + (player.challengecompletions.three / 200);
	challengeThreeMultiplier = Decimal.pow(mythosBuildingPower, totalMythosOwned);

	grandmasterMultiplier = grandmasterMultiplier.times(challengeThreeMultiplier);

	mythosupgrade13 = new Decimal(1);
	mythosupgrade14 = new Decimal(1);
	mythosupgrade15 = new Decimal(1);
	if (player.upgrades[53] == 1){mythosupgrade13 = mythosupgrade13.times(Decimal.min("1e1250", Decimal.pow(acceleratorEffect, 1/125)))};
	if (player.upgrades[54] == 1){mythosupgrade14 = mythosupgrade14.times(Decimal.min("1e2000", Decimal.pow(multiplierEffect, 1/180)))};
	if (player.upgrades[55] == 1){mythosupgrade15 = mythosupgrade15.times(Decimal.pow("1e1000", buildingPower - 1))};

	globalAntMult = new Decimal(1);
	globalAntMult = globalAntMult.times(1 + 1/1440 * Math.pow(rune5level * effectiveLevelMult * (1 + player.researches[84]/1000), 2))
	if(player.upgrades[76] == 1){globalAntMult = globalAntMult.times(5)}
	globalAntMult = globalAntMult.times(Decimal.pow(1 + player.upgrades[77]/200 + player.researches[96]/20000, player.firstOwnedAnts + player.secondOwnedAnts + player.thirdOwnedAnts + player.fourthOwnedAnts + player.fifthOwnedAnts + player.sixthOwnedAnts + player.seventhOwnedAnts + player.eighthOwnedAnts))
	globalAntMult = globalAntMult.times(Math.pow(1.5, player.shopUpgrades.antSpeedLevel));
	globalAntMult = globalAntMult.times(Math.pow(1.11 + player.researches[101]/1000, player.antUpgrades[1] + bonusant1));
	globalAntMult = globalAntMult.times(Math.pow(1 + player.antSacrificePoints/5000,2))
	globalAntMult = globalAntMult.times(Math.pow(player.researchPoints, divineBlessing5))
	globalAntMult = globalAntMult.times(Math.pow(1 + runeSum/100, talisman6Power))
	globalAntMult = globalAntMult.times(Math.pow(1.1, player.challengecompletions.nine))
	if(player.achievements[169] == 1){globalAntMult = globalAntMult.times(Decimal.log(player.antPoints.add(10),10))}
	if(player.achievements[171] == 1){globalAntMult = globalAntMult.times(1.16666)}
	if(player.achievements[172] == 1){globalAntMult = globalAntMult.times(1 + 2 * (1 - Math.pow(2, -Math.min(1, player.reincarnationcounter/7200))))}
	if(player.upgrades[39] == 1){globalAntMult = globalAntMult.times(1.60)}
}

 // Function that adds to resources each tick. [Lines 928 - 989]

function resourceGain(dt,fast){
		fast = fast || false
		updateAllTick();
		updateAllMultiplier();
		multipliers();
		calculatetax(fast);
		if (produceTotal.greaterThanOrEqualTo(0.001)) {
			var addcoin = new Decimal.min(produceTotal.dividedBy(taxdivisor), Decimal.pow(10, maxexponent - Decimal.log(taxdivisorcheck , 10)))
		player.coins = player.coins.add(addcoin.times(dt/0.025));
		player.coinsThisPrestige = player.coinsThisPrestige.add(addcoin.times(dt/0.025));
		player.coinsThisTranscension = player.coinsThisTranscension.add(addcoin.times(dt/0.025));
		player.coinsThisReincarnation = player.coinsThisReincarnation.add(addcoin.times(dt/0.025));
		player.coinsTotal = player.coinsTotal.add(addcoin.times(dt/0.025))
		}

		resetCurrency();
		if (player.upgrades[93] == 1 && player.coinsThisPrestige.greaterThanOrEqualTo(1e16)) {
			player.prestigePoints = player.prestigePoints.add(Decimal.floor(prestigePointGain.dividedBy(4000).times(dt/0.025)))
		}
		if (player.upgrades[100] == 1 && player.coinsThisTranscension.greaterThanOrEqualTo(1e100)) {
			player.transcendPoints = player.transcendPoints.add(Decimal.floor(transcendPointGain.dividedBy(4000).times(dt/0.025)))
		}

		produceFirstDiamonds = player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).times(player.firstProduceDiamonds).times(globalCrystalMultiplier)
		produceSecondDiamonds = player.secondGeneratedDiamonds.add(player.secondOwnedDiamonds).times(player.secondProduceDiamonds).times(globalCrystalMultiplier)
		produceThirdDiamonds = player.thirdGeneratedDiamonds.add(player.thirdOwnedDiamonds).times(player.thirdProduceDiamonds).times(globalCrystalMultiplier)
		produceFourthDiamonds = player.fourthGeneratedDiamonds.add(player.fourthOwnedDiamonds).times(player.fourthProduceDiamonds).times(globalCrystalMultiplier)
		produceFifthDiamonds = player.fifthGeneratedDiamonds.add(player.fifthOwnedDiamonds).times(player.fifthProduceDiamonds).times(globalCrystalMultiplier)
	
		player.fourthGeneratedDiamonds = player.fourthGeneratedDiamonds.add(produceFifthDiamonds.times(dt/0.025))
		player.thirdGeneratedDiamonds = player.thirdGeneratedDiamonds.add(produceFourthDiamonds.times(dt/0.025))
		player.secondGeneratedDiamonds = player.secondGeneratedDiamonds.add(produceThirdDiamonds.times(dt/0.025))
		player.firstGeneratedDiamonds = player.firstGeneratedDiamonds.add(produceSecondDiamonds.times(dt/0.025))
		produceDiamonds = produceFirstDiamonds;    
		
		if (player.currentChallenge !== "three" && player.currentChallengeRein !== "ten") {
		player.prestigeShards = player.prestigeShards.add(produceDiamonds.times(dt/0.025))
		}

		produceFifthMythos = player.fifthGeneratedMythos.add(player.fifthOwnedMythos).times(player.fifthProduceMythos).times(globalMythosMultiplier).times(grandmasterMultiplier).times(mythosupgrade15)
		produceFourthMythos = player.fourthGeneratedMythos.add(player.fourthOwnedMythos).times(player.fourthProduceMythos).times(globalMythosMultiplier)
		produceThirdMythos = player.thirdGeneratedMythos.add(player.thirdOwnedMythos).times(player.thirdProduceMythos).times(globalMythosMultiplier).times(mythosupgrade14)
		produceSecondMythos = player.secondGeneratedMythos.add(player.secondOwnedMythos).times(player.secondProduceMythos).times(globalMythosMultiplier)
		produceFirstMythos =  player.firstGeneratedMythos.add(player.firstOwnedMythos).times(player.firstProduceMythos).times(globalMythosMultiplier).times(mythosupgrade13)
		player.fourthGeneratedMythos = player.fourthGeneratedMythos.add(produceFifthMythos.times(dt/0.025));
		player.thirdGeneratedMythos = player.thirdGeneratedMythos.add(produceFourthMythos.times(dt/0.025));
		player.secondGeneratedMythos = player.secondGeneratedMythos.add(produceThirdMythos.times(dt/0.025));
		player.firstGeneratedMythos = player.firstGeneratedMythos.add(produceSecondMythos.times(dt/0.025));

		
		produceMythos = new Decimal("0");
		produceMythos = (player.firstGeneratedMythos.add(player.firstOwnedMythos)).times(player.firstProduceMythos).times(globalMythosMultiplier).times(mythosupgrade13);
		producePerSecondMythos = produceMythos.times(40);

		var pm = new Decimal('1');
		if (player.upgrades[67] > 0.5) {pm = pm.times(Decimal.pow(1.03, player.firstOwnedParticles + player.secondOwnedParticles + player.thirdOwnedParticles + player.fourthOwnedParticles + player.fifthOwnedParticles))}
		produceFifthParticles = player.fifthGeneratedParticles.add(player.fifthOwnedParticles).times(player.fifthProduceParticles)
        produceFourthParticles = player.fourthGeneratedParticles.add(player.fourthOwnedParticles).times(player.fourthProduceParticles)
        produceThirdParticles = player.thirdGeneratedParticles.add(player.thirdOwnedParticles).times(player.thirdProduceParticles)
        produceSecondParticles = player.secondGeneratedParticles.add(player.secondOwnedParticles).times(player.secondProduceParticles)
        produceFirstParticles =  player.firstGeneratedParticles.add(player.firstOwnedParticles).times(player.firstProduceParticles).times(pm)
		player.fourthGeneratedParticles = player.fourthGeneratedParticles.add(produceFifthParticles.times(dt/0.025));
		player.thirdGeneratedParticles = player.thirdGeneratedParticles.add(produceFourthParticles.times(dt/0.025));
		player.secondGeneratedParticles = player.secondGeneratedParticles.add(produceThirdParticles.times(dt/0.025));
		player.firstGeneratedParticles = player.firstGeneratedParticles.add(produceSecondParticles.times(dt/0.025));

		  produceParticles = new Decimal("0");
		  produceParticles = (player.firstGeneratedParticles.add(player.firstOwnedParticles)).times(player.firstProduceParticles).times(pm);
		  producePerSecondParticles = produceParticles.times(40);

		if (player.currentChallenge !== "three" && player.currentChallengeRein !== "ten") {player.transcendShards = player.transcendShards.add(produceMythos.times(dt/1));}
		if (player.currentChallengeRein !== "ten"){player.reincarnationShards = player.reincarnationShards.add(produceParticles.times(dt/0.025))};

		antEightProduce = player.eighthGeneratedAnts.add(player.eighthOwnedAnts).times(player.eighthProduceAnts).times(globalAntMult)
		antSevenProduce = player.seventhGeneratedAnts.add(player.seventhOwnedAnts).times(player.seventhProduceAnts).times(globalAntMult)
		antSixProduce = player.sixthGeneratedAnts.add(player.sixthOwnedAnts).times(player.sixthProduceAnts).times(globalAntMult)
		antFiveProduce = player.fifthGeneratedAnts.add(player.fifthOwnedAnts).times(player.fifthProduceAnts).times(globalAntMult)
		antFourProduce = player.fourthGeneratedAnts.add(player.fourthOwnedAnts).times(player.fourthProduceAnts).times(globalAntMult)
		antThreeProduce = player.thirdGeneratedAnts.add(player.thirdOwnedAnts).times(player.thirdProduceAnts).times(globalAntMult)
		antTwoProduce = player.secondGeneratedAnts.add(player.secondOwnedAnts).times(player.secondProduceAnts).times(globalAntMult)
		antOneProduce = player.firstGeneratedAnts.add(player.firstOwnedAnts).times(player.firstProduceAnts).times(globalAntMult)
		player.seventhGeneratedAnts = player.seventhGeneratedAnts.add(antEightProduce.times(dt/1))
		player.sixthGeneratedAnts = player.sixthGeneratedAnts.add(antSevenProduce.times(dt/1))
		player.fifthGeneratedAnts = player.fifthGeneratedAnts.add(antSixProduce.times(dt/1))
		player.fourthGeneratedAnts = player.fourthGeneratedAnts.add(antFiveProduce.times(dt/1))
		player.thirdGeneratedAnts = player.thirdGeneratedAnts.add(antFourProduce.times(dt/1))
		player.secondGeneratedAnts = player.secondGeneratedAnts.add(antThreeProduce.times(dt/1))
		player.firstGeneratedAnts = player.firstGeneratedAnts.add(antTwoProduce.times(dt/1))

		


		player.antPoints = player.antPoints.add(antOneProduce.times(dt/1))

		if (player.researches[71] > 0.5 && player.challengecompletions.one < (Math.min(player.highestchallengecompletions.one, 25 + player.researches[66] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.25 * challengebaserequirements.one * Math.pow(1 + player.challengecompletions.one, 2)))) {
			player.challengecompletions.one += 1;		
			challengeDisplay(1,false,true);
			challengeachievementcheck('one',true)
		}
		if (player.researches[72] > 0.5 && player.challengecompletions.two < (Math.min(player.highestchallengecompletions.two, 25 + player.researches[67] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.6 * challengebaserequirements.two * Math.pow(1 + player.challengecompletions.two, 2)))) {
			player.challengecompletions.two += 1
			challengeDisplay(2,false,true)
			challengeachievementcheck('two',true)
		}
		if (player.researches[73] > 0.5 && player.challengecompletions.three < (Math.min(player.highestchallengecompletions.three, 25 + player.researches[68] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.7 * challengebaserequirements.three * Math.pow(1 + player.challengecompletions.three, 2)))) {
			player.challengecompletions.three += 1
			challengeDisplay(3,false,true)
			challengeachievementcheck('three',true)
		}
		if (player.researches[74] > 0.5 && player.challengecompletions.four < (Math.min(player.highestchallengecompletions.four, 25 + player.researches[69] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.45 * challengebaserequirements.four * Math.pow(1 + player.challengecompletions.four, 2)))) {
			player.challengecompletions.four += 1
			challengeDisplay(4,false,true)
			challengeachievementcheck('four',true)
		}
		if (player.researches[75] > 0.5 && player.challengecompletions.five < (Math.min(player.highestchallengecompletions.five, 25 + player.researches[70] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 2 * challengebaserequirements.five * Math.pow(1 + player.challengecompletions.five, 2)))) {
			player.challengecompletions.five += 1
			challengeDisplay(5,false,true)
			challengeachievementcheck('five',true)
		}

		if (player.coins.greaterThanOrEqualTo(1000) && player.unlocks.coinone == false) {
			player.unlocks.coinone = true;
			revealStuff();
		}
		if (player.coins.greaterThanOrEqualTo(20000) && player.unlocks.cointwo == false) {
			player.unlocks.cointwo = true;
			revealStuff();
		}
		if (player.coins.greaterThanOrEqualTo(100000) && player.unlocks.cointhree == false) {
			player.unlocks.cointhree = true;
			revealStuff();
		}
		if (player.coins.greaterThanOrEqualTo(8e6) && player.unlocks.coinfour == false) {
			player.unlocks.coinfour = true;
			revealStuff();
		}
		if(!fast){
		htmlInserts();
		}
		if (player.antPoints.greaterThanOrEqualTo(3) && player.achievements[169] == 0){achievementaward(169)}
		if (player.antPoints.greaterThanOrEqualTo(1e5) && player.achievements[170] == 0){achievementaward(170)}
		if (player.antPoints.greaterThanOrEqualTo(666666666) && player.achievements[171] == 0){achievementaward(171)}
		if (player.antPoints.greaterThanOrEqualTo(1e20) && player.achievements[172] == 0){achievementaward(172)}
		if (player.antPoints.greaterThanOrEqualTo(1e40) && player.achievements[173] == 0){achievementaward(173)}
		if (player.antPoints.greaterThanOrEqualTo("1e500") && player.achievements[174] == 0){achievementaward(174)}
		if (player.antPoints.greaterThanOrEqualTo("1e2500") && player.achievements[175] == 0){achievementaward(175)}

	}

	//===================================================================
	// Reset Functions. Functions that track reset currency, and then the reset tools proper. [Lines 1248 - 1326]

function resetCurrency() {
	let prestigePow = 0.5 + player.challengecompletions.five / 100
	let transcendPow = 0.03

	// Calculates the conversion exponent for resets (Challenges 5 and 10 reduce the exponent accordingly).
	if(player.currentChallenge == "five"){
		prestigePow = 0.01/(1 + player.challengecompletions.five);
		transcendPow = 0.001;
	}
	if(player.currentChallengeRein == "ten"){
		prestigePow = (1e-4)/(1 + player.challengecompletions.ten);
		transcendPow = 0.001;
	}

	//Prestige Point Formulae
	prestigePointGain = Decimal.floor(Decimal.pow(player.coinsThisPrestige.dividedBy(1e12), prestigePow));
	if (player.upgrades[16] > 0.5 && player.currentChallenge !== "five" && player.currentChallengeRein !== "ten") {
		prestigePointGain = prestigePointGain.times(Decimal.pow(acceleratorEffect, 1/3));
	}

	//Transcend Point Formulae
	transcendPointGain = Decimal.floor(Decimal.pow(player.coinsThisTranscension.dividedBy(1e100), transcendPow));
	if (player.upgrades[44] > 0.5 && player.currentChallenge !== "five" && player.currentChallengeRein !== "ten") {
		transcendPointGain = transcendPointGain.times(Decimal.min(1e6,Decimal.pow(1.01, player.transcendCount)));
	}
	
	//Reincarnation Point Formulae
	reincarnationPointGain = Decimal.floor(Decimal.pow(player.transcendShards.dividedBy(1e300), 0.01));
	if (player.achievements[50] == 1){reincarnationPointGain = reincarnationPointGain.times(2)}
	if (player.upgrades[65] > 0.5) {reincarnationPointGain = reincarnationPointGain.times(5)}
	}

function resetCheck(i,manual) {
	manual = (manual === null || manual === undefined) ? true : manual;
	if (i == 'prestige') {
		if (player.coinsThisPrestige.greaterThanOrEqualTo(1e16) || prestigePointGain.greaterThanOrEqualTo(100)) {
			if (manual) {
				resetConfirmation('prestige');
			} else {
				resetachievementcheck(1);
				reset(1);
			}
		}
		else {}
	}
	if (i == 'transcend') {
		if ((player.coinsThisTranscension.greaterThanOrEqualTo(1e100) || transcendPointGain.greaterThanOrEqualTo(0.5)) && player.currentChallenge == "") {
			if (manual) {
			resetConfirmation('transcend');
			}
			if (!manual) {
			resetachievementcheck(2);
			reset(2);
			}
		}
	}
	if (i == 'challenge') {
		var q = player.currentChallenge;
			var x = 0
			if (q == "one") {x = 66}
			if (q == "two") {x = 67}
			if (q == "three") {x = 68}
			if (q == "four") {x = 69}
			if (q == "five") {x = 70} 
		if (player.currentChallenge !== "") {

			if (player.coinsThisTranscension.greaterThanOrEqualTo(Decimal.pow(10, challengebaserequirements[q] * Math.pow(1 + player.challengecompletions[q], 2) * Math.pow(1.5, Math.max(0, player.challengecompletions[q] - 75)))) && player.challengecompletions[q] < (25 + player.researches[x] + 925 * player.researches[105])) {
			player.challengecompletions[q] += 1;
			var y = x - 65
			challengeDisplay(y,true)
			}
			if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
				player.highestchallengecompletions[q] += 1;
				var y = x - 65;
				challengeDisplay(y,true)
				player.worlds += (1 + Math.floor(player.highestchallengecompletions[q]/10)) * 100/100}

			
			challengeachievementcheck(q);
			reset(2);
			player.transcendCount -= 1;
			}
			if (!player.retrychallenges || manual  || player.challengecompletions[q] >= (25 + player.researches[x] + 925 * player.researches[105])) {
			player.currentChallenge = "";
			updateChallengeDisplay();
			}
		}
	
	if (i == "reincarnate") {
		if (reincarnationPointGain > 0.5 && player.currentChallenge == "" && player.currentChallengeRein == "") {
			if (manual) {
			resetConfirmation('reincarnate');
			}
			if (!manual) {
			resetachievementcheck(3);
			reset(3);
			}
		}
	}
	if (i == "reincarnationchallenge"){
		if (player.currentChallengeRein !== ""){
		var y = ""
		var q = player.currentChallengeRein;
			if (q == "six"){y = 6}
			if (q == "seven"){y = 7}
			if (q == "eight"){y = 8}
			if (q == "nine"){y = 9}
			if (q == "ten"){y = 10}
			var s = player.currentChallenge
		if (player.currentChallenge !== "") {
			player.currentChallenge = ""
			}
		if(q == "six" || q == "seven" || q == "eight"){
		if (player.transcendShards.greaterThanOrEqualTo(Decimal.pow(10, challengebaserequirementsrein[q] * Math.min(Math.pow(1.3797, player.challengecompletions[q]) , Math.pow(1 + player.challengecompletions[q], 2)))) && player.challengecompletions[q] < 25) {
			player.challengecompletions[q] += 1
		}
		}
		if (q == "nine" || q == "ten"){
		if (player.coins.greaterThanOrEqualTo(Decimal.pow(10, challengebaserequirementsrein[q] * Math.min(Math.pow(1.3797, player.challengecompletions[q]) , Math.pow(1 + player.challengecompletions[q], 2)))) && player.challengecompletions[q] < 25) {
			player.challengecompletions[q] += 1
		}
		}
		challengeDisplay(y,true)
		reset(3);
		challengeachievementcheck(q);
		player.reincarnationCount -= 1;
		if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {player.highestchallengecompletions[q] += 1; player.worlds += player.highestchallengecompletions[q]}
		if (!player.retrychallenges || manual || player.challengecompletions[q] > 24) {
		player.currentChallengeRein = "";
		updateChallengeDisplay();
		calculateRuneLevels();
		calculateAnts();
		}
	}	
	}
}	

function resetConfirmation(i) {
	if (i == 'prestige') {
		if (player.toggles.twentyeight == true) {
			var r = confirm("Prestige will reset coin upgrades, coin producers AND crystals. The first prestige unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
				if (r == true) {
					resetachievementcheck(1);
					reset(1);
				}
		}
		else {
			resetachievementcheck(1);
			reset(1);
		}
	}
	if (i == 'transcend') {
		if (player.toggles.twentynine == true) {
			var z = confirm("Transcends will reset coin and prestige upgrades, coin producers, crystal producers AND diamonds. The first transcension unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
				if (z == true) {
					resetachievementcheck(2);
					reset(2);
				}
		}
		else {
			resetachievementcheck(2);
			reset(2);
		}
	}
	if (i == 'reincarnate') {
		if (player.toggles.thirty == true) {
			var z = confirm("Reincarnating will reset EVERYTHING but in return you will get extraordinarily powerful Particles, and unlock some very strong upgrades and some new features. would you like to Reincarnate? [Disable this message in settings]")
				if (z == true) {
					resetachievementcheck(3);
					reset(3);
				}
		}
		else {
			resetachievementcheck(3);
			reset(3);
		}
	}
	}

// Functions which update the game each, roughly each tick. [Lines 1330 - 1766]

function updateAll() {
		uFourteenMulti = new Decimal(1);
		uFifteenMulti = new Decimal(1);

		if (player.upgrades[14] > 0.5) {
			uFourteenMulti = Decimal.pow(1.15, freeAccelerator)
		}
		if (player.upgrades[15] > 0.5) {
			uFifteenMulti = Decimal.pow(1.15, freeAccelerator)
		}

//Autobuy "Building" Tab

		if (player.toggles.one == true && player.upgrades[81] == 1 && player.coins.greaterThanOrEqualTo(player.firstCostCoin)) {buyMax('first','Coin',1,100)}
		if (player.toggles.two == true && player.upgrades[82] == 1 && player.coins.greaterThanOrEqualTo(player.secondCostCoin)) {buyMax('second','Coin',2,2e3)}
		if (player.toggles.three == true && player.upgrades[83] == 1 && player.coins.greaterThanOrEqualTo(player.thirdCostCoin)) {buyMax('third','Coin',3,4e4)}
		if (player.toggles.four == true && player.upgrades[84] == 1 && player.coins.greaterThanOrEqualTo(player.fourthCostCoin)) {buyMax('fourth','Coin',4,8e5)}
		if (player.toggles.five == true && player.upgrades[85] == 1 && player.coins.greaterThanOrEqualTo(player.fifthCostCoin)) {buyMax('fifth','Coin',5,1.6e7)}
		if (player.toggles.six == true && player.upgrades[86] == 1 && player.coins.greaterThanOrEqualTo(player.acceleratorCost)) {buyAccelerator(true);}		
		if (player.toggles.seven == true && player.upgrades[87] == 1 && player.coins.greaterThanOrEqualTo(player.multiplierCost)) {buyMultiplier(true);}
		if (player.toggles.eight == true && player.upgrades[88] == 1 && player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)) {boostAccelerator(true);}

//Autobuy "Prestige" Tab

		if (player.toggles.ten == true && player.achievements[78] == 1 && player.prestigePoints.greaterThanOrEqualTo(player.firstCostDiamonds)) {buyMax('first','Diamonds',1,1e2)}
		if (player.toggles.eleven == true && player.achievements[85] == 1 && player.prestigePoints.greaterThanOrEqualTo(player.secondCostDiamonds)) {buyMax('second','Diamonds',3,1e5)}
		if (player.toggles.twelve == true && player.achievements[92] == 1 && player.prestigePoints.greaterThanOrEqualTo(player.thirdCostDiamonds)) {buyMax('third','Diamonds',6,1e15)}
		if (player.toggles.thirteen == true && player.achievements[99] == 1 && player.prestigePoints.greaterThanOrEqualTo(player.fourthCostDiamonds)) {buyMax('fourth','Diamonds',10,1e40)}
		if (player.toggles.fourteen == true && player.achievements[106] == 1 && player.prestigePoints.greaterThanOrEqualTo(player.fifthCostDiamonds)) {buyMax('fifth','Diamonds',15,1e100)}


		if (player.resettoggle1 == 1 || player.resettoggle1 == 0){
			if (player.toggles.fifteen == true && player.achievements[43] == 1 && prestigePointGain.greaterThanOrEqualTo(player.prestigePoints.times(Decimal.pow(10, player.prestigeamount))) && player.coinsThisPrestige.greaterThanOrEqualTo(1e16)){resetachievementcheck(1); reset(1,true)}
		}
		if (player.resettoggle1 == 2) {
			var time = Math.max(0.25, player.prestigeamount);
		if (player.toggles.fifteen == true && player.achievements[43] == 1 && player.prestigecounter >= time && player.coinsThisPrestige.greaterThanOrEqualTo(1e16)) {resetachievementcheck(1);reset(1,true);}
		}
		var c = 0;
		c += Math.floor(rune3level/10 * (1 + player.researches[5] /10) * (1 + player.researches[21]/800)) * 100/100
		if (player.upgrades[73] > 0.5 && player.currentChallengeRein !== ""){c += 10}
		if (player.achievements[79] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[0] + crystalUpgradeCostIncrement[0] * Math.floor(Math.pow(player.crystalUpgrades[0] + 0.5 - c, 2) /2))))){
			player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, (crystalUpgradesCost[0] + crystalUpgradeCostIncrement[0] * Math.floor(Math.pow(player.crystalUpgrades[0] + 0.5 - c, 2)/2))));
			player.crystalUpgrades[0] += 1;
		}
		if (player.achievements[86] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[1] + crystalUpgradeCostIncrement[1] * Math.floor(Math.pow(player.crystalUpgrades[1] + 0.5 - c, 2) /2))))){
			player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, (crystalUpgradesCost[1] + crystalUpgradeCostIncrement[1] * Math.floor(Math.pow(player.crystalUpgrades[1] + 0.5 - c , 2)/2))));
			player.crystalUpgrades[1] += 1;
		}
		if (player.achievements[93] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[2] + crystalUpgradeCostIncrement[2] * Math.floor(Math.pow(player.crystalUpgrades[2] + 0.5 - c, 2) /2))))){
			player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, (crystalUpgradesCost[2] + crystalUpgradeCostIncrement[2] * Math.floor(Math.pow(player.crystalUpgrades[2] + 0.5- c, 2)/2))));
			player.crystalUpgrades[2] += 1;
		}
		if (player.achievements[100] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[3] + crystalUpgradeCostIncrement[3] * Math.floor(Math.pow(player.crystalUpgrades[3] + 0.5 - c, 2) /2))))){
			player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, (crystalUpgradesCost[3] + crystalUpgradeCostIncrement[3] * Math.floor(Math.pow(player.crystalUpgrades[3] + 0.5 - c, 2)/2))));
			player.crystalUpgrades[3] += 1;
		}
		if (player.achievements[107] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[4] + crystalUpgradeCostIncrement[4] * Math.floor(Math.pow(player.crystalUpgrades[4] + 0.5 - c, 2) /2))))){
			player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, (crystalUpgradesCost[4] + crystalUpgradeCostIncrement[4] * Math.floor(Math.pow(player.crystalUpgrades[4] + 0.5 - c, 2)/2))));
			player.crystalUpgrades[4] += 1;
		}

//Autobuy "Transcension" Tab

		if (player.toggles.sixteen == true && player.upgrades[94] == 1 && player.transcendPoints.greaterThanOrEqualTo(player.firstCostMythos)) {buyMax('first','Mythos',1,1)}
		if (player.toggles.seventeen == true && player.upgrades[95] == 1 && player.transcendPoints.greaterThanOrEqualTo(player.secondCostMythos)) {buyMax('second','Mythos',3,1e2)}
		if (player.toggles.eighteen == true && player.upgrades[96] == 1 && player.transcendPoints.greaterThanOrEqualTo(player.thirdCostMythos)) {buyMax('third','Mythos',6,1e4)}
		if (player.toggles.nineteen == true && player.upgrades[97] == 1 && player.transcendPoints.greaterThanOrEqualTo(player.fourthCostMythos)) {buyMax('fourth','Mythos',10,1e8)}
		if (player.toggles.twenty == true && player.upgrades[98] == 1 && player.transcendPoints.greaterThanOrEqualTo(player.fifthCostMythos)) {buyMax('fifth','Mythos',15,1e16)}

		if (player.resettoggle2 == 1 || player.resettoggle2 == 0){
			if (player.toggles.twentyone == true && player.upgrades[89] == 1 && transcendPointGain.greaterThanOrEqualTo(player.transcendPoints.times(Decimal.pow(10, player.transcendamount))) && player.coinsThisTranscension.greaterThanOrEqualTo(1e100) && player.currentChallenge == ""){resetachievementcheck(2); reset(2,true);}
		}
		if (player.resettoggle2 == 2){
			var time = Math.max(0.25, player.transcendamount);
		if (player.toggles.twentyone == true && player.upgrades[89] == 1 && player.transcendcounter >= time && player.coinsThisTranscension.greaterThanOrEqualTo(1e100) && player.currentChallenge == "") {resetachievementcheck(2);reset(2,true);}
		}
//Challenge Tab Updates

		var chal = player.currentChallenge;
		var reinchal = player.currentChallengeRein;
		if (chal !== ""){
		if (player.coinsThisTranscension.greaterThanOrEqualTo(Decimal.pow(10, challengebaserequirements[chal] * Math.pow(1 + player.challengecompletions[chal], 2) * Math.pow(1.5, Math.max(0, player.challengecompletions[chal] - 75))))){
			resetCheck('challenge',false);
		}
		}
		if (reinchal == "six" || reinchal == "seven" || reinchal == "eight"){
			if (player.transcendShards.greaterThanOrEqualTo(Decimal.pow(10, challengebaserequirementsrein[reinchal] * Math.min(Math.pow(1.3797, player.challengecompletions[reinchal]),Math.pow(1 + player.challengecompletions[reinchal], 2))))) {
			resetCheck('reincarnationchallenge',false)
			}
		}
		if (reinchal == "nine" || reinchal == "ten"){
			if (player.coins.greaterThanOrEqualTo(Decimal.pow(10, challengebaserequirementsrein[reinchal] * Math.min(Math.pow(1.3797, player.challengecompletions[reinchal]),Math.pow(1 + player.challengecompletions[reinchal], 2))))) {
				resetCheck('reincarnationchallenge',false)
				}
		}

//Autobuy "Reincarnation" Tab

//		if (player.toggles.twentytwo == true && player.reincarnationPoints.greaterThanOrEqualTo(player.firstCostParticles)) {buyProducer('first', 'Particles', 1)}
//		if (player.toggles.twentythree == true && player.reincarnationPoints.greaterThanOrEqualTo(player.secondCostParticles)) {buyProducer('second', 'Particles', 1.5)}
//		if (player.toggles.twentyfour == true && player.reincarnationPoints.greaterThanOrEqualTo(player.thirdCostParticles)) {buyProducer('third', 'Particles', 2)}
//		if (player.toggles.twentyfive == true && player.reincarnationPoints.greaterThanOrEqualTo(player.fourthCostParticles)) {buyProducer('fourth', 'Particles', 2.5)}
//		if (player.toggles.twentysix == true && player.reincarnationPoints.greaterThanOrEqualTo(player.fifthCostParticles)) {buyProducer('fifth', 'Particles', 3)}
		if (player.resettoggle3 == 2) {
			var time = Math.max(0.25, player.reincarnationamount);
		if (player.toggles.twentyseven == true && player.researches[46] > 0.5 && player.transcendShards.greaterThanOrEqualTo("1e300") && player.reincarnationcounter >= time && player.currentChallenge == "" && player.currentChallengeRein == "") {resetachievementcheck(3);reset(3,true);}
		}
		if (player.resettoggle3 == 1 || player.resettoggle3 == 0){
		if (player.toggles.twentyseven == true && player.researches[46] > 0.5 && reincarnationPointGain.greaterThanOrEqualTo(player.reincarnationPoints.times(Decimal.pow(10, player.reincarnationamount))) && player.transcendShards.greaterThanOrEqualTo(1e300) && player.currentChallenge == "" && player.currentChallengeRein == ""){resetachievementcheck(3); reset(3,true)}
		}
//Generation


		if (player.upgrades[101] > 0.5) {player.fourthGeneratedCoin= player.fourthGeneratedCoin.add((player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(uFifteenMulti).times(generatorPower));}
		if (player.upgrades[102] > 0.5) {player.thirdGeneratedCoin= player.thirdGeneratedCoin.add((player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(uFourteenMulti).times(generatorPower));}
		if (player.upgrades[103] > 0.5) {player.secondGeneratedCoin= player.secondGeneratedCoin.add((player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(generatorPower));}
		if (player.upgrades[104] > 0.5) {player.firstGeneratedCoin= player.firstGeneratedCoin.add((player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(generatorPower));}
		if (player.upgrades[105] > 0.5) {player.fifthGeneratedCoin= player.fifthGeneratedCoin.add(player.firstOwnedCoin);}
		var p = 1;
		p += 1/100 * (player.achievements[71] + player.achievements[72] + player.achievements[73] + player.achievements[74] + player.achievements[75] + player.achievements[76] + player.achievements[77])

		var a = 0;
		if (player.upgrades[106] > 0.5) {a += 0.10}
		if (player.upgrades[107] > 0.5) {a += 0.15}
		if (player.upgrades[108] > 0.5) {a += 0.25}
		if (player.upgrades[109] > 0.5) {a += 0.25}
		if (player.upgrades[110] > 0.5) {a += 0.25}
		a *= p

		var b = 0;
		if (player.upgrades[111] > 0.5) {b += 0.08}
		if (player.upgrades[112] > 0.5) {b += 0.08}
		if (player.upgrades[113] > 0.5) {b += 0.08}
		if (player.upgrades[114] > 0.5) {b += 0.08}
		if (player.upgrades[115] > 0.5) {b += 0.08}
		b *= p

		var c = 0;
		if (player.upgrades[116] > 0.5) {c += 0.05}
		if (player.upgrades[117] > 0.5) {c += 0.05}
		if (player.upgrades[118] > 0.5) {c += 0.05}
		if (player.upgrades[119] > 0.5) {c += 0.05}
		if (player.upgrades[120] > 0.5) {c += 0.05}
		c *= p

		if (a !== 0){player.fifthGeneratedCoin = player.fifthGeneratedCoin.add(Decimal.pow(player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).add(1), a))}
		if (b !== 0){player.fifthGeneratedDiamonds = player.fifthGeneratedDiamonds.add(Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), b))}
		if (c !== 0){player.fifthGeneratedMythos = player.fifthGeneratedMythos.add(Decimal.pow(player.firstGeneratedParticles.add(player.firstOwnedParticles).add(1),c))}

		if (player.runeshards > player.maxofferings) {
			player.maxofferings = player.runeshards;
		}
		if (player.researchPoints > player.maxobtainium){
			player.maxobtainium = player.researchPoints;
		}

		effectiveLevelMult = (1 + player.researches[4]/10) * (1 + player.researches[21]/800) * (1 + player.researches[90]/100)
		optimalOfferingTimer = 600 + 6 * player.researches[85] + 0.4 * rune5level + 120 * player.shopUpgrades.offeringTimerLevel
		optimalObtainiumTimer = 3600 + 120 * player.shopUpgrades.obtainiumTimerLevel
		if (player.achievements[176] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[1], player.antUpgrades[1]).times(antUpgradeBaseCost[1]).times(2))){buyAntUpgrade('100',true,1)}
		if (player.achievements[176] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[2], player.antUpgrades[2]).times(antUpgradeBaseCost[2]).times(2))){buyAntUpgrade('100',true,2)}
		if (player.achievements[177] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[3], player.antUpgrades[3]).times(antUpgradeBaseCost[3]).times(2))){buyAntUpgrade('1000',true,3)}
		if (player.achievements[178] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[4], player.antUpgrades[4]).times(antUpgradeBaseCost[4]).times(2))){buyAntUpgrade('1000',true,4)}
		if (player.achievements[178] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[5], player.antUpgrades[5]).times(antUpgradeBaseCost[5]).times(2))){buyAntUpgrade('1e5',true,5)}
		if (player.achievements[179] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[6], player.antUpgrades[6]).times(antUpgradeBaseCost[6]).times(2))){buyAntUpgrade('1e6',true,6)}
		if (player.achievements[180] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[7], player.antUpgrades[7]).times(antUpgradeBaseCost[7]).times(2))){buyAntUpgrade('1e8',true,7)}
		if (player.achievements[180] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[8], player.antUpgrades[8]).times(antUpgradeBaseCost[8]).times(2))){buyAntUpgrade('1e11',true,8)}
		if (player.achievements[181] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[9], player.antUpgrades[9]).times(antUpgradeBaseCost[9]).times(2))){buyAntUpgrade('1e15',true,9)}
		if (player.achievements[182] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[10], player.antUpgrades[10]).times(antUpgradeBaseCost[10]).times(2))){buyAntUpgrade('1e20',true,10)}
		if (player.achievements[182] && player.antPoints.greaterThanOrEqualTo(Decimal.pow( antUpgradeCostIncreases[11], player.antUpgrades[11]).times(antUpgradeBaseCost[11]).times(2))){buyAntUpgrade('1e40',true,11)}
	
		if (player.achievements[173] == 1 && player.reincarnationPoints.greaterThanOrEqualTo(player.firstCostAnts)){buyAntProducers('first','Ants','1e800',1);}
		if (player.achievements[176] == 1 && player.antPoints.greaterThanOrEqualTo(player.secondCostAnts.times(2))){buyAntProducers('second','Ants','3',2);}
		if (player.achievements[177] == 1 && player.antPoints.greaterThanOrEqualTo(player.thirdCostAnts.times(2))){buyAntProducers('third','Ants','100',3);}
		if (player.achievements[178] == 1 && player.antPoints.greaterThanOrEqualTo(player.fourthCostAnts.times(2))){buyAntProducers('fourth','Ants','10000',4);}
		if (player.achievements[179] == 1 && player.antPoints.greaterThanOrEqualTo(player.fifthCostAnts.times(2))){buyAntProducers('fifth','Ants','1e12',5);}
		if (player.achievements[180] == 1 && player.antPoints.greaterThanOrEqualTo(player.sixthCostAnts.times(2))){buyAntProducers('sixth','Ants','1e36',6);}
		if (player.achievements[181] == 1 && player.antPoints.greaterThanOrEqualTo(player.seventhCostAnts.times(2))){buyAntProducers('seventh','Ants','1e100',7);}
		if (player.achievements[182] == 1 && player.antPoints.greaterThanOrEqualTo(player.eighthCostAnts.times(2))){buyAntProducers('eighth','Ants','1e300',8);}

		if (player.antSacrificeTimer >= 900 && player.researches[124] == 1 && player.autoAntSacrifice && player.antPoints.greaterThanOrEqualTo("1e40")){sacrificeAnts(true)}

	let reductionValue = getReductionValue();
	if (reductionValue !== prevReductionValue)
	{
		prevReductionValue = reductionValue;
		let resources = ["Coin", "Diamonds", "Mythos"];
		let scalings = [
			function(value) {return value;},
			function (value) {return value * (value + 1) / 2;},
			function (value) {return value * (value + 1) / 2;},
		];
		let originalCosts = [
			[100, 2e3, 4e4, 8e5, 1.6e7],
			[1e2, 1e5, 1e15, 1e40, 1e100],
			[1, 1e2, 1e4, 1e8, 1e16]
		];

		for (let res = 0; res < resources.length; ++res)
		{
			let resource = resources[res];
			for (let ord = 0; ord < 5; ++ord)
			{
				let num = ordinals[ord];
				player[num + "Cost" + resource] = getCost(originalCosts[res][ord], player[num + "Owned" + resource] + 1, resource, scalings[res](ord + 1), reductionValue);
			}
		}
	}
}

// Functions which (try) to successfully load the game

function constantIntervals() {
		setInterval(saveSynergy, 5000);
		setInterval(autoUpgrades, 200);
		setInterval(buttoncolorchange, 200)
		setInterval(updateAll,50)
		setInterval(buildingAchievementCheck, 200)

		if(!timeWarp){
			document.getElementById("preload").style.display = "none";
			document.getElementById("offlineprogressbar").style.display = "none"}
	}

let lastUpdate = 0;
//gameInterval = 0;

function createTimer() {
	lastUpdate = Date.now();
	setInterval(tick, 50);
}

function tick() {
	if (!timeWarp){
	var now = Date.now();
	var dt = Math.max(0, Math.min(36000, (now - lastUpdate)/1000 * divineBlessing1));
	dt *= (1 + player.researches[121]/200)
	lastUpdate = now;

	player.quarkstimer += dt/(divineBlessing1 * (1 + player.researches[121]/50))
	if(player.quarkstimer >= 90000){player.quarkstimer = 90000}
	if(player.researches[61] > 0){player.obtainiumtimer += dt;}
	if(player.researches[61] > 0){document.getElementById("automaticobtainium").textContent = "Thanks to researches you automatically gain " + format(0.05 * (player.researches[61] + player.researches[62]) * player.maxobtainiumpersecond * divineBlessing1,3,true) + " Obtainium per second."}
	document.getElementById("quarktimerdisplay").textContent = format((3600 - (player.quarkstimer % 3600.00001)),2) + "s until +" +(1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125]) + " export Quark"
	document.getElementById("quarktimeramount").textContent = "Quarks on export: " + (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125])) + " [Max " + format((25 * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125]))) +"]"

	if (player.shopUpgrades.offeringAutoLevel > 0.5 && player.autoSacrificeToggle){
	player.sacrificeTimer += dt
	if (player.sacrificeTimer >= 10){
		let rune = player.autoSacrifice;
		redeemShards(rune,true);
		player.sacrificeTimer -= 10;
	}
	}

	if (player.achievements[173] == 1){
		player.antSacrificeTimer += dt
		document.getElementById("antSacrificeTimer").textContent = format(Math.floor(player.antSacrificeTimer / 86400)) + "d" + format(Math.floor(player.antSacrificeTimer / 3600) % 24) + "h" + format(Math.floor(player.antSacrificeTimer/60) % 60) + "m" + format(Math.floor(player.antSacrificeTimer) % 60) + "s"
		showSacrifice();
	}
	calculateObtainium();
	if (player.researches[61] == 1){
	player.researchPoints += (player.maxobtainiumpersecond * dt) * (0.05 + 0.05 * player.researches[62])
	}
	if (dt > 5) {
		while(dt > 5){
			player.prestigecounter += 5;
			player.transcendcounter += 5;
			player.reincarnationcounter += 5;
			resourceGain(5);
			updateAll();
			dt -= 5
		}
		player.prestigecounter += dt;
		player.transcendcounter += dt;
		player.reincarnationcounter += dt;
		resourceGain(dt);
		updateAll();
		player.offlinetick = Date.now()
	}
	else if (dt <= 5){
			resourceGain(dt);
			player.prestigecounter += dt;
			player.transcendcounter += dt;
			player.reincarnationcounter += dt;
	}
}
}


window['addEventListener' in window ? 'addEventListener' : 'attachEvents']('beforeunload', function() {
	if(typeof updatetimer === 'function') {
		updatetimer();
	}
});

document['addEventListener' in document ? 'addEventListener' : 'attachEvent']('keydown', function (event) {
	// activeElement is the focused element on page
	// if the autoprestige input is focused, hotkeys shouldn't work
	// fixes https://github.com/Pseudo-Corp/Synergism-Issue-Tracker/issues/2
	if(
		document.querySelector('#prestigeamount') === document.activeElement ||
		document.querySelector('#transcendamount') === document.activeElement ||
		document.querySelector('#reincarnationamount') === document.activeElement 
	) {
		// https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
		// finally fixes the bug where hotkeys would be activated when typing in an input field
		event.stopPropagation();
		return;
	}

	var type = ""
	var pos = ""
	var num = 0
	if (event.key === "1") {pos = "first"; num += 1; if (currentTab == "challenges") {toggleChallenges('one')}; if (currentTab == "runes"){redeemShards(1)}}
	if (event.key === "2") {pos = "second"; num += 2; if (currentTab == "challenges") {toggleChallenges('two')}; if (currentTab == "runes"){redeemShards(2)}}
	if (event.key === "3") {pos = "third"; num += 3; if (currentTab == "challenges") {toggleChallenges('three')}; if (currentTab == "runes"){redeemShards(3)}}
	if (event.key === "4") {pos = "fourth"; num += 4; if (currentTab == "challenges") {toggleChallenges('four')}; if (currentTab == "runes"){redeemShards(4)}}
	if (event.key === "5") {pos = "fifth"; num += 5; if (currentTab == "challenges") {toggleChallenges('five')}; if(currentTab == "runes"){redeemShards(5)}}
	if (event.key === "6") {buyCrystalUpgrades(1)}
	if (event.key === "7") {buyCrystalUpgrades(2)}
	if (event.key === "8") {buyCrystalUpgrades(3)}
	if (event.key === "9") {buyCrystalUpgrades(4)}
	if (event.key === "0") {buyCrystalUpgrades(5)}
	if (currentTab == "buildings") {type = "Coin"}
	if (currentTab == "prestige") {type = "Diamonds"; num = 1/2 * (Math.pow(num, 2) + num)}
	if (currentTab == "transcension") {type = "Mythos"; num = 1/2 * (Math.pow(num, 2) + num)}
	if (currentTab == "reincarnation" && (event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4" || event.key === "5")) {buyParticleBuilding(pos)}
	if ((event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4" || event.key === "5") && player.currentTab !== "reincarnation") {buyProducer(pos, type, num)}
	if ((event.key === "A" || event.key === "a") && currentTab == "buildings") {buyAccelerator()}
	if ((event.key === "B" || event.key === "b") && currentTab == "buildings") {boostAccelerator()}
	if ((event.key === "M" || event.key === "m") && currentTab == "buildings") {buyMultiplier()}
	if ((event.key === "P") || event.key === "p") {resetCheck('prestige')}
	if ((event.key === "T") || event.key === "t") {resetCheck('transcend')}
	if ((event.key === "R") || event.key === "r") {resetCheck('reincarnate')}
	if ((event.key === "E" || event.key === "e") && player.currentChallenge !== "") {resetCheck('challenge')}	
	
	// (might) fix https://github.com/Pseudo-Corp/Synergism-Issue-Tracker/issues/18
	// prevent the default action from occurring when pressing arrow keys, so smaller
	// resolutions won't have the screen scroll with them.
	if(event.key === "ArrowLeft") {
		event.preventDefault();
		keyboardtabchange(-1);
	}
	if (event.key === "ArrowRight") {
		event.preventDefault();
		keyboardtabchange(1);
	}
});

window['addEventListener' in window ? 'addEventListener' : 'attachEvent']('load', function() {
	const dec = LZString.decompressFromBase64(localStorage.getItem('Synergysave2'));
	const isLZString = dec !== '';
	
	if(isLZString) {
		localStorage.clear();
		localStorage.setItem('Synergysave2', btoa(dec));
		alert('Transferred save to new format successfully!');
	}

	// Make sure language is loaded first no matter what
	/* new i18n().getJSON().then(function() {
		console.log('Language localized!');
		loadSynergy();
		saveSynergy();
		revealStuff();
		hideStuff();
		createTimer();
		constantIntervals();
		htmlInserts();
	}); */


	setTimeout(function() {
		loadSynergy();
		saveSynergy();
		revealStuff();
		hideStuff();
		createTimer();
		constantIntervals();
		htmlInserts();
	}, 0);


	/**
	 * After window loads, add an event listener to handle clicks on the export bar.
	 */
	document.querySelector('.saveClose').addEventListener('click', function() {
		document.querySelector('.save').style.display = 'none';
	});
});
