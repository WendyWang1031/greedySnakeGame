const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

//初始設定
let snake = [];
let stopIntervalId;
let highestScore;
let score = 0;
loadHighestScore();

//宣告變數抓取HTML元素
const myScore = document.getElementById("myScore");
const myScore2 = document.getElementById("myScore2");
const allPageStart = document.getElementById("allPageStart");
const reStart = document.getElementById("reStart");

updateScoreAndHighestScore();
reStart.style.display = "none";
reStart.addEventListener("click", reStartGame);
allPageStart.addEventListener("click", startGame);

//蛇的初始資料
function createSnake() {
  snake = [];
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

function drawBackguond() {
  ctx.fillStyle = "wheat";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
drawBackguond();

//創建水果的資料與方法
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let newFruit_x;
    let newFruit_y;

    function checkOverlap(newFruit_x, newFruit_y) {
      for (let i = 0; i < snake.length; i++) {
        if (newFruit_x == snake[i].x && newFruit_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      newFruit_x = Math.floor(Math.random() * column) * unit;
      newFruit_y = Math.floor(Math.random() * row) * unit;
    } while (overlapping);

    this.x = newFruit_x;
    this.y = newFruit_y;
  }
}
//蛇是否咬到自己
function isSnakeBitten() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      let canvasBorder = document.getElementById("myCanvas");
      canvasBorder.style.border = "5px solid rgb(210,135,135)";
      setTimeout(() => {
        clearInterval(stopIntervalId);
        alert("Game over");
      }, 50);

      return true;
    }
  }
  return false;
}

//創造蛇、隨機水果、設定方向
function drawSnakeAndFruit() {
  createSnake();
  let myFruit = new Fruit();
  let d = "Right";
  window.addEventListener("keydown", changeDirection);

  function changeDirection(e) {
    if (e.key == "ArrowRight" && d != "Left") {
      d = "Right";
    } else if (e.key == "ArrowDown" && d != "Up") {
      d = "Down";
    } else if (e.key == "ArrowLeft" && d != "Right") {
      d = "Left";
    } else if (e.key == "ArrowUp" && d != "Down") {
      d = "Up";
    }
    window.removeEventListener("keydown", changeDirection);
  }

  //畫出蛇、水果
  function draw() {
    isSnakeBitten();
    drawBackguond();
    myFruit.drawFruit();

    //畫出初始蛇的顏色，第0個頭位置是深灰色、其餘是淺灰色
    //strokeStyle勾勒圖形時使用的顏色，可解讀成外框
    for (let i = 0; i < snake.length; i++) {
      if (i == 0) {
        ctx.fillStyle = "grey";
      } else {
        ctx.fillStyle = "lightgrey";
      }
      ctx.strokeStyle = "white";

      //如果蛇的某節x超出了畫布的寬度，則將該節的x座標設定為0，讓他從畫布另一側重新進去
      if (snake[i].x >= canvas.width) {
        snake[i].x = 0;
      }
      //如果蛇的某節x小於0，超出畫布左側，
      //將該節的x座標設定為畫布的寬度減掉一個單位，即畫布的最右側
      if (snake[i].x < 0) {
        snake[i].x = canvas.width - unit;
      }

      if (snake[i].y >= canvas.height) {
        snake[i].y = 0;
      }

      if (snake[i].y < 0) {
        snake[i].y = canvas.height - unit;
      }
      //fillRect繪製填充矩形前面兩個參數代表x,y的座標位置，unit則是單位大小
      //strokeRect繪製矩形的輪廓，方法如同上述
      //不加這兩行程式碼，玩家無法看到蛇的位置或形狀
      ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
      ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    //以目前的d變數方向，來決定蛇的下一幀
    //snake[0]是一個物件，snake[0].x是個number，各自宣告蛇的頭部的x,y座標變數
    //往上是y軸減單位，往右是x軸加單位...以此類推
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (d == "Left") {
      snakeX -= unit;
    } else if (d == "Up") {
      snakeY -= unit;
    } else if (d == "Right") {
      snakeX += unit;
    } else if (d == "Down") {
      snakeY += unit;
    }
    //宣告newHead是新物件，包含了蛇的x,y座標，則是蛇頭的新位置
    let newHead = {
      x: snakeX,
      y: snakeY,
    };
    //確認蛇是否有吃到果實
    //有的話，水果會重新隨機出現、更新分數、最高分數、介面數字
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
      myFruit.pickALocation();
      score++;
      setHighestScore(score);
      updateScoreAndHighestScore();
    } else {
      //用來移除蛇身體最後一節，模擬蛇的移動
      snake.pop();
    }
    //使用unshift將指定值newHead添加到陣列snake的開頭
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
  }
  //宣告stopIntervalId使用setInterval每隔200毫秒調用draw這個函數，更新遊戲內部畫面
  stopIntervalId = setInterval(draw, 200);
}

//顯示現在分數、最高分數
function updateScoreAndHighestScore() {
  myScore.innerHTML = "遊戲分數：" + score;
  myScore2.innerHTML = "最高分數：" + highestScore;
}

//開始遊戲
function startGame() {
  score = 0;
  drawSnakeAndFruit();
  loadHighestScore();
  updateScoreAndHighestScore();
  allPageStart.removeEventListener("click", startGame);
  allPageStart.style.display = "none";
  reStart.style.display = "inline";
}
//重啟遊戲
function reStartGame() {
  clearInterval(stopIntervalId);
  startGame();
}

//載入最高分數
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

//存取最高分數
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
