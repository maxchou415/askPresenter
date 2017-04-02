const router = require('koa-router')()
const config = require('config')

const User = require('../models/userSchema')

router.get('/singin', async (ctx, next) => {
  ctx.state = {
    title: `Sign In`
  }
  await ctx.render('users/signin')
})


module.exports = router
