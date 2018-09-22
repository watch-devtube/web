import { Videos } from '../../videos'
import {fastr} from '../../api/fastr'

export default async (req, res) => {

  let excludes = req.body.excludes
  let lang = req.body.lang

  let discover = (refinement, sorting) => fastr
    .search(undefined, refinement, sorting)
    .filter(hit => !lang || hit.language == lang) 
    .filter(hit => hit != null)
    .filter(hit => !(excludes || []).includes(hit.objectID))
    .map(hit => hit.objectID)
    .slice(0, 100)
    .shuffle()
    .slice(0, 8)

  let discovery = [
    { title: "Staff Picks",      ids: discover({ featured : true }, '-featured') },
    { title: "Top Rated",        ids: discover(undefined, '-satisfaction') },
    { title: "Recent Additions", ids: discover(undefined, '-recordingDate') }
  ]

  let allVideoIds = discovery.flatMap(x => x.ids)
  let allVideos = await new Videos(allVideoIds).fetch()

  let discovered = discovery.map(({title, ids}) => {
    return { title: title, items: allVideos.filter(video => ids.some(id => id == video.objectID))}
  })

  res.json( { results: discovered } )

}