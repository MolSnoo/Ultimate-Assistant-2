// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'take', 
	aliases: [], 
	description: 'Add one or more of an item to your inventory. Be wary of apostrophes in your description (enclose in "" if needed)', 
	usage: '[amount] <item-name> [description]', 
	examples: ["!take 'Library book' A book about ancient languages", '!take 4 note', "!take 4 note  Four lists of names"], 
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
			var item_name = args[0];
			var item_desc = args.slice(1).join(" ");
		}
		else
		{
			var item_name = args[1];
			var item_amnt = Math.abs(parseInt(args[0]));
			var item_desc = args.slice(2).join(" ");
		}

		// console.log(item_name);
		// console.log(item_amnt);
		// console.log(item_desc);

		utils.fn.add_item_to_inventory(message.guild.id, char_nickname, item_name, item_amnt, item_desc);

		return await message.channel.send(`${item_name} x${item_amnt} added to inventory for ${char_nickname}`);
	}
}
