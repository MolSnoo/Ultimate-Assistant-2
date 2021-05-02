// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'add_connection', 
	aliases: ['addconnection', 'ac'], 
	description: 'Add connections from a channel to another (provide an argument \'-s\' to make one-way connection(s) from source to destination. Roles are automatically created for connections that have not been added', 
	usage: '[-s] <#channel-tag> <#connection-tag> [#connection2-tag]...', 
	examples: ["!ac #home-base #kitchen", "!ac -s #lobby #trap-room1 #trap-room2"], 
	category: 'Map', 
	args: 2, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// Check if one way or not
		if (args[0].toLowerCase() == "-s")
		{
			var i = 1;
			var is_one_way = true;
		}
		else
		{
			var i = 0;
			var is_one_way = false;
		}

		// Check tag validity
		let regex = /<#([0-9]*)>/;

		// Get source channel
		try
		{
			var source_channel_id = args[i].match(regex)[1];
		}
		catch
		{
			throw `${args[i]} is not a proper channel tag!`;
		}

		var guild_map = utils.fn.get_guild_map(message.guild.id); // returns error if there is none (no connections can be made)
		var guild_map_ids = guild_map.map((channel_entry) => channel_entry.ChannelID);

		if (!guild_map_ids.includes(source_channel_id))
		{
			throw `<#${source_channel_id}> is not in your map. Add it with \`!nm\` <#${source_channel_id}>`;
		}

		let outgoing_channels = args.slice(i+1);
		var outgoing_channel_ids = [];
		
		// Get the ids that are valid
		for (outgoing_channel of outgoing_channels)
		{
			try
			{
				let outgoing_id = outgoing_channel.match(regex)[1];
				outgoing_channel_ids.push(outgoing_id);
			}
			catch
			{
				await message.channel.send(`${outgoing_channel} is not a proper channel tag!`);
				continue;
			}
		}

		// Add the ones that aren't in the map and make roles
		for (outgoing_id of outgoing_channel_ids)
		{
			if (!guild_map_ids.includes(outgoing_id))
			{
				// Attempt to create a new role
				try
				{
					let outgoing_channel_name = message.guild.channels.cache.find((channel) => channel.id == outgoing_id).name;
					
					// var new_role = await message.guild.createRole({name: outgoing_channel_name,});
					var new_role = await message.guild.roles.create({
						data: {name: outgoing_channel_name}
					});
					await message.channel.send(`Created role for <#${outgoing_id}>`);

				}
				catch
				{
					throw `Could not create a role for <#${outgoing_id}>! Check bot perms`;
				}

				// Add to db
				utils.fn.add_channel_to_map(message.guild.id, outgoing_id, new_role.id);

				// Attempt to set channel perms for the role

				let channel_obj = message.guild.channels.cache.find('id', outgoing_id);
				
				// console.log(channel_obj)
				try
				{
					await channel_obj.overwritePermissions([{
						id: new_role.id, 
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
					}]);
				}
				catch
				{
					await message.channel.send(`Could not add ${outgoing_channel} role to channel permission overrides!`);
				}
			}
		}
		
		// Add the connections to the source channel
		utils.fn.add_map_connections(source_channel_id, outgoing_channel_ids);

		// If two-way, add connection to the outgoing channels
		if (!is_one_way)
		{
			for (outgoing_id of outgoing_channel_ids)
			{
				utils.fn.add_map_connections(outgoing_id, [source_channel_id]);
			}
		}

		if (outgoing_channel_ids.length > 0)
		{
			return await message.channel.send(`Connected <#${source_channel_id}> to ${outgoing_channel_ids.map((id) => `<#${id}>`).join(", ")}`);
		}

	}
}
