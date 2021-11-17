@@include('card.js');


//Устанавливаем начальное значение количества карточек /2
let size = 6;
//Переменная с количеством удачных кликов
let successfulClick = 0;
//переменная с количеством неудачных кликов
let unsuccessfulClick = 0;
//Ставим переключатель отработки функции
let switchLogic = true;
//Переключатель для функции фейерверка
let fireWorksLogic = false;
//ищем элемент canvas
const canvasEl = document.querySelector('canvas');
//Ищем элемент с нашим полем под карточки
const field = document.querySelector('.playing-field');
//Ищем элемент с результатом кликов
const playingResults = document.querySelector('.playing-results');

//Функция для остановки и скрытия фейерверка
function hiddenFireWork() {
  canvasEl.classList.add('js-display-none')
  fireWorksLogic = false
}



//Отслеживаем клики по кнопкам "размер поля"
//Вешаем слушателей на отрисованные карточки
function sizeButtonListener() {
    
  //Ищем коллецию карточек на нашем поле
  let arrow = document.querySelectorAll('.size-playing-field__el');

  //Создаем цикл для перебора массива и приклеивания функции нашим карточкам
  for (let i = 0; i < arrow.length; i++) {
    let clickSizeButton = arrow[i];
    clickSizeButton.addEventListener('click', sizeButtonClick);
  }
}
sizeButtonListener()
//Меняем размер поля и количество карточек при клике по кнопке размера поля.
function sizeButtonClick(eventObject) {

  let clickedEl = eventObject.currentTarget;
  //определяем обьект клика и проверяем наличие у него соответсвующего класса
  if(clickedEl.classList.contains('size-playing-field__el--2x3')) {
    //устанавливаем размер поля
    field.style.width = '470px';
    //устанавливаем количество карточек
    size = 3;
    //перерисовываем поле с карточками
    randomArrow(cars, size);
    //останавливаем фейерверк
    hiddenFireWork();
  } else if (clickedEl.classList.contains('size-playing-field__el--3x4')) {
    field.style.width = '680px';
    size = 6;
    randomArrow(cars, size);
    hiddenFireWork();

  } else if (clickedEl.classList.contains('size-playing-field__el--4x5')) {
    field.style.width = '900px';
    size = 10;
    randomArrow(cars, size);
    hiddenFireWork();

  } else if (clickedEl.classList.contains('size-playing-field__el--5x6')) {
    field.style.width = '1120px';
    size = 15;
    randomArrow(cars, size);
    hiddenFireWork();

  } else if (clickedEl.classList.contains('size-playing-field__el--1x2')) {
    field.style.width = '470px';
    size = 1;
    randomArrow(cars, size);
    hiddenFireWork();

  }
}


//Для перемешивания массива используем отличный алгоритм под названием Тасование Фишера — Йетса. Суть заключается в том, чтобы проходить по массиву в обратном порядке и менять местами каждый элемент со случайным элементом, который находится перед ним.
function mixing(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

//функция изготовления случайного двойного массива карточек в зависимости от запрошенного размера поля».

function randomArrow(arr, end) {
  successfulClick = 0;
  unsuccessfulClick = 0;
  clearQuantityClick();
  //Удаляем с поля лишние классы
  field.classList.remove('tracking');
  //Дублируем исходный массив
  let array = [...arr];
  //Перемешиваем, что бы не повторялись начальные карточки
  mixing(array) 

  //обрезаем до нужного нам размера (количество карточек деленное на 2)
  let newArray = array.slice([0], [end])
  //Создаем двойной набор карточек
  let doubledNewArray = [...newArray, ...newArray]
  //еще раз их перемешиваем, что бы убрать упорядоченность
  mixing(doubledNewArray) 
  //строим игровую сетку из полученного масиива
  new ProductGrid(doubledNewArray);
  //навешиваем слушателей на карточки
  cardListener()
}

// console.log(doubledNewArray)
//Маленькая функция для добавления элементов
function createElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
};

//Класс для отрисовки карточки
class ProductCard {
  //задаем параметры в конструктор
  constructor(cars) {
    this.cars = cars;
    this.render();
  }
  //Отрисовываем, используя нашу маленькую функцию добавления элементов
  render() {
    this.elem = createElement(`<div class="card-container">
    <div class="card ${this.cars.id}">
      <div class="card-front">
        <img class="card-front__img" src="assets/images/cart/1389593.jpg" alt="Рубашка"/>
      </div>
      <div class="card-back">
        <img class="card-back__img" data-id="${this.cars.id}" src="assets/images/cart/${this.cars.image}" alt="Машина352"/>
      </div>
    </div>
  </div>`);
  }
}


//Задаем сетку поля, используя класс ProductCard
class ProductGrid {
  constructor(cars) {
    this.cars = cars;
    this.render();
  }
//отрисовываем и подставляем
  render() {
    this.renderContent();
  }

