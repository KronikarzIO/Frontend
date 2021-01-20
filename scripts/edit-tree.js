const avatar = document.querySelector("#avatar img");
const filesSection = document.getElementById("files");
const treeNameInput = document.getElementById("tree-name");

treeNameInput.addEventListener("focusout", (e) => {
  Api.patchFamilyTreeById(familyTreeId, { name: e.target.value });
});

saveForm.addEventListener("click", () => {
  if (!document.forms[0].reportValidity()) {
    return;
  }
  var newData = new Object();
  var form = document.forms[0].elements;

  newData.name = form.name.value;
  newData.surname = form.surname.value;
  newData.sex = form.gender.value;
  newData.nationality = form.nationality.value;
  newData.birth_place = form.birthPlace.value;
  newData.birth_date = form.birthDate.value;
  newData.death_date = form.deathDate.value;
  newData.death_cause = form.deathCause.value;
  Api.patchPersonById(selectedPersonId, newData);

  var person = drawableElements.find((e) => e.id == selectedPersonId);
  person.firstName = form.name.value;
  person.lastName = form.surname.value;
  UpdateCanvas();

  SaveMariages();
  SaveEvents();
  saveMedias();
});

// FILES

function addMediaInput(e) {
  let file = e.files[0];
  addMedia(file);
}

filesSection.addEventListener("drop", (e) => {
  e.preventDefault();
  for (var i = 0; i < e.dataTransfer.items.length; i++) {
    let item = e.dataTransfer.items[i];
    if (item.kind === "file") {
      var file = item.getAsFile();
      if (isValidFile(file)) {
        addMedia(file);
      }
    }
  }

  function isValidFile(file) {
    function isValidExtension() {
      var allowedExtensions = /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd|\.png|\.jpg|\.gif|\.jpeg|\.bmp|\.mp4|\.avi|\.mp4|\.mp3|\.mov|\.wmv|\.mkv)$/i;
      return allowedExtensions.test(file.name);
    }

    function isValidSize() {
      return file.size < 10485760;
    }
    return isValidExtension() && isValidSize();
  }
});

filesSection.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// AVATAR

avatar.addEventListener("drop", (e) => {
  e.preventDefault();
  for (var i = 0; i < e.dataTransfer.items.length; i++) {
    let item = e.dataTransfer.items[i];
    if (item.kind === "file") {
      var file = item.getAsFile();
      if (isImage(file.name)) {
        addProfilePic(file);
      }
    }
  }
});

avatar.addEventListener("dragover", (e) => {
  e.preventDefault();
});

function deleteAvatar(e) {
  let img = e.parentNode.getElementsByTagName("img")[0];
  let id = img.dataset.id;
  Api.deleteMediaById(id).then(() => {
    img.src = "/images/default-avatar.png";
    let person = drawableElements.find((e) => e.id == selectedPersonId);
    person.imagePath = "/images/default-avatar.png";
    UpdateCanvas();
  });
}

function saveMedias() {
  const files = document.getElementsByClassName("file");
  for (file of files) {
    let id = file.dataset.id;
    let name = file.querySelector("input").value;
    let formData = new FormData();
    formData.append("name", name);
    Api.patchMediaById(id, formData);
  }
}

function SaveMariages() {
  var list = document.getElementsByClassName("mariage");

  Array.from(list).forEach((e) => {
    var data = new Object();
    if (e.id.split(" ")[0] == "mariage") {
      data.mariage_date = document.getElementById(e.id).value;
    } else if (e.id.split(" ")[0] == "divorce") {
      data.divorce_date = document.getElementById(e.id).value;
    }
    Api.patchMariageById(parseInt(e.id.split(" ")[1]), data);
  });
}

function SaveEvents() {
  var list = document.getElementsByClassName("event");

  Array.from(list).forEach((e) => {
    if (e.id.split(" ")[0] == "eventTitle") {
      var data = new Object();
      data.title = document.getElementById(e.id).value;
      Api.patchEventById(parseInt(e.id.split(" ")[1]), data);
    } else if (e.id.split(" ")[0] == "eventDate") {
      var data = new Object();
      data.date = document.getElementById(e.id).value;
      Api.patchEventById(parseInt(e.id.split(" ")[1]), data);
    } else if (e.id.split(" ")[0] == "eventDescription") {
      var data = new Object();
      data.description = document.getElementById(e.id).value;
      Api.patchEventById(parseInt(e.id.split(" ")[1]), data);
    }
  });
}

