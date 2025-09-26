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
  useCreateFournisseur,
  useUpdateFournisseur,
} from '../../Api/queriesFournisseur';

const FournisseurForm = ({ fournisseurToEdit, tog_form_modal }) => {
  // Patient Query pour créer un etudiant
  const { mutate: createFournisseur } = useCreateFournisseur();

  // Patient Query pour Mettre à jour un etudiant
  const { mutate: updateFournisseur } = useUpdateFournisseur();
  const [isLoading, setisLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: fournisseurToEdit?.firstName || '',
      lastName: fournisseurToEdit?.lastName || '',
      gender: fournisseurToEdit?.gender || '',
      phoneNumber: fournisseurToEdit?.phoneNumber || undefined,
      adresse: fournisseurToEdit?.adresse || '',
      emailAdresse: fournisseurToEdit?.emailAdresse || '',
      marchandise: fournisseurToEdit?.marchandise || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),

      lastName: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ Prénom est obligatoire'),
      gender: Yup.string().required('Ce champ est obligatoire'),
      phoneNumber: Yup.number().required('Ce champ est obligatoire'),
      emailAdresse: Yup.string().matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Veillez Entrez un Email correct !'
      ),
      adresse: Yup.string()
        .matches(/^[a-z0-9À-ÿ\s]+$/i, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),
      marchandise: Yup.string()
        .matches(/^[a-z0-9À-ÿ\s]+$/i, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setisLoading(true);

      // Si la méthode est pour mise à jour alors
      const fournisseurDataLoaded = {
        ...values,
      };

      if (fournisseurToEdit) {
        updateFournisseur(
          { id: fournisseurToEdit._id, data: fournisseurDataLoaded },
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
        createFournisseur(values, {
          onSuccess: () => {
            successMessageAlert('Fournisseur ajoutée avec succès');
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
        });
      }
    },
  });
  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='firstName'>Nom</Label>
            <Input
              name='firstName'
              placeholder='Entrez un nom...'
              type='text'
              className='form-control'
              id='firstName'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.firstName || ''}
              invalid={
                validation.touched.firstName && validation.errors.firstName
                  ? true
                  : false
              }
            />
            {validation.touched.firstName && validation.errors.firstName ? (
              <FormFeedback type='invalid'>
                {validation.errors.firstName}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='lastName'>Prénom</Label>
            <Input
              name='lastName'
              placeholder='Entrez un prénom...'
              type='text'
              className='form-control'
              id='lastName'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.lastName || ''}
              invalid={
                validation.touched.lastName && validation.errors.lastName
                  ? true
                  : false
              }
            />
            {validation.touched.lastName && validation.errors.lastName ? (
              <FormFeedback type='invalid'>
                {validation.errors.lastName}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='gender'>Genre</Label>

            <Input
              name='gender'
              placeholder='Sélectionner le Genre...'
              type='select'
              className='form-control'
              id='gender'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.gender || ''}
              invalid={
                validation.touched.gender && validation.errors.gender
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner le genre</option>
              <option value='Masculin'>Masculin</option>
              <option value='Féminin'>Féminin</option>
            </Input>
            {validation.touched.gender && validation.errors.gender ? (
              <FormFeedback type='invalid'>
                {validation.errors.gender}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='adresse'>Adresse Domicile</Label>
            <Input
              name='adresse'
              placeholder='Kabala...'
              type='text'
              className='form-control'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.adresse || ''}
              invalid={
                validation.touched.adresse && validation.errors.adresse
                  ? true
                  : false
              }
            />
            {validation.touched.adresse && validation.errors.adresse ? (
              <FormFeedback type='invalid'>
                {validation.errors.adresse}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='emailAdresse'>Adresse Email</Label>

            <Input
              name='emailAdresse'
              type='mail'
              placeholder='fournisseur@gmail.com'
              className='form-control'
              id='emailAdresse'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.emailAdresse || ''}
              invalid={
                validation.touched.emailAdresse &&
                validation.errors.emailAdresse
                  ? true
                  : false
              }
            />

            {validation.touched.emailAdresse &&
            validation.errors.emailAdresse ? (
              <FormFeedback type='invalid'>
                {validation.errors.emailAdresse}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='phoneNumber'>Téléphone</Label>
            <Input
              name='phoneNumber'
              placeholder='70 00 00 00'
              type='number'
              className='form-control'
              id='phoneNumber'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.phoneNumber || ''}
              invalid={
                validation.touched.phoneNumber && validation.errors.phoneNumber
                  ? true
                  : false
              }
            />
            {validation.touched.phoneNumber && validation.errors.phoneNumber ? (
              <FormFeedback type='invalid'>
                {validation.errors.phoneNumber}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='marchandise'>Marchandise</Label>
            <Input
              name='marchandise'
              type='text'
              placeholder='médicament; matériels...'
              className='form-control'
              id='marchandise'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.marchandise || ''}
              invalid={
                validation.touched.marchandise && validation.errors.marchandise
                  ? true
                  : false
              }
            />

            {validation.touched.marchandise && validation.errors.marchandise ? (
              <FormFeedback type='invalid'>
                {validation.errors.marchandise}
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

export default FournisseurForm;
