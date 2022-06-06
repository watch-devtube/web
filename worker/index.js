addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { url, headers } = request

  const userAgent = headers.get('user-agent') || ""
  const isTwitterBot = userAgent.includes('Twitterbot')

  if (isTwitterBot && url.includes('https://dev.tube/video/')) {
    const redirectUrl = url.replace('https://dev.tube/video/', 'https://api.dev.tube/og/')
    return Response.redirect(redirectUrl, 302)
  }

  if (url.includes('dev.tube/sitemap.xml')) {
    return Response.redirect('https://api.dev.tube/sitemap', 302)
  } else if (url.includes('dev.tube/rss.xml')) {
    return Response.redirect('https://api.dev.tube/rss', 302)
  } else {
    return await fetch(request)
  }
} 