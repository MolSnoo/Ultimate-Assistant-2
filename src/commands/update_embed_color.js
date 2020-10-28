// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'update_color', 
	aliases: ['updatecharcolor', 'uccolor'], 
	description: 'Edit character embed color', 
	usage: '<char-nickname> [hex-code]', 
	examples: ["!uccolor yui 2e8b57", "!uccolor yui #2e8b57"], 
	category: 'Characters', 
	args: 2, 
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
		let value = args[1];

		// Regex check for hex
		var regex = /^#?([a-f0-9]{6}|[A-Fa-f0-9]{3})$/i;

		try
		{
			var color = value.match(regex)[1];
		}
		catch
		{
			throw `${value} is not a valid hex code!`;
		}

		utils.fn.update_char_entry(message.guild.id, char_nickname, "EmbedColor", color);

		await message.channel.send(`Set Embed color to #${color} for ${char_nickname}`);
	}
}