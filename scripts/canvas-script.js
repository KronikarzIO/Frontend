//////////////////////////////////////
//////////////////////////////////////
////          VARIABLES           ////
//////////////////////////////////////
//////////////////////////////////////

var drawableElements = []
var toConnect = {dragedElement: 0, staticElement: 0}
var snapToGrid = true

/**************************************************************************************************************/

////////////////////////////////////
////////////////////////////////////
////          CLASSES           ////
////////////////////////////////////
////////////////////////////////////

class Viewport {
    constructor() {
        this.x = 0
        this.y = 0
        this.zoom = 1
    }

    GetMousePosition(event) {
        var contextTransform =  canvas.getContext("2d").getTransform()
        return {
            x: event.offsetX / contextTransform.a - this.x,
            y: event.offsetY / contextTransform.d - this.y
        }
    }

    DragViewport(event) {
        var contextTransform =  canvas.getContext("2d").getTransform()
        this.x += event.movementX / contextTransform.a
        this.y += event.movementY / contextTransform.d
        UpdateCanvas()
    }
}

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
        this.x = x + viewport.x
        this.y = y + viewport.y
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

    Draw(viewport) {
        var x = this.x + viewport.x
        var y = this.y + viewport.y
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

class Dragger {
    constructor() {
        this.initialMouse
        this.initialPosition
        this.dragedElement
    }

    Drag(event) {
        var mouse = viewport.GetMousePosition(event)

        if(snapToGrid == true) {
            this.dragedElement.x = Round(this.initialPosition.x + mouse.x - this.initialMouse.x , 30)
            this.dragedElement.y = Round(this.initialPosition.y + mouse.y - this.initialMouse.y , 30)
        }
        else {
            this.dragedElement.x += event.movementX
            this.dragedElement.y += event.movementY
        }

        UpdateCanvas()
    }
}

class Connector {
    constructor() {
        this.dragedElement
        this.staticElement
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
    var mouse = viewport.GetMousePosition(event)

    if(IsMouseOnRectangle(event) && IsMenuOff()) {
        drawableElements.forEach(element => {
            if(RectanglePointCollision(element, mouse.x, mouse.y)) {
                canvas.addEventListener("mousemove", DragElement)
                canvas.addEventListener("mouseup", OnMouseUp)
                dragger.initialMouse = {x: mouse.x, y: mouse.y}
                dragger.initialPosition = {x: element.x, y: element.y}
                dragger.dragedElement = element
            }
        })
    }
}

function MouseWheel(event) {
    var context = canvas.getContext("2d")

    var mouseStart = viewport.GetMousePosition(event)

    if(event.deltaY > 0) {
        context.scale(0.5, 0.5)
        viewport.zoom *= 0.5
    }
    else {
        context.scale(2, 2)
        viewport.zoom *= 2
    }

    var mouseEnd = viewport.GetMousePosition(event)

    viewport.x += mouseEnd.x - mouseStart.x
    viewport.y += mouseEnd.y - mouseStart.y

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
    menu.style.left = `${event.clientX}px`
    menu.style.top = `${event.clientY}px`
}

function AddNewConnection(type) {
    switch(type){
        case "parent":
            if(toConnect.staticElement.parent1Id == null) {
                toConnect.staticElement.parent1Id = toConnect.dragedElement.id
            }
            else {
                toConnect.staticElement.parent2Id = toConnect.dragedElement.id

                var tmp = toConnect.staticElement
                toConnect.staticElement = drawableElements.find(e => e.id == tmp.parent1Id)
                toConnect.dragedElement = drawableElements.find(e => e.id == tmp.parent2Id)
                AddNewConnection("partner")
            }
        break;

        case "child":
            if(toConnect.dragedElement.parent1Id == null) {
                toConnect.dragedElement.parent1Id = toConnect.staticElement.id
            }
            else {
                toConnect.dragedElement.parent2Id = toConnect.staticElement.id

                var tmp = toConnect.dragedElement
                toConnect.staticElement = drawableElements.find(e => e.id == tmp.parent1Id)
                toConnect.dragedElement = drawableElements.find(e => e.id == tmp.parent2Id)
                AddNewConnection("partner")
            }
        break;

        case "partner":
            toConnect.dragedElement.partnersId.push(toConnect.staticElement.id)
            toConnect.staticElement.partnersId.push(toConnect.dragedElement.id)
        break;
    }

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
    var context = canvas.getContext("2d")
    var contextTransform =  context.getTransform()

    context.clearRect(0, 0, canvas.width/contextTransform.a, canvas.height/contextTransform.d)

    DrawConnections()

    drawableElements.forEach(element => {
        element.Draw(viewport)
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

function ChildConnection(child, parent1, parent2 = null) {
    var context = canvas.getContext("2d")
    var StartX1 = parent1.x+parent1.width/2 + viewport.x
    var StartY1 = parent1.y+parent1.height/2 + viewport.y
    var StartX2
    var StartY2
    var EndX = child.x+child.width/2 + viewport.x
    var EndY = child.y+child.height/2 + viewport.y
    
    if(parent2 != null) {
        if(parent2 != null) {
            StartX2 = parent2.x+parent2.width/2 + viewport.x
            StartY2 = parent2.y+parent2.height/2 + viewport.y
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
    var context = canvas.getContext("2d")

    var StartX = rect1.x+rect1.width/2 + viewport.x
    var StartY = rect1.y+rect1.height/2 + viewport.y

    var EndX = rect2.x+rect2.width/2 + viewport.x
    var EndY = rect2.y+rect2.height/2 + viewport.y

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

function OnMouseUp(event) {
    canvas.removeEventListener("mousemove", DragElement)
    canvas.removeEventListener("mouseup", OnMouseUp)

    if(dragger.dragedElement != null) {
        var rectangles = RectanglesUnderMouse(event)

        if(rectangles.length > 1) {
            toConnect.dragedElement = dragger.dragedElement

            for(var i = 0; i < rectangles.length; i++) {
                if(rectangles[i].id != dragger.dragedElement.id) {
                    toConnect.staticElement = rectangles[i]
                }
            }

            ShowMenu(event)
            menu.addEventListener("mouseleave", HideMenu)
        }

        dragger.dragedElement = null
    }
}

////////////////////////////////////
//          INTERACTION           //
////////////////////////////////////

function DragElement(event) {
    dragger.Drag(event)
}

function MouseMove(event) {
    switch(event.which) {
        case 3:
            viewport.DragViewport(event)            
            break
        default:
            return
    }
}

//////////////////////////////////
//          COLLISION           //
//////////////////////////////////

function RectanglePointCollision(rect, x, y) {
    var rectX = rect.x
    var rectY = rect.y

    if((x >=rectX) && (x <= rectX + rect.width) && (y >= rectY) && (y <= rectY + rect.height)) {
        return true
    }
    
    return false
}

function IsMouseOnRectangle(event) {
    var mouse = viewport.GetMousePosition(event)

    for(var i = 0; i < drawableElements.length; i++) {
        if(RectanglePointCollision(drawableElements[i], mouse.x, mouse.y)) {
            return true
        }
    }
    return false
}

function RectanglesUnderMouse(event) {
    var mouse = viewport.GetMousePosition(event)
    var rec = []

    for(var i = 0; i < drawableElements.length; i++) {
        if(RectanglePointCollision(drawableElements[i], mouse.x, mouse.y)) {
            rec.push(drawableElements[i])
        }
    }

    return rec
}

///////////////////////////////
//          OTHERS           //
///////////////////////////////

function Round(x, factor) {
    if(x%factor >= factor / 2) {
        return x - (x%factor) + factor
    }
    else {
        return x - (x%factor)
    }
}

/**************************************************************************************************************/

///////////////////////////////////////
///////////////////////////////////////
////          MAINSCRIPT           ////
///////////////////////////////////////
///////////////////////////////////////

var viewport = new Viewport()
var dragger = new Dragger()

window.onload = function() {
    dragElement(document.getElementById("addFactDiv"));
    dragElement(document.getElementById("editProfileDiv")); 

    lightbox.addEventListener('click', e=>{
        if(e.target !== e.currentTarget) return
            lightbox.classList.remove('active');
    })

    loadUser();
}

window.addEventListener("load", () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    canvas.addEventListener('contextmenu', event => event.preventDefault());
    canvas.addEventListener("mousemove", MouseMove)
    canvas.addEventListener("mousedown", MouseDown)
    canvas.addEventListener("wheel", MouseWheel)

    UpdateCanvas()
})

window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    canvas.getContext("2d").scale(viewport.zoom, viewport.zoom)

    UpdateCanvas()
})

drawableElements.push(new PersonBlock(0, 0, 0, "../images/default-avatar.png", "Mike", "Wazowski"))
drawableElements.push(new PersonBlock(1, 0, 400, "../images/default-avatar.png", "Mike", "Wazowski"))
drawableElements.push(new PersonBlock(2, 0, 800, "../images/default-avatar.png", "Mike", "Wazowski"))
drawableElements.push(new PersonBlock(3, 0, 1200, "../images/default-avatar.png", "Mike", "Wazowski"))