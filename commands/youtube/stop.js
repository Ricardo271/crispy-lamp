const { SlashCommandBuilder } = require('@discordjs/builders');
const { stop }= require('../../playlist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Clears the queue and leave the voice channel.'),
    async execute(interaction) {
        stop(interaction);
    },
};