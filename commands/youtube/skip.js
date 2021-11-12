const { SlashCommandBuilder } = require('@discordjs/builders');
const { skip }= require('../../playlist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the song playing'),
    async execute(interaction) {
        skip(interaction);
    },
};