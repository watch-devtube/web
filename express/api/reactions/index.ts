import { Videos } from '../../videos'

export async function like(req, res, { uid }) {

  let { videoId } = req.params

  let videos = new Videos([videoId])
  videos
    .putALike(uid)
    .then(it => res.json(it))
    .catch(e =>   res.status(500).send(e))
}

export async function dislike(req, res, { uid }) {

  let { videoId } = req.params

  let videos = new Videos([videoId])
  videos
    .putADislike(uid)
    .then(it => res.json(it))
    .catch(e =>   res.status(500).send(e))
}