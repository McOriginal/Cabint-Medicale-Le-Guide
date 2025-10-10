const mongoose = require('mongoose');

const ordonanceSchema = new mongoose.Schema(
  {
    // Clé de rélation Patient
    traitement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traitement',
      required: true,
    },

    items: [
      {
        medicaments: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicament',
          required: true,
        },
        protocole: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, 'La quantité est requise'],
          min: [1, 'La quantité doit être au moins 1'],
        },
        customerPrice: {
          type: Number,
          required: [true, 'Le prix est requis'],
          min: [1, 'Le prix doit être positif'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Le total de l'ordonnance est requis"],
      min: [0, 'Le total doit être positif'],
    },
    ordonnanceDate:{
      type: Date,
      require: true,
      default: new Date()
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: true }
);

const Ordonance = mongoose.model('Ordonnance', ordonanceSchema);

module.exports = Ordonance;
