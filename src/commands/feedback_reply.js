module.exports = 
{
	name: 'feedback_reply', 
	aliases: ['fr'], 
	description: "Reply to feedback (Use only in bot dm!)", 
	usage: '<user-id> <message>', 
	examples: [], 
	category: 'Dev', 
	args: 1, 
	reqBot: true, 
	devOnly: true, 
	execute: async (message, args, bot) =>
	{
		let msg_id = args[0];

		try
		{
			var msg_obj = await message.channel.fetchMessage(msg_id);
			// console.log(msg_obj.content);
		}
		catch (e)
		{
			console.log(e);
		}

		let recipient_id = msg_obj.content.match(/\*\*User ID\*\*: ([0-9]*)/)[1];
		let msg_copy = msg_obj.content.match(/\n(.*)\n----/m)[1];
		let msg = args.slice(1).join(" ");
		msg = `**Feedback Reply**\n> ${msg_copy}\n${msg}`;

		// send
		try
		{
			let user = bot.fetchUser(recipient_id)
			.then (async (user) =>
			{
				await user.send(msg);
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