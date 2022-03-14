import React, { useState } from 'react';

import ExpenseForm from './ExpenseForm';
import './NewExpense.css';

const NewExpense = (props) => {

  const [isEditing, setIsEditing] = useState(false);


  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString()
    };
    props.onAddExpense(expenseData);

  };


  const startEditingHandler = function(){
    setIsEditing(true);
  };
  const stopEditingHandler = function(){
    setIsEditing(false);
  }

  return (
    <div className='new-expense'>
      {!isEditing && <button onClick={startEditingHandler}>Add new Expense</button>}
      {isEditing && <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} onCancelSaveData={stopEditingHandler}/>}
    </div>
  );
};

export default NewExpense;
