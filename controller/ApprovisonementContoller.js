const mongoose = require('mongoose');
const Approvisonement = require('../models/ApprovisonementModel');
const Medicament = require('../models/MedicamentModel');
const Depense = require('../models/DepenseModel');

// Create a new approvisonement
exports.createApprovisonement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { medicament, quantity, price, ...restOfData } = req.body;

    // On cast quantity et price en nombres
    const formatQuantity = Number(quantity);
    const formatPrice = Number(price);

    if (!medicament) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }

    // 1️ Mise à jour du stock du médicament
    const medica = await Medicament.findByIdAndUpdate(
      medicament,
      { $inc: { stock: formatQuantity } },
      { new: true, session }
    );

    if (!medica) {
      throw new Error('Médicament introuvable pour mise à jour');
    }

    // 2️ Création de l'approvisionnement
    const approvisonement = await Approvisonement.create(
      [
        {
          ...restOfData,
          quantity: formatQuantity,
          price: formatPrice,
          medicament,
        },
      ],
      { session }
    );

    // 3️ Création de la dépense associée
    await Depense.create(
      [
        {
          totalAmount: formatPrice,
          motifDepense: `Approvisionnement de (${quantity}) ${medica.name}`,
          dateOfDepense: approvisonement[0].deliveryDate,
        },
      ],
      { session }
    );

    //  Si tout est OK, on valide la transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(approvisonement[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: error.message });
  }
};

// Get all approvisonements
exports.getAllApprovisonements = async (req, res) => {
  try {
    const approvisonements = await Approvisonement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('medicament')
      .populate('fournisseur');
    return res.status(200).json(approvisonements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single approvisonement by ID
exports.getApprovisonementById = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findById(req.params.id)
      .populate('medicament')
      .populate('fournisseur');
    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    return res.status(200).json(approvisonement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an approvisonement by ID
exports.deleteApprovisonement = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findById(req.params.id);

    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }
    // On décrémente le stock du médicament associé
    await Medicament.findByIdAndUpdate(
      approvisonement.medicament,
      { $inc: { stock: -approvisonement.quantity } },
      { new: true }
    );

    await Approvisonement.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ message: 'Approvisonement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
