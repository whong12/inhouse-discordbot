const Draft = require('../utils/draftClass.js');

module.exports.run = async (bot, message, args) => {
    if(Draft.getCurrentGame()) {
        return await Draft.printGame(message);
    }
    return message.channel.send(`Error: There is no ongoing lobby.`);
}

module.exports.help = {
  name: "lobby"
}