const express = require('express')
const router = express.Router();
const FriendsRequest = require('../models/friendrequest')
const checkToken = require('../helpers/checkToken')

router.get('/', checkToken, async (req,res)=>{
    const friendsReq = await FriendsRequest.findAll({
        where: {
            my_id: req.userId
        }
    })
    if (friendsReq.length !== 0){
        res.status(200).json(friendsReq)
    }else{
        res.status(200).send('No friends request')
    }
})

router.post('/:id', checkToken, async (req,res)=>{
    //front end
    //auta tha mporoysan na perioristoun k apo to frontend
    if (req.params.id == req.userId){
        return res.status(404).json({
            msg: "err",
            success: false
        })
    }
    const same_friendReq = await FriendsRequest.findAll({
        where: {
            friend_id: req.params.id || req.userId,
            my_id: req.userId || req.params.id
        }
    })
    if (same_friendReq.length != 0){
        console.log(same_friendReq);
        return res.status(200).json({msg: 'This request has already been made'})
    }
    //end front end
    const friendReq = await FriendsRequest.create({
        friend_id: req.params.id,
        my_id: req.userId
    })
    if (friendReq){
        res.json(friendReq)
    }else{
        res.status(404).json({
            msg: "err",
            success: false
        })
    }
})

router.delete('/:id',checkToken, async (req,res) => {
    const friendReq = await FriendsRequest.findByPk(req.params.id)
    if (req.userId === friendReq.dataValues.my_id){
        const delete_friendReq = await FriendsRequest.destroy({
            where: {
                friend_req_id: req.params.id
            }
        })
        if (delete_friendReq){
            res.status(200).json(delete_friendReq)
        }else{
            res.status(200).json({
                msg: "No user",
                success: false
            })
        }
    }else{
        res.sendStatus(401)
    }
})

module.exports = router;