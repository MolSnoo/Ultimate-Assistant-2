// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'playing_as', 
	aliases: ['iam', 'mychar', 'mc'], 
	description: "Check who you're playing", 
	usage: ' ', 
	category: 'Characters', 
	guildOnly: true,
	execute: async (message, args) =>
	{
		return await message.channel.send(`${message.author} is playing as ${utils.fn.get_player_character(message.guild.id, message.author.id)}`);
	}
}