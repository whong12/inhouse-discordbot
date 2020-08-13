const util = require('../utils/utils.js');
const InhouseUser = require('../models/usersdb.js');
const {prefix} = require('../config.json');

module.exports.run = async (bot, message, args) => {
    if(args.length < 0) {
		return message.reply(`Unknown error: unable to get profile.`);
    }
/*
    //if roles are mentioned, warn syntax
    //console.log(message.mentions.roles.size, message.mentions.channels.size, message.mentions.everyone);
    if(message.mentions.roles.size > 0 || 
        message.mentions.channels.size > 0 || 
        message.mentions.everyone) {
        return message.reply(`Syntax: did NOT get profile. Type: !profile <@DiscordTag#1234>.`);
    }
*/

    let IHUser;
    //find by user mentions
    if (args.length > 0) {
        if (message.mentions.users.size > 0) {
            for (const mention of message.mentions.users.array()) {
                IHUser = await util.discUserToIHUser(mention);
                if (IHUser) {
                    util.printUser(message, mention.displayAvatarURL, IHUser, IHUser.summoner);
                } else {
                    message.reply(`${mention.tag} has not registered in this server.`);
                }
            }
            return;
        } else {
            return message.reply(`Syntax: did NOT get profile. Type: ${prefix}profile <@DiscordTag#1234>.`);
        }
    }

    //find by message author if there are no mentions
    if(args.length == 0) {
        IHUser = await util.discUserToIHUser(message.author);
        if (IHUser) {
            return util.printUser(message, message.author.displayAvatarURL, IHUser, IHUser.summoner);
        } else {
            return message.reply(`Error: Your account is not registered. Type ${prefix}register <Summoner Name> <Rank>`);
        }
    }
}

module.exports.help = {
  name: "profile"
}