let eraser = document.querySelector(".eraser");
let colorArr = document.querySelectorAll(".color");
let toolBar = document.querySelector(".tool-bar");
let undoBtn = document.querySelector(".undo-btn");
let redoBtn = document.querySelector(".redo-btn");
let clearBtn = document.querySelector(".clear-btn");
let saveBtn = document.querySelector(".save-btn");
let downloadBtn = document.querySelector(".download-btn");
let penBtn = document.querySelector(".pen");
let pencilBtn = document.querySelector(".pencil");
let brushBtn = document.querySelector(".brush");
let newBoard = document.querySelector(".new-board");
let toggleBtn = document.querySelector(".checkbox");

let boardAssetArr = document.querySelectorAll(".board-asset");
let viewImgArr = document.querySelectorAll(".board-asset>img");
let board = document.getElementById("board");
board.height = window.innerHeight;
board.width = window.innerWidth;

let colorsEncoding = [
  { color: "red", code: "#ff0000" },
  { color: "green", code: "#006400" },
  { color: "blue", code: "#0018f5" },
  { color: "orange", code: "#f53d00" },
  { color: "white", code: "#ffffff" },
  { color: "white", code: "#000000" },
];

let brushSize = 5;
let brushColor = "#ff0000";
let isDark = false;

let redoPoints = [];
let lastX;
let lastY;

// whiteboardDB[boardID] = whiteboard;
// points = whiteboard[0];
console.log(whiteboard);
// 2d
let ctx = board.getContext("2d");
// ctx.lineCap = "round";
ctx.lineJoin = "round";

// COLORS FUNCTIONALITY
for (let i = 0; i < colorArr.length; i++) {
  colorArr[i].addEventListener("click", (e) => {
    if (brushColor == "#FFFFFF" || brushColor == "#000000") {
      brushSize = 5;
    }
    board.classList.remove("eraser-selected");

    let color = e.target.classList[1];

    for (let i = 0; i < colorsEncoding.length; i++) {
      if (colorsEncoding[i].color == color) {
        brushColor = colorsEncoding[i].code;
        break;
      }
    }
  });
}

// PENS FUNCTIONALITY
penBtn.addEventListener("click", () => {
  if (brushColor == "#ffffff" || brushColor == "#000000") {
    brushColor = "#ff0000";
  }
  ctx.lineCap = "butt";
  brushSize = 10;
});

pencilBtn.addEventListener("click", () => {
  if (brushColor == "#ffffff" || brushColor == "#000000") {
    brushColor = "#ff0000";
  }
  ctx.lineCap = "butt";
  brushSize = 5;
});

brushBtn.addEventListener("click", () => {
  if (brushColor == "#ffffff" || brushColor == "#000000") {
    brushColor = "#ff0000";
  }
  ctx.lineCap = "round";
  brushSize = 20;
});

eraser.addEventListener("click", () => {
  board.classList.add("eraser-selected");
  brushSize = 70;
  if (isDark) {
    brushColor = "#000000";
  } else {
    brushColor = "#ffffff";
  }
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, board.width, board.height);
  let date = whiteboard[3];
  points = [];
  whiteboard = [];
  whiteboard.push(points);
  whiteboard.push("Assets/board.png");
  whiteboard.push(boardID);
  whiteboard.push(date);
  whiteboardDB[boardID] = whiteboard;
  // console.log(whiteboardDB);
  myStorage.setItem("WhiteboardDB", JSON.stringify(whiteboardDB));
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

  whiteboard[0] = points;
  myStorage.setItem("WhiteboardDB", JSON.stringify(whiteboardDB));
});

function redrawAll() {
  if (!whiteboard[0]) {
    points = [];
  } else {
    points = whiteboard[0];
  }
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

  whiteboard[0] = points;
  myStorage.setItem("WhiteboardDB", JSON.stringify(whiteboardDB));
});

redoBtn.addEventListener("click", function () {
  if (redoPoints.length < 3) {
    return;
  }
  let k = redoPoints.length - 1;

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

  whiteboard[0] = points;
  myStorage.setItem("WhiteboardDB", JSON.stringify(whiteboardDB));
});

function redrawEraser(eraserColor) {
  if (points.length == 0) {
    return;
  }
  let oldColor = eraserColor === "#ffffff" ? "#000000" : "#ffffff";
  // changing to provided color
  for (let i = 0; i < points.length; i++) {
    if (points[i].color == oldColor) {
      points[i].color = eraserColor;
    }
  }

  whiteboard[0] = points;
  myStorage.setItem("WhiteboardDB", JSON.stringify(whiteboardDB));
  redrawAll();
}

