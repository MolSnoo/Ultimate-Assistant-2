module.exports = 
{
	name: 'feedback_reply', 
	aliases: ['fr'], 
	description: "Reply to feedback", 
	usage: '<user-id> <message>', 
	examples: [], 
	category: 'Dev', 
	args: 1, 
	reqBot: true, 
	devOnly: true, 
	execute: async (message, args, bot) =>
	{
		let user_id = args[0];
		let msg = args.slice(1).join(" ");
		msg = `**Feedback Reply**\n${msg}`;

		// send
		try
		{
			let user = bot.fetchUser(user_id)
			.then (async (user) =>
			{
				user.send(msg);
				await message.channel.send("Sent feedback");
			});
		}
		catch (e)
		{
			await message.channel.send("Could not DM!");
			console.log("HERE-feedbackDM");
			// Nothing
			console.log(e);
		}
	}
}