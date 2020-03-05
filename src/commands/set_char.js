// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'set_char', 
	aliases: ['setchar'], 
	description: "Switch your playing as character", 
	usage: '<char-nickname>', 
	examples: ["!setchar yui"], 
	category: 'Characters', 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_nickname = args[0];
		let char_entry = utils.fn.get_char_entry(message.guild.id, char_nickname);

		if (char_entry.OwnerID == message.author.id)
		{
			utils.fn.set_player_character(message.guild.id, message.author.id, char_nickname);
			return await message.channel.send(`Set playing-as character to ${char_nickname}!`)
		}
		else
		{
			throw `You are not the owner for ${char_nickname}!`;
		}
	}
}