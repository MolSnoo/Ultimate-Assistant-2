// gitignore this file
const utils = require('../utils.js');
const displays = require('../displays.js');
const Discord = require('discord.js');

module.exports = 
{
	name: 'dev', 
	aliases: [], 
	description: 'Dev testing', 
	usage: ' ', // keep as a space if none. Otherwise, the convention is <"req_arg"> ["opt_arg"], quotations if necessary
	category: 'Dev', 
	// args: 2, // required number of args (not including optional)
	// adminOnly: true, 
	devOnly: true, 
	execute: async (message, args) =>
	{
		let guild_id = message.guild.id;
		let channel_id = message.channel.id;
		let player_id = message.author.id;
		let char_nickname = "Yui";
		// let char_entry = utils.fn.get_char_entry(message.guild.id, 'yui');

		try
		{
			let embed = new Discord.RichEmbed()
				.setThumbnail('https://vignette.wikia.nocookie.net/bandori/images/2/2a/My_Own_Pace.png');

			await message.channel.send(embed);
		}
		catch(e) 
		{
			console.log(e);
		}

		// let map_entries = utils.fn.get_guild_map(message.guild.id);
		// let map_embeds = displays.fn.guild_map(map_entries, message.guild);

		// for (embed of map_embeds)
		// {
		// 	await message.channel.send(embed);
		// }

		// utils.fn.pay_char(message.guild.id, 'yui', 3);
		// utils.fn.pay_all(message.guild.id, 2);
		// let embeds = displays.fn.inventory_embeds(char_entry);

		// for (embed of embeds)
		// {
		// 	await message.channel.send(embed);
		// }

		// console.log(utils.fn.random_color());
		// utils.fn.get_closest_member_match(message.guild, "Firelfy");
		// console.log(utils.fn.get_closest_role_match(message.guild, "Magsdl Girl").id);

		// utils.fn.get_player_character(message.guild.id, message.author.id);
		// utils.fn.get_char_entry(guild_id, "sd");
		// utils.fn.get_guild_chars("2353");
		// utils.fn.add_char_entry(guild_id, "some name", "yui");
		// utils.fn.remove_char_entry(guild_id, "adhfdg");
		// utils.fn.assign_char_to_id(guild_id, player_id, "sgs");
		// utils.fn.update_char_custom(guild_id, "yui", ["a", "b", "c", "e", "f", "g", "h"], ["F", "G", "H", "I", "J", "K"]);
		// utils.fn.update_char_entry(guild_id, char_nickname, ["Age", "Talent"], ["sfd", "sdf"]);
		// utils.fn.add_custom_roll(guild_id, "yui", "Strength", "4d3-5-2");
		// utils.fn.remove_custom_roll(guild_id, "riku", "dsf");
		// utils.fn.add_item_to_inventory(guild_id, char_nickname, "book"); 
		// utils.fn.add_item_to_inventory(guild_id, char_nickname, "pen", "it's a pen");
		// utils.fn.add_item_to_inventory(guild_id, char_nickname, "Ha-yoon's sports tape", "2");
		// utils.fn.add_item_to_inventory(guild_id, char_nickname, "grips", "2", "For bars");
		// utils.fn.remove_item_from_inventory(guild_id, char_nickname, "sdfd");
		// utils.fn.remove_item_from_inventory(guild_id, "Sdf", "grips");
		// utils.fn.remove_item_from_inventory(guild_id, char_nickname, "grips", "D");
		// utils.fn.remove_item_from_inventory(guild_id, char_nickname, "pen");
		// utils.fn.remove_item_from_inventory(guild_id, char_nickname, "book", 2);
		// utils.fn.remove_item_from_inventory(guild_id, char_nickname, "grips", 6);

		// console.log(utils.fn.get_guild_gacha("0"));
		// utils.fn.add_gacha_entry(guild_id, "sd", "Sdfasf", "asdf");
		// utils.fn.remove_gacha_entry(guild_id, "sdfsd");
		// utils.fn.update_gacha_entry(guild_id, "ssdf", "Description", "sd");

		// utils.fn.get_mod_roles(guild_id);
		// utils.fn.update_guild_entry(guild_id, ["AnonDMChannel","sdfsdf","Sdf"], ["3452354", "532"]);
		// utils.fn.remove_announcement("0", "0", "Default Message", 24, 202002090000);
		// console.log(utils.fn.get_guild_announcements(guild_id));

		// utils.fn.add_channel_to_map("326236", "324523", "235434");
		// utils.fn.remove_channel_from_map("dsg");
		// utils.fn.add_map_connections("sfd", "453475");

		// utils.fn.add_investigation(guild_id, channel_id, ["item"], "Some info on this item", 1, 1);
		// utils.fn.remove_investigation(channel_id, "item name3");
		// console.log(utils.fn.get_investigation(channel_id, "item name5", "riku"));
		// utils.fn.steal_investigation(channel_id, "item name3", "Yui");
	}
}