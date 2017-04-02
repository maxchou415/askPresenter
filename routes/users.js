const router = require('koa-router')()
const config = require('config')
const services = require('../services/index')

const User = require('../models/userSchema')
const Ask = require('../models/askSchema')

router.get('/signin', async (ctx, next) => {
  ctx.state = {
    title: `Sign In`
  }
  await ctx.render('users/signin')
})

router.post('/signup', async (ctx, next) => {
  let name = ctx.request.body.name
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let passwordHashed = await services.passwordHash(password)
  let newlyUser = {
    username: username,
    password: passwordHashed,
    name: name
  }
  try {
    let create = await User.create(newlyUser)
    ctx.body = {
      'message' : 'User created'
    }
  } catch (e) {
    ctx.body = {
      'message' : 'Create user failed'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let passwordHashed = await services.passwordHash(password)
  try {
    let loginProcess = await User.findOne({'username': username})
    if(loginProcess === null) {
      ctx.body = {
        'message' : 'user not found'
      }
      return
    } else if(loginProcess.password !== passwordHashed) {
      ctx.body = {
        'message' : 'password incorrent'
      }
      return
    } else {
      let sessionCreator = await services.sessionGenerator(loginProcess)
      ctx.session.user = sessionCreator
      await ctx.redirect('/users/dashboard')
    }
  } catch (e) {
    ctx.body = {
      'message': 'something error'
    }
    return
  }
})

router.get('/dashboard', isLoggedIn, async (ctx, next) => {
  let askData = await Ask.find()
  let userSession = ctx.session.user
  ctx.state = {
    title: `Real time ask`,
    userData: userSession,
    askData: askData
  }
  await ctx.render('users/dashboard/index')
})

router.get('/channel/new', isLoggedIn, async (ctx, next) => {
  let userSession = ctx.session.user
  ctx.state = {
    title: `Real time ask`,
    userData: userSession
  }
  await ctx.render('users/dashboard/newChannel')
})

router.post('/channel/new', isLoggedIn, async (ctx, next) => {
  let url = ctx.request.body.url
  let name = ctx.request.body.name
  let data = {
    url: url,
    name: name
  }
  try {
    let newly = await Ask.create(data)
    await ctx.redirect('/users/dashboard')
  } catch (e) {
    await ctx.redirect('/users/dashboard')
  }
})

router.get('/channel/remove/:id', isLoggedIn, async (ctx, next) => {
  let id = ctx.params.id
  try {
    let removeChannel = await Ask.update({'_id': id}, {'isRemoved': true}, {upsert: true})
    await ctx.redirect('/users/dashboard')
    console.log(removeChannel)
  } catch (e) {
    console.log(e)
    await ctx.redirect('/users/dashboard')
  }
})

router.get('/channel/remove/undo/:id', isLoggedIn, async (ctx, next) => {
  let id = ctx.params.id
  try {
    let undoRemoveChannel = await Ask.update({'_id': id}, {'isRemoved': false}, {upsert: true})
    await ctx.redirect('/users/dashboard')
    console.log(undoRemoveChannel)
  } catch (e) {
    console.log(e)
    await ctx.redirect('/users/dashboard')
  }
})

router.get('/channel/close/:id', isLoggedIn, async (ctx, next) => {
  let id = ctx.params.id
  try {
    let closeChannel = await Ask.update({'_id': id}, {'status': 0}, {upsert: true})
    await ctx.redirect('/users/dashboard')
    console.log(closeChannel)
  } catch (e) {
    console.log(e)
    await ctx.redirect('/users/dashboard')
  }
})

router.get('/channel/close/undo/:id', isLoggedIn, async (ctx, next) => {
  let id = ctx.params.id
  try {
    let closeUndoChannel = await Ask.update({'_id': id}, {'status': 1}, {upsert: true})
    await ctx.redirect('/users/dashboard')
    console.log(closeUndoChannel)
  } catch (e) {
    console.log(e)
    await ctx.redirect('/users/dashboard')
  }
})

async function isLoggedIn (ctx, next) {
  let userSession = ctx.session.user
  if(userSession == undefined) {
    await ctx.redirect('/users/signin')
    return
  }
  await next()
}

module.exports = router
