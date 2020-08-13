const Discord = require('discord.js')
const {themeColor, prefix, IHRole, emote, emote2} = require('../config.json');

module.exports.run = async (bot, message, args) => {
    let exampleEmbed = new Discord.RichEmbed()
        .setColor(`${themeColor}`)
        .setTitle(`${emote} Inhouse bot ${emote}`)
        //.setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        .setDescription(`My prefix is ${prefix}`)
        .setAuthor(`${prefix}help mod to see mod commands`);
    if(args[0] === "mod") {
        exampleEmbed = exampleEmbed
        .addField(`${emote2}${emote} Mod Commands ${emote}${emote2}`,
            `:x:You must have ${IHRole} role to use these commands`)
        .addField(`forceregister <@User#1234> <Summoner Name> <Rank>`, 
            'Registers the mentioned user with the name and rank.'+
            '\nPlease do not put spaces in your summoner name.')
        .addField(`forceupdate <@User#1234> <Summoner Name> <Rank>`, 
            'Updates the mentioned user with a new summoner name and rank.'+
            '\nPlease do not put spaces in the summoner name.')
        .addField(`create`, 
            'Creates a new 5v5 lobby')
        .addField(`destroy`, 
            'Destroys the current lobby if you are the owner.')
        .addField(`forcejoin <@User#1234>`, 
            'Forces the mentioned user to join the current lobby.')
        .addField(`forceleave <@User#1234>`,
            'Removes the user from the lobby')
        .addField(`begindraft <@captain#1> <@captain#2>`,
            'Locks the lobby (disable join/leave) and begins drafting phase.'+
            '\nMust include two captains that are in the lobby.'+
            '\nWARNING: This will reset the draft phase as well.')
        .addField(`shuffle`,
            'Randomly generates two different teams.')
        .addField(`help mod`,
            'Displays a list of mod commands')
    } else {
        exampleEmbed = exampleEmbed
        .addField(`${emote} Regular Commands ${emote}`,
            ':white_check_mark: Anyone can use these commands')
        .addField(`register <Summoner Name> <Rank>`, 
            'Registers the user\'s lol account into the inhouse server.'+
            '\nPlease do not put spaces in your summoner name.'+
            '\nExample: !register hideonbush G4')
        .addField(`update <Summoner Name>`, 
            'Updates your account with a new summoner name.'+
            '\nPlease do not put spaces in your summoner name.')
        .addField(`	profile <@User#1234> (optional)`, 
            'Shows the profile of the mentioned user'+
            'Shows the user\'s profile if no discord tag is entered')
        .addField(`lobby`, 
            'Displays the current lobby')
        .addField(`join`, 
            'Joins the current lobby')
        .addField(`leave`, 
            'Leaves the current lobby')
        .addField(`displaydraft`, 
            'Displays the currently drafted teams, current draft captain, and a list of draftable players')
        .addField(`draft <Number>`, 
            'Drafts the summoner into the current lobby. Must be the current draft captain.')
        .addField(`help`, 
            'Display a list of the commands')

    }
    //message.channel.send(exampleEmbed);
    message.author.send(exampleEmbed)
    .catch(() => message.reply("Can't send DM to your user!"));
}

module.exports.help = {
  name: "help"
}