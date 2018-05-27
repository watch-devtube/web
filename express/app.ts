
import { proxy } from './index'

let express = require('express')
let body = require('body-parser')
let mustache = require('mustache-express')
let cors = require('cors')
let path = require('path')

let app = express()
let devMode = process.env.DEV_MODE === 'true' || process.argv[2] === 'dev'
let staticDir = devMode ? '../dist' : './dist'

app.use(cors())
app.use(body.json())
app.use(express.static(staticDir, {
  index: false
}))

app.engine('html', mustache());

app.set('port', process.env.PORT || 8100);
app.set('view engine', 'mustache');
app.set('view cache', !devMode);
app.set('views', path.join(__dirname, staticDir))
// app.locals.delimiters = '<!--{{ }}-->';

app.get("/*", proxy)

let listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
