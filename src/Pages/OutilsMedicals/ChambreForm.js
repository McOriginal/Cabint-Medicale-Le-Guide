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
import { useCreateChambre, useUpdateChambre } from '../../Api/queriesChambre';

const ChambreForm = ({ chambreToEdit, tog_form_modal }) => {
  // Chambre Query pour créer la Chambres
  const { mutate: createChambre } = useCreateChambre();

  // Chambre Query pour Mettre à jour la Chambres
  const { mutate: updateChambre } = useUpdateChambre();
  const [isLoading, setisLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: chambreToEdit?.title || '',
      bedNumber: chambreToEdit?.bedNumber || undefined,
      description: chambreToEdit?.description || '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),

      bedNumber: Yup.number().required('Ce champ est obligatoire'),
      description: Yup.string()
        .matches(/^[a-z0-9À-ÿ\s]+$/i, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setisLoading(true);

      // Si la méthode est pour mise à jour alors
      const chambreDataLoaded = {
        ...values,
      };

      if (chambreToEdit) {
        updateChambre(
          { id: chambreToEdit._id, data: chambreDataLoaded },
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
        createChambre(values, {
          onSuccess: () => {
            successMessageAlert('Chambre ajoutée avec succès');
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
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='title'>Nom du Chambre</Label>
            <Input
              name='title'
              placeholder="Chambre d'opération; Chambre de Serum..."
              type='text'
              className='form-control'
              id='title'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.title || ''}
              invalid={
                validation.touched.title && validation.errors.title
                  ? true
                  : false
              }
            />
            {validation.touched.title && validation.errors.title ? (
              <FormFeedback type='invalid'>
                {validation.errors.title}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='bedNumber'>Nombre de Lits</Label>
            <Input
              name='bedNumber'
              placeholder='10; 4; 0'
              type='number'
              className='form-control'
              id='bedNumber'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.bedNumber || ''}
              invalid={
                validation.touched.bedNumber && validation.errors.bedNumber
                  ? true
                  : false
              }
            />
            {validation.touched.bedNumber && validation.errors.bedNumber ? (
              <FormFeedback type='invalid'>
                {validation.errors.bedNumber}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='description'>description</Label>
            <Input
              name='description'
              placeholder='Chambre dédié pour les opérations chirugical.....'
              type='textaria'
              className='form-control'
              id='description'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.description || ''}
              invalid={
                validation.touched.description && validation.errors.description
                  ? true
                  : false
              }
            />
            {validation.touched.description && validation.errors.description ? (
              <FormFeedback type='invalid'>
                {validation.errors.description}
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

export default ChambreForm;
