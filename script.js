const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(text, className) {
  const message = document.createElement("div");
  message.className = `message ${className}`;
  message.innerText = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage(`👤 شما: ${text}`, "user-message");
  chatInput.value = "";
  chatInput.disabled = true;
  sendButton.disabled = true;

  try {
    const response = await fetch("https://jalvanaghagent.app.n8n.cloud/webhook-test/5721d2a3-68d0-4626-9678-e50aafba3eca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    const reply = data.responseText || data.text || "پاسخی دریافت نشد.";
    appendMessage(`⚖️ ${reply}`, "ai-message");

  } catch (err) {
    appendMessage("❌ خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.", "ai-message");
  }

  chatInput.disabled = false;
  sendButton.disabled = false;
  chatInput.focus();
}
