// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'money', 
	aliases: ['currency', 'wallet'], 
	description: 'View your currency. Mods can enter a nickname to view anyone', 
	usage: '[char-nickname]',
	examples: ["(admin) !money yui"],  
	category: 'Gacha', 
	// args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		const message_member = utils.fn.get_message_member(message);
		
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
						throw`You do not have permission to view currency for ${char_nickname}!`;
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
		var guild_entry = utils.fn.get_guild_entry(message.guild.id);

		if (char_entry.Currency >= 0)
		{
			return await message.channel.send(`${char_nickname} has ${char_entry.Currency} ${guild_entry.CurrencyName}`);
		}
		else
		{
			return await message.channel.send(`${char_nickname} is ${Math.abs(char_entry.Currency)} ${guild_entry.CurrencyName} in debt`);
		}
	}
}