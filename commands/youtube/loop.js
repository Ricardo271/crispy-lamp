const { SlashCommandBuilder } = require('@discordjs/builders');
const { loop }= require('../../playlist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Starts looping the current or next song.'),
    async execute(interaction) {
        loop(interaction);
    },
};