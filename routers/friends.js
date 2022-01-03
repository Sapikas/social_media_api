const express = require('express')
const router = express.Router();
const Friends = require('../models/friend')
const checkToken = require('../helpers/checkToken')
const { Op } = require("sequelize");

router.get('/', checkToken, async (req,res)=>{
    const friends = await Friends.findAll({
        where: {
            [Op.or]: [
                {my_id: req.userId},
                {other_user_id: req.userId}
            ]
        }
    })
    if (friends.length !== 0){
        res.status(200).json(friends)
    }else{
        res.status(200).send('No friends')
    }
})

router.delete('/:id', checkToken, async (req,res)=>{
    const friend = await Friends.findByPk(req.params.id)
    if (req.userId === friend.dataValues.my_id || req.userId === friend.dataValues.other_user_id){
        const delete_friend = await Friends.destroy({
            where: {
                friend_id: req.params.id
            }
        })
        console.log(delete_friend);
        if (delete_friend){
            res.status(200).json(delete_friend)
        }else{
            res.status(200).send('No friends')
        }
    }else{
        res.sendStatus(401)
    }
})

module.exports = router;
