import * as Datastore  from '@google-cloud/datastore'

let datastore = new Datastore({})

export class Videos {

  videoKeys: any[]
  ids: string[]

  constructor(ids) {
    this.ids = ids
    this.videoKeys = ids.map(id => datastore.key(['video', id]))
  }

  fetch() {
    if (!this.videoKeys.length) {
      return Promise.resolve([])
    }
    return datastore.get(this.videoKeys)
      .then(([videos]) => videos)
      .then(videos => videos.sort((a,b) => this.ids.indexOf(a.objectID) - this.ids.indexOf(b.objectID) ))
  }

}