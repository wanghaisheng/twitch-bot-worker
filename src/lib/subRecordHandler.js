/*
 * MIT License
 *
 * Copyright (c) 2022 Kasper Stad
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Helper functions to get and set data in Workers KV
 * @param {string} key The KV Key name
 * @param {string} data The KV Key value data
 * @returns {string} returns the value from getCache as a string
 */
const setCache = (key, data) => KV.put(key, data)
const getCache = key => KV.get(key)

/**
 * Receives a Twitch channel sub count test if this count is larger than the one stored in Workers KV, 
 * if it is larger this is updated and date, and saved in Workers KV (in JSON format) under a KEY which is channel name. 
 * If it is lower or equal to, the previously saved count and date are returned. 
 * If silent is specified as an argument, nothing is returned, but the count continues to be updated.
 * @param {Object} req The Request object from the mainHandler
 * @param {string} count The current subscriber count
 * @param {string} channel The twitch channel name, used as Key-name, to store in Workers KV
 * @param {boolean} da Return string should be in danishi language
 * @param {boolean} silent Silent mode - just updates Workers KV and returns nothing (can be used along with the normal !subs command eg.)
 * @returns {Response} HTTP Response with Status plain/text and body as the string requested
 */
const subRecordHandler = async req => {

    const { searchParams } = new URL(req.url)

    const count = searchParams.get("count") || 0
    const danishString = searchParams.has("da")
    const silent = searchParams.has("silent")

    let channel = searchParams.get("channel") || null

    let responseString = ""

    if (channel != null) {

        channel = channel.toLowerCase()

        let channelData = await getCache(channel) || "{\"count\":0,\"date\":\"1970-01-01\"}";
        let channelDataObj = JSON.parse(channelData)

        if (channelData != false) {

            let subRecord = channelDataObj.count
            let subRecordDate = channelDataObj.date

            if (parseInt(count) > parseInt(subRecord)) {

                const tzDate = new Date().toLocaleString('en-US', {timeZone: TZ})
                const currentDate = new Date(tzDate)

                subRecord = parseInt(count)
                subRecordDate = currentDate.toISOString().split('T')[0]
                
                await setCache(channel, JSON.stringify({ 
                    count: parseInt(subRecord), date: subRecordDate
                }))
            }

            if (silent != true) {

                responseString = "On " + subRecordDate + " we hit " + subRecord + " subs!"

                if (danishString) {
                    responseString = "Den " + subRecordDate + " ramte vi " + subRecord + " subs!"
                }
            }
        }
    }

    return new Response(responseString, {
        status: 200,
        statusText: "OK",
        headers: {
            'content-type': 'text/plain',
        }
    })
}

export default subRecordHandler
