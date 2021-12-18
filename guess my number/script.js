'use strict';

const check = document.querySelector('.check'); // получаем кнопку проверки ввода
const message = document.querySelector('.message'); // получаем элемент для вывода сообщения пользователю
const number = document.querySelector('.number'); // получаем поле для вывода корректного числа
const scoreElement = document.querySelector('.score'); // получаем элемент для вывода счета игры (количества оставшихся попыток)
const again = document.querySelector('.again'); // получаем кнопку сброса игры
const body = document.querySelector('body'); // получаем элемент боди
const guess = document.querySelector('.guess'); // получаем элемент поля ввода
const highScoreElement = document.querySelector('.highscore'); // получаем элемент лучшего счета

let score = 20; // задаем начальный счет
let highScore = 0; // задаем начальный лучший счет

let secretNumber = Number(Math.floor((Math.random() * 20) + 1)); // задаем секретное число

check.addEventListener('click', function () { // при клике на кнопку

    const guessVal = Number(guess.value); // берем введенное значение и преобразовываем в число

    if (guessVal == secretNumber) { // если введенное и секретное число совпадают

        message.textContent = '🎉 Correct number'; // меняем текст сообщения
        number.textContent = secretNumber; // выводим секретное число в нужное поле
        body.style.backgroundColor = '#60b347'; // меняем цвет боди
        number.style.width = '30rem'; // меняем ширину блока вывода правильного числа
        check.disabled = true; // блокируем кнопку при выигрыше

        if (score > highScore) { // если текущий счет больше лучшего
            highScore = score; // записываем текущий счет лучшим
            highScoreElement.textContent = highScore; // выводим текущий счет на страниуц
        }

    } else { // если число не угадано

        if (score > 1) {
            guessVal > secretNumber ? message.textContent = '📈 Is too hight' : message.textContent = '📉 Is too low'; // выводим сообщение
            scoreElement.textContent = --score; // уменьшаем текущий счет и выводим значение на страницу 
        } else {
            message.textContent = '📛 You loose the game!'; // выводим сообщение
            scoreElement.textContent = 0; // задаем нулевое значение когда игра проиграна
        }
    }
});

again.addEventListener('click', function () { // восстанавливаем изначальные значения при нажатии кнопки
    score = 20;
    secretNumber = Number(Math.floor((Math.random() * 20) + 1));
    message.textContent = 'Start guessing...';
    scoreElement.textContent = score;
    number.textContent = '?';
    guess.value = '';
    body.style.backgroundColor = '#222';
    number.style.width = '15rem';
    check.disabled = false;
});
