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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Materiel', materielSchema);
