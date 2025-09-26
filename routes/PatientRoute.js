const express = require('express');
const router = express.Router();

const patientController = require('../controller/PatientController');

// Route vers la création d'un nouvel étudiant
router.post('/newPatient', patientController.newPatient);

// Route pour afficher tous les étudiants
router.get('/allPatients', patientController.getAllPatients);

// Route pour afficher un seul étudiant
router.get('/getPatient/:id', patientController.getOnePatient);

// Mettre à jour un étudiant
router.put('/updatePatient/:id', patientController.updatePatient);

// Route pour supprimer un étudiant
router.delete('/deletePatient/:id', patientController.deletePatient);

// Route pour supprimer tous les étudiants
router.delete('/deleteAllPatients', patientController.deleteAllPatients);

// Export la ROUTE
module.exports = router;
