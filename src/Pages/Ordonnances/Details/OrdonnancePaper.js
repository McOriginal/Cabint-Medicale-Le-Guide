import React, { useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardText,
  Container,
} from 'reactstrap';
import {
  capitalizeWords,
  formatPrice,
} from '../../components/capitalizeFunction';
import { bgLogo } from '../../CompanyInfo/CompanyInfo';
import LoadingSpiner from '../../components/LoadingSpiner';
import html2pdf from 'html2pdf.js';

import {
  useOneOrdonnance,
  useTraitementOrdonnance,
} from '../../../Api/queriesOrdonnance';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ProtocoleOrdonnance from './ProtocoleOrdonnance';
import OrdonnanceHeader from './OrdonnanceHeader';

export default function OrdonnancePaper({ ordonnanceId }) {
  const param = useParams();
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [tog_display_modal, set_tog_display_modal] = useState(false);
  const {
    data: selectedOrdonnanceData,
    isLoading: isLoadingOrdonnance,
    error: ordonnanceError,
  } = useOneOrdonnance(ordonnanceId || param.id);

  const { data: traitementOrdonnance } = useTraitementOrdonnance(param.id);

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

  const tog_modal = () => {
    set_tog_display_modal(!tog_display_modal);
  };

  const traitement = selectedOrdonnanceData?.traitement;
  const patient = selectedOrdonnanceData?.traitement?.patient;
  const doctor = selectedOrdonnanceData?.traitement?.doctor;

  return (
    <React.Fragment>
      <div className='page-content'>
        <ProtocoleOrdonnance
          tog_open_modal={tog_modal}
          ordonnance={traitementOrdonnance}
          display_modal={tog_display_modal}
          setClose_modal={set_tog_display_modal}
        />
        {/* -------------------------------------------------------------- */}
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

            <Button color='secondary' onClick={() => tog_modal()}>
              Protocole
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
                  width: '550px',
                  minHeight: '500px',
                  margin: '20px auto',
                  position: 'relative',
                }}
                className='text-info'
              >
                <CardBody className='text-info'>
                  <CardHeader>
                    <OrdonnanceHeader />
                  </CardHeader>
                  <div className='d-flex justify-content-between align-items-center my-3 '>
                    <div className='font-size-12'>
                      <p className='my-1'>
                        <strong> Nom:</strong>{' '}
                        {capitalizeWords(patient?.firstName)}{' '}
                      </p>
                      <p className='my-1'>
                        <strong> Prénom:</strong>{' '}
                        {capitalizeWords(patient?.lastName)}
                      </p>
                      <p className='my-1'>
                        <strong> Prescirpteur:</strong>{' '}
                        {capitalizeWords(
                          doctor?.firstName + ' ' + doctor?.lastName ||
                            '--------'
                        )}
                      </p>
                    </div>
                    <div className='font-size-12'>
                      <p className='my-1'>
                        <strong> Date:</strong>{' '}
                        {new Date(
                          selectedOrdonnanceData?.ordonnanceDate
                        ).toLocaleDateString('fr-Fr')}
                      </p>
                      <p className='d-flex justify-content-between align-items-center gap-3 my-1 '>
                        <span>
                          <strong>Sexe: </strong>{' '}
                          {capitalizeWords(patient?.gender)}
                        </span>

                        <span>
                          <strong>Age: </strong>
                          {patient?.age}
                        </span>
                      </p>
                      <p className='d-flex justify-content-between align-items-center gap-3 my-1 '>
                        <span>
                          <strong>Taille: </strong>{' '}
                          {traitement?.height || '----'}
                        </span>

                        <span>
                          <strong>Poids: </strong>
                          {traitement?.width || '----'}
                        </span>
                      </p>
                      <p className='d-flex justify-content-between align-items-center gap-3 my-1 '>
                        <span>
                          <strong>TA: </strong> {traitement?.tension || '----'}
                        </span>

                        <span>
                          <strong>T°: </strong>
                          {traitement?.temperature || '----'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className='my-3 position-relative'>
                    <img
                      src={bgLogo}
                      width={200}
                      style={{
                        position: 'absolute',
                        top: '10%',
                        left: '30%',
                        opacity: '0.3',
                      }}
                      alt='Logo'
                    />
                    <p
                      className='d-flex justify-content-center align-items-center fs-4 fw-bold my-2'
                      style={{ background: 'rgba(5, 47, 254, 0.22)' }}
                    >
                      <strong> Ordonnance:</strong>
                    </p>
                    <ul className='list-unstyled'>
                      {selectedOrdonnanceData?.items?.map((item, index) => (
                        <li
                          key={item._id}
                          className='border-2 border-grey border-bottom text-center py-2'
                        >
                          <p>
                            <strong>{index + 1}</strong>
                            {' : '}
                            {capitalizeWords(item?.medicaments?.name)}
                            <span className='mx-2'>
                              <strong>
                                {' ==> '} {formatPrice(item?.quantity)}
                              </strong>
                            </span>
                            <strong className='ms-4 text-primary'>
                              {' '}
                              {formatPrice(
                                item?.customerPrice * item?.quantity ||
                                  item?.medicaments?.price * item?.quantity
                              )}{' '}
                              F
                            </strong>
                          </p>
                          {capitalizeWords(
                            ` ----> ${item.protocole || '--------------'}`
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>

                <CardFooter>
                  <CardText className='text-center p-3'>
                    <strong> Montant Total: </strong>{' '}
                    <span className='fs-5'>
                      {formatPrice(
                        traitement?.totalAmount +
                          selectedOrdonnanceData?.totalAmount
                      )}{' '}
                      FCFA
                    </span>
                  </CardText>
                </CardFooter>
              </Card>
            )}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}
