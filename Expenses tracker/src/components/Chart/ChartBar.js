import React from 'react';
import './ChartBar.css';

const ChartBar = function(props){

    // изначально высота блока 0
    let barFillHeight = '0%';

    // если задано максимальное значение
    if(props.maxValue > 0){
        // считаем высоту текущего значения относительно максимального
        barFillHeight = Math.round( (props.value / props.maxValue) * 100) + '%';
    }


    return <div className="chart-bar">
                <div className='chart-bar__inner'>
                    <div className='chart-bar__fill' style={{height: barFillHeight, }}></div>
                </div>
                <div className='chart-bar__label'>{props.label}</div>
           </div>
};

export default ChartBar;