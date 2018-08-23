import * as Datastore  from '@google-cloud/datastore'

let datastore = new Datastore({})

export class Videos {

  videoKeys: any[]

  constructor(ids) {
    this.videoKeys = ids.map(id => datastore.key(['video', id.objectID || id]))
  }

  fetch() {
    if (!this.videoKeys.length) {
      return Promise.resolve([])
    }
    return datastore.get(this.videoKeys).then(([videos]) => videos)
  }

}