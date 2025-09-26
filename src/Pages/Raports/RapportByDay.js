import React, { useState, useMemo } from 'react';
import { Card, CardBody, Col, Input, Row } from 'reactstrap';
import { useAllPaiements } from '../../Api/queriesPaiement';
import { useAllDepenses } from '../../Api/queriesDepense';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { formatPrice } from '../components/capitalizeFunction'; // Pour afficher les montants formatés
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';

const RapportByDay = () => {
  const { data: traitementsData = [] } = useAllTraitement();
  const { data: paiementsData = [] } = useAllPaiements();
  const { data: depenseData = [] } = useAllDepenses();
  const { data: ordonnancesData = [] } = useAllOrdonnances();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Calcul des totaux Nombre de Traitement pour le mois sélectionné
  const totalTraitementsNumber = useMemo(() => {
    return traitementsData.filter((item) => {
      const date = new Date(item.createdAt).toISOString().slice(0, 10);
      return date === selectedDate;
    }).length;
  }, [traitementsData, selectedDate]);

  // Calcul des totaux pour Traitements pour le mois sélectionné
  const totalTraitementAmount = useMemo(() => {
    return traitementsData.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().slice(0, 10);
      if (date === selectedDate) {
        acc += Number(item.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [traitementsData, selectedDate]);

  // Calculer le Total des Ordonnances pour le mois sélectionné
  const totalOrdonnancesAmount = useMemo(() => {
    return ordonnancesData.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().slice(0, 10);
      if (date === selectedDate) {
        acc += Number(item.totaAmount || 0);
      }
      return acc;
    }, 0);
  }, [ordonnancesData, selectedDate]);

  // Calcul des totaux pour Paiements pour le mois sélectionné
  const totalPaiements = useMemo(() => {
    return paiementsData.reduce((acc, item) => {
      const date = new Date(item.paiementDate).toISOString().slice(0, 10);
      if (date === selectedDate) {
        acc += Number(item.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [paiementsData, selectedDate]);

  // Calcul des totaux pour Dépenses pour le mois sélectionné
  const totalDepenses = useMemo(() => {
    return depenseData.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().slice(0, 10);
      if (date === selectedDate) {
        acc += Number(item.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [depenseData, selectedDate]);

  // Calculer Le revenu (Bénéfice) pour le mois sélectionné
  const profit = useMemo(() => {
    return totalPaiements - totalDepenses;
  }, [totalPaiements, totalDepenses]);

  return (
    <React.Fragment>
      <Card style={{ boxShadow: '0px 0px 10px rgba(123, 123, 123, 0.28)' }}>
        {/* Filtrage Bouton */}
        <Row>
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(1deg, #183B4E 0%, #27548A 100%)',
              }}
            >
              <CardBody>
                <h6 className='text-white text-center'>
                  Filtrage par une Data
                </h6>
                <div className='d-flex align-items-center justify-content-between mb-3'>
                  <Input
                    className='form-control serach'
                    type='date'
                    max={new Date().toISOString().split('T')[0]} // Limiter à la date actuelle
                    value={selectedDate} // Valeur par défaut à la date actuelle
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className='text-center text-white'></div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <h4 className='text-center mt-5' style={{ color: '#BE5B50' }}>
              Rapports Journalier
            </h4>
          </Col>
        </Row>

        {/* Résultats */}
        <Row>
          {/* Bénefices */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #4ED7F1, #309898)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              {' '}
              <h5 className='mb-1 text-white'>Bénéfice (Revenue)</h5>
              {profit <= 0 ? (
                <h4 className='text-danger'>{formatPrice(profit)} F</h4>
              ) : (
                <h4 className='text-success'>{formatPrice(profit)} F</h4>
              )}
            </Card>{' '}
          </Col>
          {/* Paiements */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #4ED7F1, #309898)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='mb-1' style={{ color: '#B6F500' }}>
                {formatPrice(totalPaiements)} F
              </h4>
              <p className='text-white'>
                Paiements (Entrée)
                <i
                  className='fas fa-level-down-alt ms-2 fs-4'
                  style={{ color: '#B6F500' }}
                ></i>
              </p>
            </Card>{' '}
          </Col>

          {/* Dépences */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #4ED7F1, #309898)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              {' '}
              <h4 className='mb-1' style={{ color: '#901E3E' }}>
                {formatPrice(totalDepenses)} F
              </h4>
              <p className='text-white'>
                Dépenses (Sortie)
                <i
                  className='fas fa-level-up-alt ms-2 fs-4'
                  style={{ color: '#901E3E' }}
                ></i>
              </p>
            </Card>{' '}
          </Col>

          {/* Traitements */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #4ED7F1, #309898)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='mb-1' style={{ color: '#222831' }}>
                {formatPrice(totalTraitementAmount)} F
              </h4>
              <p className='mb-1' style={{ color: '#222831' }}>
                Nombre: {totalTraitementsNumber}
              </p>
              <p className='text-white'>Traitements</p>
            </Card>{' '}
          </Col>

          {/* Total Ordonnances */}
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #4ED7F1, #309898)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='mb-1' style={{ color: '#222831' }}>
                {formatPrice(totalOrdonnancesAmount)} F
              </h4>

              <p className='text-white'>Ordonnances</p>
            </Card>{' '}
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
};

export default RapportByDay;
