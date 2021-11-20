@@include('card.js');



//Устанавливаем начальное значение количества карточек
let size = 16;
//Переменная с количеством удачных кликов
let successfulClick = 0;
//переменная с количеством совпадений с выигрышным вариантом
let winningMatches = 0;
//Ставим переключатель отработки функции
let switchLogic = true;
//Переключатель для функции фейерверка
let fireWorksLogic = false;
//Активная карточка номер
let activeCard;
//Нулевая карточка номер
let zeroCard;
//Рабочий массив карточек
let workingArrayCards = [];
//Элемент, по которому прошел клик
let clickedEl;
//Логический переключатель для кнопки обмена карточек
let exchangeLogic = true;



//ищем элемент canvas
// const canvasEl = document.querySelector('canvas');
// //Ищем элемент с нашим полем под карточки
const field = document.querySelector('.playing-field');
//Ищем элемент с результатом кликов
const playingResults = document.querySelector('.additional-field__playing-results');
//Ищем элемент с дополнительным полем
const additionalField = document.querySelector('.additional-field');

//Для перемешивания массива используем отличный алгоритм под названием Тасование Фишера — Йетса. Суть заключается в том, чтобы проходить по массиву в обратном порядке и менять местами каждый элемент со случайным элементом, который находится перед ним.
function mixing(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

//функция изготовления случайного массива карточек в начале игры».

function randomArrow(arr) {
  successfulClick = 0;
  unsuccessfulClick = 0;
  clearQuantityClick();
  //Дублируем исходный массив
  workingArrayCards = [...arr];
  //Перемешиваем, что бы не повторялись начальные карточки
  mixing(workingArrayCards) 
  //строим игровую сетку из полученного масиива
  new ProductGrid(workingArrayCards);
  //навешиваем слушателей на карточки
  cardListener()
}

//Маленькая функция для добавления элементов
function createElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
};

//Класс для отрисовки карточки
class ProductCard {
  //задаем параметры в конструктор
  constructor(cards) {
    this.cards = cards;
    this.render();
  }
  //Отрисовываем, используя нашу маленькую функцию добавления элементов
  render() {
    this.elem = createElement(`<div class="card-container">
    <div class="card ${this.cards.name}">
      <div class="card-front">
        ${this.cards.id}
      </div>
    </div>
  </div>`);
  }
}


//Задаем сетку поля, используя класс ProductCard
class ProductGrid {
  constructor(cards) {
    this.cards = cards;
    this.render();
  }
//отрисовываем и подставляем
  render() {
    this.renderContent();
  }

  renderContent() {
    field.innerHTML = '';

    for (let car of this.cards) {
      let card = new ProductCard(car);
      field.append(card.elem);
    }
  }
}


//Вешаем слушателей на отрисованные карточки
function cardListener() {
    
  //Ищем коллецию карточек на нашем поле
  let arrowCard = field.querySelectorAll('.card');
  // console.log ("777")

  //Создаем цикл для перебора массива и приклеивания функции нашим карточкам
  for (let i = 0; i < arrowCard.length; i++) {
    let clickCard = arrowCard[i];
    //На нулевую карточку слушатель вешать не надо
    if (clickCard.classList.contains('chip00')) {
      // console.log(111)
    } else {
      clickCard.addEventListener('click', сardClick);
      // console.log(222)
    }
  }
  switchLogic = true;
}


