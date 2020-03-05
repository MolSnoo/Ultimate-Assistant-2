// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'announcements', 
	aliases: ['list_announcements', 'queue', 'la'], 
	description: 'See your announcements in order of posting', 
	usage: ' ', 
	category: 'Announcements', 
	// args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let guild_entry = utils.fn.get_guild_entry(message.guild.id);
		let guild_announcements = utils.fn.get_guild_announcements(message.guild.id);

		let embed = displays.fn.announcements(guild_announcements, guild_entry, message.guild);

		return await message.channel.send(embed);
	}
}
