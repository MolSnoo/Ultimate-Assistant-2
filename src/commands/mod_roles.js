const utils = require('../utils.js');

module.exports = 
{
	name: 'mod_roles', 
	aliases: ['mods'], 
	description: 'View mod roles added with the add command', 
	usage: '',  
	category: 'Admin', 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let guild_entry = utils.fn.get_guild_entry(message.guild.id);
		let mod_roles = JSON.parse(guild_entry.ModRoles);

		let msg = "";

		for (id of mod_roles)
		{
			msg += `${message.guild.roles.find((role) => role.id == id).name}\n`;
		}

		return await message.channel.send(`**Mod roles in ${message.guild}**\n${msg}`);
	}
}