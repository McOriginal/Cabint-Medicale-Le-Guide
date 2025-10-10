import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  NavItem,
  TabContent,
  TabPane,
  FormGroup,
  Label,
  Input,
  Form,
  FormFeedback,
} from 'reactstrap';

import classnames from 'classnames';
import { Link, NavLink } from 'react-router-dom';
import {
  useCreateTraitement,
  useUpdateTraitement,
} from '../../Api/queriesTraitement';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import { useAllPatients } from '../../Api/queriesPatient';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords } from '../components/capitalizeFunction';
import { useAllDoctors } from '../../Api/queriesDoctors';

const TraitementForm = ({ traitementToEdit, tog_form_modal }) => {
  // Traitement Query pour créer un etudiant
  const { mutate: createTraitement } = useCreateTraitement();

  // Traitement Query pour Mettre à jour un etudiant
  const { mutate: updateTraitement } = useUpdateTraitement();

  const {
    data: patientData,
    isLoading: patientLoading,
    error: patientError,
  } = useAllPatients();

  const [isLoading, setisLoading] = useState(false);

  const [activeTab, setactiveTab] = useState(1);

  const [passedSteps, setPassedSteps] = useState([1]);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      patient: traitementToEdit?.patient._id || '',
      motif: traitementToEdit?.motif || '',
      startDate:
        traitementToEdit?.startDate.substring(0, 10) ||
        new Date().toISOString().substring(0, 10),
      startTime: traitementToEdit?.startTime || '',
      height: traitementToEdit?.height || '',
      width: traitementToEdit?.width || '',
      nc: traitementToEdit?.nc || '',
      ac: traitementToEdit?.ac || '',
      asc: traitementToEdit?.asc || '',
      diagnostic: traitementToEdit?.diagnostic || '',
      result: traitementToEdit?.result || '',
      totalAmount: traitementToEdit?.totalAmount || '',
      observation: traitementToEdit?.observation || '',
      doctor: traitementToEdit?.doctor || '',
    },
    validationSchema: Yup.object({
      patient: Yup.string().required(
        'Vous devez entrez une valeur dans de champ'
      ),
      motif: Yup.string().typeError('Le motif doit être un texte'),
      startDate: Yup.date().required(
        'Vous devez entrez une valeur dans de champ'
      ),
      startTime: Yup.string().required(
        'Vous devez entrez une valeur dans de champ'
      ),
      doctor: Yup.string().required(
        'Vous devez entrez une valeur dans de champ'
      ),
      height: Yup.number().typeError('La taille doit être un nombre'),
      width: Yup.number().typeError('Le poids doit être un nombre'),
      nc: Yup.string().typeError('Le NC doit être un texte'),
      ac: Yup.string().typeError('L’AC doit être un texte'),
      asc: Yup.string().typeError('L’ASC doit être un texte'),
      diagnostic: Yup.string().typeError('Le diagnostic doit être un texte'),
      result: Yup.string().typeError('Le résultat doit être un texte'),
      observation: Yup.string().typeError('L’observation doit être un texte'),
      totalAmount: Yup.number().required('Le montant total est obligatoire'),
      // Le reste est optionnel
    }),

    onSubmit: (values, { resetForm }) => {
      // Convertir startTime HH:mm → Date

      setisLoading(true);
      // Si la méthode est pour mise à jour alors
      const patientDataLoaded = {
        ...values,
      };

      if (traitementToEdit) {
        updateTraitement(
          { id: traitementToEdit._id, data: patientDataLoaded },
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
        createTraitement(values, {
          onSuccess: () => {
            successMessageAlert('Traitement Enregistrée avec succès');
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
      <div id='basic-pills-wizard' className='twitter-bs-wizard'>
        <ul className='twitter-bs-wizard-nav nav nav-pills nav-justified'>
          <NavItem
            className={classnames('nav-link', { active: activeTab === 1 })}
          >
            <NavLink
              data-toggle='tab'
              className={classnames({ active: activeTab === 1 })}
              onClick={() => {
                setactiveTab(1);
              }}
            >
              <span className='step-number'>01</span>
              <span className='step-title' style={{ paddingLeft: '10px' }}>
                Informations Général
              </span>
            </NavLink>
          </NavItem>
          <NavItem
            className={classnames('nav-link', { active: activeTab === 2 })}
          >
            <NavLink
              data-toggle='tab'
              className={classnames({ active: activeTab === 2 })}
              onClick={() => {
                setactiveTab(2);
              }}
            >
              <span className='step-number'>02</span>
              <span className='step-title' style={{ paddingLeft: '10px' }}>
                Données Démographique
              </span>
            </NavLink>
          </NavItem>

          <NavItem
            className={classnames('nav-link', { active: activeTab === 3 })}
          >
            <NavLink
              data-toggle='tab'
              className={classnames({ active: activeTab === 3 })}
              onClick={() => {
                setactiveTab(3);
              }}
            >
              <span className='step-number'>03</span>
              <span className='step-title' style={{ paddingLeft: '10px' }}>
                Resultat
              </span>
            </NavLink>
          </NavItem>
          <NavItem
            className={classnames('nav-link', { active: activeTab === 4 })}
          >
            <NavLink
              data-toggle='tab'
              className={classnames({ active: activeTab === 4 })}
              onClick={() => {
                setactiveTab(4);
              }}
            >
              <span className='step-number'>04</span>
              <span className='step-title' style={{ paddingLeft: '10px' }}>
                Montant du Traitement
              </span>
            </NavLink>
          </NavItem>
        </ul>

        {/* --------------------------- */}

        <TabContent
          activeTab={activeTab}
          className='twitter-bs-wizard-tab-content'
        >
          <TabPane tabId={1}>
            <FormGroup>
              <Label htmlFor='patient'>Patient</Label>
              <Input
                type='select'
                name='patient'
                id='patient'
                className='border border-secondary form-control'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.patient || ''}
                invalid={
                  validation.touched.patient && validation.errors.patient
                    ? true
                    : false
                }
              >
                {patientLoading && <LoadingSpiner />}
                {patientError && (
                  <div className='fw-bold text-danger text-center'></div>
                )}
                <option value=''>Sélectionner un patient</option>
                {!patientError &&
                  !patientLoading &&
                  patientData?.length > 0 &&
                  patientData.map((p) => (
                    <option key={p._id} value={p._id}>
                      {capitalizeWords(p?.firstName)} {' - '}
                      {capitalizeWords(p?.lastName)} {' - '}{' '}
                      {capitalizeWords(p?.age)}
                    </option>
                  ))}
              </Input>
              {validation.touched.patient && validation.errors.patient ? (
                <FormFeedback type='invalid'>
                  {validation.errors.patient}
                </FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label htmlFor='motif'>Motif</Label>
              <Input
                type='text'
                name='motif'
                id='motif'
                className='border border-secondary form-control'
                placeholder='Entrez le motif de Traitement'
                value={validation.values.motif || ''}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={validation.touched.motif && !!validation.errors.motif}
              />
              {validation.touched.motif && validation.errors.motif ? (
                <FormFeedback type='invalid'>
                  {validation.errors.motif}
                </FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label htmlFor='startDate'>Début Maladie</Label>
              <Input
                type='date'
                name='startDate'
                id='startDate'
                className='border border-secondary form-control'
                max={new Date().toISOString().substring(0, 10)} // Prevent future dates
                value={validation.values.startDate || ''}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={
                  validation.touched.startDate && !!validation.errors.startDate
                }
              />
              {validation.touched.startDate && validation.errors.startDate ? (
                <FormFeedback type='invalid'>
                  {validation.errors.startDate}
                </FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label htmlFor='startTime'>Période du début maladie</Label>
              <Input
                type='select'
                name='startTime'
                id='startTime'
                className='border border-secondary form-control'
                value={validation.values.startTime || ''}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={
                  validation.touched.startTime && !!validation.errors.startTime
                }
              >
                <option value=''>Sélectionner une période</option>
                <option value='matin'>Matin</option>
                <option value='soir'>Soir</option>
              </Input>
              {validation.touched.startTime && validation.errors.startTime ? (
                <FormFeedback type='invalid'>
                  {validation.errors.startTime}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </TabPane>
          <TabPane tabId={2}>
            <FormGroup>
              <Label htmlFor='height'>Taille (cm)</Label>
              <Input
                type='number'
                name='height'
                id='height'
                className='border border-secondary form-control'
                placeholder='Taille de Patient en cm'
                value={validation.values.height}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='width'>Poids (kg)</Label>
              <Input
                type='number'
                name='width'
                id='width'
                className='border border-secondary form-control'
                placeholder='Poids de Patient en kg'
                value={validation.values.width}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='nc'>NC</Label>
              <Input
                type='text'
                name='nc'
                id='nc'
                className='border border-secondary form-control'
                placeholder='Entrez NC'
                value={validation.values.nc}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='ac'>AC</Label>
              <Input
                type='text'
                name='ac'
                id='ac'
                className='border border-secondary form-control'
                placeholder='Entrez AC'
                value={validation.values.ac}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='asc'>ASC</Label>
              <Input
                type='text'
                name='asc'
                id='asc'
                className='border border-secondary form-control'
                placeholder='Entrez ASC'
                value={validation.values.asc}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
          </TabPane>
          <TabPane tabId={3}>
            <FormGroup>
              <Label htmlFor='diagnostic'>Diagnostic</Label>
              <Input
                type='textarea'
                name='diagnostic'
                id='diagnostic'
                className='border border-secondary form-control'
                placeholder='Resultat du Diagnostic'
                value={validation.values.diagnostic}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='result'>Résultat</Label>
              <Input
                type='textarea'
                name='result'
                id='result'
                className='border border-secondary form-control'
                placeholder='Resultat du Traitement global'
                value={validation.values.result}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='observation'>Observation</Label>
              <Input
                type='textarea'
                name='observation'
                id='observation'
                className='border border-secondary form-control'
                placeholder='Observation du Traitement'
                value={validation.values.observation}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='medecin'>Médecin</Label>
              <Input
                type='text'
                name='doctor'
                id='medecin'
                placeholder='Nom du Médecin / Docteur'
                className='border border-secondary form-control'
                value={validation.values.doctor}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />

              {validation.touched.doctor && validation.errors.doctor ? (
                <FormFeedback type='invalid'>
                  {validation.errors.doctor}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </TabPane>
          <TabPane tabId={4}>
            <FormGroup>
              <Label htmlFor='totalAmount'>
                Frais de Traitement / Consulation{' '}
              </Label>
              {/* <p className='text-mutate'>
                Uniquement la somme total de votre frais de traitement,{' '}
                <span className='text-info'>sans l'Ordonnances</span>{' '}
              </p> */}
              <Input
                type='number'
                name='totalAmount'
                id='totalAmount'
                className='border border-secondary from-control'
                placeholder='Frais de services (Traitement ou Consultation)'
                value={validation.values.totalAmount || ''}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
              {validation.touched.totalAmount &&
              validation.errors.totalAmount ? (
                <FormFeedback type='invalid'>
                  {validation.errors.totalAmount}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </TabPane>
        </TabContent>
        <ul className='pager wizard twitter-bs-wizard-pager-link'>
          <li
            className={
              activeTab === 1 ? 'previous disabled me-2' : 'previous me-2'
            }
          >
            <Link
              to='#'
              onClick={() => {
                toggleTab(activeTab - 1);
              }}
            >
              Précédent
            </Link>
          </li>

          <li className={activeTab === 4 ? 'next disabled' : 'next'}>
            {isLoading && <LoadingSpiner />}
            {!isLoading && activeTab === 4 && (
              <button className='btn btn-info' type='submit'>
                Enregisrer
              </button>
            )}
            {activeTab !== 4 && (
              <Link
                to='#'
                onClick={() => {
                  toggleTab(activeTab + 1);
                }}
              >
                Suivant
              </Link>
            )}
          </li>
        </ul>
      </div>
    </Form>
  );
};

export default TraitementForm;
