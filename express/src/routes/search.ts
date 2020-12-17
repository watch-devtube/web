import { Videos } from "../videos";
import * as LRU from "lru-cache";

const fastr = require("../fastr");

const hottestResponses = new LRU({ maxAge: 1000 * 60 * 60 * 24, max: 100 });
const router = require("express").Router();

router.post("/", (req, res) => {
  if (!req.body.requests || !req.body.requests.length) {
    res.sendStatus(400);
    return;
  }

  let {
    query,
    page,
    refinement,
    sortOrder,
    lang,
    excludes
  } = req.body.requests[0].params;
  let q = query
    ? query
      .trim()
      .split(/\s+/)
      .map(token => `+${token}`)
      .join(" ")
    : query;

  let requestKey = JSON.stringify({
    query,
    page,
    refinement,
    sortOrder,
    lang,
    excludes
  });

  let hottestResponse = hottestResponses.get(requestKey);

  if (hottestResponse) {
    return res.json(hottestResponse);
  } else {
    let maxHitsPerPage = 20;

    let hits = [];
    let hitsIds = [];

    fastr
      .search(q, refinement, ["-featured", sortOrder])
      .forEach(hit => {
        if (hit != null) {
          hits.push(hit);
          const languageMatches = !lang || hit.language == lang;
          const notExcluded = !(excludes || []).includes(hit.objectID);
          if (languageMatches && notExcluded) {
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
