import { useNavigate } from 'react-router-dom';
import {
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from 'reactstrap';
import {
  useAllExterneOrdonnances,
  useDeleteExterneOrdonnance,
} from '../../Api/queriesExterneOrdonnance';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import LoadingSpiner from '../components/LoadingSpiner';
import { connectedUserRole } from '../Authentication/userInfos';
import { deleteButton } from '../components/AlerteModal';
import { useState } from 'react';

export default function ExterneOrdonnanceListe() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: ordonnanceData, isLoading, error } = useAllExterneOrdonnances();
  const { mutate: deleteOrdonnance, isLoading: isDeletting } =
    useDeleteExterneOrdonnance();

  const filteredOrdonnances = ordonnanceData?.filter((ordo) => {
    const term = searchTerm.toLowerCase();
    return (
      ordo.patient.toLowerCase().includes(term) ||
      ordo.traitement.toLowerCase().includes(term) ||
      ordo.doctor.toLowerCase().includes(term)
    );
  });

  return (
    <div className='page-content'>
      <Container fluid>
        <BreadcrumbItem title='Ordonnance Externe' />
        <Card>
          <CardBody>
            <h3 className='text-center'>Liste des Ordonnances Externes</h3>
            <div id='ordonnanceList'>
              <Row>
                <Col md={6}>
                  <Button
                    color='info'
                    className='d-flex justify-content-center align-items-center gap-2'
                    onClick={() => navigate('/externe-ordonnance/new')}
                  >
                    <i className='fas fa-plus'></i>
                    Ajouter
                  </Button>
                </Col>
                <Col md={6}>
                  {/* Barre de recherche */}
                  <div className='d-flex justify-content-sm-end gap-3'>
                    {searchTerm !== '' && (
                      <Button color='warning' onClick={() => setSearchTerm('')}>
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
              <div className='col-sm-auto'>
                <div className='d-flex justify-content-center align-items-center gap-2'>
                  <h5 className='my-4 text-center'>Total Ordonnances:</h5>
                  <span className='badge bg-info'>
                    {formatPrice(filteredOrdonnances?.length) || 0}
                  </span>
                </div>
              </div>

              {isLoading && <LoadingSpiner />}

              <div className='table-responsive table-card mt-3 mb-1'>
                {!error && !isLoading && filteredOrdonnances?.length === 0 && (
                  <div className='text-center text-mutate'>
                    Aucune ordonnance pour le moment !
                  </div>
                )}
                {!error && !isLoading && filteredOrdonnances?.length > 0 && (
                  <table
                    className='table align-middle table-nowrap table-hover'
                    id='ordonnanceTable'
                  >
                    <thead className='table-light'>
                      <tr className='text-center'>
                        <th scope='col' style={{ width: '50px' }}>
                          Date d'ordonnance
                        </th>
                        <th>Patient</th>
                        <th>Traitement</th>
                        <th>Médecin / Prescripteur</th>
                        <th>Nombre de Médicaments</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className='list form-check-all text-center'>
                      {filteredOrdonnances?.length > 0 &&
                        filteredOrdonnances?.map((ordo) => (
                          <tr key={ordo?._id} className='text-center'>
                            <th>
                              {new Date(
                                ordo?.ordonnanceDate
                              ).toLocaleDateString('fr-Fr', {
                                weekday: 'short',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })}
                            </th>
                            <td>{capitalizeWords(ordo?.patient)}</td>
                            <td
                              className='text-wrap'
                              style={{ maxWidth: '200px' }}
                            >
                              {capitalizeWords(ordo?.traitement)}
                            </td>

                            <td>{capitalizeWords(ordo?.doctor)}</td>

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
                                            `/externe-ordonnance/update/${ordo?._id}`
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
                                      onClick={() => {
                                        navigate(
                                          `/externe-ordonnance/${ordo?._id}`
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
                                        onClick={() => {
                                          deleteButton(
                                            ordo?._id,
                                            ordo?.patient,
                                            deleteOrdonnance
                                          );
                                        }}
                                      >
                                        <i className='fas fa-trash'></i>
                                      </button>
                                    </div>
                                  )}
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
      </Container>
    </div>
  );
}
