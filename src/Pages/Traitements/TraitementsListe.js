import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import TraitementForm from './TraitementForm';
import {
  useAllTraitement,
  useDeleteTraitement,
} from '../../Api/queriesTraitement';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import img1 from '../../assets/images/t1.jpg';
import img2 from '../../assets/images/t2.jpg';
import img3 from '../../assets/images/t3.jpg';
import img4 from '../../assets/images/t4.jpg';
import { deleteButton } from '../components/AlerteModal';
import { Link, useNavigate } from 'react-router-dom';
import { connectedUserRole } from '../Authentication/userInfos';

export default function TraitementsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: traitements, isLoading, error } = useAllTraitement();
  const { mutate: deleteTraitement, isLoading: isDeletting } =
    useDeleteTraitement();
  const [traitementToUpdate, setTraitementToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un patien(e)');
  const images = [img1, img2, img3, img4];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // State de changement du mode d'affichage
  const [displayMode, setDisplayMode] = useState('list'); // 'list' ou 'grid'

  // State de Recherche
  const [searchTerm, setSearchTerm] = useState('');

  const filterTraitementSearch = traitements?.filter((trait) => {
    const search = searchTerm.toLowerCase();
    return (
      `${trait?.patient?.firstName || ''} ${trait?.patient?.lastName || ''}`
        .toLowerCase()
        .includes(search) ||
      (trait?.motif || '').toLowerCase().includes(search) ||
      (trait?.patient?.age || '').toLowerCase().includes(search) ||
      (trait?.startTime || '').toLowerCase().includes(search) ||
      new Date(trait?.createdAt)
        .toLocaleDateString()
        .toString()
        .includes(search) ||
      new Date(trait?.startDate)
        .toLocaleDateString()
        .toString()
        .includes(search)
    );
  });

  const navigate = useNavigate();

  const handleNavigateToDetails = (id) => {
    return navigate(`/traitements/details/${id}`);
  };

  const handleNavigateToOrdonnance = (id) => {
    return navigate(`/traitements/ordonnance/${id}`);
  };

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Traitements'
            breadcrumbItem='Lists des traitements'
          />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='lg'
            bodyContent={
              <TraitementForm
                traitementToEdit={traitementToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='traitementList'>
                    <Row className='g-4 mb-3 d-flex justify-content-between align-items-center'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setTraitementToUpdate(null);
                              setFormModalTitle('Ajouter un Traitement');
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-heartbeat align-center me-1'></i>{' '}
                            Ajouter un Traitement
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm-auto'>
                        <div className='d-flex align-items-center gap-2'>
                          <h5 className='mb-0'>Total Traitements:</h5>
                          <span className='badge bg-info'>
                            {formatPrice(traitements?.length) || 0}
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
                    <p className='text-center text-warning'>
                      Avant d'ajouter un traitement rassurez-vous que vous avez
                      déjà enregistré le Patient, sinon{' '}
                      <Link
                        to='/patients'
                        className='text-decoration-underline'
                      >
                        Cliquez ici
                      </Link>{' '}
                      pour retourner sur la liste Patients.
                    </p>

                    <div className='d-flex pe-4 gap-4 justify-content-end'>
                      <Button
                        onClick={() => setDisplayMode('grid')}
                        style={{
                          background:
                            displayMode === 'grid' ? ' #ffff03' : 'transparent',
                          border: '1px solid #ffff03',
                          color: ' #010101',
                          boxShadow: '0px 0px 2px rgba(0,0,0,0.4)',
                        }}
                      >
                        {' '}
                        <i className='fas fa-grip-vertical px-1'></i>{' '}
                      </Button>
                      <Button
                        onClick={() => setDisplayMode('list')}
                        style={{
                          background:
                            displayMode === 'list' ? ' #ffff03' : 'transparent',
                          border: '1px solid #ffff03',
                          color: ' #010101',
                          boxShadow: '0px 0px 2px rgba(0,0,0,0.4)',
                        }}
                      >
                        {' '}
                        <i className='fas fa-list'></i>{' '}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {isLoading && <LoadingSpiner />}
            {error && (
              <div className='text-danger text-center'>
                Erreur lors de chargement des données
              </div>
            )}

            {!error && !isLoading && filterTraitementSearch?.length === 0 && (
              <div className='text-center'>Aucun Traitement trouvée !</div>
            )}
            {!error &&
            !isLoading &&
            filterTraitementSearch?.length > 0 &&
            displayMode === 'list' ? (
              <div
                className='table-responsive table-card mt-3 mb-1'
                style={{ minHeight: '250px' }}
              >
                <table
                  className='table align-middle text-center table-nowrap table-hover'
                  id='traitementTable'
                >
                  <thead className='table-light  border-bottom border-secondary'>
                    <tr>
                      <th scope='col' style={{ width: '40px' }}>
                        Date
                      </th>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Téléphone</th>
                      <th>Traitement</th>

                      <th>Début Maladie</th>
                      {connectedUserRole === 'admin' && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody className='list form-check-all text-center'>
                    {!error &&
                      !isLoading &&
                      filterTraitementSearch?.length > 0 &&
                      filterTraitementSearch?.map((trait) => (
                        <tr
                          key={trait._id}
                          className='text-center border-secondary border-bottom'
                        >
                          <th>
                            {new Date(trait.createdAt).toLocaleDateString()}
                          </th>
                          <td>
                            {capitalizeWords(trait?.patient?.firstName)}{' '}
                            {capitalizeWords(trait?.patient?.lastName)}{' '}
                          </td>
                          <td>
                            {trait?.patient?.age
                              ? trait?.patient?.age
                              : '-----'}{' '}
                          </td>
                          <td>
                            {trait?.patient?.phoneNumber
                              ? formatPhoneNumber(trait?.patient?.phoneNumber)
                              : '----'}{' '}
                          </td>
                          <td
                            className='text-wrap'
                            style={{ maxWidth: '200px' }}
                          >
                            {capitalizeWords(trait?.motif)}{' '}
                          </td>
                          <td>
                            {new Date(trait?.startDate).toLocaleDateString()} -{' '}
                            {capitalizeWords(trait?.startTime)}{' '}
                          </td>
                          {connectedUserRole === 'admin' && (
                            <td>
                              {isDeletting && <LoadingSpiner />}

                              {!isDeletting && (
                                <UncontrolledDropdown className='dropdown d-inline-block'>
                                  <DropdownToggle
                                    className='btn btn-soft-secondary btn-sm'
                                    tag='button'
                                  >
                                    <i className='bx bx-caret-down-square fs-2 text-info'></i>
                                  </DropdownToggle>
                                  <DropdownMenu className='dropdown-menu-end'>
                                    <DropdownItem
                                      onClick={() => {
                                        handleNavigateToOrdonnance(trait._id);
                                      }}
                                    >
                                      <i className='bx bx-joystick-button align-center me-2 text-info'></i>
                                      Ordonnance
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        handleNavigateToDetails(trait._id);
                                      }}
                                    >
                                      <i className='bx bx-show align-center me-2 text-info'></i>
                                      Détails
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        setFormModalTitle(
                                          'Modifier les données'
                                        );
                                        setTraitementToUpdate(trait);
                                        tog_form_modal();
                                      }}
                                    >
                                      <i className='ri-pencil-fill align-center me-2 text-warning'></i>
                                      Modifier
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        deleteButton(
                                          trait._id,
                                          trait.motif,
                                          deleteTraitement
                                        );
                                      }}
                                    >
                                      {' '}
                                      <i className='ri-delete-bin-fill align-center me-2 text-danger'></i>{' '}
                                      Supprimer{' '}
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              filterTraitementSearch?.length > 0 &&
              filterTraitementSearch?.map((trait) => (
                <Col sm={4} xl={3} key={trait._id}>
                  <Card
                    style={{
                      boxShadow: '0px 0px 10px rgba(121,3,105,0.5)',
                      borderRadius: '15px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '5%',
                        right: '5%',
                      }}
                    >
                      <UncontrolledDropdown className='dropdown d-inline-block'>
                        <DropdownToggle
                          className='btn btn-soft-secondary btn-sm'
                          tag='button'
                        >
                          <i className='bx bx-caret-down-square fs-2 text-info'></i>
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-end'>
                          <DropdownItem
                            onClick={() => {
                              handleNavigateToOrdonnance(trait._id);
                            }}
                          >
                            <i className='bx bx-joystick-button align-center me-2 text-info'></i>
                            Ordonnance
                          </DropdownItem>
                          {connectedUserRole === 'admin' && (
                            <div>
                              {' '}
                              <DropdownItem
                                onClick={() => {
                                  handleNavigateToDetails(trait._id);
                                }}
                              >
                                <i className='bx bx-show align-center me-2 text-info'></i>
                                Détails
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setFormModalTitle('Modifier les données');
                                  setTraitementToUpdate(trait);
                                  tog_form_modal();
                                }}
                              >
                                <i className='ri-pencil-fill align-center me-2 text-warning'></i>
                                Modifier
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  deleteButton(
                                    trait._id,
                                    trait.motif,
                                    deleteTraitement
                                  );
                                }}
                              >
                                {' '}
                                <i className='ri-delete-bin-fill align-center me-2 text-danger'></i>{' '}
                                Supprimer{' '}
                              </DropdownItem>
                            </div>
                          )}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <CardImg
                      top
                      className='img-fluid'
                      style={{ borderRadius: '15px 15px 0 0' }}
                      src={randomImage}
                      alt={trait.motif}
                    />
                    <CardBody>
                      <span
                        style={{
                          fontSize: '11px',
                          marginBottom: '13px',
                          textAlign: 'center',
                          display: 'block',
                          color: 'blue',
                        }}
                      >
                        <i className='bx bx-calendar'></i> Date de Traitement:{' '}
                        {new Date(trait.createdAt).toLocaleDateString()}
                      </span>
                      <CardTitle
                        style={{ fontSize: '12px', marginBottom: '10px' }}
                      >
                        <span style={{ color: 'gray' }}>Traitement:</span>{' '}
                        {capitalizeWords(trait.motif)}{' '}
                      </CardTitle>
                      <CardText style={{ fontSize: '12px' }}>
                        {capitalizeWords(trait?.patient['firstName'])}{' '}
                        {capitalizeWords(trait?.patient['lastName'])}
                      </CardText>
                      <p style={{ fontSize: '12px', margin: '0px' }}>
                        {trait.patient['dateOfBirth']
                          ? new Date(
                              trait?.patient['dateOfBirth']
                            ).toLocaleDateString()
                          : '---------'}
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
