// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'update_nickname', 
	aliases: ['updatecharnickname', 'ucnickname'], 
	description: 'Edit character nickname (recommend single-word)', 
	usage: '<char-nickname> <new nickname>', 
	examples: ["!ucnickname celeste taeko"], 
	category: 'Characters', 
	args: 2, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = args[0];

		const message_member = utils.fn.get_message_member(message);

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
		let value = utils.fn.to_title_case(args[1]);

		// Check that it's not a repeat for anyone else in the guild
		let guild_chars = utils.fn.get_guild_chars(message.guild).map(element => element.CharNickname);

		if (guild_chars.includes(value))
		{
			throw `The nickname ${value} is already taken in ${message.guild}!`;
		}

		utils.fn.update_char_entry(message.guild.id, char_nickname, "CharNickname", value);

		// If anyone is playing the character, update in UserInfo
		utils.fn.change_playingas_nickname(message.guild.id, char_nickname, value);

		await message.channel.send(`Set Nickname to ${value} for ${char_nickname}`);
	}
}