const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')
const mongoose = require('mongoose')
const session = require('koa-session')
const config = require('config')

const ask = require('./routes/ask')
const users = require('./routes/users')
const apis = require('./routes/apis')

mongoose.Promise = global.Promise;

// Session config
let sessionSecret = config.get('secret.session')
app.keys = [`${sessionSecret}`]
const sessionConfig = {
  key: 'session',
  maxAge: 86400000, // a day
  overwrite: true,
  httpOnly: true,
  signed: true,
}
app.use(session(sessionConfig, app))

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/ask', ask.routes(), ask.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())
router.use('/api', apis.routes(), apis.allowedMethods())

app.use(router.routes(), router.allowedMethods())
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx)
})


module.exports = app
