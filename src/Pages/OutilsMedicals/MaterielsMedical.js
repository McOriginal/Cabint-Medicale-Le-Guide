import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';

import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords } from '../components/capitalizeFunction';

import { deleteButton } from '../components/AlerteModal';
import { useAllMateriels, useDeleteMateriel } from '../../Api/queriesMateriels';
import MaterielForm from './MaterielForm';
import imgOutil from './../../assets/images/outils.jpg';

export default function Materiels() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: materiels, isLoading, error } = useAllMateriels();
  const { mutate: deleteMateriel, isLoading: isDeleting } = useDeleteMateriel();
  const [materielToUpdate, setMaterielToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Matériel');

  // State de Recherche
  const [searchTerm, seatSearchTerm] = useState('');

  // Fonction pour la recherche
  const filterSearchMateriels = materiels?.filter((mat) => {
    const search = searchTerm.toLowerCase();
    return (
      mat.name.toLowerCase().includes(search) ||
      mat.nombre.toString().includes(search)
    );
  });

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Outils Médicals' breadcrumbItem='Matériels' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <MaterielForm
                materielToEdit={materielToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='materielList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setFormModalTitle('Ajouter un Matériel');
                              setMaterielToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-tools align-center me-1'></i>{' '}
                            Ajouter un Matériel
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm'>
                        <div className='d-flex justify-content-sm-end'>
                          <div className='search-box me-4'>
                            <input
                              type='text'
                              className='form-control search border border-dark rounded'
                              placeholder='Rechercher...'
                              value={searchTerm}
                              onChange={(e) => seatSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
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
            {!error && !isLoading && filterSearchMateriels.length === 0 && (
              <div className='text-center'>Aucun Matériels trouvée</div>
            )}
            {!error &&
              !isLoading &&
              filterSearchMateriels?.length > 0 &&
              filterSearchMateriels?.map((mat) => (
                <Col md={6} xl={3} key={mat._id}>
                  <Card
                    style={{
                      boxShadow: '0px 0px 10px rgba(121,3,105,0.5)',
                      borderRadius: '15px',
                      height: '300px',
                    }}
                  >
                    <CardHeader style={{ height: '50%' }}>
                      <CardImg
                        top
                        className='img-fluid'
                        style={{
                          borderRadius: '15px 15px 0 0',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        src={mat.imageUrl ? mat.imageUrl : imgOutil}
                        alt={mat.name}
                      />
                    </CardHeader>
                    <CardBody>
                      <CardTitle className='mt-0'>
                        Nom:
                        <span style={{ color: 'gray' }}>
                          {' '}
                          {capitalizeWords(mat.name)}
                        </span>{' '}
                      </CardTitle>
                      <CardTitle>
                        Nombre:
                        <span style={{ color: 'gray' }}> {mat?.nombre}</span>
                      </CardTitle>
                      <div className='d-flex gap-2 justify-content-between align-items-center'>
                        <div className='edit'>
                          <button
                            className='btn btn-sm btn-info edit-item-btn'
                            data-bs-toggle='modal'
                            data-bs-target='#showModal'
                            onClick={() => {
                              setFormModalTitle('Modifier les données');
                              setMaterielToUpdate(mat);
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
                                  mat._id,
                                  mat.title,
                                  deleteMateriel
                                );
                              }}
                            >
                              <i className='ri-delete-bin-fill text-white'></i>
                            </button>
                          </div>
                        )}
                      </div>
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
