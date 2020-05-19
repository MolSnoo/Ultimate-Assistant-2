// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'prefix', 
	aliases: [], 
	description: 'Set a new prefix', 
	usage: '<prefix>', 
	examples: ["!prefix ?"], 
	category: 'Admin', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		const regex = /^[0-9A-Za-z]+$|^[(>]+|.*[*~_]+.*/;

		let prefix = args[0];

		// Prefix cannot match the regex
		if (prefix.match(regex) != null)
		{
			return message.channel.send("That is not an allowed prefix! Be sure that it does not contain a discord markup character such as `*~_>` and has at least one punctuation mark in it");
		}
		utils.fn.update_guild_entry(message.guild.id, "Prefix", prefix);
		return message.channel.send(`Changed prefix to ${prefix}`);
	}
}