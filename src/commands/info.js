const Discord = require('discord.js');

module.exports = 
{
	name: 'info', 
	aliases: [], 
	description: 'Shows some bot info including the bot invite link, an invite to the dev server, and a link to the project github. Also shows the perms needed to allow every command to work', 
	usage: ' ', 
	reqBot: true, 
	category: 'Misc',
	execute: async (message, args, bot) =>
	{
		// Add up users
		let all_users = [];
		for (guild of bot.guilds)
		{
			all_users = all_users.concat(guild[1].members.map(member => member.id));
		}

		// Set
		all_users = new Set(all_users);


		let embed = new Discord.RichEmbed()
			.setTitle("Info!")
			.setDescription("Send feedback to the developer with `!feedback <message>`! Full instructions can be found on the development server.")
			.addField("Add these perms to my highest role to allow full functionality", "Read Messages\nRead Message History\nSend Messages\nManage Roles\nManage Channels\nManage Members")
			.addField("Bot Invite", "https://discordapp.com/oauth2/authorize?client_id=517165856933937153&scope=bot")
			.addField("Development Server", "https://discord.gg/UzeYk99")
			.addField("Github Page", "https://github.com/ecatherine13/Ultimate-Assistant")
			.addField("No. Servers", bot.guilds.size)
			.addField("No. Unique Users", all_users.size)

		return await message.channel.send(embed);
	}
}