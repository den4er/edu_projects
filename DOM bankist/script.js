'use strict';

/**
 * 
 * Модальное окно 
 * 
 */
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');


const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(button => button.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * скролл при нажатии на кнопку btn--scroll-to
 * 
*/

// получаем кнопку и элемент, к которому будет скролл
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (event) {

  /*
    // old school
    // координаты нужного элемента
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);
  
    // проверяем скролл страницы
    console.log('Current scroll', window.pageXOffset, window.pageYOffset);
  
    // scroll
    // к координатам добавляем скролл страницы если он есть
    //window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  
    // вариант через объект, который позволяет задать поведение
    window.scrollTo({
      left: s1coords.left + window.pageXOffset,
      top: s1coords.top + window.pageYOffset,
      behavior: 'smooth',
    });
  */

  // modern js
  section1.scrollIntoView({ behavior: 'smooth' });

});

// то же самое в одну строчку
//document.querySelector('.btn--scroll-to').addEventListener('click', () => document.querySelector('#section--1').scrollIntoView({ behavior: 'smooth' }));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 *
 * Page navigation
 *
*/

/*
// old school
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(function (el) {
  el.addEventListener('click', function (event) {
    event.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/


// modern js

// 1 вешаем событие на общего родителя элементов
document.querySelector('.nav__links').addEventListener('click', function (event) {
  event.preventDefault();

  // 2 выясняем на каком элементе сработало событие
  if (event.target.classList.contains('nav__link') && !event.target.classList.contains('btn--show-modal')) {
    const id = event.target.getAttribute('href'); // получаем ссылку нужного элемента
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // скролим экран к нему
  }

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * Tabbed component
 * 
*/

const tabs = document.querySelectorAll('.operations__tab'); // переключатели
const tabsContainer = document.querySelector('.operations__tab-container'); // контейнер переключателей
const tabsContent = document.querySelectorAll('.operations__content'); // получаем элементы с контентом

