const mongoose = require('mongoose');
const PaiementHistorique = require('../models/PaiementHistoriqueModel');
const Traitement = require('../models/TraitementModel');
const Ordonnance = require('../models/OrdonanceModel');
const Paiement = require('../models/PaiementModel');
// Enregistrer un paiement
exports.createPaiementHistorique = async (req, res) => {
  const session= await mongoose.startSession();
  session.startTransaction();

  const { amount } = req.body;
  try {
    const selectedOrdonnanceId = req.body.ordonnance;
    // On cherche si ID de Paiement
    const existingPaiement = await Paiement.findOne({
      ordonnance: selectedOrdonnanceId,
    }).session(session);

    // On vérifie si le paiement n'existe pas
    if (!existingPaiement) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Vous devez d'abord ajouter le premier paiement" });
    }

    await Paiement.findByIdAndUpdate(existingPaiement, {
      $inc: { totalPaye: +amount }},
      {session},
    );

    const paiementHistorique = await PaiementHistorique.create(
      [{
      ...req.body,
      user: req.user.id,
    }],
     {session}
  );

  await session.commitTransaction();
  session.endSession()
    return res.status(201).json(paiementHistorique);
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    console.log(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour un paiement
exports.updatePaiementHistorique = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    const newAmount = req.body.amount;
    const selectedOrdonnanceId = req.body.ordonnance;

    // Etape 1: chercher si ID de Paiement sélectionné
    const existingPaiement = await Paiement.findOne({
      ordonnance: selectedOrdonnanceId,
    }).session(startSession);

    // On vérifie si le paiement n'existe pas
    if (!existingPaiement) {
      await session.abortTransaction()
      session.endSession()
      return res
        .status(404)
        .json({ message: "Vous devez d'abord ajouter le premier paiement" });
    }


    const selectedPaiementHistorique = await PaiementHistorique.findById(
      req.params.id
    ).session(session);

    const oldAmount = selectedPaiementHistorique.amount;
    // Soustraire  d'abord le montant de l'ancien paiement
    await Paiement.findByIdAndUpdate(existingPaiement, {
      $inc: { totalPaye: -oldAmount },
    },{session});

    // en suite adintioner la nouvealle valeur
    await Paiement.findByIdAndUpdate(existingPaiement, {
      $inc: { totalPaye: +newAmount },
    },{session});

    const updated = await PaiementHistorique.findByIdAndUpdate(
      req.params.id,
      { amount: newAmount, ...req.body },
      {
        new: true,
        runValidators: true,
        session
      }
    );

await session.commitTransaction()
session.endSession()

    return res.status(200).json(updated);
  } catch (err) {
    await session.abortTransaction()
    session.endSession();
    console.log(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Historique des paiements
exports.getAllPaiementsHistorique = async (req, res) => {
  try {
    // Récupération des Historique de PAIEMENT dont ID COMMANDE correspond au celle sélectionné dans URL

    const paiements = await PaiementHistorique.find()
      .populate('user')
      .populate('ordonnance')
      .sort({ paiementDate: -1 });

    return res.status(200).json(paiements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
// Historique des paiements d’un étudiant
exports.getPaiementHistorique = async (req, res) => {
  try {
    const paiements = await PaiementHistorique.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'ordonnance',
        populate: { path: 'items.medicaments' },
      });

    return res.status(200).json(paiements);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un paiement
exports.deletePaiementHistorique = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // On Cherche d'abord l'HISTORIQUE de PAIEMENT a supprimer
    const deletedHisPaiement = await PaiementHistorique.findById(req.params.id).session(session);

    const paieHistorique = await PaiementHistorique.find({ordonnance: deletedHisPaiement.ordonnance}).session(session);
  

   // Trouver le PAIEMENT dont ID de COMMANDE est dans l'historique de PAIEMENT
   const paiement = await Paiement.findOne({
    ordonnance: deletedHisPaiement.ordonnance,
  }).session(session);

  


if(!deletedHisPaiement || !paieHistorique || !paiement){
  await session.abortTransaction()
  session.endSession()
  return res.status(404).json({message: 'Aucun Paiement  Trouvée'});
}
  

    // Vérifier si il ne reste qu'un seul Paiement Historique alors On supprime aussi le Paiement
if(paieHistorique.length === 1 ){
  

 await Paiement.findByIdAndDelete(paiement._id).session(session);
   
    // après on supprimer le PAIEMENT HISTORIQUE
     await PaiementHistorique.findByIdAndDelete(req.params.id).session(session);

     await session.commitTransaction()
     session.endSession()

 return res.status(200).json({
    status: 'success',
    message: 'Paiement et son Historique ont été supprimé avec succès',
  })
}
  

    // On met à jour la somme de TotalPaye de PAIEMENT correspondant
   await Paiement.findByIdAndUpdate(
      paiement._id,
      {
        $inc: { totalPaye: -deletedHisPaiement.amount },
      },
      {session}
    );


 // après on supprimer le PAIEMENT HISTORIQUE
 await PaiementHistorique.findByIdAndDelete(req.params.id).session(session);

   
    await session.commitTransaction()
    session.endSession()

    return  res.status(200).json({
    
      status: 'success',
      message: 'Historique Paiement supprimé avec succès',
    });
   
   
  } catch (err) {
    await session.abortTransaction()
    session.endSession();
    console.log(err)
    res.status(400).json({ status: 'error', message: err.message });
  }
};
