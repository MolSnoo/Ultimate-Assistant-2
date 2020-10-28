const date = require('date-and-time');

const db = require('better-sqlite3')('./src/master-test.db');
console.log("Connected to database");

exports.fn = 
{
//------------------------------ MISC. ------------------------------//

	// Taken from https://github.com/trekhleb/javascript-algorithms
	levenshtein: (a, b) =>
	{
		if(a.length == 0) return b.length; 
    	if(b.length == 0) return a.length; 
  
	    var matrix = [];
	  
	    // increment along the first column of each row
	    var i;
	    for(i = 0; i <= b.length; i++)
	    {
	      matrix[i] = [i];
	    }
	  
	    // increment each column in the first row
	    var j;
	    for(j = 0; j <= a.length; j++)
	    {
	      matrix[0][j] = j;
	    }
	  
	    // Fill in the rest of the matrix
	    for(i = 1; i <= b.length; i++)
	    {
	      for(j = 1; j <= a.length; j++)
	      {
	        if(b.charAt(i-1) == a.charAt(j-1))
	        {
	          matrix[i][j] = matrix[i-1][j-1];
	        } else {
	          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
	                                  Math.min(matrix[i][j-1] + 1, // insertion
	                                           matrix[i-1][j] + 1)); // deletion
	        }
	      }
	    }
	  
	    return matrix[b.length][a.length];
	}, 

	argmin: (arr) =>
	{
		if (arr.length == 0)
		{
			return -1;
		}
		let min = arr[0];
		let min_idx = 0;

		for (let i = 1; i < arr.length; i++)
		{
			if (arr[i] < min)
			{
				min_idx = i;
				min = arr[i];
			}
		}

		return min_idx
	}, 

	argmax: (arr) =>
	{
		if (arr.length == 0)
		{
			return -1;
		}
		let max = arr[0];
		let max_idx = 0;

		for (let i = 1; i < arr.length; i++)
		{
			if (arr[i] > max)
			{
				max_idx = i;
				max = arr[i];
			}
		}

		return max_idx
	}, 

	to_title_case: (str) =>
	{
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}, 

	random_color: () =>
	{
		return Math.floor(Math.random()*16777215).toString(16);
	}, 

	get_guild_prefixes: () =>
	{
		let sql = `SELECT GuildID, Prefix FROM GuildData`;
		return db.prepare(sql).all();
	}, 

	// Return the member object
	get_closest_member_match: (guild_obj, input) =>
	{
		let all_members = guild_obj.members.map((member) => member.user.username);
		let lev_distances = all_members.map((member) => this.fn.levenshtein(member, input));
		let closest_match_idx = this.fn.argmin(lev_distances);

		let all_member_objs = guild_obj.members.map((member) => member.user);
		return all_member_objs[closest_match_idx];
	}, 

	// returns a Promise <Member>
	get_message_member: (msg_obj) => 
	{
		try
		{
			return msg_obj.guild.fetchMember(msg_obj.author);
		}
		catch {}
	}, 

	// Return the role object
	get_closest_role_match: (guild_obj, input) =>
	{
		let all_roles = guild_obj.roles.map((role) => role.name);
		let lev_distances = all_roles.map((role) => this.fn.levenshtein(role, input));
		let closest_match_idx = this.fn.argmin(lev_distances);

		return guild_obj.roles.map((role) => role)[closest_match_idx];
	}, 

	// return the channel obj
	// Return the role object
	get_closest_channel_match: (guild_obj, input) =>
	{
		let all_channels = guild_obj.channels.map((channel) => channel.name);
		let lev_distances = all_channels.map((channel) => this.fn.levenshtein(channel, input));
		let closest_match_idx = this.fn.argmin(lev_distances);

		return guild_obj.channels.map((channel) => channel)[closest_match_idx];
	},

	close_db: () =>
	{
		db.close((err) =>
			{
				if (err)
				{
					console.error(err.message);
				}
			}
		);
	}, 

