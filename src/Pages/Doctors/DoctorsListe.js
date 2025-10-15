import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import DoctorForm from './DoctorForm';
import { useAllDoctors, useDeleteDoctor } from '../../Api/queriesDoctors';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';

export default function DoctorsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: doctorsData, isLoading, error } = useAllDoctors();
  const { mutate: deleteDoctor, isDeleting } = useDeleteDoctor();
  const [doctorToUpdate, setDoctorToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Médecin');

  // State de Rechcher
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de recherche
  const filterSearchData = doctorsData?.filter((doctor) => {
    const search = searchTerm.toLowerCase();
    return (
      `${doctor?.firstName || ''} ${doctor?.lastName || ''}`
        .toLowerCase()
        .includes(search) ||
      (doctor?.emailAdresse || '').toLowerCase().includes(search) ||
      doctor?.speciality.toLowerCase().includes(search) ||
      (doctor?.phoneNumber || '').toString().includes(search) ||
      (doctor?.guardDays || '').toLowerCase().includes(search)
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Médecins' breadcrumbItem='List des médecins' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <DoctorForm
                doctorToEdit={doctorToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='doctorsList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setDoctorToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-user-md align-center me-1'></i>{' '}
                            Ajouter un Médecin
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
                              className='form-control search border border-dark rounded'
                              placeholder='Recherche...'
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

                    {filterSearchData?.length === 0 && (
                      <div className='text-center text-mutate'>
                        Aucun médecin trouvée !
                      </div>
                    )}

                    {filterSearchData?.length > 0 && (
                      <div className='table-responsive table-card mt-3 mb-1'>
                        {!error && !isLoading && (
                          <table
                            className='table align-middle table-nowrap table-hover'
                            id='customerTable'
                          >
                            <thead className='table-light'>
                              <tr className='text-center'>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Genre</th>
                                <th>J-Services</th>
                                <th>Spécialité</th>
                                <th>Adresse Email</th>

                                <th>Domicile</th>
                                <th>Téléphone</th>
                                <th>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all text-center'>
                              {filterSearchData?.length > 0 &&
                                filterSearchData?.map((doctor) => (
                                  <tr key={doctor?._id} className='text-center'>
                                    <td>
                                      {capitalizeWords(doctor?.firstName)}{' '}
                                    </td>
                                    <td>
                                      {capitalizeWords(doctor?.lastName)}{' '}
                                    </td>
                                    <td>{capitalizeWords(doctor?.gender)} </td>
                                    <td>
                                      {doctor?.guardDays
                                        ? capitalizeWords(doctor?.guardDays)
                                        : '----'}{' '}
                                    </td>
                                    <td>
                                      {capitalizeWords(doctor?.speciality)}{' '}
                                    </td>
                                    <td>{doctor?.emailAdresse || '-----'} </td>

                                    <td>{capitalizeWords(doctor?.adresse)} </td>
                                    <td>
                                      {formatPhoneNumber(doctor?.phoneNumber)}
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
                                              setDoctorToUpdate(doctor);
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
                                                  doctor?._id,
                                                  doctor?.firstName +
                                                    ' ' +
                                                    doctor?.lastName,
                                                  deleteDoctor
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
                    )}
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
