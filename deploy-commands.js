const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];

const pushCommands = (dir) => {
	const commandFiles = fs.readdirSync(path.join(__dirname, dir));
	for (const file of commandFiles) {
		const stat = fs.lstatSync(path.join(__dirname, dir, file));
		if (stat.isDirectory()) {
			pushCommands(path.join(dir, file));
		} else if (file.endsWith('.js')) {
			const command = require(path.join(__dirname, dir, file));
			commands.push(command.data.toJSON());
		}
	}
}

pushCommands('./commands');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
