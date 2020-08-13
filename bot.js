const fs = require("fs");
const cfg = require('./config.json');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const InhouseUsers = require('./models/usersdb.js');

/*
"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"
"C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
*/
mongoose.connect(process.env.MONGODB_URI_ATLAS || 'mongodb://localhost/InhouseUsers', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

//Reads all the commands
fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    //console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});

client.once('ready', () => {
	console.log('Ready!');
});

//Listen for user commands
client.on("message", async message => {
    if (!message.content.startsWith(cfg.prefix) || message.author.bot) return;
    
	let content = message.content.trim().split(" ");
	let command = content[0];
	let args = content.slice(1);

	//message.channel.send(`Message: ${message}\nArgs: ${args}\nAuthor: ${message.author.username} ${message.author.tag} ${message.author.id}`);
	if (command.startsWith(cfg.prefix)) {
		let commandfile = client.commands.get(command.slice(cfg.prefix.length));
		if (commandfile) {
			commandfile.run(client, message, args);
		}
	}

	if (command === `${cfg.prefix}robocroc`) {
		message.channel.send("https://www.youtube.com/watch?v=r3hTwsvJV_A");
	}
	
	if (command === `${cfg.prefix}umad`) {
		message.channel.send("https://www.youtube.com/watch?v=xzpndHtdl9A");
	}

	if(command === `${cfg.prefix}debugdb`) {
		InhouseUsers.find()
			.sort({ date: -1 })
			.then(items => console.log(items));
	}
	/*
	if(command === `${cfg.prefix}purgedb`) {
		InhouseUsers.deleteOne({}, function(err) { 
			InhouseUsers.find()
				.sort({ date: -1 })
				.then(items => console.log(items));
		});
	}*/
});
/*
client.on("error", info => {
    console.log('Error event:\n' + JSON.stringify(info))
    .then(() => client.destroy())
    .then(() => client.login(settings.token));
});
*/
client.login(process.env.CONFIG_TOKEN);