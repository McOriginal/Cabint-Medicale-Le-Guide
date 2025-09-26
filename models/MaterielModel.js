const mongoose = require('mongoose');

const materielSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    nombre: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    imageUrl: {
      type: String,
    },

    // Clé de rélation de Chambre
    chambre: { type: mongoose.Schema.Types.ObjectId, ref: 'Chambre' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Materiel', materielSchema);
