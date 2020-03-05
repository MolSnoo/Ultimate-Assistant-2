// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'gacha_pull', 
	aliases: ['gacha', 'g'], 
	description: 'Draw a gacha item. Item is auto-added to your inventory', 
	usage: ' ', 
	category: 'Gacha', 
	// args: 1,  
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// Get player character nickname
		let char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);

		// Check currency
		let char_entry = utils.fn.get_char_entry(message.guild.id, char_nickname);

		if (char_entry.Currency <= 0)
		{
			throw `${char_nickname} does not have any currency (or is in debt)!`;
		}

		// Gacha
		let guild_gacha = utils.fn.get_guild_gacha(message.guild.id);

		// Randomly draw an element of array
		let draw_idx = Math.floor(Math.random() * Math.floor(guild_gacha.length));

		let pulled_item_entry = guild_gacha[draw_idx];

		let embed = displays.fn.gacha_pull(pulled_item_entry, char_entry);

		// add item to inventory
		utils.fn.add_item_to_inventory(message.guild.id, char_nickname, pulled_item_entry.ItemName, 1, pulled_item_entry.Description);

		// Decrement currency
		utils.fn.update_char_entry(message.guild.id, char_nickname, "Currency", char_entry.Currency - 1);

		// Decrement item or delete if it's now zero
		if (pulled_item_entry.Amount)
		{
			var new_amount = pulled_item_entry.Amount - 1;

			if (new_amount == 0)
			{
				utils.fn.remove_gacha_entry(message.guild.id, pulled_item_entry.ItemName);
			}
			else
			{
				utils.fn.update_gacha_entry(message.guild.id, pulled_item_entry.ItemName, "Amount", new_amount);
			}
		}

		return await message.channel.send(embed);
	}
}