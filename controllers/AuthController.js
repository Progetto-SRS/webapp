const User = require('../models/User')
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10, function(err,hashedPass){
        if(err){
            res.json({
                error: err
            })
        }
        let user = new User ({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPass
        })
        user.save()
        .then(user =>{
            res.json({
                message: 'User added succesfully'
            })
        })
        .catch(error =>{
            res.json({
                message: 'An error occurred'
            })
        })
    })
}

const login = (req, res, next) =>{
    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{email: username},{phone : username}]})
    .then(user=>{
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign({name :user.name}, process.env.SECRET_KEY, {expiresIn: '1h'})
                    let refreshToken = jwt.sign({name :user.name}, process.env.REFRESH_SECRET_KEY, {expiresIn: '48h'})

                    res.status(200).json({
                        message:'login succesfully',
                        token,
                        refreshToken
                    })
                }else{
                    res.status(200).json({
                        message: 'Password does not matched'
                    })
                }
            })

        }else{
            res.json({
                message: 'No user found'
            })
        }
    })
}

const refreshToken = (req, res, next)=>{
    const refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, function(err, decode){
        if(err){
            res.status(400).json({
                err
            })
        }
        else{
            let token = jwt.sign({name :decode.name}, process.env.SECRET_KEY, {expiresIn: '1h'})    
            let refreshToken = req.body.refreshToken
            res.status(200).json({
                message: 'Token refreshed',
                token,
                refreshToken
            })
        }
    } )
}
module.exports= {
    register, login, refreshToken
}