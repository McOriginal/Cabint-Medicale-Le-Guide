import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import patientImg1 from './../../assets/images/patient1.jpg';
import patientImg2 from './../../assets/images/patient2.jpg';
import patientImg3 from './../../assets/images/patient3.jpg';
import { useAllPatients } from '../../Api/queriesPatient';

export default function TotalPatients() {
  const patientImages = [patientImg1, patientImg2, patientImg3];
  const patientRandomImages =
    patientImages[Math.floor(Math.random() * patientImages.length)];

  // Importing the useAllPatients hook to fetch patient data
  const {
    data: patientData,
    isLoading: patientLoading,
    error: patientError,
  } = useAllPatients();

  return (
    <div>
      {patientLoading && <LoadingSpiner />}
      {!patientError && !patientLoading && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={patientRandomImages}
            alt='Patients'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Patients:{' '}
              <span className='text-info fs-5'>{patientData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
