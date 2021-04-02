const utils = require('../utils.js');

module.exports = 
{
	name: 'new_area_role', 
	aliases: ['new_map_channel', 'nm'], 
	description: 'Creates a role corresponding to a map channel', 
	usage: '<#channel-tag>', 
	examples: ["!nm #gardens"], 
	category: 'Map', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// Check tag validity
		let regex = /<#([0-9]*)>/;

		try
		{
			var channel_id = args[0].match(regex)[1];
			// console.log(message.guild.channels);
			var channel_obj = message.guild.channels.cache.get(channel_id);
			var channel_name = channel_obj.name;
		}
		catch (e)
		{

			throw `${args[0]} is not a proper channel tag!`
		}

		// Check that the channel isn't in guild map already
		try
		{
			var guild_map_ids = utils.fn.get_guild_map(message.guild.id).map((channel) => channel.ChannelID);
		}
		catch // case where there are no channels
		{
			var guild_map_ids = [];
		}

		if (guild_map_ids.includes(channel_id))
		{
			throw `${args[0]} is already in this server's map!`;
		}

		// Attempt to create a new role
		try
		{
			var new_role = await message.guild.createRole({name: channel_name,});
			await message.channel.send(`Created role for <#${channel_id}>`);

		}
		catch
		{
			throw `Could not create a role for <#${channel_id}>! Check bot perms`;
		}

		// Set the channel in the database
		utils.fn.add_channel_to_map(message.guild.id, channel_id, new_role.id);
		
		// Attempt to set channel perms for the role
		try
		{
			await channel_obj.overwritePermissions(new_role, {VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true});
			await message.channel.send(`Added view, send, and history perms to ${channel_name}\nUse \`!add_connection #${channel_name} <c1> [c2]...\` to add connections`);
		}
		catch
		{
			throw `Could not add ${channel_name} role to channel permission overrides!`
		}
	}
}