tabsContainer.addEventListener('click', function (event) {

  const target = event.target; // записываем в переменную нажатый элемент

  // если у нажатого элемента есть класс operations__tab
  if (target.classList.contains('operations__tab')) {

    const dataAttr = target.getAttribute('data-tab'); // получаем значение дата-атрибута нажатого таба


    // работаем с контентом
    // перебираем в цикле блоки с контентом
    tabsContent.forEach(function (el) {
      el.classList.remove('operations__content--active'); // у всех блоков убираем класс активности, что скрывает их
    });

    // получаем элемент с контентом по значению дата-атрибута таба и добавляем ему класс активности
    document.querySelector(`.operations__content--${dataAttr}`).classList.add('operations__content--active');


    // работаем с табами
    // перебираем кнопки
    tabs.forEach(function (tab) {
      tab.classList.remove('operations__tab--active'); // у всех кнопок убираем класс активности
    });
    // добавляем класс активности нажатой кнопке
    target.classList.add('operations__tab--active');
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * Анимированное затемнение меню
 * 
*/
const nav = document.querySelector('.nav');

const handleHover = function (event) {

  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // через родителя получаем все ссылки

    siblings.forEach((el) => { if (el !== link) el.style.opacity = this }); // меняем прозрачность

    const logo = link.closest('.nav').querySelector('#logo');  // получаем логотип
    logo.style.opacity = this; // меняем прозрачность
  }

}

// в метод bind передается контекст вызова функции, мы передаем числа, и именно они будут являться переменной this

// мышь находится над элементом
nav.addEventListener('mouseover', handleHover.bind(0.5));

// мышь уходит за пределы элемента
nav.addEventListener('mouseout', handleHover.bind(1));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * Прикрепляющаяся навигация
 * старый способ
*/

/*
const initialCoords = section1.getBoundingClientRect().top; // получаем верхнюю координату элемента 
window.addEventListener('scroll', function(event){ // при прокрутке страницы
  
  // если величина прокрутки страницы становится больше верхнеей координаты элемента section1
  if(window.scrollY >= initialCoords) nav.classList.add('sticky'); // добавляем навигации класс sticky
  else nav.classList.remove('sticky') // если нет, удаляем класс
});
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 *  Прикрепляющаяся навигация
 *  Intersection Obsrever API
 * 
*/

const header = document.querySelector('header'); // получаем шапку
const navHeight = nav.getBoundingClientRect().height; // вычисляем высоту блока навигации


// функция обратного вызова
// вызывается при каждом переходе границы
const obsCallBack = function (entries) {
  entries.forEach((entry) => { // перебираем все границы

    if (entry.isIntersecting) { // если шапка в области видимости больше 10%(в этом случае)
      nav.classList.remove('sticky'); // убираем класс прикрепления у навигации
    } else {                          // если шапка уходит из области видимости
      nav.classList.add('sticky');  // добавляем класс прикрепления
    }

  });

};

// объект с настройками
const obsOptions = {
  root: null, // через что наблюдаем за элементом. null - весь экран
  threshold: [0], // процент попадания в область видимости
  // можно добавить поля, в данном случае навигацция появляется когда шапка остается в зоне видимости на величину высоты навигации
  rootMargin: `-${navHeight}px`,
};

const observer = new IntersectionObserver(obsCallBack, obsOptions) // создаем новый объект, в него передается функция и объект с настройками
observer.observe(header) // вызываем метод созданного объекта. Параметром передаем наблюдаемый элемент

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * 
 * появляющиеся секции
 * 
*/
const allSections = document.querySelectorAll('.section'); // получаем секции
const revealSection = function (entries, observer) {  // функция - обработчик
  const [entry] = entries; // забираем единственный элемент

  if (entry.isIntersecting) { // если есть пересечение
    entry.target.classList.remove('section--hidden'); // убираем скрывающий класс
    observer.unobserve(entry.target); // прекращаем наблюдение
  }

}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function (section) { // обходим секции
  sectionObserver.observe(section); // вешаем наблюдателя на каждую секцию
  section.classList.add('section--hidden'); // скрываем все секции
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * Lazy loading image
 * 
*/

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return

  // замена атрибута
  entry.target.src = entry.target.dataset.src; // записываем в src значение дата-атрибута
  entry.target.addEventListener('load', function () { // только при загрузке большого изображения
    this.classList.remove('lazy-img'); // убираем класс размытости
  });

  observer.unobserve(entry.target); // прекращаем наблюдение
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  treshold: 0,
  // отриц маржин если хотим чтоб загружалось позже, положительный чтобы раньше
  rootMargin: '-200px'
});

imgTargets.forEach(img => imgObserver.observe(img));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * 
 * Slider
 * 
*/

const slider = function () {

  const slides = document.querySelectorAll('.slide');   // получаем слайды

  // получаем кнопки
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const dotsContainer = document.querySelector('.dots'); // точки

  let currSlide = 0; // текущий слайд
  const maxSlide = slides.length - 1; // последний слайд


  //
  // функции
  //

  const goToSlide = function (slide) { // переключение слайдов
    slides.forEach((s, i) => s.style.transform = `translateY(${(i - slide) * 100}%)`);
  }


  const createDots = function () { // создаем точки
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot " data-slide="${i}"></button>`);
    });
  };


  const changeActiveDot = function (slide) {// функция изменения активности
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };


  const nextSlide = function () { // следующий слайд

    if (currSlide == maxSlide) { // если это последний слайд
      currSlide = 0; // возарвщаемся в первоначальное положение
    } else { // если не последний
      currSlide++; // прибавляем 1 к текущему слайду
    }

    goToSlide(currSlide);// передвигаем все слайды на 100% в минус (влево)
    changeActiveDot(currSlide); // ставим активной нужную точку
  }


  const prevSlide = function () { // предыдущий слайд

    if (currSlide == 0) { // если это первый слайд
      currSlide = maxSlide; // переходим к последнему
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
    changeActiveDot(currSlide);
  }


  const init = function () { // первоначальное состояние
    goToSlide(0);
    createDots();
    changeActiveDot(currSlide);// изначально активен первый слайд
  }; init();

  //
  // обработчики событий
  //

  btnRight.addEventListener('click', nextSlide); // следующий слайд
  btnLeft.addEventListener('click', prevSlide); // предыдущий слайд

  // переключение кнопками клавиатуры
  document.addEventListener('keydown', function (event) {
    if (event.code == 'ArrowRight') nextSlide();
    if (event.code == 'ArrowLeft') prevSlide();
  });

  // точки под слайдером
  dotsContainer.addEventListener('click', function (event) {
    // если клик по одной из точек
    if (event.target.classList.contains('dots__dot')) {
      const { slide } = event.target.dataset; // получаем значение дата-атрибута
      goToSlide(slide); // переключаем на нужный слайд
      changeActiveDot(slide); // делаем активной нужную точку     
    }
  });

}; slider();















































































/************************************************************************* LECTURES *********************************************************************************/

/**
 *
 * 183. Selecting, Creating, and Deleting Elements
 *
*/


/*
// creating elements
console.log(document.documentElement); // весь документ
console.log(document.head); // голова
console.log(document.body); // тело
console.log(document.querySelector('.header')); // шапка сайта
console.log(document.querySelectorAll('.section')); // основные секции сайта
console.log(document.getElementById('section--1')); // выбор секции по идентификатору
console.log(document.getElementsByTagName('button')); // все элементы по названию тега
console.log(document.getElementsByClassName('btn')); // все элементы по названию класса
*/

