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
import { age, fivem, notFound, subRecord } from './lib/handlers'

const STREAMELEMENTS_USER_AGENT = "StreamElements Bot"

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

  if (request.headers.get("User-Agent") === STREAMELEMENTS_USER_AGENT) {

    router.get('/v1/age', () => age(request))
    router.get('/v1/fivem/.+', () => fivem(request, STREAMELEMENTS_USER_AGENT))
    router.get('/v1/subrecord', () => subRecord(request))
  }
  
  router.all(() => notFound())

  return await router.route(request)
}
