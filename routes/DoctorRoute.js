const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

const doctorController = require('../controller/DoctorController');

// Créer
router.post(
  '/createDoctor',
  userController.authMiddleware,
  doctorController.createDoctor
);

// Lire
router.get('/allDoctors', doctorController.getAllDoctors);

//
router.get('/getOneDoctor/:id', doctorController.getDoctorById);

// Mettre à jour
router.put('/updateDoctor/:id', doctorController.updateDoctor);

// Supprimer un seul Enseignant
router.delete('/deleteDoctor/:id', doctorController.deleteDoctor);

// Supprimer tous les Enseignants
router.delete('/deleteAllDoctor/:id', doctorController.deleteAllDoctors);

module.exports = router;
