import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import LoadingSpiner from '../../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPrice,
} from '../../components/capitalizeFunction';
import { deleteButton } from '../../components/AlerteModal';
import {
  useAllPaiementsHistorique,
  useDeletePaiementHistorique,
} from '../../../Api/queriesPaiementHistorique';
import FormModal from '../../components/FormModal';
import PaiementForm from '../../Paiements/PaiementForm';
import FacturePaiement from './FacturePaiement';
import PaiementsHistoriqueForm from './PaiementsHistoriqueForm';
import { useParams } from 'react-router-dom';
import { useOneOrdonnance } from '../../../Api/queriesOrdonnance';

export default function PaiementsHistorique() {
  const param = useParams();
  const [form_modal, setForm_modal] = useState(false);
  const [form_historique_modal, setForm_historique_modal] = useState(false);
  const [facture_modal, setFacture_modal] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [paiementHistoriqueToUpdate, setPaiementHistoriqueToUpdate] =
    useState(null);
  const [formTitle, setFormTitle] = useState('');
  // Récupération des Historiques de Paiements
  const {
    data: paiementsHistoriqueData,
    isLoading,
    error,
  } = useAllPaiementsHistorique();
  const { data: ordonnanceData } = useOneOrdonnance(param.id);

  // State pour supprimer le Paiement dans l'historique
  const { mutate: deletePaiementHistorique, isDeleting } =
    useDeletePaiementHistorique();

  // Ouverture de Modal Form
  function tog_historique_form_modal() {
    setForm_historique_modal(!form_historique_modal);
  }

  // Ouverture de Modal Form
  function tog_facture_modal() {
    setFacture_modal(!facture_modal);
  }
  // Ouverture de Modal Form
  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  const filterPaiementHistorique = paiementsHistoriqueData?.filter(
    (item) => item?.ordonnance?._id === param.id
  );

  // Calculer le Total Payés
  const sumTatalPayed = filterPaiementHistorique?.reduce(
    (acc, item) => (acc += item?.amount),
    0
  );

  const ordonnanceAmount = ordonnanceData?.ordonnances?.totalAmount;
  const traitementAmount = ordonnanceData?.traitements?.totalAmount;
  const totalAmountToPay = ordonnanceAmount + traitementAmount;
  const reliqua = totalAmountToPay - sumTatalPayed;

  return (
    // <React.Fragment>
    <div className='page-content'>
      <Container fluid>
        {/* -------------------------- */}
        <FormModal
          form_modal={form_modal}
          setForm_modal={setForm_modal}
          tog_form_modal={tog_form_modal}
          modal_title={formTitle}
          size='md'
          bodyContent={<PaiementForm tog_form_modal={tog_form_modal} />}
        />

        {/* PaiementHistorique FORM */}

        <FormModal
          form_modal={form_historique_modal}
          setForm_modal={setForm_historique_modal}
          tog_form_modal={tog_historique_form_modal}
          modal_title={formTitle}
          size='md'
          bodyContent={
            <PaiementsHistoriqueForm
              tog_form_modal={tog_historique_form_modal}
              selectedPaiementHistoriqueToUpdate={paiementHistoriqueToUpdate}
              totalReliqua={reliqua}
            />
          }
        />

        {/* ---------- Recue de Paiement ---------- */}
        <FacturePaiement
          show_modal={facture_modal}
          tog_show_modal={setFacture_modal}
          selectedPaiementHistoriqueID={selectedPaiement}
          // reliqua={reliqua}
        />
        {/* ---------- Recue de Paiement ---------- */}
        <Row>
          <Col lg={12}>
            <Card>
              <CardTitle className='text-center mb-4 mt-2 font-size-20 '>
                Historique de Paiements{' '}
              </CardTitle>
              <CardBody>
                <div id='paiementsList'>
                  <Row className='g-4 mb-3'>
                    <Col className='col-sm-auto'>
                      <div className='d-flex gap-1'>
                        <Button
                          color='info'
                          className='add-btn'
                          id='create-btn'
                          onClick={() => {
                            setPaiementHistoriqueToUpdate(null);
                            setFormTitle('Nouveau Historique de Paiement');
                            filterPaiementHistorique?.length > 0
                              ? tog_historique_form_modal()
                              : tog_form_modal();
                          }}
                        >
                          <i className='fas fa-dollar-sign align-center me-1'></i>{' '}
                          Ajouter un Paiement
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <div className='d-flex flex-column justify-content-center align-items-end '>
                        <h6>
                          Total Payé:{' '}
                          <span className='text-success'>
                            {formatPrice(sumTatalPayed)} F
                          </span>
                        </h6>
                        <h6>
                          Reliquat:{' '}
                          <span
                            className={`text-${
                              reliqua > 0 ? 'danger' : 'success'
                            }`}
                          >
                            {formatPrice(reliqua)} F
                          </span>
                        </h6>
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
                    {filterPaiementHistorique?.length === 0 && (
                      <div className='text-center text-secondary'>
                        Aucun Paiement Effectué !
                      </div>
                    )}

                    {/* Liste Historique de Paiement si ça existe */}
                    {!error &&
                      !isLoading &&
                      filterPaiementHistorique?.length > 0 && (
                        <table
                          className='table align-middle  border-all border-2 border-secondary table-nowrap table-hover text-center'
                          id='paiementTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th style={{ width: '50px' }}>
                                Date de Paiement
                              </th>

                              <th className='text-center'>Montant</th>

                              <th className='text-center'>
                                Méthode de paiement
                              </th>
                              <th>Status</th>

                              <th data-sort='action'>Action</th>
                            </tr>
                          </thead>

                          <tbody className='list form-check-all'>
                            {filterPaiementHistorique?.length > 0 &&
                              filterPaiementHistorique?.map((paiement) => (
                                <tr key={paiement?._id}>
                                  <th scope='row'>
                                    {new Date(
                                      paiement?.paiementDate
                                    ).toLocaleDateString()}
                                  </th>

                                  <td>
                                    {formatPrice(paiement?.amount)}
                                    {' F '}
                                  </td>
                                  <td>{capitalizeWords(paiement?.methode)}</td>

                                  <td>
                                    <span
                                      className={
                                        'badge badge-soft-success text-uppercase'
                                      }
                                    >
                                      payé
                                    </span>
                                  </td>

                                  <td>
                                    {isDeleting && <LoadingSpiner />}

                                    <div className='d-flex gap-2 justify-content-center alitgn-items-center'>
                                      <div>
                                        <button
                                          className='btn btn-sm btn-secondary show-item-btn'
                                          data-bs-toggle='modal'
                                          data-bs-target='#showModal'
                                          onClick={() => {
                                            setSelectedPaiement(paiement?._id);
                                            tog_facture_modal();
                                          }}
                                        >
                                          <i className='bx bx-show align-center text-white'></i>
                                        </button>
                                      </div>
                                      <div className='d-flex gap-2'>
                                        <div>
                                          <button
                                            className='btn btn-sm btn-warning show-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#edit'
                                            onClick={() => {
                                              setPaiementHistoriqueToUpdate(
                                                paiement
                                              );
                                              setFormTitle(
                                                'Modifier le Paiement'
                                              );
                                              tog_form_modal();
                                            }}
                                          >
                                            <i className='bx bx-pencil align-center text-white'></i>
                                          </button>
                                        </div>

                                        <div className='remove'>
                                          <button
                                            className='btn btn-sm btn-danger remove-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#deleteRecordModal'
                                            onClick={() => {
                                              deleteButton(
                                                paiement._id,
                                                `Paiement de ${paiement?.amount} F
                                                   `,
                                                deletePaiementHistorique
                                              );
                                            }}
                                          >
                                            <i className='ri-delete-bin-fill text-white'></i>
                                          </button>
                                        </div>
                                      </div>
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
    // </React.Fragment>
  );
}
