const utils = require('../utils.js');

module.exports = 
{
	name: 'set_currency_name', 
	aliases: ['setcurrency'], 
	description: 'Set name of gacha currency (default Coins)', 
	usage: '<currency-name>', 
	examples: ["!setcurrency Tickets"], 
	category: 'Gacha', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let name = args.slice(0).join(" ");

		utils.fn.update_guild_entry(message.guild.id, "CurrencyName", name);

		return await message.channel.send(`Set currency to ${name} for ${message.guild}`);
	}
}