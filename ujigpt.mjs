import { ChatGPTAPI } from 'chatgpt'

async function example() {
    const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY,
        completionParams: {
            model: 'gpt-3.5-turbo-1106',
            temperature: 0.5,
            top_p: 0.8
        }
    })

    // send a message and wait for the response
    let res = await api.sendMessage('sebutkan 5 nama hewan?')
    console.log(res.text)

    // send a follow-up
    res = await api.sendMessage('Sebutkan lagi,3 saja?', {
        parentMessageId: res.id
    })
    console.log(res.text)

    // send another follow-up
    res = await api.sendMessage('kita sedang berbicara tentang apa?', {
        parentMessageId: res.id
    })
    console.log(res.text)
}
example();
