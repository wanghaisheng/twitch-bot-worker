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
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
const Method = method => req =>
  req.method.toLowerCase() === method.toLowerCase()

const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

const Path = regExp => req => {
  const url = new URL(req.url)
  const path = url.pathname
  const match = path.match(regExp) || []
  return match[0] === path
}

/**
* The Router handles determines which handler is matched given the
* conditions present for each request.
*/
class Router {

  constructor() {
    this.routes = []
  }

  handle(conditions, handler) {
    this.routes.push({
      conditions,
      handler,
    })
    return this
  }

  connect(url, handler) {
    return this.handle([Connect, Path(url)], handler)
  }

  delete(url, handler) {
    return this.handle([Delete, Path(url)], handler)
  }

  get(url, handler) {
    return this.handle([Get, Path(url)], handler)
  }

  head(url, handler) {
    return this.handle([Head, Path(url)], handler)
  }

  options(url, handler) {
    return this.handle([Options, Path(url)], handler)
  }

  patch(url, handler) {
    return this.handle([Patch, Path(url)], handler)
  }

  post(url, handler) {
    return this.handle([Post, Path(url)], handler)
  }

  put(url, handler) {
    return this.handle([Put, Path(url)], handler)
  }

  trace(url, handler) {
    return this.handle([Trace, Path(url)], handler)
  }

  all(handler) {
    return this.handle([], handler)
  }

  route(req) {
    const route = this.resolve(req)

    if (route) {
      return route.handler(req)
    }

    return new Response('resource not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'content-type': 'text/plain',
      },
    })
  }

  /**
  * resolve returns the matching route for a request that returns
  * true for all conditions (if any).
  */
  resolve(req) {
    return this.routes.find(r => {
      if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
        return true
      }

      if (typeof r.conditions === 'function') {
        return r.conditions(req)
      }

      return r.conditions.every(c => c(req))
    })
  }
}

module.exports = Router