//---------------------------- CHARACTER ----------------------------//

	// get the PlayingAs character (nickname only) for a user ID within a guild
	// They can only be one at a time
	// Throws error if the player does not have an assigned character
	get_player_character: (guild_id, player_id) =>
	{
		let sql = `SELECT PlayingAs FROM UserData WHERE GuildID = ? AND UserID = ? LIMIT 1`;

		try
		{
			var char_nickname = db.prepare(sql).get(guild_id, player_id).PlayingAs;
			return char_nickname;
		}
		catch
		{
			throw `Could not fetch any character!`;
		}
	}, 

	// Set the nickname. Make the entry if it doesn't exist
	set_player_character: (guild_id, player_id, char_nickname) =>
	{
		let sql_get = `SELECT * FROM UserData WHERE GuildID = ? AND UserID = ? LIMIT 1`;

		let player_exists = db.prepare(sql_get).get(guild_id, player_id);

		if (player_exists)
		{
			var sql = `UPDATE UserData SET PlayingAs = ? WHERE GuildID = ? AND UserID = ? LIMIT 1`;
		}
		else
		{
			var sql = `INSERT INTO UserData (PlayingAs, GuildID, UserID) VALUES (?, ?, ?)`;
		}
		db.prepare(sql).run(this.fn.to_title_case(char_nickname), guild_id, player_id);
	}, 

	// Should only be called when character nickname is verified and updated
	change_playingas_nickname: (guild_id, old_nickname, new_nickname) =>
	{
		let sql = `UPDATE UserData SET PlayingAs = ? WHERE GuildID = ? AND PlayingAs = ? COLLATE NOCASE LIMIT 1`;
		db.prepare(sql).run(this.fn.to_title_case(new_nickname), guild_id, old_nickname);
	}, 

	// throws message if the nickname does not exist for guildID
	get_char_entry: (guild_id, char_nickname) =>
	{
		let sql = `SELECT * FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		let row = db.prepare(sql).get(guild_id, char_nickname);

		if (row)
		{
			// Cast the JSON strings to proper objects
			row.Inventory = JSON.parse(row.Inventory);
			row.CustomRolls = JSON.parse(row.CustomRolls);
			row.Other = JSON.parse(row.Other);

			return row;
		}
		else
		{
			throw `There is no character nicknamed ${char_nickname} in this server!`;
		}
	},

	// returns array of objects for character
	// throws error mesasge if there are no characters in the guild
	get_guild_chars: (guild_obj) =>
	{
		let sql = `SELECT * FROM Characters WHERE GuildID = ?`;
		let chars = db.prepare(sql).all(guild_obj.id);

		if (chars.length != 0)
		{
			return chars;
		}
		else
		{
			throw `There are no characters in ${guild_obj}`;
		}
	}, 

	// Initializes a new character entry if it doesn't exist already
	// Throws error if the entry already existed
	add_char_entry: (guild_id, owner_id, char_name, char_nickname) =>
	{
		// check if char_nickname is already taken
		let sql_get = `SELECT CharNickname FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		var char_exists = db.prepare(sql_get).get(guild_id, char_nickname);

		if (!Boolean(char_exists))
		{
			let sql = `INSERT INTO Characters (GuildID, OWnerID, CharName, CharNickname) VALUES (?, ?, ?, ?)`;
			db.prepare(sql).run(guild_id, owner_id, char_name, char_nickname);
		}
		else
		{
			throw `A character with the nickname ${char_nickname} already exists in this server. Please choose a different one`;
		}
	}, 

	// Remove a character 
	// Delete user entry as well iff they are playing that character
	// Gives a warning if that character didn't exist
	remove_char_entry: (guild_id, char_nickname) =>
	{
		let sql = `DELETE FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		let del = db.prepare(sql).run(guild_id, char_nickname);
		
		if (del.changes == 0)
		{
			throw `There is no character with the nickname ${char_nickname} in this server`;
		}

		sql = `SELECT UserID FROM UserData WHERE GuildID = ? AND PlayingAs = ? COLLATE NOCASE LIMIT 1`;

		del = db.prepare(sql).get(guild_id, char_nickname);

		if (del && del.UserID)
		{
			sql = `DELETE FROM UserData WHERE GuildID = ? AND PlayingAs = ? COLLATE NOCASE LIMIT 1`;
			db.prepare(sql).run(guild_id, char_nickname);
			throw `<@${del.UserID}> has been removed along with their character, ${char_nickname}!`;
		}
	}, 

	// Assign a character to an ID by checking if it exists in Characters and adding it to UserData (may need to initialize the entry if it's the player's first character in a guild
	// Returns true if it works, false if it fails (character was not initialized)
	assign_char_to_id: (guild_id, user_id, char_nickname) =>
	{
		// Check if char nickname is in the database
		let sql_get = `SELECT CharNickname FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		var char_exists = Boolean(db.prepare(sql_get).get(guild_id, char_nickname));

		// Check if user and guild id are in User Data
		sql_get = `SELECT * FROM UserDATA WHERE GuildID = ? AND UserID = ? LIMIT 1`;
		var user_exists = Boolean(db.prepare(sql_get).get(guild_id, user_id));

		if (!char_exists) // bad
		{
			throw `There is no character with the nickname ${char_nickname}`;
		}
		else if (user_exists) // good
		{
			let sql_set = `UPDATE UserData SET PlayingAs = ? WHERE GuildID = ? AND UserID = ? LIMIT 1`;
			db.prepare(sql_set).run(char_nickname, guild_id, user_id);
		}
		else // need to make user
		{
			let sql_new = `INSERT INTO UserDATA (GuildID, UserID, PlayingAs) VALUES (?, ?, ?)`;
			db.prepare(sql_new).run(guild_id, user_id, char_nickname);
		}
	}, 

	// Take an array of fields that are strings and an array of corresponding values
	// Only applies to the custom fields. Other fields are handled separately for optimality
	// Can also be used to add new custom fields to a character as new fields are automatically appended to object
	// Returns true if it the user stays within the limit, otherwise returns false
	update_char_custom: (guild_id, char_nickname, fields, values) =>
	{
		let sql_get = `SELECT Other FROM Characters WHERE GuildID = ? and CharNickname = ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var char_fields = JSON.parse(db.prepare(sql_get).get(guild_id, char_nickname).Other);
		}
		catch
		{
			throw `${char_nickname} does not exist in this server!`;
		}

		// handle the case where fields is only one thing
		if (typeof fields  == 'string')
		{
			fields = [fields];
			values = [values];
		}

		// Make sure fields and values are the same length
		if (fields.length != values.length)
		{
			throw `You gave ${fields.length} fields and ${values.length} values!`;
		}

		for (let i = 0; i < fields.length; i++)
		{
			char_fields[this.fn.to_title_case(fields[i])] = values[i]; 
		}

		if (Object.keys(char_fields).length <= 20)
		{
			let sql_set = `UPDATE Characters SET Other = ? WHERE GuildID = ? and CharNickname = ? COLLATE NOCASE LIMIT 1`;
			db.prepare(sql_set).run(JSON.stringify(char_fields), guild_id, char_nickname);
		}
		else
		{
			throw "You have already reached or just broken the limit for custom fields (20)";
		}
	}, 

	// Remove one or more fields from custom for a single character
	// Bulk removal handled in a loop in bot command. Doesn't seem to be a much more efficient way to do it since there can well be unique data that needs to persist
	remove_char_custom_fields: (guild_id, char_nickname, field_names) =>
	{
		if (typeof field_names == 'string')
		{
			field_names = [field_names];
		}

		let sql_get = `SELECT Other FROM Characters WHERE GuildID = ? and CharNickname = ? COLLATE NOCASE LIMIT 1`;
		let char_fields = JSON.parse(db.prepare(sql_get).get(guild_id, char_nickname).Other);

		for (field of field_names)
		{
			delete char_fields[this.fn.to_title_case(field)]; // doesn't throw any error for a non-existent field
		}

		let sql_set = `UPDATE Characters SET Other = ? WHERE GuildID = ? and CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(char_fields), guild_id, char_nickname);
	}, 

	// Use this to update anything in Characters that isn't Inventory, CustomRolls, or Other
	// Pass either a single argument with one field/value or an array of multiple corresponding fields/values
	// Aka, the fields must be CharName, CharNickname, RefURL, EmbedColor, Currency, most of which need checking
	update_char_entry: (guild_id, char_nickname, fields, values) =>
	{
		try
		{
			fields[fields.length-1] = fields[fields.length-1] + ' = ?';
			fields = fields.join(' = ?, ');
		}
		catch 
		{
			fields = fields + ' = ?';
		}

		let sql = `UPDATE Characters SET ${fields} WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		
		try
		{
			var char_exists = db.prepare(sql).run(values, guild_id, char_nickname);
		}
		catch (e)
		{
			throw `Could not edit ${char_nickname}.`;
		}

		if (char_exists.changes == 0)
		{
			throw `${char_nickname} does not exist in this server`;
		}
	}, 

	// Add a custom roll (Doesn't check if it's correct)
	// Should overwrite the name if exists. 
	// Auto cast to lower case for consistency
	// Limit of 25 (throw error if limit is already reached)
	add_custom_roll: (guild_id, char_nickname, roll_name, roll_str) =>
	{
		let sql_get = `SELECT CustomRolls FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var custom_rolls = JSON.parse(db.prepare(sql_get).get(guild_id, char_nickname).CustomRolls);
		}
		catch
		{
			throw `${char_nickname} does not exist in this server`;
		}

		// Check length
		if (custom_rolls.length == 25)
		{
			throw `${char_nickname} has already reached the 25 roll limit for custom rolls!`;
		}

		custom_rolls[roll_name.toLowerCase()] = roll_str.toLowerCase();

		let sql_set = `UPDATE Characters SET CustomRolls = ? WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(custom_rolls), guild_id, char_nickname);
	}, 

	// Remove a custom roll. Cast to lower case
	remove_custom_roll: (guild_id, char_nickname, roll_name) =>
	{
		let sql_get = `SELECT CustomRolls FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var custom_rolls = JSON.parse(db.prepare(sql_get).get(guild_id, char_nickname).CustomRolls);
		}
		catch (e)
		{
			throw `${char_nickname} does not exist on this server`;
		}

		// delete
		try
		{
			delete custom_rolls[roll_name.toLowerCase()];
		}
		catch
		{
			throw `${char_nickname} does not have a roll named ${roll_name}`;
		}

		let sql_set = `UPDATE Characters SET CustomRolls = ? WHERE GuildID = ? AND CharNickname = ? LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(custom_rolls), guild_id, char_nickname);
	}, 

	// Add item to inventory (check for repeats)
	// Items are case insensitive
	add_item_to_inventory: (guild_id, char_nickname, item_name, item_amount=null, item_desc=null) =>
	{
		item_name = this.fn.to_title_case(item_name);

		if (!item_amount && !item_desc) // both null
		{
			item_amount = 1;
			item_desc = "N/A";
		}
		else if (item_amount && !item_desc) // One argument
		{
			// Check if item_amount is a number or desc
			if (isNaN(item_amount)) // arg is description
			{
				item_desc = item_amount;
				item_amount = 1;
			}
			else // arg is amount
			{
				item_desc = "N/A";
				item_amount = parseInt(item_amount);
			}
		}
		else // Both arguments
		{
			item_amount = parseInt(item_amount);
		}

		if (item_amount > 9999)
		{
			item_amount = 9999;
		}

		// get inventory
		let sql_get = `SELECT Inventory FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var inventory = JSON.parse(db.prepare(sql_get).get(guild_id, char_nickname).Inventory);
		}
		catch
		{
			throw `${char_nickname} does not exist in this server!`;
		}

		// check if the item already exists (case insensitive bc of title case conversion
		if (inventory[item_name])
		{
			if (item_amount + inventory[item_name].amnt > 9999)
			{
				inventory[item_name].amnt = 9999;
			}
			else
			{
				inventory[item_name].amnt = item_amount + inventory[item_name].amnt;
			}
		}
		else
		{
			inventory[item_name] = {};
			inventory[item_name].amnt = item_amount;
			inventory[item_name].desc = item_desc;
		}

		// set entry
		let sql_set = `UPDATE Characters SET Inventory = ? WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(inventory), guild_id, char_nickname); 
	}, 

	// Remove item
	remove_item_from_inventory: (guild_id, char_nickname, item_name, item_amount=1) =>
	{
		// Check number validity and title case the name
		if (isNaN(item_amount))
		{
			throw `${item_amount} is not a proper number!`;
		}
		else
		{
			item_amount = parseInt(item_amount);
			item_name = this.fn.to_title_case(item_name);
		}

		// Get existing inventory
		let sql_get = `SELECT Inventory FROM Characters WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var inventory = JSON.parse(db.prepare(sql_get).get(guild_id, char_nickname).Inventory);
		}
		catch
		{
			throw `${char_nickname} does not exist in this server!`;
		}

		// replace
		if (inventory[Object.keys(inventory).find(key => this.fn.to_title_case(key) == item_name)])
		{
			
			let old_amount = inventory[Object.keys(inventory).find(key => this.fn.to_title_case(key) == item_name)].amnt;
			if (old_amount - item_amount <= 0)
			{
				delete inventory[Object.keys(inventory).find(key => this.fn.to_title_case(key) == item_name)];
			}
			else
			{
				inventory[Object.keys(inventory).find(key => this.fn.to_title_case(key) == item_name)].amnt = old_amount - item_amount;
			}
		}
		else
		{
			throw `${item_name} is not in the inventory for ${char_nickname}!`;
		}

		// Edit entry
		let sql_set = `UPDATE Characters SET Inventory = ? WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(inventory), guild_id, char_nickname);
	}, 

//------------------------------ GACHA ------------------------------//
	
	// Returns array of the row objects
	get_guild_gacha: (guild_id) =>
	{
		let sql = `SELECT * FROM Gacha WHERE GuildID = ?`;
		let rows = db.prepare(sql).all(guild_id);

		if (rows.length == 0)
		{
			throw "There are no gacha items set up for this server";
		}

		return rows;
	}, 

	// Add an entry with an optional image. Checks that nothing in that guild has the same name (case insensitive)
	// Limit 500 per guild
	// Returns true of it works, false if not
	add_gacha_entry: (guild_id, item_name, item_amount=1, description, img=null) =>
	{
		let sql_count = `SELECT COUNT() FROM Gacha WHERE GuildID = ?;`
		let count = db.prepare(sql_count).all(guild_id);

		if (count[0]['COUNT()'] == 500)
		{
			throw `You have reached the 500 item limit for this server!`;
		}

		// make sure nothing has the same name for that guild
		let sql_get = `SELECT ItemName FROM Gacha WHERE GuildID = ? AND ItemName = ? COLLATE NOCASE LIMIT 1`;
		var item_exists = db.prepare(sql_get).get(guild_id, item_name);

		if (!Boolean(item_exists))
		{
			let sql_set = `INSERT INTO Gacha (GuildID, ItemName, Description, ImageURL, Amount) VALUES (?, ?, ?, ?, ?)`;
			db.prepare(sql_set).run(guild_id, item_name, description, img, item_amount);
		}
		else
		{
			throw `${item_name} already exists in this server's gacha`;
		}
	}, 

	// Remove gacha entry from a name check
	remove_gacha_entry: (guild_id, item_name) =>
	{
		let sql = `DELETE FROM Gacha WHERE GuildID = ? AND ItemName = ? COLLATE NOCASE LIMIT 1`;
		let del = db.prepare(sql).run(guild_id, item_name);

		if (del.changes == 0)
		{
			throw `There is no gacha item called ${item_name} in this server`;
		}
	}, 

	// Use this to update any gacha entry. There are only three fields that can be updated and the item name is required (can be changed if it doesn't exist elsewhere)
	// throws error message if it doesn't work
	update_gacha_entry: (guild_id, item_name, fields, values) =>
	{
		// turn fields/values into array if they're not
		if (typeof fields == 'string')
		{
			fields = [fields];
			values = [values];
		}

		// if one of the fields is ItemName and that item already exists in the gacha, return a warning message (false)
		if (fields.includes("ItemName"))
		{
			var idx = fields.indexOf("ItemName");
			let sql_get = `SELECT ItemName FROM Gacha WHERE GuildID = ? AND ItemName = ? COLLATE NOCASE LIMIT 1`;
			var item_name_exists = db.prepare(sql_get).get(guild_id, values[idx]);
		}

		if (item_name_exists)
		{
			throw `The name '${values[idx]}' already exists for another item in this server`;
		}

		// Otherwise, continue
		try
		{
			fields[fields.length-1] = fields[fields.length-1] + ' = ?';
			fields = fields.join(' = ?, ');
		}
		catch 
		{
			fields = fields + ' = ?';
		}

		try
		{
			let sql = `UPDATE Gacha SET ${fields} WHERE GuildID = ? AND ItemName = ? COLLATE NOCASE LIMIT 1`;
	
			var row = db.prepare(sql).run(values, guild_id, item_name);
		}
		catch
		{
			throw "At least one of the fieds you tried to adjust is invalid. You may change the `ItemName`, `Amount`, its `Description`, or its `ImageURL`";
		}

		if (row.changes == 0)
		{
			throw `There is no item called ${item_name} in this server`;
		}
	},

	// Pay a single character. Amount is assumed to be parsed as int
	pay_char: (guild_id, char_nickname, amount=1) =>
	{
		if (isNaN(amount))
		{
			throw `${amount} is not a number!`;
		}

		let sql = `UPDATE Characters SET Currency = Currency + ${amount} WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var update = db.prepare(sql).run(guild_id, char_nickname);
		}
		catch
		{
			let sql = `UPDATE Characters SET Currency = 9999 WHERE GuildID = ? AND CharNickname = ? COLLATE NOCASE LIMIT 1`;
			var update = db.prepare(sql).run(guild_id, char_nickname);
		}

		if (update.changes == 0)
		{
			throw `No one with the nickname ${char_nickname} could be found!`
		}
	}, 

	pay_all: (guild_id, amount=1) =>
	{
		if (isNaN(amount))
		{
			throw `${amount} is not a number!`;
		}

		let sql = `UPDATE Characters SET Currency = Currency + ${amount} WHERE GuildID = ?`;

		var update = db.prepare(sql).run(guild_id);
		
		if (update.changes == 0)
		{
			throw `There are no characters to pay!`;
		}
	}, 
	
//------------------------------ GUILD ------------------------------//
	
	// Add the guild to the db (called with on_guild_join)
	add_guild: (guild_id) =>
	{
		let sql = `INSERT OR IGNORE INTO GuildData (GuildID) VALUES (?);`
		db.prepare(sql).run(guild_id);
	}, 

	// Remove guild
	rem_guild: (guild_id) =>
	{
		let sql = `DELETE FROM GuildData WHERE GuildID = ? LIMIT 1`;
		db.prepare(sql).run(guild_id);
	}, 

	// Guild entry (does not typecast mod roles to array)
	get_guild_entry: (guild_id) =>
	{
		let sql = `SELECT * FROM GuildData WHERE GuildID = ? LIMIT 1`;
		return db.prepare(sql).get(guild_id);
	}, 

	// TODO Remove all traces of an array of guildIDs from the db. Call only with a dev command
	// Also remove announcements that have passed and have a frequency of 0
	// remove_guilds_from_db: (guild_ids) => 
	// {
	// }, 

	get_mod_roles: (guild_id) =>
	{
		let sql = `SELECT ModRoles FROM GuildData WHERE GuildID = ? LIMIT 1`;
		let mod_roles = JSON.parse(db.prepare(sql).get(guild_id).ModRoles);

		// if (mod_roles.length == 0)
		// {
		// 	throw `There are no mod roles set up in this server`;
		// }

		return mod_roles;
	}, 

	// Add any number of roles to the ModRoles JSON string from array 
	add_mod_roles: (guild_id, role_ids) =>
	{
		let sql_get = `SELECT ModRoles FROM GuildData WHERE GuildID = ? LIMIT 1`;
		let current_roles = JSON.parse(db.prepare(sql_get).get(guild_id).ModRoles);

		let new_roles = Array.from(new Set(current_roles.concat(role_ids)));
		let sql_set = `UPDATE GuildData SET ModRoles = ? WHERE GuildID = ? LIMIT 1`;

		db.prepare(sql_set).run(JSON.stringify(new_roles), guild_id);
	}, 

	del_mod_roles: (guild_id, role_ids_to_remove) =>
	{
		let sql_get = `SELECT ModRoles FROM GuildData WHERE GuildID = ? LIMIT 1`;
		let current_roles = JSON.parse(db.prepare(sql_get).get(guild_id).ModRoles);

		let new_roles = current_roles.filter(x => role_ids_to_remove.indexOf(x) == -1);
		let sql_set = `UPDATE GuildData SET ModRoles = ? WHERE GuildID = ? LIMIT 1`;

		db.prepare(sql_set).run(JSON.stringify(new_roles), guild_id);
	}, 

	// Use this to update anything in GuildData that isn't ModRoles
	// Pass either a single argument with one field/value or an array of multiple corresponding fields/values
	update_guild_entry: (guild_id, fields, values) =>
	{
		if (typeof fields == 'string')
		{
			fields = [fields];
			values = [values];
		}

		if (fields.length != values.length)
		{
			throw `You entered ${fields.length} fields and ${values.length} values`;
		}

		try
		{
			fields[fields.length-1] = fields[fields.length-1] + ' = ?';
			fields = fields.join(' = ?, ');
		}
		catch 
		{
			fields = fields + ' = ?';
		}

		let sql = `UPDATE GuildData SET ${fields} WHERE GuildID = ? LIMIT 1`;
		
		try
		{
			db.prepare(sql).run(values, guild_id);
		}
		catch
		{
			throw `At least one of those fields is invalid`;
		}
	}, 

	// Just returns every guild entry
	all_bot_guilds: () =>
	{
		let sql = `SELECT * FROM GuildData`;
		return db.prepare(sql).all();
	}, 

//-------------------------- ANNOUNCEMENTS --------------------------//

	// Add a new announcement. Message can go over limit since the command can split it. Assumes valid input
	// Max of 20 announcements per guild. Throw error
	add_announcement: (guild_id, channel_id, message, freq, first_posting) =>
	{
		let sql_count = `SELECT COUNT() FROM Announcements WHERE GuildID = ?;`
		let count = db.prepare(sql_count).all(guild_id);

		if (count[0]['COUNT()'] == 20)
		{
			throw `You have reached the 20 announcement per server limit!`
		}

		let sql = `INSERT INTO Announcements (GuildID, ChannelID, Message, Frequency, NextPosting) VALUES (?, ?, ?, ?, ?)`;
		db.prepare(sql).run(guild_id, channel_id, message, freq, first_posting)
	}, 

	// Remove an announcement
	remove_announcement: (guild_id, channel_id, message, freq, next_posting) => 
	{
		let sql = `DELETE FROM Announcements WHERE GuildID = ? AND ChannelID = ? AND Message = ? AND Frequency = ? AND NextPosting = ? COLLATE NOCASE LIMIT 1`;
		let announcement = db.prepare(sql).run(guild_id, channel_id, message, freq, next_posting)

		if (announcement.changes == 0)
		{
			throw `No announcement that message, frequency, channel, and posting date was found in this server`;
		}
	}, 

	remove_all_guild_announcements: (guild_id) =>
	{
		let sql = `DELETE FROM Announcements WHERE GuildID = ?`;
		db.prepare(sql).run(guild_id);
	}, 

	// Return array of objects of all announcements for a single guild
	get_guild_announcements: (guild_id) =>
	{
		let sql = `SELECT * FROM Announcements WHERE GuildID = ?`;
		let announcements = db.prepare(sql).all(guild_id);

		if (announcements.length == 0)
		{
			throw `No announcements are set up for this server`;
		}

		// Sort by time
		announcements.sort((a1, a2) => a1.NextPosting - a2.NextPosting);
		return announcements;
	}, 

	// update any announcement fields (channelID, message, frequency)
	// frequency changes cannot take effect until after the next scheduled posting
	// TODO proper error handling
	update_announcement: (guild_id, channel_id, message, freq, next_posting, fields, values) =>
	{
		try
		{
			fields[fields.length-1] = fields[fields.length-1] + ' = ?';
			fields = fields.join(' = ?, ');
		}
		catch 
		{
			fields = fields + ' = ?';
		}

		let sql = `UPDATE Announcements SET ${fields} WHERE GuildID = ? AND ChannelID = ? AND Message = ? AND Frequency = ? AND NextPosting = ? LIMIT 1`;
	
		db.prepare(sql).run(values, guild_id, channel_id, message, freq, next_posting);
	}, 

	// Get announcements for current time
	get_current_announcements: () =>
	{
		var now = new Date();

		mm = parseInt(now.getUTCMinutes());
		// Round up or down to 00 or 30 minutes
		if (15 <= mm && mm < 45) // 30
		{
			now.setMinutes(30);
		}
		else if (0 <= mm && mm < 15) // keep the hour at 00
		{
			now.setMinutes(0);
		}
		else // go forward one hour to 00
		{
			now.setMinutes(0);
			date.addHours(now, 1);
		}

		// format as string
		now = parseInt(date.format(now, 'YYYYMMDDHHmm', true));

		let sql = `SELECT * FROM Announcements WHERE NextPosting = ?`;

		return current_announcements = db.prepare(sql).all(now);
	}, 

	// Increment the announcements that are called in current announcements
	// Will have an error if there are no current announcements (returns false)
	increment_current_announcements: (current_announcements) =>
	{
		// All have the same announcement time
		try
		{
			var date_str = current_announcements[0].NextPosting.toString();
		}
		catch (e) // No announcements
		{
			return false;
		}

		// Increment all of them
		let sql = `UPDATE Announcements SET NextPosting = ? WHERE GuildID = ? AND ChannelID = ? AND Message = ? AND NextPosting = ? COLLATE NOCASE LIMIT 1`;
		for (announcement of current_announcements)
		{
			let date_obj = date.parse(date_str, 'YYYYMMDDHHmm'); 
			date_obj.setHours(date_obj.getHours() + announcement.Frequency); // Will not increase if 0

			let updated_time = parseInt(date.format(date_obj, 'YYYYMMDDHHmm'));

			db.prepare(sql).run(updated_time, announcement.GuildID, announcement.ChannelID, announcement.Message, announcement.NextPosting);
		}

		return true;
	}, 

	// Call this when bot logs in. Increments any announcements that passed if the bot was down
	// Delete any announcement with interval of 0 (if they have passed)
	handle_passed_announcements: () =>
	{
		// get the current time
		var now = new Date();
		now = parseInt(date.format(now, 'YYYYMMDDHHmm', true));

		// Delete passed announcements with frequency of 0
		let sql_del = `DELETE FROM Announcements WHERE Frequency = ? AND NextPosting < ?`;
		db.prepare(sql_del).run(0, now);

		// Get all announcements that have passed
		let sql_get = `SELECT * FROM Announcements WHERE NextPosting < ?`;
		let passed_announcements = db.prepare(sql_get).all(now);

		for (announcement of passed_announcements)
		{
			let updated_time = 0;
			let announcement_time = date.parse(announcement.NextPosting.toString(), 'YYYYMMDDHHmm');
			while (updated_time < now)
			{
				announcement_time.setHours(announcement_time.getHours() + announcement.Frequency);
				updated_time = parseInt(date.format(announcement_time, 'YYYYMMDDHHmm'));
			}

			// Update database
			let sql_set = `UPDATE Announcements SET NextPosting = ? WHERE ChannelID = ? AND Message = ? AND Frequency = ? AND NextPosting = ? COLLATE NOCASE LIMIT 1`;
			db.prepare(sql_set).run(updated_time, announcement.ChannelID, announcement.Message, announcement.Frequency, announcement.NextPosting);
		}
	}, 

//------------------------------- MAP -------------------------------//
	
	// For all of these, be sure to check that the channel is in the adminn's guild!

	// Add a new channel to the map
	// Cannot insert an existing channel (throws error)
	add_channel_to_map: (guild_id, channel_id, role_id) =>
	{
		let sql = `INSERT INTO Maps (GuildID, ChannelID, RoleID) VALUES (?, ?, ?)`

		try
		{
			db.prepare(sql).run(guild_id, channel_id, role_id);
		}
		catch
		{
			throw `That channel is already in this server's map!`;
		}
	}, 

	// Removes the entry and any connections it had
	remove_channel_from_map: (channel_id) =>
	{
		// Remove the entry first
		let sql_rem = `DELETE FROM Maps WHERE ChannelID = ? LIMIT 1`;
		let removed_channel = db.prepare(sql_rem).run(channel_id);

		if (removed_channel.changes == 0)
		{
			throw `That channel is not on this server's map`;
		}

		// Then remove the connection if it's in any other channels' OutgoingConnections (with regex)
		let str_front = `["${channel_id},"`;
		let str_only = `["${channel_id}"]`;
		let str_middle = `,"${channel_id}",`;
		let str_end = `,"${channel_id}"]`;

		let sql_update = `UPDATE Maps SET OutgoingConnections = REPLACE(OutgoingConnections, ?, ?)`;
		db.prepare(sql_update).run(str_front, '[');
		db.prepare(sql_update).run(str_only, '[]');
		db.prepare(sql_update).run(str_middle, ',');
		db.prepare(sql_update).run(str_end, ']');
	}, 

	remove_map_channel_by_role: (role_id) =>
	{
		// Get the channel ID first
		let sql_get = `SELECT ChannelID FROM Maps WHERE RoleID = ? LIMIT 1`;

		try
		{
			var channel_id = db.prepare(sql_get).get(role_id).ChannelID;
		}
		catch
		{
			throw `There is no map channel associated with that role id`;
		}

		// Remove the entry
		let sql_rem = `DELETE FROM Maps WHERE ChannelID = ? LIMIT 1`;
		let removed_channel = db.prepare(sql_rem).run(channel_id);

		if (removed_channel.changes == 0)
		{
			throw `That channel is not on this server's map`;
		}

		// Then remove the connection if it's in any other channels' OutgoingConnections (with regex)
		let str_front = `["${channel_id},"`;
		let str_only = `["${channel_id}"]`;
		let str_middle = `,"${channel_id}",`;
		let str_end = `,"${channel_id}"]`;

		let sql_update = `UPDATE Maps SET OutgoingConnections = REPLACE(OutgoingConnections, ?, ?)`;
		db.prepare(sql_update).run(str_front, '[');
		db.prepare(sql_update).run(str_only, '[]');
		db.prepare(sql_update).run(str_middle, ',');
		db.prepare(sql_update).run(str_end, ']');
	}, 

	// add connection to an already existing channel
	// Throws error if the channel doesn't exist
	add_map_connections: (channel_id, outgoing_channel_ids) =>
	{
		let sql_get = `SELECT OutgoingConnections FROM Maps WHERE ChannelID = ? LIMIT 1`;

		try
		{
			outgoing_connections = JSON.parse(db.prepare(sql_get).get(channel_id).OutgoingConnections);
		}
		catch
		{
			throw `That channel does not exist on your server's map!`
		}

		// if outgoing id is not in connections, add it
		let new_connections = Array.from(new Set(outgoing_connections.concat(outgoing_channel_ids)));

		let sql_set = `UPDATE Maps SET OutgoingConnections = ? WHERE ChannelID = ? LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(new_connections), channel_id);
	}, 

	remove_map_connections: (channel_id, outgoing_ids_to_remove) =>
	{
		if (typeof outgoing_ids_to_remove == 'string')
		{
			outgoing_ids_to_remove = [outgoing_ids_to_remove]
		}

		let sql_get = `SELECT OutgoingConnections FROM Maps WHERE ChannelID = ? LIMIT 1`;

		outgoing_connections = JSON.parse(db.prepare(sql_get).get(channel_id).OutgoingConnections);

		let new_connections = outgoing_connections.filter(element => !outgoing_ids_to_remove.includes(element));

		let sql_set = `UPDATE Maps SET OutgoingConnections = ? WHERE ChannelID = ? LIMIT 1`;
		db.prepare(sql_set).run(JSON.stringify(new_connections), channel_id);
	}, 

	// Return all map info for a guild
	get_guild_map: (guild_id) =>
	{
		let sql = `SELECT * FROM Maps WHERE GuildID = ?`;
		let map = db.prepare(sql).all(guild_id);

		if (map.length == 0)
		{
			throw `This server does not have any map channels! Add one with \`!nm #channel-tag\``
		}

		// Convert outgoing connections to object
		for (row of map)
		{
			row.OutgoingConnections = JSON.parse(row.OutgoingConnections);
		}

		return map;
	}, 

