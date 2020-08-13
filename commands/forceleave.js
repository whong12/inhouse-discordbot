const util = require('../utils/utils.js');
const Draft = require('../utils/draftClass.js');
const {IHRole, prefix} = require('../config.json');

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

    //parse the mention
    mentions = message.mentions.users.array();
    if (mentions.length <= 0) {
        return message.reply(`Syntax: Invalid mention. Type ${prefix}forceleave <@User#1234>.`);
    }

    for (user of mentions) {
        //check if user has registered
        IHUser = await util.discUserToIHUser(user);
        if (!IHUser) {
            return message.reply(`Error: ${user.tag} is not registered. Type ${prefix}register <Summoner Name> <Rank>.`);
        }

        //check if the user has already joined lobby
        if (await !Draft.findPlayer(IHUser)) {
            return message.reply(`Error: ${IHUser.summoner} are not in this lobby.`);
        }

        currentGame.allPlayers = await currentGame.allPlayers.filter(id => !(id === IHUser.id));
        console.log(`${IHUser.tag} left the lobby.`);
        message.reply(`${IHUser.tag} left the lobby.`);
    }
}

module.exports.help = {
  name: "forceleave"
}