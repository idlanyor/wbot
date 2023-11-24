

// Inisialisasi objek ChatGPTAPI
module.exports = {
    name: 'ChatGPT',
    category: 'information',
    limit: true,
    consume: 5,
    alias: ["gpt"],
    use: `.gpt`,
    desc: "Menggunakan ChatGPT 3.5-turbo.",

    async exec({ msg, args }) {
        if (!args.length > 0) return await msg.reply("Tidak ada pertanyaan yang diajukan.");

        try {
            const { ChatGPTAPI } = await import('chatgpt');

            const chatGPT = new ChatGPTAPI({
                apiKey: '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',
                completionParams: {
                    model: 'gpt-3.5-turbo-1106',
                    temperature: 0.5,
                    top_p: 0.8
                }
            });

            const chatMsg = args.join(" ");

            let res = await chatGPT.sendMessage(chatMsg, {
                systemMessage: `namamu adalah Kanata pembuatmu seorang Mahasiswa semester 3 di universitas STMIK Widya utama bernama Roynaldi,kamu akan mengatakan saat ada orang yang bertanya,
                Sekarang jam : ${new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })} , Tanggal Sekarang: ${new Date().toISOString()}\n\njika ada sesuatu yang ditanyakan orang dan sesuatu tersebut belum kamu tahu,maka coba cari referensi dari sumber lain`
            })
            await msg.reply(res.text);
        } catch (e) {
            // throw e
            await msg.reply("Terjadi kesalahan saat memproses permintaan.");
        }
    }
};

