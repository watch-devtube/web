import * as Datastore  from '@google-cloud/datastore'

let datastore = new Datastore({})

export class Brownbags {

  fetchOne(id: string) {
    let key = datastore.key(['brownbags', id])
    return datastore.get(key).then(([brownbag]) => brownbag)
  }

}