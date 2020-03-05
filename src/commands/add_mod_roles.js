// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'add_mod_roles', 
	aliases: ['addmodroles', 'add_mod_role', 'addmodrole'], 
	description: 'Specify existing role(s) as Mod roles. Users with these roles can use admin commands. Does not need to be done for roles with existing Admin perms', 
	usage: '<role-name> [role-name2] ["Role Name3"]...', 
	examples: ["!addmodroles Mod", "!addmodroles Mod Helper"], 
	category: 'Admin', 
	args: 1, 
	adminOnly: true, 
	execute: async (message, args) =>
	{
		let new_role_names = args;
		let new_role_objs = new_role_names.map((role_name) => utils.fn.get_closest_role_match(message.guild, role_name));

		let new_role_ids = new_role_objs.map((role) => role.id);
		new_role_names = new_role_objs.map((role) => role.name);

		utils.fn.add_mod_roles(message.guild.id, new_role_ids);

		return await message.channel.send(`Added ${new_role_names.join(", ")} as Mod role(s)`);
	}
}