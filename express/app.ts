

console.time('Application start')

console.time('Imports')

import * as fs from 'fs'
import * as path from 'path'
import * as lru from 'lru-cache'
import * as algolia from 'algoliasearch'

import { Request, Response } from 'express'
import { Fastr, dnsCache, Logger } from 'devtube-commons'

console.timeEnd('Imports')

console.time('Init')

// Configuration settings
const algoliaAppId = 'DR90AOGGE9'
const algoliaApiKey = 'c2655fa0f331ebf28c89f16ec8268565'
const algoliaIndexName = 'videos'
const videoCacheSize = 500
const videoCacheTTL = 1000 * 60 * 60 
Logger.enabled = true

// Configure video cache
let videoCache = lru({ 
  max: videoCacheSize, 
  maxAge: videoCacheTTL
})

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

let client = algolia(algoliaAppId, algoliaApiKey)
let index = client.initIndex(algoliaIndexName)

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

// EXPERIMENTAL FASTR MODE
console.time('Fastr indexing')
let fastrDir = `${__dirname}/data`
let fastrMode = fs.existsSync(fastrDir) && fs.statSync(fastrDir).isDirectory()
let fastr = fastrMode ? new Fastr({ dataDir: fastrDir, serialized: true }) : undefined
console.timeEnd('Fastr indexing')

Logger.info('---- APPLICATION STARTED ----')
Logger.info(`---- FASTR MODE: ${fastrMode} ----`)


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Application logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let featuredOrUndefined = () => {
  if (!fastrMode) {
    return undefined
  }
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

  let prefix = '/proxy3'

  if (!req.path || req.path == prefix) {

    let title = 'DevTube - The best developer videos in one place'
    let description = 'Enjoy the best technical videos and share it with friends, colleagues, and the world.'

    res.render('index.html', {      
      title: title,
      fastrMode: fastrMode,
      nightMode: nightMode,
      featured: featuredOrUndefined(),
      meta: [
        { name: "description", content: description },
        { name: "og:title", content: title },
        { name: "og:description", content: description },
        { name: "og:image", content: 'https://dev.tube/open_graph.jpg' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://dev.tube/open_graph.jpg' }
      ]
    })
  } else if (req.path.startsWith(`${prefix}/contributors`)) {

    // Preload data
    console.time('Contributors loading')
    let board = fs.readFileSync(`${__dirname}/data/board.json`, 'utf8')
    console.timeEnd('Contributors loading')

    let title = 'DevTube Contributors'
    let description = 'Enjoy the best technical videos and share it with friends, colleagues, and the world.'
    let response = {
      title: title,
      fastrMode: fastrMode,
      nightMode: nightMode,
      board: board,
      meta: [
        { name: "description", content: description },
        { name: "og:title", content: title },
        { name: "og:description", content: description },
        { name: "og:image", content: 'https://dev.tube/open_graph.jpg' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://dev.tube/open_graph.jpg' }
      ]
    }
    res.render('index.html', response)

  } else if (req.path.startsWith(`${prefix}/@`)) {

    let speaker = req.path.split("/@")[1]

    Logger.info(`SPEAKER REQUEST: ${speaker}`)

    let title = `DevTube - Videos by @${speaker}`
    let description = 'Enjoy the best technical videos and share it with friends, colleagues, and the world.'

    res.render('index.html', {
      title: title,
      nightMode: nightMode,
      featured: featuredOrUndefined(),
      speaker: `"${speaker}"`,
      fastrMode: fastrMode,
      meta: [
        { name: "description", content: description },
        { name: "og:title", content: title },
        { name: "og:description", content: description },
        { name: "og:image", content: 'https://dev.tube/open_graph.jpg' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://dev.tube/open_graph.jpg' }
      ]
    })

  } else if (directLink) {

    let param = req.path.split(directLink)[1]

    Logger.info(`DIRECT LINK REQUEST: ${directLink}`)

    let title = `DevTube - Videos by ${param}`
    let description = 'Enjoy the best technical videos and share it with friends, colleagues, and the world.'
    
    res.render('index.html', {
      title: title,
      nightMode: nightMode,
      featured: featuredOrUndefined(),
      fastrMode: fastrMode,
      meta: [
        { name: "description", content: description },
        { name: "og:title", content: title },
        { name: "og:description", content: description },
        { name: "og:image", content: 'https://dev.tube/open_graph.jpg' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://dev.tube/open_graph.jpg' }
      ]
    })    

  } else if (req.path.startsWith(`${prefix}/search`) && fastrMode) {

    Logger.info(`SEARCH REQUEST: ${JSON.stringify(req.body.requests[0].params)}`)

    let { query, page, refinement, sortOrder } = req.body.requests[0].params

    console.time(`Query ${query}`)

    let maxHitsPerPage = 21
    let hitsAll = fastr.search(query, refinement, sortOrder)
    let from = page * maxHitsPerPage
    let to = from + maxHitsPerPage
    let hitsPage = hitsAll.slice(from, to)
    let nbPages = Math.ceil(hitsAll.length / maxHitsPerPage)

    console.timeEnd(`Query ${query}`)

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

  } else if (req.path.startsWith(`${prefix}/video`)) {

    let objectID = req.path.split('/')[2]
    
    Logger.info(`VIDEO REQUEST: ${objectID}`)
    
    try {
      let video = videoCache.has(objectID) ? videoCache.get(objectID) : await index.getObject(objectID) as any
      videoCache.set(objectID, video)
      res.render('index.html', {
        title: `${video.title} - Watch at Dev.Tube`,
        fastrMode: fastrMode,
        nightMode: nightMode,
        featured: featuredOrUndefined(),
        preloadedEntity: JSON.stringify(video),
        meta: [
          { name: 'description', content: video.description },
          { name: "og:title", content: video.title },
          { name: "og:description", content: video.description },
          { name: "og:image", content: `https://img.youtube.com/vi/${video.objectID}/maxresdefault.jpg` },
          { name: 'twitter:title', content: video.title },
          { name: 'twitter:description', content: video.description },
          { name: 'twitter:image', content: `https://img.youtube.com/vi/${video.objectID}/maxresdefault.jpg` }
        ]
      })
    } catch (e) {      
      if (e.statusCode && e.statusCode == 404) {
        res.status(404).send('Not found')
      } else {
        Logger.error(e) 
        res.render('index.html', {
          title: `Error at Dev.Tube`,
          serverSideError: JSON.stringify(
            { message: 'Sorry, but the video is not available now. We\'re working on the solution.' })
        })
      }
    }

  } else {
    if (fs.existsSync('/var/task/dist/' + req.path.replace(prefix, '/'))) {
      console.log('FILE: /var/task/dist/' + req.path.replace(prefix, '/'))
      res.sendFile('/var/task/dist/' + req.path.replace(prefix, '/'))
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
