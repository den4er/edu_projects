'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-10-20T09:15:04.904Z',
    '2021-10-21T10:17:24.185Z',
    '2021-10-22T14:11:59.604Z',
    '2021-10-23T17:01:17.194Z',
    '2021-10-24T23:36:17.929Z',
    '2021-10-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-10-28T13:15:33.035Z',
    '2021-10-28T10:48:16.867Z',
    '2021-10-27T22:04:23.907Z',
    '2021-10-27T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Denis Basov',
  movements: [2000, 4550.23, -3060.5, 25, -420.21, -1330.9, 790.97, 130],
  interestRate: 16, // %
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-10-20T09:15:04.904Z',
    '2021-10-21T10:17:24.185Z',
    '2021-10-22T14:11:59.604Z',
    '2021-10-23T17:01:17.194Z',
    '2021-10-24T23:36:17.929Z',
    '2021-10-25T10:51:36.790Z',
  ],
  currency: 'RUB',
  locale: 'ru-RU',
};


const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions


const formatMovementDate = function (movDate, locale) {
  const calcDaysPassed = (date1, date2) => Math.trunc(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));
  const correctDate = calcDaysPassed(Number(movDate), Number(new Date()));

  if (correctDate === 0) {
    return 'today';
  } else if (correctDate === 1) {
    return 'yesterday';
  } else if (correctDate <= 7) {
    return `${correctDate} days ago`;
  } else {
    // const day = `${movDate.getDate()}`.padStart(2, 0);
    // const month = `${movDate.getMonth()+1}`.padStart(2, 0);
    // const year = movDate.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(movDate);
  }
}

