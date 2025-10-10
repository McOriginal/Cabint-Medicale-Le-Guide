import React from 'react';
import { Navigate } from 'react-router-dom';

//Dashboard
import Dashboard from '../Pages/Dashboard';

// Import Authentication pages
import Login from '../Pages/Authentication/Login';
import ForgetPasswordPage from '../Pages/Authentication/ForgetPassword';
import Register from '../Pages/Authentication/Register';
import UserProfile from '../Pages/Authentication/user-profile';

// Import Utility Pages
import StarterPage from '../Pages/Utility/Starter-Page';
import Maintenance from '../Pages/Utility/Maintenance-Page';
import ComingSoon from '../Pages/Utility/ComingSoon-Page';
import TimeLine from '../Pages/Utility/TimeLine-Page';
import FAQs from '../Pages/Utility/FAQs-Page';
import Pricing from '../Pages/Utility/Pricing-Page';
import Error404 from '../Pages/Utility/Error404-Page';
import Error500 from '../Pages/Utility/Error500-Page';

// Importing other pages
import PatientsListe from '../Pages/Patients/PatientsListe.js';
import TraitementsListe from '../Pages/Traitements/TraitementsListe.js';
import DoctorsListe from '../Pages/Doctors/DoctorsListe.js';
import FournisseurListe from '../Pages/Fournisseurs/FournisseurListe.js';
import TraitementDetails from '../Pages/Traitements/TraitementDetails.js';
import Chambre from '../Pages/OutilsMedicals/Chambre.js';
import Materiels from '../Pages/OutilsMedicals/MaterielsMedical.js';
import MedicamentListe from '../Pages/Pharmacy/MedicamentListe.js';
import NewOrdonance from '../Pages/Ordonnances/NewOrdonance.js';
import OrdonnanceListe from '../Pages/Ordonnances/OrdonanceListe.js';
import PaiementsListe from '../Pages/Paiements/PaiementsListe.js';
import FactureDetails from '../Pages/Paiements/FactureDetails.js';
import ApprovisonnementListe from '../Pages/Approvisonnements/ApprovisonnementListe.js';
import ApprovisonnementForm from '../Pages/Approvisonnements/ApprovisonnementForm.js';
import AppointmentListe from '../Pages/RendezVous/AppointmentListe.js';
import FactureListe from '../Pages/Paiements/FactureListe.js';
import DepenseListe from '../Pages/Depenses/DepenseListe.js';
import Rapports from '../Pages/Raports/Rapports.js';
import MedicamentSansStock from '../Pages/Pharmacy/MedicamentSansStock.js';
import UpdatePassword from '../Pages/Authentication/UpdatePassword.js';
import VerifyCode from '../Pages/Authentication/VerifyCode.js';
import ResetPassword from '../Pages/Authentication/ResetPassword.js';
import UpdateOrdonance from '../Pages/Ordonnances/UpdateOrdonance.js';
import UsersProfilesListe from '../Pages/Authentication/UsersProfilesListe.js';
import OrdonnanceDetails from '../Pages/Ordonnances/OrdonnanceDetails.js';
import DetailsOrdonnance from '../Pages/Ordonnances/Details/DetailsOrdonnance.js';

const sharedRoutes = [
  //appointments
  { path: '/appointments', component: <AppointmentListe /> },

  // Patient
  { path: '/patients', component: <PatientsListe /> },

  // Traitements
  { path: '/traitements', component: <TraitementsListe /> },

  // Traitement Detail
  { path: '/traitements/details/:id', component: <TraitementDetails /> },

  // Traitement Detail
  { path: '/traitements/ordonnance/:id', component: <NewOrdonance /> },

  // Changer le mot de passe
  { path: '/updatePassword', component: <UpdatePassword /> },

  { path: '/userprofile', component: <UserProfile /> },
  // Chambre
  { path: '/chambres', component: <Chambre /> },

  // Matériels
  { path: '/materiels', component: <Materiels /> },
];

// Routes pour les ADMINS
const authProtectedRoutes = [
  {
    path: '/',
    exact: true,
    component: <Navigate to='/dashboard' />,
  },
  //dashboard
  { path: '/dashboard', component: <Dashboard /> },

  // Ordonnance
  { path: '/ordonnances', component: <OrdonnanceListe /> },

  // Ordonnance
  { path: '/ordonnance/details/:id', component: <DetailsOrdonnance /> },

  // Update Ordonnance
  { path: '/traitements/updateOrdonnance/:id', component: <UpdateOrdonance /> },

  // Doctors
  { path: '/doctors', component: <DoctorsListe /> },

  // Fournisseurs
  { path: '/fournisseurs', component: <FournisseurListe /> },

  // Transaction et Factures

  // Paiements Liste
  { path: '/paiements', component: <PaiementsListe /> },

  //  Factures Liste
  { path: '/factures', component: <FactureListe /> },

  // Factures Détails
  { path: '/facture/:id', component: <FactureDetails /> },

  // Dépenses
  { path: '/depenses', component: <DepenseListe /> },

  // Profile
  { path: '/userprofile', component: <UserProfile /> },

  // Profile
  { path: '/profileListe', component: <UsersProfilesListe /> },

  // Outils Médicals

  // Médicament Pharmaceutique
  { path: '/medicaments', component: <MedicamentListe /> },

  // Médicament Pharmaceutique
  { path: '/medicaments_no_stock', component: <MedicamentSansStock /> },

  // Ajouter une Approvisonnement
  { path: '/approvisonnement/:id', component: <ApprovisonnementForm /> },

  // approvisonnements
  { path: '/approvisonnements', component: <ApprovisonnementListe /> },

  // Raports
  { path: '/rapports', component: <Rapports /> },

  // --------------------------------------------------------

  // Utility Pages
  { path: '/pages-starter', component: <StarterPage /> },
  { path: '/pages-timeline', component: <TimeLine /> },
  { path: '/pages-faqs', component: <FAQs /> },
  { path: '/pages-pricing', component: <Pricing /> },

  { path: '/register', component: <Register /> },
];

// Routes pour les Médecins
const usersRoutes = [
  {
    path: '/',
    exact: true,
    component: <Navigate to='/users-dashboard' />,
  },
  //dashboard
  { path: '/users-dashboard', component: <Dashboard /> },
];

const publicRoutes = [
  // { path: '/unauthorized', component: <Unauthorized /> },

  // Authentication Page
  // { path: '/register', component: <Register /> },

  { path: '/login', component: <Login /> },
  { path: '/forgotPassword', component: <ForgetPasswordPage /> },
  { path: '/verifyCode', component: <VerifyCode /> },
  { path: '/resetPassword', component: <ResetPassword /> },

  // Authentication Inner Pages
  // { path: '/auth-login', component: <Login1 /> },
  // { path: '/auth-register', component: <Register1 /> },
  // { path: '/auth-recoverpw', component: <RecoverPassword /> },
  // { path: '/auth-lock-screen', component: <LockScreen /> },

  // Utility Pages
  { path: '/pages-404', component: <Error404 /> },
  { path: '/pages-500', component: <Error500 /> },
  { path: '/pages-maintenance', component: <Maintenance /> },
  { path: '/pages-comingsoon', component: <ComingSoon /> },
];

export { authProtectedRoutes, usersRoutes, publicRoutes, sharedRoutes };
