const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('../../playlist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the songs in the queue'),
    async execute(interaction) {
        await interaction.reply(play.loop);
    },
};