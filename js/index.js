let icons = ['<i class="fas fa-heart fa-5x"></i>', '<i class="fab fa-angellist fa-5x"></i>','<i class="fas fa-archway fa-5x"></i>', '<i class="fas fa-atom fa-5x"></i>',
'<i class="fas fa-basketball-ball fa-5x"></i>', '<i class="fas fa-bell fa-5x"></i>', '<i class="fas fa-biking fa-5x"></i>',
'<i class="fas fa-biohazard fa-5x"></i>', '<i class="fas fa-chess-queen fa-5x"></i>', '<i class="fas fa-chess-knight fa-5x"></i>',
'<i class="fab fa-chrome fa-5x"></i>', '<i class="fas fa-cocktail fa-5x"></i>', '<i class="fas fa-cog fa-5x"></i>', '<i class="fas fa-couch fa-5x"></i>',
'<i class="fas fa-cut fa-5x"></i>', '<i class="fas fa-dharmachakra fa-5x"></i>', '<i class="fab fa-edge fa-5x"></i>','<i class="fas fa-adjust fa-5x"></i>',
'<i class="fab fa-android fa-5x"></i>', '<i class="fab fa-apple fa-5x"></i>', '<i class="fas fa-award fa-5x"></i>'
];

const elements = {
  cardContainer: document.querySelector('.card-container'),
  start: document.querySelector('.start'),
  timer: document.querySelector('.timer'),
  timerText: document.querySelector('.timer-text'),
  score: document.querySelector('.score'),
  scoreText: document.querySelector('.score-text'),
  topBar: document.querySelector('.top-bar')
};

class GameProperties {
  constructor(score, gameTemplate, userClicked, matchedCards, wrongCards, userClickedIndex){
    this.score = score,
    this.gameTemplate = gameTemplate,
    this.userClicked = userClicked,
    this.matchedCards = matchedCards,
    this.wrongCards = wrongCards,
    this.userClickedIndex = userClickedIndex
  }

  checkCard(index) {
    let cards = [];
    if(this.userClicked.length > 1){
      let card1 = this.gameTemplate.indexOf(Number(this.userClicked[0]));
      let card2 = this.gameTemplate.lastIndexOf(Number(this.userClicked[1]));

      if(this.gameTemplate[card1] == this.gameTemplate[card2]) {
        cards = [card1, card2];
        this.matchedCards.push(Number(this.userClickedIndex[0]));
        this.matchedCards.push(Number(this.userClickedIndex[1]));
      } else {
        cards = [];
        this.wrongCards = [Number(this.userClickedIndex[0]), Number(this.userClickedIndex[1])];
      }
      this.userClicked = [];
      return cards;
    } else {
      return cards;
    }
  }
}

const gameProperty = new GameProperties(0, [], [], [], [], []);

function loadEmptyCard() {
  let markup = `<div class="card-home"></div>`;
  elements.cardContainer.classList.add('card-container-home');
  for(let i = 0; i < 21; i++) {
    if(i % 2 == 0){
      let markup = `<div class="card-home">${icons[i]}</div>`;
      elements.cardContainer.insertAdjacentHTML('beforeend', markup);
    } else {
      elements.cardContainer.insertAdjacentHTML('beforeend', markup);
    }
  }
}

function loadIcons() {
    uiInit();
    stopWatch(60, elements);
    elements.cardContainer.classList.remove('card-container-home');
    let numbers = reRunRandom(randomNumbers(10));
    if(numbers.length == 0) {
      numbers = reRunRandom(randomNumbers(10));
    }
    if (numbers.length == 6) {
      elements.cardContainer.classList.add('card-container-six');
    } else if (numbers.length == 8) {
      elements.cardContainer.classList.add('card-container-eight');
    } else if (numbers.length == 10) {
      elements.cardContainer.classList.add('card-container-ten');
    }
    for(let i = 0; i < numbers.length; i++ ) {
      let markup;
      let icon = icons[numbers[i]];
      let iconName = icon.slice(17, icon.lastIndexOf(' '));
      gameProperty.gameTemplate.push(numbers[i]);
      markup = `<div class="card card${i}" data-clicked-index="${i}" data-index="${numbers[i]}" id="card${i}" onclick="cardClick(this)">${icon}</div>`;
      elements.cardContainer.insertAdjacentHTML('beforeend', markup);
    }
}

