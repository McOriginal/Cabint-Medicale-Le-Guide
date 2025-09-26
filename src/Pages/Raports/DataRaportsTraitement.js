import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';
import { Card, CardBody } from 'reactstrap';

Chart.register(CategoryScale);

const BarChartDataRaportsTraitement = () => {
  const { data: traitementsData = [] } = useAllTraitement();
  const { data: ordonnanceData = [] } = useAllOrdonnances();

  const sumTotalItemsByMonth = (items) => {
    const monthlySums = new Array(12).fill(0);
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlySums[month] += 1;
      }
    });
    return monthlySums;
  };

  const labels = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Jui',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Traitements',
        data: sumTotalItemsByMonth(traitementsData),
        backgroundColor: ' #FFD63A',
        barThickness: 10,
      },
      {
        label: 'Ordonnances',
        data: sumTotalItemsByMonth(ordonnanceData),
        backgroundColor: ' #102E50',
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#102E50',
          boxWidth: 20,
          boxHeight: 20,
        },
      },
      title: {
        display: true,
        text: 'Statistiques des Traitements, Patients',
        color: '#102E50',
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    animationSteps: 60,
    animationEasing: 'easeInOutQuart',
    responsiveAnimationDuration: 500,

    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#686868',
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          color: '#7b919e',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <React.Fragment>
      <Card>
        <div className='card-header'>
          <h4 className='card-title mb-0'>Rapport du Traitements</h4>
        </div>
        <CardBody>
          <Bar width={537} height={268} data={data} options={options} />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default BarChartDataRaportsTraitement;
