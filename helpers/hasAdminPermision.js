function hasAdminPermision(req, res, next){
    role=req.userRole
    if (role == 'admin'){
        next()
    }else{
        res.sendStatus(401)
    }
}

module.exports = hasAdminPermision