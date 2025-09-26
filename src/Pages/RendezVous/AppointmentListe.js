import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import AppointmentForm from './AppointmentForm';
import {
  useAllAppointment,
  useDeleteAppointment,
} from '../../Api/queriesAppointments';

export default function AppointmentListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: appointmentData, isLoading, error } = useAllAppointment();
  const { mutate: deleteAppointment, isLoading: isDeleting } =
    useDeleteAppointment();
  const [appointmentToUpdate, setAppointmentToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Fixer un rendez-vous');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de recherche
  const filterSearchAppointement = appointmentData?.filter((appoint) => {
    const search = searchTerm.toLowerCase();

    return (
      `${appoint?.traitement?.patient?.firstName} ${appoint?.traitement?.patient?.lastName}`
        .toLowerCase()
        .includes(search) ||
      appoint?.traitement?.motif?.toLowerCase().includes(search) ||
      (appoint?.appointmentDate &&
        new Date(appoint?.appointmentDate)
          .toLocaleDateString('fr-FR')
          .includes(search)) ||
      (appoint?.traitement?.patient?.adresse || '')
        .toLowerCase()
        .includes(search) ||
      (appoint?.traitement?.patient?.phoneNumber || '')
        .toString()
        .includes(search)
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Rendez-vous'
            breadcrumbItem='Lists des rendez-vous'
          />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <AppointmentForm
                appointmentToEdit={appointmentToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='appointmentList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setAppointmentToUpdate(null);
                              setFormModalTitle('Fixer un rendez-vous');
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-clock align-center me-1'></i>{' '}
                            Fixer un rendez-vous
                          </Button>
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
                          <div className='search-box ms-2'>
                            <input
                              type='text'
                              className='form-control search border border-dark rounded-3'
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
                      {filterSearchAppointement?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun Rendez-vous trouvée !
                        </div>
                      )}
                      {!error &&
                        !isLoading &&
                        filterSearchAppointement?.length > 0 && (
                          <table
                            className='table align-middle table-nowrap table-hover'
                            id='appointmentTable'
                          >
                            <thead className='table-light'>
                              <tr>
                                <th data-sort='appointmentDate'>
                                  Date de rendez-vous
                                </th>
                                <th data-sort='traitement'>Traitement</th>
                                <th data-sort='firstName'>Patient</th>

                                <th data-sort='date'>Age</th>

                                <th data-sort='adresse'>Domicile</th>
                                <th data-sort='phone'>Téléphone</th>
                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>
                            <tbody className='list form-check-all text-center'>
                              {filterSearchAppointement?.length > 0 &&
                                filterSearchAppointement?.map((appoint) => (
                                  <tr key={appoint?._id}>
                                    <th>
                                      {new Date(
                                        appoint?.appointmentDate
                                      ).toLocaleDateString('fr-Fr', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        weekday: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}{' '}
                                    </th>

                                    <td>
                                      {capitalizeWords(
                                        appoint?.traitement?.motif
                                      )}
                                    </td>
                                    <td>
                                      {capitalizeWords(
                                        appoint?.traitement?.patient?.firstName
                                      )}{' '}
                                      {capitalizeWords(
                                        appoint?.traitement?.patient?.lastName
                                      )}{' '}
                                    </td>

                                    <td>{appoint?.traitement?.patient?.age}</td>

                                    <td>
                                      {capitalizeWords(
                                        appoint?.traitement?.patient?.adresse
                                      )}
                                    </td>
                                    <td>
                                      {formatPhoneNumber(
                                        appoint?.traitement?.patient
                                          ?.phoneNumber
                                      )}
                                    </td>

                                    <td>
                                      <div className='d-flex gap-2'>
                                        <div className='edit'>
                                          <button
                                            className='btn btn-sm btn-success edit-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#showModal'
                                            onClick={() => {
                                              setFormModalTitle(
                                                'Modifier les données'
                                              );
                                              setAppointmentToUpdate(appoint);
                                              tog_form_modal();
                                            }}
                                          >
                                            <i className='ri-pencil-fill text-white'></i>
                                          </button>
                                        </div>
                                        {isDeleting && <LoadingSpiner />}
                                        {!isDeleting && (
                                          <div className='remove'>
                                            <button
                                              className='btn btn-sm btn-danger remove-item-btn'
                                              data-bs-toggle='modal'
                                              data-bs-target='#deleteRecordModal'
                                              onClick={() => {
                                                deleteButton(
                                                  appoint?._id,
                                                  appoint?.traitement?.patient
                                                    ?.firstName +
                                                    ' ' +
                                                    appoint?.traitement?.patient
                                                      ?.lastName,
                                                  deleteAppointment
                                                );
                                              }}
                                            >
                                              <i className='ri-delete-bin-fill text-white'></i>
                                            </button>
                                          </div>
                                        )}
                                      </div>
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
