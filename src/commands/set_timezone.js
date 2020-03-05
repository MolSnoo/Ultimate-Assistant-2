// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'set_timezone', 
	aliases: ['set_tz', 'tz'], 
	description: 'Set the server timezone. Half-hours not supported, sorry :(', 
	usage: '<UTC-offset>', 
	examples: ["!tz -3", "!tz 1", "!tz +1"], 
	category: 'Announcements', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		
		var offset = parseInt(args[0]);
		
		// It must be an integer between -12 and 14
		if (isNaN(offset) || offset < -12 || offset > 14)
		{
			throw `${args[0]} is not a proper (integer) timezone!`
		}

		utils.fn.update_guild_entry(message.guild.id, "Timezone", offset);

		if (offset < 0)
		{
			return await message.channel.send(`Set timezone to UTC${offset} for ${message.guild}`)
		}
		else
		{
			return await message.channel.send(`Set timezone to UTC+${offset} for ${message.guild}`)
		}
	}
}