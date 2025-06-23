import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import fs from 'fs';
import { saveGuildId } from './utils/guildStore.js';
import config from './config.json' assert { type: "json" };

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.commands = new Collection();

// コマンド読み込み
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Bot起動時
client.once(Events.ClientReady, () => {
  console.log(`✨ Logged in as ${client.user.tag}`);
});

// メッセージコマンド処理
client.on(Events.MessageCreate, async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('⚠️ コマンド実行中にエラーが発生しました。');
  }
});

// 新しいサーバーに追加されたとき
client.on(Events.GuildCreate, guild => {
  saveGuildId(guild.id, guild.name);
});

client.login(config.token);
