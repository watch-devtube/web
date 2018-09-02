
import { Fastr, Logger } from 'devtube-commons'

Logger.time('Fastr indexing')
let fastrDir = `${__dirname}/../../../data`
let fastrMe = new Fastr({ dataDir: fastrDir, serialized: true })
Logger.timeEnd('Fastr indexing')

export let fastr = fastrMe
