import Router from './lib/router'

import ageHandler from './lib/ageHandler'
import subRecordHandler from './lib/subRecordHandler'

const STREAMELEMENTS_USER_AGENT = "StreamElements Bot"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  const router = new Router()

  if (request.headers.get("User-Agent") === STREAMELEMENTS_USER_AGENT) {

    router.get('/age', () => ageHandler(request))
    router.get('/subrecord', () => subRecordHandler(request))
  }

  return await router.route(request)
}
