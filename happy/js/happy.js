const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
const mutech = clientHeight / 10;
const mutecw = clientWidth / 10;

const initElementArr = ['.initPage', '.firstPage', '.secondPage', 'thirdPage'];
const text = ['哈哈', '嘻嘻', '嘿嘿', '哈哈哈'];

const initPart = document.querySelector('.initPart');
const starPart = document.querySelector('.starPart');
const metePart = document.querySelector('.meteorPart');
const boomPart = document.querySelector('.boomPart');

var initNum = 0;
var clickNum = 0;

var timerMeteor = null;
var timerBoom = null;
// 开始
window.onload = function () {
  document.addEventListener('click', function (event) {
    console.log(event.clientX, event.clientY);
    let showText = text[clickNum];
    clickNum = clickNum === text.length - 1 ? 0 : clickNum + 1;
    let tagP = document.createElement('p');
    tagP.classList.add('helloTip');
    document.body.appendChild(tagP);
    $(tagP).text(showText).css({
      top: event.clientY - 20 + 'px',
      left: event.clientX + 'px',
      color: getRandomColor()
    }).stop().animate({
      top: event.clientY - 50 + 'px',
      opacity: 0
    }, 1000, function () {
      document.body.removeChild(tagP);
    })
  }, false)
  document.addEventListener('mousewheel', function (event) {
    if (!event.ctrlKey) {
      debounce(mousewheelEvent, 500, event);
    }
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
// 获得随机颜色
function getRandomColor() {
  let r = getRandom(0,255);
  let g = getRandom(0,255);
  let b = getRandom(0,255);
  return `rgb(${r}, ${g}, ${b})`;
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
  // createStar = function () {};
}
// 第二部分:流星-------------------------------------------------------------------------------------
function createMeteor(num) {
  let muteX = Math.floor(clientWidth / num);
  for (let i = 0; i < num; i++) {
    let startX = Math.floor(getRandom(muteX * i, muteX * (i + 1)));
    let startY = clientHeight;
    let endY = Math.floor(getRandom(0, clientHeight / 2));
    let endX = startX - (startY - endY);
    setTimeout(() => {
      meteor(startX, startY, endX, endY)
    }, getRandom(0, 5000));
  }
}

function meteor(x, y, ex, ey) {
  let hght = (y - ey) * 1.5;
  let meteorPath = document.createElement('div');
  meteorPath.classList.add('meteorPath');
  metePart.appendChild(meteorPath);
  $(meteorPath).css({
    height: hght + 'px',
    left: x + 'px'
  })
  let div = document.createElement('div');
  div.classList.add('meteor');
  meteorPath.appendChild(div);
  // 设置流星的起止点
  $(div).stop().animate({
    top: hght - 5 + 'px'
  }, getRandom(7000, 9000), 'linear', function () {
    meteorPath.removeChild(div);
  })
  // 设置流星轨迹
  let timer = setInterval(() => {
    let divCopy = document.createElement('div');
    divCopy.classList.add('meteorCopy');
    meteorPath.appendChild(divCopy);
    $(divCopy).css({
      top: $(div).css('top'),
      left: $(div).css('left')
    }).stop().animate({
      opacity: 0
    }, 2000, 'linear', function () {
      meteorPath.removeChild(divCopy);
    })
    if ($(div).is(':hidden')) {
      clearInterval(timer);
      setTimeout(() => {
        metePart.removeChild(meteorPath);
      }, 2000);
    }
  }, 20);
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
    setTimeout(() => {
      boomStartAndEnd(startPointX, 0, endPointX, endPointY);
    }, getRandom(0, 4000));
  }
}
// 烟花的起止点
function boomStartAndEnd(startX, startY, endX, endY) {
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
  }, 2000, 'swing', function () {
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
      clearInterval(timerBoom);
      clearInterval(timerMeteor);
      $('.initPage').css({
        display: 'block'
      })
      $('.initPage').stop().animate({
        opacity: 1
      }, 1000)
      $('.initPage').siblings().stop().animate({
        opacity: 0
      }, 1000, function () {
        $('.initPage').siblings().css({
          display: 'none'
        })
      })
      break;
    case 1:
      clearInterval(timerBoom);
      clearInterval(timerMeteor);
      $('.firstPage').css({
        display: 'block'
      })
      $('.firstPage').stop().animate({
        opacity: 1
      }, 1000, function () {
        $(starPart).empty();
        // $(boomPart).empty();
        createMeteor(4);
        timerMeteor = setInterval(() => {
          createMeteor(4);
        }, getRandom(5000, 8000));
      })
      $('.firstPage').siblings().stop().animate({
        opacity: 0
      }, 1000, function () {
        $('.firstPage').siblings().css({
          // display: 'none'
        })
      })
      break;
    case 2:
      clearInterval(timerBoom);
      clearInterval(timerMeteor);
      $('.secondPage').css({
        display: 'block'
      })
      $('.secondPage').stop().animate({
        opacity: 1
      }, 1000, function () {
        $(initPart).empty();
        // $(metePart).empty();
        createStar();
      })
      $('.secondPage').siblings().stop().animate({
        opacity: 0
      }, 1000, function () {
        $('.secondPage').siblings().css({
          // display: 'none'
        })
      })
      break;
    case 3:
      clearInterval(timerBoom);
      clearInterval(timerMeteor);
      $('.thirdPage').css({
        display: 'block'
      })
      $('.thirdPage').stop().animate({
        opacity: 1
      }, 1000, function () {
        $(starPart).empty();
        startBoom(5);
        timerBoom = setInterval(() => {
          startBoom(5);
        }, 4000);
      })
      $('.thirdPage').siblings().stop().animate({
        opacity: 0
      }, 1000, function () {
        $('.thirdPage').siblings().css({
          // display: 'none'
        })
      })
      break;
  }
}