function DeleteEvent(id) {
  var event = document.getElementById(`event${id}`);
  event.parentNode.removeChild(event);

  Api.deleteEventById(id);
}

function AddEvent() {
  var event = new Object();
  event.person = selectedPersonId;
  event.title = ".";
  event.description = "";
  event.date = null;
  event.icon = "OTHER";

  Api.postEvent(event).then((_) => {
    LoadPersonToPanel(selectedPersonId);
  });
}

function LoadPersonToPanel(personId) {
  Api.getPersonById(personId).then((data) => {
    var form = document.forms[0].elements;

    const avatarImg = document.getElementById("avatar").querySelector("img");
    let hasProfilePic = false;
    for (media of data.medias) {
      if (media.is_profile_pic) {
        avatarImg.src = media.file;
        hasProfilePic = true;
        avatarImg.dataset.id = media.id;
      }
    }

    if (!hasProfilePic) avatarImg.src = "/images/Default-Avatar.png";

    form.name.value = data.name;
    form.surname.value = data.surname;
    form.gender.value = data.sex;
    form.nationality.value = data.nationality;
    form.birthPlace.value = data.birth_place;
    form.birthDate.value = data.birth_date;
    form.deathDate.value = data.death_date;
    form.deathCause.value = data.death_cause;

    Api.getPersons(familyTreeId).then((list) => {
      var newLi = "";
      var persons = list;

      data.mariages.forEach((mariage) => {
        var partner;
        if (mariage.person_1 != data.id) {
          partner = persons.find((person) => person.id == mariage.person_1);
        } else {
          partner = persons.find((person) => person.id == mariage.person_2);
        }

        newLi += `
                        <li>
                            ${partner.name} ${partner.surname}<br>
                            <input id="mariage ${mariage.id}" class="mariage" type="date" value="${
          mariage.mariage_date || ""
        }"><br>
                            <input id="divorce ${mariage.id}" class="mariage" type="date" value="${
          mariage.divorce_date || ""
        }"><br>
                        </li>
                `;
      });
      mariagesList.innerHTML = newLi.toString();
    });

    var events = "";
    data.events.forEach((event) => {
      events += `
                <li id="event${event.id}">
                    <div class="event-container">
                        <input type="text" id="eventTitle ${
                          event.id
                        }" class="event" placeholder="Title" value="${event.title}"><br>
                        <input type="date" id="eventDate ${
                          event.id
                        }" class="event" placeholder="Date" value="${event.date || ""}"><br>
                        <textarea id="eventDescription ${event.id}" class="event" rows="4">${
        event.description
      }</textarea>
                        <img src="../images/delete-icon-2.png" onclick="DeleteEvent(${event.id})">
                    </div>
                </li>
            `;
    });
    eventsList.innerHTML = events.toString();

    filesSection.innerHTML = `
          <div class="add-file-container">
            <label id="file-input-label" for="file-input">
              <img id="add-file" src="/images/add-file.svg" alt="Add file" />
            </label>
            <input id="file-input" type="file" accept=".png,.jpg,.jpeg,.bmp" onChange="addMediaInput(this)"/>
          </div>`;
    var fileInput = document.getElementById("file-input");

    for (media of data.medias) {
      if (media.is_profile_pic) continue;
      var img = "/images/file.svg";
      if (isImage(media.name)) {
        img = "/images/image.svg";
      }
      filesSection.innerHTML += `
          <div class="file" data-id="${media.id}">
            <div class="img-file">
              <a href="${media.file}" target="_blank" rel="noopener noreferrer">
                  <img src="${img}">
              </a>
              <img src="/images/delete-icon-2.png" onClick="deleteMedia(this)">
            </div>
            <input type="text" value="${media.name}" required>
          </div>`;
    }
  });
}

function deleteMedia(e) {
  let div = e.parentNode.parentNode;
  Api.deleteMediaById(div.dataset.id).then((data) => {
    e.parentNode.parentNode.remove();
  });
}

function addMedia(file, is_profile_pic = undefined) {
  let formData = new FormData();
  formData.append("person", selectedPersonId.toString());
  formData.append("name", file.name);
  formData.append("file", file);
  if (is_profile_pic === "true") {
    formData.append("is_profile_pic", is_profile_pic);
  }
  Api.postMedia(formData).then((data) => {
    var img = "/images/file.svg";
    if (isImage(file.name)) {
      img = "/images/image.svg";
    }
    filesSection.innerHTML += `
            <div class="file" data-id="${data.id}">
                <div class="img-file">
                  <a href="${data.file}" target="_blank" rel="noopener noreferrer">
                      <img src="${img}">
                  </a>
                  <img src="/images/delete-icon-2.png">
                </div>
                <input type="text" value="${data.name}" required>
            </div>`;
  });
}

