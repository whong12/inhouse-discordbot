const Discord = require('discord.js')
const {IHRole, adminRole, emote, themeColor} = require('../config.json');
const InhouseUser = require('../models/usersdb.js');

module.exports.discUserToIHUser = async (discordUser) => {
    let IHUser = null;
    await InhouseUser.findOne({id: discordUser.id}, function (err, user) {
        if (err) console.error(err);
        if (user) {
            IHUser = user;
        }
    });
    return IHUser;
}

module.exports.hasModRole = (message) => {
    if ((message.member.roles.find(role => role.name === IHRole) ||
        message.member.roles.find(role => role.name === adminRole))) {
        return true;
    }
    return false;
}

module.exports.printUser = (message, avatarURL, IHUser, summonerName) => {
    const emb = new Discord.RichEmbed()
        .setColor(`${themeColor}`)
        .setAuthor(`${IHUser.tag}: ${IHUser.rank}`, avatarURL)  
        .setTitle(`${emote} op.gg: ${summonerName} ${emote}`)
        .setURL(`https://na.op.gg/summoner/userName=${summonerName}`)
    message.channel.send(emb);
}

module.exports.abbrToRank = (rank) => {
    if (rank === "challenger" || rank === "grandmaster" || rank === "master") {
        return rank;
    }
    
    let league = rank[0];
    let division = rank[1];
    if (league === "i") {
        league = "iron";
    } else if (league === "b") {
        league = "bronze";
    } else if (league === "s") {
        league = "silver";
    } else if (league === "g") {
        league = "gold";
    } else if (league === "p") {
        league = "platinum";
    } else if (league === "d") {
        league = "diamond";
    }

    return league + " " + division;
}

//this function should only be called on valid ranks. no error handling.
module.exports.rankToPoints = (rank) => {
    let points;
    if (rank === "challenger") {
        points = 30;
    } else if (rank === "grandmaster") {
        points = 29;
    } else if (rank === "master") {
        points = 28;
    }

    //split the other ranks to make this function easier to read
    let rankLeague = rank.split(" ")[0];
    let rankDivision = parseInt(rank.split(" ")[1]);
    if (rankLeague === "iron") {
        points = 8 - rankDivision;
    } else if (rankLeague === "bronze") {
        points = 12 - rankDivision;
    } else if (rankLeague === "silver") {
        points = 16 - rankDivision;
    } else if (rankLeague === "gold") {
        points = 20 - rankDivision;
    } else if (rankLeague === "platinum") {
        points = 24 - rankDivision;
    } else if (rankLeague === "diamond") {
        points = 28 - rankDivision;
    }
    
    return points;
}