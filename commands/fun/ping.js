module.exports = {
  description: "Get my ping speed!",
  aliases: ["p"],
  execute({ message, args }) {
    message.channel.send(
      `:ping_pong: ${Date.now() - message.createdTimestamp}ms.`
    );
  },
};
