// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js')

module.exports = 
{
	name: 'custom_rolls', 
	aliases: ['crs'], 
	description: 'See your custom rolls. Admin/mods can add a nickname as an argument to see anyone', 
	usage: '[char-nickname]',
	examples: ["(admin) !crs yui"],  
	category: 'Dice', 
	// args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		if (args.length == 1) // check mod/admin/owner
		{
			var char_nickname = args[0];
			const message_member = utils.fn.get_message_member(message);
			
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
						throw`You do not have permission to view custom rolls for ${char_nickname}!`;
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
		var embed = displays.fn.custom_rolls(char_entry);

		return await message.channel.send(embed);
	}
}