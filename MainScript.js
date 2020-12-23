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
var toConnect = []

/**************************************************************************************************************/

////////////////////////////////////
////////////////////////////////////
////          CLASSES           ////
////////////////////////////////////
////////////////////////////////////

class Drawable {
    static context = null

    constructor(id) {
        if(this.context == null) {
            this.context = document.getElementById("canvas").getContext("2d")
        }
        this.id = id
    }

    Draw(){}
}

class Rectangle extends Drawable {
    constructor(id, x, y, width, height) {
        super(id)
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    Draw() {
        this.context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class RectangleRounded extends Drawable {
    constructor(id, x, y, width, height, radious) {
        super(id)
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.radious = radious
    }

    Draw() {
        var x = this.x
        var y = this.y
        var width = this.width - this.radious*2
        var height = this.height - this.radious*2
        var radious = this.radious

        this.context.fillStyle = "antiquewhite"
        this.context.beginPath()
        this.context.moveTo(x+radious, y)
        this.context.lineTo(x+radious+width, y)
        this.context.arcTo(x+radious+width+radious, y, x+radious+width+radious, y+radious, radious)
        this.context.lineTo(x+radious+width+radious, y+radious+height)
        this.context.arcTo(x+radious+width+radious, y+radious+height+radious, x+radious+width, y+radious+height+radious, radious)
        this.context.lineTo(x+radious, y+radious+height+radious)
        this.context.arcTo(x, y+radious+height+radious, x, y+radious+height, radious)
        this.context.lineTo(x, y+radious)
        this.context.arcTo(x, y, x+radious, y, radious)
        this.context.fill()
    }
}

class PersonBlock extends RectangleRounded {
    constructor(id, x, y, imagePath, firstName, lastName, parent1 = null, parent2 = null, partnersId = []) {
        super(id, x, y, 350, 150, 15)
        this.imagePath = imagePath
        this.firstName = firstName
        this.lastName = lastName
        this.parent1Id = parent1
        this.parent2Id = parent2
        this.partnersId = partnersId
    }

    Draw() {
        var x = this.x
        var y = this.y
        var width = this.width - this.radious*2
        var height = this.height - this.radious*2
        var radious = this.radious

        this.context.fillStyle = "antiquewhite"
        this.context.beginPath()
        this.context.moveTo(x+radious, y)
        this.context.lineTo(x+radious+width, y)
        this.context.arcTo(x+radious+width+radious, y, x+radious+width+radious, y+radious, radious)
        this.context.lineTo(x+radious+width+radious, y+radious+height)
        this.context.arcTo(x+radious+width+radious, y+radious+height+radious, x+radious+width, y+radious+height+radious, radious)
        this.context.lineTo(x+radious, y+radious+height+radious)
        this.context.arcTo(x, y+radious+height+radious, x, y+radious+height, radious)
        this.context.lineTo(x, y+radious)
        this.context.arcTo(x, y, x+radious, y, radious)
        this.context.fill()

        var img = new Image
        img.src = this.imagePath
        this.context.drawImage(img, x+10, y+10)

        this.context.fillStyle = "black"
        this.context.font = "30px Arial"
        this.context.fillText(this.firstName, x+150, y+65)
        this.context.fillText(this.lastName,  x+150, y+105)
    }
}

class Circle extends Drawable {
    constructor(id, x, y, r, start, end ) {
        super(id)
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

    if(IsMouseOnRectangle(event) && IsMenuOff()) {
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

function HideMenu(event) {
    var menu = document.querySelector("#menu")
        menu.style.left = "-100%"
        menu.style.top = "-100%"

    menu.removeEventListener("mouseleave", HideMenu)
}

function ShowMenu(event) {
    var menu = document.querySelector("#menu")
    menu.style.left = `${event.clientX - offsetWidth/2}px`
    menu.style.top = `${event.clientY - offsetHeight/2}px`
}

function AddNewConnection(type) {
    switch(type){
        case "parent":
            if(toConnect[1].parent1Id == null) {
                toConnect[1].parent1Id = toConnect[0].id
            }
            else {
                toConnect[1].parent2Id = toConnect[0].id
            }
        break;

        case "child":
            if(toConnect[0].parent1Id == null) {
                toConnect[0].parent1Id = toConnect[1].id
            }
            else {
                toConnect[0].parent2Id = toConnect[1].id
            }
        break;

        case "partner":
            toConnect[0].partnersId.push(toConnect[1].id)
            toConnect[1].partnersId.push(toConnect[0].id)
        break;
    }

    toConnect = []
    HideMenu()
}

function IsMenuOff() {
    var menu = document.querySelector("#menu")
    if(menu.style.left == "-100%") {
        return true
    }
    return false
}
///////////////////////////////
//          CANVAS           //
///////////////////////////////

function UpdateCanvas() {
    context.restore()
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    context.save()
    context.scale(scale, scale)

    DrawConnections()

    drawableElements.forEach(element => {
        element.Draw()
    });
}

function DrawConnections() {
    drawableElements.forEach( e => {
        var parent1 = drawableElements.find(element => element.id == e.parent1Id)
        var parent2 = drawableElements.find(element => element.id == e.parent2Id)

        if(parent1 != undefined && parent2 != undefined) {
            ChildConnection(e, parent1, parent2)
        }
        else if(parent1 != undefined) {
            ChildConnection(e, parent1)
        }
        else if (parent2 != undefined) {
            ChildConnection(e, parent2)
        }

        e.partnersId.forEach( partnerId => {
            var p = drawableElements.find( el => el.id == partnerId)
            ParentConnection(e, p)
        });
    });
}

function OnResize() {
    var width = document.body.clientWidth
    var height = document.body.clientHeight
        
    canvas.width = width - offsetWidth
    canvas.height = height - offsetHeight

    UpdateCanvas()
}

function ChildConnection(child, parent1, parent2 = null) {
    var StartX1 = parent1.x+parent1.width/2
    var StartY1 = parent1.y+parent1.height/2
    var StartX2
    var StartY2
    var EndX = child.x+child.width/2
    var EndY = child.y+child.height/2
    
    if(parent2 != null) {
        if(parent2 != null) {
            StartX2 = parent2.x+parent2.width/2
            StartY2 = parent2.y+parent2.height/2
        }

        var lineX = StartX2+((StartX1-StartX2)/2)
        var lineY = StartY1

        context.beginPath()
        context.moveTo(lineX, lineY)

        if(EndY > StartY1) {
            lineY += (EndY - StartY1) - child.height/2 - 20
        }
        else {
            lineY += (EndY - StartY1) + child.height/2 + 20
        }
        context.lineTo(lineX, lineY)

        lineX += EndX - lineX
        context.lineTo(lineX, lineY)

        lineY += EndY - lineY
        context.lineTo(lineX, lineY)

        context.stroke()
    }
    else {
        var lineX = StartX1
        var lineY = StartY1

        context.beginPath()
        context.moveTo(lineX, lineY)

        if(EndX > StartX1) {
            lineX += parent1.width/2+20
        }
        else {
            lineX += -parent1.width/2-20
        }
        context.lineTo(lineX, lineY)

        if(EndY > StartY1) {
            lineY += (EndY - StartY1) - child.height/2 - 20
        }
        else {
            lineY += (EndY - StartY1) + child.height/2 + 20
        }
        context.lineTo(lineX, lineY)

        lineX += EndX - lineX
        context.lineTo(lineX, lineY)

        lineY += EndY - lineY
        context.lineTo(lineX, lineY)

        context.stroke()
    }
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

    if(dragedElement != null) {
        var rectangles = RectanglesUnderMouse(event)
        if(rectangles.length > 1) {
            toConnect.push(dragedElement)
            for(var i = 0; i < rectangles.length; i++) {
                if(rectangles[i].id != dragedElement.id) {
                    toConnect.push(rectangles[i])
                }
            }
            ShowMenu(event)
            menu.addEventListener("mouseleave", HideMenu)
        }

        dragedElement = null
    }
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

function RectanglesUnderMouse(event) {
    var mouse = GetMousePosition(event)
    var rec = []

    for(var i = 0; i < drawableElements.length; i++) {
        if(RectanglePointCollision(drawableElements[i], mouse.x, mouse.y)) {
            rec.push(drawableElements[i])
        }
    }

    return rec
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

    drawableElements.push(new PersonBlock(0, 0, 0, "Default-Avatar.png", "Mike", "Wazowski"))
    drawableElements.push(new PersonBlock(1, 0, 400, "Default-Avatar.png", "Mike", "Wazowski"))
    drawableElements.push(new PersonBlock(2, 0, 800, "Default-Avatar.png", "Mike", "Wazowski"))
    drawableElements.push(new PersonBlock(3, 0, 1200, "Default-Avatar.png", "Mike", "Wazowski"))

    // person.set(0, [1, 2])
    // person.set(3, [1, 2])
    
    UpdateCanvas()

    document.addEventListener("wheel", Wheel)
    document.body.addEventListener("mousedown", MouseDown)

    window.onresize = OnResize
}