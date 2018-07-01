
import { Request, Response } from 'express'

import * as path from 'path'
import * as fs from 'fs'
import * as lru from 'lru-cache'
import * as dns from 'dns'
import * as dnscache from 'dnscache'
import * as algolia from 'algoliasearch'
import * as Fuse from 'fuse.js'


// Configuration settings
const algoliaAppId = 'DR90AOGGE9'
const algoliaApiKey = 'c2655fa0f331ebf28c89f16ec8268565'
const algoliaIndexName = 'videos'
const videoCacheSize = 500
const videoCacheTTL = 1000 * 60 * 60 



// Configure video cache
let videoCache = lru({ 
  max: videoCacheSize, 
  maxAge: videoCacheTTL
})

// Configure DNS cache
let dnsCache = dnscache({
  enable: true,
  ttl: 300,
  cachesize: 1000
})
let dnsNames = [ 
  'www.github.com', 
  'github.com', 
  'api.github.com', 
  'www.googleapis.com', 
  'www.google.com', 
  'googleapis.com',
  'www.googleapis.com',  
  'www.algolia.com',
  'algolia.com',  
  `${algoliaAppId}.algolia.net`,
  `${algoliaAppId}-dsn.algolia.net`,
  `${algoliaAppId}-1.algolianet.com`,
  `${algoliaAppId}-2.algolianet.com`,
  `${algoliaAppId}-3.algolianet.com`  
]
dnsNames.forEach(dnsName => {
  dnsCache.lookup(dnsName, (err, result) => {
    if (err) {
      console.error(`${dnsName}: ${JSON.stringify(err)}`)
    } else {
      console.log(`${dnsName}: ${JSON.stringify(result)}`)
    }    
  })  
})


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



// Preload static data
let newVideos = JSON.parse(fs.readFileSync(path.join(__dirname, staticDir) + '/latest.json', 'utf8')).videos
let newVideosSinceYesterday = newVideos.filter(v => v.ageInDays <= 1).map(v => v.videoId)


// EXPERIMENTAL FUSE.JS MODE
let fuseMode = process.env.FUSE_MODE
let fuseDir = `${__dirname}/backup`
let fuseOpts = {
   threshold: 0.2,
   keys: ['title', 'speaker.name', 'tags', 'channelTitle']
}

let fuseVideos = () => {
  const walkSync = (dir, filelist = []) => {
      fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
          ? walkSync(path.join(dir, file), filelist)
          : filelist.concat(path.join(dir, file));
      });
      return filelist;
    }

    console.log(`Experimental Fuse.js mode is turned on.`)
    console.log(`Loading .json videos from dir ${fuseDir}`)

    let videoFiles = walkSync(fuseDir).filter(f => f.endsWith('.json')).map(f => require(f))
    console.log(`${videoFiles.length} videos loaded`)
    return videoFiles
}

let fuse = fuseMode ? new Fuse(fuseVideos(), fuseOpts) : new Fuse([], {})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Application logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function proxy(req: Request, res: Response) {
  console.log(`REQUEST PATH: ${req.path}`)
  if (!req.path || req.path == '/') {
    let title = 'DevTube - The best developer videos in one place'
    let description = 'Enjoy the best technical videos and share it with friends, colleagues, and the world.'
    res.render('index.html', {      
      title: title,
      fuseMode: JSON.stringify(fuseMode),
      newVideos: JSON.stringify(newVideosSinceYesterday),
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
  } else if (req.path.startsWith("/@")) {
    let speaker = req.path.split("/@")[1]
    let title = `DevTube - Videos by @${speaker}`
    let description = 'Enjoy the best technical videos and share it with friends, colleagues, and the world.'
    res.render('index.html', {
      title: title,
      speaker: `"${speaker}"`,
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
  } else if (req.path.startsWith("/search") && fuseMode) {
    let q = req.body.requests[0].params.query
    console.log(q)
    let max = 21
    let hits = fuse.search(q).slice(0, max)
    console.log(hits.length)
    console.log(hits)
    res.status(200).send(
      {
        "results": [
          {
            "hits": hits,
            "nbHits": hits.length,
            "page": 0,
            "nbPages": 1,
            "hitsPerPage": max,
            "processingTimeMS": 2,
            "facets": {
              "tags": {
                "career": 2,
                "craftsmanship": 2,
                ".net": 1
              },
              "channelTitle": {
                "Agile Lietuva": 1,
                "I T.A.K.E. Unconference": 1
              },
              "speaker.name": {
                "Eduards Sizovs": 2
              }
            },
            "exhaustiveFacetsCount": true,
            "exhaustiveNbHits": true,
            "query": q,
            "index": "videos"
          }
        ]
      }
     )
  } else if (req.path.startsWith('/video/')) {
    let objectID = req.path.split('/')[2]
    console.log(`VIDEO REQUEST: ${objectID}`)
    try {
      let video = videoCache.has(objectID) ? videoCache.get(objectID) : await index.getObject(objectID) as any
      videoCache.set(objectID, video)
      res.render('index.html', {
        title: `${video.title} - Watch at Dev.Tube`,
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
        console.error(e) 

        res.render('index.html', {
          title: `Error at Dev.Tube`,
          serverSideError: JSON.stringify(
            { message: 'Sorry, but the video is not available now. We\'re working on the solution.' })
        })

      }
    }
  } else {
    if (fs.existsSync('.' + req.path)) {
      res.sendFile('.' + req.path)
    } else {
      res.status(404).send()
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
