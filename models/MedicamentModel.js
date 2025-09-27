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
      defaul: 0,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    achatPrice: {
      type: Number,
      required: true,
      defaul: 0,
      trim: true,
    },

    imageUrl: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Medicament = mongoose.model('Medicament', medicamentSchema);

module.exports = Medicament;
