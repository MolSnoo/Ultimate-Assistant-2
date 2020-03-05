// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'toggle_adm', 
	aliases: ['toggleadm', 'toggle_adms', 'toggleadms'], 
	description: 'Toggle anon dm capability. Be sure to set a receipt channel first', 
	usage: ' ', // keep as a space if none. Otherwise, the convention is <"req_arg"> ["opt_arg"], quotations if necessary
	category: 'Admin', 
	// args:
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let is_enabled = utils.fn.get_guild_entry(message.guild.id).AnonDMs;
		let toggle = (parseInt(is_enabled)+1) % 2;

		utils.fn.update_guild_entry(message.guild.id, "AnonDMs", toggle);

		if (toggle == 1)
		{
			// Check for anon DM channel
			let guild_entry = utils.fn.get_guild_entry(message.guild.id)
			if (!guild_entry.AnonDMChannel)
			{
				throw `Anon DMs **enabled**, but you will need to set up a receipt channel for them to work! You can do so with \`!set_adm_channel #channel-tag\``;
			}
			return await message.channel.send("Anon DMs are now **enabled**");
		}
		else
		{
			return await message.channel.send("Anon DMs are now **disabled**");
		}
	}
}