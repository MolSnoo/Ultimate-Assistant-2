// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'nicknames', 
	aliases: [], 
	description: 'List nicknames for the server', 
	usage: ' ', 
	category: 'Characters', 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let chars = utils.fn.get_guild_chars(message.guild);

		var embed = displays.fn.all_guild_chars(chars, message.guild);

		return await message.channel.send(embed);
	}
}