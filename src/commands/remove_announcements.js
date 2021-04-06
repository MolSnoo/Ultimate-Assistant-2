// FINISHED
const utils = require('../utils.js');
const displays = require('../displays.js');

module.exports = 
{
	name: 'remove_announcements', 
	aliases: ['ra'], 
	description: 'Remove announcement(s). Prompts for a selection of numbers', 
	usage: ' ', 
	category: 'Announcements', 
	adminOnly: true, 
	guildOnly: true, 
	execute: async (message, args) =>
	{
		let announcements = utils.fn.get_guild_announcements(message.guild.id);
		let guild_entry = utils.fn.get_guild_entry(message.guild.id);

		let embed = displays.fn.announcements(announcements, guild_entry, message.guild);

		await message.channel.send(embed);

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
							.filter((entry) => !isNaN(parseInt(entry)) && parseInt(entry) <= announcements.length-1);

						for (idx of idxs_to_delete)
						{
							let i = parseInt(idx);
							utils.fn.remove_announcement(message.guild.id, announcements[i].ChannelID, announcements[i].Message, announcements[i].Frequency, announcements[i].NextPosting);
						}

						// Finish
						try
						{
							await message.channel.send(`Removed announcement(s) ${idxs_to_delete.join(", ")}`);
						}
						catch {}
					})
					.catch (collected =>
					{
						await message.channel.send(`Timed out! (120 s)`);
					});
			});
	}
}