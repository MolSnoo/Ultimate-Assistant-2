// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'drop', 
	aliases: [], 
	description: 'Remove one or more of an item from your inventory', 
	usage: '[amount] <item-name>', 
	examples: ["!drop knife", "!drop 2 card", "!drop 2 red pen"], 
	category: 'Inventory', 
	args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		// Get player character
		let char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);

		if (isNaN(args[0]))
		{
			var item_amnt = 1;
			var item_name = args.slice(0).join(" ");
		}
		else
		{
			var item_amnt = Math.abs(parseInt(args[0]));
			var item_name = args.slice(1).join(" ");
		}

		utils.fn.remove_item_from_inventory(message.guild.id, char_nickname, item_name, item_amnt);

		return await message.channel.send(`${item_name} x${item_amnt} removed from inventory for ${char_nickname}`);
	}
}
