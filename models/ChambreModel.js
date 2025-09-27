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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Chambre = mongoose.model('Chambre', chambreSchema);

module.exports = Chambre;
