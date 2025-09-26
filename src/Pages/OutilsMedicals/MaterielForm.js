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
  useCreateMateriel,
  useUpdateMateriel,
} from '../../Api/queriesMateriels';
import { Link } from 'react-router-dom';

const MaterielForm = ({ materielToEdit, tog_form_modal }) => {
  // Matériels Query pour créer la Chambres
  const { mutate: createMateriel } = useCreateMateriel();

  // Matériels Query pour Mettre à jour la Chambres
  const { mutate: updateMateriel } = useUpdateMateriel();
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: materielToEdit?.name || '',
      nombre: materielToEdit?.nombre || undefined,
      description: materielToEdit?.description || '',
      imageUrl: materielToEdit?.imageUrl || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),

      nombre: Yup.number().required('Ce champ est obligatoire'),
      description: Yup.string().matches(
        /^[a-z0-9À-ÿ\s]+$/i,
        'Veillez Entrez une valeur correct !'
      ),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      // Si la méthode est pour mise à jour alors
      const materielDataLoaded = {
        ...values,
      };

      if (materielToEdit) {
        updateMateriel(
          { id: materielToEdit._id, data: materielDataLoaded },
          {
            onSuccess: () => {
              successMessageAlert('Données mise à jour avec succès');
              setIsLoading(false);
              tog_form_modal();
            },
            onError: (err) => {
              errorMessageAlert(
                err?.response?.data?.message ||
                  err?.message ||
                  'Erreur lors de la mise à jour'
              );
              setIsLoading(false);
            },
          }
        );
      }

      // Sinon on créer un nouveau étudiant
      else {
        createMateriel(values, {
          onSuccess: () => {
            successMessageAlert('Matériels ajoutée avec succès');
            setIsLoading(false);
            resetForm();
            tog_form_modal();
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! une erreur est survenu lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setIsLoading(false);
          },
        });
      }
      if (isLoading) {
        setTimeout(() => {
          errorMessageAlert('Une Erreur est survenue veillez réesayer !');
          setIsLoading(false);
        }, 10000);
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
            <Label htmlFor='name'>Nom</Label>
            <Input
              name='name'
              placeholder="Chambre d'opération; Chambre de Serum..."
              type='text'
              className='form-control'
              id='name'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name || ''}
              invalid={
                validation.touched.name && validation.errors.name ? true : false
              }
            />
            {validation.touched.name && validation.errors.name ? (
              <FormFeedback type='invalid'>
                {validation.errors.name}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='nombre'>Nombre</Label>
            <Input
              name='nombre'
              placeholder='10; 4; 0'
              type='number'
              className='form-control'
              id='nombre'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.nombre || ''}
              invalid={
                validation.touched.nombre && validation.errors.nombre
                  ? true
                  : false
              }
            />
            {validation.touched.nombre && validation.errors.nombre ? (
              <FormFeedback type='invalid'>
                {validation.errors.nombre}
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
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='imageUrl'>imageUrl</Label>
            <Input
              name='imageUrl'
              placeholder='Veillez copiez une image en ligne.....'
              type='text'
              className='form-control'
              id='imageUrl'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.imageUrl || ''}
              invalid={
                validation.touched.imageUrl && validation.errors.imageUrl
                  ? true
                  : false
              }
            />
            <Link
              to={`https://www.google.com/search?sca_esv=36ac96dba69ebed1&sxsrf=AE3TifPFX9Ag6g7OHGRvbMuvmwEvx86_AA:1748385419157&q=${
                validation.values.name || 'outils medicals'
              }&udm=2&fbs=AIIjpHx4nJjfGojPVHhEACUHPiMQ_pbg5bWizQs3A_kIenjtcpTTqBUdyVgzq0c3_k8z34GAwf0jHaPgz38H1UrFi4JZ_wsbaZy5bcislJwEjK9aKAAgw7EDHBpnhJERxbAHVFJEPpsPJRN2Lf5NIxh4Y6E23jLfuJM1k2vNHWwZgjeinct1k1SwMNRPIUfhAwFDaWeIbf0gNPayotFQo8sw3bnjAaBRZQ&sa=X&ved=2ahUKEwj6otue28SNAxWJKvsDHURDCkcQtKgLegQIFRAB&biw=1280&bih=585&dpr=1.5`}
              target='blank'
              style={{
                color: 'blue',
                textAlign: 'center',
                display: 'block',
              }}
            >
              cliquer ici pour copier une image en ligne
            </Link>
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

export default MaterielForm;
