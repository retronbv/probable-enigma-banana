module.exports = {
  aliases: ["h"],
  params: ["?command", "?subcommand"],
  execute({ message, args, client }) {
    let description = [];
    let title = "Commands List";
    if (args.command) {
      let command =
        client.commands.get(args.command) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(args.command)
        );
      if (args.subcommand) {
        command = command.children.find(
          (child) =>
            child.name == args.subcommand ||
            (child.aliases && child.aliases.includes(args.subcommand))
        );
        command.name = command.parent + " " + command.name;
      }
      title = command.name;
      description.push(command.description);
      description.push(``);
      description.push(
        `Usage: ${title} ${(command.params || [])
          .map((param) => param.name || param)
          .join(" ")}`
      );
      if (command.aliases) {
        description.push(``);
        description.push(`Aliases: ${command.aliases.join(", ")}`);
      }
      if (command.credits) {
        description.push(``);
        description.push(`Credits: ${command.credits.join(", ")}`);
      }
    } else {
      let categories = {};
      for (let command of client.commands.array()) {
        if (!command.category) continue;
        categories[command.category] = [
          command,
          ...(categories[command.category] || []),
        ];
      }
      for (const category in categories) {
        description.push(
          `**${category}** - ${categories[category]
            .map((command) => command.name)
            .join(", ")}`
        );
      }
    }

    message.channel.send({
      embed: {
        color: 0x3ba55c,
        title,
        author: {
          name: "DoItAll Bot",
          icon_url:
            "https://discord.com/assets/7c8f476123d28d103efe381543274c25.png",
        },
        description: description.join("\n"),
      },
    });
  },
};
