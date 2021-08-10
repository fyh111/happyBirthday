const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
const mutech = clientHeight / 10;
const mutecw = clientWidth / 10;

var initNum = 0;
var initElementArr = ['.initPage', '.firstPage', '.secondPage', 'thirdPage'];

const initPage = document.querySelector('.initPage');
const starPart = document.querySelector('.starPart');
const metePart = document.querySelector('.meteorPart');
const boomPart = document.querySelector('.boomPart');

var timerBoom = null;
// 开始
window.onload = function () {
  document.addEventListener('click', function (event) {
    console.log(event.clientX, event.clientY);
  }, false)
  document.addEventListener('mousewheel', function(event){
    debounce(mousewheelEvent, 500, event);
  }, false);
}

// 通用函数------------------------------------------------------------------------------------------
// 随机起点和终点的X坐标
function getRandomX(num) {
  let randNum;
  do {
    randNum = Math.random();
  } while (randNum < 0.1 || randNum > 0.9);
  return randNum * num;
}
// 随机终点的Y坐标
function getRandomY(num) {
  let randNum;
  do {
    randNum = Math.random();
  } while (randNum < 0.3 || randNum > 0.8);
  return randNum * num;
}
// 获得min和max之间的随机数
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 函数节流,一定时间内只能触发一次
const trotol = (() => {
  let timer = null;
  return function (func, timeout, ...args) {
    let that = this;
    if (!timer) {
      func.apply(that, args);
      timer = setTimeout(() => {
        timer = null;
      }, timeout);
    }
  }
})();
// 函数防抖,多次触发时重新计时
const debounce = (() => {
  let timer = null;
  return function (func, timeout, ...args) {
    let that = this;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(that, args)
    }, timeout);
  }
})();
// 鼠标滚轮事件
const mousewheelEvent = function (event) {
  if (event.wheelDelta > 0) {
    console.log(initNum, 'up-now');
    if (initNum == 0) {
      initNum = 0;
    } else {
      initNum--;
      trotol(nextPageClick, 1200, initNum)
    }
  } else {
    console.log(initNum, 'down-now');
    if (initNum == initElementArr.length - 1) {
      initNum = initElementArr.length - 1;
    } else {
      initNum++;
      trotol(nextPageClick, 1200, initNum)
    }
  }
}

// 初始部分函数--------------------------------------------------------------------------------------


// 第一部分:星星-------------------------------------------------------------------------------------
function createStar() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let x = getRandom(mutecw * i, mutecw * (i + 1));
      let y = getRandom(mutech * j, mutech * (j + 1));
      let div = document.createElement('div');
      div.classList.add('star');
      div.style.top = y + 'px';
      div.style.left = x + 'px';
      starPart.appendChild(div);
    }
  }
  createStar = function () {};
}
// 第二部分:流星-------------------------------------------------------------------------------------
function meteor() {
  let x = getRandomX(clientWidth);
  let y = clientHeight;
  let div = document.createElement('div');
  div.classList.add('meteor');
  metePart.appendChild(div);
  $(div).css({
    left: x + 'px'
  })
}
// 第三部分:烟花-------------------------------------------------------------------------------------
// 烟花爆炸后的随机路径
function getBoomArray() {
  let array1 = [getRandom(0, 90), getRandom(90, 180), getRandom(180, 270), getRandom(270, 360)];
  let array2 = [getRandom(0, 90), getRandom(90, 180), getRandom(180, 270), getRandom(270, 360)];
  let array = array1.concat(array2);
  return array;
}
// 产生随机的起止点
function startBoom(num) {
  for (let i = 0; i < num; i++) {
    let startPointX = clientWidth / 2;
    let endPointX = Math.floor(getRandomX(clientWidth));
    let endPointY = Math.floor(getRandomY(clientHeight));
    startAndEnd(startPointX, 0, endPointX, endPointY);
  }
}
// 烟花的起止点
function startAndEnd(startX, startY, endX, endY) {
  let k = (endY - startY) / (endX - startX);
  let angleInit = Math.atan2(endY, endX - startX) * 180 / Math.PI;
  let angle = k > 0 ? 90 - angleInit : -(angleInit - 90);
  let div = document.createElement('div');
  div.classList.add('flame');
  boomPart.appendChild(div);
  $(div).css({
    bottom: startY + 'px',
    left: startX + 'px',
    transform: 'rotate(' + angle + 'deg)'
  }).animate({
    bottom: endY + 'px',
    left: endX + 'px'
  }, 2000, function () {
    boom(div, endX, endY);
  })
}
// 烟花爆炸
function boom(element, x, y) {
  boomPart.removeChild(element);
  let boomArray = getBoomArray();
  for (let i = 0; i < boomArray.length; i++) {
    // 设置火焰路径
    let boom = document.createElement('div');
    boom.classList.add('boom');
    boomPart.appendChild(boom);
    $(boom).css({
      bottom: (y + 10) + 'px',
      left: x + 'px',
      transform: 'rotate(' + boomArray[i] + 'deg)'
    })
    // 设置火焰光点
    let flash = document.createElement('div');
    flash.classList.add('flash');
    boom.appendChild(flash);
    $(flash).stop().animate({
      bottom: '98px'
    }, 3000, function () {
      boom.removeChild(flash);
      $(boom).stop().animate({
        opacity: 0
      }, 500, function () {
        boomPart.removeChild(boom);
      })
    })
    // 设置火焰轨迹
    let timer = setInterval(() => {
      let track = flash.cloneNode();
      track.classList.add('track');
      boom.appendChild(track);
      $(track).css({
        bottom: $(flash).css('bottom')
      })
      $(track).stop().animate({
        opacity: 0
      }, 500)
      if ($(flash).is(':hidden')) {
        clearInterval(timer);
      }
    }, 100);
  }
}
// nextPage事件:翻页---------------------------------------------------------------------------------
function nextPageClick(num) {
  console.log(num, '------->');
  switch (num) {
    case 0:
      clearTimeout(timerBoom);
      $('.initPage').stop().animate({
        opacity: 1
      }, 1000, function () {
        console.log('init');
      })
      $('.initPage').siblings().stop().animate({
        opacity: 0
      }, 1000)
      break;
    case 1:
      clearTimeout(timerBoom);
      $('.firstPage').stop().animate({
        opacity: 1
      }, 1000, function () {
        createStar();
      })
      $('.firstPage').siblings().stop().animate({
        opacity: 0
      }, 1000)
      break;
    case 2:
      clearTimeout(timerBoom);
      $('.secondPage').stop().animate({
        opacity: 1
      }, 1000, function() {
        console.log('second');
      })
      $('.secondPage').siblings().stop().animate({
        opacity: 0
      }, 1000)
      break;
    case 3:
      clearTimeout(timerBoom);
      $('.thirdPage').stop().animate({
        opacity: 1
      }, 1000, function () {
        startBoom(5);
        timerBoom = setInterval(() => {
          startBoom(5);
        }, 3000);
      })
      $('.thirdPage').siblings().stop().animate({
        opacity: 0
      }, 1000)
      break;
  }
}