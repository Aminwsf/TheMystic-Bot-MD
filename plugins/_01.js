let handler = m => m

handler.before = async (m, { conn, args }) => {
  
  if (m.isBaileys || (m.isBaileys && m.fromMe && m.isGroup)) return
  if (m.chat.endsWith('broadcast')) return
  
  await delay(3000)
 
}

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
