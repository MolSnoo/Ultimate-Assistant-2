// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'give', 
	aliases: [], 
	description: 'Admins can add one or more of a new item to a character\'s inventory. Be wary of apostrophes in your description (enclose in "" if needed)', 
	usage: '<char-nickname> <item-name> [amount] [description]', 
	examples: ["!give yui invitation An invitation to a fancy dinner", "!give yui plate 2 A standard china plate", "!give yui plate", "!give yui plate 2", "!give yui 'blue plate' 2"], 
	category: 'Inventory', 
	args: 2, 
	guildOnly: true,
	adminOnly: true, 
	execute: async (message, args) =>
	{
		// Get player character
		let char_nickname = args[0]

		let item_name = args[1];

		if (isNaN(args[2]))
		{
			var item_amnt = 1;
			var item_desc = args.slice(2).join(" ");
		}
		else
		{
			var item_amnt = parseInt(args[2]);
			var item_desc = args.slice(3).join(" ");
		}
		utils.fn.add_item_to_inventory(message.guild.id, char_nickname, item_name, item_amnt, item_desc);

		return await message.channel.send(`${item_name} x${item_amnt} added to inventory for ${char_nickname}`);
	}
}
