import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Registramos los componentes de Chart.js que vamos a utilizar
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpensesChart = ({ chartData }) => {
    // Opciones de configuración para el gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
        plugins: {
            legend: {
                position: 'right', // Posición de la leyenda
            },
            title: {
                display: true,
                text: 'Distribución de Gastos por Categoría',
                font: {
                    size: 18,
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
        },
    };

    return (
        // Contenedor con altura definida para el gráfico
        <div className="relative h-64 md:h-80">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default ExpensesChart;
