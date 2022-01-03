const {Sequelize, DataTypes} = require('sequelize')
const db = require('../config/database')
// const sequelize = new Sequelize('postgres://user:postgres:5432/social_media')

module.exports = db.define('Comments', {
    comment_id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'post_id'
        }
    }
})