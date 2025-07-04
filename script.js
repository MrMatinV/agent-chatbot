
// script.js
const WEBHOOK_URL = 'https://jalvanaghagent.app.n8n.cloud/webhook-test/a6fe9bf9-3c16-4972-a55c-9484e817ed0b'; // اینجا URL وب‌هوک n8n خودتون رو قرار بدید

async function sendMessageToBot(message) {
    // نمایش پیام کاربر در چت‌باکس
    appendMessage(message, 'user-message');

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message }) // پیام کاربر رو به صورت JSON ارسال می‌کنیم
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // پاسخ از n8n رو دریافت می‌کنیم

        // نمایش پاسخ ربات در چت‌باکس
        appendMessage(data.response, 'bot-message'); // فرض می‌کنیم n8n پاسخ رو در فیلد 'response' برمی‌گردونه

    } catch (error) {
        console.error('Error sending message to bot:', error);
        appendMessage('متاسفانه در حال حاضر امکان پاسخگویی وجود ندارد. لطفاً بعداً تلاش کنید.', 'bot-message error');
    }
}

// بقیه کدهای چت‌باکس شما (مثل appendMessage و event listeners)
// ...
