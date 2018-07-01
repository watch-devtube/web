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
  byRank: any

  constructor(docsHome: String) {

    let loki = new Loki('mem.db');
    let videos = loki.addCollection('videos', { 
      unique: ['objectID'],
      indices: ['satisfaction']
    })
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
        videos.insert(video)
      })
    })    
  }

  search(q: string, p: number, maxHitsPerPage: number, maxHitsPerQuery: number) {
    if (q) {
      let hits = this.lunr.search(q)
      let hitsTotal = hits.length
      return hits
        .map(hit => this.videos.by("objectID", hit.ref))
        .sort(this.byRank)
        .slice(p * maxHitsPerPage, p * maxHitsPerPage + maxHitsPerQuery)
    } else {
      let descending = true
      return this.videos
        .chain()
        .compoundsort([['featured', descending], ['satisfaction', descending]])
        .offset(p * maxHitsPerPage)
        .limit(maxHitsPerQuery)
        .data()
    }

  }


}