const util = require('../utils/utils.js');
const Draft = require('../utils/draftClass.js');
const {prefix} = require('../config.json');

module.exports.run = async (bot, message, args) => {
    const currentGame = Draft.getCurrentGame();
    const IHUser = await util.discUserToIHUser(message.author);

    //check if the user has registered yet
    if (!IHUser) {
        return message.reply(`Error: Your account is not registered. Type ${prefix}register <Summoner Name> <Rank>.`);
    }

    //check if lobby exists
    if (!currentGame) {
        return message.reply(`Error: There is no ongoing lobby.`);
    }

    //check if the user has already joined lobby
    if (await Draft.findPlayer(IHUser)) {
        return message.reply("Error: You are already in this lobby.");
    }

    //lobby must not be full
    if (currentGame.allPlayers.length >= 10) {
        return message.reply(`Error: Lobby is full.`);
    }

    //must not be locked/draft phase started
    if (currentGame.locked) {
        return message.reply(`Error: Lobby is locked.`);
    }

    await currentGame.allPlayers.push(IHUser.id);
    console.log(`${IHUser.tag} joined the lobby.`);
    return message.reply(`${IHUser.tag} joined the lobby.`);
}

module.exports.help = {
  name: "join"
}