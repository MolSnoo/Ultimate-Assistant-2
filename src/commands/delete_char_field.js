// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'del_field', 
	aliases: ['delcharfield', 'delfield', 'remfield'], 
	description: 'Remove a (custom) field from a character', 
	usage: '<char-nickname> <field1> [field2] ["field 3"]...', 
	examples: ["!remfield yui Height", "!remfield yui 'public backstory' height"], 
	category: 'Characters', 
	args: 2, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = args[0];

		// check perms (admin, mod, or character's player)
		let member_roles = message.member.roles.map(role => role.id);

		let is_admin = message.member.hasPermission("ADMINISTRATOR");

		if (!is_admin)
		{
			var is_mod = member_roles.filter(val => utils.fn.get_mod_roles(message.guild.id).includes(val)).length > 0;

			if (!is_admin && !is_mod)
			{
				try
				{
					var is_char_player = char_nickname.toLowerCase() == utils.fn.get_player_character(message.guild.id, message.author.id).toLowerCase();
				}
				catch
				{
					return message.channel.send(`You do not have permission to edit ${char_nickname}!`)
				}
			}
		}

		// Parse args, update entry, then notify
		let fields = args.slice(1);

		utils.fn.remove_char_custom_fields(message.guild.id, char_nickname, fields);
		return await message.channel.send(`Removed ${fields.join(", ")} for ${char_nickname}`)

	}
}