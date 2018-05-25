let express = require('express')
let request = require('request')
let body = require('body-parser')
let mustache = require('mustache-express')
let algolia = require('algoliasearch')
let cors = require('cors')
let path = require("path")
let app = express()
let staticDir = '../dist'
let devMode = process.env.DEV_MODE === 'true'

let asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)



app.use(cors())
app.use(body.json())
app.use(express.static(staticDir, {
  index: false
}))

app.engine('html', mustache());

app.set('view engine', 'mustache');
app.set('view cache', !devMode);
app.set('views', path.join(__dirname, staticDir))

app.get("/", (req, res) => {
  let title = 'DevTube — The best developer videos in one place'
  let description = 'Enjoy the best technical videos and share it all friends, colleagues, and the world.'

  res.render('index.html', {
    title: title,
    meta: [
      { name: "description", content: description },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'open_graph.jpg' }
    ]
  });
})

app.get("/video/:id", async (req, res) => {

  let client = algolia('DR90AOGGE9', 'c2655fa0f331ebf28c89f16ec8268565')
  let index = client.initIndex('videos');
  let video = await index.getObject(req.params.id)

  res.render('index.html', {
    title: `${video.title} – Watch at Dev.Tube`,
    preloadedEntity: JSON.stringify(video),
    meta: [
      { name: 'description', content: video.description },
      { name: 'twitter:title', content: video.title },
      { name: 'twitter:description', content: video.description },
      { name: 'twitter:image', content: `https://img.youtube.com/vi/${video.objectID}/maxresdefault.jpg` }
    ]
  })
})


let listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});