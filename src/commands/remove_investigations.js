// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'remove_investigations', 
	aliases: ['rinv'], 
	description: 'Remove investigation(s). Prompts for a selection of numbers', 
	usage: ' ', 
	category: 'Investigations', 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let investigations = utils.fn.get_guild_investigations(message.guild.id);
		let display = displays.fn.guild_investigations(investigations, message.guild);

		for (embed of display.embeds)
		{
			await message.channel.send(embed);
		}

		let ordered_list = display.list;

		// Collect numerical input
		const filter = (msg) => (msg.author.id == message.author.id && msg.channel.id == message.channel.id);

		message.channel.send(`Enter a comma separated list of numbers: `)
			.then (() => 
			{
				message.channel.awaitMessages(filter, {maxMatches: 1, time: 120000, errors: ['time']})
					.then (async collected => 
					{
						var response = collected.first().content.toLowerCase();

						// Parse response
						let idxs_to_delete = response.match(/([0-9]*)/g)
							.filter((entry) => !isNaN(parseInt(entry)) && parseInt(entry) <= investigations.length-1);
						
						for (idx of idxs_to_delete)
						{
							let i = parseInt(idx);
							utils.fn.remove_investigation(ordered_list[i].ChannelID, ordered_list[i].ItemNames[0]);
						}

						// Finish
						try
						{
							await message.channel.send(`Removed investigation(s) ${idxs_to_delete.join(", ")}`);
						}
						catch {}
					})
					.catch (collected =>
					{
						message.channel.send(`Timed out! (120 s)`);
					});
			});


		// console.log(response);

	}
}