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

import notFound from './notFound'

const setCache = (key, data) => KV.put(key, data)
const getCache = key => KV.get(key)

const subRecordHandler = async req => {

  const { searchParams } = new URL(req.url)

  const count = searchParams.get("count") || 0
  const lang = searchParams.get("lang")
  const silent = searchParams.has("silent")

  let channel = searchParams.get("channel") || null

  if (channel != null) {

    channel = channel.toUpperCase()

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

  return await notFound()
}

export default subRecordHandler
