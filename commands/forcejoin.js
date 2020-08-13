const {IHRole, prefix} = require('../config.json');
const util = require('../utils/utils.js');
const Draft = require('../utils/draftClass.js');

module.exports.run = async (bot, message, args) => {
    const currentGame = Draft.getCurrentGame();
    let IHUser;

    //check mod permission
    if (!util.hasModRole(message)) {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }

    //check if lobby exists
    if (!currentGame) {
        return message.reply(`Error: There is no ongoing lobby.`);
    }

    //must not be locked/draft phase started
    if (currentGame.locked) {
        return message.reply(`Error: Lobby is locked.`);
    }

    //parse mention
    mentions = message.mentions.users.array();
    if (mentions.length <= 0) {
        return message.reply(`Syntax: Invalid mention. Type ${prefix}forcejoin <@User#1234>.`);
    }

    for (user of mentions) {
        IHUser = await util.discUserToIHUser(user);

        //check if user has registered
        if (!IHUser) {
            return message.reply(`Error: ${user.tag} is not registered. Type ${prefix}register <Summoner Name> <Rank>.`);
        }

        //check if the user has already joined lobby
        if (await Draft.findPlayer(IHUser)) {
            return message.reply(`Error: ${IHUser.summoner} is already in this lobby.`);
        }

        //lobby must not be full
        if (currentGame.allPlayers.length >= 10) {
            return message.reply(`Error: Lobby is full.`);
        }

        await currentGame.allPlayers.push(IHUser.id);
        console.log(`${IHUser.tag} joined the lobby.`);
        message.reply(`${IHUser.tag} joined the lobby.`);
    }
}

module.exports.help = {
    name: "forcejoin"
}