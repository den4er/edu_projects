import React from 'react';
import Chart from   '../Chart/Chart.js';

const ExpensesChart = function(props){

    const chartDataPoints = [
        { label: 'Jan', value: 0, },
        { label: 'Feb', value: 0, },
        { label: 'Mar', value: 0, },
        { label: 'Apr', value: 0, },
        { label: 'May', value: 0, },
        { label: 'Jun', value: 0, },
        { label: 'Jul', value: 0, },
        { label: 'Aug', value: 0, },
        { label: 'Sep', value: 0, },
        { label: 'Okt', value: 0, },
        { label: 'Now', value: 0, },
        { label: 'Dec', value: 0, },
    ];

    // добавляем в массив месяцев value из массива с данными
    for( const expense of props.expenses ){
        const expenseMonth = expense.date.getMonth(); // получаем индекс месяца
        chartDataPoints[expenseMonth].value += expense.amount;
    }

    return <Chart dataPoints={chartDataPoints} />
};

export default ExpensesChart;