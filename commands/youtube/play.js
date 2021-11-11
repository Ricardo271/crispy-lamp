const { SlashCommandBuilder, Interaction } = require('@discordjs/builders');
const play = require('../../playlist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a youtube video!')
        .addStringOption(option => 
            option.setName('request')
                .setDescription('Link or search term')
                .setRequired(true)),
    async execute(interaction) {
        play.play(interaction);
        //await interaction.reply('funfou');
    },
};