function submitStats() {
    let c = Math.floor(player.maxobtainium / 10000) * 100/100
    kongregate.stats.submit("reincarnatecount",player.reincarnationCount)
    kongregate.stats.submit("transcendcount",player.transcendCount)
    kongregate.stats.submit("prestigecount",player.prestigeCount)
    kongregate.stats.submit("maxoffering",player.maxofferings);
    kongregate.stats.submit("maxobtainium",c);
    kongregate.stats.submit("challengeone",player.highestchallengecompletions.one)
	kongregate.stats.submit("challengetwo",player.highestchallengecompletions.two)
	kongregate.stats.submit("challengethree",player.highestchallengecompletions.three)
	kongregate.stats.submit("challengefour",player.highestchallengecompletions.four)
    kongregate.stats.submit("challengefive",player.highestchallengecompletions.five)
    kongregate.stats.submit("runeone",player.runelevels[0])
    kongregate.stats.submit("runetwo",player.runelevels[1])
    kongregate.stats.submit("runethree",player.runelevels[2])
    kongregate.stats.submit("runefour",player.runelevels[3])
    kongregate.stats.submit("runefive",player.runelevels[4])
    kongregate.stats.submit("challengesix", player.highestchallengecompletions.six)
    kongregate.stats.submit("challengeseven",player.highestchallengecompletions.seven)
    kongregate.stats.submit("challengeeight", player.highestchallengecompletions.eight)
}