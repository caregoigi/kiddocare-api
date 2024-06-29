const db = require('../models');
const Patient = db.Patient;

const registerPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      diseases,
      profileImage,
      dateOfBirth,
      gender,
      isPrimary,
      doctorId,
      parentName,
      parentEmail,
      parentPhone
    } = req.body;

    // Check if email is already taken
    const existingEmail = await Patient.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).send({ message: 'Email is already registered' });
    }

    // Create new patient
    const patient = await Patient.create({
      name,
      email,
      address,
      diseases,
      profileImage,
      dateOfBirth,
      gender,
      isPrimary,
      doctorId,
      parentName,
      parentEmail,
      parentPhone
    });

    res.status(201).send({ message: 'Patient registered successfully!', patient });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    await patient.destroy();
    res.status(200).send({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  getPatients,
  deletePatient
};
