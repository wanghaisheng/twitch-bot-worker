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

import response from "./response"

/**
 * Fetch the FiveM server list API and return current players and max players
 * endPoint is defined as part of the URL: /v1/fivem/{endPoint}
 * @param {string} endPoint The FiveM list API endPoint
 * @param {Object} req The Request object from the mainHandler
 * @param {string} userAgent the event.request object
 * @returns {Response} HTTP Response with Status plain/text and body as string {current}/{max}
 */
const fivemHandler = async (req, userAgent) => {

    const { pathname } = new URL(req.url)
    const endPoint = pathname.substring(10)
  
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
  
    response()
}

export default fivemHandler
