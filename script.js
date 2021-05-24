let board = document.getElementById("board");
board.height = window.innerHeight;
board.width = window.innerWidth;

document.body.onmousemove = function (e) {
  document.documentElement.style.setProperty(
    "--x",
    e.clientX + window.scrollX + "px"
  );
  document.documentElement.style.setProperty(
    "--y",
    e.clientY + window.scrollY + "px"
  );
};

// 2d
let tool = board.getContext("2d");
tool.lineCap = "round";
tool.lineJoin = "round";
let eraser = document.querySelector(".eraser");
let colorArr = document.querySelectorAll(".color");
let toolBar = document.querySelector(".tool-bar");

let currentColor = "red";
for (let i = 0; i < colorArr.length; i++) {
  colorArr[i].addEventListener("click", (e) => {
         board.classList.remove("eraser-selected");
    tool.lineWidth = 3.5;
    currentColor = e.target.classList[1];

    tool.strokeStyle = currentColor;
  });
}

eraser.addEventListener("click", () => {
  board.classList.add("eraser-selected");
  tool.lineWidth = 70;
  currentColor = "white";
  tool.strokeStyle = currentColor;
});

tool.strokeStyle = currentColor;
tool.lineWidth = 5;

let isMouseDown = false;
document.addEventListener("mousedown", (e) => {
  let x = e.clientX;
  let y = e.clientY;
//   y = getYCoordinates(y);
  x = 
  tool.beginPath();
  tool.moveTo(x, y);
  isMouseDown = true;
});

document.addEventListener("mousemove", (e) => {
       
  let x = e.clientX;
  let y = e.clientY;
//   y = getYCoordinates(y);
let oldx = x;
let oldy = y;
  if (isMouseDown) {
    tool.lineTo(x, y);
    
//     tool.bezierCurveTo(oldx, oldy, old, 0, x, y);
    tool.stroke();
//     tool.fill();
  }
});

document.addEventListener("mouseup", (e) => {
  let x = e.clientX;
  let y = e.clientY;
//   y = getYCoordinates(y);
  isMouseDown = false;
});

function getYCoordinates(initialY) {
  let obj =
    toolBar.getBoundingClientRect();
//    let marginTop =  parseInt(document.defaultView.getComputedStyle(colors, '').getPropertyValue('margin-top'))
  return initialY - obj.height - obj.top;
}

function getXCoordinates(initialX) {
}
