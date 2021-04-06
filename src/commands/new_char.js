const utils = require('../utils.js');

module.exports = 
{
	name: 'new_char', 
	aliases: ['newchar', 'nc'], 
	description: 'Assign a new character to a player. You may either ping the player or enter their full username (do not use server nicknames).', 
	usage: '<char-nickname> <player-username> <char name>', 
	examples: ["!nc yui Firefly Yui Yamashita", "!nc yui 'username with spaces' Yui Yamashita", "!nc yui `@Firefly` Yui Yamashita"], 
	category: 'Characters', 
	args: 3, 
	adminOnly: true, 
	guildOnly: true,
	reqBot: true, 
	execute: async (message, args, bot) =>
	{
		// Allow a user ping or a username
		let player_id_match = args[1].match(/^<@!?([0-9]*)>$/);
		if (player_id_match)
		{
			// const guild_members = await message.guild.fetchMembers();
			var player_id = player_id_match[1];
			// var player_obj = guild_members.members.find((member) => member.user.id == player_id).user;
			var player_obj = await bot.users.fetch(player_id)
		}
		else
		{
			// Get closest match to user
			var player_obj = utils.fn.get_closest_member_match(message.guild, args[1]);
			var player_id = player_obj.id;
		}

		// Parse nickname and check that it's not a repeat (because the error throwing does not seem to work from the database calling functions in async)
		var char_nickname = args[0];

		try
		{
			var guild_chars = utils.fn.get_guild_chars(message.guild.id).map((char_entry) => char_entry.CharNickname.toLowerCase());
		}
		catch // case where there are no characters
		{
			var guild_chars = [];
		}

		if (guild_chars.includes(char_nickname.toLowerCase()))
		{
			throw `The nickname '${char_nickname}' is already in ${message.guild}!`;
		}

		var char_name = args.slice(2).join(" ");

		await message.channel.send(`Name: ${char_name} \nNickname: ${char_nickname} \nPlayer: ${player_obj.username}`);

		// Collect response
		const filter = (msg) => {
			msg.author.id == message.author.id && msg.channel.id == message.channel.id
		};
		const options = {maxMatches: 1, time: 120000, errors: ['time']};
		// const collector = message.channel.createCollector(filter, options);

		// collector.on('collect', async (msg) => {
		// 	const response = msg.content.toLowerCase();
		// 	if (response == 'y' || response == 'yes')
		// 	{
		// 		utils.fn.add_char_entry(message.guild.id, player_id, char_name, char_nickname);
		// 		utils.fn.set_player_character(message.guild.id, player_id, char_nickname);
		// 		await message.channel.send(`Added ${char_name} to ${message.guild}`);
		// 	}
		// 	else
		// 	{
		// 		await message.channel.send(`${char_name} not confirmed`);
		// 	}
		// });

		message.channel.send(`Confirm ${char_name}? (y/n)`)
			.then (() => 
			{
				message.channel.awaitMessages(filter, options)
					.then (async collected => 
					{
						const response = collected.first().content.toLowerCase();
						if (response == 'y' || response == 'yes')
						{
							utils.fn.add_char_entry(message.guild.id, player_id, char_name, char_nickname);
							utils.fn.set_player_character(message.guild.id, player_id, char_nickname);
							await message.channel.send(`Added ${char_name} to ${message.guild}`);
						}
						else
						{
							await message.channel.send(`${char_name} not confirmed`);
						}
					})
					.catch (async collected =>
					{
						await message.channel.send(`Timed out! (120 s)`);
					});
			});
	}
}