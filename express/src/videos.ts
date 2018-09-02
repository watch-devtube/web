
import * as Datastore  from '@google-cloud/datastore'

let datastore = new Datastore({})

export class Videos {

  videoKeys: any[]
  reactionKeys: any[]
  ids: string[]

  constructor(ids) {
    this.ids = ids || []
    this.videoKeys = this.ids.map(id => datastore.key(['video', id]))
    this.reactionKeys = this.ids.map(id => datastore.key(['video-reactions', id]))
  }

  fetch() {
    if (!this.videoKeys.length) {
      return Promise.resolve([])
    }
    return datastore.get(this.videoKeys)
      .then(([videos]) => videos)
      .then(videos => videos.sort((a, b) => this.ids.indexOf(a.objectID) - this.ids.indexOf(b.objectID) ))
  }

  reactions() {
    return datastore
      .get(this.reactionKeys)
      .then(([reactions]) => reactions)
  }

  putALike(uid) {
    return this.react(uid, 'likes', 'dtLikes')
  }

  putADislike(uid) {
    return this.react(uid, 'dislikes', 'dtDislikes')
  }

  private react(uid, collection, counter) {
  
    let [ videoKey ] = this.videoKeys
    let [ reactionKey ] = this.reactionKeys

    let tx = datastore.transaction()

    return tx
      .run()
      .then(() => Promise.all([tx.get(videoKey), tx.get(reactionKey)]))
      .then(([[video], [reactions]]) => {
        reactions = reactions || { likes: [], dislikes: [] }
        reactions[collection] = reactions[collection].concat([{
          ts: new Date().getTime(),
          uid: uid
        }]).dedup(it => it.uid)
        video[counter] = reactions[collection].length
        tx.save([
          { key: videoKey, data: video, excludeFromIndexes: ['description'] }, 
          { key: reactionKey, data: reactions }
        ])
        tx.commit()
        return reactions
      })
      .catch(e => {
        console.error(e)
        tx.rollback()
        throw e
      })
  }

}
