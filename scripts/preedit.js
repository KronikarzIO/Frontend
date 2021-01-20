const signOutBtn = document.getElementById("sign-out");
const createBtn = document.getElementById("create-tree");

window.onload = () => {
  Api.getIsAuthenticated().catch(() => {
    location.replace("/pages/index.html");
  });
};

signOutBtn.onclick = () => {
  Api.logout().then(() => {
    location.replace("/pages/index.html");
  });
};

createBtn.onclick = () => {
  Api.postFamilyTree({
    name: "Default Name",
    description: "",
  }).then((data) => {
    let url = "/pages/edit-tree.html?";
    let params = new URLSearchParams();
    params.append("family_tree_id", data.id);
    location.assign(url + params.toString());
  });
};
