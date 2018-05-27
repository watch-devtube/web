
import * as _ from 'lodash'
import * as path from 'path'
import * as fs from 'fs'

import * as request from 'request'
import * as algolia from 'algoliasearch'

import { Request, Response } from 'express'

export async function proxy(req: Request, res: Response) {
  console.log(`REQUEST PATH: ${req.path}`)
  if (!req.path || req.path == '/') {
    let title = 'DevTube - The best developer videos in one place'
    let description = 'Enjoy the best technical videos and share it all friends, colleagues, and the world.'
    res.render('index.html', {      
      title: title,
      meta: [
        { name: "description", content: description },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'open_graph.jpg' }
      ]
    })
  } else if (req.path.startsWith('/video/')) {
    let client = algolia('DR90AOGGE9', 'c2655fa0f331ebf28c89f16ec8268565')
    let index = client.initIndex('videos')
    let objectID = req.path.split('/')[2]
    console.log(`VIDEO REQUEST: ${objectID}`)
    try {
      let video = await index.getObject(objectID) as any
      res.render('index.html', {
        title: `${video.title} - Watch at Dev.Tube`,
        preloadedEntity: JSON.stringify(video),
        meta: [
          { name: 'description', content: video.description },
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
        res.status(500).send()
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
