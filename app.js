const express = require('express');
// Import des routes
const userRoute = require('./routes/UserRoute');
const doctorRoute = require('./routes/DoctorRoute');
const patientRoute = require('./routes/PatientRoute');
const fournisseurRoute = require('./routes/FournisseurRoute');
const materielRoute = require('./routes/MaterielRoute');
const traitementRoute = require('./routes/TraitementRoute');
const chambreRoute = require('./routes/ChambreRoute');
const medicamentRoute = require('./routes/MedicamentRoute');
const ordonnanceRoute = require('./routes/OrdonnanceRoute');
const paiementRoute = require('./routes/PaiementRoute');
const approvisonementsRoute = require('./routes/ApprovisonementRoute');
const appointmentRoute = require('./routes/AppointementRoute');
const depenseRoute = require('./routes/DepenseRoute');

const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares globaux
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(express.json()); // Parser les requêtes avec JSON

// Lire les données de formulaire avec body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes étudiant
// Ajoute un préfixe /api à toutes les routes

app.use('/', patientRoute);

// Utilisation des routes Utilisateur
app.use('/api/users', userRoute);

// Utilisation des routes Année Scolaire
app.use('/api/patients', patientRoute);

// Utilisation des routes Année Scolaire
app.use('/api/doctors', doctorRoute);

// Utilisation des routes Classe
app.use('/api/medicaments', medicamentRoute);

// Utilisation des routes Etudiant
app.use('/api/fournisseurs', fournisseurRoute);

// Utilisation des routes Enseignant
app.use('/api/materiels', materielRoute);

// Utilisation des routes Paiement
app.use('/api/traitements', traitementRoute);

// Utilisation des routes Chambre
app.use('/api/chambres', chambreRoute);

// Utilisation des routes Medicaments
app.use('/api/medicaments', medicamentRoute);

// Utilisation des routes Ordonnance
app.use('/api/ordonnances', ordonnanceRoute);

// Utilisation des routes Ordonnance
app.use('/api/paiements', paiementRoute);

// Utilisation des routes Approvisonnement
app.use('/api/approvisonnements', approvisonementsRoute);

// Utilisation des routes Appointment
app.use('/api/appointments', appointmentRoute);

// Utilisation des routes Depense
app.use('/api/depenses', depenseRoute);

//  Exporter le fichier APP
module.exports = app;
