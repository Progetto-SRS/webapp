const Collection = require('../models/Collections')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const generate= (req, res, next) =>{
    const token = req.headers.authorization.substring('Bearer '.length);

    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                err
            })
        }
        else{

            const collection = new Collection({
                username: decode.name,
                siteName: req.body.siteName,
                siteType: req.body.siteType,
                template: req.body.template,
                settings: req.body.settings
            })
            
            collection.save()
            .then(collection =>{
                res.json({
                    
                    message: 'Collection added succesfully'
                })
            })
            .catch(error =>{
                res.json({
                    message: 'An error occurred',
                    error
                })
            })
                
            
        }
    } )
    
}
const loadCollections =(req,res,next) =>{
    const token = req.headers.authorization.substring('Bearer '.length);

    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                err
            })
        }
        else{
            Collection.find({username: decode.name})
            .then(collection =>{
                res.json({
                    collection
                })
            })
            .catch(error =>{
                res.json({
                    message: 'An error occurred',
                    error
                })
            })
                
            
        }
    } )

}

const loadUsername = (req,res,next) =>{
    const token = req.headers.authorization.substring('Bearer '.length);
    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                message: 'An error occurred',
                err
            })
        }
        else{
            
            res.status(200).json({
                username: decode.name
            })
                
            
        }
    } )
}

module.exports= {
    generate, loadCollections, loadUsername
}