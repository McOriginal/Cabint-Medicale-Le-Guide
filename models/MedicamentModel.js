const mongoose = require('mongoose');

const medicamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // Ex: Nom de médicament
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Medicament = mongoose.model('Medicament', medicamentSchema);

module.exports = Medicament;
