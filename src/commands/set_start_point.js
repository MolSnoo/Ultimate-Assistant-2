// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'set_start_point', 
	aliases: ['ssp'], 
	description: 'Set the start/entry channel for map', 
	usage: '<#channel-tag>', 
	examples: ["!ssp #lobby"], 
	category: 'Map', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let regex = /<#([0-9]*)>/;

		try
		{
			var start_channel_id = args[0].match(regex)[1];
		}
		catch
		{
			throw `${args[0]} is not a proper channel tag!`;
		}

		// Check that the channel is in the map
		let guild_map = utils.fn.get_guild_map(message.guild.id);
		// let guild_map_ids = guild_map.map((channel_entry) => channel_entry.ChannelID);

		// if (!guild_map_ids.includes(start_channel_id))
		// {
		// 	throw `${args[0]} is not in your map! Add it with \`!nm\` ${args[0]}`;
		// }

		try
		{
			var start_channel_role_id = guild_map.find((channel_entry) => channel_entry.ChannelID == start_channel_id).RoleID;
		}
		catch
		{
			throw `${args[0]} is not in your map! Add it with \`!nm\` ${args[0]}`;
		}

		// Update the guild entry
		utils.fn.update_guild_entry(message.guild.id, "EntryChannelRoleID", start_channel_role_id);

		return await message.channel.send(`Set ${args[0]} as entry point. Assign the role to everyone with \`!start\``);
	}
}