const formatCur = function (acc, quantity) {
  const options = {
    style: 'currency',
    currency: acc.currency,
  }
  return new Intl.NumberFormat(acc.locale, options).format(quantity);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;



  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const movDate = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(movDate, acc.locale);


    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCur(acc, mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(acc, acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(acc, incomes)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(acc, Math.abs(out))}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCur(acc, interest)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {


  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  [...document.querySelectorAll('.movements__row')].forEach((element, i) => {
    if (i % 2 === 0) element.style.backgroundColor = 'rgb(248, 181, 157)';
    if (i % 2 === 1) element.style.backgroundColor = 'lightblue';
  });
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// fake always login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;



btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;

    // current date
    // const now = new Date(); // получаем текущую дату
    // const day = `${now.getDate()}`.padStart(2, 0); // получаем день
    // const month = `${now.getMonth()+1}`.padStart(2, 0); // месяц
    // const year = now.getFullYear(); // год
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // const dateStr = `${day}/${month}/${year}, ${hour}:${min}`;// формируем строку

    // date from API
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long'
    }
    const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);



    //timer
    const nowTimer = Number(new Date());
    const endTimer = nowTimer + 1000 * 60 * 5;
    let delta = endTimer - nowTimer;

    const timer = function () {

      // 24 60 60 1000
      const seconds = Math.trunc((delta / (1000)) % 60); // секунды
      const minutes = Math.trunc(delta / (1000 * 60) % 60); // минуты

      delta -= 1000;

      labelTimer.textContent = `${minutes}`.padStart(2, 0) + ':' + `${seconds}`.padStart(2, 0);

      if (delta === 0) {
        clearInterval(timer);
        containerApp.style.opacity = 0;
      }

    };

    timer();

    setInterval(timer, 1000);



  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    const delayLoan = function () {
      // Add movement
      currentAccount.movements.push(amount);
      // add date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }
    setTimeout(delayLoan, 2000);


  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


/**
 *
 * 168. Converting and Checking Numbers
 *
*/
/*
console.log(23 === 23.0);
console.log(0.7 + 0.2);
console.log(Number('34'));
console.log(+'234');
console.log(Number.parseInt('34fdf'));
console.log(Number.parseInt('w4344'));
console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseFloat('3re'));
console.log(Number.isNaN(123));
console.log(Number.isNaN(+'ewr'));
console.log(Number.isFinite(1));
console.log(Number.isFinite(+'22'));
console.log(Number.isInteger(44));
console.log(Number.isInteger(33.66));
*/

/**
 *
 * 169. Math and Rounding
 *
*/
/*
// корень
console.log(Math.sqrt(25));
console.log(25 ** 0.5);
console.log(27 ** (1 / 3));
// экстремумы
console.log(Math.max(2, 4, 7, 9));
console.log(Math.min(2, 4, 7, 9));
// площадь круга
console.log(Math.PI * Number.parseInt('10px') ** 2);
// случайные числа
console.log(Math.trunc(Math.random() * 10 + 1));
//                   5   20                      0.1            15             5
const randomInt = (min, max) => Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(5, 20));
// округление int
console.log(Math.trunc(3.55));
console.log(Math.round(3.4));
console.log(Math.round(3.8));
console.log(Math.ceil(3.1));
console.log(Math.ceil(3.9));
console.log(Math.floor(3.2));
console.log(Math.floor(3.99));
console.log(Math.floor(-3.99));
console.log(Math.trunc(-3.99));
// округление float
console.log(3.36.toFixed(0));
console.log(+3.364534.toFixed(2));
console.log(+3.36345345345345.toFixed(5));
*/

/**
 *
 * 170. The Remainder Operator
 *
*/
/*
console.log(1 % 2);
[...document.querySelectorAll('.movements__row')].forEach((element, i) => {if(i % 2 === 0) element.style.backgroundColor = 'orangered'});
*/

/**
 *
 * 171. Working with BigInt
 *
*/
/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
// bigint
console.log(23423423423446546254452634625344652344n);
console.log(BigInt(23423423423446546254452634625344652344));
*/

/**
 *
 * 172. Creating Dates
 *
*/
/*
const now = new Date();
console.log(now);
console.log(new Date('Thu Oct 28 2021 11:27:18'));
console.log(new Date('Dec 24, 2015'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 9, 12, 58, 56));
console.log(new Date(0)); // начало времен
// добавляем 3 дня  дни часы минуты секунды милисекунды
console.log(new Date(3 * 24 * 60 *   60 *    1000));
*/

/*
// working with dates
const future = new Date(2037, 10, 9, 12, 58, 23, 345);
console.log(future);
console.log(future.getFullYear()); // год
console.log(future.getMonth()); //месяц с нуля
console.log(future.getDate()); // день месяца
console.log(future.getDay()); // день недели
console.log(future.getHours()); // часы
console.log(future.getMinutes()); // минуты
console.log(future.getSeconds()); // секунды
console.log(future.toISOString()); // формирвоание даты в строку
console.log(future.getTime()); // время, прошедшее с начала времен до указанной метки
console.log(new Date(2141373503345)); // формирует дату из временной метки
console.log(Date.now()); // время от начала времен до сейчас
future.setFullYear(2041); // установка года
console.log(future);
*/

/**
 *
 * 174. Operations With Dates
 *
 */

/*
const future = new Date(2037, 10, 25, 15, 45);
console.log(Number(future));
const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);
const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1);
*/

/**
 *
 * 176. Internationalizing Numbers (Intl)
 *
 */
/*
const num = 389844553;
const options = {
  style: 'unit',
  style: 'currency',
  //unit: 'kilometer-per-hour',
  currency: 'EUR',
}
console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log('RU:', new Intl.NumberFormat('ru-RU', options).format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(navigator.language, new Intl.NumberFormat(navigator.language, options).format(num));
*/

/**
 *
 * 177. Timers: setTimeout and setInterval
 *
*/

// set timeout
const colors = ['red', 'blue', 'green', 'orange'];
const setColors = setTimeout(
  (colorOne, colorTwo, colorThree) => console.log(colorOne, colorTwo, colorThree),
  3000,
  ...colors
);
if (colors.includes('orange')) clearTimeout(setColors);


