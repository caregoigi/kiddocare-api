const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authUserJwt = require('../middleware/authUserJwt');

// Define your patient routes here
router.post('/register', authUserJwt.verifyUserToken, patientController.registerPatient);
router.get('/:id', authUserJwt.verifyUserToken, patientController.getPatientById);
router.put('/:id', authUserJwt.verifyUserToken, patientController.updatePatient);
router.delete('/:id', authUserJwt.verifyUserToken, patientController.deletePatient);
// router.post('/importCsv', authUserJwt.verifyToken, upload.single('file'), patientController.importPatients);

module.exports = router;



