import React, { useState } from 'react';

import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';
import './Expenses.css';
import ExpensesList from './ExpensesList.js';
import ExpensesChart from './ExpensesChart.js';

const Expenses = (props) => {

  // задаем начальное значение года и функцию для изменения
  const [filteredYear, setFilteredYear] = useState('2020');

  // создаем функцию, которая будет передана в дочерний компонент для получения данных
  const filterChangeHandler = function(selectedYear) {
    setFilteredYear(selectedYear); // обновляем текущее значение года
  };

  // фильтруем элементы по значению выбранного года
  const filteredExpenses = props.items.filter(item => item.date.toString().includes(filteredYear));



  return (
    <div>
      <Card className='expenses'>

        {/* в компоненте атрибутами передаем текущее значение года и функцию для получения новых данных */}
        <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler} />
        <ExpensesChart expenses={filteredExpenses}/>
        <ExpensesList items={filteredExpenses}/>

      </Card>
    </div>
  );
};

export default Expenses;
