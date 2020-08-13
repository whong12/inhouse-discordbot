const Draft = require('../utils/draftClass.js');
const {IHRole} = require('../config.json');
const util = require('../utils/utils.js');

module.exports.run = async (bot, message, args) => {
    //check mod permission
    if (!util.hasModRole(message)) {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }

    //check if lobby is full
    const currentGame = Draft.getCurrentGame();
    if (!currentGame) {
        return message.reply(`Error: There is no ongoing lobby.`);
    }
    
    //check if lobby has at least 2 players
    if(currentGame.allPlayers.length < 2) {
        return message.reply(`Error: Lobby must have at least 2 players`);
    }

    if(currentGame.allPlayers.length > 10) {
        return message.reply(`Error: Lobby has too many players.`);
    }

    await Draft.printShuffle(message);
}

module.exports.help = {
    name: "shuffle"
}