import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import {
  useAllApprovisonnement,
  useDeleteApprovisonnement,
} from '../../Api/queriesApprovisonnement';

export default function ApprovisonnementListe() {
  const {
    data: approvisonnementData,
    isLoading,
    error,
  } = useAllApprovisonnement();
  const { mutate: deleteApprovisonnement, isDeleting } =
    useDeleteApprovisonnement();

  // Recherche State
  const [searchTerm, setSearchTerm] = useState('');

  // Fontion pour Rechercher
  const filterSearchApprovisonnement = approvisonnementData?.filter((appro) => {
    const search = searchTerm.toLowerCase();

    return (
      `${appro?.fournisseur?.firstName} ${appro?.fournisseur?.firstName}`
        .toLowerCase()
        .includes(search) ||
      (appro?.fournisseur?.phoneNumber || '').toString().includes(search) ||
      appro?.medicament?.name.toString().toLowerCase().includes(search) ||
      appro?.price.toString().includes(search) ||
      appro?.quantity.toString().includes(search) ||
      new Date(appro?.deliveryDate).toLocaleDateString('fr-Fr').includes(search)
    );
  });

  // Somme Total Approvisonnement
  const sumTotalApprovisonnement = approvisonnementData?.reduce(
    (total, appro) => total + appro?.price,
    0
  );

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Pharmacie' breadcrumbItem='Approvisonnement' />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='approvisonnementList'>
                    <div className='d-flex justify-content-between align-items-center gap-3'>
                      <div className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Nombre Total:</h5>
                          <span className='badge bg-info'>
                            {formatPrice(approvisonnementData?.length) || 0}
                          </span>
                        </div>
                      </div>
                      <div className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Total Dépensés:</h5>
                          <span className='badge bg-warning'>
                            {formatPrice(sumTotalApprovisonnement) || 0} F
                          </span>
                        </div>
                      </div>
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
                        <div className='search-box me-4'>
                          <input
                            type='text'
                            className='form-control search border border-dark rounded'
                            placeholder='Rechercher...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {!filterSearchApprovisonnement?.length &&
                        !isLoading &&
                        !error && (
                          <div className='text-center text-mutate'>
                            Aucune approvisonnement pour le moment !
                          </div>
                        )}
                      {!error &&
                        filterSearchApprovisonnement?.length > 0 &&
                        !isLoading && (
                          <table
                            className='table align-middle table-nowrap table-hover'
                            id='fournisseurTable'
                          >
                            <thead className='table-light'>
                              <tr>
                                <th scope='col' style={{ width: '50px' }}>
                                  ID
                                </th>
                                <th data-sort='marchandise'>Médicaments</th>
                                <th data-sort='marchandise'>
                                  Quantité arrivée
                                </th>
                                <th data-sort='price'>Prix Unitaire</th>
                                <th data-sort='deliveryDate'>Date d'arrivée</th>
                                <th data-sort='fournisseur_name'>
                                  Fournisseur
                                </th>

                                <th data-sort='phone'>Téléphone</th>

                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all text-center'>
                              {filterSearchApprovisonnement?.map(
                                (appro, index) => (
                                  <tr key={appro._id}>
                                    <th scope='row'>{index + 1}</th>
                                    <td>
                                      {capitalizeWords(appro?.medicament?.name)}
                                    </td>

                                    <td>{formatPrice(appro?.quantity)}</td>
                                    <td>
                                      {formatPrice(appro?.price)}
                                      {' F '}
                                    </td>

                                    <td>
                                      {new Date(
                                        appro?.deliveryDate
                                      ).toLocaleDateString('fr-Fr', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        weekday: 'short',
                                      })}
                                    </td>
                                    <td>
                                      {capitalizeWords(
                                        appro?.fournisseur?.firstName
                                      )}{' '}
                                      {capitalizeWords(
                                        appro.fournisseur?.lastName
                                      )}{' '}
                                    </td>

                                    <td>
                                      {formatPhoneNumber(
                                        appro?.fournisseur?.phoneNumber
                                      )}
                                    </td>

                                    <td>
                                      <div className='d-flex gap-2'>
                                        {isDeleting && <LoadingSpiner />}
                                        {!isDeleting && (
                                          <div className='remove'>
                                            <button
                                              className='btn btn-sm btn-danger remove-item-btn'
                                              data-bs-toggle='modal'
                                              data-bs-target='#deleteRecordModal'
                                              onClick={() => {
                                                deleteButton(
                                                  appro?._id,
                                                  appro?.medicament?.name,
                                                  deleteApprovisonnement
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
                                )
                              )}
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
