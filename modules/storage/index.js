const fs = require("fs");

module.exports = (guildId, path) => {
  const getStorage = () => {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path, "utf8") || "{}");
  };

  return (callback) => {
    callback(getStorage()[guildId] || {}, (data) => {
      const storage = getStorage();
      storage[guildId] = data;

      fs.writeFileSync(path, JSON.stringify(storage));
    });
  };
};
