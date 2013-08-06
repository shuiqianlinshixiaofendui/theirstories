
var acceptfun = function(visitor){
    visitor.visit(this);
    if(this.children.length > 0){
        for(var i=0;i<this.children.length;i++){
            this.children[i].accept(visitor);
        }
    }
};

var door1 = {
    type : "door",
    id : "door1",
    center : [100,150],
    width : 50,
    children : [],
    parent : "wall1",
    accept : acceptfun,
};

var door2 = {
    type : "door",
    id : "door2",
    center : [150,300],
    width : 50,
    children : [],
    parent : "wall4",
    accept : acceptfun,
};

var doorList1 = [];
doorList1.push(door1);

var doorList2 = [];
doorList2.push(door2);


var window1 = {
    type : "window",
    id : "window1",
    center : [150,200],
    width : 50,
    children : [],
    parent : "wall2",
    accept : acceptfun,
};

var window2 = {
    type : "window",
    id : "window2",
    center : [200,150],
    width : 50,
    children : [],
    parent : "wall3",
    accept : acceptfun,
};

var windowList1 = [];
windowList1.push(window1);

var windowList2 = [];
windowList2.push(window2);

var wall1 = {
    type : "wall",
    id : "wall1",
    start : [100,100],
    end : [100,200],
    children : doorList1,
    parent : "room1",
    accept : acceptfun,
};

var wall2 = {
    type : "wall",
    id : "wall2",
    start : [100,200],
    end : [200,200],
    children : windowList1,
    parent : "room1",
    accept : acceptfun,
};

var wall3 = {
    type : "wall",
    id : "wall3",
    start : [200,200],
    end : [200,100],
    children : windowList2,
    parent : "room1",
    accept : acceptfun,
};

var wall4 = {
    type : "wall",
    id : "wall4",
    start : [100,300],
    end : [200,300],
    children : doorList2,
    parent : "room2",
    accept : acceptfun,
};

var wall5 = {
    type : "wall",
    id : "wall5",
    start : [200,300],
    end : [100,400],
    children : [],
    parent : "room2",
    accept : acceptfun,
};

var wall6 = {
    type : "wall",
    id : "wall6",
    start : [400,400],
    end : [300,400],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall7 = {
    type : "wall",
    id : "wall7",
    start : [400,400],
    end : [400,300],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall8 = {
    type : "wall",
    id : "wall8",
    start : [400,400],
    end : [500,400],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall9 = {
    type : "wall",
    id : "wall9",
    start : [400,400],
    end : [400,500],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall10 = {
    type : "wall",
    id : "wall10",
    start : [400,400],
    end : [300,300],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall11 = {
    type : "wall",
    id : "wall11",
    start : [400,400],
    end : [500,300],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall12 = {
    type : "wall",
    id : "wall12",
    start : [400,400],
    end : [300,500],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall13 = {
    type : "wall",
    id : "wall13",
    start : [400,400],
    end : [500,500],
    children : [],
    parent : "room3",
    accept : acceptfun,
};

var wall14 = {
    type : "wall",
    id : "wall14",
    start : [600,100],
    end : [800,100],
    children : [],
    parent : "room4",
    accept : acceptfun,
};

var wall15 = {
    type : "wall",
    id : "wall15",
    start : [800,100],
    end : [800,300],
    children : [],
    parent : "room4",
    accept : acceptfun,
};

var wall16 = {
    type : "wall",
    id : "wall16",
    start : [800,300],
    end : [600,300],
    children : [],
    parent : "room4",
    accept : acceptfun,
};

var wall17 = {
    type : "wall",
    id : "wall17",
    start : [600,300],
    end : [600,100],
    children : [],
    parent : "room4",
    accept : acceptfun,
};

var wallList1 = [];
wallList1.push(wall1);
wallList1.push(wall2);
wallList1.push(wall3);

var wallList2 = [];
wallList2.push(wall4);
wallList2.push(wall5);

var wallList3 = [];
wallList3.push(wall6);
wallList3.push(wall7);
wallList3.push(wall8);
wallList3.push(wall9);
wallList3.push(wall10);
wallList3.push(wall11);
wallList3.push(wall12);
wallList3.push(wall13);

var wallList4 = [];
wallList4.push(wall14);
wallList4.push(wall15);
wallList4.push(wall16);
wallList4.push(wall17);

var room1 = {
    type : "room",
    id : "room1",
    roomtype : "livingroom",
    children : wallList1,
    parent : "root",
    accept : acceptfun,
}; 

var room2 = {
    type : "room",
    id : "room2",
    roomtype : "bedroom",
    children : wallList2,
    parent : "root",
    accept : acceptfun,
};

var room3 = {
    type : "room",
    id : "room3",
    roomtype : "bedroom",
    children : wallList3,
    parent : "root",
    accept : acceptfun,
};

var room4 = {
    type : "room",
    id : "room4",
    roomtype : "bedroom",
    children : wallList4,
    parent : "root",
    accept : acceptfun,
};

var room5 = {
    type : "room",
    id : "room5",
    roomtype : "bedroom",
    children : [],
    parent : "root",
    accept : acceptfun,
};

var roomList1 = [];
roomList1.push(room1);
roomList1.push(room2);
roomList1.push(room3);
roomList1.push(room4);
roomList1.push(room5);
var myJSON = {
    type : "root",
    id : "root",
    children : roomList1,
    parent : "",
    accept : acceptfun,
};

