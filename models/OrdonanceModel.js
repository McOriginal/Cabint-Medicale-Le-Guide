const mongoose = require('mongoose');

const ordonanceSchema = new mongoose.Schema(
  {
    // Clé de rélation Patient
    traitement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traitement',
      required: true,
    },

    // Clé rélation Doctor
    // doctor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Doctor',
    //   required: true,
    // },

    items: [
      {
        medicaments: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicament',
          required: true,
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
  },

  { timestamps: true }
);

const Ordonance = mongoose.model('Ordonance', ordonanceSchema);

module.exports = Ordonance;
