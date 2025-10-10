import React, { useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Container,
} from 'reactstrap';
import {
  capitalizeWords,
  formatPrice,
} from '../../components/capitalizeFunction';
import {
  hospitalAdresse,
  hospitalName,
  hospitalTel,
  logoMedical,
} from '../../CompanyInfo/CompanyInfo';
import LoadingSpiner from '../../components/LoadingSpiner';
import html2pdf from 'html2pdf.js';

import { useOneOrdonnance } from '../../../Api/queriesOrdonnance';
import { useParams } from 'react-router-dom';
import PaiementsHistorique from '../PaiementsHistorique/PaiementsHistorique';
import { useReactToPrint } from 'react-to-print';

export default function DetailsOrdonnance() {
  const param = useParams();
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const {
    data: selectedOrdonnanceData,
    isLoading: isLoadingOrdonnance,
    error: ordonnanceError,
  } = useOneOrdonnance(param.id);

  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportToPDF = () => {
    const element = document.getElementById('ordonnanceMedical');
    const opt = {
      filename: 'ordonnanceMedical.pdf',
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
          <div className='d-flex gap-1 justify-content-around align-items-center w-100'>
            <Button
              color='info'
              className='add-btn'
              id='create-btn'
              onClick={reactToPrintFn}
            >
              <i className='fas fa-print align-center me-1'></i> Imprimer
            </Button>

            <Button color='danger' onClick={exportToPDF}>
              <i className='fas fa-paper-plane  me-1 '></i>
              Télécharger en PDF
            </Button>
          </div>

          {isLoadingOrdonnance && <LoadingSpiner />}
          {ordonnanceError && (
            <div className='text-danger text-center'>
              Erreur lors de chargement des données
            </div>
          )}
          <div
            className='mx-5 d-flex justify-content-center'
            ref={contentRef}
            id='ordonnanceMedical'
          >
            {!ordonnanceError && !isLoadingOrdonnance && (
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
                      {new Date(
                        selectedOrdonnanceData?.createdAt
                      ).toLocaleDateString()}
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
                        selectedOrdonnanceData?.traitements?.patient?.firstName
                      )}{' '}
                      {capitalizeWords(
                        selectedOrdonnanceData?.traitements?.patient?.lastName
                      )}
                    </CardText>
                    <CardText>
                      <strong> Sexe:</strong>{' '}
                      {capitalizeWords(
                        selectedOrdonnanceData?.traitements?.patient?.gender
                      )}
                    </CardText>
                  </div>

                  <div className='my-3'>
                    <CardText className='d-flex justify-content-center align-items-center fs-5'>
                      <strong> Médicaments:</strong>
                    </CardText>
                    <ul className='list-unstyled'>
                      {selectedOrdonnanceData?.ordonnances?.items?.map(
                        (item) => (
                          <li
                            key={item._id}
                            className='border-2 border-grey border-bottom py-2'
                          >
                            <strong>
                              {formatPrice(item?.quantity)} {' => '}
                            </strong>
                            {capitalizeWords(item?.medicaments?.name)}
                            <span className='mx-2'>
                              {' '}
                              {capitalizeWords(` ----> ${item.protocole}`)}
                            </span>
                            <strong className='ms-4 text-dark'>
                              {' '}
                              {formatPrice(
                                item?.customerPrice || item?.medicaments?.price
                              ) +
                                'f x ' +
                                item?.quantity}
                              {' = '}
                            </strong>
                            <strong className='ms-4 text-primary'>
                              {' '}
                              {formatPrice(
                                item?.customerPrice * item?.quantity ||
                                  item?.medicaments?.price * item?.quantity
                              )}{' '}
                              F
                            </strong>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </CardBody>

                <CardFooter>
                  <CardText className='text-center p-3'>
                    <strong> Montant Total: </strong>{' '}
                    <span className='fs-5'>
                      {formatPrice(
                        selectedOrdonnanceData?.traitements?.totalAmount +
                          selectedOrdonnanceData?.ordonnances?.totalAmount
                      )}{' '}
                      FCFA
                    </span>
                  </CardText>
                </CardFooter>
              </Card>
            )}
          </div>
        </Container>
        {/* -------------------------------------------------------------- */}
        <PaiementsHistorique />
      </div>
    </React.Fragment>
  );
}
