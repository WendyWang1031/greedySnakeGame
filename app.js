const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method會回傳一個canvas的drawing context
//drawing context可以用來在canvas內畫圖
//設定單位是20，需告欄列，並且界定出寬高裡面有多少欄列
const unit = 20;
const row = canvas.height / unit; // 320/20=16
const column = canvas.width / unit; // 320/20=16

let snake = []; //array的每個元素都是一個物件
//物件的工作是：儲存身體的x,y座標
//頭是[0]，擁有三節身體，以下是他的預設座標
function createSnake() {
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

//這個class方法有drawFruit、pickALocation兩個函式能呼叫
class Fruit {
  //建構自動調用方法：利用隨機整數方式生成x,y座標的位置
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  //在畫布上繪製水果，填充顏色為黃色，利用fillRect隨機x,y座標新增一個方形水果
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    //宣告overlapping用於標記新生成的水果位置是否和蛇"身體"重疊，預設沒有重疊
    //需告新的x,y軸
    let overlapping = false;
    let new_x;
    let new_y;

    //定義一個內部函式checkOverlap確認蛇身是否有重疊
    function checkOverlap(new_x, new_y) {
      //利用迴圈去尋遍蛇的x,y軸座標是否跟新的水果座標一樣，
      //如果有重疊就把overlapping設定為true
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    //利用do-while迴圈來重複生成新的位置，條件是overlapping的值是true
    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
    } while (overlapping);

    //定義現在的x,y軸是新的
    this.x = new_x;
    this.y = new_y;
  }
}

//初始設定，創造蛇、創造新的隨機水果
createSnake();
let myFruit = new Fruit();

//初始設定，宣告highestScore最高的分數、宣告score分數是0
//呼叫載入最高分數的函式
let highestScore;
let score = 0;
loadHighestScore();

//事件監聽器，當用戶按下鍵盤後會執行changeDirection的函式
//宣告d初始化為向右
window.addEventListener("keydown", changeDirection);
let d = "Right";

//選取元素且使用innerHTML改變網頁文字：分數與最高分數的值
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;

function changeDirection(e) {
  //如果按下的箭頭是向右，而且蛇的當前方向不是向左，將蛇的方向設定為向右，以此類推
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //每次按下上下左右鍵之後，在下一幀被畫出來之前，
  //不接受任何keydown事件
  //這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

//fillStyle決定了對矩形的填充樣式，背景全設定為燕麥色
//fillRect填充矩形，前面兩個參數是開始點，寬高是由開頭你界定的欄列單位
function drawCanvas() {
  ctx.fillStyle = "wheat";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//繪製蛇、繪製水果都放進draw函式
function draw() {
  //每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  //呼叫繪製整面畫布
  drawCanvas();

  //需叫myFruit這個變數裡面的drawFruit()函式，繪製水果
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
  //snake[0]是一個物件，但snake[0].x是個number，各自宣告蛇的頭部的x,y座標變數
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
  //確認蛇是否有吃到果實、
  //有的話，水果會重新隨機出現、更新分數、最高分數、介面數字
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定一個新的隨機位
    myFruit.pickALocation();

    //更新分數
    score++;
    //更新最高的分數
    setHighestScore(score);
    //更新網頁介面上的分數
    document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
    document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
  } else {
    //用來移除蛇身體最後一節，模擬蛇的移動
    snake.pop();
  }
  //使用unshift將指定值newHead添加到陣列snake的開頭
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

//宣告myGame使用setInterval每隔200毫秒調用draw這個函數，更新遊戲內部畫面
let myGame = setInterval(draw, 200);

//載入最高分數，如果儲存的highestScore是空值，設定值為0
//不然就會是載入本地的highestScore值並轉為數字
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

//使用localStorage.setItem將當前分數儲存在本地，名字叫highestScore
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
