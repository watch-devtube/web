import { Videos } from "../videos";

const fastr = require("../fastr");
const router = require("express").Router();

router.post("/", (req, res) => {
  let {
    query,
    page,
    sortOrder,
    excludes
  } = req.body.requests[0].params;

  let q = query
    ? query
      .trim()
      .split(/\s+/)
      .map(token => `+${token}`)
      .join(" ")
    : query;

  let maxHitsPerPage = 20;
  let hitsIds = [];

  fastr
    .searchInLunr(q, ["-featured", sortOrder])
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
      res.json(response);
    })
    .catch(error => res.status(500).send(error));

});

module.exports = router;
