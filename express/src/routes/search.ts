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
    excludes
  } = req.body.requests[0].params;

  let requestKey = JSON.stringify({
    page,
    refinement,
    sortOrder,
    excludes
  });

  let hottestResponse = hottestResponses.get(requestKey);

  if (hottestResponse) {
    return res.json(hottestResponse);
  } else {
    let maxHitsPerPage = 20;
    let hitsIds = [];

    fastr
      .searchInLoki(refinement, ["-featured", sortOrder])
      .forEach(hit => {
        if (hit != null) {
          const notExcluded = !(excludes || []).includes(hit.objectID);
          if (notExcluded) {
            hitsIds.push(hit.objectID);
          }
        }
      })


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
        hottestResponses.set(requestKey, response);
        res.json(response);
      })
      .catch(error => res.status(500).send(error));
  }
});

module.exports = router;
