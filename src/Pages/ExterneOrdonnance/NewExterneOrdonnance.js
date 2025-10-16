import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  RequiredFormField,
} from '../components/capitalizeFunction';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useCreateExterneOrdonnance } from '../../Api/queriesExterneOrdonnance';

export default function NewExterneOrdonnance() {
  const navigate = useNavigate();
  const { mutate: createOrdonnance } = useCreateExterneOrdonnance();

  const [ordonnanceItems, setOrdonnanceItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Schéma de validation complet
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      traitement: '',
      patient: '',
      doctor: '',
      ordonnanceDate: new Date().toISOString().split('T')[0],
      medicament: '',
      protocole: '',
      quantity: '',
    },
    validationSchema: Yup.object({
      traitement: Yup.string().required('Le traitement est obligatoire').trim(),
      patient: Yup.string().required('Le patient est obligatoire').trim(),
      doctor: Yup.string()
        .required('Le médecin prescripteur est obligatoire')
        .trim(),
      ordonnanceDate: Yup.date().required(
        "La date de l'ordonnance est obligatoire"
      ),
      medicament: Yup.string().when('isSubmitting', {
        is: false,
        then: (schema) => schema.required('Le médicament est obligatoire'),
      }),
      protocole: Yup.string().when('isSubmitting', {
        is: false,
        then: (schema) => schema.required('Le protocole est obligatoire'),
      }),
      quantity: Yup.number()
        .typeError('La quantité doit être un nombre')
        .min(1, 'La quantité doit être au moins 1'),
      // .required('La quantité est obligatoire'),
    }),

    onSubmit: async (values, { resetForm }) => {
      if (ordonnanceItems.length === 0) {
        errorMessageAlert('Veuillez ajouter au moins un médicament.');
        return;
      }

      setIsSubmitting(true);

      const payload = {
        traitement: values.traitement,
        patient: values.patient,
        doctor: values.doctor,
        ordonnanceDate: values.ordonnanceDate,
        items: ordonnanceItems.map((item) => ({
          medicament: item.medicament,
          protocole: item.protocole,
          quantity: item.quantity,
        })),
      };

      createOrdonnance(payload, {
        onSuccess: () => {
          successMessageAlert('Ordonnance enregistrée avec succès.');
          resetForm();
          setOrdonnanceItems([]);
          setIsSubmitting(false);
          navigate('/externe-ordonnance/liste');
        },
        onError: (err) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            'Erreur lors de la création de l’ordonnance.';
          errorMessageAlert(message);
          setIsSubmitting(false);
        },
      });
    },
  });

  // ✅ Ajouter un médicament à la liste
  const handleAddMedicament = () => {
    if (
      !validation.values.medicament ||
      !validation.values.protocole ||
      !validation.values.quantity
    ) {
      errorMessageAlert('Veuillez remplir tous les champs du médicament.');
      return;
    }

    setOrdonnanceItems((prev) => [
      ...prev,
      {
        medicament: capitalizeWords(validation.values.medicament),
        protocole: validation.values.protocole.trim(),
        quantity: parseInt(validation.values.quantity, 10),
      },
    ]);

    // On nettoie les champs de médicament
    validation.setFieldValue('medicament', '');
    validation.setFieldValue('protocole', '');
    validation.setFieldValue('quantity', '');
  };

  // ✅ Supprimer un médicament
  const removeFromCart = (index) => {
    setOrdonnanceItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='page-content'>
      <Container fluid>
        <Breadcrumbs title='Ordonnances' breadcrumbItem='Nouvelle Ordonnance' />

        {isSubmitting && <LoadingSpiner />}

        <form onSubmit={validation.handleSubmit}>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <CardTitle className='mb-4'>
                    Informations de l’ordonnance
                  </CardTitle>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for='ordonnanceDate'>
                          Date d’Ordonnance <RequiredFormField />
                        </Label>
                        <Input
                          type='date'
                          name='ordonnanceDate'
                          id='ordonnanceDate'
                          className='border-1 border-dark'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.ordonnanceDate}
                          invalid={
                            validation.touched.ordonnanceDate &&
                            validation.errors.ordonnanceDate
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>
                          {validation.errors.ordonnanceDate}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for='traitement'>
                          Traitement <RequiredFormField />
                        </Label>
                        <Input
                          type='text'
                          name='traitement'
                          id='traitement'
                          className='border-1 border-dark'
                          placeholder='Nom du traitement'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.traitement}
                          invalid={
                            validation.touched.traitement &&
                            validation.errors.traitement
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>
                          {validation.errors.traitement}
                        </FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label for='doctor'>
                          Médecin <RequiredFormField />
                        </Label>
                        <Input
                          type='text'
                          name='doctor'
                          id='doctor'
                          className='border-1 border-dark'
                          placeholder='Nom du médecin prescripteur'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.doctor}
                          invalid={
                            validation.touched.doctor &&
                            validation.errors.doctor
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>{validation.errors.doctor}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for='patient'>
                          Patient <RequiredFormField />
                        </Label>
                        <Input
                          type='text'
                          name='patient'
                          id='patient'
                          className='border-1 border-dark'
                          placeholder='Nom du patient'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.patient}
                          invalid={
                            validation.touched.patient &&
                            validation.errors.patient
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>{validation.errors.patient}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* ------------------------- AJOUT DE MÉDICAMENTS ------------------------- */}
            <Col md={12}>
              <Card>
                <CardBody>
                  <CardTitle className='mb-4'>Ajouter un médicament</CardTitle>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for='medicament'>
                          Médicament <RequiredFormField />
                        </Label>
                        <Input
                          type='text'
                          name='medicament'
                          id='medicament'
                          className='border-1 border-dark'
                          placeholder='Nom du médicament'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.medicament}
                          invalid={
                            validation.touched.medicament &&
                            validation.errors.medicament
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>
                          {validation.errors.medicament}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for='quantity'>
                          Quantité <RequiredFormField />
                        </Label>
                        <Input
                          type='number'
                          name='quantity'
                          id='quantity'
                          className='border-1 border-dark'
                          placeholder='Quantité'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.quantity}
                          invalid={
                            validation.touched.quantity &&
                            validation.errors.quantity
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>
                          {validation.errors.quantity}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for='protocole'>
                          Protocole <RequiredFormField />
                        </Label>
                        <Input
                          type='text'
                          name='protocole'
                          id='protocole'
                          className='border-1 border-dark'
                          placeholder='Protocole du médicament'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.protocole}
                          invalid={
                            validation.touched.protocole &&
                            validation.errors.protocole
                              ? true
                              : false
                          }
                        />
                        <FormFeedback>
                          {validation.errors.protocole}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className='text-center'>
                    <Button
                      color='success'
                      type='button'
                      onClick={handleAddMedicament}
                    >
                      <i className='fas fa-plus me-2'></i>
                      Ajouter le médicament
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* ------------------------- LISTE DES MÉDICAMENTS ------------------------- */}
            {ordonnanceItems.length > 0 && (
              <Col md={12}>
                <Card>
                  <CardBody>
                    <CardTitle className='mb-3'>
                      Liste des Médicaments
                    </CardTitle>
                    {ordonnanceItems.map((item, index) => (
                      <div
                        key={index}
                        className='d-flex justify-content-between align-items-center border-bottom py-2'
                      >
                        <div>
                          <strong>{item.medicament}</strong> — {item.protocole}{' '}
                          <span className='text-muted'>(x{item.quantity})</span>
                        </div>
                        <Button
                          color='danger'
                          size='sm'
                          onClick={() => removeFromCart(index)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            )}

            {/* ------------------------- BOUTON ENREGISTRER ------------------------- */}
            <Col md={12} className='mt-3 text-end my-3'>
              <Button
                color='primary'
                type='submit'
                disabled={isSubmitting}
                className='fw-bold'
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer Ordonnance'}
              </Button>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
}
