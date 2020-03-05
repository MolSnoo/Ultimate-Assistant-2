// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'rem_mod_roles', 
	aliases: ['remmodroles', 'rem_mod_role', 'remmodrole'], 
	description: 'Remove mod role(s)', 
	usage: '<role-name> [role-name2] ["Role Name3"]...', 
	examples: ["!rem_mod_roles Mod", "!rem_mod_roles Mod Helper 'Role with space'"], 
	category: 'Admin', 
	args: 1, 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let role_names = args;
		let role_objs = role_names.map((role_name) => utils.fn.get_closest_role_match(message.guild, role_name));

		let role_ids = role_objs.map((role) => role.id);
		role_names = role_objs.map((role) => role.name);

		utils.fn.del_mod_roles(message.guild.id, role_ids);

		return await message.channel.send(`Removed ${role_names.join(", ")} from Mod role(s)`);
	}
}