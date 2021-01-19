const avatar = document.querySelector("#avatar img");
const filesSection = document.getElementById("files");

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
