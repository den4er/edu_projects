'use strict';

/**
 * 
 * 
 * 
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
 * 
 * 
 * 
 * 
 */


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');





// отображаем операции в приложении
const displayMovements = function(movements, sort = false){

  containerMovements.innerHTML = ''; // очищаем внутренности элемента

  const movs = sort ? movements.slice().sort((a,b) => a - b): movements;

  // перебираем массив 
  movs.forEach(function(mov, i){
    
    const type = mov > 0 ? 'deposit' : 'withdrawal'; // формируем тип операции

    // формируем html элемент
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>`;

    // помещаем элемент после открывающего тега
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};





// считаем сумму баланса из операций                                                                                                                                                              
const calcDisplayBalance = function(acc){

  // считаем итоговый баланс и кладем в переменную
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance; // текущий баланс записываем в свойство объекта
  // выводим баланс на страницу
  labelBalance.textContent = `${balance} €`;

}; 





// функция для создания логинов из полных имен
const createUserNames = function(accs){

  // перебираем элементы массива с аккаунтами 
  accs.forEach( function(acc){
    // записываем в новые свойства объектов полученные при трансформации логины
    acc.userName = acc.owner.split(' ').map(value => value[0]).join('').toLowerCase();
  });
  
}; createUserNames(accounts);



/*
*
* считаем общие пополнения, снятия
*
*/
const calcDisplaySummary = function (movements, interestRate) {

  // приход
  const incomes = Math.floor(movements
    .filter(mov => mov > 0) // отбираем только пополнения
    .reduce((acc, curr) => acc + curr)); // суммируем
  labelSumIn.textContent = `${incomes} €`; // выводим на страницу

  // расход
  const outcomes = Math.floor(movements
    .filter(mov => mov < 0) // отбираем только снятия
    .reduce((acc, curr) => acc + curr, 0)); // суммируем
  labelSumOut.textContent = `${Math.abs(outcomes)} €`; // выводим

  // накопленные проценты
  const interest = movements
    .filter(mov => mov > 0)       // берем только значения больше нуля
    .map(deposit => (deposit * interestRate) / 100) // в депозит записываем проценты от каждой операции
    .filter(percent => percent > 1)  // банк начисляет проценты только если она больше 1 евро
    .reduce((acc, curr) => acc + curr, 0); // складываем проценты по каждой операции

  labelSumInterest.textContent = `${interest} €`;
};


/**
 * 
 *  обновление пользовательского интерфейса
 * 
 */

const updateUI = function(acc){
  calcDisplayBalance(acc); // отображаем итоговый баланс
  displayMovements(acc.movements); // отображаем движения по счету
  calcDisplaySummary(acc.movements, acc.interestRate); // отображаем данные по счету
}



/**
 * 
 *  обработчик события при залогинивании
 * 
 */
let currentAccount; // переменная текущего аккаунта

btnLogin.addEventListener('click', function(event){
  event.preventDefault(); // предотвращаем стандартное поведение - отправку формы и перезагрузку страницы

  // ищем введенный логин в массиве
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

  // если свойство pin существует и данные совпадают с введенными
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('correct user');

    containerApp.style.opacity = 1; // выставляем непрозраность 100 у основного контейнера
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`; // выводим сообщение с именем
    inputLoginUsername.value = inputLoginPin.value = ''; // очищаем поля ввода
    inputLoginPin.blur(); // убираем фокус с инпута

    updateUI(currentAccount);

  } else {
    console.log('Неверные логин или пароль');
  }
});



/**
 * 
 *  перевод денег на другой аккаунт 
 * 
 */
