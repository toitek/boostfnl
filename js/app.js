// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHbTbHHou9dwK41lhH2Lz9BZKGiyTg8QY",
  authDomain: "boostingai.firebaseapp.com",
  projectId: "boostingai",
  storageBucket: "boostingai.appspot.com",
  messagingSenderId: "1028179994073",
  appId: "1:1028179994073:web:52f603eedfc4db4d0065c8",
  measurementId: "G-2KXEMZHQJD",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// Constants
const PROTECTED_PATHS = new Set(["/dashboard.html", "/control_panel.html", "/settings.html"]);
const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const SIGN_OUT_TEXT = "Sign out";
const currentPath = window.location.pathname;
const queryParams = new URLSearchParams(window.location.search);

// Query Selectors
const signIn = document.querySelector(".sign-in");
const signUp = document.querySelector(".sign-up");
const home = document.querySelector(".home");
const homeMd = document.querySelector(".home-md");
const simpleToastElement = document.querySelector("#simpleToast");
const toastMessageElement = document.querySelector("#toastMessage");

// Utility Functions
const getItem = key => localStorage.getItem(key);
const setItem = (key, value) => localStorage.setItem(key, value);
const removeItem = key => localStorage.removeItem(key);

// Business Logic Functions
const redirectToIndexIfUnauthorized = () => {
  if (PROTECTED_PATHS.has(currentPath) && !getItem(ACCESS_TOKEN_KEY)) {
    window.location.href = "/index.html";
    return true;
  }
  return false;
};

const setDashboardAccess = () => {
  [home, homeMd].forEach(elm => {
    if (elm) {
      elm.textContent = "Dashboard";
      elm.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "/dashboard.html";
      });
    }
  });
};

const setVisibility = (element, visible) => {
  if (element) {
    element.classList.toggle("hidden", !visible);
  }
};

const updateTokensFromURL = () => {
  const accessToken = queryParams.get("access_token");
  const refreshToken = queryParams.get("refresh_token");

  if (accessToken && refreshToken) {
    setItem(ACCESS_TOKEN_KEY, accessToken);
    setItem(REFRESH_TOKEN_KEY, refreshToken);
    return true;
  }
  return false;
};

// Main Execution
if (!redirectToIndexIfUnauthorized()) {
  setVisibility(signIn, !getItem(ACCESS_TOKEN_KEY));
  setVisibility(signUp, true);

  if (getItem(ACCESS_TOKEN_KEY)) {
    setDashboardAccess();
    // signUp.textContent = "Sign out";
  } else if (updateTokensFromURL()) {
    setVisibility(signIn, false);
    // signUp.textContent = "Sign out";
  }
}

// Async Event Handler
// signUp.addEventListener("click", async e => {
//   e.preventDefault();

//   if (signUp.textContent !== SIGN_OUT_TEXT) return;
//   try {
//     await auth.signOut();

//     removeItem(ACCESS_TOKEN_KEY);
//     removeItem(REFRESH_TOKEN_KEY);

//     window.location.href = "/index.html";
//   } catch (error) {}
// });

function simpleToast(msg, redirect) {
  toastMessageElement.textContent = msg;

  simpleToastElement.classList.add("show");
  simpleToastElement.style.visibility = "visible";
  simpleToastElement.style.opacity = 1;
  simpleToastElement.style.bottom = "30px";

  setTimeout(() => {
    simpleToastElement.style.opacity = 0;
    simpleToastElement.style.bottom = "0px";
  }, 2500);

  setTimeout(() => {
    simpleToastElement.style.visibility = "hidden";
    if (redirect) {
      window.location.href = redirect;
    }
  }, 5000);
}

const removeToast = () => {
  simpleToastElement.className = simpleToastElement.classList.remove("show");
};

auth
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(u => {})
  .catch(error => {});

let tokenRefreshTimer;

auth.onAuthStateChanged(user => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
  }

  if (user) {
    user.getIdToken().then(idToken => {
      setItem(ACCESS_TOKEN_KEY, idToken);
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      const expirationTime = payload.exp * 1000;

      const refreshTime = expirationTime - 5 * 60 * 1000;
      const currentTime = new Date().getTime();

      // Set the timer
      tokenRefreshTimer = setTimeout(() => {
        user.getIdToken(true).then(newToken => {
          console.log("====================new token====================");
          console.log(newToken);
          setItem(ACCESS_TOKEN_KEY, newToken);
        });
      }, refreshTime - currentTime);
    });
  }
});
