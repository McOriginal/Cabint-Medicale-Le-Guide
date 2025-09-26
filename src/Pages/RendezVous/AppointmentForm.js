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
  useCreateAppointment,
  useUpdateAppointment,
} from '../../Api/queriesAppointments';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllDoctors } from '../../Api/queriesDoctors';
import { capitalizeWords } from '../components/capitalizeFunction';

const AppointmentForm = ({ appointmentToEdit, tog_form_modal }) => {
  // Patient Query pour créer un etudiant
  const { mutate: createAppointment } = useCreateAppointment();
  // Patient Query pour Mettre à jour un etudiant
  const { mutate: updateAppointment } = useUpdateAppointment();

  // Traitement Query pour récupérer les traitements
  // Si on a besoin de la liste des traitements pour le formulaire
  const {
    data: traitmentData,
    isLoading: isTraitmentLoading,
    error,
  } = useAllTraitement();

  // Doctor Query pour récupérer les médecins
  // Si on a besoin de la liste des médecins pour le formulaire
  const {
    data: doctorData,
    isLoading: isDoctorLoading,
    error: dortorError,
  } = useAllDoctors();

  // State pour gérer le chargement du formulaire
  const [isLoading, setisLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      traitement: appointmentToEdit?.traitement._id || '',
      doctor: appointmentToEdit?.doctor._id || '',
      appointmentDate: appointmentToEdit?.appointmentDate?.slice(0, 16) || '',
      reasonForVisit: appointmentToEdit?.reasonForVisit || '',
    },
    validationSchema: Yup.object({
      traitement: Yup.string().required('Ce champ est obligatoire'),

      doctor: Yup.string().required('Ce champ Prénom est obligatoire'),
      appointmentDate: Yup.date().required('Ce champ est obligatoire'),
      reasonForVisit: Yup.string()
        .matches(/^[a-z0-9À-ÿ\s]+$/i, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setisLoading(true);

      // Si la méthode est pour mise à jour alors
      const traitementDataLoaded = {
        ...values,
      };

      if (appointmentToEdit) {
        updateAppointment(
          { id: appointmentToEdit._id, data: traitementDataLoaded },
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
        createAppointment(values, {
          onSuccess: () => {
            successMessageAlert('Rendez-vous enregistrée avec succès');
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
            <Label htmlFor='traitement'>Traitement pour le rendez-vous</Label>
            {isTraitmentLoading && <LoadingSpiner />}
            {!isTraitmentLoading && (
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
                <option value=''>Sélectionner un traitement</option>
                {!error &&
                  traitmentData &&
                  traitmentData.map((traite) => (
                    <option key={traite._id} value={traite._id}>
                      {capitalizeWords(traite.motif)} {' | '}
                      {capitalizeWords(traite.patient['firstName'])}{' '}
                      {capitalizeWords(traite.patient['lastName'])}
                    </option>
                  ))}
              </Input>
            )}
            {validation.touched.traitement && validation.errors.traitement ? (
              <FormFeedback type='invalid'>
                {validation.errors.traitement}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='doctor'>Médecin</Label>
            {isDoctorLoading && <LoadingSpiner />}
            {!isDoctorLoading && (
              <Input
                name='doctor'
                type='select'
                className='form-control'
                id='doctor'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.doctor || ''}
                invalid={
                  validation.touched.doctor && validation.errors.doctor
                    ? true
                    : false
                }
              >
                <option value=''>Sélectionner un médecin</option>
                {!dortorError &&
                  doctorData &&
                  doctorData.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {capitalizeWords(doctor.firstName)}{' '}
                      {capitalizeWords(doctor.lastName)}
                    </option>
                  ))}
              </Input>
            )}
            {validation.touched.doctor && validation.errors.doctor ? (
              <FormFeedback type='invalid'>
                {validation.errors.doctor}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='appointmentDate'>
              Date et Heure de Rendez-vous
            </Label>
            <Input
              name='appointmentDate'
              type='datetime-local'
              className='form-control'
              id='appointmentDate'
              min={new Date().toISOString().slice(0, 10) + 'T00:00'}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.appointmentDate || ''}
              invalid={
                validation.touched.appointmentDate &&
                validation.errors.appointmentDate
                  ? true
                  : false
              }
            />
            {validation.touched.appointmentDate &&
            validation.errors.appointmentDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.appointmentDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='reasonForVisit'>Motif de Rendez-vous</Label>
            <Input
              name='reasonForVisit'
              placeholder='le rendez-vous est fixé pour quel raison ?.....'
              type='textarea'
              className='form-control form-control-lg'
              id='reasonForVisit'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.reasonForVisit || ''}
              invalid={
                validation.touched.reasonForVisit &&
                validation.errors.reasonForVisit
                  ? true
                  : false
              }
            />
            {validation.touched.reasonForVisit &&
            validation.errors.reasonForVisit ? (
              <FormFeedback type='invalid'>
                {validation.errors.reasonForVisit}
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

export default AppointmentForm;
