const Api = (() => {
  var baseURL = "http://127.0.0.1:8000/";

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
      return response.json().then((error) => {
        throw error;
      });
    }
    return response;
  }

  const getBasic = (endpoint, id) => {
    let url = baseURL + endpoint + "/" + (id ? id + "/" : "");
    return fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then(handleErrors)
      .then((response) => response.json());
  };

  const addBasic = (method, data, endpoint, id) => {
    let url = baseURL + endpoint + "/" + (id ? id + "/" : "");
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
    let url = baseURL + endpoint + "/" + (id ? id + "/" : "");
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
    let url = baseURL + endpoint + "/" + (id ? id + "/" : "");
    return fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": getCSRFCookie(),
      },
    })
      .then(handleErrors)
      .then((response) => response.json());
  };

  // Fetch functions to use

  const getEvents = () => getBasic("events");
  /**
   * @param  {Number} eventId
   */
  const getEventById = (eventId) => getBasic("events", eventId);
  /**
   * @param  {object} data
   */
  const postEvent = (data) => postBasic("events", data);
  /**
   * @param  {Number} eventId
   * @param  {object} data
   */
  const putEventById = (eventId, data) => putBasic("events", eventId, data);
  /**
   * @param  {Number} eventId
   * @param  {object} data
   */
  const patchEventById = (eventId, data) => patchBasic("events", eventId, data);
  /**
   * @param  {Number} eventId
   */
  const deleteEventById = (eventId) => deleteBasic("events", eventId);

  const getFamilyTrees = () => getBasic("family-trees");
  /**
   * @param  {Number} familyTreeId
   */
  const getFamilyTreeById = (familyTreeId) => getBasic("family-trees", familyTreeId);
  /**
   * @param  {object} data
   */
  const postFamilyTree = (data) => postBasic("family-trees", data);

  /**
   * @param  {Number} familyTreeId
   * @param  {object} data
   */
  const putFamilyTreeById = (familyTreeId, data) => putBasic("family-trees", familyTreeId, data);
  /**
   * @param  {Number} familyTreeId
   * @param  {Object} data
   */
  const patchFamilyTreeById = (familyTreeId, data) =>
    patchBasic("family-trees", familyTreeId, data);
  /**
   * @param  {Number} familyTreeId
   */
  const deleteFamilyTreeById = (familyTreeId) => deleteBasic("family-trees", familyTreeId);

  const getMariages = () => getBasic("mariages");

  /**
   * @param  {Number} mariagesId
   */
  const getMariagesById = (mariagesId) => getBasic("mariages", mariagesId);
  /**
   * @param  {object} data
   */
  const postMariage = (data) => postBasic("mariages", data);
  /**
   * @param  {Number} mariageId
   * @param  {object} data
   */
  const putMariageById = (mariageId, data) => putBasic("mariages", mariageId, data);
  /**
   * @param  {Number} mariageId
   * @param  {object} data
   */
  const patchMariageById = (mariageId, data) => patchBasic("mariages", mariageId, data);
  /**
   * @param  {Number} mariagesId
   */
  const deleteMariagesById = (mariagesId) => getBasic("mariages", mariagesId);

  const getMedias = () => getBasic("medias");

  /**
   * @param  {Number} mediaId
   */
  const getMediaById = (mediaId) => getBasic("medias", mediaId);

  /**
   * @param  {FormData} formData
   */
  const postMedia = (formData) => addMedia("POST", formData, "medias");

  /**
   * @param  {Number} mediaId
   * @param  {FormData} formData
   */
  const putMediaById = (mediaId, formData) => addMedia("PUT", formData, "medias", mediaId);
  /**
   * @param  {Number} mediaId
   * @param  {FormData} formData
   */
  const patchMediaById = (mediaId, formData) => addMedia("PATCH", formData, "medias", mediaId);
  /**
   * @param  {Number} mediaId
   */
  const deleteMediaById = (mediaId) => deleteBasic("medias", mediaId);

  const getPersons = () => getBasic("persons");

  /**
   * @param  {Number} personId
   */
  const getPersonById = (personId) => getBasic("persons", personId);
  /**
   * @param  {object} data
   */
  const postPerson = (data) => postBasic("persons", data);
  /**
   * @param  {Number} personId
   * @param  {object} data
   */
  const putPersonById = (personId, data) => putBasic("persons", personId, data);
  /**
   * @param  {Number} personId
   * @param  {object} data
   */
  const patchPersonById = (personId, data) => patchBasic("persons", personId, data);
  /**
   * @param  {Number} personId
   */
  const deletePersonById = (personId) => deleteBasic("persons", personId);

  // Authentication

  const getToken = () => getBasic("auth/csrf-cookie");
  /**
   * @param  {object} data
   */
  const login = (data) => postBasic("auth/login", data);
  /**
   * @param  {object} data
   */
  const logout = (data) => postBasic("auth/logout", null);
  /**
   * @param  {object} data
   */
  const register = (data) => postBasic("auth/register", data);
  const getIsAuthenticated = () => getBasic("auth/authentication");

  return {
    baseURL: baseURL,
    getEvents,
    getEventById,
    postEvent,
    patchEventById,
    deleteEventById,
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