btnTransfer.addEventListener('click', function(event){
  event.preventDefault();

  // получаем объект аккаунта кому переводим
  const receiverAcc = accounts.find( acc => acc.userName === inputTransferTo.value); 
  const amount = Number(inputTransferAmount.value); // сколько переводить

  if(amount > 0 &&  // если введенная сумма для перевода больше 0
    currentAccount.balance >= amount && // и баланс текущего акаунта больше или равен сумме перевода
    receiverAcc &&  // и если аккаунт получателя существует
    receiverAcc !== currentAccount) // и если аккаунт для перевода не равен текущему аккаунту
  {

    currentAccount.movements.push(-amount); // добавляем операцию списания в текущем аккаунте
    receiverAcc.movements.push(amount); // добавляем операцию пополнения у получателя

    //****************************************************** */
    
    updateUI(currentAccount); // обновляем данные по счету на странице

    console.log('transfer valid');
  } else {
    console.log('invalid data');
  }

  inputTransferTo.value = inputTransferAmount.value = ''; // очищаем поля

});


/**
 * 
 * 
 *  запрос кредита
 * 
 */

btnLoan.addEventListener('click', function(event){
  event.preventDefault();

  const amount = Math.abs(Number(inputLoanAmount.value));

  if(amount > 0 && // если сумма больше 0 
    currentAccount.movements.some(mov => mov >= amount / 10)) // и есть хоть одна операция больше 10% от запрашиваемой суммы
  {
    console.log(amount);
    currentAccount.movements.push(amount); // добавляем 
    inputLoanAmount.value = '';
  }
  else{
    console.log('error');
  }

  // обновление интерфейса
  updateUI(currentAccount);

});



/**
 * 
 * закрытие счета
 * 
 */

btnClose.addEventListener('click', function(event){
  
  // inputCloseUsername поле ввода логина
  // inputClosePin поле ввода пароля

  event.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.userName && // если введенный логин совпадает с текущим
    Number(inputClosePin.value) === currentAccount.pin) // и пин тоже введен верно
  {
    // перебираем все аккаунты и ищем элемент с логином текущего аккаунта. метод возвращает индекс найденного элемента
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    console.log(index);

    accounts.splice(index, 1); // вырезаем элемент с найденным индексом

  } else {
    console.log('error');
  }

  inputCloseUsername.value = inputClosePin.value = ''; // очищаем поля ввода
  containerApp.style.opacity = 0; // скрываем контейнер приложения
  labelWelcome.textContent = 'Log in to get started'; // возвращаем первоначальное приветствие

});


/**
 * 
 * сортировка 
 * 
 */

let sorted = false; // изначально без сортировки

btnSort.addEventListener('click', function(event){
  event.preventDefault();
  
  displayMovements(currentAccount.movements, !sorted); // при первом клике сортируем
  sorted = !sorted; // инвертируем значение, т. о. при повторном нажатии сортировка убирается
});














































































/**
 * 
 * 
 * 
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
 * 
 */


// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/**
 * 
 *  141. Simple Array Methods
 * 
 */

//let arr = ['a', 'b', 'c', 'd', 'e'];

/*
// SLICE

// берем часть массива начиная с элемента с индексом 1 и помещаем в новый массив
let newArr = arr.slice(1);

// начиная с 1 индекса и заканчивая третьим, не включительно
let newArr2 = arr.slice(1, 3); // 1 и 2 индексы

let newArr3 = arr.slice(-2); // последние 2 элемента

let newArr4 = arr.slice(2, -1); // с 3 элемента по предпоследний

console.log(arr);
console.log(newArr);
console.log(newArr2);
console.log(newArr3);
console.log(newArr4);
*/

//SPLICE
// отличие от метода slice в том, что этот изменяет текущий массив
//console.log('********************* splice ******************');

//console.log( arr.splice(2) ); // вырезаем все элементы, начиная с индекса 2
//console.log( arr ); // остается 0 и 1 элементы

//console.log(arr.splice(-1)); // вырезаем последний элемент
//console.log(arr);

//console.log(arr.splice(1,2)); // вырезаем с индекса 1 до 2
//console.log(arr);

// reverse
//const arr2 = ['x', 'y', 'z'];
// console.log(arr2.reverse()); // переворачивает массив и затирает первоначальный
// console.log(arr2);

// concat
//const letters = arr.concat(arr2); // объединяет массивы, не затирает изначальные
// console.log(letters);
// console.log(arr, arr2);

