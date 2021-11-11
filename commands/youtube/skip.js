const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('../../playlist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the song playing'),
    async execute(interaction) {
        play.skip();
        await interaction.reply('Skipou');
    },
};