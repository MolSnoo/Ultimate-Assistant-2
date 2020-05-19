// Invite link: 
// https://discordapp.com/oauth2/authorize?client_id=584432118118219778&scope=bot

var utils = require('./utils.js');

const fs = require('fs');
const Discord = require('discord.js');
const cron = require('node-cron');
const announcement_loop = require('./announcement_loop.js');

// Discord config
const {default_prefix, token, devID} = require("./discord-config.json")

// Make bot and get command names
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Get commands
for (const file of commandFiles)
{
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}
console.log("Loaded commands")

// Make prefix map
const prefix_map = new Map();
for (entry of utils.fn.get_guild_prefixes())
{
	prefix_map.set(entry.GuildID, entry.Prefix);
}

console.log("Prefixes mapped");

// Deal with passed announcements
utils.fn.handle_passed_announcements();
console.log("Handled passed announcements");

bot.once('ready', () => 
{
	// Add/remove any guilds that the bot joined while offline
	let bot_guilds = bot.guilds.map((guild) => guild.id);
	let db_guilds = utils.fn.all_bot_guilds().map((entry) => entry.GuildID);

	let new_guilds = bot_guilds.filter((id) => !db_guilds.includes(id));
	let removed_guilds = db_guilds.filter((id) => !bot_guilds.includes(id));
	for (id of new_guilds)
	{
		utils.fn.add_guild(id);
	}
	for (id of removed_guilds)
	{
		utils.fn.rem_guild(id);
	}

	console.log(`Added ${new_guilds.join(", ")} to db`);
	console.log(`Removed ${removed_guilds.join(", ")} from db`);

	// start the announcement loop
	cron.schedule("*/30 * * * *", () => announcement_loop.fn.announcement_loop(bot));
	console.log("Started announcement cron job")

	console.log('Bot ready!');
});

