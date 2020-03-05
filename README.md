# Ultimate Assistant

This is a Discord bot built with the purpose of catering to a community that gathers around the visual novel, *Danganronpa: Trigger Happy Havoc* and its sequels. The community focuses on writing original characters, crafting mysteries to solve together, and building imaginative settings to host roleplaying games. This project aims to lessen the workload on game hosts and offer utilities for both players and hosts.

The developer also welcomes your feedback and suggestions, which can be given semi-anonymously with:

`!feedback Your message here`

UA will DM the developer with the message. User ID is provided in order to screen for misuse/harassment.

To invite the bot to your server:

https://discordapp.com/oauth2/authorize?client_id=517165856933937153&scope=bot

Links to this page, the development server, and the invite can be obtained using

`!info`

Finally, all commands have explanations and examples in the `!help <command-name>` command.

# Important

This bot functions on the premise that admin will set up each player with a character. Multiple characters can be assigned to one user, with the most recently made one automatically being assigned. Upon initiation, the character is assigned a unique nickname for look-up purposes. This is to accomodate repeated names, and so that long names do not need to be fully typed. In most cases, the nickname will just be the character's first name.

To use every feature, the bot's highest role will need the following permissions. Certain commands can only be used by server admins, with the option to add specific roles as moderators (`!add_mod_roles <role-name> [role-name2]...`)

```
Manage Roles
Manage Channels
Read Text Channels
Send Messages
Manage Messages
Read Message History
Embed Links
```

