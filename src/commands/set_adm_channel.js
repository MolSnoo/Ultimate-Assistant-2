// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'set_adm_channel', 
	aliases: ['setadmchannel', 'set_anondm_channel', 'setanondmchannel'], 
	description: 'Set a channel to receive the receipts for anon DMs', 
	usage: '<#channel-tag>', 
	examples: ["!set_adm_channel #adm-receipts"], 
	category: 'Admin', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let regex = /^<#([0-9]*)>$/;

		try
		{
			var channel_id = args[0].match(regex)[1];
		}
		catch
		{
			throw `${args[0]} is not a proper channel tag!`;
		}

		utils.fn.update_guild_entry(message.guild.id, "AnonDMChannel", channel_id);

		return await message.channel.send(`Set Anon DM receipt channel to ${args[0]}`);
	}
}