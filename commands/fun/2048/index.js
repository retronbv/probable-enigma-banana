const Manager = require("./_Manager");

module.exports = {
  description: "Play the 2048 game!",
  credits: ["gabrielecirulli"],
  async execute({ message, args, client }) {
    const tiles = {
      0: "<:blank:844002921565519912>",
      2: "<:2_:844000510821269504>",
      4: "<:4_:844000510813929482>",
      8: "<:8_:844000510779457546>",
      16: "<:16:844000510776573974>",
      32: "<:32:844000510813143040>",
      64: "<:64:844019857368547369>",
      128: "<:128:844019857175085069>",
      256: "<:256:844019857523605525>",
      512: "<:512:844019857393451039>",
      1028: "<:1028:844019857535008798>",
      2048: "<:2048:844019857292525649>",
      4096: "<:4096:844019857530945536>",
      8192: "<:8192:844019857610637372>",
    };
    let manager = new Manager(4);

    const renderBoard = () => {
      const board = manager.grid.cells;

      let total = "";
      total += `:white_large_square::white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:\n`;
      for (const row of board) {
        total += `:white_large_square:`;
        for (const peice of row) {
          total += tiles[peice?.value || "0"];
        }
        total += ":white_large_square:\n";
      }
      total += `:white_large_square::white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:`;
      return {
        embed: {
          color: 0x3ba55c,
          description: total,
        },
      };
    };
    const embedMessage = await message.channel.send(renderBoard());
    const emojis = ["⬅️", "⬇️", "➡️", "⬆️"];
    {
      for (const tile of emojis) await embedMessage.react(tile);
    }
    client.on("message", (msg) => {
      const dirs = ["a", "s", "d", "w"];
      if (msg.author.id === message.author.id && dirs.includes(msg.content)) {
        manager.move(dirs.indexOf(msg.content));
        embedMessage.edit(renderBoard());
        msg.delete();
      }
    });
    while (true) {
      await embedMessage.awaitReactions(() => true, {
        max: 1,
        errors: ["time"],
      });
      for (const reaction of embedMessage.reactions.cache.values()) {
        reaction.users.remove(message.author.id);
        if (
          emojis.includes(reaction.emoji.name) &&
          reaction.users.cache.has(message.author.id)
        ) {
          manager.move(emojis.indexOf(reaction.emoji.name));
          embedMessage.edit(renderBoard());
        }
      }
    }
  },
};
