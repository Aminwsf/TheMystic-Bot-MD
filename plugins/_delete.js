import { getLastMessageInChat } from '@whiskeysockets/baileys'

const handler = async (m, {conn, text}) => {

	//const lastMsgInChat = await getLastMessageInChat(m.chat)
await conn.chatModify('delete', m.chat)
	
m.reply("done")
};
handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^delete$/i;
export default handler;
