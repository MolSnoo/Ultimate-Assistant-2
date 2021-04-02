// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'anon_dm', 
	aliases: ['anon_dm', 'adm'], 
	description: 'Send an anonymous DM if they are enabled', 
	usage: '<char-nickname> <message>', 
	examples: ["!adm yui Never gonna give you up..."], 
	category: 'Misc', 
	args: 2, 
	guildOnly: true,
	reqBot: true, 
	execute: async (message, args, bot) =>
	{
		// guild entry and check for anondm receipt channel and enabled anon dms
		let guild_entry = utils.fn.get_guild_entry(message.guild.id);
		if (!guild_entry.AnonDMs || !guild_entry.AnonDMChannel)
		{
			throw `Anonymous DMs are disabled for ${message.guild}! If you think they are, make sure you set a receipt channel with \`!set_adm_channel #channel-tag\``;
		}

		// get player character
		let char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);

		// parse message
		let anon_msg = args.slice(1).join(" ");

		// get recipient character entry (with player ID)
		let recipient_nickname = utils.fn.to_title_case(args[0]);
		let recipient_char_entry = utils.fn.get_char_entry(message.guild.id, recipient_nickname);
		let recipient_player_id = recipient_char_entry.OwnerID;

		if (guild_entry.AnonDMChannel)
		{
			let receipt_channel_obj = message.guild.channels.cache.find((element) => element.id == guild_entry.AnonDMChannel);

			// const guild_members = await message.guild.fetchMembers();

			// var recipient_obj = guild_members.find((element) => element.id == recipient_player_id);
			var recipient_obj = await bot.fetchUser(recipient_player_id);

			try
			{
				await receipt_channel_obj.send(displays.fn.anon_dm_receipt(message.author, recipient_obj, anon_msg));
			}
			catch
			{
				throw `Could not send receipt to the specified channel! Please have a mod check posting perms`;
			}
		}

		// Attempt to send DM
		try
		{
			await recipient_obj.send(displays.fn.anon_dm_private(message.author, recipient_obj, message.guild, recipient_nickname, anon_msg));

			await message.channel.send("Sent!");
		}
		catch
		{
			throw `Could not DM ${recipient_nickname}!`;
		}
	}
}