# Contents
[Updates from Python version](#updates)

[Command Overview](#commands)

[Self-hosting](#hosting)

# Version Updates <a name="updates"></a>

### **One small drawback**
discord.js bots do not seem to have the same custom emoji capabilities as discord.py. You can still use server emotes but emotes from other servers have not been working during testing

### **Revamped help command**
Using `!help <command-name>` displays example uses. Overall easier to read

### **Small QoL things**
Use the `!info` command to get an overview of required perms and documentation/invite links. 

### **Feedback command and DM replies**
This existed before, but the bot won't be sending automatic error reports anymore. If you have any questions/comments/critiques and you don't want to send them in the dev server, you may send it semi-anonymously to me with the `!feedback` command. I will do my best to reply, though you must be accepting DMs from the bot

### **Anon DMs now *require* receipt channels**
This was a popular request to begin with, and I can bring back the old way of DMing every admin of the server if there is a lot of demand for it. However, anon dms now require the set up of a receipt channel. You can do this with `!set_adm_channel #channel-tag`. If there is no channel to send to (or it doesn't have posting perms in that channel), anon dms will not work, and you will not be able to toggle them to ON

### **Add mod roles**
Members with any of those roles can use the admin commands. Check the `!help Admin` for full details

### **No need to ping the role to set an auto-role**
You can make a typo or two and still be alright

### **Default timeout for responses has been extended to 120 seconds**

### **Easily take or drop more than one of an item at once**
Check the `!help take/drop` command for details. Inventories are limited to 9999 of a single item

### **Character info is now completely customizable** 
From height to birthday to intelligence level. Do you prefer SHSL over Ultimate? Are talents fake? Add it. Really need the ever important chest size info on your character card? It's one command away. Add/remove up to 20 custom fields to any character. This has also replaced the old stats system that was hastily thrown together in 4 hours. Note: these will be cast to `Title Case` when you make them.

### **Streamlined character setup**
The `!new_char` command has been reduced to one command and one confirmation input. The new call is `!nc <char_nickname> <char_player> <Full Char Name>`. **You also do not need to ping the player in question anymore**, just their username will do. This may cause an issue if two users have the exact same username, as it does not check nicknames.

### **Edit your own character**
Another commonly requested feature. Edit the profile for any character assigned to you

### **Streamlined map setup**
As before, add a new channel with `!new_area_role` (alias `!nm`). Adding connections to it is now reduced to one command with an optional argument to specify one or two way connections from source to connection.

### **Command to remove map channels**
It exists now. Use `!rmc #channel-tag1 #channel-tag2...`. It will still delete if you delete the associated role ir channel.

### **!go is a little easier to use now**
Enter either the channel name or tag it to go to a connected channel. The bot will find the closest server channel that matches the name you enter, so you can make a typo or two. There shouldn't be any weird scenarios where you need quotation marks either

### **`!ainventory` is gone**
Admins and mods can add the character nickname as an argument to the normal `!items` command to see any character's inventory. Players leave the nickname off to see their own inventory

### **Gift items and currency to other players**
Another commonly requested feature. Transfer items from your inventory to another character, or specify the server's currency see `!gift` for detailed instructions

### **The admin command to see money is also gone**
Same as above, admins can append the nickname to the normal `!money` command

### **Investigation set-up streamlined + public/private option + steal option**
The investigation set up has been reduced to one command and a description entry. You may also flag it as stealable or public. Stealable items can be stolen with the `!steal <item>` command. Public items will be delivered to the same channel as the command. Otherwise the bot will try to DM the player

### **Remote investigation performed in normal command**
Add the channel tag to the normal `!investigate [#channel-tag] <item>` command to investigate from outside that channel. Leave it out and the bot will use the posting channel. This will also work for the `!steal` command.

### **Silence your announcements**
If you need to 'stop' time for an event or trial, it's now possible without deleting all your time announcements. They'll pick right back up on schedule when you resume them. Note, this doesn't exactly freeze time. Your announcements just won't post in order to keep up with the task scheduler

### **Paste in an image for a ref**
A famously common issue in the previous version. You may now paste an image into discord when adding a ref to a profile/gacha item if you don't have the link. The bot will throw you an error message if the ref isn't a proper url to a .png/.jpg/.gif.

### **Gacha updates**
It is now a single command to add in a new gacha item. You may also paste in a reference image as above. See the help command for the full syntax
**Also**, you may now make items **limited** by specifying how many to put in the gacha. By default, you may leave the amount argument blank and the item will be infinitely available to draw. To change this amount for an existing item, use `!ia <new-amount> <item-name>`

### **Custom rolls can now be called with the usual !roll command**
No need to remember !rc or !rcs or whatever it was

### **Pay in bulk and then some**
What it says. Pay everyone at once with `!payall`. Great for starting everyone off with a few gacha coins. If you just want to pay one or a few characters, list every nickname in the normal `!pay` command. You can also specify how much you want to pay now at the end of the command (leave it blank to default to 1)

### **Dice Roll QoL tweaks** 
The rolls are not colored anymore, but they can be easily if there is demand. They also will not self delete anymore, and will default to the caller's nickname if they have one. They should also be a little more efficient now

# Command Overview <a name="commands"></a>

Please see the development server and the help commands for full usage and examples

## Admin

Your standard admin commands. Anyone with a role that has administrator permissions can use these by default. You may also add specific roles (such as moderators), and those players will be able to use these commands.

**!add_mod_roles**: Specify existing role(s) as Mod roles. Users with these roles can use admin commands. Does not need to be done for roles with existing Admin perms

**!del_char**: Remove a character from the server

**!mod_roles**: View mod roles added with the add command

**!prefix**: Set a new prefix

**!rem_mod_roles**: Remove mod role(s)

**!set_adm_channel**: Set a channel to receive the receipts for anon DMs

**!set_autorole**: Set a role to automatically assign new members

**!toggle_adm**: Toggle anon dm capability. Be sure to set a receipt channel first

**!toggle_time**: Mute or unmute announcements

## Announcements

To automate announcements, be sure to specify a server timezone. The bot prompts for times/dates in UTC format `yyyy-MM-dd-hh-mm`. The task loop runs every half hour (00 and 30). You may also mute your announcements. They will still progress with the task loop, but will not post until they are toggled back on. Announcements are deleted from the bot if you remove the bot from your server.

**!announcements**: See your announcements in order of posting

**!new_announcement**: Set a new auto-announcement. Be sure to set your server timezone first and use 24-hour format, and that 'mm' is 00 or 30

**!remove_announcements**: Remove announcement(s). Prompts for a selection of numbers

**!set_timezone**: Set the server timezone. Half-hours not supported, sorry :(

## Gacha

Everyone loves gambling, and tabletop roleplaying is a good way to get that rush without the monetary risk! Players will need Currency in order to draw, which admins and mods will need to distribute. You may also choose to limit specific items when adding them. By default, each item will be unlimited. Drawn items are automatically added to Inventories

**!gacha_list**: See your gacha items

**!gacha_pull**: Draw a gacha item. Item is auto-added to your inventory

**!item_amount**: Specify number of copies of an existing gacha item (numbers above 999 will go to infinity)

**!money**: View your currency. Mods can enter a nickname to view anyone

**!new_item**: Add an item to the gacha. Default amount is unlimited. Add an image URL or paste it as an attachment (leave blank for none). You may specify an amount if you'd like to limit the item. Be sure to enclose apostrophes within double quotes

**!pay**: Pay one or more characters. Amount defaults to 1 if not given. Enter a negative number to remove currency (they may go into debt). Currency caps/floors and 9999 and -9999.

**!pay_all**: Pay all characters. Amount defaults to 1 if not given. Enter a negative number to remove currency (but be careful not to unintentionally put people into debt). Currency floors/caps at -9999 and 9999

**!remove_gacha_item**: Remove item(s) from gacha. Prompts for a selection of numbers

**!set_currency_name**: Set name of gacha currency (default Coins)

## Inventory

**!confiscate**: Remove one or more of an item from a character's inventory

**!drop**: Remove one or more of an item from your inventory

**!gift**: For players to give an item or currency to another player. It must be in your inventory

**!give**: Admins can add one or more of a new item to a character's inventory. Be wary of apostrophes in your description (enclose in "" if needed)

**!inventory**: View your inventory. Mods can enter a nickname to view anyone. Item amount caps at 9999

**!take**: Add one or more of an item to your inventory. Be wary of apostrophes in your description (enclose in "" if needed)

## Investigations

Mods may leave objects or peculiar sights around for players to investigate. In order ot reduce mod pings, you may set up investigations beforehand. The bot will try to DM the player, but you may mark an item as public and it will send the message to the calling channel. You may also flag an item as Stealable, and the player may try to steal it

**!investigate**: Investigate an item. Optional channel tag to investigate remotely

**!investigations**: A list of the server's investigatable objects. Optionally tag a specific channel

**!new_investigation**: Add a new investigation. Use the -s tag to allow players to steal it. Use the -p tag to have the bot reply in public rather than DMs. Bot will prompt for a description

**!remove_investigations**: Remove investigation(s). Prompts for a selection of numbers

**!steal**: Steal an item (if possible). Optional channel tag to steal from private

## Map

Conceptually, a map is a set of roles and connections between server channels. They are useful for making hidden areas and trap rooms that you may want to keep secret from some players. To set up a map, you must

1. Add at least one channel with `!nm #channel-tag`. You may then make connections
2. Set up a starting point for the map (`!ssp #channel-tag`)
3. Distribute the starting role to users with registered characters using `!start`

**!add_connection**: Add connections from a channel to another (provide an argument '-s' to make one-way connection(s) from source to destination. Roles are automatically created for connections that have not been added

**!go**: Go to a connected channel. Use the name or the tag

**!map**: See server map

**!new_area_role**: Creates a role corresponding to a map channel

**!remove_map_channels**: Remove channels from server map

**!set_start_point**: Set the start/entry channel for map

**!start**: Assigns the start channel role to all players with characters

## Misc

**!anon_dm**: Send an anonymous DM if they are enabled

**!feedback**: Send feedback and questions to the developer. Developer will reply through the bot at their earliest convenience

**!help**: Shows this list (in more detail)

**!info**: Shows some bot info including the bot invite link, an invite to the dev server, and a link to the project github. Also shows the perms needed to allow every command to work

# Self-hosting <a name="hosting"></a>

This bot was written and tested on Ubuntu 16.04 LTS with Node using Discord.js. If you would like to host a copy of this bot, do the following:

0. Create a project folder

1. Install Node for your operating system 
https://nodejs.org/en/

2. Add the dependencies for the bot
`npm install better-sqlite3 date-and-time discord.js@11.5.1 node-cron`

3. Clone or otherwise extract the contents of this repository into your project folder. The directory structure should look like:

```
node_modules
	<a bunch of files>
src
	commands
		<all the commands .js>
	announcement_loop.js
	discord_conn
	displays.js
	master-empty.db
	utils.js
.gitignore
README.md
```

4. Change **master-empty.db** to **master.db**

5. Add a file called **discord-config.json** in the src directory. In it, add the following:

```
{
	"prefix": "!", // Or any prefix you like 
	"token": "<your-bot-token", 
	"devID": "<your-user-snowflake-id>"
}
```

6. Run the bot with 

`node .src/discord_conn.js`