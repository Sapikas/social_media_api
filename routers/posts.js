const express = require('express')
const router = express.Router();
const Posts = require('../models/post')
const checkToken = require('../helpers/checkToken')

router.get('/',checkToken, async (req,res)=>{
    const posts = await Posts.findAll({
        order: [
            ['createdAt', 'ASC']
        ]
    })
    if (posts.length !== 0){
        res.status(200).json(posts)
    }else{
        res.status(200).send('No posts')
    }
})

router.get('/myposts', checkToken, async (req,res)=>{
    const posts = await Posts.findAll({
        where: {
            user_id: req.userId
        }
    })
    if (posts.length !== 0){
        res.json(posts)
    }else{
        res.status(500).json({
            msg: "No post",
            success: false
        })
    }
})

router.get('/:id',checkToken, async (req, res)=>{
    const post = await Posts.findAll({
        where: {
            user_id: req.params.id
        }
    })
    if (post.length !==0){
        res.json(post)
    }else{
        res.status(500).json({
            msg: "No post from this user",
            success: false
        })
    }
})

router.post('/', checkToken, async (req,res)=>{
    const new_post = await Posts.create({
        user_id: req.userId,
        text: req.body.text
    });
    if (new_post){
        res.json(new_post)
    }else{
        res.status(404).json({
            msg: "err",
            success: false
        })
    }
})

router.put('/:id',checkToken, async (req,res)=>{
    const post = await Posts.findByPk(req.params.id)
    if (req.userId === post.dataValues.user_id){
        const update_post = await Posts.update({
            text: req.body.text
        },{
            where: {
                post_id: req.params.id
            }
        })
        if (update_post){
            res.json(update_post)
        }else{
            res.status(500).json({
                msg: "No post",
                success: false
            })
        }
    }else{
        res.status(500).json({
            msg: "No authorized",
            success: false
        })
    }
})

router.delete('/:id',checkToken, async (req,res) => {
    const post = await Posts.findByPk(req.params.id)
    if (req.userId === post.dataValues.user_id){
        const delete_post = await Posts.destroy({
            where: {
                post_id: req.params.id
            }
        })
        if (delete_post){
            res.json(delete_post)
        }else{
            res.status(500).json({
                msg: "No user",
                success: false
            })
        }
    }else{
        res.status(500).json({
            msg: "No authorized",
            success: false
        })
    }
})

module.exports = router;