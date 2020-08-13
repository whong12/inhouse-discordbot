const {prefix} = require('../config.json');
const util = require('../utils/utils.js');
const Draft = require('../utils/draftClass.js');
const InhouseUser = require('../models/usersdb.js');

module.exports.run = async (bot, message, args) => {
    const currentGame = Draft.getCurrentGame();
    let draftNum = args[0];
    let IHUser = null;

    //check syntax
    if (args.length != 1) {
        return message.reply(`Syntax: Type ${prefix}draft <Number>`);
    }

    //check if lobby exists
    if (!currentGame) {
        return message.reply(`Error: There is no ongoing lobby.`);
    }

    //check that lobby is locked/draft phase started
    if (!currentGame.locked) {
        return message.reply(`Error: Draft phase not started yet.`);
    }

    //check if the input is a single digit (1-8)
    if (!/^[12345678]$/.test(draftNum)) {
        return message.reply(`Error: Invalid draft number.`);
    }

    //try to get the IHUser based on draft #
    IHUser = await Draft.getDraftByNumber(parseInt(draftNum));
    if(!IHUser) {
        return message.reply(`Error: Invalid draft number.`);
    }

    //check if author is the current draft captain
    if (!(message.author.id === Draft.getCurrentDraftCaptainID())) {
        return message.reply(`Error: You are not the current draft captain.`);
    }

    await Draft.draftPlayer(IHUser);
    await Draft.printDraft(message);
    console.log(`${IHUser.tag} drafted`);
    //message.reply(`${IHUser.tag} drafted, next draft is ${Draft.getCurrentDraftCaptain().tag}`);
}

module.exports.help = {
    name: "draft"
}