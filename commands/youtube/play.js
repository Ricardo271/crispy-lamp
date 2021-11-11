const { SlashCommandBuilder, Interaction } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a youtube video!')
        .addStringOption(option => 
            option.setName('request')
                .setDescription('Link or search term')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('YEY!');
    },
};