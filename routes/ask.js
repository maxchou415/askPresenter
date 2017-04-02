const router = require('koa-router')()
const config = require('config')

const Ask = require('../models/askSchema')

// Fetch Questions data by url
router.get('/:url/all', async (ctx, next) => {
    let url = ctx.params.url
    try {
      let find = await Ask.findOne({'url' : url })
      if(find.status === false || find.isRemoved === true) {
        ctx.body = {
          'message' : 'This channel is closed or removed'
        }
        return
      } else {
        let name = await find.name
        ctx.state = {
          title: `${name} Real Time Ask`,
          data: find
        }
        await ctx.render('ask/all')
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        'message' : 'Not Found'
      }
    }
})

router.get('/:url/new', async (ctx, next) => {
    let url = ctx.params.url
    try {
      let find = await Ask.findOne({'url' : url })
      let name = await find.name
      ctx.state = {
        title: `${name} Real Time Ask`,
        data: find
      }
      await ctx.render('ask/new')
    } catch (e) {
      console.log(e)
    }
})

router.post('/:url/new/', async (ctx, next) => {
    let message = ctx.request.body.message
    let url = ctx.params.url
    try {
      let newlyQuestion = await Ask.update({'url' : url}, { $push: {'question': message}}, {upsert: true})
      ctx.body = {
        'message' : '成功提問'
      }
    } catch (e) {
      ctx.body = {
        'message' : 'Failed'
      }
    }
})

module.exports = router
