const express = require('express');
const router = express.Router();
const materielController = require('../controller/MaterielController');

//  Créer une nouvelle Materiel
router.post('/createMateriel', materielController.createMateriel);

//  Obtenir toutes les Materiels (avec année scolaire liée)
router.get('/getMateriels', materielController.getMateriels);

//  Obtenir une Materiels (avec année scolaire liée)
router.get('/getOneMateriel/:id', materielController.getOneMateriel);

//  Mettre à jour une Materiel
router.put('/updateMateriel/:id', materielController.updateMateriel);

//  Supprimer une Materiel
router.delete('/deleteMateriel/:id', materielController.deleteMaterielById);

//  Supprimer Toute les Materiel avec Materiel
router.delete('/deleteMateriel', materielController.deleteMaterielById);

//  Supprimer toutes les Materiel sans Materiel
router.delete('/deleteAllMateriels', materielController.deleteAllMateriel);

module.exports = router;
