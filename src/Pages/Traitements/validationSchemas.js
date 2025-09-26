import * as Yup from 'yup';

export const validationSchemas = [
  // Step 1: Informations générales
  Yup.object({
    patient: Yup.string().required('Le patient est requis'),
    motif: Yup.string().required('Le motif est requis'),
    startDate: Yup.string().required('La date est requise'),
    startHoror: Yup.string().required("L'heure est requise"),
  }),

  // Step 2: Informations cliniques
  Yup.object({
    height: Yup.number()
      .nullable()
      .min(0, 'Taille invalide')
      .typeError('La taille doit être un nombre'),
    width: Yup.number()
      .nullable()
      .min(0, 'Poids invalide')
      .typeError('Le poids doit être un nombre'),
    nc: Yup.number().nullable().typeError('Valeur incorrecte'),
    ac: Yup.number().nullable().typeError('Valeur incorrecte'),
    asc: Yup.number().nullable().typeError('Valeur incorrecte'),
  }),

  // Step 3: Diagnostic
  Yup.object({
    diagnostic: Yup.string().required('Diagnostic requis'),
    result: Yup.string().required('Résultat requis'),
    observation: Yup.string(),
    doctor: Yup.string().required('Médecin requis'),
  }),
];
