import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import { useAllFournisseur } from '../../Api/queriesFournisseur';
import four1 from './../../assets/images/four1.jpg';
import four2 from './../../assets/images/four2.jpg';
import LoadingSpiner from '../components/LoadingSpiner';

export default function TotalFounisseurs() {
  const fournisseurImages = [four1, four2];

  const fournisseurRandomImages =
    fournisseurImages[Math.floor(Math.random() * fournisseurImages.length)];

  // Fournisseur Data
  const {
    data: fournisseurData,
    isLoading: fournisseurLoading,
    error: fournisseurError,
  } = useAllFournisseur();

  return (
    <div>
      {fournisseurLoading && <LoadingSpiner />}
      {!fournisseurError && !fournisseurLoading && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={fournisseurRandomImages}
            alt='Fournisseurs'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Fournisseurs:{' '}
              <span className='text-info fs-5'>{fournisseurData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