// Обрабатываем клик по карточке.
function сardClick(eventObject) {
    //Во избежание множественных быстрых кликов по карточкам и их срабатывания, добавляем логический переключатель, который позволит запустить новую функцию обрабтки клика только при завершении старой.
    if (switchLogic) {
      //в начале функции переключаем в ЛОЖЬ, что бы следующие клики не обрабатывались, пока функция не завершится
      switchLogic = false
      //определяем обьект клика
      clickedEl = eventObject.currentTarget;

      //Если на обьекте клика нет класса active, то 
      //Зачем это условие?
      if (!(clickedEl.classList.contains('active'))) {
        //мы добавляем класс active на карточку
        clickedEl.classList.add('active');
        //Ищем коллецию карточек на нашем поле
        let arrowCard = field.querySelectorAll('.card');

        //Создаем цикл для перебора массива и определения номеров активной и нулевой карточки
        for (let i = 0; i < arrowCard.length; i++) {
          let clickCard = arrowCard[i];
          if (clickCard.classList.contains('active')) {
            // запоминаем индекс активной карточки
            activeCard = i;
          } else if (clickCard.classList.contains('chip00')) {
            //запоминаем индекс нулевой картоски
            zeroCard = i;
          }
        }
        //мы удаляем класс active на карточку
        clickedEl.classList.remove('active');
        //Запускаем функцию определения можно ли двигать карточку
        allowMovement();
      }
    }
}

//функция определения можно ли двигать карточку
function allowMovement() {
  if ((activeCard === 3) ||
      (activeCard === 7) ||
      (activeCard === 11)) {

    if (activeCard === (zeroCard + 1)) {
      allowedCard()
    } else if  (activeCard === (zeroCard - 4)) {
      allowedCard()
    } else if  (activeCard === (zeroCard + 4)) {
      allowedCard()
    } else {
      missCard()
    }

  } else if ((activeCard === 4) ||
            (activeCard === 8) ||
            (activeCard === 12)) {

    if (activeCard === (zeroCard - 1)) {
      allowedCard()
    } else if  (activeCard === (zeroCard - 4)) {
      allowedCard()
    } else if  (activeCard === (zeroCard + 4)) {
      allowedCard()
    } else {
      missCard()
    }

  } else {

    if (activeCard === (zeroCard - 1)) {
      allowedCard()
    } else if  (activeCard === (zeroCard + 1)) {
      allowedCard()
    } else if  (activeCard === (zeroCard - 4)) {
      allowedCard()
    } else if  (activeCard === (zeroCard + 4)) {
      allowedCard()
    } else {
      missCard()
    }
  } 
}

//обработка клика по карточке, которую можно двигать
function allowedCard() {
  //меняем местами элементы в массиве
  transformArray()
  //перерисовываем массив
  new ProductGrid(workingArrayCards);
  //заново вешаем слушателей
  cardListener();
  successfulClick++;
  renderQuantityClick()
}

//трансформация массива
function transformArray() {
  let tmp = workingArrayCards[activeCard];
  workingArrayCards[activeCard] = workingArrayCards[zeroCard];
  workingArrayCards[zeroCard] = tmp;
} 

//подсветка карточки, которую нельзя двигать
function missCard() {
  let tempEl = clickedEl
  tempEl.classList.add('miss');
  setTimeout(() => {
    tempEl.classList.remove('miss')
    switchLogic = true;

  }, 100);
}

randomArrow(cards, size)


//отрисовываем результат поиска совпадений
function renderQuantityClick() {
  coincidencesChip();
  playingResults.innerHTML = '';
  let elem = createElement(`<div class="additional-field__playing-results_content">
      <div class="additional-field__playing-results_text">
      <hr> Передвинуто фишек: ${successfulClick}
      </div>
      <div class="additional-field__playing-results_text">
      Фишек на своих местах: ${winningMatches}
      </div>
    </div>`);

  //Вставляем элемент в игровое поле вместо карточек
  playingResults.append(elem);
  if (winningMatches === 15) {
    console.log("ddddddd")
    gameOver()
  }
}
//очищаем результат поиска совпадений
function clearQuantityClick() {
  playingResults.innerHTML = '';
}

//Проверяем количество фишек на своих местах
function coincidencesChip() {
  //Обнуляем значение совпадений
  winningMatches = 0;
  //Вводим доп переменную, с котрой проводим сравнение (наши карточки должны стоять по порядку возрастания)
  let n = 0;
  //Создаем цикл для перебора массива и определяем местонахождение каждой карточки в соответсвии с эталоном
  for (let i = 0; i < workingArrayCards.length; i++) {
    let elCard = workingArrayCards[i];
    ++n;
    if (elCard.id == n) {
      // Увеличиваем количество совпалений
      winningMatches++;
    }
  }
}


