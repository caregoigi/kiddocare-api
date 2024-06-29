const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNumbers: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialties: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  clinicName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  professionalSynopsis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  awards: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  areaOfInterest: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  academicHonours: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  awardsAndAchievements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  publications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zipcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  }
}, {
  timestamps: true,
});

module.exports = User;
