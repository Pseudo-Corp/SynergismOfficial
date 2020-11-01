function submitStats() {
    let c = Math.floor(player.maxobtainium / 10000) * 100 / 100;
    if('kongregate' in window) {
        kongregate.stats.submit("reincarnatecount", player.reincarnationCount)
        kongregate.stats.submit("transcendcount", player.transcendCount)
        kongregate.stats.submit("prestigecount", player.prestigeCount)
        kongregate.stats.submit("maxoffering", player.maxofferings);
        kongregate.stats.submit("maxobtainium", c);
        kongregate.stats.submit("challengeone", player.highestchallengecompletions[1])
        kongregate.stats.submit("challengetwo", player.highestchallengecompletions[2])
        kongregate.stats.submit("challengethree", player.highestchallengecompletions[3])
        kongregate.stats.submit("challengefour", player.highestchallengecompletions[4])
        kongregate.stats.submit("challengefive", player.highestchallengecompletions[5])
        kongregate.stats.submit("runeone", player.runelevels[0])
        kongregate.stats.submit("runetwo", player.runelevels[1])
        kongregate.stats.submit("runethree", player.runelevels[2])
        kongregate.stats.submit("runefour", player.runelevels[3])
        kongregate.stats.submit("runefive", player.runelevels[4])
        kongregate.stats.submit("challengesix", player.highestchallengecompletions[6])
        kongregate.stats.submit("challengeseven", player.highestchallengecompletions[7])
        kongregate.stats.submit("challengeeight", player.highestchallengecompletions[8])
    }
}