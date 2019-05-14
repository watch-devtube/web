
console.time('Application start')

console.time('Imports')

import * as fs from 'fs'
import * as path from 'path'
import * as dayjs from 'dayjs'

import './utils'
import { Fastr } from 'devtube-commons'
import { Request, Response } from 'express'
import axios from 'axios'
import { dnsCache, Logger } from 'devtube-commons'
import { unescape } from 'querystring'
import { Videos } from './videos'
import { Brownbags } from './brownbags'
import { User } from './api/user'
import { OgImage } from './ogImage'
import responseTime from './responseTime'

console.timeEnd('Imports')

console.time('Init')

// Configuration settings
Logger.enabled = true

// Configure DNS cache
dnsCache()

// Configure Express application dependencies
let oneHour = 3600000 * 4
let express = require('express')
let body = require('body-parser')
let mustache = require('mustache-express')
let cors = require('cors')

let app = express()
let devMode = process.env.DEV_MODE === 'true' || process.argv[2] === 'dev'
let staticDir = path.resolve(devMode ? `../dist` : './dist')
let dataDir = path.resolve('./data')
let port = process.env.PORT || 8100

Logger.time('Fastr indexing')
let fastr = new Fastr({ dataDir: dataDir, serialized: true })
Logger.timeEnd('Fastr indexing')

app.use(cors())
app.use(responseTime)
app.use(body.json())

app.use(express.static(staticDir, {
  index: false,
  maxAge: oneHour
}))

app.engine('html', mustache())

app.set('port', port)
app.set('view engine', 'mustache')
app.set('view cache', !devMode)
app.set('views', path.join(__dirname, staticDir))

console.timeEnd('Init')

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

    let doubleToSingleQuotes = (str) => str.replace(/"/g, '\'')

    let title = doubleToSingleQuotes(overrides.title || 'DevTube - The best developer videos in one place')
    let description = doubleToSingleQuotes(overrides.description || 'Enjoy the best tech conference videos, webinars and tutorials and share it with friends, colleagues, and the world.')
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

    res.render(`${staticDir}/index.html`, { ...defaultResponse, ...overrides })

  }

  if (!req.path || req.path == "/" || req.path == '/find' ) {
    indexHtml(res)
  } else if (req.path.startsWith("/contributors")) {
    indexHtml(res, {
      title: 'DevTube – Community and Contributors',
      description: 'Let\'s build the best tech video hub together!',
      board: fs.readFileSync(`${dataDir}/board.json`, 'utf8')
    })
  } else if (req.path.startsWith("/brownbags/")) {
    let objectID = req.path.split('/')[2]
    let brownbags = new Brownbags()
    let brownbag = await brownbags.fetchOne(objectID)
    indexHtml(res, {
      title: 'DevTube – Brown-Bags',
      description: 'Let\'s watch videos together, real-time.',
      brownbag: JSON.stringify(brownbag)
    })    
  } else if (req.path.startsWith("/@")) {
    let [_, speaker] = req.path.split("/@")
    Logger.info(`SPEAKER REQUEST: ${speaker}`)

    let profile = await axios.get(`https://dossier.dev.tube/twt/${speaker}`)
    let profileData = profile.data    
    indexHtml(res, {
      title: `${profileData.name}'s conference talks, videos and tutorials`,
      description: profileData.info,
      speaker: JSON.stringify(profileData),
      ogImage: new OgImage(speaker, profileData.name, profileData.info).url
    })
  } else if (req.path.startsWith("/api/")) {
    let module = await import(`.${req.path}`)
    module.default(req, res, fastr)
  } else if (directLink) {
    // let param = unescape(req.path.split(directLink)[1])
    let param = req.path.split(directLink)[1]
    Logger.info(`DIRECT LINK REQUEST: ${directLink}`)
    indexHtml(res, {
      title: `DevTube - Videos, tutorials, webinars about ${param}`,
      description: `All videos and tutorials by @${param} are here`,
    })   
  } else if (req.path.startsWith('/video/')) {

    let objectID = req.path.split('/')[2]
    
    Logger.info(`VIDEO REQUEST: ${objectID}`)
    
    let q = undefined
    let sortOrder = ['-satisfaction']
    let refinement = { 'objectID' : objectID } 

    let videoId = fastr.search(q, refinement, sortOrder)
      .filter(hit => hit != null)
      .map(it => it.objectID)
      .find(it => true)

    if (!videoId) {
      res.status(404).send('Not found')
      return
    }


    let videos = new Videos([videoId])
    let [video] = await videos.fetch()
    let [reactions] = await videos.reactions()

    if (!video) {
      res.status(404).send('Not found')
    } else {
      let ogImage = `https://img.youtube.com/vi/${video.objectID}/maxresdefault.jpg`
      let title = `${video.title} – Watch Video @ Dev.Tube`
      indexHtml(res, {
        title: title,
        description: video.description,
        ogImage: ogImage,
        preloadedEntity: JSON.stringify({...video, reactions: reactions}),
        jsonld: JSON.stringify({
          "@context": "http://schema.org/",
          "@type": "VideoObject",
          "name": title,
          "@id": "https://dev.tube/video/" + videoId,
          "datePublished": dayjs(video.recordingDate * 1000).format('YYYY-MM-DD'),
          "description": video.description,
          "thumbnailURL": ogImage,
          "thumbnail": ogImage,
          "interactionCount": video.views,
          "uploadDate": dayjs(video.recordingDate * 1000).format('YYYY-MM-DD'),
          "author": {
            "@type": "Person",
            "name": video.speaker ? video.speaker.name : ""
          }
        })
      })
    }
  } else {
    let absoluteFilePath = path.resolve(`${staticDir}/${req.path}`)
    if (fs.existsSync(absoluteFilePath)) {
      res.sendFile(absoluteFilePath)
    } else {
      Logger.debug(`REQUESTED NOT EXISTING PATH: ${absoluteFilePath}`)
      res.status(404).send('not found')
    }
  }
}

app.post("/api2/videos/:videoId/likes", async (req: Request, res: Response) => {
  let { auth } = req.headers
  let u = new User(auth)
  let uid = await u.uid()
  let module = await import("./api/reactions")
  module.like(req, res, { uid: uid })
})

app.post("/api2/videos/:videoId/dislikes", async (req: Request, res: Response) => {
  let { auth } = req.headers
  let u = new User(auth)
  let uid = await u.uid()
  let module = await import("./api/reactions")
  module.dislike(req, res, { uid: uid })
})

app.get("*", proxy)
app.post("*", proxy)

if (devMode) {
  let listener = app.listen(port, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  })
}

module.exports = app
