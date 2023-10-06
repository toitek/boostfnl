const avatar = document.querySelector(".avatar");
const avatarInput = document.querySelector("#avatarFile");

const botName = document.querySelector("#bot_name");
const desc = document.querySelector("#desc");
const checkbox = document.querySelector(".checkbox");
const messageBox = document.querySelector(".message-box");
const messageCtn = document.querySelector(".message");

const btn = document.querySelector(".btn");
const buttonText = document.querySelector("#submitText");
const spinner = document.querySelector("#spinner");

const textarea = document.querySelector("textarea");
const botId = document.querySelector(".bot_id");

const uploadingText = document.querySelector(".uploading");
const uploaded = document.querySelector(".upload-img");

const configs = document.querySelector(".configs");
const update = document.querySelector(".update");
const input = document.querySelectorAll("input");
const copyCode = document.querySelector(".copyCode");
const chatPosition = document.querySelector("#chat-position");

const chatTest = document.querySelector(".chat-test");

let bot_id;
let bot_name = "";
let bodyColors = {};
const bot = window.localStorage.getItem("bot");

const botData = JSON.parse(bot);
const email = window.localStorage.getItem("email");
if (botData) {
  bot_id = botData.bot_id;

  botName.value = botData?.bot_name;
  bot_name = botData?.bot_name;
  desc.value = botData?.bot_description ? botData.bot_description : "";
  checkbox.checked = botData.bot_visibility ? true : false;
  messageBox.value = botData?.intro_message ? botData?.intro_message : "";
  uploaded.src = botData.bot_avatar
    ? botData.bot_avatar
    : "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";

  configs.querySelectorAll("input").forEach(input => {
    const inputId = input.id;
    if (botData.hasOwnProperty(inputId) && botData[inputId] !== null) {
      input.value = botData[inputId];
    } else input.value = "";

    input.addEventListener("change", e => {
      const inputVal = { [e.target.id]: e.target.value };
      bodyColors = { ...bodyColors, ...inputVal };
    });
  });
}

