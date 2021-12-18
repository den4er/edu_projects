'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class Workout // родительский класс тренировок
{
    date = new Date();
    id = (Number(new Date()) + '').slice(-10); // уникальный ID

    constructor(coords, distance, duration)
    {
        this.coords = coords;
        this.distance = distance; // в километрах
        this.duration = duration; // в минутах
    }

    _setDescription()
    {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} on
        ${this.date.getDate()} ${months[this.date.getMonth()]} ${this.date.getFullYear()} ${this.date.getHours()}:${this.date.getMinutes()}`

    }
}

class Running extends Workout // дочерний класс бег
{
    type = 'running';

    constructor(coords, distance, duration, cadence)
    {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace()
    {
        this.pace = this.duration / this.distance; // минут на километр
        return this.pace;
    }
}

class Cycling extends Workout // дочерний класс велосипед
{
    type = 'cycling';

    constructor(coords, distance, duration, elevationGain)
    {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed()
    {
        this.speed = this.distance / (this.duration / 60); // км в час
        return this.speed;
    }
}


class App // работа с картой, кликами, формой ввода данных
{
    #map;
    #mapEvent;
    #mapZoomLevel = 13;
    #workouts = [];

    constructor()
    {
        this._getPosition(); // получение координат и запуск карты
        this._getLocalStorage(); // получение данных из хранилища

        inputType.addEventListener('change', this._toggleElevationField); // переключение классов по изменению вида тренировки
        form.addEventListener('submit', this._newWorkout.bind(this)); // отправка формы
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this)); // переход к попапу при клике на тренировку
    }

    _getPosition() // получение координат и запуск карты
    { 
        if(navigator.geolocation)                      // если есть координаты        // если нет координат
            navigator.geolocation.getCurrentPosition( this._loadMap.bind(this),  () => alert('Не удалось определить местоположение') );
    }

    _loadMap(position) // загружаем карту
    {
        const {latitude, longitude} = position.coords;

        this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);// создаем объект карты

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {   // openstreetmap
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        // при клике по карте показываем форму
        this.#map.on('click', this._showForm.bind(this));

        this.#workouts.forEach( work => { // проходим по массиву и передаем каждый элемент методу 
            this._renderWorkoutMarker(work); // отображение на карте
        }); 
    }

    _showForm(mapE) // сохраняем координаты и показываем форму для ввода данных
    {
        this.#mapEvent = mapE; // помещаем в свойство класса объект клика по карте. в нем есть широта и долгота
        form.classList.remove('hidden'); // показываем форму
        inputDistance.focus(); // фокус на поле ввода дистанции
    }

    _toggleElevationField() // меняем параметры ввода при изменении типа активности
    {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(event) // когда форма с данными заполнена и нажата кнопка отправить
    {
        // проверка на число
        const validInputs = (...inputs) => { // переменные в массив, проход по нему и проверка на число
            return inputs.every(input => Number.isFinite(input));
        }

        // проверка на > 0
        const isPositive = (...inputs) => {
            return inputs.every(input => input > 0);
        }

        event.preventDefault();// отменяем отправку формы

        // получить данные из формы
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);
        let workout; // переменная для объекта тренировки

        const {lat, lng} = this.#mapEvent.latlng; // получаем координаты клика

        // проверить данные 

        // если это бег, создать объект Running
        if(type === 'running'){
            const cadence = Number(inputCadence.value);

            if(!validInputs(distance, duration, cadence) || !isPositive(distance, duration, cadence)) return alert('Введите число больше 0');
            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // если это велосипед, создать объект Cycling
        if(type === 'cycling'){
            const elevation = Number(inputElevation.value);

            if(!validInputs(distance, duration, elevation) || !isPositive(distance, duration)) return alert('Введите число больше 0');
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        // добавить в массив объектов Workout
        this.#workouts.push(workout);


        // отобразить на карте
        this._renderWorkoutMarker(workout);


        // отобразить в списке
        this._renderWorkout(workout);


        // скрыть форму и очистить поля ввода
        this._hideForm();

        // запись в хранилище
        this._setLocalStorage();

    }


    _renderWorkoutMarker(workout) // метод отображения маркера на карте
    {       
        const workType = workout.type == 'running' ? `Cadence: ${workout.cadence} step/min` : `Elevation: ${workout.elevationGain} meters`
        const popupContent = `Distance: ${workout.distance} km, Duration: ${workout.duration} min, ${workType}`;

        L.marker(workout.coords) 
            .addTo(this.#map)
            .bindPopup(L.popup({maxWidth: 300, minWidth: 100, autoClose: false, closeOnClick: false, className: `${workout.type}-popup`}))
            .setPopupContent(popupContent)
            .openPopup();
    }


    _renderWorkout(workout)
    {
        const html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">

            <h2 class="workout__title">${workout.description}</h2>

            <div class="workout__details">
                <span class="workout__icon">${workout.type == 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.type == 'running' ? workout.pace.toFixed(1) : workout.speed.toFixed(1)}</span>
                <span class="workout__unit">${workout.type == 'running' ? 'min/km' : 'km/h'}</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">${workout.type == 'running' ? '🦶🏼' : '⛰'}</span>
                <span class="workout__value">${workout.type == 'running' ? workout.cadence : workout.elevationGain}</span>
                <span class="workout__unit">${workout.type == 'running' ? 'spm' : 'm'}</span>
            </div>
            </li>
        `;

        form.insertAdjacentHTML('afterend', html);
    }


    _hideForm() // скрыть форму и очистить поля ввода
    {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => form.style.display = 'grid', 1000);
    }


    _moveToPopup(event) // переход к маркеру на карте при нажатии на тренировку
    {
        const workoutEl = event.target.closest('.workout'); // получаем ближайшего родителя с классом workout
        if(!workoutEl) return; 

        const workout = this.#workouts.find(work => work.id == workoutEl.dataset.id);
        
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan:{
                duration: 1,
            }
        });
    }

    _setLocalStorage() // запись в хранилище
    {
        console.log(JSON.stringify(this.#workouts));
        localStorage.setItem('workouts', JSON.stringify(this.#workouts)); // преобразовываем в строку и кладем в хранилище
    }

    _getLocalStorage() // получение из хранилища
    {
        const data = JSON.parce(localStorage.getItem('workouts')); // получаем данные из хранилища и преобразовываем в объект
        console.log(data);

        if(!data) return; // если хранилище пустое, выходим

        this.#workouts = data; // помещаем данные в массив
        
        this.#workouts.forEach( work => { // проходим по массиву и передаем каждый элемент методу 
            this._renderWorkout(work);  // отображение в списке
            this._renderWorkoutMarker(work); // отображение на карте
        }); 
        
    }

}
const app = new App();