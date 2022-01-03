const express = require('express')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checkToken = require('../helpers/checkToken')
const hasAdminPermision = require('../helpers/hasAdminPermision')
const secret = process.env.secret
const refresh_secret = process.env.refresh_secret
const redis_client = require('../redis_connect');

router.get('/', checkToken, hasAdminPermision, async (req,res)=>{
    const users = await User.findAll()
    if (users){
        res.status(200).json(users)
    }else{
        res.status(200).send('No USERS')
    }
})

router.get('/:id', checkToken, hasAdminPermision, async (req, res)=>{
    const user = await User.findByPk(req.params.id)
    if (user){
        res.json(user)
    }else{
        res.status(200).json({
            msg: "No user",
            success: false
        })
    }
})

router.post('/', async (req,res)=>{
    const user = await User.findOne({where: {email: req.body.email}})
    if (user){
        return res.status(400).json({error: 'User already exists'})
    }
    const new_user = await User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10),
        isAdmin: req.body.isAdmin
    });
    if (new_user){
        res.json(new_user)
    }else{
        res.status(404).json({
            msg: "err",
            success: false
        })
    }
})

router.put('/:id', checkToken, async (req,res)=>{
    const email = req.body.email || null
    const user = await User.findOne({where: {email: email}})
    if (user){
        return res.status(400).json({error: 'User already exists'})
    }
    const update_user = await User.update({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    },{
        where: {
            user_id: req.params.id
        }
    })
    if (update_user){
        res.json(update_user)
    }else{
        res.status(200).json({
            msg: "No user",
            success: false
        })
    }
})

router.delete('/:id', checkToken, hasAdminPermision, async (req,res)=>{
    const delete_user = await User.destroy({
        where: {
            user_id: req.params.id
        }
    })
    if (delete_user){
        res.json(delete_user)
    }else{
        res.status(200).json({
            msg: "No user",
            success: false
        })
    }
})

router.post('/login', async (req,res)=>{
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user){
        return res.status(400).send('The user not found')
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)){
        const token = jwt.sign(
            {
                userId: user.user_id,
                role: user.role
            },
            secret,
            {expiresIn: '60d'}
        )
        const refresh_token = jwt.sign(
            {
                userId: user.user_id, 
                role: user.role
            },
            refresh_secret,
            {expiresIn: '2d'}
        )
        await redis_client.set("token", token)
        await redis_client.set("refresh_token", refresh_token)
        res.cookie('authcookie', token, {maxAge: 9000000, httpOnly: true})
        res.cookie('refresh_authcookie', refresh_token, {maxAge: 9000000, httpOnly: true})
        res.status(201).json({tokens: {token, refresh_token}})
    }else{
        res.status(200).json({
            msg: "Password is wrong",
            success: false
        })
    }
})

router.post('/logout', checkToken, async (req,res)=>{
    res.clearCookie('authcookie');
    res.clearCookie('refresh_authcookie')
    redis_client.del('token')
    redis_client.del('refresh_token')
    res.status(200).json({msg: 'logout successfully'})
})

module.exports = router;