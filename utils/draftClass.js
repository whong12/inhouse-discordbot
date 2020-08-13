const {backColor, emote, prefix} = require('../config.json');
const InhouseUser = require('../models/usersdb.js');
const Discord = require('discord.js');

const draftOrder = [0,1,1,0];
var currentGame = null;

module.exports = class Draft {
    constructor(ownUserObject) {
        this.owner = ownUserObject;
        this.allPlayers = [];

        //these vars are for drafting
        this.captains = [];
        this.remainingPlayers = [];
        this.teams = [[],[]];
        this.draftNumber = 0;
        this.locked = false;

        currentGame = this;
    }

    beginDraft(captainsArray) {
        this.captains = [captainsArray[0].id, captainsArray[1].id];
        this.remainingPlayers = this.allPlayers.slice(0).filter(id => !(id === captainsArray[0].id) && !(id === captainsArray[1].id));
        this.teams[0].push(captainsArray[0].id);
        this.teams[1].push(captainsArray[1].id);
        this.draftNumber = 0;
        this.locked = true;
    }
}

//https://stackoverflow.com/questions/1363341/algorithm-to-create-fair-evenly-matched-teams-based-on-player-rankings
/*
An approach that may work well for you (since you don't need an exact solution in practise) is simulated annealing, or continual improvement by random permutation:

1. Pick teams at random.
2. Get a score for this configuration (see above).
3. Randomly swap players between two or more teams.
4. Get a score for the new configuration. If it's better than the previous one, keep it and recurse to step 3. Otherwise discard the new configuration and try step 3 again.
5. When the score has not improved for some fixed number of iterations (experiment to find the knee of this curve), stop. It's likely that the configuration you have at this point will be close enough to the ideal. Run this algorithm a few times to gain confidence that you have not hit on some local optimum that is considerably worse than ideal.
*/
module.exports.printShuffle = async (message) => {
    const maxAttempts = 252;
    let attempt = 0;
    let config = [[],[]];
    let newConfig = [[],[]];
    let score = 0;
    let newScore = 0;

    var start = new Date().getTime();

    for (const playerid of currentGame.allPlayers) {
        let player = await InhouseUser.findOne({id: playerid});
        if (config[0].length == Math.ceil(currentGame.allPlayers.length/2)) {
            config[1].push(player);
        } else if (config[1].length == Math.ceil(currentGame.allPlayers.length/2)) {
            config[0].push(player);
        } else {
            config[Math.floor(Math.random() * 2)].push(player);
        }
    }
    score = Math.abs(sumPoints(config[0]) - sumPoints(config[1]));

    //console.log(playerlistToString(config[0]));
    //console.log("******");
    //console.log(playerlistToString(config[1]));

    while (attempt < maxAttempts) {
        let r1 = Math.floor(Math.random() * config[0].length);
        let r2 = Math.floor(Math.random() * config[1].length);
        newConfig = [config[0].slice(0), config[1].slice(0)];
        newConfig[0][r1] = config[1][r2];
        newConfig[1][r2] = config[0][r1];
        newScore = Math.abs(sumPoints(newConfig[0]) - sumPoints(newConfig[1]));
        if (newScore < score) {
            config = newConfig;
            attempt = 0;
            score = newScore;
            //console.log("score: ", score);
        }
        attempt += 1;
    }
    let astr = [];
    let bstr = [];
    for (const player of config[0]) {
        astr.push(`${player.rank} ${emote} ${player.summoner}`);
    }
    for (const player of config[1]) {
        bstr.push(`${player.rank} ${emote} ${player.summoner}`);
    }
    astr = astr.join("\n");
    bstr = bstr.join("\n");

    const emb = new Discord.RichEmbed()
        .setColor(backColor)
        .setAuthor(`Owner: ${currentGame.owner.tag} \nLobby locked (drafting): ${currentGame.locked}`)
        .setDescription(`Variance: ${score}`)
        .addField(`Team #1 score: ${sumPoints(config[0])}`, astr)
        .addField(`Team #2 score: ${sumPoints(config[1])}`, bstr);
    message.channel.send(emb);

    var end = new Date().getTime();
    var time = end - start;
    console.log(`Shuffle time: ${time}ms`);
}

