// FINISHED
const utils = require('../utils.js');
const date = require('date-and-time');
const Discord = require('discord.js');

module.exports = 
{
	name: 'new_announcement', 
	aliases: ['na', 'newannouncement'], 
	description: 'Set a new auto-announcement. Be sure to set your server timezone first and use 24-hour format, and that \'mm\' is 00 or 30', 
	usage: '<#channel-tag> <interval> <yyyy-MM-dd-hh-mm> <message>', 
	examples: ["!na #announcements 24 2020-11-25-13-00 It is morning!"], 
	category: 'Announcements', 
	args: 4, 
	adminOnly: true, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		// Check arg validity
		// Channel tag
		let regex = /^<#([0-9]*)>$/;

		try
		{
			var channel_id = args[0].match(regex)[1];
		}
		catch
		{
			throw `${args[0]} is not a proper channel tag!`;
		}

		// Interval (positive integer >= 0)
		var interval = parseInt(args[1]);
		
		// It must be an integer between -12 and 14
		if (isNaN(interval) || interval < 0)
		{
			throw `${args[1]} is not a proper interval!`
		}

		// Date
		// get server timezine
		let server_tz = utils.fn.get_guild_entry(message.guild.id).Timezone;

		// get current time in utc and server timezone
		let time_utc = new Date();
		let time_server = new Date();
		time_server.setHours(time_server.getHours() + server_tz)

		let time_utc_int = parseInt(date.format(time_utc, 'YYYYMMDDHHmm', true));
		let time_server_int = parseInt(date.format(time_server, 'YYYYMMDDHHmm', true));

		// Check that the parsed arg[2] is > time_server_int. If it's not, throw an error with a reminder of the time
		regex = /^([0-9]{4}).([0-9]{2}).([0-9]{2}).([0-9]{2}).([03]0)$/
		let match = args[2].match(regex);

		try
		{
			var start_time = match[1] + match[2] + match[3] + match[4] + match[5];

			if (parseInt(start_time) <= time_server_int)
			{
				throw "Too early";
			}

			var start_time_server = date.parse(start_time, 'YYYYMMDDHHmm', true);
			var start_time_utc = date.parse(start_time, 'YYYYMMDDHHmm', true);
			start_time_utc.setHours(start_time_utc.getHours() - server_tz);			
		}
		catch (e)
		{
			// console.log(e);
			throw `${args[2]} is not a valid date! Be sure to format it as yyyy-mm-dd-hh-mm, where mm is 00 or 30, and at a time later than now (${date.format(time_server, 'YYYY-MM-DD-HH:mm', true)})`;
		}

		// Get message
		let msg = args.slice(3).join(" ");

		// With start_time_server and start_time_utc
		// Add announcement
		utils.fn.add_announcement(message.guild.id, channel_id, msg.slice(0, 2000), interval, parseInt(date.format(start_time_utc, 'YYYYMMDDHHmm', true)));

		// Notify
		var embed = new Discord.RichEmbed()
			.setTitle(`New announcement added`)
			.setDescription(msg.slice(0, 2000))
			.addField('Channel', `<#${channel_id}>`)
			.addField('Interval', `Every ${interval} hr(s)`);

		if (server_tz > 0)
		{
			embed.addField(`Next Posting (UTC+${server_tz})`, date.format(start_time_server, 'YYYY-MM-DD, HH:mm', true));
		}
		else
		{
			embed.addField(`Next Posting (UTC${server_tz})`, date.format(start_time_server, 'YYYY-MM-DD, HH:mm', true));
		}

		return await message.channel.send(embed);

		// mm = parseInt(now.getUTCMinutes());
		// // Round up or down to 00 or 30 minutes
		// if (15 <= mm && mm < 45) // 30
		// {
		// 	now.setMinutes(30);
		// }
		// else if (0 <= mm && mm < 15) // keep the hour at 00
		// {
		// 	now.setMinutes(0);
		// }
		// else // go forward one hour to 00
		// {
		// 	now.setMinutes(0);
		// 	date.addHours(now, 1);
		// }

		// // format as string
		// now = parseInt(date.format(now, 'YYYYMMDDHHmm', true));

		// let sql = `SELECT * FROM Announcements WHERE NextPosting = ?`;

		// return current_announcements = db.prepare(sql).all(now);
	}
}