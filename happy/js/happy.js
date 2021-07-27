var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
// 开始
window.onload = function () {
  randomNum(5);
  // randomNum(1);
  var timer = setInterval(() => {
    // randomNum(3);
    // randomNum(1);
  }, 3000);
  document.addEventListener('click', function(event) {
    console.log(event.clientX, event.clientY);
  })
}
// 随机起点和终点的X坐标
function getRandomX(num) {
  var randomNum;
  do {
    randomNum = Math.random();
  } while (randomNum < 0.1 || randomNum > 0.9);
  return randomNum * num;
}
// 随机终点的Y坐标
function getRandomY(num) {
  var randomNum;
  do {
    randomNum = Math.random();
  } while (randomNum < 0.3 || randomNum > 0.8);
  return randomNum * num;
}
// 获得min和max之间的随机数
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
// 烟花爆炸后的随机路径
function getBoomArray() {
  var array1 = [getRandom(0, 90), getRandom(90, 180), getRandom(180, 270), getRandom(270, 360)];
  var array2 = [getRandom(0, 90), getRandom(90, 180), getRandom(180, 270), getRandom(270, 360)];
  // var array3 = [getRandom(0, 90), getRandom(90, 180), getRandom(180, 270), getRandom(270, 360)];
  var array = array1.concat(array2);
  return array;
}
// 产生随机的起止点
function randomNum(num) {
  for (var i = 0; i < num; i++) {
    // var startPointX = Math.floor(getRandomX(clientWidth));
    var startPointX = 130;
    var endPointX = Math.floor(getRandomX(clientWidth));
    var endPointY = Math.floor(getRandomY(clientHeight));
    startAndEnd(startPointX, 0, endPointX, endPointY);
  }
}
// 烟花的起止点
function startAndEnd(startX, startY, endX, endY) {
  console.log(endX, endY);
  var k = (endY - startY) / (endX - startX);
  var angleInit = Math.atan2(endY, endX - startX) * 180 / Math.PI;
  var angle = k > 0 ? 90 - angleInit : -(angleInit - 90);
  var div = document.createElement('div');
  div.classList.add('flame');
  document.body.appendChild(div);
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
  document.body.removeChild(element);
  console.log(x, y);
  var boomArray = getBoomArray();
  console.log(boomArray);
  for (var i = 0; i < boomArray.length; i++) {
    // 设置火焰路径
    let boom = document.createElement('div');
    boom.classList.add('boom');
    document.body.appendChild(boom);
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
      // document.body.removeChild(boom);
      boom.removeChild(flash);
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