/*
// creating and inserting elements
// .insertAdjacentHTML // метод вставки html на страницу
const message = document.createElement('div'); // создаем div и кладем в переменную
message.classList.add('cookie-message'); // добавляем класс
//message.textContent = 'Hello'; // добавляем текст внутрь элемента
message.innerHTML = 'We use cookies for improoved functionalityand analytics <button class="btn btn--close-cookie">Got it</button>'
const header = document.querySelector('.header'); // получаем шапку
//header.prepend(message); // добавляем первым потомком созданное ранее сообщение
header.append(message); // добавляем последним потомком созданное ранее сообщение
//header.append(message.cloneNode(true)); // созданный элемент существует в единственом виде. если нужно вставить одинаковый элемент в разныеместа, делаем клон
//header.before(message); // вставляем элемент до шапки
//header.after(message); // вставляем элемент после шапки
header.querySelector('.btn--close-cookie').addEventListener('click', () => message.remove()); // при клике на кнопку удаляем элемент
*/


/**
 *
 * 184. Styles, Attributes and Classes
 *
 */

/*
// styles
message.style.backgroundColor = '#37383d';
message.style.width = '103%';
// напрямую получить можно только in-line стили
// console.log(message.style.backgroundColor);
// console.log(message.style.fontSize);
// console.log(message.style.width);
// получение скомпилированных стилей
console.log(getComputedStyle(message).height);
//console.log(getComputedStyle(message).background);
// изменение стилей
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// изменение переменных CSS
document.documentElement.style.setProperty('--color-primary', 'orangered');
// attributes
const logo = document.querySelector('.nav__logo');
// текст
console.log(logo.id);
console.log(logo.className);
console.log(logo.src);
console.log(logo.alt);
// элементы
console.log(logo.attributes.class);
console.log(logo.attributes.src);
console.log(logo.attributes.alt);
// получение пользовательских атрибутов
console.log(logo.getAttribute('designer'));
// получение url
console.log(logo.getAttribute('src'));
// изменение атрибутов
logo.alt = 'Beautiful minimalist logo';
// установка атрибутов
logo.setAttribute('company', 'bankist');
// links
const link = document.querySelector('.twitter-link');
console.log(link.getAttribute('href'));
console.log(link.href);
const link2 = document.querySelector('.nav__link--btn');
console.log(link2.getAttribute('href'));
console.log(link2.href);
//data-attributes
console.log(logo.dataset.versionNumber);
// classes
logo.classList.add('test', 'test1', 'test2', 'test3');
logo.classList.remove('test1', 'test2');
logo.classList.toggle('test4');
logo.classList.contains('test');
// dont use!!!!!!
logo.classList = 'test';
*/

/**
 *
 * 186. Types of Events and Event Handlers
 *
*/
/*
const h1 = document.querySelector('h1');
const mouseAlert = function (event) {
  alert('stupid girls');
  // удаление обработчика после одного срабатывания
  h1.removeEventListener('mouseenter', mouseAlert);
};
h1.addEventListener('mouseenter', mouseAlert);
// удаление обработчика через 3 секунды
setTimeout(() => h1.removeEventListener('mouseenter', mouseAlert), 3000);
*/

/**
 *
 * 188. Event Propagation in Practice
 *
*/
/*
// функция для генерации числа от 0 до 255
const randomNumber = (a, b) => Math.floor((Math.random() * b + 1) + a);
console.log(randomNumber(0, 255));
console.log(randomNumber(0, 255));
console.log(randomNumber(0, 255));
// функция для генерации случайного цвета
const randomColor = () => `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;
document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('LINK', e.currentTarget);
  this.style.backgroundColor = randomColor();
  // остановить всплытие события
  e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('LINKS', e.currentTarget);
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav').addEventListener('click', function (e) {
  console.log('NAV', e.currentTarget);
  this.style.backgroundColor = randomColor();
}, true);
*/


/**
 *
 *
 * 190. DOM Traversing
 *
*/

/*
const h1 = document.querySelector('h1');
// going downwards: child
console.log(h1.querySelectorAll('.highlight')); // дочерние к h1 с классом highlight
console.log(h1.childNodes); // все дочерние элементы h1
console.log(h1.children); // только дочерние html элементы
h1.firstElementChild.style.color = 'white'; // меняем цвет первого потомка
h1.lastElementChild.style.color = 'orangered'; // меняем цвет последнего потомка
// going upwards: parents
console.log(h1.parentNode); // родительский элемент
console.log(h1.parentElement); // родительский элемент
h1.closest('.header').style.backgroundColor = 'orange';
h1.closest('h1').style.backgroundColor = 'blue';
// going sideways: siblings
console.log(h1.previousElementSibling); // предыдущий сосед
console.log(h1.nextElementSibling); // следующий сосед
console.log(h1.parentElement.children); // выбираем всех соседей включая текущий элемент
[...h1.parentElement.children].forEach( function(element){ // трансформируем в массив и проходим в цикле
  if( element !== h1) element.style.transform = 'scale(0.5)'; // если элемент на h1 уменбшайм в 2 раза
});
*/

/**
 *
 * 199. Lifecycle DOM Events
 *
*/
/*
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});

*/