import * as fs from 'fs'
import * as path from 'path'
import * as Lunr from 'lunr'
import * as Loki from 'lokijs'
import {firstBy} from "thenby"

export default class Fastr {

  lunr: Lunr
  videos: any
  tags: Set<string>
  speakers: any
  channels: any

  constructor(docsHome: String) {

    let loki = new Loki('mem.db');
    let videos = loki.addCollection('videos', { 
      unique: ['objectID'],
      indices: ['satisfaction']
    })

    let speakers = loki.addCollection('speakers', { 
      unique: ['twitter']
    })

    let channels = loki.addCollection('channels', { 
      unique: ['id']
    })    

    let tags = new Set<string>()
    this.tags = tags



    this.channels = channels
    this.speakers = speakers
    this.videos = videos

    let docLoader = () => {
      let walkSync = (dir, filelist = []) => {
          fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
              ? walkSync(path.join(dir, file), filelist)
              : filelist.concat(path.join(dir, file));
          });
          return filelist;
      }

      console.log(`Experimental Fastr storage mode is turned on.`)
      console.log(`Loading .json docs from dir ${docsHome}`)

      let docs = walkSync(docsHome)
        .filter(f => f.endsWith('.json'))
        .map(f => require(f))

      console.log(`${docs.length} docs loaded`)
      return docs
    }     

    let docsLoaded = docLoader() 

    this.lunr = Lunr(function () {

      this.pipeline.remove(Lunr.trimmer)

      this.ref('objectID')
      this.field('title')
      this.field('speaker', { extractor: (doc) => doc.speaker ? doc.speaker.name : doc.speaker })
      this.field('tags', { extractor: (doc) => doc.tags ? doc.tags.join(' ') : doc.tags })
      this.field('channelTitle')

      docsLoaded.forEach(video => {
        this.add(video)
        if (video.speaker && !speakers.by("twitter", video.speaker.twitter)) {
          speakers.insert(video.speaker)  
        }

        if (!channels.by("id", video.channelId)) {
          channels.insert({
            id: video.channelId,
            title: video.channelTitle
          })  
        }

        if (video.tags) {
          video.tags.forEach(tag => tags.add(tag))
        }
        videos.insert(video)
      })
    })    
  }

  searchChannels() {
    return this.channels.chain().simplesort('title').data()
  }

  searchTags() {
    return Array.from(this.tags).sort()
  }

  searchSpeakers() {
    return this.speakers.chain().simplesort('name').data()
  }

  search(query: string, refinement = {}, sortProperty: string) {
    if (query) {
      return this.searchInLunr(query, sortProperty)
    } else {
      return this.searchInLoki(refinement, sortProperty)
    }
  }
  private searchInLoki(refinement = {}, sortProperty: string) {
    let descending = true
    return this.videos
      .chain()
      .find(refinement)
      .simplesort(sortProperty, descending)
      .data()
  }

  private searchInLunr(query: string, sortProperty: string) {
    let hits = this.lunr.search(query)
    let hitsTotal = hits.length
    return hits
      .map(hit => this.videos.by("objectID", hit.ref))
      .sort(firstBy(sortProperty, -1))
  }


}