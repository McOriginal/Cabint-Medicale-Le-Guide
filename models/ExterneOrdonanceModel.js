const mongoose = require('mongoose');

const externeOrdonanceSchema = new mongoose.Schema(
  {
    traitement: {
      type:String,
      required: true,
    },
    ordonnanceDate:{
      type: Date,
      require: true,
      default: new Date(),
    },
    patient: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },

    items: [
      {
        medicament: {
          type: String,
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

const ExterneOrdonance = mongoose.model('ExterneOrdonance', externeOrdonanceSchema);

module.exports = ExterneOrdonance;
