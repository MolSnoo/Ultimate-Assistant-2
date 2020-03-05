// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'item_amount', 
	aliases: ['ia'], 
	description: 'Specify number of copies of an existing gacha item (numbers above 999 will go to infinity)', 
	usage: '<new-amount> <item-name>', 
	examples: ["!ia 5 mineral water"], 
	category: 'Gacha', 
	args: 2, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// parse args
		if (isNaN(args[0]))
		{
			throw `${args[0]} is not a proper number!`
		}

		let new_amount = parseInt(args[0]);
		let item_name = args.slice(1).join(" ");

		if (new_amount <= 0) // delete case
		{
			utils.fn.remove_gacha_entry(message.guild.id, item_name);
			return await message.channel.send("Set amount");
		}
		else if (new_amount >= 999)
		{
			new_amount = null;
		}

		// Set new amount
		utils.fn.update_gacha_entry(message.guild.id, item_name, "Amount", new_amount);
		return await message.channel.send("Set amount");

	}
}