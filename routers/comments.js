const express = require('express')
const router = express.Router();
const Posts = require('../models/post')
const Comments = require('../models/comment')
const checkToken = require('../helpers/checkToken')
const hasAdminPermision = require('../helpers/hasAdminPermision')

router.get('/', checkToken, hasAdminPermision, async (req,res)=>{
    const comments = await Comments.findAll()
    if (comments.length != 0){
        res.status(200).json(comments)
    }else{
        res.status(200).send('No comments')
    }
})

router.get('/:id', checkToken, async (req, res)=>{
    const comments = await Comments.findAll({
        where: {
            post_id : req.params.id
        }
    })
    if (comments.length != 0){
        res.json(comments)
    }else{
        res.status(500).json({
            msg: "No comments for this post",
            success: false
        })
    }
})

router.post('/:id', checkToken, async (req,res)=>{
    const post = await Posts.findByPk(req.params.id)
    if (post){
        const new_comment = await Comments.create({
            user_id: req.userId,
            text: req.body.text,
            post_id: post.dataValues.post_id
        })
        res.json(new_comment)
    }else{
        res.status(404).json({
            msg: "err",
            success: false
        })
    }
})

router.put('/:id',checkToken, async (req,res)=>{
    const comment = await Comments.findByPk(req.params.id)
    if (req.userId === comment.dataValues.user_id){
        const update_comment = await Comments.update({
            text: req.body.text
        },{
            where: {
                comment_id: req.params.id
            }
        })
        if (update_comment){
            res.json(update_comment)
        }else{
            res.status(500).json({
                msg: "No comment",
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
    const comment = await Comments.findByPk(req.params.id)
    if (req.userId === comment.dataValues.user_id){
        const delete_comment = await Comments.destroy({
            where: {
                comment_id: req.params.id
            }
        })
        if (delete_comment){
            res.json(delete_comment)
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