const lang = require("../other/text.json");
const axios = require("axios").default;
const errMes = `ID:\n${lang.indo.util.download.igFail}\n\nEN:\n${lang.eng.util.download.igFail}`;

module.exports = {
	name: "igdl",
	limit: true,
	consume: 3,
	premium: true,
	premiumType: ["drakath", "nulgath", "artix"],
	alias: ["ig"],
	category: "downloader",
	desc: "Download instagram media",
	async exec({ sock, msg, args }) {
		if (!args.length > 0) return await msg.reply("Ex: !igdl *instagram_url*");
		try {
			const { url } = parse(args.join(" "));
			if (url === "") {
				return await msg.reply("No valid URL detected");
			}
			await msg.reply("Tunggu sebentar ⏳ _please wait_");
			const apiUrl = `https://api.lolhuman.xyz/api/instagram?apikey=nyanpasuu&url=${url}`;

			let result = await axios.get(apiUrl);
			let data = result.data.result;
			data.forEach(async (d) => {
				if (checkInstagramContentType(d) === "video") {
					await sock.sendMessage(
						msg.from,
						{ video: { url: d } },
						{ quoted: msg }
					);
				} else if (checkInstagramContentType(d) === "gambar") {
					await sock.sendMessage(
						msg.from,
						{ image: { url: d } },
						{ quoted: msg }
					);
				} else if (checkInstagramContentType(d) === "campuran") {
					if (checkInstagramContentType(d) === "video") {
						await sock.sendMessage(
							msg.from,
							{ video: { url: d } },
							{ quoted: msg }
						);
					} else {
						await sock.sendMessage(
							msg.from,
							{ image: { url: d } },
							{ quoted: msg }
						);
					}

				}
			})
		} catch (e) {
			await msg.reply(errMes);
		}
	},
};

function checkInstagramContentType(link) {
	if (link.includes('.jpg') || link.includes('.jpeg')) {
		return 'gambar'
	} else if (link.includes('.mp4')) {
		return 'video'
	} else if (link.includes('.mp4') && link.includes('.jpeg')) {
		return 'campuran'
	} {
		return
	}
}
const parse = (text) => {
	const rex = /(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?instagram.com\/([^\s&]+)/gi;
	const url = text.match(rex);
	return { url: url == null ? "" : url[0] };
};


