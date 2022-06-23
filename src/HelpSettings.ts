import { DOMCacheGetOrSet } from './Cache/DOM';
import { player } from './Synergism';
export const displayHelp = (btn: HTMLElement) => {
    const coinText = `
    Welcome to <span style='color:yellow'>Sy</span><span style='color:skyblue'>ne</span><span style='color:purple'>rg</span><span style='color:limegreen'>is</span><span style='color:orange'>m!</span> Here is where you start of course. The start is very simple, use coins to buy buildings and upgrades that produce even more coins! Keep doing it until you can do the next feature, you will know when you can see it. :)
    <i>Psst, check Patch Notes for promotional codes!</i>
    <img src="Pictures/icon.gif" style='padding-top:30px'>
    `
    const diamondText = `
    <img src="Pictures/Diamond.png">
    Congrats! You have <span style='color:skyblue'>Prestiged!</span>
    Prestiging for the first time unlocks the Diamond layer, which consists of Diamond buildings, Diamond upgrades, Automation upgrades (for your QoL needs), Generator upgrades (powerful), and last but not least<span style='color:skyblue'><b> RUNES</b></span>!
    <span style='color:skyblue'>Runes</span> will be talked about in a different section.
    The Diamond upgrades themselves are pretty decent, but a good amount of boost comes from the <span style='color:skyblue'>Diamond buildings!</span> Once bought,the first tier will make crystals which will boost coin production and every tier after will produce the tier before.
    The final item unlocked is a new "prestige" layer, <span style='color:skyblue'>accelerator boosts!</span> They will reset Diamond upgrades and your Diamonds (<b>NOT GENERATOR UPGRADES, AUTOMATION, or DIAMOND BUILDINGS</b>) in exchange for a boost to your accelerators. This can be useful to boost your progress if stuck.
    <img src="Pictures/Diamond.png">
    `
    const spiritText =
    `
    <img src="Pictures/Speed%20Spirit.png" style=padding-bottom:20px>
    \n<span style='color:yellow'> Spirits</span> essentially act the same way as<span style='color:skyblue'> Blessings</span>, with only 1 major change, the more<span style='color:red'> corruptions</span> you have, the<span style='color:lime'> stronger</span> they get!
    However, they are a lot more <span style='color:red'>expensive</span> than<span style='color:skyblue'> Blessings</span>, so you most likely won't be able to get any once you first unlock them. I recommend grinding a bit first before trying to grind Spirits.
    Speed Spirit and Duplication Spirit give you tons of value for them giving even more global speed and more <span style='color:gold'>Wow! Cubes</span>, which you need a lot of. Thrift Spirit also gives decent value, with it boosting<span style='color:steelblue'> obtanium</span>. Superior Intellect Spirit gives ok value when you first unlock Spirits, but quickly loses value. Finally, Prism Spirit has next to no value, so use the last of your<span style='color:yellow'> offerings</span> on it.
    `
    const blesAndTaliText = '\n'+`
    <img src="Pictures/Speed%20Blessing.png" style=padding-bottom:20px>
    <span style='color:skyblue'><b>Blessings</b></span> are well, a blessing to have! Each Blessing<span style='color:lime'> boosts an aspect of the game</span>, like all features of <span style='color:yellow'>Sy</span><span style='color:skyblue'>ne</span><span style='color:purple'>rg</span><span style='color:limegreen'>is</span><span style='color:orange'>m!</span>
    The more <span style='color:skyblue'>Blessing power</span> a Blessing has, the stronger it is! Blessing power is boosted by the <span style='color:skyblue'>Blessing level</span> itself,<span style='color:steelblue'> some researches</span> but also NON-FREE RUNE LEVELS!
    The rune level of a particular rune boosts that respective Blessing's power (speed rune boosts speed Blessing).
    Most value would probably be Speed Blessing and Prism Blessing as they both boost <span style='color:crimson'>ant sacrifice rewards</span>! Superior Intellect Blessing is also useful as it boosts<span style='color:crimson'> ant speed</span>, but the other 2 should be upgraded if you have extra offerings.
    One last thing, Blessings <b>DO NOT RESET ON THE NEXT RESET TIER</b>!\n
    <img src="Pictures/taxtalisman.png" style=padding-bottom:20px>
    <span style='color:yellow'><b>Talismans</b></span> give<span style='color:skyblue'> extra rune levels</span> basically to 3 runes. You gain different talismans from completing x25 of each reincarnation challenge, getting to 1e100 crumbs, and buying one of them from shop.
    There are 3 ways to change and/or buff talismans:

    <b>FORTIFY</b>: The simplest of all, use <span style='color:yellow'>talisman fragments and shards</span> (Either bought or gotten from sacrificing above certain elo) to boost the amount of bonus<span style='color:skyblue'> rune</span> levels the talisman gives.

    <b>ENHANCE</b>: Increase the max capacity of fortifies to a talisman, increase the base rune level per fortify, and increase the enhance bonus (example enhancing exemption reduces taxes by 10% each time).

    <b>RESPEC</b>: This is the one that gets literally almost everyone tripped up, so listen up! Remember how I said that talismans give free rune levels to 3 runes, using <b>respec</b> allows you to change those runes that they boost (with a small offering cost that is very negligible). Always make sure to use respec all, as it’s better to respec them all to the same 3 than to go in the middle and boost all separately. Also, make sure to respec them to the things you want to grind (use SI for grinding ants for example.)
    ${(player.challengecompletions[12] > 0 ? String(spiritText) : '\nReturn to this tab once more once you have beaten<b> challenge 12</b> for even more info on the rune tab!')}
    `
    const runeText = `
    <img src="Pictures/Transparent%20Pics/SpeedRune.png" style=padding-bottom:20px>
    By prestiging for the first time you also unlock <span style='color:skyblue'><b>Runes!</b></span> You gain <span style='color:gold'>Offerings</span> via how long you spend in some type of resets and are boosted via upgrades and other ways.
    When used on a rune, they get transfered into <span style='color:gold'>rune exp</span>, which with enough rune exp you can level a rune and gain <span style='color:lime'>powerful bonuses!</span> Check each specific rune for the details on the boosts they give!
    Runes are unlocked mostly via achievements so keep an eye out for new runes that can give different buffs (but more expensive...).
    Rune recycle chance is a chance to recycle an offering so it isn't used which gives a multi to rune exp! More rune exp, more fun!
    ${(player.achievements[134] > 0 ? String(blesAndTaliText) : '\nReturn to this tab once you have beaten<b> challenge 9</b> for more info on the rune tab!')}
    `





    const mythosText = `
    <img src="Pictures/Mythos.png">
    Welcome to another reset tier, <span style='color:blueviolet'>Transcension</span>! You reset all of your previous<span style='color:yellow'> coin</span> and <span style='color:skyblue'>diamond</span> stuff and turn them into<span style='color:blueviolet'> mythos</span> (and<span style='color:yellow'> offerings</span> for<span style='color:skyblue'> runes</span>) which can be used for<span style='color:blueviolet'> mythos buildings</span>, more generator upgrades, more automation, and<span style='color:blueviolet'> mythos upgrades</span>!
    By<span style='color:blueviolet'> transcending</span> for the first time you also unlock a new tab, <b>CHALLENGES</b>! They are explained in their own section.
    Not only are Mythos buildings are used to get<span style='color:blueviolet'> mythos shards</span> which are required for the next reset tier (<span style='color:lime'>Reincarnation</span>) but they also give<span style='color:blueivolet'> multiplier boosts</span> to help you get back up to speed! However, don't spend all of your mythos! Some mythos upgrades boost based on<b> unspent mythos</b>. Have fun! 
    <img src="Pictures/MythosShard.png">
    `
    const challenge15Text = `\n
    <img src="Pictures/Transparent%20Pics/ChallengeFifteen.png" style = 'padding-bottom:30px'>
    I know you are getting <span style='color:red'>tired</span> of reading about all of these challenges, I'm tired too, but this one is <b>really important</b>.
    Challenge 15 is a very <i>special</i> type of ascension challenge; it is made to be<span style='color:red'> impossible</span> to complete.
    However, the further you get in challenge 15, the more <span style='color:lime'>bonuses</span> you unlock and the <span style='color:lime'>stronger</span> those bonuses get!
    You can check the bonuses in the <b>"Challenge 15/Platonic Upgrades"</b> subtab of "<span style='color:gold'>Wow! Cubes</span>".
    <span style=font-size:30px><i>STRATEGY:</i></span>
    Think about this, at the beginning every<span style='color:lime'> reincarnation</span> done in c15 will grant you <b>1</b> obtainium, due to the <span style='color:red'>obtainium decrease </span>from corruptions, so <i>is there any way to gain obtainium fast in c15?</i>
    Remember, exiting and entering <span style='color:lime'>reincarnation challenges</span> does a <b>force-reincarnation</b> which grants you <b>1</b> obtanium. Maybe with the tools we have we can <span style='color:yellow'>enter</span> those challenges and <span style='color:yellow'>exit them very fast</span> to gain <span style='color:steelblue'> meaningful obtanium</span>? (<b>Timers set to 0 seconds will do them every frame!</b>)
    The main<span style='color:lime'> boost</span> in c15 is believe it or not<span style='color:skyblue'> crystals</span>, which means that <span style='color:skyblue'><b>PRISM</b></span>, the arguably worst rune, is one of the<span style='color:lime'> best</span> runes in c15, and that<span style='color:steelblue'> researches</span> that boost rune effectiveness or crystals are the only ones that are really gonna be able to do anything.

    There are some periods in c15 where you can gain<span style='color:yellow'> insane coin exponent</span> gains in a short amount of time. For the sake of brevity we will call them "<i>booms</i>". One boom will occur once you reach<span style='color:lime'> e40k particles</span> (far away but you will get there) where you immediatly jump to<span style='color:lime'><b> e200k particles</b></span>!!! Why? Platonic and others sure don't know.
    Another period of boom is when you can actually<span style='color:crimson'> ant sacrifice</span> in c15 to gain tons of <span style='color:steelblue'>obtanium</span> to buy researches and buy <span style='color:yellow'><b>TALISMAN FRAGS</b></span> to boost<span style='color:skyblue'> prism</span> even more!
    The last period of boom is when you <span style='color:lime'>complete c9</span> in c15, because then<span style='color:crimson'> saccing</span> will give you a lot more frags than buying them.
    You shouldn't grind ages for these booms, but it is nice to know if you are close to one to try to go for it.
    That's basically all you need to know about c15, in between your <span style='color:gold'>cube</span> grinds and other grinds it's a good idea to do c15 every once in a while to<span style='color:lime'> boost your gains</span>!
    `
    const AchallengeText = `
    <img src="Pictures/Transparent%20Pics/ChallengeEleven.png" style = 'padding-bottom:30px'>
    Finally, you have ascended and... oh god no<span style='color:orange'><b> ASCENSION CHALLENGES</b></span>!?!?!
    Welcome to the world of cliches (ascension challenges)!
    Unlike previous challenges, ascension challenges all have a<b> requirement of C10</b> (Challenge 10) completions.
    You <b>MUST</b> have a c10 completion in your current ascension before entering an ascension challenge to prevent getting<span style='color:gold'> cubes</span> without a c10 completion.
    Like <span style='color:lime'>reincarnation challenges</span>, each <span style='color:orange'>ascension challenge</span> completed unlocks the next.
    Ascension challenges are <span style='color:red'><b>titans</b></span>, grind a bit before attempting them!
    For example,<span style='color:orange'> challenge 11 </span>(Reduced<span style='color:crimson'> Ants</span>) should be attempted when you have about <span style='color:orange'>20k tributes and w2x2</span> (more building power) maxed.
    ${player.challengecompletions[14] >= 1 ? String(challenge15Text) : '\nReturn to this tab once you have beaten<b> challenge 14</b> for the first time for guess what, more of those damn challenges!'}
    
    `
    const RchallengeText = `
    <img src="Pictures/Transparent%20Pics/ChallengeSix.png" style = 'padding-bottom:30px'>
    You thought we were done with challenges?<span style='color:blueviolet'> Transcension</span> isn't the only reset tier with challenges!
    Welcome to the world of<span style='color:lime'><b> REINCARNATION CHALLENGES</b></span>, which are actually not that different from transcension challenges.
    First off, some reincarnation challenges' requirements are<span style='color:blueviolet'> mythos shards</span> instead of<span style='color:yellow'> coins</span>.
    Secondly, instead of doing a <span style='color:blueviolet'>transcension</span> upon entering one, you do a <span style='color:lime'>reincarnation</span>, should be self-explanatory.
    Also, you have to <b>redo</b> your transcend challenges in reincarnation challenges unless you have those specific researches which automatically get them for you, and you have to redo them when exiting as well, unless you have the<b> "Instant Challenge"</b> Shop upgrade (HIGHLY RECOMMEND!)
    Finally, you unlock more reincarnation challenges once you beat the previous one, the final one unlocks <span style='color:orange'>a new reset tier</span>!
    ${player.ascensionCount >= 1 ? String(AchallengeText) : '\nReturn to this tab once you have<b> done the next reset tier</b> for the first time for some more stuff!'}
    `
    const challengeText = `
    <img src="Pictures/Transparent%20Pics/ChallengeOne.png" style='padding-bottom:20px'>
    Welcome to the challenges section!
    <b>Challenges</b> make the game<span style='color:red'> harder</span> depending on which one you are in (currently you have 5, you will get more).
    Some <span style='color:red'>block</span> a feature (like no accelerators), and some<span style='color:orange'> reduce</span> a feature (like reduced diamonds).
    They also give<span style='color:green'> rewards</span> per completion and for first completion, so remember to do them often to get rewards! :)
    For more information, check the description of every individual challenge in the <b>challenge</b> tab.
    At the current moment, you generally can't get more than e6-7<span style='color:blueviolet'> mythos</span> without doing challenges, so don't be afraid to do them!
    For example, try out the first challenge (No Multipliers), you can do it<b> right after transcension</b>!
    ${player.unlocks.reincarnate ? String(RchallengeText) : '\nReturn to this tab once you have reincarnated for the first time for more challenges and info on them!'}
    `
    const particleText = `
    Damn you gotta be thinking how many reset tiers are left...
    Anyway, welcome to Reincarnation! Your previous progress can't reincarnate with you, but in exchange for them you gain particles, obtainium, and offerings!
    Obtainium is used for RESEARCH, talked about in their own section.
    Offerings are used for runes which you already know.
    Particles, like mythos and diamonds before it, are used for automation, particle buidlings, and particle upgrades! Note how you need to unlock particle upgrades first via automation
    `
    const associated = new Map<string, string>([
        ['helpCoin', coinText],
        ['helpDiamond', diamondText],
        ['helpRune', runeText],
        ['helpMythos', mythosText],
        ['helpChallenge', challengeText],
        ['helpParticle', particleText]
    ]);


    for (const e of Array.from(btn.parentElement!.children) as HTMLElement[]) {
        e.style.backgroundColor = (e.id !== btn.id ? '' : 'crimson');
    }
    DOMCacheGetOrSet('helpText').innerHTML = String(associated.get(btn.id))
}