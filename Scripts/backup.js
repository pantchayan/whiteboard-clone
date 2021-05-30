let myStorage = window.localStorage;


let whiteboardDB = [];
let whiteboard = [];
let points = [];
let saveState = 0;
let boardID = 0;

let createViews = (whiteboardDB)=>{

  let boardTemplate = `
        <div class="board-asset">
        <img src="Assets/board.png" height="90px" width="150px"></img>
        <a href="#">1st Board</a>
        </div>`;
  for(let i=0;i<whiteboardDB.length;i++){
    let boardLinks = document.querySelector(".board-links");

    let div = document.createElement("div");

    div.classList.add("board-asset");

    div.innerHTML = `<img src="${whiteboardDB[i][1]}" height="90px" width="150px"></img>
        <a href="#">${whiteboardDB[i][3]}</a>`;
    div.id = i;
    boardLinks.appendChild(div);
    saveState = 1;
  }
  boardID = whiteboardDB.length-1;
}

let getDateString = () =>{
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
}


if (myStorage.getItem("WhiteboardDB") != null) {
  whiteboardDB = JSON.parse(myStorage.getItem("WhiteboardDB"));

  createViews(whiteboardDB);

  whiteboard = whiteboardDB[0];

  if (!whiteboard[0]) {
    points = [];
  } else {
    points = whiteboard[0];
  }

  saveState = 1;
} else {
  whiteboardDB.push(whiteboard);
  whiteboard.push(points);
  whiteboard.push("Assets/board.png");
  whiteboard.push(0);
  whiteboard.push(getDateString());
  saveState = 0;
}
