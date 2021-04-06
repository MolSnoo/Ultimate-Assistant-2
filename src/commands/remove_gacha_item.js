// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'remove_gacha_item', 
	aliases: ['rg'], 
	description: 'Remove item(s) from gacha. Prompts for a selection of numbers', 
	usage: ' ', 
	category: 'Gacha', 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let items = utils.fn.get_guild_gacha(message.guild.id);
		let embeds = displays.fn.guild_gacha(items, message.guild);

		// The display edits the items variable so have to get it again?
		items = utils.fn.get_guild_gacha(message.guild.id);

		for (embed of embeds)
		{
			await message.channel.send(embed);
		}

		// Collect numerical input
		const filter = (msg) => (msg.author.id == message.author.id && msg.channel.id == message.channel.id);
		const options = {maxMatches: 1, time: 120000, errors: ['time']};

		const collector = message.channel.createMessageCollector(filter, options);
		
		await message.channel.send(`Enter a comma separated list of numbers:`);

		collector.on('collect', msg => {
			const response = msg.content.toLowerCase();

			// Parse response
			let idxs_to_delete = response.match(/([0-9]*)/g)
				.filter((entry) => !isNaN(parseInt(entry)) && parseInt(entry) <= items.length-1);

			for (idx of idxs_to_delete)
			{
				let i = parseInt(idx);
				utils.fn.remove_gacha_entry(message.guild.id, items[i].ItemName);
			}

			message.channel.send(`Removed item(s) ${idxs_to_delete.join(", ")}`);

			collector.stop();
		});

		// message.channel.send(`Enter a comma separated list of numbers: `)
		// 	.then (() => 
		// 	{
		// 		message.channel.awaitMessages(filter, {maxMatches: 1, time: 120000, errors: ['time']})
		// 			.then (async collected => 
		// 			{
		// 				var response = collected.first().content.toLowerCase();

		// 				// Parse response
		// 				let idxs_to_delete = response.match(/([0-9]*)/g)
		// 					.filter((entry) => !isNaN(parseInt(entry)) && parseInt(entry) <= items.length-1);

		// 				for (idx of idxs_to_delete)
		// 				{
		// 					let i = parseInt(idx);
		// 					utils.fn.remove_gacha_entry(message.guild.id, items[i].ItemName);
		// 				}

		// 				// Finish
		// 				try
		// 				{
		// 					await message.channel.send(`Removed item(s) ${idxs_to_delete.join(", ")}`);
		// 				}
		// 				catch {}
		// 			})
		// 			.catch (async collected =>
		// 			{
		// 				await message.channel.send(`Timed out! (120 s)`);
		// 			});
		// 	});


		// console.log(response);

	}
}