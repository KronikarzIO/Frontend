


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function showHideNav(){
	let mnIcon = document.getElementById("mnicon");
	let mnPanel = document.getElementById("leftPanel");
	if(mnicon.className == 'mniconopen'){
		mnIcon.setAttribute('class', 'mniconclose');
		mnPanel.setAttribute('class', 'leftPanelOpen');
	} else {
		mnIcon.setAttribute('class', 'mniconopen');
		mnPanel.setAttribute('class', 'leftPanelClose');
	}
}


var loadFile = function(event) {
	var image = document.getElementById('editUserPhoto');
	image.src = URL.createObjectURL(event.target.files[0]);
};


window.addEventListener('load', function() {
  document.querySelector('.addPictures').addEventListener('change', function() {
      if (this.files && this.files[0]) {
		var img = document.createElement("img");
		img.src = URL.createObjectURL(this.files[0]);
		img.classList.add('addedPictures');
		img.setAttribute('draggable', true);
		img.setAttribute('ondragstart', "drag(event)");
		img.id = img.src;
		img.onclick = function(){ galleryView(img); };

		document.getElementById("picturesSection").appendChild(img);
      }
  });


});


function addFact(){

	var div = document.createElement("div");
	div.classList.add("addedFact");

	var deleteDiv = document.createElement("img");
	deleteDiv.classList.add('factDelete');
	deleteDiv.src = "images/deleteFact.png";
	deleteDiv.onclick = function(){ deleteFactDiv(div); };


	var factDate = document.createTextNode(document.getElementById("factDate").value);
	var dateDiv = document.createElement("div");
	dateDiv.appendChild(factDate);
	dateDiv.classList.add('factDate');


	var factTitle = document.createTextNode(document.getElementById("factTitle").value);
	var titleDiv = document.createElement("div");
	titleDiv.appendChild(factTitle);
	titleDiv.classList.add('factTitle');


	var factDescription = document.createTextNode(document.getElementById("factDescription").value);
	var descriptionDiv = document.createElement("div");
	descriptionDiv.appendChild(factDescription);
	descriptionDiv.classList.add('factDescription');

	if((document.getElementById("factDate").value != 0) || (document.getElementById("factTitle").value != 0) ||
	 (document.getElementById("factDescription").value != 0)) {
		div.appendChild(deleteDiv);
		div.appendChild(dateDiv);
		div.appendChild(titleDiv);
		div.appendChild(descriptionDiv);
		document.getElementById("addfactsSection").appendChild(div);
	}
}


function deleteFactDiv(div){
	div.style.borderStyle = "none";
	div.innerHTML = '';
	div.style.display = "none";

}


function showDiv(id){
	var div = document.getElementById(id);
	if(div.style.visibility == "visible")
		div.style.visibility = "hidden";
	else
		div.style.visibility = "visible";

}


function showEditProfileDiv(){
	var div = document.getElementById("editProfileDiv");
	if(div.style.visibility == "visible")
		div.style.visibility = "hidden";
	else{
		div.style.visibility = "visible";
		document.getElementById("editUserPhoto").src = document.getElementById("userPhoto").src;
		document.getElementById("editName").value = document.getElementById("nameInfo").innerHTML;
		document.getElementById("editSurname").value = document.getElementById("surnameInfo").innerHTML;
		document.getElementById("editBirthDate").value = document.getElementById("birthDateInfo").innerHTML;
		document.getElementById("editDeathDay").value = document.getElementById("deathDateInfo").innerHTML;

	}
}


function editInfo(){
	if(document.getElementById("editName").value.length > 9)
		document.getElementById("nameInfo").style.fontSize = "150%" ;
	else if(document.getElementById("editName").value.length <= 8)
		document.getElementById("nameInfo").style.fontSize = "230%" ;

	if(document.getElementById("editSurname").value.length > 9)
		document.getElementById("surnameInfo").style.fontSize = "150%" ;
	else if(document.getElementById("editSurname").value.length <= 8)
		document.getElementById("surnameInfo").style.fontSize = "230%" ;

	document.getElementById("userPhoto").src = document.getElementById("editUserPhoto").src;
	document.getElementById("nameInfo").innerHTML = document.getElementById("editName").value;
	document.getElementById("surnameInfo").innerHTML = document.getElementById("editSurname").value;
	document.getElementById("birthDateInfo").innerHTML = document.getElementById("editBirthDate").value;
	document.getElementById("deathDateInfo").innerHTML = document.getElementById("editDeathDay").value;
}


function galleryView(image){
		lightbox.classList.add('active');
		const img = document.createElement('img');
		img.src = image.src
		while(lightbox.firstChild){
			lightbox.removeChild(lightbox.firstChild)
		}
		lightbox.appendChild(img);
}





function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
 	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var el = document.getElementById(data);
	el.parentNode.removeChild(el);


}



