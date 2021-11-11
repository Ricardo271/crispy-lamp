const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the songs playing.'),
    async execute(interaction) {
        await interaction.reply('Stops the songs playing');
    },
};