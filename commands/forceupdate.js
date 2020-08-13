const util = require('../utils/utils.js');
const InhouseUser = require('../models/usersdb.js');
const {IHRole, prefix} = require('../config.json');

module.exports.run = async (bot, message, args) => {
    //check mod permission
    if (!util.hasModRole(message)) {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }

    if(args.length < 3) {
		return message.reply(`Syntax: Type ${prefix}forceupdate <@User#1234> <Summoner Name> <Rank>`);
    }

    //parse the args and check if its a valid input
    var mention = args[0];
    const summonerName = args[1];
    let summonerRank = args[2].toLowerCase();

    if (!(mention.startsWith('<@') && mention.endsWith('>'))) {
        return message.reply(`Syntax: Invalid mention. Type ${prefix}forceupdate <@User#1234> <Summoner Name> <Rank>.`);
    } 
    mention = mention.slice(2, -1);
    if (mention.startsWith('!')) {
        mention = mention.slice(1);
    }
    const user = bot.users.get(mention);

    if(summonerRank.length == 0) {
        return message.reply(`Syntax: Missing Rank! Type ${prefix}forceupdate <@User#1234> <Summoner Name> <Rank>.`);
    }
    
    if(summonerName.length > 16) {
        return message.reply(`Error: Summoner character limit is 16 characters.`);
    }

    //check summoner rank
    if (!/^((i|b|s|g|p|d)(1|2|3|4))|((challenger)|(grandmaster)|(master))$/.test(summonerRank)) {
        return message.reply(`Error: ${summonerRank} is not a valid rank. Example: "g1" "master"`);
    }
    summonerRank = util.abbrToRank(summonerRank);

    //Check if user has registered for Inhouses
    let registered = true;
    await InhouseUser.findOne({id: user.id}, function (err, found) {
        if (err) console.error(err);
        if (!found) registered = false;
    });
    if(!registered) {
        return message.reply(`Error: ${user.tag} is not registered. Type ${prefix}forceregister <@User#1234> <Summoner Name> <Rank>.`)
    }

    //change the summoner and rank associated with the mentioned user
    try {
        await InhouseUser.updateOne(
            {   
                id: user.id
            },
            {
                $set: {
                    summoner: summonerName,
                    rank: summonerRank,
                    rankPoints: util.rankToPoints(summonerRank)
                }
            }
        );
    } catch(err) {
        console.error(err);
    }

    console.log(`${message.author.tag} updated ${user.tag} as ${summonerName}.`);
    return message.reply(`${message.author.tag} updated ${user.tag} as ${summonerName}.`);
}

module.exports.help = {
    name: "forceupdate"
}