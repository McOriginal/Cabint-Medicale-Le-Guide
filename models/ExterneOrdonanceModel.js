const mongoose = require('mongoose');

const externeOrdonanceSchema = new mongoose.Schema(
  {
    traitement: {
      type:String,
      required: true,
      trim: true,
    },
    ordonnanceDate:{
      type: Date,
      require: true,
      default: new Date(),
      trim: true,
    },
    patient: {
      type: String,
      required: true,
      trim: true,
    },
    doctor: {
      type: String,
      required: true,
      trim: true,
    },

    items: [
      {
        medicament: {
          type: String,
          required: true,
          trim: true,
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
      
      },
    ],
   
   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: true }
);

const ExterneOrdonance = mongoose.model('ExterneOrdonnance', externeOrdonanceSchema);

module.exports = ExterneOrdonance;
