// var utils = require('./utils.js');
const db_old = require('better-sqlite3')('./src/master-old.db');
const Discord = require('discord.js');

// Get all the characters
let sql_get = `SELECT * FROM Characters`;

var all_chars = db_old.prepare(sql_get).all();

for (char_entry of all_chars)
{	
	// Set any invalid ref URLs to null
	let ref_regex = /^https?:\/\/(?:.*)\.(?:png|jpg|gif)(?:\?width=[0-9]*&height=[0-9]*)?$/i;
	if (char_entry.RefURL && !char_entry.RefURL.match(ref_regex))
	{
		console.log(char_entry.CharName);
		console.log(char_entry.RefURL);

		let sql_set = `UPDATE Characters SET RefURL = ? WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db_old.prepare(sql_set).run(null, char_entry.GuildID, char_entry.CharNickname);
	}


	// Inventory
	let inventory_old = JSON.parse(char_entry.Inventory);
	let inventory_new = {};
	for (item of Object.keys(inventory_old))
	{
		if (item.match(/\(x[0-9]*\)/))
		{
			var amnt = parseInt(item.match(/\(x([0-9]*)\)/)[1]);
			var base = item.match(/^(.*) \(x[0-9]*\)/)[1];

			if (amnt > 9999)
			{
				amnt = 9999;
			}
			// console.log(char_entry.CharName);
			console.log(item);
			// console.log(base);
			// console.log(amnt);
		}
		else
		{
			var amnt = 1;
			var base = item;
		}

		let desc = inventory_old[item];
		inventory_new[base] = {amnt: amnt, desc: desc};
	}

	// Set new inventory
	let sql_set = `UPDATE Characters SET Inventory = ? WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
	db_old.prepare(sql_set).run(JSON.stringify(inventory_new), char_entry.GuildID, char_entry.CharNickname);

	// Set currency to 999 if above
	if (char_entry.Currency > 9999)
	{
		let sql_set = `UPDATE Characters SET Currency = 9999 WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db_old.prepare(sql_set).run(char_entry.GuildID, char_entry.CharNickname);
	}

	let other = {};
	// Add public talent
	if (char_entry.PublicTalent && char_entry.PublicTalent != "")
	{
		other["Public Talent"] = char_entry.PublicTalent;
	}

	// Add age
	if (char_entry.CharAge && char_entry.CharAge != "")
	{
		other["Age"] = char_entry.CharAge;
	}

	// Birthday
	if (char_entry.CharBirthday && char_entry.CharBirthday != "")
	{
		other["Birthday"] = char_entry.CharBirthday;
	}

	// Height
	if (char_entry.CharHeight && char_entry.CharHeight != "")
	{
		other["Height"] = char_entry.CharHeight;
	}

	// Weight
	if (char_entry.CharWeight && char_entry.CharWeight != "")
	{
		other["Weight"] = char_entry.CharWeight;
	}

	// Chest
	if (char_entry.CharChest && char_entry.CharChest != "")
	{
		other["Chest"] = char_entry.CharChest;
	}

	// Likes
	if (char_entry.Likes && char_entry.Likes != "")
	{
		other["Likes"] = char_entry.Likes;
	}

	// Dislikes
	if (char_entry.Dislikes && char_entry.Dislikes != "")
	{
		other["Dislikes"] = char_entry.Dislikes;
	}

	// Public Bio
	if (char_entry.PublicBio && char_entry.PublicBio != "")
	{
		other["Public Bio"] = char_entry.PublicBio;
	}

	// Appearance
	if (char_entry.PubliAppearance && char_entry.PublicAppearance != "")
	{
		other["Appearance"] = char_entry.PublicAppearance;
	}

	// Notes
	if (char_entry.Notes && char_entry.Notes != "")
	{
		other["Notes"] = char_entry.Notes;
	}

	// Add stats
	if (char_entry.Stats != '{}')
	{
		let stats = JSON.parse(char_entry.Stats)
		other = {...other, ...stats};
	}

	// Add Other
	if (other != {})
	{
		console.log(other);
		let sql_set = `UPDATE Characters SET Other = ? WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db_old.prepare(sql_set).run(JSON.stringify(other), char_entry.GuildID, char_entry.CharNickname);
	}
}

console.log("FINISHED");

process.on('SIGINT', () =>
	{
		db_old.close((err) =>
		{
			if (err)
			{
				console.error(err.message);
			}
		});
		console.log("Database connection closed")
		process.exit();
	}
);

