

console.time('Application start')

console.time('Imports')

import * as fs from 'fs'
import * as path from 'path'

import { Request, Response } from 'express'
import { Fastr, dnsCache, Logger } from 'devtube-commons'
import { shuffle } from './utils'

console.timeEnd('Imports')

console.time('Init')

// Configuration settings
Logger.enabled = true

// Configure DNS cache
dnsCache()

// Configure Express application dependencies
let express = require('express')
let body = require('body-parser')
let mustache = require('mustache-express')
let cors = require('cors')

let app = express()
let devMode = process.env.DEV_MODE === 'true' || process.argv[2] === 'dev'
let staticDir = devMode ? '../dist' : './dist'
let port = process.env.PORT || 8100


app.use(cors())
app.use(body.json())
app.use(express.static(staticDir, {
  index: false
}))

app.engine('html', mustache())

app.set('port', port)
app.set('view engine', 'mustache')
app.set('view cache', !devMode)
app.set('views', path.join(__dirname, staticDir))

console.timeEnd('Init')

// FASTR
console.time('Fastr indexing')
let fastrDir = `${__dirname}/data`
let fastr = new Fastr({ dataDir: fastrDir, serialized: true })
console.timeEnd('Fastr indexing')

Logger.info('---- APPLICATION STARTED ----')

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Application logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let featuredOrUndefined = () => {
  let tags = fastr.listTags()
  let channels = fastr.listChannels()
  let speakers = fastr.listSpeakers()
  return JSON.stringify({
    tags: tags,
    channels: channels,
    speakers: speakers
  })
}

console.timeEnd('Application start')

async function proxy(req: Request, res: Response) {

  let directLink = ['/channel/', '/tag/'].find(it => req.path.startsWith(it))

  let cookies = req.get('Cookie')
  let nightMode = cookies && cookies.includes("nightMode")

  Logger.info(`REQUEST PATH: ${req.path}`)

  let indexHtml = (res, overrides = {} as any) => {
    let title = overrides.title || 'DevTube - The best developer videos in one place'
    let description = overrides.description || 'Enjoy the best tech conference videos, webinars and tutorials and share it with friends, colleagues, and the world.'
    let ogImage = overrides.ogImage || 'https://dev.tube/open_graph.jpg'

    let defaultResponse = {
      title: title,
      nightMode: nightMode,
      featured: featuredOrUndefined(),
      meta: [
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },
        { property: 'twitter:title', content: title },
        { property: 'twitter:description', content: description },
        { property: 'twitter:image', content: ogImage },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:site', content: '@WatchDevTube' },
        { property: 'twitter:creator', content: '@WatchDevTube' }
      ]
    }
    res.render('index.html', { ...defaultResponse, ...overrides })
  }

  if (!req.path || req.path == "/" || req.path == '/find' ) {
    indexHtml(res)
  } else if (req.path.startsWith("/contributors")) {
    indexHtml(res, {
      title: 'DevTube – Community and Contributors',
      board: fs.readFileSync(`${__dirname}/data/board.json`, 'utf8')
    })
  } else if (req.path.startsWith("/@")) {
    let speaker = req.path.split("/@")[1]
    Logger.info(`SPEAKER REQUEST: ${speaker}`)
    indexHtml(res, {
      title: `DevTube - Videos by @${speaker}`,
      speaker: `"${speaker}"`
    })
  } else if (req.path.startsWith("/discover-api")) {

    console.time(`Discover API`)
    let excludes = req.body.excludes

    let discover = (refinement, sorting) => fastr
      .search(undefined, refinement, sorting)
      .filter(hit => hit != null)
      .filter(hit => !(excludes || []).includes(hit.objectID))
      .slice(0, 100)

    let staffPicks = discover({ 'featured' : true }, '-featured')
    let top = discover(undefined, '-satisfaction')
    let newAdditions = discover(undefined, '-recordingDate')

    let discovered = [
      {
        title: "Staff Picks",
        items: shuffle(staffPicks).slice(0, 8)
      },
      {
        title: "Top Rated",
        items: shuffle(top).slice(0, 8)
      },
      {
        title: "Recent Additions",
        items: shuffle(newAdditions).slice(0, 8)
      }
    ]

    console.timeEnd(`Discover API`)

    res.status(200).send(
      {
        "results": discovered
      }
    )
  } else if (directLink) {
    let param = req.path.split(directLink)[1]
    Logger.info(`DIRECT LINK REQUEST: ${directLink}`)
    
    indexHtml(res, {
      title: `DevTube - Videos, tutorials, webinars about ${param}`
    })   
  } else if (req.path.startsWith("/search")) {

    Logger.info(`SEARCH REQUEST: ${JSON.stringify(req.body.requests[0].params)}`)

    let { query, page, refinement, sortOrder, excludes } = req.body.requests[0].params

    let q = query ? query.trim().split(/\s+/).map(token => `+${token}`).join(" ") : query

    console.time(`Query ${q}`)
    let maxHitsPerPage = 20
    let hitsAll = fastr.search(q, refinement, sortOrder)
      .filter(hit => hit != null)
      .filter(hit => !(excludes || [])
      .includes(hit.objectID))
    let from = (page || 0) * maxHitsPerPage
    let to = from + maxHitsPerPage
    let hitsPage = hitsAll.slice(from, to)
    let nbPages = Math.ceil(hitsAll.length / maxHitsPerPage)

    console.timeEnd(`Query ${q}`)

    res.status(200).send(
      {
        "results": [
          {
            "hits": hitsPage,
            "page": page,
            "nbHits": hitsAll.length,
            "nbPages": nbPages,
            "hitsPerPage": maxHitsPerPage
          }
        ]
      }
    )

  } else if (req.path.startsWith('/video/')) {

    let objectID = req.path.split('/')[2]
    
    Logger.info(`VIDEO REQUEST: ${objectID}`)
    
    let q = undefined
    let sortOrder = '-satisfaction'
    let refinement = { 'objectID' : objectID } 

    let video = fastr.search(q, refinement, sortOrder)
      .filter(hit => hit != null)
      .find(it => true) as any

    if (!video) {
      res.status(404).send('Not found')
    } else {
      let ogImage = `https://img.youtube.com/vi/${video.objectID}/maxresdefault.jpg`
      let link = `https://youtube.com/v/${video.objectID}`
      let title = `${video.title} – Watch @ Dev.Tube`
      indexHtml(res, {
        title: title,
        description: video.description,
        ogImage: ogImage,
        preloadedEntity: JSON.stringify(video),
        meta: [
          { name: "description", content: video.description },
          { property: "og:title", content: title },
          { property: "og:description", content: video.description },
          { property: "og:image", content: ogImage },
          { property: 'twitter:title', content: title },
          { property: 'twitter:description', content: video.description },
          { property: 'twitter:image', content: ogImage },
          { property: 'twitter:card', content: 'player' },
          { property: 'twitter:player', content: link },
          { property: 'twitter:player:width', content: '435' },
          { property: 'twitter:player:height', content: '251' },
          { property: 'twitter:site', content: '@WatchDevTube' },
          { property: 'twitter:creator', content: '@WatchDevTube' }
        ]
      })
    }
  } else {
    if (fs.existsSync('.' + req.path)) {
      res.sendFile('.' + req.path)
    } else {
      res.status(404).send('not found')
    }
  }
}

app.get("*", proxy)
app.post("*", proxy)

if (devMode) {
  let listener = app.listen(port, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  })
}

module.exports = app
