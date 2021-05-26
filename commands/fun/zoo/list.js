const { displayName } = require("./_animals");

module.exports = {
  description: "View your zoo list!",
  aliases: ["l"],
  execute({ message, args, getStorage }) {
    getStorage((storage) => {
      const animals = {};
      storage.users?.[message.author.id]?.animals.map(
        (animal) => (animals[animal] = (animals[animal] || 0) + 1)
      );
      message.channel.send(
        Object.keys(animals).map(
          (animal) => `:${animal}: ${displayName(animal)} x${animals[animal]}`
        )
      );
    });
  },
};
