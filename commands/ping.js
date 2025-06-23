export const data = {
  name: 'ping'
};

export async function execute(message) {
  await message.reply('🏓 Pong!');
}
