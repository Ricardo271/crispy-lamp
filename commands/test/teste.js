const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('Replies with some message data.'),
    async execute(interaction) {
        await interaction.reply(`Test message\nLatency is ${Date.now() - interaction.createdTimestamp} ms.`);
    },
};