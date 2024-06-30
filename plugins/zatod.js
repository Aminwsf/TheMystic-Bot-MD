let handler = m => m

handler.before = async (m, { conn, args }) => {
  
  if (m.isBaileys || (m.isBaileys && m.fromMe && m.isGroup)) return
  if (m.isGroup) return 
  if (m.chat.endsWith('broadcast')) return
  
  await delay(3000)
  await conn.sendMessage(m.chat, {

    react: {

        text: "🇲🇦", // use an empty string to remove the reaction

        key: m.key

    }});
  await delay(2000)
  await conn.sendMessage(m.chat, { text: "يتوفر قريبا..."})

}

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
