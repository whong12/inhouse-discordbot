const Draft = require('../utils/draftClass.js');
const {prefix, IHRole, adminRole} = require('../config.json');

module.exports.run = async (bot, message, args) => {
    //check mod permission
    if (message.member.roles.find(role => role.name === IHRole)) {
        //if user has IHRole, they must also be owner of the lobby in order to destroy it
        if(!Draft.getCurrentGame()) {
            return;
        }
        if (Draft.getCurrentGame().owner.id === message.author.id) {
            Draft.destroy();
            console.log(`${message.author.tag} Lobby destroyed`);
            return message.channel.send("Lobby destroyed.");
        } else {
            return message.reply("You must be the owner to destroy this lobby.");
        }
    } else if (message.member.roles.find(role => role.name === adminRole)) {
        //admin role can destroy any lobby
        Draft.destroy();
        console.log(`${message.author.tag} Lobby destroyed`);
        return message.channel.send("Lobby destroyed.");
    } else {
        return message.reply(`You must have ${IHRole} to use this command.`);
    }
}

module.exports.help = {
  name: "destroy"
}