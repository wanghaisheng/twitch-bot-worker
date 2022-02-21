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
 * @param key The KV Key name
 * @param data The KV value data
 * @returns {string} returns the value from getCache as a string
 */
const setCache = (key, data) => KV.put(key, data)
const getCache = key => KV.get(key)

/**
 * Calculate the age from the queryParam and return the age
 * @param req the event.request object
 * @returns {Response} returns the 
 */
const age = async req => {

    const { searchParams } = new URL(req.url)
  
    const birthDay = searchParams.get("birthday") || null;
  
    if (birthDay != null) {
  
      const tzDate = new Date().toLocaleString('en-US', {timeZone: TZ})
      const currentDate = new Date(tzDate)
  
      const birthDayDate = new Date(birthDay)
  
      let currentAge = currentDate.getFullYear() -  birthDayDate.getFullYear()
      let month = currentDate.getMonth() -  birthDayDate.getMonth()
  
      if (month < 0 || (month === 0 && currentDate.getDate() < birthDayDate.getDate())) {
        currentAge--
      }
  
      return new Response(currentAge, { 
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/plain'
        }
      })
    }
  
    notFound()
}

/**
 * fetch the FiveM server list API and return current players and max players
 * endPoint is defined as part of the URL: /v1/fivem/{endPoint} 
 * @param req the event.request object
 * @param userAgent the event.request object
 * @returns {Response} returns the 
 */
const fivem = async (req, userAgent) => {

  const { pathname } = new URL(req.url)
  const endPoint = pathname.substring(9)

  if (endPoint != "") {
    
    const resp = await fetch('https://servers-frontend.fivem.net/api/servers/single/' + endPoint, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'user-agent': userAgent
      }
    })

    let responseText = "[No Data]"

    if (resp.status === 200) {
      const respData = await resp.json()
      responseText = respData.Data.clients + '/' + respData.Data.sv_maxclients
    }

    return new Response(responseText, { 
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'text/plain'
      }
    })
  }

  notFound()
}

/**
 * notFound default response 
 * @returns {Response} returns the 
 */
const notFound = () => {

  return new Response('Invalid API query', {
    status: 404,
    statusText: 'Not Found',
    headers: {
      'content-type': 'text/plain',
    },
  })
}

/**
 * Get the SubCount, Channel, Language and "Silent"-mode for comparing the latest value stored in Workers KV
 * If the count is greater than the stored value, it is updated with the new date and count in Workers KV
 * If the value is lower or equal to the stored value, the value from Worker KV is returned and nothing is updated
 * @param req the event.request object
 * @param count the subcount eg. 123
 * @param lang the return text language, default is English, danish (da) is supported
 * @param silent Silent mode - just updates Workers KV and returns nothing (can be used along with the normal !subs command eg.)
 * @returns {Response} returns the 
 */
const subRecord = async req => {

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

  notFound()
}

// export the functions
export { age, fivem, notFound, subRecord }
