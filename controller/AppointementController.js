const Appointment = require('./../models/AppointementModel');
const textValidator = require('./regexValidation');
exports.createAppointment = async (req, res) => {
  try {
    const { reasonForVisit, ...restOfData } = req.body;

    const lowerReasonForVisit = reasonForVisit.toLowerCase();
    // Validate reasonForVisit
    if (!textValidator.stringValidator(lowerReasonForVisit)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Erreur de donnée saissie recommencer',
      });
    }

    const appointment = await Appointment.create({
      ...restOfData,
      reasonForVisit: lowerReasonForVisit,
      user: req.user.id,
    });
    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get All Appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate({
        path: 'traitement',
        populate: {
          path: 'patient',
        },
      })
      .populate('doctor')
      .populate('user');
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { reasonForVisit, ...restOfData } = req.body;
    const lowerReasonForVisit = reasonForVisit.toLowerCase();
    // Validate reasonForVisit
    if (!textValidator.stringValidator(lowerReasonForVisit)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Erreur de donnée saissie recommencer',
      });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...restOfData, reasonForVisit: lowerReasonForVisit },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Appointment not found',
      });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Appointment not found',
      });
    }
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
