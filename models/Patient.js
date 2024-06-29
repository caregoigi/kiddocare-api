const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

const Patient = sequelize.define('Patient', {
  patientId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    // unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  diseases: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Patient;
