const Sequelize = require('sequelize')
module.exports = new Sequelize('social_media', 'postgres', 'F19181716!f', {
    host: 'localhost',
    dialect: 'postgres',
    isNewRecord: false
})