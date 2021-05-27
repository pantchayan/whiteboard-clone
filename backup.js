let myStorage = window.localStorage;

let whiteboardDB = [];
let whiteboard = [];
let points = [];
if (myStorage.getItem("WhiteboardDB") != null) {
  whiteboardDB = JSON.parse(myStorage.getItem("WhiteboardDB"));
  // console.log(whiteboardDB);
  whiteboard = whiteboardDB[0];

  if (!whiteboard[0]) {
    points = [];
  } else {
    points = whiteboard[0];
  }
} else {
  whiteboardDB.push(whiteboard);
  whiteboard.push(points);
}
