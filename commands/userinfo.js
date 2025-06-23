export const data = {
  name: 'userinfo'
};

export async function execute(message) {
  const user = message.mentions.users.first() || message.author;
  await message.channel.send(`👤 ユーザー名: ${user.username}\n🆔 ID: ${user.id}`);
}
