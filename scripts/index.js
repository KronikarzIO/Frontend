window.onload = () => {
  Api.getIsAuthenticated().then(() => {
    location.replace("/pages/preedit.html");
  });
};
