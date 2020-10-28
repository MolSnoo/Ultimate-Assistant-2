// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'update_char', 
	aliases: ['updatechar', 'uc'], 
	description: 'Edit a (custom) field for character. Players may edit their own', 
	usage: '<char-nickname> <field name> <field info>', 
	examples: ["!uc midori Height 165 cm", "!uc Celeste 'True Name' Taeko"], 
	category: 'Characters', 
	args: 3, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = args[0];

		const message_member = await utils.fn.get_message_member(message);

		// check perms (admin, mod, or character's player)
		let member_roles = message_member.roles.map(role => role.id);

		let is_admin = message_member.hasPermission("ADMINISTRATOR");

		if (!is_admin)
		{
			var is_mod = member_roles.filter(val => utils.fn.get_mod_roles(message.guild.id).includes(val)).length > 0;

			if (!is_admin && !is_mod)
			{
				try
				{
					var is_char_player = char_nickname.toLowerCase() == utils.fn.get_player_character(message.guild.id, message.author.id).toLowerCase();

					if (!is_char_player)
					{
						throw `stop`;
					}
				}
				catch
				{
					return message.channel.send(`You do not have permission to edit ${char_nickname}!`)
				}
			}
		}

		// Parse args, update entry, then notify
		let field = args[1];
		let value = args.slice(2).join(" ");

		utils.fn.update_char_custom(message.guild.id, char_nickname, field, value);

		await message.channel.send(`Set ${field} to ${value} for ${char_nickname}`);
	}
}