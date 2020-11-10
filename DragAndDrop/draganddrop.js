document.addEventListener("DOMContentLoaded", function() {

	var rectangle = document.getElementById("rectangle");
	var circle = document.getElementById("circle");
	var triangle = document.getElementById("triangle");
	var arrow = document.getElementById("arrow");
	var c = "";

    c = rectangle.getContext("2d");
    c.rect(1, 1, 98, 78);
    c.strokeStyle = "blue";
    c.stroke();
    
    c = circle.getContext("2d");
    c.beginPath();
    c.arc(50, 50, 45, 0, 2 * Math.PI);
    c.strokeStyle = "blue";
    c.stroke();

    c = triangle.getContext("2d");
    c.beginPath();
    c.moveTo(98, 98);
    c.lineTo(0, 98);
    c.lineTo(48,10)
    c.closePath();
    c.strokeStyle = "blue";
    c.stroke();

    c = arrow.getContext("2d");
    c.beginPath();
    c.moveTo(1, 35);
    c.lineTo(50, 35);
    c.lineTo(50, 20);
    c.lineTo(98, 49);
    c.lineTo(50, 80);
    c.lineTo(50, 65);
    c.lineTo(1, 65);
    c.closePath();
    c.strokeStyle = "blue";
    c.stroke();

});

function ignoreDrop(dropEvent) {
    dropEvent.preventDefault();
}

function allowDrop(dropEvent) {
    dropEvent.preventDefault();
}

function dragShape(dragEvent) {
    dragEvent.dataTransfer.setData("text", dragEvent.target.id);
}

function allowOneDrop(dropEvent) {
    dropEvent.preventDefault();
}

// This function will allow only one shape to be dropped at a time inside the drop zone
function dropOneShape(dropEvent) {
    dropEvent.preventDefault();
    var shapeName = dropEvent.dataTransfer.getData("text");
    var target = document.getElementById("target");
    var dropzone = target.getBoundingClientRect();
    var x = dropEvent.clientX - dropzone.left;
    var y = dropEvent.clientY - dropzone.top;

    var c = target.getContext("2d");
    c.clearRect(0, 0, 715, 450);

    if (shapeName == "rectangle") {
        addRectangle(c, x, y);
    }
    else if (shapeName == "circle") {
        addCircle(c, x, y);
    }
    else if (shapeName == "triangle") {
        addTriangle(c, x, y);
    }
    else if (shapeName == "arrow") {
        addArrow(c, x, y);
    }
    else {
        alert("Can't add shape");
    }
}

// This function will allow multiple shapes to be dropped at the same time inside the drop zone
function dropShape(dropEvent) {
    dropEvent.preventDefault();
    var shapeName = dropEvent.dataTransfer.getData("text");
    var target = document.getElementById("target");
    var dropzone = target.getBoundingClientRect();
    var x = dropEvent.clientX - dropzone.left;
    var y = dropEvent.clientY - dropzone.top;

    var c = target.getContext("2d");

    if (shapeName == "rectangle") {
        addRectangle(c, x, y);
    }
    else if (shapeName == "circle") {
        addCircle(c, x, y);
    }
    else if (shapeName == "triangle") {
        addTriangle(c, x, y);
    }
    else if (shapeName == "arrow") {
        addArrow(c, x, y);
    }
    else {
        alert("Can't add shape");
    }
}

var rectangleCount = 0;
var circleCount = 0;
var triangleCount = 0;
var arrowCount = 0;

function addRectangle(c, x, y) {
	rectangleCount++;
	c.beginPath();
	c.rect(x-50, y-50, 98, 78);
	c.closePath();
	c.font = "14px Arial";
    c.fillText("Rectangle "+rectangleCount, x-40, y-5);
    c.strokeStyle = "blue";
	c.stroke();
}

function addCircle(c, x, y) {
	circleCount++;
	c.beginPath();
    c.arc(x, y, 48, 0, 2 * Math.PI);
	c.font = "14px Arial";
    c.fillText("Circle "+circleCount, x-25, y+7);
    c.strokeStyle = "blue";
	c.stroke();
}

function addTriangle(c, x, y) {
	triangleCount++;
	c.beginPath();
    c.moveTo(x, y-48);
    c.lineTo(x+48, y+48);
    c.lineTo(x-48, y+48);
    c.closePath();
	c.font = "14px Arial";
    c.fillText("Triangle "+triangleCount, x-30, y+35);
    c.strokeStyle = "blue";
	c.stroke();
}

function addArrow(c, x, y) {
	arrowCount++;
	c.beginPath();
    c.moveTo(x-50, y-15);
    c.lineTo(x, y-15);
    c.lineTo(x, y-30);
    c.lineTo(x+50, y);
    c.lineTo(x, y+30);
    c.lineTo(x, y+15);
    c.lineTo(x-50, y+15);
    c.closePath();
    c.font = "14px Arial";
    c.fillText("Arrow "+arrowCount, x-32, y+5);
    c.strokeStyle = "blue";
    c.stroke();
}


