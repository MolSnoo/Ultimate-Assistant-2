// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'investigate', 
	aliases: ['inv', 'i'], 
	description: 'Investigate an item. Optional channel tag to investigate remotely', 
	usage: '[#channel-tag] <item-name>', 
	examples: ["!i mysterious box", "!i #storage-room mysterious box"], 
	category: 'Investigations',
	args: 1,
	guildOnly: true, 
	execute: async (message, args) =>
	{
		try
		{
			var channel_id = args[0].match(/<#([0-9]*)>/)[1];
			var i = 1;
		}
		catch
		{
			var channel_id = message.channel.id;
			var i = 0;
		}

		var item_name = args.slice(i).join(" ");

		// Get player char nickname
		let char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);

		try
		{
			let investigation_entry = utils.fn.get_investigation(channel_id, item_name, char_nickname);
		}
		catch
		{
			return;
		}

		// Send
		let msg = `**${utils.fn.to_title_case(item_name)}**\n${investigation_entry.ItemInfo}`;
		if (investigation_entry.IsPublic)
		{
			return await message.channel.send(msg);
		}
		else
		{
			// Try to DM the author
			try
			{
				await message.author.send(msg);
			}
			catch
			{
				return await message.channel.send(`Unable to DM ${char_nickname}!`);
			}
		}
	}
}