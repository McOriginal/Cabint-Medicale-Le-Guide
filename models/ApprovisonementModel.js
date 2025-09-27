const mongoose = require('mongoose');
const approvisonementSchema = new mongoose.Schema(
  {
    medicament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicament',
      required: true,
    }, // Référence au médicament
    quantity: {
      type: Number,
      required: true,
    }, // Quantité approvisionnée
    price: {
      type: Number,
      required: true, // Prix d'achat du médicament
    },
    deliveryDate: {
      type: Date,
      default: Date.now, // Date de l'approvisionnement
    },
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fournisseur',
      required: true, // Référence au fournisseur
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Approvisonement = mongoose.model(
  'Approvisonement',
  approvisonementSchema
);
module.exports = Approvisonement;
