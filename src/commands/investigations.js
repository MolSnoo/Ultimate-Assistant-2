const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'investigations', 
	aliases: ['invlist'], 
	description: 'A list of the server\'s investigatable objects. Optionally tag a specific channel', 
	usage: '[#channel-tag]', 
	examples: ["!invlist #storage-room"], 
	category: 'Investigations', 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		if (args[0])
		{
			try
			{
				var channel_id = args[0].match(/<#([0-9]*)>/)[1];
			}
			catch 
			{
				throw `${args[0]} is not a proper channel tag!`;
			}

			// Get investigations for that channel only
			var guild_investigations = utils.fn.get_guild_investigations(message.guild.id).filter((entry) => entry.ChannelID == channel_id);
		}
		else
		{
			var guild_investigations = utils.fn.get_guild_investigations(message.guild.id);
		}

		let display = displays.fn.guild_investigations(guild_investigations, message.guild);
		console.log("here");

		for (embed of display.embeds)
		{
			await message.channel.send(embed);
		}
	}
}