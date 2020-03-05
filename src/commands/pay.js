// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'pay', 
	aliases: [], 
	description: 'Pay one or more characters. Amount defaults to 1 if not given. Enter a negative number to remove currency (they may go into debt). Currency caps/floors and 9999 and -9999.', 
	usage: '<char-nickname> [char-nickname2]... [amount]', 
	examples: ["!pay yui", "!pay yui 5", "!pay yui riku 5", "!pay yui -1"], 
	category: 'Gacha', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// parse args

		// If last arg is a number
		if (!isNaN(args[args.length-1]))
		{
			var amount = parseInt(args.pop());
		}
		else
		{
			var amount = 1;
		}

		let char_nicknames = args.slice(0);

		let paid_characters = [];
		for (char_nickname of char_nicknames)
		{
			try
			{
				utils.fn.pay_char(message.guild.id, char_nickname, amount);
				paid_characters.push(char_nickname);
			}
			catch (e)
			{	
				await message.channel.send(e);
				continue;
			}
		}

		if (Math.abs(amount) > 9999)
		{
			amount = 9999 * Math.sign(amount);
		}

		// Get currency name
		let currency_name = utils.fn.get_guild_entry(message.guild.id).CurrencyName;

		if (amount < 0)
		{
			var msg = `${amount * -1} ${currency_name} taken from ${paid_characters.join(", ")}`;
		}
		else
		{
			var msg = `${amount} ${currency_name} given to ${paid_characters.join(", ")}`;
		}
		
		return await message.channel.send(msg);
	}
}