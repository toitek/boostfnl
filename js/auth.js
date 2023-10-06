const inputs = document.querySelectorAll("input");
const btn = document.querySelector("button");
const signIn = document.querySelector(".sign-in");
const register = document.querySelector(".register");
const reset = document.querySelector(".reset");
const update = document.querySelector(".update");
const confirmReset = document.querySelector(".confirmReset");
const confirmText = document.querySelector(".confirm-text");
const buttonText = document.querySelector("#submitText");
const spinner = document.querySelector("#spinner");
const passwordError = document.querySelector(".password-error");

const firebaseConfig = {
  apiKey: "AIzaSyBHbTbHHou9dwK41lhH2Lz9BZKGiyTg8QY",
  authDomain: "boostingai.firebaseapp.com",
  projectId: "boostingai",
  storageBucket: "boostingai.appspot.com",
  messagingSenderId: "1028179994073",
  appId: "1:1028179994073:web:52f603eedfc4db4d0065c8",
  measurementId: "G-2KXEMZHQJD",
};
// Use constants for error messages and styles for better maintainability
const ERROR_MESSAGES = {
  emptyField: "Field cannot be empty",
  mismatchPassword: "Confirm Password and Password are not matching",
  invalidCredentials: "Invalid login credentials",
  shortPassword: "Password should be at least 8 characters long",
  somethingWrong: "Something went wrong",
};
const ERROR_STYLES = { border: "1px solid red", color: "red" };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Util functions to show and hide spinner
const toggleSpinner = (show = true) => {
  buttonText.classList.toggle("hidden", show);
  spinner.classList.toggle("hidden", !show);
  btn.style.cursor = show ? "not-allowed" : "pointer";
  btn.disabled = show;
};

// A reusable function to set error for elements
const setError = (element, message) => {
  element.style.color = ERROR_STYLES.color;
  element.textContent = message;
};

// Prepare body data for submission
const prepareBody = inputs => {
  let body = {};
  let hasEmptyFields = false;

  for (let i of inputs) {
    if (i.value.trim()) {
      body[i.id] = i.value.trim();
      i.style.border = "";
    } else {
      hasEmptyFields = true;
      i.style.border = ERROR_STYLES.border;
    }
  }

  return { body, hasEmptyFields };
};

// Validate password
const validatePassword = (password, confirmPassword) => {
  if (password !== confirmPassword && btn.textContent === "Sign in") {
    setError(confirmText, ERROR_MESSAGES.mismatchPassword);
    return false;
  } else if (password.length < 8) {
    setError(passwordError, ERROR_MESSAGES.shortPassword);
    return false;
  }
  return true;
};

const handleSubmit = async e => {
  e.preventDefault();

  const { body, hasEmptyFields } = prepareBody(inputs);

  if (hasEmptyFields) return;

  if (!reset) if (!validatePassword(body.password, body.confirmPassword)) return;

  toggleSpinner();

  try {
    let userCredential;
    let newUser = false;

    if (signIn) {
      userCredential = await auth.signInWithEmailAndPassword(body.email, body.password);
    } else if (reset) {
      userCredential = await auth.sendPasswordResetEmail(body.email);
    } else {
      userCredential = await auth.createUserWithEmailAndPassword(body.email, body.password);
      newUser = true;
    }
    console.log("===========================user cerdentias=========================");
    console.log(userCredential);

    const { refreshToken, za: accessToken } = userCredential?.user;
    if (newUser) {
      const res = await fetch("https://boosting-ai-new-backend-gennarocuofano.replit.app/api/update_plan_to_free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
    
    }
    localStorage.setItem("access-token", accessToken);
    localStorage.setItem("refresh-token", refreshToken);

    window.location.href = "/dashboard.html";
  } catch (error) {
    const { code, message } = error;
    setError(confirmText, code === 400 ? ERROR_MESSAGES.invalidCredentials : ERROR_MESSAGES.somethingWrong);
    console.error(`Error: ${code}, Message: ${message}`);
  } finally {
    toggleSpinner(false);
  }
};

// Event Listeners
inputs.forEach(i =>
  i.addEventListener("input", () => {
    if (i.value.trim()) i.style.border = "";
    confirmText.innerHTML = "";
  })
);
btn.addEventListener("click", handleSubmit);
