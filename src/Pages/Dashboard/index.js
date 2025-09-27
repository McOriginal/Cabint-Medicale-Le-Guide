import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { Row, Container, Col } from 'reactstrap';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import TotalFounisseurs from './TotalFournisseurs';
import TotalDoctors from './TotalDoctors';
import TotalPatients from './TotalPatients';
import TotalChambre from './TotalChambres';
import TotalBed from './TotalBed';
import TotalTraitement from './TotalTraitement';
import BarChartDataRaportsTraitement from '../Raports/DataRaportsTraitement';
import SelectedMounthTotalTraitement from './SelectedMounthTotalTraitement';
import { hospitalName } from '../CompanyInfo/CompanyInfo';

const Dashboard = () => {
  document.title = `Tableau de Bord ${hospitalName}`;

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid={true}>
          <Breadcrumbs title={hospitalName} breadcrumbItem='Tabelau de Bord' />

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Row>
              <Col sm={6} lg={4}>
                {/* Total Doctors */}
                <TotalDoctors />
              </Col>
              <Col sm={6} lg={4}>
                {/* Total Patients */}
                <TotalPatients />
              </Col>
              <Col sm={6} lg={4}>
                {/* Total Fournisseurs */}

                <TotalFounisseurs />
              </Col>
              <Col sm={6} lg={4}>
                {/* Total Lits */}

                <TotalBed />
              </Col>
              <Col sm={6} lg={4}>
                {/* Total Chambres */}

                <TotalChambre />
              </Col>

              <Col sm={6} lg={4}>
                {/* Total Traitements */}

                <TotalTraitement />
              </Col>
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Row style={{ margin: '50px auto' }}>
              <Col xl={8}>
                <BarChartDataRaportsTraitement />
              </Col>

              <Col xl={4}>
                {/* Filtre result by mounth */}
                <SelectedMounthTotalTraitement />
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
