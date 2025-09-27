const Materiel = require('../models/MaterielModel');
const textValidation = require('./regexValidation');

// Enregistrer une Materiel
exports.createMateriel = async (req, res) => {
  try {
    const { name, description, nombre, ...resData } = req.body;

    const lowerName = name.toLowerCase();
    const lowerDescription = description.toLowerCase();
    const numberMateriel = Number(nombre);

    // Vérification si la Materiels n'existe pas dans la base de données
    const existingMateriels = await Materiel.findOne({
      name: lowerName,
    });

    if (existingMateriels) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce Materiel existe déja.',
      });
    }

    //  Si il n'y a aucune erreur alors on créer un nouveau

    const materiel = await Materiel.create({
      name: lowerName,
      description: lowerDescription,
      nombre: numberMateriel,
      user: req.user.id,
      ...resData,
    });
    return res.status(201).json(materiel);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

//  Afficher toutes les Materiels
exports.getMateriels = async (req, res) => {
  try {
    const materiels = await Materiel.find()
      .populate('user')
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });
    return res.status(200).json(materiels);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};
//  Afficher un seul Materiel
exports.getOneMateriel = async (req, res) => {
  try {
    const materiels = await Materiel.findById(req.params.id);
    return res.status(200).json(materiels);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour une Materiel
exports.updateMateriel = async (req, res) => {
  try {
    const { name, description, nombre, ...resData } = req.body;

    const lowerName = name.toLowerCase();
    const lowerDescription = description.toLowerCase();
    const numberMateriel = Number(nombre);

    // Vérification si la Materiels n'existe pas dans la base de données
    const existingMateriels = await Materiel.findOne({
      name: lowerName,
      _id: { $ne: req.params.id },
    }).exec();

    if (existingMateriels) {
      return res.status(400).json({
        status: 'error',
        message: `Cet Materiel ${req.body.name} existe déjà.`,
      });
    }

    //  Si il n'y a pas d'erreur on met à jours
    const updatedMateriel = await Materiel.findByIdAndUpdate(
      req.params.id,
      {
        name: lowerName,
        description: lowerDescription,
        nombre: numberMateriel,
        ...resData,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(updatedMateriel);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer une Materiel
exports.deleteMaterielById = async (req, res) => {
  try {
    await Materiel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Materiel supprimée avec succès' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer toute les Materiels
exports.deleteAllMateriel = async (req, res) => {
  try {
    await Materiel.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Toute les Materiels ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de toute les Materiels',
      error: e.message,
    });
  }
};
