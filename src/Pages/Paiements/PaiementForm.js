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
import { useEffect, useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  useCreatePaiement,
  useUpdatePaiement,
} from '../../Api/queriesPaiement';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';

const PaiementForm = ({ paiementToEdit, tog_form_modal }) => {
  // Paiement Query pour créer la Paiement
  const { mutate: createPaiement } = useCreatePaiement();
  // Paiement Query pour Mettre à jour la Paiement
  const { mutate: updatePaiement } = useUpdatePaiement();

  // Query Ordonnance
  const { data: ordonnanceData } = useAllOrdonnances();

  // Query pour affiche toutes les traitementData
  const {
    data: traitementData,
    isLoading: isFetchingTraitement,
    error,
  } = useAllTraitement();

  // State pour gérer le chargement
  const [isLoading, setisLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      traitement: paiementToEdit?.traitement?._id || '',
      paiementDate: paiementToEdit?.paiementDate.substring(0, 10) || '',
      totalAmount: paiementToEdit?.totalAmount || undefined,
      reduction: paiementToEdit?.reduction || undefined,
      totalPaye: paiementToEdit?.totalPaye || undefined,
      methode: paiementToEdit?.methode || '',
    },
    validationSchema: Yup.object({
      traitement: Yup.string().required('Ce champ est obligatoire'),
      paiementDate: Yup.date().required('Ce champ est obligatoire'),
      totalAmount: Yup.number().required('Ce champ est obligatoire'),
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
              successMessageAlert('Données mise à jour avec succès');
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
  // Calcule de Somme Total en fonction de TRAITEMENT Sélectionné
  useEffect(() => {
    const selectedTraitement = traitementData?.find(
      (t) => t._id === validation.values.traitement
    );

    // Trouver l'ordonnaces en fonction de ID de traitement sélectionné
    const selectedOrdonnance = ordonnanceData?.find(
      (ordo) => ordo?.traitement?._id === validation.values.traitement
    );

    if (selectedTraitement) {
      const traitementAmount = selectedTraitement.totalAmount || 0;
      const ordonnancesAmount = selectedOrdonnance?.totalAmount || 0;
      // Calculer le montant total en ajoutant le montant du traitement et de l'ordonnance
      const totalTraitementOrdonnance = traitementAmount + ordonnancesAmount;
      const reduction = Number(validation.values.reduction) || 0;
      const finalAmount = Math.max(totalTraitementOrdonnance - reduction, 0);

      if (validation.values.totalAmount !== finalAmount) {
        validation.setFieldValue('totalAmount', finalAmount);
      }
    }
  }, [
    ordonnanceData,
    validation.values.traitement,
    validation.values.reduction,
    traitementData,
  ]);

  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      {validation.values.totalAmount !== undefined && (
        <h6 className='text-end '>
          Total:{' '}
          <span className='text-warning'>
            {formatPrice(validation.values.totalAmount)} F
          </span>
        </h6>
      )}
      <Row>
        <Col md='12'>
          {!error && isFetchingTraitement && <LoadingSpiner />}
          {error && (
            <p className='text-getRectCenter text-danger'>
              Erreur de chargement veillez acctualiser la page{' '}
            </p>
          )}
          {!error && !isFetchingTraitement && (
            <FormGroup className='mb-3'>
              <Label htmlFor='traitement'>Traitement</Label>

              <Input
                name='traitement'
                type='select'
                className='form-control'
                id='traitement'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.traitement || ''}
                invalid={
                  validation.touched.traitement && validation.errors.traitement
                    ? true
                    : false
                }
              >
                <option value=''>Sélectionner le traitement</option>
                {traitementData?.map((trait) => (
                  <option key={trait?._id} value={trait._id}>
                    {capitalizeWords(trait?.patient?.firstName)}{' '}
                    {capitalizeWords(trait?.patient?.lastName)}
                    {' | '}
                    {capitalizeWords(trait?.motif)}
                    {' | '}{' '}
                    {new Date(trait?.createdAt).toLocaleDateString('fr-Fr', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </option>
                ))}
              </Input>
              {validation.touched.traitement && validation.errors.traitement ? (
                <FormFeedback type='invalid'>
                  {validation.errors.traitement}
                </FormFeedback>
              ) : null}
            </FormGroup>
          )}
        </Col>
      </Row>

      <Row>
        {/* <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='totalAmount'>
              Somme Total{' '}
              <span className='text-warning' style={{ fontSize: '10px' }}>
                Traitement + ordonnances
              </span>{' '}
            </Label>

            <Input
              name='totalAmount'
              min={1}
              style={{ color: 'orange' }}
              type='number'
              className='form-control'
              id='totalAmount'
              onBlur={validation.handleBlur}
              defaultValue={validation.values.totalAmount || ''}
              value={validation.values.totalAmount || ''}
              invalid={
                validation.touched.totalAmount && validation.errors.totalAmount
                  ? true
                  : false
              }
            />
            {validation.touched.totalAmount && validation.errors.totalAmount ? (
              <FormFeedback type='invalid'>
                {validation.errors.totalAmount}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col> */}
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='totalPaye'>Somme Payé</Label>

            <Input
              name='totalPaye'
              type='number'
              min={0}
              max={validation.values.totalAmount || 0}
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
