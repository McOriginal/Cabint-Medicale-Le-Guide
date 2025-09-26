import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';
import chamImg from './../../assets/images/chambre.jpg';
import { useAllChambres } from '../../Api/queriesChambre';

export default function TotalChambre() {
  // Fetch all chambres data
  const {
    data: chambreData,
    isLoading: chambreLoading,
    error: chambreError,
  } = useAllChambres();

  // Return the total number of chambres
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
            src={chamImg}
            alt='Chambres'
            style={{
              height: '90px',
              objectFit: 'cover',
              borderRadius: '7px 7px 0 0',
            }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Chambres:{' '}
              <span className='text-info fs-5'>{chambreData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
