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
import { useCreatePatient, useUpdatePatient } from '../../Api/queriesPatient';
import { useNavigate } from 'react-router-dom';

const PatientForm = ({ patientToEdit, tog_form_modal }) => {
  // Patient Query pour créer un etudiant
  const { mutate: createPatient } = useCreatePatient();

  // Patient Query pour Mettre à jour un etudiant
  const { mutate: updatePatient } = useUpdatePatient();
  const [isLoading, setisLoading] = useState(false);

  // STATE de navigation
  const navigate = useNavigate();

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: patientToEdit?.firstName || '',
      lastName: patientToEdit?.lastName || '',
      age: patientToEdit?.age || '',
      gender: patientToEdit?.gender || '',
      phoneNumber: patientToEdit?.phoneNumber || undefined,
      adresse: patientToEdit?.adresse || '',
      groupeSanguin: patientToEdit?.groupeSanguin || '',
      ethnie: patientToEdit?.ethnie || '',
      profession: patientToEdit?.profession || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),

      lastName: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ Prénom est obligatoire'),
      gender: Yup.string().required('Ce champ est obligatoire'),
      age: Yup.string().required('Ce champ est obligatoire'),
      phoneNumber: Yup.number(),
      groupeSanguin: Yup.string().required('Ce champ est obligatoire'),
      ethnie: Yup.string(),
      profession: Yup.string().matches(
        /^[a-z0-9À-ÿ\s]+$/i,
        'Veillez Entrez une valeur correct !'
      ),
      adresse: Yup.string()
        .matches(/^[a-z0-9À-ÿ\s]+$/i, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setisLoading(true);

      // Si la méthode est pour mise à jour alors
      const patientDataLoaded = {
        ...values,
      };

      if (patientToEdit) {
        updatePatient(
          { id: patientToEdit._id, data: patientDataLoaded },
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
        createPatient(values, {
          onSuccess: () => {
            successMessageAlert('Patient ajoutée avec succès');
            setisLoading(false);
            resetForm();
            tog_form_modal();

            // Redirection vers la page de Traitement
            navigate('/traitements');
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
              className='border border-secondary form-control'
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
              className='border border-secondary form-control'
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
              className='border border-secondary form-control'
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
            <Label htmlFor='groupeSanguin'>Groupe Sanguin</Label>

            <Input
              name='groupeSanguin'
              type='select'
              className='border border-secondary form-control'
              id='groupeSanguin'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.groupeSanguin || ''}
              invalid={
                validation.touched.groupeSanguin &&
                validation.errors.groupeSanguin
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner le Groupe Sanguin</option>
              <option value='a+'>A+</option>
              <option value='a-'>A-</option>
              <option value='b+'>B+</option>
              <option value='b-'>B-</option>
              <option value='ab+'>AB+</option>
              <option value='ab-'>AB-</option>
              <option value='o+'>O+</option>
              <option value='o-'>O-</option>
              <option value='non définis'>Non Définis</option>
            </Input>
            {validation.touched.groupeSanguin &&
            validation.errors.groupeSanguin ? (
              <FormFeedback type='invalid'>
                {validation.errors.groupeSanguin}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='age'>Age</Label>
            <Input
              name='age'
              type='text'
              placeholder='Ex: 33ans ; 8 mois ; 6 semaines ; 2 jours...'
              className='border border-secondary form-control'
              id='age'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.age || ''}
              invalid={
                validation.touched.age && validation.errors.age ? true : false
              }
            />
            {validation.touched.age && validation.errors.age ? (
              <FormFeedback type='invalid'>
                {validation.errors.age}
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
              className='border border-secondary  form-control'
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
            <Label htmlFor='phoneNumber'>Téléphone</Label>
            <Input
              name='phoneNumber'
              placeholder='70 00 00 00'
              type='number'
              className='border border-secondary form-control'
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
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='ethnie'>Ethnie</Label>
            <Input
              type='select'
              name='ethnie'
              id='ethnie'
              className='border border-secondary form-control'
              value={
                validation.values.ethnie &&
                ![
                  'bambara',
                  'bobo',
                  'bozo',
                  'dogon',
                  'malinke',
                  'minianka',
                  'peul',
                  'samogo',
                  'senufo',
                  'songhai',
                  'soninke',
                  'tamasheq',
                  'touareg',
                ].includes(validation.values.ethnie)
                  ? 'autre'
                  : validation.values.ethnie
              }
              onChange={(e) => {
                const selected = e.target.value;
                if (selected === 'autre') {
                  // On vide ethnie pour que l’utilisateur saisisse manuellement
                  validation.setFieldValue('ethnie', '');
                } else {
                  validation.setFieldValue('ethnie', selected);
                }
              }}
              onBlur={validation.handleBlur}
              invalid={validation.touched.ethnie && !!validation.errors.ethnie}
            >
              <option value=''>Sélectionner un ethnie</option>
              <option value='bambara'>Bambara</option>
              <option value='bobo'>Bobo</option>
              <option value='bozo'>Bozo</option>
              <option value='dogon'>Dogon</option>
              <option value='malinke'>Malinke</option>
              <option value='minianka'>Minianka</option>
              <option value='peul'>Peul</option>
              <option value='samogo'>Samogo</option>
              <option value='senufo'>Senufo</option>
              <option value='songhai'>Songhai</option>
              <option value='soninke'>Soninke</option>
              <option value='tamasheq'>Tamasheq</option>
              <option value='touareg'>Touareg</option>
              <option value='autre'>Autre...</option>
            </Input>
            {validation.touched.ethnie && validation.errors.ethnie && (
              <FormFeedback>{validation.errors.ethnie}</FormFeedback>
            )}
          </FormGroup>

          {/* Champ texte uniquement si "autre" est sélectionné */}
          {![
            'bambara',
            'bobo',
            'bozo',
            'dogon',
            'malinke',
            'minianka',
            'peul',
            'samogo',
            'senufo',
            'songhai',
            'soninke',
            'tamasheq',
            'touareg',
          ].includes(validation.values.ethnie) && (
            <FormGroup className='mb-3'>
              <Label htmlFor='ethnieAutre'>Entrez une nouvelle ethnie</Label>
              <Input
                name='ethnie'
                type='text'
                id='ethnieAutre'
                className='border border-secondary  form-control'
                value={validation.values.ethnie}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={
                  validation.touched.ethnie && !!validation.errors.ethnie
                }
              />
              {validation.touched.ethnie && validation.errors.ethnie && (
                <FormFeedback>{validation.errors.ethnie}</FormFeedback>
              )}
            </FormGroup>
          )}
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='profession'>Profession</Label>
            <Input
              name='profession'
              placeholder='Elève; Maçon; Femme de Menage.....'
              type='text'
              className='border border-secondary form-control'
              id='profession'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.profession || ''}
              invalid={
                validation.touched.profession && validation.errors.profession
                  ? true
                  : false
              }
            />
            {validation.touched.profession && validation.errors.profession ? (
              <FormFeedback type='invalid'>
                {validation.errors.profession}
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

export default PatientForm;
