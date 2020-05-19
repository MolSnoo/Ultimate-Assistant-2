const utils = require('../utils.js');

module.exports = 
{
	name: 'del_char', 
	aliases: ['delchar', 'rc'], 
	description: 'Remove a character from the server', 
	usage: '<char-nickname>',
	examples: ["!rc yui"],  
	category: 'Characters', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		char_nickname = args[0];
		utils.fn.remove_char_entry(message.guild.id, char_nickname);
	}
}