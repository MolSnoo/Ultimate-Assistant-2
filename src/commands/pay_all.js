// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'pay_all', 
	aliases: ['payall'], 
	description: 'Pay all characters. Amount defaults to 1 if not given. Enter a negative number to remove currency (but be careful not to unintentionally put people into debt). Currency floors/caps at -9999 and 9999', 
	usage: '[amount]', 
	examples: ["!payall 5", "!payall -2"], 
	category: 'Gacha', 
	// args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// parse args
		if (args[0])
		{
			var amount = parseInt(args[0]);
		}
		else
		{
			var amount = 1;
		}

		let guild_chars = utils.fn.get_guild_chars(message.guild);

		for (char_entry of guild_chars)
		{
			try
			{
				utils.fn.pay_char(message.guild.id, char_entry.CharNickname, amount);
			}
			catch {}
		}

		// Get currency name
		let currency_name = utils.fn.get_guild_entry(message.guild.id).CurrencyName;

		if (amount < 0)
		{
			var msg = `${amount * -1} ${currency_name} taken from everyone`;
		}
		else
		{
			var msg = `${amount} ${currency_name} given to everyone`;
		}
		
		return await message.channel.send(msg);
	}
}