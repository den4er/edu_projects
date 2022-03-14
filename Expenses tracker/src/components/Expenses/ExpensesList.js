import React from 'react';
import ExpenseItem from './ExpenseItem.js';
import './ExpensesList.css';

const ExpensesList = function(props){

    // если элементов для вывода нет, выводим строку
    if(props.items.length === 0){
        return <h2 className='expenses-list__fallback'>No expenses found</h2>
    }
    // если элементы есть, формируем массив компонентов и выводим
    return <ul className="expenses-list">
            {props.items.map( (item) => {
                return <ExpenseItem key={item.id} title={item.title} amount={item.amount} date={item.date}/>
            })}
         </ul>

};

export default ExpensesList;