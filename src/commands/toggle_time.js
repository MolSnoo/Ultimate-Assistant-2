// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'toggle_time', 
	aliases: ['toggletime', 'toggle_announcements', 'toggleannouncements'], 
	description: 'Mute or unmute announcements', 
	usage: ' ', // keep as a space if none. Otherwise, the convention is <"req_arg"> ["opt_arg"], quotations if necessary
	category: 'Admin', 
	// args:
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let is_enabled = utils.fn.get_guild_entry(message.guild.id).Timeflow;
		let toggle = (parseInt(is_enabled)+1) % 2;

		utils.fn.update_guild_entry(message.guild.id, "Timeflow", toggle);

		if (toggle == 1)
		{
			return await message.channel.send("Announcements are now **running**");
		}
		else
		{
			return await message.channel.send("Announcements are now **muted**");
		}
	}
}