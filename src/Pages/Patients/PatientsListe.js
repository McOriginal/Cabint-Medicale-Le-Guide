import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import { useAllPatients, useDeletePatient } from '../../Api/queriesPatient';
import PatientForm from './PatientForm';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { connectedUserRole } from '../Authentication/userInfos';

export default function PatientsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: patientListe, isLoading, error } = useAllPatients();
  const { mutate: deletePatient, isLoading: isDeleting } = useDeletePatient();
  const [patientToUpdate, setpatientToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Patient');

  // Barre de recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour filtrer les patients en fonction du terme de recherche
  const filteredPatients = patientListe?.filter((patient) => {
    const search = searchTerm.toLowerCase();
    return (
      `${patient?.firstName || ''} ${patient?.lastName || ''}`
        .toLowerCase()
        .includes(search) ||
      (patient?.groupeSanguin || '').toLowerCase().includes(search) ||
      (patient?.adresse || '').toLowerCase().includes(search) ||
      (patient?.phoneNumber || '').toString().includes(search) ||
      (patient?.profession || '').toLowerCase().includes(search) ||
      (patient?.ethnie || '').toLowerCase().includes(search)
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Patients' breadcrumbItem='Lists des patients' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <PatientForm
                patientToEdit={patientToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='patientList'>
                    <Row className='g-4 mb-3 d-flex justify-content-between align-items-center'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-procedures align-center me-1'></i>{' '}
                            Nouveau Patient
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Total Patients:</h5>
                          <span className='badge bg-info'>
                            {formatPrice(patientListe?.length) || 0}
                          </span>
                        </div>
                      </Col>
                      <Col className='col-sm'>
                        <div className='d-flex justify-content-sm-end gap-3'>
                          {searchTerm !== '' && (
                            <Button
                              color='warning'
                              onClick={() => setSearchTerm('')}
                            >
                              {' '}
                              <i className='fas fa-window-close'></i>{' '}
                            </Button>
                          )}
                          <div className='search-box me-4 border border-dark rounded'>
                            <input
                              type='text'
                              className='form-control search'
                              placeholder='Rechercher...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {!error &&
                        !isLoading &&
                        filteredPatients?.length === 0 && (
                          <div className='text-center text-mutate'>
                            Aucun patient pour le moment !
                          </div>
                        )}
                      {!error && !isLoading && filteredPatients?.length > 0 && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='patientTable'
                        >
                          <thead className='table-light'>
                            <tr className='text-center'>
                              <th scope='col' style={{ width: '50px' }}>
                                ID
                              </th>
                              <th data-sort='patient_name'>Nom</th>
                              <th data-sort='email'>Prénom</th>
                              <th data-sort='groupeSanguin'>Groupe Sanguin</th>
                              <th data-sort='age'>Age</th>

                              <th data-sort='adresse'>Domicile</th>
                              <th data-sort='phone'>Téléphone</th>
                              <th data-sort='profession'>Profession</th>
                              <th data-sort='ethni'>Ethnie</th>
                              <th data-sort='action'>Action</th>
                            </tr>
                          </thead>
                          <tbody className='list form-check-all text-center'>
                            {filteredPatients?.length > 0 &&
                              filteredPatients?.map((patient, index) => (
                                <tr key={patient?._id} className='text-center'>
                                  <th scope='row'>{index + 1}</th>

                                  <td>
                                    {capitalizeWords(patient?.firstName)}{' '}
                                  </td>
                                  <td>{capitalizeWords(patient?.lastName)} </td>
                                  <td className='badge bg-warning text-light'>
                                    {capitalizeWords(patient?.groupeSanguin)}{' '}
                                  </td>

                                  <td>
                                    {patient?.age
                                      ? capitalizeWords(patient?.age)
                                      : '----'}
                                  </td>

                                  <td>
                                    {patient?.adresse
                                      ? capitalizeWords(patient?.adresse)
                                      : '------'}{' '}
                                  </td>
                                  <td>
                                    {patient?.phoneNumber
                                      ? formatPhoneNumber(patient?.phoneNumber)
                                      : '------'}
                                  </td>
                                  <td>
                                    {patient?.profession
                                      ? capitalizeWords(patient?.profession)
                                      : '------'}
                                  </td>
                                  <td>
                                    {patient?.ethnie
                                      ? capitalizeWords(patient?.ethnie)
                                      : '------'}
                                  </td>

                                  <td>
                                    {isDeleting && <LoadingSpiner />}
                                    {!isDeleting &&
                                      connectedUserRole === 'admin' && (
                                        <div className='d-flex gap-2'>
                                          <div>
                                            <button
                                              className='btn btn-sm btn-success edit-item-btn'
                                              data-bs-toggle='modal'
                                              data-bs-target='#showModal'
                                              onClick={() => {
                                                setFormModalTitle(
                                                  'Modifier les données'
                                                );
                                                setpatientToUpdate(patient);
                                                tog_form_modal();
                                              }}
                                            >
                                              <i className='ri-pencil-fill text-white'></i>
                                            </button>
                                          </div>

                                          <div className='remove'>
                                            <button
                                              className='btn btn-sm btn-danger remove-item-btn'
                                              data-bs-toggle='modal'
                                              data-bs-target='#deleteRecordModal'
                                              onClick={() => {
                                                deleteButton(
                                                  patient?._id,
                                                  patient?.firstName +
                                                    ' ' +
                                                    patient?.lastName,
                                                  deletePatient
                                                );
                                              }}
                                            >
                                              <i className='ri-delete-bin-fill text-white'></i>
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
