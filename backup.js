let myStorage = window.localStorage;


let whiteboardDB = [];
let points = [];

if(myStorage.getItem("WhiteboardDB") != null){
       whiteboardDB = JSON.parse(myStorage.getItem('WhiteboardDB'));
       // console.log(whiteboardDB);
       points = whiteboardDB[0];
}
