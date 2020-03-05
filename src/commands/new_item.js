const utils = require('../utils.js');

module.exports = 
{
	name: 'new_item', 
	aliases: ['newitem', 'ni'], 
	description: 'Add an item to the gacha. Default amount is unlimited. Add an image URL or paste it as an attachment (leave blank for none). You may specify an amount if you\'d like to limit the item. Be sure to enclose apostrophes within double quotes', 
	usage: '<item-name> [amount] [img-url] <description>', 
	examples: ["!ni 'Mineral Water' https://image-site.com/image.png It's tap water.", "!ni Glasses 2 For people who cannot see without vision correction", "!ni 'Red Scarf' 20 A scarf belonging to a certain masked hero.", "!ni \"Toko's Glasses\" For seeing things"], 
	category: 'Gacha', 
	args: 2, 
	adminOnly: true, 
	guildOnly: true,
	execute: async (message, args) =>
	{
		let item_name = args[0];

		let regex = /^https?:\/\/(?:.*)\.(?:png|jpg|gif)(?:\?width=[0-9]*&height=[0-9]*)?$/;

		if (!isNaN(args[1])) // args[1] is an amount
		{
			var amount = parseInt(args[1]);

			if (args[2].match(regex)) // check for url
			{
				var img_url = args[2];
				var desc = args.slice(3).join(" ");
			}
			else
			{
				var img_url = null;
				var desc = args.slice(2).join(" ");
			}
		}
		else if (args[1].match(regex))
		{
			var amount = null;
			var img_url = args[1];
			var desc = args.slice(2).join(" ");
		}
		else
		{
			var amount = null;
			var img_url = null;
			var desc = args.slice(1).join(" ");
		}

		if (!desc)
		{
			throw `You must provide some description!`;
		}

		// if img_url is null, check for an attachment
		if (!img_url)
		{
			try
			{
				var img_url = message.attachments.array()[0].url;

				// Check that it's an image url
				if (img_url.match(regex) == null)
				{
					return await message.channel.send("Please attach a .png, .jpg, or .gif!");
				}
			}
			catch (e)
			{
				// pass and leave it as null
			}
		}

		// console.log(item_name);
		// console.log(amount);
		// console.log(img_url);
		// console.log(desc);

		// Add to gacha
		utils.fn.add_gacha_entry(message.guild.id, item_name, amount, desc, img_url);

		if (amount != null)
		{
			var confirmation = `Added ${item_name} x${amount} to Gacha!\n*${desc}*`;
		}
		else
		{
			var confirmation = `Added ${item_name} to Gacha!\n*${desc}*`;
		}

		return await message.channel.send(confirmation);
	}
}