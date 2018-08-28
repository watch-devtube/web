import { Videos } from '../../videos'
import { fastr } from '../../api/fastr'

export default async (req, res) => {

  if (!req.body.requests || !req.body.requests.length) {
    res.sendStatus(400)
  }

  let { query, page, refinement, sortOrder, excludes } = req.body.requests[0].params

  let q = query ? query.trim().split(/\s+/).map(token => `+${token}`).join(" ") : query

  let maxHitsPerPage = 20
  let hitsIds = fastr.search(q, refinement, sortOrder)
    .filter(hit => hit != null)
    .filter(hit => !(excludes || []).includes(hit.objectID))
    .map(hit => hit.objectID)

  let from = (page || 0) * maxHitsPerPage
  let to = from + maxHitsPerPage
  let hitsPage = await new Videos(hitsIds.slice(from, to)).fetch()
  let nbPages = Math.ceil(hitsIds.length / maxHitsPerPage)

  res.json({
    results: [{
        hits: hitsPage,
        page: page,
        nbHits: hitsIds.length,
        nbPages: nbPages,
        hitsPerPage: maxHitsPerPage
    }]}
  )

}