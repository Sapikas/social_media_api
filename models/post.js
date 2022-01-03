const {Sequelize, DataTypes} = require('sequelize')
const db = require('../config/database')

module.exports = db.define('Posts', {
    post_id:{
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
    }
})