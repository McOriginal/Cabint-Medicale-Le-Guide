import React from 'react';
import {
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
import { useOneOrdonnance } from '../../../Api/queriesOrdonnance';
import { useParams } from 'react-router-dom';

export default function DetailsOrdonnance() {
  const param = useParams();
  const {
    data: selectedOrdonnanceData,
    isLoading: isLoadingOrdonnance,
    error: ordonnanceError,
  } = useOneOrdonnance(param.id);

  return (
    <React.Fragment>
      <Container fluid>
        {/* // Ordonnance de Traitement */}
        {isLoadingOrdonnance && <LoadingSpiner />}
        {ordonnanceError && (
          <div className='text-danger text-center'>
            Erreur lors de chargement des données
          </div>
        )}

        {!ordonnanceError && !isLoadingOrdonnance && (
          <div
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
                      selectedOrdonnanceData?.trait?.patient?.firstName
                    )}{' '}
                    {capitalizeWords(
                      selectedOrdonnanceData?.trait?.patient?.lastName
                    )}
                  </CardText>
                  <CardText>
                    <strong> Sexe:</strong>{' '}
                    {capitalizeWords(
                      selectedOrdonnanceData?.trait?.patient?.gender
                    )}
                  </CardText>
                </div>

                <div className='my-3'>
                  <CardText className='d-flex justify-content-center align-items-center fs-5'>
                    <strong> Médicaments:</strong>
                  </CardText>
                  <ul className='list-unstyled'>
                    {selectedOrdonnanceData?.items.map((medi, index) => (
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
                    {formatPrice(selectedOrdonnanceData?.totalAmount)} FCFA
                  </CardText>
                  <CardText style={{ fontSize: '12px' }}>
                    <strong> Total Traitement: </strong>{' '}
                    {formatPrice(
                      selectedOrdonnanceData?.traitement?.totalAmount
                    )}{' '}
                    FCFA
                  </CardText>
                </div>
                <CardText className='text-center p-3'>
                  <strong> Total Général: </strong>{' '}
                  <span className='fs-5'>
                    {formatPrice(
                      selectedOrdonnanceData?.traitement?.totalAmount +
                        selectedOrdonnanceData?.totalAmount
                    )}{' '}
                    FCFA
                  </span>
                </CardText>
              </CardFooter>
            </Card>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
}
