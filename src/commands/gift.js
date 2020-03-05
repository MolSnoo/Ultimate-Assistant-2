// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'gift', 
	aliases: [], 
	description: 'For players to give an item or currency to another player. It must be in your inventory', 
	usage: '<char-nickname> [amount] <item/currency-name> ', 
	examples: ["!gift yui library book", "!gift yui 2 note", "!gift yui 3 Coins"], 
	category: 'Inventory', 
	args: 2, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		//parse args
		let recipient_nickname = utils.fn.to_title_case(args[0]);

		if (isNaN(args[1]))
		{
			var item_name = utils.fn.to_title_case(args.slice(1).join(" "));
			var amount = 1;
		}
		else
		{
			var amount = Math.abs(parseInt(args[1]));
			
			var item_name = utils.fn.to_title_case(args.slice(2).join(" "));
			if (!item_name)
			{
				throw `You must enter an item name!`;
			}
		}

		// Get player's character and entry
		let giver_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);
		let giver_entry = utils.fn.get_char_entry(message.guild.id, giver_nickname);

		// Check if currency or inventory item
		let guild_currency_name = utils.fn.get_guild_entry(message.guild.id).CurrencyName;

		// Currency case
		if (item_name.toLowerCase() == guild_currency_name.toLowerCase())
		{
			// Make sure they have enough
			if (amount > giver_entry.Currency)
			{
				throw `${giver_nickname} is short ${amount - giver_entry.Currency} ${guild_currency_name}`;
			}

			// Give the recipient the money (fails if they don't exist)
			utils.fn.pay_char(message.guild.id, recipient_nickname, amount);
			
			// Subtract amount from giver
			utils.fn.pay_char(message.guild.id, giver_nickname, amount*-1);

			return await message.channel.send(`${giver_nickname} sent ${amount} ${guild_currency_name} to ${recipient_nickname}`);
			
		}

		// Inventory case
		let giver_inventory = giver_entry.Inventory;

		// Check existence
		if (!Object.keys(giver_inventory).includes(item_name))
		{
			throw `You do not have ${item_name} in your inventory!`;
		}

		let item_entry = giver_inventory[item_name];
		
		// Check amount
		if (item_entry.num < amount)
		{
			throw `You are short ${amount-item_entry.num} of ${item_name}!`;
		}

		// Give recipient the item (fails if they don't exist)
		utils.fn.add_item_to_inventory(message.guild.id, recipient_nickname, item_name, item_amount=amount, item_entry.desc);

		// Remove from inventory
		utils.fn.remove_item_from_inventory(message.guild.id, giver_nickname, item_name, amount);

		return await message.channel.send(`${giver_nickname} sent ${amount} of ${item_name} to ${recipient_nickname}`)
	}
}