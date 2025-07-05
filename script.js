async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  const messages = document.getElementById("messages");
  messages.innerHTML += `<div class="message user">👤 شما: ${text}</div>`;
  input.value = "";
  input.disabled = true;

  try {
    const response = await fetch("https://jalvanaghagent.app.n8n.cloud/webhook-test/5721d2a3-68d0-4626-9678-e50aafba3eca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    const reply = data.responseText || data.text || "پاسخی دریافت نشد.";

    messages.innerHTML += `<div class="message agent">⚖️ مشاور: ${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;

  } catch (err) {
    messages.innerHTML += `<div class="message agent">❌ خطا در اتصال به مشاور. لطفاً دوباره تلاش کنید.</div>`;
  }

  input.disabled = false;
  input.focus();
}
