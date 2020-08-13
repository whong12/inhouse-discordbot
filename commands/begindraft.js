const {IHRole, prefix} = require('../config.json');
const Draft = require('../utils/draftClass.js');
const util = require('../utils/utils.js');

module.exports.run = async (bot, message, args) => {
    //check mod permission
    if (!util.hasModRole(message)) {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }

    //check if lobby exists
    const currentGame = Draft.getCurrentGame();
    if (!currentGame) {
        return message.reply(`Error: There is no ongoing lobby.`);
    }

    //check if lobby has at least 2 players
        if(currentGame.allPlayers.length < 2) {
        return message.reply(`Error: Lobby must have at least 2 players`);
    }
    if (currentGame.allPlayers.length > 10) {
        return message.reply(`Error: Lobby has too many players.`);
    }

    //check if there are two captains
    if (message.mentions.users.size != 2) {
        return message.reply(`Syntax: Type ${prefix}begindraft <@captain#1> <@captain#2>`);
    }

    //convert captains from Discord User to InhouseUsers
    var captainsArray = [];
    for (captain of message.mentions.users.array()) {
        const captainIHUser = await util.discUserToIHUser(captain);
        if(captainIHUser) {
            captainsArray.push(captainIHUser);
            //check if captains are in the lobby
            if (await !Draft.findPlayer(captainIHUser)) {
                return message.reply(`Error: ${captainIHUser.summoner} is not in this lobby.`);
            }
        } else {
            return message.reply(`Error: ${captain.tag}'s account is not registered. Type ${prefix}register <Summoner Name> <Rank>`);
        }
    }

    console.log(`${message.author.tag} begin draft`);
    await currentGame.beginDraft(captainsArray);
    Draft.printDraft(message);
}

module.exports.help = {
    name: "begindraft"
}