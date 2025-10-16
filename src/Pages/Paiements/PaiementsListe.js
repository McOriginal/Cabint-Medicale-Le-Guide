import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { useAllPaiements, useDeletePaiement } from '../../Api/queriesPaiement';
import { useNavigate } from 'react-router-dom';

export default function PaiementsListe() {
  const { data: paiementsData, isLoading, error } = useAllPaiements();
  const { mutate: deletePaiement, isDeleting } = useDeletePaiement();

  // State de Recherche
  const [searchTerm, setSearchTerm] = useState('');
  // --- State pour le filtre reliqua
  const [filterReliqua, setFilterReliqua] = useState(false);

  // --- Filtrage des paiements
  const filterSearchPaiement = paiementsData
    ?.filter((paiement) => {
      const search = searchTerm.toLowerCase();
      const totalAmount =
        paiement?.ordonnance?.traitement?.totalAmount +
        paiement?.ordonnance?.totalAmount;
      return (
        `${paiement?.traitement?.patient?.firstName} ${paiement?.traitement?.patient?.lastName}`
          .toLowerCase()
          .includes(search) ||
        paiement?.ordonnance?.traitement?.patient?.gender
          .toLowerCase()
          .includes(search) ||
        paiement?.ordonnance?.traitement?.motif
          ?.toLowerCase()
          .includes(search) ||
        totalAmount.toString().includes(search) ||
        (paiement?.totalPaye || '').toString().includes(search) ||
        (paiement?.reduction || 0).toString().includes(search) ||
        (
          paiement?.paiementDate &&
          new Date(paiement?.paiementDate).toLocaleDateString()
        ).includes(search)
      );
    })
    ?.filter((paiement) => {
      const totalAmount =
        paiement?.ordonnance?.traitement?.totalAmount +
        paiement?.ordonnance?.totalAmount;
      if (!filterReliqua) return true; // pas de filtre
      const reliqua = (totalAmount || 0) - (paiement?.totalPaye || 0);
      return reliqua > 0;
    });

  const navigate = useNavigate();

  // Navigation ver la FACTURE avec ID de Paiement
  const handlePaiementClick = (id) => {
    navigate(`/facture/${id}`);
  };

  // Total Reçu
  const sumTotalRecu = paiementsData?.reduce((acc, item) => {
    const sum = item?.traitement?.totalAmount || 0;
    return acc + sum;
  }, 0);

  // Total Payés
  const sumTotalPaye = paiementsData?.reduce((acc, item) => {
    const sum = item?.totalPaye || 0;
    return acc + sum;
  }, 0);

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Transaction' breadcrumbItem='Paiements' />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='paiementsList'>
                    <Row className='g-4 mb-3'>
                      <Col className='d-flex justify-content-center align-self-center'>
                        <div className='form-check '>
                          <input
                            type='checkbox'
                            className='form-check-input'
                            id='filterReliqua'
                            onChange={() => setFilterReliqua(!filterReliqua)}
                          />
                          <label
                            className='form-check-label'
                            htmlFor='filterReliqua'
                          >
                            Non Payés
                          </label>
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
                      </Col>
                    </Row>
                    <Row className='g-4 my-4 align-items-center justify-content-between'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Total à Payez:</h5>
                          <span className='badge bg-warning'>
                            {formatPrice(sumTotalRecu)} F
                          </span>
                        </div>
                      </Col>
                      <Col className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Total Payés:</h5>
                          <span className='badge bg-success'>
                            {formatPrice(sumTotalPaye)} F
                          </span>
                        </div>
                      </Col>
                      <Col className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Non Payés:</h5>
                          <span className='badge bg-danger'>
                            {formatPrice(sumTotalRecu - sumTotalPaye)} F
                          </span>
                        </div>
                      </Col>
                    </Row>

                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div
                      className='table-responsive table-card mt-3 mb-1'
                      style={{ minHeight: '350px' }}
                    >
                      {filterSearchPaiement?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun paiement trouvée !
                        </div>
                      )}
                      {!error &&
                        !isLoading &&
                        filterSearchPaiement?.length > 0 && (
                          <table
                            className='table align-middle table-nowrap text-center table-hover'
                            id='paiementTable'
                          >
                            <thead className='table-light border-bottom border-secondary'>
                              <tr>
                                <th style={{ width: '50px' }}></th>
                                <th
                                  style={{ width: '50px' }}
                                  data-sort='paiementDate'
                                >
                                  Date de Paiement
                                </th>
                                <th data-sort='paiement_name'>Patient</th>

                                <th data-sort='genre'>Genre</th>
                                <th data-sort='age'>Age</th>
                                <th data-sort='traitement'>Maladie Traitée</th>

                                <th data-sort='totaAmount'>Somme Total</th>
                                <th data-sort='reduction'>Réduction</th>

                                <th className='sort' data-sort='totaPayer'>
                                  Somme Payé
                                </th>
                                <th className='sort' data-sort='reliqua'>
                                  Réliqua
                                </th>

                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all text-center'>
                              {filterSearchPaiement?.length > 0 &&
                                filterSearchPaiement?.map((paiement, index) => {
                                  const totalAmount =
                                    paiement?.ordonnance?.traitement
                                      ?.totalAmount +
                                    paiement?.ordonnance?.totalAmount;
                                  return (
                                    <tr
                                      key={paiement?._id}
                                      className='text-center border-bottom border-secondary'
                                    >
                                      <th scope='row'>{index + 1}</th>

                                      <th>
                                        {new Date(
                                          paiement?.paiementDate
                                        ).toLocaleDateString()}
                                      </th>
                                      <td
                                        className='id'
                                        style={{ display: 'none' }}
                                      ></td>
                                      <td>
                                        {capitalizeWords(
                                          paiement?.ordonnance?.traitement
                                            ?.patient?.firstName
                                        )}{' '}
                                        {capitalizeWords(
                                          paiement?.ordonnance?.traitement
                                            ?.patient?.lastName
                                        )}
                                      </td>
                                      <td>
                                        {capitalizeWords(
                                          paiement?.ordonnance?.traitement
                                            ?.patient?.gender
                                        )}{' '}
                                      </td>
                                      <td>
                                        {paiement?.ordonnance?.traitement
                                          ?.patient?.age
                                          ? paiement?.ordonnance?.traitement
                                              ?.patient?.age
                                          : '----'}
                                      </td>

                                      <td className='text-wrap'>
                                        {capitalizeWords(
                                          paiement?.ordonnance?.traitement
                                            ?.motif
                                        )}
                                      </td>

                                      <td>
                                        {formatPrice(totalAmount)}
                                        {' F '}
                                      </td>
                                      <td className='text-warning'>
                                        {formatPrice(paiement?.reduction)} F
                                      </td>
                                      <td>
                                        {formatPrice(paiement?.totalPaye)}
                                        {' F '}
                                      </td>
                                      <td>
                                        {totalAmount - paiement?.totalPaye >
                                        0 ? (
                                          <span className='text-danger'>
                                            {' '}
                                            {formatPrice(
                                              totalAmount - paiement?.totalPaye
                                            )}
                                            {' F '}
                                          </span>
                                        ) : (
                                          <span>
                                            {' '}
                                            {formatPrice(
                                              totalAmount - paiement?.totalPaye
                                            )}
                                            {' F '}
                                          </span>
                                        )}
                                      </td>

                                      <td>
                                        <div className='d-flex gap-2'>
                                          <div>
                                            <button
                                              className='btn btn-sm btn-secondary show-item-btn'
                                              data-bs-toggle='modal'
                                              data-bs-target='#showModal'
                                              onClick={() => {
                                                handlePaiementClick(
                                                  paiement?._id
                                                );
                                              }}
                                            >
                                              <i className='bx bx-show align-center text-white'></i>
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
                                                    paiement?._id,
                                                    `Paiement de ${paiement?.totalPaye} F
                                                   `,
                                                    deletePaiement
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
                                  );
                                })}
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
