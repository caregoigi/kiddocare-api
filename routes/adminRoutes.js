const { Router } = require('express');
const adminController = require('../controllers/adminController');
const authAdminJwt = require('../middleware/authAdminJwt');
const upload = require('../middleware/upload');

const router = Router();

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
// router.get('/me', authAdminJwt.verifyAdminToken, adminController.getAdminInfo);
router.get('/me', adminController.getAdminInfo);
router.put('/update', [authAdminJwt.verifyAdminToken, upload.single('profileImage')], adminController.updateAdmin);
router.get('/list', authAdminJwt.verifyAdminToken, adminController.listAllAdmins);
router.get('/doctors', adminController.listAllDoctors);
router.post('/doctor-register', adminController.registerDoctor);
router.get('/doctor-details', adminController.getDoctorInfo);
router.delete('/doctor-delete', adminController.deleteDoctor);

router.get('/patients', adminController.listAllPatients);
router.post('/importPatientCsv', upload.single('file'), adminController.importPatients);
router.delete('/patient-delete', adminController.deletePatient);

module.exports = router;

