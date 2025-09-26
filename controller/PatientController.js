const mongoose = require('mongoose');
const Patient = require('../models/PatientModel');
const Traitement = require('../models/TraitementModel');
const Ordonnance = require('../models/OrdonanceModel');
const Medicament = require('../models/MedicamentModel');
const Paiement = require('../models/PaiementModel');
const Appointment = require('../models/AppointementModel');

const textValidator = require('./regexValidation');

exports.newPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailAdresse,
      adresse,
      ethnie,
      profession,
      ...resOfData
    } = req.body;

    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();
    const lowerEthnie = ethnie.toLowerCase();
    const lowerProfession = profession.toLowerCase();

    if (
      !textValidator.stringValidator(lowerFirstName) ||
      !textValidator.stringValidator(lowerLastName) ||
      (ethnie != '' && !textValidator.stringValidator(lowerEthnie)) ||
      (profession != '' && !textValidator.stringValidator(profession))
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Données invalides',
      });
    }

    const phoneNumber = Number(req.body.phoneNumber);

    if (phoneNumber) {
      // Vérification des champs uniques
      const existingPatient = await Patient.findOne({
        phoneNumber,
      }).exec();

      if (existingPatient) {
        return res.status(409).json({
          status: 'error',
          message: 'Ce numéro existe déjà pour un patient',
        });
      }
    }

    if (phoneNumber && req.body.phoneNumber.toString().length !== 8) {
      return res.status(409).json({
        status: 'error',
        message: 'Le numéro de téléphone doit contenir exactement 8 chiffres',
      });
    }

    // Création du nouvel patient
    const newPatient = await Patient.create({
      firstName: lowerFirstName,
      lastName: lowerLastName,
      adresse: lowerAdresse,
      ethnie: lowerEthnie,
      profession: lowerProfession,
      ...resOfData,
    });
    return res.status(201).json({
      status: 'success',
      message: 'Patient Ajouté avec succès',
      data: newPatient,
    });
  } catch (error) {
    console.log('Erreur de création:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// ################ ###########################""
// ################ All Patients ###########################""

exports.getAllPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });

    return res.status(200).json(allPatients);
  } catch (e) {
    res.status(404).json({
      status: 'error',
      // message: "Erreur de l'affichage des patients",
      message: e.message,
    });
  }
};

// ################ One Patient ###########################""

exports.getOnePatient = async (req, res) => {
  try {
    const onePatient = await Patient.findById(req.params.patientId);

    res.status(200).json({
      status: 'succes',
      message: 'Patient affiché avec succès',
      data: {
        onePatient,
      },
    });
  } catch (e) {
    console.log("Erreur de l'affichage de patient: ", e);
    res.status(404).json({
      status: 'error',
      message: 'Erreur de trouver  patient',
    });
  }
};

// ################ Update One Patient ###########################

exports.updatePatient = async (req, res) => {
  try {
    // const { patientId } = req.params.id;
    const {
      firstName,
      lastName,
      emailAdresse,
      adresse,
      ethnie,
      profession,
      ...resOfData
    } = req.body;

    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();
    const lowerEthnie = ethnie.toLowerCase();
    const lowerProfession = profession.toLowerCase();

    // Validation des données requises
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID patient invalide',
      });
    }

    if (
      !textValidator.stringValidator(lowerFirstName) ||
      !textValidator.stringValidator(lowerLastName) ||
      !textValidator.stringValidator(lowerAdresse) ||
      !textValidator.stringValidator(lowerEthnie) ||
      (profession != '' && !textValidator.stringValidator(lowerProfession))
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Données invalides',
      });
    }

    const phoneNumber = Number(req.body.phoneNumber);

    if (phoneNumber) {
      // Vérification des champs uniques
      const existingPatient = await Patient.findOne({
        _id: { $ne: req.params.id },
        phoneNumber,
      }).exec();

      if (existingPatient) {
        return res.status(409).json({
          status: 'error',
          message: 'Ce numéro existe déjà pour un patient',
        });
      }
    }

    if (phoneNumber && req.body.phoneNumber.toString().length !== 8) {
      return res.status(409).json({
        status: 'error',
        message: 'Le numéro de téléphone doit contenir exactement 8 chiffres',
      });
    }

    // Mise à jour de patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        firstName: lowerFirstName,
        lastName: lowerLastName,
        adresse: lowerAdresse,
        ethnie: lowerEthnie,
        profession: lowerProfession,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    ).exec();

    if (!updatedPatient) {
      return res.status(404).json({
        status: 'error',
        message: 'patient non trouvé',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'patient mis à jour avec succès',
      data: updatedPatient,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de patient:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la mise à jour',
    });
  }
};

// ################ ###########################""
// ################ Update One Patient ###########################

exports.deletePatient = async (req, res) => {
  const session = await Medicament.startSession();
  session.startTransaction();
  try {
    // ID de PATIENT
    const patientID = req.params.id;

    // Traitement à suppprimer
    const deletedTrait = await Traitement.find({ patient: patientID });

    // Vérfication si il y'a au moins un TRAITEMENT existe
    if (deletedTrait) {
      // On parcour chaque TRAITEMENT pour executer la suppression de l'ORDONNANCES et retablir le STOCK
      for (const traitement of deletedTrait) {
        // Trouvez les ORDONNANCES via le TRAITEMENT
        const ordonnance = await Ordonnance.findOne({
          traitement: deletedTrait,
        });

        // Vérification si il y'a au moins une ORDONNANCE
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

            // Vérification si le MEDICAMENT existe
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

        // On supprime egalement le PAIEMENT lié à ce TRAITEMENT
        const paiementToDelete = await Paiement.findOne({
          traitement: traitement,
        });

        // Vérification si un PAIEMENT existe
        if (paiementToDelete) {
          // Si oui alors on le supprime
          await Paiement.findByIdAndDelete(paiementToDelete);
        }

        // On vérifie si le TRAITEMENT existe
        const existeTrait = await Traitement.findById(traitement._id);
        if (existeTrait) {
          // On supprime egalement Appointment lié uniquement si ça existe
          const existeAppointement = await Appointment.find({
            traitement: existeTrait,
          });
          // Si il y'a au moins un APPONTEMENT alors on parcours avec la boucle pour supprimer tous
          if (existeAppointement) {
            for (const appoint of existeAppointement) {
              await Appointment.findByIdAndDelete(appoint._id);
            }
          }
          //  supprime le Traitement
          await Traitement.findByIdAndDelete(traitement._id);
        }
        // FIN DE BOUCLE
      }
    }
    //  en fin on supprime le Patient
    await Patient.findByIdAndDelete(patientID);

    res.status(200).json({
      status: 'succes',
      message: 'Patient supprimer avec succès',
    });

    // On arrête la session
    await session.commitTransaction();
    session.endSession();
  } catch (e) {
    console.log('Erreur de  suppression de patient: ', e);
    res.status(404).json({
      status: 'error',
      message: 'Erreur de suppression de patient',
    });
  }
};

// ############### DELETE ALL PatientS ############################
exports.deleteAllPatients = async (req, res) => {
  try {
    await Patient.deleteMany({}); // Supprime tous les documents

    res.status(200).json({
      status: 'success',
      message: 'Tous les patients ont été supprimés avec succès',
    });
  } catch (e) {
    console.error('Erreur lors de la suppression de tous les patients:', e);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de tous les patients',
      error: e.message,
    });
  }
};
