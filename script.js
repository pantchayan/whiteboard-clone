let eraser = document.querySelector(".eraser");
let colorArr = document.querySelectorAll(".color");
let toolBar = document.querySelector(".tool-bar");
let undoBtn = document.querySelector(".undo-btn");
let redoBtn = document.querySelector(".redo-btn");

let penBtn = document.querySelector(".pen");
let pencilBtn = document.querySelector(".pencil");
let brushBtn = document.querySelector(".brush");

let toggleBtn = document.querySelector(".checkbox");

let board = document.getElementById("board");
board.height = window.innerHeight;
board.width = window.innerWidth;

let colorsEncoding = [
  { color: "red", code: "#ff0000" },
  { color: "green", code: "#006400" },
  { color: "blue", code: "#0018f5" },
  { color: "orange", code: "#f53d00" },
];
let brushSize = 5;
let brushColor = "#ff0000";
let isDark = false;
let points = [];
let redoPoints = [];
let lastX;
let lastY;

// 2d
let ctx = board.getContext("2d");
// ctx.lineCap = "round";
ctx.lineJoin = "round";

// COLORS FUNCTIONALITY
for (let i = 0; i < colorArr.length; i++) {
  colorArr[i].addEventListener("click", (e) => {
    if(brushColor=="#FFFFFF" || brushColor =="#000000"){
      brushSize = 5;
    }
    board.classList.remove("eraser-selected");

    let color = e.target.classList[1];

    for (let i = 0; i < colorsEncoding.length; i++) {
      if (colorsEncoding[i].color == color) {
        brushColor = colorsEncoding[i].code;
        console.log(brushColor);
        break;
      }
    }
  });
}

// PENS FUNCTIONALITY
penBtn.addEventListener("click", () => {
  if (brushColor == "#FFFFFF" || brushColor == "#000000") {
    brushColor = "#ff0000";
  }
  ctx.lineCap = "butt";
  brushSize = 10;
});

pencilBtn.addEventListener("click", () => {
  if (brushColor == "#FFFFFF" || brushColor == "#000000") {
    brushColor = "#ff0000";
  }
  ctx.lineCap = "butt";
  brushSize = 5;
});

brushBtn.addEventListener("click", () => {
  if (brushColor == "#FFFFFF" || brushColor == "#000000") {
    brushColor = "#ff0000";
  }
  ctx.lineCap = "round";
  brushSize = 20;
});

eraser.addEventListener("click", () => {
  board.classList.add("eraser-selected");
  brushSize = 70;
  if(isDark){
    brushColor = "#000000";
  }
  else{
    brushColor = "#FFFFFF";
  }
});

// DARK MODE TOGGLE
toggleBtn.addEventListener("click", () => {
  if (isDark) {
    board.style.backgroundColor = "#FFFFFF";
    toolBar.style.backgroundColor = "#F3F2F2";
    isDark = false;
  } else {
    board.style.backgroundColor = "#000000";
    toolBar.style.backgroundColor = "#5e5e5e";
    isDark = true;
  }
});

let isMouseDown = false;
board.addEventListener("mousedown", (e) => {
  let mouseX = parseInt(e.clientX);
  let mouseY = parseInt(e.clientY);
  //   y = getYCoordinates(y);
  ctx.beginPath();
  if (ctx.lineWidth != brushSize) {
    ctx.lineWidth = brushSize;
  }
  if (ctx.strokeStyle != brushColor) {
    ctx.strokeStyle = brushColor;
  }

  ctx.moveTo(mouseX, mouseY);
  points.push({
    x: mouseX,
    y: mouseY,
    size: brushSize,
    color: brushColor,
    mode: "begin",
  });

  lastX = mouseX;
  lastY = mouseY;
  isMouseDown = true;
});

board.addEventListener("mousemove", (e) => {
  let mouseX = parseInt(e.clientX);
  let mouseY = parseInt(e.clientY);
  //   y = getYCoordinates(y);
  redoPoints = [];
  if (isMouseDown) {
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    lastX = mouseX;
    lastY = mouseY;
    // command pattern stuff
    points.push({
      x: mouseX,
      y: mouseY,
      size: brushSize,
      color: brushColor,
      mode: "draw",
    });
  }
});

board.addEventListener("mouseup", (e) => {
  let mouseX = parseInt(e.clientX);
  let mouseY = parseInt(e.clientY);
  //   y = getYCoordinates(y);
  isMouseDown = false;
  points.push({
    x: mouseX,
    y: mouseY,
    size: brushSize,
    color: brushColor,
    mode: "end",
  });
});

function redrawAll() {
  if (points.length == 0) {
    return;
  }

  ctx.clearRect(0, 0, board.width, board.height);
  for (var i = 0; i < points.length; i++) {
    var pt = points[i];

    var begin = false;
    if (ctx.lineWidth != pt.size) {
      ctx.lineWidth = pt.size;
      begin = true;
    }
    if (ctx.strokeStyle != pt.color) {
      ctx.strokeStyle = pt.color;
      begin = true;
    }
    if (pt.mode == "begin" || begin) {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
    }
    ctx.lineTo(pt.x, pt.y);
    if (pt.mode == "end" || i == points.length - 1) {
      ctx.stroke();
    }
  }
  ctx.stroke();
}

function undoLast() {
  let pt = points.pop();
  redoPoints.push(pt);
  redrawAll();
}

function redoLast() {
  let pt = redoPoints.pop();
  points.push(pt);
  redrawAll();
}

undoBtn.addEventListener("click", function () {
  if (points.length < 3) {
    return;
  }
  let k = points.length - 1;

  console.log(points[k].mode, 1);
  while (k >= 0 && points[k].mode != "draw") {
    undoLast();
    k--;
  }

  for (let i = k; i >= 0; i--) {
    if (points[i].mode != "draw") {
      break;
    }
    undoLast();
  }
});

redoBtn.addEventListener("click", function () {
  if (redoPoints.length < 3) {
    return;
  }
  let k = redoPoints.length - 1;

  console.log(redoPoints[k].mode, 1);
  while (k >= 0 && redoPoints[k].mode != "draw") {
    redoLast();
    k--;
  }

  for (let i = k; i >= 0; i--) {
    if (redoPoints[i].mode != "draw") {
      break;
    }
    redoLast();
  }
});
