Api.getToken();

const loginForm = document.getElementById("login-form");
console.log(loginForm);

loginForm.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    Api.login(data)
    .then( e => {
      document.location.href="/pages/preedit.html"
    }).catch( e => {alert("Taki użytkownik nie istnieje")
    });
};