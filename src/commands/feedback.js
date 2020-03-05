const {default_prefix, token, devID} = require("../discord-config.json");

module.exports = 
{
	name: 'feedback', 
	aliases: [], 
	description: "Send feedback and questions to the developer. Developer will reply through the bot at their earliest convenience", 
	usage: '<message>', 
	examples: ["!feedback I'd like to speak with the manager"], 
	category: 'Misc', 
	args: 1, 
	reqBot: true, 
	execute: async (message, args, bot) =>
	{
		let msg = args.join(" ");
		msg = `**Feedback**\n**Guild ID**: ${message.guild.id}\n**User ID**: ${message.author.id}\n${msg}`;

		// DM developer
		try
		{
			let owner = bot.fetchUser(devID)
			.then (async (owner) =>
			{
				owner.send(`${msg}\n--------------------------------------------`);

				try
				{
					await message.channel.send("Feedback sent!");
				}
				catch
				{}

			});
		}
		catch (e)
		{
			console.log("HERE-feedbackDM");
			// Nothing
			console.log(e);
		}
	}
}