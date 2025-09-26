import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
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
  formatPrice,
} from '../components/capitalizeFunction';
import { useParams } from 'react-router-dom';
import React from 'react';
import { useTraitementOrdonnance } from '../../Api/queriesOrdonnance';
import html2pdf from 'html2pdf.js';
import {
  hospitalAdresse,
  hospitalName,
  hospitalTel,
  logoMedical,
} from '../Logo/logo';

export default function TraitementDetails() {
  const { id } = useParams();
  // Récupération des détails du traitement
  // Utilisation du hook personnalisé pour obtenir les détails du traitement
  const { data: traitementsDetails, isLoading, error } = useOneTraitement(id);
  // Récupération des détails de l'ordonnance associée
  const {
    data: traitementOrdonnance,
    isLoading: isLoadingOrdonnance,
    error: ordonnanceError,
  } = useTraitementOrdonnance(id);

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

  // -----------------------------------
  // Imprimer le dossier médical
  // -----------------------------------
  const handlePrint = () => {
    const content = document.getElementById('dossierMedical');
    const printWindow = window.open('', '', 'width=800,height=600');

    // Récupère tous les <style> et <link rel="stylesheet">
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression du Dossier Médical</title>
          ${styles}
          <style>
            @media print {
              body {
                margin: 20px;
              }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportPDFOrdonnance = () => {
    const element = document.getElementById('ordonnaceMedical');
    const opt = {
      filename: 'ordonnaceMedical.pdf',
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

  // -----------------------------------------
  // -----------------------------------------
  // Impression
  // -----------------------------------------
  // -----------------------------------------

  const handlePrintOrdonnance = () => {
    const content = document.getElementById('ordonnanceMedical');
    // Ouvre une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=800,height=600');

    // Récupère tous les <style> et <link rel="stylesheet">
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('');

    printWindow.document.write(`
    <html>
      <head>
        <title>Impression d'Ordonnance</title>
        ${styles}
        <style>
          @media print {
            body {
              margin: 20px;
            }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
                      onClick={handlePrint}
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

          {!error && !isLoading && (
            <div className='mx-5' id={'dossierMedical'}>
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
                              traitementsDetails?.doctor['firstName']
                            )}{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor['lastName']
                            )}
                          </CardText>
                          <CardText>
                            <strong> Sexe:</strong>{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor['gender']
                            )}
                          </CardText>
                          <CardText>
                            <strong> Spécialité:</strong>{' '}
                            {capitalizeWords(
                              traitementsDetails?.doctor['speciality']
                            )}
                          </CardText>
                          <CardText>
                            <strong> Téléphone:</strong>{' '}
                            {formatPhoneNumber(
                              traitementsDetails?.doctor['phoneNumber']
                            )}
                          </CardText>
                        </div>
                      </Row>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          <hr />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className='d-flex gap-1 justify-content-around align-items-center'>
                    <Button
                      color='info'
                      className='add-btn'
                      id='create-btn'
                      onClick={handlePrintOrdonnance}
                    >
                      <i className='fas fa-print align-center me-1'></i>{' '}
                      Imprimer
                    </Button>

                    <Button color='danger' onClick={exportPDFOrdonnance}>
                      <i className='fas fa-paper-plane  me-1 '></i>
                      Exporter en PDF
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* // Ordonnance de Traitement */}
          {isLoadingOrdonnance && <LoadingSpiner />}
          {error && (
            <div className='text-danger text-center'>
              Erreur lors de chargement des données
            </div>
          )}

          {!ordonnanceError &&
            !isLoadingOrdonnance &&
            traitementOrdonnance.ordonnances?.ordonnance.length > 0 &&
            traitementOrdonnance.ordonnances?.ordonnance.map((ordo) => (
              <div
                key={ordo?._id}
                className='mx-5 d-flex justify-content-center'
                id={'ordonnaceMedical'}
              >
                <Card
                  style={{
                    boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                    borderRadius: '15px',
                    width: '583px',
                    // height: '827px',
                    margin: '20px auto',
                    position: 'relative',
                  }}
                >
                  <CardBody>
                    <CardHeader
                      style={{ background: 'rgba(100, 169, 238, 0.5)' }}
                    >
                      <CardImg
                        src={logoMedical}
                        style={{
                          width: '70px',
                          position: 'absolute',
                          top: '30px',
                          left: '10px',
                        }}
                      />
                      <CardTitle className='text-center '>
                        <h2 className='fs-bold'>Ordonnance Médical </h2>
                        <h5>{hospitalName} </h5>
                        <p style={{ margin: '15px', fontSize: '10px' }}>
                          {hospitalAdresse}
                        </p>
                        <p style={{ margin: '15px', fontSize: '10px' }}>
                          {hospitalTel}
                        </p>
                      </CardTitle>
                      <CardText>
                        <strong> Date d'Ordonnance:</strong>{' '}
                        {new Date(ordo?.createdAt).toLocaleDateString()}
                      </CardText>
                      <CardImg
                        src={logoMedical}
                        style={{
                          width: '70px',
                          position: 'absolute',
                          top: '30px',
                          right: '10px',
                        }}
                      />
                    </CardHeader>

                    <div
                      sm='12'
                      className='my-2 px-2 border border-top border-info rounded rounded-md'
                    >
                      <CardText>
                        <strong> Nom et Prénom:</strong>{' '}
                        {capitalizeWords(
                          traitementOrdonnance?.ordonnances?.trait?.patient
                            ?.firstName
                        )}{' '}
                        {capitalizeWords(
                          traitementOrdonnance?.ordonnances?.trait?.patient
                            ?.lastName
                        )}
                      </CardText>
                      <CardText>
                        <strong> Sexe:</strong>{' '}
                        {capitalizeWords(
                          traitementOrdonnance?.ordonnances?.trait?.patient
                            ?.gender
                        )}
                      </CardText>
                    </div>

                    <div className='my-3'>
                      <CardText className='d-flex justify-content-center align-items-center fs-5'>
                        <strong> Médicaments:</strong>
                      </CardText>
                      <ul className='list-unstyled'>
                        {ordo?.items.map((medi, index) => (
                          <li
                            key={index}
                            className='border-2 border-grey border-bottom py-2'
                          >
                            <strong>
                              {formatPrice(medi?.quantity)} {' => '}
                            </strong>
                            {capitalizeWords(medi?.medicaments?.name)}
                            <span className='mx-2'>
                              {' '}
                              {capitalizeWords(' -------------------------- ')}
                            </span>
                            <strong className='ms-4 text-dark'>
                              {' '}
                              {formatPrice(
                                medi?.customerPrice || medi?.medicaments?.price
                              ) +
                                'f x ' +
                                medi?.quantity}
                              {' = '}
                            </strong>
                            <strong className='ms-4 text-primary'>
                              {' '}
                              {formatPrice(
                                medi?.customerPrice * medi?.quantity ||
                                  medi?.medicaments?.price * medi?.quantity
                              )}{' '}
                              F
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardBody>

                  <CardFooter>
                    <div className='d-flex justify-content-around align-item-center'>
                      <CardText style={{ fontSize: '12px' }}>
                        <strong> Total Médicaments: </strong>{' '}
                        {formatPrice(ordo?.totalAmount)} FCFA
                      </CardText>
                      <CardText style={{ fontSize: '12px' }}>
                        <strong> Total Traitement: </strong>{' '}
                        {formatPrice(ordo?.traitement?.totalAmount)} FCFA
                      </CardText>
                    </div>
                    <CardText className='text-center p-3'>
                      <strong> Total Général: </strong>{' '}
                      <span className='fs-5'>
                        {formatPrice(
                          ordo?.traitement?.totalAmount + ordo?.totalAmount
                        )}{' '}
                        FCFA
                      </span>
                    </CardText>
                  </CardFooter>
                </Card>
              </div>
            ))}
        </Container>
      </div>
    </React.Fragment>
  );
}
