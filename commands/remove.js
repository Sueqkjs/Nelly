module.exports = async (message, args) => {
    let { textChannel, songs } = queues.get(message.guild.id);
    const msg = await textChannel.send('ちょっと待ってね！(   ◜ω◝ )');
    args.forEach((i, index) => {
      songs[i] = undefined;
      msg.edit(`${index + 1}曲削除したよ！( ◜௰◝  ）`);
    });
    songs = songs.filter(obj => obj);
}
