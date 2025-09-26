import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllPatients } from '../../Api/queriesPatient';
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';

Chart.register(CategoryScale);

const BarChartPatientTraitementOrdonnance = () => {
  const { data: traitementsData = [] } = useAllTraitement();
  const { data: patientData = [] } = useAllPatients();
  const { data: ordonnanceData = [] } = useAllOrdonnances();

  const countPatientsByMonth = (patients) => {
    const monthlyCounts = new Array(12).fill(0);
    patients.forEach((patient) => {
      const date = new Date(patient.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlyCounts[month]++;
      }
    });
    return monthlyCounts;
  };

  const sumTotalAmountByMonth = (items) => {
    const monthlySums = new Array(12).fill(0);
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlySums[month] += Number(item.totalAmount || 0);
      }
    });
    return monthlySums;
  };

  // const sumTotalTraitement = () => {
  //   return traitementsData.reduce((acc, traitement) => {
  //     acc += Number(traitement.totalAmount || 0);
  //     return acc;
  //   }, 0);
  // };

  // const sumTotalOrdonnance = () => {
  //   return ordonnanceData.reduce((acc, ordonnance) => {
  //     acc += Number(ordonnance.totalAmount || 0);
  //     return acc;
  //   }, 0);
  // };

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
        label: 'Patients',
        data: countPatientsByMonth(patientData),
        backgroundColor: ' #5F8B4C',
        barThickness: 10,
      },
      {
        label: `Traitements  `,
        data: sumTotalAmountByMonth(traitementsData),
        backgroundColor: ' #FFD63A',
        barThickness: 10,
      },

      {
        label: `Ordonnances`,
        data: sumTotalAmountByMonth(ordonnanceData),
        backgroundColor: ' #3A59D1',
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
        text: 'Statistiques des Patients, Traitements et Ordonnances',
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
          drawBorder: true,
        },
        ticks: {
          color: ' #102E50',
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          color: ' #3A59D1',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <React.Fragment>
      <Bar width={537} height={268} data={data} options={options} />
    </React.Fragment>
  );
};

export default BarChartPatientTraitementOrdonnance;
