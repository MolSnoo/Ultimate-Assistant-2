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
		let prefix = args[0];
		utils.fn.update_guild_entry(message.guild.id, "Prefix", prefix);
		return message.channel.send(`Changed prefix to ${prefix}`);
	}
}