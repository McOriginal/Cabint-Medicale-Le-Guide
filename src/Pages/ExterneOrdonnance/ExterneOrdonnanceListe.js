import { useNavigate } from 'react-router-dom';
import { BreadcrumbItem, Button, Card, CardBody, Container } from 'reactstrap';
import {
  useAllExterneOrdonnances,
  useDeleteExterneOrdonnance,
} from '../../Api/queriesExterneOrdonnance';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import LoadingSpiner from '../components/LoadingSpiner';
import { connectedUserRole } from '../Authentication/userInfos';
import { deleteButton } from '../components/AlerteModal';

export default function ExterneOrdonnanceListe() {
  const navigate = useNavigate();

  const { data: ordonnanceData, isLoading, error } = useAllExterneOrdonnances();
  const { mutate: deleteOrdonnance, isLoading: isDeletting } =
    useDeleteExterneOrdonnance();
  return (
    <div className='page-content'>
      <Container fluid>
        <BreadcrumbItem title='Ordonnance Externe' />
        <Card>
          <h3>Liste des Ordonnances Externes</h3>
          <CardBody>
            <Button
              color='info'
              className='d-flex justify-content-center align-items-center gap-2'
              onClick={() => navigate('/externe-ordonnance/new')}
            >
              <i className='fas fa-plus'></i>
              Ajouter
            </Button>

            <div id='ordonnanceList'>
              <div className='d-flex justify-content-between align-items-center'>
                <div className='col-sm-auto'>
                  <div className='d-flex align-items-center gap-2'>
                    <h5 className='mb-0'>Total Ordonnances:</h5>
                    <span className='badge bg-info'>
                      {formatPrice(ordonnanceData?.length) || 0}
                    </span>
                  </div>
                </div>
                {/* Barre de recherche */}
                {/* <div className='d-flex justify-content-sm-end gap-3'>
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
                      </div> */}
              </div>

              {isLoading && <LoadingSpiner />}

              <div className='table-responsive table-card mt-3 mb-1'>
                {!error && !isLoading && ordonnanceData?.length === 0 && (
                  <div className='text-center text-mutate'>
                    Aucune ordonnance pour le moment !
                  </div>
                )}
                {!error && !isLoading && ordonnanceData?.length > 0 && (
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
                      {ordonnanceData?.length > 0 &&
                        ordonnanceData?.map((ordo) => (
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
                              {capitalizeWords(ordo?.traitement || '-----')}
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
