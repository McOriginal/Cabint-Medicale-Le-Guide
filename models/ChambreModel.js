const mongoose = require('mongoose');

const chambreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
    },
    bedNumber: {
      type: Number,
    },
    description: String,
  },
  { timestamps: true }
);

const Chambre = mongoose.model('Chambre', chambreSchema);

module.exports = Chambre;
