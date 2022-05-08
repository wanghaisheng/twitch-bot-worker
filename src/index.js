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

import Router from './lib/router'

import ageHandler from './lib/ageHandler'
import fivemHandler from './lib/fivemHandler'
import subRecordHandler from './lib/subRecordHandler'

const WHITELISTED_AGENTS = [
    "Nightbot-URL-Fetcher/0.0.3",
    "StreamElements Bot"
]

addEventListener('fetch', event => {
    event.respondWith(mainHandler(event.request))
})

/**
 * The default handler funtion
 * @param {Object} req The Request object from the mainHandler
 * @returns {Response} HTTP Response using the routes defined
 */
async function mainHandler(request) {

    const router = new Router()
    const userAgent = request.headers.get("User-Agent")

    if (WHITELISTED_AGENTS.includes(userAgent)) {

        router.get('/api/age', () => ageHandler(request))
        router.get('/api/fivem', () => fivemHandler(userAgent))
        router.get('/api/subrecord', () => subRecordHandler(request))

        // This endpoint is deprecated using /api/fivem is now the only option
        router.get('/api/fivem/.+', () => {
            
            return new Response("[Invalid]", {
                status: 410,
                statusText: "Gone",
                headers: {
                    'content-type': 'text/plain',
                }
            })
        })
    }

    return await router.route(request)
}
