module.exports = {
  description: "I will repeat what you say!",
  aliases: ["say", "r"],
  params: ["...text"],
  execute({ message, args }) {
    console.log(args);
    message.channel.send(args.text.join(" "));
  },
};
