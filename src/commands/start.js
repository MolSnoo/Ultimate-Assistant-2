// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'start', 
	aliases: [], 
	description: 'Assigns the start channel role to all players with characters', 
	usage: ' ', 
	category: 'Map', 
	// args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// get characters
		let player_ids = utils.fn.get_guild_chars(message.guild).map((char_entry) => char_entry.OwnerID);

		// get the starting channel role ID (check not null)
		let starting_channel_role_id = utils.fn.get_guild_entry(message.guild.id).EntryChannelRoleID;

		if (!starting_channel_role_id)
		{
			throw `No starting channel set for ${message.guild}! Add one with \`!ssp #channel-tag\``;
		}

		// Get role obj
		// var role_obj = message.guild.roles.find((role) => role.id == starting_channel_role_id);

		// if (!role_obj)
		// {
		// 	throw `Something went wrong! Did you delete the role associated with your starting channel?`;
		// }

		// Assign to all players if possible
		let player_names = [];
		console.log(player_ids);
		for (player_id of player_ids)
		{
			// const guild_members = await message.guild.fetchMembers();

			// player_obj = guild_members.find((member) => member.id == player_id);
			player_obj = await message.guild.fetchMember(player_id);

			try
			{
				console.log("Adding role");
				player_obj.addRole(starting_channel_role_id).then(player_names.push(player_obj.user.username)).catch(console.error);
			}
			catch (e)
			{
				console.log(e);
				await message.channel.send(`Could not assign role to ${player_obj.username}! Check bot permissions and membership of that user`);
				continue;
			}

			// Add name for printing
			// player_names.push(player_obj.user.username);
		}

		return await message.channel.send(`Assigned starting role to ${player_names.join(", ")}`);

	}
}