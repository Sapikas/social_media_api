const jwt = require('jsonwebtoken')
const secret = process.env.secret
const refresh_secret = process.env.refresh_secret
const redis_client = require('../redis_connect')

async function checkRefreshToken(req,res,next){
    let refreshToken = await redis_client.get('refresh_token')
    const token = await redis_client.get('token')
    if (!refreshToken){
        return res.status(401).json({status: false, message: "Invalid request."});
    }
    try{
        const {exp} = jwt.decode(refreshToken)
        if (Date.now() >= exp * 1000){
            const data = jwt.verify(token, secret)
            console.log(data);
            const refresh_token = jwt.sign(
                {
                    userId: data.userId, 
                    role: data.role
                },
                refresh_secret,
                {expiresIn: '2d'}
            )
            await redis_client.set("refresh_token", refresh_token)
            refreshToken = await redis_client.get('refresh_token')
            res.cookie('refresh_authcookie', refreshToken)
            console.log(refreshToken);
        }
        const data = jwt.verify(refreshToken, refresh_secret)
        req.userRole = data.role 
        req.userId = data.userId
        next()
    }catch(err){
        res.sendStatus(403)
    }
}

module.exports = checkRefreshToken
