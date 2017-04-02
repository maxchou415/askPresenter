const router = require('koa-router')()
const config = require('config')

const Ask = require('../models/askSchema')

router.post('/ask/new', async (ctx, next) => {
    let url = ctx.request.body.url
    let name = ctx.request.body.name
    let data = {
      url: url,
      name: name
    }
    try {
      let newly = await Ask.create(data)
      console.log(newly)
    } catch (e) {
      console.log(e)
    }
})

router.get('/ask/:url', async (ctx, next) => {
    let url = ctx.params.url
    try {
      let find = await Ask.findOne({'url' : url }, 'name url question')
      let name = await find.name
      ctx.body = {
        data: find
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        'message' : 'Not Found'
      }
    }
})


router.post('/ask/:url/new/:message', async (ctx, next) => {
    let message = ctx.params.message
    let url = ctx.params.url
    try {
      let newlyQuestion = await Ask.update({'url' : url}, { $push: {'question': message}}, {upsert: true})
      ctx.body = {
        'message' : 'Send success',
        'status' : 200
      }
    } catch (e) {
      ctx.body = {
        'message' : 'Send Failed',
        'status' : 500
      }
    }
})

module.exports = router
