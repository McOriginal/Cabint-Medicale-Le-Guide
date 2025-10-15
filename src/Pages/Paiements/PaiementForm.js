import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  useCreatePaiement,
  useUpdatePaiement,
} from '../../Api/queriesPaiement';
import { formatPrice } from '../components/capitalizeFunction';
import { useParams } from 'react-router-dom';
import { useOneOrdonnance } from '../../Api/queriesOrdonnance';

const PaiementForm = ({ paiementToEdit, tog_form_modal }) => {
  const param = useParams();

  // Paiement Query pour créer la Paiement
  const { mutate: createPaiement } = useCreatePaiement();
  // Paiement Query pour Mettre à jour la Paiement
  const { mutate: updatePaiement } = useUpdatePaiement();

  // Query Ordonnance
  const { data: ordonnanceData } = useOneOrdonnance(param.id);

  // State pour gérer le chargement
  const [isLoading, setisLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      ordonnance:
        paiementToEdit?.ordonnance?._id || ordonnanceData?.ordonnances?._id,
      paiementDate:
        paiementToEdit?.paiementDate.substring(0, 10) ||
        new Date().toISOString().substring(0, 10),
      reduction: paiementToEdit?.reduction || undefined,
      totalPaye: paiementToEdit?.totalPaye || undefined,
      methode: paiementToEdit?.methode || '',
    },
    validationSchema: Yup.object({
      ordonnance: Yup.string().required('Ce champ est obligatoire'),
      paiementDate: Yup.date().required('Ce champ est obligatoire'),
      reduction: Yup.number().typeError('Ce doit être un nombre valide'),
      totalPaye: Yup.number().required('Ce champ est obligatoire'),
      methode: Yup.string().required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setisLoading(true);

      // Si la méthode est pour mise à jour alors
      const paiementsDataLoaded = {
        ...values,
      };

      if (paiementToEdit) {
        updatePaiement(
          { id: paiementToEdit?._id, data: paiementsDataLoaded },
          {
            onSuccess: () => {
              successMessageAlert('Mise à jour avec succès');
              setisLoading(false);
              tog_form_modal();
            },
            onError: (err) => {
              errorMessageAlert(
                err?.response?.data?.message ||
                  err?.message ||
                  'Erreur lors de la mise à jour'
              );
              setisLoading(false);
            },
          }
        );
      }

      // Sinon on créer un nouveau étudiant
      else {
        createPaiement(
          { ...values, totalAmount: validation.values.totalAmount },
          {
            onSuccess: () => {
              successMessageAlert('Paiement ajoutée avec succès');
              setisLoading(false);
              resetForm();
              tog_form_modal();
            },
            onError: (err) => {
              const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Oh Oh ! une erreur est survenu lors de l'enregistrement";
              errorMessageAlert(errorMessage);
              setisLoading(false);
            },
          }
        );
      }
    },
  });

  // // Calcule de Somme Total en fonction de TRAITEMENT Sélectionné
  // useEffect(() => {
  //   const selectedTraitement = traitementData?.find(
  //     (t) => t._id === validation.values.traitement
  //   );

  //   // Trouver l'ordonnaces en fonction de ID de traitement sélectionné
  //   const selectedOrdonnance = ordonnanceData?.find(
  //     (ordo) => ordo?.traitement?._id === validation.values.traitement
  //   );

  //   if (selectedTraitement) {
  //     const traitementAmount = selectedTraitement.totalAmount || 0;
  //     const ordonnancesAmount = selectedOrdonnance?.totalAmount || 0;
  //     // Calculer le montant total en ajoutant le montant du traitement et de l'ordonnance
  //     const totalTraitementOrdonnance = traitementAmount + ordonnancesAmount;
  //     const reduction = Number(validation.values.reduction) || 0;
  //     const finalAmount = Math.max(totalTraitementOrdonnance - reduction, 0);

  //     if (validation.values.totalAmount !== finalAmount) {
  //       validation.setFieldValue('totalAmount', finalAmount);
  //     }
  //   }
  // }, [
  //   ordonnanceData,
  //   validation.values.traitement,
  //   validation.values.reduction,
  //   traitementData,
  // ]);

  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <h6 className='text-end '>
        Traitement / Consultation:{' '}
        <span className='text-info'>
          {formatPrice(ordonnanceData?.traitements?.totalAmount || 0)} F
        </span>
      </h6>
      <h6 className='text-end '>
        Ordonnance:{' '}
        <span className='text-info'>
          {formatPrice(ordonnanceData?.ordonnances?.totalAmount)} F
        </span>
      </h6>
      <h6 className='text-end '>
        Total:{' '}
        <span className='text-success'>
          {formatPrice(
            ordonnanceData?.traitements?.totalAmount +
              ordonnanceData?.ordonnances?.totalAmount
          )}{' '}
          F
        </span>
      </h6>

      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='totalPaye'>Montant Payé</Label>

            <Input
              name='totalPaye'
              type='number'
              min={0}
              max={
                ordonnanceData?.traitements?.totalAmount +
                  ordonnanceData?.ordonnances?.totalAmount || 0
              }
              placeholder='Somme Payé'
              className='form-control no-spinner'
              id='totalPaye'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.totalPaye || ''}
              invalid={
                validation.touched.totalPaye && validation.errors.totalPaye
                  ? true
                  : false
              }
            />
            {validation.touched.totalPaye && validation.errors.totalPaye ? (
              <FormFeedback type='invalid'>
                {validation.errors.totalPaye}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='reduction'>Réduction</Label>

            <Input
              name='reduction'
              type='number'
              style={{ color: 'red' }}
              min={0}
              max={validation.values.totalAmount || 0}
              placeholder='Réduction appliquée'
              className='form-control'
              id='reduction'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.reduction || 0}
              invalid={
                validation.touched.reduction && validation.errors.reduction
                  ? true
                  : false
              }
            />
            {validation.touched.reduction && validation.errors.reduction ? (
              <FormFeedback type='invalid'>
                {validation.errors.reduction}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='paiementDate'>Date de Paiement</Label>

            <Input
              name='paiementDate'
              type='date'
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className='form-control'
              id='paiementDate'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.paiementDate || ''}
              invalid={
                validation.touched.paiementDate &&
                validation.errors.paiementDate
                  ? true
                  : false
              }
            />
            {validation.touched.paiementDate &&
            validation.errors.paiementDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.paiementDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='methode'>Méthode de Paiement</Label>
            <Input
              name='methode'
              type='select'
              className='form-control'
              id='methode'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.methode || ''}
              invalid={
                validation.touched.methode && validation.errors.methode
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner la méthode de paiement</option>
              <option value='cash'>En Espèce</option>
              <option value='orange money'>Orange Money</option>
              <option value='moove money'>Moove Money</option>
            </Input>
            {validation.touched.methode && validation.errors.methode ? (
              <FormFeedback type='invalid'>
                {validation.errors.methode}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <div className='d-grid text-center mt-4'>
        {isLoading && <LoadingSpiner />}
        {!isLoading && (
          <Button color='success' type='submit'>
            Enregisrer
          </Button>
        )}
      </div>
    </Form>
  );
};

export default PaiementForm;
