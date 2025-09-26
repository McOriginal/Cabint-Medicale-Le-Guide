import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import { useAllDoctors } from '../../Api/queriesDoctors';
import doc1 from './../../assets/images/doc1.png';
import doc2 from './../../assets/images/doc2.png';
import doc3 from './../../assets/images/doc3.png';

export default function TotalDoctors() {
  const docImages = [doc1, doc2, doc3];
  const docRandomImages =
    docImages[Math.floor(Math.random() * docImages.length)];

  // Doctor Data
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useAllDoctors();

  return (
    <div>
      {doctorsLoading && <LoadingSpiner />}
      {!doctorsError && !doctorsLoading && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={docRandomImages}
            alt='doctors'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Médecins:{' '}
              <span className='text-info fs-5'>{doctorsData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