//-------------------------- INVESTIGATION --------------------------//
	
	// Add an investigation. Throws error if user tries to enter an invalid name
	// Limit 25 items per channel (throw error)
	add_investigation: (guild_id, channel_id, item_names, item_info, is_public, is_stealable) =>
	{
		//Check amount
		let sql_count = `SELECT COUNT() FROM Investigations WHERE GuildID = ? AND ChannelID = ?;`
		let count = db.prepare(sql_count).all(guild_id, channel_id);

		if (count[0]['COUNT()'] == 20)
		{
			throw `You have reached the 20 object per channel limit!`
		}

		if (typeof item_names == 'string')
		{
			item_names = [item_names];
		}

		// Make sure there are no matching item_names in that channel
		let sql_get = `SELECT ItemNames FROM Investigations WHERE ChannelID = ? AND ItemNames LIKE ? COLLATE NOCASE LIMIT 1`;
		for (name of item_names)
		{
			let name_exists = db.prepare(sql_get).get(channel_id, `%"${name}"%`);
			if (name_exists)
			{
				throw `${name} is already given to an investigatable object in <#${channel_id}>!`;

			}
		}

		// If it gets this far, add to db
		let sql_add = `INSERT INTO Investigations (GuildID, ChannelID, ItemNames, ItemInfo, IsPublic, IsStealable) VALUES (?, ?, ?, ?, ?, ?)`;
		db.prepare(sql_add).run(guild_id, channel_id, JSON.stringify(item_names), item_info, is_public, is_stealable);
	}, 

	remove_investigation: (channel_id, item_name) =>
	{
		let sql = `DELETE FROM Investigations WHERE ChannelID = ? AND ItemNames LIKE ? COLLATE NOCASE LIMIT 1`;

		let del = db.prepare(sql).run(channel_id, `%"${item_name}"%`);

		if (del.changes == 0)
		{
			throw `No investigatable item named ${item_name} was found in that channel`;
		}
	}, 

	// Returns investigation and, if successful, adds the finder to the list (char nickname)
	// Throws warning if item DNE. No warning if they already found it since some might want to look again
	// Throws warning if it's been stolen
	get_investigation: (channel_id, item_name, finder_nickname) =>
	{
		finder_nickname = this.fn.to_title_case(finder_nickname);

		let sql_get = `SELECT * FROM Investigations WHERE ChannelID = ? AND ItemNames LIKE ? COLLATE NOCASE LIMIT 1`;

		try
		{
			var investigation = db.prepare(sql_get).get(channel_id, `%"${item_name}"%`);

			var finders = JSON.parse(investigation.Finders);
		}
		catch
		{
			throw `There is no investigatable item called ${item_name} in this channel!`;
		}

		if (investigation.Stealer != "No one")
		{
			throw `${item_name} seems to have disappeared!`;
		}

		if (finders.indexOf(finder_nickname) == -1)
		{
			finders.push(finder_nickname);

			let sql_set = `UPDATE Investigations SET Finders = ? WHERE ChannelID = ? AND ItemNames LIKE ? COLLATE NOCASE LIMIT 1`;
			db.prepare(sql_set).run(JSON.stringify(finders), channel_id,  `%"${item_name}"%`);
		}

		return investigation;
	}, 

	// Steal the item, note the stealer
	// Warn if the item DNE or not stealable. Will halt right there if someone has stolen it
	steal_investigation: (channel_id, item_name, stealer_nickname) =>
	{
		stealer_nickname = this.fn.to_title_case(stealer_nickname);

		let sql_set = `UPDATE Investigations SET (Stealer, IsStealable) = (?, 0) WHERE IsStealable = 1 AND ChannelID = ? AND ItemNames LIKE ? COLLATE NOCASE LIMIT 1`;

		let update = db.prepare(sql_set).run(stealer_nickname, channel_id, `%"${item_name}"%`);

		if (update.changes == 0)
		{
			throw `${item_name} either does not exist or is not stealable!`;
		}
	}, 

	// Return all investigation info for a guild
	// Does not parse names and finders to array 
	get_guild_investigations: (guild_id) =>
	{
		let sql = `SELECT * FROM Investigations WHERE GuildID = ?`;
		let investigations = db.prepare(sql).all(guild_id);

		if (investigations.length == 0)
		{
			throw `This server does not have any investigatable items`;
		}

		return investigations;
	}
}