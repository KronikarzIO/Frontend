
function onLoad(){
dragElement(document.getElementById("addFactDiv"));
dragElement(document.getElementById("editProfileDiv"));	
}


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
	document.getElementById("userPhoto").src = document.getElementById("editUserPhoto").src;
	document.getElementById("nameInfo").innerHTML = document.getElementById("editName").value;
	document.getElementById("surnameInfo").innerHTML = document.getElementById("editSurname").value;
	document.getElementById("birthDateInfo").innerHTML = document.getElementById("editBirthDate").value;
	document.getElementById("deathDateInfo").innerHTML = document.getElementById("editDeathDay").value;
}




