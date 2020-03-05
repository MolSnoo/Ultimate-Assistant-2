// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'rem_custom_roll', 
	aliases: ['remcustomroll', 'remcr', 'remcr'], 
	description: "Remove a custom roll", 
	usage: '<roll-name>', 
	examples: ["!remcr str"], 
	category: 'Dice', 
	args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);

		utils.fn.remove_custom_roll(message.guild.id, char_nickname, args[0]);

		return await message.channel.send(`Removed custom roll '${args[0]}' for ${char_nickname}`);
	}
}