module.exports = {
  description: "Setup where the bot should send welcome messages!",
  aliases: ["w"],
  params: [
    {
      name: "channel",
      type: "ping-channel",
    },
  ],
  execute({ message, args, getStorage }) {
    getStorage((storage, setStorage) => {
      storage.welcomechannel = args.channel;
      setStorage(storage);
    });
    message.reply(
      `I will now tell you when someone joins, in <#${args.channel}>`
    );
  },
};
