const express = require('express');
const router = express.Router();
const chambreController = require('../controller/ChambreController');

//  Créer une nouvelle Chambre
router.post('/createChambre', chambreController.createChambre);

//  Obtenir toutes les Chambres (avec année scolaire liée)
router.get('/getChambres', chambreController.getAllChambre);

//  Obtenir une Chambres (avec année scolaire liée)
router.get('/getOneChambre/:id', chambreController.getChambre);

//  Mettre à jour une Chambre
router.put('/updateChambre/:id', chambreController.updateChambre);

//  Supprimer une Chambre
router.delete('/deleteChambre/:id', chambreController.deleteChambreById);

//  Supprimer toutes les Chambre sans Chambre
router.delete('/deleteAllChambres', chambreController.deleteAllChambre);

module.exports = router;