//Вешаем слушателей на кнопку обмена карточек
function btnExchangeListener() {
    
  //Ищем кнопку на нашем поле
  let btnExchange = additionalField.querySelector('.additional-field__replacing-chips_button');
  //приклеиваем к ней функцию и слушателя
  btnExchange.addEventListener('click', btnCardExchange);
}
btnExchangeListener()


//Функция кнопки ОБМЕН ФИШКИ
function btnCardExchange() {
  //Обновляем игровое поле и вешаем новых слушателей на фишки
  new ProductGrid(workingArrayCards);
  cardExchangeListener();

  //отрисовываем совет после нажатия на кнопку
  let el = additionalField.querySelector('.additional-field__replacing-chips')
  el.innerHTML = '';
  let elem = createElement(`<div class="additional-field__replacing-chips_text">
  <hr> Выберите две фишки
    </div>`);

  //Вставляем элемент в игровое поле вместо кнопки
  el.append(elem);
}


//Функция для слушателя карточек при их обмене
function cardExchangeListener() {
  //Ищем коллецию карточек на нашем поле
  let arrowCard = field.querySelectorAll('.card');
  // console.log ("777")

  //Создаем цикл для перебора массива и приклеивания функции нашим карточкам
  for (let i = 0; i < arrowCard.length; i++) {
    let clickCard = arrowCard[i];
    //На нулевую карточку слушатель вешать не надо
    if (clickCard.classList.contains('chip00')) {
      // console.log(111)
    } else {
      clickCard.addEventListener('click', cardExchange);
      // console.log(222)
    }
  }
}

function cardExchange(eventObject) {
        //определяем обьект клика
        let clickedElem = eventObject.currentTarget;
        //Если на обьекте клика есть класса exchange, то удаляем его
        if ((clickedElem.classList.contains('exchange'))) {
          //мы добавляем класс active на карточку
          clickedElem.classList.remove('exchange');
          //меняем лог переключатель
          exchangeLogic = true;
        } else if (exchangeLogic !== false){
          //присваиваем класс exchange
          clickedElem.classList.add('exchange');
          //Добавляем логический переключатель
          exchangeLogic = false;
        } else {
          //присваиваем класс exchangeSecond
          clickedElem.classList.add('exchangeSecond');
          // собираем коллекцию элементов
          let arrowCard = field.querySelectorAll('.card');
          //Создаем цикл для перебора массива и поиска индексов
          for (let i = 0; i < arrowCard.length; i++) {
            let clickCard = arrowCard[i];
            if (clickCard.classList.contains('exchange')) {
              // запоминаем индекс активной карточки
              activeCard = i;
              clickCard.classList.remove('exchange')
            } else if (clickCard.classList.contains('exchangeSecond')) {
              //запоминаем индекс нулевой картоски
              zeroCard = i;
              clickCard.classList.remove('exchangeSecond')
            }
          }
          allowedCard()
          //отрисовываем совпосле нажатия на кнопку
          let el = additionalField.querySelector('.additional-field__replacing-chips')
          el.innerHTML = '';
          el.classList.add('additional-field__replacing-chips_unnecessary')
        }
}


function gameOver() {
  console.log("hjjhjhjhjh")
  field.innerHTML = '';
  let element = createElement(`<div class="playing-field__game-over">
      <img class="playing-field__game-over_img" src="https://i.gifer.com/embedded/download/G4ZO.gif" alt="Финальная картинка"/>
    </div>`);

  //Вставляем элемент в игровое поле вместо карточек
  field.append(element);
  field.classList.add('playing-field_end');

  //На всякий случай еще раз прячем кнопку обмена
  let el = additionalField.querySelector('.additional-field__replacing-chips')
  el.innerHTML = '';
  el.classList.add('additional-field__replacing-chips_unnecessary')
  
  setTimeout(function(){
    location.reload();
  }, 5000);
}

