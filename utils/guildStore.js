import fs from 'fs-extra';

const path = './db.json';

export function saveGuildId(guildId, name) {
  let data = {};
  if (fs.existsSync(path)) {
    data = fs.readJsonSync(path);
  }

  data[guildId] = name;
  fs.writeJsonSync(path, data, { spaces: 2 });
}

export function getAllGuilds() {
  if (!fs.existsSync(path)) return {};
  return fs.readJsonSync(path);
}
