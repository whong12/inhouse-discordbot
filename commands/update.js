const util = require('../utils/utils.js');
const InhouseUser = require('../models/usersdb.js');
const {prefix} = require('../config.json');

module.exports.run = async (bot, message, args) => {
	if(args.length != 1) {
		return message.reply(`Syntax: Type ${prefix}update <Summoner Name>`);
    }

    //Check if user has registered for Inhouses
    let registered = true;
    await InhouseUser.findOne({id: message.author.id}, function (err, user) {
        if (err) console.error(err);
        if (!user) registered = false;
    });
    if(!registered) {
        return message.reply(`Error: Your account is not registered. Type ${prefix}register <Summoner Name> <Rank>`);
    }

    let summonerName = args[0].toString();
    if(summonerName.length > 16) {
        return message.reply(`Error: Summoner character limit is 16 characters.`);
    }

    //change the summoner name associated with the discord tag
    try {
        await InhouseUser.updateOne(
            {   
                id: message.author.id
            },
            {
                $set: {
                    summoner: summonerName
                }
            }
        );
    } catch(err) {
        console.error(err);
    }
    
    console.log(message.author.tag, "updated as", summonerName);
    return message.reply(`${message.author.tag} updated as ${summonerName}.`);
}

module.exports.help = {
    name: "update"
}