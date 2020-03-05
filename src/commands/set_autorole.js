// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'set_autorole', 
	aliases: ['ar'], 
	description: 'Set a role to automatically assign new members', 
	usage: '<role name>', 
	examples: ["!ar Undecided"], 
	category: 'Admin', 
	args: 1, // required number of args (not including optional)
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let role_obj = utils.fn.get_closest_role_match(message.guild, args.join(" "));
		
		utils.fn.update_guild_entry(message.guild.id, "AutoRole", role_obj.id);

		if (role_obj.name == '@everyone')
		{
			role_obj.name = 'everyone';
		}

		return await message.channel.send(`Set autorole to ${role_obj.name}!`);
	}
}