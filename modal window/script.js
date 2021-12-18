'use strict';

// получаем нужные элементы
const showModals = document.querySelectorAll('.show-modal');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');

function doCloseModal() // функция закрытия модального окна
{
    modal.classList.add('hidden');
    overlay.classList.add('hidden'); 
}

function doShowModal() // функция показа модального окна
{
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

for( let i = 0; i < showModals.length; i++) // вешаем события на кнопки для открытия модального окна при нажатии
{
    showModals[i].addEventListener('click', doShowModal);
}

closeModal.addEventListener('click', doCloseModal); // закрыть при нажатии на крестик
overlay.addEventListener('click', doCloseModal); // закрыть при нажатии на внешнее поле

document.addEventListener('keydown', function(event){ // при нажатии кнопки
    if( event.key == 'Escape' && !modal.classList.contains('hidden')) // если это эскейп и у модального окна нет класса hidden
    {
        doCloseModal(); // закрываем модальное окно
    }
});