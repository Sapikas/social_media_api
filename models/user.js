const {Sequelize, DataTypes} = require('sequelize')
const db = require('../config/database')
// const sequelize = new Sequelize('postgres://user:postgres:5432/social_media')

module.exports = db.define('Users', {
    user_id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "user"
    }
})