const Chambre = require('../models/ChambreModel');
const textValidation = require('./regexValidation');

// Enregistrer une Chambre
exports.createChambre = async (req, res) => {
  try {
    const { title, description, bedNumber } = req.body;

    const lowerTitle = title.toLowerCase();
    const lowerDescription = description.toLowerCase();
    const numberChambre = Number(bedNumber);

    if (
      !textValidation.stringValidator(lowerTitle) ||
      !textValidation.stringValidator(lowerDescription)
    ) {
      return res
        .status(404)
        .json({ message: 'vous avez mal entrée les données' });
    }

    // Vérification si la Chambres n'existe pas dans la base de données
    const existingChambres = await Chambre.findOne({
      title: lowerTitle,
    });

    if (existingChambres) {
      return res.status(400).json({
        status: 'error',
        message: 'Cette Chambre existe déja.',
      });
    }

    //  Si il n'y a aucune erreur alors on créer un nouveau

    const chambre = await Chambre.create({
      title: lowerTitle,
      description: lowerDescription,
      bedNumber: numberChambre,
    });
    return res.status(201).json(chambre);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

//  Afficher toutes les Chambres
exports.getAllChambre = async (req, res) => {
  try {
    const chambres = await Chambre.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });
    return res.status(200).json(chambres);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};
//  Afficher un seul Chambre
exports.getChambre = async (req, res) => {
  try {
    const chambres = await Chambre.findById(req.params.id);
    return res.status(200).json(chambres);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour une Chambre
exports.updateChambre = async (req, res) => {
  try {
    const { title, description, bedNumber } = req.body;

    const lowerTitle = title.toLowerCase();
    const lowerDescription = description.toLowerCase();
    const numberChambre = Number(bedNumber);

    if (
      !textValidation.stringValidator(lowerTitle) ||
      !textValidation.stringValidator(lowerDescription)
    ) {
      return res
        .status(404)
        .json({ message: 'vous avez mal entrée les données' });
    }

    // Vérification si la Chambres n'existe pas dans la base de données
    const existingChambres = await Chambre.findOne({
      title: lowerTitle,
      _id: { $ne: req.params.id },
    }).exec();

    if (existingChambres) {
      return res.status(400).json({
        status: 'error',
        message: `Cette Chambre ${req.body.title} existe déjà.`,
      });
    }

    //  Si il n'y a pas d'erreur on met à jours
    const updatedChambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      {
        title: lowerTitle,
        description: lowerDescription,
        bedNumber: numberChambre,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(updatedChambre);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer une Chambre
exports.deleteChambreById = async (req, res) => {
  try {
    await Chambre.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Chambre supprimée avec succès' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer toute les Chambres
exports.deleteAllChambre = async (req, res) => {
  try {
    await Chambre.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Toute les Chambres ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de toute les Chambres',
      error: e.message,
    });
  }
};
