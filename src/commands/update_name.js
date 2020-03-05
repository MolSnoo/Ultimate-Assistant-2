// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'update_name', 
	aliases: ['updatecharname', 'ucname'], 
	description: 'Edit character name', 
	usage: '<char-nickname> <new name>', 
	examples: ["!ucname celeste Taeko Yasuhiro"], 
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
		let value = args.slice(1).join(" ");

		utils.fn.update_char_entry(message.guild.id, char_nickname, "CharName", value);

		await message.channel.send(`Set Name to ${value} for ${char_nickname}`);
	}
}