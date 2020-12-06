//////////////////////////////////////
//////////////////////////////////////
////          VARIABLES           ////
//////////////////////////////////////
//////////////////////////////////////

var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")
var offsetWidth = canvas.offsetWidth
var offsetHeight = canvas.offsetHeight
var offsetX
var offsetY
var initialPositionX
var initialPositionY
var drawableElements = []
var dragedElement
var scale = 1
var scaleCount = 0

/**************************************************************************************************************/

////////////////////////////////////
////////////////////////////////////
////          CLASSES           ////
////////////////////////////////////
////////////////////////////////////

class Drawable {
    static context = null

    constructor() {
        if(this.context == null) {
            this.context = document.getElementById("canvas").getContext("2d")
        }
    }

    Draw(){}
}

class Rectangle extends Drawable {
    constructor(x, y, width, height) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    Draw() {
        this.context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Circle extends Drawable {
    constructor(x, y, r, start, end ) {
        super()
        this.x = x
        this.y = y
        this.r = r
        this.start = start
        this.end = end
    }

    Draw() {
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.r, this.start, this.end)
        this.context.stroke()
    }
}

/**************************************************************************************************************/

//////////////////////////////////////
//////////////////////////////////////
////          UTILITIES           ////
//////////////////////////////////////
//////////////////////////////////////

///////////////////////////////
//          EVENTS           //
///////////////////////////////

function MouseDown(event) {
    var mouse = GetMousePosition(event)

    if(IsMouseOnRectangle(event)) {
        drawableElements.forEach(element => {
            if(RectanglePointCollision(element, mouse.x, mouse.y)) {
                document.body.addEventListener("mousemove", DragElement)
                document.body.addEventListener("mouseup", OnMouseUp)
                offsetX = element.x - mouse.x
                offsetY = element.y - mouse.y
                dragedElement = element
            }
        })
    }
    else {
        document.body.addEventListener("mousemove", DragAllElements)
        document.body.addEventListener("mouseup", OnMouseUp)
        initialPositionX = mouse.x
        initialPositionY = mouse.y
    }
}

function Wheel(event) {
    mouseStart = GetMousePosition(event)

    if(event.deltaY > 0) {
        scaleCount--
    }
    else {
        scaleCount++
    }

    if(scaleCount > 0) {
        scale = Math.pow(1.2 , scaleCount)
    }
    else if(scaleCount < 0) {
        scale = Math.pow(0.8 , -scaleCount)
    }
    else {
        scale = 1
    }

    context.restore()
    context.save()
    context.scale(scale, scale)

    mouseEnd = GetMousePosition(event)

    drawableElements.forEach(element => {
        element.x += mouseEnd.x - mouseStart.x
        element.y += mouseEnd.y - mouseStart.y
    });

    UpdateCanvas()
}

///////////////////////////////
//          CANVAS           //
///////////////////////////////

function UpdateCanvas() {
    context.restore()
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    context.save()
    context.scale(scale, scale)

    ChildConnection(drawableElements[0],drawableElements[1])

    drawableElements.forEach(element => {
        element.Draw()
    });
}

function OnResize() {
    var width = document.body.clientWidth
    var height = document.body.clientHeight
        
    canvas.width = width - offsetWidth
    canvas.height = height - offsetHeight

    UpdateCanvas()
}

function ChildConnection(rect1, rect2) {
    var StartX = rect1.x+rect1.width/2
    var StartY = rect1.y+rect1.height/2

    var EndX = rect2.x+rect2.width/2
    var EndY = rect2.y+rect2.height/2

    var lineX = StartX
    var lineY = StartY

    context.beginPath()
    context.moveTo(StartX, StartY)

    if(EndX > StartX) {
        lineX += rect1.width/2+20
    }
    else {
        lineX += -rect1.width/2-20
    }
    context.lineTo(lineX, lineY)

    if(EndY > StartY) {
        lineY += (EndY - StartY) - rect2.height/2 - 20
    }
    else {
        lineY += (EndY - StartY) + rect2.height/2 + 20
    }
    context.lineTo(lineX, lineY)

    lineX += EndX - lineX
    context.lineTo(lineX, lineY)

    lineY += EndY - lineY
    context.lineTo(lineX, lineY)

    context.stroke()
}

function ParentConnection(rect1, rect2) {
    var StartX = rect1.x+rect1.width/2
    var StartY = rect1.y+rect1.height/2

    var EndX = rect2.x+rect2.width/2
    var EndY = rect2.y+rect2.height/2

    var lineX = StartX
    var lineY = StartY

    context.beginPath()
    context.moveTo(StartX, StartY)

    lineX += (EndX - lineX)/2
    context.lineTo(lineX, lineY)

    lineY += EndY - lineY
    context.lineTo(lineX, lineY)

    lineX += EndX - lineX
    context.lineTo(lineX, lineY)

    

    context.stroke()
}

//////////////////////////////
//          MOUSE           //
//////////////////////////////

function GetMousePosition(event) {
    return {
        x: (event.clientX - offsetWidth/2)/context.getTransform().a,
        y: (event.clientY - offsetHeight/2)/context.getTransform().d
    };
}

function OnMouseUp(event) {
    document.body.removeEventListener("mousemove", DragElement)
    document.body.removeEventListener("mousemove", DragAllElements)
    document.body.removeEventListener("mouseup", OnMouseUp)
    dragedElement = null
}

////////////////////////////////////
//          INTERACTION           //
////////////////////////////////////

function DragAllElements(event) {
    var mouse = GetMousePosition(event)

    drawableElements.forEach(element => {
        element.x += mouse.x - initialPositionX
        element.y += mouse.y - initialPositionY
    });
    initialPositionX = mouse.x
    initialPositionY = mouse.y
    UpdateCanvas()
}

function DragElement(event) {
    var mouse = GetMousePosition(event)

    dragedElement.x = mouse.x + offsetX
    dragedElement.y = mouse.y + offsetY
    UpdateCanvas()
}

//////////////////////////////////
//          COLLISION           //
//////////////////////////////////

function RectanglePointCollision(rect, x, y) {
    if((x >= rect.x) && (x <= rect.x + rect.width) && (y >= rect.y) && (y <= rect.y + rect.height)) {
        return true
    }
    
    return false
}

function IsMouseOnRectangle(event) {
    var mouse = GetMousePosition(event)

    for(var i = 0; i < drawableElements.length; i++) {
        if(RectanglePointCollision(drawableElements[i], mouse.x, mouse.y)) {
            return true
        }
    }
    return false
}

/**************************************************************************************************************/

///////////////////////////////////////
///////////////////////////////////////
////          MAINSCRIPT           ////
///////////////////////////////////////
///////////////////////////////////////

window.onload = function() {
    canvas.width = document.body.clientWidth - canvas.offsetWidth
    canvas.height = document.body.clientHeight - canvas.offsetHeight

    drawableElements.push(new Rectangle(0, 0, 150, 75))
    drawableElements.push(new Rectangle(1000, 1000, 150, 75))
    
    UpdateCanvas()

    document.addEventListener("wheel", Wheel)
    document.body.addEventListener("mousedown", MouseDown)

    window.onresize = OnResize
}