//////////////////////////////////////
//////////////////////////////////////
////          VARIABLES           ////
//////////////////////////////////////
//////////////////////////////////////

var drawableElements = []
var toConnect = {dragedElement: 0, staticElement: 0}
var draggingElement = false
var familyTreeId = 1
var selectedPersonId

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
        if(this.x + event.movementX / contextTransform.a < 5000 && this.x + event.movementX / contextTransform.a > 0 &&
           this.y + event.movementY / contextTransform.d < 5000 && this.y + event.movementY / contextTransform.d > 0) {
            this.x += event.movementX / contextTransform.a
            this.y += event.movementY / contextTransform.d
        }
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

        if(buttonMenager.snapToGrid == true) {
            this.dragedElement.x = Round(this.initialPosition.x + mouse.x - this.initialMouse.x , 30)
            this.dragedElement.y = Round(this.initialPosition.y + mouse.y - this.initialMouse.y , 30)
        }
        else {
            var contextTransform = canvas.getContext("2d").getTransform()
            this.dragedElement.x += event.movementX/contextTransform.a
            this.dragedElement.y += event.movementY/contextTransform.d
        }

        UpdateCanvas()
    }
}

class Connector {
    constructor() {
        this.selected
    }
}

class ButtonMenager {
    constructor() {
        this.snapToGridVal = false
        this.addingPersonVal = false
        this.editPersonVal = false
        this.clearConnectionVal = false
        this.deletePersonVal = false
    }

    get snapToGrid() {
        return this.snapToGridVal
    }
    set snapToGrid(val) {
        this.snapToGridVal = val
        this.UpdateUI()
    }

    get deletePerson() {
        return this.deletePersonVal
    }
    set deletePerson(val) {
        this.DisableAll()
        this.deletePersonVal = val
        this.UpdateUI()
    }

    get addingPerson() {
        return this.addingPersonVal
    }
    set addingPerson(val) {
        this.DisableAll()
        this.addingPersonVal = val
        this.UpdateUI()
    }

    get editPerson() {
        return this.editPersonVal
    }
    set editPerson(val) {
        this.DisableAll()
        this.editPersonVal = val
        this.UpdateUI()
    }
    
    get clearConnection() {
        return this.clearConnectionVal
    }
    set clearConnection(val) {
        this.DisableAll()
        this.clearConnectionVal = val
        this.UpdateUI()
    }

    UpdateUI() {
        if(this.deletePerson) {
            deletePersonButton.style.backgroundColor = "#ff9200"
        }
        else {
            deletePersonButton.style.backgroundColor = "antiquewhite"
        }

        if(this.addingPerson) {
            addPersonButton.style.backgroundColor = "#ff9200"
        }
        else {
            addPersonButton.style.backgroundColor = "antiquewhite"
        }

        if(this.editPerson) {
            editPersonButton.style.backgroundColor = "#ff9200"
        }
        else {
            editPersonButton.style.backgroundColor = "antiquewhite"
        }

        if(this.clearConnection) {
            clearConnectionButton.style.backgroundColor = "#ff9200"
        }
        else {
            clearConnectionButton.style.backgroundColor = "antiquewhite"
        }

        if(this.snapToGrid) {
            snapToGridButton.style.backgroundColor = "#ff9200"
        }
        else {
            snapToGridButton.style.backgroundColor = "antiquewhite"
        }
    }

    DisableAll() {
        this.deletePersonVal = false
        this.addingPersonVal = false
        this.editPersonVal = false
        this.clearConnectionVal = false
    }

