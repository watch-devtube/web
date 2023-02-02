addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { url, headers } = request

  const userAgent = headers.get('user-agent') || ''
  const bots = ["Twitterbot", "Slackbot", "LinkedIn"];

  if (url.includes('https://dev.tube/video/') && bots.some(bot => userAgent.includes(bot))) {
    const redirectUrl = url.replace('https://dev.tube/video/', 'https://dev.tube/api/og/')
    return Response.redirect(redirectUrl, 302)
  }

  if (url.includes('dev.tube/sitemap.xml')) {
    return Response.redirect('https://dev.tube/api/sitemap', 302)
  } else if (url.includes('dev.tube/rss.xml')) {
    return Response.redirect('https://dev.tube/api/rss', 302)
  } else {
    return await fetch(request)
  }
} 