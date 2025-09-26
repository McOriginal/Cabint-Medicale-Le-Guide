const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAdresse: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ['Masculin', 'Féminin'],
      default: 'Masculin',
      required: true,
    },
    adresse: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    speciality: {
      type: String,
      trim: true,
      reqiured: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    salaire: {
      type: Number,
    },

    guardDays: {
      type: String,
    },
    statut: {
      type: String,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
