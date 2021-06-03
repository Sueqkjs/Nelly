import {
  MessageEmbed,
  MessageAttachment,
  Discord,
  Messages,
  stringFormat,
  queues
} from '../index.mjs';

export default (message => {
  const queue = queues.get(message.guild.id);
  if (!queue) return;
  const cnct = queue.connection;
  if (!cnct) return;
  cnct.disconnect();
  message.react('👋').catch(console.log);
})
