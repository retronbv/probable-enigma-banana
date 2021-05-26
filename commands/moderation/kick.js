module.exports = {
  aliases: ["k"],
  params: [
    {
      name: "user",
      type: "ping-user",
    },
    "?...reason",
  ],
  permissions: ["KICK_MEMBERS"],
  execute({ message, args, client }) {
    if (client.user.id == args.user) {
      message.reply(`Please give me another chance :pleading_face:`);
      return;
    }
    const user = message.guild.members.cache.get(args.user);
    if (!user.kickable) {
      message.reply(
        `I cannot kick ${user.user.username}, as they have more power than me.`
      );
      return;
    }
    user.kick(
      `Action by ${message.author.username}${
        args.reason.length ? `: ${args.reason.join(" ")}` : ""
      }`
    );
    message.reply(`${user.user.username} has been kicked from the server.`);
  },
};
