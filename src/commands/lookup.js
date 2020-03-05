// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js')

module.exports = 
{
	name: 'lookup', 
	aliases: ['search', 'profile'], 
	description: 'Edit character embed color', 
	usage: '<char-nickname>', 
	examples: ["!lookup yui"], 
	category: 'Characters', 
	args: 1, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let char_entry = utils.fn.get_char_entry(message.guild.id, args[0])
		let embed = displays.fn.char_embed(char_entry);

		return await message.channel.send(embed);
	}
}