var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
window.onload = function () {
  randomNum(5);
  var timer = setInterval(() => {
    randomNum(5);
  }, 3000);
}

function getRandomX(num) {
  var randomNum;
  do {
    randomNum = Math.random();
  } while (randomNum < 0.1 || randomNum > 0.9);
  return randomNum * num;
}

function getRandomY(num) {
  var randomNum;
  do {
    randomNum = Math.random();
  } while (randomNum < 0.3 || randomNum > 0.8);
  return randomNum * num;
}

function randomNum(num) {
  for (var i = 0; i < num; i++) {
    var startPointX = getRandomX(clientWidth);
    var endPointX = getRandomX(clientWidth);
    var endPointY = getRandomY(clientHeight);
    startAndEnd(startPointX, 0, endPointX, endPointY);
  }
}

function startAndEnd(startX, startY, endX, endY) {
  var k = (endY - startY) / (endX - startX);
  var angleInit = Math.atan2(endY, endX - startX) * 180 / Math.PI;
  var angle = k > 0 ? 90 - angleInit : -(angleInit - 90);
  var div = document.createElement('div');
  document.body.appendChild(div);
  $(div).addClass('flame').css({
    bottom: startY + 'px',
    left: startX + 'px',
    transform: 'rotate(' + angle + 'deg)'
  }).animate({
    bottom: endY + 'px',
    left: endX + 'px'
  }, 2000, function () {
    boom(div);
  })
}

function boom(element, x, y) {
  document.body.removeChild(element);
}