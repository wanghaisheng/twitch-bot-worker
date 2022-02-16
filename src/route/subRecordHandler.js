const setCache = (key, data) => KV.put(key, data)
const getCache = key => KV.get(key)

const subRecordHandler = async request => {

    const { searchParams } = new URL(request.url)

    const channel = searchParams.get("channel").toUpperCase() || null;
    const returnDate = searchParams.has("returnDate")
    const silentMode = searchParams.has("silent")
    const subCount = searchParams.get("count") || 0;

    if (channel != null) {

        const kvKeyPrefix = (channel + "_SUBRECORD").toUpperCase()

        let subRecord = await getCache(kvKeyPrefix) || 0;
        let subRecordDate = await getCache(kvKeyPrefix + "_DATE") || 0;

        if (parseInt(subCount) > parseInt(subRecord)) {

            const now = new Date();

            subRecord = parseInt(subCount)
            subRecordDate = now.toISOString().split('T')[0]

            await setCache(kvKeyPrefix, parseInt(subRecord))
            await setCache(kvKeyPrefix + "_DATE", subRecordDate)
        }

        let responseString = ""

        if (silentMode != true) {

            responseString = subRecord

            if (returnDate) {
                responseString = subRecordDate
            }
//            responseString = "Den " + subRecordDate + " ramte vi " + subRecord + " subs! | TUSIND tak for alt støtten <3"
        }

        return new Response(responseString, { 
            status: 200,
            statusText: 'OK',
            headers: {
                'content-type': 'text/plain'
            }
        })
    }

    return new Response('404 Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: {
            'content-type': 'text/plain',
        },
    })
}

export default subRecordHandler
