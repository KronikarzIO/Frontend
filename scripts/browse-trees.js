const signOutBtn = document.getElementById("sign-out");
const treesSection = document.getElementsByClassName("icon-section")[0];

window.onload = () => {
  Api.getIsAuthenticated()
    .catch(() => {
      location.replace("/pages/index.html");
    })
    .then(() => {
      Api.getFamilyTrees().then((trees) => {
        for (tree of trees) {
          treesSection.innerHTML += `
          <div class="icon" data-id=${tree.id}>
            <img  src="../images/browse-tree.svg" onclick="goToFamilyTree(this)">
            ${tree.name}
            <img id="delete-tree-icon" src="/images/delete-icon-2.png" onclick="deleteFamilyTree(this)">       
          </div>
          `;
        }
      });
    });
};

signOutBtn.onclick = () => {
  Api.logout().then(() => {
    location.replace("/pages/index.html");
  });
};

function goToFamilyTree(e) {
  let id = e.parentNode.dataset.id;
  let url = "/pages/edit-tree.html?";
  let params = new URLSearchParams();
  params.append("family_tree_id", id);
  location.assign(url + params.toString());
}

function deleteFamilyTree(e) {
  let id = e.parentNode.dataset.id;

  let isConfirmed = confirm("Are you sure you want to delete this family tree?");

  if (isConfirmed) {
    Api.deleteFamilyTreeById(id).then(() => {
      e.parentNode.remove();
    });
  }
}
