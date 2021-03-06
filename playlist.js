const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection } = require('@discordjs/voice');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();
const player = createAudioPlayer();

let looping = false;
let songs = [];

async function play(interaction) {

    const voice_channel = interaction.member.voice.channel;
    if (!voice_channel) {
        return interaction.reply({ content: 'You need to be in a voice channel to execute this command!', ephemeral: true });
    }

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
            return interaction.reply('Error finding video.');
        }
    }

    if (!server_queue) {

        const queue_constructor = {
            voice_channel: voice_channel,
            text_channel: interaction.channel,
            connection: null,
            songs: [],
        };

        queue.set(interaction.guildId, queue_constructor);
        queue_constructor.songs.push(song);

        try {

            const connection = joinVoiceChannel({
                channelId: voice_channel.id,
                guildId: voice_channel.guildId,
                adapterCreator: voice_channel.guild.voiceAdapterCreator,
            }).subscribe(player);

            queue_constructor.connection = connection;
            video_player(interaction.guild, queue_constructor.songs[0], interaction);

        } catch (error) {
            queue.delete(interaction.guildId);
            interaction.reply('There was an error connecting');
            throw error;
        }

    } else {
        server_queue.songs.push(song);
        console.log('pushed ', songs);
        return interaction.reply(`**${song.title}** added to queue!`);
    }

};

const video_player = async (guild, song, interaction) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        queue.delete(guild.id);
        console.log('Deletou guild.id');
        return;
    }
    if (!song_queue) {
        console.log('song_queue inexistente.');
        return;
    }

    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    player.play(resource);

    player.once(AudioPlayerStatus.Playing, () => {
        console.log('Playing');
    });
    player.once(AudioPlayerStatus.Idle, () => {
        console.log('Idle');
        if (looping) {
            song_queue.songs.push(song);
        } 
        song_queue.songs.shift();    
        video_player(guild, song_queue.songs[0], interaction);
    });
    player.on('error', error => {
        //console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        console.log(error.message);
        if (!looping) song_queue.songs.shift();
        video_player(guild, song_queue.songs[0], interaction);
    });

    if (interaction.replied) {
        return await interaction.followUp(`Now playing **${song.title}**`);
    } else {
        return await interaction.reply(`Now playing **${song.title}**`);
    }
}

function stop(interaction) {
    queue.delete(interaction.guildId);
    console.log('Stop -> Deletou guild.id');

    const connection = getVoiceConnection(interaction.guildId);
    if (!connection) return interaction.reply('I am not in a voice channel.');

    connection.destroy();
    return interaction.reply('Left the voice channel');
}

function skip(interaction) {
    songs.shift();
    player.stop();
    return interaction.reply('Skipped song.');
}

function loop(interaction) {
    looping = !looping;
    return interaction.reply(`Looping set to ${looping}`);
}

module.exports = {
    play: play,
    stop: stop,
    skip: skip,
    loop: loop,
};