const { generateWAMessageFromContent, proto } = require("@adiwajshing/baileys");
const Downloader = require('../../utils/downloader');
const { yt, yts } = new Downloader();
const { fetchBuffer, fetchText } = require('../../utils');

module.exports = {
    name: 'play',
    category: 'downloader',
    desc: 'Play media from YouTube.',
    async exec(msg, sock, args) {
        const { from } = msg
        if (args.length < 1) return await msg.reply('No query given to search.');
        const ytsData = await yts(args.join(' '), 'short')
        if (!ytsData.length > 0) return await msg.reply("No video found for that keyword, try another keyword");
        let thumb = await fetchBuffer(ytsData[0].thumbnail)
        const res = await yt(ytsData[0].url, "audio");
        // message struct
        let prep = generateWAMessageFromContent(from, proto.Message.fromObject({
            buttonsMessage: {
                locationMessage: { jpegThumbnail: thumb.toString("base64") },
                contentText: `📙 Title: ${ytsData[0].title}\n📎 Url: ${ytsData[0].url}\n🚀 Upload: ${ytsData[0].ago}\n\nWant a video version? click button below, or you don\'t see it? type *!ytv youtube_url*\n\nAudio on progress....`,
                footerText: " Kaguya PublicBot • FaizBastomi",
                headerType: 6,
                buttons: [{ buttonText: { displayText: "Video" }, buttonId: `#ytv ${ytsData[0].url} SMH`, type: 1 }]
            }
        }), { timestamp: new Date() })

        // Sending message
        await sock.relayMessage(from, prep.message, { messageId: prep.key.id }).then(async () => {
            try {
                if (res.size >= 10 << 10) {
                    let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`);
                    let capt = `*Title:* ${res.title}\n`
                        + `*Quality:* ${res.q}\n*Size:* ${res.sizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                    await sock.sendMessage(from, { image: { url: res.thumb }, caption: capt }, { quoted: prep });
                } else {
                    await sock.sendMessage(from, { audio: (await fetchBuffer(res.dl_link)), mimetype: "audio/mp4" }, { quoted: prep });
                }
            } catch (e) {
                console.log(e)
                await msg.reply("Something wrong when sending the file");
            }
        })
        thumb = null;
    }
}