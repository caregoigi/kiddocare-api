const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path if necessary

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Admin = require('./Admin'); // Adjust the path if necessary
db.User = require('./User'); // Assuming you have a User model
db.Patient = require('./Patient');

module.exports = db;




