const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

const traitementController = require('../controller/TraitementController');

// Ajouter un Traitements
router.post(
  '/addTraitement',
  userController.authMiddleware,
  traitementController.addTraitement
);

// Récupérer toutes les Traitements
router.get('/getAllTraitements', traitementController.getAllTraitements);

// Récupérer une seule Traitement
router.get('/getOneTraitement/:id', traitementController.getTraitementById);

// Mettre à jour une seule Traitement
router.put('/updateTraitement/:id', traitementController.updateTraitement);

// Mettre à jour une seule Traitement
router.delete('/deleteTraitement/:id', traitementController.deleteTraitement);

// Mettre à jour une seule Traitement
router.delete(
  '/deleteAllTraitement/:id',
  traitementController.deleteAllTraitements
);

module.exports = router;
