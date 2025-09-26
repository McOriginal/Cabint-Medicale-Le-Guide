import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
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

import img1 from '../../assets/images/ch1.jpg';
import img2 from '../../assets/images/ch2.jpg';
import chamImg3 from './../../assets/images/chambre.jpg';

import { deleteButton } from '../components/AlerteModal';
import { useAllChambres, useDeleteChambre } from '../../Api/queriesChambre';
import ChambreForm from './ChambreForm';

export default function Chambre() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: chambres, isLoading, error } = useAllChambres();
  const { mutate: deleteChambre, isLoading: isDeleting } = useDeleteChambre();
  const [chambreToUpdate, setChambreToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter une Chambre');
  const images = [img1, img2, chamImg3];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Outils Médicals' breadcrumbItem='Chambre' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <ChambreForm
                chambreToEdit={chambreToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='ChambreList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-home align-center me-1'></i>
                            Ajouter une chambre
                          </Button>
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
            {!error && !isLoading && chambres?.length === 0 && (
              <div className='text-center'>Aucune Chambre disponible</div>
            )}

            {!error &&
              !isLoading &&
              chambres?.length > 0 &&
              chambres?.map((chamb) => (
                <Col sm={4} xl={3} key={chamb._id}>
                  <Card
                    style={{
                      boxShadow: '0px 0px 10px rgba(105, 206, 236, 0.5)',
                      borderRadius: '15px',
                    }}
                  >
                    <CardImg
                      top
                      className='img-fluid'
                      style={{ borderRadius: '15px 15px 0 0' }}
                      src={randomImage}
                      alt={chamb.title}
                    />
                    <CardBody>
                      <CardTitle className='mt-0'>
                        {capitalizeWords(chamb.title)}
                      </CardTitle>
                      <CardTitle>
                        Lits Disponible:{' '}
                        <span style={{ color: 'gray' }}>
                          {chamb?.bedNumber}
                        </span>{' '}
                      </CardTitle>
                      <CardTitle style={{ fontSize: '12px' }}>
                        Détails:{' '}
                        <span style={{ color: 'gray' }}>
                          {capitalizeWords(chamb?.description)}
                        </span>
                      </CardTitle>
                      <div className='d-flex mt-4 gap-2 justify-content-between align-items-center'>
                        <div className='edit'>
                          <button
                            className='btn btn-sm btn-info edit-item-btn'
                            data-bs-toggle='modal'
                            data-bs-target='#showModal'
                            onClick={() => {
                              setFormModalTitle('Modifier les données');
                              setChambreToUpdate(chamb);
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
                                  chamb._id,
                                  chamb.title,
                                  deleteChambre
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
