import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
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

import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';

import { useAllMedicamentWithStockFinish } from '../../Api/queriesMedicament';
import imgMedicament from './../../assets/images/medicament.jpg';
import { useNavigate } from 'react-router-dom';

export default function MedicamentSansStock() {
  const {
    data: medicaments,
    isLoading,
    error,
  } = useAllMedicamentWithStockFinish();

  // Recherche State
  const [searchTerm, setSearchTerm] = useState('');

  // Fontion pour Rechercher
  const filterSearchMedicaments = medicaments?.filter((medica) => {
    const search = searchTerm.toLowerCase();

    return (
      medica?.name.toString().toLowerCase().includes(search) ||
      medica?.price.toString().includes(search) ||
      medica?.stock.toString().includes(search)
    );
  });

  // Utilisation de useNavigate pour la navigation
  const navigate = useNavigate();
  // Function to handle deletion of a medicament
  function navigateToMedicamentApprovisonnement(id) {
    navigate(`/approvisonnement/${id}`);
  }

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Pharmacie'
            breadcrumbItem='Médicaments en Stock Faible'
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='medicamentList'>
                    <Row className='g-4 mb-3'>
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
                  </div>

                  <p className='text-center'>
                    <strong className='text-danger'>
                      {formatPrice(medicaments?.length) || 0}{' '}
                    </strong>{' '}
                    Médicaments en Stock Faible
                  </p>
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
            {!error && !isLoading && filterSearchMedicaments?.length === 0 && (
              <div className='text-center'>Aucun Médicament trouvés</div>
            )}
            {!error &&
              !isLoading &&
              filterSearchMedicaments?.length > 0 &&
              filterSearchMedicaments?.map((medica) => (
                <Col md={6} lg={4} key={medica?._id}>
                  <Card
                    style={{
                      boxShadow: '0px 0px 10px rgba(121,3,105,0.5)',
                      borderRadius: '15px',
                      padding: '10px 20px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
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
                            className='edit-item-btn'
                            onClick={() => {
                              navigateToMedicamentApprovisonnement(medica?._id);
                            }}
                          >
                            <i className=' bx bx-analyse align-center me-2 text-muted'></i>
                            Approvisonnée
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <img
                      className='img-fluid'
                      style={{
                        borderRadius: '15px 15px 0 0',
                        height: '100%',
                        width: '30%',
                        objectFit: 'contain',
                      }}
                      src={medica?.imageUrl ? medica?.imageUrl : imgMedicament}
                      alt={medica?.name}
                    />

                    <CardBody>
                      <CardTitle className='fs-6'>
                        Nom:
                        <span style={{ color: 'gray' }}>
                          {' '}
                          {capitalizeWords(medica?.name)}
                        </span>{' '}
                      </CardTitle>
                      <CardTitle className='fs-6'>
                        Stock:
                        {medica?.stock >= 10 ? (
                          <span style={{ color: 'gray' }}>
                            {' '}
                            {formatPrice(medica?.stock)}
                          </span>
                        ) : (
                          <span className='text-danger'>
                            {' '}
                            {formatPrice(medica?.stock)}
                          </span>
                        )}
                      </CardTitle>
                      <CardTitle>
                        {' '}
                        Prix:{' '}
                        <span style={{ color: 'gray' }}>
                          {' '}
                          {formatPrice(medica?.price)} F
                        </span>{' '}
                      </CardTitle>
                    </CardBody>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
