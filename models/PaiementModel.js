const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema(
  {
   
    totalPaye: {
      type: Number,
      required: true,
      trim: true,
    },
    reduction: {
      type: Number,
      default: 0,
    },

    paiementDate: {
      type: Date,
      required: true,
    },
    methode: {
      type: String,
      enum: ['cash', 'orange money', 'moove money'],
      default: 'cash',
      required: true,
    },

    // Clé de rélation Traitement
    // traitement: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Traitement',
    //   required: true,
    // },
    // Clé de rélation Patient
    ordonnance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ordonnance',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Paiement = mongoose.model('Paiement', paiementSchema);
module.exports = Paiement;