    ButtonsDisabled() {
        if(!this.deletePerson && !this.addingPerson && !this.editPerson && !this.clearConnection) {
            return true;
        }
        else {
            return false;
        }

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
        case "father":
            toConnect.dragedElement.parent1Id = toConnect.staticElement.id

            var newRelation = new Object
            newRelation.father = toConnect.staticElement.id
            Api.patchPersonById(toConnect.dragedElement.id, newRelation)

            if(toConnect.dragedElement.parent2Id != null) {
                var tmp = toConnect.dragedElement
                toConnect.staticElement = drawableElements.find(e => e.id == tmp.parent1Id)
                toConnect.dragedElement = drawableElements.find(e => e.id == tmp.parent2Id)
                AddNewConnection("partner")
            }
        break;

        case "mother":
            toConnect.dragedElement.parent2Id = toConnect.staticElement.id

            var newRelation = new Object
            newRelation.mother = toConnect.staticElement.id
            Api.patchPersonById(toConnect.dragedElement.id, newRelation)    

            if(toConnect.dragedElement.parent1Id != null) {
                var tmp = toConnect.dragedElement
                toConnect.staticElement = drawableElements.find(e => e.id == tmp.parent1Id)
                toConnect.dragedElement = drawableElements.find(e => e.id == tmp.parent2Id)
                AddNewConnection("partner")
            }
        break;

        case "partner":
            toConnect.dragedElement.partnersId.push(toConnect.staticElement.id)
            toConnect.staticElement.partnersId.push(toConnect.dragedElement.id)

            var newRelation = new Object
            newRelation.person_1 = toConnect.dragedElement.id
            newRelation.person_2 = toConnect.staticElement.id
            newRelation.mariage_date = null
            newRelation.divorce_date = null
            Api.postMariage(newRelation)
        break;
    }

