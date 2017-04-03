const router = require('koa-router')()
const config = require('config')

const Ask = require('../models/askSchema')

// Fetch Questions data by url
router.get('/:url/all', async (ctx, next) => {
    let url = ctx.params.url
    try {
      let find = await Ask.findOne({'url' : url })
      if(find.status === false || find.isRemoved === true) {
        ctx.state = {
          title: `Error to open channel`,
          message: `This channel has been closed or removed.`
        }
        await ctx.render('message/index')
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
      ctx.state = {
        title: `Failed to open channel`,
        message: `Your URL '${url}' is incorrent, Plaese make sure it and try again.`
      }
      await ctx.render('message/index')
    }
})

router.get('/:url/new', async (ctx, next) => {
    let url = ctx.params.url
    try {
      let find = await Ask.findOne({'url' : url })
      if(find.status === false || find.isRemoved === true) {
        ctx.state = {
          title: `Error to open channel`,
          message: `This channel has been closed or removed.`
        }
        await ctx.render('message/index')
        return
      } else {
        let name = await find.name
        ctx.state = {
          title: `${name} Real Time Ask`,
          data: find
        }
        await ctx.render('ask/new')
      }
    } catch (e) {
      ctx.state = {
        title: `Failed to open channel`,
        message: `Your URL '${url}' is incorrent, Plaese make sure it and try again.`
      }
      await ctx.render('message/index')
    }
})

router.post('/:url/new/', async (ctx, next) => {
    let url = ctx.params.url
    let message = ctx.request.body.message
    if(!message){
      ctx.state = {
        title: `Error to create question`,
        message: `Question is required`
      }
      await ctx.render('message/index')
      return
    } else {
      try {
        let newlyQuestion = await Ask.update({'url' : url}, { $push: {'question': message}}, {upsert: true})
        ctx.state = {
          title: `Success`,
          message: `Your question has been sent.`
        }
        await ctx.render('message/index')
      } catch (e) {
        ctx.state = {
          title: `Failed`,
          message: `Create question failed.`
        }
        await ctx.render('message/index')
      }
    }

})

module.exports = router
