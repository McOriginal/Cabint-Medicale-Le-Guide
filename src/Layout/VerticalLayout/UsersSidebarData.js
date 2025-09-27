const UsersSidebarData = [
  {
    label: 'Menu',
    isMainMenu: true,
  },
  {
    label: 'Tabelau de Bord',
    icon: 'mdi mdi-home-variant-outline',
    isHasArrow: true,
    url: '/dashboard-medecin',
  },

  {
    label: 'Rendez-vous',
    icon: 'mdi mdi-calendar-outline',
    isHasArrow: true,
    url: '/appointments',
  },

  // --------------------------------------

  // ----------------------------------------------------------------------
  // Patients, Traitements & Ordonnances
  {
    label: 'Traitements & Ordonnances',
    isMainMenu: true,
  },
  {
    label: 'Patients',
    icon: 'fas fa-procedures',
    isHasArrow: true,
    url: '/patients',
  },
  {
    label: 'Traitements',
    // icon: 'fas fa-file-medical-alt',
    icon: 'fas fa-heartbeat',
    isHasArrow: true,
    url: '/traitements',
  },
];
export default UsersSidebarData;
