const util = require('../utils/utils.js');
const InhouseUser = require('../models/usersdb.js');
const {prefix} = require('../config.json');

module.exports.run = async (bot, message, args) => {
	if (args.length < 2) {
        return message.reply(`Syntax: Type ${prefix}register <Summoner Name> <Rank>. Example: ${prefix}register hideonbush G3`);
	}

    //Check if the args are formatted correctly
    const summonerName = args[0].toString();
    let summonerRank = args[1].toLowerCase();

    if(summonerRank.length == 0) {
        return message.reply(`Syntax: Missing Rank! Type ${prefix}register <Summoner Name> <Rank>. Example: ${prefix}register hideonbush G3`);
    }
    
    if(summonerName.length > 16) {
        return message.reply(`Error: Summoner character limit is 16 characters.`);
    }
    
    //check summoner rank
    if (!/^((i|b|s|g|p|d)(1|2|3|4))|((challenger)|(grandmaster)|(master))$/.test(summonerRank)) {
        return message.reply(`Error: ${summonerRank} is not a valid rank. Example: "g1" "master"`);
    }
    summonerRank = util.abbrToRank(summonerRank);
/*
/^(((iron)|(bronze)|(silver)|(gold)|(platinum)|(diamond)) (1|2|3|4))|((challenger)|(grandmaster)|(master))$/
*/
    const newInhouseUser = new InhouseUser({
        username: message.author.username,
        tag: message.author.tag,
        id: message.author.id,
        summoner: summonerName,
        rank: summonerRank,
        rankPoints: util.rankToPoints(summonerRank)
    });

    try {
        await newInhouseUser.save();
    } catch(err) {
        console.log(err.message.toString());
        if ( err.code == 11000 ) {
            console.log(err.code);
            return message.reply(`Error: User has already been registered.`);
        }
        return message.reply("Error: Unable to register");

        /*
        let errStr = err.message.toString();
        if (errStr.includes('Field name = username')) {
            return message.channel.send(`Error: User ${message.author.username} has already been registered.`);
            return message.channel.send(`Error: Discord Tag ${message.author.tag} has already been registered.`);
            return message.channel.send(`Error: Discord ID ${message.author.id} has already been registered.`);
            return message.channel.send(`Error: ${summonerName} has already been registered.`);
        */
    }

    // Successful
    console.log(`${message.author.tag} registered as ${summonerName}.`);
    return message.reply(`${message.author.tag} registered as ${summonerName}.`);
}

module.exports.help = {
  name: "register"
}