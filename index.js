require("dotenv").config();

require("./modules/server");

const {
  prefix,
  commandsDirectory,
  eventsDirectory,
  storageFile,
  messages: configMessages,
} = require("./config");
const storage = require("./modules/storage/index");

const { Client, Collection } = require("discord.js");
const client = new Client({ fetchAllMembers: true });
client.commands = new Collection();

const fs = require("fs");
const commandFolders = fs.readdirSync(commandsDirectory);
for (const commandCategory of commandFolders) {
  if (fs.lstatSync(commandsDirectory + "/" + commandCategory).isDirectory()) {
    const commandFiles = fs.readdirSync(
      commandsDirectory + "/" + commandCategory
    );
    for (const file of commandFiles) addCommand(file, commandCategory);
  } else addCommand(commandCategory);
  function addCommand(name, category) {
    let path = commandsDirectory + "/";
    if (category) path += category + "/";
    path += name;
    let command = require(path);
    if (fs.lstatSync(path).isDirectory()) {
      const subCommands = fs.readdirSync(path);
      command = require(path + "/index.js");
      command.children = new Collection();
      subCommands.splice(subCommands.indexOf("index.js"), 1);
      for (const commandName of subCommands) {
        if (commandName.startsWith("_")) continue;
        let childCommand = require(path + "/" + commandName);
        let childName = commandName.split(".")[0];
        childCommand.name = childName;
        childCommand.parent = name;
        command.children.set(childName, childCommand);
      }
    }
    name = name.split(".")[0];
    command.name = name;
    command.category = category;
    client.commands.set(name, command);
  }
}
const events = fs.readdirSync(eventsDirectory);
for (const event of events) {
  client.on(event, (...params) => {
    const files = fs.readdirSync(eventsDirectory + "/" + event);
    for (const file of files) {
      require(eventsDirectory + "/" + event + "/" + file)({
        info: params,
        configMessages,
      });
    }
  });
}

client.login();

client.on("message", (message) => {
  if (message.author.bot) return;
  let content = message.content.trim().split(prefix);
  if (content.shift() !== "") return;
  content = content
    .join(prefix)
    .split(" ")
    .filter((word) => word);
  if (!content.length) return;

  let command = content.shift();

  command =
    client.commands.get(command) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

  if (!command) return;

  const childCommand = command.children
    ?.keyArray()
    .find(
      (cmd) =>
        content[0] === cmd ||
        command.children.get(cmd).aliases.includes(content[0])
    );

  if (childCommand) {
    command = command.children.get(childCommand);
    content.shift();
  }

  const getStorage = storage(message.guild.id, storageFile);

  getStorage((storage, setStorage) => {
    storage.users = storage.users || {};
    storage.users[message.author.id] = storage.users[message.author.id] || {};

    setStorage(storage);
  });

  // console.log(
  //   message.guild.members.cache.get(message.author.id).permissions.toArray()
  // );
  let missingPermissions = [];
  for (const permission of command.permissions || []) {
    if (
      !message.guild.members.cache
        .get(message.author.id)
        .hasPermission(permission)
    ) {
      missingPermissions.push(permission);
    }
  }
  if (missingPermissions.length) {
    message.reply(
      configMessages.missingPermissions.replace(
        "$0",
        missingPermissions
          .map((perm) =>
            perm
              .replace("_", " ")
              .split("")
              .map((letter) => letter.toLowerCase())
              .join("")
          )
          .join(", ")
      )
    );
    return;
  }

  let invalidParams =
    content.length > (command.params || []).length &&
    !command.params?.[command.params.length - 1].match("...");

  args = {};
  (command.params || []).forEach((param, i) => {
    if (content[i] && param.type) {
      let paramType = param.type.split("-");
      switch (paramType[0]) {
        case "ping":
          let [_, type, id] = content[i].match(/<([&|!|#|@]+)([0-9]+)>/) || [];
          if (!type && ["user", "role", "channel"].includes(paramType[1])) {
            // TODO: Make better
            return (invalidParams = true);
          }
          content[i] = id;
          if (
            {
              "@!": "user",
              "@&": "role",
              "#": "channel",
            }[type] != paramType[1]
          )
            invalidParams = true;
          break;
      }
    }

    const nameData = (param.name || param).match(/^(\?)?(\.\.\.)?(.+)/);
    if (!nameData && content[i]) return (args[param] = content[i]);
    const [_, required, rest, name] = nameData;
    if (!required && !content[i]) return (invalidParams = true);
    if (rest) return (args[name] = content.slice(i, content.length)); // TODO: Make better
    args[name] = content[i];
  });

  if (invalidParams) {
    message.reply(configMessages.invalidParams);
    args = {
      command: command.parent || command.name,
      subcommand: command.parent && command.name,
    };
    command = client.commands.get("help");
  }
  command.execute?.({
    message,
    getStorage,
    client,
    args,
    configMessages,
  });
});
