// These functions take database entries rather than re-querying the database
const Discord = require('discord.js');
const utils = require('./utils.js');
const date = require('date-and-time');
exports.fn = 
{
	// Character info
	char_embed: (char_entry) =>
	{
		var embed = new Discord.MessageEmbed()
			.setColor(`0x${char_entry.EmbedColor}`)
			.setTitle(char_entry.CharName)
			.setDescription(`Nickname: ${char_entry.CharNickname}`);

		try
		{
			embed.setThumbnail(char_entry.RefURL);
		}
		catch {}

		// Add fields
		var fields = char_entry.Other;

		for (field_key of Object.keys(fields))
		{
			if (fields[field_key] != "")
			{
				embed.addField(field_key.slice(0, 50), fields[field_key].slice(0, 250), inline=false);
			}
		}

		return embed;
	}, 

	// A simple embedded list of guild characters and nicknames
	all_guild_chars: (char_entries, guild_name) =>
	{
		var embed = new Discord.MessageEmbed()
			.setTitle(`Characters in ${guild_name}`);

		var desc = "";
		for (char of char_entries)
		{
			desc += `${char.CharName}: ${char.CharNickname}\n`;
		}

		embed.setDescription(desc.slice(0, 2000));

		return embed;
	}, 

	// Return an array of embeds
	inventory_embeds: (char_entry) =>
	{
		// 20 field limit
		// 75 char title
		// 50 char item names
		// 275 descs

		let n_embeds = Math.ceil(Object.keys(char_entry.Inventory).length / 20);
		var embeds = [];

		for (let i = 0; i < n_embeds; i++)
		{
			embeds[i] = new Discord.MessageEmbed()
				.setColor(`0x${char_entry.EmbedColor}`)

			// Title the first embed
			if (i == 0)
			{
				embeds[i].setTitle(`Inventory for ${char_entry.CharName}`.slice(0, 75));
			}

			for (let j = 0; j < 20; j++)
			{
				// shift the first key from the Inventoro
				let item_name = Object.keys(char_entry.Inventory)[0];
				let item_entry = char_entry.Inventory[item_name];
				delete char_entry.Inventory[item_name];

				try
				{
					// Title
					if (item_entry.amnt > 1)
					{
						var title = `${item_name} (${item_entry.amnt})`;
					}
					else
					{
						var title = item_name;
					}
					if (!item_entry.desc)
					{
						item_entry.desc = "No desc";
					}
					embeds[i].addField(title.slice(0, 50), item_entry.desc.slice(0, 275))
				}
				catch
				{
					break;
				}
			}
		}

		return embeds;
	}, 

	// Custom rolls
	custom_rolls: (char_entry) =>
	{
		var embed = new Discord.MessageEmbed()
			.setColor(`0x${char_entry.EmbedColor}`)
			.setTitle(`Custom Rolls for ${char_entry.CharName}`)
	

		// Add fields
		var fields = char_entry.CustomRolls;

		for (field_key of Object.keys(fields))
		{
			if (fields[field_key] != "")
			{
				embed.addField(field_key.slice(0, 50), fields[field_key].slice(0, 50), inline=false);
			}
		}

		return embed;
	}, 

	// Announcements (limits to one embed)
	announcements: (announcement_entries, guild_entry, guild_name) =>
	{
		var timezone = guild_entry.Timezone;

		if (timezone < 0)
		{
			var title = `Announcements in ${guild_name} (UTC${timezone})`.slice(0, 100);
		}
		else
		{
			var title = `Announcements in ${guild_name} (UTC+${timezone})`.slice(0, 100);
		}

		var embed = new Discord.MessageEmbed()
			.setTitle(title);

		var counter = 0;
		for (announcement of announcement_entries)
		{
			let next_posting_obj = date.parse(announcement.NextPosting.toString(), 'YYYYMMDDHHmm');

			// Convert to timezone
			next_posting_obj.setHours(next_posting_obj.getHours() + timezone);

			// Make string
			let time_str = date.format(next_posting_obj, 'ddd, D MMM YYYY, HH:mm');

			embed.addField(`[${counter}] **${time_str}**`, `**In <#${announcement.ChannelID}>**\n**Every ${announcement.Frequency} hr(s)**\n${announcement.Message}`.slice(0, 250));

			counter++;
		}

		return embed;
	}, 

	guild_gacha: (gacha_entries, guild_name) =>
	{
		let n_embeds = Math.ceil(gacha_entries.length / 20);
		var embeds = [];

		var counter = 0;
		for (let i = 0; i < n_embeds; i++)
		{
			embeds[i] = new Discord.MessageEmbed()

			// Title the first embed
			if (i == 0)
			{
				embeds[i].setTitle(`Gacha for ${guild_name}`.slice(0, 75));
			}

			for (let j = 0; j < 20; j++)
			{
				// shift the first item from the list
				let item_entry = gacha_entries.shift();

				try
				{
					// Title
					if (!item_entry.Amount)
					{
						var amnt = "inf";
					}
					else
					{
						var amnt = item_entry.Amount;
					}

					embeds[i].addField(`[${counter}] ${item_entry.ItemName.slice(0, 50)} (${amnt})`, item_entry.Description.slice(0, 275))
					counter++;
				}
				catch (e)
				{
					break;
				}
			}
		}

		return embeds;
	}, 

	gacha_pull: (gacha_entry, char_entry) =>
	{
		embed = new Discord.MessageEmbed()
			.setColor(utils.fn.random_color())
			.setTitle(`${char_entry.CharName} pulls ${gacha_entry.ItemName}!`.slice(0, 200))
			.setDescription(`*${gacha_entry.Description.slice(0, 2000)}*`)
			.setFooter(`${gacha_entry.ItemName} added to inventory.\n${char_entry.Currency-1} pulls remaining`);

		if (gacha_entry.ImageURL)
		{
			embed.setThumbnail(gacha_entry.ImageURL);
		}

		return embed;
	}, 

	anon_dm_private: (sender_obj, recipient_obj, guild_obj, recipient_nickname, content) =>
	{
		let embed = new Discord.MessageEmbed()
			.setTitle(`${recipient_nickname} has received an Anonymous Message!`)
			.setDescription(content.slice(0, 2000))
			.setFooter(`A receipt of this message has been sent to the admins of ${guild_obj}. The developer is not responsible for the contents of anonymous DMs.`);

		return embed;
	}, 

	anon_dm_receipt: (sender_obj, recipient_obj, content) =>
	{
		let embed = new Discord.MessageEmbed()
			.setTitle(`${sender_obj.username} has sent an Anonymous Message to ${recipient_obj.username}`)
			.setDescription(content.slice(0, 2000))
			.setFooter('The developer is not responsible for the contents of anonymous DMs.');

		return embed;
	}, 

	guild_map: (channel_entries, guild_obj) => 
	{
		var channel_names = new Object();
		
		// Get channel names for convenience
		for (channel of guild_obj.channels.cache)
		{
			channel_names[channel[0]] = channel[1].name;
		}

		let embeds = [];

		// 25 channels per embed
		let n_embeds = Math.ceil(channel_entries.length / 25);

		for (let i = 0; i < n_embeds; i++)
		{
			embeds[i] = new Discord.MessageEmbed();

			for (let j = 0; j < 25; j++)
			{
				// shift the first item from the list
				let channel_entry = channel_entries.shift();

				try
				{
					let connection_str = "";
					for (let k = 0; k < channel_entry.OutgoingConnections.length; k++)
					{
						connection_str += `\n${channel_names[channel_entry.OutgoingConnections[k]]}`;
					}

					if (connection_str != "")
					{
						embeds[i].addField(channel_names[channel_entry.ChannelID].slice(0, 30), connection_str.slice(0, 200));
					}
					else
					{
						embeds[i].addField(channel_names[channel_entry.ChannelID].slice(0, 30), "No connections");
					}
				}
				catch (e)
				{
					break;
				}
			}
		}

		return embeds;
	}, 

	// This one returns the reordered list of investigation_entries
	guild_investigations: (investigation_entries, guild_obj) =>
	{
		let n_embeds = investigation_entries.length;
		var embeds = [];

		// Order
		var counter = 0;
		
		var channel_ids = new Set(investigation_entries.map((entry) => entry.ChannelID));

		// Keep an ordered list of the channels and names to return
		var ordered_list = [];
		var idx = 0;
		for (channel_id of channel_ids)
		{
			// Make embed
			embeds[idx] = new Discord.MessageEmbed()
				.setTitle(`Investigatables in #${guild_obj.channels.cache.find((channel) => channel.id == channel_id).name}`.slice(0, 100));
			
			let channel_investigation_entries = investigation_entries.filter((entry) => entry.ChannelID == channel_id);

			for (entry of channel_investigation_entries)
			{
				ordered_list.push({ChannelID: entry.ChannelID, ItemNames: JSON.parse(entry.ItemNames)});

				let val = "";

				if (entry.IsPublic)
				{
					val  += "**Public**: Yes";
				}
				else
				{
					val += "**Public**: No";
				}

				// Finders should be a list of strings of character nicknames
				val += `\n**Found by**: ${JSON.parse(entry.Finders).join(", ")}`;

				if (entry.Stealer != "No one")
				{
					val += `\n**Stolen by**: ${entry.Stealer}`;
				}

				// Add the description
				val += `\n${entry.ItemInfo}`;

				embeds[idx].addField(`[${counter}] ${JSON.parse(entry.ItemNames).join(", ")}`.slice(0, 35), val.slice(0, 275));
				counter++;
			}
			idx++;
		}

		return {embeds: embeds, list: ordered_list};
	}, 
}