const mongoose = require('mongoose');
const Ordonnance = require('../models/OrdonanceModel');
const Medicament = require('../models/MedicamentModel');
const Traitement = require('../models/TraitementModel');

exports.createOrdonnance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, ...restOfData } = req.body;

    // Vérification de l'unicité d'une ordonnance pour un traitement donné
    const existingOrdonnance = await Ordonnance.findOne({
      traitement: req.body.traitement,
    }).session(session);

    if (existingOrdonnance) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: 'Une Ordonnance existe déjà pour ce Traitement' });
    }

    // Vérification des items
    if (!items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Les articles sont requis.' });
    }

    // Validation des médicaments et mise à jour des stocks
    for (const item of items) {
      const medicament = await Medicament.findById(item.medicaments).session(
        session
      );
      if (!medicament) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ message: `Médicament introuvable: ${item.medicaments}` });
      }

      if (item.quantity < 1) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: 'Quantité invalide pour un produit.' });
      }

      if (medicament.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Stock insuffisant pour ${medicament.name}. Disponible: ${medicament.stock}`,
        });
      }

      // Décrémentation du stock
      medicament.stock -= item.quantity;
      await medicament.save({ session });
    }

    // Création de l’ordonnance
    const newOrdonnance = await Ordonnance.create(
      [{ items, user: req.user.id, ...restOfData }],
      {
        session,
      }
    );

    // Validation de la transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newOrdonnance[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur lors de la création de l'ordonnance :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Update Ordonnance + ajuster les stocks
exports.updateOrdonnance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params; // id de l’ordonnance
    const { items, ...restOfData } = req.body;
    // Vérif que l’ordonnance existe
    const ordonnance = await Ordonnance.findById(id).session(session);
    if (!ordonnance) {
      return res.status(404).json({ message: 'Ordonnance introuvable' });
    }

    // Vérif des items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Les articles sont requis.' });
    }

    // --- 1. Restaurer les stocks des anciens items avant mise à jour ---
    for (const oldItem of ordonnance.items) {
      const medicament = await Medicament.findById(oldItem.medicaments).session(
        session
      );
      if (medicament) {
        medicament.stock += oldItem.quantity; // on réajoute au stock
        await medicament.save({ session });
      }
    }

    // --- 2. Vérifier et appliquer les nouveaux items ---
    for (const newItem of items) {
      const medicament = await Medicament.findById(newItem.medicaments).session(
        session
      );
      if (!medicament) {
        throw new Error(`Medicament introuvable: ${newItem.medicaments}`);
      }

      if (newItem.quantity < 1) {
        throw new Error(`Quantité invalide pour le produit ${medicament.name}`);
      }

      if (medicament.stock < newItem.quantity) {
        throw new Error(
          `Stock insuffisant pour ${medicament.name}, disponible : ${medicament.stock}`
        );
      }

      medicament.stock -= newItem.quantity; // on décrémente le stock
      await medicament.save({ session });
    }

    // --- 3. Mettre à jour l’ordonnance ---
    ordonnance.items = items;
    Object.assign(ordonnance, restOfData);
    await ordonnance.save({ session });

    // --- 4. Valider la transaction ---
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(ordonnance);
  } catch (err) {
    console.log(err);

    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err.message });
  }
};

exports.getAllOrdonnances = async (req, res) => {
  try {
    const ordonnances = await Ordonnance.find()
      // Trie par date de création, du plus récent au plus ancien
      .populate({
        path: 'traitement',
        populate: {
          path: 'patient',
        },
      })
      .populate('items.medicaments')
      .populate('user')
      .sort({ createdAt: -1 });
    return res.status(201).json(ordonnances);
  } catch (e) {
    return res.status(404).json(e);
  }
};

exports.getOneOrdonnance = async (req, res) => {
  try {
    const ordonnance = await Ordonnance.findById(req.params.id)
    .populate('items.medicaments')
    .populate(
      {
        path: 'traitement',
      
      populate:[{path:'patient'} ,{ path: 'doctor'}]
    
    }
  )
    .populate('user')

    return res
      .status(201)
      .json( ordonnance );
  } catch (e) {
    return res.status(404).json(e);
  }
};

// Récuperer l'ordonnance par Traitement
exports.getTraitementOrdonnance = async (req, res) => {
  try {
   

    // Récupérer l'ordonnance dont le traitement correspond à une ID précise
    const ordonnance = await Ordonnance.findOne({
      traitement: req.params.id,
    })
      .populate('traitement')
      .populate('items.medicaments');

    return res.status(201).json(ordonnance);
  } catch (e) {
    return res.status(404).json(e);
  }
};

// Supprimer une ordonnance + restaurer les stocks

exports.deleteOrdonnance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    // Vérif que l’ordonnance existe
    const ordonnance = await Ordonnance.findById(id).session(session);
    if (!ordonnance) {
      return res.status(404).json({ message: 'Ordonnance introuvable' });
    }

    // --- 1. Restaurer les stocks des médicaments ---
    for (const item of ordonnance.items) {
      const medicament = await Medicament.findById(item.medicaments).session(
        session
      );
      if (medicament) {
        medicament.stock += item.quantity; // réajout du stock
        await medicament.save({ session });
      }
    }

    // --- 2. Supprimer l’ordonnance ---
    await ordonnance.deleteOne({ session });

    // --- 3. Valider la transaction ---
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ message: 'Ordonnance supprimée avec succès' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
