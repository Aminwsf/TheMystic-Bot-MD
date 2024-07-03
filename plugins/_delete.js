const handler = async (m, {conn, text}) => {
	
await conn.chatModify({
  delete: true,
},
m.sender)
m.reply("done")
};
handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^delete$/i;
export default handler;
