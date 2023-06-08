const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collectionSchema = new Schema({
    username:{
        type: String
    },
    siteName:{
        type: String
    },
    siteType:{
        type: String
    },
    template:{
        type: String
    },
    settings : {
        type: [String]
    }
},{timestamps: true})

const Collection =mongoose.model('Collections',collectionSchema)
module.exports = Collection