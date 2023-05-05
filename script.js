'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Elements

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Classes

class Workout {
  #coords;
  #distance;
  #duration;
  #date = new Date();
  #id = (new Date().now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.#coords = coords; // [lat, lng]
    this.#distance = distance; // km
    this.#duration = duration; // min
  }

  // Getters

  get id() {
    return this.#id;
  }

  get coords() {
    return this.#coords;
  }

  get distance() {
    return this.#distance;
  }

  get duration() {
    return this.#duration;
  }

  get date() {
    return this.#date;
  }
}

class Running extends Workout {
  #cadence;

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.#cadence = cadence;
    console.log(this.calcPace());
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  #elevationGain;

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.#elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Main app

class App {
  #map;
  #mapEvent;

  constructor() {
    this.#getPosition();
    form.addEventListener('submit', this.#newWorkout.bind(this));

    inputType.addEventListener('change', this.#toggleElevationField);
  }

  #getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        this.#loadMap.bind(this)
      );
  }

  #loadMap(position) {
    if (position.code === 1)
      this.#map = L.map('map').setView([50.85045, 4.34878], 13);
    else {
      const { latitude, longitude } = position.coords;
      this.#map = L.map('map').setView([latitude, longitude], 13);
    }

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this.#showForm.bind(this));
  }

  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  #toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  #newWorkout(e) {
    e.preventDefault();

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .openPopup();
  }
}

const app = new App();
