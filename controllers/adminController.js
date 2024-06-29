const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize'); // Import Sequelize Op for querying
// const User = require('../models/user'); // Adjust the path as necessary
const sequelize = require('../config/database'); // Import Sequelize instance

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Patient } = require('../models');


const Admin = db.Admin;
const User = db.User;
// const Patient = db.Patient;

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

const registerDoctor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactNumbers,
      email,
      username,
      password,
      address,
      city,
      state,
      zipcode,
      country,
      specialties,
      clinicName,
      professionalSynopsis,
      awards,
      areaOfInterest,
      academicHonours,
      awardsAndAchievements,
      publications,
      qualifications,
      profileImage,
    } = req.body;

    // Check if email is already taken
    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).send({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Generate doctorId
    const lastDoctor = await User.findOne({
      where: { doctorId: { [Op.ne]: null } },
      order: [['createdAt', 'DESC']],
    });

    let doctorId = 'DR0001';
    if (lastDoctor) {
      const lastDoctorIdNum = parseInt(lastDoctor.doctorId.replace('DR', ''), 10);
      doctorId = `DR${String(lastDoctorIdNum + 1).padStart(4, '0')}`;
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      contactNumbers,
      email,
      username,
      password: hashedPassword,
      address,
      city,
      state,
      zipcode,
      country,
      specialties,
      clinicName,
      professionalSynopsis,
      awards,
      areaOfInterest,
      academicHonours,
      awardsAndAchievements,
      publications,
      qualifications,
      profileImage,
      doctorId,
    });

    res.status(201).send({ message: 'User registered successfully!', user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });

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

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ id: admin.id }, process.env.ADMIN_TOKEN_SECRET, {
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

// const loginAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const admin = await Admin.findOne({ where: { username } });

//     if (!admin) {
//       return res.status(404).send({ message: 'Admin not found' });
//     }

//     const passwordIsValid = bcrypt.compareSync(password, admin.password);

//     if (!passwordIsValid) {
//       return res.status(401).send({
//         accessToken: null,
//         message: 'Invalid Password!',
//       });
//     }

//     admin.lastLogin = new Date();
//     await admin.save();

//     const token = jwt.sign({ id: admin.id }, process.env.ADMIN_TOKEN_SECRET, {
//       expiresIn: 86400, // 24 hours
//     });

//     res.status(200).send({
//       id: admin.id,
//       username: admin.username,
//       email: admin.email,
//       accessToken: token,
//     });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

const getAdminInfo = async (req, res) => {
  try {
    const adminId = req.query.adminId || req.body.adminId; // Retrieve adminId from query or body

    if (!adminId) {
      return res.status(400).send({ message: 'Admin ID is required' });
    }

    const admin = await Admin.findByPk(adminId, {
      attributes: ['id', 'username', 'email', 'profileImage', 'lastLogin'],
    });

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getDoctorInfo = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId; // Retrieve adminId from query or body

    if (!userId) {
      return res.status(400).send({ message: 'User ID is required' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
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
      attributes: ['id', 'username', 'email', 'profileImage', 'lastLogin'],
    });
    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const listAllDoctors = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const listAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId; // Retrieve userId from query or body

    if (!userId) {
      return res.status(400).send({ message: 'User ID is required' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    await user.destroy(); // Delete the user

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId; // Retrieve userId from query or body

    if (!userId) {
      return res.status(400).send({ message: 'User ID is required' });
    }

    const user = await Patient.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    await user.destroy(); // Delete the user

    res.status(200).send({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const importPatients = async (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);

  const patients = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
       // Generate patientId
      // const lastPatient = Patient.findOne({
      //   where: { patientId: { [Op.ne]: null } },
      //   order: [['createdAt', 'DESC']],
      // });

      // let patientId = 'PT0001';
      // if (lastPatient) {
      //   const lastPatientIdNum = parseInt(lastPatient.patientId.replace('PT', ''), 10);
      //   patientId = `PT${String(lastPatientIdNum + 1).padStart(4, '0')}`;
      // }

      patients.push({
        doctorId: row.doctorId,
        parentName: row.parentName,
        parentEmail: row.parentEmail,
        parentPhone: row.parentPhone,
        isPrimary: row.isPrimary === 'true',
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        address: row.address,
        diseases: row.diseases,
        dateOfBirth: new Date(row.dateOfBirth),
        gender: row.gender,
      });
    })
    .on('end', async () => {
      try {
        await Patient.bulkCreate(patients);
        res.status(201).send({ message: 'Patients imported successfully!' });
      } catch (error) {
        res.status(500).send({ message: error.message });
      } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
      }
    })
    .on('error', (error) => {
      res.status(500).send({ message: error.message });
    });
};

// const importPatients = async (req, res) => {
//   const filePath = path.join(__dirname, '../uploads', req.file.filename);

//   const patients = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', async (row) => {
//       // Generate patientId
//       const lastPatient = await Patient.findOne({
//         where: { patientId: { [Op.ne]: null } },
//         order: [['createdAt', 'DESC']],
//       });

//       let patientId = 'PT0001';
//       if (lastPatient) {
//         const lastPatientIdNum = parseInt(lastPatient.patientId.replace('PT', ''), 10);
//         patientId = `PT${String(lastPatientIdNum + 1).padStart(4, '0')}`;
//       }

//       patients.push({
//         doctorId: row.doctorId,
//         patientId: patientId,
//         parentName: row.parentName,
//         parentEmail: row.parentEmail,
//         parentPhone: row.parentPhone,
//         isPrimary: row.isPrimary === 'true',
//         firstName: row.firstName,
//         lastName: row.lastName,
//         email: row.email,
//         address: row.address,
//         diseases: row.diseases,
//         dateOfBirth: new Date(row.dateOfBirth),
//         gender: row.gender,
//       });
//     })
//     .on('end', async () => {
//       try {
//         await Patient.bulkCreate(patients, {
//           ignoreDuplicates: true, // To avoid inserting duplicate records
//         });
//         res.status(201).send({ message: 'Patients imported successfully!' });
//       } catch (error) {
//         res.status(500).send({ message: error.message });
//       } finally {
//         fs.unlinkSync(filePath); // Clean up the uploaded file
//       }
//     })
//     .on('error', (error) => {
//       res.status(500).send({ message: error.message });
//     });
// };

module.exports = {
  registerAdmin,
  registerDoctor,
  loginAdmin,
  getAdminInfo,
  updateAdmin,
  listAllAdmins,
  listAllDoctors,
  getDoctorInfo,
  deleteDoctor,
  listAllPatients,
  importPatients,
  deletePatient,
};
