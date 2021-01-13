


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
      	addPicture(URL.createObjectURL(this.files[0]));
      }
  });
});

function addPicture(url){
		var img = document.createElement("img");
		img.src = url;
		img.classList.add('addedPictures');
		img.setAttribute('draggable', true);
		img.setAttribute('ondragstart', "drag(event)");
		img.id = img.src;
		user.userPictures.push(img.src);
		userPicturesArray.push(img);
		img.onclick = function(){ galleryView(img); };
		document.getElementById("picturesSection").appendChild(img);


}


function addFact(){

	var div = document.createElement("div");
	div.classList.add("addedFact");

	var deleteDiv = document.createElement("img");
	deleteDiv.classList.add('factDelete');
	deleteDiv.src = "../images/delete-fact.png";
	deleteDiv.onclick = function(){ deleteFactDiv(div); };

	var factDate = document.createTextNode(document.getElementById("factDate").value);
	var factTitle = document.createTextNode(document.getElementById("factTitle").value);
	var factDescription = document.createTextNode(document.getElementById("factDescription").value);

	if((document.getElementById("factDate").value != 0) || (document.getElementById("factTitle").value != 0) ||
	 (document.getElementById("factDescription").value != 0)) {
		div.appendChild(deleteDiv);
		div.appendChild(createDiv(factDate, "factDate"));
		div.appendChild(createDiv(factTitle, "factTitle"));
		div.appendChild(createDiv(factDescription, "factDescription"));
		user.userFacts.push([document.getElementById("factDate").value,document.getElementById("factTitle").value,document.getElementById("factDescription").value]);
		document.getElementById("factDate").value = "";
		document.getElementById("factTitle").value = "";
		document.getElementById("factDescription").value = "";
		document.getElementById("addfactsSection").appendChild(div);
	}
}


function deleteFactDiv(div){


	let factDate = div.getElementsByClassName("factDate");
	let factTitle = div.getElementsByClassName("factTitle");
	let factDescription = div.getElementsByClassName("factDescription");

	for(let i = 0; i<user.userFacts.length;i++)
		if((user.userFacts[i][0] == factDate[0].innerHTML) && (user.userFacts[i][1] == factTitle[0].innerHTML) && (user.userFacts[i][2] == factDescription[0].innerHTML))
			user.userFacts.splice(i, 1);
		
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

	user.name = document.getElementById("editName").value;
	user.surname = document.getElementById("editSurname").value;
	user.birthDay = document.getElementById("editBirthDate").value;
	user.deathDay = document.getElementById("editDeathDay").value;
	user.profilePicture = document.getElementById("editUserPhoto").src;

	document.getElementById("userPhoto").src = user.profilePicture;
	document.getElementById("nameInfo").innerHTML = user.name;
	document.getElementById("surnameInfo").innerHTML = user.surname;
	document.getElementById("birthDateInfo").innerHTML = user.birthDay;
	document.getElementById("deathDateInfo").innerHTML = user.deathDay;





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

	let index = userPicturesArray.indexOf(el);


	if(index != -1){
		user.userPictures.splice(index, 1);
		userPicturesArray.splice(index, 1);
	}

	el.parentNode.removeChild(el);



}

var userPicturesArray = [];

function addPicturesToArray(){
	var getDivId = document.getElementById("picturesSection");
	var images = getDivId.getElementsByClassName("addedPictures");
	user.userPictures = [];
	userPicturesArray = [];
	for(let i = 0; i<images.length;i++){
		user.userPictures.push(images[i].src);
		userPicturesArray.push(images[i]);

	}


}    



function addFactFromFile(){

	for(let i = 0; i<user.userFacts.length;i++){

		let div = document.createElement("div");
		div.classList.add("addedFact");

		let deleteDiv = document.createElement("img");
		deleteDiv.classList.add('factDelete');
		deleteDiv.src = "../images/delete-fact.png";
		deleteDiv.onclick = function(){ deleteFactDiv(div); };


		let factDate = document.createTextNode(user.userFacts[i][0]);
		let factTitle = document.createTextNode(user.userFacts[i][1]);
		let factDescription = document.createTextNode(user.userFacts[i][2]);


		div.appendChild(deleteDiv);
		div.appendChild(createDiv(factDate, "factDate"));
		div.appendChild(createDiv(factTitle, "factTitle"));
		div.appendChild(createDiv(factDescription, "factDescription"));
		document.getElementById("addfactsSection").appendChild(div);
	}
	
}

function createDiv(varName, className){
	let div = document.createElement("div");
	div.appendChild(varName);
	div.classList.add(className)
	return div;
}


var user = new UserData("Jan", "Kowalski", "08.08.1980", "", "../images/random-img-3.png",
	['../images/random-img-1.jpg', '../images/random-img-2.jpg'],
	[['2020.05.05','Wydarzenie 1','Krótki opis wydarzenia'],['2020.05.06','Wydarzenie 2','Kolejny opis wydarzenia']]);

function UserData(name, surname, birthDay, deathDay, profilePicture, userPictures, userFacts){
	this.name = name;
	this.surname = surname;
	this.birthDay = birthDay;
	this.deathDay = deathDay;
	this.profilePicture = profilePicture;
	this.userPictures = userPictures;
	this.userFacts = userFacts;


}


function loadUser(){

	document.getElementById("nameInfo").innerHTML = user.name;
	document.getElementById("surnameInfo").innerHTML = user.surname;
	document.getElementById("birthDateInfo").innerHTML = user.birthDay;
	document.getElementById("deathDateInfo").innerHTML = user.deathDay;
	document.getElementById("userPhoto").src = user.profilePicture;
	user.userPictures.forEach(picture => {addPicture(picture);});
	addPicturesToArray();
	addFactFromFile();
}