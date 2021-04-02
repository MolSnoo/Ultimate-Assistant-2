// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'remove_map_channels', 
	aliases: ['rmc'], 
	description: 'Remove channels from server map', 
	usage: '<#channel-tag> [#channel-tag2]...', 
	examples: ["!rmc #lobby", "!rmc #lobby #hallway-1"], 
	category: 'Map', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let regex = /<#([0-9]*)>/;

		let guild_map = utils.fn.get_guild_map(message.guild.id);

		var valid_args = [];
		// parse args into ids
		for (arg of args)
		{
			// Match regex
			try
			{
				var channel_id = arg.match(regex)[1];
			}
			catch
			{
				await message.channel.send(`${arg} is not a valid channel tag!`);
				continue;
			}

			// Remove from map 
			try
			{
				utils.fn.remove_channel_from_map(channel_id);

				// Try to remove the role
				let role_id = guild_map.find((entry) => entry.ChannelID == channel_id).RoleID;

				let role_obj = message.guild.roles.cache.find((role) => role.id == role_id);

				try
				{
					role_obj.delete();
					await message.channel.send(`Deleted role for ${arg}`);
				}
				catch
				{
					await message.channel.send(`Could not delete role associated with ${arg}`);
				}

				valid_args.push(arg);
			}
			catch
			{
				await message.channel.send(`${arg} is not in this server's Map!`);
			}
		}

		if (valid_args != [])
		{
			return await message.channel.send(`Removed ${valid_args.join(", ")} from map`);
		}
	}
}