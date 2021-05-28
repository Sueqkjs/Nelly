const { Collector, Collection } = Discord;
const { Events } = Discord.Constants;

module.exports = class ButtonClickCollector extends Collector {
  constructor(message, filter, options) {
    super(message.client, filter, options);
    this.message = message;
    this.users = new Collection();
    this.total = 0;
    this.empty = this.empty.bind(this);
    this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
    this._handleMessageDeletion = this._handleMessageDeletion.bind(this);

    this.client.incrementMaxListeners();
    this.client.on('interaction', this.#_buttonInteractionHandler);
    this.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);
    this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);

    this.once('end', () => {
      this.client.removeListener('interaction', this.#_buttonInteractionHandler);
      this.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);
      this.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
      this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on('collect', button => {
      this.total++;
      if (this.users.has(button.user.id))
      this.users.get(button.user.id).count++;
      this.users.set(button.user.id, {user: button.user, count: 1});
    });
  }

  #_buttonInteractionHandler(itr) {
     console.log("hai");
    if (itr.isMessageComponent) this.handleCollect(itr);
  }

  collect(button, user) {
    if (button.message.id !== this.message.id) return null;
    if (this.filter(button, user)) {
      this.emit('create', button, user);
    }
    return ButtonClickCollector.key(button);
  }

  dispose() { return null; }

  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    return null;
  }

  _handleMessageDeletion(message) {
    if (message.id === this.message.id) {
      this.stop('messageDelete');
    }
  }

  _handleChannelDeletion(channel) {
    if (channel.id === this.message.channel.id) {
      this.stop('channelDelete');
    }
  }

  _handleGuildDeletion(guild) {
    if (this.message.guild && guild.id === this.message.guild.id) {
      this.stop('guildDelete');
    }
  }

  static key(button) {
    return button.id;
  }
}
