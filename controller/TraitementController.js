const Traitement = require('../models/TraitementModel');
const Ordonnance = require('../models/OrdonanceModel');
const Medicament = require('../models/MedicamentModel');
const Paiement = require('../models/PaiementModel');
const Appointment = require('../models/AppointementModel');

// Enregistrer une Traitement
exports.addTraitement = async (req, res) => {
  try {
    const {
      motif,
      diagnostic,
      result,
      observation,
      totalAmount,
      ...resOfData
    } = req.body;

    const formattedTotalAmount = Number(totalAmount);

    const Traitements = await Traitement.create({
      motif: motif.toLowerCase(),
      diagnostic: diagnostic.toLowerCase(),
      result: motif.toLowerCase(),
      observation: observation.toLowerCase(),
      totalAmount: formattedTotalAmount,
      ...resOfData,
    });
    return res.status(201).json({ Traitements });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour une Traitement
exports.updateTraitement = async (req, res) => {
  try {
    const {
      motif,
      diagnostic,
      result,
      observation,
      totalAmount,
      ...resOfData
    } = req.body;

    const formattedTotalAmount = Number(totalAmount);

    // Mettre à jour le Traitement
    const updated = await Traitement.findByIdAndUpdate(
      req.params.id,
      {
        motif: motif.toLowerCase(),
        diagnostic: diagnostic.toLowerCase(),
        result: result.toLowerCase(),
        observation: observation.toLowerCase(),
        totalAmount: formattedTotalAmount,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({ updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Récupérer toutes les Traitements
exports.getAllTraitements = async (req, res) => {
  try {
    const traitements = await Traitement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('patient')
      .populate('doctor');
    return res.status(200).json(traitements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ######################################################
// Récupérer une Traitement spécifique
// ######################################################
exports.getTraitementById = async (req, res) => {
  try {
    const traitements = await Traitement.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    if (!traitements) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Traitement non trouvée' });
    }
    return res.status(200).json(traitements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer une Traitement
exports.deleteTraitement = async (req, res) => {
  const session = await Medicament.startSession();
  session.startTransaction();
  try {
    // Trouvez les ORDONNANCES via le TRAITEMENT es req.aprams.id
    const ordonnance = await Ordonnance.findOne({
      traitement: req.params.id,
    });

    // On vérifi uniquement si il y' au moins une ORDONNANCE alors on execute
    if (ordonnance) {
      // ID ORDONNANCE à supprimer
      const ordonnanceID = ordonnance._id;
      // Les Items(médicaments) dans l'ORDONNANCE
      const ordonnanceItems = ordonnance.items;

      // On supprime toutes les ORDONNANCES trouvés et retablir le Stock
      for (const { medicaments, quantity } of ordonnanceItems) {
        // On trouve chaque MEDICAMENT via son ID
        const medicament = await Medicament.findById(medicaments).session(
          session
        );
        if (medicament) {
          // On addition la quantité de chaque MEDICAMENT sur son stock
          medicament.stock += quantity;
          await medicament.save({ session });
        }
      }

      // On Supprime l'ORDONNANCE
      await Ordonnance.findByIdAndDelete(ordonnanceID, {
        session,
      });
    }

    // On supprime egalement le PAIEMENT lié à ce TRAITEMENT uniquement si le PAIEMENT existe
    const paiementToDelete = await Paiement.findOne({
      traitement: req.params.id,
    });

    if (paiementToDelete) {
      await Paiement.findByIdAndDelete(paiementToDelete);
    }

    // On supprime egalement Appointment lié uniquement si ça existe
    const existeAppointement = await Appointment.find({
      traitement: req.params.id,
    });
    // Si il y'a au moins un APPONTEMENT alors on parcours avec la boucle pour supprimer tous
    if (existeAppointement) {
      for (const appoint of existeAppointement) {
        await Appointment.findByIdAndDelete(appoint._id, { session });
      }
    }

    // au Final On supprime le Traitement
    await Traitement.findByIdAndDelete(req.params.id, { session });

    // On arrête la session
    await session.commitTransaction();
    session.endSession();

    // Retourner la response
    return res
      .status(200)
      .json({ status: 'success', message: 'Traitement supprimée avec succès' });

    // ----------------
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ############### DELETE ALL Traitement ############################
exports.deleteAllTraitements = async (req, res) => {
  try {
    await Traitement.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Toutes les Traitements ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression des Traitements',
      error: e.message,
    });
  }
};
