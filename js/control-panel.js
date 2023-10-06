// Reference to elements
const selectElement = document.getElementById("type");
const fineTuneContainer = document.getElementById("fineTune");

const inputs = document.querySelectorAll("input");

const sitemapsForm = document.querySelector(".site-maps-form");
const sitemapsCtn = document.querySelector(".sitemaps");

const msg = document.querySelector(".msg-text");

const nameError = document.querySelector(".nameError");
const botNameError = document.querySelector(".bot-name-error");
const descError = document.querySelector(".bot-desc-error");
const fileError = document.querySelector(".fileError");
const descErrorUrl = document.querySelector(".descError");

const fileCtn = document.querySelector(".file");
const avatarCtn = document.querySelector("#avatar_ctn");
const avatarFileInput = document.querySelector("#avatarFileInput");
const fileBotName = document.querySelector("#file_bot_name");
const fileForm = document.querySelector(".fileForm");
const contorlPanelBotName = document.querySelector("#bot_name");
const description = document.querySelector("#desc");
const url_description = document.querySelector("#url_description");
const text = document.querySelector(".text");

const selectAll = document.querySelector(".select-all");
const multiselect = document.querySelector(".multiselect");
const submit = document.querySelector(".submit-btn");
const selectCtn = document.querySelector(".selectCtn");

//spinner
const buttonText = document.querySelector("#submitText ");
const btnText = document.querySelector("#saveText");
const fileSpinner = document.querySelector("#fileSpinner");
const spinner = document.querySelector("#spinner");

let fileData;
selectElement.addEventListener("change", event => {
  fileCtn.classList.toggle("hidden");
  sitemapsCtn.classList.toggle("hidden");
});
const DragOverHandler = e => {
  e.preventDefault();
  e.stopPropagation();
};
const dropHandle = e => {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    text.textContent = file.name;
    fileData = file;
  }
};
const clickHandler = e => {
  avatarFileInput.click();
};
avatarCtn.addEventListener("click", clickHandler);
avatarCtn.addEventListener("dragover", DragOverHandler);
avatarCtn.addEventListener("drop", dropHandle);

avatarFileInput.addEventListener("change", e => {
  const file = e.target.files ? e.target.files[0] : null;
  if (file) {
    text.textContent = file.name;
    fileData = file;
  }
});