//sum the points from an array of IHUsers
function sumPoints (config) {
    let sum = 0;
    for (const player of config) {
        sum += player.rankPoints;
    }
    return sum;
}
/*
//sort allplayers by rankPoints from lowest to highest 
function sortAllPlayers () {
    currentGame.allPlayers = currentGame.allPlayers.sort(function(a, b) {
        return a.rankPoints - b.rankPoints;
    });
}
*/
module.exports.findPlayer = async (IHUser) => {
    let player = null;
    for (const playerid of currentGame.allPlayers) {
        if (playerid === IHUser.id) {
            await InhouseUser.findOne({ id: playerid }, function (err, user) {
                if (err) console.error(err);
                if (user) {
                    player = user;
                }
            });
            return player;
        }
    }
    return player;
}

module.exports.getCurrentGame = () => {
    return currentGame;
}

module.exports.destroy = () => {
    currentGame = null;
}

async function playerlistToString (playerlist) {
    res = [];
    for (const playerid of playerlist) {
        let player = await InhouseUser.findOne({id: playerid});
        res.push(`${player.rank} ${emote} ${player.summoner}`);
    }
    if(res.length == 0) {
        return("No players!");
    }
    return res.join("\n");
}

//prints the current game's owner, draft type, and joined players
module.exports.printGame = async (message) => {    
    const emb = new Discord.RichEmbed()
        .setColor(backColor)
        .setAuthor(`Owner: ${currentGame.owner.tag} \nLobby locked (drafting): ${currentGame.locked}`)
        .setDescription(`\`${prefix}register\` then \`${prefix}join\` to join`)
        .addField(`${currentGame.allPlayers.length}/10 players`, await playerlistToString(currentGame.allPlayers));
    message.channel.send(emb);
}

module.exports.getCurrentDraftCaptainID = () => {
    return currentGame.captains[getCurrentDraft()];
}

//return the current team that is picking 0 = team A, 1 = Team B
function getCurrentDraft () {
    return draftOrder[currentGame.draftNumber % draftOrder.length];
}

module.exports.printDraft = async (message) => {
    let captain = await InhouseUser.findOne({ id: currentGame.captains[getCurrentDraft()] });
    let emb = new Discord.RichEmbed()
        .setColor(backColor)
        .setAuthor(`Owner: ${currentGame.owner.tag} \nLobby locked (drafting): ${currentGame.locked}`)
        .setTitle(`Current Draft Captain: ${captain.tag}`)
        .setDescription(`\`${prefix}draft <Number>\` to draft player`)
        .addField("Team #1", await playerlistToString(currentGame.teams[0]))
        .addField("Team #2", await playerlistToString(currentGame.teams[1]));
    let res = [];
    let inc = 1;
    if (currentGame.remainingPlayers.length == 0) {
        res = "No Players!";
    } else {
        for (const playerid of currentGame.remainingPlayers) {
            let player = await InhouseUser.findOne({id: playerid});
            res.push(`${inc++}: ${player.rank} ${emote} ${player.summoner}`);
        }
        res = res.join("\n");
    }
    emb = emb.addField("Remaining players", res);
    message.channel.send(emb);
}

module.exports.getDraftByNumber = async (draftNum) => {
    return await InhouseUser.findOne({
        id: currentGame.remainingPlayers[draftNum - 1]
    });
}

module.exports.draftPlayer = async (user) => {
    currentGame.teams[getCurrentDraft()].push(user.id);
    currentGame.draftNumber += 1;
    currentGame.remainingPlayers = currentGame.remainingPlayers.slice(0).filter(id => !(id === user.id));
}