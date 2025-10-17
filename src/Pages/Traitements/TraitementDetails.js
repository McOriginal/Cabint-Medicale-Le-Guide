import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useOneTraitement } from '../../Api/queriesTraitement';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { useParams } from 'react-router-dom';
import React, { useRef } from 'react';
import { useTraitementOrdonnance } from '../../Api/queriesOrdonnance';
import html2pdf from 'html2pdf.js';
import {
  hospitalAdresse,
  hospitalName,
  hospitalTel,
} from '../CompanyInfo/CompanyInfo';
import OrdonnancePaper from '../Ordonnances/Details/OrdonnancePaper';
import { useReactToPrint } from 'react-to-print';

export default function TraitementDetails() {
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const param = useParams();
  // Récupération des détails du traitement
  // Utilisation du hook personnalisé pour obtenir les détails du traitement
  const {
    data: traitementsDetails,
    isLoading,
    error,
  } = useOneTraitement(param.id);
  // Récupération des détails de l'ordonnance associée
  const { data: traitementOrdonnance } = useTraitementOrdonnance(param.id);

  // -----------------------------------
  // Exporter le dossier médical
  // -----------------------------------
  const exportPDF = () => {
    const element = document.getElementById('dossierMedical');
    const opt = {
      filename: 'dossierMedical.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .catch((err) => console.error('Error generating PDF:', err));
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Traitements' breadcrumbItem='Dossier Médicale' />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className='d-flex gap-1 justify-content-around align-items-center'>
                    <Button
                      color='info'
                      className='add-btn'
                      id='create-btn'
                      onClick={reactToPrintFn}
                    >
                      <i className='fas fa-print align-center me-1'></i>{' '}
                      Imprimer
                    </Button>

                    <Button color='danger' onClick={exportPDF}>
                      <i className='fas fa-paper-plane  me-1 '></i>
                      Exporter en PDF
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {isLoading && <LoadingSpiner />}
          {error && (
            <div className='text-danger text-center'>
              Erreur lors de chargement des données
            </div>
          )}

          <div className='mx-5 my-4' id={'dossierMedical'} ref={contentRef}>
            {!error && !isLoading && (
              <Card
                style={{
                  boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                  borderRadius: '15px',
                  paddingLeft: '30px',
                }}
              >
                <Row>
                  <div>
                    <Col
                      style={{
                        background: 'rgb(1, 36, 72)',
                        margin: '0 20px',
                      }}
                    ></Col>
                  </div>
                  <Col sm='11'>
                    <CardBody>
                      <CardHeader
                        style={{ background: 'rgba(100, 169, 238, 0.5)' }}
                      >
                        <CardTitle className='text-center '>
                          <h2 className='fs-bold'>Dossier Médical </h2>
                          <h5>{hospitalName} </h5>
                          <p style={{ margin: '5px', fontSize: '10px' }}>
                            {hospitalAdresse}
                          </p>
                          <p style={{ margin: '5px', fontSize: '10px' }}>
                            {hospitalTel}
                          </p>
                        </CardTitle>
                      </CardHeader>

                      <Row>
                        {/* Coordonnées Personnelles */}
                        <Col sm='12' className='my-2'>
                          <CardTitle
                            style={{
                              margin: '5px 0',
                              padding: '5px',
                              background: 'rgba(100, 169, 238, 0.5)',
                            }}
                          >
                            Coordonnées Personnelle
                          </CardTitle>
                          <div className='d-flex justify-content-around'>
                            <CardText>
                              <strong> Nom et Prénom:</strong>{' '}
                              {capitalizeWords(
                                traitementsDetails?.patient['firstName']
                              )}{' '}
                              {capitalizeWords(
                                traitementsDetails?.patient['lastName']
                              )}
                            </CardText>

                            <CardText>
                              <strong> Sexe:</strong>{' '}
                              {capitalizeWords(
                                traitementsDetails?.patient['gender']
                              )}
                            </CardText>
                            <CardText>
                              <strong> Age:</strong>{' '}
                              {traitementsDetails?.patient['age']
                                ? capitalizeWords(
                                    traitementsDetails?.patient['age']
                                  )
                                : '------'}
                            </CardText>
                          </div>
                          <div className='d-flex justify-content-around'>
                            <CardText>
                              <strong> Adresse Domocile:</strong>{' '}
                              {capitalizeWords(
                                traitementsDetails?.patient['adresse']
                              )}
                            </CardText>
                            <CardText>
                              <strong> Téléphone:</strong>{' '}
                              {traitementsDetails?.patient['phoneNumber']
                                ? formatPhoneNumber(
                                    traitementsDetails?.patient['phoneNumber']
                                  )
                                : '------'}
                            </CardText>
                            <CardText>
                              <strong> Ethnie:</strong>{' '}
                              {capitalizeWords(
                                traitementsDetails?.patient['ethnie']
                              )}
                            </CardText>
                          </div>
                          <CardText>
                            <strong> Groupe Sanguin:</strong>{' '}
                            {capitalizeWords(
                              traitementsDetails?.patient['groupeSanguin']
                            )}
                          </CardText>
                          <CardText className='d-flex align-items-end'>
                            <strong> Profession:</strong>{' '}
                            {traitementsDetails?.patient['profession'] ? (
                              capitalizeWords(
                                traitementsDetails?.patient['profession']
                              )
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>
                        </Col>

                        {/* Infos Traitement */}
                        <Col sm='12' className='my-1'>
                          <CardTitle
                            style={{
                              margin: '5px 0',
                              padding: '5px',
                              background: 'rgba(100, 169, 238, 0.5)',
                            }}
                          >
                            Information sur Traitement
                          </CardTitle>
                          <CardText>
                            <strong> Type de maladie:</strong>{' '}
                            {capitalizeWords(traitementsDetails?.motif)}{' '}
                          </CardText>
                          <CardText>
                            <strong>Début maladie:</strong>{' '}
                            {new Date(
                              traitementsDetails?.startDate
                            ).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                            {' au environ du: '}
                            {capitalizeWords(traitementsDetails?.startTime)}
                          </CardText>
                          <div className='d-flex justify-content-around'>
                            <CardText>
                              <strong> Tailles:</strong>{' '}
                              {traitementsDetails?.height
                                ? traitementsDetails?.height
                                : 0}{' '}
                              cm
                            </CardText>
                            <CardText>
                              <strong> Poids:</strong>{' '}
                              {traitementsDetails?.width
                                ? traitementsDetails?.width
                                : 0}{' '}
                              k
                            </CardText>
                          </div>
                          <CardText className='d-flex align-items-end'>
                            <strong> NC:</strong>{' '}
                            {traitementsDetails?.nc ? (
                              capitalizeWords(traitementsDetails?.nc)
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>
                          <CardText className='d-flex align-items-end'>
                            <strong> AC:</strong>{' '}
                            {traitementsDetails?.ac ? (
                              capitalizeWords(traitementsDetails?.ac)
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>
                          <CardText className='d-flex align-items-end'>
                            <strong> ASC:</strong>{' '}
                            {traitementsDetails?.asc ? (
                              capitalizeWords(traitementsDetails.asc)
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>

                          <CardText className='d-flex align-items-end'>
                            <strong className='me-3'>
                              {' '}
                              Résultat du traitement:{' '}
                            </strong>{' '}
                            {traitementsDetails?.result ? (
                              traitementsDetails?.result
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>

                          <CardText className='d-flex align-items-end'>
                            <strong className='me-3'> Observation:</strong>{' '}
                            {traitementsDetails?.observation ? (
                              traitementsDetails?.observation
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>
                          <CardText className='d-flex align-items-end'>
                            <strong className='me-3'> Diagnostic:</strong>{' '}
                            {traitementsDetails?.diagnostic ? (
                              traitementsDetails?.diagnostic
                            ) : (
                              <span
                                style={{
                                  border: '1px dotted black',
                                  height: '1px',
                                  width: '100%',
                                }}
                              ></span>
                            )}
                          </CardText>
                        </Col>

                        {/* Médecin soignant */}
                        <div
                          sm='12'
                          className='my-1 border border-top border-2 border-info'
                        >
                          <CardTitle
                            style={{
                              margin: '5px 0',
                              padding: '5px',
                              background: 'rgba(100, 169, 238, 0.5)',
                            }}
                          >
                            Médecins Soignant
                          </CardTitle>
                          <CardText>
                            <strong> Nom et Prénom:</strong>{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor?.firstName
                            )}{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor?.lastName
                            )}
                          </CardText>
                          <CardText>
                            <strong> Sexe:</strong>{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor?.gender
                            )}
                          </CardText>
                          <CardText>
                            <strong> Spécialité:</strong>{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor?.speciality
                            )}
                          </CardText>
                          <CardText>
                            <strong> Téléphone:</strong>{' '}
                            {formatPhoneNumber(
                              traitementsDetails?.doctor?.phoneNumber
                            )}
                          </CardText>
                        </div>
                      </Row>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            )}
          </div>

          <hr />

          <OrdonnancePaper ordonnanceId={traitementOrdonnance?._id} />
        </Container>
      </div>
    </React.Fragment>
  );
}
