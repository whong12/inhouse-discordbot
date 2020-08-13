const Draft = require('../utils/draftClass.js');

module.exports.run = async (bot, message, args) => {
    const currentGame = Draft.getCurrentGame();

    //check if lobby exists
    if (!currentGame) {
        return message.reply(`Error: There is no ongoing lobby.`);
    }

    //check that lobby is locked/draft phase started
    if (!currentGame.locked) {
        return message.reply(`Error: Draft phase not started yet.`);
    }

    await Draft.printDraft(message); 
}

module.exports.help = {
    name: "displaydraft"
}