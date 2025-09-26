import React, { useMemo } from 'react';
import { Card, Col, Row } from 'reactstrap';
import { useAllPaiements } from '../../Api/queriesPaiement';
import { useAllDepenses } from '../../Api/queriesDepense';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { formatPrice } from '../components/capitalizeFunction'; // Pour afficher les montants formatés
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';

const RapportBySemaine = () => {
  const { data: traitementsData = [] } = useAllTraitement();
  const { data: paiementsData = [] } = useAllPaiements();
  const { data: depenseData = [] } = useAllDepenses();
  const { data: ordonnancesData = [] } = useAllOrdonnances();

  // Calcule de la date pour le 7 dernier jours
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Calcul des totaux Nombre de Traitement pour le 7 dernier jour
  const recentTraitements = useMemo(
    () =>
      traitementsData.filter((item) => {
        const t = new Date(item.createdAt).getTime();
        return t >= sevenDaysAgo;
      }),
    [traitementsData, sevenDaysAgo]
  );
  // Calcul des totaux pour Traitements pour le 7 dernier jour
  const totalTraitementsNumber = recentTraitements.length;
  const totalTraitementAmount = recentTraitements.reduce(
    (acc, item) => acc + Number(item.totalAmount || 0),
    0
  );

  const recentOrdonnance = useMemo(
    () =>
      ordonnancesData.filter((item) => {
        const ord = new Date(item.createdAt).getTime();
        return ord >= sevenDaysAgo;
      }),
    [ordonnancesData, sevenDaysAgo]
  );
  // Calculer le Total des Ordonnances pour le mois sélectionné
  const totalOrdonnancesAmount = recentOrdonnance.reduce(
    (acc, item) => acc + Number(item.totalAmount || 0),
    0
  );

  // Recente Depense
  const recentPaiement = useMemo(
    () =>
      paiementsData.filter((item) => {
        const paie = new Date(item.paiementDate).getTime();
        return paie >= sevenDaysAgo;
      }),
    [paiementsData, sevenDaysAgo]
  );

  // Calculer le total de DEPENSE pour le 7 dernier jour
  const totalPaiements = recentPaiement.reduce(
    (acc, item) => acc + Number(item.totalAmount || 0),
    0
  );

  const recentDepense = useMemo(
    () =>
      depenseData.filter((item) => {
        const depen = new Date(item.dateOfDepense).getTime();
        return depen >= sevenDaysAgo;
      }),
    [depenseData, sevenDaysAgo]
  );
  // Calcul des totaux pour Paiements pour le mois sélectionné
  const totalDepenses = recentDepense.reduce(
    (acc, item) => acc + Number(item.totalAmount || 0),
    0
  );

  // Calculer Le revenu (Bénéfice) pour le mois sélectionné
  const profit = useMemo(() => {
    return totalPaiements - totalDepenses;
  }, [totalPaiements, totalDepenses]);

  return (
    <React.Fragment>
      <Card style={{ boxShadow: '0px 0px 10px rgba(123, 123, 123, 0.28)' }}>
        {/* Filtrage Bouton */}
        <Row>
          <Col md={8}>
            <h4 className='text-center mt-5' style={{ color: '#27548A' }}>
              Rapports de 7 Dernier Jours
            </h4>
          </Col>
        </Row>

        {/* Résultats */}
        <Row>
          {/* Bénefices */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #222831)',
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
                background: 'linear-gradient(to top right , #090979, #222831)',
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
                background: 'linear-gradient(to top right , #090979, #222831)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              {' '}
              <h4 className='mb-1' style={{ color: '#CB0404' }}>
                {formatPrice(totalDepenses)} F
              </h4>
              <p className='text-white'>
                Dépenses (Sortie)
                <i
                  className='fas fa-level-up-alt ms-2 fs-4'
                  style={{ color: '#CB0404' }}
                ></i>
              </p>
            </Card>{' '}
          </Col>

          {/* Traitements */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #222831)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='text-warning mb-1'>
                {formatPrice(totalTraitementAmount)} F
              </h4>
              <p className='text-warning mb-1'>
                Nombre: {totalTraitementsNumber}
              </p>
              <p className='text-white'>Traitements</p>
            </Card>{' '}
          </Col>

          {/* Total Ordonnances */}
          <Col sm={6} lg={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #222831)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='text-warning mb-1'>
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

export default RapportBySemaine;