// Command handler (on_message)
bot.on('message', async message =>
{
	// set guild prefix with Map
	try
	{
		var prefix = prefix_map.get(message.guild.id);
	}
	catch
	{
		var prefix = "!";
	}

	// Don't reply to bots and check for prefix.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Parse for command name and args
	// const args = message.content.slice(prefix.length).match(/[^\s"']+|"([^"]*)"|'([^']*)'/g).map(element => element.replace(/^[\"']|[\"']$/g, ""));

	const args_str = message.content.slice(prefix.length).match(/\w+/);

	const commandName = args_str.shift().toLowerCase();

	var args = args_str.input.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
	args = args.slice(1).map(e => e.replace(/^[\"']|[\"']$/g, ""));

	// Check if it's a command name or alias
	const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases.includes(commandName));

	// If it's not a command, exit
	if (!command) return;

	// Check if guild only
	if (command.guildOnly && message.channel.type !== 'text')
	{
		try
		{
			return await message.reply("This command cannot be used in DMs!");
		}
		catch
		{
			console.log("Here-GuildOnly");
			return;
		}
	}

	// Dev check
	if (command.devOnly && message.author.id != devID)
	{
		try
			{
				return await message.channel.send("You do not have permission to use this command!");
			}
			catch
			{
				console.log("Here-Dev");
				return;
			}
	}

	// Admin check
	if (command.adminOnly && !message.member.hasPermission(['ADMINISTRATOR']))
	{
		let author_roles = message.member.roles;
		author_roles = author_roles.map(role => role.id)
		let mod_roles = utils.fn.get_mod_roles(message.guild.id);
		let intersection = author_roles.filter(role => mod_roles.includes(role));

		if (intersection.length == 0)
		{
			try
			{
				return await message.channel.send("You do not have permission to use this command!");
			}
			catch
			{
				console.log("Here-Admin");
				return;
			}
		}
	}

	// Check for required args
	if (command.args && args.length < command.args)
	{
		let reply = `You didn't provide enough arguments!`;

		if (command.usage)
		{
			reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``
		}

		try
		{
			return await message.channel.send(reply);
		}
		catch
		{
			console.log("Here-Args");
			return;
		}
	}

	// cooldown TODO

	// If it's the prefix command, add it to the map
	// Not the most efficient way of checking but it works
	if (command.name == 'prefix')
	{
		let regex = /^[0-9A-Za-z]+$|^[(>]+|.*[*~_]+.*/;
		if (args[0].match(regex) == null)
		{
			prefix_map.set(message.guild.id, args[0]);
		}
	}

	try
	{
		// If it's the info command, pass the bot as an arg
		if (command.reqBot)
		{
			await  command.execute(message, args, bot);
		}
		else
		{
			await command.execute(message, args);
		}
	}
	catch (error)
	{
		// console.log("Here-Execute");
		// console.log(error);
		try
		{
			await message.channel.send(error);
		}
		catch
		{
			// console.log("ExecuteMessageError");
			// console.log(`${error.name}: ${error.message}`);
			// console.log(error);

			// DM Developer
			try
			{
				let error_msg = "";
				error_msg += `**GuildID**: ${message.guild.id}\n`;
				error_msg += `**ChannelID**: ${message.channel.id}\n`;
				error_msg += `**UserID**: ${message.author.id}\n`;
				error_msg += `**Message**: ${message.content}\n`;
				error_msg += `**Error**: ${error.name}: ${error.message}\n`;
				error_msg += `${error}`;
				let owner = bot.fetchUser(devID)
				.then ((owner) =>
				{
					owner.send(`${error_msg}\n--------------------------------------------`.slice(0, 1900));
				});
			}
			catch (e)
			{}
		}
	}
});

// Register guild
bot.on('guildCreate', async guild =>
{
	utils.fn.add_guild(guild.id);

	// Add default prefix to map	
	prefix_map.set(guild.id, "!");

	// DM developer
	try
	{
		let owner = bot.fetchUser(devID)
		.then ((owner) =>
		{
			owner.send(`Added to **${guild}**\n--------------------------------------------`)
		});
	}
	catch (e)
	{
		console.log("HERE-guildCreate");
		// Nothing
		console.log(e);
	}
});

// On guild remove. Remove the announcements and guild entry and leave the rest
bot.on('guildDelete', async guild =>
{
	// Remove announcements
	utils.fn.remove_all_guild_announcements(guild.id);

	// Remove guild entry
	utils.fn.rem_guild(guild.id);
	

	// DM developer
	try
	{
		let owner = bot.fetchUser(devID)
		.then ((owner) =>
		{
			owner.send(`Removed from **${guild}**\n--------------------------------------------`)
		});
	}
	catch (e)
	{
		// Nothing
		console.log(e);
	}
});

// Autorole handler
bot.on('guildMemberAdd', async member =>
{
	let auto_role = utils.fn.get_guild_entry(member.guild.id).AutoRole;
	if (auto_role)
	{
		try
		{
			await member.addRole(auto_role);
		}
		catch 
		{
			//missing perms or role is too high
		}
	}
});

// On channel delete, remove from guild map (role is gonna sit there)
bot.on('channelDelete', async channel => 
{
	try
	{
		utils.fn.remove_channel_from_map(channel.id);
	}
	catch {}
});

// On role delete, remove from map. Also check the autorole
bot.on('roleDelete', async role =>
{
	let guild_entry = utils.fn.get_guild_entry(role.guild.id);

	if (guild_entry.AutoRole == role.id)
	{
		utils.fn.update_guild_entry(role.guild.id, "AutoRole", null);
	}

	if (guild_entry.EntryChannelRoleID == role.id)
	{
		utils.fn.update_guild_entry(role.guild.id, "EntryChannelRoleID", null);
	}

	// Remove from map
	try
	{
		utils.fn.remove_map_channel_by_role(role.id);
	}
	catch {}

});

bot.login(token);

process.on('SIGINT', () =>
	{
		utils.fn.close_db();
		console.log("Database connection closed")
		process.exit();
	}
);

