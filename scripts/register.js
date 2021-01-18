Api.getToken();

// Authentication

const registerForm = document.getElementById("register-form");
console.log(registerForm);

  registerForm.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    Api.register(data)
    .then( e => {
      document.location.href="/pages/preedit.html"
    }).catch( e => {alert(e.username)
  });
};