  renderContent() {
    field.innerHTML = '';

    for (let car of this.cars) {
      let card = new ProductCard(car);
      field.append(card.elem);
    }
  }
}
// new ProductGrid(cars);


//Вешаем слушателей на отрисованные карточки
function cardListener() {
    
  //Ищем коллецию карточек на нашем поле
  let arrowCard = field.querySelectorAll('.card');

  //Создаем цикл для перебора массива и приклеивания функции нашим карточкам
  for (let i = 0; i < arrowCard.length; i++) {
    let clickCard = arrowCard[i];
    clickCard.addEventListener('click', сardClick);
  }
}


//Переворачиваем карточку при клике по ней. Ой, немножко разрослась функция... Обрабатываем клик по карточке.
function сardClick(eventObject) {
    //Во избежание множественных быстрых кликов по карточкам и их срабатывания, добавляем логический переключатель, который позволит запустить новую функцию обрабтки клика только при завершении старой.
    if (switchLogic) {
      //в начале функции переключаем в ЛОЖЬ, что бы следующие клики не обрабатывались, пока функция не завершится
      switchLogic = false
//определяем обьект клика
      let clickedEl = eventObject.currentTarget;
      //Если на обьекте клика уже есть класс hidden, то прерываем выполнение функции
      if (clickedEl.classList.contains('hidden')) {
        switchLogic = true
        return
      } 
      //Если на обьекте клика уже есть класс active, то прерываем выполнение функции
      if (!(clickedEl.classList.contains('active'))) {
      //Или же добавляем класс active и переворачиваем карточку
      clickedEl.classList.add('active');
      clickedEl.classList.add('flip');
      //Если на игровом поле уже есть класс tracking, то запускаем финальный обработчик sort с задержкой для показа картинки, или же навешиваем на поле класс tracking
        if (!(field.classList.contains('tracking'))) {
        field.classList.add('tracking');
        switchLogic = true
        } else {
          //Запускаем финальный обработчик с задержкой, что бы успели показаться картинки
          setTimeout(sort, 1000)
        }
      } else { 
        switchLogic = true
      }
  }
}

function sort() {
  //Ищем коллецию карточек на нашем поле
  let arrow = field.querySelectorAll('.active');

//по задумке на поле не может быть больше двух карточек с классом active, так что всего два индекса\
//При создании карточек товара мы каждой карточке добавили уникальные классы, совпадать классы могут только у карточек с одинаковым ID
//Если классы двух открытых карточек совпадают, то мы их скрываем через присвоение класса hidden
//Иначе мы эти две карточки переворачиваем назад
  if (arrow[0].classList.value == arrow[1].classList.value) {

    arrow[0].classList.remove('active');
    arrow[1].classList.remove('active');
    arrow[0].classList.add('hidden');
    arrow[1].classList.add('hidden');
    field.classList.remove('tracking');
    //Вызываем функцию проверки завершения игры
    gameOver();
    switchLogic = true;
    //Меняем значение удачных кликов
    successfulClick = ++successfulClick;
    console.log(successfulClick)
    renderQuantityClick()
  } else {
    arrow[0].classList.remove('active');
    arrow[1].classList.remove('active');
    arrow[0].classList.remove('flip');
    arrow[1].classList.remove('flip');
    field.classList.remove('tracking');
    switchLogic = true;
    unsuccessfulClick = ++unsuccessfulClick;
    renderQuantityClick();

  }

}


randomArrow(cars, size)


//отрисовываем результат поиска совпадений
function renderQuantityClick() {
  playingResults.innerHTML = '';
  let elem = createElement(`<div class="playing-results__content">
      <div class="playing-results__text">
      Общее количество открытых пар ${successfulClick + unsuccessfulClick}
      </div>
      <div class="playing-results__text">
      Из них совпадений ${successfulClick}
      </div>
    </div>`);

  //Вставляем элемент в игровое поле вместо карточек
  playingResults.append(elem);
}
//очищаем результат поиска совпадений
function clearQuantityClick() {
  playingResults.innerHTML = '';
}



function gameOver() {
  let arrow = field.querySelectorAll('.hidden');
  if ((+(arrow.length) / 2) === size) {

    renderGameOver()
    //снимаем класс js-display-none с фейерверка
    canvasEl.classList.remove('js-display-none')

    //Включаем разрешение на фейерверк
    fireWorksLogic = true
    //запускаем фейерверк
    a.run();

  }
}
//отрисовываем поздравление с завершением игры
function renderGameOver() {
  let elem = createElement(`<div class="game-over">
    <div class="game-over__text">
    Поздравляем с завершением игры!
    </div>
    <div class="game-over__button">
      <div class="game-over__button-text">
      Новая игра
      </div>
    </div>
  </div>`);
  //Вставляем элемент в игровое поле вместо карточек
field.append(elem);
//вешаем слушатель кликов на кнопку НОВАЯ ИГРА
let buttonGameOver = field.querySelector('.game-over__button');
buttonGameOver.addEventListener('click', buttonGameOverClick);
}
//функция нажатия на кнопку НОВАЯ ИГРА
function buttonGameOverClick() {
  //запускаем функцию расчета и отрисовки новых игровых карточек и прячем фейерверк
  randomArrow(cars, size);
  hiddenFireWork();
}