function addProfilePic(file) {
  let previousId = avatar.dataset.id;
  if (previousId != 0) {
    Api.deleteMediaById(previousId);
  }
  let formData = new FormData();
  formData.append("person", selectedPersonId.toString());
  formData.append("name", file.name);
  formData.append("file", file);
  formData.append("is_profile_pic", "true");
  Api.postMedia(formData).then((data) => {
    avatar.src = data.file;
    avatar.dataset.id = data.id;
    let person = drawableElements.find((e) => e.id == selectedPersonId);
    person.imagePath = data.file;
    UpdateCanvas();
  });
}

function isImage(filename) {
  var imgExtensions = /(\.png|\.jpg|\.gif|\.jpeg|\.bmp)$/i;
  return imgExtensions.test(filename);
}

var up = 0
var bottom = 0
var left = 0
var right = 0

exportToPDF.addEventListener("click", () => {
    up = drawableElements[0].y
    bottom = drawableElements[0].y
    left = drawableElements[0].x
    right = drawableElements[0].x

    drawableElements.forEach(e => {
        if(e.x > right) {
            right = e.x
        }
        if(e.x < left) {
            left = e.x
        }
        if(e.y > bottom) {
            bottom = e.y
        }
        if(e.y < up) {
            up = e.y
        }
    })

    var svg = `
    <svg height="${bottom - up + drawableElements[0].height}" width="${right - left + drawableElements[0].width}">
    <style>
        .text { font-size: 30px; font-family: Arial;}
        img {width: 130px; height: 130px; object-fit: contain; position: absolute;}
        .linePartner {stroke: black; stroke-width: 5; fill: none}
        .lineChild {stroke: black; stroke-width: 1; fill: none}
    </style>
    `

    SVGDrawConnections()
    svg += paths

    drawableElements.forEach(e => {
        svg += `
        <rect x="${e.x - left}" y="${e.y - up}" rx="15" ry="15" width="${e.width}" height="${e.height}"
        style="fill:antiquewhite" />
        <text x="${e.x - left + 150}" y="${e.y - up + 65}" class="text" >${e.firstName}</text>
        <text x="${e.x - left + 150}" y="${e.y - up + 105}" class="text" >${e.lastName}</text>
        `
    })
    svg += `
    </svg>
    `

    var doc = new PDFDocument({size: [(right - left + drawableElements[0].width)*0.75,(bottom - up + drawableElements[0].height)*0.75]});
    const chunks = [];
    const stream = doc.pipe({
        write: (chunk) => chunks.push(chunk),
        end: () => {
            const pdfBlob = new Blob(chunks, {type: 'application/pdf'});
            var blobUrl = URL.createObjectURL(pdfBlob);
            window.open(blobUrl);
        },
        on: (event, action) => {},
        once: (...args) => {},
        emit: (...args) => {},
    });

    SVGtoPDF(doc, svg, 0, 0);
    drawableElements.forEach(e => {
        doc.image(getBase64Image(e.imagePath), (e.x - left + 10)*0.75, (e.y - up + 10)*0.75, {fit: [100, 100]})
    })

    doc.end();
})

exportToHTML.addEventListener("click", () => {
    up = drawableElements[0].y
    bottom = drawableElements[0].y
    left = drawableElements[0].x
    right = drawableElements[0].x

    drawableElements.forEach(e => {
        if(e.x > right) {
            right = e.x
        }
        if(e.x < left) {
            left = e.x
        }
        if(e.y > bottom) {
            bottom = e.y
        }
        if(e.y < up) {
            up = e.y
        }
    })

    var web = `
    <body style="margin: 0;">
    <style>
        .text { font-size: 30px; font-family: Arial;}
        img {width: 130px; height: 130px; object-fit: contain; position: absolute;}
        .linePartner {stroke: black; stroke-width: 5; fill: none}
        .lineChild {stroke: black; stroke-width: 1; fill: none}
    </style>
    `

    drawableElements.forEach(e => {
        web += `
        <img style="left: ${e.x - left + 10}px; top: ${e.y - up + 10}px" src="${e.imagePath}">
        `
    })

    web += `
    <svg height="${bottom - up + drawableElements[0].height}" width="${right-left + drawableElements[0].width}">
    `

    SVGDrawConnections()
    web += paths

    drawableElements.forEach(e => {
        web += `
        <rect x="${e.x - left}" y="${e.y - up}" rx="15" ry="15" width="${e.width}" height="${e.height}"
        style="fill:antiquewhite" />
        <text x="${e.x - left + 150}" y="${e.y - up + 65}" class="text" >${e.firstName}</text>
        <text x="${e.x - left + 150}" y="${e.y - up + 105}" class="text" >${e.lastName}</text>
        `
    })
    web += `
    </svg>
    `

    web += `
    </body>
    `

    localStorage.setItem("web", web)

    document.location.href="export.html"
})

