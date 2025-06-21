const config = require("../config");
const {Sequelize} = require("sequelize");
const {development} = require("../config/database");
const database = require("../config/database");



 const sequelize = new Sequelize(development.database,development.username,development.password,{
            host: development.host,
            dialect: development.dialect
        });

module.exports = sequelize;