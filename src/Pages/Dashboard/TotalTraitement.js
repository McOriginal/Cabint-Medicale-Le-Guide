import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import t1 from './../../assets/images/t1.jpg';
import t2 from './../../assets/images/t2.jpg';

import { useAllTraitement } from '../../Api/queriesTraitement';

export default function TotalTraitement() {
  const traitementImages = [t1, t2];

  const traitementRandomImages =
    traitementImages[Math.floor(Math.random() * traitementImages.length)];

  // Traitement Data
  const {
    data: traitementData,
    isLoading: loadingTraitement,
    error: traitementError,
  } = useAllTraitement();

  return (
    <div>
      {loadingTraitement && <LoadingSpiner />}
      {!traitementError && !loadingTraitement && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={traitementRandomImages}
            alt='Traitements'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Traitements:{' '}
              <span className='text-info fs-5'>{traitementData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
