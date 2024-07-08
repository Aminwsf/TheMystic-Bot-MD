const { G4F } = require("g4f");
const g4f = new G4F()

const handler = async (m, {conn, text}) => {
const img = await realistic(text)
await conn.sendFile(m.chat, img, 'error.jpg', null, m);
};
handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^dr$/i;
export default handler;

async function realistic(prompt) {
  const imageGenerator = await g4f.imageGeneration(prompt, {
    debug: true,
    providers: g4f.providers.Pixart,
    providersOptions: {
      height: 512,
      width: 512,
      samplingMethod: "SA-Solver"
    }
  });

  const danz = Buffer.from(imageGenerator, "base64");
   
  return danz;
}