///////----Фейерверк позаимствован из интернета ----//////////

const rndColor = () => {
  const base  = Math.random() * 360 | 0;
  const color = (275 * (base / 200 | 0)) + base % 200;
  return fac => `hsl(${color}, ${(fac || 1) * 100}%, ${(fac || 1) * 60}%)`;
};

class Battery
{
  constructor(fireworks) {
      this.fireworks = fireworks;
      this.salve = [];
      this.x     = Math.random();
      this.t     = 0;
      this.tmod  = 20 + Math.random() * 20 | 0;
      this.tmax  = 500 + Math.random() * 1000;

      this._shot = salve => {
          // console.log(this.x * this.fireworks.width, salve.y);
          if (salve.y < salve.ym) {
              salve.cb = this._prepareExplosion;
          }

          salve.x += salve.mx;
          salve.y -= 0.01;

          const r = Math.atan2(-0.01, salve.mx);

          this.fireworks.engine.strokeStyle = salve.c(.7);
          this.fireworks.engine.beginPath();

          this.fireworks.engine.moveTo(
              (this.x + salve.x) * this.fireworks.width + Math.cos(r) * 4,
              salve.y * this.fireworks.height + Math.sin(r) * 4
          );

          this.fireworks.engine.lineTo(
              (this.x + salve.x) * this.fireworks.width + Math.cos(r + Math.PI) * 4,
              salve.y * this.fireworks.height + Math.sin(r + Math.PI) * 4
          );

          this.fireworks.engine.lineWidth = 3;
          this.fireworks.engine.stroke();

          // this.fireworks.engine.fillRect((this.x + salve.x) * this.fireworks.width, salve.y * this.fireworks.height, 10, 10);
      };

      this._prepareExplosion = salve => {
          salve.explosion = [];

          for (let i = 0, max = 32; i < max; i++) {
              salve.explosion.push({
                  r : 2 * i / Math.PI,
                  s : 0.5 + Math.random() * 0.5,
                  d : 0,
                  y : 0
              });
          }

          salve.cb = this._explode;
      };

      this._explode = salve => {

          this.fireworks.engine.fillStyle = salve.c();

          salve.explosion.forEach(explo => {

              explo.d += explo.s;
              explo.s *= 0.99;
              explo.y += 0.5;

              const alpha = explo.s * 2.5;
              this.fireworks.engine.globalAlpha = alpha;

              if (alpha < 0.05) {
                  salve.cb = null;
              }

              this.fireworks.engine.fillRect(
                  Math.cos(explo.r) * explo.d + (this.x + salve.x) * this.fireworks.width,
                  Math.sin(explo.r) * explo.d + explo.y + salve.y * this.fireworks.height,
                  3,
                  3
              );
          });

          this.fireworks.engine.globalAlpha = 1;
      }
  }

  pushSalve() {
      this.salve.push({
          x: 0,
          mx: -0.02 * Math.random() * 0.04,
          y: 1,
          ym: 0.05 + Math.random() * 0.5,
          c: rndColor(),
          cb: this._shot
      });
  };

  render() {

      this.t++;

      if (this.t < this.tmax && (this.t % this.tmod) === 0) {
          this.pushSalve();
      }

      let rendered = false;

      this.salve.forEach(salve => {

          if (salve.cb) {
              rendered = true;
              salve.cb(salve);
          }

      });

      if (this.t > this.tmax) {
          return rendered;
      }

      return true;
  }
}

class Fireworks
{
  constructor() {
      this.canvas = window.document.querySelector('canvas');
      this.engine = this.canvas.getContext('2d');
      this.stacks = new Map();

      this.resize();
  }

  resize() {
      this.width  = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.setAttribute('width', this.width);
      this.canvas.setAttribute('height', this.height);
  }

  clear() {
      this.engine.clearRect(0, 0, this.width, this.height);
      this.engine.fillStyle = '#222';
      this.engine.fillRect(0, 0, this.width, this.height);
  }

  addBattery() {
    const bat = new Battery(this);
    this.stacks.set(Date.now(), bat);  
  }

  render() {
    if(fireWorksLogic) {

      if (Math.random() < 0.05) {
        this.addBattery();
      }
    
      this.clear();

      this.stacks.forEach((scene, key) => {

          const rendered = scene.render();

          if (!rendered) {
              this.stacks.delete(key);
          }
      });

      requestAnimationFrame(this.render.bind(this));
    }
  }

  run() {
    if(fireWorksLogic) {
      for(let i = 0; i < 5; i++) {
        this.addBattery();
      }
      window.addEventListener('resize', this.resize.bind(this));
      this.render();
    }
  }
}

a = new Fireworks();

///////------Код фейерверка завершен-----//////