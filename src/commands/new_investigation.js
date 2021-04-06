// FINISHED
const utils = require('../utils.js');

module.exports = 
{
	name: 'new_investigation', 
	aliases: ['ninv'], 
	description: 'Add a new investigation. Use the -s tag to allow players to steal it. Use the -p tag to have the bot reply in public rather than DMs. Bot will prompt for a description', 
	usage: '[-sp] <#channel-tag> <name1> [name2]...', 
	examples: ["!ninv #hallway-1 curtains 'blue curtains' curtain 'blue curtain'", "!ninv -sp #lobby lamp", "!ninv -s #lobby lamp", "!ninv -p #lobby lamp"], 
	category: 'Investigations',
	args: 2,  
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// parse
		if (args[0].toLowerCase().includes("s"))
		{
			var is_stealable = 1;
		}
		else
		{
			var is_stealable = 0;
		}

		if (args[0].toLowerCase().includes("p"))
		{
			var is_public = 1;
		}
		else
		{
			var is_public = 0;
		}

		// set var i to indicate which argument is the channel tag
		if (is_public || is_stealable)
		{
			var i = 1;
		}
		else
		{
			var i = 0;
		}

		try
		{
			var channel_id = args[i].match(/<#([0-9]*)>/)[1];
		}
		catch
		{
			throw `${args[i]} is not a proper channel tag!`;
		}

		var item_names = args.slice(i+1);

		if (item_names.length == 0)
		{
			throw `You must enter at least one name for your item!`;
		}

		// Get the description
		const filter = (msg) => (msg.author.id == message.author.id && msg.channel.id == message.channel.id);
		const options = {maxMatches: 1, time: 120000, errors: ['time']};

		const collector = message.channel.createMessageCollector(filter, options);

		await message.channel.send("Enter description:");

		collector.on('collect', msg => {
			const response = msg.content;

			utils.fn.add_investigation(message.guild.id, channel_id, item_names, response, is_public, is_stealable);

			message.channel.send("Added investigation!");
			
			collector.stop();
		});

	// 	message.channel.send(`Enter description:`)
	// 		.then (() => 
	// 		{
	// 			message.channel.awaitMessages(filter, {maxMatches: 1, time: 120000, errors: ['time']})
	// 				.then (async collected => 
	// 				{
	// 					let response = collected.first().content;
						
	// 					// Add to db
	// 					utils.fn.add_investigation(message.guild.id, channel_id, item_names, response, is_public, is_stealable);

	// 					try
	// 					{
	// 						await message.channel.send("Added investigation!");
	// 					}
	// 					catch {}

	// 				})
	// 				.catch (async error =>
	// 				{
	// 					try
	// 					{
	// 						await message.channel.send(error);
	// 					}
	// 					catch
	// 					{
	// 						await message.channel.send(`Timed out! (120 s)`);
	// 					}
	// 				});
	// 		});

	}
}