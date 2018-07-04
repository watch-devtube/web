import * as fs from 'fs'
import * as path from 'path'
import * as Lunr from 'lunr'
import * as Loki from 'lokijs'

// 1) don't forget to update docs with wildcard support, field:search, title:foo* bar
// A B means A or B
// +foo +bar means 

// 2) multi-word tags :(
// 3) f#, c++

export default class Fastr {

  lunr: Lunr
  videos: any
  tags: Set<string>
  speakers: any
  channels: any
  byRank: any

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

    let byRank = (it, that) => {
      let left = that as any
      let right = it as any

      if (left.featured && !right.featured) return 1;
      if (right.featured && !left.featured) return -1;

      return left.satisfaction - right.satisfaction
    }
    this.byRank = byRank

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
      this.ref('objectID')
      this.field('title')
      this.field('speaker', { extractor: (doc) => doc.speaker ? doc.speaker.name : doc.speaker })
      this.field('tags')
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

  search(query: string, refinement = {}, page: number, maxHitsPerPage: number, maxHitsPerQuery: number) {
    // if there is fuzzy query string provided, then search in Loki
    if (!query) {
      let descending = true
      return this.videos
        .chain()
        .find(refinement)
        .compoundsort([['featured', descending], ['satisfaction', descending]])
        .offset(page * maxHitsPerPage)
        .limit(maxHitsPerQuery)
        .data()
    }

    // if fuzzy query string provided, then search in Lunr AND Loki
    if (query) {
      let queryHits = this.searchInLunr(query, page, maxHitsPerPage, maxHitsPerQuery)
      return queryHits
    }    
  }

  private searchInLunr(query: string, page: number, maxHitsPerPage: number, maxHitsPerQuery: number) {
    let hits = this.lunr.search(query)
    let hitsTotal = hits.length
    return hits
      .map(hit => this.videos.by("objectID", hit.ref))
      .sort(this.byRank)
      .slice(page * maxHitsPerPage, page * maxHitsPerPage + maxHitsPerQuery)
  }


}