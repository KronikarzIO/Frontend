const Api = (() => {
  var baseURL = new URL("http://127.0.0.1:8000/");

  function getCSRFCookie() {
    const name = "csrftoken";
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function handleErrors(response) {
    if (!response.ok) {
      let statusCode = response.status;
      return response.json().then((error) => {
        if (
          statusCode === 403 ||
          (statusCode === 401 && error.detail != "User is not authenticated:")
        ) {
          window.location.href = "/pages/index.html";
        }
        throw { status_code: statusCode, error: error };
      });
    }
    return response;
  }

  const getBasic = (endpoint, id = null, searchParams = null) => {
    let url = new URL(endpoint + "/" + (id ? id + "/" : ""), baseURL);
    if (searchParams) {
      url.searchParams = searchParams;
    }
    return fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then(handleErrors)
      .then((response) => response.json());
  };

  const addBasic = (method, data, endpoint, id) => {
    let url = new URL(endpoint + "/" + (id ? id + "/" : ""), baseURL);
    return fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "X-CSRFToken": getCSRFCookie(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .then((response) => response.json());
  };

  const addMedia = (method, formData, endpoint, id) => {
    let url = new URL(endpoint + "/" + (id ? id + "/" : ""), baseURL);
    return fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "X-CSRFToken": getCSRFCookie(),
      },
      body: formData,
    })
      .then(handleErrors)
      .then((response) => response.json());
  };

  const postBasic = (endpoint, data) => addBasic("POST", data, endpoint);
  const putBasic = (endpoint, id, data) => addBasic("PUT", data, endpoint, id);
  const patchBasic = (endpoint, id, data) => addBasic("PATCH", data, endpoint, id);

  const deleteBasic = (endpoint, id) => {
    let url = new URL(endpoint + "/" + (id ? id + "/" : ""), baseURL);
    return fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": getCSRFCookie(),
      },
    }).then(handleErrors);
  };

  // Fetch functions to use

  /**
   * @param  {Number} personId
   * @throws { status_code: Number, error: JSON }
   */
  const getEvents = (personId = null) =>
    getBasic("events", null, personId ? new URLSearchParams("person", personId) : null);
  /**
   * @param  {Number} eventId
   * @throws { status_code: Number, error: JSON }
   */
  const getEventById = (eventId) => getBasic("events", eventId);
  /**
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const postEvent = (data) => postBasic("events", data);
  /**
   * @param  {Number} eventId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const putEventById = (eventId, data) => putBasic("events", eventId, data);
  /**
   * @param  {Number} eventId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const patchEventById = (eventId, data) => patchBasic("events", eventId, data);
  /**
   * @param  {Number} eventId
   * @throws { status_code: Number, error: JSON }
   */
  const deleteEventById = (eventId) => deleteBasic("events", eventId);
  /**
   * @throws { status_code: Number, error: JSON }
   */
  const getFamilyTrees = () => getBasic("family-trees");
  /**
   * @param  {Number} familyTreeId
   * @throws { status_code: Number, error: JSON }
   */
  const getFamilyTreeById = (familyTreeId) => getBasic("family-trees", familyTreeId);
  /**
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const postFamilyTree = (data) => postBasic("family-trees", data);

  /**
   * @param  {Number} familyTreeId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const putFamilyTreeById = (familyTreeId, data) => putBasic("family-trees", familyTreeId, data);
  /**
   * @param  {Number} familyTreeId
   * @param  {Object} data
   * @throws { status_code: Number, error: JSON }
   */
  const patchFamilyTreeById = (familyTreeId, data) =>
    patchBasic("family-trees", familyTreeId, data);
  /**
   * @param  {Number} familyTreeId
   * @throws { status_code: Number, error: JSON }
   */
  const deleteFamilyTreeById = (familyTreeId) => deleteBasic("family-trees", familyTreeId);
  /**
   * @param  {Number} familyTreeId
   * @throws { status_code: Number, error: JSON }
   */
  const getMariages = (familyTreeId = null) =>
    getBasic(
      "mariages",
      null,
      familyTreeId ? new URLSearchParams("family_tree", familyTreeId) : null
    );

  /**
   * @param  {Number} mariagesId
   * @throws { status_code: Number, error: JSON }
   */
  const getMariagesById = (mariagesId) => getBasic("mariages", mariagesId);
  /**
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const postMariage = (data) => postBasic("mariages", data);
  /**
   * @param  {Number} mariageId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const putMariageById = (mariageId, data) => putBasic("mariages", mariageId, data);
  /**
   * @param  {Number} mariageId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const patchMariageById = (mariageId, data) => patchBasic("mariages", mariageId, data);
  /**
   * @param  {Number} mariagesId
   * @throws { status_code: Number, error: JSON }
   */
  const deleteMariagesById = (mariagesId) => deleteBasic("mariages", mariagesId);
  /**
   * @param  {Number} personId
   * @throws { status_code: Number, error: JSON }
   */
  const getMedias = (personId = null) =>
    getBasic("medias", null, personId ? new URLSearchParams("person", personId) : null);

  /**
   * @param  {Number} mediaId
   * @throws { status_code: Number, error: JSON }
   */
  const getMediaById = (mediaId) => getBasic("medias", mediaId);

  /**
   * @param  {FormData} formData
   * @throws { status_code: Number, error: JSON }
   */
  const postMedia = (formData) => addMedia("POST", formData, "medias");

  /**
   * @param  {Number} mediaId
   * @param  {FormData} formData
   * @throws { status_code: Number, error: JSON }
   */
  const putMediaById = (mediaId, formData) => addMedia("PUT", formData, "medias", mediaId);
  /**
   * @param  {Number} mediaId
   * @param  {FormData} formData
   * @throws { status_code: Number, error: JSON }
   */
  const patchMediaById = (mediaId, formData) => addMedia("PATCH", formData, "medias", mediaId);
  /**
   * @param  {Number} mediaId
   * @throws { status_code: Number, error: JSON }
   */
  const deleteMediaById = (mediaId) => deleteBasic("medias", mediaId);
  /**
   * @param  {Number} familyTreeId
   * @throws { status_code: Number, error: JSON }
   */
  const getPersons = (familyTreeId = null) =>
    getBasic(
      "persons",
      null,
      familyTreeId ? new URLSearchParams("family_tree", familyTreeId) : null
    );

  /**
   * @param  {Number} personId
   * @throws { status_code: Number, error: JSON }
   */
  const getPersonById = (personId) => getBasic("persons", personId);
  /**
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const postPerson = (data) => postBasic("persons", data);
  /**
   * @param  {Number} personId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const putPersonById = (personId, data) => putBasic("persons", personId, data);
  /**
   * @param  {Number} personId
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const patchPersonById = (personId, data) => patchBasic("persons", personId, data);
  /**
   * @param  {Number} personId
   * @throws { status_code: Number, error: JSON }
   */
  const deletePersonById = (personId) => deleteBasic("persons", personId);

  // Authentication

  const getToken = () => getBasic("auth/csrf-cookie");
  /**
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const login = (data) => postBasic("auth/login", data);
  /**
   * @throws { status_code: Number, error: JSON }
   */
  const logout = () => postBasic("auth/logout", null);
  /**
   * @param  {object} data
   * @throws { status_code: Number, error: JSON }
   */
  const register = (data) => postBasic("auth/register", data);
  /**
   * @throws { status_code: Number, error: JSON }
   */
  const getIsAuthenticated = () => getBasic("auth/authentication");

  return {
    baseURL: baseURL,
    getEvents,
    getEventById,
    postEvent,
    putEventById,
    patchEventById,
    deleteEventById,
    getFamilyTrees,
    getFamilyTreeById,
    postFamilyTree,
    putFamilyTreeById,
    patchFamilyTreeById,
    deleteFamilyTreeById,
    getMariages,
    getMariagesById,
    postMariage,
    putMariageById,
    patchMariageById,
    deleteMariagesById,
    getMedias,
    getMediaById,
    postMedia,
    putMediaById,
    patchMediaById,
    deleteMediaById,
    getPersons,
    getPersonById,
    postPerson,
    putPersonById,
    patchPersonById,
    deletePersonById,
    getToken,
    login,
    logout,
    register,
    getIsAuthenticated,
  };
})();
