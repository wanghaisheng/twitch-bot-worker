const setCache = (key, data) => KV.put(key, data)
const getCache = key => KV.get(key)

const subRecordHandler = async req => {

    const { searchParams } = new URL(req.url)

    const channel = searchParams.get("channel").toUpperCase() || null
    const count = searchParams.get("count") || 0
    const lang = searchParams.get("lang")
    const silent = searchParams.has("silent")

    console.log(channel)

    if (channel != null) {

        let channelData = await getCache(channel) || "{\"count\":0,\"date\":\"1970-01-01\"}";
        let channelDataObj = JSON.parse(channelData)

        if (channelData != false) {

            let subRecord = channelDataObj.count
            let subRecordDate = channelDataObj.date

            if (parseInt(count) > parseInt(subRecord)) {

                const now = new Date();

                subRecord = parseInt(count)
                subRecordDate = now.toISOString().split('T')[0]
                
                await setCache(channel, JSON.stringify({ 
                    count: parseInt(subRecord), date: subRecordDate
                }))
            }

            let responseString = ""

            if (silent != true) {

                responseString = "On " + subRecordDate + " we hit " + subRecord + " subs!"

                if (lang === "da") {
                    responseString = "Den " + subRecordDate + " ramte vi " + subRecord + " subs!"
                }
            }

            return new Response(responseString, { 
                status: 200,
                statusText: 'OK',
                headers: {
                    'content-type': 'text/plain'
                }
            })
        }
    }

    return new Response('Invalid API query', {
        status: 404,
        statusText: 'Not Found',
        headers: {
            'content-type': 'text/plain',
        },
    })
}

export default subRecordHandler
