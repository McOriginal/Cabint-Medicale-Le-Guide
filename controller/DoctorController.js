const Doctor = require('../models/DoctorModel');
const textValidation = require('./regexValidation');

// Créer un Doctor
exports.createDoctor = async (req, res) => {
  try {
    const { firstName, lastName, emailAdresse, adresse, ...resOfData } =
      req.body;
    // Changer les données en miniscule
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerAdresse = adresse.toLowerCase();

    const phoneNumber = Number(req.body.phoneNumber);

    if (
      !textValidation.stringValidator(lowerFirstName) ||
      !textValidation.stringValidator(lowerLastName) 
      
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Vous avez mal saisie les données',
      });
    }

    // Vérification des champs uniques
    const existingDoctor = await Doctor.findOne({
      $or: [{ emailAdresse }, { phoneNumber }],
    }).exec();

    if (existingDoctor) {
      const duplicateFields = [];

      if (existingDoctor.emailAdresse === emailAdresse)
        duplicateFields.push('Le champ email existe déjà. ');
      if (existingDoctor.phoneNumber === phoneNumber)
        duplicateFields.push('Le champ téléphone existe déjà ');

      return res.status(409).json({
        status: 'error',
        message: duplicateFields.join('\n '),
      });
    }

    if (req.body.phoneNumber.toString().length !== 8) {
      return res.status(409).json({
        status: 'error',
        message: 'Le numéro de téléphone doit contenir exactement 8 chiffres',
      });
    }

    // Crée un nouveau professeur
    const newDoctor = await Doctor.create({
      firstName: lowerFirstName,
      lastName: lowerLastName,
      adresse: lowerAdresse,
      emailAdresse,
      user: req.user.id,
      ...resOfData,
    });
    return res.status(201).json({
      newDoctor,
    });
  } catch (e) {
    return res.status(409).json({
      status: 'Email existe',
      message: e.message,
    });
    // }
  }
};

// Obtenir tous les Doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user')
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 });
    return res.status(200).json(doctors);
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Récupérer un Doctor par ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
      return res
        .status(404)
        .json({ status: 'error', message: 'Doctor non trouvé' });

    return res.status(200).json({ doctor });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
};

// Mettre à jour un Doctor
exports.updateDoctor = async (req, res) => {
  const {
    firstName,
    lastName,
    adresse,
    phoneNumber,
    emailAdresse,
    ...resOfData
  } = req.body;
  // Changer les données en miniscule
  const lowerFirstName = firstName.toLowerCase();
  const lowerLastName = lastName.toLowerCase();
  const lowerAdresse = adresse.toLowerCase();

  if (
    !textValidation.stringValidator(lowerFirstName) ||
    !textValidation.stringValidator(lowerLastName) 
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Vous avez mal saisie les données',
    });
  }

  // Conversion des numéros (protection contre les strings)
  const phoneNum = Number(phoneNumber);

  // Vérification des doublons (en excluant l'étudiant actuel)
  const existingDoctor = await Doctor.findOne({
    _id: { $ne: req.params.id }, // Exclure l'étudiant actuel
    $or: [{ emailAdresse }, { phoneNumber: phoneNum }],
  }).exec();

  if (existingDoctor) {
    const duplicateFields = [];

    if (existingDoctor.emailAdresse === emailAdresse) {
      duplicateFields.push('email');
    }
    if (existingDoctor.phoneNumber === phoneNum) {
      duplicateFields.push('téléphone');
    }

    return res.status(409).json({
      status: 'error',
      message: `Le champs: ${duplicateFields.join('\n ')} existe déjà`,
    });
  }
  try {
    //  Si il n y a pas d'erreur on met ajour
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        firstName: lowerFirstName,
        lastName: lowerLastName,
        adresse: lowerAdresse,
        emailAdresse,
        phoneNumber: phoneNum,
        ...resOfData,
      },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor non trouvé',
      });
    }
    return res.status(200).json({ updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Supprimer un Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Doctor supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ############### DELETE ALL STUDENTS ############################
exports.deleteAllDoctors = async (req, res) => {
  try {
    await Doctor.deleteMany({}); // Supprime tous les documents

    return res.status(200).json({
      status: 'success',
      message: 'Tous les Doctors ont été supprimés avec succès',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression des Doctors',
      error: e.message,
    });
  }
};
