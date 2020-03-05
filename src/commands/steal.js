// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'steal', 
	aliases: ['s'], 
	description: 'Steal an item (if possible). Optional channel tag to steal from private', 
	usage: '[#channel-tag] <item-name>', 
	examples: ["!s suspicious list", "!s #hallway-2 suspicious list"], 
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
		
		// Steal
		utils.fn.steal_investigation(channel_id, item_name, char_nickname);

		return await message.channel.send(`${char_nickname} steals ${item_name}!`);
	}
}