// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'new_custom_roll', 
	aliases: ['newcustomroll', 'newcr', 'updatecr'], 
	description: "Add or update a custom roll. It is recommended to make the roll name a single word", 
	usage: '<roll_name> <d20 notation>', 
	examples: ["!ncr str 1d20+1", "!ncr 'str roll' d20+1"], 
	category: 'Dice', 
	args: 2, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);

		let roll_str = args.slice(1).join("");

		utils.fn.add_custom_roll(message.guild.id, char_nickname, args[0], roll_str);

		return await message.channel.send(`Added custom roll '${args[0]}' for ${char_nickname}`);
	}
}