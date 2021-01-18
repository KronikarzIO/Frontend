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