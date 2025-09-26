import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import bed1 from './../../assets/images/bed1.jpg';
import bed2 from './../../assets/images/bed2.jpg';
import bed3 from './../../assets/images/bed3.jpg';
import { useAllChambres } from '../../Api/queriesChambre';

export default function TotalBed() {
  const bedImages = [bed1, bed2, bed3];

  // Select a random image from the bedImages array
  const bedRandomImage =
    bedImages[Math.floor(Math.random() * bedImages.length)];
  const totalLit = () => {
    if (chambreData && chambreData.length > 0) {
      return chambreData.reduce((total, item) => total + item.bedNumber, 0);
    }
    return 0;
  };

  // Fetch chambre data using a custom hook
  const {
    data: chambreData,
    isLoading: chambreLoading,
    error: chambreError,
  } = useAllChambres();

  // useAllChambres is assumed to be a custom hook that fetches chambre data
  return (
    <div>
      {chambreLoading && <LoadingSpiner />}
      {!chambreError && !chambreLoading && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={bedRandomImage}
            alt='Lit medical'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Total Lits: <span className='text-info fs-5'>{totalLit()}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
