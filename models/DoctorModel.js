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

    guardDays: {
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

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
