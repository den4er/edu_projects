'use strict';

const score0El = document.querySelector('#score--0'); // элемент для вывода итогового счета первого игрока
const score1El = document.querySelector('#score--1'); // элемент для вывода итогового счета второго игрока
const diceEl = document.querySelector('.dice'); // элемент картинки кубика с выброшенным значением

const current0El = document.querySelector('#current--0'); // элемент накопления текущего счета первого игрока
const current1El = document.querySelector('#current--1'); // элемент накопления текущего счета второго игрока

const btnNew = document.querySelector('.btn--new'); // кнопка сброса игры
const btnRoll = document.querySelector('.btn--roll'); // кнопка для броска
const btnHold = document.querySelector('.btn--hold'); // кнопка для фиксирования результата

const player0 = document.querySelector('.player--0'); // площадка первого игрока
const player1 = document.querySelector('.player--1'); // площадка второго игрока

// начальные условия
score0El.textContent = 0; 
score1El.textContent = 0;
diceEl.classList.add('hidden');

let scorePlayer0 = 0; // начальный счет игрок 1
let scorePlayer1 = 0; // начальный счет игрок 2

let totalScorePlayer0 = 0; // итоговый счет игрок 1
let totalScorePlayer1 = 0; // итоговый счет игрок 2


btnRoll.addEventListener('click', function(){

    const dice = Math.trunc(Math.random() * 6) + 1; // формируем случайное число от 1 до 6
    diceEl.src = `dice-${dice}.png`; // выбираем соответствующее выпавшему числу изображение
    diceEl.classList.remove('hidden'); // показываем картинку
    

    // если активен игрок 1
    if( player0.classList.contains('player--active') )
    {
        scorePlayer0 += dice; // добавляем выброшенное число к текущему счету
        current0El.textContent = scorePlayer0; // выводим текущее значение на страницу
    
        if(dice == 1){ // если выброшен кубик с числом 1
            scorePlayer0 = 0; // сбросить текущий счет игрока
            current0El.textContent = scorePlayer0; // вывести сброшенный счет на страниуц
            player0.classList.remove('player--active'); // убрать активность у первого игрока
            player1.classList.add('player--active'); // добавить активность второму игроку
        }
    } 
    // если активен игрок 2
    else if( player1.classList.contains('player--active') )
    {
        scorePlayer1 += dice; 
        current1El.textContent = scorePlayer1;
    
        if(dice == 1){
            scorePlayer1 = 0;
            current1El.textContent = scorePlayer1;
            player1.classList.remove('player--active');
            player0.classList.add('player--active');
        }
    }

});

btnHold.addEventListener('click', function(){ // при нажатии кнопки hold (удержание текущего счета)
    
    if( player0.classList.contains('player--active') ) // если активен первый игрок, работаем с его полем
    {
        totalScorePlayer0 += scorePlayer0; // добавляем текущее значение счета к итоговому
        score0El.textContent = totalScorePlayer0; // выводим на страницу текущий итоговый счет
        player0.classList.remove('player--active'); // убрать активность у первого игрока
        player1.classList.add('player--active'); // добавить активность второму игроку
        scorePlayer0 = 0; // сбрасываем текущий счет игрока
        current0El.textContent = scorePlayer0; // выводим текущий счет игрока на страницу

        if(totalScorePlayer0 >= 30) // если счет больше 29
        {
            player0.classList.add('player--winner'); //добавляем класс победителя
            btnRoll.disabled = true; // блокируем нажатие кнопки
            btnHold.disabled = true; 
            diceEl.classList.add('hidden'); // скрываем картинку
        }
            
    }
    else if( player1.classList.contains('player--active') ) // если активен второй игрок, работаем с его полем
    {
        totalScorePlayer1 += scorePlayer1;
        score1El.textContent = totalScorePlayer1;
        player1.classList.remove('player--active');
        player0.classList.add('player--active');
        scorePlayer1 = 0;
        current1El.textContent = scorePlayer1;

        if(totalScorePlayer1 >= 30)
        {
            player1.classList.add('player--winner');
            btnRoll.disabled = true;
            btnHold.disabled = true;
            diceEl.classList.add('hidden'); // скрываем картинку
        }
    }
    
});

btnNew.addEventListener('click', function(){ // при нажатии на кнопку новой игры восстанавливаем все значения в первоначальное состояние

    //сбрасываем значения переменных
    scorePlayer0 = 0; // начальный счет игрок 1
    scorePlayer1 = 0; // начальный счет игрок 2
    
    totalScorePlayer0 = 0; // итоговый счет игрок 1
    totalScorePlayer1 = 0; // итоговый счет игрок 2

    // сбрасываем значения на странице
    current0El.textContent = scorePlayer0; 
    current1El.textContent = scorePlayer1;

    score0El.textContent = totalScorePlayer0;
    score1El.textContent = totalScorePlayer1;

    // разблокируем кнопки
    btnRoll.disabled = false;
    btnHold.disabled = false;

    // если победил первый игрок, 
    if(player0.classList.contains('player--winner'))
    {
        player0.classList.remove('player--winner'); // убираем у него класс победителя
    }

    // если победил второй игрок
    if(player1.classList.contains('player--winner'))
    {
        player1.classList.remove('player--winner'); // убираем у него класс победителя
    }
    
});