import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

import { useTranslation } from 'react-i18next';
import './StatsCard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsCard() {
  const { t } = useTranslation('sidebar');
  const primaryColor = 'rgb(5, 40, 106)';
  const textColor = 'rgba(0, 0, 0, 0.7)';
  
  // Hardcoded data to replace the Strapi API call
  const [chartData] = useState({
    bar: {
      title: "Statistique",
      labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
      datasetLabel: "Projets",
      data: [6780000, 7890000, 8900000, 9900000, 11000000, 13000000],
      color: "#4285F4",
    },
    pie: {
      title: "Ressources Allouées",
      labels: ["Développement", "Marketing", "Recherche", "Opérations"],
      datasetLabel: "Projets",
      data: [5000000, 3000000, 2000000, 1000000],
      colors: ["#34A853", "#F4B400", "#DB4437", "#4285F4"],
    },
  });

  const [isBarHovered, setIsBarHovered] = useState(false);
  const [isPieHovered, setIsPieHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const barData = {
    labels: chartData.bar.labels,
    datasets: [
      {
        label: chartData.bar.datasetLabel,
        data: chartData.bar.data,
        backgroundColor: chartData.bar.color,
        borderColor: chartData.bar.color,
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: chartData.pie.labels,
    datasets: [
      {
        label: chartData.pie.datasetLabel,
        data: chartData.pie.data,
        backgroundColor: chartData.pie.colors,
        borderColor: chartData.pie.colors,
        borderWidth: 1,
      },
    ],
  };

  const barZeroData = {
    ...barData,
    datasets: [{ ...barData.datasets[0], data: barData.datasets[0].data.map(() => 0) }],
  };

  const pieZeroData = {
    ...pieData,
    datasets: [{ ...pieData.datasets[0], data: pieData.datasets[0].data.map(() => 0) }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          boxWidth: 20,
        },
      },
      title: {
        display: true,
      },
    },
    scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            callback: function(value) {
              return value / 1000000 + 'M';
            }
          },
        },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuad'
    }
  };

  const finalBarData = isDesktop && !isBarHovered ? barZeroData : barData;
  const finalPieData = isDesktop && !isPieHovered ? pieZeroData : pieData;

  return (
    <motion.div
      className="glass-card stats-card mb-4"
      style={{ borderTop: `15px solid ${primaryColor}` }}
    >
      <div
        className="card-header d-flex align-items-center justify-content-between"
        style={{
          backgroundColor: 'transparent',
          borderBottom: '1px solid red',
          color: primaryColor,
          padding: '0.25rem 1.5rem',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}
      >
        <span>{t('stats.title')}</span>
        <i className="bi bi-bar-chart-line fs-4" style={{ color: primaryColor }}></i>
      </div>
      <div className="card-body p-2">
        <div 
          className="chart-container"
          style={{ height: '200px' }} 
          onMouseEnter={isDesktop ? () => setIsBarHovered(true) : null}
          onMouseLeave={isDesktop ? () => setIsBarHovered(false) : null}
        >
          <Bar 
            data={finalBarData} 
            options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: chartData.bar.title}}}}
          />
        </div>

        <hr className="chart-divider" />

        <div 
          className="chart-container"
          style={{ height: '200px' }} 
          onMouseEnter={isDesktop ? () => setIsPieHovered(true) : null}
          onMouseLeave={isDesktop ? () => setIsPieHovered(false) : null}
        >
          <Pie 
            data={finalPieData} 
            options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: chartData.pie.title}}}}
          />
        </div>
      </div>
    </motion.div>
  );
}