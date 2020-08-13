node bot.js
Admin
    destroy
        Destroys any current lobby.
    *deleteaccount <@user#1234>
        Deletes the user's account.
Mod Commands
    forceregister <@User#1234> <Summoner Name> <Rank>
        Registers the mentioned user with the name and rank.
        Please do not put spaces in your summoner name.
    forceupdate <@User#1234> <Summoner Name> <Rank>
        Updates the mentioned user with a new summoner name and rank.
        Please do not put spaces in the summoner name.
	create
		Creates a new 5v5 lobby
	destroy
		Destroys the current lobby if you are the owner.
    forcejoin <@User#1234>
        Forces the mentioned user to join the current lobby.
    forceleave <@User#1234>
		Removes the user from the lobby
    begindraft <@captain#1> <@captain#2>
        Locks the lobby (disable join/leave) and begins drafting phase. 
        Must include two captains that are in the lobby.
        WARNING: This will reset the draft phase as well.
	shuffle
        Randomly generates two different teams.
    help mod
        Displays a list of mod commands
Regular Commands
	register <Summoner Name> <Rank>
		Registers the user's lol account into our server.
        Please do not put spaces in your summoner name.
        Example: !register hideonbush G3
	update <Summoner Name>
		Updates your account with a new summoner name.
        Please do not put spaces in your summoner name. 
	profile <@User#1234> (optional)
        Shows the profile of the mentioned user
		Shows the user's profile if no discord tag is entered
	lobby 
		Displays the current lobby
	join
		Joins the current lobby
	leave
		Leaves the current lobby
    displaydraft
        Displays the currently drafted teams, current draft captain, and a list of draftable players
    draft <Number>
        Drafts the summoner into the current lobby. Must be the current draft captain.
	help
		Display a list of the commands

		
https://github.com/Nedinator/rpg
https://github.com/c3duan/Swag-Bot/
https://github.com/KennethWangDotDev/discord-inhouse-league
https://discord.js.org/#/docs/main/stable/general/welcome
https://github.com/The-SourceCode/Discord.js-Bot-Development
https://discord.js.org/#/docs/main/stable/general/welcome

*custom prefix