// JOIN - объединяет массив в строку
//console.log(letters.join(' - '));


/**
 * 
 * 142. Looping Arrays: forEach 
 * 
 */
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


for( const [i, operation] of movements.entries()){
  if(operation > 0){
    console.log(`${i} You deposited ${operation} $`);
  }else{
    console.log(`${i} You withdrew ${Math.abs(operation)} $`);
  }
  
}


movements.forEach(function(operation, i, arr){
  if(operation > 0){
    console.log(`${i+1} You deposited ${operation} $`);
  }else{
    console.log(`${i+1} You withdrew ${Math.abs(operation)} $`);
  }
});
*/

/**
 * 
 * 
 * 143. forEach With Maps and Sets
 * 
 */

// map
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map){
  console.log(`Key| ${key}, value| ${value}`);
});
*/

/*
// set
const currenciesUnique = new Set(['EUR', 'USD', 'USD', 'RUB', 'JPY', 'CAD', 'CAD']);
currenciesUnique.forEach(function(value, key, set){
  console.log(`${value} - ${key} - ${set}`);
});
*/

/**
 * 
 * 
 * 146. Coding Challenge #1
 * 
 */
/*
const JuliasData = [3, 5, 2, 12, 7];
const KatesData = [4, 1, 15, 8, 3];

const checkDogs = function( dogsJulia, dogsKate){

  // убираем первый и 2 последние элемента массива
  const dogs = dogsJulia.splice(1, 2).concat(dogsKate);
  // console.log(dogs);

  dogs.forEach((dog, i) => {
    //console.log(dog);
    console.log( dog >= 3 ?  `Dog number ${i+1} is an adult, and is ${dog} years old")` : `Dog number ${i+1} is still a puppy 🐶` );
  });

};
checkDogs(JuliasData, KatesData);
*/

/**
 * 
 * 
 * 148. The map Method
 * метод возвращает новый массив с измененными в функции обратного вызова данными 
 */
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.16; // курс обмена евро на доллары

// const movementsUSD = movements.map( function(mov){
//   return Math.trunc(mov * eurToUsd);
// });
const movementsUSD = movements.map( mov => Math.trunc(mov * eurToUsd));

// старый способ через forEach
const newArr = [];
movements.forEach( function(mov, i){
  newArr[i] = Math.trunc(mov * eurToUsd);
});

console.log(movements);
console.log(movementsUSD);
console.log(newArr);
 
const movementsDescriptions = movements.map((mov, i, arr) => {
  if(mov > 0){
    return `Movement ${i+1}: You deposited ${mov}`;
  } else {
    return `Movement ${i+1}: You withdrew ${Math.abs(mov)}`;
  }
});
console.log(movementsDescriptions);
*/

/**
 * 
 * 150. The filter Method
 * фильтрует массив
 */

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// фильтруем пополнения
const deposits = movements.filter(function(mov){
  return mov > 0;
});
console.log(movements);
console.log(deposits);

// фильтруем снятия

// const withdrawals = movements.filter(function(mov){
//   return mov < 0;
// });

// вариант со стрелочной функцией
const withdrawals = movements.filter( mov => mov < 0 );

console.log(withdrawals);
*/

/**
 * 
 * 
 * 151. The reduce Method
 * 
 * метод производит манипуляции с элементами для получения общего значения
 * 
 * Первый параметр метода - функция обратного вызова
 * Второй параметр - начальное значение результирующего значения
 * 
 * параметры функции обратного вызова:
 * 1 параметр - результирующее значение
 * 2 параметр - текущий элемент массива
 * 3 параметр - индекс
 * 4 параметр - весь массив
 * 
 * 
 */

/*
// 1

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// acc - accumulator
// cur - current item
// i - index
// arr - all array

const balance = movements.reduce(function(acc, curr, i, arr){
  console.log(`Iteration number ${i}: ${acc}`);
  return acc + curr;
});

// arrow function
const balance2 = movements.reduce( (acc, curr) => acc + curr, 0);

console.log(balance);
console.log(balance2);
*/

