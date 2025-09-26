const Medicament = require('../models/MedicamentModel');
const Ordonnance = require('../models/OrdonanceModel');
const Traitement = require('../models/TraitementModel');
const Paiement = require('../models/PaiementModel');
// Enregistrer une Medicament
exports.createMedicament = async (req, res) => {
  try {
    const { name, stock, price, ...resOfData } = req.body;

    const lowerName = name.toLowerCase();
    const formatStock = Number(stock);
    const formatPrice = Number(price);

    // Vérifier s'il existe déjà une matière avec ces critères
    const existingMedicaments = await Medicament.findOne({
      name: lowerName,
    }).exec();

    if (existingMedicaments) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce MEDICAMENT existe déjà.',
      });
    }

    // Création de la matière
    const medicament = await Medicament.create({
      name: lowerName,
      stock: formatStock,
      price: formatPrice,
      ...resOfData,
    });

    return res.status(201).json(medicament);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour une Medicament
exports.updateMedicament = async (req, res) => {
  try {
    const { name, stock, price, ...resOfData } = req.body;

    const lowerName = name.toLowerCase();
    const formatStock = Number(stock);
    const formatPrice = Number(price);

    // Vérifier s'il existe déjà une matière avec ces critères
    const existingMedicaments = await Medicament.findOne({
      name: lowerName,
      _id: { $ne: req.params.id },
    }).exec();

    if (existingMedicaments) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce MEDICAMENT existe déjà.',
      });
    }

    // Mise à jour de la matière
    const updated = await Medicament.findByIdAndUpdate(
      req.params.id,
      {
        name: lowerName,
        stock: formatStock,
        price: formatPrice,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

//  Afficher une seule Medicament avec une stock minimum de (1)
exports.getAllMedicamentWithStock = async (req, res) => {
  try {
    const medicaments = await Medicament.find({ stock: { $gt: 1 } })
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });

    return res.status(200).json(medicaments);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

//  Afficher une seule Medicament avec une stock terminée (0)
exports.getAllMedicamentWithStockFinish = async (req, res) => {
  try {
    const medicaments = await Medicament.find({ stock: { $lt: 5 } })
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });

    return res.status(200).json(medicaments);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

//  Afficher une seule Medicament
exports.getOneMedicament = async (req, res) => {
  try {
    const medicaments = await Medicament.findById(req.params.id);
    return res.status(200).json(medicaments);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer une Matire
exports.deleteMedicamentById = async (req, res) => {
  try {
    await Medicament.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Medicament supprimée avec succès' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer toute les Medicament
exports.deleteAllMedicament = async (req, res) => {
  try {
    await Medicament.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Toute les Medicament ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de toute les Medicament',
      error: e.message,
    });
  }
};

// -----------------------------------------------
// exports.decrementMultipleStocks = async (req, res) => {
//   const session = await Medicament.startSession();
//   session.startTransaction();

//   try {
//     const items = req.body.items; // [{ id, quantity }, ...]

//     for (const { medicaments, quantity } of items) {
//       const medicament = await Medicament.findById(medicaments).session(
//         session
//       );
//       if (!medicament) {
//       }

//       if (medicament.stock < quantity) {
//         console.log(
//           `Stock insuffisant pour ${medicament.name}. Disponible : ${medicament.stock}`
//         );
//       }

//       medicament.stock -= quantity;
//       await medicament.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({ message: 'Stocks mis à jour avec succès' });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ message: err.message });
//   }
// };

// annuler une ORDONNANCES et retablir le Stock
// exports.cancelOrdonnance = async (req, res) => {
//   const session = await Medicament.startSession();
//   session.startTransaction();

//   try {
//     const ordonnanceId = req.params.ordonnanceId;
//     const { items } = req.body;

//     for (const { medicamentId, quantity } of items) {
//       const medicament = await Medicament.findById(medicamentId).session(
//         session
//       );
//       if (!medicament) {
//         throw new Error(`Médicament ${medicamentId} non trouvé`);
//       }
//       medicament.stock += quantity;
//       await medicament.save({ session });
//     }

//     const deletedOrdonnance = await Ordonnance.findByIdAndDelete(ordonnanceId, {
//       session,
//     });
//     if (!deletedOrdonnance) {
//       throw new Error('Ordonnance non trouvée');
//     }

//     const trait = await Traitement.findById(deletedOrdonnance.traitement);

//     const deletedPaiement = await Paiement.findOne({ traitement: trait });
//     await Paiement.findByIdAndDelete(deletedPaiement);

//     await session.commitTransaction();
//     session.endSession();

//     return res
//       .status(200)
//       .json({ message: 'Annulation réussie, stock rétabli.' });
//   } catch (err) {
//     console.log(err);
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ message: err.message });
//   }
// };
