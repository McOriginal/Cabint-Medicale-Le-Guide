const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    traitement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traitement',
      required: true,
      trim: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    reasonForVisit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
