async function handleRequest(request) {
  if (request.method !== 'GET') {
    // Passthrough
    response = await fetch(request)
    return response
  }

  const url = new URL(request.url)
  url.search = `access_token=${ACCESS_TOKEN}`

  const newRequest = new Request(url.toString())

  const originResponse = await fetch(newRequest, {
    cf: {
      cacheTtl: TTL,
      cacheEverything: true,
    },
  })

  const response = new Response(originResponse.body, originResponse)
  response.headers.set('cache-control', `max-age=${TTL}`)
  return response
}

addEventListener('fetch', (event) => {
  return event.respondWith(handleRequest(event.request))
})
