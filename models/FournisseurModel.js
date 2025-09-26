const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Masculin', 'Féminin'],
      default: 'Masculin',
    },

    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    emailAdresse: {
      type: String,
      trim: true,
    },

    adresse: {
      type: String,
      required: true,
      max: 30,
    },
    marchandise: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Fournisseur = mongoose.model('Fournisseur', fournisseurSchema);

module.exports = Fournisseur;
