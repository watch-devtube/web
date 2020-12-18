import { Videos } from "../videos";
import * as LRU from "lru-cache";

const fastr = require("../fastr");

const hottestResponses = new LRU({ maxAge: 1000 * 60 * 60 * 24, max: 100 });
const router = require("express").Router();

router.post("/", (req, res) => {

  let {
    page,
    refinement,
    sortOrder,
    excludes = []
  } = req.body.requests[0].params;

  let cacheKey = JSON.stringify({
    page,
    refinement,
    sortOrder,
    excludes
  });

  let cacheHit = hottestResponses.get(cacheKey);
  if (cacheHit) {
    return res.json(cacheHit);
  }


  let maxHitsPerPage = 20;
  let hitsIds = fastr
    .searchInLoki(refinement, ["-featured", sortOrder])
    .map(({ objectID }) => objectID)
    .filter(objectID => !excludes.includes(objectID));

  let from = (page || 0) * maxHitsPerPage;
  let to = from + maxHitsPerPage;

  new Videos(hitsIds.slice(from, to))
    .fetch()
    .then(hitsPage => {
      let nbPages = Math.ceil(hitsIds.length / maxHitsPerPage);
      let response = {
        results: [
          {
            hits: hitsPage,
            page: page,
            nbHits: hitsIds.length,
            nbPages: nbPages,
            hitsPerPage: maxHitsPerPage
          }
        ]
      };
      hottestResponses.set(cacheKey, response);
      res.json(response);
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
