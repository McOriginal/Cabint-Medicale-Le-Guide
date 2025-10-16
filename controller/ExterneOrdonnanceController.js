const mongoose = require('mongoose');
const ExterneOrdonnance = require('../models/ExterneOrdonanceModel');


exports.createExterneOrdonnance = async (req, res) => {
 
  try {
    const { items, ...restOfData } = req.body;


    // Vérification des items
    if (!items || !Array.isArray(items) || items.length === 0) {
     
      return res.status(400).json({ message: 'Les articles sont requis.' });
    }

    

    // Création de l’ordonnance
    const newOrdonnance = await ExterneOrdonnance.create(
      { items, user: req.user.id, ...restOfData }
      
    );


  return  res.status(201).json(newOrdonnance);
  } catch (error) {
    console.error("Erreur lors de la création de l'ordonnance :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Update Ordonnance + ajuster les stocks
exports.updateExterneOrdonnance = async (req, res) => {
  
  try {
    const { items, ...restOfData } = req.body;


    // Vérification des items
    if (!items || !Array.isArray(items) || items.length === 0) {
     
      return res.status(400).json({ message: 'Les articles sont requis.' });
    }

  const ordonnance = await ExterneOrdonnance.findByIdAndUpdate(req.params.id,{items, ...restOfData})



    return res.status(200).json(ordonnance);
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: err.message });
  }
};



exports.getAllExterneOrdonnance = async (req, res) => {
  try {
    const ordonnances = await ExterneOrdonnance.find()
     
      .populate('user')
      .sort({ ordonnanceDate: -1 });

    return res.status(201).json(ordonnances);
  } catch (e) {
    return res.status(404).json(e);
  }
};

exports.getOneExterneOrdonnance = async (req, res) => {
  try {
    const ordonnance = await ExterneOrdonnance.findById(req.params.id)
    .populate('user')

    return res
      .status(201)
      .json( ordonnance );
  } catch (e) {
    return res.status(404).json(e);
  }
};

// Supprimer une ordonnance + restaurer les stocks

exports.deleteExterneOrdonnance = async (req, res) => {

  try {

    await ExterneOrdonnance.findByIdAndDelete(req.params.id)


    return res
      .status(200)
      .json({ message: 'Ordonnance supprimée avec succès' });
  } catch (err) {
  
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
