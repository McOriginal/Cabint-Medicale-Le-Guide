const mongoose = require('mongoose');

const traitementSchema = new mongoose.Schema(
  {
    motif: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      set: (val) => {
        const date = new Date(val);
        date.setHours(0, 0, 0, 0); // remet l'heure à 00:00:00.000
        return date;
      },
    },
    startTime: {
      type: String,
      required: true,
    },

    height: {
      type: String,
    },
    width: {
      type: String,
    },
    nc: {
      type: String,
    },
    ac: {
      type: String,
    },
    asc: {
      type: String,
    },
    diagnostic: {
      type: String,
    },
    result: {
      type: String,
      required: [true, 'Le résultat du traitement est requis'],
    },
    observation: {
      type: String,
    },

    totalAmount: {
      type: Number,
      required: [true, 'Le montant total du traitement est requis'],
      min: [0, 'Le montant total doit être positif'],
    },

    // Clé de rélation Etudiant
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },

    // Clé de rélation Matières
    doctor: {
      type: String,
      required: true,
      trim:true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Traitement = mongoose.model('Traitement', traitementSchema);

module.exports = Traitement;
