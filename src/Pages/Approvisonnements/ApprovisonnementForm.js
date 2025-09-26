import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import { useNavigate, useParams } from 'react-router-dom';
import { useAllFournisseur } from '../../Api/queriesFournisseur';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { useCreateApprovisonnement } from '../../Api/queriesApprovisonnement';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useOneMedicament } from '../../Api/queriesMedicament';

const ApprovisonnementForm = () => {
  // Récupération de l'ID du médicament depuis les paramètres de l'URL
  const { id } = useParams();

  // Matériels Query pour créer la Medicament
  const { mutate: createApprovisonement } = useCreateApprovisonnement();

  // Selected Medicament DATA
  const {
    data: selectedMedicament,
    isLoading: isFetchingMedicament,
    error: isErrorToFetch,
  } = useOneMedicament(id);

  // Forunisseur DATA
  const {
    data: fournisseurData,
    isLoading: fourniLoading,
    error: fourniError,
  } = useAllFournisseur();
  const [isLoading, setIsLoading] = useState(false);

  // Navigation vers la liste des Médicaments
  const navigate = useNavigate();

  const handleBackToList = () => {
    return navigate('/medicaments');
  };

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      medicament: id,
      quantity: '',
      price: '',
      deliveryDate: '',
      fournisseur: '',
    },

    validationSchema: Yup.object({
      quantity: Yup.number().required('Ce champ est obligatoire'),
      price: Yup.number().required('Ce champ est obligatoire'),
      deliveryDate: Yup.date().required('Ce champ est obligatoire'),
      fournisseur: Yup.string().required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      if (!id) {
        errorMessageAlert(
          'ID de médicament manquant. Veuillez réessayer en retournant dans la liste des Médicaments.'
        );
        return;
      }

      setIsLoading(true);

      createApprovisonement(
        { ...values, medicament: id },
        {
          onSuccess: () => {
            successMessageAlert('Médicament approvisionné avec succès');
            setIsLoading(false);
            resetForm();
            handleBackToList(); // Redirection vers la liste des Médicaments
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! Une erreur est survenue lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setIsLoading(false);
          },
        }
      );

      // Sécurité : timeout pour stopper le chargement si blocage
      setTimeout(() => {
        if (isLoading) {
          errorMessageAlert('Une erreur est survenue. Veuillez réessayer !');
          setIsLoading(false);
        }
      }, 10000);
    },
  });

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Pharmacie' breadcrumbItem='Approvisonnement' />

          <div
            style={{
              margin: '20px auto',
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <Card
              style={{
                padding: '20px',
              }}
            >
              {isFetchingMedicament && <LoadingSpiner />}
              {!isFetchingMedicament && isErrorToFetch && (
                <p className='text-center'>Erreur de trouver le médicament</p>
              )}

              {!isErrorToFetch && !isErrorToFetch && (
                <div className='mb-3 text-center'>
                  <h5>{capitalizeWords(selectedMedicament?.name)} </h5>
                  <h6 className='text-warning'>
                    {formatPrice(selectedMedicament?.price)} F{' '}
                  </h6>
                </div>
              )}
              <Form
                className='needs-validation'
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col sm='6'>
                    <FormGroup className='mb-3'>
                      <Label htmlFor='quantity'>Quantité</Label>
                      <Input
                        name='quantity'
                        placeholder='ex 10; 40; 0'
                        type='number'
                        className='form-control'
                        id='quantity'
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.quantity || ''}
                        invalid={
                          validation.touched.quantity &&
                          validation.errors.quantity
                            ? true
                            : false
                        }
                      />
                      {validation.touched.quantity &&
                      validation.errors.quantity ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.quantity}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col sm='6'>
                    <FormGroup className='mb-3'>
                      <Label htmlFor='price'>Prix d'Achat</Label>
                      <Input
                        name='price'
                        placeholder='Entrez un prix'
                        type='number'
                        className='form-control'
                        id='price'
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.price || ''}
                        invalid={
                          validation.touched.price && validation.errors.price
                            ? true
                            : false
                        }
                      />
                      {validation.touched.price && validation.errors.price ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.price}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md='12'>
                    <FormGroup className='mb-3'>
                      <Label htmlFor='deliveryDate'>Date d'Arrivée</Label>
                      <Input
                        name='deliveryDate'
                        placeholder='Chambre dédié pour les opérations chirugical.....'
                        type='date'
                        className='form-control'
                        id='deliveryDate'
                        max={new Date().toISOString().split('T')[0]} // Limite à aujourd'hui
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.deliveryDate || ''}
                        invalid={
                          validation.touched.deliveryDate &&
                          validation.errors.deliveryDate
                            ? true
                            : false
                        }
                      />
                      {validation.touched.deliveryDate &&
                      validation.errors.deliveryDate ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.deliveryDate}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md='12'>
                    <FormGroup>
                      <Label htmlFor='fournisseur'>Fournisseur</Label>
                      <Input
                        type='select'
                        name='fournisseur'
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.fournisseur || ''}
                        invalid={
                          validation.touched.fournisseur &&
                          validation.errors.fournisseur
                            ? true
                            : false
                        }
                      >
                        {fourniLoading && <LoadingSpiner />}
                        {fourniError && (
                          <div className='fw-bold text-danger text-center'></div>
                        )}
                        <option value=''>Sélectionner un fournisseur</option>
                        {!fourniError &&
                          !fourniLoading &&
                          fournisseurData?.length > 0 &&
                          fournisseurData.map((four) => (
                            <option key={four._id} value={four._id}>
                              {capitalizeWords(four.firstName)}{' '}
                              {capitalizeWords(four.lastName)}{' '}
                              {formatPhoneNumber(four.phoneNumber)}
                            </option>
                          ))}
                      </Input>
                      {validation.touched.fournisseur &&
                      validation.errors.fournisseur ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.fournisseur}
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
            </Card>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ApprovisonnementForm;
