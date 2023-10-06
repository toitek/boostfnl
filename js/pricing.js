const plus = document.querySelector(".plus");
const pro = document.querySelector(".pro");
const getStarted = document.querySelector(".get-started");

pro.addEventListener("click", e => paymnetHandler("Pro"));
plus.addEventListener("click", e => paymnetHandler("Plus"));
var stripe = Stripe("pk_test_xAuAyau8n2sb11qojxSYHGPz00pPp8CmjX");
const paymnetHandler = async plan => {
  const accessToken = localStorage.getItem("access-token");
  if (accessToken) {
    const res = await fetch(`https://boosting-ai-new-backend-gennarocuofano.replit.app/api/create-checkout-session/${plan}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      redirect: "manual",
    });
    const resData = await res.json();
    console.log("=============res data=======================");
    console.log(resData);
    if (res.ok) {
      const res = await stripe.redirectToCheckout({ sessionId: resData.session_id });
      const data = await res.json();
    }
  } else window.location.href = "/signin.html";
};

getStarted.addEventListener("click", e => {
  e.preventDefault();
  const accessToken = localStorage.getItem("access-token");
  console.log(accessToken);
  if (accessToken) window.location.href = "/control_panel.html";
  else window.location.href = "/signin.html";
});
