import { Fastr } from 'devtube-commons'

// FASTR
console.time('Fastr indexing')
let fastrDir = `${__dirname}/../data`
let fastrMe = new Fastr({ dataDir: fastrDir, serialized: true })
console.timeEnd('Fastr indexing')

export let fastr = fastrMe