const fileUploadHandler = async (name, desc, email) => {
  showSpinner(btnText, fileSpinner);
  const formData = new FormData();
  formData.append("file", fileData);

  simpleToast("This may take sometime depending on the size of the file. Please be patient.", "");
  const accessToken = localStorage.getItem("access-token");
  const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/process/${name}/${desc}`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await res.json();
  hideSpinner(btnText, fileSpinner);
  if (res.status === 200) {
    return simpleToast("The content has been added successfully. You will be redirected to the bot's settings page", "/dashboard.html");
  }

  return data?.detail === "" ? (msg.textContent = "No sitemaps were found. Try again") : (msg.textContent = "Something went wrong try again.");
};

// Function to validate the name and description
function validateName(name) {
  const nameRegex = /^[A-Za-z0-9\s\-]+$/;
  return nameRegex.test(name);
}
// Mapping between input field IDs and corresponding error message paragraph IDs
const errorFieldMap = {
  file_bot_name: "nameError",
  bot_name: "bot-name-error",
  url: "msg-text",
  url_description: "descError",
  desc: "bot-desc-error",
};
// Adding an input event listener for each input field
inputs.forEach(input => {
  input.addEventListener("input", e => {
    const inputId = e.target.id;
    if (errorFieldMap[inputId]) {
      document.getElementsByClassName(errorFieldMap[inputId]).textContent = "";
    }
  });
});

fileForm.addEventListener("submit", async e => {
  e.preventDefault();
  msg.textContent = "";
  const botNameValue = fileBotName.value;
  const desc = description.value;
  if (validateName(botNameValue) && validateName(desc) && fileData) {
    const email = window.localStorage.getItem("email");
    fileUploadHandler(botNameValue, desc, email);
  } else {
    if (!validateName(botNameValue))
      botNameError.textContent = "Invalid name. Please enter a valid name containing letters, spaces, and hyphens only.";
    else if (!validateName(desc))
      descError.textContent = "Invalid description. Please enter a valid description containing letters, spaces and hypens only.";
    else fileError.textContent = "Pick a file to train your model with.";
  }
});

selectAll.addEventListener("change", e => {
  const checked = e.target.checked;
  multiselect.querySelectorAll("input").forEach(i => {
    i.checked = checked;
  });
});

const siteMapUrlHandler = async (domain, name, description) => {
  showSpinner(buttonText, spinner);
  const accessToken = localStorage.getItem("access-token");
  const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/sitemaps?domain=${domain}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();

  hideSpinner(buttonText, spinner);
  if (res.ok) {
    data.data.sitemaps.map((e, index) => {
      const divElement = document.createElement("div");
      divElement.innerHTML = `<label><input type="checkbox" name="" value="${index + 1}" />${e}</label>`;
      multiselect.appendChild(divElement);
    });
    const btn = document.createElement("div");
    btn.innerHTML = `<button
    class="submit-btn group mt-8 inline-flex w-full items-center justify-center bg-slate-700 px-6 py-3 text-base font-medium text-white duration-150 ease-in-out hover:bg-slate-900 sm:mt-10 xl:px-7 xl:py-4 xl:text-lg"
    type="submit"
  >
    Submit
  </button>`;
    multiselect.appendChild(btn);
    selectCtn.classList.remove("hidden");
    btn.querySelector(".submit-btn").addEventListener("click", async e => {
      e.preventDefault();

      const checkboxes = document.querySelectorAll('.multiselect input[type="checkbox"]:checked');
      const labelValues = [];
      checkboxes.forEach(checkbox => {
        const label = checkbox.closest("label");
        const labelText = label.textContent.trim();
        labelValues.push(labelText);
      });

      //LABEL
      if (labelValues.length > 0) {
        showSpinner(buttonText, spinner);
        simpleToast("This may take sometime depending on the number of urls. Please be patient.", "");
        msg.textContent = "";

        ///logic to add to site maps
        const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/process_urls/${name}/${description}`, {
          method: "POST",
          body: JSON.stringify({ urls: labelValues }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        await res.json();
        removeToast();
        hideSpinner(buttonText, spinner);
        if (res.ok) {
          return simpleToast("The content has been added successfully. You will be redirected to the bot's dashbaord page", "/dashboard.html");
        }
      } else simpleToast("Select at least one url", "");
    });
    return;
  }
  return data?.detail !== "" ? (msg.textContent = data.detail) : (msg.textContent = "Something went wrong try again.");
};

sitemapsForm.addEventListener("submit", async e => {
  e.preventDefault();
  const inputValue = sitemapsForm.querySelector("#url").value;
  const name = contorlPanelBotName.value;
  const desc = url_description.value;
  if (inputValue !== "" && validateName(name) && validateName(desc)) {
    simpleToast("This may take sometime. Please be patient.");
    await siteMapUrlHandler(inputValue, name, desc);
  } else {
    if (!validateName(name)) {
      return (nameError.textContent = "Invalid name. Please enter a valid name containing letters, spaces, and hyphens only.");
    } else if (!validateName(desc)) {
      descErrorUrl.textContent = "Invalid description. Please enter a valid description containing letters, spaces, and hyphens only.";
    } else return (msg.textContent = "invalid url entered");
  }
});

function showSpinner(btn, spinner) {
  btn.classList.add("hidden"); // Hide the button text
  spinner.classList.remove("hidden"); // Show the spinner
}

function hideSpinner(btn, spinner) {
  btn.classList.remove("hidden"); // Show the button text
  spinner.classList.add("hidden"); // Hide the spinner
}
