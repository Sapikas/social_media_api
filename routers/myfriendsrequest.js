const express = require('express')
const router = express.Router();
const FriendsRequest = require('../models/friendrequest')
const Friends = require('../models/friend')
const checkToken = require('../helpers/checkToken')

router.get('/', checkToken, async (req,res)=>{
    const friendsReq = await FriendsRequest.findAll({
        where: {
            friend_id: req.userId
        }
    })
    if (friendsReq.length !== 0){
        res.status(200).json(friendsReq)
    }else{
        res.status(200).send('No friends request')
    }
})

router.post('/:id', checkToken, async (req,res)=>{
    const friendReq = await FriendsRequest.findByPk(req.params.id)
    if (friendReq.dataValues.friend_id != req.userId){
        return res.sendStatus(401)
    }
    const friend = await Friends.create({
        other_user_id: friendReq.dataValues.my_id,
        my_id: req.userId
    })
    if (friend){
        await FriendsRequest.destroy({
            where: {
                friend_req_id: req.params.id
            }
        })
        res.status(200).json(friend)
    }else{
        res.status(404).json({
            msg: "err",
            success: false
        })
    }
})

router.delete('/:id',checkToken, async (req,res) => {
    const friendReq = await FriendsRequest.findByPk(req.params.id)
    if (req.userId === friendReq.dataValues.friend_id){
        const delete_friendReq = await FriendsRequest.destroy({
            where: {
                friend_req_id: req.params.id
            }
        })
        if (delete_friendReq){
            res.json(delete_friendReq)
        }else{
            res.status(500).json({
                msg: "No user",
                success: false
            })
        } 
    }else{
        res.sendStatus(401)
    }
})

module.exports = router;