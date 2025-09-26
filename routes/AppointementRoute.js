const express = require('express');
const router = express.Router();
const appointementController = require('./../controller/AppointementController');

// Create a new appointment
router.post('/createAppointment', appointementController.createAppointment);

// Update an appointment by ID
router.put('/updateAppointment/:id', appointementController.updateAppointment);

// Get all appointments
router.get('/getAllAppointments', appointementController.getAllAppointments);

// Delete an appointment by ID
router.delete(
  '/deleteAppointment/:id',
  appointementController.deleteAppointment
);

module.exports = router;
