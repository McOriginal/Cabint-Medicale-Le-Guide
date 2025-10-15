const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Masculin', 'Féminin'],
      default: 'Masculin',
    },
    age: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    groupeSanguin: {
      type: String,
      defaul: 'no définis'
    },
    ethnie: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
    },

    adresse: {
      type: String,
      default: 'bamako',
      max: 30,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
