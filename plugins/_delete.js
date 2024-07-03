const handler = async (m, {conn, text}) => {
  const lastMsgInChat = await getLastMessageInChat(m.sender) // implement this on your end
await conn.chatModify({
  delete: true,
  lastMessages: [{ key: lastMsgInChat.key, messageTimestamp: lastMsgInChat.messageTimestamp }]
},
m.sender)
m.reply("done")
};
handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^delete$/i;
export default handler;
