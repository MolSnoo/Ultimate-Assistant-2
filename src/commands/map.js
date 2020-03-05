const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'map', 
	aliases: [], 
	description: 'See server map', 
	usage: ' ', 
	category: 'Map', 
	// args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let map_entries = utils.fn.get_guild_map(message.guild.id);
		let embeds = displays.fn.guild_map(map_entries, message.guild);

		for (embed of embeds)
		{
			await message.channel.send(embed);
		}
	}
}