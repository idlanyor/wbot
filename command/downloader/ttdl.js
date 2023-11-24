const axios = require("axios");
const Downloader = require("../../utils/downloader");
const lang = require("../other/text.json");

const errMess = `ID:\n${lang.indo.util.download.ttFail}\n\nEN:\n${lang.eng.util.download.ttFail}`;

module.exports = {
	name: "ttdl",
	limit: true,
	consume: 1,
	alias: ["tiktok", "tt", "tiktokdl", "tiktokmusic", "tiktoknowm", "tiktokwm", "ttwm", "ttnowm", "ttmusic"],
	category: "downloader",
	desc: "Download TikTok Video",
	use: "[options] url\n\n- *Options* -\n\n1. audio\n2. video\n\nEx: !tiktok audio url",
	async exec({ sock, msg, args }) {
		try {
			const { url } = parse(args.join(" "));
			if (url === "") {
				return await msg.reply("No valid URL detected");
			}
			const apiUrl = `https://api.lolhuman.xyz/api/tiktok?apikey=nyanpasuu&url=${url}`;

			let result = await axios.get(apiUrl);
			let data = result.data.result;
			// return
			// if (!data.length > 0) return msg.reply("NO VIDEO FOUND");
			await sock.sendMessage(
				msg.from,
				{ video: { url: data.link } },
				{ quoted: msg }
			);
		} catch (e) {
			await msg.reply(errMess);
		}
	},
};

const parse = (text) => {
	const rex = /(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi;
	const url = text.match(rex);
	return { url: url == null ? "" : url[0] };
};
