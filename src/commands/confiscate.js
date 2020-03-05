// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'confiscate', 
	aliases: ['takefrom'], 
	description: 'Remove one or more of an item from a character\'s inventory', 
	usage: '<char-nickname> [amount] <item_name>', 
	examples: ["!confiscate yui kitchen knife", "!confiscate yui 2 flower"], 
	category: 'Inventory', 
	args: 2, 
	guildOnly: true,
	adminOnly: true, 
	execute: async (message, args) =>
	{
		// Get player character
		let char_nickname = args[0]

		if (isNaN(args[1]))
		{
			var item_amnt = 1;
			var item_name = args.slice(1).join(" ");
		}
		else
		{
			var item_amnt = Math.abs(parseInt(args[1]));
			var item_name = args.slice(2).join(" ");

		}
		
		utils.fn.remove_item_from_inventory(message.guild.id, char_nickname, item_name, item_amnt);

		return await message.channel.send(`${item_name} x${item_amnt} removed from inventory for ${char_nickname}`);
	}
}
