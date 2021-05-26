const storage = require("../../modules/storage/index.js");
const { storageFile } = require("../../config");
module.exports = ({ info, configMessages }) => {
  const [member] = info;
  const getStorage = storage(member.guild.id, storageFile);
  const message = configMessages.welcomeMember[
    configMessages.welcomeMember.length - 1
  ].replace("$0", `<@${member.user.id}>`);
  getStorage((storage) => {
    if (storage.welcomechannel)
      member.guild.channels.cache.get(storage.welcomechannel).send(message);
  });
};