avatar.addEventListener("click", e => {
  avatarInput?.click();
});
avatarInput.addEventListener("change", async e => {
  const file = e.target.files ? e.target.files[0] : null;

  const formData = new FormData();
  formData.append("file", file);
  uploadingText.textContent = "uploading...";

  const accessToken = localStorage.getItem("access-token");
  const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/upload_avatar/${bot_id}`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (res.status === 200) {
    const bot_avatar = data.data.public_url;
    await apiHandler({ bot_avatar });
    uploadingText.textContent = "Uploaded";
    uploaded.src = bot_avatar;
    setTimeout(() => {
      uploadingText.textContent = "";
    }, 3000);
  } else {
    uploadingText.style.color = "red";
    uploadingText.textContent = "Something went wrong. Please try again later";
  }
});

checkbox.addEventListener("change", async e => {
  const vs = e.target.checked;
  await apiHandler({ bot_visibility: vs });
});

update.addEventListener("submit", async e => {
  try {
    e.preventDefault();
    const btn = update.querySelector("button");
    const span = update.querySelector("span");
    const spinner = update.querySelector("#spinner");
    if (desc.value === "") {
      hideSpinner(span, spinner, btn);
      return (desc.style.border = "1px solid red");
    }
    if (botName.value === "") {
      hideSpinner(span, spinner, btn);
      return (botName.style.border = "1px solid red");
    }

    showSpinner(span, spinner, btn);
    await apiHandler({ bot_name: botName.value, bot_description: desc.value });
    simpleToast("Bot updated successfully");
    hideSpinner(span, spinner, btn);
  } catch (error) {
    simpleToastElement.style.backgroundColor = "red";
    simpleToast("Something went wrong. Please try again later.");
  }
});

configs.addEventListener("submit", async e => {
  try {
    e.preventDefault();
    const span = configs.querySelector("span");
    const btn = configs.querySelector("button");
    const spinner = configs.querySelector("#spinner");
    showSpinner(span, spinner, btn);
    await apiHandler(bodyColors);
    hideSpinner(span, spinner, btn);
    simpleToast("Bot updated successfully");
  } catch (error) {
    simpleToastElement.style.backgroundColor = "red";
    simpleToast("Something went wrong. Please try again later.");
  }
});

messageCtn.addEventListener("submit", async e => {
  try {
    e.preventDefault();
    const span = messageCtn.querySelector("span");
    const btn = messageCtn.querySelector("button");
    const spinner = messageCtn.querySelector("#spinner");
    showSpinner(span, spinner, btn);

    if (textarea.value === "") {
      hideSpinner(span, spinner, btn);
      return (textarea.style.border = "1px solid red");
    }
    await apiHandler({ intro_message: textarea.value });
    hideSpinner(span, spinner, btn);
    simpleToast("message updated successfully");
  } catch (error) {
    simpleToastElement.style.backgroundColor = "red";
    simpleToast("Something went wrong. Please try again later.");
  }
});
chatTest.addEventListener("click", e => {
  e.preventDefault();

  window.location.href = `chat-test.html?id=${bot_id}&name=${bot_name}`;
});

const apiHandler = async body => {
  const accessToken = localStorage.getItem("access-token");
  const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/bot/${bot_id}/update`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (res.status == 200) {
    const updtBot = { ...botData, ...body };

    window.localStorage.removeItem("bot");
    window.localStorage.setItem("bot", JSON.stringify(updtBot));
  }
};

function showSpinner(buttonText, spinner, btn) {
  buttonText.classList.add("hidden"); // Hide the button text
  spinner.classList.remove("hidden"); // Show the spinner
  btn.style.cursor = "not-allowed";
  btn.disabled = true;
}

function hideSpinner(buttonText, spinner, btn) {
  buttonText.classList.remove("hidden"); // Show the button text
  spinner.classList.add("hidden"); // Hide the spinner
  btn.style.cursor = "pointer";
  btn.disabled = false;
}
let position = "";
chatPosition.addEventListener("input", e => {
  position = e.target.value;
});
const copyCodeHandler = async () => {
  const codeToCopy = `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8" />
      <title>Chatbot</title>
      <link rel="stylesheet" href="style.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0" />
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: inherit;
        }
  
        .chatbot-toggler {
          position: fixed;
          bottom: 30px;
          ${position === "bottomRight" ? "right: 35px;" : "left: 35px;"} 
          outline: none;
          border: none;
          height: 50px;
          width: 50px;
          display: flex;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #334155;
          transition: all 0.2s ease;
        }
        body.show-chatbot .chatbot-toggler {
          transform: rotate(90deg);
        }
        .chatbot-toggler span {
          color: #fff;
          position: absolute;
        }
        .chatbot-toggler span:last-child,
        body.show-chatbot .chatbot-toggler span:first-child {
          opacity: 0;
        }
        body.show-chatbot .chatbot-toggler span:last-child {
          opacity: 1;
        }
        .chatbot {
          position: fixed;
          ${position === "bottomRight" ? "right: 35px;" : "left: 35px;"} 
          bottom: 90px;
          width: 420px;
          background: #fff;
          border-radius: 15px;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.5);
          transform-origin: bottom right;
          box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5);
          transition: all 0.1s ease;
        }
        
        body.show-chatbot .chatbot {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }
        .chatbot header {
          padding: 16px 0;
          position: relative;
          text-align: center;
          color: #fff;
          background: #334155;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .chatbot header span {
          position: absolute;
          right: 15px;
          top: 50%;
          display: none;
          cursor: pointer;
          transform: translateY(-50%);
        }
        header h2 {
          font-size: 1.4rem;
        }
        .chatbot .chatbox {
          overflow-y: auto;
          height: 510px;
          padding: 30px 20px 100px;
        }
        .chatbot :where(.chatbox, textarea)::-webkit-scrollbar {
          width: 6px;
        }
        .chatbot :where(.chatbox, textarea)::-webkit-scrollbar-track {
          background: #fff;
          border-radius: 25px;
        }
        .chatbot :where(.chatbox, textarea)::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 25px;
        }
        .chatbox .chat {
          display: flex;
          list-style: none;
        }
        .chatbox .outgoing {
          margin: 20px 0;
          justify-content: flex-end;
        }
        .chatbox .incoming span {
          width: 32px;
          height: 32px;
          color: #fff;
          cursor: default;
          text-align: center;
          line-height: 32px;
          align-self: flex-end;
          background: #334155;
          border-radius: 4px;
          margin: 0 10px 7px 0;
        }
        .chatbox .chat p {
          white-space: pre-wrap;
          padding: 12px 16px;
          border-radius: 10px 10px 0 10px;
          max-width: 75%;
          color: #fff;
          font-size: 0.95rem;
          background: #334155;
        }
        .chatbox .incoming p {
          border-radius: 10px 10px 10px 0;
        }
        .chatbox .chat p.error {
          color: #721c24;
          background: #f8d7da;
        }
        .chatbox .incoming p {
          color: #000;
          background: #f2f2f2;
        }
        .chatbot .chat-input {
          display: flex;
          gap: 5px;
          position: absolute;
          bottom: 0;
          width: 100%;
          background: #fff;
          padding: 3px 20px;
          border-top: 1px solid #ddd;
        }
        .chat-input textarea {
          height: 55px;
          width: 100%;
          border: none;
          outline: none;
          resize: none;
          max-height: 180px;
          padding: 15px 15px 15px 0;
          font-size: 0.95rem;
        }
        .chat-input span {
          align-self: flex-end;
          color: #334155;
          cursor: pointer;
          height: 55px;
          display: flex;
          align-items: center;
          visibility: hidden;
          font-size: 1.35rem;
        }
        .chat-input textarea:valid ~ span {
          visibility: visible;
        }
  
        @media (max-width: 490px) {
          .chatbot-toggler {
            right: 20px;
            bottom: 20px;
          }
          .chatbot {
            right: 0;
            bottom: 0;
            height: 100%;
            border-radius: 0;
            width: 100%;
          }
          .chatbot .chatbox {
            height: 90%;
            padding: 25px 15px 100px;
          }
          .chatbot .chat-input {
            padding: 5px 15px;
          }
          .chatbot header span {
            display: block;
          }
        }
      </style>
    </head>
    <body></body>
    <script>
      const body = document.querySelector("body");
      let userMessage = null; // Variable to store user's message
      let bot_id = "62";
      const config = id => {
        bot_id = id;
      };
      const checkConfig = () => {
        if (!bot_id) {
          throw new Error("No bot ID configured. Please call the config function with a valid bot ID.");
        }
      };
  
      async function loadChatBot() {
        checkConfig();
  
        const res = await fetch(\`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/bot/${bot_id}\`);
        const configs = await res.json();
  
        const {
          intro_message,
          bot_avatar,
          bot_visibility,
          background_color_input_bar,
          user_text_color,
          background_color,
          user_chat_color,
          text_color_input_bar,
          bot_text_color,
          bot_chat_color,
        } = configs.data;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = \`
    <button class="chatbot-toggler">
        <span class="material-symbols-rounded">mode_comment</span>
        <span class="material-symbols-outlined">close</span>
      </button>
      <div class="chatbot">
        <header style="">
        
          <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox" style="background-color:\${background_color}\ ">
          <li class="chat incoming">
          <div class="default">
            <span class=" material-symbols-outlined">smart_toy</span>
            <p style="background-color:\${bot_chat_color}\;color:\${bot_text_color}\;">\${
          intro_message ? intro_message\ : "Hi there 👋<br>How can I help you today?"
        }</p>
            </div>
          </li>
        </ul>
        <div class="chat-input" style="background-color:\${background_color_input_bar}\" >
          <textarea style="background-color:\${background_color_input_bar}\;color: \${text_color_input_bar}\ ;overflow:hidden;" placeholder="Enter a message..." spellcheck="false" required back ></textarea>
          <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
      </div>
    \`;
        if (bot_visibility) body.appendChild(tempDiv);
        if (bot_avatar) {
          tempDiv.querySelector(".default").style.display = "none";
          const img = document.createElement("img");
          img.src = bot_avatar;
          img.alt = "avatar image";
          img.style.width = "2rem";
          img.style.height = "2rem";
          tempDiv.querySelector(".incoming").appendChild(img);
          const pEl = document.createElement("p");
          pEl.textContent =\`\${intro_message ? intro_message : "Hi there 👋<br>How can I help you today?"}\`;
          tempDiv.querySelector(".incoming").append(pEl);
        }
  
        const chatbotToggler = tempDiv.querySelector(".chatbot-toggler");
        const closeBtn = tempDiv.querySelector(".close-btn");
        const chatbox = tempDiv.querySelector(".chatbox");
        const chatInput = tempDiv.querySelector(".chat-input textarea");
        const sendChatBtn = tempDiv.querySelector(".chat-input span");
        const inputInitHeight = chatInput.scrollHeight;
  
        const generateChatContent = (message, className, bot_avatar) => {
          let chatContent = {};
          chatContent.className = className;
          chatContent.message = message;
          chatContent.avatarElement =
            className === "outgoing"
              ? null
              : bot_avatar
              ? \`<img src=\${bot_avatar} style="width:2rem;height:2rem;" />\`
              : \`<span class="material-symbols-outlined">smart_toy</span>\`;
  
          return chatContent;
        };
  
        const createChatLiElement = chatContent => {
          const { className, message, avatarElement } = chatContent;
          // Create the <li> element
          const chatLi = document.createElement("li");
          chatLi.classList.add("chat", className);
          // Add chat content
          let combinedContent = avatarElement ? \`\${avatarElement}<p></p>\` : \`<p></p>\`;
          chatLi.innerHTML = combinedContent;
          // Add the message text
          const p = chatLi.querySelector("p");
          p.textContent = message;
          p.style.color = user_text_color;
          p.style.backgroundColor = user_chat_color;
          return chatLi;
        };
        const createChatLi = (message, className) => {
          const chatContent = generateChatContent(message, className, bot_avatar);
          const chatLiElement = createChatLiElement(chatContent);
          return chatLiElement;
        };
  
        const similaritySearch = async text => {
          try {
            const res = await fetch(\`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/chatbot_response/${bot_id}\`, {
              method: "POST",
              body: JSON.stringify({ query_text: text }),
              headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
          return data.response;
          } catch (error) {
            throw new Error("Oops! Something went wrong. Please try again.");
          }
        };
  
        const generateResponse = chatElement => {
          const messageElement = chatElement.querySelector("p");
          const API_URL = "https://api.openai.com/v1/chat/completions";
          similaritySearch(userMessage)
          .then(result => {
            // Define the properties and message for the API request
            messageElement.textContent = result;
          })
          .catch(e => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
          })
          .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
      };  
        const handleChat = () => {
          userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
          if (!userMessage) return;
  
          // Clear the input textarea and set its height to default
          chatInput.value = "";
          chatInput.style.height = \`\${inputInitHeight}px\`;
  
          // Append the user's message to the chatbox
          chatbox.appendChild(createChatLi(userMessage, "outgoing"));
          chatbox.scrollTo(0, chatbox.scrollHeight);
  
          setTimeout(() => {
            // Display "Thinking..." message while waiting for the response
            const incomingChatLi = createChatLi("Thinking...", "incoming");
  
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
          }, 600);
        };
  
        chatInput.addEventListener("input", () => {
          // Adjust the height of the input textarea based on its content
          chatInput.style.height = \`\${inputInitHeight}px\`;
          chatInput.style.height = \`\${chatInput.scrollHeight}px\`;
        });
  
        chatInput.addEventListener("keydown", e => {
          // If Enter key is pressed without Shift key and the window
          // width is greater than 800px, handle the chat
          if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
          }
        });
  
        sendChatBtn.addEventListener("click", handleChat);
        closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
        chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
      }
  
      // Load the chat bot when the page has finished loading
      window.addEventListener("load", loadChatBot);
    </script>
  </html>  
  `;

  try {
    await navigator.clipboard.writeText(codeToCopy);
    copyCode.textContent = "Copied!!!";
  } catch (err) {
    console.error("Failed to copy code: ", err);
  }
};

copyCode.addEventListener("click", copyCodeHandler);
