window.addEventListener("DOMContentLoaded", async () => {
  const botList = document.querySelector(".bot-list");
  const cancelSubscrption = document.querySelector(".cancel-subscrption");
  const botNumber = document.querySelector(".bot-number");

  const botsHandler = () => {
    const bots = JSON.parse(window.localStorage.getItem("bots"));
    botList.innerHTML = ``;
    botNumber.textContent = bots.length;
    bots.map((b, index) => {
      const botElement = document.createElement("div");
      botElement.classList.add("bot-item");
      botElement.innerHTML = `
      <div
      style="background-color:#fff; margin:0rem .5rem; border:1px solid #ccc;"
      class="relative mx-auto flex max-w-md flex-col items-center justify-center px-8 py-12 sm:mx-0 sm:max-w-none sm:after:absolute sm:after:right-0 sm:after:h-5/6 sm:after:w-px sm:after:bg-gray-secondary-400/60 sm:after:content-[''] xl:px-12 xl:py-16"
    >
      <div class="w-full flex " style="position: relative; justify-content:flex-end;">
        <span class="vertical-dots" style="cursor: pointer; font-size: 18px">&#8942;</span>
        <div
          class="icons-container p-2"
          style="position: absolute; top: 100%; z-index: 9999; background-color: #fff; border: 1px solid #ccc; display: none; flex-direction: column"
        >
          <div class="edit-icon icon-btn"style="cursor: pointer;margin:.5rem 0rem;">Edit</div>
          <div class="delete-icon icon-btn" style="cursor: pointer">Delete</div>
        </div>
      </div>

      <div class="flex flex-1 flex-col items-center">
        <h3 class="mt-8 text-center text-3xl font-semibold leading-tighter text-slate-900 sm:mt-12">${b.bot_name}</h3>
        <p class="mt-5 text-center leading-relaxed text-slate-600 sm:mt-6">${b.bot_description}</p>
        <input type="text" name="botId" id="botId" value="${b.bot_id}" hidden />
      </div>
    </div>`;
      botList.appendChild(botElement);
      const botActions = botElement.querySelector(".icons-container");
      const span = botElement.querySelector(".vertical-dots");
      span.addEventListener("click", e => {
        e.preventDefault();
        botActions.style.display = "block";
      });
      document.addEventListener("click", e => {
        if (!botActions.contains(e.target) && e.target !== span) {
          botActions.style.display = "none";
        }
      });
      botElement.querySelector(".edit-icon").addEventListener("click", e => {
        e.preventDefault();
        const botValue = botElement.querySelector("#botId").value;
        const foundBot = bots.find(b => b.bot_id == botValue);

        window.localStorage.setItem("bot", JSON.stringify(foundBot));
        window.location.href = "/settings.html";
      });
      botElement.querySelector(".delete-icon").addEventListener("click", async e => {
        try {
          e.preventDefault();
          simpleToast("Deleting...");
          const botValue = botElement.querySelector("#botId").value;
          const accessToken = localStorage.getItem("access-token");
          const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/delete/bots/${botValue}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          });
          await res.json();
          if (res.ok) {
            const botArry = [...bots];
            const updtBots = botArry.filter(b => b.bot_id != botValue);
            console.log("============UPDATES==========");
            console.log(updtBots);
            window.localStorage.removeItem("bots");
            window.localStorage.setItem("bots", JSON.stringify(updtBots));
            botsHandler();
          }
          simpleToast("Deleted");
        } catch (error) {
          console.log("==============ERROR================");
          console.log(error);
          simpleToast("Something went wrong. Please try again later.");

          simpleToastElement.style.background = "red";
        }
      });
    });
  };

  cancelSubscrption.addEventListener("click", async e => {
    try {
      e.preventDefault();
      simpleToast("Canceling subscription...");
      const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/cancel-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      await res.json();
      if (res.ok) simpleToast("subscription canceled. Please add a new subscription plan to continue enjoying our advanced features");
      else {
        simpleToast("Something went wrong. Pleas try again.");
        simpleToastElement.style.background = "red";
      }
    } catch (error) {
      console.log("-------------------------------------error--------------------");
      console.log(error);
      simpleToast("Something went wrong. Pleas try again.");
      simpleToastElement.style.background = "red";
    }
  });

  const accessToken = localStorage.getItem("access-token");
  const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/user/bots`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const bots = await res.json();
  if (res.status === 200) {
    window.localStorage.setItem("bots", JSON.stringify(bots.data));
    botsHandler();
  }
});
