const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

const externeOrdonnanceController = require('../controller/ExterneOrdonnanceController');

//  Créer une nouvelle Ordonnance
router.post(
  '/createExterneOrdonnance',
  userController.authMiddleware,
  externeOrdonnanceController.createExterneOrdonnance
);

// Mettre à jour l'ordonnance
router.put('/updateExterneOrdonnance/:id', externeOrdonnanceController.updateExterneOrdonnance);

//  Obtenir toutes les Ordonnances
router.get('/getAllExterneOrdonnances', externeOrdonnanceController.getAllExterneOrdonnance);

//  Obtenir une Ordonnances
router.get('/getExterneOrdonnance/:id', externeOrdonnanceController.getOneExterneOrdonnance);

//  Supprimer une Ordonnance
router.delete('/deleteExterneOrdonnance/:id', externeOrdonnanceController.deleteExterneOrdonnance);



module.exports = router;
