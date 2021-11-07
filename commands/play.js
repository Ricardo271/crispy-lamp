const { SlashCommandBuilder } = require('@discordjs/builders');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a youtube video')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link or search term')
                .setRequired(true)),
    async execute(interaction) {

        const voice_channel = interaction.member.voice.channel;
        if (!voice_channel) return interaction.reply({ content: 'You need to be in a voice channel to execute this command!', ephemeral: true});

        const server_queue = queue.get(interaction.guildId);

    },
};