"use strict";

function Tag(params) {
  // //Устанавливаем начальное значение количества карточек
  //   this.size = 16;
  //Переменная с количеством удачных кликов
    this.successfulClick = 0;
  //переменная с количеством совпадений с выигрышным вариантом
    this.winningMatches = 0;
  //Ставим переключатель отработки функции 
    this.switchLogic;
  //Активная карточка номер
    this.activeCard;
  //Нулевая карточка номер
    this.zeroCard;
  //Рабочий массив карточек
    this.workingArrayCards = [];
  //Элемент, по которому прошел клик
    this.clickedEl;
  //Логический переключатель для кнопки обмена карточек
    this.exchangeLogic = true;

//Зафиксируем this у нескольких обьектов

// this.clickedElBind = this.clickedEl.bind(this);
// this.switchLogic = this.switchLogicBind.bind(this);
// this.activeCard = this.activeCardBind.bind(this);
// this.zeroCard = this.zeroCardBind.bind(this);


  //Ищем элемент с нашим полем под карточки
    this.field = document.querySelector('.playing-field');
  //Ищем элемент с результатом кликов
    this.playingResults = document.querySelector('.additional-field__playing-results');
  //Ищем элемент с дополнительным полем
    this.additionalField = document.querySelector('.additional-field');

  //Для перемешивания массива используем отличный алгоритм под названием Тасование Фишера — Йетса. Суть заключается в том, чтобы проходить по массиву в обратном порядке и менять местами каждый элемент со случайным элементом, который находится перед ним.
    this.mixing = function (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      };
    };

  //функция изготовления случайного массива карточек в начале игры».
    this.randomArrow = function (arr) {
      this.successfulClick = 0;
      this.unsuccessfulClick = 0;
    //Дублируем исходный массив
      this.workingArrayCards = [...arr];
    //Перемешиваем, что бы не повторялись начальные карточки
      this.mixing(this.workingArrayCards) 
    //строим игровую сетку из полученного масиива
      this.cardsGrid(this.workingArrayCards);
    //навешиваем слушателей на карточки
      this.cardListener()
      this.btnExchangeListener()

    };

  //Вешаем слушателей на отрисованные карточки
    this.cardListener = function () {
        
    //Ищем коллецию карточек на нашем поле
      let arrowCard = this.field.querySelectorAll('.card');
    // console.log ("777")

    //Создаем цикл для перебора массива и приклеивания функции нашим карточкам
      for (let i = 0; i < arrowCard.length; i++) {
        let clickCard = arrowCard[i];
      //На нулевую карточку слушатель вешать не надо
        if (clickCard.classList.contains('chip00')) {
        } else {
          let that = this;
          clickCard.addEventListener('click', function (e) {
            that.сardClick(e);
          } );
        }
      }
      this.switchLogic = true;
    };

  // Обрабатываем клик по карточке.
    this.сardClick = function (e) {
    //Во избежание множественных быстрых кликов по карточкам и их срабатывания, добавляем логический переключатель, который позволит запустить новую функцию обрабтки клика только при завершении старой.
      if (this.switchLogic) {
      //в начале функции переключаем в ЛОЖЬ, что бы следующие клики не обрабатывались, пока функция не завершится
        this.switchLogic = false
      //определяем обьект клика
        this.clickedEl = e.currentTarget;
      //Если на обьекте клика нет класса active, то 
      //Зачем это условие?
      console.log ("444")
        if (!(this.clickedEl.classList.contains('active'))) {
        //мы добавляем класс active на карточку
          this.clickedEl.classList.add('active');
        //Ищем коллецию карточек на нашем поле
          let arrowCard = this.field.querySelectorAll('.card');

        //Создаем цикл для перебора массива и определения номеров активной и нулевой карточки
          for (let i = 0; i < arrowCard.length; i++) {
            let clickCard = arrowCard[i];
            if (clickCard.classList.contains('active')) {
          // запоминаем индекс активной карточки
              this.activeCard = i;
            } else if (clickCard.classList.contains('chip00')) {
          //запоминаем индекс нулевой картоски
              this.zeroCard = i;
            }
          }
        //мы удаляем класс active на карточку
          this.clickedEl.classList.remove('active');
        //Запускаем функцию определения можно ли двигать карточку
          this.allowMovement();
        }
      }
    };

    //функция определения можно ли двигать карточку
    this.allowMovement = function () {
      if ((this.activeCard === 3) ||
          (this.activeCard === 7) ||
          (this.activeCard === 11)) {

        if (this.activeCard === (this.zeroCard + 1)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard - 4)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard + 4)) {
          this.allowedCard()
        } else {
          this.missCard()
        }

      } else if ((this.activeCard === 4) ||
                (this.activeCard === 8) ||
                (this.activeCard === 12)) {

        if (this.activeCard === (this.zeroCard - 1)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard - 4)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard + 4)) {
          this.allowedCard()
        } else {
          this.missCard()
        }

      } else {

        if (this.activeCard === (this.zeroCard - 1)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard + 1)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard - 4)) {
          this.allowedCard()
        } else if  (this.activeCard === (this.zeroCard + 4)) {
          this.allowedCard()
        } else {
          this.missCard()
        }
      } 
    };

    //обработка клика по карточке, которую можно двигать
    this.allowedCard = function () {
      let that = this;
      //меняем местами элементы в массиве
      this.transformArray()
      //перерисовываем массив
      this.cardsGrid(this.workingArrayCards);
      //заново вешаем слушателей
      this.cardListener();
      this.successfulClick++;
      this.renderQuantityClick()
    };

    //подсветка карточки, которую нельзя двигать
    this.missCard = function () {
      let tempEl = this.clickedEl;
      console.log(tempEl)
      tempEl.classList.add('miss');
      // let that = this;
      console.log(tempEl)

      setTimeout(() => {
        tempEl.classList.remove('miss')
        this.switchLogic = true;

      }, 200);
    };

    //трансформация массива
    this.transformArray = function () {
      let tmp = this.workingArrayCards[this.activeCard];
      this.workingArrayCards[this.activeCard] = this.workingArrayCards[this.zeroCard];
      this.workingArrayCards[this.zeroCard] = tmp;
    };

    //отрисовываем результат поиска совпадений
    this.renderQuantityClick = function () {
      this.coincidencesChip();
      this.playingResults.innerHTML = '';
      let elem = this.createElement(`<div class="additional-field__playing-results_content">
          <div class="additional-field__playing-results_text">
          <hr> Передвинуто фишек: ${this.successfulClick}
          </div>
          <div class="additional-field__playing-results_text">
          Фишек на своих местах: ${this.winningMatches}
          </div>
        </div>`);

      //Вставляем элемент в игровое поле вместо карточек
      this.playingResults.append(elem);
      if (this.winningMatches === 15) {
        this.gameOver()
      }
    };

    //Проверяем количество фишек на своих местах
    this.coincidencesChip = function () {
      //Обнуляем значение совпадений
      this.winningMatches = 0;
      //Вводим доп переменную, с котрой проводим сравнение (наши карточки должны стоять по порядку возрастания)
      let n = 0;
      //Создаем цикл для перебора массива и определяем местонахождение каждой карточки в соответсвии с эталоном
      for (let i = 0; i < this.workingArrayCards.length; i++) {
        let elCard = this.workingArrayCards[i];
        ++n;
        if (elCard.id == n) {
          // Увеличиваем количество совпалений
          this.winningMatches++;
        }
      }
    };

    //Вешаем слушателей на кнопку обмена карточек
    this.btnExchangeListener = function () {
      //Ищем кнопку на нашем поле
      let btnExchange = this.additionalField.querySelector('.additional-field__replacing-chips_button');
      //приклеиваем к ней функцию и слушателя
      let that = this;
      btnExchange.addEventListener('click', function (e) {
        that.btnCardExchange(e);
      });
    };

    //Функция кнопки ОБМЕН ФИШКИ
    this.btnCardExchange = function () {
      //Обновляем игровое поле и вешаем новых слушателей на фишки
      this.cardsGrid(this.workingArrayCards);
      this.cardExchangeListener();

      //отрисовываем совет после нажатия на кнопку
      let el = this.additionalField.querySelector('.additional-field__replacing-chips')
      el.innerHTML = '';
      let elem = this.createElement(`<div class="additional-field__replacing-chips_text">
      <hr> Выберите две фишки
        </div>`);

      //Вставляем элемент в игровое поле вместо кнопки
      el.append(elem);
    };

    //Функция для слушателя карточек при их обмене
    this.cardExchangeListener = function () {
      //Ищем коллецию карточек на нашем поле
      let arrowCard = this.field.querySelectorAll('.card');
      // console.log ("777")

      //Создаем цикл для перебора массива и приклеивания функции нашим карточкам
      for (let i = 0; i < arrowCard.length; i++) {
        let clickCard = arrowCard[i];
        //На нулевую карточку слушатель вешать не надо
        if (clickCard.classList.contains('chip00')) {
          // console.log(111)
        } else {
          let that = this;
          clickCard.addEventListener('click', function (e) {
            that.cardExchange(e);
          } );
          // console.log(222)
        }
      }
    };

    //Функция передвижения карточек
    this.cardExchange = function (e) {
      //определяем обьект клика
      let clickedElem = e.currentTarget;
      //Если на обьекте клика есть класса exchange, то удаляем его
      if ((clickedElem.classList.contains('exchange'))) {
        //мы добавляем класс active на карточку
        clickedElem.classList.remove('exchange');
        //меняем лог переключатель
        this.exchangeLogic = true;
      } else if (this.exchangeLogic !== false){
        //присваиваем класс exchange
        clickedElem.classList.add('exchange');
        //Добавляем логический переключатель
        this.exchangeLogic = false;
      } else {
        //присваиваем класс exchangeSecond
        clickedElem.classList.add('exchangeSecond');
        // собираем коллекцию элементов
        let arrowCard = this.field.querySelectorAll('.card');
        //Создаем цикл для перебора массива и поиска индексов
        for (let i = 0; i < arrowCard.length; i++) {
          let clickCard = arrowCard[i];
          if (clickCard.classList.contains('exchange')) {
            // запоминаем индекс активной карточки
            this.activeCard = i;
            clickCard.classList.remove('exchange')
          } else if (clickCard.classList.contains('exchangeSecond')) {
            //запоминаем индекс нулевой картоски
            this.zeroCard = i;
            clickCard.classList.remove('exchangeSecond')
          }
        }
        this.allowedCard()
        //отрисовываем совпосле нажатия на кнопку
        let el = this.additionalField.querySelector('.additional-field__replacing-chips')
        el.innerHTML = '';
        el.classList.add('additional-field__replacing-chips_unnecessary')
      }
    };

    //Функция завершения игры
    this.gameOver = function () {
      this.field.innerHTML = '';
      let element = this.createElement(`<div class="playing-field__game-over">
          <img class="playing-field__game-over_img" src="../assets/images/3b07736s-19201.jpg" alt="Грибок"/>
          <img class="playing-field__game-over_img" src="https://i.gifer.com/embedded/download/G4ZO.gif" alt="Празднование гифка"/>
        </div>`);
    
      //Вставляем элемент в игровое поле вместо карточек
      this.field.append(element);
      this.field.classList.add('playing-field_end');
    
      //На всякий случай еще раз прячем кнопку обмена
      let el = this.additionalField.querySelector('.additional-field__replacing-chips')
      el.innerHTML = '';
      el.classList.add('additional-field__replacing-chips_unnecessary')
      
      setTimeout(function(){
        location.reload();
      }, 10000);
    };
    
    //Маленькая функция для добавления элементов
    this.createElement = function (html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.firstElementChild;
    };

    //Заполняем игровое поле
    this.cardsGrid = function (cards) {
      this.field.innerHTML = '';

      for (let el of cards) {
        let elem = this.createElement(`<div class="card-container">
            <div class="card ${el.name}">
              <div class="card-front">
                ${el.id}
              </div>
            </div>
          </div>`);
          this.field.append(elem);
      }
    };

}


  
