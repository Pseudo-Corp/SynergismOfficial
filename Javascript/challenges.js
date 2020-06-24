function challengeDisplay(i,changefocus, automated) {
    changefocus = (changefocus === null || changefocus === undefined) ? true : changefocus;
    if (changefocus){challengefocus = i; document.getElementById("challengeDetails").style.display = "block"}

    let ordinals = [null,'one','two','three','four','five','six','seven','eight','nine','ten']
    let q = ordinals[i]

    let quarksMultiplier = 1;
    if (changefocus){
        challengefocus = i;
        document.getElementById("challengeDetails").style.display = "block";
        triggerChallenge = ordinals[i]
    }

    let maxChallenges = 0;
    if (i > 5){maxChallenges = 25; quarksMultiplier = 10;}

    let a = document.getElementById("challengeName");
    let b = document.getElementById("challengeFlavor");
    let c = document.getElementById("challengeRestrictions");
    let d = document.getElementById("challengeGoal");
    let e = document.getElementById("challengePer1");
    let f = document.getElementById("challengePer2");
    let g = document.getElementById("challengePer3");
    let h = document.getElementById("challengeFirst1");
    let j = document.getElementById("challengeQuarkBonus");
    let k = document.getElementById("startChallenge");


    if(i == 1 && challengefocus == 1){
        maxChallenges = 25 + player.researches[66] + 925 * player.researches[105]
        a.textContent = "No Multipliers Challenge || " + player.challengecompletions.one + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Multipliers make the game a little too fast. Let's take them out!"
        c.textContent = "Transcend and reach the goal except Multipliers do nothing but act like Accelerators, which are nerfed by 50%!"
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.one * Math.pow((1 + player.challengecompletions.one), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.one - 75)))) + " Coins in challenge."
        e.textContent = "+10 base Multiplier Boosts! [+0.05 to power!]"
        f.textContent = "+10% total Multiplier Boosts!"
        g.textContent = ""
        h.textContent = "+1 free Multiplier!"
        k.textContent = "Start [No Multipliers]"
    }
    if(i == 2 && challengefocus == 2){
        maxChallenges = 25 + player.researches[67] + 925 * player.researches[105]
        a.textContent = "No Accelerators Challenge || " + player.challengecompletions.two + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Who needs accelerators? They do basically nothing now."
        c.textContent = "Transcend and reach the goal except Accelerators do nothing! Multipliers are nerfed a bit as well."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.two * Math.pow((1 + player.challengecompletions.two), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.two - 75)))) + " Coins in challenge."
        e.textContent = "+5 Free Accelerators!"
        f.textContent = "+5% Accelerator Boost Power!"
        g.textContent = "+0.25% Accelerator Power!"
        h.textContent = "None"
        k.textContent = "Start [No Accelerators]"
    }
    if(i == 3 && challengefocus == 3){
        maxChallenges = 25 + player.researches[68] + 925 * player.researches[105]
        a.textContent = "No Shards Challenge || " + player.challengecompletions.three + "/" + format(maxChallenges) + " Completions"
        b.textContent = "Alright, now you're thinking, how else can I make the game harder?"
        c.textContent = "Transcend and reach the goal except you do not produce Crystals or Mythos Shards."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.three * Math.pow((1 + player.challengecompletions.three), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.three - 75)))) + " Coins in challenge."
        e.textContent = "Crystal --> Coin conversion exponent +0.04!"
        f.textContent = "+0.5% to Grandmaster production per Mythos Shard producer bought."
        g.textContent = ""
        h.textContent = "None"
        k.textContent = "Start [No Shards]"
    }
    if(i == 4 && challengefocus == 4){
        maxChallenges = 25 + player.researches[69] + 925 * player.researches[105]
        a.textContent = "Cost+ Challenge || " + player.challengecompletions.four + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You're getting rich now, but inflation hasn't happened yet? I don't think so!"
        c.textContent = "Transcend and reach the goal except Coin/Crystal producers, Accelerators and Multipliers cost more. [Gets harder each time!]"
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.four * Math.pow((1 + player.challengecompletions.four), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.four - 75)))) + " Coins in challenge."
        e.textContent = "Accelerator Cost scale slows down by +5 purchases."
        f.textContent = "Multiplier Cost scale slows down by +2 purchases."
        g.textContent = "All producer cost scale slows down by +0.5% of base."
        h.textContent = "None"
        k.textContent = "Start [Cost+]"
    }
    if(i == 5 && challengefocus == 5){
        maxChallenges = 25 + player.researches[70] + 925 * player.researches[105]
        a.textContent = "Reduced Diamonds Challenge || " + player.challengecompletions.five + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You ever wonder how you get so many diamonds?"
        c.textContent = "Transcend and reach the goal except you gain far fewer Diamonds from all sources [Gets harder each time!]"
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.five * Math.pow((1 + player.challengecompletions.five), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.five - 75)))) + " Coins in challenge."
        e.textContent = "+0.01 Coin --> Diamond conversion exponent on Prestige!"
        f.textContent = "Multiply Crystal production by 10!"
        g.textContent = ""
        h.textContent = "None"
        k.textContent = "Start [Reduced Diamonds]"

    }
    if(i == 6 && challengefocus == 6){
        a.textContent = "Higher Tax Challenge || " + player.challengecompletions.six + "/" + format(maxChallenges) + " Completions"
        b.textContent = "The tax man caught wind that you reincarnated recently..."
        c.textContent = "Reincarnate and reach the goal except tax has a lower cap, and Coin production is divided by 1e250."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.six * Math.min(Math.pow(1.3797, player.challengecompletions.six), Math.pow(1 + player.challengecompletions.six, 2)))) + " Mythos Shards in challenge."
        e.textContent = "-3.5% Taxes [Multiplicative]!"
        f.textContent = "Thrift Rune cost -2%"
        g.textContent = ""
        h.textContent = "-7.5% Taxes!"
        k.textContent = "Start <Higher Tax>"

    }
    if(i == 7 && challengefocus == 7){
        a.textContent = "No Multipliers/Accelerators Challenge || " + player.challengecompletions.seven + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You're really going to hate this one."
        c.textContent = "Reincarnate and reach the goal except Accelerators and Multipliers do nothing. Coin Production is divided by 1e1,250."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.seven * Math.min(Math.pow(1.3797, player.challengecompletions.seven), Math.pow(1 + player.challengecompletions.seven, 2)))) + " Mythos Shards in challenge."
        e.textContent = "Accelerator/Multiplier boost power exponent +0.04!"
        f.textContent = "Speed Rune cost -2%"
        g.textContent = "Duplication Rune cost -2%"
        h.textContent = "Multiplier Boost power +25%! The first Discord-Booster Global Diamond Upgrade."
        k.textContent = "Start <No Multipliers/Accelerators>"

    }
    if(i == 8 && challengefocus == 8){
        a.textContent = "Cost++ Challenge || " + player.challengecompletions.eight + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You thought you could outgrow inflation by Reincarnating?"
        c.textContent = "Reincarnate and reach the goal except Cost Scaling for producers and Accelerators/Multipliers scale much, much faster."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.eight * Math.min(Math.pow(1.3797, player.challengecompletions.eight), Math.pow(1 + player.challengecompletions.eight, 2)))) + " Mythos Shards in challenge."
        e.textContent = "Base Building Power +0.25!"
        f.textContent = ""
        g.textContent = ""
        h.textContent = "Unlock the Anthill feature! Includes 20 new Researches. A Global Diamond Upgrade."
        k.textContent = "Start <Cost++>"

    }
    if(i == 9 && challengefocus == 9){
        a.textContent = "No Runes Challenge || " + player.challengecompletions.nine + "/" + format(maxChallenges) + " Completions"
        b.textContent = "You'll never complain about Prism being bad again."
        c.textContent = "Reincarnate and reach the goal except runes always have level 1 effects. All coin production is divided by e2,000,000."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.nine * Math.min(Math.pow(1.3797, player.challengecompletions.nine), Math.pow(1 + player.challengecompletions.nine, 2)))) + " Coins in challenge."
        e.textContent = "+1 free Ant level!"
        f.textContent = "+10% Ant speed [Multiplicative!]"
        g.textContent = ""
        h.textContent = "Unlock the Talismans feature! [In Runes tab]. A Global Diamond Upgrade."
        k.textContent = "Start <No Runes>"

    }
    if(i == 10 && challengefocus == 10){
        a.textContent = "Sadistic Challenge I || " + player.challengecompletions.ten + "/" + format(maxChallenges) + " Completions"
        b.textContent = "I'm sorry for what I've unleashed onto the world."
        c.textContent = "Reincarnate and reach the goal except run the first five challenges AT THE SAME TIME! Coin Production /e12,500,000."
        d.textContent = "Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.ten * Math.min(Math.pow(1.3797, player.challengecompletions.ten), Math.pow(1 + player.challengecompletions.ten, 2)))) + " Coins in challenge."
        e.textContent = "+100 base ELO for sacrificing ants!"
        f.textContent = "+2% Ant Sacrifice Reward!"
        g.textContent = ""
        h.textContent = "Unlock the [??????] Reset Tier [v1.011]!"
        k.textContent = "Start <Sadistic I>"

    }
    if (changefocus){
        j.textContent = ""
    }
    if(player.challengecompletions[q] >= player.highestchallengecompletions[q] && player.highestchallengecompletions[q] < maxChallenges && changefocus){
        j.textContent = "Gain " + Math.floor(quarksMultiplier * player.highestchallengecompletions[q]/10 + 1) + " Quarks for completing this challenge [First Time Bonus]!"
    }
    
   
    /* if (i <= 5 && !automated) {document.getElementById("challengetotalscore").style.color = "plum"}
    if (i > 5 && i <= 8 && !automated) {document.getElementById("challengetotalscore").style.color = "limegreen"}
    if (i==1){q = "one"}
    if (i==2){q = "two"}
    if (i==3){q = "three"}
    if (i==4){q = "four"}
    if (i==5){q = "five"}
    if (i==6){q = "six"}
    if (i==7){q = "seven"}
    if (i==8){q = "eight"}
    if (i==9){q = "nine"}
    if (i==10){q = "ten"}
    var c = ""
    if(player.highestchallengecompletions[q] <= player.challengecompletions[q] && player.highestchallengecompletions[q] !== 75) {c = "This will be the your highest ever completions so you will also gain " + Math.floor(1 + player.highestchallengecompletions[q]/10) + "x Quarks!"}


    if (i == 1 && challengefocus == 1) {
        document.getElementById("challengedescription").textContent = "Go through a transcension, except Multipliers do not directly increase Multiplier. Instead, Multipliers act as Accelerators. Accelerator Power from Accelerator Boosts are nerfed by about 50%."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " + player.challengecompletions.one + "/" + (25 + 1 * player.researches[66] + 925 * player.researches[105]) +". Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.one * Math.pow((1 + player.challengecompletions.one), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.one - 75)))) + " Coins in challenge. [HIGHEST EVER COMPLETED (Manually): " + player.highestchallengecompletions.one + "]"
        document.getElementById("challengereward").textContent = "Reward: +10%, +10 Multiplier Power Boosts per completion. First Completion awards 1 multiplier. " + c
    }
    if (i == 2 && challengefocus == 2) {
        document.getElementById("challengedescription").textContent = "Go through a transcension, except Accelerators only boost generation through Coin Upgrades. Otherwise, Accelerators do nothing. Multiplier power is nerfed by about 75%."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " + player.challengecompletions.two + "/" + (25 + 1 * player.researches[67] + 925 * player.researches[105]) +". Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.two * Math.pow((1 + player.challengecompletions.two), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.two - 75)))) + " Coins in challenge. [HIGHEST EVER COMPLETED (Manually): " + player.highestchallengecompletions.two + "]"
        document.getElementById("challengereward").textContent = "Reward: +5% Accel. Boost power, +5 free Accelerator per completion. Gain +0.5% higher Acceleration Power every 2 completions. " + c
    }
    if (i == 3 && challengefocus == 3) {
        document.getElementById("challengedescription").textContent = "Go through a transcension, except you cannot gain Crystals or Mythos Shards. Accelerators are weaker."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " + player.challengecompletions.three + "/" + (25 + 1 * player.researches[68] + 925 * player.researches[105]) +". Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.three * Math.pow((1 + player.challengecompletions.three), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.three - 75)))) + " Coins in challenge. [HIGHEST EVER COMPLETED (Manually): " + player.highestchallengecompletions.three + "]"
        document.getElementById("challengereward").textContent = "Reward: Increase crystal multiplier to production by an exponent of .04 per completion. Purchased mythos producers will also increase grandmaster production by 0.5% each, for each completion. " + c
    }
    if (i == 4 && challengefocus == 4) {
        document.getElementById("challengedescription").textContent = "Go through a transcension, except the cost of Coin buildings, Accelerators and Multipliers scales much faster and scales immediately. Gets harder each completion!"
        document.getElementById("challengetotalscore").textContent = "Times Completed: " + player.challengecompletions.four + "/" + (25 + 1 * player.researches[69] + 925 * player.researches[105]) +". Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.four * Math.pow((1 + player.challengecompletions.four), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.four - 75)))) + " Coins in challenge. [HIGHEST EVER COMPLETED (Manually): " + player.highestchallengecompletions.four + "]"
        document.getElementById("challengereward").textContent = "Reward: Accelerator cost scaling starts 5 slower, and Multiplier cost scaling starts 2 slower per completion. Buildings scale 0.5% slower as well! " + c
    }
    if (i == 5 && challengefocus == 5) {
        document.getElementById("challengedescription").textContent = "Go through a transcension, except prestiging rewards scale much more slowly. Diamond generation is also debuffed, and diamond-boosting upgrades are disabled. Gets harder each completion!"
        document.getElementById("challengetotalscore").textContent = "Times Completed: " + player.challengecompletions.five + "/" + (25 + 1 * player.researches[70] + 925 * player.researches[105]) +". Goal: Gain " + format(Decimal.pow(10, challengebaserequirements.five * Math.pow((1 + player.challengecompletions.five), 2) * Math.pow(1.5, Math.max(0, player.challengecompletions.five - 75)))) + " Coins in challenge. [HIGHEST EVER COMPLETED (Manually): " + player.highestchallengecompletions.five + "]"
        document.getElementById("challengereward").textContent = "Reward: Each completions multiplies all crystal producer production by 10. Diamond gain is also increased significantly per completion. " +c
    }
    if (i == 6 && challengefocus == 6) {
        document.getElementById("challengedescription").textContent = "Reincarnate and reach your target, except tax scales immediately and much faster. Production is also divided by a further 1e250."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " +player.challengecompletions.six + "/25. Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.six * Math.min(Math.pow(1.3797, player.challengecompletions.six), Math.pow(1 + player.challengecompletions.six, 2)))) + " Mythos Shards."
        document.getElementById("challengereward").textContent = "Reward: Taxes scale 3.5% slower per completion MULTIPLICATIVELY. The thrift rune is 2% less expensive to level per completion (applies retroactively!). First completion divides tax growth by a further 1.075! " + c
    }
    if (i == 7 && challengefocus == 7) {
        document.getElementById("challengedescription").textContent = "Reincarnate and reach your target, except Multipliers and Accelerators do nothing. Your production is also divided by a further 1e1,250 and building power is siginificantly reduced."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " +player.challengecompletions.seven + "/25. Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.seven * Math.min(Math.pow(1.3797, player.challengecompletions.seven),Math.pow(1 + player.challengecompletions.seven, 2)))) + " Mythos Shards."
        document.getElementById("challengereward").textContent = "Reward: Accelerator/Multiplier boost is powered by 0.04 per completion. The speed and duplication rune are 2% less expensive to level per completion (applies retroactively!). First completion makes multiplier boosts 25% more effective! " + c
    }
    if (i == 8 && challengefocus == 8){
        document.getElementById("challengedescription").textContent = "Reincarnate and reach your target, except building power is stuck at 1, and the cost growth is insanely high all the time!"
        document.getElementById("challengetotalscore").textContent = "Times Completed: " +player.challengecompletions.eight + "/25. Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.eight * Math.min(Math.pow(1.3797, player.challengecompletions.eight),Math.pow(1 + player.challengecompletions.eight, 2)))) + " Mythos Shards."
        document.getElementById("challengereward").textContent = "Reward: Each completion raises base building power by 0.25 per completion! The first completion unlocks 20 new researches and a new feature: Anthill! For your bug squashing wishes." + c
    }
    if (i == 9 && challengefocus == 9){
        document.getElementById("challengedescription").textContent = "Reincarnate and reach your target, except you do not have runes to power you up at all! Coin production is also divided by 1e2,000,000. Tax is also slowed down by 99.5%, however."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " +player.challengecompletions.nine + "/25. Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.nine * Math.min(Math.pow(1.3797, player.challengecompletions.nine),Math.pow(1 + player.challengecompletions.nine, 2)))) + " Coins."
        document.getElementById("challengereward").textContent = "Reward: Gain +1 Bonus ant level per completion and +10% more ant speed multiplicatively! " + c
    }
    if (i == 10 && challengefocus == 10){
        document.getElementById("challengedescription").textContent = "Reincarnate and reach your target, except the first FIVE challenges are active at once AND each negative effect is significantly buffed. Coin production is also divided by 1e12,500,000."
        document.getElementById("challengetotalscore").textContent = "Times Completed: " +player.challengecompletions.ten + "/25. Goal: Gain " + format(Decimal.pow(10, challengebaserequirementsrein.ten * Math.min(Math.pow(1.3797, player.challengecompletions.ten),Math.pow(1 + player.challengecompletions.ten, 2)))) + " Coins."
        document.getElementById("challengereward").textContent = "Reward: Gain +100 base ELO per completion. Unlocks [??????] - a new Reset tier coming in v1.011! " + c
    }
    */
}

function toggleRetryChallenges() {
    if (player.retrychallenges){player.retrychallenges = false; document.getElementById("retryChallenge").textContent = "Retry Challenges: OFF"}
    else{player.retrychallenges = true; document.getElementById("retryChallenge").textContent = "Retry Challenges: ON"}
}