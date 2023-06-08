const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req,res,next)=>{
    try{
        //const token =req.headers.authorization.split(' ')[1]
        //const refreshToken = req.headers['refresh-token']
        const token = req.cookies.token;
        const refreshToken = req.cookies.refreshToken;
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decode
        next()
        
    }
    catch(error){
        console.error(error);
        if(error.name =='TokenExpiredError'){
            res.status(401).json({
                message: 'Auth Token expired'
            })
        }else{
            res.json({
                message: 'Authentication Failed'
            })
        }
        
    }
}
module.exports = authenticate