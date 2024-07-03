import { getLastMessageInChat } from '@whiskeysockets/baileys'

const handler = async (m, {conn, text}) => {

	const lastMsgInChat = await getLastMessageInChat(m.chat) // implement this on your end
await sock.chatModify({
  delete: true,
  lastMessages: [{ key: lastMsgInChat.key, messageTimestamp: lastMsgInChat.messageTimestamp }]
},
m.chat)
	
m.reply("done")
};
handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^delete$/i;
export default handler;
