const express = require('express');
const router = express.Router();
const approvisonementController = require('../controller/ApprovisonementContoller');

// Route pour créer un approvisionnement
router.post(
  '/createApprovisonement', // ID du médicament
  approvisonementController.createApprovisonement
);

// Route pour récupérer tous les approvisionnements
router.get(
  '/getAllApprovisonements',
  approvisonementController.getAllApprovisonements
);

// Route pour récupérer un approvisionnement par son ID
router.get(
  '/getApprovisonnement/:id',
  approvisonementController.getApprovisonementById
);

// Route pour supprimer un approvisionnement
router.delete(
  '/deleteApprovisonement/:id',
  approvisonementController.deleteApprovisonement
);

module.exports = router;
