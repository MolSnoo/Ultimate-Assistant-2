// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'update_ref', 
	aliases: ['updatecharref', 'ucref'], 
	description: 'Edit character ref image by specifying a url or uploading an image', 
	usage: '<char-nickname> [image-url]', 
	examples: ["!ucref yui https://image-site.com/image.png", "!ucref yui"], 
	category: 'Characters', 
	args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = args[0];

		const message_member = await utils.fn.get_message_member(message);

		// check perms (admin, mod, or character's player)
		let member_roles = message_member.roles.cache.map(role => role.id);

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
		if (args[1])
		{
			var url = args[1];
		}
		else
		{
			try
			{
				var url = message.attachments.array()[0].url;
			}
			catch (e)
			{
				throw "No image provided!"
			}
		}

		// Check validity and that it's an image
		let regex = /^https?:\/\/(?:.*)\.(?:png|jpg|gif)(?:\?width=[0-9]*&height=[0-9]*)?$/;

		if (!url.match(regex))
		{
			throw `That is not a displayable image!`;
		}

		utils.fn.update_char_entry(message.guild.id, char_nickname, "RefURL", url);

		await message.channel.send(`Set Ref Image for ${char_nickname}`);
	}
}