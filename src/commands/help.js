// FINISHED
const Discord = require('discord.js');
const utils = require('../utils.js');
module.exports = 
{
	name: 'help',
	aliases: [], 
	description: 'Shows this list', 
	usage: '[command name]', 
	category: 'Misc', 
	execute: async (message, args) =>
	{
		// get guild prefix
		let prefix = utils.fn.get_guild_entry(message.guild.id).Prefix;

		const data = [];
		const {commands} = message.client;

		var categories = Array.from(new Set(commands.map(command => command.category))).sort();
		categories = categories.filter((cat) => cat != "Dev");

		var embed = new Discord.RichEmbed();

		if (args.length && !categories.includes(args[0]))
		{
			// Single command
			const command = commands.get(args[0].toLowerCase()) || commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));

			if (!command || command.devOnly)
			{
				return await message.channel.send("That is not a command!");
			}
			embed.setTitle(`${command.name} ${command.usage}`.slice(0, 250))

			if (command.adminOnly) embed.setDescription("Admin only");

			if (command.aliases.length > 0) embed.addField("Aliases", command.aliases.join(", "));
			if (command.description) embed.addField("Description", command.description);
			if (command.examples) embed.addField("Ex:", command.examples.join("\n"));
			if (command.cooldown) embed.addField("Cooldown", command.cooldown);

		}
		else if (args.length && categories.includes(args.join(" ")))
		{
			// Category
			let command_list = commands.filter(command => command.category == args.join(" "));

			embed.setTitle(`${args.join(" ")}`);

			let desc = [];
			desc.push(command_list.map(command => `**${prefix}${command.name}**: ${command.description}`).join("\n"));
			
			embed.setDescription(desc);
		}
		else
		{
			// All
			embed.setTitle("Commands");
			embed.setDescription(`Type \`${prefix}help <command-name>\` to see aliases, arguments, and examples. Type \`${prefix}help Category\` to see just one category. Send feedback with \`${prefix}feedback <message>\`. For more info and documentation links, use \`!info\``);
			for (category of categories)
			{
				let command_list = commands.filter(command => command.category == category);

				let desc = []
				desc.push(command_list.map(command => `**${prefix}${command.name}**: ${command.description}`).join("\n"));

				if (desc[0].length > 1024) // Remove last few charactesr and replace with "... Use help Category for more"
				{
					desc[0] = desc[0].slice(0, 975) + `\n... Use \`${prefix}help ${category}\` for more`;
				}
				
				embed.addField(category, desc);
			}
		}

		return await message.channel.send(embed);
		
		// return await message.channel.send(data, {split: true});
	}
}