// FINISHED
const Discord = require('discord.js');
const utils = require('../utils.js');

module.exports = 
{
	name: 'roll', 
	aliases: ['r'], 
	description: 'Roll dice with d20 notation. If you have custom rolls, you may specify one', 
	usage: '<d20 notation> | <custom-roll-name>', 
	examples: ["!r 2d20-2", "!r 2d10+d8-2", "!r dex"], 
	category: 'Dice', 
	args: 1, // One argument needed, but may be spread across multiple
	guildOnly: true, 
	execute: async (message, args) =>
	{
		// get member
		const message_member = await utils.fn.get_message_member(message);

		// check for a custom roll
		try
		{
			var char_nickname = utils.fn.get_player_character(message.guild.id, message.author.id);
			var char_rolls = utils.fn.get_char_entry(message.guild.id, char_nickname).CustomRolls;
			
			if (char_rolls[args[0].toLowerCase()]) // throws error if its not in there
			{
				var roll_str = char_rolls[args[0].toLowerCase()].replace(/\s/g, '');
			}
			else 
			{
				throw "Not a custom roll"
			}
		}
		catch (e)
		{
			// Account for arguments spread across multiple spaces
			var roll_str = args.join('').replace(/\s/g, '');
		}


		regex = /[+-]/g
		let roll_arr = roll_str.replace(regex, ' ').split(' ');
		let op_arr = roll_str.match(regex); //.unshift('+');
		
		var results = [];
		for (let i = 0; i < roll_arr.length; i++)
		{
			// get everything between the operations (ndm notation or a constant)
			let element = roll_arr[i];
			if (element.match(/^[0-9]*$/)) // a constant number
			{
				results[i] = [parseInt(element)];
			}
			else if (element.match(/^[0-9]*d[0-9]+$/i)) // ndm 
			{
				d20_str = element.toLowerCase().split('d');
				
				// 1d20 may be written as d20, omitting the 1
				if (d20_str[0] == '')
				{
					var num_dice = 1;
				}
				else
				{
					var num_dice = parseInt(d20_str[0]);
					if (num_dice > 250)
					{
						throw `${num_dice} is too many to roll! Please stay under 250d`;
					}
				}

				var dice_val = parseInt(d20_str[1]);
				if (dice_val > 1000000)
				{
					throw `${dice_val} is too high! Please stay below 1 million`;
				}
				
				let these_vals = [];
				for (let n = 0; n < num_dice; n++)
				{
					these_vals[n] = Math.floor(Math.random() * (dice_val) + 1);	
				}

				results[i] = these_vals;
			}
			else // invalid
			{
				throw `${element} is not a valid roll!`;
			}
		}

		// sum every array in results and add/subtract
		let summed_results = [];

		// start total off with the sum of results[0] since that is always implicitly added
		var total = results[0].reduce((a, b) => a + b, 0);
		summed_results[0] = total;
		for (let j = 1; j < results.length; j++)
		{
			let op = op_arr[j-1];
			let this_sum = results[j].reduce((a, b) => a + b, 0);
			total += parseInt(op + this_sum);
			summed_results[j] = this_sum;
		}

		try
		{
			var detailed_str = results.map((element, idx) => [element, op_arr[idx]]).flat().filter(Boolean).join(" ").slice(0, 1000);
			var sum_str = summed_results.map((element, idx) => [element, op_arr[idx]]).flat().filter(Boolean).join(" ").slice(0, 800);
		}
		catch // Hacky fix for case where only one dice is rolled without modifiers
		{
			var detailed_str = results[0].join(",");
			var sum_str = summed_results[0];
		}

		// discord Embed
		if (message_member.nickname)
		{
			var name = message_member.nickname;
		}
		else
		{
			var name = message.author.username;
		}
		let embed = new Discord.RichEmbed()
			.setTitle(`${name} rolls ${roll_str.slice(0, 150)}`)
			.setDescription(detailed_str)
			.addField(sum_str, `= **${total}**`);

		return await message.channel.send(embed);
	}
}