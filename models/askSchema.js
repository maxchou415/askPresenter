const mongoose = require('mongoose')
const shortId = require('shortid')
const moment = require('moment')
const config = require('config')

const database = config.get('database')

mongoose.connect(`mongodb://${database}`)

const Schema = mongoose.Schema

const Time = moment().format('LLLL')

const askSchema = new Schema({
    name: { type: String },
    url: { type: String },
    question: [{
      type: String
    }],
    status: { type: Boolean, default: 1 },

    _id: { type: String, default: shortId.generate },
    created_at: { type: Date, default: Time }
})


module.exports = mongoose.model('ask', askSchema)
