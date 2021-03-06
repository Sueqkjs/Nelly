import {
  MessageEmbed,
  MessageAttachment,
  Discord,
  Messages,
  stringFormat,
  queues
} from '../global.mjs';

export default (async(message, args) => {
  let { voiceChannel, songs } = queues.get(message.guild.id);
  if (songs.length < args.length)
    return void await message.reply(Messages.ArgumentLengthOver);
  const msg = await message.channel.send(Messages.PleaseWait);
  const eliminated = [];
  for (let i of new Set(args.map(n=>+n).filter(v => !Number.isNaN(v) && 0 < n && n < songs.length))) {
    --i;
    if (
      !voiceChannel.members.has(songs[i].member.id) ||
      songs[i].member.id === message.member.id || songs[i].member.user.bot
    ) {
      eliminated.push(songs[i]);
      songs[i] = void 0;
    }
  }
  songs.forEach((v, i) => v === void 0 ? songs.splice(i, 1) : 0);
  msg.edit(`Removed ${eliminated.length} songs! ( ◜௰◝  ）${eliminated.map(s => '\n・' + s.title)}`);
})
