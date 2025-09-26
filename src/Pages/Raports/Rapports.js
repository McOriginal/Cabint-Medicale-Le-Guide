import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import React from 'react';
import RaportsBarChart from './DataRaportsPatientTraitementOrdonnace';
import BarChartEntreSortie from './DataRaportsEntreSortie';
import SelectedMounthTotalTraitement from './SelectedMounthTotalTraitement';
import RapportByDay from './RapportByDay';
import RapportBySemaine from './RapportBySemaine';
import BarChartPatientsTraitement from './DataRaportsPatientsTraitement';
import BarChartApprovisonnement from './DataRaportsApprovisonnement';

const Rapports = () => {
  document.title = 'Raports | Centre de Santé - MARHABA ';
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid={true}>
          <Breadcrumbs title='Statistique' breadcrumbItem='Raports' />

          <Row>
            <Col sm={12}>
              <RapportByDay />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <RapportBySemaine />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <SelectedMounthTotalTraitement />
            </Col>

            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle>Entrée et Sortie</CardTitle>
                  <p className='card-title-desc'>
                    Le raports de Centre de Santé MARHABA vous permet de
                    visualiser les données statistiques concernant les
                    <span className='text-info'>
                      {' '}
                      Entrées, & Dépenses.
                    </span>{' '}
                    Vous pouvez également suivre l'évolution des revenus et des
                    dépenses mensuelles.
                  </p>
                  <BarChartEntreSortie />
                </CardBody>
              </Card>
            </Col>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle>Approvisonnement</CardTitle>

                  <BarChartApprovisonnement />
                </CardBody>
              </Card>
            </Col>

            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle>Rapports et Suivis</CardTitle>
                  <p className='card-title-desc'>
                    Le raports de Centre de Santé MARHABA vous permet de
                    visualiser les données statistiques concernant les
                    <span className='text-info'>
                      {' '}
                      traitements, les patients et les ordonnances.
                    </span>{' '}
                    Vous pouvez également suivre l'évolution des revenus
                    mensuels.
                  </p>
                  <RaportsBarChart />
                </CardBody>
              </Card>
            </Col>

            {/* -------------------- */}
            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle>Rapports et Suivis</CardTitle>
                  <p>
                    Rapport sur le nombre de{' '}
                    <strong>Patient et Traitement</strong>{' '}
                  </p>
                  <BarChartPatientsTraitement />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Rapports;
