const Draft = require('../utils/draftClass.js');
const {IHRole} = require('../config.json');
const util = require('../utils/utils.js');

module.exports.run = async (bot, message, args) => {
    //check mod permission
    if (!util.hasModRole(message)) {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }

    //check if a game is already in draft phase
    if (Draft.getCurrentGame() != null) {
        return message.reply(`There is already a game in progress!`);
    }

    await new Draft(message.author);
    console.log(`${message.author.tag} created new lobby`);
    return message.reply("created new lobby");
}

module.exports.help = {
  name: "create"
}