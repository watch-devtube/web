addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { url } = request

  if (url.includes('dev.tube/sitemap.xml')) {
    return Response.redirect('api.dev.tube/sitemap', 302)
  } else if (url.includes('dev.tube/rss.xml')) {
    return Response.redirect('api.dev.tube/rss', 302)
  } else {
    return await fetch(request)
  }
}