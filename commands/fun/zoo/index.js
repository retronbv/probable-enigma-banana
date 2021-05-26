const { ANIMALS, displayName } = require("./_animals");

module.exports = {
  description: "Get an animal!",
  aliases: ["z"],
  execute({ message, args, getStorage }) {
    const random = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    message.channel.send(`:${random}: You got a ${displayName(random)}!`);
    getStorage((storage, setStorage) => {
      storage.users[message.author.id].animals =
        storage.users[message.author.id].animals || [];
      storage.users[message.author.id].animals.push(random);
      setStorage(storage);
    });
  },
};
