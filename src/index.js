import Router from './lib/router'

import age from './handler/age'
import fivem from './handler/fivem'
import notFound from './handler/notFound'
import subRecord from './handler/subRecord'

const STREAMELEMENTS_USER_AGENT = "StreamElements Bot"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  const router = new Router()

  if (request.headers.get("User-Agent") === STREAMELEMENTS_USER_AGENT) {

    router.get('/age', () => age(request))             // Needs to be removed
    router.get('/subrecord', () => subRecord(request)) // Needs to be removed

    router.get('/v1/age', () => age(request))
    router.get('/v1/subrecord', () => subRecord(request))
    router.get('/v1/fivem/.+', () => fivem(request))

    router.all(() => notFound())
  }

  return await router.route(request)
}