/*
// 2 максимальное значение

// acc - значение, которое переходит на следующую итерацию
// помещаем в аккумуятор значение первого элемента
// затем сравниваем значение аккумулятора со значением элемента
// если значение аккумулятора больше значения текущего элемента, переносим дальше его
// если значение элемента больше, переносим значение элемента, на следующей итерации оно становится значением аккумулятора

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const max = movements.reduce( (acc, mov) => {
  console.log(acc, mov);
  if(acc > mov) return acc
  else return mov;
}, movements[0]);

*/

/**
 * 
 * 152. Coding Challenge #2
 * 
 * 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know
from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]

 */

/*
const dogsAges = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function(ages){

  // создаем новый массив на основе исходного
  const dogToHuman = ages.map(function( age ){
    if(age <= 2){
      return age * 2;
    } else if(age > 2){
      return (age * 4) + 16;
    }
  });
  console.log(dogToHuman);

  // убираем тех кому нет 18
  const adultDogs = dogToHuman.filter( function(age){
    return age > 18;
  });
  console.log(adultDogs);

  // суммируем значение элементов
  const totalAges = adultDogs.reduce(function(acc, curr){
    return acc + curr;
  });
  console.log(totalAges);

  // высчитываем среднее из суммы и возвращаем
  return  totalAges / adultDogs.length;

}; 
console.log(calcAverageHumanAge(dogsAges));
*/

/**
 *
 * 153. The Magic of Chaining Methods
 *
 */


/*
const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * 1.1).reduce((acc, curr) => acc + curr, 0);
console.log(totalDepositsUSD);
*/

/**
 *
 * 154. Coding Challenge #3
 *
 */

/*
const calcAverageHumanAge = (ages) => {
  const average = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4)) // переводим собачий возраст в человечий
    .filter(age => age >= 18) // берем только совершеннолетних
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0); // складываем и берем среднее значение
  return average;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
*/



/**
 *
 * 155. The find Method
 *
 * возвращает первый элемент, удовлетворяющий условию
 *
 *
 */

/*
const firstWithdrew = movements.find(mov => mov > 0);
console.log(firstWithdrew);

// можно производить поиск объектов по значению свойства
// будет возвращен весь объект, который содержит указанное значение свойства
console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jonas Schmedtmann');
console.log(account);
*/


/**
 * 
 * 159. some and every 
 * 
 * come - ищет элемент, удовлетворябщий условию, возвращает булев тип
 * every - проверяет, все ли элементы удовлетворяют условию, возвращает булев тип
 */
/*

// some
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);
console.log(movements.includes(-130)); // есть ли элемент с указанным значением

const anyDeposits = movements.some(mov => mov > 0); // есть ли элемент, который удовлетворяет условию
console.log(anyDeposits);

// every
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every( mov => mov > 0));
*/



/**
 * 
 * 160. flat and flatMap
 * 
 */

/*

// flat - разворачивает вложенный массив в одномерный
const arr = [[[-1, 0], 1, 2, 3], [4, 5, 6, [7, 8]], 9, 10];
console.log(arr.flat(2));

// считаем все пополнения на всех аккаунтах
const accountMovements = accounts
  .map(acc => acc.movements) // берем из аккаунтов только движения по счету
  .flat() // разворачиваем в одномерный массив
  .filter(mov => mov > 0) // берем только пополнения
  .reduce((acc, mov) => acc + mov, 0); // складываем все значения

console.log(accountMovements);


// flatmap - создает новый массив по условию, разворачивает вложенный массив в одномерный
const accountMovements2 = accounts
  .flatMap(acc => acc.movements) // берем из аккаунтов только движения по счету, разворачиваем в одномерный массив
  .filter(mov => mov < 0) // берем только снятия
  .reduce((acc, mov) => acc + mov, 0); // складываем все значения

console.log(accountMovements2);

*/

/**
 * 
 * 161. Sorting Arrays
 * 
 */

