import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { saveGuildId } from './utils/guildStore.js';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX || '!';
const ownerId = process.env.OWNER_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// コマンド読み込み
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
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

client.on(Events.GuildCreate, guild => {
  saveGuildId(guild.id, guild.name);
});

client.login(token);
