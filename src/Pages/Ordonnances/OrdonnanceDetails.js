import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Modal,
} from 'reactstrap';
import { useOneOrdonnance } from '../../Api/queriesOrdonnance';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import html2pdf from 'html2pdf.js';
import {
  hospitalAdresse,
  hospitalName,
  hospitalTel,
  logoMedical,
} from '../Logo/logo';

const OrdonnanceDetails = ({
  show_modal,
  tog_show_modal,
  selectedOrdonnanceID,
}) => {
  const {
    data: selectedOrdonnance,
    error,
    isLoading,
  } = useOneOrdonnance(selectedOrdonnanceID);

  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportPDFOrdonnance = () => {
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
    <Modal
      isOpen={show_modal}
      toggle={() => {
        tog_show_modal();
      }}
      size={'lg'}
      scrollable={true}
      centered={true}
    >
      {/* ---- Modal Header */}
      <div className='modal-header'>
        <div className='d-flex gap-1 justify-content-around align-items-center w-100'>
          <Button
            color='info'
            className='add-btn'
            id='create-btn'
            onClick={handlePrintOrdonnance}
          >
            <i className='fas fa-print align-center me-1'></i> Imprimer
          </Button>

          <Button color='danger' onClick={exportPDFOrdonnance}>
            <i className='fas fa-paper-plane  me-1 '></i>
            Exporter en PDF
          </Button>
        </div>

        <button
          type='button'
          onClick={() => tog_show_modal()}
          className='close'
          data-dismiss='modal'
          aria-label='Close'
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>

      {/* Modal Body */}
      <div className='modal-body'>
        {!error && !isLoading && (
          <div
            className='mx-5 d-flex justify-content-center'
            id={'ordonnanceMedical'}
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
                <CardHeader style={{ background: 'rgba(100, 169, 238, 0.5)' }}>
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
                      selectedOrdonnance?.ordonnances?.createdAt
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
                      selectedOrdonnance?.traitements?.patient?.firstName
                    )}{' '}
                    {capitalizeWords(
                      selectedOrdonnance?.traitements?.patient?.lastName
                    )}
                  </CardText>
                  <CardText>
                    <strong> Sexe:</strong>{' '}
                    {capitalizeWords(
                      selectedOrdonnance?.traitements?.patient?.gender
                    )}
                  </CardText>
                </div>

                <div className='my-3'>
                  <CardText className='d-flex justify-content-center align-items-center fs-5'>
                    <strong> Médicaments:</strong>
                  </CardText>
                  <ul className='list-unstyled'>
                    {selectedOrdonnance?.ordonnances?.items.map(
                      (medi, index) => (
                        <li
                          key={index}
                          className='border-2 border-grey border-bottom py-2  '
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
                      )
                    )}
                  </ul>
                </div>
              </CardBody>

              <CardFooter>
                <div className='d-flex justify-content-around align-item-center'>
                  <CardText style={{ fontSize: '12px' }}>
                    <strong> Total Médicaments: </strong>{' '}
                    {formatPrice(selectedOrdonnance?.ordonnances?.totalAmount)}{' '}
                    FCFA
                  </CardText>
                  <CardText style={{ fontSize: '12px' }}>
                    <strong> Total Traitement: </strong>{' '}
                    {formatPrice(selectedOrdonnance?.traitements?.totalAmount)}{' '}
                    FCFA
                  </CardText>
                </div>
                <CardText className='text-center p-3'>
                  <strong> Total Général: </strong>{' '}
                  <span className='fs-5'>
                    {formatPrice(
                      selectedOrdonnance?.traitements?.totalAmount +
                        selectedOrdonnance?.ordonnances?.totalAmount
                    )}{' '}
                    FCFA
                  </span>
                </CardText>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrdonnanceDetails;
