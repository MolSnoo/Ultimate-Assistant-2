var utils = require('./utils.js');
var Discord = require('discord.js');

exports.fn = 
{
	announcement_loop: async (bot) =>
	{
		var current_announcements = utils.fn.get_current_announcements();

		for (announcement of current_announcements)
		{
			// Send to guildID/channelID the message
			let channel = bot.channels.get(announcement.ChannelID);

			// Check for time pause in guild
			let guild_info = utils.fn.get_guild_entry(channel.guild.id);

			if (guild_info.Timeflow == 1)
			{
				try
				{
					await channel.send(announcement.Message);
				}
				catch (e)
				{
					// Channel cannot be sent to either because it's been deleted or doesn't have correct perms
				}
			}
		}

		// increment the announcements
		utils.fn.increment_current_announcements(current_announcements);
	}
}