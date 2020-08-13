const {IHRole, prefix} = require('../config.json');
const util = require('../utils/utils.js');
const InhouseUser = require('../models/usersdb.js');

module.exports.run = async (bot, message, args) => {
    //check mod permission
    if (!util.hasModRole(message)) {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }
    
    if (args.length < 3) {
        return message.reply(`Syntax: Type ${prefix}forceregister <@User#1234> <Summoner Name> <Rank>.`);
    }
    
    //parse the args and check if its a valid input
    var mention = args[0];
    const summonerName = args[1];
    let summonerRank = args[2].toLowerCase();

    if (!(mention.startsWith('<@') && mention.endsWith('>'))) {
        return message.reply(`Syntax: Invalid mention. Type ${prefix}forceregister <@User#1234> <Summoner Name> <Rank>.`);
    } 
    mention = mention.slice(2, -1);
    if (mention.startsWith('!')) {
        mention = mention.slice(1);
    }
    const user = bot.users.get(mention);
    
    if(summonerRank.length == 0) {
        return message.reply(`Syntax: Missing Rank! Type ${prefix}forceregister <@User#1234> <Summoner Name> <Rank>.`);
    }
    
    if(summonerName.length > 16) {
        return message.reply(`Error: Summoner character limit is 16 characters.`);
    }

    //check summoner rank
    if (!/^((i|b|s|g|p|d)(1|2|3|4))|((challenger)|(grandmaster)|(master))$/.test(summonerRank)) {
        return message.reply(`Error: ${summonerRank} is not a valid rank. Example: "g1" "master"`);
    }
    summonerRank = util.abbrToRank(summonerRank);

    //attempt to add user to database
    const newInhouseUser = new InhouseUser({
        username: user.username,
        tag: user.tag,
        id: user.id,
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
    }

    // Successful
    console.log(`${message.author.tag} registered ${user.tag} as ${summonerName}.`);
    return message.reply(`${message.author.tag} registered ${user.tag} as ${summonerName}.`);
}

module.exports.help = {
    name: "forceregister"
}