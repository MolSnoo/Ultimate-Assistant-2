// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'gacha_list', 
	aliases: ['gachalist'], 
	description: 'See your gacha items', 
	usage: ' ', 
	category: 'Gacha', 
	// args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let guild_gacha = utils.fn.get_guild_gacha(message.guild.id);

		let embeds = displays.fn.guild_gacha(guild_gacha, message.guild);

		for (embed of embeds)
		{
			await message.channel.send(embed);
		}
	}
}