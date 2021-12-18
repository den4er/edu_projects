const carsContainer = document.querySelector('.cars'); // получаем элемент контейнера вывода всех авто
let oneCarContainer = document.querySelector('.one__car'); // получаем элемент контейнера вывода одного авто


/*
*
* один автомобль по идентификатору
*
* */
const showOneCar = async function (id) {

  // получаем данные из бд
  const res = await fetch(`server/oneCar.php?id=${id}`);
  const data = await res.json();

  if (!res.ok) throw new Error(`${data.message} (${res.status})`);

  const markup = `
        <div class="car__item">
          <p>Производитель: ${data.maker}</p>
          <p>Модель: ${data.model}</p>
          <p>Год выпуска: ${data.made_year}</p>
          <p>Максимальная скорость: ${data.top_speed}</p>
          <p>Разгон до 100: ${data.acceleration_to_100}</p>
          <p>Мощность: ${data.power}</p>
          <p>Масса: ${data.weight}</p>
          <img src="img/${data.image}" alt="${data.model}" width="600"/>
        </div>`;

  oneCarContainer.innerHTML = '';
  oneCarContainer.insertAdjacentHTML('afterbegin', markup);
}


/*
*
* список автомобилей
*
* */
const showCars = async function () {

  try {

    // получаем данные  о всех авто из бд
    const res = await fetch('server/carsList.php');
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // отображаем данные об автомобилях на странице
    const markup = `
      ${data.map(car => {
      return `<li class="car__item">
          <p class="id" style="display: block">${car.id} Нажми на кнопку, получишь результат</p>
          <p>${car.maker[0]}: ${car.maker[1]}</p>
          <p>Модель: ${car.model}</p>
        </li>`
    }).join('')}`;
    carsContainer.insertAdjacentHTML('afterbegin', markup);

    // вешаем обработчики событий на все элементы
    const carsId = document.querySelectorAll('.id'); // получаем идентификаторы машин
    const carItems = document.querySelectorAll('.car__item'); // получаем сами элементы машин

    carItems.forEach((item, i) => {
      item.addEventListener('click', event => {

        let id = 1;
        if (event.target === carsId[i]) {
          id = parseInt(event.target.textContent);
          showOneCar(id);
        }

      });
    });

  } catch (err) {
    alert(err);
  }

}

showCars();