/*
// strings
const owners = ['Fred', 'Harry', 'Albus', 'Ronald', 'Michael', 'Zak'];
console.log(owners.sort()); // изменяет исходный массив
console.log(owners);

// numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);



// return < 0 (keep orfer)
// return > 0 (switch orfer)

// от меньшего
const bigMov = movements.sort((a, b) => a-b); 
console.log(bigMov);

// от большего
const smallMov = movements.sort((a, b) => b-a);
console.log(smallMov);
*/



/**
 * 
 * 164. Array Methods Practice
 * 
*/
/*
//1
// считаем все пополнения на счетах
const bankDepositSum = accounts
  .map(acc => acc.movements) // выбираем только движения по счету
  .flat()                   // переводим в одномерный массив
  .filter(mov => mov > 0)   // выбираем значения больше 0
  .reduce((acc,mov) => acc + mov, 0); // складываем
console.log(bankDepositSum);

//2
// считаем количество пополнений больше 1000
const bankDepositSum1000 = accounts
  .map(acc => acc.movements) // выбираем только движения по счету
  .flat()                   // переводим в одномерный массив
  .filter(mov => mov >= 1000)   // выбираем значения больше 0
  .length; // длина
console.log(bankDepositSum1000);

//с помощью reduce
const bankDepositSum1000Reduce = accounts
  .map(acc => acc.movements) // выбираем только движения по счету
  .flat()         // переводим в одномерный массив
  .reduce((count, curr) => curr >= 1000 ? ++count : count, 0);// если текущее значение больше 1000 увеличиваем счетчик

console.log(bankDepositSum1000Reduce);

// 3 
// собираем объект со свойствами пополнений и снятий
const {deposits, withdrawals} = accounts // сразу деструктурируем объект
  .flatMap(acc => acc.movements) // выбираем только движения по счету и переводим в одномерный массив
  .reduce((sums, cur) => { // sums - объект, cur - текущий элемент массива
    
    // если текущий больше 0, записываем в свойство пополнений, если нет - снятий. следующие 2 строки взаимозаменяемы
    // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur; 
    sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;

    return sums;
  }, 
  {deposits: 0, withdrawals: 0}); // вторым аргументом создаем объект с двумя свойствами

console.log(deposits, withdrawals);

// 4
// конвертация первых букв слов кроме исключений
const convertTitleCase = function(title)
{
  const exceptions = ['a', 'an', 'the', 'this', 'there', 'but', 'no', 'or', 'in', 'with', 'is'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map( (word, i) => (exceptions.includes(word) && i !== 0) ? word : word[0].toUpperCase() + word.slice(1))
    .join(' ');
  

  return titleCase;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is an aPPLe'));
console.log(convertTitleCase('there is a table in the ROOM'));

*/

/**
 * 
 * coding challenge 4
 * 
*/
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1 вычисляем рекомендованое количество еды для каждой собаки
dogs.forEach( dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

// 2 ищем собаку по владельцу и считаем, много ли она ест
// так как владельцев может быть несколько, ищем в массиве конкретного владельца методом includes('Sarah')
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log( sarahDog.curFood > sarahDog.recommendedFood ? 'to much' : 'enough' );
console.log(sarahDog);

//3
// Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood).flatMap(owner => owner.owners);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood).flatMap(owner => owner.owners);

console.log('Много',ownersEatTooMuch);
console.log('Мало', ownersEatTooLittle);

// 4
// Log a string to the console for each array created in p3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"

const str = `${ownersEatTooMuch.join(' and ')}'s dogs eat too much!
            and ${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`;
console.log(str);

// 5
// Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
dogs.forEach(dog => {
  console.log(dog.curFood > dog.recommendedFood ? false: true);
});
console.log('**************************************************************************************************');

// 6
// Log to the console whether there is any dog eating an okay amount of food
// (just true or false)

dogs.forEach(dog => {
  console.log( dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1 ? true: false);
});

// 7
// Create an array containing the dogs that are eating an okay amount of food (try
//   to reuse the condition used in 6.)
const goodDogs = dogs.filter(dog => dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1);
console.log(goodDogs);

// 8
// Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)
const sortArr = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sortArr);
console.log(dogs);

*/