exportToJSON.addEventListener("click", () => {
    Api.getFamilyTreeById(familyTreeId).then( data => {
      var tab = window.open('about:blank', '_blank')
      tab.document.write(JSON.stringify(data))
    })
})

function SVGDrawConnections() {
    paths=""
    drawableElements.forEach( e => {
        var parent1 = drawableElements.find(element => element.id == e.parent1Id)
        var parent2 = drawableElements.find(element => element.id == e.parent2Id)

        if(parent1 != undefined && parent2 != undefined) {
            SVGChildConnection(e, parent1, parent2)
        }
        else if(parent1 != undefined) {
            SVGChildConnection(e, parent1)
        }
        else if (parent2 != undefined) {
            SVGChildConnection(e, parent2)
        }

        e.partnersId.forEach( partnerId => {
            var p = drawableElements.find( el => el.id == partnerId)
            SVGParentConnection(e, p)
        });
    });
}

function SVGChildConnection(child, parent1, parent2 = null) {
    var StartX1 = parent1.x - left + parent1.width/2
    var StartY1 = parent1.y - up + parent1.height/2
    var StartX2
    var StartY2
    var EndX = child.x - left + child.width/2
    var EndY = child.y - up + child.height/2

    if(parent2 != null) {
        if(parent2 != null) {
            StartX2 = parent2.x - left + parent2.width/2
            StartY2 = parent2.y - up + parent2.height/2
        }

        var lineX = StartX2+((StartX1-StartX2)/2)
        var lineY = StartY1

        paths += `
        <polyline class="lineChild" points="${lineX}, ${lineY}
        `

        if(EndY > StartY1) {
            lineY += (EndY - StartY1) - child.height/2 - 20
        }
        else {
            lineY += (EndY - StartY1) + child.height/2 + 20
        }
        paths += ` ${lineX}, ${lineY}`

        lineX += EndX - lineX
        paths += ` ${lineX}, ${lineY}`

        lineY += EndY - lineY
        paths += ` ${lineX}, ${lineY}" />`
    }
    else {
        var lineX = StartX1
        var lineY = StartY1

        paths += `
        <polyline class="lineChild" points="${lineX}, ${lineY}
        `

        if(EndX > StartX1) {
            lineX += parent1.width/2+20
        }
        else {
            lineX += -parent1.width/2-20
        }
        paths += ` ${lineX}, ${lineY}`

        if(EndY > StartY1) {
            lineY += (EndY - StartY1) - child.height/2 - 20
        }
        else {
            lineY += (EndY - StartY1) + child.height/2 + 20
        }
        paths += ` ${lineX}, ${lineY}`

        lineX += EndX - lineX
        paths += ` ${lineX}, ${lineY}`

        lineY += EndY - lineY
        paths += ` ${lineX}, ${lineY}" />`
    }
}

function SVGParentConnection(rect1, rect2) {
    var StartX = rect1.x - left + rect1.width/2
    var StartY = rect1.y - up + rect1.height/2

    var EndX = rect2.x - left + rect2.width/2
    var EndY = rect2.y  - up + rect2.height/2

    var lineX = StartX
    var lineY = StartY


    paths += `
    <polyline class="linePartner" points="${lineX}, ${lineY}
    `

    lineX += (EndX - lineX)/2
    paths += ` ${lineX}, ${lineY}`

    lineY += EndY - lineY
    paths += ` ${lineX}, ${lineY}`

    lineX += EndX - lineX
    paths += ` ${lineX}, ${lineY}" />`
}

function getBase64Image(imgPath) {
    var img = new Image()
    img.src = imgPath
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL("image/png")
    return dataURL
}