// DARK MODE TOGGLE
toggleBtn.addEventListener("click", () => {
  if (isDark) {
    board.style.backgroundColor = "#ffffff";
    toolBar.style.backgroundColor = "#F3F2F2";
    isDark = false;
    redrawEraser("#ffffff");
  } else {
    board.style.backgroundColor = "#000000";
    toolBar.style.backgroundColor = "#5e5e5e";
    isDark = true;
    redrawEraser("#000000");
  }
});

function canvasToImage(backgroundColor) {
  //cache height and width
  var w = board.width;
  var h = board.height;

  var data;

  if (backgroundColor) {
    //get the current ImageData for the canvas.
    data = ctx.getImageData(0, 0, w, h);

    //store the current globalCompositeOperation
    var compositeOperation = ctx.globalCompositeOperation;

    //set to draw behind current content
    ctx.globalCompositeOperation = "destination-over";

    //set background color
    ctx.fillStyle = backgroundColor;

    //draw background / rect on entire canvas
    ctx.fillRect(0, 0, w, h);
  }

  //get the image data from the canvas
  var imageData = this.board.toDataURL("image/png");

  if (backgroundColor) {
    //clear the canvas
    ctx.clearRect(0, 0, w, h);

    //restore it with original / cached ImageData
    ctx.putImageData(data, 0, 0);

    //reset the globalCompositeOperation to what it was
    ctx.globalCompositeOperation = compositeOperation;
  }

  //return the Base64 encoded data url string
  return imageData;
}

let refreshViews = () => {
  for (let i = 0; i < boardAssetArr.length; i++) {
    boardAssetArr[i].childNodes[0].src = whiteboardDB[boardAssetArr[i].id][1];
  }
};

saveBtn.addEventListener("click", () => {
  if (isDark) toggleBtn.click();
  let imgURL = canvasToImage("#ffffff");

  whiteboard[1] = imgURL;
  whiteboard[3] = getDateString();
  myStorage.setItem("WhiteboardDB", JSON.stringify(whiteboardDB));

  saveState++;
  if (saveState == 1) {
    let boardLinks = document.querySelector(".board-links");
    let div = document.createElement("div");
    div.classList.add("board-asset");

    div.innerHTML = `<img src="${
      whiteboard[1]
    }" height="90px" width="150px"></img>
        <a href="#">${getDateString()}</a>`;
    div.id = boardID;
    boardLinks.appendChild(div);

    div.addEventListener("click", (e) => loadNewBoard(e));
  } else {
    // refresh image for board asset
  }
  boardAssetArr = document.querySelectorAll(".board-asset");
  refreshViews();
});

downloadBtn.addEventListener("click", () => {
  // let imgURL = board.toDataURL();
  saveBtn.click();
  if (isDark) toggleBtn.click();
  let imgURL = canvasToImage("#ffffff");
  let anchor = document.createElement("a");
  anchor.href = imgURL;
  anchor.download = "board.png";
  anchor.click();
  anchor.remove();
  // board.remove();
});

newBoard.addEventListener("click", () => {
  saveBtn.click();

  boardID = whiteboardDB.length;
  whiteboardDB.push([]);
  whiteboard = whiteboardDB[boardID];
  whiteboard.push([]);
  whiteboard.push("Assets/board.png");
  whiteboard.push(boardID);
  whiteboard.push(getDateString());
  points = whiteboard[0];
  ctx.clearRect(0, 0, board.width, board.height);

  // =================================================================================

  let boardLinks = document.querySelector(".board-links");
  let div = document.createElement("div");
  div.classList.add("board-asset");

  div.innerHTML = `<img src="${
    whiteboard[1]
  }" height="90px" width="150px"></img>
        <a href="#">${getDateString()}</a>`;
  div.id = boardID;
  boardLinks.appendChild(div);

  div.addEventListener("click", (e) => loadNewBoard(e));
  saveState = 1;

  boardAssetArr = document.querySelectorAll(".board-asset");
  refreshViews();
});

redrawAll();

// to deal with back up eraser values
for (let i = 0; i < 4; i++) {
  toggleBtn.click();
}

let loadNewBoard = (e) => {
  saveBtn.click();

  boardID = e.path[1].id;

  whiteboard = whiteboardDB[boardID];
  if (!whiteboard) return;
  console.log(whiteboard);
  points = whiteboard[0];
  if (!whiteboard[0]) {
    ctx.clearRect(0, 0, board.width, board.height);

    points = [];
    whiteboard.push(points);
    whiteboard.push("#");
    whiteboard.push(0);
  } else if (whiteboard[0].length == 0) {
    ctx.clearRect(0, 0, board.width, board.height);
  } else {
    redrawAll();
  }
};

for (let i = 0; i < boardAssetArr.length; i++) {
  boardAssetArr[i].addEventListener("click", (e) => loadNewBoard(e));
}
