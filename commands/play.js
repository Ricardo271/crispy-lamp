const { SlashCommandBuilder } = require('@discordjs/builders');

const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

const player = createAudioPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a youtube video')
        .addStringOption(option =>
            option.setName('request')
                .setDescription('Link or search term')
                .setRequired(true)),
    async execute(interaction) {

        const voice_channel = interaction.member.voice.channel;
        if (!voice_channel) return interaction.reply({ content: 'You need to be in a voice channel to execute this command!', ephemeral: true});

        const server_queue = queue.get(interaction.guildId);

        let song = {};

        const request = interaction.options.getString('request');
        if (ytdl.validateURL(request)) {
            const song_info = await ytdl.getInfo(request);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
        } else {
            const video_finder = async (query) => {
                const video_result = await ytSearch(query);
                return (video_result.videos.length > 1) ? video_result.videos[0] : null;
            }

            const video = await video_finder(request);
            if (video) {
                song = { title: video.title, url: video.url };
            } else {
                interaction.reply('Error finding video.');
            }
        }

        if (!server_queue) {

            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: interaction.channel,
                connection: null,
                songs: []
            }

            queue.set(interaction.guildId, queue_constructor);
            queue_constructor.songs.push(song);

            try {

                const connection = joinVoiceChannel({
                    channelId: voice_channel.id,
                    guildId: voice_channel.guildId,
                    adapterCreator: voice_channel.guild.voiceAdapterCreator,
                });

                queue_constructor.connection = connection;
                video_player(interaction.guild, queue_constructor.songs[0]);

            } catch (error) {
                queue.delete(interaction.guildId);
                interaction.reply('There was an error connecting.');
                throw error;
            }
        } else {
            server_queue.songs.push(song);
            return interaction.reply(`**${song.title}** added to queue!`);
        }

    },
};

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        queue.delete(quild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`Now playing **${song.title}**`);
}