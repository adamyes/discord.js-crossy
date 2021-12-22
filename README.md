
 UNDER CONSTRUCTION
=========================
A fork of [discord.js](https://github.com/discordjs/discord.js/) that supports selfbots, with more features.

Installation
------------

**Node.js 16.6.0 or newer is required.**

```
npm install discord.js-crossy
yarn add discord.js-crossy
pnpm add discord.js-crossy
```
* Note:  Automating user accounts is against the Discord ToS.  Do so at your own risk.
## Key Features

 - Self-bots support
 - Normal bots support
 - Backwards compatible with original library [discord.js](https://github.com/discordjs/discord.js/).
## Examples
**Signing in**
syntax: ```Client.login(token: string, self_bot?: boolean)```

Example of signing in with self-bots
```js
const Discord = require("discord.js-crossy");
let client = new Discord.Client();
client.login("TOKEN", true);
```

Example of signing in with normal bots
```js
const Discord = require("discord.js-crossy");
let client = new Discord.Client();
client.login("TOKEN", false);
```
**Joining server**
```js
await client.guilds.join('hX7shs')
```

Todo
------------
 - [x] Websocket connection.
 - [x] Auto Client presence setting at startup.
 - [x] Fetch members for self-bots.
 - [x] Fetch messages for self-bots.
 - [x] Unlimited channel message fetching.
 - [ ] User Relationships.
 - [ ] User notes.
 - [ ] Manage cache.
 - [x] Joining guilds.
 - [ ] Adding member subscriptions.
 - [ ] Adding channel subscriptions.
