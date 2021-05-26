module.exports = {
  aliases: ["b"],
  params: [
    {
      name: "user",
      type: "ping-user",
    },
    "?...reason",
  ],
  permissions: ["BAN_MEMBERS"],
  execute({ message, args, client }) {
    if (client.user.id == args.user) {
      message.reply(`Please give me another chance :pleading_face:`);
      return;
    }
    const user = message.guild.members.cache.get(args.user);
    if (!user.bannable) {
      message.reply(
        `I cannot ban ${user.user.username}, as they have more power than me.`
      );
      return;
    }
    user.ban({
      reason: `Action by ${message.author.username}${
        args.reason.length ? `: ${args.reason.join(" ")}` : ""
      }`,
    });
    message.reply(`${user.user.username} has been banned from the server.`);
  },
};