function uiInit() {
  elements.cardContainer.innerHTML = '';
  elements.start.style.display = 'none';
  elements.score.style.display = 'block';
  elements.timer.style.display = 'block';
}

function stopWatch(seconds, el = elements) {
  const current = seconds - 1;
  if(current > 9) {
    setTimeout(function(){
      el.timerText.innerText = `00:${current} secs`;
      stopWatch(current);
    }, 1000);
  } else if (current <= 9 && current != 1) {
    setTimeout(function(){
      el.timerText.style.color = 'red';
      el.timerText.innerText = `00:${current} secs`;
      stopWatch(current);
    }, 1000);
  } else if (current == 1) {
    elements.topBar.innerHTML = '<h1>Time Up !!!</h1>';
    setTimeout(function(){
      location.reload();
    }, 500);
  }
}


function reRunRandom(arr){
  let finalArr;
  if(arr.length > 12 || arr.length >= 2 && arr.length < 6){
    finalArr = randomNumbers(arr);
  } else {
    finalArr = arr;
  }
  return finalArr;
}

function randomNumbers(limit) {
  let numsArr = [];
  let numsArr2 = [];
  for(let i = 0; i < limit; i++) {
    let number = Math.floor(Math.random() * limit);
      numsArr.push(number);
  }
  for(let i = 0; i < limit; i++) {
    let number = Math.floor(Math.random() * limit);
      numsArr2.push(number);
  }
  const result = removeDuplicate(numsArr, numsArr2);
  return result;
}


function removeDuplicate(arr1, arr2) {
  const allArr = [...new Set(arr1), ...new Set(arr2)];
  const finalArr = [];
  allArr.forEach( (el) => {
    let count = 0;
    let ele;
    for(let i = 0; i < allArr.length; i++) {
      if(el == allArr[i]) {
        count += 1;
        ele = el;
      }
    }
    if(count > 1) {
      finalArr.push(ele);
    }
  });
  return finalArr;
}

function cardClick(el){
  const element = el.getAttribute('id');
  const iconIndex = el.getAttribute('data-index');
  const clickedIndex = el.getAttribute('data-clicked-index');

  gameProperty.userClickedIndex.push(clickedIndex);
  gameProperty.userClicked.push(iconIndex);

  document.querySelector(`.${element}`).classList.add('clicked-card');
  addCorrectClassOrWin(gameProperty.matchedCards);

  const cards = gameProperty.checkCard(iconIndex);

  if(cards != ''){
    if(cards.length > 1){
      cards.forEach( (el) => {
        document.getElementById(`card${el}`).classList.add('correct');
      });
      gameProperty.score += 100;
      elements.scoreText.innerHTML = gameProperty.score;
      gameProperty.userClickedIndex = [];
      winBanner(gameProperty.matchedCards);
    }
  } else {
    if(gameProperty.wrongCards.length > 1){

      gameProperty.wrongCards.forEach( (el) => {
        document.getElementById(`card${el}`).classList.remove('correct');
        document.getElementById(`card${el}`).classList.add('wrong');
      });
      removeWrongClass();
      gameProperty.userClickedIndex = [];
    }
  }
}

function winBanner(arr) {
  if(arr.length == gameProperty.gameTemplate.length) {
      elements.topBar.style.display = 'block';
      elements.topBar.innerHTML = '<h1 class="win-text">You Win :)</h1>';
      setTimeout(function(){
        location.reload();
      }, 1000);
  }
}

function addCorrectClassOrWin(arr) {
    arr.forEach( (el) => {
        document.querySelector(`.card${el}`).classList.add('clicked-card');
        document.querySelector(`.card${el}`).classList.add('correct');
    });
}

function removeWrongClass() {
  let allWrong = document.querySelectorAll('.wrong');
  allWrong.forEach( (el) => {
    el.addEventListener('animationend',function(){
      el.classList.remove('clicked-card');
      el.classList.remove('wrong');
    });
  });
  gameProperty.wrongCards = [];
}
