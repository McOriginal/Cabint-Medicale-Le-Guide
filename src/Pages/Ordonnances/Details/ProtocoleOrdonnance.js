import React, { useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  Container,
  Modal,
} from 'reactstrap';
import {
  capitalizeWords,
  formatPrice,
} from '../../components/capitalizeFunction';
import {
  bgLogo,
  hospitalAdresse,
  hospitalLittleName,
  hospitalOwnerName,
  hospitalTel,
  logoMedical,
} from '../../CompanyInfo/CompanyInfo';
import LoadingSpiner from '../../components/LoadingSpiner';
import html2pdf from 'html2pdf.js';

import { useOneOrdonnance } from '../../../Api/queriesOrdonnance';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

export default function ProtocoleOrdonnance({
  display_modal,
  tog_open_modal,
  setClose_modal,
}) {
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
    const element = document.getElementById('protocole');
    const opt = {
      filename: 'protocole.pdf',
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

  const traitement = selectedOrdonnanceData?.traitement;
  const patient = selectedOrdonnanceData?.traitement?.patient;
  const doctor = selectedOrdonnanceData?.traitement?.doctor;

  return (
    <Modal
      isOpen={display_modal}
      toggle={() => {
        tog_open_modal();
      }}
      size='lg'
      scrollable={true}
      centered={true}
      backdrop='static'
    >
      <div className='modal-header'>
        <h5 className='modal-title mt-0'>Protocole de Traitement</h5>
        <button
          type='button'
          onClick={() => setClose_modal(false)}
          className='close'
          data-dismiss='modal'
          aria-label='Close'
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div className='modal-body'>
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
          id='protocole'
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
            >
              <CardBody>
                <CardHeader>
                  <CardImg
                    src={logoMedical}
                    style={{
                      width: '100px',
                      position: 'absolute',
                      top: '30px',
                      left: '10px',
                    }}
                  />
                  <div className='text-center text-info fw-bold '>
                    <h2 className='text-info fw-bold'>CABINET MEDICAL </h2>
                    <h2 className='text-info fw-bold'>
                      "{hospitalLittleName}"{' '}
                    </h2>
                    <p
                      style={{
                        margin: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {hospitalOwnerName}
                    </p>
                    <p style={{ margin: '5px', fontSize: '10px' }}>
                      {hospitalTel}
                    </p>
                    <p style={{ margin: '5px', fontSize: '10px' }}>
                      {hospitalAdresse}
                    </p>
                  </div>

                  <CardImg
                    src={logoMedical}
                    style={{
                      width: '100px',
                      position: 'absolute',
                      top: '30px',
                      right: '10px',
                    }}
                  />
                </CardHeader>

                <div className='d-flex justify-content-between align-items-center my-3 '>
                  <div className='font-size-12'>
                    <p className='my-1'>
                      <strong> Nom:</strong>{' '}
                      {capitalizeWords(
                        patient?.firstName + ' ' + patient?.lastName
                      )}{' '}
                    </p>
                    <p className='my-1'>
                      <strong> Prénom:</strong>{' '}
                      {capitalizeWords(patient?.gender)}
                    </p>
                    <p className='my-1'>
                      <strong> Diagnostic:</strong>{' '}
                      {capitalizeWords(traitement?.diagnostic || '----')}
                    </p>
                  </div>
                  <div>
                    <p className='my-1'>
                      <strong> Médecin:</strong>{' '}
                      {capitalizeWords(
                        doctor?.firstName + ' ' + doctor?.lastName
                      )}{' '}
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
                      opacity: '0.1',
                    }}
                    alt='Logo'
                  />
                  <p
                    className='d-flex justify-content-center align-items-center fs-4 fw-bold my-2'
                    style={{ background: 'rgba(5, 47, 254, 0.1)' }}
                  >
                    <strong> Protocole de Traitement:</strong>
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
                        </p>
                        {capitalizeWords(` ----> ${item.protocole}`)}
                        <p></p>{' '}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardBody>

              <CardFooter>
                <p className='my-1'>
                  <strong> Date:</strong>{' '}
                  {new Date(
                    selectedOrdonnanceData?.ordonnanceDate
                  ).toLocaleDateString('fr-Fr')}
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
}
