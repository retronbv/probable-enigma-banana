module.exports = {
  description: "Setup parts of the bot!",
  aliases: ["s"],
  execute({ message, args, client }) {
    const children = client.commands.get("setup").children;
    message.channel.send({
      embed: {
        color: 0x3ba55c,
        title: "Setup commands",
        author: {
          name: "DoItAll Bot",
          icon_url:
            "https://discord.com/assets/7c8f476123d28d103efe381543274c25.png",
        },
        description: [...children.keys()]
          .map(
            (command) => `**${command}** - ${children.get(command).description}`
          )
          .join("\n"),
      },
    });
  },
};
