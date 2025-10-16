const SidebarData = [
  {
    label: 'Menu',
    isMainMenu: true,
  },
  {
    label: 'Tableau de Bord',
    icon: 'mdi mdi-home-variant-outline',
    isHasArrow: true,
    url: '/dashboard',
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
  {
    label: 'Ordonnances',
    icon: 'fas fa-first-aid',
    isHasArrow: true,
    url: '/ordonnances',
  },

  {
    label: 'Ordonnances Externe',
    icon: 'fas fa-first-aid',
    isHasArrow: true,
    url: '/externe-ordonnance/liste',
  },

  // Transactions
  {
    label: 'Paiements',
    isMainMenu: true,
  },
  {
    label: 'Comptablité',
    icon: 'fas fa-euro-sign',
    subItem: [
      { sublabel: 'Historique des Paiements', link: '/paiements' },
      // { sublabel: 'Historique des Paiements', link: '/factures' },
      { sublabel: 'Dépense', link: '/depenses' },
    ],
  },

  // Pharmacie
  {
    label: 'Suivie Pharmaceutique',
    isMainMenu: true,
  },
  {
    label: 'Pharmacie',
    icon: 'dripicons-pill',
    subItem: [
      { sublabel: 'Liste Médicament', link: '/medicaments' },
      { sublabel: 'Stock Faible', link: '/medicaments_no_stock' },
      { sublabel: 'Historique Approvisionnements', link: '/approvisonnements' },
    ],
  },

  // ----------------------------------------------------------------------
  // Médecins
  {
    label: 'Médecins & Fournisseurs',
    isMainMenu: true,
  },
  {
    label: 'Médecins',
    icon: 'fas fa-user-md',
    isHasArrow: true,
    url: '/doctors',
  },
  {
    label: 'Fournisseurs',
    icon: 'fas fa-ambulance',
    isHasArrow: true,
    url: '/fournisseurs',
  },

  // Outils Médical
  {
    label: 'Matériels',
    isMainMenu: true,
  },
  {
    label: 'Outis Médicals',
    icon: 'fas fa-toolbox',
    subItem: [
      { sublabel: 'Chambre', link: '/chambres' },
      { sublabel: 'Matériels', link: '/materiels' },
    ],
  },

  // Pharmacie
  {
    label: 'Statistiques & Rapports',
    isMainMenu: true,
  },
  {
    label: 'Rapports et Suivie',
    icon: 'fas fa-chart-bar',
    subItem: [{ sublabel: 'Raports', link: '/rapports' }],
  },
  // --------------------------------------
];
export default SidebarData;
