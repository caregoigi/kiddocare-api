const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path if necessary

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE, // Use DataTypes.DATE instead of Date
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Admin;