    HideMenu()
    UpdateCanvas()
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

function MouseUp(event) {
    if(draggingElement) {
        draggingElement = false

        if(ElementMoved()) {
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
    
            var newCoord = new Object
            newCoord.x = dragger.dragedElement.x
            newCoord.y = dragger.dragedElement.y
            Api.patchPersonById(dragger.dragedElement.id, newCoord)
            dragger.dragedElement = null
        }
        else {
            selectedPersonId = dragger.dragedElement.id
            leftPanel.style.display = "block"
            LoadPersonToPanel(selectedPersonId)
        }
    }
    else if(event.which != 3) {
        leftPanel.style.display = "none"
    }
}

function MouseDown(event) {
    if(event.which == 1) {
        if(buttonMenager.ButtonsDisabled()) {
            Drag(event)
        }
        if(buttonMenager.addingPerson) {
            AddPerson(event)
        }
        if(buttonMenager.clearConnection) {
            ClearConnection(event)
        }
        if(buttonMenager.editPerson) {
            EditPerson(event)
        }
        if(buttonMenager.deletePerson) {
            DeletePerson(event)
        }
    }
}

function MouseWheel(event) {
    var context = canvas.getContext("2d")

    var mouseStart = viewport.GetMousePosition(event)

    if(event.deltaY > 0) {
        if(viewport.zoom * 0.5 > 0.0620) {
            context.scale(0.5, 0.5)
            viewport.zoom *= 0.5
        }
    }
    else {
        if(viewport.zoom * 2 < 4) {
            context.scale(2, 2)
            viewport.zoom *= 2
        }
    }

    var mouseEnd = viewport.GetMousePosition(event)

    viewport.x += mouseEnd.x - mouseStart.x
    viewport.y += mouseEnd.y - mouseStart.y

    UpdateCanvas()
}

function MouseMove(event) {
    switch(event.which) {
        case 3:
            viewport.DragViewport(event)            
            break
        case 1:
            if(draggingElement) {
                dragger.Drag(event)
            }
        default:
            return
    }
}

////////////////////////////////////
//          INTERACTION           //
////////////////////////////////////

snapToGridButton.addEventListener("click", () => {
    buttonMenager.snapToGrid = !buttonMenager.snapToGrid
})

deletePersonButton.addEventListener("click", () => {
    buttonMenager.deletePerson = !buttonMenager.deletePerson
})

addPersonButton.addEventListener("click", () => {
    buttonMenager.addingPerson = !buttonMenager.addingPerson
})

editPersonButton.addEventListener("click", () => {
    buttonMenager.editPerson = !buttonMenager.editPerson
})

clearConnectionButton.addEventListener("click", () => {
    buttonMenager.clearConnection = !buttonMenager.clearConnection
})

saveForm.addEventListener("click", () => {
    var newData = new Object
    var form = document.forms[0].elements

    newData.name = form.name.value
    newData.surname = form.surname.value
    newData.sex = form.gender.value
    newData.nationality = form.nationality.value
    newData.birth_place = form.birthPlace.value
    newData.birth_date = form.birthDate.value
    newData.death_date = form.deathDate.value
    newData.death_cause = form.deathCause.value
    Api.patchPersonById(selectedPersonId, newData)

    var person = drawableElements.find( e => 
        e.id == selectedPersonId
    )
    person.firstName = form.name.value
    person.lastName = form.surname.value
    UpdateCanvas()

    SaveMariages()
    SaveEvents()
})

function SaveMariages() {
    var list = document.getElementsByClassName("mariage")

    Array.from(list).forEach(e => {
        var data = new Object
        if(e.id.split(' ')[0] == "mariage") {
            data.mariage_date = document.getElementById(e.id).value
        }
        else if(e.id.split(' ')[0] == "divorce") {
            data.divorce_date = document.getElementById(e.id).value
        }
        Api.patchMariageById(parseInt(e.id.split(' ')[1]), data)
    });
}

function SaveEvents() {
    var list = document.getElementsByClassName("event")

    Array.from(list).forEach(e => {
        if(e.id.split(' ')[0] == "eventTitle") {
            var data = new Object
            data.title = document.getElementById(e.id).value
            Api.patchEventById(parseInt(e.id.split(' ')[1]), data)
        }
        else if(e.id.split(' ')[0] == "eventDate") {
            var data = new Object
            data.date = document.getElementById(e.id).value
            Api.patchEventById(parseInt(e.id.split(' ')[1]), data)
        }
        else if(e.id.split(' ')[0] == "eventDescription") {
            var data = new Object
            data.description = document.getElementById(e.id).value
            Api.patchEventById(parseInt(e.id.split(' ')[1]), data)
        }
    });
}

function DeleteEvent(id) {
    var event = document.getElementById(`event${id}`)
    event.parentNode.removeChild(event)

    Api.deleteEventById(id)
}

function AddEvent() {
    var event = new Object
    event.person = selectedPersonId
    event.title = "."
    event.description = ""
    event.date = null
    event.icon = "OTHER"

    Api.postEvent(event).then( _ => {
        LoadPersonToPanel(selectedPersonId)
    })
}

function Drag(event) {
    var mouse = viewport.GetMousePosition(event)

    if(IsMouseOnRectangle(event) && IsMenuOff()) {
        drawableElements.forEach(element => {
            if(RectanglePointCollision(element, mouse.x, mouse.y)) {
                draggingElement = true;
                dragger.initialMouse = {x: mouse.x, y: mouse.y}
                dragger.initialPosition = {x: element.x, y: element.y}
                dragger.dragedElement = element
            }
        })
    }
}

function DeletePerson(event) {
    var mouse = viewport.GetMousePosition(event)

    if(IsMouseOnRectangle(event)) {
        var Idx = drawableElements.findIndex(element => {
            return RectanglePointCollision(element, mouse.x, mouse.y)
        })

        ClearConnectionOfElement(drawableElements[Idx])
        Api.deletePersonById(drawableElements[Idx].id)
        drawableElements.splice(Idx, 1)
        UpdateCanvas()
    }
}

function AddPerson(event) {
    var mouse = viewport.GetMousePosition(event)

    var person = new Object
    person.family_tree = familyTreeId
    person.father = null
    person.mother = null
    person.name = "Imie"
    person.surname = "Nazwisko"
    person.x = mouse.x
    person.y = mouse.y
    person.birth_date = null
    person.nationality = ""
    person.sex = "M"
    person.birth_place = ""
    person.death_date = null
    person.death_cause = ""

    Api.postPerson(person).then( e => {
        var tmp = new PersonBlock(
            e.id, e.x, e.y, "../images/default-avatar.png",
            e.name, e.surname,
            e.father, e.mother)

        drawableElements.push(tmp)
        UpdateCanvas()
    })
}

function ClearConnection(event) {
    var mouse = viewport.GetMousePosition(event)

    if(IsMouseOnRectangle(event)) {
        drawableElements.forEach(element => {
            if(RectanglePointCollision(element, mouse.x, mouse.y)) {
                ClearConnectionOfElement(element)
            }
        })
    }
}

function ClearConnectionOfElement(element) {
    element.parent1Id = null
    element.parent2Id = null
    element.partnersId = []

    drawableElements.forEach(el => {
        if(el.parent1Id == element.id){
            el.parent1Id = null
            var newRelation = new Object
            newRelation.father = null
            Api.patchPersonById(el.id, newRelation)
        }
        if(el.parent2Id == element.id){
            el.parent2Id = null
            var newRelation = new Object
            newRelation.mother = null
            Api.patchPersonById(el.id, newRelation)
        }

        var idx = el.partnersId.findIndex(partnerId => {
            return partnerId == element.id
        })
        if(idx != -1) {
            el.partnersId.splice(idx,1)
        }
    })

    Api.getMariages(familyTreeId).then( list => {
        list.forEach(row => {
            if(element.id == row.person_1 || element.id == row.person_2) {
                Api.deleteMariagesById(row.id)
            }
        })
    })

    var newRelation = new Object
    newRelation.father = null
    newRelation.mother = null
    Api.patchPersonById(element.id, newRelation)
    UpdateCanvas()
}

function EditPerson(event) {
    var mouse = viewport.GetMousePosition(event)

    if(IsMouseOnRectangle(event)) {
        drawableElements.forEach(element => {
            if(RectanglePointCollision(element, mouse.x, mouse.y)) {
                
            }
        })
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

function GetPersons() {
    Api.getFamilyTreeById(familyTreeId).then( treeData => {
        var persons = treeData.persons

        persons.forEach(e => {
            var tmp = new PersonBlock(
                e.id, e.x, e.y, e.profile_pic,
                e.name, e.surname,
                e.father, e.mother)

            if(e.profile_pic == "") {
                tmp.imagePath = "../images/default-avatar.png"
            }
            
            e.mariages.forEach(mariage => {
                if(mariage.person_1 == e.id) {
                    tmp.partnersId.push(mariage.person_2)
                }
                else {
                    tmp.partnersId.push(mariage.person_1)
                }
            })

            drawableElements.push(tmp)
        });

        UpdateCanvas()
    })
}

function ElementMoved() {
    if(dragger.initialPosition.x != dragger.dragedElement.x ||
       dragger.initialPosition.y != dragger.dragedElement.y) {
           return true
       }
    return false
}

function LoadPersonToPanel(personId) {
    Api.getPersonById(personId).then( data => {
        var form = document.forms[0].elements

        form.name.value = data.name
        form.surname.value = data.surname
        form.gender.value = data.sex
        form.nationality.value = data.nationality
        form.birthPlace.value = data.birth_place
        form.birthDate.value = data.birth_date
        form.deathDate.value = data.death_date
        form.deathCause.value = data.death_cause
        

        Api.getPersons(familyTreeId).then(list => {
            var newLi = ""
            var persons = list

            data.mariages.forEach( mariage => {
                var partner
                if(mariage.person_1 != data.id) {
                    partner = persons.find( person =>
                        person.id == mariage.person_1
                    )
                }
                else {
                    partner = persons.find( person =>
                        person.id == mariage.person_2
                    )
                }

                newLi += `
                        <li>
                            ${partner.name} ${partner.surname}<br>
                            <input id="mariage ${mariage.id}" class="mariage" type="date" value="${mariage.mariage_date}"><br>
                            <input id="divorce ${mariage.id}" class="mariage" type="date" value="${mariage.divorce_date}"><br>
                        </li>
                `
                
            })
            mariagesList.innerHTML = newLi.toString()
        })

        var events = ""
        data.events.forEach( event => {
            events += `
                <li id="event${event.id}">
                    <div class="event-container">
                        <input type="text" id="eventTitle ${event.id}" class="event" placeholder="Title" value="${event.title}"><br>
                        <input type="date" id="eventDate ${event.id}" class="event" placeholder="Date" value="${event.date}"><br>
                        <textarea id="eventDescription ${event.id}" class="event" rows="4">${event.description}</textarea>
                        <img src="../images/delete-icon-2.png" onclick="DeleteEvent(${event.id})">
                    </div>
                </li>
            `
        })
        eventsList.innerHTML = events.toString()
    })
}

function CheckIfLogged() {
    Api.getIsAuthenticated().then( e => {
        if(e.user = "") {
            document.location.href="index.html"
        }
    })
}

/**************************************************************************************************************/

///////////////////////////////////////
///////////////////////////////////////
////          MAINSCRIPT           ////
///////////////////////////////////////
///////////////////////////////////////

var viewport = new Viewport()
var dragger = new Dragger()
var connector = new Connector
var buttonMenager = new ButtonMenager

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
    CheckIfLogged()

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    canvas.addEventListener('contextmenu', event => event.preventDefault());
    canvas.addEventListener("mousemove", MouseMove)
    canvas.addEventListener("mousedown", MouseDown)
    canvas.addEventListener("mouseup", MouseUp)
    canvas.addEventListener("wheel", MouseWheel)

    GetPersons()
    UpdateCanvas()
})

window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    canvas.getContext("2d").scale(viewport.zoom, viewport.zoom)

    UpdateCanvas()
})