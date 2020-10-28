// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'inventory', 
	aliases: ['items'], 
	description: 'View your inventory. Mods can enter a nickname to view anyone. Item amount caps at 9999', 
	usage: '[char-nickname]', 
	examples: ["(admin) !items yui"], 
	category: 'Inventory', 
	// args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		const message_member = await utils.fn.get_message_member(message);

		if (args.length == 1) // check mod/admin/owner
		{
			var char_nickname = args[0];

			// check perms (admin, mod, or character's player)
			let member_roles = message_member.roles.map(role => role.id);

			let is_admin = message_member.hasPermission("ADMINISTRATOR");

			if (!is_admin)
			{
				let is_mod = member_roles.filter(val => utils.fn.get_mod_roles(message.guild.id).includes(val)).length > 0;

				if (!is_admin && !is_mod)
				{
					let is_char_player = char_nickname.toLowerCase() == utils.fn.get_player_character(message.guild.id, message.author.id).toLowerCase();
					
					if (!is_char_player)
					{
						throw `You do not have permission to view inventory for ${char_nickname}!`;
					}
				}
			}
		}
		else // assume ownership
		{
			// Get the player's character
			var char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);
		}

		var char_entry = utils.fn.get_char_entry(message.guild.id, char_nickname);
		var embeds = displays.fn.inventory_embeds(char_entry);

		if (embeds.length == 0)
		{
			throw `${char_nickname} has an empty inventory!`;
		}

		for (embed of embeds)
		{
			await message.channel.send(embed);
		}
	}
}