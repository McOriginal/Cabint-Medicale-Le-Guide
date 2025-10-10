import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { Link, useNavigate } from 'react-router-dom';
import {
  useAllOrdonnances,
  useDeleteOrdonnance,
} from '../../Api/queriesOrdonnance';
import React, { useState } from 'react';
import OrdonnanceDetails from './OrdonnanceDetails';
import Swal from 'sweetalert2';
import { connectedUserRole } from '../Authentication/userInfos';

export default function OrdonnanceListe() {
  const navigate = useNavigate();
  // Afficher toutes les ordonnances
  const { data: ordonnances, isLoading, error } = useAllOrdonnances();

  // Annuler une Ordonnance en suite la supprimer
  const { mutate: deleteAndDecrementMultipleStocks, isLoading: isDeletting } =
    useDeleteOrdonnance();

  // ---------------------------
  const [show_modal, setShow_modal] = useState(false);
  function tog_show_modal() {
    setShow_modal(!show_modal);
  }

  // --------------------------------------------------------
  // Fonction pour la recherche dans la liste
  const [searchTerm, setSearchTerm] = useState('');

  const filterSearchOrdonnanceData = ordonnances?.filter((ordo) => {
    const search = searchTerm.toLowerCase();
    return (
      `${ordo?.traitement?.patient?.firstName} ${ordo?.traitement?.patient?.lastName}`
        .toLowerCase()
        .includes(search) ||
      new Date(ordo?.createdAt).toLocaleDateString('fr-Fr').includes(search) ||
      ordo?.traitement?.motif?.toLowerCase().includes(search)
    );
  });

  // Cancel Ordonnances function
  // Annulé l'ordonnace et ajouté ses médicaments au stock
  function onCancelOrdonnance(ordo) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ms-2',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `Attention après l'Annulation les médicaments dans l'ordonnance seront ajouter sur votre STOCK !  `,
        text: ordo?.traitement['motif'],
        icon: 'question',
        iconColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Oui, Continuer',
        cancelButtonText: 'Non, Annuler!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          try {
            const payload = {
              id: ordo?._id,
              items: ordo?.items.map((item) => ({
                medicaments: item?.medicaments,
                quantity: item?.quantity,
              })),
            };
            deleteAndDecrementMultipleStocks(payload, {
              onSuccess: () => {
                swalWithBootstrapButtons.fire({
                  title: 'Supprimé!',
                  text: `Ordonnance Annulé avec succès les médicaments sont ajouté sur le STOCK.`,
                  icon: 'success',
                });
              },
              onError: (e) => {
                swalWithBootstrapButtons.fire({
                  title: 'Erreur',
                  text:
                    'Une erreur est survenue lors de la suppression.' ||
                    e?.response?.data?.message,
                  icon: 'error',
                });
              },
            });
          } catch (e) {
            swalWithBootstrapButtons.fire({
              title: 'Erreur',
              text:
                e ||
                e?.response?.data?.message ||
                "Une erreur est survenue lors de l'Annulation.",
              icon: 'error',
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Ordonnance non Annulée',
            icon: 'error',
          });
        }
      });
  }
  // ------------------------------------------------------------

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Traitements' breadcrumbItem='Ordonnances' />
          {/* -------------------------- */}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='ordonnanceList'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <div className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Total Ordonnances:</h5>
                          <span className='badge bg-info'>
                            {formatPrice(ordonnances?.length) || 0}
                          </span>
                        </div>
                      </div>
                      {/* Barre de recherche */}
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
                    {/* Barre de recherche */}
                    <p className='text-center my-4 text-warning'>
                      Pour ajouter une Ordonnance vous devez retourner
                      sélectionner le Traitement concernée,{' '}
                      <Link
                        to='/traitements'
                        className='text-decoration-underline'
                      >
                        Cliquez ici
                      </Link>{' '}
                      pour retourner à la liste des Traitements.
                    </p>
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {!error &&
                        !isLoading &&
                        filterSearchOrdonnanceData?.length === 0 && (
                          <div className='text-center text-mutate'>
                            Aucune ordonnance pour le moment !
                          </div>
                        )}
                      {!error &&
                        !isLoading &&
                        filterSearchOrdonnanceData?.length > 0 && (
                          <table
                            className='table align-middle table-nowrap table-hover'
                            id='ordonnanceTable'
                          >
                            <thead className='table-light'>
                              <tr className='text-center'>
                                <th scope='col' style={{ width: '50px' }}></th>
                                <th scope='col' style={{ width: '50px' }}>
                                  Date d'ordonnance
                                </th>
                                <th className='sort' data-sort='patient'>
                                  Patient
                                </th>
                                <th
                                  className='sort'
                                  data-sort='ordonnance_name'
                                >
                                  Type de traitement
                                </th>
                                <th className='sort' data-sort='traitementDate'>
                                  Date de Traitement
                                </th>
                                <th
                                  className='sort'
                                  data-sort='medicamentItems'
                                >
                                  Nombre de Médicaments
                                </th>

                                <th className='sort' data-sort='action'>
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className='list form-check-all text-center'>
                              {filterSearchOrdonnanceData?.length > 0 &&
                                filterSearchOrdonnanceData?.map(
                                  (ordo, index) => (
                                    <tr key={ordo?._id} className='text-center'>
                                      <th scope='row'>{index + 1}</th>
                                      <th>
                                        {new Date(
                                          ordo?.createdAt
                                        ).toLocaleDateString('fr-Fr', {
                                          weekday: 'short',
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                        })}
                                      </th>
                                      <td>
                                        {capitalizeWords(
                                          ordo?.traitement?.patient?.firstName
                                        )}{' '}
                                        {capitalizeWords(
                                          ordo?.traitement?.patient?.lastName
                                        )}
                                      </td>
                                      <td
                                        className='text-wrap'
                                        style={{ maxWidth: '200px' }}
                                      >
                                        {ordo?.traitement
                                          ? capitalizeWords(
                                              ordo?.traitement?.motif
                                            )
                                          : '-----'}
                                      </td>

                                      <td>
                                        {new Date(
                                          ordo?.createdAt
                                        ).toLocaleDateString('fr-Fr', {
                                          weekday: 'short',
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                        })}{' '}
                                      </td>

                                      <td>
                                        {ordo?.items?.length} médicaments
                                        {'  '}
                                      </td>

                                      <td>
                                        {isDeletting && <LoadingSpiner />}
                                        {!isDeletting && (
                                          <div className='d-flex gap-2'>
                                            {connectedUserRole === 'admin' && (
                                              <div>
                                                <button
                                                  className='btn btn-sm btn-secondary '
                                                  onClick={() =>
                                                    navigate(
                                                      `/traitements/updateOrdonnance/${ordo?._id}`
                                                    )
                                                  }
                                                >
                                                  <i className=' bx bx-edit-alt text-white'></i>
                                                </button>
                                              </div>
                                            )}
                                            <div className='show-details'>
                                              <button
                                                className='btn btn-sm btn-info '
                                                data-bs-toggle='modal'
                                                data-bs-target='#showdetails'
                                                onClick={() => {
                                                  navigate(
                                                    `/ordonnance/details/${ordo?._id}`
                                                  );
                                                }}
                                              >
                                                <i className=' bx bx-show-alt text-white'></i>
                                              </button>
                                            </div>

                                            {connectedUserRole === 'admin' && (
                                              <div>
                                                <button
                                                  className='btn btn-sm btn-danger '
                                                  onClick={() =>
                                                    onCancelOrdonnance(ordo)
                                                  }
                                                >
                                                  Annuler
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        )}
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
