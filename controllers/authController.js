const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const User = db.User;
const Admin = db.Admin;

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).send({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'email', 'profileImage'],
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Old Password!' });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).send({ message: 'Admin registered successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, admin.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }

    const token = jwt.sign({ id: admin.id }, process.env.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAdminInfo = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.userId, {
      attributes: ['id', 'username', 'email', 'profileImage'],
    });

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { username, email } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const admin = await Admin.findByPk(req.userId);

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;
    if (profileImage) admin.profileImage = profileImage;

    await admin.save();

    res.status(200).send({ message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const listAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'username', 'email', 'profileImage'],
    });
    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  updateUser,
  resetPassword,
  registerAdmin,
  loginAdmin,
  getAdminInfo,
  updateAdmin,
  listAllAdmins,
};
