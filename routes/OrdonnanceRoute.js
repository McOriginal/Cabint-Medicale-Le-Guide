const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controller/OrdonnanceController');

//  Créer une nouvelle Ordonnance
router.post('/createOrdonnance', ordonnanceController.createOrdonnance);

// Mettre à jour l'ordonnance
router.put('/updateOrdonnance/:id', ordonnanceController.updateOrdonnance);

//  Obtenir toutes les Ordonnances
router.get('/getAllOrdonnances', ordonnanceController.getAllOrdonnances);

//  Obtenir une Ordonnances
router.get('/getOneOrdonnance/:id', ordonnanceController.getOneOrdonnance);

//  Obtenir une Ordonnances (avec TRAITEMENT liée)
router.get(
  '/getTraitementOrdonnance/:traitementId',
  ordonnanceController.getTraitementOrdonnance
);

//  Supprimer une Ordonnance
router.post('/deleteOrdonnance/:id', ordonnanceController.deleteOrdonnance);

module.exports = router;
